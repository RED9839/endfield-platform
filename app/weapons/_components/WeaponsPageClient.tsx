"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useDeferredValue, useMemo, useState, type ReactNode } from "react";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const FILTER_BG = "#071019";

export type WeaponListItem = {
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
};

const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검",
  artsunit: "아츠 유닛",
  artsUnit: "아츠 유닛",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
};

const weaponTypeIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp",
  artsunit: "/icons/weapons/artsunit.webp",
  artsUnit: "/icons/weapons/artsunit.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
};

const weaponTypeOrderMap: Record<string, number> = {
  sword: 0,
  artsunit: 1,
  artsUnit: 1,
  greatsword: 2,
  polearm: 3,
  handcannon: 4,
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

const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
};

const rarityOptions = [6, 5, 4, 3];

const seriesOptions = [
  "고통",
  "골절",
  "기예",
  "방출",
  "분쇄",
  "사기",
  "어둠",
  "억제",
  "의료",
  "잔혹",
  "추격",
  "효율",
  "흐름",
  "강공",
];

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

function getWeaponType(weapon: WeaponListItem) {
  return weapon.weaponType ?? weapon.type ?? "";
}

function getWeaponTypeLabel(weapon: WeaponListItem) {
  const weaponType = getWeaponType(weapon);
  return weaponTypeLabelMap[weaponType] ?? weaponType ?? "-";
}

function getWeaponRarity(weapon: WeaponListItem) {
  return weapon.rarity ?? weapon.quality ?? 3;
}

function getWeaponImage(weapon: WeaponListItem) {
  return (
    weapon.image ??
    weapon.fullImage ??
    weapon.avatar ??
    `/weapons/${weapon.slug}.webp`
  );
}

function getRawSeriesText(weapon: WeaponListItem) {
  const candidates = [
    weapon.seriesSkill,
    weapon.series,
    weapon.weaponSeries,
    weapon.seriesName,
    weapon.skill,
    weapon.weaponSkill,
    weapon.passive,
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

  if (text.includes("고통") || lower.includes("pain")) return "고통";
  if (text.includes("골절") || lower.includes("fracture")) return "골절";
  if (
    text.includes("기예") ||
    text.includes("기교") ||
    lower.includes("technique")
  ) {
    return "기예";
  }
  if (text.includes("방출") || lower.includes("release")) return "방출";
  if (text.includes("분쇄") || lower.includes("crush")) return "분쇄";
  if (text.includes("사기") || lower.includes("morale")) return "사기";
  if (text.includes("어둠") || lower.includes("dark")) return "어둠";
  if (
    text.includes("억제") ||
    text.includes("제압") ||
    lower.includes("suppress")
  ) {
    return "억제";
  }
  if (
    text.includes("의료") ||
    text.includes("치유") ||
    lower.includes("medical") ||
    lower.includes("heal")
  ) {
    return "의료";
  }
  if (text.includes("잔혹") || lower.includes("brutality")) return "잔혹";
  if (text.includes("추격") || lower.includes("pursuit")) return "추격";
  if (text.includes("효율") || lower.includes("efficiency")) return "효율";
  if (text.includes("흐름") || lower.includes("flow")) return "흐름";
  if (
    text.includes("강공") ||
    lower.includes("heavystrike") ||
    lower.includes("heavy")
  ) {
    return "강공";
  }

  return "";
}

function getWeaponSeriesText(weapon: WeaponListItem) {
  return getSeriesShortName(getRawSeriesText(weapon));
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
      className="group flex h-[32px] items-center justify-center gap-1.5 rounded-lg border px-2.5 text-left text-[11px] font-bold transition hover:bg-[#101923] lg:h-[38px] lg:w-full lg:justify-start lg:gap-2 lg:rounded-xl lg:px-3 lg:text-[12px]"
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

      <span className="truncate leading-none">{label}</span>
    </button>
  );
}

