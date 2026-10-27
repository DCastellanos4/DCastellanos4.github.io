/**
 * VARIANT 1: PRECISION MONOSPACE & ARCHITECTURAL GRID
 * Vanilla JavaScript Engine (Zero external dependencies, 100% file:// compatible)
 * Candidate: David Castellanos — Full Stack Developer & QA Engineer
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Live UTC Telemetry Clock ---
    var clockEl = document.getElementById('utc-clock');
    function updateClock() {
      if (!clockEl) return;
      var now = new Date();
      var hours = String(now.getUTCHours()).padStart(2, '0');
      var minutes = String(now.getUTCMinutes()).padStart(2, '0');
      var seconds = String(now.getUTCSeconds()).padStart(2, '0');
      clockEl.textContent = hours + ':' + minutes + ':' + seconds + 'Z';
    }
    updateClock();
    setInterval(updateClock, 1000);

    // --- 2. Robust Clipboard Copy Utility with Fallbacks ---
    var emailString = 'davidllanos2005@gmail.com';

    function copyToClipboard(text, onSuccess, onFailure) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
          .then(function () {
            if (typeof onSuccess === 'function') onSuccess();
          })
          .catch(function () {
            fallbackCopy(text, onSuccess, onFailure);
          });
      } else {
        fallbackCopy(text, onSuccess, onFailure);
      }
    }

    function fallbackCopy(text, onSuccess, onFailure) {
      try {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful && typeof onSuccess === 'function') {
          onSuccess();
        } else if (typeof onFailure === 'function') {
          onFailure();
        }
      } catch (err) {
        if (typeof onFailure === 'function') onFailure();
      }
    }

    // --- 3. Hero CLI Snippet Copy Button ---
    var cliCopyTrigger = document.getElementById('cli-copy-trigger');
    var cliStdout = document.getElementById('cli-stdout');
    var cliLatency = document.getElementById('cli-latency');
    var cliTimer = null;

    if (cliCopyTrigger) {
      cliCopyTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        var startTime = performance.now();
        var targetEmail = cliCopyTrigger.getAttribute('data-copy') || emailString;

        copyToClipboard(
          targetEmail,
          function () {
            var elapsed = Math.round(performance.now() - startTime) || 14;
            if (cliStdout) {
              cliStdout.innerHTML = '<span class="text-ready font-weight-bold">[OK: COPIADO AL PORTAPAPELES (' + elapsed + 'ms)]</span> &quot;' + targetEmail + '&quot;';
            }
            if (cliLatency) {
              cliLatency.textContent = '[' + elapsed + 'ms]';
            }
            var btnText = cliCopyTrigger.querySelector('.copy-text');
            if (btnText) btnText.textContent = '[¡COPIADO!]';

            clearTimeout(cliTimer);
            cliTimer = setTimeout(function () {
              if (cliStdout) {
                cliStdout.innerHTML = '<span class="stdout-dim">// stdout:</span> &quot;' + targetEmail + '&quot;';
              }
              if (cliLatency) {
                cliLatency.textContent = '[READY]';
              }
              if (btnText) btnText.textContent = '[COPIAR EMAIL]';
            }, 2500);
          },
          function () {
            window.location.href = 'mailto:' + targetEmail;
          }
        );
      });
    }

    // --- 4. Contact Section Terminal Email Copy ---
    var emailCopyLink = document.getElementById('email-copy');
    var emailText = document.getElementById('email-text');
    var emailBadge = document.getElementById('email-badge');
    var emailStdout = document.getElementById('email-stdout');
    var emailTimer = null;

    if (emailCopyLink) {
      emailCopyLink.addEventListener('click', function (e) {
        // Prevent default navigation to give copy feedback, mailto fallback available on error
        e.preventDefault();
        var startTime = performance.now();

        copyToClipboard(
          emailString,
          function () {
            var elapsed = Math.round(performance.now() - startTime) || 12;
            if (emailBadge) {
              emailBadge.textContent = '[¡COPIADO AL PORTAPAPELES!]';
              emailBadge.style.color = 'var(--arch-status-ready)';
              emailBadge.style.borderColor = 'var(--arch-status-ready)';
            }
            if (emailStdout) {
              emailStdout.innerHTML = '<span class="text-ready">[OK: COPIADO (' + elapsed + 'ms)]</span> Dirección davidllanos2005@gmail.com transferida al portapapeles.';
            }

            clearTimeout(emailTimer);
            emailTimer = setTimeout(function () {
              if (emailBadge) {
                emailBadge.textContent = '[CLICK_TO_COPY]';
                emailBadge.style.color = '';
                emailBadge.style.borderColor = '';
              }
              if (emailStdout) {
                emailStdout.innerHTML = '<span class="stdout-dim">// estado:</span> Listo para iniciar contacto.';
              }
            }, 2500);
          },
          function () {
            window.location.href = 'mailto:' + emailString;
          }
        );
      });
    }

    // --- 5. Mobile Navigation Hamburger & Collapse ---
    var navToggle = document.getElementById('nav-toggle');
    var navMenu = document.getElementById('nav-menu');
    var navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Auto-collapse when clicking nav link
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // Auto-collapse when clicking outside
      document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('open')) {
          if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Auto-collapse on resize across breakpoint
      window.addEventListener('resize', function () {
        if (window.innerWidth >= 992 && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // --- 6. Smooth Back-to-Top Floating Trigger ---
    var backToTopBtn = document.getElementById('back-to-top');

    function checkScrollTop() {
      if (!backToTopBtn) return;
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', checkScrollTop, { passive: true });
    checkScrollTop();

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // --- 7. Real-Time Crosshair Coordinate HUD ---
    var hudCoords = document.getElementById('hud-coords');
    var hudGrid = document.getElementById('hud-grid');

    if (hudCoords && hudGrid) {
      window.addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;
        var col = Math.min(12, Math.max(1, Math.ceil((x / window.innerWidth) * 12)));
        var row = Math.min(12, Math.max(1, Math.ceil((y / window.innerHeight) * 12)));

        hudCoords.textContent = 'X: ' + String(x).padStart(4, '0') + ' | Y: ' + String(y).padStart(4, '0');
        hudGrid.textContent = 'GRID: [' + String(col).padStart(2, '0') + ', ' + String(row).padStart(2, '0') + ']';
      }, { passive: true });
    }

    // --- 8. Technical Spec Sheets Telemetry Inspector ---
    var inspectBtns = document.querySelectorAll('.spec-inspect-btn');
    inspectBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-target');
        var drawer = document.getElementById(targetId);
        if (!drawer) return;

        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          drawer.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
          btn.innerHTML = '<span class="btn-prefix">&gt;</span> [INSPECCIONAR TELEMETRÍA]';
        } else {
          drawer.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
          btn.innerHTML = '<span class="btn-prefix">&gt;</span> [CERRAR TELEMETRÍA]';
        }
      });
    });

    // --- 9. Skills Matrix Category Filter ---
    var filterBtns = document.querySelectorAll('.skill-tab-btn');
    var categoryGroups = document.querySelectorAll('.skill-category-group');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filterValue = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        categoryGroups.forEach(function (group) {
          var groupCat = group.getAttribute('data-cat');
          if (filterValue === 'all' || filterValue === groupCat) {
            group.style.display = '';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });

    // --- 10. Active Navigation Scrollspy ---
    var sections = document.querySelectorAll('section[id], header[id]');
    function updateScrollspy() {
      var scrollPosition = window.scrollY + 120;
      var currentSectionId = '';

      sections.forEach(function (section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === '#' + currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', updateScrollspy, { passive: true });
    updateScrollspy();

  });
})();
