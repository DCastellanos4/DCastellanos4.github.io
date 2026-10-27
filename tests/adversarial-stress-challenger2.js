/**
 * ADVERSARIAL INTERACTION & STATE STRESS TESTING HARNESS
 * Challenger 2 (Empirical Interaction & State Challenger)
 * 
 * Deep Stress Testing Across 5 Domains:
 * 1. Rapid Clipboard Clicking & Debounce / Timer Restoration
 * 2. Terminal Command Runner Fuzzing & Concurrency (Variant 3)
 * 3. Skills Matrix Category Filtering State Transitions
 * 4. Drawer / Modal Toggles and Mobile Navigation Resize Transitions
 * 5. Offline file:// Security & Zero-Trust Architecture
 * 
 * Zero external dependencies. Pure Node.js standard libraries.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

function resolvePath(...segments) {
  return path.join(ROOT_DIR, ...segments);
}

function readFile(relPath) {
  return fs.readFileSync(resolvePath(relPath), 'utf8');
}

/**
 * High-fidelity Mock DOM Element
 */
class MockElement {
  constructor(tagName = 'DIV', id = '', className = '', docRef = null) {
    this.tagName = tagName.toUpperCase();
    this._id = id;
    this.className = className;
    this.attributes = {};
    this.docRef = docRef;
    if (id) {
      this.attributes['id'] = id;
      if (docRef && docRef.idMap) docRef.idMap.set(id, this);
    }
    if (className) this.attributes['class'] = className;

    const self = this;
    this._classes = new Set(className ? className.trim().split(/\s+/) : []);
    this.classList = {
      add(c) { self._classes.add(c); self._syncClass(); },
      remove(c) { self._classes.delete(c); self._syncClass(); },
      contains(c) { return self._classes.has(c); },
      toggle(c) {
        if (self._classes.has(c)) {
          self._classes.delete(c);
          self._syncClass();
          return false;
        } else {
          self._classes.add(c);
          self._syncClass();
          return true;
        }
      }
    };

    this.style = {};
    this.listeners = {};
    this.children = [];
    this.parent = null;
    this._innerHTML = '';
    this._textContent = '';
    this.value = '';
    this.hidden = false;
    this.scrollTop = 0;
    this.scrollHeight = 1000;
  }

  get id() {
    return this._id;
  }

  set id(val) {
    this._id = String(val);
    this.attributes['id'] = String(val);
    if (this.docRef && this.docRef.idMap) {
      this.docRef.idMap.set(this._id, this);
    }
  }

  _syncClass() {
    this.className = Array.from(this._classes).join(' ');
    this.attributes['class'] = this.className;
  }

  get textContent() {
    if (this.children.length > 0) {
      return this.children.map(c => c.textContent).join(' ');
    }
    return this._textContent;
  }

  set textContent(val) {
    this._textContent = String(val);
    this._innerHTML = String(val);
    this.children = [];
  }

  get innerHTML() {
    if (this.children.length > 0) {
      return this.children.map(c => c.outerHTML).join('');
    }
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = String(val);
    this._textContent = String(val).replace(/<[^>]*>/g, '');
    this.children = [];
  }

  get outerHTML() {
    if (this.children.length > 0) {
      return `<${this.tagName.toLowerCase()} class="${this.className}" id="${this.id}">${this.innerHTML}</${this.tagName.toLowerCase()}>`;
    }
    return `<${this.tagName.toLowerCase()} class="${this.className}" id="${this.id}">${this._innerHTML}</${this.tagName.toLowerCase()}>`;
  }

  setAttribute(name, val) {
    const k = name.toLowerCase();
    this.attributes[k] = String(val);
    if (k === 'id') {
      this.id = String(val);
    }
    if (k === 'class') {
      this.className = String(val);
      this._classes = new Set(this.className.trim().split(/\s+/));
    }
    if (k === 'hidden') this.hidden = true;
  }

  getAttribute(name) {
    const k = name.toLowerCase();
    return this.attributes[k] !== undefined ? this.attributes[k] : null;
  }

  hasAttribute(name) {
    return this.attributes[name.toLowerCase()] !== undefined;
  }

  removeAttribute(name) {
    const k = name.toLowerCase();
    delete this.attributes[k];
    if (k === 'hidden') this.hidden = false;
  }

  appendChild(child) {
    child.parent = this;
    if (this.docRef && !child.docRef) {
      child.docRef = this.docRef;
      if (child.id) this.docRef.idMap.set(child.id, child);
    }
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parent = null;
    }
    return child;
  }

  addEventListener(type, fn) {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(fn);
  }

  dispatchEvent(evt) {
    const type = typeof evt === 'string' ? evt : evt.type;
    const handlers = this.listeners[type] || [];
    for (const h of handlers) {
      h(evt);
    }
  }

  click() {
    let defaultPrevented = false;
    let propagationStopped = false;
    const evt = {
      type: 'click',
      target: this,
      currentTarget: this,
      preventDefault: () => { defaultPrevented = true; },
      stopPropagation: () => { propagationStopped = true; },
      get defaultPrevented() { return defaultPrevented; }
    };
    this.dispatchEvent(evt);
    return !defaultPrevented;
  }

  focus() {}
  blur() {}
  select() {}
  scrollIntoView() {}

  getBoundingClientRect() {
    return { top: 10, left: 10, width: 200, height: 50, bottom: 60, right: 210 };
  }

  contains(other) {
    if (!other) return false;
    if (other === this) return true;
    let cur = other.parent;
    while (cur) {
      if (cur === this) return true;
      cur = cur.parent;
    }
    return false;
  }

  closest(selector) {
    let cur = this;
    while (cur) {
      if (matchesSimple(cur, selector)) {
        return cur;
      }
      cur = cur.parent;
    }
    return null;
  }

  querySelector(sel) {
    const res = this.querySelectorAll(sel);
    return res.length > 0 ? res[0] : null;
  }

  querySelectorAll(selector) {
    const results = [];
    const commaParts = selector.split(',').map(s => s.trim());

    for (const singleSel of commaParts) {
      const tokens = singleSel.split(/\s+/).filter(Boolean);
      
      const checkDescendant = (node) => {
        const leafToken = tokens[tokens.length - 1];
        if (matchesSimple(node, leafToken)) {
          let curAncestor = node.parent;
          let matchedTokens = true;
          for (let i = tokens.length - 2; i >= 0; i--) {
            const ancestorToken = tokens[i];
            let found = false;
            while (curAncestor) {
              if (matchesSimple(curAncestor, ancestorToken)) {
                found = true;
                curAncestor = curAncestor.parent;
                break;
              }
              curAncestor = curAncestor.parent;
            }
            if (!found) {
              matchedTokens = false;
              break;
            }
          }
          if (matchedTokens && !results.includes(node)) {
            results.push(node);
          }
        }
        for (const ch of node.children) {
          checkDescendant(ch);
        }
      };

      for (const ch of this.children) {
        checkDescendant(ch);
      }
    }

    return results;
  }
}

