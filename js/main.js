// portfolio — main.js

document.addEventListener('DOMContentLoaded', function () {

    // ── Email copy ─────────────────────────────────────
    const emailLink = document.getElementById('email-copy');
    if (emailLink) {
        emailLink.addEventListener('click', function (e) {
            e.preventDefault();

            navigator.clipboard.writeText('davidllanos2005@gmail.com').then(function () {
                const prev = emailLink.textContent;
                emailLink.textContent = '¡Copiado al portapapeles!';
                emailLink.style.color = 'var(--orange-base)';
                emailLink.style.borderColor = 'var(--orange-base)';

                setTimeout(function () {
                    emailLink.textContent = prev;
                    emailLink.style.color = '';
                    emailLink.style.borderColor = '';
                }, 2000);
            }).catch(function () {
                window.location.href = 'mailto:davidllanos2005@gmail.com';
            });
        });
    }

    // ── Mobile Navbar Auto-close & Backdrop ───────────
    const navCollapse = document.getElementById('navbarNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (navCollapse && window.bootstrap) {
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse && navCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });

        // Close when clicking outside navbar on mobile
        document.addEventListener('click', function (e) {
            if (navCollapse.classList.contains('show') && !e.target.closest('.navbar')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    }

    // ── Back to Top Button ─────────────────────────────
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const toggleBackToTop = function () {
            if (window.scrollY > 350) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        };

        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ── Active Navigation on Scroll (ScrollSpy fallback) ─
    const sections = document.querySelectorAll('header[id], section[id], footer[id]');
    if ('IntersectionObserver' in window && sections.length > 0) {
        const navMap = new Map();
        navLinks.forEach(function (link) {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                navMap.set(targetId.substring(1), link);
            }
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(function (l) { l.classList.remove('active'); });
                    const activeLink = navMap.get(id);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '-25% 0px -65% 0px',
            threshold: 0
        });

        sections.forEach(function (sec) {
            observer.observe(sec);
        });
    }

});
