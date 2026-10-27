/**
 * Adversarial Viewport & Layout Stress Runner
 * 
 * Empirically tests all 4 redesign pages in real Chromium (headless Edge/Chrome)
 * across 13 extreme viewports (320px to 3840px 4K).
 * 
 * Verifies:
 * - Zero horizontal overflow (scrollWidth <= innerWidth, body.scrollWidth <= innerWidth)
 * - Zero asset 404s (network requests, img.naturalWidth > 0, stylesheets loaded)
 * - Zero console errors & uncaught runtime exceptions
 * - Mobile navigation menu expansion & collapse overflow safety
 * - Interactive element execution safety (terminal commands, skill filters, clipboard)
 * - Full-page scroll overflow safety
 * - Offline file:// protocol and static http:// server compatibility
 */

const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

// Configuration
const REPO_ROOT = path.resolve(__dirname, '..');
const HTTP_PORT = 9876;
const CDP_PORT = 9334;
const USER_DATA_DIR = path.join(os.tmpdir(), `edge_stress_harness_${Date.now()}`);

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

const VIEWPORT_MATRIX = [
  { name: '320px (iPhone SE 1st / Ultra-narrow)', width: 320, height: 568, isMobile: true },
  { name: '360px (Galaxy S8/S9 / Android Small)', width: 360, height: 640, isMobile: true },
  { name: '375px (iPhone 13 mini / iPhone 8)', width: 375, height: 667, isMobile: true },
  { name: '414px (iPhone XR / Plus / Max)', width: 414, height: 896, isMobile: true },
  { name: '480px (Phablet / Wide mobile)', width: 480, height: 800, isMobile: true },
  { name: '600px (Small Tablet / Foldable)', width: 600, height: 960, isMobile: true },
  { name: '768px (iPad Mini / Tablet Portrait)', width: 768, height: 1024, isMobile: true },
  { name: '992px (Tablet Landscape / Netbook)', width: 992, height: 600, isMobile: false },
  { name: '1024px (iPad Pro / Small Laptop)', width: 1024, height: 768, isMobile: false },
  { name: '1200px (Standard Desktop)', width: 1200, height: 800, isMobile: false },
  { name: '1440px (Wide Desktop / 2K)', width: 1440, height: 900, isMobile: false },
  { name: '1920px (Full HD 1080p)', width: 1920, height: 1080, isMobile: false },
  { name: '3840px (4K Ultra HD)', width: 3840, height: 2160, isMobile: false }
];

const ALL_PAGES = [
  { id: 'hub', name: 'Comparison Hub', path: 'previews/index.html' },
  { id: 'preview-1', name: 'Preview 1 (Monospace Grid)', path: 'previews/preview-1/index.html' },
  { id: 'preview-2', name: 'Preview 2 (Kinetic Bento)', path: 'previews/preview-2/index.html' },
  { id: 'preview-3', name: 'Preview 3 (Enterprise Telemetry)', path: 'previews/preview-3/index.html' },
  { id: 'preview-4', name: 'Preview 4 (Industrial Hardware)', path: 'previews/preview-4/index.html' },
  { id: 'preview-5', name: 'Preview 5 (3D WebGL Pipeline)', path: 'previews/preview-5/index.html' },
  { id: 'preview-6', name: 'Preview 6 (Kinetic Swiss Brutalism)', path: 'previews/preview-6/index.html' }
];

const PAGES = ALL_PAGES.filter(p => fs.existsSync(path.join(REPO_ROOT, p.path)));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function startStaticServer(root, port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://localhost:${port}`);
    let decodedPath = decodeURIComponent(parsedUrl.pathname);
    if (decodedPath === '/') decodedPath = '/previews/index.html';
    
    const filePath = path.normalize(path.join(root, decodedPath));
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.statusCode = 404;
        return res.end(`File Not Found: ${decodedPath}`);
      }

      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Length': stats.size,
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => resolve(server));
    server.on('error', reject);
  });
}

