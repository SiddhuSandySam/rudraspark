const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'public');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const DOMAIN = "https://rudraspark.vercel.app";
const GOOGLE_VERIFICATION = '<meta name="google-site-verification" content="ueLjOKjISiD5rlHrSK510SAvXnyHheDauLQ_6yvlLW8" />';
const RAW_IMAGE_URL = "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/Sandeshkoli.png";

// 🚀 SCAN ALL STATE GRIDS FROM ABSOLUTE PATH
const staticApiDir = "F:/kaamwale/index/static_api";
let allProviders = [];

function getCleanCity(p) {
    let c = p.city || p.locality || "";
    // If city is empty, starts with a number, or contains 'floor' / 'shop', parse fullAddress
    if (!c || /^\d/.test(c) || c.toLowerCase().includes('floor') || c.toLowerCase().includes('shop') || c.toLowerCase().includes('room')) {
        if (p.fullAddress) {
            const parts = p.fullAddress.split(',').map(s => s.trim());
            // Find a part that doesn't have numbers or is a state/city name
            const validPart = parts.reverse().find(part => part.length > 2 && !/\d/.test(part) && !part.toLowerCase().includes('floor'));
            if (validPart) {
                c = validPart;
            } else {
                c = "Local Area";
            }
        } else {
            c = "Local Area";
        }
    }
    return c;
}

try {
    const items = fs.readdirSync(staticApiDir);
    items.forEach(item => {
        if (item.endsWith('_grids')) {
            const gridDirPath = path.join(staticApiDir, item);
            if (fs.statSync(gridDirPath).isDirectory()) {
                const gridFiles = fs.readdirSync(gridDirPath).filter(f => f.endsWith('.json'));
                gridFiles.slice(0, 10).forEach(gf => {
                    try {
                        const gridData = JSON.parse(fs.readFileSync(path.join(gridDirPath, gf), 'utf8'));
                        if (Array.isArray(gridData)) {
                            allProviders.push(...gridData);
                        }
                    } catch (err) {}
                });
            }
        }
    });
    console.log(`✅ Loaded ${allProviders.length} total providers from state grids for static pre-rendering.`);
} catch (e) {
    console.warn("⚠️ Grid scan warning: " + e.message);
}

