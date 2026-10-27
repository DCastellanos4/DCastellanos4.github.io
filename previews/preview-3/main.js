/**
 * ARCHETYPE 3: ENTERPRISE TELEMETRY & INTERACTIVE TERMINAL
 * Candidate: David Castellanos — Full Stack Developer & QA Engineer
 * Vanilla JavaScript (Zero build step, zero dependencies, file:// and HTTP compatible)
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ==========================================================================
     1. SIMULATED LIVE LATENCY HEARTBEAT
     ========================================================================== */
  const livePingEl = document.getElementById('live-ping');
  if (livePingEl) {
    const pingValues = ['11ms', '14ms', '12ms', '15ms', '13ms', '14ms', '16ms', '12ms'];
    let pingIdx = 0;
    setInterval(function () {
      pingIdx = (pingIdx + 1) % pingValues.length;
      livePingEl.textContent = pingValues[pingIdx];
    }, 2800);
  }

  /* ==========================================================================
     2. INTERACTIVE TERMINAL COMMAND ENGINE
     ========================================================================== */
  const stdout = document.getElementById('terminal-stdout');
  const termScreen = document.getElementById('terminal-screen');
  const termForm = document.getElementById('terminal-form');
  const termInput = document.getElementById('term-input');

  function scrollTerminalToBottom() {
    if (termScreen) {
      termScreen.scrollTop = termScreen.scrollHeight;
    }
  }

  function appendTerminalLine(htmlContent) {
    if (!stdout) return;
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = htmlContent;
    stdout.appendChild(line);
    scrollTerminalToBottom();
  }

  function appendTerminalHeader(cmdText) {
    appendTerminalLine('<span class="prompt-prefix">root@dcastellanos:~$</span> <span class="term-cmd">' + escapeHtml(cmdText) + '</span>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Pre-configured Test and Command Payloads
  const COMMAND_SCRIPTS = {
    'test:eci-api': [
      { text: '<span class="cyan-text">[INFO]</span> Initializing Karate DSL Runner (env: eci-production-unity)...', delay: 80 },
      { text: '<span class="cyan-text">[INFO]</span> Loading feature: <span class="font-bold">features/eci/unity_pricing_matrix.feature</span>', delay: 160 },
      { text: '<span class="emerald-text">&#x2713;</span> GET /api/v1/eci/catalog/departments -> <span class="emerald-text">200 OK</span> (14ms)', delay: 240 },
      { text: '<span class="emerald-text">&#x2713;</span> POST /api/v1/eci/pricing/calculate -> <span class="emerald-text">200 OK</span> (22ms)', delay: 320 },
      { text: '<span class="emerald-text">&#x2713;</span> Assert response.schema == "#(pricingSchema)" -> <span class="emerald-text">PASS</span> (2ms)', delay: 400 },
      { text: '<span class="emerald-text">&#x2713;</span> Regression Check: Zero regressions detected across 142 production assertions.', delay: 480 },
      { text: '<span class="emerald-text font-bold">&gt;&gt; SUITE RESULT: 142 passed, 0 failed, 0 skipped (Total runtime: 78ms) [PASS]</span>', delay: 560 }
    ],
    'test:simpleat-e2e': [
      { text: '<span class="cyan-text">[INFO]</span> Spawning Playwright headless browser instance (Chromium 128)...', delay: 80 },
      { text: '<span class="cyan-text">[INFO]</span> Executing Cucumber BDD: <span class="font-bold">Simpleat QR Order Lifecycle</span>', delay: 180 },
      { text: '<span class="emerald-text">&#x2713;</span> Given Customer scans table QR code at Mesa 14 (68ms)', delay: 280 },
      { text: '<span class="emerald-text">&#x2713;</span> When Menu items [ID: 801, 804] are selected and confirmed (114ms)', delay: 380 },
      { text: '<span class="emerald-text">&#x2713;</span> Then Kitchen POS webhook receives event ORDER_CONFIRMED (16ms)', delay: 480 },
      { text: '<span class="emerald-text">&#x2713;</span> And Gatling transactional load validation completes: 4,200 req/s with 0 errors (45ms)', delay: 580 },
      { text: '<span class="emerald-text font-bold">&gt;&gt; PLAYWRIGHT SUITE PASSED: 1 Scenario (5 steps passed) in 283ms</span>', delay: 680 }
    ],
    'metrics:qa': [
      { text: '<span class="cyan-text">------------------------------------------------------------------------</span>', delay: 50 },
      { text: '<span class="font-bold cyan-text">QA AUTOMATION &amp; TEST COVERAGE MATRIX // DAVID CASTELLANOS</span>', delay: 100 },
      { text: '<span class="cyan-text">------------------------------------------------------------------------</span>', delay: 150 },
      { text: 'Target System       | Test Framework       | Pass Rate | Latency | Status', delay: 200 },
      { text: '--------------------+----------------------+-----------+---------+-------', delay: 250 },
      { text: 'El Corte Inglés     | Karate DSL + JUnit   | <span class="emerald-text font-bold">99.98%</span>    | 14ms    | <span class="emerald-text">PASS</span>', delay: 300 },
      { text: 'Mango POS Desktop   | .NET MAUI + Sonar    | <span class="emerald-text font-bold">98.40%</span>    | 32ms    | <span class="emerald-text">PASS</span>', delay: 350 },
      { text: 'Simpleat SaaS       | Playwright + Gatling | <span class="emerald-text font-bold">100.0%</span>    | 28ms    | <span class="emerald-text">PASS</span>', delay: 400 },
      { text: 'ATLAS Quality SaaS  | Spring Modulith      | <span class="emerald-text font-bold">92.40%</span>    | 19ms    | <span class="emerald-text">PASS</span>', delay: 450 },
      { text: '<span class="cyan-text">------------------------------------------------------------------------</span>', delay: 500 },
      { text: '<span class="emerald-text">&#x2713;</span> Continuous Integration: Jenkins Groovy pipelines active on all branches.', delay: 550 }
    ],
    'metrics:atlas': [
      { text: '<span class="cyan-text">[INFO]</span> ATLAS Platform Architecture &amp; Health Telemetry:', delay: 80 },
      { text: '<span class="emerald-text">&#x2713;</span> Architecture Pattern: Clean Architecture + Spring Modulith (Modular Monolith)', delay: 180 },
      { text: '<span class="emerald-text">&#x2713;</span> Backend Runtime: Java 21 LTS / Spring Boot 3 / PostgreSQL', delay: 280 },
      { text: '<span class="emerald-text">&#x2713;</span> Frontend Runtime: Angular 20 Standalone Components &amp; Signals', delay: 380 },
      { text: '<span class="emerald-text">&#x2713;</span> Container Orchestration: Docker Multi-Stage Build (Image: 114MB)', delay: 480 },
      { text: '<span class="emerald-text font-bold">&gt;&gt; ATLAS SYSTEM STATUS: ALL 8 MODULES HEALTHY (100% OPERATIONAL)</span>', delay: 580 }
    ],
    'test:websockets': [
      { text: '<span class="cyan-text">[INFO]</span> Initializing WebSocket Stress &amp; Synchronization Test...', delay: 80 },
      { text: '<span class="emerald-text">&#x2713;</span> WSS Handshake: wss://enlace-mental.live/socket.io/ (Protocol: 101 Switching Protocols)', delay: 180 },
      { text: '<span class="emerald-text">&#x2713;</span> Simulating 500 concurrent word convergence rooms...', delay: 300 },
      { text: '<span class="emerald-text">&#x2713;</span> Average synchronization packet latency: <span class="emerald-text font-bold">7.8ms</span> (P99: 14ms)', delay: 420 },
      { text: '<span class="emerald-text">&#x2713;</span> Packet loss rate: 0.00% across 25,000 game events.', delay: 540 },
      { text: '<span class="emerald-text font-bold">&gt;&gt; WEBSOCKET SYNC PASS: REAL-TIME ENGINE CERTIFIED</span>', delay: 640 }
    ],
    'metrics:seo': [
      { text: '<span class="cyan-text">[INFO]</span> Lighthouse Performance &amp; Core Web Vitals Audit for Goated Wear:', delay: 80 },
      { text: '<span class="emerald-text">&#x2713;</span> Performance Score: <span class="emerald-text font-bold">99/100</span>', delay: 180 },
      { text: '<span class="emerald-text">&#x2713;</span> Accessibility Score: 100/100', delay: 280 },
      { text: '<span class="emerald-text">&#x2713;</span> Best Practices Score: 100/100', delay: 380 },
      { text: '<span class="emerald-text">&#x2713;</span> SEO Score: <span class="emerald-text font-bold">100/100</span> (Full schema.org microdata &amp; OpenGraph tags)', delay: 480 },
      { text: '<span class="emerald-text">&#x2713;</span> Largest Contentful Paint (LCP): 0.8s | Cumulative Layout Shift (CLS): 0.00', delay: 580 },
      { text: '<span class="emerald-text font-bold">&gt;&gt; AUDIT PASSED: OPTIMIZED FOR HIGH CONVERSION SPORTSWEAR E-COMMERCE</span>', delay: 680 }
    ],
    'skills': [
      { text: '<span class="cyan-text">[DUMP]</span> Outputting complete 31-technology skills manifest:', delay: 50 },
      { text: '<span class="font-bold cyan-text">1. BACKEND (8):</span> C# / ASP.NET Core, Java / Spring Boot, Node.js, Spring Modulith, EF Core, PostgreSQL / SQL Server, Redis, PHP', delay: 120 },
      { text: '<span class="font-bold cyan-text">2. FRONTEND (8):</span> Angular, React, TypeScript, Vue.js, Tailwind CSS, Bootstrap 5, JavaScript, HTML5 / CSS3', delay: 200 },
      { text: '<span class="font-bold cyan-text">3. CLOUD &amp; DEVOPS (8):</span> AWS, Azure, Docker, Linux, Nginx, Jenkins (Groovy), GitHub Actions, GitLab CI', delay: 280 },
      { text: '<span class="font-bold cyan-text">4. TESTING &amp; QA (8):</span> Playwright, Karate DSL, Cucumber (BDD), JMeter, Gatling (Java DSL), JUnit 5, SonarQube, Postman', delay: 360 },
      { text: '<span class="font-bold cyan-text">5. IDIOMAS (2):</span> Español (Nativo), Inglés (B2 certificado)', delay: 440 },
      { text: '<span class="emerald-text font-bold">&gt;&gt; Total items indexed: 31/31 skills verified</span>', delay: 520 }
    ],
    'contact': [
      { text: '<span class="cyan-text">[CONTACT DETAILS]</span>', delay: 50 },
      { text: 'Candidate: <span class="font-bold">David Castellanos</span> (Full Stack Developer &amp; QA Engineer)', delay: 100 },
      { text: 'Email: <span class="emerald-text font-bold">davidllanos2005@gmail.com</span>', delay: 150 },
      { text: 'LinkedIn: https://es.linkedin.com/in/david-castellanos-lopez', delay: 200 },
      { text: 'GitHub: https://github.com/DCastellanos4', delay: 250 },
      { text: 'Location: Madrid · Incorporación verano 2027 · Abierto a remoto', delay: 300 },
      { text: '<span class="emerald-text">&#x2713;</span> Email copied to clipboard automatically!', delay: 350 }
    ],
    'cv': [
      { text: '<span class="cyan-text">[DOCUMENT DISPATCH]</span>', delay: 50 },
      { text: 'Target: CV David Castellanos - English.pdf', delay: 100 },
      { text: 'Path: ../../docs/CV%20David%20Castellanos%20-%20English.pdf', delay: 150 },
      { text: '<span class="emerald-text">&#x2713;</span> Triggering download link...', delay: 200 }
    ],
    'about': [
      { text: '<span class="cyan-text">[BIOGRAPHY MANIFEST]</span>', delay: 50 },
      { text: '"Soy desarrollador Full Stack con experiencia comercial en entornos enterprise. A los 21 años ya he automatizado suites de pruebas que corren en producción para El Corte Inglés y Mango, y construido plataformas SaaS desde cero con Spring Boot, Angular y despliegues Cloud."', delay: 150 },
      { text: '"Mi perfil es híbrido por convicción: diseño APIs en C# y Java, construyo interfaces con Angular y React, y después escribo los tests que garantizan que todo funciona — E2E con Playwright, integración con Karate DSL, carga con Gatling."', delay: 250 },
      { text: '"Disponible para incorporación a partir de verano de 2027."', delay: 350 }
    ],
    'help': [
      { text: '<span class="cyan-text">==================== TELEMETRY COMMANDS ====================</span>', delay: 40 },
      { text: '  <span class="font-bold cyan-text">test:eci-api</span>       Run Karate DSL API integration tests for El Corte Inglés', delay: 80 },
      { text: '  <span class="font-bold cyan-text">test:simpleat-e2e</span>  Run Playwright + Cucumber BDD E2E tests for Simpleat', delay: 120 },
      { text: '  <span class="font-bold cyan-text">metrics:qa</span>         Display QA automation test coverage metrics', delay: 160 },
      { text: '  <span class="font-bold cyan-text">skills</span>             Dump all 31 verified skills across 5 categories', delay: 200 },
      { text: '  <span class="font-bold cyan-text">contact</span>            Display contact transmission uplink and copy email', delay: 240 },
      { text: '  <span class="font-bold cyan-text">cv</span>                 Download English CV resume (PDF)', delay: 280 },
      { text: '  <span class="font-bold cyan-text">about</span>              Show candidate engineering biography', delay: 320 },
      { text: '  <span class="font-bold cyan-text">clear</span>              Clear the terminal output screen', delay: 360 },
      { text: '<span class="cyan-text">============================================================</span>', delay: 400 }
    ]
  };

  let isStreaming = false;

  function executeTerminalScript(scriptKey) {
    if (scriptKey === 'clear') {
      clearTerminal();
      return;
    }

    if (scriptKey === 'contact') {
      copyEmailToClipboard(false);
    }

    if (scriptKey === 'cv') {
      triggerCvDownload();
    }

    const script = COMMAND_SCRIPTS[scriptKey];
    if (!script) {
      appendTerminalHeader(scriptKey);
      appendTerminalLine('<span class="rose-text">&#x2717; Command not recognized: "' + escapeHtml(scriptKey) + '"</span>');
      appendTerminalLine('<span class="text-muted">Type <span class="cyan-text font-bold">help</span> to inspect available commands or click quick-action buttons above.</span>');
      return;
    }

    appendTerminalHeader(scriptKey);
    isStreaming = true;

    script.forEach(function (step) {
      setTimeout(function () {
        appendTerminalLine('<div class="indent-line">' + step.text + '</div>');
      }, step.delay);
    });

    const maxDelay = script[script.length - 1].delay + 50;
    setTimeout(function () {
      isStreaming = false;
      scrollTerminalToBottom();
    }, maxDelay);
  }

  function clearTerminal() {
    if (!stdout) return;
    stdout.innerHTML = '';
    appendTerminalLine('<span class="cyan-text">========================================================================</span>');
    appendTerminalLine('<span class="emerald-text font-bold">DAVID CASTELLANOS // TELEMETRY TERMINAL v3.2.0 (CLEARED)</span>');
    appendTerminalLine('<span class="text-muted">Terminal buffer reset. Type <span class="cyan-text font-bold">help</span> to list commands.</span>');
    appendTerminalLine('<span class="cyan-text">========================================================================</span>');
  }

  // Quick Action Buttons
  const chips = document.querySelectorAll('.term-chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeTerminalScript(cmd);
      }
    });
  });

  // Terminal Input Form Submit
  if (termForm && termInput) {
    termForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const rawCmd = termInput.value.trim();
      if (!rawCmd) return;
      termInput.value = '';

      const normalized = rawCmd.toLowerCase();

      // Normalize common synonyms
      if (normalized === 'help' || normalized === '?') {
        executeTerminalScript('help');
      } else if (normalized === 'clear' || normalized === 'cls') {
        executeTerminalScript('clear');
      } else if (normalized === 'eci' || normalized === 'test:eci' || normalized === 'test eci' || normalized === 'test:eci-api') {
        executeTerminalScript('test:eci-api');
      } else if (normalized === 'simpleat' || normalized === 'test:simpleat' || normalized === 'test simpleat' || normalized === 'test:simpleat-e2e') {
        executeTerminalScript('test:simpleat-e2e');
      } else if (normalized === 'metrics' || normalized === 'qa' || normalized === 'metrics:qa') {
        executeTerminalScript('metrics:qa');
      } else if (normalized === 'skills' || normalized === 'cat skills' || normalized === 'cat skills.json') {
        executeTerminalScript('skills');
      } else if (normalized === 'contact' || normalized === 'email' || normalized === 'copy email') {
        executeTerminalScript('contact');
      } else if (normalized === 'cv' || normalized === 'resume' || normalized === 'download cv') {
        executeTerminalScript('cv');
      } else if (normalized === 'about' || normalized === 'bio') {
        executeTerminalScript('about');
      } else if (COMMAND_SCRIPTS[normalized]) {
        executeTerminalScript(normalized);
      } else {
        executeTerminalScript(rawCmd);
      }
    });
  }

  // Service Card Diagnostic Trigger Buttons
  const serviceTriggers = document.querySelectorAll('.service-trigger-btn');
  serviceTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const runTarget = btn.getAttribute('data-run');
      if (runTarget) {
        const heroSection = document.getElementById('hero');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(function () {
          executeTerminalScript(runTarget);
        }, 500);
      }
    });
  });

  /* ==========================================================================
     3. DEV TELEMETRY DRAWER ([DEV INSPECTOR // F12])
     ========================================================================== */
  const drawerToggle = document.getElementById('drawer-toggle');
  const drawerContent = document.getElementById('drawer-content');
  const domCountEl = document.getElementById('dom-count');
  const viewportDimEl = document.getElementById('viewport-dim');
  const btnRunAllTests = document.getElementById('btn-run-all-tests');

  function updateDevMetrics() {
    if (domCountEl) {
      domCountEl.textContent = document.getElementsByTagName('*').length.toString();
    }
    if (viewportDimEl) {
      viewportDimEl.textContent = window.innerWidth + 'x' + window.innerHeight;
    }
  }

  if (drawerToggle && drawerContent) {
    drawerToggle.addEventListener('click', function () {
      const isExpanded = drawerToggle.getAttribute('aria-expanded') === 'true';
      drawerToggle.setAttribute('aria-expanded', (!isExpanded).toString());
      drawerContent.hidden = isExpanded;
      if (!isExpanded) {
        updateDevMetrics();
      }
    });
  }

  if (btnRunAllTests) {
    btnRunAllTests.addEventListener('click', function () {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(function () {
        executeTerminalScript('test:eci-api');
        setTimeout(function () {
          executeTerminalScript('test:simpleat-e2e');
        }, 800);
      }, 400);
    });
  }

  window.addEventListener('resize', function () {
    if (viewportDimEl && drawerContent && !drawerContent.hidden) {
      viewportDimEl.textContent = window.innerWidth + 'x' + window.innerHeight;
    }
    // Auto-close mobile navigation when resized to desktop (>= 992px)
    if (window.innerWidth >= 992) {
      const navMenu = document.getElementById('nav-menu');
      const navToggle = document.getElementById('nav-toggle');
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  /* ==========================================================================
     4. SKILLS CATEGORY FILTER
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const filter = tab.getAttribute('data-filter');

      filterTabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      skillCards.forEach(function (card) {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     5. EMAIL CLIPBOARD COPY WITH FEEDBACK
     ========================================================================== */
  const emailCopyLink = document.getElementById('email-copy');
  const emailFeedback = document.getElementById('email-feedback');
  const emailTextEl = document.getElementById('email-text');
  const copyBadgeEl = document.getElementById('copy-badge');
  let copyResetTimer = null;

  function copyEmailToClipboard(isDirectClick) {
    const emailToCopy = 'davidllanos2005@gmail.com';

    function setSuccessState() {
      if (copyBadgeEl) copyBadgeEl.textContent = '[ COPIADO CON ÉXITO! ]';
      if (emailFeedback) emailFeedback.textContent = '¡Copiado al portapapeles!';

      if (copyResetTimer) clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(function () {
        if (copyBadgeEl) copyBadgeEl.textContent = '[ CLICK TO COPY ]';
        if (emailFeedback) emailFeedback.textContent = '';
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailToCopy).then(setSuccessState).catch(function () {
        fallbackCopy(emailToCopy, setSuccessState, isDirectClick);
      });
    } else {
      fallbackCopy(emailToCopy, setSuccessState, isDirectClick);
    }
  }

  function fallbackCopy(text, onSuccess, isDirectClick) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        onSuccess();
      } else if (isDirectClick) {
        window.location.href = 'mailto:' + text;
      }
    } catch (err) {
      if (isDirectClick) {
        window.location.href = 'mailto:' + text;
      }
    }
  }

  if (emailCopyLink) {
    emailCopyLink.addEventListener('click', function (e) {
      e.preventDefault();
      copyEmailToClipboard(true);
    });
  }

  function triggerCvDownload() {
    const cvLink = document.createElement('a');
    cvLink.href = '../../docs/CV%20David%20Castellanos%20-%20English.pdf';
    cvLink.download = 'CV_David_Castellanos.pdf';
    document.body.appendChild(cvLink);
    cvLink.click();
    document.body.removeChild(cvLink);
  }

  /* ==========================================================================
     6. MOBILE NAVIGATION COLLAPSE
     ========================================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when tapping any navigation link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when tapping outside the navbar
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==========================================================================
     7. SMOOTH BACK-TO-TOP FLOATING TRIGGER
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    if (!backToTopBtn) return;
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
