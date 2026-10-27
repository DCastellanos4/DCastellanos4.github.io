/**
 * Test Utilities and Static/DOM Analysis Framework
 * Pure Node.js standard library - Zero external dependencies.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Resolves a path relative to repository root.
 */
function resolvePath(...segments) {
  return path.join(ROOT_DIR, ...segments);
}

/**
 * Checks if a relative file path exists.
 */
function fileExists(relPath) {
  try {
    return fs.existsSync(resolvePath(relPath));
  } catch (e) {
    return false;
  }
}

/**
 * Reads a text file relative to repository root.
 */
function readFile(relPath) {
  const fullPath = resolvePath(relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relPath} (resolved: ${fullPath})`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Reads binary header bytes of a file.
 */
function readHeaderBytes(relPath, byteCount = 16) {
  const fullPath = resolvePath(relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found for binary inspection: ${relPath}`);
  }
  const fd = fs.openSync(fullPath, 'r');
  const buffer = Buffer.alloc(byteCount);
  const bytesRead = fs.readSync(fd, buffer, 0, byteCount, 0);
  fs.closeSync(fd);
  return buffer.subarray(0, bytesRead);
}

/**
 * Lightweight HTML element parser
 */
class ElementNode {
  constructor(tagName, attributes = {}, raw = '') {
    this.tagName = (tagName || '').toLowerCase();
    this.attributes = attributes;
    this.children = [];
    this.parent = null;
    this.textContent = '';
    this.raw = raw;
  }

  getAttribute(name) {
    return this.attributes[name.toLowerCase()] ?? null;
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name.toLowerCase());
  }

  get id() {
    return this.getAttribute('id');
  }

  get className() {
    return this.getAttribute('class') || '';
  }

  classList() {
    const cls = this.className.trim();
    return cls ? cls.split(/\s+/) : [];
  }

  hasClass(cls) {
    return this.classList().includes(cls);
  }

  querySelector(selector) {
    const results = this.querySelectorAll(selector);
    return results.length > 0 ? results[0] : null;
  }

  querySelectorAll(selector) {
    const results = [];
    const normalized = selector.trim();

    const matches = (node) => {
      if (normalized.startsWith('#')) {
        return node.id === normalized.slice(1);
      }
      if (normalized.startsWith('.')) {
        return node.hasClass(normalized.slice(1));
      }
      if (normalized.startsWith('[') && normalized.endsWith(']')) {
        const inner = normalized.slice(1, -1);
        if (inner.includes('=')) {
          const [attr, val] = inner.split('=').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
          return node.getAttribute(attr) === val;
        }
        return node.hasAttribute(inner);
      }
      return node.tagName === normalized.toLowerCase();
    };

    const traverse = (node) => {
      if (matches(node)) {
        results.push(node);
      }
      for (const child of node.children) {
        traverse(child);
      }
    };

    for (const child of this.children) {
      traverse(child);
    }
    return results;
  }
}

/**
 * Parses an HTML string into an ElementNode tree.
 */
function parseHTML(htmlString) {
  const root = new ElementNode('root');
  let current = root;
  const tagRegex = /<(\/)?([a-zA-Z0-9\-]+)([^>]*?)(\/)?>|([^<]+)/gs;
  let match;

  const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  while ((match = tagRegex.exec(htmlString)) !== null) {
    const isClosing = Boolean(match[1]);
    const tagName = match[2];
    const attrString = match[3];
    const isSelfClosing = Boolean(match[4]);
    const textData = match[5];

    if (textData) {
      const trimmed = textData;
      if (current) {
        current.textContent += trimmed;
      }
      continue;
    }

    if (!tagName) continue;
    const lowerTag = tagName.toLowerCase();

    if (isClosing) {
      if (current.parent && current.tagName === lowerTag) {
        current = current.parent;
      } else {
        // Find ancestor with matching tag
        let ancestor = current.parent;
        while (ancestor && ancestor.tagName !== lowerTag) {
          ancestor = ancestor.parent;
        }
        if (ancestor && ancestor.parent) {
          current = ancestor.parent;
        }
      }
      continue;
    }

    // Parse attributes
    const attrs = {};
    if (attrString) {
      const attrRegex = /([a-zA-Z0-9_\-:@.]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attrString)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
        attrs[attrName] = attrVal;
      }
    }

    const node = new ElementNode(lowerTag, attrs, match[0]);
    node.parent = current;
    current.children.push(node);

    if (!VOID_ELEMENTS.has(lowerTag) && !isSelfClosing) {
      current = node;
    }
  }

  return {
    root,
    querySelector: (sel) => root.querySelector(sel),
    querySelectorAll: (sel) => root.querySelectorAll(sel),
    get title() {
      const titleTag = root.querySelector('title');
      return titleTag ? titleTag.textContent.trim() : '';
    },
    raw: htmlString
  };
}

