/* public/js/main.js - Scroll Reveal & Mobile Menu Toggle */
document.addEventListener("DOMContentLoaded", () => {
    
    // --- PART 1: SCROLL REVEAL (IntersectionObserver) ---
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.15
        };
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(revealCallback, observerOptions);
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- PART 2: MOBILE HAMBURGER MENU TOGGLE ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            // Toggle the hidden class on the dropdown
            const isHidden = mobileMenu.classList.toggle('hidden');
            
            // Swap the hamburger icon and the 'X' icon
            iconOpen.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');

            // Update accessibility attribute (tells screen readers if menu is open or closed)
            menuBtn.setAttribute('aria-expanded', !isHidden);
        });
    }
});