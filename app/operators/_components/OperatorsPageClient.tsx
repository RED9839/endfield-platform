"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useDeferredValue, useMemo, useState, type ReactNode } from "react";
import type {
  OperatorRarity,
  OperatorElement,
  OperatorClass,
  WeaponType,
} from "@/data/operators-detail-data";

export type OperatorListItem = {
  slug: string;
  name: string;
  enName: string;
  rarity: OperatorRarity;
  element: OperatorElement;
  class: OperatorClass;
  weapon: WeaponType;
  avatar: string;
  avatarSecondary?: string;
};

// ===== 오퍼레이터 상세페이지와 통일한 디자인 토큰 =====
const PRIMARY = "#ff9a2f"; // 섹션 라벨 바 / 강조(상세페이지 PRIMARY와 동일)
const ACCENT = "#ffd24a"; // 노란 포인트(선택/호버/이름) = ef-accent
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};
// 공용 호버: 노란 테두리 + 내부 5% 노란 틴트 + 미세 상승(상세페이지 HOVER와 동일).
const HOVER =
  "transition duration-200 hover:-translate-y-0.5 hover:border-[#ffd24a]/70 hover:shadow-[inset_0_0_0_999px_rgba(255,210,74,0.05),0_6px_18px_rgba(0,0,0,0.45)]";

const elementLabelMap: Record<OperatorElement, string> = {
  physical: "물리",
  cryo: "냉기",
  heat: "열기",
  nature: "자연",
  electric: "전기",
};

const classLabelMap: Record<OperatorClass, string> = {
  vanguard: "뱅가드",
  guard: "가드",
  defender: "디펜더",
  supporter: "서포터",
  caster: "캐스터",
  striker: "스트라이커",
};

const weaponLabelMap: Record<WeaponType, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};

const rarityIconMap: Record<OperatorRarity, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
};

const elementIconMap: Record<OperatorElement, string> = {
  physical: "/icons/elements/physical.webp",
  cryo: "/icons/elements/cryo.webp",
  heat: "/icons/elements/heat.webp",
  nature: "/icons/elements/nature.webp",
  electric: "/icons/elements/electric.webp",
};

const classIconMap: Record<OperatorClass, string> = {
  vanguard: "/icons/classes/vanguard.webp",
  guard: "/icons/classes/guard.webp",
  defender: "/icons/classes/defender.webp",
  supporter: "/icons/classes/supporter.webp",
  caster: "/icons/classes/caster.webp",
  striker: "/icons/classes/striker.webp",
};

const weaponIconMap: Record<WeaponType, string> = {
  sword: "/icons/weapons/sword.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
  artsunit: "/icons/weapons/artsunit.webp",
};

// 엔드필드 인게임 기준 속성 컬러(코너 포인트). 전기=보라 → 노란색 계열로 통일.
const elementColorMap: Record<OperatorElement, string> = {
  physical: "#d5d5d5",
  cryo: "#59d4ff",
  heat: "#ff6b4a",
  nature: "#8dff57",
  electric: "#ffd24a",
};

const classOrderMap: Record<OperatorClass, number> = {
  vanguard: 0,
  guard: 1,
  defender: 2,
  supporter: 3,
  caster: 4,
  striker: 5,
};

// 섹션 라벨 — 상세페이지 SectionLabel(sub) 스타일과 동일(바 + 모노 대문자).
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

// 필터 버튼 — 상세페이지 칩 스타일(샤프 보더 + CUT). 선택 시 노란색으로 명확하게.
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
        <span
          className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[9px]"
          style={{ color: active ? ACCENT : "#5a5a5a" }}
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
    <div className={last ? "min-w-0 max-w-full" : "mb-4 min-w-0 max-w-full lg:mb-5"}>
      <GroupLabel>{title}</GroupLabel>
      <div className="flex w-full min-w-0 max-w-full flex-wrap gap-1.5 pb-1 lg:flex-col lg:flex-nowrap lg:gap-1.5 lg:pb-0">
        {children}
      </div>
    </div>
  );
}

function OperatorInfoIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" title={alt}>
      <Image src={src} alt={alt} fill sizes="18px" className="object-contain" />
    </span>
  );
}

