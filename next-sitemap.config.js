/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://bigvybz.com",
    generateRobotsTxt: true,
    additionalPaths: async () => {
        const response = await fetch(`http://localhost:3001/api/woocommerce/products`);
        const products = await response.json();
      if (!products || !Array.isArray(products)) {
        return [];
      }
      return products.map((product) => ({
        loc: `/product/${product.id}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.8,
      }));
    },
  };