/**
 * Lightweight CSS Parser extracting rules, selectors, and custom properties
 */
function parseCSS(cssString) {
  // Strip comments
  const cleanCSS = cssString.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  const customProperties = {};
  const mediaQueries = [];

  // Match media queries
  const mediaRegex = /@media\s*([^{]+)\{([\s\S]*?\})\s*\}/g;
  let mediaMatch;
  while ((mediaMatch = mediaRegex.exec(cleanCSS)) !== null) {
    mediaQueries.push({
      condition: mediaMatch[1].trim(),
      body: mediaMatch[2]
    });
  }

  // Match standard CSS rules
  const ruleRegex = /([^{}@]+)\{([^}]+)\}/g;
  let match;
  while ((match = ruleRegex.exec(cleanCSS)) !== null) {
    const selectors = match[1].split(',').map(s => s.trim());
    const declBody = match[2].trim();
    const declarations = {};

    declBody.split(';').forEach(decl => {
      const idx = decl.indexOf(':');
      if (idx > -1) {
        const prop = decl.slice(0, idx).trim().toLowerCase();
        const val = decl.slice(idx + 1).trim();
        declarations[prop] = val;
        if (prop.startsWith('--')) {
          customProperties[prop] = val;
        }
      }
    });

    rules.push({ selectors, declarations });
  }

  return {
    raw: cssString,
    rules,
    customProperties,
    mediaQueries,
    hasSelector: (sel) => rules.some(r => r.selectors.some(s => s.includes(sel))),
    getProperty: (sel, prop) => {
      const found = rules.filter(r => r.selectors.some(s => s === sel || s.includes(sel)));
      for (const f of found) {
        if (f.declarations[prop.toLowerCase()]) {
          return f.declarations[prop.toLowerCase()];
        }
      }
      return null;
    }
  };
}

/**
 * Creates a mocked browser sandbox environment for client script execution
 */
