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
        hostname: "endfield.gryphline.com",
      },
      {
        protocol: "https",
        hostname: "www.gryphline.com",
      },
      {
        protocol: "https",
        hostname: "hg-cdn.com",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  poweredByHeader: false,
};

export default nextConfig;
