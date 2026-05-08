"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { operatorDetails } from "@/data/operators-detail-data";
import type {
  OperatorClass,
  OperatorDetail,
  OperatorElement,
  OperatorRarity,
  WeaponType,
} from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import type { SourceWeaponDetail } from "@/data/weapons-detail-data";
import { gearDetails } from "@/data/gear-detail-data";
import type { GearDetail } from "@/data/gear-types";
import { sortOperatorSelectList } from "@/data/operator-sort";
import { sortWeaponSelectList } from "@/data/weapons-sort";
import { gearSetOrder, sortGearSelectList } from "@/data/gear-sort";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const FILTER_BG = "#071019";

const OPERATOR_CARD_WIDTH = 170;
const OPERATOR_CARD_HEIGHT = 238;
const WEAPON_CARD_WIDTH = 170;
const WEAPON_CARD_HEIGHT = 222;
const GEAR_CARD_WIDTH = 170;
const GEAR_CARD_HEIGHT = 222;

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

const elementLabelMap: Record<string, string> = {
  physical: "물리",
  cryo: "냉기",
  heat: "열기",
  nature: "자연",
  electric: "전기",
};

const classLabelMap: Record<string, string> = {
  vanguard: "뱅가드",
  guard: "가드",
  defender: "디펜더",
  supporter: "서포터",
  caster: "캐스터",
  striker: "스트라이커",
};

const operatorWeaponLabelMap: Record<string, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};

const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검",
  artsunit: "아츠 유닛",
  artsUnit: "아츠 유닛",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
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

const rarityColorMap: Record<number, string> = {
  6: "#ff8a1f",
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
};

const elementColorMap: Record<string, string> = {
  physical: "#808080",
  cryo: "#20c0c0",
  heat: "#f06040",
  nature: "#90d020",
  electric: "#f0b000",
};

const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
};

const operatorRarityOptions = [6, 5, 4] as const;
const weaponRarityOptions = [6, 5, 4, 3] as const;
const weaponTypeOrder = [
  "sword",
  "artsunit",
  "greatsword",
  "polearm",
  "handcannon",
] as const;

const weaponSeriesOptions = [
  "강공",
  "억제",
  "추격",
  "분쇄",
  "사기",
  "기예",
  "잔혹",
  "고통",
  "흐름",
  "효율",
  "의료",
  "방출",
  "골절",
  "어둠",
] as const;

const classOrderMap: Record<string, number> = {
  vanguard: 0,
  guard: 1,
  defender: 2,
  supporter: 3,
  caster: 4,
  striker: 5,
};

const weaponTypeOrderMap: Record<string, number> = {
  sword: 0,
  artsunit: 1,
  artsUnit: 1,
  greatsword: 2,
  polearm: 3,
  handcannon: 4,
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
      if (typeof candidate === "string" && candidate.trim())
        return candidate.trim();
    }
  }
  return "";
}

function isEndministrator(operator: OperatorDetail | null) {
  const slug = String(operator?.slug ?? "").toLowerCase();
  const id = String((operator as any)?.id ?? "").toLowerCase();
  return slug === "endministrator" || id === "endministrator";
}

function getOperatorImage(operator: OperatorDetail | null) {
  if (!operator) return "";
  if (isEndministrator(operator)) return "/operators/endministrator/full1.webp";
  return (
    operator.fullImage ||
    operator.avatar ||
    `/operators/${operator.slug}/full.webp`
  );
}

function getOperatorCardImage(
  operator: OperatorDetail & { avatarSecondary?: string },
) {
  return (
    operator.avatar ||
    operator.fullImage ||
    `/operators/${operator.slug}/avatar.webp`
  );
}

function getOperatorImageSecondary(operator: OperatorDetail | null) {
  if (!operator) return "";
  if (isEndministrator(operator)) return "/operators/endministrator/full2.webp";
  return (
    (operator as OperatorDetail & { fullImageSecondary?: string })
      ?.fullImageSecondary || ""
  );
}