function createMockDOM(htmlContent = '') {
  const events = {};
  const elements = new Map();
  const classes = new Map();

  const windowListeners = {};
  const docListeners = {};

  const makeMockElement = (tag, id = null, cls = '') => {
    const el = {
      tagName: tag.toUpperCase(),
      id: id || '',
      className: cls || '',
      classList: {
        _classes: new Set(cls ? cls.split(/\s+/) : []),
        add(c) { this._classes.add(c); el.className = Array.from(this._classes).join(' '); },
        remove(c) { this._classes.delete(c); el.className = Array.from(this._classes).join(' '); },
        contains(c) { return this._classes.has(c); },
        toggle(c) { if (this.contains(c)) { this.remove(c); return false; } else { this.add(c); return true; } }
      },
      style: {},
      attributes: {},
      listeners: {},
      innerHTML: '',
      textContent: '',
      value: '',
      setAttribute(k, v) { this.attributes[k] = String(v); },
      getAttribute(k) { return this.attributes[k] ?? null; },
      hasAttribute(k) { return k in this.attributes; },
      addEventListener(evt, fn) {
        this.listeners[evt] = this.listeners[evt] || [];
        this.listeners[evt].push(fn);
      },
      dispatchEvent(evt) {
        const type = typeof evt === 'string' ? evt : evt.type;
        const list = this.listeners[type] || [];
        for (const handler of list) {
          handler(evt);
        }
      },
      click() {
        this.dispatchEvent({ type: 'click', preventDefault() {}, stopPropagation() {} });
      },
      focus() {},
      blur() {},
      scrollIntoView() {},
      getBoundingClientRect() {
        return { top: 0, left: 0, width: 100, height: 48, bottom: 48, right: 100 };
      }
    };
    return el;
  };

  const document = {
    readyState: 'complete',
    documentElement: {
      scrollWidth: 1200,
      clientWidth: 1200,
      scrollTop: 0,
      style: {}
    },
    body: makeMockElement('body'),
    getElementById: (id) => {
      if (!elements.has(id)) {
        elements.set(id, makeMockElement('div', id));
      }
      return elements.get(id);
    },
    querySelector: (sel) => {
      if (sel.startsWith('#')) return document.getElementById(sel.slice(1));
      return makeMockElement(sel.replace(/[^a-zA-Z0-9]/g, '') || 'div');
    },
    querySelectorAll: (sel) => [document.querySelector(sel)],
    createElement: (tag) => makeMockElement(tag),
    addEventListener: (evt, fn) => {
      docListeners[evt] = docListeners[evt] || [];
      docListeners[evt].push(fn);
    },
    removeEventListener: () => {},
    dispatchEvent: (evt) => {
      const type = typeof evt === 'string' ? evt : evt.type;
      (docListeners[type] || []).forEach(fn => fn(evt));
    }
  };

  const clipboard = {
    writtenText: null,
    writeText: async (text) => {
      clipboard.writtenText = text;
      return Promise.resolve();
    }
  };

  const window = {
    document,
    navigator: {
      clipboard,
      userAgent: 'Node.js Test Runner'
    },
    innerWidth: 1200,
    innerHeight: 800,
    scrollY: 0,
    scrollTo: (options) => {
      if (typeof options === 'object' && options.top !== undefined) {
        window.scrollY = options.top;
      }
    },
    addEventListener: (evt, fn) => {
      windowListeners[evt] = windowListeners[evt] || [];
      windowListeners[evt].push(fn);
    },
    removeEventListener: () => {},
    dispatchEvent: (evt) => {
      const type = typeof evt === 'string' ? evt : evt.type;
      (windowListeners[type] || []).forEach(fn => fn(evt));
    },
    location: {
      href: 'http://localhost/previews/preview-1/index.html'
    },
    IntersectionObserver: class {
      constructor(cb) { this.cb = cb; }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };

  return { window, document, clipboard, windowListeners, docListeners };
}

/**
 * Test Runner Class to collect and execute assertions
 */
class TestRunner {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.skipped = 0;
    this.failed = 0;
    this.errors = [];
    this.startTime = 0;
    this.endTime = 0;
  }

  test(description, fn) {
    this.tests.push({ description, fn });
  }

  skip(description, reason = 'Pending implementation') {
    this.tests.push({ description, fn: () => ({ skipped: true, reason }) });
  }

  async run(options = {}) {
    this.startTime = Date.now();
    const filter = options.filter ? new RegExp(options.filter, 'i') : null;
    const verbose = Boolean(options.verbose);

    for (let i = 0; i < this.tests.length; i++) {
      const t = this.tests[i];
      if (filter && !filter.test(t.description)) {
        continue;
      }

      try {
        const result = t.fn();
        let resVal = result;
        if (result && typeof result.then === 'function') {
          resVal = await result;
        }

        if (resVal && resVal.skipped) {
          this.skipped++;
          if (verbose) {
            console.log(`  - [SKIP] [${i + 1}/${this.tests.length}] ${t.description} (${resVal.reason || 'Skipped'})`);
          }
          continue;
        }

        this.passed++;
        if (verbose) {
          console.log(`  ✓ [${i + 1}/${this.tests.length}] ${t.description}`);
        }
      } catch (err) {
        this.failed++;
        this.errors.push({ description: t.description, error: err });
        console.error(`  ✗ [${i + 1}/${this.tests.length}] ${t.description}`);
        console.error(`    ${err.message}`);
        if (err.stack && verbose) {
          console.error(err.stack.split('\n').slice(1, 4).join('\n'));
        }
      }
    }
    this.endTime = Date.now();
    return {
      name: this.name,
      total: this.tests.length,
      passed: this.passed,
      skipped: this.skipped,
      failed: this.failed,
      duration: this.endTime - this.startTime,
      errors: this.errors
    };
  }
}

/**
 * Checks milestone file presence, providing progressive testability
 */
function checkMilestone(relPath, milestoneName = 'TBD') {
  if (!fileExists(relPath)) {
    if (process.env.STRICT_ALL === '1') {
      assert.fail(`Strict verification failure: ${relPath} (Milestone ${milestoneName}) must exist`);
    }
    return { skipped: true, reason: `Pending Milestone ${milestoneName}: ${relPath} not yet created on disk` };
  }
  return null;
}

module.exports = {
  ROOT_DIR,
  resolvePath,
  fileExists,
  readFile,
  readHeaderBytes,
  parseHTML,
  parseCSS,
  createMockDOM,
  checkMilestone,
  TestRunner
};
