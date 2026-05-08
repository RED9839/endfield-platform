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
  armor: "/icons/gear/armor.webp",
  gloves: "/icons/gear/gloves.webp",
  kit: "/icons/gear/kit.webp",
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
  { key: "unbalancedTargetDamage", label: "불균형 목표에 주는 피해 보너스" },
  { key: "mainStat", label: "주요 능력치" },
  { key: "artsDamage", label: "아츠 피해 보너스" },
  { key: "cryoElectricDamage", label: "냉기와 전기 피해 보너스" },
  { key: "damageReduction", label: "모든 피해 감소" },
  { key: "subStat", label: "보조 능력치" },
  { key: "allSkillDamage", label: "모든 스킬 피해 보너스" },
  { key: "heatNatureDamage", label: "열기와 자연 피해 보너스" },
];

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
            : "rgba(255, 196, 74, 0.18)",
        background: active ? `${pointColor}22` : FILTER_BG,
        color: active ? "#ffffff" : "#d4d4d8",
      }}
    >
      {iconSrc ? (
        <span className="relative h-3.5 w-3.5 shrink-0">
          <Image
            src={iconSrc}
            alt=""
            fill
            sizes="14px"
            className="object-contain"
          />
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
      <h2
        className="mb-2 text-[11px] font-black tracking-[0.2em]"
        style={{ color: YELLOW_TEXT }}
      >
        {title}
      </h2>

      <div className="flex flex-col gap-2">{children}</div>
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
        <Image
          src={iconSrc}
          alt={label}
          fill
          sizes="16px"
          className="object-contain"
        />
      </span>
    </span>
  );
}

function GearCategoryLevelChip({ item }: { item: GearDetail }) {
  const qualityColor = qualityColorMap[item.quality];

  return (
    <GearChip color={qualityColor}>
      <span className="relative h-4 w-4 shrink-0">
        <Image
          src={categoryIconMap[item.category]}
          alt={categoryLabelMap[item.category]}
          fill
          sizes="16px"
          className="object-contain"
        />
      </span>

      <span className="opacity-70">·</span>
      <span>Lv.{item.level}</span>
    </GearChip>
  );
}

