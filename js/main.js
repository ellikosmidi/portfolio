import { state } from './state.js';
import { initMobileMenu } from './ui/menu.js';
import { initLanguageSwitcher } from './utils/language.js';
import { fetchPortfolioData } from './api/dataService.js';
import { renderContent } from './ui/renderer.js';

document.addEventListener('DOMContentLoaded', async () => {
    initMobileMenu();
    initLanguageSwitcher();

    state.portfolioData = await fetchPortfolioData();

    if (state.portfolioData) {
        renderContent(state.portfolioData);
    }
});
