module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

    const DOMAIN = "https://rudraspark.vercel.app";
    let urls = [];
    urls.push(`<url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`);

    const cities = [
        // Maharashtra
        'pune', 'mumbai', 'navi-mumbai', 'thane', 'nagpur', 'nashik', 'aurangabad', 'kolhapur', 'solapur', 'amravati', 'nanded', 'sangli', 'satara', 'ratnagiri', 'latur', 'dhule',
        // Andhra Pradesh & Telangana
        'visakhapatnam', 'vijayawada', 'guntur', 'tirupati', 'nellore', 'kurnool', 'kakinada', 'hyderabad', 'warangal', 'nizamabad',
        // Puducherry & UTs
        'puducherry', 'pondicherry', 'chandigarh', 'port-blair', 'jammu', 'srinagar', 'leh', 'daman', 'silvassa',
        // North India
        'delhi', 'gurgaon', 'faridabad', 'noida', 'ghaziabad', 'lucknow', 'kanpur', 'varanasi', 'agra', 'prayagraj', 'dehradun', 'haridwar', 'jaipur', 'jodhpur', 'udaipur', 'kota', 'amritsar', 'ludhiana', 'shimla',
        // South India
        'bangalore', 'mysore', 'mangalore', 'hubli', 'chennai', 'coimbatore', 'madurai', 'tiruchirappalli', 'kochi', 'trivandrum', 'kozhikode',
        // East & North East
        'kolkata', 'siliguri', 'durgapur', 'patna', 'gaya', 'muzaffarpur', 'bhagalpur', 'bhubaneswar', 'cuttack', 'ranchi', 'jamshedpur', 'guwahati', 'silchar', 'shillong', 'itanagar', 'imphal', 'agartala', 'gangtok',
        // Central & West
        'bhopal', 'indore', 'gwalior', 'jabalpur', 'raipur', 'bhilai', 'bilaspur', 'ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar', 'goa', 'panaji', 'margao'
    ];

    const services = [
        'plumber', 'electrician', 'caterer', 'carpenter', 'painter', 'ac-repair', 'cleaning', 'packers-and-movers',
        'pest-control', 'waterproofing', 'laptop-repair', 'mobile-repair', 'car-mechanic', 'bike-mechanic', 'tailor',
        'photographer', 'dj-rental', 'tent-rental', 'security-guard', 'driver', 'cook', 'maid', 'interior-designer',
        'solar-expert', 'fabricator', 'printing-press', 'agri-expert', 'beauty-salon', 'makeup-artist', 'yoga-trainer'
    ];

    cities.forEach(city => {
        services.forEach(service => {
            const slug = `${city}-${service}`;
            urls.push(`<url><loc>${DOMAIN}/${slug}.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
        });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return res.status(200).send(xml);
};
