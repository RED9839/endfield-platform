import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web-static.hg-cdn.com",
      },
      {
        protocol: "https",
        hostname: "*.gryphline.com",
      },
      {
        protocol: "https",
        hostname: "*.hg-cdn.com",
      },
    ],
  },

  poweredByHeader: false,


  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.symlinks = false;
    return config;
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;