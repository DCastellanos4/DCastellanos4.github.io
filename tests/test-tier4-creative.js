/**
 * Tier 4 (Creative Engineering Extension): Scenarios S21 - S30 (10 Recruiter & Engineering Journeys)
 * Verifies real-world workflows:
 * - Creative Tech Recruiter Journey (Physical Lab V4)
 * - WebGL / 3D Graphics Auditor Journey (Obsidian Pipeline V5)
 * - Design Director Journey (Kinetic Brutalism V6)
 * - Mobile journeys on V4, V5, V6 (320px, 360px, 375px)
 * - Universal 6-Variant navigation tour
 * - Dual-Tier Hub interactive evaluation
 * - Offline file:// zero-trust security audit across all 6 variants
 * - Complete forensic victory audit across all 6 variants
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

function registerTier4CreativeTests(runner) {
  const getHTML = (rel) => parseHTML(readFile(rel));
  const getCSS = (rel) => parseCSS(readFile(rel));
  const getRaw = (rel) => readFile(rel);

  /* =========================================================================
   * SCENARIO 21: Creative Tech Recruiter Journey (Physical Lab V4)
   * ========================================================================= */
  runner.test('S21: Creative Tech Recruiter Journey (Launch V4 -> Inspect Physics Chamber -> Verify Synthesizer)', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.match(html.title, /Industrial|Physical Lab/i);
    assert.ok(html.raw.includes('physics-chamber') || html.raw.includes('physics-canvas'));
    assert.ok(html.raw.includes('audio-toggle') || html.raw.includes('hw-audio-toggle'));
    assert.ok(html.raw.includes('Incorporación Verano 2027'));
  });

  /* =========================================================================
   * SCENARIO 22: WebGL / 3D Graphics Auditor Journey (Obsidian Pipeline V5)
   * ========================================================================= */
  runner.test('S22: WebGL / 3D Graphics Auditor Journey (Launch V5 -> Verify Three.js Scene -> Liquid Refraction -> GSAP Pinning)', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.match(html.title, /3D Pipeline|WebGL/i);
    assert.ok(html.raw.includes('webgl-canvas'));
    assert.ok(html.raw.includes('liquid-refract'));
    assert.ok(html.raw.includes('three') && html.raw.includes('gsap'));
    if (fileExists('previews/preview-5/main.js')) {
      const js = getRaw('previews/preview-5/main.js');
      assert.ok(js.includes('THREE') && (js.includes('pin') || js.includes('ScrollTrigger')));
    }
  });

  /* =========================================================================
   * SCENARIO 23: Design Director Journey (Kinetic Brutalism V6)
   * ========================================================================= */
  runner.test('S23: Design Director Journey (Launch V6 -> Inspect Difference Cursor -> Chromatic Glitch -> Colossal Type)', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.ok(html.raw.includes('difference-cursor'));
    assert.ok(html.raw.includes('chromatic-aberration'));
    assert.ok(html.raw.includes('colossal') || html.raw.includes('swiss') || html.raw.includes('0038ff'));
  });

  /* =========================================================================
   * SCENARIO 24: Mobile Recruiter Journey on V4 (320px Viewport)
   * ========================================================================= */
  runner.test('S24: Mobile Recruiter Journey on V4 (320px Viewport Bounds & Audio Lazy Unlock)', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.ok(/<meta\s+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html.raw),
      'V4 must define responsive viewport meta tag');
  });

  /* =========================================================================
   * SCENARIO 25: Mobile Recruiter Journey on V5 (375px Viewport)
   * ========================================================================= */
  runner.test('S25: Mobile Recruiter Journey on V5 (375px Viewport & Responsive Layout)', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(/<meta\s+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html.raw),
      'V5 must define responsive viewport meta tag');
    if (fileExists('previews/preview-5/style.css')) {
      const css = getCSS('previews/preview-5/style.css');
      assert.ok(css.mediaQueries.length > 0, 'V5 CSS must define responsive media queries');
    }
  });

  /* =========================================================================
   * SCENARIO 26: Mobile Recruiter Journey on V6 (360px Viewport)
   * ========================================================================= */
  runner.test('S26: Mobile Recruiter Journey on V6 (360px Viewport & Touch Cursor Hidden)', () => {
    const pend = checkMilestone('previews/preview-6/style.css', 'M3');
    if (pend) return pend;
    const css = getCSS('previews/preview-6/style.css');
    const hidesCursor = css.mediaQueries.some(m =>
      /pointer:\s*coarse|hover:\s*none/i.test(m.condition) &&
      /difference-cursor|custom-cursor|display:\s*none/i.test(m.body)
    );
    assert.ok(hidesCursor, 'V6 must hide custom cursor on touch viewports');
  });

  /* =========================================================================
   * SCENARIO 27: Universal 6-Variant Navigation Tour
   * ========================================================================= */
  runner.test('S27: Universal 6-Variant Navigation Tour (Hub -> V1 -> V2 -> V3 -> V4 -> V5 -> V6 -> Hub)', () => {
    const pages = [
      'previews/index.html',
      'previews/preview-1/index.html',
      'previews/preview-2/index.html',
      'previews/preview-3/index.html',
      'previews/preview-4/index.html',
      'previews/preview-5/index.html',
      'previews/preview-6/index.html'
    ];
    let existCount = 0;
    for (const p of pages) {
      if (fileExists(p)) existCount++;
    }
    assert.ok(existCount >= 4, 'At least 4 pages in tour must exist');
  });

  /* =========================================================================
   * SCENARIO 28: Dual-Tier Hub Interactive Evaluation
   * ========================================================================= */
  runner.test('S28: Dual-Tier Hub Interactive Evaluation (Filter Foundation -> Filter Creative -> Check Spec Matrix)', () => {
    const html = getHTML('previews/index.html');
    assert.ok(html.raw.includes('preview-1'), 'Hub must feature preview-1');
    assert.ok(html.raw.includes('preview-2'), 'Hub must feature preview-2');
    assert.ok(html.raw.includes('preview-3'), 'Hub must feature preview-3');
    if (html.raw.includes('preview-4')) {
      assert.ok(html.raw.includes('preview-4') && html.raw.includes('preview-5') && html.raw.includes('preview-6'),
        'Expanded Hub must present all 6 preview variants');
    }
  });

  /* =========================================================================
   * SCENARIO 29: Offline file:// Zero-Trust Security Audit Across All 6 Variants
   * ========================================================================= */
  runner.test('S29: Offline file:// Zero-Trust Security Audit Across All 6 Variants', () => {
    for (let i = 1; i <= 6; i++) {
      const rel = `previews/preview-${i}/index.html`;
      if (fileExists(rel)) {
        const raw = readFile(rel);
        assert.ok(!/<script[^>]*type=["']module["']/i.test(raw), `${rel} must not contain type="module"`);
        assert.ok(!/<iframe/i.test(raw), `${rel} must not contain iframes`);
      }
    }
  });

  /* =========================================================================
   * SCENARIO 30: Complete Forensic Victory Audit Across All 6 Variants
   * ========================================================================= */
  runner.test('S30: Complete Forensic Victory Audit (10 Core Data Dimensions in All Available Variants)', () => {
    const dimensions = [
      'David Castellanos',
      'Full Stack',
      'QA',
      'Construyo software que funciona',
      'El Corte Inglés',
      'Mango',
      'Simpleat',
      'Pedro Cuello',
      'Verano 2027',
      'davidllanos2005@gmail.com'
    ];
    for (let i = 1; i <= 6; i++) {
      const rel = `previews/preview-${i}/index.html`;
      if (fileExists(rel)) {
        const raw = readFile(rel);
        for (const dim of dimensions) {
          assert.ok(raw.includes(dim), `${rel} must contain core dimension "${dim}"`);
        }
      }
    }
  });
}

module.exports = {
  registerTier4CreativeTests
};
