/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "api.bigvybz.com" }] },
};

export default nextConfig;
