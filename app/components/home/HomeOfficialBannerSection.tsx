import HomeBannerHubPanel, { type HomeBannerItem } from "./HomeBannerHubPanel";

type HomeNoticeType = "notice" | "event" | "news";

type HomeNoticeItem = {
  title: string;
  date: string;
  type: HomeNoticeType;
  href: string;
  image: string;
};

type HomeApiResponse = {
  ok: boolean;
  source: string;
  fetchedAt: string;
  latest: HomeNoticeItem[];
  notice: HomeNoticeItem[];
  event: HomeNoticeItem[];
  news: HomeNoticeItem[];
  debug?: {
    articleCount: number;
    uniqueCount: number;
  };
  message?: string;
};

function isHomeApiResponse(data: unknown): data is HomeApiResponse {
  if (!data || typeof data !== "object") return false;
  const value = data as Partial<HomeApiResponse>;

  return (
    typeof value.ok === "boolean" &&
    Array.isArray(value.latest) &&
    Array.isArray(value.notice) &&
    Array.isArray(value.event) &&
    Array.isArray(value.news)
  );
}

function toIsoDate(dateText?: string) {
  if (!dateText) return undefined;
  const normalized = dateText.replace(/\./g, "-");
  const date = new Date(`${normalized}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function mapToBannerItems(data: HomeApiResponse): HomeBannerItem[] {
  const source = data.latest.length
    ? data.latest
    : [...data.event, ...data.notice, ...data.news];

  return source.slice(0, 10).map((item, index) => ({
    id: `${item.type}-${item.date}-${item.title}-${index}`,
    title: item.title,
    href: item.href || "",
    image: item.image,
    startAt: toIsoDate(item.date),
    kind: "event",
  }));
}

async function getBannerItems(): Promise<HomeBannerItem[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/home`, {
      next: { revalidate: 60 * 30 },
    });

    if (!res.ok) {
      return [];
    }

    const data: unknown = await res.json();

    if (!isHomeApiResponse(data) || !data.ok) {
      return [];
    }

    return mapToBannerItems(data);
  } catch {
    return [];
  }
}

export default async function HomeOfficialBannerSection() {
  const items = await getBannerItems();
  return <HomeBannerHubPanel items={items} />;
}