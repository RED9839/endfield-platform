"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useDeferredValue, useMemo, useState, type ReactNode } from "react";
import {
  operatorDetails,
  type OperatorDetail,
  type OperatorRarity,
  type OperatorElement,
  type OperatorClass,
  type WeaponType,
} from "@/data/operators-detail-data";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const FILTER_BG = "#071019";

const CARD_WIDTH = 170;
const CARD_HEIGHT = 238;

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

const rarityColorMap: Record<OperatorRarity, string> = {
  6: "#ff8a1f",
  5: "#f0c94a",
  4: "#9a63ff",
};

const elementColorMap: Record<OperatorElement, string> = {
  physical: "#808080",
  cryo: "#20c0c0",
  heat: "#f06040",
  nature: "#90d020",
  electric: "#f0b000",
};

const classOrderMap: Record<OperatorClass, number> = {
  vanguard: 0,
  guard: 1,
  defender: 2,
  supporter: 3,
  caster: 4,
  striker: 5,
};

const indexedOperators = operatorDetails
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
  });

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
      className="group flex h-[32px] items-center gap-1.5 rounded-lg border px-2.5 text-left text-[11px] font-bold transition hover:bg-[#101923] lg:h-[38px] lg:w-full lg:gap-2 lg:rounded-xl lg:px-3 lg:text-[12px]"
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
    <div className={last ? "min-w-0 max-w-full overflow-hidden" : "mb-3 min-w-0 max-w-full overflow-hidden lg:mb-5"}>
      <h2
        className="mb-1.5 text-[10px] font-black tracking-[0.16em] lg:mb-2 lg:text-[11px] lg:tracking-[0.2em]"
        style={{ color: YELLOW_TEXT }}
      >
        {title}
      </h2>

      <div className="flex w-full min-w-0 max-w-full flex-wrap gap-1.5 pb-1 lg:flex-col lg:flex-nowrap lg:gap-2 lg:pb-0">
        {children}
      </div>
    </div>
  );
}

function OperatorInfoIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative h-5 w-5 shrink-0" title={alt}>
      <Image src={src} alt={alt} fill sizes="20px" className="object-contain" />
    </span>
  );
}

