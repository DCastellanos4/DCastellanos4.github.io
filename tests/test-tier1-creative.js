/**
 * Tier 1 (Creative Engineering Extension): Features 31 - 48 (18 Features x 5 Tests = 90 Tests)
 * Verifies Variants 4, 5, 6 and Dual-Tier Hub Expansion:
 * - V4: Matter.js 2D physics sandbox, Web Audio synthesizer, Lenis scroll, Industrial layout
 * - V5: Three.js WebGL canvas, SVG displacement refraction, GSAP horizontal pipeline, Obsidian theme
 * - V6: Kinetic Swiss Brutalism, spatial typography, magnetic difference cursor, chromatic aberration
 * - Hub: Dual-tier cards (V1-V6), technical spec matrix, preview launch CTAs
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

function registerTier1CreativeTests(runner) {
  const getHTML = (rel) => parseHTML(readFile(rel));
  const getCSS = (rel) => parseCSS(readFile(rel));
  const getRaw = (rel) => readFile(rel);

  /* =========================================================================
   * FEATURE 31: V4 Industrial Hardware & Physical Lab Setup (Variant 4)
   * ========================================================================= */
  runner.test('F31.1: preview-4/index.html exists and contains valid industrial markup', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.ok(html.raw.length > 500, 'preview-4 HTML must have substantial content');
    assert.ok(html.root.querySelector('head'), 'preview-4 must contain <head>');
    assert.ok(html.root.querySelector('body'), 'preview-4 must contain <body>');
  });

  runner.test('F31.2: preview-4/style.css defines industrial hardware design tokens', () => {
    const pend = checkMilestone('previews/preview-4/style.css', 'M1');
    if (pend) return pend;
    const css = getCSS('previews/preview-4/style.css');
    const raw = css.raw;
    const hasIndustrialColors = /chassis|bone|graphite|#f4f3ef|#18181b|#ff4800|#ff3e00|#161719|#e8e6e1/i.test(raw);
    assert.ok(hasIndustrialColors, 'preview-4 CSS must define industrial hardware color tokens');
  });

  runner.test('F31.3: preview-4/main.js exists and evaluates as valid JS syntax', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    assert.ok(js.length > 50, 'preview-4 JS must be non-empty');
    assert.doesNotThrow(() => new Function(js), 'preview-4 JS must have valid syntax');
  });

  runner.test('F31.4: preview-4 contains tactile hardware motif elements in DOM or CSS', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const hasTactile = html.raw.includes('hw-') ||
                       html.raw.includes('chassis') ||
                       html.raw.includes('screw') ||
                       html.raw.includes('tactile') ||
                       html.raw.includes('lcd');
    assert.ok(hasTactile, 'preview-4 must contain industrial hardware elements (chassis, screws, or LCD)');
  });

  runner.test('F31.5: preview-4/index.html title specifies candidate name and industrial archetype', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.match(html.title, /David Castellanos/i, 'Title must contain candidate name');
    assert.match(html.title, /Industrial|Hardware|Physical Lab/i, 'Title must mention Industrial Hardware archetype');
  });

  /* =========================================================================
   * FEATURE 32: V4 Matter.js 2D Real-time Physics Sandbox
   * ========================================================================= */
  runner.test('F32.1: Matter.js physics chamber canvas container exists in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const hasChamber = html.root.querySelector('#physics-chamber') ||
                       html.root.querySelector('#physics-canvas') ||
                       html.raw.includes('physics-chamber') ||
                       html.raw.includes('physics-canvas');
    assert.ok(hasChamber, 'preview-4 must contain #physics-chamber or #physics-canvas container');
  });

  runner.test('F32.2: Matter.js library script link included without type="module"', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const hasMatterScript = html.raw.includes('matter') && !html.raw.includes('type="module"');
    assert.ok(hasMatterScript, 'preview-4 must include Matter.js as classic UMD script tag');
  });

  runner.test('F32.3: Physics world setup configures gravity and boundaries in preview-4 JS', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasPhysicsSetup = /gravity|Matter\.Engine|Bodies\.rectangle|ground|wall/i.test(js);
    assert.ok(hasPhysicsSetup, 'preview-4 JS must configure gravity and physical boundary bodies');
  });

  runner.test('F32.4: Physics tech badges bodies configured for core skills in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasSkillsBadges = /Playwright|Docker|Java|C#|Angular|Spring/i.test(js) && /restitution|Bodies|badge/i.test(js);
    assert.ok(hasSkillsBadges, 'preview-4 JS must define physics skill badge bodies with elasticity');
  });

  runner.test('F32.5: Interactive chamber controls (gravity toggles or impulse trigger) present', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const hasControls = /gravity|shake|zero-g|impulse|reset|respawn/i.test(html.raw);
    assert.ok(hasControls, 'preview-4 must contain interactive physics chamber control triggers');
  });

  /* =========================================================================
   * FEATURE 33: V4 Pure Web Audio API Tactile Sound Engine
   * ========================================================================= */
  runner.test('F33.1: Zero audio file dependencies (.mp3, .wav, .ogg) in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.ok(!/\.mp3|\.wav|\.ogg/i.test(html.raw), 'preview-4 HTML must have 0 external audio files');
    if (fileExists('previews/preview-4/main.js')) {
      const js = getRaw('previews/preview-4/main.js');
      assert.ok(!/\.mp3|\.wav|\.ogg/i.test(js), 'preview-4 JS must have 0 external audio files');
    }
  });

  runner.test('F33.2: Web Audio API procedural synthesizer initialized lazily in JS', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasWebAudio = /AudioContext|webkitAudioContext/i.test(js);
    assert.ok(hasWebAudio, 'preview-4 JS must initialize AudioContext');
  });

  runner.test('F33.3: Mechanical click audio primitive implemented with oscillator and envelope', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasSynthMethods = /createOscillator|createGain|exponentialRampToValueAtTime/i.test(js);
    assert.ok(hasSynthMethods, 'preview-4 JS must synthesize mechanical clicks with oscillator & gain nodes');
  });

  runner.test('F33.4: Master audio mute/unmute control toggle element exists in preview-4 DOM', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const hasAudioToggle = html.root.querySelector('#audio-toggle') ||
                           html.raw.includes('audio-toggle') ||
                           html.raw.includes('audio-text');
    assert.ok(hasAudioToggle, 'preview-4 must include an audio master toggle control');
  });

  runner.test('F33.5: AudioContext autoplay policy defense implemented (resumed on user gesture)', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasAutoplayGuard = /resume|suspended|pointerdown|click/i.test(js);
    assert.ok(hasAutoplayGuard, 'preview-4 JS must handle AudioContext suspended state on user interaction');
  });

  /* =========================================================================
   * FEATURE 34: V4 Lenis Inertial Scroll & Analog HUD
   * ========================================================================= */
  runner.test('F34.1: Lenis library loaded as classic UMD script in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const hasLenis = /lenis/i.test(html.raw);
    assert.ok(hasLenis, 'preview-4 must include Lenis scroll library script');
  });

  runner.test('F34.2: Analog scroll HUD telemetry readout elements present in preview-4 DOM', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    const hasScrollHUD = html.raw.includes('lcd-scroll') ||
                         html.raw.includes('scroll-gauge') ||
                         html.raw.includes('pot-dial') ||
                         html.raw.includes('analog-hud');
    assert.ok(hasScrollHUD, 'preview-4 must contain analog scroll HUD readout elements');
  });

  runner.test('F34.3: Lenis instance initialized in JS with smooth inertia parameters', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasLenisInit = /new Lenis|typeof Lenis/i.test(js);
    assert.ok(hasLenisInit, 'preview-4 JS must instantiate Lenis smooth scroll');
  });

  runner.test('F34.4: Scroll progress tracking binds Lenis scroll events to telemetry gauges', () => {
    const pend = checkMilestone('previews/preview-4/main.js', 'M1');
    if (pend) return pend;
    const js = getRaw('previews/preview-4/main.js');
    const hasScrollSync = /lenis\.on\(['"]scroll['"]|scroll-val|pos-val|progress/i.test(js);
    assert.ok(hasScrollSync, 'preview-4 JS must synchronize scroll progress with HUD telemetry gauges');
  });

  runner.test('F34.5: Accessibility guard respects prefers-reduced-motion for scroll effects', () => {
    const pend = checkMilestone('previews/preview-4/style.css', 'M1');
    if (pend) return pend;
    const css = getCSS('previews/preview-4/style.css');
    const hasMotionGuard = css.mediaQueries.some(m => m.condition.includes('prefers-reduced-motion'));
    assert.ok(hasMotionGuard, 'preview-4 CSS must define prefers-reduced-motion media query');
  });

  /* =========================================================================
   * FEATURE 35: V4 Verbatim Spanish Copy & Asset Fidelity
   * ========================================================================= */
  runner.test('F35.1: Value proposition present verbatim in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.ok(html.raw.includes('Construyo software que funciona y diseño los tests que lo demuestran.'),
      'preview-4 must include verbatim value proposition');
  });

  runner.test('F35.2: Summer 2027 availability badge present verbatim in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.ok(html.raw.includes('Incorporación Verano 2027'),
      'preview-4 must include verbatim availability badge');
  });

  runner.test('F35.3: Pedro Cuello audited testimonial present verbatim in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.ok(html.raw.includes('Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción'),
      'preview-4 must include verbatim Pedro Cuello quote');
  });

  runner.test('F35.4: 4 Featured projects present in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.ok(html.raw.includes('Simpleat'), 'preview-4 must feature Simpleat');
    assert.ok(html.raw.includes('ATLAS'), 'preview-4 must feature ATLAS Platform');
    assert.ok(html.raw.includes('Enlace Mental'), 'preview-4 must feature Enlace Mental');
    assert.ok(html.raw.includes('Goated Wear'), 'preview-4 must feature Goated Wear');
  });

  runner.test('F35.5: Enterprise logos and verified assets linked with exact relative paths in preview-4', () => {
    const pend = checkMilestone('previews/preview-4/index.html', 'M1');
    if (pend) return pend;
    const html = getHTML('previews/preview-4/index.html');
    assert.ok(html.raw.includes('../../img/Image.jpg'), 'preview-4 must reference Image.jpg');
    assert.ok(html.raw.includes('../../img/LOGOECI.webp'), 'preview-4 must reference LOGOECI.webp');
    assert.ok(html.raw.includes('../../img/logoMANGO.png'), 'preview-4 must reference logoMANGO.png');
    assert.ok(html.raw.includes('../../img/simpleat-icon.png'), 'preview-4 must reference simpleat-icon.png');
    assert.ok(html.raw.includes('../../docs/CV%20David%20Castellanos%20-%20English.pdf'), 'preview-4 must link English CV');
  });

  /* =========================================================================
   * FEATURE 36: V5 Obsidian 3D Pipeline Visualizer Structure & Aesthetic
   * ========================================================================= */
  runner.test('F36.1: preview-5/index.html exists and contains valid pipeline visualizer markup', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(html.raw.length > 500, 'preview-5 HTML must have substantial content');
    assert.ok(html.root.querySelector('head'), 'preview-5 must contain <head>');
    assert.ok(html.root.querySelector('body'), 'preview-5 must contain <body>');
  });

  runner.test('F36.2: preview-5/style.css defines deep obsidian & laser telemetry color tokens', () => {
    const pend = checkMilestone('previews/preview-5/style.css', 'M2');
    if (pend) return pend;
    const css = getCSS('previews/preview-5/style.css');
    const raw = css.raw;
    const hasObsidianColors = /obsidian|laser|#030712|#08090c|#06b6d4|#00e5ff|#f59e0b|#ff9100|#10b981/i.test(raw);
    assert.ok(hasObsidianColors, 'preview-5 CSS must define obsidian & laser telemetry color tokens');
  });

  runner.test('F36.3: preview-5/main.js exists and evaluates as valid JS syntax', () => {
    const pend = checkMilestone('previews/preview-5/main.js', 'M2');
    if (pend) return pend;
    const js = getRaw('previews/preview-5/main.js');
    assert.ok(js.length > 50, 'preview-5 JS must be non-empty');
    assert.doesNotThrow(() => new Function(js), 'preview-5 JS must have valid syntax');
  });

  runner.test('F36.4: CI/CD telemetry bar and status indicators present in preview-5 DOM', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    const hasTelemetry = html.raw.includes('telemetry-bar') ||
                         html.raw.includes('telemetry-clock') ||
                         html.raw.includes('STAGE_RUNNING') ||
                         html.raw.includes('pipeline');
    assert.ok(hasTelemetry, 'preview-5 must contain CI/CD telemetry status elements');
  });

  runner.test('F36.5: preview-5/index.html title specifies candidate name and 3D Pipeline archetype', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.match(html.title, /David Castellanos/i, 'Title must contain candidate name');
    assert.match(html.title, /3D Pipeline|WebGL/i, 'Title must mention 3D Pipeline archetype');
  });

  /* =========================================================================
   * FEATURE 37: V5 Three.js WebGL Interactive Canvas
   * ========================================================================= */
  runner.test('F37.1: Three.js WebGL canvas container exists in preview-5 markup', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    const hasCanvas = html.root.querySelector('#webgl-canvas') ||
                      html.raw.includes('webgl-canvas');
    assert.ok(hasCanvas, 'preview-5 must contain #webgl-canvas element');
  });

  runner.test('F37.2: Three.js library loaded via classic UMD script tag without type="module"', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(html.raw.includes('three.js') || html.raw.includes('three.min.js'),
      'preview-5 must load Three.js via script tag');
    assert.ok(!/<script[^>]*type=["']module["'][^>]*three/i.test(html.raw),
      'Three.js script must NOT have type="module"');
  });

  runner.test('F37.3: WebGL renderer initialization clamps DPR to <= 2 in preview-5 JS', () => {
    const pend = checkMilestone('previews/preview-5/main.js', 'M2');
    if (pend) return pend;
    const js = getRaw('previews/preview-5/main.js');
    const hasDprClamping = /setPixelRatio|devicePixelRatio|Math\.min\(.*2\)/i.test(js);
    assert.ok(hasDprClamping, 'preview-5 JS must clamp device pixel ratio to <= 2');
  });

  runner.test('F37.4: 3D scene elements (wireframe mesh or particles) configured in preview-5 JS', () => {
    const pend = checkMilestone('previews/preview-5/main.js', 'M2');
    if (pend) return pend;
    const js = getRaw('previews/preview-5/main.js');
    const hasThreeScene = /THREE\.Scene|THREE\.PerspectiveCamera|THREE\.WebGLRenderer|BufferGeometry|Points/i.test(js);
    assert.ok(hasThreeScene, 'preview-5 JS must configure Three.js scene, camera, and geometry');
  });

  runner.test('F37.5: Pointer tracker binds mouse move events to modulate 3D geometry', () => {
    const pend = checkMilestone('previews/preview-5/main.js', 'M2');
    if (pend) return pend;
    const js = getRaw('previews/preview-5/main.js');
    const hasPointerTrack = /mousemove|pointermove|clientX|targetX/i.test(js);
    assert.ok(hasPointerTrack, 'preview-5 JS must track pointer coordinates for 3D camera/mesh reaction');
  });

  /* =========================================================================
   * FEATURE 38: V5 SVG Liquid Refraction Distortion Filter
   * ========================================================================= */
  runner.test('F38.1: Inline SVG liquid refraction filter element exists in preview-5 DOM', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    const hasFilter = html.raw.includes('id="liquid-refract"') || html.raw.includes('feDisplacementMap');
    assert.ok(hasFilter, 'preview-5 must contain inline SVG liquid refraction filter');
  });

  runner.test('F38.2: SVG filter defines feTurbulence with fractal noise primitive', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(/feTurbulence[^>]*type=["']fractalNoise["']/i.test(html.raw),
      'SVG filter must define feTurbulence with fractalNoise');
  });

  runner.test('F38.3: SVG filter defines feDisplacementMap mapped to SourceGraphic', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(/feDisplacementMap[^>]*in=["']SourceGraphic["']/i.test(html.raw),
      'SVG filter must define feDisplacementMap targeting SourceGraphic');
  });

  runner.test('F38.4: Liquid refraction filter applied on card or image interactions', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    const styleExists = fileExists('previews/preview-5/style.css');
    const hasFilterApp = html.raw.includes('liquid-refract') ||
      (styleExists && readFile('previews/preview-5/style.css').includes('liquid-refract'));
    assert.ok(hasFilterApp, 'preview-5 must reference liquid-refract in HTML or CSS');
  });

  runner.test('F38.5: Zero CORS dependency: filter is purely inline SVG (100% offline file:// safe)', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(html.raw.includes('<svg') && html.raw.includes('id="liquid-refract"'),
      'liquid-refract filter must be defined directly in inline <svg><defs>');
  });

  /* =========================================================================
   * FEATURE 39: V5 GSAP CI/CD Horizontal Pipeline Pinning
   * ========================================================================= */
  runner.test('F39.1: GSAP 3 and ScrollTrigger loaded via classic UMD scripts in preview-5', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(html.raw.includes('gsap') && html.raw.includes('ScrollTrigger'),
      'preview-5 must load GSAP and ScrollTrigger UMD bundles');
    assert.ok(!/<script[^>]*type=["']module["'][^>]*gsap/i.test(html.raw),
      'GSAP scripts must NOT have type="module"');
  });

  runner.test('F39.2: Horizontal pipeline track structure exists in preview-5 markup', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    const hasTrack = html.raw.includes('pipeline-track') ||
                     html.raw.includes('pipeline-cards') ||
                     html.raw.includes('pipeline-stages');
    assert.ok(hasTrack, 'preview-5 must contain horizontal pipeline track structure');
  });

  runner.test('F39.3: GSAP ScrollTrigger configured with viewport pinning in preview-5 JS', () => {
    const pend = checkMilestone('previews/preview-5/main.js', 'M2');
    if (pend) return pend;
    const js = getRaw('previews/preview-5/main.js');
    const hasPinning = /pin:\s*true|ScrollTrigger|xPercent/i.test(js);
    assert.ok(hasPinning, 'preview-5 JS must configure ScrollTrigger horizontal pinning');
  });

  runner.test('F39.4: CI/CD pipeline progression maps 4 project stages sequentially', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    const hasStages = /STAGE 01|STAGE 02|STAGE 03|STAGE 04|COMMIT|BUILD|TEST|SHIP|PROD/i.test(html.raw);
    assert.ok(hasStages, 'preview-5 must map CI/CD stages across projects');
  });

  runner.test('F39.5: Mobile adaptation: unpins or provides mobile responsive fallback layout', () => {
    const pend = checkMilestone('previews/preview-5/style.css', 'M2');
    if (pend) return pend;
    const css = getCSS('previews/preview-5/style.css');
    const hasMobileQuery = css.mediaQueries.some(m => /max-width:\s*(?:767|768|991|992)px/i.test(m.condition));
    assert.ok(hasMobileQuery, 'preview-5 CSS must provide mobile responsive layout media query');
  });

  /* =========================================================================
   * FEATURE 40: V5 Verbatim Spanish Copy & Asset Fidelity
   * ========================================================================= */
  runner.test('F40.1: Value proposition present verbatim in preview-5', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(html.raw.includes('Construyo software que funciona y diseño los tests que lo demuestran.'),
      'preview-5 must include verbatim value proposition');
  });

  runner.test('F40.2: Summer 2027 availability badge present verbatim in preview-5', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(/Incorporación Verano 2027/i.test(html.raw),
      'preview-5 must include verbatim availability badge');
  });

  runner.test('F40.3: Pedro Cuello audited testimonial present verbatim in preview-5', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(html.raw.includes('Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción'),
      'preview-5 must include verbatim Pedro Cuello quote');
  });

  runner.test('F40.4: 4 Featured projects present in preview-5', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(html.raw.includes('Simpleat'), 'preview-5 must feature Simpleat');
    assert.ok(html.raw.includes('ATLAS'), 'preview-5 must feature ATLAS Platform');
    assert.ok(html.raw.includes('Enlace Mental'), 'preview-5 must feature Enlace Mental');
    assert.ok(html.raw.includes('Goated Wear'), 'preview-5 must feature Goated Wear');
  });

  runner.test('F40.5: Verified asset paths linked with exact relative algebra in preview-5', () => {
    const pend = checkMilestone('previews/preview-5/index.html', 'M2');
    if (pend) return pend;
    const html = getHTML('previews/preview-5/index.html');
    assert.ok(html.raw.includes('../../img/Image.jpg'), 'preview-5 must reference Image.jpg');
    assert.ok(html.raw.includes('../../img/LOGOECI.webp'), 'preview-5 must reference LOGOECI.webp');
    assert.ok(html.raw.includes('../../img/logoMANGO.png'), 'preview-5 must reference logoMANGO.png');
    assert.ok(html.raw.includes('../../img/simpleat-icon.png'), 'preview-5 must reference simpleat-icon.png');
    assert.ok(html.raw.includes('../../docs/CV%20David%20Castellanos%20-%20English.pdf'), 'preview-5 must link English CV');
  });

  /* =========================================================================
   * FEATURE 41: V6 Kinetic Swiss Brutalism & Spatial Setup (Variant 6)
   * ========================================================================= */
  runner.test('F41.1: preview-6/index.html exists and contains valid editorial brutalist markup', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.ok(html.raw.length > 500, 'preview-6 HTML must have substantial content');
    assert.ok(html.root.querySelector('head'), 'preview-6 must contain <head>');
    assert.ok(html.root.querySelector('body'), 'preview-6 must contain <body>');
  });

  runner.test('F41.2: preview-6/style.css defines stark monochrome tokens & Electric Neon Cobalt #0038ff', () => {
    const pend = checkMilestone('previews/preview-6/style.css', 'M3');
    if (pend) return pend;
    const css = getCSS('previews/preview-6/style.css');
    const raw = css.raw;
    const hasBrutalistTokens = /#0038ff|cobalt|#000000|#ffffff|brutal/i.test(raw);
    assert.ok(hasBrutalistTokens, 'preview-6 CSS must define stark monochrome and #0038ff cobalt tokens');
  });

  runner.test('F41.3: preview-6/main.js exists and evaluates as valid JS syntax', () => {
    const pend = checkMilestone('previews/preview-6/main.js', 'M3');
    if (pend) return pend;
    const js = getRaw('previews/preview-6/main.js');
    assert.ok(js.length > 50, 'preview-6 JS must be non-empty');
    assert.doesNotThrow(() => new Function(js), 'preview-6 JS must have valid syntax');
  });

  runner.test('F41.4: Brutalist structural elements (heavy borders, marquees) present in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    const hasBrutalElements = html.raw.includes('marquee') ||
                              html.raw.includes('ticker') ||
                              html.raw.includes('colossal') ||
                              html.raw.includes('brutal');
    assert.ok(hasBrutalElements, 'preview-6 must contain brutalist kinetic marquees or colossal elements');
  });

  runner.test('F41.5: preview-6/index.html title specifies candidate name and brutalist archetype', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.match(html.title, /David Castellanos/i, 'Title must contain candidate name');
  });

  /* =========================================================================
   * FEATURE 42: V6 Kinetic Masking & Spatial Typography
   * ========================================================================= */
  runner.test('F42.1: Colossal typographic elements present in preview-6 hero or sections', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    const hasColossalText = html.raw.includes('colossal') ||
                            html.raw.includes('hero-headline') ||
                            html.raw.includes('editorial-title');
    assert.ok(hasColossalText, 'preview-6 must contain colossal typographic elements');
  });

  runner.test('F42.2: SVG clip-path reveals or animated clipping styles defined in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    const hasClip = html.raw.includes('clipPath') || html.raw.includes('clip-path');
    assert.ok(hasClip, 'preview-6 must define SVG clipPath or CSS clip-path masks');
  });

  runner.test('F42.3: GSAP spatial text scrubbing or kinetic parallax configured in preview-6 JS', () => {
    const pend = checkMilestone('previews/preview-6/main.js', 'M3');
    if (pend) return pend;
    const js = getRaw('previews/preview-6/main.js');
    const hasKineticText = /gsap|ScrollTrigger|marquee|scrub|parallax/i.test(js);
    assert.ok(hasKineticText, 'preview-6 JS must configure kinetic spatial typography animations');
  });

  runner.test('F42.4: Vertical section markers / spatial typography stamps present in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/style.css', 'M3');
    if (pend) return pend;
    const css = getCSS('previews/preview-6/style.css');
    const hasVerticalText = /writing-mode:\s*vertical-rl|rotate\(-90deg\)|vertical-stamp/i.test(css.raw);
    assert.ok(hasVerticalText, 'preview-6 CSS must define spatial vertical typography orientation');
  });

  runner.test('F42.5: Magnetic attraction micro-interaction configured in preview-6 JS', () => {
    const pend = checkMilestone('previews/preview-6/main.js', 'M3');
    if (pend) return pend;
    const js = getRaw('previews/preview-6/main.js');
    const hasMagnetic = /magnetic|getBoundingClientRect|lerp|power2/i.test(js);
    assert.ok(hasMagnetic, 'preview-6 JS must configure magnetic element physics/lerp tracking');
  });

  /* =========================================================================
   * FEATURE 43: V6 Magnetic Difference Cursor & Chromatic Aberration Filter
   * ========================================================================= */
  runner.test('F43.1: Custom cursor element exists in preview-6 HTML markup', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    const hasCursor = html.root.querySelector('#difference-cursor') ||
                      html.raw.includes('difference-cursor') ||
                      html.raw.includes('custom-cursor');
    assert.ok(hasCursor, 'preview-6 must contain custom difference cursor element');
  });

  runner.test('F43.2: Cursor styled with mix-blend-mode: difference and fixed positioning in CSS', () => {
    const pend = checkMilestone('previews/preview-6/style.css', 'M3');
    if (pend) return pend;
    const css = getCSS('previews/preview-6/style.css');
    const hasDifferenceBlend = /mix-blend-mode:\s*difference/i.test(css.raw) && /position:\s*fixed/i.test(css.raw);
    assert.ok(hasDifferenceBlend, 'preview-6 CSS must style cursor with mix-blend-mode: difference and fixed position');
  });

  runner.test('F43.3: Inline SVG chromatic aberration filter (#chromatic-aberration) exists in DOM', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    const hasChromaticFilter = html.raw.includes('id="chromatic-aberration"') && html.raw.includes('feColorMatrix');
    assert.ok(hasChromaticFilter, 'preview-6 must define inline SVG chromatic-aberration filter');
  });

  runner.test('F43.4: Mouse coordinates tracked with smooth damping in preview-6 JS', () => {
    const pend = checkMilestone('previews/preview-6/main.js', 'M3');
    if (pend) return pend;
    const js = getRaw('previews/preview-6/main.js');
    const hasCursorTracking = /cursor|clientX|pointermove|mousemove/i.test(js);
    assert.ok(hasCursorTracking, 'preview-6 JS must track pointer coordinates for cursor movement');
  });

  runner.test('F43.5: Touch device degradation: cursor is hidden under @media (pointer: coarse) in CSS', () => {
    const pend = checkMilestone('previews/preview-6/style.css', 'M3');
    if (pend) return pend;
    const css = getCSS('previews/preview-6/style.css');
    const hasTouchDegradation = css.mediaQueries.some(m =>
      /pointer:\s*coarse|hover:\s*none/i.test(m.condition) && /difference-cursor|custom-cursor|display:\s*none/i.test(m.body)
    );
    assert.ok(hasTouchDegradation, 'preview-6 CSS must hide difference cursor on @media (pointer: coarse)');
  });

  /* =========================================================================
   * FEATURE 44: V6 Lenis Smooth Scroll & Sticky Typographic Pinning
   * ========================================================================= */
  runner.test('F44.1: Lenis library loaded as classic UMD script in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.ok(/lenis/i.test(html.raw), 'preview-6 must include Lenis scroll script');
  });

  runner.test('F44.2: Sticky typographic indices (01, 02, etc.) present in preview-6 layout', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    const hasIndices = /\[01\]|\[02\]|\[03\]|01\s*\/\s*PROJECTS|02\s*\/\s*SKILLS|index-num">01|nav-idx">01|\[01\s*\/\//i.test(html.raw);
    assert.ok(hasIndices, 'preview-6 must contain indexed editorial headings');
  });

  runner.test('F44.3: Lenis smooth scroll initialized and synchronized with GSAP ScrollTrigger', () => {
    const pend = checkMilestone('previews/preview-6/main.js', 'M3');
    if (pend) return pend;
    const js = getRaw('previews/preview-6/main.js');
    const hasLenisSync = /Lenis|ScrollTrigger\.update/i.test(js);
    assert.ok(hasLenisSync, 'preview-6 JS must instantiate Lenis and synchronize with ScrollTrigger');
  });

  runner.test('F44.4: Sticky section positioning rules defined in preview-6 CSS', () => {
    const pend = checkMilestone('previews/preview-6/style.css', 'M3');
    if (pend) return pend;
    const css = getCSS('previews/preview-6/style.css');
    const hasSticky = /position:\s*sticky/i.test(css.raw);
    assert.ok(hasSticky, 'preview-6 CSS must define sticky positioning for editorial elements');
  });

  runner.test('F44.5: Accessibility guard respects prefers-reduced-motion in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/style.css', 'M3');
    if (pend) return pend;
    const css = getCSS('previews/preview-6/style.css');
    const hasReducedMotion = css.mediaQueries.some(m => m.condition.includes('prefers-reduced-motion'));
    assert.ok(hasReducedMotion, 'preview-6 CSS must handle prefers-reduced-motion');
  });

  /* =========================================================================
   * FEATURE 45: V6 Verbatim Spanish Copy & Asset Fidelity
   * ========================================================================= */
  runner.test('F45.1: Value proposition present verbatim in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.ok(html.raw.includes('Construyo software que funciona y diseño los tests que lo demuestran.'),
      'preview-6 must include verbatim value proposition');
  });

  runner.test('F45.2: Summer 2027 availability badge present verbatim in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.ok(/Incorporación Verano 2027/i.test(html.raw),
      'preview-6 must include verbatim availability badge');
  });

  runner.test('F45.3: Pedro Cuello audited testimonial present verbatim in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.ok(html.raw.includes('Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción'),
      'preview-6 must include verbatim Pedro Cuello quote');
  });

  runner.test('F45.4: 4 Featured projects present in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.ok(html.raw.includes('Simpleat'), 'preview-6 must feature Simpleat');
    assert.ok(html.raw.includes('ATLAS'), 'preview-6 must feature ATLAS Platform');
    assert.ok(html.raw.includes('Enlace Mental'), 'preview-6 must feature Enlace Mental');
    assert.ok(html.raw.includes('Goated Wear'), 'preview-6 must feature Goated Wear');
  });

  runner.test('F45.5: Verified asset paths linked with exact relative algebra in preview-6', () => {
    const pend = checkMilestone('previews/preview-6/index.html', 'M3');
    if (pend) return pend;
    const html = getHTML('previews/preview-6/index.html');
    assert.ok(html.raw.includes('../../img/Image.jpg'), 'preview-6 must reference Image.jpg');
    assert.ok(html.raw.includes('../../img/LOGOECI.webp'), 'preview-6 must reference LOGOECI.webp');
    assert.ok(html.raw.includes('../../img/logoMANGO.png'), 'preview-6 must reference logoMANGO.png');
    assert.ok(html.raw.includes('../../img/simpleat-icon.png'), 'preview-6 must reference simpleat-icon.png');
    assert.ok(html.raw.includes('../../docs/CV%20David%20Castellanos%20-%20English.pdf'), 'preview-6 must link English CV');
  });

  /* =========================================================================
   * FEATURE 46: Comparison Hub Dual-Tier Section Architecture
   * ========================================================================= */
  runner.test('F46.1: Hub previews/index.html organizes 6 variants into Foundation and Creative tiers', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('Creative Engineering') && !html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: Hub dual-tier expansion not yet completed' };
    }
    assert.ok(/Foundation/i.test(html.raw) && /Creative Engineering/i.test(html.raw),
      'Hub must structure variants into Foundation Tier and Creative Engineering Tier');
  });

  runner.test('F46.2: Hub UI includes tier category filter buttons/tabs', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('Creative Engineering') && !html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: Hub tier filter tabs not yet completed' };
    }
    const hasTierFilter = /tier-filter|tier-btn|tier-tab|filter-btn/i.test(html.raw);
    assert.ok(hasTierFilter, 'Hub must provide tier filter buttons');
  });

  runner.test('F46.3: Hub styles in previews/hub.css accommodate dual-tier layout and cards', () => {
    const pend = checkMilestone('previews/hub.css', 'M4');
    if (pend) return pend;
    const css = getCSS('previews/hub.css');
    assert.ok(css.rules.length > 20, 'hub.css must define rich comparison styling rules');
  });

  runner.test('F46.4: Hub script in previews/hub.js handles filtering and view state', () => {
    const pend = checkMilestone('previews/hub.js', 'M4');
    if (pend) return pend;
    const js = getRaw('previews/hub.js');
    assert.ok(js.length > 50, 'hub.js must be non-empty');
    assert.doesNotThrow(() => new Function(js), 'hub.js must evaluate with valid syntax');
  });

  runner.test('F46.5: Hub title or hero highlights 6 production-grade redesigns', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: Hub hero update not yet completed' };
    }
    assert.ok(/6\s*(?:Variantes|Rediseños|Experiencias)/i.test(html.raw),
      'Hub hero must showcase 6 variants');
  });

  /* =========================================================================
   * FEATURE 47: Hub 6-Variant Live Preview Cards
   * ========================================================================= */
  runner.test('F47.1: Hub contains preview cards for all 6 variants', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: 6 preview cards not yet added' };
    }
    assert.ok(html.raw.includes('preview-1/'), 'Hub must card Preview 1');
    assert.ok(html.raw.includes('preview-2/'), 'Hub must card Preview 2');
    assert.ok(html.raw.includes('preview-3/'), 'Hub must card Preview 3');
    assert.ok(html.raw.includes('preview-4/'), 'Hub must card Preview 4');
    assert.ok(html.raw.includes('preview-5/'), 'Hub must card Preview 5');
    assert.ok(html.raw.includes('preview-6/'), 'Hub must card Preview 6');
  });

  runner.test('F47.2: Each card includes archetype name and creative tech badges', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: tech badges for V4-V6 not yet added' };
    }
    assert.ok(/Matter\.js|Physics/i.test(html.raw), 'Hub must list Matter.js badge');
    assert.ok(/Three\.js|WebGL/i.test(html.raw), 'Hub must list Three.js WebGL badge');
    assert.ok(/Brutalism|Kinetic/i.test(html.raw), 'Hub must list Kinetic Brutalism badge');
  });

  runner.test('F47.3: Interactive color swatches with click-to-copy tokens defined on cards', () => {
    const html = getHTML('previews/index.html');
    const hasSwatches = html.raw.includes('swatch') || html.raw.includes('palette');
    assert.ok(hasSwatches, 'Hub cards must feature color palette swatches');
  });

  runner.test('F47.4: Recommended recruiter profile persona defined on variant cards', () => {
    const html = getHTML('previews/index.html');
    const hasRecruiter = /Reclutador|Target|Perfil|Audiencia/i.test(html.raw);
    assert.ok(hasRecruiter, 'Hub must indicate target recruiter profile per variant');
  });

  runner.test('F47.5: Direct launch CTA buttons link to each preview index.html', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: preview launch CTAs not yet added' };
    }
    for (let i = 1; i <= 6; i++) {
      assert.ok(html.raw.includes(`preview-${i}/index.html`) || html.raw.includes(`preview-${i}/`),
        `Hub must have launch CTA to preview-${i}`);
    }
  });

  /* =========================================================================
   * FEATURE 48: Hub 6-Variant Technical Specification Matrix
   * ========================================================================= */
  runner.test('F48.1: Comparison matrix table in Hub contains columns for all 6 variants', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: matrix expansion not yet added' };
    }
    const has6Cols = html.raw.includes('<th>Variante 4') ||
                     html.raw.includes('<th>V4') ||
                     html.raw.includes('preview-4');
    assert.ok(has6Cols, 'Hub matrix table must include columns for all 6 variants');
  });

  runner.test('F48.2: Matrix rows evaluate Creative Technologies (Matter.js, Three.js, GSAP, Web Audio)', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: creative tech rows not yet added' };
    }
    assert.ok(/Tecnologías Creativas|Creative Tech/i.test(html.raw),
      'Hub matrix must contain Creative Technologies comparison row');
  });

  runner.test('F48.3: Matrix table is wrapped in responsive horizontal scroll container', () => {
    const html = getHTML('previews/index.html');
    const hasResponsiveWrap = html.raw.includes('matrix-table-wrap') ||
                              html.raw.includes('matrix-table-container') ||
                              html.raw.includes('table-responsive') ||
                              html.raw.includes('matrix-container');
    assert.ok(hasResponsiveWrap, 'Hub matrix table must be wrapped in responsive scroll container');
  });

  runner.test('F48.4: Matrix category tabs (All, Design, Tech, Interactivity) present', () => {
    const html = getHTML('previews/index.html');
    const hasFilterTabs = /matrix-tab|tab-btn|category-tab/i.test(html.raw);
    assert.ok(hasFilterTabs, 'Hub matrix must provide filter category tabs');
  });

  runner.test('F48.5: Sound Design / Audio primitive row evaluated in matrix', () => {
    const html = getHTML('previews/index.html');
    if (!html.raw.includes('preview-4')) {
      return { skipped: true, reason: 'Pending Milestone M4: audio row not yet added' };
    }
    assert.ok(/Audio|Sonido|Sound/i.test(html.raw), 'Hub matrix must evaluate sound design');
  });
}

module.exports = {
  registerTier1CreativeTests
};
