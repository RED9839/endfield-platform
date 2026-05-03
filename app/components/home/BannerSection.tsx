"use client";

import { useEffect, useMemo, useState } from "react";
import HomeBannerHubPanel, {
  type HomeBannerItem,
} from "@/app/components/home/HomeBannerHubPanel";

type BannerSourceItem = {
  id?: string;
  title?: string;
  href?: string;
  type?: string;
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
    .map((item, idx) => ({
      id: item.id ?? `op-${idx}`,
      title: item.title ?? "특별 허가 헤드헌팅",
      image: normalizeImage(pickBannerImage(item)),
      kind: "operator" as const,
      href: item.href,
    }))
    .filter(hasValidImage);

  const weapon: HomeBannerItem[] = dedupeSourceItems(data.weaponStack ?? [])
    .map((item, idx) => ({
      id: item.id ?? `wp-${idx}`,
      title: item.title ?? "무기 신청",
      image: normalizeImage(pickBannerImage(item)),
      kind: "weapon" as const,
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
    .map((item, idx) => ({
      id: item.id ?? `ev-${idx}`,
      title: item.title ?? "이벤트",
      image: normalizeImage(pickBannerImage(item)),
      kind: "event" as const,
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
    .map((item, idx) => ({
      id: item.id ?? `nt-${idx}`,
      title: item.title ?? "공지",
      image: normalizeImage(pickBannerImage(item)),
      kind: "notice" as const,
      href: item.href,
    }))
    .filter(hasValidImage);

  const version: HomeBannerItem[] = all
    .filter(isVersion)
    .slice(0, 1)
    .map((item) => ({
      id: item.id ?? "version",
      title: item.title ?? "버전 업데이트 설명",
      image: normalizeImage(pickBannerImage(item)),
      kind: "version" as const,
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
  const [data, setData] = useState<HomeApiResponse | null>(initialData);

  useEffect(() => {
    fetch("/api/home", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: HomeApiResponse) => setData(json))
      .catch(() => {});
  }, []);

  const items = useMemo(() => convert(data), [data]);

  return <HomeBannerHubPanel items={items} />;
}