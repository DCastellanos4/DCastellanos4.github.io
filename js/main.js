// portfolio-retro — main.js

document.addEventListener('DOMContentLoaded', function () {

    // ── Custom Cursor ──────────────────────────────────
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverElements = document.querySelectorAll('a, button, .skill-tag, .card, .avatar-item, .timeline-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // ── Scroll Reveal ──────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ── Dynamic Text Typing (Hero) ─────────────────────
    const typeWriterEl = document.getElementById('typewriter');
    if (typeWriterEl) {
        const words = ['QA AUTOMATION', 'FULL STACK DEV', 'CYBERSECURITY'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typeWriterEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typeWriterEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1000);
    }

    // ── Email copy ─────────────────────────────────────
    const emailLink = document.getElementById('email-copy');
    if (emailLink) {
        emailLink.addEventListener('click', function (e) {
            e.preventDefault();

            navigator.clipboard.writeText('davidllanos2005@gmail.com').then(function () {
                const prev = emailLink.textContent;
                emailLink.textContent = 'Copiado';
                emailLink.style.color = 'var(--accent)';
                emailLink.style.borderColor = 'var(--accent)';

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

});
