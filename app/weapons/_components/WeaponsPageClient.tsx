"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useDeferredValue, useMemo, useState, type ReactNode } from "react";

// ===== 상세/오퍼레이터 페이지와 통일한 디자인 토큰 =====
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

export type WeaponListItem = {
  slug: string;
  name: string;
  enName?: string;
  image?: string;
  weaponType?: string;
  rarity?: number;
  series?: string;
  mainStatLabel?: string;
  subStatLabel?: string;
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

const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
};

const rarityLabelMap: Record<number, string> = {
  6: "6성",
  5: "5성",
  4: "4성",
  3: "3성",
};

const rarityOptions = [6, 5, 4, 3];

const seriesOptions = [
  "고통", "골절", "기예", "방출", "분쇄", "사기", "어둠",
  "억제", "의료", "잔혹", "추격", "효율", "흐름", "강공",
];

function getWeaponType(weapon: WeaponListItem) {
  return weapon.weaponType ?? "";
}
function getWeaponTypeLabel(weapon: WeaponListItem) {
  const t = getWeaponType(weapon);
  return weaponTypeLabelMap[t] ?? t ?? "-";
}
function getWeaponRarity(weapon: WeaponListItem) {
  return weapon.rarity ?? 3;
}
function getWeaponImage(weapon: WeaponListItem) {
  return weapon.image ?? `/weapons/${weapon.slug}.webp`;
}
function getWeaponSeriesText(weapon: WeaponListItem) {
  return (weapon.series ?? "").trim();
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

// 필터 버튼 — 상세 칩 스타일(샤프 + CUT). 선택 시 노란색으로 명확.
function FilterButton({
  active,
  label,
  onClick,
  iconSrc,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  iconSrc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-9 items-center gap-1.5 border px-2.5 text-left font-mono text-[11px] font-bold transition duration-150 lg:w-full lg:gap-2 lg:px-3 ${
        active ? "" : "hover:border-[#ffd24a]/60 hover:text-ef-ink"
      }`}
      style={
        active
          ? { ...CUT_SM, borderColor: ACCENT, background: "rgba(255,210,74,0.16)", color: "#ffffff" }
          : { ...CUT_SM, borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }
      }
    >
      {iconSrc ? (
        <span className="relative h-3.5 w-3.5 shrink-0">
          <Image src={iconSrc} alt="" fill sizes="14px" className="object-contain" />
        </span>
      ) : (
        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[9px]" style={{ color: active ? ACCENT : "#5a5a5a" }}>◆</span>
      )}
      <span className="min-w-0 flex-1 truncate leading-none">{label}</span>
    </button>
  );
}

function FilterGroup({ title, children, last = false }: { title: string; children: ReactNode; last?: boolean }) {
  return (
    <div className={last ? "min-w-0 max-w-full" : "mb-4 min-w-0 max-w-full lg:mb-5"}>
      <GroupLabel>{title}</GroupLabel>
      <div className="flex w-full min-w-0 max-w-full flex-wrap gap-1.5 pb-1 lg:flex-col lg:flex-nowrap lg:gap-1.5 lg:pb-0">
        {children}
      </div>
    </div>
  );
}


const WeaponCard = memo(function WeaponCard({ weapon }: { weapon: WeaponListItem }) {
  const rarity = getWeaponRarity(weapon);
  const type = getWeaponType(weapon);
  const typeLabel = getWeaponTypeLabel(weapon);
  const seriesText = getWeaponSeriesText(weapon);
  const image = getWeaponImage(weapon);
  const [imgError, setImgError] = useState(false);
  const typeIcon = weaponTypeIconMap[type];

  return (
    <Link
      href={`/weapons/${weapon.slug}`}
      className={`group flex h-full flex-col overflow-hidden border border-ef-line bg-ef-card ${HOVER}`}
      style={CUT}
    >
      {/* 이미지 영역 — object-contain. 이미지 없거나 로딩 실패 시 placeholder(검은 빈 박스 금지) */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden border-b border-ef-line bg-ef-card2">
        {/* placeholder(항상 배경) */}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-ef-line">
          {typeIcon ? <span className="relative h-8 w-8 opacity-20"><Image src={typeIcon} alt="" fill sizes="32px" className="object-contain" /></span> : null}
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-ef-muted/40">Weapon</span>
        </span>
        {!imgError ? (
          <Image
            src={image}
            alt={weapon.name}
            fill
            sizes="(max-width: 640px) 50vw, 240px"
            className="object-contain p-2 transition duration-300 group-hover:scale-[1.05]"
            onError={() => setImgError(true)}
          />
        ) : null}
        <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 60%)` }} />
        {/* 레어도 라벨 */}
        <span className="absolute right-1.5 top-1.5 rounded-[3px] border-[0.5px] px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none backdrop-blur-[4px]" style={{ background: "rgba(0,0,0,0.85)", borderColor: "rgba(255,210,74,0.35)", color: ACCENT }}>
          {rarity}★
        </span>
      </div>

      {/* 정보 영역 — 계층: 1) 이름  2) 영문명  3) 주/부 능력치  4) 타입/시리즈 */}
      <div className="flex min-w-0 flex-1 flex-col p-1.5 sm:p-2.5">
        {/* 1순위 — 이름 */}
        <h3 className="line-clamp-1 text-[15px] font-black leading-tight sm:text-[16px]" style={{ color: ACCENT }}>{weapon.name}</h3>
        {/* 2순위 — 영문명 */}
        {weapon.enName ? <p className="line-clamp-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ef-muted sm:text-[10px]">{weapon.enName}</p> : null}

        {/* 3순위 — 주/부 능력치 */}
        {weapon.mainStatLabel || weapon.subStatLabel ? (
          <p className="mt-1.5 line-clamp-1 text-[10px] font-bold leading-tight text-ef-ink/90">
            <span className="font-mono text-[9px] text-ef-muted">주</span> {weapon.mainStatLabel ?? "-"}
            <span className="mx-1 text-ef-line">·</span>
            <span className="font-mono text-[9px] text-ef-muted">부</span> {weapon.subStatLabel ?? "-"}
          </p>
        ) : null}

        {/* 4순위 — 무기 타입 · 시리즈(가장 약하게) */}
        <div className="mt-auto flex flex-wrap items-center gap-1 pt-1.5">
          {typeIcon ? <span className="relative h-3.5 w-3.5 shrink-0 opacity-80"><Image src={typeIcon} alt={typeLabel} fill sizes="14px" className="object-contain" /></span> : null}
          <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-ef-muted">{typeLabel}</span>
          {seriesText ? <><span className="text-ef-line">·</span><span className="font-mono text-[9px] font-bold uppercase tracking-wide" style={{ color: `${PRIMARY}cc` }}>{seriesText}</span></> : null}
        </div>
      </div>
    </Link>
  );
});

