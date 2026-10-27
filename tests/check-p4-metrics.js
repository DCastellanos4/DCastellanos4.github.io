const http = require('node:http');
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const REPO_ROOT = path.resolve(__dirname, '..');
const HTTP_PORT = 9892;

function startStaticServer(root, port) {
  const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
  const s = http.createServer((req, res) => {
    const fp = path.join(root, req.url.split('?')[0]);
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'text/plain', 'Access-Control-Allow-Origin': '*' });
      fs.createReadStream(fp).pipe(res);
    } else {
      res.statusCode = 404; res.end();
    }
  });
  return new Promise(r => s.listen(port, () => r(s)));
}

async function test() {
  const server = await startStaticServer(REPO_ROOT, HTTP_PORT);
  const p = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9345', '--user-data-dir=' + path.join(os.tmpdir(), 'edge_chk_' + Date.now()), 'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const ver = await new Promise((res, rej) => http.get('http://127.0.0.1:9345/json/version', r => { let d=''; r.on('data', c=>d+=c); r.on('end', ()=>res(JSON.parse(d))); }));
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  function send(m, params={}) {
    return new Promise(res => {
      const id = Math.floor(Math.random()*10000);
      ws.onmessage = e => { const d = JSON.parse(e.data); if (d.id === id) res(d.result); };
      ws.send(JSON.stringify({ id, method: m, params }));
    });
  }
  const targets = await send('Target.getTargets');
  const pageTarget = targets.targetInfos.find(t => t.type === 'page');
  const pageWs = new WebSocket('ws://127.0.0.1:9345/devtools/page/' + pageTarget.targetId);
  await new Promise(r => pageWs.onopen = r);
  function sendPage(m, params={}) {
    return new Promise(res => {
      const id = Math.floor(Math.random()*10000);
      pageWs.onmessage = e => { const d = JSON.parse(e.data); if (d.id === id) res(d.result); };
      pageWs.send(JSON.stringify({ id, method: m, params }));
    });
  }
  await sendPage('Page.enable');
  await sendPage('Runtime.enable');
  const ALL_PAGES = [
    { id: 'hub', path: 'previews/index.html' },
    { id: 'p1', path: 'previews/preview-1/index.html' },
    { id: 'p2', path: 'previews/preview-2/index.html' },
    { id: 'p3', path: 'previews/preview-3/index.html' },
    { id: 'p4', path: 'previews/preview-4/index.html' },
    { id: 'p5', path: 'previews/preview-5/index.html' },
    { id: 'p6', path: 'previews/preview-6/index.html' }
  ];
  const VIEWPORTS = [320, 360, 375, 414, 480, 600, 768, 992, 1024, 1200, 1440, 1920, 3840];

  const pageFailures = {};

  for (const page of ALL_PAGES) {
    pageFailures[page.id] = [];
    for (const w of VIEWPORTS) {
      await sendPage('Emulation.setDeviceMetricsOverride', { width: w, height: 700, deviceScaleFactor: 1, mobile: w <= 768 });
      await sendPage('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/${page.path}` });
      await new Promise(r => setTimeout(r, 250));
      const res = await sendPage('Runtime.evaluate', {
        expression: `
          (() => {
            const winW = window.innerWidth;
            const docW = document.documentElement.scrollWidth;
            const bodyW = document.body ? document.body.scrollWidth : 0;
            const over = (docW > winW || bodyW > winW);
            return { winW, docW, bodyW, over, delta: Math.max(0, docW - winW, bodyW - winW) };
          })()
        `,
        returnByValue: true
      });
      const v = res.result.value;
      if (v.over) {
        pageFailures[page.id].push({ w, delta: v.delta, docW: v.docW, bodyW: v.bodyW });
      }
    }
    console.log(`Page ${page.id}: ${pageFailures[page.id].length === 0 ? 'ALL 13 BREAKPOINTS PASS' : 'FAILED: ' + JSON.stringify(pageFailures[page.id])}`);
  }
  p.kill();
  server.close();
}
test().catch(console.error);
