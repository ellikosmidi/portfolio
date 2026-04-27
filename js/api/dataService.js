export async function fetchPortfolioData() {
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) throw new Error("Could not load content.json");
        return await response.json();
    } catch (err) {
        console.error("CMS integration error:", err);
        return null;
    }
}
