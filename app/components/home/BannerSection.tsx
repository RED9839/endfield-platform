"use client";

import { useEffect, useMemo, useState } from "react";
import HomeBannerHubPanel, {
  type HomeBannerItem,
} from "@/app/components/home/HomeBannerHubPanel";

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
};

export type HomeApiResponse = {
  ok: boolean;
  latest?: SimpleHomeItem[];
  notice?: SimpleHomeItem[];
  event?: SimpleHomeItem[];
  news?: SimpleHomeItem[];
  weaponStack?: WeaponStackItem[];
  message?: string;
};

const fallbackNewsUrl = "https://endfield.gryphline.com/ko-kr/news";

function normalizeBannerTitle(title: string) {
  return title.replace(/\s+/g, " ").replace(/[「」<>]/g, "").trim();
}

function normalizeBannerImage(image?: string) {
  if (!image?.trim()) return "";

  if (image.startsWith("/api/banners/image")) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/api/banners/image?url=${encodeURIComponent(image)}`;
}

function toIsoDate(date?: string) {
  if (!date) return undefined;

  const normalized = date.replace(/\./g, "-").trim();
  const parsed = new Date(`${normalized}T00:00:00+09:00`);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function toTime(date?: string) {
  if (!date) return 0;

  const normalized = date.replace(/\./g, "-").trim();
  const parsed = new Date(`${normalized}T00:00:00+09:00`);

  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
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

function classifyNormalKind(item: SimpleHomeItem): HomeBannerItem["kind"] {
  if (item.type === "notice") return "notice";
  if (item.type === "event") return "event";
  return "news";
}

function removeDuplicateItems(items: SimpleHomeItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = [
      normalizeBannerTitle(item.title ?? ""),
      item.date ?? "",
      item.type ?? "",
      item.href ?? "",
    ].join("|");

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function convertToHomeBanners(data: HomeApiResponse | null): HomeBannerItem[] {
  if (!data?.ok) return [];

  const merged = [
    ...(data.latest ?? []),
    ...(data.notice ?? []),
    ...(data.event ?? []),
    ...(data.news ?? []),
  ]
    .filter((item) => item.title?.trim() && item.image?.trim())
    .sort((a, b) => toTime(b.date) - toTime(a.date));

  const deduped = removeDuplicateItems(merged);

  const operatorBanners: HomeBannerItem[] = deduped
    .filter((item) => isOperatorPickupTitle(item.title ?? ""))
    .map(
      (item, index): HomeBannerItem => ({
        id: `operator-${normalizeBannerTitle(item.title ?? "")}-${index}`,
        title: item.title ?? "",
        href: item.href?.trim() || fallbackNewsUrl,
        image: normalizeBannerImage(item.image),
        kind: "operator",
        startAt: toIsoDate(item.date),
      }),
    )
    .filter((item) => Boolean(item.image));

  const weaponBanners: HomeBannerItem[] = (data.weaponStack ?? [])
    .slice()
    .sort((a, b) => a.stack - b.stack)
    .map(
      (item, index): HomeBannerItem => ({
        id: item.id || `weapon-${index}`,
        title: item.title,
        href: item.href?.trim() || fallbackNewsUrl,
        image: normalizeBannerImage(item.image),
        kind: "weapon",
      }),
    )
    .filter((item) => Boolean(item.image));

  const normalBanners: HomeBannerItem[] = deduped
    .filter((item) => {
      const title = item.title ?? "";

      return (
        !isOperatorPickupTitle(title) &&
        !isWeaponPickupTitle(title) &&
        !isVersionUpdateTitle(title)
      );
    })
    .map((item, index): HomeBannerItem => {
      const kind = classifyNormalKind(item);

      return {
        id: `${kind}-${normalizeBannerTitle(item.title ?? "")}-${index}`,
        title: item.title ?? "",
        href: item.href?.trim() || fallbackNewsUrl,
        image: normalizeBannerImage(item.image),
        kind,
        startAt: toIsoDate(item.date),
      };
    })
    .filter((item) => Boolean(item.image));

  const versionBanner: HomeBannerItem[] = deduped
    .filter((item) => isVersionUpdateTitle(item.title ?? ""))
    .slice(0, 1)
    .map(
      (item): HomeBannerItem => ({
        id: `version-${normalizeBannerTitle(item.title ?? "")}`,
        title: item.title ?? "",
        href: item.href?.trim() || fallbackNewsUrl,
        image: normalizeBannerImage(item.image),
        kind: "notice",
        startAt: toIsoDate(item.date),
      }),
    )
    .filter((item) => Boolean(item.image));

  return [
    ...operatorBanners,
    ...weaponBanners,
    ...normalBanners,
    ...versionBanner,
  ].slice(0, 10);
}

function BannerLoadingBox({ text }: { text: string }) {
  return (
    <div className="flex h-[360px] w-full items-center justify-center rounded-[24px] border border-yellow-500/15 bg-black px-6 text-center text-sm text-zinc-500">
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

export default function BannerSection({
  initialData,
}: {
  initialData: HomeApiResponse | null;
}) {
  const [homeData, setHomeData] = useState<HomeApiResponse | null>(initialData);
  const [homeError, setHomeError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response = await fetch("/api/home", { cache: "no-store" });
        const data = (await response.json()) as HomeApiResponse;

        if (!response.ok || !data?.ok) {
          throw new Error(data?.message || "홈 배너 데이터를 불러오지 못했습니다.");
        }

        if (!cancelled) {
          setHomeData(data);
          setHomeError("");
        }
      } catch (error) {
        if (!cancelled) {
          setHomeError(
            error instanceof Error
              ? error.message
              : "홈 배너 데이터를 불러오지 못했습니다.",
          );
        }
      }
    }

    const interval = window.setInterval(refresh, 1000 * 60 * 5);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const banners = useMemo(() => convertToHomeBanners(homeData), [homeData]);

  if (!homeData && !homeError) {
    return <BannerLoadingBox text="홈 배너를 불러오는 중입니다." />;
  }

  if (homeError) {
    return <BannerErrorBox text={homeError} />;
  }

  if (banners.length === 0) {
    return (
      <BannerErrorBox text="표시할 배너가 없습니다. /api/home 응답을 확인해 주세요." />
    );
  }

  return <HomeBannerHubPanel items={banners} />;
}
