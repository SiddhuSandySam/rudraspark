module.exports = (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    const txt = `User-agent: *
Allow: /
Sitemap: https://rudraspark.vercel.app/sitemap.xml`;
    return res.status(200).send(txt);
};