function matchesSimple(node, sel) {
  if (!node || !sel) return false;
  sel = sel.trim();
  if (sel.startsWith('#')) {
    return node.id === sel.slice(1);
  }
  if (sel.startsWith('.')) {
    const classes = sel.slice(1).split('.');
    return classes.every(c => node.classList.contains(c));
  }
  if (sel.startsWith('[') && sel.endsWith(']')) {
    const inner = sel.slice(1, -1);
    if (inner.includes('^=')) {
      const [attr, val] = inner.split('^=').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      const a = node.getAttribute(attr);
      return a !== null && a.startsWith(val);
    }
    if (inner.includes('=')) {
      const [attr, val] = inner.split('=').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      return node.getAttribute(attr) === val;
    }
    return node.hasAttribute(inner);
  }
  if (sel.includes('.')) {
    const idx = sel.indexOf('.');
    const tag = sel.slice(0, idx);
    const cls = sel.slice(idx);
    return (!tag || node.tagName.toLowerCase() === tag.toLowerCase()) && matchesSimple(node, cls);
  }
  if (sel.includes('[')) {
    const idx = sel.indexOf('[');
    const tag = sel.slice(0, idx);
    const attrSel = sel.slice(idx);
    return (!tag || node.tagName.toLowerCase() === tag.toLowerCase()) && matchesSimple(node, attrSel);
  }
  return node.tagName.toLowerCase() === sel.toLowerCase();
}

/**
 * Builds mock DOM tree from HTML string with proper hierarchical nesting
 */
