/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ara.directus.app",
        pathname: "/assets/**",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
  optimizeFonts: false, // disable automatic font optimization
};

export default nextConfig;