function getWeaponImage(weapon: SourceWeaponDetail | null) {
  if (!weapon) return "";
  const item = weapon as WeaponLike;
  return (
    item.fullImage || item.image || item.avatar || `/weapons/${item.slug}.webp`
  );
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
  if (
    text.includes("기예") ||
    text.includes("기교") ||
    lower.includes("technique")
  )
    return "기예";
  if (text.includes("방출") || lower.includes("release")) return "방출";
  if (text.includes("분쇄") || lower.includes("crush")) return "분쇄";
  if (text.includes("사기") || lower.includes("morale")) return "사기";
  if (text.includes("어둠") || lower.includes("dark")) return "어둠";
  if (
    text.includes("억제") ||
    text.includes("제압") ||
    lower.includes("suppress")
  )
    return "억제";
  if (
    text.includes("의료") ||
    text.includes("치유") ||
    lower.includes("medical") ||
    lower.includes("heal")
  )
    return "의료";
  if (text.includes("잔혹") || lower.includes("brutality")) return "잔혹";
  if (text.includes("추격") || lower.includes("pursuit")) return "추격";
  if (text.includes("효율") || lower.includes("efficiency")) return "효율";
  if (text.includes("흐름") || lower.includes("flow")) return "흐름";
  if (
    text.includes("강공") ||
    lower.includes("heavystrike") ||
    lower.includes("heavy")
  )
    return "강공";
  return "";
}

function getWeaponSeriesText(item: WeaponLike) {
  return getSeriesShortName(getRawSeriesText(item));
}


const qualityColorMap: Record<number, string> = {
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
  2: "#84cc16",
  1: "#9ca3af",
};

const gearAbilityOptions = [
  { label: "전체", value: "all" },
  { label: "힘", value: "strength" },
  { label: "민첩", value: "agility" },
  { label: "지능", value: "intelligence" },
  { label: "의지", value: "will" },
];

const gearAttributeOptions = [
  { label: "전체", value: "all" },
  { label: "공격력", value: "attack" },
  { label: "생명력", value: "hp" },
  { label: "치명타 확률", value: "critRate" },
  { label: "오리지늄 아츠 강도", value: "originiumArts" },
  { label: "치유 효율 보너스", value: "healEfficiency" },
  { label: "물리 피해 보너스", value: "physicalDamage" },
  { label: "궁극기 충전 효율", value: "ultimateEfficiency" },
  { label: "일반 공격 피해 보너스", value: "normalAttack" },
  { label: "배틀 스킬 피해 보너스", value: "skillDamage" },
  { label: "연계 스킬 피해 보너스", value: "comboSkillDamage" },
  { label: "궁극기 피해 보너스", value: "ultimateDamage" },
  { label: "불균형 목표에 주는 피해 보너스", value: "unbalancedTargetDamage" },
  { label: "주요 능력치", value: "mainStat" },
  { label: "아츠 피해 보너스", value: "artsDamage" },
  { label: "냉기와 전기 피해 보너스", value: "cryoElectricDamage" },
  { label: "모든 피해 감소", value: "damageReduction" },
  { label: "보조 능력치", value: "subStat" },
  { label: "모든 스킬 피해 보너스", value: "allSkillDamage" },
  { label: "열기와 자연 피해 보너스", value: "heatNatureDamage" },
];

type GearSlot = "armor" | "gloves" | "kit1" | "kit2";
type PickerMode = "operator" | "weapon" | GearSlot;

function orderIndex(list: readonly string[], value: unknown) {
  const index = list.indexOf(String(value ?? ""));
  return index >= 0 ? index : 999;
}

function getGearCategoryLabel(slot: GearSlot) {
  if (slot === "armor") return "방어구";
  if (slot === "gloves") return "보호 장갑";
  if (slot === "kit1") return "부품 1";
  return "부품 2";
}

function getGearImage(gear: GearDetail | null) {
  if (!gear) return "";
  return gear.image || `/gear/${gear.slug}.webp`;
}