function GearCard({ item }: { item: GearDetail }) {
  return (
    <Link
      href={`/gear/${item.slug}`}
      className="group relative block h-[244px] overflow-hidden rounded-[18px] bg-black transition hover:-translate-y-1 hover:border-yellow-400/35"
      style={{ border: `1px solid ${YELLOW_BORDER}` }}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="(max-width: 1840px) 12.5vw, 180px"
        className="object-cover object-center transition duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-3">
        <h3 className="line-clamp-2 text-[14px] font-black text-yellow-300">
          {item.name}
        </h3>

        <p className="mt-1 line-clamp-1 text-[10px] text-zinc-300">
          {item.enName}
        </p>

        <div className="mt-2 flex flex-col gap-1 overflow-hidden">
          <div className="flex h-[20px] flex-nowrap items-center gap-1 overflow-hidden">
            <GearCategoryLevelChip item={item} />

            {item.abilityTypes.map((type) => {
              const option = abilityOptions.find((item) => item.key === type);
              const iconSrc = abilityIconMap[type];

              return option && iconSrc ? (
                <GearIconOnlyChip
                  key={type}
                  iconSrc={iconSrc}
                  label={option.label}
                />
              ) : null;
            })}
          </div>

          <div className="flex h-[20px] items-center overflow-hidden">
            <GearChip color={YELLOW_MAIN}>
              <span className="truncate">{item.attribute?.label ?? "속성"}</span>
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
  const [abilityFilter, setAbilityFilter] =
    useState<GearAbilityKey | "all">("all");
  const [quality, setQuality] = useState<GearQuality | "all">("all");
  const [level, setLevel] = useState<GearLevel | "all">("all");

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return gearDetails.filter((item) => {
      const matchesKeyword =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q) ||
        item.setName.toLowerCase().includes(q);

      const matchesCategory = category === "all" || item.category === category;
      const matchesSet = setName === "all" || item.setName === setName;
      const matchesAttribute =
        attributeFilter === "all" ||
        item.attributeTypes.includes(attributeFilter);
      const matchesAbility =
        abilityFilter === "all" || item.abilityTypes.includes(abilityFilter);
      const matchesQuality = quality === "all" || item.quality === quality;
      const matchesLevel = level === "all" || item.level === level;

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
    abilityFilter,
    quality,
    level,
  ]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (b.quality !== a.quality) return b.quality - a.quality;

      if (categoryOrderMap[a.category] !== categoryOrderMap[b.category]) {
        return categoryOrderMap[a.category] - categoryOrderMap[b.category];
      }

      const aSetOrder = setTypeOptions.indexOf(a.setName);
      const bSetOrder = setTypeOptions.indexOf(b.setName);

      if (aSetOrder !== bSetOrder) {
        if (aSetOrder === -1) return 1;
        if (bSetOrder === -1) return -1;
        return aSetOrder - bSetOrder;
      }

      if (b.level !== a.level) return b.level - a.level;

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
              <p
                className="text-[11px] font-semibold tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                ENDFIELD SUPPORT PLATFORM
              </p>

              <h1
                className="mt-2 text-4xl font-black tracking-tight"
                style={{ color: YELLOW_TEXT }}
              >
                GEAR
              </h1>

              <p className="mt-1 text-sm text-zinc-500">Gear List</p>
            </div>

            <Link
              href="/"
              className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-300"
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
            <div
              className="shrink-0 bg-[#05070b] p-4"
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
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="이름 / 세트 검색"
                  className="h-9 w-full rounded-xl border border-white/20 bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400/50"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
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

              <FilterGroup title="세트 유형">
                <FilterButton
                  active={setName === "all"}
                  label="전체"
                  onClick={() => setSetName("all")}
                />
                {setTypeOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={setName === value}
                    label={value}
                    onClick={() => setSetName(value)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="속성">
                <FilterButton
                  active={attributeFilter === "all"}
                  label="전체"
                  onClick={() => setAttributeFilter("all")}
                />
                {attributeOptions.map((option) => (
                  <FilterButton
                    key={option.key}
                    active={attributeFilter === option.key}
                    label={option.label}
                    onClick={() => setAttributeFilter(option.key)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="능력치">
                <FilterButton
                  active={abilityFilter === "all"}
                  label="전체"
                  onClick={() => setAbilityFilter("all")}
                />
                {abilityOptions.map((option) => (
                  <FilterButton
                    key={option.key}
                    active={abilityFilter === option.key}
                    label={option.label}
                    iconSrc={abilityIconMap[option.key]}
                    onClick={() => setAbilityFilter(option.key)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="품질">
                <FilterButton
                  active={quality === "all"}
                  label="전체"
                  onClick={() => setQuality("all")}
                />
                {[5, 4, 3, 2, 1].map((value) => (
                  <FilterButton
                    key={value}
                    active={quality === value}
                    label={qualityLabelMap[value as GearQuality]}
                    colored
                    color={qualityColorMap[value as GearQuality]}
                    onClick={() => setQuality(value as GearQuality)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="장비 레벨" last>
                <FilterButton
                  active={level === "all"}
                  label="전체"
                  onClick={() => setLevel("all")}
                />
                {levelOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={level === value}
                    label={`Lv. ${value}`}
                    onClick={() => setLevel(value)}
                  />
                ))}
              </FilterGroup>
            </div>
          </aside>

          <section
            className="min-w-0 rounded-[24px] bg-[#05070b] p-3 shadow-[0_0_30px_rgba(250,204,21,0.04)]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="mb-3 flex items-center justify-between pb-3"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
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
                  <GearCard key={item.slug} item={item} />
                ))}
              </div>
            ) : (
              <div
                className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-black p-6 text-center text-sm text-zinc-500"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                등록된 Gear 데이터가 없습니다.
                <br />
                gear-detail-data.ts에 Gear를 추가하면 여기에 표시됩니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}