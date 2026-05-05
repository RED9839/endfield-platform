"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { weaponDetails } from "@/data/weapons-detail-data";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const FILTER_BG = "#071019";

type WeaponLike = {
  slug: string;
  name: string;
  enName?: string;
  image?: string;
  fullImage?: string;
  avatar?: string;
  type?: string;
  weaponType?: string;
  rarity?: number;
  quality?: number;
  series?: unknown;
  seriesName?: unknown;
  seriesSkill?: unknown;
  weaponSeries?: unknown;
  skill?: unknown;
  weaponSkill?: unknown;
  passive?: unknown;
  attribute?: {
    key?: string;
    label?: string;
    name?: string;
  };
};

const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
  artsUnit: "아츠 유닛",
};

const weaponTypeIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
  artsunit: "/icons/weapons/artsunit.webp",
  artsUnit: "/icons/weapons/artsunit.webp",
};

const rarityColorMap: Record<number, string> = {
  6: "#ff8a1f",
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
};

const rarityLabelMap: Record<number, string> = {
  6: "6성",
  5: "5성",
  4: "4성",
  3: "3성",
};

const rarityOptions = [6, 5, 4, 3];

function readText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const candidates = [
      obj.label,
      obj.name,
      obj.title,
      obj.key,
      obj.enName,
      obj.description,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return "";
}

function getWeaponType(item: WeaponLike) {
  return item.type ?? item.weaponType ?? "";
}

function getWeaponTypeLabel(item: WeaponLike) {
  const type = getWeaponType(item);
  return weaponTypeLabelMap[type] ?? type ?? "-";
}

function getWeaponRarity(item: WeaponLike) {
  return item.rarity ?? item.quality ?? 3;
}

function getWeaponImage(item: WeaponLike) {
  return item.image ?? item.fullImage ?? item.avatar ?? "";
}

function getRawSeriesText(item: WeaponLike) {
  const candidates = [
    item.seriesSkill,
    item.series,
    item.weaponSeries,
    item.seriesName,
    item.skill,
    item.weaponSkill,
    item.passive,
  ];

  for (const candidate of candidates) {
    const text = readText(candidate);
    if (text) return text;
  }

  return "";
}

function getSeriesShortName(text: string) {
  if (!text) return "";

  const lower = text.toLowerCase();

  if (text.includes("강공") || lower.includes("heavystrike") || lower.includes("heavy")) return "강공";
  if (text.includes("제압") || lower.includes("suppression")) return "제압";
  if (text.includes("추격") || lower.includes("pursuit")) return "추격";
  if (text.includes("분쇄") || lower.includes("crush")) return "분쇄";
  if (text.includes("사기") || lower.includes("morale")) return "사기";
  if (text.includes("기교") || lower.includes("technique")) return "기교";
  if (text.includes("잔혹") || lower.includes("brutality")) return "잔혹";
  if (text.includes("고통") || lower.includes("pain")) return "고통";
  if (text.includes("어둠") || lower.includes("dark")) return "어둠";

  return text.slice(0, 2);
}

function getWeaponSeriesText(item: WeaponLike) {
  return getSeriesShortName(getRawSeriesText(item));
}

function getWeaponAttributeText(item: WeaponLike) {
  return item.attribute?.label ?? item.attribute?.name ?? "";
}

function FilterButton({
  active,
  label,
  onClick,
  iconSrc,
  color = YELLOW_MAIN,
  colored = false,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  iconSrc?: string;
  color?: string;
  colored?: boolean;
}) {
  const pointColor = colored ? color : YELLOW_MAIN;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-[38px] w-full items-center gap-2 rounded-xl border px-3 text-left text-[12px] font-bold transition hover:bg-[#101923]"
      style={{
        borderColor: active
          ? pointColor
          : colored
            ? `${pointColor}88`
            : "rgba(255, 204, 77, 0.18)",
        background: active ? `${pointColor}22` : FILTER_BG,
        color: active ? "#ffffff" : "#d4d4d8",
      }}
    >
      {iconSrc ? (
        <span className="relative h-3.5 w-3.5 shrink-0">
          <Image src={iconSrc} alt="" fill sizes="14px" className="object-contain" />
        </span>
      ) : (
        <span
          className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[9px]"
          style={{ color: pointColor }}
        >
          ◆
        </span>
      )}

      <span className="min-w-0 flex-1 truncate leading-none">{label}</span>
    </button>
  );
}