function EmptyImage({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[340px] items-center justify-center rounded-[22px] border border-yellow-500/10 bg-black/45 text-sm font-semibold text-zinc-500">
      {label}
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
  iconSrc,
  color = YELLOW_MAIN,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  iconSrc?: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center gap-2 rounded-xl px-3 text-left text-xs font-bold transition hover:bg-[#101923]"
      style={{
        background: active ? "rgba(255,212,74,0.10)" : FILTER_BG,
        border: `1px solid ${active ? color : "rgba(255,255,255,0.10)"}`,
        color: active ? YELLOW_TEXT : "#d4d4d8",
      }}
    >
      {iconSrc ? (
        <span className="relative h-4 w-4 shrink-0">
          <Image
            src={iconSrc}
            alt={label}
            fill
            sizes="16px"
            className="object-contain"
          />
        </span>
      ) : (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: color }}
        />
      )}
      <span className="truncate">{label}</span>
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

function PickerShell({
  title,
  count,
  searchValue,
  searchPlaceholder,
  onSearch,
  onClose,
  aside,
  children,
}: {
  title: string;
  count: number;
  searchValue: string;
  searchPlaceholder: string;
  onSearch: (value: string) => void;
  onClose: () => void;
  aside: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm">
      <div
        className="max-h-[90vh] w-full max-w-[1540px] overflow-hidden rounded-[28px] bg-[#05070b] shadow-[0_22px_90px_rgba(0,0,0,0.62)]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="flex items-center justify-between gap-4 p-5"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div>
            <p
              className="text-[11px] font-semibold tracking-[0.35em]"
              style={{ color: YELLOW_TEXT }}
            >
              ENDFIELD SUPPORT PLATFORM
            </p>
            <h2
              className="mt-2 text-3xl font-black tracking-tight"
              style={{ color: YELLOW_TEXT }}
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-lg font-black text-white transition hover:bg-[#0b1018]"
            style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
          >
            ×
          </button>
        </div>

        <div className="grid max-h-[calc(90vh-104px)] min-h-0 gap-5 overflow-hidden p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside
            className="flex max-h-[calc(90vh-144px)] min-h-0 flex-col overflow-hidden rounded-[24px] bg-[#05070b]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="shrink-0 bg-[#05070b] p-4"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <h3
                className="mb-2 text-[11px] font-black tracking-[0.2em]"
                style={{ color: YELLOW_TEXT }}
              >
                검색
              </h3>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  ⌕
                </span>
                <input
                  value={searchValue}
                  onChange={(event) => onSearch(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-xl border border-white/20 bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400/50"
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">{aside}</div>
          </aside>

          <section
            className="min-w-0 overflow-hidden rounded-[24px] bg-[#05070b] p-3"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="mb-3 flex items-center justify-between pb-3"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <p className="text-sm text-zinc-400">
                총{" "}
                <span className="font-black" style={{ color: YELLOW_TEXT }}>
                  {count}
                </span>
                개
              </p>
            </div>
            <div className="max-h-[calc(90vh-210px)] overflow-y-auto pr-1">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function OperatorCard({
  operator,
  active,
  onClick,
}: {
  operator: OperatorDetail & { avatarSecondary?: string };
  active: boolean;
  onClick: () => void;
}) {
  const isAdminSplit =
    operator.slug === "endministrator" && !!operator.avatarSecondary;
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
              src={operator.avatarSecondary!}
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

function WeaponCard({
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
            <span
              className="relative h-5 w-5 shrink-0"
              title={getWeaponTypeLabel(weapon)}
            >
              <Image
                src={weaponIconMap[type]}
                alt={getWeaponTypeLabel(weapon)}
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


function GearCard({
  gear,
  active,
  onClick,
}: {
  gear: GearDetail;
  active: boolean;
  onClick: () => void;
}) {
  const borderColor = active ? YELLOW_MAIN : "rgba(255,255,255,0.08)";
  const quality = Number(gear.quality ?? 1);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block overflow-hidden rounded-[18px] bg-black text-left transition hover:-translate-y-1"
      style={{
        width: "100%",
        minWidth: `${GEAR_CARD_WIDTH}px`,
        height: `${GEAR_CARD_HEIGHT}px`,
        border: `1px solid ${borderColor}`,
        boxShadow: active ? "0 0 20px rgba(255,210,74,0.32)" : "none",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-[138px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_62%)]">
        <Image
          src={getGearImage(gear)}
          alt={gear.name}
          fill
          sizes={`${GEAR_CARD_WIDTH}px`}
          className="object-contain p-5 transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-3">
        <h3 className="line-clamp-1 text-[16px] font-black leading-[1.1] text-yellow-300">
          {gear.name}
        </h3>
        <p className="mt-[2px] line-clamp-1 text-[11px] tracking-wide text-zinc-300">
          {gear.enName}
        </p>
        <div className="mt-2 flex items-center gap-2 overflow-hidden">
          <span
            className="rounded-full border px-2 py-[2px] text-[10px] font-black"
            style={{
              borderColor: qualityColorMap[quality] ?? "rgba(255,255,255,0.18)",
              color: qualityColorMap[quality] ?? "#d4d4d8",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {quality}품질
          </span>
          <span className="min-w-0 truncate rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-[2px] text-[10px] font-black text-yellow-200">
            Lv.{gear.level}
          </span>
        </div>
        <p className="mt-1 truncate text-[11px] font-bold text-zinc-400">
          {gear.setName}
        </p>
      </div>
    </button>
  );
}

export default function SimulatorShowcaseHero({
  operator,
  weapon,
  armor,
  gloves,
  kit1,
  kit2,
  selectedOperatorSlug,
  selectedWeaponSlug,
  selectedArmorSlug,
  selectedGlovesSlug,
  selectedKit1Slug,
  selectedKit2Slug,
  onSelectOperator,
  onSelectWeapon,
  onSelectGear,
}: {
  operator: OperatorDetail | null;
  weapon: SourceWeaponDetail | null;
  armor: GearDetail | null;
  gloves: GearDetail | null;
  kit1: GearDetail | null;
  kit2: GearDetail | null;
  selectedOperatorSlug: string;
  selectedWeaponSlug: string;
  selectedArmorSlug: string;
  selectedGlovesSlug: string;
  selectedKit1Slug: string;
  selectedKit2Slug: string;
  onSelectOperator: (slug: string) => void;
  onSelectWeapon: (slug: string) => void;
  onSelectGear: (slot: GearSlot, slug: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [adminAlt, setAdminAlt] = useState(false);
  const [isOperatorPickerOpen, setIsOperatorPickerOpen] = useState(false);
  const [isWeaponPickerOpen, setIsWeaponPickerOpen] = useState(false);
  const [gearPickerSlot, setGearPickerSlot] = useState<GearSlot | null>(null);
  const [operatorSearch, setOperatorSearch] = useState("");
  const [weaponSearch, setWeaponSearch] = useState("");
  const [operatorRarity, setOperatorRarity] = useState<OperatorRarity | "all">(
    "all",
  );
  const [operatorElement, setOperatorElement] = useState<
    OperatorElement | "all"
  >("all");
  const [operatorClass, setOperatorClass] = useState<OperatorClass | "all">(
    "all",
  );
  const [operatorWeapon, setOperatorWeapon] = useState<WeaponType | "all">(
    "all",
  );
  const [weaponRarity, setWeaponRarity] = useState<number | "all">("all");
  const [weaponType, setWeaponType] = useState<string | "all">("all");
  const [weaponSeries, setWeaponSeries] = useState<string | "all">("all");
  const [gearSearch, setGearSearch] = useState("");
  const [gearSetFilter, setGearSetFilter] = useState("all");
  const [gearAbilityFilter, setGearAbilityFilter] = useState("all");
  const [gearAttributeFilter, setGearAttributeFilter] = useState("all");
  const [gearQualityFilter, setGearQualityFilter] = useState("all");
  const [gearLevelFilter, setGearLevelFilter] = useState("all");

  useEffect(() => setMounted(true), []);

  const operators = useMemo(
    () => sortOperatorSelectList(operatorDetails) as OperatorDetail[],
    [],
  );
  const weapons = useMemo(
    () => sortWeaponSelectList(weaponDetails) as SourceWeaponDetail[],
    [],
  );
  const gearList = useMemo(() => sortGearSelectList(gearDetails) as GearDetail[], []);
  const armorItems = useMemo(
    () => gearList.filter((item) => item.category === "armor"),
    [gearList],
  );
  const glovesItems = useMemo(
    () => gearList.filter((item) => item.category === "gloves"),
    [gearList],
  );
  const kitItems = useMemo(
    () => gearList.filter((item) => item.category === "kit"),
    [gearList],
  );

  const selectedGearMap = {
    armor,
    gloves,
    kit1,
    kit2,
  } satisfies Record<GearSlot, GearDetail | null>;

  const selectedGearSlugMap = {
    armor: selectedArmorSlug,
    gloves: selectedGlovesSlug,
    kit1: selectedKit1Slug,
    kit2: selectedKit2Slug,
  } satisfies Record<GearSlot, string>;

  const gearSets = useMemo(
    () =>
      Array.from(new Set(gearList.map((item) => item.setName).filter(Boolean))).sort(
        (a, b) => orderIndex(gearSetOrder, a) - orderIndex(gearSetOrder, b),
      ),
    [gearList],
  );

  const operatorImage = getOperatorImage(operator);
  const operatorImageSecondary = getOperatorImageSecondary(operator);
  const weaponImage = getWeaponImage(weapon);
  const isAdmin = isEndministrator(operator);
  const isDualOperator = Boolean(
    operator && operatorImage && operatorImageSecondary,
  );


  const sortedOperators = useMemo(() => {
    const q = operatorSearch.trim().toLowerCase();
    return operators
      .filter((item) => {
        const matchesKeyword =
          q === "" ||
          item.name.toLowerCase().includes(q) ||
          String(item.enName ?? "")
            .toLowerCase()
            .includes(q) ||
          String(item.slug ?? "")
            .toLowerCase()
            .includes(q) ||
          String(classLabelMap[item.class] ?? "").includes(q) ||
          String(elementLabelMap[item.element] ?? "").includes(q) ||
          String(operatorWeaponLabelMap[item.weapon] ?? "").includes(q);

        return (
          matchesKeyword &&
          (operatorRarity === "all" || item.rarity === operatorRarity) &&
          (operatorElement === "all" || item.element === operatorElement) &&
          (operatorClass === "all" || item.class === operatorClass) &&
          (operatorWeapon === "all" || item.weapon === operatorWeapon)
        );
      })
      .sort((a, b) => {
        if (b.rarity !== a.rarity) return b.rarity - a.rarity;
        const classA = classOrderMap[a.class] ?? 999;
        const classB = classOrderMap[b.class] ?? 999;
        if (classA !== classB) return classA - classB;
        return a.name.localeCompare(b.name, "ko");
      });
  }, [
    operatorSearch,
    operators,
    operatorRarity,
    operatorElement,
    operatorClass,
    operatorWeapon,
  ]);

  const sortedWeapons = useMemo(() => {
    const q = weaponSearch.trim().toLowerCase();
    return (weapons as WeaponLike[])
      .filter((item) => {
        const type = getWeaponType(item);
        const matchesKeyword =
          q === "" ||
          item.name.toLowerCase().includes(q) ||
          String(item.enName ?? "")
            .toLowerCase()
            .includes(q) ||
          String(item.slug ?? "")
            .toLowerCase()
            .includes(q) ||
          getWeaponTypeLabel(item).includes(q) ||
          getWeaponSeriesText(item).includes(q);

        const series = getWeaponSeriesText(item);

        return (
          matchesKeyword &&
          (weaponRarity === "all" || getWeaponRarity(item) === weaponRarity) &&
          (weaponType === "all" ||
            type === weaponType ||
            (weaponType === "artsunit" && type === "artsUnit")) &&
          (weaponSeries === "all" || series === weaponSeries)
        );
      })
      .sort((a, b) => {
        const rarityA = getWeaponRarity(a);
        const rarityB = getWeaponRarity(b);
        if (rarityB !== rarityA) return rarityB - rarityA;
        const typeA = weaponTypeOrderMap[getWeaponType(a)] ?? 999;
        const typeB = weaponTypeOrderMap[getWeaponType(b)] ?? 999;
        if (typeA !== typeB) return typeA - typeB;
        return a.name.localeCompare(b.name, "ko");
      });
  }, [weaponSearch, weapons, weaponRarity, weaponType, weaponSeries]);


  const sortedGear = useMemo(() => {
    if (!gearPickerSlot) return [];

    const source =
      gearPickerSlot === "armor"
        ? armorItems
        : gearPickerSlot === "gloves"
          ? glovesItems
          : kitItems;

    const q = gearSearch.trim().toLowerCase();

    return source.filter((item) => {
      const keywordOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        String(item.enName ?? "").toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        String(item.setName ?? "").toLowerCase().includes(q);

      const setOk = gearSetFilter === "all" || item.setName === gearSetFilter;
      const abilityOk =
        gearAbilityFilter === "all" ||
        (item as any).abilityTypes?.includes(gearAbilityFilter);
      const attributeOk =
        gearAttributeFilter === "all" ||
        (item as any).attributeTypes?.includes(gearAttributeFilter);
      const qualityOk =
        gearQualityFilter === "all" || String(item.quality) === gearQualityFilter;
      const levelOk =
        gearLevelFilter === "all" || String(item.level) === gearLevelFilter;

      return keywordOk && setOk && abilityOk && attributeOk && qualityOk && levelOk;
    });
  }, [
    gearPickerSlot,
    armorItems,
    glovesItems,
    kitItems,
    gearSearch,
    gearSetFilter,
    gearAbilityFilter,
    gearAttributeFilter,
    gearQualityFilter,
    gearLevelFilter,
  ]);

  function openGearPicker(slot: GearSlot) {
    setGearPickerSlot(slot);
    setGearSearch("");
    setGearSetFilter("all");
    setGearAbilityFilter("all");
    setGearAttributeFilter("all");
    setGearQualityFilter("all");
    setGearLevelFilter("all");
  }

  if (!mounted) return null;

  return (
    <section className="relative overflow-visible rounded-[28px] border border-yellow-500/15 bg-[#05070b] shadow-[0_18px_70px_rgba(0,0,0,0.36)]">
      <div className="relative min-h-[620px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_35%_20%,rgba(255,210,74,0.14),transparent_34%),linear-gradient(135deg,#05070b,#020305)]">
        {operator ? (
          isDualOperator && isAdmin ? (
            <div className="absolute inset-0 grid grid-cols-2">
              <div className="relative overflow-hidden">
                <Image
                  src={adminAlt ? operatorImageSecondary : operatorImage}
                  alt={`${operator.name} 이미지 1`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain object-bottom"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src={adminAlt ? operatorImage : operatorImageSecondary}
                  alt={`${operator.name} 이미지 2`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          ) : (
            <Image
              src={operatorImage}
              alt={operator.name}
              fill
              priority
              sizes="100vw"
              className="object-contain object-bottom"
            />
          )
        ) : (
          <div className="absolute inset-4">
            <EmptyImage label="오퍼레이터를 선택해 주세요" />
          </div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.78)),linear-gradient(90deg,rgba(0,0,0,0.76),transparent_58%)]" />

        <div className="absolute left-4 top-4 z-20 md:left-6 md:top-6">
          <button
            type="button"
            onClick={() => setIsOperatorPickerOpen(true)}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black/65 px-4 text-sm font-bold text-yellow-200 backdrop-blur transition hover:border-yellow-400/45 hover:bg-black/80"
          >
            오퍼 선택
          </button>
        </div>

        <div className="absolute right-4 top-4 z-20 grid grid-cols-2 gap-2 md:right-6 md:top-6">
          {(["armor", "gloves", "kit1", "kit2"] as GearSlot[]).map((slot) => {
            const gear = selectedGearMap[slot];
            return (
              <button
                key={slot}
                type="button"
                onClick={() => openGearPicker(slot)}
                className="grid w-[132px] grid-cols-[38px_1fr] items-center gap-2 rounded-2xl border border-yellow-500/20 bg-black/65 p-2 text-left backdrop-blur transition hover:border-yellow-400/45 hover:bg-black/80"
              >
                <span className="relative h-9 w-9 overflow-hidden rounded-xl bg-black/70">
                  {gear ? (
                    <Image
                      src={getGearImage(gear)}
                      alt={gear.name}
                      fill
                      sizes="36px"
                      className="object-contain p-1"
                    />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-black text-yellow-300/70">
                    {getGearCategoryLabel(slot)}
                  </span>
                  <span className="block truncate text-xs font-black text-white">
                    {gear?.name ?? "장비 선택"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-6 right-6 z-20">
          <button
            type="button"
            onClick={() => setIsWeaponPickerOpen(true)}
            className="group grid w-[150px] gap-2 rounded-3xl border border-yellow-500/20 bg-black/65 p-3 text-left text-white backdrop-blur transition hover:border-yellow-400/45 hover:bg-black/80 sm:w-[180px]"
          >
            <div className="relative h-[96px] overflow-hidden rounded-2xl bg-black/70 sm:h-[120px]">
              {weapon && weaponImage ? (
                <Image
                  src={weaponImage}
                  alt={weapon.name}
                  fill
                  sizes="180px"
                  className="object-contain p-3"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-bold text-zinc-500">
                  무기 없음
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300/70">
                WEAPON
              </div>
              <div className="mt-1 truncate text-sm font-black text-white">
                {weapon?.name ?? "무기 선택"}
              </div>
            </div>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-[560px]">
            <div className="text-[11px] font-black uppercase tracking-[0.32em] text-yellow-300/80">
              OPERATOR
            </div>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
              {operator?.name ?? "오퍼레이터 미선택"}
            </h2>
            {operator?.enName ? (
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                {operator.enName}
              </p>
            ) : null}
            {!operator ? (
              <p className="mt-4 text-sm font-medium text-zinc-400">
                왼쪽 위 오퍼 선택 버튼을 눌러 오퍼레이터를 선택해 주세요.
              </p>
            ) : null}
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setAdminAlt((prev) => !prev)}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black/65 px-4 text-sm font-semibold text-yellow-200 backdrop-blur transition hover:border-yellow-400/45 hover:bg-black/80"
              >
                이미지 변경
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {isOperatorPickerOpen ? (
        <PickerShell
          title="OPERATORS"
          count={sortedOperators.length}
          searchValue={operatorSearch}
          searchPlaceholder="이름 / 클래스 / 속성 / 무기 검색"
          onSearch={setOperatorSearch}
          onClose={() => setIsOperatorPickerOpen(false)}
          aside={
            <>
              <FilterGroup title="레어도">
                <FilterButton
                  active={operatorRarity === "all"}
                  label="전체"
                  onClick={() => setOperatorRarity("all")}
                />
                {operatorRarityOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={operatorRarity === value}
                    label={`${value}성`}
                    iconSrc={rarityIconMap[value]}
                    color={rarityColorMap[value]}
                    onClick={() => setOperatorRarity(value)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="속성">
                <FilterButton
                  active={operatorElement === "all"}
                  label="전체"
                  onClick={() => setOperatorElement("all")}
                />
                {Object.entries(elementLabelMap).map(([key, label]) => (
                  <FilterButton
                    key={key}
                    active={operatorElement === key}
                    label={label}
                    iconSrc={elementIconMap[key]}
                    color={elementColorMap[key]}
                    onClick={() => setOperatorElement(key as OperatorElement)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="클래스">
                <FilterButton
                  active={operatorClass === "all"}
                  label="전체"
                  onClick={() => setOperatorClass("all")}
                />
                {Object.entries(classLabelMap).map(([key, label]) => (
                  <FilterButton
                    key={key}
                    active={operatorClass === key}
                    label={label}
                    iconSrc={classIconMap[key]}
                    onClick={() => setOperatorClass(key as OperatorClass)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="무기" last>
                <FilterButton
                  active={operatorWeapon === "all"}
                  label="전체"
                  onClick={() => setOperatorWeapon("all")}
                />
                {Object.entries(operatorWeaponLabelMap).map(([key, label]) => (
                  <FilterButton
                    key={key}
                    active={operatorWeapon === key}
                    label={label}
                    iconSrc={weaponIconMap[key]}
                    onClick={() => setOperatorWeapon(key as WeaponType)}
                  />
                ))}
              </FilterGroup>
            </>
          }
        >
          {sortedOperators.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 overflow-y-auto pr-1">
              {sortedOperators.map((item) => (
                <OperatorCard
                  key={item.slug}
                  operator={
                    item as OperatorDetail & { avatarSecondary?: string }
                  }
                  active={item.slug === selectedOperatorSlug}
                  onClick={() => {
                    onSelectOperator(item.slug);
                    setIsOperatorPickerOpen(false);
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-black p-6 text-center text-sm text-zinc-500"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              조건에 맞는 오퍼레이터가 없습니다.
            </div>
          )}
        </PickerShell>
      ) : null}

      {isWeaponPickerOpen ? (
        <PickerShell
          title="WEAPONS"
          count={sortedWeapons.length}
          searchValue={weaponSearch}
          searchPlaceholder="이름 / 무기 유형 / 시리즈 검색"
          onSearch={setWeaponSearch}
          onClose={() => setIsWeaponPickerOpen(false)}
          aside={
            <>
              <FilterGroup title="레어도">
                <FilterButton
                  active={weaponRarity === "all"}
                  label="전체"
                  onClick={() => setWeaponRarity("all")}
                />
                {weaponRarityOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={weaponRarity === value}
                    label={`${value}성`}
                    iconSrc={rarityIconMap[value]}
                    color={rarityColorMap[value]}
                    onClick={() => setWeaponRarity(value)}
                  />
                ))}
              </FilterGroup>
              <FilterGroup title="무기 유형">
                <FilterButton
                  active={weaponType === "all"}
                  label="전체"
                  onClick={() => setWeaponType("all")}
                />
                {weaponTypeOrder.map((value) => (
                  <FilterButton
                    key={value}
                    active={weaponType === value}
                    label={weaponTypeLabelMap[value]}
                    iconSrc={weaponIconMap[value]}
                    onClick={() => setWeaponType(value)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="시리즈" last>
                <FilterButton
                  active={weaponSeries === "all"}
                  label="전체"
                  onClick={() => setWeaponSeries("all")}
                />
                {weaponSeriesOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={weaponSeries === value}
                    label={value}
                    onClick={() => setWeaponSeries(value)}
                  />
                ))}
              </FilterGroup>
            </>
          }
        >
          {sortedWeapons.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 overflow-y-auto pr-1">
              {sortedWeapons.map((item) => (
                <WeaponCard
                  key={item.slug}
                  weapon={item}
                  active={item.slug === selectedWeaponSlug}
                  onClick={() => {
                    onSelectWeapon(item.slug);
                    setIsWeaponPickerOpen(false);
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-black p-6 text-center text-sm text-zinc-500"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              조건에 맞는 무기가 없습니다.
            </div>
          )}
        </PickerShell>
      ) : null}

      {gearPickerSlot ? (
        <PickerShell
          title={`${getGearCategoryLabel(gearPickerSlot)} 선택`}
          count={sortedGear.length}
          searchValue={gearSearch}
          searchPlaceholder="이름 / 세트 / 코드 검색"
          onSearch={setGearSearch}
          onClose={() => setGearPickerSlot(null)}
          aside={
            <>
              <FilterGroup title="세트 유형">
                <FilterButton
                  active={gearSetFilter === "all"}
                  label="전체"
                  onClick={() => setGearSetFilter("all")}
                />
                {gearSets.map((setName) => (
                  <FilterButton
                    key={setName}
                    active={gearSetFilter === setName}
                    label={setName}
                    onClick={() => setGearSetFilter(setName)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="속성">
                {gearAttributeOptions.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={gearAttributeFilter === option.value}
                    label={option.label}
                    onClick={() => setGearAttributeFilter(option.value)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="능력치">
                {gearAbilityOptions.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={gearAbilityFilter === option.value}
                    label={option.label}
                    onClick={() => setGearAbilityFilter(option.value)}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="품질">
                <FilterButton
                  active={gearQualityFilter === "all"}
                  label="전체"
                  onClick={() => setGearQualityFilter("all")}
                />
                {[5, 4, 3, 2, 1].map((value) => (
                  <FilterButton
                    key={value}
                    active={gearQualityFilter === String(value)}
                    label={`${value}품질`}
                    color={qualityColorMap[value]}
                    onClick={() => setGearQualityFilter(String(value))}
                  />
                ))}
              </FilterGroup>

              <FilterGroup title="장비 레벨" last>
                <FilterButton
                  active={gearLevelFilter === "all"}
                  label="전체"
                  onClick={() => setGearLevelFilter("all")}
                />
                {[70, 50, 36, 28, 20, 10].map((level) => (
                  <FilterButton
                    key={level}
                    active={gearLevelFilter === String(level)}
                    label={`Lv. ${level}`}
                    onClick={() => setGearLevelFilter(String(level))}
                  />
                ))}
              </FilterGroup>
            </>
          }
        >
          {sortedGear.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 overflow-y-auto pr-1">
              {sortedGear.map((item) => (
                <GearCard
                  key={item.slug}
                  gear={item}
                  active={item.slug === selectedGearSlugMap[gearPickerSlot]}
                  onClick={() => {
                    onSelectGear(gearPickerSlot, item.slug);
                    setGearPickerSlot(null);
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-black p-6 text-center text-sm text-zinc-500"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              조건에 맞는 장비가 없습니다.
            </div>
          )}
        </PickerShell>
      ) : null}

    </section>
  );
}
