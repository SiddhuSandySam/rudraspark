const https = require('https');

const DOMAIN = "https://rudraspark-seo-engine.vercel.app";

function fetchRemoteJson(url) {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'RudraSpark-Sitemap-Generator' } }, (res) => {
            if (res.statusCode !== 200) {
                resolve([]);
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', () => resolve([]));
    });
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

    let urls = [];
    urls.push(`<url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`);

    // Fetch sample grids to generate dynamic sitemap entries
    const sampleGrids = ['g_190_730.json', 'g_189_730.json', 'g_187_728.json', 'g_380_140.json', 'g_250_450.json'];
    let allProviders = [];
    for (const gridFile of sampleGrids) {
        const gridUrl = `https://cdn.jsdelivr.net/gh/SiddhuSandySam/kaamwale-data@main/maharashtra_grids/${gridFile}`;
        const data = await fetchRemoteJson(gridUrl);
        if (Array.isArray(data)) allProviders.push(...data);
    }

    const seen = new Set();
    allProviders.forEach(p => {
        const city = p.city || p.locality || "";
        const subcategory = p.subcategory || p.primaryCategoryId || "";
        if (city && subcategory) {
            const slug = `${city}-${subcategory}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
            if (!seen.has(slug)) {
                seen.add(slug);
                urls.push(`<url><loc>${DOMAIN}/${slug}.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
            }
        }
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap.xml">
${urls.join('\n')}
</urlset>`;

    return res.status(200).send(xml);
};
