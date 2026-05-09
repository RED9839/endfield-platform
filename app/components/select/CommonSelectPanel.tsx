"use client";

import { useMemo, useState } from "react";

import { operatorDetails } from "@/data/operators-detail-data";
import type { OperatorDetail } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import type { SourceWeaponDetail } from "@/data/weapons-detail-data";
import { gearDetails } from "@/data/gear-detail-data";
import type { GearDetail } from "@/data/gear-types";
import { sortOperatorSelectList } from "@/data/operator-sort";
import { sortWeaponSelectList } from "@/data/weapons-sort";
import { gearSetOrder, sortGearSelectList } from "@/data/gear-sort";

import PickerShell from "./PickerShell";
import SelectFilterButton from "./FilterButton";
import SelectFilterGroup from "./FilterGroup";
import OperatorSelectCard from "./OperatorSelectCard";
import WeaponSelectCard from "./WeaponSelectCard";
import GearSelectCard from "./GearSelectCard";

export type CommonSelectKind = "operator" | "weapon" | "gear";
export type CommonGearSlot = "armor" | "gloves" | "kit1" | "kit2";

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
};

type CommonSelectPanelProps = {
  kind: CommonSelectKind;
  gearSlot?: CommonGearSlot;
  title?: string;
  selectedSlug?: string;
  onClose: () => void;
  onSelectOperator?: (slug: string) => void;
  onSelectWeapon?: (slug: string) => void;
  onSelectGear?: (slot: CommonGearSlot, slug: string) => void;
};

const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
};

const qualityColorMap: Record<number, string> = {
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
  2: "#84cc16",
  1: "#9ca3af",
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

const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검",
  artsunit: "아츠 유닛",
  artsUnit: "아츠 유닛",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
};

const weaponTypeOrder = [
  "sword",
  "artsunit",
  "artsUnit",
  "greatsword",
  "polearm",
  "handcannon",
] as const;

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

function orderIndex(list: readonly string[], value: unknown) {
  const index = list.indexOf(String(value ?? ""));
  return index >= 0 ? index : 999;
}

function readText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const candidates = [obj.label, obj.name, obj.title, obj.key, obj.enName, obj.description];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    }
  }
  return "";
}

