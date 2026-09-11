const fs = require('fs');
const path = require('path');

const RAW_IMAGE_URL = "https://raw.githubusercontent.com/SiddhuSandySam/kaamwaleasset/main/Sandeshkoli.png";
const GOOGLE_VERIFICATION = '<meta name="google-site-verification" content="ueLjOKjISiD5rlHrSK510SAvXnyHheDauLQ_6yvlLW8" />';
const DOMAIN = "https://rudraspark.vercel.app";
const JSDELIVR_BASE = "https://cdn.jsdelivr.net/gh/SiddhuSandySam/kaamwale-data@main";

const ALL_STATES_SLUGS = [
    "andhra_pradesh", "arunachal_pradesh", "assam", "bihar", "chhattisgarh",
    "goa", "gujarat", "haryana", "himachal_pradesh", "jharkhand", "karnataka",
    "kerala", "madhya_pradesh", "maharashtra", "manipur", "meghalaya", "mizoram",
    "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamil_nadu",
    "telangana", "tripura", "uttar_pradesh", "uttarakhand", "west_bengal",
    "andaman_and_nicobar_islands", "chandigarh", "dadra_and_nagar_haveli_and_daman_and_diu",
    "delhi", "jammu_and_kashmir", "ladakh", "lakshadweep", "puducherry",
    "pondicherry", "daman_and_diu"
];

const STATE_FOLDERS = ALL_STATES_SLUGS.flatMap(slug => [
    `${slug}_grids`,
    `${slug}_cities`,
    `${slug}_districts`
]);

// In-memory cache for warm serverless function instances
const cdnCache = new Map();

// 🚀 LOAD LOCAL LIGHTWEIGHT PROVIDERS JSON (7,382 verified pros)
const registryPath = path.join(__dirname, '..', 'providers.json');
let allProviders = [];
try {
    if (fs.existsSync(registryPath)) {
        const regData = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        allProviders = Array.isArray(regData) ? regData : Object.values(regData);
    }
} catch (e) {}

