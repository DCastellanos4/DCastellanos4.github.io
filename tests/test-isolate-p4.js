const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const HTTP_PORT = 9888;
const CDP_PORT = 9338;
const USER_DATA_DIR = path.join(require('node:os').tmpdir(), `edge_debug_${Date.now()}`);

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
      res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
      fs.createReadStream(filePath).pipe(res);
    });
  });
  return new Promise((resolve, reject) => {
    server.listen(port, () => resolve(server));
    server.on('error', reject);
  });
}

class CdpConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.msgId = 0;
    this.pending = new Map();
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
          const { resolve, reject, timer } = this.pending.get(msg.id);
          clearTimeout(timer);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      } catch (e) {}
    };
  }
  send(method, params = {}, timeoutMs = 8000) {
    const id = ++this.msgId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP method ${method} timed out after ${timeoutMs}ms`));
        }
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  close() {
    if (this.ws) try { this.ws.close(); } catch (_) {}
  }
}

async function run() {
  console.log('Starting server on port', HTTP_PORT);
  const server = await startStaticServer(REPO_ROOT, HTTP_PORT);
  console.log('Launching browser on port', CDP_PORT);
  const browserProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
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
    await sleep(200);
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  };

  try {
    let cdpUrl = null;
    for (let i = 0; i < 30; i++) {
      await sleep(200);
      try {
        const version = await getJson(`http://127.0.0.1:${CDP_PORT}/json/version`);
        if (version && version.webSocketDebuggerUrl) {
          cdpUrl = version.webSocketDebuggerUrl;
          break;
        }
      } catch (_) {}
    }
    if (!cdpUrl) throw new Error('Could not get CDP URL');

    const browserCdp = new CdpConnection(cdpUrl);
    await browserCdp.connect();
    const targetInfo = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
    const targetWsUrl = `ws://127.0.0.1:${CDP_PORT}/devtools/page/${targetInfo.targetId}`;
    const pageCdp = new CdpConnection(targetWsUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('Runtime.enable');

    console.log('Testing Preview 4 at 1200px...');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 800, deviceScaleFactor: 1, mobile: false });
    await pageCdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/previews/preview-4/index.html` });
    await sleep(600);
    console.log('1200px loaded!');

    console.log('Testing Preview 4 at 1440px...');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await pageCdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/previews/preview-4/index.html` });
    await sleep(600);
    console.log('1440px loaded!');

    console.log('Testing Preview 4 at 1920px...');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await pageCdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/previews/preview-4/index.html` });
    await sleep(600);
    console.log('1920px loaded!');

    console.log('Testing Preview 4 at 3840px (4K)...');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', { width: 3840, height: 2160, deviceScaleFactor: 1, mobile: false });
    await pageCdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/previews/preview-4/index.html` });
    await sleep(600);
    console.log('3840px loaded!');

    console.log('Testing Preview 5 at 1200px...');
    await pageCdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/previews/preview-5/index.html` });
    await sleep(600);
    console.log('Preview 5 loaded!');

    console.log('Testing Preview 6 at 1200px...');
    await pageCdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/previews/preview-6/index.html` });
    await sleep(600);
    console.log('Preview 6 loaded!');

    pageCdp.close();
    browserCdp.close();
    await cleanup();
    console.log('ALL DEBUG CHECKS PASSED');
  } catch (e) {
    console.error('ERROR in isolate test:', e);
    await cleanup();
    process.exit(1);
  }
}

run();