const categoriesBar = [
    { name: "Rental", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/cat_rental.png" },
    { name: "Agri Services", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/cat_agri.png" },
    { name: "Fabrication", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/cat_fabrication.png" },
    { name: "Logistics", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/cat_logistics.png" },
    { name: "Printing", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/cat_print.png" },
    { name: "Solar Expert", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/cat_solar.png" },
    { name: "Tailoring", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/cat_tailor.png" },
    { name: "Home Services", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/HomeServicesicon.png" },
    { name: "Auto Services", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/AutoServices.png" },
    { name: "Beauty & Wellness", icon: "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/BeautyWellness.png" }
];

const catHtml = categoriesBar.map(c => `
    <div style="background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 20px; padding: 20px 15px; text-align: center; width: 130px; height: 130px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0,0,0,0.3); flex-shrink: 0;">
        <img src="${c.icon}" alt="${c.name}" style="width: 52px; height: 52px; object-fit: contain; margin-bottom: 8px;">
        <div style="font-size: 12px; color: #f8fafc; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${c.name}</div>
    </div>
`).join('');

function generateHtmlPage(city, subcategory, cityProviders) {
    const title = `Best ${subcategory} in ${city} | Verified Local Experts - RudraSpark`;
    const description = `Looking for trusted ${subcategory} in ${city}? Find top-rated verified local professionals with phone numbers, experience, and pricing on RudraSpark. Founded by Sandesh Koli. Download app now!`;
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.sandeshkoli.kaamwale";

    let providerCardsHtml = cityProviders.length > 0 ? cityProviders.map(p => `
        <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: space-between; border: 1px solid #e2e8f0; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: #e0f2fe; color: #1a73e8; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 22px; flex-shrink: 0;">🛠️</div>
                <div>
                    <h3 style="margin: 0 0 6px 0; color: #1e293b; font-size: 18px;">${p.businessName || p.name || 'Verified Professional'}</h3>
                    <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">📍 ${p.fullAddress || p.locality || p.city || city}</p>
                    <p style="margin: 0; color: #d97706; font-weight: bold; font-size: 13px;">⭐ ${p.rating ? Number(p.rating).toFixed(1) : '4.5'} / 5.0 Verified Expert</p>
                </div>
            </div>
            <a href="tel:${p.callNumber || p.whatsappNumber || ''}" style="background: #1a73e8; color: white; padding: 10px 22px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 14px;">📞 Call</a>
        </div>
    `).join('') : `<p style="color: #94a3b8; text-align: center; padding: 30px;">Explore all verified ${subcategory} experts in ${city} on the RudraSpark App!</p>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    ${GOOGLE_VERIFICATION}
    <link rel="canonical" href="${DOMAIN}/${city.toLowerCase()}-${subcategory.toLowerCase().replace(/\s+/g, '-')}.html">
    <style>
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 0; line-height: 1.6; }
        .navbar { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 20px; font-weight: 800; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px; }
        .logo span { color: #38bdf8; }
        .hero { max-width: 1200px; margin: 0 auto; padding: 50px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
        .hero-content { flex: 1; min-width: 300px; }
        .hero-image img { width: 380px; border-radius: 24px; box-shadow: 0 20px 50px rgba(26,115,232,0.3); }
        h1 { font-size: 38px; font-weight: 800; color: #fff; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .cta-banner { background: linear-gradient(135deg, #1a73e8, #0284c7); border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 15px 40px rgba(26,115,232,0.4); margin-top: 50px; }
        .btn { display: inline-block; background: #fff; color: #0f172a; padding: 16px 36px; border-radius: 30px; text-decoration: none; font-weight: bold; }
        .founder-badge { display: inline-flex; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 20px; margin-bottom: 20px; color: #cbd5e1; }
        .founder-badge strong { color: #38bdf8; margin-left: 6px; }
        .category-section { max-width: 1200px; margin: 60px auto; padding: 0 20px; text-align: center; }
        .category-scroll { display: flex; gap: 20px; overflow-x: auto; padding: 15px 5px; }
        footer { text-align: center; padding: 40px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 60px; }
    </style>
</head>
<body>
    <div class="navbar"><a href="/" style="color:#fff;text-decoration:none;font-weight:bold;">🛠️ RudraSpark</a><span>Founder: <strong>Sandesh Koli</strong></span></div>
    <div class="hero">
        <div class="hero-content">
            <div class="founder-badge">🚀 Vision & Leadership <strong>Sandesh Koli</strong></div>
            <h1>Top Verified <span>${subcategory}</span> in ${city}</h1>
            <p>Connect instantly with trusted local professionals verified by RudraSpark.</p>
            <a href="${playStoreUrl}" class="btn" style="background: #1a73e8; color: #fff;">📲 Download RudraSpark App</a>
        </div>
        <div class="hero-image"><img src="${RAW_IMAGE_URL}" alt="Sandesh Koli"></div>
    </div>
    <div class="container">
        <h2>Available ${subcategory} Professionals in ${city}</h2>
        <div>${providerCardsHtml}</div>
        <div class="cta-banner">
            <h2 style="margin: 0 0 10px 0; color: #fff; font-size: 26px;">Explore All 3.5 Lakh+ Experts on RudraSpark</h2>
            <p style="margin: 0 0 20px 0; color: #e0f2fe; font-size: 15px;">Data verified across 16+ states on RudraSpark.</p>
            <a href="${playStoreUrl}" class="btn">📲 Download RudraSpark App</a>
        </div>
    </div>
    <div class="category-section"><h3>Explore Popular Categories & Rentals</h3><div class="category-scroll">${catHtml}</div></div>
    <footer><p>&copy; ${new Date().getFullYear()} RudraSpark. Founded by <strong>Sandesh Koli</strong>. All rights reserved.</p></footer>
</body>
</html>`;
}

function buildStaticSeo() {
    console.log("🚀 Building Static Pre-rendered pSEO Landing Pages with Clean Cities...");

    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RudraSpark - India's Fastest Local Services & Rental Network</title>
    <meta name="description" content="Connect with 3.5 Lakh+ verified local professionals and rental providers across 16+ states. Founded by Sandesh Koli.">
    ${GOOGLE_VERIFICATION}
    <style>
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 0; line-height: 1.6; }
        .hero { max-width: 1200px; margin: 0 auto; padding: 60px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
        .hero-content { flex: 1; min-width: 300px; }
        .hero-image img { width: 420px; border-radius: 24px; box-shadow: 0 20px 50px rgba(26,115,232,0.3); }
        h1 { font-size: 42px; font-weight: 800; margin-bottom: 20px; color: #fff; }
        h1 span { color: #38bdf8; }
        p { font-size: 18px; color: #94a3b8; margin-bottom: 30px; }
        .btn { display: inline-block; background: #1a73e8; color: #fff; padding: 16px 36px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px; }
        .founder-badge { display: inline-flex; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 20px; margin-bottom: 20px; color: #cbd5e1; }
        .founder-badge strong { color: #38bdf8; margin-left: 6px; }
        .category-section { max-width: 1200px; margin: 60px auto; padding: 0 20px; text-align: center; }
        .category-scroll { display: flex; gap: 20px; overflow-x: auto; padding: 15px 5px; }
        footer { text-align: center; padding: 40px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 60px; }
    </style>
</head>
<body>
    <div class="hero">
        <div class="hero-content">
            <div class="founder-badge">🚀 Vision & Leadership <strong>Sandesh Koli</strong></div>
            <h1>India's Fastest <span>Local Services & Rental</span> Ecosystem</h1>
            <p>Connecting you instantly with over <strong>3.5 Lakh+ verified professionals</strong> across 16+ states.</p>
            <a href="https://play.google.com/store/apps/details?id=com.sandeshkoli.kaamwale" class="btn">📲 Download RudraSpark App</a>
        </div>
        <div class="hero-image"><img src="${RAW_IMAGE_URL}" alt="Sandesh Koli"></div>
    </div>
    <div class="category-section"><h3>Explore Popular Categories & Rentals</h3><div class="category-scroll">${catHtml}</div></div>
    <footer><p>&copy; ${new Date().getFullYear()} RudraSpark. Founded by <strong>Sandesh Koli</strong>. All rights reserved.</p></footer>
</body>
</html>`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);

    const grouped = {};
    allProviders.forEach(p => {
        const city = getCleanCity(p);
        const subcategory = p.subcategory || p.primaryCategoryId || "General Service";
        if (!city || !subcategory || city.toLowerCase() === 'local area') return;
        const key = `${city}_${subcategory}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (!grouped[key]) {
            grouped[key] = { city, subcategory, items: [] };
        }
        if (grouped[key].items.length < 15) {
            grouped[key].items.push(p);
        }
    });

    const sitemapUrls = [`<url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`];

    let count = 0;
    const keys = Object.keys(grouped).slice(0, 1500);
    keys.forEach(key => {
        const group = grouped[key];
        const fileName = `${key}.html`;
        const htmlContent = generateHtmlPage(group.city, group.subcategory, group.items);
        fs.writeFileSync(path.join(OUTPUT_DIR, fileName), htmlContent);
        sitemapUrls.push(`<url><loc>${DOMAIN}/${fileName}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
        count++;
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapContent);
    console.log(`\n🎉 Success! Pre-rendered ${count} clean static SEO landing pages and sitemap.xml!`);
}

buildStaticSeo();
