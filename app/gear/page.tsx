"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { gearDetails } from "@/data/gear-detail-data";
import type {
  GearAbilityKey,
  GearAttributeKey,
  GearCategory,
  GearDetail,
  GearLevel,
  GearQuality,
  GearSetName,
} from "@/data/gear-types";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const FILTER_BG = "#071019";

const categoryLabelMap: Record<GearCategory, string> = {
  armor: "방어구",
  gloves: "보호 장갑",
  kit: "부품",
};

const categoryOrderMap: Record<GearCategory, number> = {
  armor: 0,
  gloves: 1,
  kit: 2,
};

const qualityColorMap: Record<GearQuality, string> = {
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
  2: "#84cc16",
  1: "#9ca3af",
};

const qualityLabelMap: Record<GearQuality, string> = {
  5: "노란색 품질",
  4: "보라색 품질",
  3: "파란색 품질",
  2: "초록색 품질",
  1: "회색 품질",
};

const categoryIconMap: Record<GearCategory, string> = {
  armor: "/icons/Gear/armor.webp",
  gloves: "/icons/Gear/gloves.webp",
  kit: "/icons/Gear/kit.webp",
};

const abilityIconMap: Record<GearAbilityKey, string> = {
  strength: "/icons/stats/strength.webp",
  agility: "/icons/stats/agility.webp",
  intelligence: "/icons/stats/intelligence.webp",
  will: "/icons/stats/will.webp",
};

const setTypeOptions: GearSetName[] = [
  "개척",
  "응룡 50식",
  "본 크러셔",
  "조류의 물결",
  "청파",
  "M. I. 경찰용",
  "식양의 흐름",
  "열 작업용",
  "생체 보조",
  "검술사",
  "경량 초자연",
  "펄스식",
  "식양의 숨결",
  "순행 전달자",
  "아부레이의 메아리",
  "중장갑 전달자",
  "재앙 방호",
  "침식 방호",
  "침식 차단",
  "통합 중량형 모델",
  "통합 경량형 모델",
  "세트 없음",
];

const levelOptions: GearLevel[] = [70, 50, 36, 28, 20, 10];

const abilityOptions: Array<{ key: GearAbilityKey; label: string }> = [
  { key: "strength", label: "힘" },
  { key: "agility", label: "민첩" },
  { key: "intelligence", label: "지능" },
  { key: "will", label: "의지" },
];

const attributeOptions: Array<{ key: GearAttributeKey; label: string }> = [
  { key: "attack", label: "공격력" },
  { key: "hp", label: "생명력" },
  { key: "critRate", label: "치명타 확률" },
  { key: "originiumArts", label: "오리지늄 아츠 강도" },
  { key: "healEfficiency", label: "치유 효율 보너스" },
  { key: "physicalDamage", label: "물리 피해 보너스" },
  { key: "ultimateEfficiency", label: "궁극기 충전 효율" },
  { key: "normalAttack", label: "일반 공격 피해 보너스" },
  { key: "skillDamage", label: "배틀 스킬 피해 보너스" },
  { key: "comboSkillDamage", label: "연계 스킬 피해 보너스" },
  { key: "ultimateDamage", label: "궁극기 피해 보너스" },
  { key: "unbalancedTargetDamage", label: "불균형 목표 피해 보너스" },
  { key: "mainStat", label: "주요 능력치" },
  { key: "artsDamage", label: "아츠 피해 보너스" },
  { key: "cryoElectricDamage", label: "냉기·전기 피해 보너스" },
  { key: "damageReduction", label: "모든 피해 감소" },
  { key: "subStat", label: "보조 능력치" },
  { key: "allSkillDamage", label: "모든 스킬 피해 보너스" },
  { key: "heatNatureDamage", label: "열기·자연 피해 보너스" },
];