function FilterGroup({
  title,
  children,
  last = false,
  grid = false,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
  grid?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-4 lg:mb-5"}>
      <h2
        className="mb-2 text-[11px] font-black tracking-[0.2em]"
        style={{ color: YELLOW_TEXT }}
      >
        {title}
      </h2>

      <div
        className={
          grid
            ? "grid grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-2 lg:grid-cols-1"
            : "flex flex-wrap gap-2 pb-1 lg:flex-col lg:flex-nowrap lg:pb-0"
        }
      >
        {children}
      </div>
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
      className="inline-flex h-[18px] shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-black px-1.5 text-[10px] font-black leading-none"
      style={{
        border: muted
          ? "1px solid rgba(255,255,255,0.24)"
          : `1px solid ${color}`,
        color: muted ? "#e5e7eb" : color,
      }}
    >
      {children}
    </span>
  );
}

function RarityChip({ rarity }: { rarity: number }) {
  const iconSrc = rarityIconMap[rarity];
  const color = rarityColorMap[rarity] ?? YELLOW_MAIN;

  return (
    <WeaponChip color={color}>
      {iconSrc ? (
        <span className="relative h-3.5 w-3.5 shrink-0">
          <Image
            src={iconSrc}
            alt={`${rarity}성`}
            fill
            sizes="14px"
            className="object-contain"
          />
        </span>
      ) : null}
      <span>{rarityLabelMap[rarity] ?? `${rarity}성`}</span>
    </WeaponChip>
  );
}

function WeaponTypeChip({ type }: { type: string }) {
  const iconSrc = weaponTypeIconMap[type];
  const label = weaponTypeLabelMap[type] ?? type;

  if (!iconSrc) return null;

  return (
    <WeaponChip muted>
      <span className="relative h-3.5 w-3.5 shrink-0">
        <Image src={iconSrc} alt={label} fill sizes="14px" className="object-contain" />
      </span>
      <span>{label}</span>
    </WeaponChip>
  );
}

const WeaponCard = memo(function WeaponCard({ weapon }: { weapon: WeaponListItem }) {
  const weaponRarity = getWeaponRarity(weapon);
  const weaponType = getWeaponType(weapon);
  const weaponSeriesText = getWeaponSeriesText(weapon);
  const weaponImage = getWeaponImage(weapon);

  return (
    <Link
      href={`/weapons/${weapon.slug}`}
      className="catalog-card group relative block overflow-hidden rounded-[16px] bg-black transition md:hover:-translate-y-1 sm:rounded-[18px]"
      style={{
        border: `1px solid ${YELLOW_BORDER}`,
        width: "100%",
        aspectRatio: "170 / 238",
      }}
    >
      <Image
        src={weaponImage}
        alt={weapon.name}
        fill
        sizes="(max-width: 640px) 46vw, 170px"
        className="object-cover object-center transition duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-3">
        <h3 className="line-clamp-2 text-[13px] font-black text-yellow-300 sm:text-[14px]">
          {weapon.name}
        </h3>

        <p className="mt-1 line-clamp-1 text-[10px] text-zinc-300">
          {weapon.enName}
        </p>

        <div className="mt-2 flex h-[18px] flex-nowrap gap-1 overflow-hidden">
          <RarityChip rarity={weaponRarity} />
          <WeaponTypeChip type={weaponType} />
          {weaponSeriesText ? <WeaponChip muted>{weaponSeriesText}</WeaponChip> : null}
        </div>
      </div>
    </Link>
  );
});

WeaponCard.displayName = "WeaponCard";

