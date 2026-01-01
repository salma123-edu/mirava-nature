/**
 * MAIN.JS - Logique Globale et Menu Mobile
 */

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;

    if (toggle && nav) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('open');
            nav.classList.toggle('open');

            // Empêcher le scroll du body quand le menu est ouvert
            if (nav.classList.contains('open')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Fermer le menu si on clique sur un lien
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('open');
                nav.classList.remove('open');
                body.style.overflow = '';
            });
        });

        // Fermer le menu si on clique en dehors
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
                toggle.classList.remove('open');
                nav.classList.remove('open');
                body.style.overflow = '';
            }
        });
    }

    // Effet scroll sur le header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