function FilterGroup({
  title,
  children,
  last = false,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-5"}>
      <h2 className="mb-2 text-[11px] font-black tracking-[0.2em]" style={{ color: YELLOW_TEXT }}>
        {title}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function WeaponChip({
  children,
  color = YELLOW_MAIN,
  muted = false,
}: {
  children: ReactNode;
  color?: string;
  muted?: boolean;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-black px-1.5 py-[1px] text-[10px] font-black leading-4"
      style={{
        border: muted ? "1px solid rgba(255,255,255,0.24)" : `1px solid ${color}`,
        color: muted ? "#e5e7eb" : color,
      }}
    >
      {children}
    </span>
  );
}

function WeaponTypeChip({ type }: { type: string }) {
  const iconSrc = weaponTypeIconMap[type];
  const label = weaponTypeLabelMap[type] ?? type;

  if (!iconSrc) return null;

  return (
    <WeaponChip muted>
      <span className="relative h-3.5 w-3.5 shrink-0">
        <Image
          src={iconSrc}
          alt=""
          fill
          sizes="14px"
          className="object-contain brightness-0 invert"
        />
      </span>
      <span>{label}</span>
    </WeaponChip>
  );
}

function WeaponCard({ item }: { item: WeaponLike }) {
  const rarity = getWeaponRarity(item);
  const rarityColor = rarityColorMap[rarity] ?? YELLOW_MAIN;
  const image = getWeaponImage(item);
  const type = getWeaponType(item);
  const seriesText = getWeaponSeriesText(item);
  const attributeText = getWeaponAttributeText(item);

  return (
    <Link
      href={`/weapons/${item.slug}`}
      className="group relative block h-[244px] overflow-hidden rounded-[18px] border bg-black transition hover:-translate-y-1 hover:border-yellow-400/35"
      style={{ borderColor: YELLOW_BORDER_SOFT }}
    >
      {image ? (
        <Image
          src={image}
          alt={item.name}
          fill
          sizes="(max-width: 1840px) 12.5vw, 180px"
          className="object-cover object-center transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[#071019]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-3">
        <h3 className="line-clamp-2 text-[14px] font-black" style={{ color: YELLOW_TEXT }}>
          {item.name}
        </h3>

        {item.enName ? (
          <p className="mt-1 line-clamp-1 text-[10px] text-zinc-300">
            {item.enName}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-1.5 overflow-hidden">
          <WeaponChip color={rarityColor}>
            {rarityLabelMap[rarity] ?? `${rarity}성`}
          </WeaponChip>

          <WeaponTypeChip type={type} />

          {seriesText ? <WeaponChip muted>{seriesText}</WeaponChip> : null}
          {attributeText ? <WeaponChip muted>{attributeText}</WeaponChip> : null}
        </div>
      </div>
    </Link>
  );
}

export default function WeaponsPage() {
  const [keyword, setKeyword] = useState("");
  const [rarity, setRarity] = useState<number | "all">("all");
  const [weaponType, setWeaponType] = useState<string | "all">("all");
  const [series, setSeries] = useState<string | "all">("all");

  const items = weaponDetails as unknown as WeaponLike[];

  const weaponTypeOptions = useMemo(() => {
    return Array.from(new Set(items.map((item) => getWeaponType(item)).filter(Boolean)));
  }, [items]);

  const seriesOptions = useMemo(() => {
    return Array.from(new Set(items.map((item) => getWeaponSeriesText(item)).filter(Boolean)));
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const type = getWeaponType(item);
      const rarityValue = getWeaponRarity(item);
      const typeLabel = getWeaponTypeLabel(item);
      const seriesText = getWeaponSeriesText(item);
      const rawSeriesText = getRawSeriesText(item);
      const attributeText = getWeaponAttributeText(item);

      const matchesKeyword =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        (item.enName ?? "").toLowerCase().includes(q) ||
        type.toLowerCase().includes(q) ||
        typeLabel.toLowerCase().includes(q) ||
        seriesText.toLowerCase().includes(q) ||
        rawSeriesText.toLowerCase().includes(q) ||
        attributeText.toLowerCase().includes(q);

      const matchesRarity = rarity === "all" || rarityValue === rarity;
      const matchesType = weaponType === "all" || type === weaponType;
      const matchesSeries = series === "all" || seriesText === series;

      return matchesKeyword && matchesRarity && matchesType && matchesSeries;
    });
  }, [items, keyword, rarity, weaponType, series]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const rarityDiff = getWeaponRarity(b) - getWeaponRarity(a);
      if (rarityDiff !== 0) return rarityDiff;

      const typeCompare = getWeaponTypeLabel(a).localeCompare(getWeaponTypeLabel(b), "ko");
      if (typeCompare !== 0) return typeCompare;

      const seriesCompare = getWeaponSeriesText(a).localeCompare(getWeaponSeriesText(b), "ko");
      if (seriesCompare !== 0) return seriesCompare;

      return a.name.localeCompare(b.name, "ko");
    });
  }, [filteredItems]);

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-5 text-white md:px-6">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-5 rounded-[24px] bg-[#05070b] p-5 shadow-[0_0_30px_rgba(250,204,21,0.04)]"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.35em]" style={{ color: YELLOW_TEXT }}>
                ENDFIELD SUPPORT PLATFORM
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight" style={{ color: YELLOW_MAIN }}>
                WEAPON
              </h1>

              <p className="mt-1 text-sm text-zinc-500">Weapon List</p>
            </div>

            <Link
              href="/"
              className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018]"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              홈으로
            </Link>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside
            className="sticky top-5 flex max-h-[calc(100vh-40px)] flex-col overflow-hidden rounded-[24px] bg-[#05070b] shadow-[0_0_30px_rgba(250,204,21,0.04)]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div className="shrink-0 border-b bg-[#05070b] p-4" style={{ borderColor: YELLOW_BORDER_SOFT }}>
              <h2 className="mb-2 text-[11px] font-black tracking-[0.2em]" style={{ color: YELLOW_TEXT }}>
                검색
              </h2>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  ⌕
                </span>
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="이름 / 타입 / 시리즈 검색"
                  className="h-9 w-full rounded-xl border bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500"
                  style={{ borderColor: "rgba(255,255,255,0.20)" }}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <FilterGroup title="레어도">
                <FilterButton active={rarity === "all"} label="전체" onClick={() => setRarity("all")} />

                {rarityOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={rarity === value}
                    label={rarityLabelMap[value] ?? `${value}성`}
                    colored
                    color={rarityColorMap[value]}
                    onClick={() => setRarity(value)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="무기 타입">
                <FilterButton active={weaponType === "all"} label="전체" onClick={() => setWeaponType("all")} />

                {weaponTypeOptions.map((type) => (
                  <FilterButton
                    key={type}
                    active={weaponType === type}
                    label={weaponTypeLabelMap[type] ?? type}
                    iconSrc={weaponTypeIconMap[type]}
                    onClick={() => setWeaponType(type)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="시리즈" last>
                <FilterButton active={series === "all"} label="전체" onClick={() => setSeries("all")} />

                {seriesOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={series === value}
                    label={value}
                    onClick={() => setSeries(value)}
                  />
                ))}
              </FilterGroup>
            </div>
          </aside>

          <section
            className="min-w-0 rounded-[24px] bg-[#05070b] p-3 shadow-[0_0_30px_rgba(250,204,21,0.04)]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div className="mb-3 flex items-center justify-between border-b pb-3" style={{ borderColor: YELLOW_BORDER_SOFT }}>
              <p className="text-sm text-zinc-400">
                총{" "}
                <span className="font-black" style={{ color: YELLOW_TEXT }}>
                  {sortedItems.length}
                </span>
                개
              </p>
            </div>

            {sortedItems.length > 0 ? (
              <div className="grid grid-cols-8 gap-3 overflow-hidden">
                {sortedItems.map((item) => (
                  <WeaponCard key={item.slug} item={item} />
                ))}
              </div>
            ) : (
              <div
                className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-black p-6 text-center text-sm text-zinc-500"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                등록된 Weapon 데이터가 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}