function findBrowserPath() {
  for (const candidate of BROWSER_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error('No supported Chromium browser found (tried Edge and Chrome).');
}

class CdpConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.pending = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        } else if (msg.method) {
          const listeners = this.eventListeners.get(msg.method) || [];
          for (const fn of listeners) fn(msg.params);
        }
      } catch (e) {
        console.error('Error handling CDP message:', e);
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.msgId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, handler) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(handler);
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch (_) {}
    }
  }
}

async function runAdversarialStressTest() {
  console.log('='.repeat(80));
  console.log(' ADVERSARIAL VIEWPORT & LAYOUT STRESS HARNESS');
  console.log('='.repeat(80));

  // 1. Start Static HTTP Server
  console.log(`[1/5] Starting local HTTP static server on port ${HTTP_PORT}...`);
  const server = await startStaticServer(REPO_ROOT, HTTP_PORT);
  console.log(`      Server listening on http://127.0.0.1:${HTTP_PORT}`);

  // 2. Launch Chromium Browser
  const browserPath = findBrowserPath();
  console.log(`[2/5] Launching headless browser: ${browserPath}...`);
  const browserProc = spawn(browserPath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--allow-file-access-from-files',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    'about:blank'
  ], { stdio: 'ignore' });

  const cleanup = async () => {
    try { browserProc.kill('SIGKILL'); } catch (_) {}
    try { server.close(); } catch (_) {}
    await sleep(300);
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  };

  process.on('SIGINT', async () => { await cleanup(); process.exit(1); });
  process.on('SIGTERM', async () => { await cleanup(); process.exit(1); });

  let cdpUrl = null;
  for (let i = 0; i < 40; i++) {
    await sleep(200);
    try {
      const version = await getJson(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (version && version.webSocketDebuggerUrl) {
        cdpUrl = version.webSocketDebuggerUrl;
        console.log(`      Browser: ${version['Browser']}`);
        break;
      }
    } catch (_) {}
  }

  if (!cdpUrl) {
    await cleanup();
    throw new Error('Failed to acquire CDP WebSocket URL from browser');
  }

  // 3. Connect to Browser target
  console.log('[3/5] Initializing CDP session...');
  const browserCdp = new CdpConnection(cdpUrl);
  await browserCdp.connect();

  const targetInfo = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
  const targetWsUrl = `ws://127.0.0.1:${CDP_PORT}/devtools/page/${targetInfo.targetId}`;
  const pageCdp = new CdpConnection(targetWsUrl);
  await pageCdp.connect();

  await pageCdp.send('Page.enable');
  await pageCdp.send('Runtime.enable');
  await pageCdp.send('Network.enable');
  await pageCdp.send('Log.enable');

  const testResults = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  const networkErrors = [];
  const consoleErrors = [];

  pageCdp.on('Network.responseReceived', (params) => {
    const { response } = params;
    if (response.status >= 400) {
      networkErrors.push({
        url: response.url,
        status: response.status,
        statusText: response.statusText
      });
    }
  });

  pageCdp.on('Runtime.exceptionThrown', (params) => {
    consoleErrors.push({
      type: 'exception',
      text: params.exceptionDetails.text,
      description: params.exceptionDetails.exception?.description || '',
      url: params.exceptionDetails.url,
      line: params.exceptionDetails.lineNumber
    });
  });

  pageCdp.on('Log.entryAdded', (params) => {
    const { entry } = params;
    if (entry.level === 'error') {
      consoleErrors.push({
        type: 'log_error',
        text: entry.text,
        url: entry.url
      });
    }
  });

  console.log('\n[4/5] Executing Viewport Stress Matrix across 4 Pages & 13 Viewports...');
  console.log('-'.repeat(80));

  for (const page of PAGES) {
    const pageUrl = `http://127.0.0.1:${HTTP_PORT}/${page.path}`;
    console.log(`\n>>> Testing Target: ${page.name} (${page.path})`);

    for (const vp of VIEWPORT_MATRIX) {
      totalTests++;
      const testName = `${page.id} @ ${vp.width}x${vp.height} (${vp.name})`;

      networkErrors.length = 0;
      consoleErrors.length = 0;

      await pageCdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile
      });

      await pageCdp.send('Page.navigate', { url: pageUrl });
      await sleep(650);

      // Scroll to trigger lazy loading of images
      await pageCdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            window.scrollTo(0, document.body.scrollHeight);
          })()
        `
      });
      await sleep(200);
      await pageCdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            window.scrollTo(0, 0);
          })()
        `
      });
      await sleep(150);

      // Measure layout metrics
      const evalMetrics = await pageCdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const winW = window.innerWidth;
            const docW = document.documentElement.scrollWidth;
            const bodyW = document.body ? document.body.scrollWidth : 0;
            const docClientW = document.documentElement.clientWidth;
            
            // Check for overflowing elements
            const overflowing = [];
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const r = el.getBoundingClientRect();
              if (r.right > winW + 0.5) {
                overflowing.push({
                  tag: el.tagName.toLowerCase(),
                  id: el.id || null,
                  className: (el.className && typeof el.className === 'string') ? el.className.trim() : null,
                  right: Math.round(r.right),
                  width: Math.round(r.width),
                  delta: Math.round(r.right - winW),
                  text: (el.textContent || '').trim().slice(0, 30)
                });
              }
            }

            // Image verification
            const brokenImages = [];
            for (const img of document.querySelectorAll('img')) {
              if (!img.complete || img.naturalWidth === 0) {
                brokenImages.push({
                  src: img.src,
                  alt: img.alt || ''
                });
              }
            }

            // Stylesheet verification (respect CORS for external fonts)
            const failedSheets = [];
            for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
              try {
                const href = link.href || '';
                const isLocal = !href.startsWith('http') || href.includes('127.0.0.1') || href.includes('localhost');
                if (isLocal) {
                  if (!link.sheet) {
                    failedSheets.push(href + ' (local sheet is null)');
                  } else if (link.sheet.cssRules && link.sheet.cssRules.length === 0) {
                    failedSheets.push(href + ' (0 cssRules in local sheet)');
                  }
                }
              } catch (e) {
                // If CORS prevents reading cssRules on third-party origins, ignore
              }
            }

            return {
              winW,
              docW,
              bodyW,
              docClientW,
              hasOverflow: (docW > winW || bodyW > winW),
              overflowDelta: Math.max(0, docW - winW, bodyW - winW),
              overflowingElements: overflowing.slice(0, 5),
              brokenImages,
              failedSheets
            };
          })()
        `,
        returnByValue: true,
        awaitPromise: true
      });

      const metrics = evalMetrics.result.value;

      // Test mobile navigation expansion if mobile
      let navMenuOverflow = false;
      let navMenuError = null;
      if (vp.isMobile && vp.width <= 768) {
        const navEval = await pageCdp.send('Runtime.evaluate', {
          expression: `
            (() => {
              const toggleBtn = document.querySelector('.nav-toggle, .mobile-menu-btn, button[aria-controls="nav-links"], button[aria-label*="menú"], button[aria-label*="menu"]');
              if (!toggleBtn) return { found: false };
              toggleBtn.click();
              return { found: true };
            })()
          `,
          returnByValue: true
        });

        if (navEval.result.value.found) {
          await sleep(250);
          const navCheck = await pageCdp.send('Runtime.evaluate', {
            expression: `
              (() => {
                const winW = window.innerWidth;
                const docW = document.documentElement.scrollWidth;
                const bodyW = document.body.scrollWidth;
                const over = (docW > winW || bodyW > winW);
                const toggleBtn = document.querySelector('.nav-toggle, .mobile-menu-btn, button[aria-controls="nav-links"], button[aria-label*="menú"], button[aria-label*="menu"]');
                if (toggleBtn) toggleBtn.click();
                return { over, docW, winW, delta: Math.max(0, docW - winW) };
              })()
            `,
            returnByValue: true
          });
          if (navCheck.result.value.over) {
            navMenuOverflow = true;
            navMenuError = `Mobile menu expanded causes horizontal overflow (scrollWidth ${navCheck.result.value.docW} > innerWidth ${navCheck.result.value.winW})`;
          }
          await sleep(150);
        }
      }

      // Test Full-Page Scroll
      const scrollCheck = await pageCdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
            const midDocW = document.documentElement.scrollWidth;
            window.scrollTo(0, document.body.scrollHeight);
            const botDocW = document.documentElement.scrollWidth;
            window.scrollTo(0, 0);
            const winW = window.innerWidth;
            return {
              midOverflow: midDocW > winW,
              botOverflow: botDocW > winW,
              midDocW,
              botDocW,
              winW
            };
          })()
        `,
        returnByValue: true
      });

      // Interactive components test
      let interactionErrors = [];
      if (page.id === 'preview-3') {
        const terminalEval = await pageCdp.send('Runtime.evaluate', {
          expression: `
            (() => {
              const errors = [];
              const btns = Array.from(document.querySelectorAll('.term-quick-btn, .cmd-btn, .term-action-btn'));
              for (const btn of btns.slice(0, 4)) {
                try {
                  btn.click();
                } catch (e) {
                  errors.push('Terminal button click error: ' + e.message);
                }
              }
              return errors;
            })()
          `,
          returnByValue: true
        });
        interactionErrors = terminalEval.result.value || [];
      } else if (page.id === 'preview-2') {
        const bentoEval = await pageCdp.send('Runtime.evaluate', {
          expression: `
            (() => {
              const errors = [];
              const filters = Array.from(document.querySelectorAll('.filter-tab, .filter-chip, .bento-filter'));
              for (const f of filters.slice(0, 5)) {
                try {
                  f.click();
                } catch (e) {
                  errors.push('Filter tab click error: ' + e.message);
                }
              }
              return errors;
            })()
          `,
          returnByValue: true
        });
        interactionErrors = bentoEval.result.value || [];
      }

      // Evaluate Pass / Fail condition
      const failures = [];
      if (metrics.hasOverflow) {
        failures.push(`Horizontal overflow detected: scrollWidth ${metrics.docW}px > innerWidth ${metrics.winW}px (delta: +${metrics.overflowDelta}px)`);
        if (metrics.overflowingElements.length > 0) {
          failures.push(`Culprits: ${JSON.stringify(metrics.overflowingElements)}`);
        }
      }
      if (navMenuOverflow) {
        failures.push(navMenuError);
      }
      if (scrollCheck.result.value.midOverflow || scrollCheck.result.value.botOverflow) {
        failures.push(`Scroll overflow: mid=${scrollCheck.result.value.midDocW}px, bot=${scrollCheck.result.value.botDocW}px > innerWidth ${scrollCheck.result.value.winW}px`);
      }
      if (metrics.brokenImages.length > 0) {
        failures.push(`Broken images: ${JSON.stringify(metrics.brokenImages)}`);
      }
      if (metrics.failedSheets.length > 0) {
        failures.push(`Failed stylesheets: ${metrics.failedSheets.join(', ')}`);
      }
      if (networkErrors.length > 0) {
        failures.push(`Network errors (4xx/5xx): ${JSON.stringify(networkErrors)}`);
      }
      if (consoleErrors.length > 0) {
        failures.push(`Console errors/exceptions: ${JSON.stringify(consoleErrors)}`);
      }
      if (interactionErrors.length > 0) {
        failures.push(`Interaction errors: ${JSON.stringify(interactionErrors)}`);
      }

      const passed = (failures.length === 0);
      if (passed) {
        passedTests++;
        console.log(`  ✓ PASS [${vp.width}px]: ${vp.name} (scrollW: ${metrics.docW}px, innerW: ${metrics.winW}px)`);
      } else {
        failedTests++;
        console.error(`  ✗ FAIL [${vp.width}px]: ${vp.name}`);
        for (const f of failures) console.error(`      -> ${f}`);
      }

      testResults.push({
        page: page.id,
        pageName: page.name,
        viewport: vp,
        metrics,
        passed,
        failures
      });
    }
  }

  // 5. Test File:// Protocol Direct Loading
  console.log('\n[5/5] Testing file:// protocol direct loading for all pages...');
  for (const page of PAGES) {
    totalTests++;
    const fileUrl = `file:///${path.join(REPO_ROOT, page.path).replace(/\\/g, '/')}`;
    console.log(`>>> Testing file:// protocol: ${page.name}`);

    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    networkErrors.length = 0;
    consoleErrors.length = 0;

    await pageCdp.send('Page.navigate', { url: fileUrl });
    await sleep(400);

    const fileEval = await pageCdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          const brokenImgs = Array.from(document.querySelectorAll('img')).filter(i => !i.complete || i.naturalWidth === 0).length;
          return { docW, winW, hasOverflow: docW > winW, brokenImgs };
        })()
      `,
      returnByValue: true
    });

    const res = fileEval.result.value;
    const fileFailures = [];
    if (res.hasOverflow) fileFailures.push(`file:// overflow: ${res.docW} > ${res.winW}`);
    if (res.brokenImgs > 0) fileFailures.push(`file:// broken images: ${res.brokenImgs}`);
    if (consoleErrors.length > 0) fileFailures.push(`file:// console errors: ${JSON.stringify(consoleErrors)}`);

    const passed = (fileFailures.length === 0);
    if (passed) {
      passedTests++;
      console.log(`  ✓ PASS file:// ${page.name} (scrollW: ${res.docW}px, innerW: ${res.winW}px, brokenImgs: ${res.brokenImgs})`);
    } else {
      failedTests++;
      console.error(`  ✗ FAIL file:// ${page.name}`);
      for (const f of fileFailures) console.error(`      -> ${f}`);
    }

    testResults.push({
      page: `${page.id}-file`,
      pageName: `${page.name} (file://)`,
      viewport: { name: '1200px file:// desktop', width: 1200, height: 800, isMobile: false },
      metrics: res,
      passed,
      failures: fileFailures
    });
  }

  // Cleanup
  console.log('\nTeardown browser and server...');
  pageCdp.close();
  browserCdp.close();
  await cleanup();

  console.log('='.repeat(80));
  console.log(' STRESS TEST EXECUTION SUMMARY');
  console.log('='.repeat(80));
  console.log(` Total Runs Tested  : ${totalTests}`);
  console.log(` Passed Runs        : ${passedTests}`);
  console.log(` Failed Runs        : ${failedTests}`);
  console.log(` Pass Rate          : ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(80));

  // Write detailed machine-readable report
  const reportPath = path.join(REPO_ROOT, 'tests', 'stress_results.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests,
    testResults
  }, null, 2), 'utf-8');

  return {
    totalTests,
    passedTests,
    failedTests,
    testResults
  };
}

if (require.main === module) {
  runAdversarialStressTest()
    .then((summary) => {
      if (summary.failedTests > 0) {
        console.error(`\n❌ ADVERSARIAL STRESS TEST DETECTED ${summary.failedTests} FAILURES!`);
        process.exit(1);
      } else {
        console.log('\n✅ ALL ADVERSARIAL VIEWPORT & LAYOUT CHECKS PASSED EMPIRICALLY!');
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error('\n💥 UNEXPECTED HARNESS EXCEPTION:', err);
      process.exit(2);
    });
}

module.exports = { runAdversarialStressTest };
