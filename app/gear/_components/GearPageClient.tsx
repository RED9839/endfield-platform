"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  memo,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  GearAbilityKey,
  GearAttributeKey,
  GearCategory,
  GearLevel,
  GearQuality,
  GearSetName,
} from "@/data/gear-types";

export type GearListItem = {
  slug: string;
  name: string;
  enName: string;
  category: GearCategory;
  level: GearLevel;
  quality: GearQuality;
  setName: GearSetName;
  image: string;
  abilityTypes: GearAbilityKey[];
  attributeTypes: GearAttributeKey[];
  attributeLabel: string;
};

// ===== 상세/오퍼레이터/무기 페이지와 통일한 디자인 토큰 =====
const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};
const HOVER =
  "transition duration-200 hover:-translate-y-0.5 hover:border-[#ffd24a]/70 hover:shadow-[inset_0_0_0_999px_rgba(255,210,74,0.05),0_6px_18px_rgba(0,0,0,0.45)]";

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

// 품질(레어도) 색 — 카드 코너 브래킷 / 필터 활성색.
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
  "개척", "응룡 50식", "본 크러셔", "조류의 물결", "청파", "M. I. 경찰용",
  "고검의 잔향", "식양의 흐름", "열 작업용", "생체 보조", "검술사", "경량 초자연",
  "펄스식", "식양의 숨결", "순행 전달자", "아부레이의 메아리", "중장갑 전달자",
  "재앙 방호", "침식 방호", "침식 차단", "통합 중량형 모델", "통합 경량형 모델", "세트 없음",
];

const levelOptions: GearLevel[] = [70, 50, 36, 28, 20, 10];

// 220여 개 카드를 한 번에 렌더하지 않고 점진적으로 노출해 DOM/레이아웃 비용을 낮춘다.
const GEAR_PAGE_SIZE = 60;

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

const abilityLabelMap = Object.fromEntries(
  abilityOptions.map((option) => [option.key, option.label]),
) as Record<GearAbilityKey, string>;

const attributeLabelMap = Object.fromEntries(
  attributeOptions.map((option) => [option.key, option.label]),
) as Record<GearAttributeKey, string>;

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

// 섹션 라벨 — 상세 SectionLabel(sub) 스타일.
function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-3 w-0.5" style={{ background: PRIMARY }} />
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-ef-muted">
        {children}
      </span>
    </div>
  );
}

