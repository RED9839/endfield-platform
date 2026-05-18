"use client";

import Image from "next/image";
import type { SourceWeaponDetail } from "@/data/weapons-detail-data";

const YELLOW_MAIN = "#ffd24a";
const WEAPON_CARD_WIDTH = 170;
const WEAPON_CARD_HEIGHT = 222;

type WeaponLike = SourceWeaponDetail & {
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
  avatar?: string;
};

const weaponTypeOrderMap: Record<string, number> = {
  sword: 0,
  artsunit: 1,
  artsUnit: 1,
  greatsword: 2,
  polearm: 3,
  handcannon: 4,
};

export function sortWeaponSelectList<T extends {
  name: string;
  type?: string;
  weaponType?: string;
  rarity?: number;
  quality?: number;
}>(items: T[]) {
  return [...items].sort((a, b) => {
    const rarityA = Number(a.rarity ?? a.quality ?? 3);
    const rarityB = Number(b.rarity ?? b.quality ?? 3);

    if (rarityB !== rarityA) return rarityB - rarityA;

    const typeA = weaponTypeOrderMap[a.weaponType ?? a.type ?? ""] ?? 999;
    const typeB = weaponTypeOrderMap[b.weaponType ?? b.type ?? ""] ?? 999;

    if (typeA !== typeB) return typeA - typeB;

    return a.name.localeCompare(b.name, "ko");
  });
}

const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
};

const weaponIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp",
  artsunit: "/icons/weapons/artsunit.webp",
  artsUnit: "/icons/weapons/artsunit.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
};

const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검",
  artsunit: "아츠 유닛",
  artsUnit: "아츠 유닛",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
};

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

function getWeaponImage(weapon: SourceWeaponDetail | null) {
  if (!weapon) return "";
  const item = weapon as WeaponLike;
  return item.fullImage || item.image || item.avatar || `/weapons/${item.slug}.webp`;
}

function getWeaponType(item: WeaponLike) {
  return item.weaponType ?? item.type ?? "";
}

function getWeaponTypeLabel(item: WeaponLike) {
  const type = getWeaponType(item);
  return weaponTypeLabelMap[type] ?? type ?? "-";
}

function getWeaponRarity(item: WeaponLike) {
  return Number(item.rarity ?? item.quality ?? 3);
}

function getRawSeriesText(item: WeaponLike) {
  const candidates = [
    item.seriesSkill,
    item.series,
    item.weaponSeries,
    item.seriesName,
    item.skill,
    item.weaponSkill,
    item.passive,
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
  if (text.includes("기예") || text.includes("기교") || lower.includes("technique")) return "기예";
  if (text.includes("방출") || lower.includes("release")) return "방출";
  if (text.includes("분쇄") || lower.includes("crush")) return "분쇄";
  if (text.includes("사기") || lower.includes("morale")) return "사기";
  if (text.includes("어둠") || lower.includes("dark")) return "어둠";
  if (text.includes("억제") || text.includes("제압") || lower.includes("suppress")) return "억제";
  if (text.includes("의료") || text.includes("치유") || lower.includes("medical") || lower.includes("heal")) return "의료";
  if (text.includes("잔혹") || lower.includes("brutality")) return "잔혹";
  if (text.includes("추격") || lower.includes("pursuit")) return "추격";
  if (text.includes("효율") || lower.includes("efficiency")) return "효율";
  if (text.includes("흐름") || lower.includes("flow")) return "흐름";
  if (text.includes("강공") || lower.includes("heavystrike") || lower.includes("heavy")) return "강공";

  return text;
}

function getWeaponSeriesText(item: WeaponLike) {
  return getSeriesShortName(getRawSeriesText(item));
}

export default function WeaponSelectCard({
  weapon,
  active,
  onClick,
}: {
  weapon: WeaponLike;
  active: boolean;
  onClick: () => void;
}) {
  const rarity = getWeaponRarity(weapon);
  const type = getWeaponType(weapon);
  const typeLabel = getWeaponTypeLabel(weapon);
  const image = getWeaponImage(weapon);
  const series = getWeaponSeriesText(weapon);
  const borderColor = active ? YELLOW_MAIN : "rgba(255,255,255,0.08)";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block overflow-hidden rounded-[18px] bg-black text-left transition hover:-translate-y-1"
      style={{
        width: "100%",
        minWidth: `${WEAPON_CARD_WIDTH}px`,
        height: `${WEAPON_CARD_HEIGHT}px`,
        border: `1px solid ${borderColor}`,
        boxShadow: active ? "0 0 20px rgba(255,210,74,0.32)" : "none",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-[138px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_62%)]">
        <Image
          src={image}
          alt={weapon.name}
          fill
          sizes={`${WEAPON_CARD_WIDTH}px`}
          className="object-contain p-5 transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-3">
        <h3 className="line-clamp-1 text-[16px] font-black leading-[1.1] text-yellow-300">
          {weapon.name}
        </h3>

        <p className="mt-[2px] line-clamp-1 text-[11px] tracking-wide text-zinc-300">
          {weapon.enName}
        </p>

        <div className="mt-2 flex items-center gap-2 overflow-hidden">
          {rarityIconMap[rarity] ? (
            <span className="relative h-5 w-5 shrink-0" title={`${rarity}성`}>
              <Image
                src={rarityIconMap[rarity]}
                alt={`${rarity}성`}
                fill
                sizes="20px"
                className="object-contain"
              />
            </span>
          ) : null}

          {weaponIconMap[type] ? (
            <span className="relative h-5 w-5 shrink-0" title={typeLabel}>
              <Image
                src={weaponIconMap[type]}
                alt={typeLabel}
                fill
                sizes="20px"
                className="object-contain"
              />
            </span>
          ) : null}

          {series ? (
            <span
              className="min-w-0 truncate rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-[2px] text-[10px] font-black text-yellow-200"
              title={series}
            >
              {series}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}