const OperatorCard = memo(function OperatorCard({
  operator,
}: {
  operator: OperatorDetail & { avatarSecondary?: string };
}) {
  const isAdminSplit =
    operator.slug === "endministrator" && !!operator.avatarSecondary;

  return (
    <Link
      href={`/operators/${operator.slug}`}
      className="group relative block overflow-hidden rounded-[16px] bg-black transition hover:-translate-y-1 sm:rounded-[18px]"
      style={{
        width: "100%",
        aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
      }}
    >
      {isAdminSplit ? (
        <>
          <div className="absolute inset-0 [clip-path:polygon(0_0,62%_0,42%_100%,0_100%)]">
            <Image
              src={operator.avatar}
              alt={`${operator.name} 왼쪽 이미지`}
              fill
              sizes="(max-width: 640px) 46vw, 170px"
              className="object-cover object-left"
            />
          </div>

          <div className="absolute inset-0 [clip-path:polygon(58%_0,100%_0,100%_100%,38%_100%)]">
            <Image
              src={operator.avatarSecondary!}
              alt={`${operator.name} 오른쪽 이미지`}
              fill
              sizes="(max-width: 640px) 46vw, 170px"
              className="object-cover object-right"
            />
          </div>

          <div className="absolute left-1/2 top-[-20%] h-[150%] w-[2px] -translate-x-1/2 rotate-[26deg] bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </>
      ) : (
        <Image
          src={operator.avatar}
          alt={operator.name}
          fill
          sizes="(max-width: 640px) 46vw, 170px"
          className="object-cover object-center transition duration-300 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-3">
        <h3 className="line-clamp-1 text-[15px] font-black leading-[1.1] text-yellow-300 sm:text-[17px]">
          {operator.name}
        </h3>

        <p className="mt-[2px] line-clamp-1 text-[10px] tracking-wide text-zinc-300 sm:text-[11px]">
          {operator.enName}
        </p>

        <div className="mt-2 flex items-center gap-1.5 overflow-hidden sm:gap-2">
          <OperatorInfoIcon
            src={rarityIconMap[operator.rarity]}
            alt={`${operator.rarity}성`}
          />
          <OperatorInfoIcon
            src={elementIconMap[operator.element]}
            alt={elementLabelMap[operator.element]}
          />
          <OperatorInfoIcon
            src={classIconMap[operator.class]}
            alt={classLabelMap[operator.class]}
          />
          <OperatorInfoIcon
            src={weaponIconMap[operator.weapon]}
            alt={weaponLabelMap[operator.weapon]}
          />
        </div>
      </div>
    </Link>
  );
});

OperatorCard.displayName = "OperatorCard";

export default function OperatorsPageClient() {
  const [keyword, setKeyword] = useState("");
  const [rarity, setRarity] = useState<OperatorRarity | "all">("all");
  const [element, setElement] = useState<OperatorElement | "all">("all");
  const [operatorClass, setOperatorClass] =
    useState<OperatorClass | "all">("all");
  const [weapon, setWeapon] = useState<WeaponType | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const deferredKeyword = useDeferredValue(keyword);

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
  }, [deferredKeyword, rarity, element, operatorClass, weapon]);

  const activeFilterCount = [
    keyword.trim() ? 1 : 0,
    rarity !== "all" ? 1 : 0,
    element !== "all" ? 1 : 0,
    operatorClass !== "all" ? 1 : 0,
    weapon !== "all" ? 1 : 0,
  ].reduce((sum, value) => sum + value, 0);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1840px] overflow-x-clip">
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
                오퍼레이터
              </h1>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                오퍼레이터 목록
              </p>
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

        <div className="grid min-w-0 gap-3 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5">
          <aside
            className="sticky top-2 z-40 flex max-h-[calc(100dvh-16px)] min-w-0 max-w-full self-start flex-col overflow-hidden rounded-[16px] bg-[#05070b] shadow-[0_0_30px_rgba(250,204,21,0.04)] lg:top-5 lg:max-h-[calc(100vh-40px)] lg:rounded-[24px]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex w-full min-w-0 items-center justify-between gap-2 px-3 py-2 text-left lg:hidden"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <span className="min-w-0">
                <span
                  className="block text-[10px] font-black tracking-[0.16em]"
                  style={{ color: YELLOW_TEXT }}
                >
                  검색 / 필터
                </span>

                <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
                  이름, 등급, 속성, 클래스, 무기 필터
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
                isFilterOpen ? "block min-h-0 flex-1" : "hidden lg:flex",
              ].join(" ")}
            >
              <div
                className="min-w-0 shrink-0 bg-[#05070b] p-2.5 sm:p-4"
                style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                <h2
                  className="mb-1.5 text-[10px] font-black tracking-[0.16em] lg:mb-2 lg:text-[11px] lg:tracking-[0.2em]"
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
                    placeholder="이름 / 클래스 / 속성 / 무기 검색"
                    className="h-10 w-full rounded-xl border border-white/20 bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400/50 sm:h-9"
                  />
                </div>
              </div>

              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-2.5 pr-2 sm:p-4 sm:pr-3">
                <FilterGroup title="등급">
                  <FilterButton
                    active={rarity === "all"}
                    label="전체"
                    onClick={() => setRarity("all")}
                  />
                  <FilterButton
                    active={rarity === 6}
                    label="6성"
                    iconSrc={rarityIconMap[6]}
                    color={rarityColorMap[6]}
                    colored
                    onClick={() => setRarity(6)}
                  />
                  <FilterButton
                    active={rarity === 5}
                    label="5성"
                    iconSrc={rarityIconMap[5]}
                    color={rarityColorMap[5]}
                    colored
                    onClick={() => setRarity(5)}
                  />
                  <FilterButton
                    active={rarity === 4}
                    label="4성"
                    iconSrc={rarityIconMap[4]}
                    color={rarityColorMap[4]}
                    colored
                    onClick={() => setRarity(4)}
                  />
                </FilterGroup>

                <FilterGroup title="속성">
                  <FilterButton
                    active={element === "all"}
                    label="전체"
                    onClick={() => setElement("all")}
                  />

                  {Object.entries(elementLabelMap).map(([elementKey, label]) => {
                    const option = elementKey as OperatorElement;

                    return (
                      <FilterButton
                        key={option}
                        active={element === option}
                        label={label}
                        iconSrc={elementIconMap[option]}
                        color={elementColorMap[option]}
                        colored
                        onClick={() => setElement(option)}
                      />
                    );
                  })}
                </FilterGroup>

                <FilterGroup title="클래스">
                  <FilterButton
                    active={operatorClass === "all"}
                    label="전체"
                    onClick={() => setOperatorClass("all")}
                  />

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
                  <FilterButton
                    active={weapon === "all"}
                    label="전체"
                    onClick={() => setWeapon("all")}
                  />

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

          <section
            className="min-w-0 overflow-hidden rounded-[20px] bg-[#05070b] p-3 shadow-[0_0_30px_rgba(250,204,21,0.04)] lg:rounded-[24px]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="mb-3 flex items-center justify-between pb-3"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <p className="text-sm text-zinc-400">
                총{" "}
                <span className="font-black" style={{ color: YELLOW_TEXT }}>
                  {sortedOperators.length}
                </span>
                명
              </p>
            </div>

            {sortedOperators.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,170px))] sm:justify-between sm:gap-3">
                {sortedOperators.map((operator) => (
                  <OperatorCard
                    key={operator.slug}
                    operator={
                      operator as OperatorDetail & { avatarSecondary?: string }
                    }
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-black p-6 text-center text-sm text-zinc-500"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                등록된 오퍼레이터 데이터가 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
