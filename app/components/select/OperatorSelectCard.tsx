"use client";

import Image from "next/image";
import type { OperatorDetail } from "@/data/operators-detail-data";

const YELLOW_MAIN = "#ffd24a";
const OPERATOR_CARD_WIDTH = 170;
const OPERATOR_CARD_HEIGHT = 238;

const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
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

function getOperatorCardImage(operator: OperatorDetail & { avatarSecondary?: string }) {
  return operator.avatar || operator.fullImage || `/operators/${operator.slug}/avatar.webp`;
}

export default function OperatorSelectCard({
  operator,
  active,
  onClick,
}: {
  operator: OperatorDetail & { avatarSecondary?: string };
  active: boolean;
  onClick: () => void;
}) {
  const isAdminSplit = operator.slug === "endministrator" && !!operator.avatarSecondary;
  const borderColor = active ? YELLOW_MAIN : "rgba(255,255,255,0.08)";

  return (
    <button
      type="button"
      onClick={onClick}
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
              src={getOperatorCardImage(operator)}
              alt={`${operator.name} left`}
              fill
              sizes={`${OPERATOR_CARD_WIDTH}px`}
              className="object-cover object-left"
            />
          </div>

          <div className="absolute inset-0 [clip-path:polygon(58%_0,100%_0,100%_100%,38%_100%)]">
            <Image
              src={operator.avatarSecondary}
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
          src={getOperatorCardImage(operator)}
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
          {[
            rarityIconMap[operator.rarity],
            elementIconMap[operator.element],
            classIconMap[operator.class],
            weaponIconMap[operator.weapon],
          ]
            .filter(Boolean)
            .map((src) => (
              <span key={src} className="relative h-5 w-5 shrink-0">
                <Image src={src} alt="" fill sizes="20px" className="object-contain" />
              </span>
            ))}
        </div>
      </div>
    </button>
  );
}