const OperatorCard = memo(function OperatorCard({
  operator,
}: {
  operator: OperatorListItem;
}) {
  const isAdminSplit =
    operator.slug === "endministrator" && !!operator.avatarSecondary;
  const elColor = elementColorMap[operator.element] ?? "#d6dae3";

  return (
    <Link
      href={`/operators/${operator.slug}`}
      className={`group relative block overflow-hidden border border-ef-line bg-ef-card ${HOVER}`}
      style={{ ...CUT, aspectRatio: "170 / 205" }}
    >
      {isAdminSplit ? (
        <>
          <div className="absolute inset-0 [clip-path:polygon(0_0,62%_0,42%_100%,0_100%)]">
            <Image
              src={operator.avatar}
              alt={`${operator.name} 왼쪽 이미지`}
              fill
              sizes="(max-width: 640px) 46vw, 180px"
              className="object-cover object-left"
            />
          </div>
          <div className="absolute inset-0 [clip-path:polygon(58%_0,100%_0,100%_100%,38%_100%)]">
            <Image
              src={operator.avatarSecondary!}
              alt={`${operator.name} 오른쪽 이미지`}
              fill
              sizes="(max-width: 640px) 46vw, 180px"
              className="object-cover object-right"
            />
          </div>
          <div className="absolute left-1/2 top-[-20%] h-[150%] w-[2px] -translate-x-1/2 rotate-[26deg] bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </>
      ) : (
        // object-top 으로 얼굴이 잘리지 않게 표시
        <Image
          src={operator.avatar}
          alt={operator.name}
          fill
          sizes="(max-width: 640px) 46vw, 180px"
          className="object-cover object-top transition duration-300 group-hover:scale-[1.04]"
        />
      )}

      {/* 코너 브래킷(속성 색) — 상세 히어로 톤. 레어도 배지는 제거(시각 노이즈 감소, 등급은 필터로) */}
      <span className="pointer-events-none absolute left-1.5 top-1.5 h-5 w-5 border-l-2 border-t-2" style={{ borderColor: `${elColor}cc` }} />
      <span className="pointer-events-none absolute right-1.5 top-1.5 h-5 w-5 border-r-2 border-t-2" style={{ borderColor: `${elColor}66` }} />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

      {/* 하단 정보 — 이름 / 영문명 / 아이콘 행(속성·직군·무기). 직군 텍스트·레어도 제거로 압축 */}
      <div className="absolute bottom-0 left-0 w-full p-2 sm:p-2.5">
        <h3 className="line-clamp-1 text-[15px] font-black leading-[1.1] sm:text-[17px]" style={{ color: ACCENT }}>
          {operator.name}
        </h3>
        <p className="mt-[1px] line-clamp-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ef-muted sm:text-[10px] sm:tracking-[0.14em]">
          {operator.enName}
        </p>

        <div className="mt-1.5 flex items-center gap-1.5 sm:gap-2">
          <OperatorInfoIcon src={elementIconMap[operator.element]} alt={elementLabelMap[operator.element]} />
          <OperatorInfoIcon src={classIconMap[operator.class]} alt={classLabelMap[operator.class]} />
          <OperatorInfoIcon src={weaponIconMap[operator.weapon]} alt={weaponLabelMap[operator.weapon]} />
        </div>
      </div>
    </Link>
  );
});

OperatorCard.displayName = "OperatorCard";