async function getProvidersForCity(city, subcategory) {
    const cityLower = city.toLowerCase();
    const subLower = subcategory.toLowerCase();

    // Candidate city filenames (e.g. pune, navi_mumbai, navi-mumbai, navimumbai)
    const cityVariants = [...new Set([
        cityLower.replace(/-/g, '_'),
        cityLower.replace(/_/g, '-'),
        cityLower,
        cityLower.replace(/[-_]/g, '')
    ])];

    let cdnProviders = [];

    // 1. Fetch from jsDelivr CDN FIRST (kaamwale-data repository with full ~3.56 lakh dataset)
    for (const folder of STATE_FOLDERS) {
        for (const variant of cityVariants) {
            const cdnUrl = `${JSDELIVR_BASE}/${folder}/${variant}.json`;
            try {
                let data;
                if (cdnCache.has(cdnUrl)) {
                    data = cdnCache.get(cdnUrl);
                } else {
                    const res = await fetch(cdnUrl, { headers: { 'Accept': 'application/json' } });
                    if (res.ok) {
                        data = await res.json();
                        if (Array.isArray(data)) {
                            cdnCache.set(cdnUrl, data);
                        }
                    }
                }

                if (Array.isArray(data) && data.length > 0) {
                    cdnProviders = data;
                    break;
                }
            } catch (e) {
                // Continue checking next variant or state grid folder
            }
        }
        if (cdnProviders.length > 0) break;
    }

    if (cdnProviders.length > 0) {
        // Filter by subcategory/category if available, otherwise return all city pros without limits
        const filtered = cdnProviders.filter(p => {
            const pSub = (p.subcategory || p.primaryCategoryId || p.category || "").toLowerCase();
            return pSub.includes(subLower);
        });
        return filtered.length > 0 ? filtered : cdnProviders;
    }

    // 2. Fallback to local bundled providers if CDN search returns empty
    let matched = allProviders.filter(p => {
        const pCity = (p.city || p.locality || "").toLowerCase();
        const pSub = (p.subcategory || p.primaryCategoryId || "").toLowerCase();
        const pAddr = (p.fullAddress || "").toLowerCase();
        return (pCity.includes(cityLower) || pAddr.includes(cityLower)) && pSub.includes(subLower);
    });

    return matched;
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

function renderHomePage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RudraSpark - India's Fastest Local Services & Rental Network</title>
    <meta name="description" content="Connect with 3.5 Lakh+ verified local professionals and rental providers across 16+ states. Founded by Sandesh Koli.">
    ${GOOGLE_VERIFICATION}
    <link rel="canonical" href="${DOMAIN}/">
    <style>
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 0; line-height: 1.6; }
        .hero { max-width: 1200px; margin: 0 auto; padding: 60px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
        .hero-content { flex: 1; min-width: 300px; }
        .hero-image { flex: 1; min-width: 300px; text-align: center; }
        .hero-image img { max-width: 100%; width: 420px; border-radius: 24px; box-shadow: 0 20px 50px rgba(26,115,232,0.3); border: 2px solid rgba(26,115,232,0.4); }
        h1 { font-size: 42px; font-weight: 800; margin-bottom: 20px; color: #fff; }
        h1 span { color: #38bdf8; }
        p { font-size: 18px; color: #94a3b8; margin-bottom: 30px; }
        .btn { display: inline-block; background: #1a73e8; color: #fff; padding: 16px 36px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 10px 25px rgba(26,115,232,0.4); }
        .founder-badge { display: inline-flex; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; font-size: 14px; color: #cbd5e1; }
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
    <div class="category-section">
        <h3>Explore Popular Categories & Rentals</h3>
        <div class="category-scroll">${catHtml}</div>
    </div>
    <footer><p>&copy; ${new Date().getFullYear()} RudraSpark. Founded by <strong>Sandesh Koli</strong>. All rights reserved.</p></footer>
</body>
</html>`;
}

module.exports = async (req, res) => {
    const urlPath = req.url.split('?')[0];

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

    if (urlPath === '/sitemap.xml' || urlPath === '/sitemap') {
        const sitemapHandler = require('./sitemap.js');
        return sitemapHandler(req, res);
    }

    if (urlPath === '/' || urlPath === '/index.html') {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(renderHomePage());
    }

    const cleanPath = urlPath.replace('.html', '').replace('/', '');
    const parts = cleanPath.split('-');

    if (parts.length >= 2 && !/^\d/.test(parts[0])) {
        const city = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const subcategory = parts.slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase());

        const matched = await getProvidersForCity(city, subcategory);

        let providerCardsHtml = matched.length > 0 ? matched.map(p => `
            <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: space-between; border: 1px solid #e2e8f0; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
                    ${p.profilePhotoUrl ? `<img src="${p.profilePhotoUrl}" alt="${p.businessName || 'Provider'}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #1a73e8; flex-shrink: 0;">` : `<div style="width: 60px; height: 60px; border-radius: 50%; background: #e0f2fe; color: #1a73e8; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 22px; flex-shrink: 0;">🛠️</div>`}
                    <div>
                        <h3 style="margin: 0 0 6px 0; color: #1e293b; font-size: 18px;">${p.businessName || p.name || 'Verified Professional'}</h3>
                        <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">📍 ${p.fullAddress || p.locality || p.city || city}</p>
                        <div style="display: flex; gap: 12px; font-size: 13px; color: #475569; font-weight: 600; flex-wrap: wrap;">
                            <span style="color: #d97706;">⭐ ${p.rating ? Number(p.rating).toFixed(1) : '4.5'} / 5.0</span>
                            ${p.experienceYears ? `<span>🏆 ${p.experienceYears} Yrs Exp</span>` : ''}
                            ${p.startingPrice ? `<span>💰 ₹${p.startingPrice} ${p.priceUnit || ''}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; flex-shrink: 0;">
                    <a href="tel:${p.callNumber || p.whatsappNumber || ''}" style="background: #1a73e8; color: white; padding: 10px 22px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 14px; text-align: center;">📞 Call</a>
                    ${p.whatsappNumber ? `<a href="https://wa.me/91${String(p.whatsappNumber).replace(/[^0-9]/g, '')}" target="_blank" style="background: #25d366; color: white; padding: 8px 22px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 13px; text-align: center;">💬 WhatsApp</a>` : ''}
                </div>
            </div>
        `).join('') : `<p style="color: #94a3b8; text-align: center; padding: 30px;">Explore all verified ${subcategory} experts in ${city} on the RudraSpark App!</p>`;

        const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Best ${subcategory} in ${city} | Verified Local Experts - RudraSpark</title>
    <meta name="description" content="Find trusted ${subcategory} in ${city} on RudraSpark. Founded by Sandesh Koli.">
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
        .hero-image { flex: 1; min-width: 300px; text-align: center; }
        .hero-image img { max-width: 100%; width: 380px; border-radius: 24px; box-shadow: 0 20px 50px rgba(26,115,232,0.3); border: 2px solid rgba(26,115,232,0.4); }
        h1 { font-size: 38px; font-weight: 800; margin-bottom: 20px; color: #fff; letter-spacing: -1px; }
        h1 span { color: #38bdf8; }
        p { font-size: 16px; color: #94a3b8; margin-bottom: 25px; }
        .stats { display: flex; gap: 20px; margin-bottom: 30px; }
        .stat-item h3 { font-size: 24px; color: #f8fafc; margin: 0; font-weight: 800; }
        .stat-item p { font-size: 13px; margin: 0; color: #64748b; }
        .stat-item { background: rgba(255,255,255,0.03); padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .cta-banner { background: linear-gradient(135deg, #1a73e8, #0284c7); border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 15px 40px rgba(26,115,232,0.4); margin-top: 50px; }
        .btn { display: inline-block; background: #fff; color: #0f172a; padding: 16px 36px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px; }
        .founder-badge { display: inline-flex; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; font-size: 14px; color: #cbd5e1; }
        .founder-badge strong { color: #38bdf8; margin-left: 6px; }
        .category-section { max-width: 1200px; margin: 60px auto 40px auto; padding: 0 20px; text-align: center; }
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
            <div class="stats">
                <div class="stat-item"><h3>3.5L+</h3><p>Verified Pros</p></div>
                <div class="stat-item"><h3>16+</h3><p>States</p></div>
                <div class="stat-item"><h3>100%</h3><p>Direct Connect</p></div>
            </div>
            <a href="https://play.google.com/store/apps/details?id=com.sandeshkoli.kaamwale" class="btn" style="background: #1a73e8; color: #fff;">📲 Download RudraSpark App</a>
        </div>
        <div class="hero-image"><img src="${RAW_IMAGE_URL}" alt="Sandesh Koli"></div>
    </div>
    <div class="container">
        <h2>Available ${subcategory} Professionals in ${city}</h2>
        <div>${providerCardsHtml}</div>
        <div class="cta-banner">
            <h2 style="margin: 0 0 10px 0; color: #fff; font-size: 26px;">Explore All 3.5 Lakh+ Experts on RudraSpark</h2>
            <p style="margin: 0 0 20px 0; color: #e0f2fe; font-size: 15px;">Data verified across 16+ states on RudraSpark.</p>
            <a href="https://play.google.com/store/apps/details?id=com.sandeshkoli.kaamwale" class="btn">📲 Download RudraSpark App</a>
        </div>
    </div>
    <div class="category-section"><h3>Explore Popular Categories & Rentals</h3><div class="category-scroll">${catHtml}</div></div>
    <footer><p>&copy; ${new Date().getFullYear()} RudraSpark. Founded by <strong>Sandesh Koli</strong>. All rights reserved.</p></footer>
</body>
</html>`;
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(pageHtml);
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(renderHomePage());
};

