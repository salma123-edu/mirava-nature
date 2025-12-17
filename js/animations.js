document.addEventListener('DOMContentLoaded', () => {
    // 1. Gérer la navbar (Glassmorphism au scroll)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal (Apparition des éléments)
    const reveals = document.querySelectorAll('.engagement-card, .product-card, section h2, .hero-content');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Jouer l'anim une seule fois
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => {
        el.classList.add('reveal'); // Ajouter la classe de base css
        revealObserver.observe(el);
    });
});