export default function OperatorsPageClient({
  operators,
}: {
  operators: OperatorListItem[];
}) {
  const [keyword, setKeyword] = useState("");
  const [rarity, setRarity] = useState<OperatorRarity | "all">("all");
  const [element, setElement] = useState<OperatorElement | "all">("all");
  const [operatorClass, setOperatorClass] =
    useState<OperatorClass | "all">("all");
  const [weapon, setWeapon] = useState<WeaponType | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const deferredKeyword = useDeferredValue(keyword);
  const indexedOperators = useMemo(
    () =>
      operators
        .map((operator) => ({
          operator,
          searchText: [
            operator.name,
            operator.enName,
            classLabelMap[operator.class],
            elementLabelMap[operator.element],
            weaponLabelMap[operator.weapon],
          ]
            .join(" ")
            .toLowerCase(),
        }))
        .sort((left, right) => {
          if (right.operator.rarity !== left.operator.rarity) {
            return right.operator.rarity - left.operator.rarity;
          }

          const leftClassOrder = classOrderMap[left.operator.class] ?? 999;
          const rightClassOrder = classOrderMap[right.operator.class] ?? 999;

          if (leftClassOrder !== rightClassOrder) {
            return leftClassOrder - rightClassOrder;
          }

          return left.operator.name.localeCompare(right.operator.name, "ko");
        }),
    [operators],
  );

  const sortedOperators = useMemo(() => {
    const normalizedKeyword = deferredKeyword.trim().toLowerCase();

    return indexedOperators
      .filter(({ operator, searchText }) => {
        const matchesKeyword =
          normalizedKeyword === "" || searchText.includes(normalizedKeyword);

        return (
          matchesKeyword &&
          (rarity === "all" || operator.rarity === rarity) &&
          (element === "all" || operator.element === element) &&
          (operatorClass === "all" || operator.class === operatorClass) &&
          (weapon === "all" || operator.weapon === weapon)
        );
      })
      .map(({ operator }) => operator);
  }, [indexedOperators, deferredKeyword, rarity, element, operatorClass, weapon]);

  const activeFilterCount = [
    keyword.trim() ? 1 : 0,
    rarity !== "all" ? 1 : 0,
    element !== "all" ? 1 : 0,
    operatorClass !== "all" ? 1 : 0,
    weapon !== "all" ? 1 : 0,
  ].reduce((sum, value) => sum + value, 0);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg text-ef-ink">
      {/* 배경 도트 그리드 — 상세페이지와 동일 톤 */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto flex max-w-[1720px] items-center justify-between px-3 py-2.5 sm:px-6 lg:px-7">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Operator Index</span>
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ${operators.length} UNITS`}</span>
        </div>
        <Link href="/" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>홈</Link>
      </div>

      <div className="relative z-10 mx-auto max-w-[1720px] px-3 pb-16 sm:px-6 lg:px-7">
        {/* HEADER 패널 — 세로 공간 축소(디자인 유지) */}
        <header className="relative overflow-hidden border border-ef-line bg-ef-card2 p-3 sm:px-5 sm:py-3.5" style={CUT}>
          <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)`, position: "absolute", left: 0, top: 0 }} />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">오퍼레이터</h1>
            </div>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">Operator Index</span>
            <p className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-ef-muted">
              Total <span className="font-black" style={{ color: ACCENT }}>{sortedOperators.length}</span> / {operators.length}
            </p>
          </div>
        </header>

        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-4">
          {/* ===== 검색 / 필터 ===== */}
          <aside
            className="sticky top-2 z-40 flex min-w-0 max-w-full self-start flex-col overflow-hidden border border-ef-line bg-ef-card lg:top-3 lg:max-h-[calc(100vh-24px)]"
            style={CUT}
          >
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex w-full min-w-0 items-center justify-between gap-2 border-b border-ef-line px-3 py-2.5 text-left lg:hidden"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] font-black uppercase tracking-[0.18em] text-ef-accent-soft">
                  Search / Filter
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-ef-muted">
                  이름 · 등급 · 속성 · 클래스 · 무기
                  {activeFilterCount > 0 ? ` · 적용 ${activeFilterCount}` : ""}
                </span>
              </span>
              <span
                className={`shrink-0 font-mono text-sm font-black transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                style={{ color: ACCENT }}
              >
                ▼
              </span>
            </button>

            <div
              className={`min-w-0 max-w-full overflow-hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col ${
                isFilterOpen ? "flex max-h-[70dvh] min-h-0 flex-1 flex-col" : "hidden lg:flex"
              }`}
            >
              {/* 검색창 */}
              <div className="min-w-0 shrink-0 border-b border-ef-line bg-ef-card p-3 sm:p-4">
                <GroupLabel>Search</GroupLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ef-muted">⌕</span>
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="이름 / 클래스 / 속성 / 무기 검색"
                    className="h-10 w-full border border-ef-line bg-black pl-9 pr-3 text-xs text-ef-ink outline-none transition placeholder:text-ef-muted/70 focus:border-ef-accent/50"
                    style={CUT_SM}
                  />
                </div>
              </div>

              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-3 pr-2 sm:p-4 sm:pr-3">
                <FilterGroup title="등급">
                  <FilterButton active={rarity === "all"} label="전체" onClick={() => setRarity("all")} />
                  <FilterButton active={rarity === 6} label="6성" iconSrc={rarityIconMap[6]} onClick={() => setRarity(6)} />
                  <FilterButton active={rarity === 5} label="5성" iconSrc={rarityIconMap[5]} onClick={() => setRarity(5)} />
                  <FilterButton active={rarity === 4} label="4성" iconSrc={rarityIconMap[4]} onClick={() => setRarity(4)} />
                </FilterGroup>

                <FilterGroup title="속성">
                  <FilterButton active={element === "all"} label="전체" onClick={() => setElement("all")} />
                  {Object.entries(elementLabelMap).map(([elementKey, label]) => {
                    const option = elementKey as OperatorElement;
                    return (
                      <FilterButton
                        key={option}
                        active={element === option}
                        label={label}
                        iconSrc={elementIconMap[option]}
                        onClick={() => setElement(option)}
                      />
                    );
                  })}
                </FilterGroup>

                <FilterGroup title="클래스">
                  <FilterButton active={operatorClass === "all"} label="전체" onClick={() => setOperatorClass("all")} />
                  {Object.entries(classLabelMap).map(([classKey, label]) => {
                    const option = classKey as OperatorClass;
                    return (
                      <FilterButton
                        key={option}
                        active={operatorClass === option}
                        label={label}
                        iconSrc={classIconMap[option]}
                        onClick={() => setOperatorClass(option)}
                      />
                    );
                  })}
                </FilterGroup>

                <FilterGroup title="무기" last>
                  <FilterButton active={weapon === "all"} label="전체" onClick={() => setWeapon("all")} />
                  {Object.entries(weaponLabelMap).map(([weaponKey, label]) => {
                    const option = weaponKey as WeaponType;
                    return (
                      <FilterButton
                        key={option}
                        active={weapon === option}
                        label={label}
                        iconSrc={weaponIconMap[option]}
                        onClick={() => setWeapon(option)}
                      />
                    );
                  })}
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
                <span className="font-black" style={{ color: ACCENT }}>{sortedOperators.length}</span> 명
              </p>
            </div>

            {sortedOperators.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 sm:gap-3 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
                {sortedOperators.map((operator) => (
                  <OperatorCard key={operator.slug} operator={operator} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center border border-dashed border-ef-line bg-ef-card p-6 text-center" style={CUT}>
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-muted">No Results</p>
                <p className="mt-2 text-xs text-ef-muted/70">조건에 맞는 오퍼레이터가 없습니다.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
