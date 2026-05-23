"use client";

import { useMemo } from "react";
import HomeBannerHubPanel, {
  type HomeBannerItem,
} from "@/app/components/home/HomeBannerHubPanel";

type BannerSourceItem = {
  id?: string;
  title?: string;
  href?: string;
  type?: string;
  stack?: number;
  image?: string;
  detailImage?: string;
  bannerImage?: string;
  articleImage?: string;
  thumbnail?: string;
};

export type HomeApiResponse = {
  ok: boolean;
  latest?: BannerSourceItem[];
  notice?: BannerSourceItem[];
  event?: BannerSourceItem[];
  news?: BannerSourceItem[];
  weaponStack?: BannerSourceItem[];
};

function normalizeImage(url?: string) {
  const src = url?.trim();
  if (!src) return "";

  if (src.startsWith("/api/banners/image")) return src;
  if (src.startsWith("/")) return src;

  return `/api/banners/image?url=${encodeURIComponent(src)}`;
}

function pickBannerImage(item: BannerSourceItem) {
  return (
    item.thumbnail ||
    item.image ||
    item.detailImage ||
    item.bannerImage ||
    item.articleImage ||
    ""
  );
}

function normalizeTitle(title?: string) {
  return (title ?? "")
    .replace(/\s+/g, " ")
    .replace(/[「」<>]/g, "")
    .trim();
}

function dedupeSourceItems(items: BannerSourceItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const title = normalizeTitle(item.title);
    const image = pickBannerImage(item);
    const key = `${title}|${image}`;

    if (!title) return false;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function dedupeBannerItems(items: HomeBannerItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${normalizeTitle(item.title)}|${item.kind}|${item.image}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function isOperator(item: BannerSourceItem) {
  return item.title?.includes("헤드헌팅") ?? false;
}

function isWeapon(item: BannerSourceItem) {
  return item.title?.includes("신청") ?? false;
}

function isVersion(item: BannerSourceItem) {
  return item.title?.includes("버전 업데이트") ?? false;
}

function isExpiredWeapon(item: BannerSourceItem) {
  const title = normalizeTitle(item.title);

  if (typeof item.stack === "number" && item.stack >= 3) return true;

  // 2026년 5월 장방이 픽업 종료 이후에는 신아 신청이 3스택 밖으로 밀려야 하므로
  // 서버 캐시/파싱 실패로 fallback에 남아도 홈 배너에서는 강제로 제외한다.
  if (item.id === "sina" || title.includes("신아 신청")) return true;

  return false;
}

function hasValidImage(item: HomeBannerItem) {
  return Boolean(item.image?.trim());
}

function convert(data: HomeApiResponse | null): HomeBannerItem[] {
  if (!data?.ok) return [];

  const all = dedupeSourceItems([
    ...(data.latest ?? []),
    ...(data.notice ?? []),
    ...(data.event ?? []),
    ...(data.news ?? []),
  ]);

  const operator: HomeBannerItem[] = all
    .filter(isOperator)
    .map<HomeBannerItem>((item, idx) => ({
      id: item.id ?? `operator-${idx}`,
      title: item.title ?? "특별 허가 헤드헌팅",
      image: normalizeImage(pickBannerImage(item)),
      kind: "operator",
      href: item.href,
    }))
    .filter(hasValidImage);

  const weapon: HomeBannerItem[] = dedupeSourceItems(data.weaponStack ?? [])
    .filter((item) => !isExpiredWeapon(item))
    .map<HomeBannerItem>((item, idx) => ({
      id: item.id ?? `weapon-${idx}`,
      title: item.title ?? "무기 신청",
      image: normalizeImage(pickBannerImage(item)),
      kind: "weapon",
      href: item.href,
    }))
    .filter(hasValidImage);

  const event: HomeBannerItem[] = all
    .filter(
      (item) =>
        item.type === "event" &&
        !isOperator(item) &&
        !isWeapon(item) &&
        !isVersion(item),
    )
    .map<HomeBannerItem>((item, idx) => ({
      id: item.id ?? `event-${idx}`,
      title: item.title ?? "이벤트",
      image: normalizeImage(pickBannerImage(item)),
      kind: "event",
      href: item.href,
    }))
    .filter(hasValidImage);

  const notice: HomeBannerItem[] = all
    .filter(
      (item) =>
        item.type !== "event" &&
        !isOperator(item) &&
        !isWeapon(item) &&
        !isVersion(item),
    )
    .map<HomeBannerItem>((item, idx) => ({
      id: item.id ?? `notice-${idx}`,
      title: item.title ?? "공지",
      image: normalizeImage(pickBannerImage(item)),
      kind: "notice",
      href: item.href,
    }))
    .filter(hasValidImage);

  const version: HomeBannerItem[] = all
    .filter(isVersion)
    .slice(0, 1)
    .map<HomeBannerItem>((item) => ({
      id: item.id ?? "version-update",
      title: item.title ?? "버전 업데이트 설명",
      image: normalizeImage(pickBannerImage(item)),
      kind: "version",
      href: item.href,
      isExternalLinkEnabled: true,
    }))
    .filter(hasValidImage);

  return dedupeBannerItems([
    ...operator.slice(0, 2),
    ...weapon.slice(0, 3),
    ...event.slice(0, 3),
    ...notice.slice(0, 3),
    ...version,
  ]);
}

export default function BannerSection({
  initialData,
}: {
  initialData: HomeApiResponse | null;
}) {
  const items = useMemo(() => convert(initialData), [initialData]);

  return (
    <div className="h-full min-h-0 w-full overflow-hidden">
      <HomeBannerHubPanel items={items} />
    </div>
  );
}
