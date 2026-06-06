import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
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

  poweredByHeader: false,
};

export default nextConfig;