WeaponCard.displayName = "WeaponCard";

export default function WeaponsPageClient({ weapons }: { weapons: WeaponListItem[] }) {
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
          const seriesText = getWeaponSeriesText(weapon);
          return {
            weapon,
            currentWeaponType,
            weaponRarity,
            seriesText,
            searchText: [
              weapon.name,
              weapon.enName ?? "",
              getWeaponTypeLabel(weapon),
              seriesText,
              weapon.mainStatLabel ?? "",
              weapon.subStatLabel ?? "",
            ]
              .join(" ")
              .toLowerCase(),
          };
        })
        .sort((left, right) => {
          if (right.weaponRarity !== left.weaponRarity) return right.weaponRarity - left.weaponRarity;
          const lo = weaponTypeOrderMap[left.currentWeaponType] ?? 999;
          const ro = weaponTypeOrderMap[right.currentWeaponType] ?? 999;
          if (lo !== ro) return lo - ro;
          return left.weapon.name.localeCompare(right.weapon.name, "ko");
        }),
    [weapons],
  );

  const sortedWeapons = useMemo(() => {
    const normalizedKeyword = deferredKeyword.trim().toLowerCase();
    return indexedWeapons
      .filter(({ currentWeaponType, seriesText, searchText, weaponRarity }) => {
        const matchesKeyword = normalizedKeyword === "" || searchText.includes(normalizedKeyword);
        return (
          matchesKeyword &&
          (weaponType === "all" || currentWeaponType === weaponType) &&
          (rarity === "all" || weaponRarity === rarity) &&
          (series === "all" || seriesText.includes(series))
        );
      })
      .map(({ weapon }) => weapon);
  }, [indexedWeapons, deferredKeyword, weaponType, rarity, series]);

  const activeFilterCount = [
    keyword.trim() ? 1 : 0,
    weaponType !== "all" ? 1 : 0,
    rarity !== "all" ? 1 : 0,
    series !== "all" ? 1 : 0,
  ].reduce((sum, value) => sum + value, 0);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto flex max-w-[1720px] items-center justify-between px-3 py-2.5 sm:px-6 lg:px-7">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Weapon Index</span>
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ${weapons.length} UNITS`}</span>
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
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">무기</h1>
            </div>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">Weapon Index</span>
            <p className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-ef-muted">
              Total <span className="font-black" style={{ color: ACCENT }}>{sortedWeapons.length}</span> / {weapons.length}
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
                  이름 · 등급 · 유형 · 시리즈{activeFilterCount > 0 ? ` · 적용 ${activeFilterCount}` : ""}
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
                    placeholder="이름 / 유형 / 시리즈 / 능력치"
                    className="h-10 w-full border border-ef-line bg-black pl-9 pr-3 text-xs text-ef-ink outline-none transition placeholder:text-ef-muted/70 focus:border-ef-accent/50"
                    style={CUT_SM}
                  />
                </div>
              </div>

              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-3 pr-2 sm:p-4 sm:pr-3">
                <FilterGroup title="등급">
                  <FilterButton active={rarity === "all"} label="전체" onClick={() => setRarity("all")} />
                  {rarityOptions.map((r) => (
                    <FilterButton key={r} active={rarity === r} label={rarityLabelMap[r]} iconSrc={rarityIconMap[r]} onClick={() => setRarity(r)} />
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

                <FilterGroup title="시리즈" last>
                  <FilterButton active={series === "all"} label="전체" onClick={() => setSeries("all")} />
                  {seriesOptions.map((s) => (
                    <FilterButton key={s} active={series === s} label={s} onClick={() => setSeries(s)} />
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
                <span className="font-black" style={{ color: ACCENT }}>{sortedWeapons.length}</span> 개
              </p>
            </div>

            {sortedWeapons.length > 0 ? (
              <div className="grid grid-cols-2 items-stretch gap-2 min-[480px]:grid-cols-3 sm:gap-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                {sortedWeapons.map((weapon) => (
                  <WeaponCard key={weapon.slug} weapon={weapon} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center border border-dashed border-ef-line bg-ef-card p-6 text-center" style={CUT}>
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-muted">No Results</p>
                <p className="mt-2 text-xs text-ef-muted/70">조건에 맞는 무기가 없습니다.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
