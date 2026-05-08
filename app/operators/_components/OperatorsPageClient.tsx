"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
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

function OperatorInfoIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative h-5 w-5 shrink-0" title={alt}>
      <Image src={src} alt={alt} fill sizes="20px" className="object-contain" />
    </span>
  );
}

function OperatorCard({
  operator,
}: {
  operator: OperatorDetail & { avatarSecondary?: string };
}) {
  const isAdminSplit =
    operator.slug === "endministrator" && !!operator.avatarSecondary;

  return (
    <Link
      href={`/operators/${operator.slug}`}
      className="group relative block overflow-hidden rounded-[18px] bg-black transition hover:-translate-y-1"
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
      }}
    >
      {isAdminSplit ? (
        <>
          <div className="absolute inset-0 [clip-path:polygon(0_0,62%_0,42%_100%,0_100%)]">
            <Image
              src={operator.avatar}
              alt={`${operator.name} left`}
              fill
              sizes={`${CARD_WIDTH}px`}
              className="object-cover object-left"
            />
          </div>

          <div className="absolute inset-0 [clip-path:polygon(58%_0,100%_0,100%_100%,38%_100%)]">
            <Image
              src={operator.avatarSecondary!}
              alt={`${operator.name} right`}
              fill
              sizes={`${CARD_WIDTH}px`}
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
          sizes={`${CARD_WIDTH}px`}
          className="object-cover object-center transition duration-300 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-3">
        <h3 className="line-clamp-1 text-[17px] font-black leading-[1.1] text-yellow-300">
          {operator.name}
        </h3>

        <p className="mt-[2px] line-clamp-1 text-[11px] tracking-wide text-zinc-300">
          {operator.enName}
        </p>

        <div className="mt-2 flex items-center gap-2 overflow-hidden">
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
}

export default function OperatorsPageClient() {
  const [keyword, setKeyword] = useState("");
  const [rarity, setRarity] = useState<OperatorRarity | "all">("all");
  const [element, setElement] = useState<OperatorElement | "all">("all");
  const [operatorClass, setOperatorClass] =
    useState<OperatorClass | "all">("all");
  const [weapon, setWeapon] = useState<WeaponType | "all">("all");

  const sortedOperators = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return operatorDetails
      .filter((operator) => {
        const matchesKeyword =
          q === "" ||
          operator.name.toLowerCase().includes(q) ||
          operator.enName.toLowerCase().includes(q) ||
          classLabelMap[operator.class].includes(q) ||
          elementLabelMap[operator.element].includes(q) ||
          weaponLabelMap[operator.weapon].includes(q);

        return (
          matchesKeyword &&
          (rarity === "all" || operator.rarity === rarity) &&
          (element === "all" || operator.element === element) &&
          (operatorClass === "all" || operator.class === operatorClass) &&
          (weapon === "all" || operator.weapon === weapon)
        );
      })
      .sort((a, b) => {
        if (b.rarity !== a.rarity) return b.rarity - a.rarity;

        const classA = classOrderMap[a.class] ?? 999;
        const classB = classOrderMap[b.class] ?? 999;

        if (classA !== classB) return classA - classB;

        return a.name.localeCompare(b.name, "ko");
      });
  }, [keyword, rarity, element, operatorClass, weapon]);

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
                OPERATORS
              </h1>

              <p className="mt-1 text-sm text-zinc-500">Operator List</p>
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
                  placeholder="이름 / 클래스 / 속성 / 무기 검색"
                  className="h-9 w-full rounded-xl border border-white/20 bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400/50"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <FilterGroup title="레어도">
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

                {Object.entries(elementLabelMap).map(([key, label]) => {
                  const value = key as OperatorElement;

                  return (
                    <FilterButton
                      key={value}
                      active={element === value}
                      label={label}
                      iconSrc={elementIconMap[value]}
                      color={elementColorMap[value]}
                      colored
                      onClick={() => setElement(value)}
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

                {Object.entries(classLabelMap).map(([key, label]) => {
                  const value = key as OperatorClass;

                  return (
                    <FilterButton
                      key={value}
                      active={operatorClass === value}
                      label={label}
                      iconSrc={classIconMap[value]}
                      onClick={() => setOperatorClass(value)}
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

                {Object.entries(weaponLabelMap).map(([key, label]) => {
                  const value = key as WeaponType;

                  return (
                    <FilterButton
                      key={value}
                      active={weapon === value}
                      label={label}
                      iconSrc={weaponIconMap[value]}
                      onClick={() => setWeapon(value)}
                    />
                  );
                })}
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
                  {sortedOperators.length}
                </span>
                명
              </p>
            </div>

            {sortedOperators.length > 0 ? (
              <div className="grid grid-cols-[repeat(8,170px)] justify-between gap-y-3 overflow-hidden">
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
                등록된 Operator 데이터가 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}