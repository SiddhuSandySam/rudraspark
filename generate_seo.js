const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'public');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Domain where this SEO site will be hosted for FREE (e.g., Vercel / Netlify)
const DOMAIN = "https://rudraspark-local.vercel.app";

// Example: Load your 3.5L providers from JSON or mock sample
// In production, you can read your master_registry.json or exported sheets JSON
const providers = [
    { businessName: "Sai Plumber Services", subcategory: "Plumber", city: "Pune", state: "Maharashtra", fullAddress: "MG Road, Camp, Pune", callNumber: "9876543210", rating: 4.8 },
    { businessName: "Electrician Expert Pune", subcategory: "Electrician", city: "Pune", state: "Maharashtra", fullAddress: "Deccan Gymkhana, Pune", callNumber: "9876543211", rating: 4.6 },
    { businessName: "Mumbai AC Repair Hub", subcategory: "AC Repair", city: "Mumbai", state: "Maharashtra", fullAddress: "Andheri West, Mumbai", callNumber: "9876543212", rating: 4.7 }
];

function generateHtmlPage(city, subcategory, cityProviders) {
    const title = `Best ${subcategory} in ${city} | Verified Local Experts - RudraSpark`;
    const description = `Looking for trusted ${subcategory} in ${city}? Find top-rated verified local professionals with phone numbers and ratings on RudraSpark. Download app now!`;
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.sandeshkoli.kaamwale";

    let providerCardsHtml = cityProviders.map(p => `
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between;">
            <div>
                <h3 style="margin: 0 0 5px 0; color: #1a73e8;">${p.businessName}</h3>
                <p style="margin: 0 0 5px 0; color: #555; font-size: 14px;">📍 ${p.fullAddress || p.city}</p>
                <p style="margin: 0; color: #e37400; font-weight: bold;">⭐ ${p.rating || '4.5'} / 5.0</p>
            </div>
            <a href="tel:${p.callNumber}" style="background: #1a73e8; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">📞 Call Now</a>
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
    <link rel="canonical" href="${DOMAIN}/${city.toLowerCase()}-${subcategory.toLowerCase().replace(/\s+/g, '-')}.html">
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "RudraSpark Local Services ${city}",
      "description": "${description}",
      "address": { "@type": "PostalAddress", "addressLocality": "${city}", "addressRegion": "Maharashtra", "addressCountry": "IN" }
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
        <p style="margin:10px 0 0 0; opacity:0.9;">Verified local experts in ${city}</p>
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

function buildProgrammaticSeo() {
    console.log("🚀 Generating Programmatic SEO Pages & Sitemap...");

    const grouped = {};
    providers.forEach(p => {
        if (!p.city || !p.subcategory) return;
        const key = `${p.city}_${p.subcategory}`.toLowerCase().replace(/\s+/g, '-');
        if (!grouped[key]) {
            grouped[key] = { city: p.city, subcategory: p.subcategory, items: [] };
        }
        grouped[key].items.push(p);
    });

    const sitemapUrls = [];
    sitemapUrls.push(`<url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`);

    Object.keys(grouped).forEach(key => {
        const group = grouped[key];
        const fileName = `${key}.html`;
        const htmlContent = generateHtmlPage(group.city, group.subcategory, group.items);

        fs.writeFileSync(path.join(OUTPUT_DIR, fileName), htmlContent);
        sitemapUrls.push(`<url><loc>${DOMAIN}/${fileName}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
        console.log(`   ✅ Generated: ${fileName}`);
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapContent);
    console.log(`\n🎉 Sitemap generated successfully with ${sitemapUrls.length} pages!`);
}

buildProgrammaticSeo();
