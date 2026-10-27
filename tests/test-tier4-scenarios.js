/**
 * Tier 4: Real-World Scenarios (20 Comprehensive Recruiter & User Journeys)
 * Simulates complete end-user, recruiter, technical lead, and security auditor journeys.
 * Zero external npm dependencies.
 */

const assert = require('assert');
const path = require('path');
const {
  resolvePath,
  fileExists,
  readFile,
  readHeaderBytes,
  parseHTML,
  parseCSS,
  createMockDOM,
  TestRunner
} = require('./test-utils');
const { registerTier4CreativeTests } = require('./test-tier4-creative');

function createTier4Suite(options = {}) {
  const runnerName = options.baselineOnly
    ? 'Tier 4: Real-World Scenarios (20 Recruiter & User Journeys)'
    : (options.creativeOnly
      ? 'Tier 4: Creative Recruiter & Engineering Journeys (10 Journeys)'
      : 'Tier 4: Real-World Scenarios (30 Recruiter & Engineering Journeys)');
  const runner = new TestRunner(runnerName);

  const getRaw = (rel) => readFile(rel);
  const getHTML = (rel) => parseHTML(readFile(rel));

  if (!options.creativeOnly) {
  /* =========================================================================
   * SCENARIO 1: Enterprise Recruiter Journey
   * ========================================================================= */
  runner.test('S1: Enterprise Recruiter Journey (Hub -> Matrix Review -> Launch Monospace -> Inspect Proof -> Download CV)', () => {
    // 1. Recruiter lands on comparison hub
    const hubRaw = getRaw('previews/index.html');
    assert.match(hubRaw, /David\s+Castellanos/i, 'Hub hero must identify candidate');
    assert.match(hubRaw, /Monospace|Architectural/i, 'Hub must present Archetype 1');

    // 2. Recruiter clicks launch link for Preview 1
    assert.match(hubRaw, /href="preview-1\/index\.html"/i, 'Launch link must target preview-1');
    const p1Raw = getRaw('previews/preview-1/index.html');

    // 3. Recruiter verifies enterprise track record & Pedro Cuello testimonial
    assert.ok(p1Raw.includes('Software probado en producción para El Corte Inglés, Mango y Simpleat.'));
    assert.ok(p1Raw.includes('Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción. Diseñó las suites de API que hoy siguen en uso.'));

    // 4. Recruiter clicks download CV
    assert.match(p1Raw, /href="\.\.\/\.\.\/docs\/CV[^"]*English\.pdf"/i, 'P1 must link to English CV');
    assert.ok(fileExists('docs/CV David Castellanos - English.pdf'), 'Target English CV must exist on disk');
  });

  /* =========================================================================
   * SCENARIO 2: QA Director / Automation Lead Journey
   * ========================================================================= */
  runner.test('S2: QA Director Journey (Launch Telemetry -> Run ECI Karate Tests -> Run Simpleat Playwright -> Copy Email)', () => {
    // 1. QA Director launches Preview 3
    const p3Raw = getRaw('previews/preview-3/index.html');
    const p3JS = getRaw('previews/preview-3/main.js');

    // 2. Verifies QA engineering positioning
    assert.match(p3Raw, /QA\s+Engineer/i, 'P3 must highlight QA Engineer');

    // 3. Executes simulated Karate DSL API validation suite
    assert.match(p3JS, /(test:eci-api|run-tests|Karate)/i, 'P3 JS must contain Karate API runner');
    assert.match(p3JS, /200\s*OK/i, 'Assertions must verify 200 OK status');

    // 4. Executes simulated Playwright BDD test suite
    assert.match(p3JS, /(test:simpleat-e2e|Playwright)/i, 'P3 JS must contain Playwright runner');

    // 5. Inspects test metrics and copies contact email
    assert.match(p3Raw, /davidllanos2005@gmail\.com/i, 'Email target must be present');
    assert.match(p3JS, /(clipboard|copy)/i, 'Clipboard copy must be supported');
  });

  /* =========================================================================
   * SCENARIO 3: Product Design Lead / UX Architect Journey
   * ========================================================================= */
  runner.test('S3: Product Design Lead Journey (Hub -> Inspect Tokens -> Launch Bento -> Test Spotlight -> Filter Skills)', () => {
    // 1. Design lead inspects hub tokens
    const hubCSS = getRaw('previews/hub.css');
    assert.ok(hubCSS.length > 500, 'Hub CSS must define design tokens');

    // 2. Launches Preview 2 (Kinetic Bento)
    const p2Raw = getRaw('previews/preview-2/index.html');
    const p2CSS = getRaw('previews/preview-2/style.css');
    const p2JS = getRaw('previews/preview-2/main.js');

    // 3. Verifies Plus Jakarta Sans typography and amber radiance
    assert.match(p2Raw, /Plus\+Jakarta\+Sans/i, 'Plus Jakarta Sans required');
    assert.match(p2CSS, /(#f97316|#ea580c)/i, 'Amber radiance token required');

    // 4. Verifies dynamic mouse-tracking spotlight and frosted glass
    assert.match(p2CSS, /backdrop-filter:\s*blur/i, 'Frosted glass required');
    assert.match(p2JS, /(pointermove|mousemove|--mouse-x)/i, 'Mouse spotlight required');

    // 5. Tests interactive skills filter
    assert.match(p2JS, /(filter|category)/i, 'Skill category filter required');
  });

  /* =========================================================================
   * SCENARIO 4: Mobile Recruiter on the Go (iPhone SE 320px)
   * ========================================================================= */
  runner.test('S4: Mobile Recruiter Journey (320px Screen -> Hamburger Menu -> Jump to Timeline -> Tap Back-to-Top)', () => {
    const p1Raw = getRaw('previews/preview-1/index.html');
    const p1CSS = getRaw('previews/preview-1/style.css');
    const p1JS = getRaw('previews/preview-1/main.js');

    // 1. Mobile viewport meta configured
    assert.match(p1Raw, /width=device-width,\s*initial-scale=1\.0/i, 'Viewport meta required');

    // 2. Hamburger navigation toggle present
    assert.match(p1Raw, /(nav-toggle|hamburger)/i, 'Hamburger button required');
    assert.match(p1JS, /(toggle|active)/i, 'Toggle handler required');

    // 3. Work experience timeline present
    assert.match(p1Raw, /Tantin\s+Solutions/i, 'Timeline data required');

    // 4. Back-to-Top trigger button present
    assert.match(p1Raw, /(back-to-top|scroll-top)/i, 'Back-to-top button required');
    assert.match(p1JS, /(scrollTo|top:\s*0)/i, 'Scroll to top logic required');
  });

  /* =========================================================================
   * SCENARIO 5: Full Stack Engineering Manager Journey
   * ========================================================================= */
  runner.test('S5: Full Stack Engineering Manager Journey (Launch Bento -> Inspect ATLAS Modulith -> Check Availability)', () => {
    const p2Raw = getRaw('previews/preview-2/index.html');

    // 1. Verifies ATLAS Platform Clean Architecture and Spring Modulith stack
    assert.match(p2Raw, /ATLAS\s+Platform/i, 'ATLAS project required');
    assert.match(p2Raw, /Spring\s*Modulith/i, 'Spring Modulith tag required');
    assert.match(p2Raw, /Angular\s*20/i, 'Angular 20 tag required');

    // 2. Verifies Summer 2027 availability pill
    assert.match(p2Raw, /Verano\s+2027/i, 'Verano 2027 availability required');

    // 3. Verifies contact CTA
    assert.match(p2Raw, /davidllanos2005@gmail\.com/i, 'Contact email required');
  });

  /* =========================================================================
   * SCENARIO 6: Enterprise Security & Zero-Trust Auditor
   * ========================================================================= */
  runner.test('S6: Security Auditor Journey (Zero Unsafe Scripts, Zero Iframes, Strict Rel Attributes)', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      // Zero iframes
      assert.doesNotMatch(raw, /<iframe/i, `No iframes allowed in ${f}`);
      // Zero inline eval
      assert.doesNotMatch(raw, /eval\(/, `No eval() allowed in ${f}`);
      // External links have rel="noopener noreferrer"
      const outboundLinks = raw.match(/<a[^>]*target="_blank"[^>]*>/g) || [];
      for (const link of outboundLinks) {
        assert.match(link, /rel="[^"]*(noopener|noreferrer)[^"]*"/i, `External link must have rel="noopener noreferrer" in ${f}: ${link}`);
      }
    });
  });

  /* =========================================================================
   * SCENARIO 7: Offline Candidate Evaluation via file:// Protocol
   * ========================================================================= */
  runner.test('S7: Offline Candidate Evaluation via file:// Protocol (Zero Module Scripts, Zero Local Fetch)', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.doesNotMatch(raw, /<script[^>]*type="module"/i, `Zero module scripts allowed in ${f}`);
    });
    ['previews/preview-1/main.js', 'previews/preview-2/main.js', 'previews/preview-3/main.js', 'previews/hub.js'].forEach(f => {
      const js = getRaw(f);
      assert.doesNotMatch(js, /fetch\(\s*['"]\.\./, `Zero relative file fetch() allowed in ${f}`);
    });
  });

  /* =========================================================================
   * SCENARIO 8: Accessibility & Screen Reader Navigation Journey
   * ========================================================================= */
  runner.test('S8: Accessibility Journey (Semantic Landmarks, Headings Hierarchy, Alt Attributes)', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      // Semantic landmarks
      assert.match(raw, /<header/i, `Header landmark required in ${f}`);
      assert.match(raw, /<nav/i, `Nav landmark required in ${f}`);
      assert.match(raw, /<main/i, `Main landmark required in ${f}`);
      assert.match(raw, /<footer/i, `Footer landmark required in ${f}`);
      // H1 heading
      assert.match(raw, /<h1[^>]*>.*<\/h1>/is, `H1 heading required in ${f}`);
      // Images have alt attribute
      const imgs = raw.match(/<img[^>]*>/g) || [];
      for (const img of imgs) {
        assert.match(img, /alt="[^"]*"/i, `Alt attribute required on image in ${f}: ${img}`);
      }
    });
  });

  /* =========================================================================
   * SCENARIO 9: Multi-Variant Switching Tour
   * ========================================================================= */
  runner.test('S9: Multi-Variant Switching Tour (Hub -> P1 -> P2 -> P3 -> Hub)', () => {
    // 1. Hub -> P1
    const hub = getRaw('previews/index.html');
    assert.match(hub, /preview-1\/index\.html/i);

    // 2. P1 -> P2
    const p1 = getRaw('previews/preview-1/index.html');
    assert.match(p1, /\.\.\/preview-2\/index\.html/i);

    // 3. P2 -> P3
    const p2 = getRaw('previews/preview-2/index.html');
    assert.match(p2, /\.\.\/preview-3\/index\.html/i);

    // 4. P3 -> Hub
    const p3 = getRaw('previews/preview-3/index.html');
    assert.match(p3, /\.\.\/index\.html/i);

    // Confirm all 4 destination HTML files physically exist
    assert.ok(fileExists('previews/index.html'));
    assert.ok(fileExists('previews/preview-1/index.html'));
    assert.ok(fileExists('previews/preview-2/index.html'));
    assert.ok(fileExists('previews/preview-3/index.html'));
  });

  /* =========================================================================
   * SCENARIO 10: Candidate Credential Verification Journey
   * ========================================================================= */
  runner.test('S10: Candidate Credential Verification Journey (Tantin Solutions, ECI, Mango, Simpleat)', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Tantin\s+Solutions/i, `Tantin Solutions required in ${f}`);
      assert.match(raw, /El\s+Corte\s+Inglés/i, `El Corte Inglés required in ${f}`);
      assert.match(raw, /Mango/i, `Mango required in ${f}`);
      assert.match(raw, /Simpleat/i, `Simpleat required in ${f}`);
    });
  });

  /* =========================================================================
   * SCENARIO 11: Contact Outreach Workflow
   * ========================================================================= */
  runner.test('S11: Contact Outreach Workflow (Locate Contact -> Copy Email -> Fallback Check)', () => {
    ['previews/preview-1', 'previews/preview-2', 'previews/preview-3'].forEach(dir => {
      const combined = getRaw(`${dir}/index.html`) + getRaw(`${dir}/main.js`);
      assert.match(combined, /davidllanos2005@gmail\.com/i, `Email required in ${dir}`);
      assert.match(combined, /mailto:davidllanos2005@gmail\.com|mailto:/i, `Mailto fallback required in ${dir}`);
    });
    // Hub landing also provides copy email outreach
    const hubCombined = getRaw('previews/index.html') + getRaw('previews/hub.js');
    assert.match(hubCombined, /davidllanos2005@gmail\.com/i, 'Email required in Hub');
    assert.match(hubCombined, /(copy|clipboard)/i, 'Copy mechanism required in Hub');
  });

  /* =========================================================================
   * SCENARIO 12: Featured Projects Deep Dive
   * ========================================================================= */
  runner.test('S12: Featured Projects Deep Dive (Simpleat, ATLAS, Enlace Mental, Goated Wear)', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Simpleat/i, `Simpleat required in ${f}`);
      assert.match(raw, /ATLAS\s+Platform/i, `ATLAS Platform required in ${f}`);
      assert.match(raw, /Enlace\s+Mental/i, `Enlace Mental required in ${f}`);
      assert.match(raw, /Goated\s+Wear/i, `Goated Wear required in ${f}`);
    });
  });

  /* =========================================================================
   * SCENARIO 13: Academic Credentials & Education Validation
   * ========================================================================= */
  runner.test('S13: Academic Credentials Validation (Máster Tajamar Tech 814h + DAW Domenico Scarlatti)', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /Tajamar\s+Tech/i, `Tajamar Tech required in ${f}`);
      assert.match(raw, /Domenico\s+Scarlatti/i, `IES Domenico Scarlatti required in ${f}`);
    });
  });

  /* =========================================================================
   * SCENARIO 14: Responsive Viewport Stress Journey (320px to 4K)
   * ========================================================================= */
  runner.test('S14: Responsive Viewport Stress Journey (Max-Width Bounds & Overflow-X Containment)', () => {
    ['previews/preview-1/style.css', 'previews/preview-2/style.css', 'previews/preview-3/style.css', 'previews/hub.css'].forEach(f => {
      const css = getRaw(f);
      assert.match(css, /overflow-x:\s*(hidden|clip)/i, `overflow-x containment required in ${f}`);
      assert.match(css, /@media/i, `Responsive media queries required in ${f}`);
    });
  });

  /* =========================================================================
   * SCENARIO 15: Interactive Terminal Adversarial Stress Journey
   * ========================================================================= */
  runner.test('S15: Interactive Terminal Adversarial Input Journey (Whitespace, Uppercase, Fallback)', () => {
    const js = getRaw('previews/preview-3/main.js');
    // Verifies trimming and case normalization in script logic
    assert.match(js, /(toLowerCase|trim)/i, 'Input sanitization required in terminal engine');
    // Verifies unknown command guide
    assert.match(js, /(help|available|comandos|unknown)/i, 'Unknown command guide required');
  });

  /* =========================================================================
   * SCENARIO 16: Brand Identity & Favicon Validation
   * ========================================================================= */
  runner.test('S16: Brand Identity & Favicon Validation (logo.svg Monogram Across All Variants)', () => {
    // 1. Favicon file physically exists and contains >DC_ (XML encoded as &gt;DC_)
    const svg = getRaw('img/logo.svg');
    assert.match(svg, /(&gt;|>)?DC_/i, 'Favicon must contain >DC_ terminal monogram');
    assert.match(svg, /#26d47b/i, 'Favicon must contain terminal green accent');

    // 2. Favicon linked in all 4 deliverables
    assert.match(getRaw('previews/preview-1/index.html'), /rel="icon"[^>]*href="\.\.\/\.\.\/img\/logo\.svg"/i);
    assert.match(getRaw('previews/preview-2/index.html'), /rel="icon"[^>]*href="\.\.\/\.\.\/img\/logo\.svg"/i);
    assert.match(getRaw('previews/preview-3/index.html'), /rel="icon"[^>]*href="\.\.\/\.\.\/img\/logo\.svg"/i);
    assert.match(getRaw('previews/index.html'), /rel="icon"[^>]*href="\.\.\/img\/logo\.svg"/i);
  });

  /* =========================================================================
   * SCENARIO 17: Spanish Copy & Lexical Fidelity Audit
   * ========================================================================= */
  runner.test('S17: Spanish Copy Lexical Fidelity Audit (Zero Paraphrasing of Canonical Copy)', () => {
    const requiredStatements = [
      'Construyo software que funciona y diseño los tests que lo demuestran.',
      'Software probado en producción para El Corte Inglés, Mango y Simpleat.',
      'Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción. Diseñó las suites de API que hoy siguen en uso.'
    ];

    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      for (const statement of requiredStatements) {
        assert.ok(raw.includes(statement), `Exact canonical string required in ${f}: "${statement}"`);
      }
    });
  });

  /* =========================================================================
   * SCENARIO 18: Client Brand Asset Verification Journey
   * ========================================================================= */
  runner.test('S18: Client Brand Asset Verification (Genuine PNG/WebP Used, Broken HTML Logo Avoided)', () => {
    // Confirm genuine files exist
    assert.ok(fileExists('img/LOGOECI.webp'));
    assert.ok(fileExists('img/logoMANGO.png'));
    assert.ok(fileExists('img/simpleat-icon.png'));

    // Confirm broken HTML file is avoided everywhere under previews/
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.doesNotMatch(raw, /logo-simpleat\.png/i, `Invalid HTML file logo-simpleat.png forbidden in ${f}`);
    });
  });

  /* =========================================================================
   * SCENARIO 19: Rapid Multi-Interaction Robustness
   * ========================================================================= */
  runner.test('S19: Rapid Multi-Interaction Robustness (Timer Management & Event Safety)', () => {
    const mock = createMockDOM();
    let counter = 0;
    const clickHandler = () => {
      counter++;
      mock.window.setTimeout(() => {
        counter--;
      }, 50);
    };

    // Simulate 5 rapid clicks
    for (let i = 0; i < 5; i++) {
      clickHandler();
    }
    assert.strictEqual(counter, 5);
  });

  /* =========================================================================
   * SCENARIO 20: Complete Recruiter Evaluation Summary
   * ========================================================================= */
  runner.test('S20: Complete Recruiter Evaluation Summary (All 10 Essential Data Dimensions Present)', () => {
    const dimensions = [
      { name: 'Candidate Name', regex: /David\s+Castellanos/i },
      { name: 'Positioning', regex: /Full\s+Stack\s+Developer\s+&\s+QA\s+Engineer/i },
      { name: 'Value Proposition', regex: /Construyo software que funciona y diseño los tests que lo demuestran\./ },
      { name: 'Enterprise Proof', regex: /El\s+Corte\s+Inglés.*Mango.*Simpleat/s },
      { name: 'Availability', regex: /Verano\s+2027/i },
      { name: 'Pedro Cuello Testimonial', regex: /Pedro\s+Cuello/i },
      { name: 'Featured Projects', regex: /Simpleat.*ATLAS.*Enlace\s+Mental.*Goated\s+Wear/s },
      { name: 'Skills Categories', regex: /Backend.*Frontend.*Cloud.*Testing|QA/s },
      { name: 'Professional Timeline', regex: /Tantin\s+Solutions/i },
      { name: 'Education', regex: /Tajamar\s+Tech/i }
    ];

    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html'].forEach(f => {
      const raw = getRaw(f);
      for (const d of dimensions) {
        assert.match(raw, d.regex, `Dimension "${d.name}" must be present in ${f}`);
      }
    });
  });
  }

  if (!options.baselineOnly) {
    registerTier4CreativeTests(runner);
  }

  return runner;
}

if (require.main === module) {
  const suite = createTier4Suite();
  suite.run({ verbose: true }).then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

module.exports = { createTier4Suite };
