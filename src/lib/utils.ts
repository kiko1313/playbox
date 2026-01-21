export function getYouTubeID(url: string | undefined): string | null {
    if (!url) return null;
    try {
        // Handle standard embedding logic
        const str = url.startsWith('http') ? url : `https://${url}`;
        const urlObj = new URL(str);

        // Shorts
        if (urlObj.pathname.includes('/shorts/')) {
            const parts = urlObj.pathname.split('/');
            return parts[parts.indexOf('shorts') + 1] || null;
        }

        // youtu.be
        if (urlObj.hostname.includes('youtu.be')) {
            return urlObj.pathname.slice(1);
        }

        // Standard
        return urlObj.searchParams.get('v');
    } catch (e) {
        return null;
    }
}
