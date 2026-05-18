export type XNotice = {
  id: string;
  title: string;
  image: string;
  href: string;
  publishedAt: string;
  type: "notice" | "event";
  endAt?: string;
};

export const xNotices: XNotice[] = [
  {
    id: "x-1",
    title: "엔드필드 공식 안내 (X)",
    image: "https://your-image-url.webp",
    href: "https://x.com/AKEndfieldKR",
    publishedAt: "2026-04-20",
    type: "notice",
  },
];