# 🚀 RudraSpark Programmatic SEO Engine

This folder contains a standalone Node.js engine to generate thousands of SEO-optimized static landing pages (e.g., `pune-plumber.html`, `mumbai-electrician.html`) and an automated `sitemap.xml` for Google Search Console.

## 🛠️ How to Run
1. Install dependencies (none required, pure Node.js `fs` and `path`):
   ```bash
   node generate_seo.js
   ```
2. This will generate all HTML files and `sitemap.xml` inside the `public/` directory.

## ☁️ How to Host for FREE on Vercel / Netlify
1. Initialize a separate git repository for this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial SEO engine commit"
   ```
2. Push this to a new GitHub repository (e.g., `rudraspark-seo`).
3. Import the repository into **Vercel** or **Netlify**:
   - Output directory: `public`
   - Build command: `node generate_seo.js`
4. Connect your custom domain or use the free Vercel domain (`https://rudraspark-local.vercel.app`).
5. Submit your sitemap URL (`https://rudraspark-local.vercel.app/sitemap.xml`) in **Google Search Console** once!
