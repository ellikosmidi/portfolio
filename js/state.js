export const state = {
    currentLang: 'el',
    portfolioData: null
};

export function getStr(data, key) {
    if (!data) return '';
    if (state.currentLang === 'en' && data[key + '_en']) {
        return data[key + '_en'];
    }
    return data[key] || '';
}
