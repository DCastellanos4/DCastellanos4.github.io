/**
 * VARIANT 6: KINETIC SWISS BRUTALISM & SPATIAL TYPOGRAPHY
 * Master Interaction & Animation Controller
 * 
 * Architecture:
 * - Standalone UMD pattern with zero ES module imports (CORS/file:// safe).
 * - Defensive library guards for Lenis, GSAP, and ScrollTrigger.
 * - Magnetic Difference Cursor with Lerp damping & chromatic aberration.
 * - Spatial text-scrub parallax animations.
 * - 1-Click clipboard engine with robust fallback.
 * - Zero layout thrashing; 60 FPS performance.
 */

(function () {
  'use strict';

  // --- Configuration & State ---
  var state = {
    lenis: null,
    cursor: {
      el: null,
      badge: null,
      mouseX: -100,
      mouseY: -100,
      currentX: -100,
      currentY: -100,
      lastMouseX: -100,
      lastMouseY: -100,
      velocity: 0,
      isHovering: false,
      isMagnetic: false,
      magneticTarget: null
    },
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // --- 1. DOM Ready Initialization ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    initMobileNav();
    initDifferenceCursor();
    initSkillsFilter();
    initEmailClipboard();
    initSmoothScrollAndGSAP();
  }

  // --- 2. Mobile Navigation Drawer ---
  function initMobileNav() {
    var toggleBtn = document.getElementById('mobile-toggle');
    var drawer = document.getElementById('mobile-drawer');
    var closeBtn = document.getElementById('drawer-close');
    var drawerLinks = document.querySelectorAll('.drawer-link');

    if (!toggleBtn || !drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) {
        closeDrawer();
      }
    });

    drawerLinks.forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
  }

  // --- 3. Custom Magnetic Difference Cursor & Chromatic Aberration ---
  function initDifferenceCursor() {
    var isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || state.prefersReducedMotion) return;

    var cursorEl = document.getElementById('difference-cursor');
    var cursorBadge = document.getElementById('cursor-badge');
    if (!cursorEl) return;

    state.cursor.el = cursorEl;
    state.cursor.badge = cursorBadge;

    // Track mouse position & compute instantaneous velocity
    window.addEventListener('pointermove', function (e) {
      state.cursor.mouseX = e.clientX;
      state.cursor.mouseY = e.clientY;

      var dx = e.clientX - state.cursor.lastMouseX;
      var dy = e.clientY - state.cursor.lastMouseY;
      state.cursor.velocity = Math.hypot(dx, dy);

      state.cursor.lastMouseX = e.clientX;
      state.cursor.lastMouseY = e.clientY;

      // Momentary chromatic aberration on high velocity flick
      if (state.cursor.velocity > 38 && !cursorEl.classList.contains('has-chromatic')) {
        triggerChromaticBurst(120);
      }
    }, { passive: true });

    // Chromatic burst on mousedown
    window.addEventListener('pointerdown', function () {
      triggerChromaticBurst(220);
    }, { passive: true });

    function triggerChromaticBurst(duration) {
      cursorEl.classList.add('has-chromatic');
      clearTimeout(triggerChromaticBurst._timer);
      triggerChromaticBurst._timer = setTimeout(function () {
        cursorEl.classList.remove('has-chromatic');
      }, duration || 180);
    }

    // Magnetic attraction to interactive targets
    var interactives = document.querySelectorAll('button, a, .magnetic-btn, .magnetic-target, .skill-card, .project-plate, .brand-card');

    interactives.forEach(function (target) {
      target.addEventListener('mouseenter', function () {
        cursorEl.classList.add('is-hovering');
        state.cursor.isHovering = true;
        state.cursor.magneticTarget = target;

        // Custom badge text based on element type
        if (cursorBadge) {
          if (target.id === 'email-copy-box' || target.id === 'btn-copy-email') {
            cursorBadge.textContent = 'COPIAR';
          } else if (target.classList.contains('project-plate')) {
            cursorBadge.textContent = 'PROYECTO';
          } else if (target.classList.contains('skill-card')) {
            cursorBadge.textContent = 'STACK';
          } else if (target.classList.contains('brand-card')) {
            cursorBadge.textContent = 'PRODUCCIÓN';
          } else if (target.getAttribute('download')) {
            cursorBadge.textContent = 'PDF';
          } else {
            cursorBadge.textContent = 'VER';
          }
        }
      });

      target.addEventListener('mousemove', function (e) {
        if (state.cursor.magneticTarget !== target) return;
        var rect = target.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var dx = e.clientX - centerX;
        var dy = e.clientY - centerY;

        // Subtle elastic attraction
        target.style.transform = 'translate3d(' + (dx * 0.16) + 'px, ' + (dy * 0.16) + 'px, 0)';
      });

      target.addEventListener('mouseleave', function () {
        cursorEl.classList.remove('is-hovering');
        state.cursor.isHovering = false;
        target.style.transform = '';
        state.cursor.magneticTarget = null;
      });
    });

    // 60 FPS Cursor Lerp Render Loop
    function renderCursor() {
      requestAnimationFrame(renderCursor);

      var targetX = state.cursor.mouseX;
      var targetY = state.cursor.mouseY;

      // If over a magnetic target, gently bias cursor center towards button center
      if (state.cursor.isHovering && state.cursor.magneticTarget) {
        var rect = state.cursor.magneticTarget.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        targetX = centerX + (state.cursor.mouseX - centerX) * 0.35;
        targetY = centerY + (state.cursor.mouseY - centerY) * 0.35;
      }

      // Smooth Lerp damping
      state.cursor.currentX += (targetX - state.cursor.currentX) * 0.22;
      state.cursor.currentY += (targetY - state.cursor.currentY) * 0.22;

      cursorEl.style.transform = 'translate3d(' + state.cursor.currentX.toFixed(2) + 'px, ' + state.cursor.currentY.toFixed(2) + 'px, 0)';
    }

    renderCursor();
  }

  // --- 4. Lenis Smooth Scroll & GSAP ScrollTrigger Synchronization ---
  function initSmoothScrollAndGSAP() {
    var hasLenis = typeof window.Lenis !== 'undefined' && !state.prefersReducedMotion;
    var hasGSAP = typeof window.gsap !== 'undefined';
    var hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

    // A. Initialize Lenis Smooth Inertial Scroll
    if (hasLenis) {
      try {
        state.lenis = new window.Lenis({
          duration: 1.25,
          easing: function (t) {
            return Math.min(1, 1.001 - Math.pow(2, -10 * t));
          },
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5
        });

        if (hasGSAP && hasScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);

          // Synchronize Lenis scroll position with ScrollTrigger
          state.lenis.on('scroll', window.ScrollTrigger.update);

          // Drive Lenis through GSAP ticker for frame-locked precision
          window.gsap.ticker.add(function (time) {
            state.lenis.raf(time * 1000);
          });
          window.gsap.ticker.lagSmoothing(0);
        } else {
          // Native RAF loop for Lenis
          function rafStep(time) {
            state.lenis.raf(time);
            requestAnimationFrame(rafStep);
          }
          requestAnimationFrame(rafStep);
        }
      } catch (err) {
        console.warn('Lenis initialization fallback:', err);
      }
    }

    // B. Smooth Anchor Scrolling (Compatible with Lenis or native)
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        var targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          if (state.lenis) {
            state.lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // C. Kinetic Spatial Text Scrubbing Animations
    if (hasGSAP && hasScrollTrigger && !state.prefersReducedMotion) {
      try {
        // Colossal Hero Scrubbing Rows (Opposite parallax directions)
        var rowLeft = document.getElementById('scrub-row-1');
        var rowRight = document.getElementById('scrub-row-2');
        var heroSection = document.getElementById('hero');

        if (rowLeft && heroSection) {
          window.gsap.to(rowLeft, {
            x: -200,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }

        if (rowRight && heroSection) {
          window.gsap.to(rowRight, {
            x: 200,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }

        // Kinetic text reveals for section titles
        var kineticTitles = document.querySelectorAll('.kinetic-text');
        kineticTitles.forEach(function (el) {
          window.gsap.from(el, {
            y: 40,
            opacity: 0.2,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          });
        });

      } catch (err) {
        console.warn('GSAP kinetic animations fallback:', err);
      }
    } else {
      // Zero-GSAP Native IntersectionObserver Fallback
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        document.querySelectorAll('.kinetic-text').forEach(function (el) {
          el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.opacity = '0.9';
          observer.observe(el);
        });
      }
    }
  }

  // --- 5. Interactive Skills Matrix Filtering ---
  function initSkillsFilter() {
    var filterButtons = document.querySelectorAll('.filter-pill');
    var skillCards = document.querySelectorAll('.skill-card');

    if (!filterButtons.length || !skillCards.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Toggle active state
        filterButtons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        var filterValue = btn.getAttribute('data-filter');

        // Filter cards with smooth visibility
        skillCards.forEach(function (card) {
          var cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // --- 6. Email 1-Click Clipboard Engine with Visual Toast ---
  function initEmailClipboard() {
    var emailBox = document.getElementById('email-copy-box');
    var copyBtn = document.getElementById('btn-copy-email');
    var toast = document.getElementById('copy-toast');
    var targetEmail = 'davidllanos2005@gmail.com';

    if (!emailBox && !copyBtn) return;

    function copyEmailToClipboard() {
      showToast();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(targetEmail).catch(function () {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    }

    function fallbackCopy() {
      try {
        var textArea = document.createElement('textarea');
        textArea.value = targetEmail;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) showToast();
      } catch (err) {
        console.warn('Fallback copy error:', err);
      }
    }

    function showToast() {
      if (!toast) return;
      toast.classList.add('is-visible');
      clearTimeout(showToast._timer);
      showToast._timer = setTimeout(function () {
        toast.classList.remove('is-visible');
      }, 2600);
    }

    if (emailBox) {
      emailBox.addEventListener('click', function (e) {
        // Prevent double trigger if clicking button directly
        if (e.target !== copyBtn && !copyBtn.contains(e.target)) {
          copyEmailToClipboard();
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        copyEmailToClipboard();
      });
    }
  }

  // --- 7. Memory & Lifecycle Cleanup ---
  window.addEventListener('beforeunload', function () {
    if (state.lenis) {
      try { state.lenis.destroy(); } catch (e) {}
    }
    if (typeof window.ScrollTrigger !== 'undefined') {
      try { window.ScrollTrigger.getAll().forEach(function (t) { t.kill(); }); } catch (e) {}
    }
  });

})();
