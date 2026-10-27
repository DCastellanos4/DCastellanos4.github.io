/**
 * Precision Stress Auditor for Preview 4, Preview 5, Preview 6, and Hub
 * Measures exact overflow, broken images, console errors across all 13 viewports.
 */

const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const REPO_ROOT = path.resolve(__dirname, '..');
const HTTP_PORT = 9890;
const CDP_PORT = 9340;
const USER_DATA_DIR = path.join(os.tmpdir(), `edge_audit_${Date.now()}`);

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

const TARGETS = [
  { id: 'hub', name: 'Comparison Hub', path: 'previews/index.html' },
  { id: 'preview-4', name: 'Preview 4 (Industrial Hardware)', path: 'previews/preview-4/index.html' },
  { id: 'preview-5', name: 'Preview 5 (3D WebGL Pipeline)', path: 'previews/preview-5/index.html' },
  { id: 'preview-6', name: 'Preview 6 (Kinetic Swiss Brutalism)', path: 'previews/preview-6/index.html' }
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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
    let decodedPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
    if (decodedPath === '/') decodedPath = '/previews/index.html';
    const filePath = path.normalize(path.join(root, decodedPath));
    if (!filePath.startsWith(root)) { res.statusCode = 403; return res.end(); }
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) { res.statusCode = 404; return res.end(); }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
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

class Cdp {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.msgId = 0;
    this.pending = new Map();
    this.events = new Map();
  }
  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        } else if (msg.method) {
          const handlers = this.events.get(msg.method) || [];
          for (const h of handlers) h(msg.params);
        }
      } catch (_) {}
    };
  }
  send(method, params = {}) {
    const id = ++this.msgId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(evt, handler) {
    if (!this.events.has(evt)) this.events.set(evt, []);
    this.events.get(evt).push(handler);
  }
  close() { if (this.ws) try { this.ws.close(); } catch (_) {} }
}

