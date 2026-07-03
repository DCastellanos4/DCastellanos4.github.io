// portfolio-retro — main.js

document.addEventListener('DOMContentLoaded', function () {

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