export default function WeaponsPageClient({
  weapons,
}: {
  weapons: WeaponListItem[];
}) {
  const [keyword, setKeyword] = useState("");
  const [weaponType, setWeaponType] = useState<string | "all">("all");
  const [rarity, setRarity] = useState<number | "all">("all");
  const [series, setSeries] = useState<string | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const deferredKeyword = useDeferredValue(keyword);
  const indexedWeapons = useMemo(
    () =>
      weapons
        .map((weapon) => {
          const currentWeaponType = getWeaponType(weapon);
          const weaponRarity = getWeaponRarity(weapon);
          const rawSeriesText = getRawSeriesText(weapon);
          const weaponSeriesText = getWeaponSeriesText(weapon);

          return {
            weapon,
            currentWeaponType,
            weaponRarity,
            rawSeriesText,
            weaponSeriesText,
            searchText: [
              weapon.name,
              weapon.enName ?? "",
              getWeaponTypeLabel(weapon),
              rawSeriesText,
              weaponSeriesText,
            ]
              .join(" ")
              .toLowerCase(),
          };
        })
        .sort((left, right) => {
          if (right.weaponRarity !== left.weaponRarity) {
            return right.weaponRarity - left.weaponRarity;
          }

          const leftTypeOrder = weaponTypeOrderMap[left.currentWeaponType] ?? 999;
          const rightTypeOrder = weaponTypeOrderMap[right.currentWeaponType] ?? 999;

          if (leftTypeOrder !== rightTypeOrder) {
            return leftTypeOrder - rightTypeOrder;
          }

          return left.weapon.name.localeCompare(right.weapon.name, "ko");
        }),
    [weapons],
  );

  const sortedWeapons = useMemo(() => {
    const normalizedKeyword = deferredKeyword.trim().toLowerCase();

    return indexedWeapons
      .filter(
        ({
          currentWeaponType,
          rawSeriesText,
          searchText,
          weaponRarity,
          weaponSeriesText,
        }) => {
          const matchesKeyword =
            normalizedKeyword === "" || searchText.includes(normalizedKeyword);

          return (
            matchesKeyword &&
            (weaponType === "all" || currentWeaponType === weaponType) &&
            (rarity === "all" || weaponRarity === rarity) &&
            (series === "all" ||
              rawSeriesText.includes(series) ||
              weaponSeriesText === series)
          );
        },
      )
      .map(({ weapon }) => weapon);
  }, [indexedWeapons, deferredKeyword, weaponType, rarity, series]);

  const activeFilterCount = [
    keyword.trim() ? 1 : 0,
    weaponType !== "all" ? 1 : 0,
    rarity !== "all" ? 1 : 0,
    series !== "all" ? 1 : 0,
  ].reduce((sum, value) => sum + value, 0);

  return (
    <main className="min-h-screen bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-3 rounded-[20px] bg-[#05070b] p-4 shadow-[0_0_30px_rgba(250,204,21,0.04)] sm:mb-5 sm:rounded-[24px] sm:p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold tracking-[0.28em] sm:text-[11px] sm:tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                엔드필드 지원 플랫폼
              </p>

              <h1
                className="mt-2 text-2xl font-black tracking-tight sm:text-4xl"
                style={{ color: YELLOW_TEXT }}
              >
                무기
              </h1>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">무기 목록</p>
            </div>

            <Link
              href="/"
              className="shrink-0 rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              홈으로
            </Link>
          </div>
        </header>

        <div className="grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5">
          <aside
            className="relative z-30 flex min-w-0 max-w-full self-start flex-col overflow-hidden rounded-[20px] bg-[#05070b] shadow-[0_0_30px_rgba(250,204,21,0.04)] lg:sticky lg:top-5 lg:h-[calc(100vh-40px)] lg:max-h-[calc(100vh-40px)] lg:rounded-[24px]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left lg:hidden"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <span className="min-w-0">
                <span
                  className="block text-[11px] font-black tracking-[0.2em]"
                  style={{ color: YELLOW_TEXT }}
                >
                  검색 / 필터
                </span>

                <span className="mt-1 block truncate text-xs text-zinc-500">
                  이름, 등급, 무기 유형, 시리즈 필터
                  {activeFilterCount > 0 ? ` · 적용 ${activeFilterCount}` : ""}
                </span>
              </span>

              <span
                className={[
                  "shrink-0 text-lg font-black text-yellow-300 transition-transform",
                  isFilterOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                ▼
              </span>
            </button>

            <div
              className={[
                "min-w-0 max-w-full overflow-hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col",
                isFilterOpen
                  ? "flex max-h-[70dvh] min-h-0 flex-1 flex-col"
                  : "hidden lg:flex",
              ].join(" ")}
            >
              <div
                className="min-w-0 shrink-0 bg-[#05070b] p-3 sm:p-4"
                style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                <h2
                  className="mb-2 text-[11px] font-black tracking-[0.2em]"
                  style={{ color: YELLOW_TEXT }}
                >
                  검색
                </h2>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                    ⌕
                  </span>

                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="이름 / 무기 유형 / 시리즈 검색"
                    className="h-10 w-full rounded-xl border border-white/20 bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400/50 sm:h-9"
                  />
                </div>
              </div>

              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-3 pr-2 sm:p-4 sm:pr-3">
                <FilterGroup title="등급">
                  <FilterButton active={rarity === "all"} label="전체" onClick={() => setRarity("all")} />

                  {rarityOptions.map((rarityOption) => (
                    <FilterButton
                      key={rarityOption}
                      active={rarity === rarityOption}
                      label={rarityLabelMap[rarityOption]}
                      iconSrc={rarityIconMap[rarityOption]}
                      colored
                      color={rarityColorMap[rarityOption]}
                      onClick={() => setRarity(rarityOption)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="무기 유형">
                  <FilterButton active={weaponType === "all"} label="전체" onClick={() => setWeaponType("all")} />
                  <FilterButton active={weaponType === "sword"} label="한손검" iconSrc={weaponTypeIconMap.sword} onClick={() => setWeaponType("sword")} />
                  <FilterButton active={weaponType === "artsunit"} label="아츠 유닛" iconSrc={weaponTypeIconMap.artsunit} onClick={() => setWeaponType("artsunit")} />
                  <FilterButton active={weaponType === "greatsword"} label="양손검" iconSrc={weaponTypeIconMap.greatsword} onClick={() => setWeaponType("greatsword")} />
                  <FilterButton active={weaponType === "polearm"} label="장병기" iconSrc={weaponTypeIconMap.polearm} onClick={() => setWeaponType("polearm")} />
                  <FilterButton active={weaponType === "handcannon"} label="권총" iconSrc={weaponTypeIconMap.handcannon} onClick={() => setWeaponType("handcannon")} />
                </FilterGroup>

                <FilterGroup title="시리즈" last grid>
                  <FilterButton active={series === "all"} label="전체" onClick={() => setSeries("all")} />

                  {seriesOptions.map((seriesOption) => (
                    <FilterButton
                      key={seriesOption}
                      active={series === seriesOption}
                      label={seriesOption}
                      onClick={() => setSeries(seriesOption)}
                    />
                  ))}
                </FilterGroup>
              </div>
            </div>
          </aside>

          <section
            className="min-w-0 rounded-[20px] bg-[#05070b] p-3 shadow-[0_0_30px_rgba(250,204,21,0.04)] lg:rounded-[24px]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="mb-3 flex items-center justify-between pb-3"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <p className="text-sm text-zinc-400">
                총{" "}
                <span className="font-black" style={{ color: YELLOW_TEXT }}>
                  {sortedWeapons.length}
                </span>
                개
              </p>
            </div>

            {sortedWeapons.length > 0 ? (
              <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,170px))] sm:justify-between sm:gap-3">
                {sortedWeapons.map((weapon) => (
                  <WeaponCard key={weapon.slug} weapon={weapon} />
                ))}
              </div>
            ) : (
              <div
                className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-black p-6 text-center text-sm text-zinc-500"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                등록된 무기 데이터가 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