function getWeaponType(item: WeaponLike) {
  return String(item.weaponType ?? item.type ?? "");
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

function getGearTitle(slot?: CommonGearSlot) {
  if (slot === "armor") return "방어구 선택";
  if (slot === "gloves") return "보호 장갑 선택";
  if (slot === "kit1") return "부품 1 선택";
  if (slot === "kit2") return "부품 2 선택";
  return "장비 선택";
}

function getGearSource(slot?: CommonGearSlot) {
  const items = sortGearSelectList(gearDetails);
  if (slot === "armor") return items.filter((item) => item.category === "armor");
  if (slot === "gloves") return items.filter((item) => item.category === "gloves");
  if (slot === "kit1" || slot === "kit2") return items.filter((item) => item.category === "kit");
  return items;
}

export default function CommonSelectPanel({
  kind,
  gearSlot,
  title,
  selectedSlug,
  onClose,
  onSelectOperator,
  onSelectWeapon,
  onSelectGear,
}: CommonSelectPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [elementFilter, setElementFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [operatorWeaponFilter, setOperatorWeaponFilter] = useState("all");
  const [weaponTypeFilter, setWeaponTypeFilter] = useState("all");
  const [seriesFilter, setSeriesFilter] = useState("all");
  const [gearSetFilter, setGearSetFilter] = useState("all");
  const [gearAbilityFilter, setGearAbilityFilter] = useState("all");
  const [gearAttributeFilter, setGearAttributeFilter] = useState("all");
  const [gearLevelFilter, setGearLevelFilter] = useState("all");

  const operators = useMemo(() => sortOperatorSelectList(operatorDetails), []);
  const weapons = useMemo(() => sortWeaponSelectList(weaponDetails) as WeaponLike[], []);
  const gears = useMemo(() => getGearSource(gearSlot), [gearSlot]);

  const operatorWeaponTypes = useMemo(
    () =>
      Array.from(
        new Set(
          operators
            .map((item) => String((item as any).weapon ?? (item as any).weaponType ?? ""))
            .filter(Boolean),
        ),
      ).sort((a, b) => orderIndex(weaponTypeOrder, a) - orderIndex(weaponTypeOrder, b)),
    [operators],
  );

  const weaponTypes = useMemo(
    () =>
      Array.from(new Set(weapons.map(getWeaponType).filter(Boolean))).sort(
        (a, b) => orderIndex(weaponTypeOrder, a) - orderIndex(weaponTypeOrder, b),
      ),
    [weapons],
  );

  const weaponSeries = useMemo(
    () => Array.from(new Set(weapons.map(getWeaponSeriesText).filter(Boolean))),
    [weapons],
  );

  const gearSets = useMemo(
    () =>
      Array.from(new Set(gears.map((item) => item.setName).filter(Boolean) as string[])).sort(
        (a, b) => orderIndex(gearSetOrder, a) - orderIndex(gearSetOrder, b),
      ),
    [gears],
  );

  const filteredOperators = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return operators.filter((item: OperatorDetail) => {
      const raw = item as any;
      const keywordOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q);
      const rarityOk = rarityFilter === "all" || String(raw.rarity) === rarityFilter;
      const elementOk = elementFilter === "all" || String(raw.element) === elementFilter;
      const classOk = classFilter === "all" || String(raw.class) === classFilter;
      const weaponOk =
        operatorWeaponFilter === "all" ||
        String(raw.weapon) === operatorWeaponFilter ||
        String(raw.weaponType) === operatorWeaponFilter;

      return keywordOk && rarityOk && elementOk && classOk && weaponOk;
    });
  }, [operators, keyword, rarityFilter, elementFilter, classFilter, operatorWeaponFilter]);

  const filteredWeapons = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return weapons.filter((item) => {
      const seriesText = getWeaponSeriesText(item);
      const keywordOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        getWeaponType(item).toLowerCase().includes(q) ||
        seriesText.toLowerCase().includes(q);
      const rarityOk = rarityFilter === "all" || String(getWeaponRarity(item)) === rarityFilter;
      const typeOk = weaponTypeFilter === "all" || getWeaponType(item) === weaponTypeFilter;
      const seriesOk = seriesFilter === "all" || seriesText === seriesFilter;

      return keywordOk && rarityOk && typeOk && seriesOk;
    });
  }, [weapons, keyword, rarityFilter, weaponTypeFilter, seriesFilter]);

  const filteredGear = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return gears.filter((item: GearDetail) => {
      const raw = item as any;
      const keywordOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        String(item.setName ?? "").toLowerCase().includes(q);
      const setOk = gearSetFilter === "all" || item.setName === gearSetFilter;
      const abilityOk = gearAbilityFilter === "all" || raw.abilityTypes?.includes(gearAbilityFilter);
      const attributeOk = gearAttributeFilter === "all" || raw.attributeTypes?.includes(gearAttributeFilter);
      const qualityOk = rarityFilter === "all" || String(item.quality) === rarityFilter;
      const levelOk = gearLevelFilter === "all" || String(item.level) === gearLevelFilter;

      return keywordOk && setOk && abilityOk && attributeOk && qualityOk && levelOk;
    });
  }, [gears, keyword, gearSetFilter, gearAbilityFilter, gearAttributeFilter, rarityFilter, gearLevelFilter]);

  const count =
    kind === "operator"
      ? filteredOperators.length
      : kind === "weapon"
        ? filteredWeapons.length
        : filteredGear.length;

  return (
    <PickerShell
      title={title ?? (kind === "operator" ? "오퍼레이터 선택" : kind === "weapon" ? "무기 선택" : getGearTitle(gearSlot))}
      count={count}
      searchValue={keyword}
      searchPlaceholder="이름 / 코드 검색"
      onSearch={setKeyword}
      onClose={onClose}
      aside={
        <>
          {kind !== "gear" ? (
            <SelectFilterGroup title="레어도">
              <SelectFilterButton active={rarityFilter === "all"} label="전체" onClick={() => setRarityFilter("all")} />
              {(kind === "operator" ? [6, 5, 4] : [6, 5, 4, 3]).map((value) => (
                <SelectFilterButton
                  key={value}
                  active={rarityFilter === String(value)}
                  label={`${value}성`}
                  iconSrc={rarityIconMap[value]}
                  onClick={() => setRarityFilter(String(value))}
                />
              ))}
            </SelectFilterGroup>
          ) : null}

          {kind === "operator" ? (
            <>
              <SelectFilterGroup title="속성">
                <SelectFilterButton active={elementFilter === "all"} label="전체" onClick={() => setElementFilter("all")} />
                {Object.entries(elementLabelMap).map(([key, label]) => (
                  <SelectFilterButton
                    key={key}
                    active={elementFilter === key}
                    label={label}
                    iconSrc={elementIconMap[key]}
                    onClick={() => setElementFilter(key)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="클래스">
                <SelectFilterButton active={classFilter === "all"} label="전체" onClick={() => setClassFilter("all")} />
                {Object.entries(classLabelMap).map(([key, label]) => (
                  <SelectFilterButton
                    key={key}
                    active={classFilter === key}
                    label={label}
                    iconSrc={classIconMap[key]}
                    onClick={() => setClassFilter(key)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="무기" last>
                <SelectFilterButton active={operatorWeaponFilter === "all"} label="전체" onClick={() => setOperatorWeaponFilter("all")} />
                {operatorWeaponTypes.map((type) => (
                  <SelectFilterButton
                    key={type}
                    active={operatorWeaponFilter === type}
                    label={weaponTypeLabelMap[type] ?? type}
                    iconSrc={weaponIconMap[type]}
                    onClick={() => setOperatorWeaponFilter(type)}
                  />
                ))}
              </SelectFilterGroup>
            </>
          ) : null}

          {kind === "weapon" ? (
            <>
              <SelectFilterGroup title="무기 타입">
                <SelectFilterButton active={weaponTypeFilter === "all"} label="전체" onClick={() => setWeaponTypeFilter("all")} />
                {weaponTypes.map((type) => (
                  <SelectFilterButton
                    key={type}
                    active={weaponTypeFilter === type}
                    label={weaponTypeLabelMap[type] ?? type}
                    iconSrc={weaponIconMap[type]}
                    onClick={() => setWeaponTypeFilter(type)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="시리즈" last>
                <SelectFilterButton active={seriesFilter === "all"} label="전체" onClick={() => setSeriesFilter("all")} />
                {weaponSeries.map((series) => (
                  <SelectFilterButton
                    key={series}
                    active={seriesFilter === series}
                    label={series}
                    onClick={() => setSeriesFilter(series)}
                  />
                ))}
              </SelectFilterGroup>
            </>
          ) : null}

          {kind === "gear" ? (
            <>
              <SelectFilterGroup title="세트 유형">
                <SelectFilterButton active={gearSetFilter === "all"} label="전체" onClick={() => setGearSetFilter("all")} />
                {gearSets.map((setName) => (
                  <SelectFilterButton
                    key={setName}
                    active={gearSetFilter === setName}
                    label={setName}
                    onClick={() => setGearSetFilter(setName)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="속성">
                {gearAttributeOptions.map((option) => (
                  <SelectFilterButton
                    key={option.value}
                    active={gearAttributeFilter === option.value}
                    label={option.label}
                    onClick={() => setGearAttributeFilter(option.value)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="능력치">
                {gearAbilityOptions.map((option) => (
                  <SelectFilterButton
                    key={option.value}
                    active={gearAbilityFilter === option.value}
                    label={option.label}
                    onClick={() => setGearAbilityFilter(option.value)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="품질">
                <SelectFilterButton active={rarityFilter === "all"} label="전체" onClick={() => setRarityFilter("all")} />
                {[5, 4, 3, 2, 1].map((value) => (
                  <SelectFilterButton
                    key={value}
                    active={rarityFilter === String(value)}
                    label={`${value}품질`}
                    color={qualityColorMap[value]}
                    onClick={() => setRarityFilter(String(value))}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="장비 레벨" last>
                <SelectFilterButton active={gearLevelFilter === "all"} label="전체" onClick={() => setGearLevelFilter("all")} />
                {[70, 50, 36, 28, 20, 10].map((level) => (
                  <SelectFilterButton
                    key={level}
                    active={gearLevelFilter === String(level)}
                    label={`Lv. ${level}`}
                    onClick={() => setGearLevelFilter(String(level))}
                  />
                ))}
              </SelectFilterGroup>
            </>
          ) : null}
        </>
      }
    >
      {kind === "operator" ? (
        filteredOperators.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 overflow-y-auto pr-1">
            {filteredOperators.map((operator) => (
              <OperatorSelectCard
                key={operator.slug}
                operator={operator}
                active={operator.slug === selectedSlug}
                onClick={() => {
                  onSelectOperator?.(operator.slug);
                  onClose();
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyResult label="조건에 맞는 오퍼레이터가 없습니다." />
        )
      ) : null}

      {kind === "weapon" ? (
        filteredWeapons.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 overflow-y-auto pr-1">
            {filteredWeapons.map((weapon) => (
              <WeaponSelectCard
                key={weapon.slug}
                weapon={weapon}
                active={weapon.slug === selectedSlug}
                onClick={() => {
                  onSelectWeapon?.(weapon.slug);
                  onClose();
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyResult label="조건에 맞는 무기가 없습니다." />
        )
      ) : null}

      {kind === "gear" ? (
        filteredGear.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 overflow-y-auto pr-1">
            {filteredGear.map((gear) => (
              <GearSelectCard
                key={gear.slug}
                gear={gear}
                active={gear.slug === selectedSlug}
                onClick={() => {
                  if (gearSlot) onSelectGear?.(gearSlot, gear.slug);
                  onClose();
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyResult label="조건에 맞는 장비가 없습니다." />
        )
      ) : null}
    </PickerShell>
  );
}

function EmptyResult({ label }: { label: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-[20px] border border-yellow-500/10 bg-black p-6 text-center text-sm text-zinc-500">
      {label}
    </div>
  );
}