function toggleAbilityFilter(
  current: GearAbilityKey[],
  nextAbility: GearAbilityKey,
  limit = 2,
) {
  if (current.includes(nextAbility)) {
    return current.filter((ability) => ability !== nextAbility);
  }

  return [...current, nextAbility].slice(-limit);
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
      className="group flex h-[36px] min-w-0 items-center justify-start gap-2 rounded-xl border px-2.5 text-left text-[11px] font-bold transition hover:bg-[#101923] lg:h-[38px] lg:w-full lg:px-3 lg:text-[12px]"
      style={{
        borderColor: active
          ? pointColor
          : colored
            ? `${pointColor}88`
            : "rgba(255, 196, 74, 0.18)",
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
            ? "grid grid-cols-[repeat(auto-fit,minmax(92px,1fr))] gap-2 lg:grid-cols-1"
            : "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible lg:pb-0"
        }
      >
        {children}
      </div>
    </div>
  );
}

function GearChip({
  children,
  color,
  muted = false,
}: {
  children: ReactNode;
  color?: string;
  muted?: boolean;
}) {
  const chipColor = color ?? YELLOW_MAIN;

  return (
    <span
      className="inline-flex h-[20px] max-w-full shrink-0 items-center gap-1 overflow-hidden whitespace-nowrap rounded-md bg-black px-2 text-[11px] font-black leading-none"
      style={{
        border: muted
          ? "1px solid rgba(255,255,255,0.24)"
          : `1px solid ${chipColor}`,
        color: muted ? "#e5e7eb" : chipColor,
      }}
    >
      {children}
    </span>
  );
}

function GearIconOnlyChip({
  iconSrc,
  label,
}: {
  iconSrc: string;
  label: string;
}) {
  return (
    <span
      className="inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-md bg-black"
      style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
      title={label}
    >
      <span className="relative h-4 w-4 shrink-0">
        <Image src={iconSrc} alt={label} fill sizes="16px" className="object-contain" />
      </span>
    </span>
  );
}

function GearCategoryLevelChip({ gear }: { gear: GearDetail }) {
  const qualityColor = qualityColorMap[gear.quality];

  return (
    <GearChip color={qualityColor}>
      <span className="relative h-4 w-4 shrink-0">
        <Image
          src={categoryIconMap[gear.category]}
          alt={categoryLabelMap[gear.category]}
          fill
          sizes="16px"
          className="object-contain"
        />
      </span>

      <span className="opacity-70">·</span>
      <span>레벨 {gear.level}</span>
    </GearChip>
  );
}