async function runAudit() {
  console.log('--- STARTING ADVERSARIAL AUDIT ---');
  const server = await startStaticServer(REPO_ROOT, HTTP_PORT);
  const browserProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--disable-gpu', '--no-first-run', '--allow-file-access-from-files',
    `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${USER_DATA_DIR}`, 'about:blank'
  ], { stdio: 'ignore' });

  const cleanup = async () => {
    try { browserProc.kill('SIGKILL'); } catch (_) {}
    try { server.close(); } catch (_) {}
    await sleep(200);
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  };

  const results = [];
  try {
    let cdpUrl = null;
    for (let i = 0; i < 30; i++) {
      await sleep(200);
      try {
        const v = await getJson(`http://127.0.0.1:${CDP_PORT}/json/version`);
        if (v && v.webSocketDebuggerUrl) { cdpUrl = v.webSocketDebuggerUrl; break; }
      } catch (_) {}
    }
    const browserCdp = new Cdp(cdpUrl);
    await browserCdp.connect();
    const target = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
    const pageCdp = new Cdp(`ws://127.0.0.1:${CDP_PORT}/devtools/page/${target.targetId}`);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('Runtime.enable');
    await pageCdp.send('Network.enable');
    await pageCdp.send('Log.enable');

    const consoleErrors = [];
    pageCdp.on('Runtime.exceptionThrown', (p) => {
      consoleErrors.push(p.exceptionDetails.text + ' ' + (p.exceptionDetails.exception?.description || ''));
    });
    pageCdp.on('Log.entryAdded', (p) => {
      if (p.entry.level === 'error') consoleErrors.push(p.entry.text);
    });

    for (const target of TARGETS) {
      console.log(`\n============================================================`);
      console.log(` AUDITING: ${target.name} (${target.path})`);
      console.log(`============================================================`);

      for (const vp of VIEWPORT_MATRIX) {
        consoleErrors.length = 0;
        await pageCdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.isMobile
        });

        const url = `http://127.0.0.1:${HTTP_PORT}/${target.path}`;
        await pageCdp.send('Page.navigate', { url });
        await sleep(500);

        const evalRes = await pageCdp.send('Runtime.evaluate', {
          expression: `
            (() => {
              const winW = window.innerWidth;
              const docW = document.documentElement.scrollWidth;
              const bodyW = document.body ? document.body.scrollWidth : 0;
              const hasOverflow = (docW > winW || bodyW > winW);
              const culprits = [];
              if (hasOverflow) {
                for (const el of document.querySelectorAll('*')) {
                  const r = el.getBoundingClientRect();
                  if (r.right > winW + 0.5) {
                    culprits.push({
                      tag: el.tagName.toLowerCase(),
                      id: el.id || null,
                      className: (typeof el.className === 'string') ? el.className.trim() : null,
                      right: Math.round(r.right),
                      width: Math.round(r.width),
                      delta: Math.round(r.right - winW),
                      text: (el.textContent || '').trim().slice(0, 30)
                    });
                  }
                }
              }
              const brokenImages = Array.from(document.querySelectorAll('img'))
                .filter(i => !i.complete || i.naturalWidth === 0)
                .map(i => ({ src: i.src, alt: i.alt }));
              return { winW, docW, bodyW, hasOverflow, culprits: culprits.slice(0, 4), brokenImages };
            })()
          `,
          returnByValue: true
        });

        const val = evalRes.result.value || {};
        const passed = !val.hasOverflow && val.brokenImages.length === 0 && consoleErrors.length === 0;
        const entry = {
          target: target.id,
          viewport: vp.name,
          width: vp.width,
          passed,
          docW: val.docW,
          winW: val.winW,
          delta: val.docW - val.winW,
          culprits: val.culprits || [],
          brokenImages: val.brokenImages || [],
          consoleErrors: [...consoleErrors]
        };
        results.push(entry);

        if (passed) {
          console.log(`  ✓ PASS [${vp.width}px]: scrollW=${val.docW}px, innerW=${val.winW}px`);
        } else {
          console.log(`  ✗ FAIL [${vp.width}px]: scrollW=${val.docW}px, innerW=${val.winW}px (delta: +${val.docW - val.winW}px)`);
          if (val.culprits && val.culprits.length > 0) {
            console.log(`     Culprits:`, JSON.stringify(val.culprits));
          }
          if (val.brokenImages && val.brokenImages.length > 0) {
            console.log(`     Broken images:`, JSON.stringify(val.brokenImages));
          }
          if (consoleErrors.length > 0) {
            console.log(`     Console errors:`, consoleErrors);
          }
        }
      }
    }

    // Also test file:// protocol
    console.log(`\n============================================================`);
    console.log(` AUDITING: file:// PROTOCOL FOR ALL PAGES`);
    console.log(`============================================================`);
    for (const target of TARGETS) {
      consoleErrors.length = 0;
      const fileUrl = `file:///${path.join(REPO_ROOT, target.path).replace(/\\/g, '/')}`;
      await pageCdp.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 800, deviceScaleFactor: 1, mobile: false });
      await pageCdp.send('Page.navigate', { url: fileUrl });
      await sleep(400);

      const fileRes = await pageCdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const docW = document.documentElement.scrollWidth;
            const winW = window.innerWidth;
            const brokenImages = Array.from(document.querySelectorAll('img'))
              .filter(i => !i.complete || i.naturalWidth === 0)
              .map(i => ({ src: i.src, alt: i.alt }));
            return { docW, winW, brokenImages };
          })()
        `,
        returnByValue: true
      });
      const val = fileRes.result.value || {};
      const passed = (val.docW <= val.winW) && val.brokenImages.length === 0 && consoleErrors.length === 0;
      console.log(`  ${passed ? '✓ PASS' : '✗ FAIL'} file:// ${target.name}: scrollW=${val.docW}px, brokenImgs=${val.brokenImages.length}, errors=${consoleErrors.length}`);
      if (consoleErrors.length > 0) console.log(`     Errors:`, consoleErrors);
    }

    pageCdp.close();
    browserCdp.close();
    await cleanup();
    fs.writeFileSync(path.join(REPO_ROOT, 'tests', 'audit_summary.json'), JSON.stringify(results, null, 2), 'utf-8');
    console.log('\n--- AUDIT COMPLETE: tests/audit_summary.json written ---');
  } catch (err) {
    console.error('Audit crashed:', err);
    await cleanup();
    process.exit(1);
  }
}

runAudit();
