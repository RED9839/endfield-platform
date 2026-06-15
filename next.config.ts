import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 코드에서 실제로 쓰는 quality 값들을 허용(미선언 시 기본 [75]만 허용되어 경고/미적용).
    qualities: [68, 70, 75, 78, 100],
    minimumCacheTTL: 60 * 60 * 24 * 7,
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
