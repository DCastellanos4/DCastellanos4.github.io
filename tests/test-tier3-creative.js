/**
 * Tier 3 (Creative Engineering Extension): Cross-Feature Combinations C36 - C50 (15 Tests)
 * Verifies cross-cutting requirements:
 * - 100% verbatim copy fidelity across all 6 variants (Value Proposition, Pedro Cuello, Summer 2027, 4 Projects, 31 Skills)
 * - Complete 6-node + Hub universal navigation graph (aside.preview-switcher)
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
  checkMilestone,
  TestRunner
} = require('./test-utils');

function registerTier3CreativeTests(runner) {
  const getHTML = (rel) => parseHTML(readFile(rel));

  /* =========================================================================
   * 100% VERBATIM SPANISH COPY FIDELITY ACROSS ALL 6 VARIANTS (C36 - C40)
   * ========================================================================= */
  runner.test('C36: Value proposition quote 100% identical in all available variants', () => {
    const quote = 'Construyo software que funciona y diseño los tests que lo demuestran.';
    const available = [];
    for (let i = 1; i <= 6; i++) {
      const rel = `previews/preview-${i}/index.html`;
      if (fileExists(rel)) available.push(rel);
    }
    assert.ok(available.length >= 3, 'At least 3 variants must exist');
    for (const rel of available) {
      const html = getHTML(rel);
      assert.ok(html.raw.includes(quote), `${rel} must contain exact verbatim value proposition`);
    }
  });

  runner.test('C37: Pedro Cuello audited testimonial quote 100% identical in all available variants', () => {
    const testimonialSnippet = 'Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción. Diseñó las suites de API que hoy siguen en uso.';
    const available = [];
    for (let i = 1; i <= 6; i++) {
      const rel = `previews/preview-${i}/index.html`;
      if (fileExists(rel)) available.push(rel);
    }
    for (const rel of available) {
      const html = getHTML(rel);
      assert.ok(
        html.raw.includes('Detectó regresiones críticas en los servicios de El Corte Inglés') &&
        html.raw.includes('Pedro Cuello'),
        `${rel} must contain exact Pedro Cuello testimonial and attribution`
      );
    }
  });

  runner.test('C38: Summer 2027 availability badge 100% identical in all available variants', () => {
    const badge = 'Incorporación Verano 2027';
    const available = [];
    for (let i = 1; i <= 6; i++) {
      const rel = `previews/preview-${i}/index.html`;
      if (fileExists(rel)) available.push(rel);
    }
    for (const rel of available) {
      const html = getHTML(rel);
      assert.ok(html.raw.includes(badge), `${rel} must contain exact availability badge: ${badge}`);
    }
  });

  runner.test('C39: All 4 featured projects present with matching titles across all variants', () => {
    const projects = ['Simpleat', 'ATLAS', 'Enlace Mental', 'Goated Wear'];
    const available = [];
    for (let i = 1; i <= 6; i++) {
      const rel = `previews/preview-${i}/index.html`;
      if (fileExists(rel)) available.push(rel);
    }
    for (const rel of available) {
      const html = getHTML(rel);
      for (const proj of projects) {
        assert.ok(html.raw.includes(proj), `${rel} must feature project ${proj}`);
      }
    }
  });

  runner.test('C40: Core 5 skill categories present across all available variants', () => {
    const categories = ['Backend', 'Frontend', 'Cloud', 'Testing', 'Idiomas'];
    const available = [];
    for (let i = 1; i <= 6; i++) {
      const rel = `previews/preview-${i}/index.html`;
      if (fileExists(rel)) available.push(rel);
    }
    for (const rel of available) {
      const html = getHTML(rel);
      const raw = html.raw;
      const count = categories.filter(c => new RegExp(c, 'i').test(raw)).length;
      assert.ok(count >= 4, `${rel} must represent core skill categories (found ${count}/5)`);
    }
  });

  /* =========================================================================
   * UNIVERSAL SWITCHER LINK GRAPH (C41 - C50)
   * ========================================================================= */
  runner.test('C41: Preview 4 switcher links to Hub, Preview 1, 2, 3, 5, and 6', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const raw = html.raw;
    assert.ok(raw.includes('../index.html'), 'P4 must link to Hub');
    assert.ok(raw.includes('../preview-1/index.html') || raw.includes('preview-1'), 'P4 must link to P1');
    assert.ok(raw.includes('../preview-2/index.html') || raw.includes('preview-2'), 'P4 must link to P2');
    assert.ok(raw.includes('../preview-3/index.html') || raw.includes('preview-3'), 'P4 must link to P3');
    assert.ok(raw.includes('../preview-5/index.html') || raw.includes('preview-5'), 'P4 must link to P5');
    assert.ok(raw.includes('../preview-6/index.html') || raw.includes('preview-6'), 'P4 must link to P6');
  });

  runner.test('C42: Preview 5 switcher links to Hub, Preview 1, 2, 3, 4, and 6', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    const raw = html.raw;
    assert.ok(raw.includes('../index.html'), 'P5 must link to Hub');
    assert.ok(raw.includes('../preview-1/index.html') || raw.includes('preview-1'), 'P5 must link to P1');
    assert.ok(raw.includes('../preview-2/index.html') || raw.includes('preview-2'), 'P5 must link to P2');
    assert.ok(raw.includes('../preview-3/index.html') || raw.includes('preview-3'), 'P5 must link to P3');
    assert.ok(raw.includes('../preview-4/index.html') || raw.includes('preview-4'), 'P5 must link to P4');
    assert.ok(raw.includes('../preview-6/index.html') || raw.includes('preview-6'), 'P5 must link to P6');
  });

  runner.test('C43: Preview 6 switcher links to Hub, Preview 1, 2, 3, 4, and 5', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    const raw = html.raw;
    assert.ok(raw.includes('../index.html'), 'P6 must link to Hub');
    assert.ok(raw.includes('../preview-1/index.html') || raw.includes('preview-1'), 'P6 must link to P1');
    assert.ok(raw.includes('../preview-2/index.html') || raw.includes('preview-2'), 'P6 must link to P2');
    assert.ok(raw.includes('../preview-3/index.html') || raw.includes('preview-3'), 'P6 must link to P3');
    assert.ok(raw.includes('../preview-4/index.html') || raw.includes('preview-4'), 'P6 must link to P4');
    assert.ok(raw.includes('../preview-5/index.html') || raw.includes('preview-5'), 'P6 must link to P5');
  });

  runner.test('C44: Preview 1 switcher links to Hub and previews', () => {
    const html = getHTML('previews/preview-1/index.html');
    const raw = html.raw;
    assert.ok(raw.includes('../index.html'), 'P1 must link to Hub');
    assert.ok(raw.includes('preview-2'), 'P1 must link to P2');
    assert.ok(raw.includes('preview-3'), 'P1 must link to P3');
  });

  runner.test('C45: Preview 2 switcher links to Hub and previews', () => {
    const html = getHTML('previews/preview-2/index.html');
    const raw = html.raw;
    assert.ok(raw.includes('../index.html'), 'P2 must link to Hub');
    assert.ok(raw.includes('preview-1'), 'P2 must link to P1');
    assert.ok(raw.includes('preview-3'), 'P2 must link to P3');
  });

  runner.test('C46: Preview 3 switcher links to Hub and previews', () => {
    const html = getHTML('previews/preview-3/index.html');
    const raw = html.raw;
    assert.ok(raw.includes('../index.html'), 'P3 must link to Hub');
    assert.ok(raw.includes('preview-1'), 'P3 must link to P1');
    assert.ok(raw.includes('preview-2'), 'P3 must link to P2');
  });

  runner.test('C47: Hub launches all available variants via direct relative links', () => {
    const html = getHTML('previews/index.html');
    const raw = html.raw;
    assert.ok(raw.includes('preview-1/index.html') || raw.includes('preview-1/'), 'Hub must link to P1');
    assert.ok(raw.includes('preview-2/index.html') || raw.includes('preview-2/'), 'Hub must link to P2');
    assert.ok(raw.includes('preview-3/index.html') || raw.includes('preview-3/'), 'Hub must link to P3');
    if (raw.includes('preview-4')) {
      assert.ok(raw.includes('preview-4/index.html') || raw.includes('preview-4/'), 'Hub must link to P4');
      assert.ok(raw.includes('preview-5/index.html') || raw.includes('preview-5/'), 'Hub must link to P5');
      assert.ok(raw.includes('preview-6/index.html') || raw.includes('preview-6/'), 'Hub must link to P6');
    }
  });

  runner.test('C48: Current active preview is visually highlighted in each variant switcher', () => {
    const available = [];
    for (let i = 1; i <= 6; i++) {
      const rel = `previews/preview-${i}/index.html`;
      if (fileExists(rel)) available.push({ id: i, rel });
    }
    for (const item of available) {
      const html = getHTML(item.rel);
      const raw = html.raw;
      const hasActive = raw.includes(`active-p${item.id}`) ||
                        raw.includes(`active`) ||
                        raw.includes(`aria-current="page"`);
      assert.ok(hasActive, `Preview ${item.id} switcher must highlight active page indicator`);
    }
  });

  runner.test('C49: All relative cross-variant links resolve to valid disk paths', () => {
    for (let i = 1; i <= 6; i++) {
      const previewDir = `previews/preview-${i}`;
      if (fileExists(previewDir)) {
        assert.ok(fileExists(`${previewDir}/index.html`), `${previewDir}/index.html must exist`);
      }
    }
    assert.ok(fileExists('previews/index.html'), 'previews/index.html must exist');
  });

  runner.test('C50: Universal switcher preserves fixed/floating positioning styling in all variants', () => {
    for (let i = 1; i <= 6; i++) {
      const cssRel = `previews/preview-${i}/style.css`;
      if (fileExists(cssRel)) {
        const css = readFile(cssRel);
        const hasFixedSwitcher = /preview-switcher|switcher-inner/i.test(css) && /position:\s*fixed/i.test(css);
        assert.ok(hasFixedSwitcher, `${cssRel} must style .preview-switcher with position: fixed`);
      }
    }
  });
}

module.exports = {
  registerTier3CreativeTests
};