function GearCard({ gear }: { gear: GearDetail }) {
  return (
    <Link
      href={`/gear/${gear.slug}`}
      className="group relative block overflow-hidden rounded-[16px] bg-black transition hover:-translate-y-1 hover:border-yellow-400/35 sm:rounded-[18px]"
      style={{
        border: `1px solid ${YELLOW_BORDER}`,
        width: "100%",
        aspectRatio: "170 / 244",
      }}
    >
      <Image
        src={gear.image}
        alt={gear.name}
        fill
        sizes="(max-width: 640px) 46vw, 180px"
        className="object-cover object-center transition duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-3">
        <h3 className="line-clamp-2 text-[13px] font-black text-yellow-300 sm:text-[14px]">
          {gear.name}
        </h3>

        <p className="mt-1 line-clamp-1 text-[10px] text-zinc-300">{gear.enName}</p>

        <div className="mt-2 flex flex-col gap-1 overflow-hidden">
          <div className="flex h-[20px] flex-nowrap items-center gap-1 overflow-hidden">
            <GearCategoryLevelChip gear={gear} />

            {gear.abilityTypes.map((abilityType) => {
              const abilityOption = abilityOptions.find(
                (option) => option.key === abilityType,
              );
              const iconSrc = abilityIconMap[abilityType];

              return abilityOption && iconSrc ? (
                <GearIconOnlyChip
                  key={abilityType}
                  iconSrc={iconSrc}
                  label={abilityOption.label}
                />
              ) : null;
            })}
          </div>

          <div className="flex h-[20px] items-center overflow-hidden">
            <GearChip color={YELLOW_MAIN}>
              <span className="truncate">{gear.attribute?.label ?? "속성"}</span>
            </GearChip>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function GearPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<GearCategory | "all">("all");
  const [setName, setSetName] = useState<GearSetName | "all">("all");
  const [attributeFilter, setAttributeFilter] =
    useState<GearAttributeKey | "all">("all");
  const [abilityFilters, setAbilityFilters] = useState<GearAbilityKey[]>([]);
  const [quality, setQuality] = useState<GearQuality | "all">("all");
  const [level, setLevel] = useState<GearLevel | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredGears = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return gearDetails.filter((gear) => {
      const matchesKeyword =
        normalizedKeyword === "" ||
        gear.name.toLowerCase().includes(normalizedKeyword) ||
        gear.enName.toLowerCase().includes(normalizedKeyword) ||
        gear.setName.toLowerCase().includes(normalizedKeyword);

      const matchesCategory = category === "all" || gear.category === category;
      const matchesSet = setName === "all" || gear.setName === setName;
      const matchesAttribute =
        attributeFilter === "all" || gear.attributeTypes.includes(attributeFilter);
      const matchesAbility =
        abilityFilters.length === 0 ||
        abilityFilters.every((abilityFilter) =>
          gear.abilityTypes.includes(abilityFilter),
        );
      const matchesQuality = quality === "all" || gear.quality === quality;
      const matchesLevel = level === "all" || gear.level === level;

      return (
        matchesKeyword &&
        matchesCategory &&
        matchesSet &&
        matchesAttribute &&
        matchesAbility &&
        matchesQuality &&
        matchesLevel
      );
    });
  }, [
    keyword,
    category,
    setName,
    attributeFilter,
    abilityFilters,
    quality,
    level,
  ]);

  const sortedGears = useMemo(() => {
    return [...filteredGears].sort((leftGear, rightGear) => {
      if (rightGear.quality !== leftGear.quality) {
        return rightGear.quality - leftGear.quality;
      }

      if (categoryOrderMap[leftGear.category] !== categoryOrderMap[rightGear.category]) {
        return categoryOrderMap[leftGear.category] - categoryOrderMap[rightGear.category];
      }

      const leftSetOrder = setTypeOptions.indexOf(leftGear.setName);
      const rightSetOrder = setTypeOptions.indexOf(rightGear.setName);

      if (leftSetOrder !== rightSetOrder) {
        if (leftSetOrder === -1) return 1;
        if (rightSetOrder === -1) return -1;
        return leftSetOrder - rightSetOrder;
      }

      if (rightGear.level !== leftGear.level) return rightGear.level - leftGear.level;

      return leftGear.name.localeCompare(rightGear.name, "ko");
    });
  }, [filteredGears]);

  const activeFilterCount = [
    keyword.trim() ? 1 : 0,
    category !== "all" ? 1 : 0,
    setName !== "all" ? 1 : 0,
    attributeFilter !== "all" ? 1 : 0,
    abilityFilters.length,
    quality !== "all" ? 1 : 0,
    level !== "all" ? 1 : 0,
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
                장비
              </h1>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">장비 목록</p>
            </div>

            <Link
              href="/"
              className="shrink-0 rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-300 sm:px-4 sm:text-sm"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              홈으로
            </Link>
          </div>
        </header>

        <div className="grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5">
          <aside
            className="sticky top-3 z-30 rounded-[20px] bg-[#05070b] shadow-[0_0_30px_rgba(250,204,21,0.04)] lg:top-5 lg:flex lg:max-h-[calc(100vh-40px)] lg:flex-col lg:overflow-hidden lg:rounded-[24px]"
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
                  유형, 세트, 속성, 능력치, 품질, 레벨
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

            <div className={isFilterOpen ? "block lg:block" : "hidden lg:block"}>
              <div
                className="bg-[#05070b] p-3 sm:p-4 lg:shrink-0"
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
                    placeholder="이름 / 세트 검색"
                    className="h-10 w-full rounded-xl border border-white/20 bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400/50 sm:h-9"
                  />
                </div>
              </div>

              <div className="p-3 sm:p-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                <FilterGroup title="장비 유형">
                  <FilterButton
                    active={category === "all"}
                    label="전체"
                    onClick={() => setCategory("all")}
                  />
                  <FilterButton
                    active={category === "armor"}
                    label="방어구"
                    iconSrc={categoryIconMap.armor}
                    onClick={() => setCategory("armor")}
                  />
                  <FilterButton
                    active={category === "gloves"}
                    label="보호 장갑"
                    iconSrc={categoryIconMap.gloves}
                    onClick={() => setCategory("gloves")}
                  />
                  <FilterButton
                    active={category === "kit"}
                    label="부품"
                    iconSrc={categoryIconMap.kit}
                    onClick={() => setCategory("kit")}
                  />
                </FilterGroup>

                <FilterGroup title="세트 유형" grid>
                  <FilterButton
                    active={setName === "all"}
                    label="전체"
                    onClick={() => setSetName("all")}
                  />
                  {setTypeOptions.map((setTypeOption) => (
                    <FilterButton
                      key={setTypeOption}
                      active={setName === setTypeOption}
                      label={setTypeOption}
                      onClick={() => setSetName(setTypeOption)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="속성" grid>
                  <FilterButton
                    active={attributeFilter === "all"}
                    label="전체"
                    onClick={() => setAttributeFilter("all")}
                  />
                  {attributeOptions.map((attributeOption) => (
                    <FilterButton
                      key={attributeOption.key}
                      active={attributeFilter === attributeOption.key}
                      label={attributeOption.label}
                      onClick={() => setAttributeFilter(attributeOption.key)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title={`능력치 (${abilityFilters.length}/2)`}>
                  <FilterButton
                    active={abilityFilters.length === 0}
                    label="전체"
                    onClick={() => setAbilityFilters([])}
                  />
                  {abilityOptions.map((abilityOption) => (
                    <FilterButton
                      key={abilityOption.key}
                      active={abilityFilters.includes(abilityOption.key)}
                      label={abilityOption.label}
                      iconSrc={abilityIconMap[abilityOption.key]}
                      onClick={() =>
                        setAbilityFilters((prev) =>
                          toggleAbilityFilter(prev, abilityOption.key, 2),
                        )
                      }
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="품질">
                  <FilterButton
                    active={quality === "all"}
                    label="전체"
                    onClick={() => setQuality("all")}
                  />
                  {[5, 4, 3, 2, 1].map((qualityOption) => (
                    <FilterButton
                      key={qualityOption}
                      active={quality === qualityOption}
                      label={qualityLabelMap[qualityOption as GearQuality]}
                      colored
                      color={qualityColorMap[qualityOption as GearQuality]}
                      onClick={() => setQuality(qualityOption as GearQuality)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="장비 레벨" last>
                  <FilterButton
                    active={level === "all"}
                    label="전체"
                    onClick={() => setLevel("all")}
                  />
                  {levelOptions.map((levelOption) => (
                    <FilterButton
                      key={levelOption}
                      active={level === levelOption}
                      label={`레벨 ${levelOption}`}
                      onClick={() => setLevel(levelOption)}
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
                  {sortedGears.length}
                </span>
                개
              </p>
            </div>

            {sortedGears.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,180px))] sm:justify-between sm:gap-3">
                {sortedGears.map((gear) => (
                  <GearCard key={gear.slug} gear={gear} />
                ))}
              </div>
            ) : (
              <div
                className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-black p-6 text-center text-sm text-zinc-500"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                등록된 장비 데이터가 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}