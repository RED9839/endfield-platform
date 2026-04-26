"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import HeroPanel from "@/app/components/home/HeroPanel";
import QuickAccessPanel, {
  type QuickAccessItem,
} from "@/app/components/home/QuickAccessPanel";
import OperatorHighlightPanel from "@/app/components/home/OperatorHighlightPanel";
import HomeBannerHubPanel, {
  type HomeBannerItem,
} from "@/app/components/home/HomeBannerHubPanel";
import { getOperatorDetailByName } from "@/data/operators-detail-data";

type HomeNoticeType = "notice" | "event" | "news";

type SimpleHomeItem = {
  title?: string;
  date?: string;
  type?: HomeNoticeType;
  href?: string;
  image?: string;
};

type WeaponStackItem = {
  id: string;
  title: string;
  stack: number;
  image: string;
  href: string;
  publishedAt?: string;
  createdAt?: string;
};

type HomeApiResponse = {
  ok: boolean;
  latest?: SimpleHomeItem[];
  notice?: SimpleHomeItem[];
  event?: SimpleHomeItem[];
  news?: SimpleHomeItem[];
  weaponStack?: WeaponStackItem[];
  message?: string;
};

const defaultFeaturedOperatorName = "장방이";
const fallbackNewsUrl = "https://endfield.gryphline.com/ko-kr/news";

const navigationItems = [
  { label: "오퍼레이터", href: "/operators" },
  { label: "무기", href: "/weapons" },
  { label: "장비", href: "/gear" },
  { label: "재료", href: "/materials" },
  { label: "성장 시뮬레이션", href: "/simulator" },
  { label: "재화 파밍 계산기", href: "/farming" },
];

const quickAccessItems: QuickAccessItem[] = [
  {
    label: "오퍼레이터",
    href: "/operators",
    description: "오퍼레이터 목록과 상세 데이터를 탐색합니다.",
  },
  {
    label: "무기",
    href: "/weapons",
    description: "무기 데이터와 시리즈 스킬을 확인합니다.",
  },
  {
    label: "장비",
    href: "/gear",
    description: "장비 및 세트 데이터를 확인합니다.",
  },
  {
    label: "재료",
    href: "/materials",
    description: "재료와 성장 자원 구조를 정리합니다.",
  },
  {
    label: "성장 시뮬레이션",
    href: "/simulator",
    description: "오퍼레이터와 무기의 성장 재화를 계산합니다.",
  },
  {
    label: "재화 파밍 계산기",
    href: "/farming",
    description: "부족 재화를 기준으로 추천 파밍 경로를 계산합니다.",
  },
];

