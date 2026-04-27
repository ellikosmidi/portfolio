import { state } from '../state.js';
import { renderContent } from '../ui/renderer.js';

export function initLanguageSwitcher() {
    const btnEl = document.getElementById('btn-lang-el');
    const btnEn = document.getElementById('btn-lang-en');

    if (btnEl && btnEn) {
        btnEl.addEventListener('click', () => {
            if (state.currentLang === 'el') return;
            state.currentLang = 'el';
            btnEl.classList.add('active');
            btnEn.classList.remove('active');
            document.documentElement.lang = 'el';
            if (state.portfolioData) renderContent(state.portfolioData);
        });
        btnEn.addEventListener('click', () => {
            if (state.currentLang === 'en') return;
            state.currentLang = 'en';
            btnEn.classList.add('active');
            btnEl.classList.remove('active');
            document.documentElement.lang = 'en';
            if (state.portfolioData) renderContent(state.portfolioData);
        });
    }
}
