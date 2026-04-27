export function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 767) {
                    navLinks.classList.remove('nav-active');
                }
            });
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
                navLinks.classList.remove('nav-active');
            }
        });
    }
}
