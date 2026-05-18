"use client";

import Image from "next/image";
import type { OperatorDetail } from "@/data/operators-detail-data";

const YELLOW_MAIN = "#ffd24a";
const OPERATOR_CARD_WIDTH = 170;
const OPERATOR_CARD_HEIGHT = 238;
const SIMULATOR_OPERATOR_STORAGE_KEY = "simulator:selectedOperatorSlug";
const SIMULATOR_FORM_STORAGE_KEY = "simulator:formState";

const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
};

const elementIconMap: Record<string, string> = {
  physical: "/icons/elements/physical.webp",
  cryo: "/icons/elements/cryo.webp",
  heat: "/icons/elements/heat.webp",
  nature: "/icons/elements/nature.webp",
  electric: "/icons/elements/electric.webp",
};

const classIconMap: Record<string, string> = {
  vanguard: "/icons/classes/vanguard.webp",
  guard: "/icons/classes/guard.webp",
  defender: "/icons/classes/defender.webp",
  supporter: "/icons/classes/supporter.webp",
  caster: "/icons/classes/caster.webp",
  striker: "/icons/classes/striker.webp",
};

const weaponIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp",
  artsunit: "/icons/weapons/artsunit.webp",
  artsUnit: "/icons/weapons/artsunit.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
};

const classOrderMap: Record<string, number> = {
  vanguard: 0,
  guard: 1,
  defender: 2,
  supporter: 3,
  caster: 4,
  striker: 5,
};

type OperatorSelectCardOperator = OperatorDetail & {
  avatarSecondary?: string;
};

export function sortOperatorSelectList<T extends {
  rarity: number;
  class: string;
  name: string;
}>(items: T[]) {
  return [...items].sort((a, b) => {
    if (b.rarity !== a.rarity) return b.rarity - a.rarity;

    const classA = classOrderMap[a.class] ?? 999;
    const classB = classOrderMap[b.class] ?? 999;

    if (classA !== classB) return classA - classB;

    return a.name.localeCompare(b.name, "ko");
  });
}

function getOperatorCardImage(operator: OperatorSelectCardOperator): string {
  return (
    operator.avatar ||
    operator.fullImage ||
    `/operators/${operator.slug}/avatar.webp`
  );
}

function persistSimulatorOperatorSelection(slug: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/simulator") return;

  window.sessionStorage.setItem(SIMULATOR_OPERATOR_STORAGE_KEY, slug);

  try {
    const raw =
      window.sessionStorage.getItem(SIMULATOR_FORM_STORAGE_KEY) ??
      window.localStorage.getItem(SIMULATOR_FORM_STORAGE_KEY) ??
      "{}";
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const next = {
      ...parsed,
      operatorSlug: slug,
      operatorCurrentLevel: 1,
      operatorTargetLevel: 90,
      eliteRange: { current: 0, target: 0 },
      trustRange: { current: 0, target: 0 },
      talentRanges: {},
      infrastructureRanges: {},
    };
    const serialized = JSON.stringify(next);
    window.sessionStorage.setItem(SIMULATOR_FORM_STORAGE_KEY, serialized);
    window.localStorage.setItem(SIMULATOR_FORM_STORAGE_KEY, serialized);
  } catch {
    const serialized = JSON.stringify({
      operatorSlug: slug,
      operatorCurrentLevel: 1,
      operatorTargetLevel: 90,
    });
    window.sessionStorage.setItem(SIMULATOR_FORM_STORAGE_KEY, serialized);
    window.localStorage.setItem(SIMULATOR_FORM_STORAGE_KEY, serialized);
  }
}

export default function OperatorSelectCard({
  operator,
  active,
  onClick,
}: {
  operator: OperatorSelectCardOperator;
  active: boolean;
  onClick: () => void;
}) {
  const mainImage = getOperatorCardImage(operator);
  const adminRightImage = operator.avatarSecondary ?? "";
  const isAdminSplit =
    operator.slug === "endministrator" && adminRightImage.length > 0;

  const borderColor = active ? YELLOW_MAIN : "rgba(255,255,255,0.08)";

  const iconSources = [
    rarityIconMap[operator.rarity],
    elementIconMap[operator.element],
    classIconMap[operator.class],
    weaponIconMap[operator.weapon],
  ].filter((src): src is string => Boolean(src));

  return (
    <button
      type="button"
      onClick={() => {
        persistSimulatorOperatorSelection(operator.slug);
        onClick();
      }}
      className="group relative block overflow-hidden rounded-[18px] bg-black text-left transition hover:-translate-y-1"
      style={{
        width: "100%",
        minWidth: `${OPERATOR_CARD_WIDTH}px`,
        height: `${OPERATOR_CARD_HEIGHT}px`,
        border: `1px solid ${borderColor}`,
        boxShadow: active ? "0 0 20px rgba(255,210,74,0.32)" : "none",
      }}
    >
      {isAdminSplit ? (
        <>
          <div className="absolute inset-0 [clip-path:polygon(0_0,62%_0,42%_100%,0_100%)]">
            <Image
              src={mainImage}
              alt={`${operator.name} left`}
              fill
              sizes={`${OPERATOR_CARD_WIDTH}px`}
              className="object-cover object-left"
            />
          </div>

          <div className="absolute inset-0 [clip-path:polygon(58%_0,100%_0,100%_100%,38%_100%)]">
            <Image
              src={adminRightImage}
              alt={`${operator.name} right`}
              fill
              sizes={`${OPERATOR_CARD_WIDTH}px`}
              className="object-cover object-right"
            />
          </div>

          <div className="absolute left-1/2 top-[-20%] h-[150%] w-[2px] -translate-x-1/2 rotate-[26deg] bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </>
      ) : (
        <Image
          src={mainImage}
          alt={operator.name}
          fill
          sizes={`${OPERATOR_CARD_WIDTH}px`}
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
          {iconSources.map((src) => (
            <span key={src} className="relative h-5 w-5 shrink-0">
              <Image
                src={src}
                alt=""
                fill
                sizes="20px"
                className="object-contain"
              />
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