function SideNav() {
  return (
    <aside className="sticky top-0 flex h-screen flex-col border-r border-yellow-500/15 bg-black px-5 py-6">
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.35em] text-yellow-500/70">
          엔드필드
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-wide text-white">
          데이터 허브
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          오퍼레이터, 무기, 장비, 재료, 시뮬레이션을 한곳에서 확인하는 메인 화면
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group rounded-xl border border-yellow-500/10 bg-[#05070b] px-4 py-3 text-sm tracking-wide text-zinc-300 transition hover:border-yellow-500/30 hover:bg-[#0b1018] hover:text-white"
          >
            <span className="flex items-center justify-between">
              {item.label}
              <span className="text-xs text-zinc-600 transition group-hover:text-yellow-400">
                →
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function SectionFrame({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-yellow-500/12 bg-[#05070b] p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,204,21,0.03),transparent_20%)]" />
      <div className="relative">
        <div className="mb-4 border-b border-yellow-500/12 pb-3">
          <h2 className="text-base font-semibold tracking-wide text-white">
            {title}
          </h2>
          {subTitle ? (
            <p className="mt-1 text-sm text-zinc-500">{subTitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function normalizeBannerTitle(title: string) {
  return title.replace(/\s+/g, " ").replace(/[「」<>]/g, "").trim();
}

function normalizeBannerImage(image?: string) {
  if (!image || !image.trim()) return "";
  return `/api/banners/image?url=${encodeURIComponent(image)}`;
}

function toIsoDate(date?: string) {
  if (!date) return undefined;
  const normalized = date.replace(/\./g, "-");
  const d = new Date(`${normalized}T00:00:00+09:00`);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function toTime(date?: string) {
  if (!date) return 0;
  const normalized = date.replace(/\./g, "-");
  const d = new Date(`${normalized}T00:00:00+09:00`);
  if (Number.isNaN(d.getTime())) return 0;
  return d.getTime();
}

function isValidSimpleItem(item: SimpleHomeItem) {
  return !!item.title && !!item.image;
}

function isOperatorPickupTitle(title: string) {
  return title.includes("특별 허가 헤드헌팅");
}

function isWeaponPickupTitle(title: string) {
  return (
    title.includes("신청") &&
    (title.includes("판매 설명") || title.includes("기간 한정"))
  );
}

function isVersionUpdateTitle(title: string) {
  return title.includes("버전 업데이트 설명");
}

function classifyNormalKind(item: SimpleHomeItem): "notice" | "event" | "news" {
  if (item.type === "notice") return "notice";
  if (item.type === "event") return "event";
  return "news";
}

function guessOperatorNameFromTitle(title: string) {
  if (title.includes("장방이")) return "장방이";
  if (title.includes("로시")) return "로시";
  if (title.includes("샤이닝")) return "샤이닝";
  if (title.includes("라스트 라이트")) return "라스트 라이트";
  return defaultFeaturedOperatorName;
}

function dedupeSimpleItems(items: SimpleHomeItem[]) {
  const seen = new Set<string>();
  const result: SimpleHomeItem[] = [];

  for (const item of items) {
    if (!isValidSimpleItem(item)) continue;
    const key = `${normalizeBannerTitle(item.title!)}-${item.date ?? ""}-${item.type ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

function sortSimpleItems(items: SimpleHomeItem[]) {
  return [...items].sort((a, b) => toTime(b.date) - toTime(a.date));
}

function mapWeaponStackToBanners(
  weaponStack: WeaponStackItem[] | undefined
): HomeBannerItem[] {
  if (!Array.isArray(weaponStack)) return [];

  const result: HomeBannerItem[] = [];
  const sorted = [...weaponStack].sort((a, b) => a.stack - b.stack);

  for (let index = 0; index < sorted.length; index += 1) {
    const item = sorted[index];
    const image = normalizeBannerImage(item.image);
    if (!image) continue;

    result.push({
      id: item.id || `weapon-${index}`,
      title: item.title,
      href: item.href?.trim() ? item.href : fallbackNewsUrl,
      image,
      kind: "weapon",
    });
  }

  return result;
}

function mapOperatorPickups(items: SimpleHomeItem[]): HomeBannerItem[] {
  const result: HomeBannerItem[] = [];
  const filtered = items.filter((item) =>
    isOperatorPickupTitle(item.title ?? "")
  );

  for (let index = 0; index < filtered.length; index += 1) {
    const item = filtered[index];
    if (!item.title) continue;

    const image = normalizeBannerImage(item.image);
    if (!image) continue;

    const banner: HomeBannerItem = {
      id: `operator-${normalizeBannerTitle(item.title)}-${index}`,
      title: item.title,
      href: item.href?.trim() ? item.href : fallbackNewsUrl,
      image,
      kind: "operator",
    };

    const startAt = toIsoDate(item.date);
    if (startAt) banner.startAt = startAt;

    result.push(banner);
  }

  return result;
}

function mapKindBanners(
  items: SimpleHomeItem[],
  kind: "event" | "notice" | "news"
): HomeBannerItem[] {
  const result: HomeBannerItem[] = [];

  const filtered = items.filter((item) => {
    const title = item.title ?? "";
    if (!title) return false;
    if (isOperatorPickupTitle(title)) return false;
    if (isWeaponPickupTitle(title)) return false;
    if (isVersionUpdateTitle(title)) return false;
    return classifyNormalKind(item) === kind;
  });

  for (let index = 0; index < filtered.length; index += 1) {
    const item = filtered[index];
    if (!item.title) continue;

    const image = normalizeBannerImage(item.image);
    if (!image) continue;

    const banner: HomeBannerItem = {
      id: `${kind}-${normalizeBannerTitle(item.title)}-${index}`,
      title: item.title,
      href: item.href?.trim() ? item.href : fallbackNewsUrl,
      image,
      kind,
    };

    const startAt = toIsoDate(item.date);
    if (startAt) banner.startAt = startAt;

    result.push(banner);
  }

  return result;
}

function mapVersionBanner(items: SimpleHomeItem[]): HomeBannerItem[] {
  const versionItem = items.find((item) =>
    isVersionUpdateTitle(item.title ?? "")
  );

  if (!versionItem?.title) return [];

  const image = normalizeBannerImage(versionItem.image);
  if (!image) return [];

  const banner: HomeBannerItem = {
    id: `version-${normalizeBannerTitle(versionItem.title)}`,
    title: versionItem.title,
    href: versionItem.href?.trim() ? versionItem.href : fallbackNewsUrl,
    image,
    kind: "notice",
  };

  const startAt = toIsoDate(versionItem.date);
  if (startAt) banner.startAt = startAt;

  return [banner];
}

function convertToHomeBanners(data: HomeApiResponse | null): HomeBannerItem[] {
  if (!data?.ok) return [];

  const latest = Array.isArray(data.latest) ? data.latest : [];
  const notice = Array.isArray(data.notice) ? data.notice : [];
  const event = Array.isArray(data.event) ? data.event : [];
  const news = Array.isArray(data.news) ? data.news : [];

  const merged = dedupeSimpleItems(
    sortSimpleItems([...latest, ...notice, ...event, ...news])
  );

  const operatorBanners = mapOperatorPickups(merged);
  const weaponBanners = mapWeaponStackToBanners(data.weaponStack);
  const eventBanners = mapKindBanners(merged, "event");
  const noticeBanners = mapKindBanners(merged, "notice");
  const newsBanners = mapKindBanners(merged, "news");
  const versionBanner = mapVersionBanner(merged);

  return [
    ...operatorBanners,
    ...weaponBanners,
    ...eventBanners,
    ...noticeBanners,
    ...newsBanners,
    ...versionBanner,
  ].slice(0, 10);
}

function resolveFeaturedOperatorName(data: HomeApiResponse | null) {
  const merged = [
    ...(Array.isArray(data?.latest) ? data.latest : []),
    ...(Array.isArray(data?.notice) ? data.notice : []),
    ...(Array.isArray(data?.event) ? data.event : []),
    ...(Array.isArray(data?.news) ? data.news : []),
  ];

  const pickup = merged.find(
    (item) =>
      typeof item?.title === "string" && item.title.includes("헤드헌팅")
  );

  if (pickup?.title) {
    return guessOperatorNameFromTitle(pickup.title);
  }

  return defaultFeaturedOperatorName;
}

function BannerLoadingBox({ text }: { text: string }) {
  return (
    <div className="flex h-[360px] w-full items-center justify-center rounded-[24px] border border-yellow-500/15 bg-black text-sm text-zinc-500">
      {text}
    </div>
  );
}

function BannerErrorBox({ text }: { text: string }) {
  return (
    <div className="flex h-[360px] w-full items-center justify-center rounded-[24px] border border-red-500/20 bg-red-500/10 px-6 text-center text-sm text-red-200">
      {text}
    </div>
  );
}

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomeApiResponse | null>(null);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState("");
  const [featuredOperatorName, setFeaturedOperatorName] = useState(
    defaultFeaturedOperatorName
  );

  useEffect(() => {
    let cancelled = false;

    async function loadHome() {
      try {
        setHomeLoading(true);
        setHomeError("");

        const response = await fetch("/api/home", {
          cache: "no-store",
        });

        const data = (await response.json()) as HomeApiResponse;

        if (!response.ok || !data?.ok) {
          throw new Error(
            data?.message || "홈 배너 데이터를 불러오지 못했습니다."
          );
        }

        if (cancelled) return;

        setHomeData(data);
        setFeaturedOperatorName(resolveFeaturedOperatorName(data));
      } catch (error) {
        if (cancelled) return;

        setHomeData(null);
        setFeaturedOperatorName(defaultFeaturedOperatorName);
        setHomeError(
          error instanceof Error
            ? error.message
            : "홈 배너 데이터를 불러오지 못했습니다."
        );
      } finally {
        if (!cancelled) {
          setHomeLoading(false);
        }
      }
    }

    void loadHome();

    const interval = window.setInterval(() => {
      void loadHome();
    }, 1000 * 60 * 5);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const banners = useMemo(() => convertToHomeBanners(homeData), [homeData]);

  const featuredOperator =
    getOperatorDetailByName(featuredOperatorName) ??
    getOperatorDetailByName(defaultFeaturedOperatorName) ??
    getOperatorDetailByName("라스트 라이트") ??
    getOperatorDetailByName("lastrite");

  const heroFeaturedData = useMemo(() => {
    if (featuredOperator) {
      return {
        name: featuredOperator.name,
        enName: featuredOperator.enName ?? featuredOperator.slug,
        slug: featuredOperator.slug,
        href: `/operators/${featuredOperator.slug}`,
        heroImage: `/operators/${featuredOperator.slug}/full.webp`,
      };
    }

    return {
      name: "라스트 라이트",
      enName: "LASTRITE",
      slug: "lastrite",
      href: "/operators/lastrite",
      heroImage: "/operators/lastrite/full.webp",
    };
  }, [featuredOperator]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto grid max-w-[1820px] grid-cols-[260px_minmax(0,1fr)] gap-6 px-4 py-6 md:px-6">
        <SideNav />

        <section className="min-w-0">
          <div className="flex flex-col gap-6">
            <HeroPanel featured={heroFeaturedData} />

            <SectionFrame
              title="이벤트 / 픽업"
              subTitle="픽업오퍼레이터 → 무기 → 이벤트 → 공지 → 뉴스 → 버전 업데이트 설명 순으로 표시합니다."
            >
              {homeLoading ? (
                <BannerLoadingBox text="홈 배너를 불러오는 중입니다." />
              ) : homeError ? (
                <BannerErrorBox text={homeError} />
              ) : banners.length === 0 ? (
                <BannerErrorBox text="표시할 배너가 없습니다. /api/home 응답을 확인해 주세요." />
              ) : (
                <HomeBannerHubPanel items={banners} />
              )}
            </SectionFrame>

            <SectionFrame title="빠른 이동">
              <QuickAccessPanel items={quickAccessItems} compact />
            </SectionFrame>

            <OperatorHighlightPanel
              operator={featuredOperator ?? null}
              title="추천 오퍼레이터"
              description="현재 픽업과 함께 확인하면 좋은 오퍼레이터 정보를 빠르게 확인할 수 있습니다."
              href="/operators"
            />
          </div>
        </section>
      </div>
    </main>
  );
}