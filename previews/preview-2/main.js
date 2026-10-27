/**
 * ============================================================================
 * VARIANT 2: MODERN KINETIC BENTO-BOX & SPATIAL CRAFT
 * Interactive Logic & Micro-interactions
 * 100% Vanilla JavaScript · Zero Dependencies · Local file:// & Static Compatible
 * ============================================================================
 */

(function () {
  'use strict';

  function init() {
    initSpotlightLighting();
    initMagneticCopy();
    initSkillsFilter();
    initDockNav();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * --------------------------------------------------------------------------
   * 1. Kinetic Mouse-Tracking Spotlight Lighting
   * Computes pointer coordinates relative to each bento card and updates
   * CSS variables --mouse-x and --mouse-y on animation frames.
   * --------------------------------------------------------------------------
   */
  function initSpotlightLighting() {
    const cards = document.querySelectorAll('.spotlight-card');
    if (!cards.length) return;

    let rafId = null;
    let lastMouseEvent = null;

    const updateSpotlights = () => {
      if (!lastMouseEvent) return;
      const { clientX, clientY } = lastMouseEvent;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Only update if card is visible within the viewport
        if (
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        ) {
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
          card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
        }
      });
      rafId = null;
    };

    window.addEventListener(
      'pointermove',
      (e) => {
        lastMouseEvent = e;
        if (!rafId) {
          rafId = requestAnimationFrame(updateSpotlights);
        }
      },
      { passive: true }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * 2. Magnetic Email Copy Interactions with Feedback & Fallback
   * --------------------------------------------------------------------------
   */
  function initMagneticCopy() {
    const emailToCopy = 'davidllanos2005@gmail.com';

    // Hero Email Copy Pill
    const heroBtn = document.getElementById('hero-email-copy');
    const heroLabel = document.getElementById('hero-email-label');
    const heroTooltip = document.getElementById('hero-copy-tooltip');
    let heroTimer = null;

    if (heroBtn) {
      heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        copyTextWithFallback(emailToCopy, () => {
          if (heroTimer) clearTimeout(heroTimer);
          if (heroTooltip) {
            heroTooltip.textContent = '✓ ¡Copiado con éxito!';
            heroTooltip.classList.add('show');
          }
          if (heroLabel) {
            heroLabel.textContent = '¡Copiado al portapapeles!';
          }

          heroTimer = setTimeout(() => {
            if (heroTooltip) heroTooltip.classList.remove('show');
            if (heroLabel) heroLabel.textContent = emailToCopy;
          }, 2200);
        });
      });
    }

    // Contact Card Copy Button
    const contactBtn = document.getElementById('contact-email-copy');
    const contactLabel = document.getElementById('contact-email-label');
    const contactBadge = document.getElementById('contact-copy-badge');
    let contactTimer = null;

    if (contactBtn) {
      contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        copyTextWithFallback(emailToCopy, () => {
          if (contactTimer) clearTimeout(contactTimer);
          if (contactBadge) {
            contactBadge.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>¡Copiado!</span>
            `;
          }
          if (contactLabel) {
            contactLabel.textContent = '¡Copiado al portapapeles!';
          }

          contactTimer = setTimeout(() => {
            if (contactBadge) {
              contactBadge.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copiar</span>
              `;
            }
            if (contactLabel) contactLabel.textContent = emailToCopy;
          }, 2200);
        });
      });
    }

    // Robust Clipboard Helper with Document ExecCommand & Mailto Fallback
    function copyTextWithFallback(text, onSuccess) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(onSuccess)
          .catch(() => fallbackCopy(text, onSuccess));
      } else {
        fallbackCopy(text, onSuccess);
      }
    }

    function fallbackCopy(text, onSuccess) {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.style.position = 'fixed';
        tempInput.style.left = '-9999px';
        tempInput.style.top = '0';
        tempInput.setAttribute('readonly', '');
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(tempInput);
        if (successful) {
          onSuccess();
          return;
        }
      } catch (err) {
        // Fallback gracefully
      }
      // If clipboard entirely restricted, trigger mailto
      window.location.href = `mailto:${text}`;
      onSuccess();
    }
  }

  /**
   * --------------------------------------------------------------------------
   * 3. Interactive Skills Filter Matrix
   * Dynamically filters the 5 bento skill pods with animated transitions.
   * --------------------------------------------------------------------------
   */
  function initSkillsFilter() {
    const filterPills = document.querySelectorAll('.skills-filter-bar .filter-pill');
    const skillPods = document.querySelectorAll('.skills-pods-grid .skill-pod-card');
    if (!filterPills.length || !skillPods.length) return;

    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const category = pill.getAttribute('data-category');

        // Update active filter pill
        filterPills.forEach((p) => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');

        // Filter pods
        skillPods.forEach((pod) => {
          const podCategory = pod.getAttribute('data-category');
          if (category === 'all' || podCategory === category) {
            pod.style.display = '';
            pod.style.opacity = '1';
            pod.style.transform = 'scale(1)';
          } else {
            pod.style.display = 'none';
            pod.style.opacity = '0';
            pod.style.transform = 'scale(0.96)';
          }
        });
      });
    });
  }

  /**
   * --------------------------------------------------------------------------
   * 4. Floating Dock Navigation: Mobile Drawer, Scrollspy & Smooth Anchor Nav
   * --------------------------------------------------------------------------
   */
  function initDockNav() {
    const toggleBtn = document.getElementById('dock-toggle');
    const linksMenu = document.getElementById('dock-links');
    const navLinks = document.querySelectorAll('.dock-link');

    // Mobile Hamburger Toggle
    if (toggleBtn && linksMenu) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = linksMenu.classList.contains('open');
        linksMenu.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', String(!isOpen));
      });

      // Auto-close on link click
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          linksMenu.classList.remove('open');
          toggleBtn.setAttribute('aria-expanded', 'false');
        });
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (e && e.target && typeof e.target.closest === 'function') {
          if (!e.target.closest('#dock-header')) {
            linksMenu.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Close on window resize if larger than tablet breakpoint
      window.addEventListener(
        'resize',
        () => {
          if (window.innerWidth >= 992 && linksMenu.classList.contains('open')) {
            linksMenu.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
          }
        },
        { passive: true }
      );
    }

    // Scrollspy using IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length) {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach((sec) => observer.observe(sec));
    }
  }

  /**
   * --------------------------------------------------------------------------
   * 5. Smooth Back-to-Top Floating Button
   * --------------------------------------------------------------------------
   */
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    let isScrolling = false;

    const onScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
      isScrolling = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!isScrolling) {
          window.requestAnimationFrame(onScroll);
          isScrolling = true;
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
})();
