/**
 * DC // PORTFOLIO ARCHITECTURE REVIEW — COMPARISON HUB LOGIC
 * Dual-Tier Architecture: Foundation Tier (V1-V3) + Creative Engineering Tier (V4-V6)
 * Vanilla JavaScript · Zero Dependencies · Local file:// & Offline Safe
 */

(function () {
  'use strict';

  function init() {
    initClipboardCopy();
    initSwatchCopy();
    initMobileNav();
    initTierFiltering();
    initMatrixFiltering();
    initSmoothScroll();
    initDockAndScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * 1. Toast Notification System (Single DOM Element Guarded Against Spam)
   */
  let toastTimer = null;
  function showToast(message, dotColor) {
    let toast = document.getElementById('hub-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hub-toast';
      toast.className = 'hub-toast';
      toast.innerHTML = '<span class="toast-dot"></span><span class="toast-text"></span>';
      document.body.appendChild(toast);
    }

    const dot = toast.querySelector('.toast-dot');
    const text = toast.querySelector('.toast-text');

    if (dotColor && dot) {
      dot.style.backgroundColor = dotColor;
    }
    if (text) {
      text.textContent = message;
    }

    toast.classList.add('visible');

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(function () {
      toast.classList.remove('visible');
    }, 2400);
  }

  /**
   * 2. Email Copy with Visual Toast Feedback and Robust Offline Fallback
   */
  function initClipboardCopy() {
    const copyTriggers = document.querySelectorAll('.js-copy-email, [data-copy-email]');
    const emailTarget = 'davidllanos2005@gmail.com';

    copyTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(emailTarget)
            .then(function () {
              showToast('¡Correo ' + emailTarget + ' copiado al portapapeles!', '#00f0ff');
            })
            .catch(function () {
              fallbackCopy(emailTarget);
            });
        } else {
          fallbackCopy(emailTarget);
        }
      });
    });

    function fallbackCopy(text) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          showToast('¡Correo ' + text + ' copiado al portapapeles!', '#00f0ff');
        } else {
          showToast('Correo: ' + text, '#00f0ff');
        }
      } catch (err) {
        showToast('Correo: ' + text, '#00f0ff');
      }
    }
  }

  /**
   * 3. Color Swatch Click-to-Copy
   */
  function initSwatchCopy() {
    const swatches = document.querySelectorAll('.swatch-color[data-hex]');
    swatches.forEach(function (swatch) {
      const hex = swatch.getAttribute('data-hex');
      if (!hex) return;

      swatch.setAttribute('title', 'Copiar ' + hex);
      swatch.addEventListener('click', function () {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(hex).then(function () {
            showToast('Token ' + hex + ' copiado al portapapeles', hex);
          }).catch(function () {
            showToast('Color: ' + hex, hex);
          });
        } else {
          showToast('Color: ' + hex, hex);
        }
      });
    });
  }

  /**
   * 4. Mobile Navigation Drawer Toggle
   */
  function initMobileNav() {
    const toggle = document.querySelector('.hub-mobile-toggle');
    const menu = document.querySelector('.hub-nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    const navLinks = menu.querySelectorAll('.hub-nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * 5. Dual-Tier Category Filter Tabs (All / Foundation / Creative)
   */
  function initTierFiltering() {
    const tierButtons = document.querySelectorAll('.tier-filter-btn');
    const variantCards = document.querySelectorAll('.variant-card[data-tier]');
    const tierDividers = document.querySelectorAll('.tier-section-divider[data-tier-section]');

    if (!tierButtons.length || !variantCards.length) return;

    tierButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        tierButtons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const selectedTier = btn.getAttribute('data-tier');

        variantCards.forEach(function (card) {
          const cardTier = card.getAttribute('data-tier');
          if (!selectedTier || selectedTier === 'all' || cardTier === selectedTier) {
            card.classList.remove('tier-card-hidden');
          } else {
            card.classList.add('tier-card-hidden');
          }
        });

        tierDividers.forEach(function (divider) {
          const dividerTier = divider.getAttribute('data-tier-section');
          if (!selectedTier || selectedTier === 'all' || dividerTier === selectedTier) {
            divider.style.display = '';
          } else {
            divider.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * 6. Comparison Matrix Category Filtering
   */
  function initMatrixFiltering() {
    const filterButtons = document.querySelectorAll('.matrix-filter-btn');
    const matrixRows = document.querySelectorAll('.matrix-table tr.matrix-row, .matrix-table tbody tr');

    if (!filterButtons.length || !matrixRows.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        filterButtons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const category = btn.getAttribute('data-category');

        matrixRows.forEach(function (row) {
          if (!category || category === 'all') {
            row.classList.remove('row-hidden');
          } else {
            const rowCat = row.getAttribute('data-category');
            if (rowCat && rowCat.indexOf(category) !== -1) {
              row.classList.remove('row-hidden');
            } else {
              row.classList.add('row-hidden');
            }
          }
        });
      });
    });
  }

  /**
   * 7. Smooth Scrolling for Internal Anchor Links with Sticky Header Offset
   */
  function initSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.hub-header');
    const headerHeight = header ? header.offsetHeight : 72;

    internalLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 16);
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * 8. Persistent Dock & ScrollSpy
   */
  function initDockAndScrollSpy() {
    const backToTopBtn = document.getElementById('dock-to-top');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.hub-nav-link[href^="#"]');

    function updateScrollSpy() {
      const scrollY = window.pageYOffset + 120;

      sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();
  }
})();
