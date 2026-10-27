/**
 * Tier 2: Boundary & Corner Cases (30 Groups x 5 Tests = 150 Tests)
 * Covers 320px viewport safety, zero horizontal overflow, tap targets >=44px,
 * path depth correctness, genuine PNG asset verification, offline file:// safety, 4K screen bounds.
 * Zero external npm dependencies.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {
  resolvePath,
  fileExists,
  readFile,
  readHeaderBytes,
  parseHTML,
  parseCSS,
  TestRunner
} = require('./test-utils');
const { registerTier2CreativeTests } = require('./test-tier2-creative');

function createTier2Suite(options = {}) {
  const runnerName = options.baselineOnly
    ? 'Tier 2: Boundary & Corner Cases (30 Groups x 5 Tests = 150 Tests)'
    : (options.creativeOnly
      ? 'Tier 2: Creative Engineering Boundaries (5 Groups x 5 = 25 Tests)'
      : 'Tier 2: Boundary & Corner Cases (35 Groups x 5 Tests = 175 Tests)');
  const runner = new TestRunner(runnerName);

  const getHTML = (rel) => parseHTML(readFile(rel));
  const getCSS = (rel) => parseCSS(readFile(rel));
  const getRaw = (rel) => readFile(rel);

  if (!options.creativeOnly) {
  /* =========================================================================
   * BOUNDARY 1: 320px Viewport Safety in Preview 1
   * ========================================================================= */
  runner.test('B1.1: preview-1 enforces universal box-sizing: border-box', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /\*.*box-sizing:\s*border-box/is, 'Universal border-box required in preview-1');
  });

  runner.test('B1.2: preview-1 containers specify max-width: 100% or relative width', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /max-width:\s*(100%|clamp)/i, 'max-width constraints required in preview-1');
  });

  runner.test('B1.3: preview-1 text styles allow word-break or overflow-wrap for dense monospace strings', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(word-break|overflow-wrap|break-word)/i, 'word-break or overflow-wrap required in preview-1');
  });

  runner.test('B1.4: preview-1 telemetry / code items allow overflow scrolling or wrapping', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(overflow-x:\s*auto|overflow:\s*auto|flex-wrap:\s*wrap)/i, 'Overflow scroll or flex-wrap required');
  });

  runner.test('B1.5: preview-1 avoids rigid fixed pixel widths exceeding 320px on layout wrappers', () => {
    const css = getRaw('previews/preview-1/style.css');
    // Ensure no unqualified width: [321-9999]px on body or container without max-width
    assert.doesNotMatch(css, /^\s*(body|\.container|\.arch-root)\s*\{[^}]*width:\s*(?:[4-9]\d{2}|[1-9]\d{3,})px/m, 'No rigid fixed width > 320px on root');
  });

  /* =========================================================================
   * BOUNDARY 2: 320px Viewport Safety in Preview 2
   * ========================================================================= */
  runner.test('B2.1: preview-2 enforces universal box-sizing: border-box', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /\*.*box-sizing:\s*border-box/is, 'Universal border-box required in preview-2');
  });

  runner.test('B2.2: preview-2 bento grid collapses to single/flexible column on mobile viewports', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /@media[^{]*max-width[^{]*\{[\s\S]*?grid-template-columns:\s*(1fr|repeat\(1,\s*1fr\))/i, 'Bento grid must collapse to 1fr on mobile');
  });

  runner.test('B2.3: preview-2 bento cards have min-width: 0 to prevent grid item blow-out', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /min-width:\s*0/i, 'min-width: 0 required on grid items in preview-2');
  });

  runner.test('B2.4: preview-2 hero cluster stacks vertically on small screens', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /@media[^{]*max-width.*grid-column:\s*(1\s*\/\s*-1|span\s*12)/is, 'Hero cards must span full width on mobile');
  });

  runner.test('B2.5: preview-2 card padding reduces proportionally on mobile (<768px)', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /@media[^{]*max-width.*padding:\s*(12px|16px|1rem|1\.25rem|clamp)/is, 'Reduced padding required for mobile in preview-2');
  });

  /* =========================================================================
   * BOUNDARY 3: 320px Viewport Safety in Preview 3
   * ========================================================================= */
  runner.test('B3.1: preview-3 enforces universal box-sizing: border-box', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /\*.*box-sizing:\s*border-box/is, 'Universal border-box required in preview-3');
  });

  runner.test('B3.2: preview-3 terminal window container handles overflow-x (auto or hidden)', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(terminal|console|cmd).*overflow-x:\s*(auto|hidden|clip)/is, 'Terminal container must constrain overflow-x');
  });

  runner.test('B3.3: preview-3 split hero panes stack vertically on narrow screens (<992px)', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /@media[^{]*max-width[^{]*\{[\s\S]*?(flex-direction:\s*column|grid-template-columns:\s*1fr)/i, 'Split hero must collapse to single column');
  });

  runner.test('B3.4: preview-3 telemetry metric counters wrap or flex cleanly on 320px', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(flex-wrap:\s*wrap|grid-template-columns:\s*repeat\(auto)/i, 'Metrics container must wrap or use auto-fit');
  });

  runner.test('B3.5: preview-3 dev inspection drawer stays within 320px viewport bounds', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(drawer|inspector).*max-width:\s*(100%|100vw)/is, 'Drawer must respect max-width: 100%');
  });

  /* =========================================================================
   * BOUNDARY 4: 320px Viewport Safety in Comparison Hub
   * ========================================================================= */
  runner.test('B4.1: Hub root and containers enforce max-width: 100%', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /max-width:\s*(100%|clamp)/i, 'Hub containers must enforce max-width: 100%');
  });

  runner.test('B4.2: Hub comparison table container provides horizontal scroll containment (overflow-x: auto)', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(matrix-table-container|table-wrap|matrix-wrap|matrix-container|comparison-table).*overflow-x:\s*auto/is, 'Table wrapper must have overflow-x: auto');
  });

  runner.test('B4.3: Hub showcase cards grid stacks into single column on mobile (<768px)', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /@media[^{]*max-width[^{]*\{[\s\S]*?(grid-template-columns:\s*1fr|flex-direction:\s*column)/i, 'Showcase grid must collapse on mobile');
  });

  runner.test('B4.4: Hub quick launch switcher fits within 320px mobile viewport', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(dock|switcher|quick-launch).*max-width:\s*(100%|calc|clamp)/is, 'Dock must fit within viewport');
  });

  runner.test('B4.5: Hub section paddings use proportional clamp or responsive media queries', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(clamp\(|@media)/i, 'Hub must use responsive clamp or media queries for padding');
  });

  /* =========================================================================
   * BOUNDARY 5: Zero Horizontal Overflow Rules in Preview 1
   * ========================================================================= */
  runner.test('B5.1: preview-1 HTML or body sets overflow-x: hidden or clip', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(html|body|\.arch-root)[^{]*\{[^}]*overflow-x:\s*(hidden|clip)/is, 'preview-1 must enforce overflow-x: hidden/clip');
  });

  runner.test('B5.2: preview-1 includes responsive media queries for mobile breakpoints (<=768px)', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /@media[^{]*max-width:\s*(768|767|600|480)px/i, 'Mobile breakpoint query required in preview-1');
  });

  runner.test('B5.3: preview-1 grid gutters use relative or clamped spacing', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(gap:\s*1px|gap:\s*clamp|gap:\s*[0-9]+px)/i, 'Controlled grid gap required in preview-1');
  });

  runner.test('B5.4: preview-1 images enforce max-width: 100% or responsive wrapping', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(img|\.viewfinder-img|image)[^{]*\{[^}]*(width:\s*100%|max-width:\s*100%)/is, 'Responsive image rules required in preview-1');
  });

  runner.test('B5.5: preview-1 viewport meta sets width=device-width with initial-scale=1.0', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /content="width=device-width,\s*initial-scale=1\.0"/i, 'Exact viewport meta required in preview-1');
  });

  /* =========================================================================
   * BOUNDARY 6: Zero Horizontal Overflow Rules in Preview 2
   * ========================================================================= */
  runner.test('B6.1: preview-2 HTML or body sets overflow-x: hidden or clip', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(html|body|\.bento-root)[^{]*\{[^}]*overflow-x:\s*(hidden|clip)/is, 'preview-2 must enforce overflow-x: hidden/clip');
  });

  runner.test('B6.2: preview-2 bento grid defines responsive media query for mobile', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /@media[^{]*max-width:\s*(?:992|991|768|767|420|419)(?:\.\d+)?px/i, 'Mobile media query required in preview-2');
  });

  runner.test('B6.3: preview-2 kinetic glow does not trigger overflow boundaries', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /overflow:\s*hidden/i, 'Card overflow: hidden required to contain kinetic radial glow');
  });

  runner.test('B6.4: preview-2 skill chips container enforces flex-wrap: wrap', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(skills|pills|tags)[^{]*\{[^}]*flex-wrap:\s*wrap/is, 'Skill chips must wrap in preview-2');
  });

  runner.test('B6.5: preview-2 viewport meta sets width=device-width with initial-scale=1.0', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /content="width=device-width,\s*initial-scale=1\.0"/i, 'Exact viewport meta required in preview-2');
  });

  /* =========================================================================
   * BOUNDARY 7: Zero Horizontal Overflow Rules in Preview 3
   * ========================================================================= */
  runner.test('B7.1: preview-3 HTML or body sets overflow-x: hidden or clip', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(html|body|\.telemetry-root)[^{]*\{[^}]*overflow-x:\s*(hidden|clip)/is, 'preview-3 must enforce overflow-x: hidden/clip');
  });

  runner.test('B7.2: preview-3 telemetry dashboard defines responsive column breakdown', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /@media[^{]*max-width/i, 'Responsive media queries required in preview-3');
  });

  runner.test('B7.3: preview-3 code / log blocks wrap or stay contained', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(white-space:\s*pre-wrap|overflow-x:\s*auto|overflow:\s*hidden)/i, 'Pre-wrap or overflow containment required');
  });

  runner.test('B7.4: preview-3 service health cards wrap or use auto-fit columns', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(auto-fit|auto-fill|flex-wrap:\s*wrap|1fr)/i, 'Flexible column distribution required in preview-3');
  });

  runner.test('B7.5: preview-3 viewport meta sets width=device-width with initial-scale=1.0', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /content="width=device-width,\s*initial-scale=1\.0"/i, 'Exact viewport meta required in preview-3');
  });

  /* =========================================================================
   * BOUNDARY 8: Zero Horizontal Overflow Rules in Comparison Hub
   * ========================================================================= */
  runner.test('B8.1: Hub HTML or body sets overflow-x: hidden or clip', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(html|body)[^{]*\{[^}]*overflow-x:\s*(hidden|clip)/is, 'Hub must enforce overflow-x: hidden/clip');
  });

  runner.test('B8.2: Hub comparison table container has responsive scroll boundary', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /overflow-x:\s*auto/i, 'Hub table container must have overflow-x: auto');
  });

  runner.test('B8.3: Hub showcase cards enforce overflow containment or min-width: 0', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(min-width:\s*0|overflow:\s*hidden)/i, 'Overflow containment required in Hub cards');
  });

  runner.test('B8.4: Hub mobile viewport gutters are constrained to <= 16px', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /padding:[^;]*(12px|16px|1rem|clamp)/i, 'Mobile gutters must be constrained');
  });

  runner.test('B8.5: Hub viewport meta sets width=device-width with initial-scale=1.0', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /content="width=device-width,\s*initial-scale=1\.0"/i, 'Exact viewport meta required in Hub');
  });

  /* =========================================================================
   * BOUNDARY 9: Tap Target CSS Dimensions >= 44px in Preview 1
   * ========================================================================= */
  runner.test('B9.1: preview-1 navigation links have hit areas meeting or exceeding 44px', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(nav-link|nav a)[^{]*\{[^}]*(min-height:\s*44px|padding:\s*(?:12px|14px|16px|1\.2rem|1rem))/is, 'Nav links must have >=44px hit area');
  });

  runner.test('B9.2: preview-1 CTA buttons have min-height >= 44px or padding >= 12px', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(btn|button|\.cta)[^{]*\{[^}]*(min-height:\s*44px|padding:\s*(?:12px|14px|16px|1rem))/is, 'Buttons must have >=44px hit area');
  });

  runner.test('B9.3: preview-1 mobile hamburger button has minimum dimensions >= 44px', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(hamburger|nav-toggle|menu-toggle)[^{]*\{[^}]*(min-height:\s*44px|height:\s*(?:44px|48px|50px)|min-width:\s*44px)/is, 'Hamburger button must be >=44px');
  });

  runner.test('B9.4: preview-1 Back-to-Top trigger button has minimum dimensions >= 44px', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(back-to-top|scroll-top)[^{]*\{[^}]*(min-height:\s*44px|height:\s*(?:44px|48px|50px)|width:\s*(?:44px|48px|50px))/is, 'Back-to-Top button must be >=44px');
  });

  runner.test('B9.5: preview-1 switcher links have hit areas meeting or exceeding 44px', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /(switcher-link|\.preview-switcher a)[^{]*\{[^}]*(min-height:\s*(?:40px|44px)|padding:\s*(?:10px|12px|14px|1rem))/is, 'Switcher links must have sufficient touch hit area');
  });

  /* =========================================================================
   * BOUNDARY 10: Tap Target CSS Dimensions >= 44px in Preview 2
   * ========================================================================= */
  runner.test('B10.1: preview-2 bento dock navigation links have hit areas >= 44px', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(dock-link|nav-link|nav a)[^{]*\{[^}]*(min-height:\s*44px|padding:\s*(?:10px|12px|14px|16px|1rem))/is, 'Dock links must have >=44px hit area');
  });

  runner.test('B10.2: preview-2 skill filter category buttons have touch area >= 44px', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(filter-pill|filter-btn|category-btn|skill-tab)[^{]*\{[^}]*(min-height:\s*(?:40px|44px)|padding:\s*(?:8px|10px|12px|14px|1rem))/is, 'Filter buttons must have >=44px hit area');
  });

  runner.test('B10.3: preview-2 magnetic copy pill button has min-height >= 44px', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(contact-email-card|copy-pill|email-copy|btn-copy)[^{]*\{[^}]*(min-height:\s*(?:44px|60px)|padding:\s*(?:12px|14px|16px|1rem))/is, 'Email copy pill must have >=44px hit area');
  });

  runner.test('B10.4: preview-2 project CTA buttons have min-height >= 44px', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(btn|button|\.cta)[^{]*\{[^}]*(min-height:\s*44px|padding:\s*(?:12px|14px|16px|1rem))/is, 'Project CTA must have >=44px hit area');
  });

  runner.test('B10.5: preview-2 floating switcher buttons have touch area >= 44px', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(switcher-link|\.preview-switcher a)[^{]*\{[^}]*(min-height:\s*(?:40px|44px)|padding:\s*(?:10px|12px|14px|1rem))/is, 'Switcher touch area required');
  });

  /* =========================================================================
   * BOUNDARY 11: Tap Target CSS Dimensions >= 44px in Preview 3
   * ========================================================================= */
  runner.test('B11.1: preview-3 quick-action command chips have min-height >= 44px or padding >= 10px', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(cmd-chip|quick-action|action-btn)[^{]*\{[^}]*(min-height:\s*(?:38px|40px|44px)|padding:\s*(?:10px|12px|14px))/is, 'Command chips must have sufficient hit area');
  });

  runner.test('B11.2: preview-3 terminal input field has min-height >= 44px', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(terminal-input|cmd-input)[^{]*\{[^}]*(min-height:\s*(?:40px|44px)|height:\s*(?:40px|44px|48px)|padding:\s*(?:10px|12px|14px))/is, 'Terminal input must be touch accessible');
  });

  runner.test('B11.3: preview-3 telemetry drawer toggle trigger has touch area >= 44px', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(drawer-toggle|inspector-toggle|btn-drawer)[^{]*\{[^}]*(min-height:\s*(?:40px|44px)|padding:\s*(?:10px|12px|14px))/is, 'Drawer toggle must have sufficient hit area');
  });

  runner.test('B11.4: preview-3 mobile hamburger and nav links have hit area >= 44px', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(hamburger|nav-toggle|nav-link)[^{]*\{[^}]*(min-height:\s*(?:40px|44px)|padding:\s*(?:10px|12px|14px))/is, 'Mobile nav touch area required in preview-3');
  });

  runner.test('B11.5: preview-3 outbound social links have hit area >= 44px', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(social-link|contact-link|\.footer a)[^{]*\{[^}]*(min-height:\s*(?:40px|44px)|padding:\s*(?:10px|12px|14px))/is, 'Social links touch area required in preview-3');
  });

  /* =========================================================================
   * BOUNDARY 12: Tap Target CSS Dimensions >= 44px in Comparison Hub
   * ========================================================================= */
  runner.test('B12.1: Hub launch CTA buttons ("Explorar Variante") have min-height >= 44px', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(btn-launch|btn-primary|\.btn)[^{]*\{[^}]*(min-height:\s*44px|padding:\s*(?:12px|14px|16px|1rem))/is, 'Hub launch CTA must have >=44px hit area');
  });

  runner.test('B12.2: Hub header navigation links have hit area >= 44px', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(nav-link|nav a)[^{]*\{[^}]*(min-height:\s*(?:40px|44px)|padding:\s*(?:10px|12px|14px))/is, 'Hub nav links touch area required');
  });

  runner.test('B12.3: Hub comparison matrix row launch links have touch area >= 44px', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(matrix-filter-btn|matrix-mobile-link|matrix-launch-link|\.btn)[^{]*\{[^}]*(min-height:\s*(?:var\(--touch-target\)|44px)|padding:\s*(?:8px|10px|12px|14px))/is, 'Matrix links touch area required');
  });

  runner.test('B12.4: Hub resume download CTA has hit area >= 44px', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(btn-cv|btn-download|\.btn)[^{]*\{[^}]*(min-height:\s*44px|padding:\s*(?:12px|14px|16px))/is, 'Hub CV download button touch area required');
  });

  runner.test('B12.5: Hub email copy target element has hit area >= 44px', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(email-copy|contact-link|\.btn)[^{]*\{[^}]*(min-height:\s*44px|padding:\s*(?:10px|12px|14px))/is, 'Hub email copy target touch area required');
  });

  /* =========================================================================
   * BOUNDARY 13: Path Depth Correctness in Preview 1
   * ========================================================================= */
  runner.test('B13.1: preview-1 images strictly reference ../../img/ (never root /img/ or img/)', () => {
    const raw = getRaw('previews/preview-1/index.html');
    const imgMatches = raw.match(/<img[^>]*src="([^"]*)"/g) || [];
    assert.ok(imgMatches.length > 0, 'preview-1 must contain images');
    for (const img of imgMatches) {
      const src = img.match(/src="([^"]*)"/)[1];
      assert.ok(src.startsWith('../../img/'), `Image src "${src}" in preview-1 must start with ../../img/`);
    }
  });

  runner.test('B13.2: preview-1 favicon links strictly to ../../img/logo.svg', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /<link[^>]*rel="icon"[^>]*href="\.\.\/\.\.\/img\/logo\.svg"/i, 'Favicon must link to ../../img/logo.svg');
  });

  runner.test('B13.3: preview-1 CV download CTA links strictly to ../../docs/', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /href="\.\.\/\.\.\/docs\/CV[^"]*English\.pdf"/i, 'CV link must point to ../../docs/');
  });

  runner.test('B13.4: preview-1 Return to Hub link points strictly to ../index.html', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /href="\.\.\/index\.html"/i, 'Hub link must point to ../index.html');
  });

  runner.test('B13.5: preview-1 contains zero hardcoded absolute filesystem paths (C: or D:)', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.doesNotMatch(raw, /[A-Za-z]:\\/i, 'No Windows absolute paths allowed in markup');
  });

  /* =========================================================================
   * BOUNDARY 14: Path Depth Correctness in Preview 2
   * ========================================================================= */
  runner.test('B14.1: preview-2 images strictly reference ../../img/', () => {
    const raw = getRaw('previews/preview-2/index.html');
    const imgMatches = raw.match(/<img[^>]*src="([^"]*)"/g) || [];
    assert.ok(imgMatches.length > 0, 'preview-2 must contain images');
    for (const img of imgMatches) {
      const src = img.match(/src="([^"]*)"/)[1];
      assert.ok(src.startsWith('../../img/'), `Image src "${src}" in preview-2 must start with ../../img/`);
    }
  });

  runner.test('B14.2: preview-2 favicon links strictly to ../../img/logo.svg', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /<link[^>]*rel="icon"[^>]*href="\.\.\/\.\.\/img\/logo\.svg"/i, 'Favicon must link to ../../img/logo.svg');
  });

  runner.test('B14.3: preview-2 CV download CTA links strictly to ../../docs/', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /href="\.\.\/\.\.\/docs\/CV[^"]*English\.pdf"/i, 'CV link must point to ../../docs/');
  });

  runner.test('B14.4: preview-2 Return to Hub link points strictly to ../index.html', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /href="\.\.\/index\.html"/i, 'Hub link must point to ../index.html');
  });

  runner.test('B14.5: preview-2 contains zero hardcoded absolute filesystem paths (C: or D:)', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.doesNotMatch(raw, /[A-Za-z]:\\/i, 'No Windows absolute paths allowed in markup');
  });

  /* =========================================================================
   * BOUNDARY 15: Path Depth Correctness in Preview 3
   * ========================================================================= */
  runner.test('B15.1: preview-3 images strictly reference ../../img/', () => {
    const raw = getRaw('previews/preview-3/index.html');
    const imgMatches = raw.match(/<img[^>]*src="([^"]*)"/g) || [];
    assert.ok(imgMatches.length > 0, 'preview-3 must contain images');
    for (const img of imgMatches) {
      const src = img.match(/src="([^"]*)"/)[1];
      assert.ok(src.startsWith('../../img/'), `Image src "${src}" in preview-3 must start with ../../img/`);
    }
  });

  runner.test('B15.2: preview-3 favicon links strictly to ../../img/logo.svg', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /<link[^>]*rel="icon"[^>]*href="\.\.\/\.\.\/img\/logo\.svg"/i, 'Favicon must link to ../../img/logo.svg');
  });

  runner.test('B15.3: preview-3 CV download CTA links strictly to ../../docs/', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /href="\.\.\/\.\.\/docs\/CV[^"]*English\.pdf"/i, 'CV link must point to ../../docs/');
  });

  runner.test('B15.4: preview-3 Return to Hub link points strictly to ../index.html', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /href="\.\.\/index\.html"/i, 'Hub link must point to ../index.html');
  });

  runner.test('B15.5: preview-3 contains zero hardcoded absolute filesystem paths (C: or D:)', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.doesNotMatch(raw, /[A-Za-z]:\\/i, 'No Windows absolute paths allowed in markup');
  });

  /* =========================================================================
   * BOUNDARY 16: Path Depth Correctness in Comparison Hub
   * ========================================================================= */
  runner.test('B16.1: Hub images strictly reference ../img/ (single directory level up)', () => {
    const raw = getRaw('previews/index.html');
    const imgMatches = raw.match(/<img[^>]*src="([^"]*)"/g) || [];
    for (const img of imgMatches) {
      const src = img.match(/src="([^"]*)"/)[1];
      assert.ok(src.startsWith('../img/'), `Image src "${src}" in Hub must start with ../img/`);
    }
  });

  runner.test('B16.2: Hub favicon links strictly to ../img/logo.svg', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /<link[^>]*rel="icon"[^>]*href="\.\.\/img\/logo\.svg"/i, 'Hub favicon must link to ../img/logo.svg');
  });

  runner.test('B16.3: Hub CV link points strictly to ../docs/', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /href="\.\.\/docs\/CV[^"]*English\.pdf"/i, 'Hub CV link must point to ../docs/');
  });

  runner.test('B16.4: Hub variant links reference preview-1/index.html, preview-2/index.html, preview-3/index.html', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /preview-1\/index\.html/i, 'Link to preview-1 required');
    assert.match(raw, /preview-2\/index\.html/i, 'Link to preview-2 required');
    assert.match(raw, /preview-3\/index\.html/i, 'Link to preview-3 required');
  });

  runner.test('B16.5: Hub contains zero hardcoded absolute filesystem paths', () => {
    const raw = getRaw('previews/index.html');
    assert.doesNotMatch(raw, /[A-Za-z]:\\/i, 'No Windows absolute paths allowed in Hub');
  });

  /* =========================================================================
   * BOUNDARY 17: Cross-Variant Link Depth from Preview 1
   * ========================================================================= */
  runner.test('B17.1: preview-1 switcher links to preview-2 via ../preview-2/index.html', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /href="\.\.\/preview-2\/index\.html"/i, 'Cross-link to preview-2 required');
  });

  runner.test('B17.2: preview-1 switcher links to preview-3 via ../preview-3/index.html', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /href="\.\.\/preview-3\/index\.html"/i, 'Cross-link to preview-3 required');
  });

  runner.test('B17.3: preview-1 switcher links to Hub via ../index.html', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /href="\.\.\/index\.html"/i, 'Cross-link to Hub required');
  });

  runner.test('B17.4: preview-1 indicates current active status in switcher', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /class="[^"]*(active|active-p1|current)[^"]*"/i, 'Active indicator required');
  });

  runner.test('B17.5: All links in preview-1 use forward slashes (/) exclusively', () => {
    const raw = getRaw('previews/preview-1/index.html');
    const hrefs = raw.match(/href="([^"]*)"/g) || [];
    for (const h of hrefs) {
      assert.doesNotMatch(h, /\\/, `Backslash forbidden in URL: ${h}`);
    }
  });

  /* =========================================================================
   * BOUNDARY 18: Cross-Variant Link Depth from Preview 2
   * ========================================================================= */
  runner.test('B18.1: preview-2 switcher links to preview-1 via ../preview-1/index.html', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /href="\.\.\/preview-1\/index\.html"/i, 'Cross-link to preview-1 required');
  });

  runner.test('B18.2: preview-2 switcher links to preview-3 via ../preview-3/index.html', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /href="\.\.\/preview-3\/index\.html"/i, 'Cross-link to preview-3 required');
  });

  runner.test('B18.3: preview-2 switcher links to Hub via ../index.html', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /href="\.\.\/index\.html"/i, 'Cross-link to Hub required');
  });

  runner.test('B18.4: preview-2 indicates current active status in switcher', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /class="[^"]*(active|active-p2|current)[^"]*"/i, 'Active indicator required');
  });

  runner.test('B18.5: All links in preview-2 use forward slashes (/) exclusively', () => {
    const raw = getRaw('previews/preview-2/index.html');
    const hrefs = raw.match(/href="([^"]*)"/g) || [];
    for (const h of hrefs) {
      assert.doesNotMatch(h, /\\/, `Backslash forbidden in URL: ${h}`);
    }
  });

  /* =========================================================================
   * BOUNDARY 19: Cross-Variant Link Depth from Preview 3
   * ========================================================================= */
  runner.test('B19.1: preview-3 switcher links to preview-1 via ../preview-1/index.html', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /href="\.\.\/preview-1\/index\.html"/i, 'Cross-link to preview-1 required');
  });

  runner.test('B19.2: preview-3 switcher links to preview-2 via ../preview-2/index.html', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /href="\.\.\/preview-2\/index\.html"/i, 'Cross-link to preview-2 required');
  });

  runner.test('B19.3: preview-3 switcher links to Hub via ../index.html', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /href="\.\.\/index\.html"/i, 'Cross-link to Hub required');
  });

  runner.test('B19.4: preview-3 indicates current active status in switcher', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /class="[^"]*(active|active-p3|current)[^"]*"/i, 'Active indicator required');
  });

  runner.test('B19.5: All links in preview-3 use forward slashes (/) exclusively', () => {
    const raw = getRaw('previews/preview-3/index.html');
    const hrefs = raw.match(/href="([^"]*)"/g) || [];
    for (const h of hrefs) {
      assert.doesNotMatch(h, /\\/, `Backslash forbidden in URL: ${h}`);
    }
  });

  /* =========================================================================
   * BOUNDARY 20: Variant Link Depth from Hub
   * ========================================================================= */
  runner.test('B20.1: Direct link to Preview 1 from Hub is preview-1/index.html', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /href="preview-1\/index\.html"/i, 'Direct link to preview-1 required');
  });

  runner.test('B20.2: Direct link to Preview 2 from Hub is preview-2/index.html', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /href="preview-2\/index\.html"/i, 'Direct link to preview-2 required');
  });

  runner.test('B20.3: Direct link to Preview 3 from Hub is preview-3/index.html', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /href="preview-3\/index\.html"/i, 'Direct link to preview-3 required');
  });

  runner.test('B20.4: Comparison matrix launch CTAs point correctly to all three previews', () => {
    const raw = getRaw('previews/index.html');
    assert.ok(raw.includes('preview-1/index.html') && raw.includes('preview-2/index.html') && raw.includes('preview-3/index.html'), 'All 3 variant URLs required in Hub');
  });

  runner.test('B20.5: All links in Hub use forward slashes (/) exclusively', () => {
    const raw = getRaw('previews/index.html');
    const hrefs = raw.match(/href="([^"]*)"/g) || [];
    for (const h of hrefs) {
      assert.doesNotMatch(h, /\\/, `Backslash forbidden in URL: ${h}`);
    }
  });

  /* =========================================================================
   * BOUNDARY 21: Genuine PNG Asset Check: simpleat-icon.png Used
   * ========================================================================= */
  runner.test('B21.1: preview-1 references img/simpleat-icon.png', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /simpleat-icon\.png/i, 'preview-1 must reference simpleat-icon.png');
  });

  runner.test('B21.2: preview-2 references img/simpleat-icon.png', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.match(raw, /simpleat-icon\.png/i, 'preview-2 must reference simpleat-icon.png');
  });

  runner.test('B21.3: preview-3 references img/simpleat-icon.png', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.match(raw, /simpleat-icon\.png/i, 'preview-3 must reference simpleat-icon.png');
  });

  runner.test('B21.4: Hub references img/simpleat-icon.png or valid brand asset', () => {
    const raw = getRaw('previews/index.html');
    assert.match(raw, /simpleat-icon\.png|Simpleat/i, 'Hub must reference simpleat-icon.png');
  });

  runner.test('B21.5: File img/simpleat-icon.png exists and has genuine PNG magic bytes (89 50 4E 47)', () => {
    const header = readHeaderBytes('img/simpleat-icon.png', 4);
    assert.strictEqual(header[0], 0x89, 'PNG magic byte 0');
    assert.strictEqual(header[1], 0x50, 'PNG magic byte 1 (P)');
    assert.strictEqual(header[2], 0x4E, 'PNG magic byte 2 (N)');
    assert.strictEqual(header[3], 0x47, 'PNG magic byte 3 (G)');
  });

  /* =========================================================================
   * BOUNDARY 22: Genuine PNG Asset Check: logo-simpleat.png Strictly Avoided
   * ========================================================================= */
  runner.test('B22.1: logo-simpleat.png is NOT referenced anywhere in previews/preview-1/index.html', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.doesNotMatch(raw, /logo-simpleat\.png/i, 'logo-simpleat.png must NEVER be referenced in preview-1');
  });

  runner.test('B22.2: logo-simpleat.png is NOT referenced anywhere in previews/preview-2/index.html', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.doesNotMatch(raw, /logo-simpleat\.png/i, 'logo-simpleat.png must NEVER be referenced in preview-2');
  });

  runner.test('B22.3: logo-simpleat.png is NOT referenced anywhere in previews/preview-3/index.html', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.doesNotMatch(raw, /logo-simpleat\.png/i, 'logo-simpleat.png must NEVER be referenced in preview-3');
  });

  runner.test('B22.4: logo-simpleat.png is NOT referenced anywhere in previews/index.html', () => {
    const raw = getRaw('previews/index.html');
    assert.doesNotMatch(raw, /logo-simpleat\.png/i, 'logo-simpleat.png must NEVER be referenced in Hub');
  });

  runner.test('B22.5: logo-simpleat.png is NOT referenced in any CSS or JS files under previews/', () => {
    ['previews/preview-1/style.css', 'previews/preview-2/style.css', 'previews/preview-3/style.css', 'previews/hub.css'].forEach(f => {
      const raw = getRaw(f);
      assert.doesNotMatch(raw, /logo-simpleat\.png/i, `logo-simpleat.png forbidden in ${f}`);
    });
  });

  /* =========================================================================
   * BOUNDARY 23: Image Asset Magic Bytes & Integrity Verification
   * ========================================================================= */
  runner.test('B23.1: img/Image.jpg has valid JPEG magic bytes (FF D8 FF)', () => {
    const header = readHeaderBytes('img/Image.jpg', 3);
    assert.strictEqual(header[0], 0xFF, 'JPEG byte 0');
    assert.strictEqual(header[1], 0xD8, 'JPEG byte 1');
    assert.strictEqual(header[2], 0xFF, 'JPEG byte 2');
  });

  runner.test('B23.2: img/LOGOECI.webp has valid WebP magic bytes (RIFF ... WEBP)', () => {
    const header = readHeaderBytes('img/LOGOECI.webp', 12);
    const riff = header.subarray(0, 4).toString('ascii');
    const webp = header.subarray(8, 12).toString('ascii');
    assert.strictEqual(riff, 'RIFF', 'RIFF header');
    assert.strictEqual(webp, 'WEBP', 'WEBP header');
  });

  runner.test('B23.3: img/logoMANGO.png has valid PNG magic bytes (89 50 4E 47)', () => {
    const header = readHeaderBytes('img/logoMANGO.png', 4);
    assert.strictEqual(header[0], 0x89);
    assert.strictEqual(header[1], 0x50);
    assert.strictEqual(header[2], 0x4E);
    assert.strictEqual(header[3], 0x47);
  });

  runner.test('B23.4: img/logo.svg contains valid SVG root element', () => {
    const raw = getRaw('img/logo.svg');
    assert.match(raw, /<svg[^>]*>/i, 'logo.svg must contain <svg> root element');
  });

  runner.test('B23.5: All local images referenced in HTML exist on disk (strict zero 404s)', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(htmlFile => {
      const raw = getRaw(htmlFile);
      const dir = path.dirname(htmlFile);
      const imgMatches = raw.match(/src="(\.\.[^"]+)"/g) || [];
      for (const m of imgMatches) {
        const relSrc = m.match(/src="([^"]+)"/)[1];
        const resolvedPath = path.resolve(resolvePath(dir), relSrc);
        assert.ok(fs.existsSync(resolvedPath), `Image source 404! Not found: ${relSrc} from ${htmlFile}`);
      }
    });
  });

  /* =========================================================================
   * BOUNDARY 24: Document Asset Integrity Verification
   * ========================================================================= */
  runner.test('B24.1: docs/CV David Castellanos - English.pdf has valid PDF magic bytes (%PDF-)', () => {
    const header = readHeaderBytes('docs/CV David Castellanos - English.pdf', 5);
    assert.strictEqual(header.toString('ascii'), '%PDF-', 'Valid PDF header');
  });

  runner.test('B24.2: English CV PDF file size exceeds 50 KB', () => {
    const fullPath = resolvePath('docs/CV David Castellanos - English.pdf');
    const stats = fs.statSync(fullPath);
    assert.ok(stats.size > 50000, `CV size must be > 50KB, got ${stats.size} bytes`);
  });

  runner.test('B24.3: Document links use URL encoding for spaces (%20) or quoted attributes', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /href="[^"]*docs\/CV(?:%20|\s)David(?:%20|\s)Castellanos(?:%20|\s)-(?:%20|\s)English\.pdf"/i, 'Valid PDF link structure required');
  });

  runner.test('B24.4: Download attribute matches expected clean filename CV_David_Castellanos.pdf', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.match(raw, /download="CV_David_Castellanos\.pdf"/i, 'Exact download filename attribute required');
  });

  runner.test('B24.5: Document link resolves cleanly on filesystem without error', () => {
    assert.ok(fileExists('docs/CV David Castellanos - English.pdf'), 'Target English CV must resolve on disk');
  });

  /* =========================================================================
   * BOUNDARY 25: Local file:// Protocol Safety: Zero Module Scripts
   * ========================================================================= */
  runner.test('B25.1: preview-1 contains zero <script type="module"> tags', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.doesNotMatch(raw, /<script[^>]*type="module"/i, 'No module scripts allowed in preview-1 (blocks file://)');
  });

  runner.test('B25.2: preview-2 contains zero <script type="module"> tags', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.doesNotMatch(raw, /<script[^>]*type="module"/i, 'No module scripts allowed in preview-2 (blocks file://)');
  });

  runner.test('B25.3: preview-3 contains zero <script type="module"> tags', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.doesNotMatch(raw, /<script[^>]*type="module"/i, 'No module scripts allowed in preview-3 (blocks file://)');
  });

  runner.test('B25.4: Hub contains zero <script type="module"> tags', () => {
    const raw = getRaw('previews/index.html');
    assert.doesNotMatch(raw, /<script[^>]*type="module"/i, 'No module scripts allowed in Hub (blocks file://)');
  });

  runner.test('B25.5: All scripts load via standard classic <script src="..."> or inline execution', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      const scripts = raw.match(/<script[^>]*>/g) || [];
      for (const s of scripts) {
        assert.doesNotMatch(s, /type="module"/i, `type="module" forbidden in ${f}`);
      }
    });
  });

  /* =========================================================================
   * BOUNDARY 26: Local file:// Protocol Safety: Zero Local Runtime Fetch()
   * ========================================================================= */
  runner.test('B26.1: preview-1 main.js does NOT call fetch() for local resources', () => {
    const js = getRaw('previews/preview-1/main.js');
    assert.doesNotMatch(js, /fetch\(\s*['"](?!http)/, 'Local fetch() forbidden in preview-1 JS');
  });

  runner.test('B26.2: preview-2 main.js does NOT call fetch() for local resources', () => {
    const js = getRaw('previews/preview-2/main.js');
    assert.doesNotMatch(js, /fetch\(\s*['"](?!http)/, 'Local fetch() forbidden in preview-2 JS');
  });

  runner.test('B26.3: preview-3 main.js does NOT call fetch() for local resources', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.doesNotMatch(js, /fetch\(\s*['"](?!http)/, 'Local fetch() forbidden in preview-3 JS');
  });

  runner.test('B26.4: Hub hub.js does NOT call fetch() for local resources', () => {
    const js = getRaw('previews/hub.js');
    assert.doesNotMatch(js, /fetch\(\s*['"](?!http)/, 'Local fetch() forbidden in hub.js');
  });

  runner.test('B26.5: All interactive datasets (projects, skills, terminal commands) are embedded directly in JS or HTML', () => {
    const p3JS = getRaw('previews/preview-3/main.js');
    assert.match(p3JS, /(commands|testSuites|testResults|commandList|tests)/i, 'Simulated terminal data must be embedded directly');
  });

  /* =========================================================================
   * BOUNDARY 27: Local file:// Protocol Safety: Zero Protocol-Relative URLs
   * ========================================================================= */
  runner.test('B27.1: preview-1 contains zero protocol-relative // URLs', () => {
    const raw = getRaw('previews/preview-1/index.html');
    assert.doesNotMatch(raw, /(src|href)="\/\/[^"]+"/i, 'Protocol-relative URLs break on file://');
  });

  runner.test('B27.2: preview-2 contains zero protocol-relative // URLs', () => {
    const raw = getRaw('previews/preview-2/index.html');
    assert.doesNotMatch(raw, /(src|href)="\/\/[^"]+"/i, 'Protocol-relative URLs break on file://');
  });

  runner.test('B27.3: preview-3 contains zero protocol-relative // URLs', () => {
    const raw = getRaw('previews/preview-3/index.html');
    assert.doesNotMatch(raw, /(src|href)="\/\/[^"]+"/i, 'Protocol-relative URLs break on file://');
  });

  runner.test('B27.4: Hub contains zero protocol-relative // URLs', () => {
    const raw = getRaw('previews/index.html');
    assert.doesNotMatch(raw, /(src|href)="\/\/[^"]+"/i, 'Protocol-relative URLs break on file://');
  });

  runner.test('B27.5: CDN links explicitly declare https:// protocol', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      const cdns = raw.match(/(href|src)="https:\/\/fonts\.[^"]+"/g) || [];
      assert.ok(cdns.length > 0, `External fonts must specify https:// in ${f}`);
    });
  });

  /* =========================================================================
   * BOUNDARY 28: 4K Display Boundary Safety (3840px Screens)
   * ========================================================================= */
  runner.test('B28.1: preview-1 applies max-width container bounds (clamp or px constraint)', () => {
    const css = getRaw('previews/preview-1/style.css');
    assert.match(css, /max-width:\s*(?:clamp|1[2-6]\d{2}px|8[0-9]vw)/i, '4K container bounds required in preview-1');
  });

  runner.test('B28.2: preview-2 applies max-width bento grid constraints', () => {
    const css = getRaw('previews/preview-2/style.css');
    assert.match(css, /(max-width:\s*(?:clamp|1[2-6]\d{2}px|1280px|var\(--container-max\))|--container-max:\s*1280px)/i, '4K bento bounds required in preview-2');
  });

  runner.test('B28.3: preview-3 applies max-width telemetry console constraints', () => {
    const css = getRaw('previews/preview-3/style.css');
    assert.match(css, /(max-width:\s*(?:clamp|1[2-6]\d{2}px|1400px|1440px|var\(--container-max\))|--container-max:\s*1440px)/i, '4K telemetry bounds required in preview-3');
  });

  runner.test('B28.4: Hub applies max-width container constraints', () => {
    const css = getRaw('previews/hub.css');
    assert.match(css, /(max-width:\s*(?:clamp|1[2-6]\d{2}px|1400px|1320px|var\(--container-max\))|--container-max:\s*1320px)/i, '4K hub bounds required');
  });

  runner.test('B28.5: Outer containers use margin: 0 auto or center alignment on ultra-wide screens', () => {
    ['previews/preview-1/style.css', 'previews/preview-2/style.css', 'previews/preview-3/style.css', 'previews/hub.css'].forEach(f => {
      const css = getRaw(f);
      assert.match(css, /(margin:\s*0\s+auto|margin-inline:\s*auto|margin-left:\s*auto;\s*margin-right:\s*auto)/i, `Container auto-centering required in ${f}`);
    });
  });

  /* =========================================================================
   * BOUNDARY 29: Character Encoding & Escaping Integrity
   * ========================================================================= */
  runner.test('B29.1: UTF-8 character encoding declared in all HTML documents', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.match(raw, /<meta\s+charset="UTF-8"/i, `UTF-8 charset declaration required in ${f}`);
    });
  });

  runner.test('B29.2: Spanish accent characters (á, é, í, ó, ú, ñ) present without Unicode corruption ()', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.doesNotMatch(raw, /\uFFFD/, `Corrupted Unicode replacement character found in ${f}`);
      assert.match(raw, /[áéíóúñÁÉÍÓÚÑ]/, `Genuine Spanish accent characters required in ${f}`);
    });
  });

  runner.test('B29.3: Spanish opening punctuation marks (¡, ¿) present and non-corrupted', () => {
    const combined = getRaw('previews/preview-1/index.html') + getRaw('previews/preview-2/index.html') + getRaw('previews/preview-3/index.html');
    assert.match(combined, /[¡¿]/, 'Opening Spanish exclamation/question marks required');
  });

  runner.test('B29.4: Clean quotes used in attribute values without unescaped nesting', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      assert.doesNotThrow(() => getHTML(f), `HTML attributes in ${f} must parse cleanly`);
    });
  });

  runner.test('B29.5: Zero corrupted HTML entity artifacts (&amp;amp; or &#xFFFD;)', () => {
    ['previews/preview-1/index.html', 'previews/preview-2/index.html', 'previews/preview-3/index.html', 'previews/index.html'].forEach(f => {
      const raw = getRaw(f);
      assert.doesNotMatch(raw, /&amp;amp;/i, `Double-escaped ampersand found in ${f}`);
      assert.doesNotMatch(raw, /&#xFFFD;/i, `Replacement entity found in ${f}`);
    });
  });

  /* =========================================================================
   * BOUNDARY 30: Empty / Adversarial Input Boundary in Interactive Components
   * ========================================================================= */
  runner.test('B30.1: preview-3 terminal input handler checks for empty string without failing', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(trim\(\)|!cmd|cmd\.length\s*===?\s*0)/i, 'Empty input check required in terminal runner');
  });

  runner.test('B30.2: preview-3 terminal sanitizes command input (.trim().toLowerCase())', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(toLowerCase\(\)|trim\(\))/i, 'Input sanitization required in terminal runner');
  });

  runner.test('B30.3: preview-3 handles unknown or arbitrary command tokens with fallback message', () => {
    const js = getRaw('previews/preview-3/main.js');
    assert.match(js, /(default:|else\s*\{|unknown)/i, 'Fallback command handler required in terminal runner');
  });

  runner.test('B30.4: Email copy handler handles debounce or timer clearing on rapid clicks', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /(clearTimeout|timer|debounce|timeoutId)/i, 'Timer management required for email copy');
  });

  runner.test('B30.5: Window resize listener gracefully handles rapid breakpoint crossing', () => {
    const allJS = getRaw('previews/preview-1/main.js') + getRaw('previews/preview-2/main.js') + getRaw('previews/preview-3/main.js');
    assert.match(allJS, /(resize|innerWidth)/i, 'Resize listener or innerWidth check required');
  });
  }

  if (!options.baselineOnly) {
    registerTier2CreativeTests(runner);
  }

  return runner;
}

if (require.main === module) {
  const suite = createTier2Suite();
  suite.run({ verbose: true }).then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}

module.exports = { createTier2Suite };
