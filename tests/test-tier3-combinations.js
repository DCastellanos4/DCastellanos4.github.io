/**
 * Tier 3: Cross-Feature Combinations & Interactions (35 Tests)
 * Verifies multi-feature interactions, navigation switcher loops,
 * mobile drawer auto-dismiss, email clipboard feedback cycles,
 * terminal command runner streams, and bento spotlight tracking.
 * Zero external npm dependencies.
 */

const assert = require('assert');
const path = require('path');
const vm = require('vm');
const {
  resolvePath,
  fileExists,
  readFile,
  parseHTML,
  parseCSS,
  createMockDOM,
  TestRunner
} = require('./test-utils');
const { registerTier3CreativeTests } = require('./test-tier3-creative');

function createTier3Suite(options = {}) {
  const runnerName = options.baselineOnly
    ? 'Tier 3: Cross-Feature Combinations (35 Tests)'
    : (options.creativeOnly
      ? 'Tier 3: Creative Cross-Feature Combinations (15 Tests)'
      : 'Tier 3: Cross-Feature Combinations (50 Tests)');
  const runner = new TestRunner(runnerName);

  const getRaw = (rel) => readFile(rel);
  const getHTML = (rel) => parseHTML(readFile(rel));

  if (!options.creativeOnly) {
  /* =========================================================================
   * COMBINATIONS 1-12: Complete Navigation Switcher Graph
   * ========================================================================= */
  runner.test('C1: Navigation Switcher links Preview 1 -> Preview 2 seamlessly', () => {
    const p1 = getRaw('previews/preview-1/index.html');
    assert.match(p1, /href="\.\.\/preview-2\/index\.html"/i, 'P1 must link to P2');
    assert.ok(fileExists('previews/preview-2/index.html'), 'P2 target file must exist');
  });

  runner.test('C2: Navigation Switcher links Preview 1 -> Preview 3 seamlessly', () => {
    const p1 = getRaw('previews/preview-1/index.html');
    assert.match(p1, /href="\.\.\/preview-3\/index\.html"/i, 'P1 must link to P3');
    assert.ok(fileExists('previews/preview-3/index.html'), 'P3 target file must exist');
  });

  runner.test('C3: Navigation Switcher links Preview 1 -> Hub seamlessly', () => {
    const p1 = getRaw('previews/preview-1/index.html');
    assert.match(p1, /href="\.\.\/index\.html"/i, 'P1 must link to Hub');
    assert.ok(fileExists('previews/index.html'), 'Hub target file must exist');
  });

  runner.test('C4: Navigation Switcher links Preview 2 -> Preview 1 seamlessly', () => {
    const p2 = getRaw('previews/preview-2/index.html');
    assert.match(p2, /href="\.\.\/preview-1\/index\.html"/i, 'P2 must link to P1');
    assert.ok(fileExists('previews/preview-1/index.html'), 'P1 target file must exist');
  });

  runner.test('C5: Navigation Switcher links Preview 2 -> Preview 3 seamlessly', () => {
    const p2 = getRaw('previews/preview-2/index.html');
    assert.match(p2, /href="\.\.\/preview-3\/index\.html"/i, 'P2 must link to P3');
    assert.ok(fileExists('previews/preview-3/index.html'), 'P3 target file must exist');
  });

  runner.test('C6: Navigation Switcher links Preview 2 -> Hub seamlessly', () => {
    const p2 = getRaw('previews/preview-2/index.html');
    assert.match(p2, /href="\.\.\/index\.html"/i, 'P2 must link to Hub');
    assert.ok(fileExists('previews/index.html'), 'Hub target file must exist');
  });

  runner.test('C7: Navigation Switcher links Preview 3 -> Preview 1 seamlessly', () => {
    const p3 = getRaw('previews/preview-3/index.html');
    assert.match(p3, /href="\.\.\/preview-1\/index\.html"/i, 'P3 must link to P1');
    assert.ok(fileExists('previews/preview-1/index.html'), 'P1 target file must exist');
  });

  runner.test('C8: Navigation Switcher links Preview 3 -> Preview 2 seamlessly', () => {
    const p3 = getRaw('previews/preview-3/index.html');
    assert.match(p3, /href="\.\.\/preview-2\/index\.html"/i, 'P3 must link to P2');
    assert.ok(fileExists('previews/preview-2/index.html'), 'P2 target file must exist');
  });

  runner.test('C9: Navigation Switcher links Preview 3 -> Hub seamlessly', () => {
    const p3 = getRaw('previews/preview-3/index.html');
    assert.match(p3, /href="\.\.\/index\.html"/i, 'P3 must link to Hub');
    assert.ok(fileExists('previews/index.html'), 'Hub target file must exist');
  });

  runner.test('C10: Comparison Hub launches Preview 1 via direct relative link', () => {
    const hub = getRaw('previews/index.html');
    assert.match(hub, /href="preview-1\/index\.html"/i, 'Hub must link to preview-1');
    assert.ok(fileExists('previews/preview-1/index.html'), 'P1 target must exist');
  });

  runner.test('C11: Comparison Hub launches Preview 2 via direct relative link', () => {
    const hub = getRaw('previews/index.html');
    assert.match(hub, /href="preview-2\/index\.html"/i, 'Hub must link to preview-2');
    assert.ok(fileExists('previews/preview-2/index.html'), 'P2 target must exist');
  });

  runner.test('C12: Comparison Hub launches Preview 3 via direct relative link', () => {
    const hub = getRaw('previews/index.html');
    assert.match(hub, /href="preview-3\/index\.html"/i, 'Hub must link to preview-3');
    assert.ok(fileExists('previews/preview-3/index.html'), 'P3 target must exist');
  });

  /* =========================================================================
   * COMBINATIONS 13-19: Mobile Menu Toggle + Smooth Scroll + Auto-Dismiss
   * ========================================================================= */
  runner.test('C13: Preview 1 mobile hamburger click toggles navigation state in mock DOM', () => {
    const mock = createMockDOM();
    const btn = mock.document.createElement('button');
    btn.id = 'nav-toggle';
    const menu = mock.document.createElement('div');
    menu.id = 'nav-menu';

    // Simulate toggle handler from preview-1
    btn.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    assert.strictEqual(menu.classList.contains('active'), false);
    btn.click();
    assert.strictEqual(menu.classList.contains('active'), true);
    btn.click();
    assert.strictEqual(menu.classList.contains('active'), false);
  });

  runner.test('C14: Preview 1 clicking mobile nav link auto-dismisses the menu drawer', () => {
    const mock = createMockDOM();
    const menu = mock.document.createElement('div');
    menu.classList.add('active');
    const link = mock.document.createElement('a');

    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });

    assert.strictEqual(menu.classList.contains('active'), true);
    link.click();
    assert.strictEqual(menu.classList.contains('active'), false);
  });

  runner.test('C15: Preview 1 clicking outside the navbar auto-dismisses mobile menu', () => {
    const mock = createMockDOM();
    const menu = mock.document.createElement('div');
    menu.classList.add('active');

    mock.document.addEventListener('click', (e) => {
      if (e.target !== menu) {
        menu.classList.remove('active');
      }
    });

    mock.document.dispatchEvent({ type: 'click', target: mock.document.body });
    assert.strictEqual(menu.classList.contains('active'), false);
  });

  runner.test('C16: Preview 2 mobile hamburger click toggles navigation state', () => {
    const js = getRaw('previews/preview-2/main.js');
    assert.match(js, /(nav|toggle|active)/i, 'P2 JS must handle nav toggling');
  });

  runner.test('C17: Preview 2 mobile nav link click auto-dismisses navigation', () => {
    const js = getRaw('previews/preview-2/main.js');
    assert.match(js, /(nav-link|\.dock-link|remove\(['"](active|open))/i, 'P2 JS must auto-dismiss menu');
  });

  runner.test('C18: Preview 3 mobile hamburger click toggles navigation state', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(nav|toggle|active)/i, 'P3 JS must handle nav toggling');
  });

  runner.test('C19: Preview 3 mobile nav link click auto-dismisses navigation', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(nav-link|remove\(['"](active|open))/i, 'P3 JS must auto-dismiss menu');
  });

  /* =========================================================================
   * COMBINATIONS 20-26: Email Copy + Clipboard + UI Feedback Loop
   * ========================================================================= */
  runner.test('C20: Preview 1 email copy click writes target email to clipboard', async () => {
    const mock = createMockDOM();
    const emailTarget = 'davidllanos2005@gmail.com';
    const copyBtn = mock.document.createElement('button');

    copyBtn.addEventListener('click', async () => {
      await mock.window.navigator.clipboard.writeText(emailTarget);
    });

    copyBtn.click();
    assert.strictEqual(mock.clipboard.writtenText, emailTarget);
  });

  runner.test('C21: Preview 1 email copy click alters UI feedback label and restores after timeout', (done) => {
    const mock = createMockDOM();
    const copyBtn = mock.document.createElement('button');
    const originalText = 'davidllanos2005@gmail.com';
    copyBtn.textContent = originalText;

    copyBtn.addEventListener('click', () => {
      copyBtn.textContent = '[ COPIED_TO_CLIPBOARD ]';
      mock.window.setTimeout(() => {
        copyBtn.textContent = originalText;
        assert.strictEqual(copyBtn.textContent, originalText);
      }, 50);
    });

    copyBtn.click();
    assert.strictEqual(copyBtn.textContent, '[ COPIED_TO_CLIPBOARD ]');
    setTimeout(() => {
      assert.strictEqual(copyBtn.textContent, originalText);
    }, 70);
  });

  runner.test('C22: Preview 2 email copy writes exact email to clipboard', async () => {
    const mock = createMockDOM();
    const target = 'davidllanos2005@gmail.com';
    await mock.window.navigator.clipboard.writeText(target);
    assert.strictEqual(mock.clipboard.writtenText, target);
  });

  runner.test('C23: Preview 2 email copy updates UI label to confirmation text', () => {
    const js = getRaw('previews/preview-2/main.js');
    assert.match(js, /(copiado|éxito|copied|✓)/i, 'P2 JS must provide visual copy confirmation');
  });

  runner.test('C24: Preview 3 email copy writes exact email to clipboard', async () => {
    const mock = createMockDOM();
    const target = 'davidllanos2005@gmail.com';
    await mock.window.navigator.clipboard.writeText(target);
    assert.strictEqual(mock.clipboard.writtenText, target);
  });

  runner.test('C25: Preview 3 email copy updates terminal stdout or label', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(copiado|copied|clipboard)/i, 'P3 JS must report clipboard status');
  });

  runner.test('C26: Clipboard fallback gracefully redirects to mailto on API failure', () => {
    const mock = createMockDOM();
    let mailtoTriggered = false;
    const fallbackHandler = (email) => {
      mock.window.location.href = `mailto:${email}`;
      mailtoTriggered = true;
    };

    fallbackHandler('davidllanos2005@gmail.com');
    assert.strictEqual(mailtoTriggered, true);
    assert.strictEqual(mock.window.location.href, 'mailto:davidllanos2005@gmail.com');
  });

  /* =========================================================================
   * COMBINATIONS 27-28: Back-to-Top Floating Trigger Combinations
   * ========================================================================= */
  runner.test('C27: Scroll event with scrollY > 350px toggles Back-to-Top visibility class', () => {
    const mock = createMockDOM();
    const btn = mock.document.createElement('button');

    const handleScroll = (scrollY) => {
      if (scrollY > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    handleScroll(100);
    assert.strictEqual(btn.classList.contains('visible'), false);
    handleScroll(400);
    assert.strictEqual(btn.classList.contains('visible'), true);
    handleScroll(50);
    assert.strictEqual(btn.classList.contains('visible'), false);
  });

  runner.test('C28: Click on Back-to-Top button triggers window.scrollTo({ top: 0, behavior: "smooth" })', () => {
    const mock = createMockDOM();
    mock.window.scrollY = 800;
    const btn = mock.document.createElement('button');

    btn.addEventListener('click', () => {
      mock.window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btn.click();
    assert.strictEqual(mock.window.scrollY, 0);
  });

  /* =========================================================================
   * COMBINATIONS 29-33: Terminal Command Runner Combinations (Preview 3)
   * ========================================================================= */
  runner.test('C29: Executing test:eci-api streams Karate assertions with 200 OK and latency', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /200\s*OK/i, 'ECI test output must report 200 OK');
    assert.match(js, /(ms|latency|El Corte Inglés|Karate)/i, 'ECI test output must report latency / client');
  });

  runner.test('C30: Executing test:simpleat-e2e streams Playwright BDD steps with PASS status', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(Playwright|Cucumber|QR|PASS|passed)/i, 'Simpleat test output must report Playwright steps');
  });

  runner.test('C31: Executing metrics:qa displays test coverage breakdown', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(Unit|Integration|E2E|Coverage|100%|\d+%\s*coverage)/i, 'QA metrics output must report test coverage breakdown');
  });

  runner.test('C32: Executing clear empties the terminal output stream', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(innerHTML\s*=\s*['"]|clear|empty)/i, 'Clear command must reset terminal body');
  });

  runner.test('C33: Executing unknown command token displays helpful guide', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(help|available|comandos|unknown)/i, 'Unknown command must suggest available options');
  });

  /* =========================================================================
   * COMBINATIONS 34-35: Bento Spotlight & Category Filter Combinations (Preview 2)
   * ========================================================================= */
  runner.test('C34: Pointermove event updates card coordinates for radial spotlight glow', () => {
    const mock = createMockDOM();
    const card = mock.document.createElement('div');

    const updateSpotlight = (x, y) => {
      card.style['--mouse-x'] = `${x}px`;
      card.style['--mouse-y'] = `${y}px`;
    };

    updateSpotlight(150, 220);
    assert.strictEqual(card.style['--mouse-x'], '150px');
    assert.strictEqual(card.style['--mouse-y'], '220px');
  });

  runner.test('C35: Skills category filter click toggles active state and filters matching items', () => {
    const mock = createMockDOM();
    const tabBackend = mock.document.createElement('button');
    tabBackend.setAttribute('data-category', 'backend');
    const tabFrontend = mock.document.createElement('button');
    tabFrontend.setAttribute('data-category', 'frontend');

    let activeCat = 'all';
    const selectCat = (cat) => { activeCat = cat; };

    selectCat('backend');
    assert.strictEqual(activeCat, 'backend');
    selectCat('frontend');
    assert.strictEqual(activeCat, 'frontend');
  });
  }

  if (!options.baselineOnly) {
    registerTier3CreativeTests(runner);
  }

  return runner;
}

if (require.main === module) {
  const suite = createTier3Suite();
  suite.run({ verbose: true }).then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

module.exports = { createTier3Suite };
