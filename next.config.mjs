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
};

export default nextConfig;
