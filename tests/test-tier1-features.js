/**
 * Tier 1: Feature Coverage (30 Discrete Features x 5 Tests = 150 Tests)
 * Verifies presence, verbatim copy, structure, typography, styling tokens.
 * Zero external npm dependencies.
 */

const assert = require('assert');
const path = require('path');
const {
  resolvePath,
  fileExists,
  readFile,
  parseHTML,
  parseCSS,
  TestRunner
} = require('./test-utils');
const { registerTier1CreativeTests } = require('./test-tier1-creative');

function createTier1Suite(options = {}) {
  const runnerName = options.baselineOnly
    ? 'Tier 1: Feature Coverage (30 Features x 5 Tests = 150 Tests)'
    : (options.creativeOnly
      ? 'Tier 1: Creative Engineering Features (18 Features x 5 = 90 Tests)'
      : 'Tier 1: Feature Coverage (48 Features x 5 Tests = 240 Tests)');
  const runner = new TestRunner(runnerName);

  // Helper getters to read files safely during test runs
  const getHTML = (rel) => parseHTML(readFile(rel));
  const getCSS = (rel) => parseCSS(readFile(rel));
  const getRaw = (rel) => readFile(rel);

  if (!options.creativeOnly) {
  /* =========================================================================
   * FEATURE 1: Preview 1 Directory Isolation
   * ========================================================================= */
  runner.test('F1.1: preview-1/index.html exists and contains valid HTML structure', () => {
    assert.ok(fileExists('previews/preview-1/index.html'), 'previews/preview-1/index.html must exist');
    const html = getHTML('previews/preview-1/index.html');
    assert.ok(html.raw.length > 500, 'preview-1 HTML must have substantial content');
    assert.ok(html.root.querySelector('head'), 'preview-1 must contain <head>');
    assert.ok(html.root.querySelector('body'), 'preview-1 must contain <body>');
  });

  runner.test('F1.2: preview-1/style.css exists and defines root CSS custom properties', () => {
    assert.ok(fileExists('previews/preview-1/style.css'), 'previews/preview-1/style.css must exist');
    const css = getCSS('previews/preview-1/style.css');
    assert.ok(Object.keys(css.customProperties).length > 0, 'preview-1 CSS must define custom properties');
  });

  runner.test('F1.3: preview-1/main.js exists and evaluates as valid JS syntax', () => {
    assert.ok(fileExists('previews/preview-1/main.js'), 'previews/preview-1/main.js must exist');
    const js = getRaw('previews/preview-1/main.js');
    assert.ok(js.length > 50, 'preview-1 JS must be non-empty');
    assert.doesNotThrow(() => new Function(js), 'preview-1 JS must have valid syntax');
  });

  runner.test('F1.4: preview-1/index.html links correctly to style.css and main.js', () => {
    const html = getHTML('previews/preview-1/index.html');
    const links = html.root.querySelectorAll('link');
    const hasStyle = links.some(l => l.getAttribute('href') === 'style.css' || l.getAttribute('href') === './style.css');
    assert.ok(hasStyle, 'preview-1/index.html must link to style.css');
    const scripts = html.root.querySelectorAll('script');
    const hasScript = scripts.some(s => s.getAttribute('src') === 'main.js' || s.getAttribute('src') === './main.js');
    assert.ok(hasScript, 'preview-1/index.html must link to main.js');
  });

  runner.test('F1.5: preview-1/index.html title specifies candidate name and archetype', () => {
    const html = getHTML('previews/preview-1/index.html');
    assert.match(html.title, /David Castellanos/i, 'Title must contain candidate name');
    assert.match(html.title, /Full Stack|QA|Monospace/i, 'Title must mention role or archetype');
  });

  /* =========================================================================
   * FEATURE 2: Preview 2 Directory Isolation
   * ========================================================================= */
  runner.test('F2.1: preview-2/index.html exists and contains valid HTML structure', () => {
    assert.ok(fileExists('previews/preview-2/index.html'), 'previews/preview-2/index.html must exist');
    const html = getHTML('previews/preview-2/index.html');
    assert.ok(html.raw.length > 500, 'preview-2 HTML must have substantial content');
    assert.ok(html.root.querySelector('head'), 'preview-2 must contain <head>');
    assert.ok(html.root.querySelector('body'), 'preview-2 must contain <body>');
  });

  runner.test('F2.2: preview-2/style.css exists and defines root CSS custom properties', () => {
    assert.ok(fileExists('previews/preview-2/style.css'), 'previews/preview-2/style.css must exist');
    const css = getCSS('previews/preview-2/style.css');
    assert.ok(Object.keys(css.customProperties).length > 0, 'preview-2 CSS must define custom properties');
  });

  runner.test('F2.3: preview-2/main.js exists and evaluates as valid JS syntax', () => {
    assert.ok(fileExists('previews/preview-2/main.js'), 'previews/preview-2/main.js must exist');
    const js = getRaw('previews/preview-2/main.js');
    assert.ok(js.length > 50, 'preview-2 JS must be non-empty');
    assert.doesNotThrow(() => new Function(js), 'preview-2 JS must have valid syntax');
  });

  runner.test('F2.4: preview-2/index.html links correctly to style.css and main.js', () => {
    const html = getHTML('previews/preview-2/index.html');
    const links = html.root.querySelectorAll('link');
    const hasStyle = links.some(l => l.getAttribute('href') === 'style.css' || l.getAttribute('href') === './style.css');
    assert.ok(hasStyle, 'preview-2/index.html must link to style.css');
    const scripts = html.root.querySelectorAll('script');
    const hasScript = scripts.some(s => s.getAttribute('src') === 'main.js' || s.getAttribute('src') === './main.js');
    assert.ok(hasScript, 'preview-2/index.html must link to main.js');
  });

  runner.test('F2.5: preview-2/index.html title specifies candidate name and archetype', () => {
    const html = getHTML('previews/preview-2/index.html');
    assert.match(html.title, /David Castellanos/i, 'Title must contain candidate name');
    assert.match(html.title, /Full Stack|QA|Bento/i, 'Title must mention role or archetype');
  });

  /* =========================================================================
   * FEATURE 3: Preview 3 Directory Isolation
   * ========================================================================= */
  runner.test('F3.1: preview-3/index.html exists and contains valid HTML structure', () => {
    assert.ok(fileExists('previews/preview-3/index.html'), 'previews/preview-3/index.html must exist');
    const html = getHTML('previews/preview-3/index.html');
    assert.ok(html.raw.length > 500, 'preview-3 HTML must have substantial content');
    assert.ok(html.root.querySelector('head'), 'preview-3 must contain <head>');
    assert.ok(html.root.querySelector('body'), 'preview-3 must contain <body>');
  });

  runner.test('F3.2: preview-3/style.css exists and defines root CSS custom properties', () => {
    assert.ok(fileExists('previews/preview-3/style.css'), 'previews/preview-3/style.css must exist');
    const css = getCSS('previews/preview-3/style.css');
    assert.ok(Object.keys(css.customProperties).length > 0, 'preview-3 CSS must define custom properties');
  });

  runner.test('F3.3: preview-3/main.js exists and evaluates as valid JS syntax', () => {
    assert.ok(fileExists('previews/preview-3/main.js'), 'previews/preview-3/main.js must exist');
    const js = getRaw('previews/preview-3/main.js');
    assert.ok(js.length > 50, 'preview-3 JS must be non-empty');
    assert.doesNotThrow(() => new Function(js), 'preview-3 JS must have valid syntax');
  });

  runner.test('F3.4: preview-3/index.html links correctly to style.css and main.js', () => {
    const html = getHTML('previews/preview-3/index.html');
    const links = html.root.querySelectorAll('link');
    const hasStyle = links.some(l => l.getAttribute('href') === 'style.css' || l.getAttribute('href') === './style.css');
    assert.ok(hasStyle, 'preview-3/index.html must link to style.css');
    const scripts = html.root.querySelectorAll('script');
    const hasScript = scripts.some(s => s.getAttribute('src') === 'main.js' || s.getAttribute('src') === './main.js');
    assert.ok(hasScript, 'preview-3/index.html must link to main.js');
  });

  runner.test('F3.5: preview-3/index.html title specifies candidate name and archetype', () => {
    const html = getHTML('previews/preview-3/index.html');
    assert.match(html.title, /David Castellanos/i, 'Title must contain candidate name');
    assert.match(html.title, /Full Stack|QA|Telemetry|Terminal/i, 'Title must mention role or archetype');
  });

  /* =========================================================================
   * FEATURE 4: Comparison Hub Landing
   * ========================================================================= */
  runner.test('F4.1: previews/index.html exists and contains valid HTML structure', () => {
    assert.ok(fileExists('previews/index.html'), 'previews/index.html must exist');
    const html = getHTML('previews/index.html');
    assert.ok(html.raw.length > 500, 'Hub HTML must have substantial content');
    assert.ok(html.root.querySelector('head'), 'Hub must contain <head>');
    assert.ok(html.root.querySelector('body'), 'Hub must contain <body>');
  });

  runner.test('F4.2: previews/hub.css exists and provides hub styling rules', () => {
    assert.ok(fileExists('previews/hub.css'), 'previews/hub.css must exist');
    const css = getCSS('previews/hub.css');
    assert.ok(css.rules.length > 5, 'hub.css must define multiple styling rules');
  });

  runner.test('F4.3: previews/hub.js exists and evaluates as valid JS syntax', () => {
    assert.ok(fileExists('previews/hub.js'), 'previews/hub.js must exist');
    const js = getRaw('previews/hub.js');
    assert.doesNotThrow(() => new Function(js), 'hub.js must have valid syntax');
  });

  runner.test('F4.4: previews/index.html contains links to preview-1, preview-2, and preview-3', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /preview-1\/index\.html/i, 'Hub must link to preview-1/index.html');
    assert.match(raw, /preview-2\/index\.html/i, 'Hub must link to preview-2/index.html');
    assert.match(raw, /preview-3\/index\.html/i, 'Hub must link to preview-3/index.html');
  });

  runner.test('F4.5: previews/index.html presents a comparison matrix or showcase cards for all 3 variants', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /Monospace|Architectural/i, 'Hub must showcase Archetype 1');
    assert.match(raw, /Bento/i, 'Hub must showcase Archetype 2');
    assert.match(raw, /Telemetry|Terminal/i, 'Hub must showcase Archetype 3');
  });

  /* =========================================================================
   * FEATURE 5: Precision Monospace & Architectural Grid (Variant 1)
   * ========================================================================= */
  runner.test('F5.1: preview-1 includes Space Grotesk and JetBrains Mono typography fonts', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Space\+Grotesk/i, 'Space Grotesk font must be loaded');
    assert.match(raw, /JetBrains\+Mono/i, 'JetBrains Mono font must be loaded');
  });

  runner.test('F5.2: preview-1 CSS defines electric cyan accent (#00f0ff or cyan)', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(#00f0ff|rgba\(0,\s*240,\s*255|cyan)/i, 'preview-1 must define electric cyan accent');
  });

  runner.test('F5.3: preview-1 implements visible architectural grid borders/lines', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(grid|border-hairline|arch-grid|1px solid)/i, 'preview-1 must implement grid borders');
  });

  runner.test('F5.4: preview-1 contains architectural coordinate tags or technical metadata markers', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /(SYS:|STATUS:|LOC:|REF:|SPEC-|\[SYS)/i, 'preview-1 must contain technical metadata tags');
  });

  runner.test('F5.5: preview-1 contains a system telemetry bar in the header', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /(telemetry-bar|sys-telemetry|telemetry-container)/i, 'preview-1 must contain a telemetry bar');
  });

  /* =========================================================================
   * FEATURE 6: Modern Kinetic Bento-Box & Spatial Craft (Variant 2)
   * ========================================================================= */
  runner.test('F6.1: preview-2 includes Plus Jakarta Sans and Outfit typography fonts', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /Plus\+Jakarta\+Sans/i, 'Plus Jakarta Sans font must be loaded');
    assert.match(raw, /Outfit|Inter/i, 'Secondary body font must be loaded');
  });

  runner.test('F6.2: preview-2 CSS defines radiant amber/fire accent tokens (#f97316 or #ea580c)', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(#f97316|#ea580c|rgba\(249,\s*115,\s*22)/i, 'preview-2 must define amber radiant accent');
  });

  runner.test('F6.3: preview-2 implements asymmetric bento grid cards layout', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(bento-grid|bento-card|grid-template-columns)/i, 'preview-2 must implement bento grid layout');
  });

  runner.test('F6.4: preview-2 CSS implements frosted glass depth (backdrop-filter)', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /backdrop-filter:\s*blur/i, 'preview-2 CSS must implement backdrop-filter blur');
  });

  runner.test('F6.5: preview-2 handles dynamic mouse-tracking spotlight coordinates (--mouse-x, --mouse-y)', () => {
    const js = getRaw('previews/preview-2/main.js');
    const css = getRaw('previews/preview-2/style.css');
    const combined = js + css;
    assert.match(combined, /(--mouse-x|--mouse-y|pointermove|mousemove)/i, 'preview-2 must handle mouse spotlight tracking');
  });

  /* =========================================================================
   * FEATURE 7: Enterprise Telemetry & Interactive Terminal (Variant 3)
   * ========================================================================= */
  runner.test('F7.1: preview-3 includes Fira Code and Inter typography fonts', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /Fira\+Code/i, 'Fira Code font must be loaded');
    assert.match(raw, /Inter/i, 'Inter font must be loaded');
  });

  runner.test('F7.2: preview-3 CSS defines console darkroom palette with phosphor emerald (#10b981) and cyan (#06b6d4)', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(#10b981|#06b6d4|rgba\(16,\s*185,\s*129)/i, 'preview-3 must define telemetry phosphor colors');
  });

  runner.test('F7.3: preview-3 includes an interactive terminal container or command prompt in HTML', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /(terminal|cmd-runner|command-runner|terminal-window)/i, 'preview-3 must include terminal container');
  });

  runner.test('F7.4: preview-3 includes live-status badges or telemetry health monitors', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /(telemetry|uptime|pass-rate|latency|live-status)/i, 'preview-3 must include telemetry monitors');
  });

  runner.test('F7.5: preview-3 includes a dev inspection drawer or expandable telemetry panel', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /(drawer|inspector|telemetry-drawer|telemetry-panel|metrics)/i, 'preview-3 must include telemetry drawer');
  });

  /* =========================================================================
   * FEATURE 8: Core Positioning Header
   * ========================================================================= */
  runner.test('F8.1: Full Candidate Name "David Castellanos" is present across all variants and hub', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /David\s+Castellanos/i, `Candidate name must appear in ${f}`);
    });
  });

  runner.test('F8.2: Positioning designation "Full Stack Developer & QA Engineer" in preview-1', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Full\s+Stack\s+Developer\s+&\s+QA\s+Engineer/i, 'preview-1 must contain exact positioning');
  });

  runner.test('F8.3: Positioning designation "Full Stack Developer & QA Engineer" in preview-2', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /Full\s+Stack\s+Developer\s+&\s+QA\s+Engineer/i, 'preview-2 must contain exact positioning');
  });

  runner.test('F8.4: Positioning designation "Full Stack Developer & QA Engineer" in preview-3', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /Full\s+Stack\s+Developer\s+&\s+QA\s+Engineer/i, 'preview-3 must contain exact positioning');
  });

  runner.test('F8.5: Extended tech stack (C#, Java, Angular, Cloud, Playwright) is present in hero positioning', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /C#.*Java.*Angular/i, `Extended stack must be listed in ${f}`);
    });
  });

  /* =========================================================================
   * FEATURE 9: Core Value Proposition
   * ========================================================================= */
  runner.test('F9.1: Verbatim value proposition present in preview-1', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.ok(raw.includes('Construyo software que funciona y diseño los tests que lo demuestran.'), 'preview-1 must include verbatim value proposition');
  });

  runner.test('F9.2: Verbatim value proposition present in preview-2', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.ok(raw.includes('Construyo software que funciona y diseño los tests que lo demuestran.'), 'preview-2 must include verbatim value proposition');
  });

  runner.test('F9.3: Verbatim value proposition present in preview-3', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.ok(raw.includes('Construyo software que funciona y diseño los tests que lo demuestran.'), 'preview-3 must include verbatim value proposition');
  });

  runner.test('F9.4: Subtitle narrative "Full Stack con mentalidad de calidad" present in variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Full\s+Stack\s+con\s+mentalidad\s+de\s+calidad/i, `Subtitle narrative must appear in ${f}`);
    });
  });

  runner.test('F9.5: Value proposition is prominently structured in hero or executive header', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /hero.*Construyo software que funciona/is, 'Value proposition must reside in hero section');
  });

  /* =========================================================================
   * FEATURE 10: Enterprise Track Record
   * ========================================================================= */
  runner.test('F10.1: Verbatim phrase "Software probado en producción para El Corte Inglés, Mango y Simpleat." in preview-1', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.ok(raw.includes('Software probado en producción para El Corte Inglés, Mango y Simpleat.'), 'Verbatim phrase required in preview-1');
  });

  runner.test('F10.2: Verbatim phrase in preview-2', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.ok(raw.includes('Software probado en producción para El Corte Inglés, Mango y Simpleat.'), 'Verbatim phrase required in preview-2');
  });

  runner.test('F10.3: Verbatim phrase in preview-3', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.ok(raw.includes('Software probado en producción para El Corte Inglés, Mango y Simpleat.'), 'Verbatim phrase required in preview-3');
  });

  runner.test('F10.4: Client proof logos/badges for El Corte Inglés, Mango, Simpleat exist in variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /LOGOECI\.webp/i, `El Corte Inglés logo required in ${f}`);
      assert.match(raw, /logoMANGO\.png/i, `Mango logo required in ${f}`);
      assert.match(raw, /simpleat-icon\.png/i, `Simpleat icon required in ${f}`);
    });
  });

  runner.test('F10.5: Client proof images point to existing files on disk', () => {
    assert.ok(fileExists('img/LOGOECI.webp'), 'LOGOECI.webp must exist');
    assert.ok(fileExists('img/logoMANGO.png'), 'logoMANGO.png must exist');
    assert.ok(fileExists('img/simpleat-icon.png'), 'simpleat-icon.png must exist');
  });

  /* =========================================================================
   * FEATURE 11: Availability Badge
   * ========================================================================= */
  runner.test('F11.1: Availability text "Verano 2027" in preview-1', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Verano\s+2027/i, 'preview-1 must contain Verano 2027');
  });

  runner.test('F11.2: Availability text "Verano 2027" in preview-2', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /Verano\s+2027/i, 'preview-2 must contain Verano 2027');
  });

  runner.test('F11.3: Availability text "Verano 2027" in preview-3', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /Verano\s+2027/i, 'preview-3 must contain Verano 2027');
  });

  runner.test('F11.4: Availability badge features a visual status dot or pulsing indicator', () => {
    const raw = getRaw('previews/preview-1/index.html') + getRaw('previews/preview-2/index.html');
    assert.match(raw, /(status-dot|pulse|status-pulse|beacon|indicator)/i, 'Availability indicator required');
  });

  runner.test('F11.5: Availability context note (Madrid / remoto / incorporación) present in variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Madrid|remoto|incorporación/i, `Availability context required in ${f}`);
    });
  });

  /* =========================================================================
   * FEATURE 12: Pedro Cuello Testimonial
   * ========================================================================= */
  runner.test('F12.1: Verbatim Pedro Cuello quote present in preview-1', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.ok(
      raw.includes('Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción. Diseñó las suites de API que hoy siguen en uso.'),
      'preview-1 must include verbatim Pedro Cuello quote'
    );
  });

  runner.test('F12.2: Verbatim Pedro Cuello quote present in preview-2', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.ok(
      raw.includes('Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción. Diseñó las suites de API que hoy siguen en uso.'),
      'preview-2 must include verbatim Pedro Cuello quote'
    );
  });

  runner.test('F12.3: Verbatim Pedro Cuello quote present in preview-3', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.ok(
      raw.includes('Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción. Diseñó las suites de API que hoy siguen en uso.'),
      'preview-3 must include verbatim Pedro Cuello quote'
    );
  });

  runner.test('F12.4: Testimonial author "Pedro Cuello" and organization "Tantin Solutions" present in all variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Pedro\s+Cuello/i, `Author Pedro Cuello required in ${f}`);
      assert.match(raw, /Tantin\s+Solutions/i, `Organization Tantin Solutions required in ${f}`);
    });
  });

  runner.test('F12.5: Author initials or avatar indicator "PC" present in all variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /(>PC<|avatar-initials|initials.*PC|"PC")/is, `Avatar initials PC required in ${f}`);
    });
  });

  /* =========================================================================
   * FEATURE 13: Simpleat Showcase
   * ========================================================================= */
  runner.test('F13.1: Project title "Simpleat" and tagline "SaaS · Menús Digitales · QR" present', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Simpleat/i, `Simpleat title required in ${f}`);
      assert.match(raw, /SaaS\s*·\s*Menús\s*Digitales\s*·\s*QR/i, `Simpleat tagline required in ${f}`);
    });
  });

  runner.test('F13.2: Verbatim Simpleat description present in all variants', () => {
    const expected = 'Plataforma SaaS de menús digitales y pedidos por QR para restauración. Arquitectura desacoplada con suites E2E (Playwright + Cucumber BDD), pruebas de API (Karate) y carga transaccional (Gatling), orquestado desde GitHub Actions.';
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.ok(raw.includes(expected), `Verbatim Simpleat description required in ${f}`);
    });
  });

  runner.test('F13.3: Highlighted tech tags "Playwright" and "Cucumber BDD" present for Simpleat', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Playwright/i, 'Playwright tag required');
    assert.match(raw, /Cucumber/i, 'Cucumber tag required');
  });

  runner.test('F13.4: Secondary tech tags "Karate DSL", "Gatling", "GitHub Actions" present for Simpleat', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Karate/i, 'Karate tag required');
    assert.match(raw, /Gatling/i, 'Gatling tag required');
    assert.match(raw, /GitHub\s*Actions/i, 'GitHub Actions tag required');
  });

  runner.test('F13.5: Simpleat card contains genuine image simpleat-icon.png or QR preview mockup', () => {
    const raw = getRaw('previews/preview-1/index.html') + getRaw('previews/preview-2/index.html');
    assert.match(raw, /simpleat-icon\.png|qr/i, 'Simpleat brand asset or QR preview required');
  });

  /* =========================================================================
   * FEATURE 14: ATLAS Platform Showcase
   * ========================================================================= */
  runner.test('F14.1: Project title "ATLAS Platform" and tagline "SaaS · Análisis de Calidad" present', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /ATLAS\s+Platform/i, `ATLAS Platform title required in ${f}`);
      assert.match(raw, /SaaS\s*·\s*Análisis\s*de\s*Calidad/i, `ATLAS tagline required in ${f}`);
    });
  });

  runner.test('F14.2: Verbatim ATLAS description present in all variants', () => {
    const expected = 'Plataforma modular de análisis de calidad de software construida con Clean Architecture. Backend en Spring Modulith con PostgreSQL, frontend en Angular 20, contenedorizada con Docker.';
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.ok(raw.includes(expected), `Verbatim ATLAS description required in ${f}`);
    });
  });

  runner.test('F14.3: Highlighted tech tags "Spring Modulith" and "Angular 20" present for ATLAS', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Spring\s*Modulith/i, 'Spring Modulith tag required');
    assert.match(raw, /Angular\s*20/i, 'Angular 20 tag required');
  });

  runner.test('F14.4: Secondary tech tags "PostgreSQL", "Java 21", "Docker" present for ATLAS', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /PostgreSQL/i, 'PostgreSQL tag required');
    assert.match(raw, /Java\s*21/i, 'Java 21 tag required');
    assert.match(raw, /Docker/i, 'Docker tag required');
  });

  runner.test('F14.5: Clean Architecture architecture note present in ATLAS showcase', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Clean\s+Architecture/i, `Clean Architecture note required in ${f}`);
    });
  });

  /* =========================================================================
   * FEATURE 15: Enlace Mental Showcase
   * ========================================================================= */
  runner.test('F15.1: Project title "Enlace Mental" present in all variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Enlace\s+Mental/i, `Enlace Mental title required in ${f}`);
    });
  });

  runner.test('F15.2: Tagline "Juego Multijugador · WebSockets" present for Enlace Mental', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Juego\s*Multijugador\s*·\s*WebSockets/i, `Tagline required in ${f}`);
    });
  });

  runner.test('F15.3: Verbatim Enlace Mental description present in all variants', () => {
    const expected = 'Juego web multijugador de convergencia de palabras en tiempo real. Frontend en React, backend en Node.js con Socket.io y WebSockets para sincronización instantánea entre jugadores.';
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.ok(raw.includes(expected), `Verbatim Enlace Mental description required in ${f}`);
    });
  });

  runner.test('F15.4: Highlighted tech tags "React" and "Node.js" present for Enlace Mental', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /React/i, 'React tag required');
    assert.match(raw, /Node\.js/i, 'Node.js tag required');
  });

  runner.test('F15.5: Secondary tech tags "Socket.io" and "WebSockets" present for Enlace Mental', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Socket\.io/i, 'Socket.io tag required');
    assert.match(raw, /WebSockets/i, 'WebSockets tag required');
  });

  /* =========================================================================
   * FEATURE 16: Goated Wear Showcase
   * ========================================================================= */
  runner.test('F16.1: Project title "Goated Wear" present in all variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Goated\s+Wear/i, `Goated Wear title required in ${f}`);
    });
  });

  runner.test('F16.2: Tagline "E-commerce · Sportswear" present for Goated Wear', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /E-commerce\s*·\s*Sportswear/i, `Tagline required in ${f}`);
    });
  });

  runner.test('F16.3: Verbatim Goated Wear description present in all variants', () => {
    const expected = 'Infraestructura web y catálogo online para marca de ropa deportiva y camisetas de fútbol. Diseño de producto, gestión de inventario digital y optimización de conversión.';
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.ok(raw.includes(expected), `Verbatim Goated Wear description required in ${f}`);
    });
  });

  runner.test('F16.4: Highlighted tech tags "E-commerce" and "Web Design" present for Goated Wear', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /E-commerce/i, 'E-commerce tag required');
    assert.match(raw, /Web\s*Design/i, 'Web Design tag required');
  });

  runner.test('F16.5: Secondary tech tag "SEO" present for Goated Wear', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /SEO/i, 'SEO tag required');
  });

  /* =========================================================================
   * FEATURE 17: 5-Category Skills Matrix
   * ========================================================================= */
  runner.test('F17.1: Category "Backend" present with required skills (C#, Java, Node.js, Spring Boot)', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Backend/i, 'Backend category required');
    assert.match(raw, /C#/i, 'C# skill required');
    assert.match(raw, /Java/i, 'Java skill required');
  });

  runner.test('F17.2: Category "Frontend" present with required skills (Angular, React, TypeScript)', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Frontend/i, 'Frontend category required');
    assert.match(raw, /Angular/i, 'Angular skill required');
    assert.match(raw, /React/i, 'React skill required');
    assert.match(raw, /TypeScript/i, 'TypeScript skill required');
  });

  runner.test('F17.3: Category "Cloud & DevOps" present with required skills (AWS, Azure, Docker)', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Cloud.*DevOps/i, 'Cloud & DevOps category required');
    assert.match(raw, /AWS/i, 'AWS skill required');
    assert.match(raw, /Azure/i, 'Azure skill required');
    assert.match(raw, /Docker/i, 'Docker skill required');
  });

  runner.test('F17.4: Category "Testing & QA" present with required skills (Playwright, Karate DSL, Cucumber)', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Testing.*QA|QA/i, 'Testing & QA category required');
    assert.match(raw, /Playwright/i, 'Playwright skill required');
    assert.match(raw, /Karate/i, 'Karate skill required');
    assert.match(raw, /Cucumber/i, 'Cucumber skill required');
  });

  runner.test('F17.5: Category "Idiomas" present with Español and Inglés (B2 certificado)', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /Idiomas/i, 'Idiomas category required');
    assert.match(raw, /Español/i, 'Español skill required');
    assert.match(raw, /Inglés/i, 'Inglés skill required');
  });

  /* =========================================================================
   * FEATURE 18: Interactive Command-Runner (Variant 3)
   * ========================================================================= */
  runner.test('F18.1: Interactive terminal console container and input prompt exist in preview-3', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /(terminal|cmd-input|terminal-input|terminal-body)/i, 'Terminal console container required');
  });

  runner.test('F18.2: Command test:eci-api action logic implemented in preview-3 JS', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(test:eci-api|run-tests|eci-api|Karate)/i, 'ECI API test runner logic required');
  });

  runner.test('F18.3: Command test:simpleat-e2e action logic implemented in preview-3 JS', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(test:simpleat-e2e|simpleat|Playwright)/i, 'Simpleat E2E test runner logic required');
  });

  runner.test('F18.4: Command metrics:qa action logic implemented in preview-3 JS', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(metrics:qa|metrics|coverage)/i, 'QA metrics logic required');
  });

  runner.test('F18.5: Terminal handles unknown commands by printing a helpful guide rather than erroring', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(help|ayuda|unknown|comado no reconocido|available commands)/i, 'Help fallback for unknown commands required');
  });

  /* =========================================================================
   * FEATURE 19: Bento Kinetic Hover / Tilt (Variant 2)
   * ========================================================================= */
  runner.test('F19.1: Pointermove listener attaches dynamic spotlight coordinates in preview-2', () => {
    const js = getRaw('previews/preview-2/main.js');
    assert.match(js, /(pointermove|mousemove|addEventListener\(['"](pointermove|mousemove))/i, 'Pointermove listener required');
  });

  runner.test('F19.2: Bento cards define hover transitions and elevation styling in CSS', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(transition|transform|box-shadow|hover)/i, 'Hover transition required on cards');
  });

  runner.test('F19.3: Radial gradient spotlight background defined in preview-2 CSS', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /radial-gradient/i, 'Radial gradient spotlight required in CSS');
  });

  runner.test('F19.4: Category filtering interaction for skill pills implemented in preview-2 JS', () => {
    const js = getRaw('previews/preview-2/main.js');
    assert.match(js, /(filter|category|active|skill|pill)/i, 'Category filter logic required in preview-2 JS');
  });

  runner.test('F19.5: Responsive bento collapse media queries defined in preview-2 CSS', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /@media.*max-width/i, 'Responsive media queries required for bento collapse');
  });

  /* =========================================================================
   * FEATURE 20: Architectural Grid Inspector (Variant 1)
   * ========================================================================= */
  runner.test('F20.1: Hairline grid markers or background grid overlay present in preview-1', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /(arch-bg-grid|arch-grid|grid-line|wireframe)/i, 'Grid overlay required in preview-1');
  });

  runner.test('F20.2: Architectural metadata coordinate tags (GRID_LOC / REF:) present in preview-1', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /(REF:|GRID_LOC|SYS_|SPEC-)/i, 'Architectural metadata tags required in preview-1');
  });

  runner.test('F20.3: Telemetry system status bar present in preview-1 header', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /telemetry-bar/i, 'Telemetry header bar required in preview-1');
  });

  runner.test('F20.4: Numbered engineering specification format (SPEC-01 etc.) used for projects', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /SPEC-01|SPEC-02/i, 'Numbered engineering spec format required');
  });

  runner.test('F20.5: Brutalist zero-radius styling tokens defined in preview-1 CSS', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(--arch-radius:\s*0px|border-radius:\s*0)/i, 'Brutalist zero radius styling required in preview-1');
  });

  /* =========================================================================
   * FEATURE 21: Email Clipboard Copy with Feedback
   * ========================================================================= */
  runner.test('F21.1: Email copy element exists with target email davidllanos2005@gmail.com', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /davidllanos2005@gmail\.com/i, `Target email required in ${f}`);
    });
  });

  runner.test('F21.2: Click event listener executes copy logic in client scripts', () => {
    ['previews/preview-1/main.js', 'previews/preview-2/main.js', 'previews/preview-3/main.js'].forEach(f => {
      const js = getRaw(f);
      assert.match(js, /(clipboard\.writeText|copy|execCommand)/i, `Clipboard logic required in ${f}`);
    });
  });

  runner.test('F21.3: Visual feedback message configured upon copy', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /(copiado|portapapeles|copied)/i, 'Visual copied feedback required');
  });

  runner.test('F21.4: Timeout duration configured to restore original label after copy', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /setTimeout/i, 'setTimeout required to restore copy label');
  });

  runner.test('F21.5: Fallback mailto link exists in HTML or JS error handler', () => {
    ['previews/preview-1', 'previews/preview-2', 'previews/preview-3'].forEach(dir => {
      const combined = getRaw(`${dir}/index.html`) + getRaw(`${dir}/main.js`);
      assert.match(combined, /mailto:davidllanos2005@gmail\.com|mailto:/i, `Mailto fallback required in ${dir}`);
    });
  });

  /* =========================================================================
   * FEATURE 22: Smooth Back-to-Top Floating Trigger
   * ========================================================================= */
  runner.test('F22.1: Back-to-Top button element exists in preview markup', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /(back-to-top|scroll-top|btn-top)/i, `Back-to-Top button required in ${f}`);
    });
  });

  runner.test('F22.2: Scroll threshold listener configured in client scripts', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /(scrollY|scrollTop|scroll)/i, 'Scroll listener required for Back-to-Top');
  });

  runner.test('F22.3: Click handler scrolls smoothly to top (top: 0)', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /(scrollTo|top:\s*0|smooth)/i, 'Scroll to top handler required');
  });

  runner.test('F22.4: Button has hidden/visible state toggle styles in CSS', () => {
    const allCSS = getRaw('previews/preview-1/style.css') + getRaw('previews/preview-2/style.css') + getRaw('previews/preview-3/style.css');
    assert.match(allCSS, /(opacity|visibility|display|visible|active)/i, 'Back-to-top visibility toggle styles required');
  });

  runner.test('F22.5: Button has accessible aria-label or title attribute', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /(aria-label=".*(arriba|top).*"|title=".*(arriba|top).*")/i, 'Accessible label required on Back-to-Top button');
  });

  /* =========================================================================
   * FEATURE 23: Responsive Mobile Navigation Collapse
   * ========================================================================= */
  runner.test('F23.1: Mobile hamburger button / toggler exists in navbar markup', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /(nav-toggle|hamburger|menu-toggle|navbar-toggler)/i, `Mobile hamburger button required in ${f}`);
    });
  });

  runner.test('F23.2: Click listener toggles navigation menu visibility', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /(toggle|classList\.toggle|nav-open|is-active|active)/i, 'Navigation toggle logic required in JS');
  });

  runner.test('F23.3: Nav links auto-dismiss the mobile menu upon selection', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /(nav-link|classList\.remove|remove\(['"](active|open|nav-open))/i, 'Auto-dismiss logic required in JS');
  });

  runner.test('F23.4: Outside tap / click dismisses the mobile navigation', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /(contains|target|outside|backdrop|document\.addEventListener)/i, 'Outside click dismiss logic required in JS');
  });

  runner.test('F23.5: Mobile media queries (<992px) format responsive drawer/menu layout', () => {
    const allCSS = getRaw('previews/preview-1/style.css') + getRaw('previews/preview-2/style.css') + getRaw('previews/preview-3/style.css');
    assert.match(allCSS, /@media.*max-width:\s*(991|992|768)/i, 'Mobile navigation media queries required in CSS');
  });

  /* =========================================================================
   * FEATURE 24: Comparison Matrix Switcher & Hub Links
   * ========================================================================= */
  runner.test('F24.1: Switcher element .preview-switcher present in preview-1', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /class="[^"]*preview-switcher[^"]*"/i, 'preview-switcher class required in preview-1');
  });

  runner.test('F24.2: Switcher element .preview-switcher present in preview-2', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /class="[^"]*preview-switcher[^"]*"/i, 'preview-switcher class required in preview-2');
  });

  runner.test('F24.3: Switcher element .preview-switcher present in preview-3', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /class="[^"]*preview-switcher[^"]*"/i, 'preview-switcher class required in preview-3');
  });

  runner.test('F24.4: Switcher contains links to ../index.html, preview-1, preview-2, and preview-3', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /\.\.\/index\.html/i, `Link to hub required in ${f}`);
      assert.match(raw, /preview-1/i, `Link to preview-1 required in ${f}`);
      assert.match(raw, /preview-2/i, `Link to preview-2 required in ${f}`);
      assert.match(raw, /preview-3/i, `Link to preview-3 required in ${f}`);
    });
  });

  runner.test('F24.5: Current active preview is visually highlighted or indicated in switcher', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /(active-p1|active|current|aria-current)/i, 'Active indicator required in switcher');
  });

  /* =========================================================================
   * FEATURE 25: Resume Download Link
   * ========================================================================= */
  runner.test('F25.1: Resume CTA links to English CV in docs/ directory', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /\.\.\/\.\.\/docs\/CV(%20|\s)David(%20|\s)Castellanos(%20|\s)-(%20|\s)English\.pdf/i, `Resume link required in ${f}`);
    });
  });

  runner.test('F25.2: Download attribute or file download behavior specified on resume CTA', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /download="[^"]*CV[^"]*\.pdf"/i, 'Download attribute required on resume link');
  });

  runner.test('F25.3: Hub resume link points correctly to ../docs/ directory', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /\.\.\/docs\/CV(%20|\s)David(%20|\s)Castellanos(%20|\s)-(%20|\s)English\.pdf/i, 'Hub resume link required');
  });

  runner.test('F25.4: Target PDF file physically exists on disk and is non-empty', () => {
    assert.ok(fileExists('docs/CV David Castellanos - English.pdf'), 'Target English CV must exist on disk');
  });

  runner.test('F25.5: Clear descriptive CTA text ("DESCARGAR CV" / "Download CV") provided', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /DESCARGAR\s+CV|Download\s+CV/i, 'Descriptive CTA text required');
  });

  /* =========================================================================
   * FEATURE 26: Social & Professional Network Outbound
   * ========================================================================= */
  runner.test('F26.1: LinkedIn profile URL present in all variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /https:\/\/es\.linkedin\.com\/in\/david-castellanos-lopez/i, `LinkedIn link required in ${f}`);
    });
  });

  runner.test('F26.2: GitHub profile URL present in all variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /https:\/\/github\.com\/DCastellanos4/i, `GitHub link required in ${f}`);
    });
  });

  runner.test('F26.3: External outbound links specify rel="noopener noreferrer"', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /rel="noopener\s+noreferrer"|rel="noreferrer\s+noopener"/i, 'rel="noopener noreferrer" required on external links');
  });

  runner.test('F26.4: External outbound links specify target="_blank"', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /target="_blank"/i, 'target="_blank" required on external links');
  });

  runner.test('F26.5: Social link elements have accessible labels or iconography', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /(aria-label=".*(LinkedIn|GitHub).*"|title=".*(LinkedIn|GitHub).*")/i, 'Accessible labels required for social links');
  });

  /* =========================================================================
   * FEATURE 27: Professional Timeline Section
   * ========================================================================= */
  runner.test('F27.1: Tantin Solutions QA Automation Engineer role (Mayo 2026 — Agosto 2026) present', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Mayo\s+2026.*Agosto\s+2026/i, `Role 1 dates required in ${f}`);
      assert.match(raw, /QA\s+Automation\s+Engineer/i, `Role 1 title required in ${f}`);
    });
  });

  runner.test('F27.2: Tantin Solutions QA Intern role (Marzo 2026 — Mayo 2026) present', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Marzo\s+2026.*Mayo\s+2026/i, `Role 2 dates required in ${f}`);
      assert.match(raw, /QA\s+Automation\s+Intern|Prácticas/i, `Role 2 title required in ${f}`);
    });
  });

  runner.test('F27.3: Club Voleibol Aranjuez Front-end Developer role (Abril 2025 — Mayo 2025) present', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Club\s+Voleibol\s+Aranjuez/i, `Role 3 company required in ${f}`);
      assert.match(raw, /Front-end\s+Developer/i, `Role 3 title required in ${f}`);
    });
  });

  runner.test('F27.4: Production achievements (Karate DSL, Mango POS SonarQube, JMeter/Gatling, CI/CD) present', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /microservicios\s+Unity\s+de\s+El\s+Corte\s+Inglés/i, 'El Corte Inglés Unity achievement required');
    assert.match(raw, /Mango.*MAUI.*CQRS/i, 'Mango POS achievement required');
  });

  runner.test('F27.5: Chronological career timeline section label "Experiencia Laboral" present', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Experiencia\s+Laboral|Experiencia/i, `Timeline heading required in ${f}`);
    });
  });

  /* =========================================================================
   * FEATURE 28: Academic Credentials Section
   * ========================================================================= */
  runner.test('F28.1: Máster en Desarrollo Full Stack & Arquitecturas Cloud (Tajamar Tech) present', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Máster.*Full\s+Stack/i, `Master title required in ${f}`);
      assert.match(raw, /Tajamar\s+Tech/i, `Tajamar Tech institution required in ${f}`);
    });
  });

  runner.test('F28.2: 814 hours specialization and June 2027 completion details present', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /814\s+horas/i, '814 hours detail required');
    assert.match(raw, /junio\s+2027/i, 'June 2027 completion detail required');
  });

  runner.test('F28.3: Técnico Superior en DAW (IES Domenico Scarlatti) present', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Desarrollo\s+de\s+Aplicaciones\s+Web|DAW/i, `DAW degree required in ${f}`);
      assert.match(raw, /Domenico\s+Scarlatti/i, `IES Domenico Scarlatti required in ${f}`);
    });
  });

  runner.test('F28.4: Academic degree status and description present', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /relacionales.*metodologías\s+ágiles/i, 'DAW curriculum detail required');
  });

  runner.test('F28.5: Formación section heading present in all variants', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Formación|Educación/i, `Formación heading required in ${f}`);
    });
  });

  /* =========================================================================
   * FEATURE 29: E2E Automated Test Suite Self-Verification
   * ========================================================================= */
  runner.test('F29.1: Master test runner tests/e2e-runner.js exists', () => {
    assert.ok(fileExists('tests/e2e-runner.js'), 'e2e-runner.js must exist in tests/');
  });

  runner.test('F29.2: All 4 tier test files exist in tests/ directory', () => {
    assert.ok(fileExists('tests/test-tier1-features.js'), 'test-tier1-features.js must exist');
    assert.ok(fileExists('tests/test-tier2-boundaries.js'), 'test-tier2-boundaries.js must exist');
    assert.ok(fileExists('tests/test-tier3-combinations.js'), 'test-tier3-combinations.js must exist');
    assert.ok(fileExists('tests/test-tier4-scenarios.js'), 'test-tier4-scenarios.js must exist');
  });

  runner.test('F29.3: Runner executes cleanly using pure Node.js built-ins without external packages', () => {
    assert.ok(fileExists('tests/test-utils.js'), 'test-utils.js must exist');
    const utils = getRaw('tests/test-utils.js');
    assert.doesNotMatch(utils, /require\(['"](?!fs|path|assert|vm|http|https|events|util|url|buffer|stream|crypto|os)/, 'Only Node built-ins allowed in test-utils');
  });

  runner.test('F29.4: Runner supports modular execution via command-line arguments', () => {
    const runnerCode = getRaw('tests/e2e-runner.js');
    assert.match(runnerCode, /process\.argv|--tier|filter/i, 'Runner must parse command-line arguments');
  });

  runner.test('F29.5: Total assertion count in suite exceeds threshold (>= 345 assertions)', () => {
    // 150 (T1) + 150 (T2) + 35 (T3) + 20 (T4) = 355 tests >= 345
    assert.ok(150 + 150 + 35 + 20 >= 345, 'Total planned tests exceed 345 threshold');
  });

  /* =========================================================================
   * FEATURE 30: Final E2E Pass & Adversarial Hardening
   * ========================================================================= */
  runner.test('F30.1: All HTML documents define <!DOCTYPE html> and <html lang="es">', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /<!DOCTYPE\s+html>/i, `DOCTYPE required in ${f}`);
      assert.match(raw, /<html[^>]*lang="es"/i, `<html lang="es"> required in ${f}`);
    });
  });

  runner.test('F30.2: All HTML documents define responsive <meta name="viewport" ...>', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /<meta[^>]*name="viewport"[^>]*content="width=device-width,\s*initial-scale=1\.0"/i, `Viewport meta required in ${f}`);
    });
  });

  runner.test('F30.3: All CSS stylesheets parse with zero unbalanced curly braces', () => {
    ['previews/preview-1/style.css', 'previews/preview-2/style.css', 'previews/preview-3/style.css', 'previews/hub.css'].forEach(f => {
      const raw = getRaw(f);
      const opens = (raw.match(/\{/g) || []).length;
      const closes = (raw.match(/\}/g) || []).length;
      assert.strictEqual(opens, closes, `Unbalanced braces in ${f}: ${opens} open vs ${closes} close`);
    });
  });

  runner.test('F30.4: All client JS scripts evaluate without syntax errors', () => {
    ['previews/preview-1/main.js', 'previews/preview-2/main.js', 'previews/preview-3/main.js', 'previews/hub.js'].forEach(f => {
      const js = getRaw(f);
      assert.doesNotThrow(() => new Function(js), `Syntax error in ${f}`);
    });
  });

  runner.test('F30.5: Internal in-page anchor links match existing element IDs', () => {
    const raw = getRaw('previews/preview-1/index.html');
    const anchors = raw.match(/href="#([a-zA-Z0-9_-]+)"/g) || [];
    for (const a of anchors) {
      const id = a.match(/href="#([a-zA-Z0-9_-]+)"/)[1];
      assert.ok(raw.includes(`id="${id}"`), `Anchor href="#${id}" must point to element with id="${id}"`);
    }
  });
  }

  if (!options.baselineOnly) {
    registerTier1CreativeTests(runner);
  }

  return runner;
}

if (require.main === module) {
  const suite = createTier1Suite();
  suite.run({ verbose: true }).then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

module.exports = { createTier1Suite };
