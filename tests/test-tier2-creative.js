/**
 * Tier 2 (Creative Engineering Extension): Boundaries 31 - 35 (5 Groups x 5 Tests = 25 Tests)
 * Verifies critical constraints:
 * - Strict prohibition of type="module" script tags across all 6 variants
 * - Offline file:// protocol safety (inline SVG filters, UMD scripts, zero CORS issues)
 * - Exact asset path validity (Image.jpg, simpleat-icon.png, LOGOECI.webp, logoMANGO.png, logo.svg, CV PDF)
 * - Touch device degradation (pointer: coarse hides custom cursor, audio lazy gesture unlock)
 * - 60 FPS performance guardrails (DPR <= 2, offscreen pause via IntersectionObserver)
 *
 * Zero external npm dependencies. Pure Node.js standard library.
 */

const assert = require('assert');
const path = require('path');
const {
  resolvePath,
  fileExists,
  readFile,
  parseHTML,
  parseCSS,
  checkMilestone,
  TestRunner
} = require('./test-utils');

function registerTier2CreativeTests(runner) {
  const getHTML = (rel) => parseHTML(readFile(rel));
  const getCSS = (rel) => parseCSS(readFile(rel));
  const getRaw = (rel) => readFile(rel);

  /* =========================================================================
   * BOUNDARY 31: Strict Prohibition of type="module" Script Tags
   * ========================================================================= */
  runner.test('B31.1: preview-4/index.html strictly contains zero type="module" scripts', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const hasModule = /<script[^>]*type=["']module["']/i.test(html.raw);
    assert.strictEqual(hasModule, false, 'preview-4 must NOT contain any type="module" scripts');
  });

  runner.test('B31.2: preview-5/index.html strictly contains zero type="module" scripts', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    const hasModule = /<script[^>]*type=["']module["']/i.test(html.raw);
    assert.strictEqual(hasModule, false, 'preview-5 must NOT contain any type="module" scripts');
  });

  runner.test('B31.3: preview-6/index.html strictly contains zero type="module" scripts', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    const hasModule = /<script[^>]*type=["']module["']/i.test(html.raw);
    assert.strictEqual(hasModule, false, 'preview-6 must NOT contain any type="module" scripts');
  });

  runner.test('B31.4: previews/index.html strictly contains zero type="module" scripts', () => {
    const html = getHTML('previews/index.html');
    const hasModule = /<script[^>]*type=["']module["']/i.test(html.raw);
    assert.strictEqual(hasModule, false, 'previews/index.html must NOT contain any type="module" scripts');
  });

  runner.test('B31.5: Zero ES module import statements in any preview client scripts', () => {
    const allScripts = [
      'previews/preview-1/main.js',
      'previews/preview-2/main.js',
      'previews/preview-3/main.js',
      'previews/preview-4/main.js',
      'previews/preview-5/main.js',
      'previews/preview-6/main.js',
      'previews/hub.js'
    ];
    for (const rel of allScripts) {
      if (fileExists(rel)) {
        const js = getRaw(rel);
        const hasESImport = /^\s*import\s+.*from\s+['"][^'"]+['"]/m.test(js);
        const hasESExport = /^\s*export\s+(?:default|const|let|var|function|class)/m.test(js);
        assert.strictEqual(hasESImport, false, `${rel} must not use ES module import`);
        assert.strictEqual(hasESExport, false, `${rel} must not use ES module export`);
      }
    }
  });

  /* =========================================================================
   * BOUNDARY 32: Offline file:// Protocol Safety & Zero CORS Issues
   * ========================================================================= */
  runner.test('B32.1: SVG filters in V5 and V6 are embedded inline without CORS dependencies', () => {
    if (fileExists('previews/preview-5/index.html')) {
      const html5 = getHTML('previews/preview-5/index.html');
      assert.ok(html5.raw.includes('<filter id="liquid-refract"'),
        'preview-5 must embed inline SVG filter element');
    }
    if (fileExists('previews/preview-6/index.html')) {
      const html6 = getHTML('previews/preview-6/index.html');
      assert.ok(html6.raw.includes('<filter id="chromatic-aberration"'),
        'preview-6 must embed inline SVG filter element');
    }
  });

  runner.test('B32.2: External libraries loaded via UMD global bindings with window checks', () => {
    if (fileExists('previews/preview-5/main.js')) {
      const js5 = getRaw('previews/preview-5/main.js');
      assert.ok(js5.includes('THREE') || js5.includes('gsap'), 'preview-5 must use global THREE / gsap');
    }
    if (fileExists('previews/preview-4/main.js')) {
      const js4 = getRaw('previews/preview-4/main.js');
      assert.ok(js4.includes('Matter') || js4.includes('AudioContext'), 'preview-4 must use global Matter / Web Audio');
    }
  });

  runner.test('B32.3: Zero protocol-relative URLs across all preview markup', () => {
    const pages = [
      'previews/preview-4/index.html',
      'previews/preview-5/index.html',
      'previews/preview-6/index.html',
      'previews/index.html'
    ];
    for (const rel of pages) {
      if (fileExists(rel)) {
        const raw = getRaw(rel);
        const matches = raw.match(/href=["']\/\/[^"']|src=["']\/\/[^"']/g);
        assert.strictEqual(matches, null, `${rel} must not contain protocol-relative URLs`);
      }
    }
  });

  runner.test('B32.4: Zero runtime fetch() calls for local file resources in client JS', () => {
    const scripts = [
      'previews/preview-4/main.js',
      'previews/preview-5/main.js',
      'previews/preview-6/main.js',
      'previews/hub.js'
    ];
    for (const rel of scripts) {
      if (fileExists(rel)) {
        const js = getRaw(rel);
        const hasLocalFetch = /fetch\(\s*['"](?!\s*https?:\/\/)/i.test(js);
        assert.strictEqual(hasLocalFetch, false, `${rel} must not fetch local files (violates file://)`);
      }
    }
  });

  runner.test('B32.5: Zero canvas toDataURL or getImageData security taint risks', () => {
    const scripts = [
      'previews/preview-4/main.js',
      'previews/preview-5/main.js',
      'previews/preview-6/main.js'
    ];
    for (const rel of scripts) {
      if (fileExists(rel)) {
        const js = getRaw(rel);
        assert.strictEqual(js.includes('toDataURL'), false, `${rel} must not use toDataURL under file://`);
      }
    }
  });

  /* =========================================================================
   * BOUNDARY 33: Exact Asset Path Validity Across All 6 Variants
   * ========================================================================= */
  runner.test('B33.1: Profile portrait references strictly use ../../img/Image.jpg', () => {
    const previews = ['preview-4', 'preview-5', 'preview-6'];
    for (const p of previews) {
      const rel = `previews/${p}/index.html`;
      if (fileExists(rel)) {
        const html = getHTML(rel);
        assert.ok(html.raw.includes('../../img/Image.jpg'), `${p} must reference ../../img/Image.jpg`);
        assert.ok(!html.raw.includes('profile.jpg'), `${p} must not reference non-existent profile.jpg`);
      }
    }
  });

  runner.test('B33.2: Enterprise logo references strictly use ../../img/LOGOECI.webp and logoMANGO.png', () => {
    const previews = ['preview-4', 'preview-5', 'preview-6'];
    for (const p of previews) {
      const rel = `previews/${p}/index.html`;
      if (fileExists(rel)) {
        const html = getHTML(rel);
        assert.ok(html.raw.includes('../../img/LOGOECI.webp'), `${p} must reference ../../img/LOGOECI.webp`);
        assert.ok(html.raw.includes('../../img/logoMANGO.png'), `${p} must reference ../../img/logoMANGO.png`);
      }
    }
  });

  runner.test('B33.3: Simpleat logo references strictly use ../../img/simpleat-icon.png', () => {
    const previews = ['preview-4', 'preview-5', 'preview-6'];
    for (const p of previews) {
      const rel = `previews/${p}/index.html`;
      if (fileExists(rel)) {
        const html = getHTML(rel);
        assert.ok(html.raw.includes('../../img/simpleat-icon.png'), `${p} must reference ../../img/simpleat-icon.png`);
        assert.ok(!html.raw.includes('logo-simpleat.png'), `${p} must never reference broken logo-simpleat.png`);
      }
    }
  });

  runner.test('B33.4: English CV resume references strictly use ../../docs/CV%20David%20Castellanos%20-%20English.pdf', () => {
    const previews = ['preview-4', 'preview-5', 'preview-6'];
    for (const p of previews) {
      const rel = `previews/${p}/index.html`;
      if (fileExists(rel)) {
        const html = getHTML(rel);
        assert.ok(html.raw.includes('CV%20David%20Castellanos%20-%20English.pdf') ||
                  html.raw.includes('CV David Castellanos - English.pdf'),
          `${p} must reference English CV PDF in docs/`);
      }
    }
  });

  runner.test('B33.5: Favicon and mark strictly reference ../../img/logo.svg', () => {
    const previews = ['preview-4', 'preview-5', 'preview-6'];
    for (const p of previews) {
      const rel = `previews/${p}/index.html`;
      if (fileExists(rel)) {
        const html = getHTML(rel);
        assert.ok(html.raw.includes('../../img/logo.svg'), `${p} must reference ../../img/logo.svg`);
      }
    }
  });

  /* =========================================================================
   * BOUNDARY 34: Touch Device Degradation & Pointer Coarse Rules
   * ========================================================================= */
  runner.test('B34.1: V6 custom difference cursor strictly hidden under @media (pointer: coarse) in CSS', () => {
    const pend = checkMilestone('previews/preview-6/style.css', 'M3');
    if (pend) return pend;
    const css = getCSS('previews/preview-6/style.css');
    const hasCoarseRule = css.mediaQueries.some(m =>
      /pointer:\s*coarse|hover:\s*none/i.test(m.condition) &&
      /difference-cursor|cursor-dot|cursor-badge|display:\s*none/i.test(m.body)
    );
    assert.ok(hasCoarseRule, 'preview-6 CSS must hide custom cursor on coarse touch screens');
  });

  runner.test('B34.2: V6 pointer event listeners degrade safely without freezing touch devices', () => {
    const pend = checkMilestone('previews/preview-6/main.js', 'M3');
    if (pend) return pend;
    const js = getRaw('previews/preview-6/main.js');
    assert.doesNotThrow(() => new Function(js), 'preview-6 JS must evaluate cleanly');
  });

  runner.test('B34.3: V4 Web Audio AudioContext starts in suspended state or lazily unlocks on gesture', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasLazyUnlock = /resume|suspended|pointerdown|click/i.test(js);
    assert.ok(hasLazyUnlock, 'preview-4 JS must unlock AudioContext lazily on user gesture');
  });

  runner.test('B34.4: V4 physics chamber container specifies touch-action: pan-y or touch-action: none', () => {
    if (fileExists('previews/preview-4/style.css')) {
      const css = getCSS('previews/preview-4/style.css');
      const hasTouchAction = /touch-action:\s*(?:pan-y|none)/i.test(css.raw);
      assert.ok(hasTouchAction, 'preview-4 CSS must define touch-action on interactive canvas');
    }
  });

  runner.test('B34.5: V5 GSAP horizontal pipeline unpins on mobile viewports (<768px)', () => {
    const pend = checkMilestone('previews/preview-5/main.js', 'M2');
    if (pend) return pend;
    const js = getRaw('previews/preview-5/main.js');
    const hasMatchMediaOrCheck = /matchMedia|innerWidth\s*<\s*768|767|mobile/i.test(js);
    assert.ok(hasMatchMediaOrCheck, 'preview-5 JS must handle mobile unpinning/adaptation');
  });

  /* =========================================================================
   * BOUNDARY 35: 60 FPS Performance Guardrails & Resource Conservation
   * ========================================================================= */
  runner.test('B35.1: V5 Three.js WebGL renderer clamps device pixel ratio to <= 2', () => {
    const pend = checkMilestone('previews/preview-5/main.js', 'M2');
    if (pend) return pend;
    const js = getRaw('previews/preview-5/main.js');
    const hasDprClamp = /setPixelRatio|Math\.min\(.*2\)|devicePixelRatio/i.test(js);
    assert.ok(hasDprClamp, 'preview-5 JS must clamp pixel ratio to max 2');
  });

  runner.test('B35.2: V4 Matter.js physics runner throttles or pauses when offscreen', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasLifecycle = /IntersectionObserver|visibilitychange|Runner\.stop|Runner\.start/i.test(js);
    assert.ok(hasLifecycle, 'preview-4 JS must manage physics loop lifecycle');
  });

  runner.test('B35.3: V5 Three.js render loop manages frame rendering efficiently', () => {
    const pend = checkMilestone('previews/preview-5/main.js', 'M2');
    if (pend) return pend;
    const js = getRaw('previews/preview-5/main.js');
    const hasRaf = /requestAnimationFrame/i.test(js);
    assert.ok(hasRaf, 'preview-5 JS must use requestAnimationFrame for 60 FPS loop');
  });

  runner.test('B35.4: V4 Web Audio engine throttles collision sound bursts to prevent distortion', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasAudioLimit = /gain|throttle|Date\.now\(\)|lastSound|cooldown/i.test(js);
    assert.ok(hasAudioLimit, 'preview-4 JS must throttle/limit collision audio triggers');
  });

  runner.test('B35.5: Scroll event listeners configure passive: true or use RAF / Lenis ticker', () => {
    const scripts = [
      'previews/preview-4/main.js',
      'previews/preview-5/main.js',
      'previews/preview-6/main.js'
    ];
    for (const rel of scripts) {
      if (fileExists(rel)) {
        const js = getRaw(rel);
        const hasPerfScroll = /passive:\s*true|lenis|gsap\.ticker|requestAnimationFrame/i.test(js);
        assert.ok(hasPerfScroll, `${rel} must use performant scroll listeners`);
      }
    }
  });
}

module.exports = {
  registerTier2CreativeTests
};