function buildMockDOMFromHTML(htmlString) {
  const allElements = [];
  const idMap = new Map();

  const docListeners = {};
  const windowListeners = {};

  const doc = {
    readyState: 'loading',
    idMap,
    createElement: (tag) => {
      const el = new MockElement(tag, '', '', doc);
      allElements.push(el);
      return el;
    },
    getElementById: (id) => idMap.get(id) || null,
    querySelector: (sel) => doc.documentElement.querySelector(sel),
    querySelectorAll: (sel) => doc.documentElement.querySelectorAll(sel),
    getElementsByTagName: (tag) => {
      if (tag === '*') return allElements;
      return allElements.filter(e => e.tagName.toLowerCase() === tag.toLowerCase());
    },
    addEventListener: (type, fn) => {
      docListeners[type] = docListeners[type] || [];
      docListeners[type].push(fn);
    },
    dispatchEvent: (evt) => {
      const type = typeof evt === 'string' ? evt : evt.type;
      const handlers = docListeners[type] || [];
      for (const h of handlers) h(evt);
    },
    execCommand: (cmd) => {
      if (cmd === 'copy') {
        doc.execCommandHistory.push('copy');
        return true;
      }
      return false;
    },
    execCommandHistory: []
  };

  doc.documentElement = new MockElement('HTML', '', '', doc);
  doc.body = new MockElement('BODY', '', '', doc);
  doc.documentElement.appendChild(doc.body);
  allElements.push(doc.documentElement);
  allElements.push(doc.body);

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  let currentParent = doc.body;
  const stack = [doc.body];

  const tagRegex = /<(\/)?([a-zA-Z0-9\-]+)([^>]*?)(\/)?>/g;
  let match;
  while ((match = tagRegex.exec(htmlString)) !== null) {
    const isClosing = Boolean(match[1]);
    const tagName = match[2].toLowerCase();
    const attrStr = match[3];
    const isSelfClosing = Boolean(match[4]);

    if (tagName.startsWith('!') || tagName === '!doctype') continue;

    if (isClosing) {
      if (stack.length > 1 && currentParent.tagName.toLowerCase() === tagName) {
        stack.pop();
        currentParent = stack[stack.length - 1];
      } else {
        // Find ancestor with matching tag
        let ancestorIdx = stack.length - 1;
        while (ancestorIdx > 0 && stack[ancestorIdx].tagName.toLowerCase() !== tagName) {
          ancestorIdx--;
        }
        if (ancestorIdx > 0) {
          while (stack.length > ancestorIdx) {
            stack.pop();
          }
          currentParent = stack[stack.length - 1];
        }
      }
      continue;
    }

    const el = new MockElement(tagName, '', '', doc);
    allElements.push(el);

    const attrRegex = /([a-zA-Z0-9_\-:@.]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let attrM;
    while ((attrM = attrRegex.exec(attrStr)) !== null) {
      const name = attrM[1];
      const val = attrM[2] !== undefined ? attrM[2] : (attrM[3] !== undefined ? attrM[3] : (attrM[4] !== undefined ? attrM[4] : ''));
      el.setAttribute(name, val);
      if (name.toLowerCase() === 'id' && val) {
        idMap.set(val, el);
      }
    }

    currentParent.appendChild(el);

    if (!voidTags.has(tagName) && !isSelfClosing) {
      stack.push(el);
      currentParent = el;
    }
  }

  const clipboard = {
    writtenText: null,
    writeHistory: [],
    writeText: async (text) => {
      clipboard.writtenText = text;
      clipboard.writeHistory.push(text);
      return Promise.resolve();
    }
  };

  let scrollYVal = 0;
  const win = {
    document: doc,
    navigator: {
      clipboard,
      userAgent: 'Adversarial Tester'
    },
    isSecureContext: true,
    innerWidth: 1200,
    innerHeight: 800,
    get scrollY() { return scrollYVal; },
    set scrollY(v) { scrollYVal = v; },
    get pageYOffset() { return scrollYVal; },
    scrollTo: (options) => {
      if (typeof options === 'object' && options.top !== undefined) {
        scrollYVal = options.top;
      }
    },
    location: {
      href: 'file:///D:/Documentos/TAJAMAR/DCastellanos4.github.io/previews/preview-1/index.html'
    },
    addEventListener: (type, fn) => {
      windowListeners[type] = windowListeners[type] || [];
      windowListeners[type].push(fn);
    },
    dispatchEvent: (evt) => {
      const type = typeof evt === 'string' ? evt : evt.type;
      const handlers = windowListeners[type] || [];
      for (const h of handlers) h(evt);
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    performance: {
      now: () => Date.now()
    },
    requestAnimationFrame: (cb) => {
      return setTimeout(() => cb(Date.now()), 16);
    },
    cancelAnimationFrame: (id) => clearTimeout(id),
    IntersectionObserver: class {
      constructor(cb) { this.cb = cb; }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  };

  return { doc, win, clipboard, idMap, allElements };
}

/**
 * Creates isolated sandbox and evaluates a client script
 */
function runScriptInSandbox(scriptPath, htmlPath, options = {}) {
  const htmlContent = readFile(htmlPath);
  const jsContent = readFile(scriptPath);

  const { doc, win, clipboard, idMap, allElements } = buildMockDOMFromHTML(htmlContent);

  if (options.isSecureContext !== undefined) {
    win.isSecureContext = options.isSecureContext;
  }
  if (options.hasClipboard === false) {
    win.navigator.clipboard = undefined;
  }
  if (options.execCommandThrows) {
    doc.execCommand = () => { throw new Error('SecurityError: execCommand disabled'); };
  }

  const sandboxContext = vm.createContext({
    window: win,
    document: doc,
    navigator: win.navigator,
    performance: win.performance,
    setTimeout: win.setTimeout,
    clearTimeout: win.clearTimeout,
    setInterval: win.setInterval,
    clearInterval: win.clearInterval,
    requestAnimationFrame: win.requestAnimationFrame,
    cancelAnimationFrame: win.cancelAnimationFrame,
    IntersectionObserver: win.IntersectionObserver,
    Date,
    Math,
    String,
    Number,
    Boolean,
    Array,
    Object,
    Set,
    Map,
    Promise,
    RegExp,
    console
  });

  vm.runInContext(jsContent, sandboxContext);

  doc.readyState = 'complete';
  doc.dispatchEvent({ type: 'DOMContentLoaded' });

  return { doc, win, clipboard, idMap, allElements };
}

// Master Stress Test Runner
async function runAllStressTests() {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: [],
    errors: []
  };

  async function test(name, fn) {
    results.total++;
    try {
      await fn();
      results.passed++;
      results.tests.push({ name, status: 'PASS' });
      console.log(`  ✓ PASS: ${name}`);
    } catch (err) {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', error: err.message });
      results.errors.push({ name, error: err });
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    ${err.message}`);
    }
  }

  console.log('================================================================================');
  console.log(' CHALLENGER 2: EMPIRICAL ADVERSARIAL STRESS TEST SUITE');
  console.log('================================================================================');

  /* ==========================================================================
     DOMAIN 1: RAPID CLIPBOARD CLICKING (DEBOUNCE, RESTORATION, FALLBACK)
     ========================================================================== */
  console.log('\n>>> DOMAIN 1: Rapid Clipboard Clicking (Debounce & State Restoration)');

  await test('1.1: Preview 1 Hero CLI copy button withstands 50 rapid clicks and restores state', async () => {
    const { doc, clipboard } = runScriptInSandbox('previews/preview-1/main.js', 'previews/preview-1/index.html');
    const btn = doc.getElementById('cli-copy-trigger');
    const stdout = doc.getElementById('cli-stdout');
    assert.ok(btn, 'cli-copy-trigger element must exist');
    assert.ok(stdout, 'cli-stdout element must exist');

    for (let i = 0; i < 50; i++) {
      btn.click();
    }

    await new Promise(r => setTimeout(r, 20));
    assert.strictEqual(clipboard.writtenText, 'davidllanos2005@gmail.com');
    assert.ok(stdout.innerHTML.includes('[OK: COPIADO AL PORTAPAPELES'), 'Must show success state');

    // Wait for timer restoration (2500ms + buffer)
    await new Promise(r => setTimeout(r, 2600));
    assert.ok(stdout.innerHTML.includes('// stdout:'), 'Must restore stdout to default comment after 2500ms');
  });

  await test('1.2: Preview 1 Contact email copy link withstands 50 rapid clicks and restores state', async () => {
    const { doc, clipboard } = runScriptInSandbox('previews/preview-1/main.js', 'previews/preview-1/index.html');
    const link = doc.getElementById('email-copy');
    const badge = doc.getElementById('email-badge');
    const stdout = doc.getElementById('email-stdout');
    assert.ok(link, 'email-copy link must exist');
    assert.ok(badge, 'email-badge must exist');

    for (let i = 0; i < 50; i++) {
      link.click();
    }

    await new Promise(r => setTimeout(r, 20));
    assert.strictEqual(clipboard.writtenText, 'davidllanos2005@gmail.com');
    assert.strictEqual(badge.textContent, '[¡COPIADO AL PORTAPAPELES!]');
    assert.ok(stdout.innerHTML.includes('[OK: COPIADO'), 'Stdout must show confirmation');

    await new Promise(r => setTimeout(r, 2600));
    assert.strictEqual(badge.textContent, '[CLICK_TO_COPY]', 'Badge must restore to CLICK_TO_COPY');
    assert.ok(stdout.innerHTML.includes('Listo para iniciar contacto'), 'Stdout must restore to idle');
  });

  await test('1.3: Preview 2 Hero email copy pill withstands 50 rapid clicks and restores label', async () => {
    const { doc, clipboard } = runScriptInSandbox('previews/preview-2/main.js', 'previews/preview-2/index.html');
    const heroBtn = doc.getElementById('hero-email-copy');
    const heroLabel = doc.getElementById('hero-email-label');
    const heroTooltip = doc.getElementById('hero-copy-tooltip');
    assert.ok(heroBtn, 'hero-email-copy must exist');

    for (let i = 0; i < 50; i++) {
      heroBtn.click();
    }

    await new Promise(r => setTimeout(r, 20));
    assert.strictEqual(clipboard.writtenText, 'davidllanos2005@gmail.com');
    assert.strictEqual(heroLabel.textContent, '¡Copiado al portapapeles!');
    if (heroTooltip) {
      assert.ok(heroTooltip.classList.contains('show'), 'Tooltip must show active state');
    }

    await new Promise(r => setTimeout(r, 2300));
    assert.strictEqual(heroLabel.textContent, 'davidllanos2005@gmail.com', 'Label must restore email');
    if (heroTooltip) {
      assert.strictEqual(heroTooltip.classList.contains('show'), false, 'Tooltip must hide');
    }
  });

  await test('1.4: Preview 3 Email copy link withstands 50 rapid clicks and restores badge', async () => {
    const { doc, clipboard } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const copyLink = doc.getElementById('email-copy');
    const badge = doc.getElementById('copy-badge');
    const feedback = doc.getElementById('email-feedback');
    assert.ok(copyLink, 'email-copy link must exist');

    for (let i = 0; i < 50; i++) {
      copyLink.click();
    }

    await new Promise(r => setTimeout(r, 20));
    assert.strictEqual(clipboard.writtenText, 'davidllanos2005@gmail.com');
    assert.strictEqual(badge.textContent, '[ COPIADO CON ÉXITO! ]');
    assert.strictEqual(feedback.textContent, '¡Copiado al portapapeles!');

    await new Promise(r => setTimeout(r, 2100));
    assert.strictEqual(badge.textContent, '[ CLICK TO COPY ]', 'Badge must revert');
    assert.strictEqual(feedback.textContent, '', 'Feedback text must clear');
  });

  await test('1.5: Comparison Hub email copy button withstands 50 rapid clicks with single toast', async () => {
    const { doc, clipboard } = runScriptInSandbox('previews/hub.js', 'previews/index.html');
    const copyBtn = doc.querySelector('.js-copy-email');
    assert.ok(copyBtn, '.js-copy-email button must exist in Hub');

    for (let i = 0; i < 50; i++) {
      copyBtn.click();
    }

    await new Promise(r => setTimeout(r, 20));
    assert.strictEqual(clipboard.writtenText, 'davidllanos2005@gmail.com');
    const toasts = doc.getElementsByTagName('div').filter(e => e.id === 'hub-toast');
    assert.strictEqual(toasts.length, 1, 'Only exactly 1 toast DOM element must be created under spam');
    assert.ok(toasts[0].classList.contains('visible'), 'Toast must be visible');

    await new Promise(r => setTimeout(r, 2500));
    assert.strictEqual(toasts[0].classList.contains('visible'), false, 'Toast must hide after 2400ms');
  });

  await test('1.6: Offline non-secure context fallback: execCommand copy executes and cleans up textarea', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html', {
      isSecureContext: false,
      hasClipboard: false
    });
    const copyLink = doc.getElementById('email-copy');
    assert.ok(copyLink, 'email-copy link must exist');

    const initialBodyChildren = doc.body.children.length;
    copyLink.click();

    assert.ok(doc.execCommandHistory.includes('copy'), 'execCommand copy must be triggered on fallback');
    assert.strictEqual(doc.body.children.length, initialBodyChildren, 'Temporary textarea must be removed from DOM');
  });

  await test('1.7: Total clipboard restriction fallback: executes mailto: redirect when execCommand throws', async () => {
    const { win, doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html', {
      isSecureContext: false,
      hasClipboard: false,
      execCommandThrows: true
    });
    const copyLink = doc.getElementById('email-copy');

    copyLink.click();
    assert.strictEqual(win.location.href, 'mailto:davidllanos2005@gmail.com', 'Must fallback to mailto: on total clipboard restriction');
  });

  /* ==========================================================================
     DOMAIN 2: TERMINAL COMMAND RUNNER FUZZING (VARIANT 3)
     ========================================================================== */
  console.log('\n>>> DOMAIN 2: Terminal Command Runner Fuzzing (Variant 3)');

  await test('2.1: Terminal fuzzing: empty input string does not append blank line', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const termForm = doc.getElementById('terminal-form');
    const termInput = doc.getElementById('term-input');
    const stdout = doc.getElementById('terminal-stdout');
    assert.ok(termForm && termInput && stdout, 'Terminal form components must exist');

    const initialLineCount = stdout.children.length;
    termInput.value = '';
    termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

    assert.strictEqual(stdout.children.length, initialLineCount, 'Empty submit must be ignored');
  });

  await test('2.2: Terminal fuzzing: whitespace-only strings do not append blank lines', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const termForm = doc.getElementById('terminal-form');
    const termInput = doc.getElementById('term-input');
    const stdout = doc.getElementById('terminal-stdout');

    const initialLineCount = stdout.children.length;
    termInput.value = '     \t\t\n   ';
    termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

    assert.strictEqual(stdout.children.length, initialLineCount, 'Whitespace submit must be ignored');
  });

  await test('2.3: Terminal fuzzing: unknown command displays graceful error banner without crashing', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const termForm = doc.getElementById('terminal-form');
    const termInput = doc.getElementById('term-input');
    const stdout = doc.getElementById('terminal-stdout');

    termInput.value = 'sudo rm -rf /';
    termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

    const lastHtml = stdout.innerHTML;
    assert.ok(lastHtml.includes('Command not recognized: &quot;sudo rm -rf /&quot;') || lastHtml.includes('Command not recognized: "sudo rm -rf /"'), 'Must output unrecognized command banner');
    assert.ok(lastHtml.includes('Type <span class="cyan-text font-bold">help</span>'), 'Must suggest help command');
  });

  await test('2.4: Terminal fuzzing: XSS / HTML injection vectors are strictly escaped in output', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const termForm = doc.getElementById('terminal-form');
    const termInput = doc.getElementById('term-input');
    const stdout = doc.getElementById('terminal-stdout');

    const injectionPayload = '<script>alert(1)</script>&"<tag>';
    termInput.value = injectionPayload;
    termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

    const rawLast = stdout.innerHTML;
    assert.ok(!rawLast.includes('<script>'), 'Unescaped <script> tag must NOT be present');
    assert.ok(rawLast.includes('&lt;script&gt;alert(1)&lt;/script&gt;&amp;&quot;&lt;tag&gt;'), 'HTML special characters must be escaped');
  });

  await test('2.5: Terminal fuzzing: uppercase commands normalize and execute correctly', async () => {
    const uppercaseCommands = [
      'HELP', 'CLEAR', 'CLS', 'TEST:ECI-API', 'TEST:SIMPLEAT-E2E',
      'METRICS:QA', 'SKILLS', 'CONTACT', 'CV', 'ABOUT'
    ];

    for (const cmd of uppercaseCommands) {
      const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
      const termForm = doc.getElementById('terminal-form');
      const termInput = doc.getElementById('term-input');
      const stdout = doc.getElementById('terminal-stdout');

      termInput.value = cmd;
      termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

      const outputHtml = stdout.innerHTML;
      assert.ok(!outputHtml.includes('Command not recognized'), `Command "${cmd}" must be recognized in uppercase`);
    }
  });

  await test('2.6: Terminal command aliases: ?, bio, email, resume, cat skills map properly', async () => {
    const aliasMap = [
      { input: '?', expectedSnippet: 'TELEMETRY COMMANDS' },
      { input: 'bio', expectedSnippet: 'BIOGRAPHY MANIFEST' },
      { input: 'email', expectedSnippet: 'CONTACT DETAILS' },
      { input: 'resume', expectedSnippet: 'DOCUMENT DISPATCH' },
      { input: 'cat skills', expectedSnippet: '31-technology skills manifest' }
    ];

    for (const { input, expectedSnippet } of aliasMap) {
      const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
      const termForm = doc.getElementById('terminal-form');
      const termInput = doc.getElementById('term-input');
      const stdout = doc.getElementById('terminal-stdout');

      termInput.value = input;
      termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

      await new Promise(r => setTimeout(r, 200));
      assert.ok(stdout.innerHTML.includes(expectedSnippet), `Alias "${input}" must trigger ${expectedSnippet}`);
    }
  });

  await test('2.7: Terminal rapid switching: executing multiple commands in 10ms intervals does not crash', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const termForm = doc.getElementById('terminal-form');
    const termInput = doc.getElementById('term-input');
    const stdout = doc.getElementById('terminal-stdout');

    const burst = ['test:eci-api', 'test:simpleat-e2e', 'metrics:qa', 'skills'];
    for (const cmd of burst) {
      termInput.value = cmd;
      termForm.dispatchEvent({ type: 'submit', preventDefault() {} });
    }

    await new Promise(r => setTimeout(r, 850));
    const fullText = stdout.textContent;
    assert.ok(fullText.includes('Karate DSL'), 'Must include Karate step');
    assert.ok(fullText.includes('Playwright'), 'Must include Playwright step');
    assert.ok(fullText.includes('QA AUTOMATION'), 'Must include QA metrics step');
    assert.ok(fullText.includes('31/31 skills verified'), 'Must include skills step');
  });

  await test('2.8: Terminal clear during streaming resets buffer', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const termForm = doc.getElementById('terminal-form');
    const termInput = doc.getElementById('term-input');
    const stdout = doc.getElementById('terminal-stdout');

    termInput.value = 'test:simpleat-e2e';
    termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

    await new Promise(r => setTimeout(r, 100));
    termInput.value = 'clear';
    termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

    assert.ok(stdout.innerHTML.includes('TELEMETRY TERMINAL v3.2.0 (CLEARED)'), 'Screen must show cleared banner');
  });

  await test('2.9: Terminal CV download command triggers <a download> click and removes element', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const termForm = doc.getElementById('terminal-form');
    const termInput = doc.getElementById('term-input');

    const initialBodyChildren = doc.body.children.length;
    termInput.value = 'cv';
    termForm.dispatchEvent({ type: 'submit', preventDefault() {} });

    assert.strictEqual(doc.body.children.length, initialBodyChildren, 'Temporary download anchor must be removed from DOM');
  });

  /* ==========================================================================
     DOMAIN 3: SKILLS MATRIX CATEGORY FILTERING STATE TOGGLES
     ========================================================================== */
  console.log('\n>>> DOMAIN 3: Skills Matrix Category Filtering State Transitions');

  await test('3.1: Preview 1 skills filter toggles active state and filters category groups', async () => {
    const { doc } = runScriptInSandbox('previews/preview-1/main.js', 'previews/preview-1/index.html');
    const buttons = doc.querySelectorAll('.skill-tab-btn');
    const groups = doc.querySelectorAll('.skill-category-group');

    assert.strictEqual(buttons.length, 6, 'P1 must have 6 filter buttons (All + 5 categories)');
    assert.strictEqual(groups.length, 5, 'P1 must have 5 category groups');

    const feBtn = buttons.find(b => b.getAttribute('data-filter') === 'frontend');
    assert.ok(feBtn, 'Frontend button must exist');
    feBtn.click();

    assert.strictEqual(feBtn.classList.contains('active'), true);
    assert.strictEqual(feBtn.getAttribute('aria-selected'), 'true');

    for (const group of groups) {
      if (group.getAttribute('data-cat') === 'frontend') {
        assert.strictEqual(group.style.display, '', 'Frontend group must be visible');
      } else {
        assert.strictEqual(group.style.display, 'none', `Group ${group.getAttribute('data-cat')} must be hidden`);
      }
    }

    const allBtn = buttons.find(b => b.getAttribute('data-filter') === 'all');
    allBtn.click();
    for (const group of groups) {
      assert.strictEqual(group.style.display, '', 'All groups must be restored to visible');
    }
  });

  await test('3.2: Preview 2 bento skill filter transitions styles correctly under rapid toggling', async () => {
    const { doc } = runScriptInSandbox('previews/preview-2/main.js', 'previews/preview-2/index.html');
    const pills = doc.querySelectorAll('.skills-filter-bar .filter-pill');
    const pods = doc.querySelectorAll('.skills-pods-grid .skill-pod-card');

    assert.strictEqual(pills.length, 6, 'P2 must have 6 filter pills');
    assert.strictEqual(pods.length, 5, 'P2 must have 5 skill pods');

    const qaPill = pills.find(p => p.getAttribute('data-category') === 'qa');
    const backendPill = pills.find(p => p.getAttribute('data-category') === 'backend');
    const allPill = pills.find(p => p.getAttribute('data-category') === 'all');

    for (let i = 0; i < 10; i++) {
      qaPill.click();
      backendPill.click();
      allPill.click();
    }

    for (const pod of pods) {
      assert.strictEqual(pod.style.display, '', 'All pods must be displayed');
      assert.strictEqual(pod.style.opacity, '1', 'All pods must have opacity 1');
    }
  });

  await test('3.3: Preview 3 telemetry skills filter toggles cards cleanly', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const tabs = doc.querySelectorAll('.filter-tab');
    const cards = doc.querySelectorAll('.skill-category-card');

    assert.strictEqual(tabs.length, 6, 'P3 must have 6 filter tabs');
    assert.strictEqual(cards.length, 5, 'P3 must have 5 skill category cards');

    const cloudTab = tabs.find(t => t.getAttribute('data-filter') === 'cloud');
    cloudTab.click();

    for (const card of cards) {
      if (card.getAttribute('data-category') === 'cloud') {
        assert.strictEqual(card.style.display, 'block');
      } else {
        assert.strictEqual(card.style.display, 'none');
      }
    }
  });

  await test('3.4: Comparison Hub matrix category filtering applies row-hidden properly', async () => {
    const { doc } = runScriptInSandbox('previews/hub.js', 'previews/index.html');
    const filterBtns = doc.querySelectorAll('.matrix-filter-btn');
    const matrixRows = doc.querySelectorAll('.matrix-table tr.matrix-row');

    assert.ok(filterBtns.length >= 5, 'Hub must have matrix category buttons');
    assert.ok(matrixRows.length >= 10, 'Hub must have comparison rows');

    const disenoBtn = filterBtns.find(b => b.getAttribute('data-category') === 'diseno');
    disenoBtn.click();

    for (const row of matrixRows) {
      const cat = row.getAttribute('data-category');
      if (cat && cat.includes('diseno')) {
        assert.strictEqual(row.classList.contains('row-hidden'), false, 'Matching row must NOT be hidden');
      } else {
        assert.strictEqual(row.classList.contains('row-hidden'), true, 'Non-matching row must be row-hidden');
      }
    }

    const allBtn = filterBtns.find(b => b.getAttribute('data-category') === 'all');
    allBtn.click();
    for (const row of matrixRows) {
      assert.strictEqual(row.classList.contains('row-hidden'), false, 'All rows must be restored');
    }
  });

  /* ==========================================================================
     DOMAIN 4: DRAWER / MODAL TOGGLES & MOBILE NAVIGATION RESIZE TRANSITIONS
     ========================================================================== */
  console.log('\n>>> DOMAIN 4: Drawer / Modal Toggles and Mobile Navigation Resize Transitions');

  await test('4.1: Preview 1 mobile nav hamburger click toggles open & aria-expanded', async () => {
    const { doc } = runScriptInSandbox('previews/preview-1/main.js', 'previews/preview-1/index.html');
    const toggle = doc.getElementById('nav-toggle');
    const menu = doc.getElementById('nav-menu');
    assert.ok(toggle && menu, 'P1 nav toggle and menu must exist');

    assert.strictEqual(menu.classList.contains('open'), false);
    toggle.click();
    assert.strictEqual(menu.classList.contains('open'), true);
    assert.strictEqual(toggle.getAttribute('aria-expanded'), 'true');

    toggle.click();
    assert.strictEqual(menu.classList.contains('open'), false);
    assert.strictEqual(toggle.getAttribute('aria-expanded'), 'false');
  });

  await test('4.2: Preview 1 mobile nav link click auto-dismisses drawer', async () => {
    const { doc } = runScriptInSandbox('previews/preview-1/main.js', 'previews/preview-1/index.html');
    const toggle = doc.getElementById('nav-toggle');
    const menu = doc.getElementById('nav-menu');
    const navLink = doc.querySelector('.nav-link');

    toggle.click();
    assert.strictEqual(menu.classList.contains('open'), true);

    navLink.click();
    assert.strictEqual(menu.classList.contains('open'), false);
    assert.strictEqual(toggle.getAttribute('aria-expanded'), 'false');
  });

  await test('4.3: Preview 1 outside click auto-dismisses mobile nav', async () => {
    const { doc } = runScriptInSandbox('previews/preview-1/main.js', 'previews/preview-1/index.html');
    const toggle = doc.getElementById('nav-toggle');
    const menu = doc.getElementById('nav-menu');
    const outsideEl = doc.createElement('div');
    doc.body.appendChild(outsideEl);

    toggle.click();
    assert.strictEqual(menu.classList.contains('open'), true);

    doc.dispatchEvent({ type: 'click', target: outsideEl });
    assert.strictEqual(menu.classList.contains('open'), false);
  });

  await test('4.4: Preview 1 resize >= 992px auto-dismisses mobile nav', async () => {
    const { doc, win } = runScriptInSandbox('previews/preview-1/main.js', 'previews/preview-1/index.html');
    const toggle = doc.getElementById('nav-toggle');
    const menu = doc.getElementById('nav-menu');

    win.innerWidth = 480;
    toggle.click();
    assert.strictEqual(menu.classList.contains('open'), true);

    win.innerWidth = 1024;
    win.dispatchEvent({ type: 'resize' });
    assert.strictEqual(menu.classList.contains('open'), false);
    assert.strictEqual(toggle.getAttribute('aria-expanded'), 'false');
  });

  await test('4.5: Preview 1 Spec Sheets inspector drawers toggle hidden and aria-expanded for all 4 projects', async () => {
    const { doc } = runScriptInSandbox('previews/preview-1/main.js', 'previews/preview-1/index.html');
    const inspectBtns = doc.querySelectorAll('.spec-inspect-btn');
    assert.strictEqual(inspectBtns.length, 4, 'Must have 4 spec inspect buttons');

    for (const btn of inspectBtns) {
      const targetId = btn.getAttribute('data-target');
      const drawer = doc.getElementById(targetId);
      assert.ok(drawer, `Drawer ${targetId} must exist`);
      assert.strictEqual(drawer.hidden, true, 'Drawer must initially be hidden');

      btn.click();
      assert.strictEqual(drawer.hidden, false, 'Drawer must open');
      assert.strictEqual(btn.getAttribute('aria-expanded'), 'true');
      assert.ok(btn.innerHTML.includes('CERRAR TELEMETRÍA'), 'Button text must change to CERRAR');

      btn.click();
      assert.strictEqual(drawer.hidden, true, 'Drawer must close');
      assert.strictEqual(btn.getAttribute('aria-expanded'), 'false');
      assert.ok(btn.innerHTML.includes('INSPECCIONAR TELEMETRÍA'), 'Button text must revert');
    }
  });

  await test('4.6: Preview 2 dock nav toggles, outside tap dismisses, resize dismisses', async () => {
    const { doc, win } = runScriptInSandbox('previews/preview-2/main.js', 'previews/preview-2/index.html');
    const toggleBtn = doc.getElementById('dock-toggle');
    const linksMenu = doc.getElementById('dock-links');
    assert.ok(toggleBtn && linksMenu, 'P2 dock toggle and links must exist');

    toggleBtn.click();
    assert.strictEqual(linksMenu.classList.contains('open'), true);

    const outside = doc.createElement('div');
    doc.body.appendChild(outside);
    doc.dispatchEvent({ type: 'click', target: outside });
    assert.strictEqual(linksMenu.classList.contains('open'), false);

    toggleBtn.click();
    win.innerWidth = 1200;
    win.dispatchEvent({ type: 'resize' });
    assert.strictEqual(linksMenu.classList.contains('open'), false);
  });

  await test('4.7: Preview 3 Dev Drawer toggles, computes DOM count and viewport metrics', async () => {
    const { doc, win } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const toggle = doc.getElementById('drawer-toggle');
    const content = doc.getElementById('drawer-content');
    const domCount = doc.getElementById('dom-count');
    const viewportDim = doc.getElementById('viewport-dim');

    assert.ok(toggle && content && domCount && viewportDim, 'Dev drawer elements must exist');
    assert.strictEqual(content.hidden, true, 'Drawer must be initially hidden');

    toggle.click();
    assert.strictEqual(content.hidden, false, 'Drawer must open');
    assert.strictEqual(toggle.getAttribute('aria-expanded'), 'true');

    const totalNodes = doc.getElementsByTagName('*').length;
    assert.strictEqual(domCount.textContent, String(totalNodes), 'DOM count metric must match total elements');
    assert.strictEqual(viewportDim.textContent, '1200x800', 'Viewport dimension must match window dimensions');

    win.innerWidth = 768;
    win.innerHeight = 1024;
    win.dispatchEvent({ type: 'resize' });
    assert.strictEqual(viewportDim.textContent, '768x1024', 'Viewport metric must update on resize');

    toggle.click();
    assert.strictEqual(content.hidden, true, 'Drawer must close');
  });

  await test('4.8: Preview 3 Dev Drawer "RUN ALL 4 SUITES" triggers terminal test execution', async () => {
    const { doc } = runScriptInSandbox('previews/preview-3/main.js', 'previews/preview-3/index.html');
    const runAllBtn = doc.getElementById('btn-run-all-tests');
    const stdout = doc.getElementById('terminal-stdout');
    assert.ok(runAllBtn, 'btn-run-all-tests must exist');

    runAllBtn.click();

    await new Promise(r => setTimeout(r, 650));
    assert.ok(stdout.textContent.includes('Karate DSL'), 'Must have triggered Karate test');
  });

  /* ==========================================================================
     DOMAIN 5: OFFLINE FILE:// SECURITY & ARCHITECTURAL PURITY
     ========================================================================== */
  console.log('\n>>> DOMAIN 5: Offline file:// Security & Independence');

  await test('5.1: Zero remote runtime dependencies (no fetch, no XMLHttpRequest, no modules)', async () => {
    const files = [
      'previews/preview-1/main.js',
      'previews/preview-2/main.js',
      'previews/preview-3/main.js',
      'previews/hub.js'
    ];

    for (const f of files) {
      const code = readFile(f);
      assert.doesNotMatch(code, /\bfetch\s*\(/, `fetch() not allowed in ${f}`);
      assert.doesNotMatch(code, /XMLHttpRequest/, `XMLHttpRequest not allowed in ${f}`);
      assert.doesNotMatch(code, /new\s+WebSocket/, `new WebSocket not allowed in ${f}`);
      assert.doesNotMatch(code, /\bimport\s*\(/, `Dynamic import() not allowed in ${f}`);
      assert.doesNotMatch(code, /\blocalStorage\b/, `localStorage not allowed in ${f}`);
      assert.doesNotMatch(code, /\bsessionStorage\b/, `sessionStorage not allowed in ${f}`);
    }
  });

  await test('5.2: Zero type="module" script tags in any preview HTML', async () => {
    const htmlFiles = [
      'previews/preview-1/index.html',
      'previews/preview-2/index.html',
      'previews/preview-3/index.html',
      'previews/index.html'
    ];

    for (const f of htmlFiles) {
      const raw = readFile(f);
      assert.doesNotMatch(raw, /type\s*=\s*["']module["']/i, `type="module" forbidden under file:// in ${f}`);
    }
  });

  await test('5.3: Strict path depth algebra: previews use ../../ and hub uses ../', async () => {
    const previews = ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'];
    for (const p of previews) {
      const raw = readFile(p);
      assert.doesNotMatch(raw, /src=["'](?:\.\.\/)?img\//i, `Previews must not use ../img/ directly: ${p}`);
      assert.match(raw, /src=["']\.\.\/\.\.\/img\//i, `Previews must use ../../img/: ${p}`);
      assert.match(raw, /href=["']\.\.\/\.\.\/docs\//i, `Previews must use ../../docs/: ${p}`);
      assert.doesNotMatch(raw, /[A-Za-z]:\\/, `Zero hardcoded Windows disk paths in ${p}`);
    }

    const hub = readFile('previews/index.html');
    assert.match(hub, /src=["']\.\.\/img\//i, 'Hub must use ../img/');
    assert.match(hub, /href=["']\.\.\/docs\//i, 'Hub must use ../docs/');
    assert.doesNotMatch(hub, /[A-Za-z]:\\/, 'Zero hardcoded Windows disk paths in hub');
  });

  await test('5.4: Physical disk asset verification: all linked files exist and Simpleat logo is genuine PNG', async () => {
    const requiredAssets = [
      'img/Image.jpg',
      'img/LOGOECI.webp',
      'img/logoMANGO.png',
      'img/simpleat-icon.png',
      'img/logo.svg',
      'docs/CV David Castellanos - English.pdf'
    ];

    for (const asset of requiredAssets) {
      assert.ok(fs.existsSync(resolvePath(asset)), `Asset must exist: ${asset}`);
    }

    // Magic bytes check for simpleat-icon.png: 89 50 4E 47 (PNG)
    const fd = fs.openSync(resolvePath('img/simpleat-icon.png'), 'r');
    const buf = Buffer.alloc(4);
    fs.readSync(fd, buf, 0, 4, 0);
    fs.closeSync(fd);
    assert.strictEqual(buf.toString('hex'), '89504e47', 'img/simpleat-icon.png must be genuine PNG magic bytes');

    // Verify broken HTML file logo-simpleat.png is never referenced in previews
    const allPreviews = [
      'previews/preview-1/index.html',
      'previews/preview-2/index.html',
      'previews/preview-3/index.html',
      'previews/index.html'
    ];
    for (const ap of allPreviews) {
      const content = readFile(ap);
      assert.doesNotMatch(content, /logo-simpleat\.png/i, `Broken file logo-simpleat.png must never be referenced in ${ap}`);
    }
  });

  console.log('\n================================================================================');
  console.log(` CHALLENGER 2 STRESS TEST SUMMARY: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
  console.log('================================================================================\n');

  return results;
}

if (require.main === module) {
  runAllStressTests().then(res => {
    if (res.failed > 0) {
      process.exit(1);
    }
  });
}

module.exports = { runAllStressTests, buildMockDOMFromHTML, runScriptInSandbox };
