const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'public');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Domain where this SEO site will be hosted for FREE (e.g., Vercel / Netlify)
const DOMAIN = "https://rudraspark-seo-engine.vercel.app";
const GOOGLE_VERIFICATION = '<meta name="google-site-verification" content="ueLjOKjISiD5rlHrSK510SAvXnyHheDauLQ_6yvlLW8" />';

// 🚀 DYNAMIC DATA LOADERS: Read actual scraped data from project workspace
const mainDataPath = path.join(__dirname, '..', 'index', 'static_api', 'hub_data.json');
const registryPath = path.join(__dirname, '..', 'index', 'static_api', 'master_registry.json');

let allProviders = [];

try {
    if (fs.existsSync(registryPath)) {
        const regData = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        allProviders = Array.isArray(regData) ? regData : Object.values(regData);
        console.log(`✅ Loaded ${allProviders.length} real providers from Master Registry for Dynamic SEO.`);
    }
} catch (e) {
    console.warn("⚠️ Could not load master_registry.json, falling back to sample data.");
}

// Fallback if no local files found
if (allProviders.length === 0) {
    allProviders = [
        { businessName: "Sai Plumber Services", subcategory: "Plumber", city: "Pune", state: "Maharashtra", fullAddress: "MG Road, Camp, Pune", callNumber: "9876543210", rating: 4.8 },
        { businessName: "Electrician Expert Pune", subcategory: "Electrician", city: "Pune", state: "Maharashtra", fullAddress: "Deccan Gymkhana, Pune", callNumber: "9876543211", rating: 4.6 }
    ];
}

function generateHtmlPage(city, subcategory, cityProviders) {
    const title = `Best ${subcategory} in ${city} | Verified Local Experts - RudraSpark`;
    const description = `Looking for trusted ${subcategory} in ${city}? Find top-rated verified local professionals with phone numbers and ratings on RudraSpark. Download app now!`;
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.sandeshkoli.kaamwale";

    let providerCardsHtml = cityProviders.map(p => `
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between;">
            <div>
                <h3 style="margin: 0 0 5px 0; color: #1a73e8;">${p.businessName || p.name || 'Verified Professional'}</h3>
                <p style="margin: 0 0 5px 0; color: #555; font-size: 14px;">📍 ${p.fullAddress || p.addr || city}</p>
                <p style="margin: 0; color: #e37400; font-weight: bold;">⭐ ${p.rating || '4.5'} / 5.0</p>
            </div>
            <a href="tel:${p.callNumber || p.phone || ''}" style="background: #1a73e8; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">📞 Call Now</a>
        </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    ${GOOGLE_VERIFICATION}
    <link rel="canonical" href="${DOMAIN}/${city.toLowerCase()}-${subcategory.toLowerCase().replace(/\s+/g, '-')}.html">
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "RudraSpark ${subcategory} in ${city}",
      "description": "${description}",
      "address": { "@type": "PostalAddress", "addressLocality": "${city}", "addressRegion": "India", "addressCountry": "IN" }
    }
    </script>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #f8f9fd; margin: 0; padding: 0; color: #333; }
        .header { background: #1a73e8; color: white; padding: 40px 20px; text-align: center; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .cta-banner { background: white; border-radius: 16px; padding: 30px; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.08); margin-top: 30px; }
        .btn { display: inline-block; background: #000; color: #fff; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin:0;">🛠️ RudraSpark Local Services</h1>
        <p style="margin:10px 0 0 0; opacity:0.9;">Verified ${subcategory} experts in ${city}</p>
    </div>
    <div class="container">
        <h2>Top Verified ${subcategory} in ${city}</h2>
        <p>Explore trusted local professionals and connect instantly.</p>
        <div style="margin-top: 20px;">
            ${providerCardsHtml}
        </div>
        <div class="cta-banner">
            <h2>Download RudraSpark App</h2>
            <p>Get instant access to all 3.5 Lakh+ verified professionals across India.</p>
            <a href="${playStoreUrl}" class="btn">📲 Download on Google Play</a>
        </div>
    </div>
</body>
</html>`;
}

function buildDynamicSeo() {
    console.log("🚀 Building Fully Dynamic Programmatic SEO Engine for all States, Cities & Subcategories...");

    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RudraSpark - Local Services & Rentals</title>
    <meta name="description" content="Find verified local service providers and rentals across India. Download the RudraSpark app now!">
    ${GOOGLE_VERIFICATION}
    <style>
        body { font-family: system-ui, sans-serif; background: #f8f9fd; margin: 0; padding: 40px; text-align: center; color: #333; }
        .card { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin-top: 50px; }
        h1 { color: #1a73e8; }
        .btn { display: inline-block; background: #000; color: #fff; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🛠️ RudraSpark Local Services</h1>
        <p>Connecting you with 3.5 Lakh+ verified local professionals and rental providers across India.</p>
        <a href="https://play.google.com/store/apps/details?id=com.sandeshkoli.kaamwale" class="btn">📲 Download App on Google Play</a>
    </div>
</body>
</html>`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);

    const grouped = {};
    allProviders.forEach(p => {
        const city = p.city || p.locality || "India";
        const subcategory = p.subcategory || p.primaryCategoryId || "General Service";
        const key = `${city}_${subcategory}`.toLowerCase().replace(/[^a-z0-9]/g, '-');

        if (!grouped[key]) {
            grouped[key] = { city, subcategory, items: [] };
        }
        if (grouped[key].items.length < 20) {
            grouped[key].items.push(p);
        }
    });

    const sitemapUrls = [];
    sitemapUrls.push(`<url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`);

    let count = 0;
    Object.keys(grouped).forEach(key => {
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
    console.log(`\n🎉 Success! Generated index.html, ${count} dynamic SEO landing pages and sitemap.xml!`);
}

buildDynamicSeo();