// 필터 칩 — 상세 칩 스타일(샤프 + CUT). 선택 시 노란색(또는 품질 색)으로 명확.
function FilterButton({
  active,
  label,
  onClick,
  iconSrc,
  color,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  iconSrc?: string;
  color?: string;
}) {
  const point = color ?? ACCENT;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-9 items-center gap-1.5 border px-2.5 text-left font-mono text-[11px] font-bold transition duration-150 lg:w-full lg:gap-2 lg:px-3 ${
        active ? "" : "hover:border-[#ffd24a]/60 hover:text-ef-ink"
      }`}
      style={
        active
          ? { ...CUT_SM, borderColor: point, background: `${point}26`, color: "#ffffff" }
          : { ...CUT_SM, borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }
      }
    >
      {iconSrc ? (
        <span className="relative h-3.5 w-3.5 shrink-0">
          <Image src={iconSrc} alt="" fill sizes="14px" className="object-contain" />
        </span>
      ) : (
        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[9px]" style={{ color: active ? point : "#5a5a5a" }}>◆</span>
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
    <div className={last ? "min-w-0 max-w-full" : "mb-4 min-w-0 max-w-full lg:mb-5"}>
      <GroupLabel>{title}</GroupLabel>
      <div
        className={
          grid
            ? "grid min-w-0 max-w-full grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-1.5 lg:grid-cols-1"
            : "flex min-w-0 max-w-full flex-wrap gap-1.5 pb-1 lg:flex-col lg:flex-nowrap lg:pb-0"
        }
      >
        {children}
      </div>
    </div>
  );
}

const GearCard = memo(function GearCard({ gear }: { gear: GearListItem }) {
  const [imgError, setImgError] = useState(false);
  const qColor = qualityColorMap[gear.quality] ?? "#202020";
  const catIcon = categoryIconMap[gear.category];

  return (
    <Link
      href={`/gear/${gear.slug}`}
      className={`group relative block overflow-hidden border border-ef-line bg-ef-card2 ${HOVER}`}
      style={{ ...CUT, aspectRatio: "170 / 205" }}
    >
      {/* 장비 이미지 — object-contain(잘림 방지). 없으면 유형 아이콘 placeholder */}
      {!imgError ? (
        <Image
          src={gear.image}
          alt={gear.name}
          fill
          sizes="(max-width: 640px) 46vw, 220px"
          className="object-contain p-2 pb-[36%] transition duration-300 group-hover:scale-[1.05]"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center pb-[22%]">
          {catIcon ? <span className="relative h-14 w-14 opacity-35"><Image src={catIcon} alt={categoryLabelMap[gear.category]} fill sizes="56px" className="object-contain" /></span> : null}
        </span>
      )}

      {/* 품질 코너 브래킷(레어도 색) */}
      <span className="pointer-events-none absolute left-1.5 top-1.5 h-5 w-5 border-l-2 border-t-2" style={{ borderColor: `${qColor}cc` }} />
      <span className="pointer-events-none absolute right-1.5 top-1.5 h-5 w-5 border-r-2 border-t-2" style={{ borderColor: `${qColor}cc` }} />
      {/* 유형 아이콘 배지(좌상단) + 레벨(우상단) */}
      {catIcon ? (
        <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center border border-ef-line bg-black/70 backdrop-blur-[3px]" style={CUT_SM} title={categoryLabelMap[gear.category]}>
          <span className="relative h-4 w-4"><Image src={catIcon} alt="" fill sizes="16px" className="object-contain" /></span>
        </span>
      ) : null}
      <span className="absolute right-2 top-2 rounded-[3px] border-[0.5px] px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none backdrop-blur-[4px]" style={{ background: "rgba(0,0,0,0.82)", borderColor: `${qColor}aa`, color: qColor }}>
        Lv{gear.level}
      </span>

      {/* 하단 그라데이션 + 정보: 이름 / 영문명 / 세트 · 능력치 / 속성 */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2.5 pt-10">
        <h3 className="line-clamp-1 text-[15px] font-black leading-tight sm:text-base" style={{ color: ACCENT }}>{gear.name}</h3>
        {gear.enName ? <p className="line-clamp-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ef-muted">{gear.enName}</p> : null}
        <div className="mt-1.5 flex items-center gap-1.5">
          {gear.setName && gear.setName !== "세트 없음" ? <span className="truncate font-mono text-[10px] font-bold uppercase tracking-wide" style={{ color: `${PRIMARY}cc` }}>{gear.setName}</span> : null}
          {gear.abilityTypes.length ? (
            <span className="ml-auto flex shrink-0 items-center gap-0.5">
              {gear.abilityTypes.map((a) => abilityIconMap[a] ? <span key={a} className="relative h-3.5 w-3.5"><Image src={abilityIconMap[a]} alt={abilityLabelMap[a]} fill sizes="14px" className="object-contain" /></span> : null)}
            </span>
          ) : null}
        </div>
        {gear.attributeLabel ? <p className="mt-0.5 line-clamp-1 text-[11px] font-bold text-ef-ink/90">{gear.attributeLabel}</p> : null}
      </div>
    </Link>
  );
});

GearCard.displayName = "GearCard";

export default function GearPageClient({ gears }: { gears: GearListItem[] }) {
  // `?set=` 딥링크를 클라이언트에서 해석 → 페이지 자체는 정적으로 유지된다.
  const searchParams = useSearchParams();
  const requestedSet = (searchParams.get("set") ?? "").trim();
  const initialSetName: GearSetName | "all" = gears.some(
    (gear) => gear.setName === requestedSet,
  )
    ? (requestedSet as GearSetName)
    : "all";

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<GearCategory | "all">("all");
  const [setName, setSetName] = useState<GearSetName | "all">(initialSetName);
  const [attributeFilter, setAttributeFilter] = useState<GearAttributeKey | "all">("all");
  const [abilityFilters, setAbilityFilters] = useState<GearAbilityKey[]>([]);
  const [quality, setQuality] = useState<GearQuality | "all">("all");
  const [level, setLevel] = useState<GearLevel | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(GEAR_PAGE_SIZE);
  const deferredKeyword = useDeferredValue(keyword);

  const indexedGears = useMemo(
    () =>
      gears
        .map((gear) => ({
          gear,
          searchText: [
            gear.name,
            gear.enName,
            gear.setName,
            categoryLabelMap[gear.category],
            gear.attributeLabel,
            ...gear.abilityTypes.map((key) => abilityLabelMap[key] ?? key),
            ...gear.attributeTypes.map((key) => attributeLabelMap[key] ?? key),
          ]
            .join(" ")
            .toLowerCase(),
        }))
        .sort((left, right) => {
          if (right.gear.quality !== left.gear.quality) return right.gear.quality - left.gear.quality;
          const lc = categoryOrderMap[left.gear.category] ?? 999;
          const rc = categoryOrderMap[right.gear.category] ?? 999;
          if (lc !== rc) return lc - rc;
          const ls = setTypeOptions.indexOf(left.gear.setName);
          const rs = setTypeOptions.indexOf(right.gear.setName);
          if (ls !== rs) {
            if (ls === -1) return 1;
            if (rs === -1) return -1;
            return ls - rs;
          }
          if (right.gear.level !== left.gear.level) return right.gear.level - left.gear.level;
          return left.gear.name.localeCompare(right.gear.name, "ko");
        }),
    [gears],
  );

  const sortedGears = useMemo(() => {
    const normalizedKeyword = deferredKeyword.trim().toLowerCase();
    return indexedGears
      .filter(({ gear, searchText }) => {
        const matchesKeyword = normalizedKeyword === "" || searchText.includes(normalizedKeyword);
        const matchesCategory = category === "all" || gear.category === category;
        const matchesSet = setName === "all" || gear.setName === setName;
        const matchesAttribute = attributeFilter === "all" || gear.attributeTypes.includes(attributeFilter);
        const matchesAbility = abilityFilters.length === 0 || abilityFilters.every((a) => gear.abilityTypes.includes(a));
        const matchesQuality = quality === "all" || gear.quality === quality;
        const matchesLevel = level === "all" || gear.level === level;
        return matchesKeyword && matchesCategory && matchesSet && matchesAttribute && matchesAbility && matchesQuality && matchesLevel;
      })
      .map(({ gear }) => gear);
  }, [indexedGears, deferredKeyword, category, setName, attributeFilter, abilityFilters, quality, level]);

  // 필터/검색이 바뀌면 다시 처음 페이지부터 노출한다.
  useEffect(() => {
    setVisibleCount(GEAR_PAGE_SIZE);
  }, [deferredKeyword, category, setName, attributeFilter, abilityFilters, quality, level]);

  const visibleGears = useMemo(() => sortedGears.slice(0, visibleCount), [sortedGears, visibleCount]);

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
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto flex max-w-[1720px] items-center justify-between px-3 py-2.5 sm:px-6 lg:px-7">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Gear Index</span>
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ${gears.length} UNITS`}</span>
        </div>
        <Link href="/" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>홈</Link>
      </div>

      <div className="relative z-10 mx-auto max-w-[1720px] px-3 pb-16 sm:px-6 lg:px-7">
        {/* HEADER 패널 */}
        <header className="relative overflow-hidden border border-ef-line bg-ef-card2 p-3 sm:px-5 sm:py-3.5" style={CUT}>
          <span className="absolute left-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">장비</h1>
            </div>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">Gear Index</span>
            <p className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-ef-muted">
              Total <span className="font-black" style={{ color: ACCENT }}>{sortedGears.length}</span> / {gears.length}
            </p>
          </div>
        </header>

        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-4">
          {/* ===== 검색 / 필터 ===== */}
          <aside className="sticky top-2 z-40 flex min-w-0 max-w-full self-start flex-col overflow-hidden border border-ef-line bg-ef-card lg:top-3 lg:max-h-[calc(100vh-24px)]" style={CUT}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex w-full min-w-0 items-center justify-between gap-2 border-b border-ef-line px-3 py-2.5 text-left lg:hidden"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] font-black uppercase tracking-[0.18em] text-ef-accent-soft">Search / Filter</span>
                <span className="mt-0.5 block truncate text-[11px] text-ef-muted">
                  유형 · 세트 · 속성 · 능력치 · 품질 · 레벨{activeFilterCount > 0 ? ` · 적용 ${activeFilterCount}` : ""}
                </span>
              </span>
              <span className={`shrink-0 font-mono text-sm font-black transition-transform ${isFilterOpen ? "rotate-180" : ""}`} style={{ color: ACCENT }}>▼</span>
            </button>

            <div className={`min-w-0 max-w-full overflow-hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col ${isFilterOpen ? "flex max-h-[70dvh] min-h-0 flex-1 flex-col" : "hidden lg:flex"}`}>
              <div className="min-w-0 shrink-0 border-b border-ef-line bg-ef-card p-3 sm:p-4">
                <GroupLabel>Search</GroupLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ef-muted">⌕</span>
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="이름 / 세트 / 속성 검색"
                    className="h-10 w-full border border-ef-line bg-black pl-9 pr-3 text-xs text-ef-ink outline-none transition placeholder:text-ef-muted/70 focus:border-ef-accent/50"
                    style={CUT_SM}
                  />
                </div>
              </div>

              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-3 pr-2 sm:p-4 sm:pr-3">
                <FilterGroup title="장비 유형">
                  <FilterButton active={category === "all"} label="전체" onClick={() => setCategory("all")} />
                  <FilterButton active={category === "armor"} label="방어구" iconSrc={categoryIconMap.armor} onClick={() => setCategory("armor")} />
                  <FilterButton active={category === "gloves"} label="보호 장갑" iconSrc={categoryIconMap.gloves} onClick={() => setCategory("gloves")} />
                  <FilterButton active={category === "kit"} label="부품" iconSrc={categoryIconMap.kit} onClick={() => setCategory("kit")} />
                </FilterGroup>

                <FilterGroup title="세트 유형" grid>
                  <FilterButton active={setName === "all"} label="전체" onClick={() => setSetName("all")} />
                  {setTypeOptions.map((s) => (
                    <FilterButton key={s} active={setName === s} label={s} onClick={() => setSetName(s)} />
                  ))}
                </FilterGroup>

                <FilterGroup title="속성" grid>
                  <FilterButton active={attributeFilter === "all"} label="전체" onClick={() => setAttributeFilter("all")} />
                  {attributeOptions.map((a) => (
                    <FilterButton key={a.key} active={attributeFilter === a.key} label={a.label} onClick={() => setAttributeFilter(a.key)} />
                  ))}
                </FilterGroup>

                <FilterGroup title={`능력치 (${abilityFilters.length}/2)`}>
                  <FilterButton active={abilityFilters.length === 0} label="전체" onClick={() => setAbilityFilters([])} />
                  {abilityOptions.map((a) => (
                    <FilterButton
                      key={a.key}
                      active={abilityFilters.includes(a.key)}
                      label={a.label}
                      iconSrc={abilityIconMap[a.key]}
                      onClick={() => setAbilityFilters((prev) => toggleAbilityFilter(prev, a.key, 2))}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="품질">
                  <FilterButton active={quality === "all"} label="전체" onClick={() => setQuality("all")} />
                  {[5, 4, 3, 2, 1].map((q) => (
                    <FilterButton key={q} active={quality === q} label={qualityLabelMap[q as GearQuality]} color={qualityColorMap[q as GearQuality]} onClick={() => setQuality(q as GearQuality)} />
                  ))}
                </FilterGroup>

                <FilterGroup title="장비 레벨" last>
                  <FilterButton active={level === "all"} label="전체" onClick={() => setLevel("all")} />
                  {levelOptions.map((l) => (
                    <FilterButton key={l} active={level === l} label={`레벨 ${l}`} onClick={() => setLevel(l)} />
                  ))}
                </FilterGroup>
              </div>
            </div>
          </aside>

          {/* ===== 카드 그리드 ===== */}
          <section className="min-w-0 overflow-hidden border border-ef-line bg-ef-card2 p-3 sm:p-4" style={CUT}>
            <div className="mb-3 flex items-center justify-between border-b border-ef-line pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1" style={{ background: PRIMARY }} />
                <span className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">Units</span>
              </div>
              <p className="font-mono text-[11px] text-ef-muted">
                <span className="font-black" style={{ color: ACCENT }}>{sortedGears.length}</span> 개
              </p>
            </div>

            {sortedGears.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 sm:gap-3 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
                  {visibleGears.map((gear) => (
                    <GearCard key={gear.slug} gear={gear} />
                  ))}
                </div>

                {visibleCount < sortedGears.length ? (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + GEAR_PAGE_SIZE)}
                      className="border px-5 py-2 font-mono text-xs font-black uppercase tracking-wide transition hover:brightness-110"
                      style={{ ...CUT_SM, borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}
                    >
                      더 보기 ({sortedGears.length - visibleCount}개 남음)
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center border border-dashed border-ef-line bg-ef-card p-6 text-center" style={CUT}>
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-muted">No Results</p>
                <p className="mt-2 text-xs text-ef-muted/70">조건에 맞는 장비가 없습니다.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
