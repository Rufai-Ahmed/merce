/** @type {import('next-sitemap').IConfig} */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

module.exports = {
  siteUrl: "https://bigvybz.com",
  generateRobotsTxt: true,
  additionalPaths: async () => {
    const response = await fetch(`${baseUrl}/api/woocommerce/wc/v3/products`);
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
