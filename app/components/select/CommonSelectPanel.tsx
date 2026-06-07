"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { sortOperatorSelectList } from "@/data/operator-sort";
import { sortWeaponSelectList } from "@/data/weapons-sort";
import { gearSetOrder, sortGearSelectList } from "@/data/gear-sort";

import PickerShell from "./PickerShell";
import SelectFilterButton from "./FilterButton";
import SelectFilterGroup from "./FilterGroup";

const OperatorSelectCard = dynamic(() => import("./OperatorSelectCard"), {
  ssr: false,
});
const WeaponSelectCard = dynamic(() => import("./WeaponSelectCard"), {
  ssr: false,
});
const GearSelectCard = dynamic(() => import("./GearSelectCard"), {
  ssr: false,
});

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

export type SelectOperatorItem = {
  slug: string;
  name: string;
  enName: string;
  rarity: number;
  element: string;
  class: string;
  weapon?: string;
  weaponType?: string;
  avatar?: string;
  avatarSecondary?: string;
  fullImage?: string;
  image?: string;
};

export type SelectWeaponItem = {
  slug: string;
  name: string;
  enName: string;
  rarity?: number;
  quality?: number;
  type?: string;
  weaponType?: string;
  image: string;
  fullImage?: string;
  avatar?: string;
  series?: unknown;
  seriesName?: unknown;
  seriesSkill?: unknown;
  weaponSeries?: unknown;
  skill?: unknown;
  weaponSkill?: unknown;
  passive?: unknown;
};

export type SelectGearItem = {
  slug: string;
  name: string;
  enName: string;
  image: string;
  quality: number;
  level: number;
  category: "armor" | "gloves" | "kit";
  setName: string;
  abilityTypes?: string[];
  attributeTypes?: string[];
};

type SourceWeaponDetail = SelectWeaponItem;
type GearDetail = SelectGearItem;

type CommonSelectPanelProps = {
  kind: CommonSelectKind;
  gearSlot?: CommonGearSlot;
  title?: string;
  selectedSlug?: string;
  requiredWeaponType?: string;
  allowAllWeapons?: boolean;
  operators: SelectOperatorItem[];
  weapons: SelectWeaponItem[];
  gears: SelectGearItem[];
  onClose: () => void;
  onSelectOperator?: (slug: string) => void;
  onSelectWeapon?: (slug: string) => void;
  onSelectGear?: (slot: CommonGearSlot, slug: string) => void;
};

const SETTINGS_FORM_STORAGE_KEY = "endfield-operator-setting-form-v1";
const gearSetOrderText = gearSetOrder.map(String);

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

const qualityLabelMap: Record<number, string> = {
  5: "노란색 품질",
  4: "보라색 품질",
  3: "파란색 품질",
  2: "초록색 품질",
  1: "회색 품질",
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

function normalizeWeaponType(value: unknown) {
  const text = String(value ?? "").trim();
  const lower = text.toLowerCase().replace(/[\s_-]/g, "");

  if (lower === "artsunit" || lower === "arts") return "artsunit";
  if (lower === "handcannon" || lower === "pistol") return "handcannon";
  if (lower === "greatsword") return "greatsword";
  if (lower === "polearm") return "polearm";
  if (lower === "sword") return "sword";

  return text;
}

function orderWeaponTypeIndex(value: unknown) {
  const index = weaponTypeOrder.indexOf(normalizeWeaponType(value) as any);
  return index >= 0 ? index : 999;
}

function orderGearSetIndex(value: unknown) {
  const index = gearSetOrderText.indexOf(String(value ?? ""));
  return index >= 0 ? index : 999;
}

function readText(sourceValue: unknown): string {
  if (!sourceValue) return "";
  if (typeof sourceValue === "string") return sourceValue.trim();

  if (typeof sourceValue === "object") {
    const sourceObject = sourceValue as Record<string, unknown>;
    const candidates = [
      sourceObject.label,
      sourceObject.name,
      sourceObject.title,
      sourceObject.key,
      sourceObject.enName,
      sourceObject.description,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return "";
}

function getWeaponType(weapon: WeaponLike) {
  return normalizeWeaponType(weapon.weaponType ?? weapon.type ?? "");
}

function getOperatorWeaponType(operator: any) {
  return normalizeWeaponType(
    operator?.weaponType ??
      operator?.weapon ??
      operator?.weaponKey ??
      operator?.weaponClass ??
      operator?.weaponCategory ??
      "",
  );
}

function getCurrentPathname() {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

function isSettingsListPage() {
  return getCurrentPathname() === "/settings";
}

function isSettingsEditorPage() {
  const pathname = getCurrentPathname();
  return pathname.startsWith("/settings/");
}

function readSelectedOperatorWeaponType(operators: SelectOperatorItem[]) {
  if (typeof window === "undefined") return "";

  // 세팅 등록/수정 페이지에서만 세팅 폼 저장값을 읽습니다.
  // /settings 목록 검색이나 /simulator 선택값이 섞이면 무기 선택이 한손검 등으로 고정될 수 있습니다.
  if (!isSettingsEditorPage()) return "";

  try {
    const raw = window.localStorage.getItem(SETTINGS_FORM_STORAGE_KEY);
    const form = raw ? JSON.parse(raw) : null;
    const operatorSlug = String(form?.operatorSlug ?? "");
    const operator = operators.find((item) => item.slug === operatorSlug);

    return operator ? getOperatorWeaponType(operator as any) : "";
  } catch {
    return "";
  }
}

function getWeaponRarity(weapon: WeaponLike) {
  return Number(weapon.rarity ?? weapon.quality ?? 3);
}

function getWeaponSeriesText(weapon: WeaponLike) {
  const raw = [
    weapon.seriesSkill,
    weapon.series,
    weapon.weaponSeries,
    weapon.seriesName,
    weapon.skill,
    weapon.weaponSkill,
    weapon.passive,
  ]
    .map(readText)
    .find(Boolean) ?? "";

  const lower = raw.toLowerCase();
  if (raw.includes("고통") || lower.includes("pain")) return "고통";
  if (raw.includes("골절") || lower.includes("fracture")) return "골절";
  if (raw.includes("기예") || raw.includes("기교") || lower.includes("technique")) return "기예";
  if (raw.includes("방출") || lower.includes("release")) return "방출";
  if (raw.includes("분쇄") || lower.includes("crush")) return "분쇄";
  if (raw.includes("사기") || lower.includes("morale")) return "사기";
  if (raw.includes("어둠") || lower.includes("dark")) return "어둠";
  if (raw.includes("억제") || raw.includes("제압") || lower.includes("suppress")) return "억제";
  if (raw.includes("의료") || raw.includes("치유") || lower.includes("medical") || lower.includes("heal")) return "의료";
  if (raw.includes("잔혹") || lower.includes("brutality")) return "잔혹";
  if (raw.includes("추격") || lower.includes("pursuit")) return "추격";
  if (raw.includes("효율") || lower.includes("efficiency")) return "효율";
  if (raw.includes("흐름") || lower.includes("flow")) return "흐름";
  if (raw.includes("강공") || lower.includes("heavystrike") || lower.includes("heavy")) return "강공";

  return raw;
}

function getGearTitle(slot?: CommonGearSlot) {
  if (slot === "armor") return "방어구 선택";
  if (slot === "gloves") return "보호 장갑 선택";
  if (slot === "kit1") return "부품 1 선택";
  if (slot === "kit2") return "부품 2 선택";
  return "장비 선택";
}

function getGearSource(gears: SelectGearItem[], gearSlot?: CommonGearSlot) {
  const sortedGears = sortGearSelectList(gears as any) as SelectGearItem[];
  if (gearSlot === "armor") return sortedGears.filter((gear) => gear.category === "armor");
  if (gearSlot === "gloves") return sortedGears.filter((gear) => gear.category === "gloves");
  if (gearSlot === "kit1" || gearSlot === "kit2") {
    return sortedGears.filter((gear) => gear.category === "kit");
  }
  return sortedGears;
}

function toggleLimitedFilter(current: string[], value: string, limit = 2) {
  if (value === "all") return [];
  if (current.includes(value)) return current.filter((item) => item !== value);
  return [...current, value].slice(-limit);
}

function gearTypeMatches(types: unknown, selected: string) {
  const values = Array.isArray(types) ? types.map(String) : [];
  return values.includes(selected);
}

export default function CommonSelectPanel({
  kind,
  gearSlot,
  title,
  selectedSlug,
  requiredWeaponType: requiredWeaponTypeProp,
  allowAllWeapons,
  operators,
  weapons,
  gears,
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
  const [gearAbilityFilters, setGearAbilityFilters] = useState<string[]>([]);
  const [gearAttributeFilter, setGearAttributeFilter] = useState("all");
  const [gearLevelFilter, setGearLevelFilter] = useState("all");
  const [requiredWeaponType, setRequiredWeaponType] = useState("");
  const [allowAllWeaponList, setAllowAllWeaponList] = useState(Boolean(allowAllWeapons));

  useEffect(() => {
    if (kind !== "weapon") return;

    const nextRequiredWeaponType =
      requiredWeaponTypeProp !== undefined
        ? normalizeWeaponType(requiredWeaponTypeProp)
        : readSelectedOperatorWeaponType(operators);

    setRequiredWeaponType(nextRequiredWeaponType);
    setAllowAllWeaponList(Boolean(allowAllWeapons) || isSettingsListPage());
    setWeaponTypeFilter("all");
  }, [kind, requiredWeaponTypeProp, allowAllWeapons, operators]);

  const operatorList = useMemo(() => sortOperatorSelectList(operators), [operators]);
  const weaponList = useMemo(
    () => sortWeaponSelectList(weapons) as WeaponLike[],
    [weapons],
  );
  const gearList = useMemo(() => getGearSource(gears, gearSlot), [gears, gearSlot]);

  const operatorWeaponTypes = useMemo(
    () =>
      Array.from(
        new Set(
          operatorList
            .map((operator) => getOperatorWeaponType(operator as any))
            .filter(Boolean),
        ),
      ).sort((a, b) => orderWeaponTypeIndex(a) - orderWeaponTypeIndex(b)),
    [operatorList],
  );

  const weaponTypes = useMemo(
    () =>
      Array.from(new Set(weaponList.map(getWeaponType).filter(Boolean))).sort(
        (a, b) => orderWeaponTypeIndex(a) - orderWeaponTypeIndex(b),
      ),
    [weaponList],
  );

  const visibleWeaponTypes = requiredWeaponType ? [requiredWeaponType] : weaponTypes;

  const weaponSeries = useMemo(
    () => Array.from(new Set(weaponList.map(getWeaponSeriesText).filter(Boolean))),
    [weaponList],
  );

  const gearSets = useMemo(
    () =>
      Array.from(
        new Set(gearList.map((gear) => String(gear.setName ?? "")).filter(Boolean)),
      ).sort((a, b) => orderGearSetIndex(a) - orderGearSetIndex(b)),
    [gearList],
  );

  const filteredOperators = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return operatorList.filter((operator: SelectOperatorItem) => {
      const rawOperator = operator as any;
      const operatorWeaponType = getOperatorWeaponType(rawOperator);
      const matchesKeyword =
        !normalizedKeyword ||
        operator.name.toLowerCase().includes(normalizedKeyword) ||
        operator.enName.toLowerCase().includes(normalizedKeyword) ||
        operator.slug.toLowerCase().includes(normalizedKeyword);
      const matchesRarity = rarityFilter === "all" || String(rawOperator.rarity) === rarityFilter;
      const matchesElement = elementFilter === "all" || String(rawOperator.element) === elementFilter;
      const matchesClass = classFilter === "all" || String(rawOperator.class) === classFilter;
      const matchesWeapon = operatorWeaponFilter === "all" || operatorWeaponType === operatorWeaponFilter;

      return matchesKeyword && matchesRarity && matchesElement && matchesClass && matchesWeapon;
    });
  }, [operatorList, keyword, rarityFilter, elementFilter, classFilter, operatorWeaponFilter]);

  const filteredWeapons = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!requiredWeaponType && !allowAllWeaponList) return [];

    return weaponList.filter((weapon) => {
      const currentWeaponType = getWeaponType(weapon);
      const weaponSeriesText = getWeaponSeriesText(weapon);
      const matchesKeyword =
        !normalizedKeyword ||
        weapon.name.toLowerCase().includes(normalizedKeyword) ||
        weapon.enName.toLowerCase().includes(normalizedKeyword) ||
        weapon.slug.toLowerCase().includes(normalizedKeyword) ||
        currentWeaponType.toLowerCase().includes(normalizedKeyword) ||
        weaponSeriesText.toLowerCase().includes(normalizedKeyword);
      const matchesRequiredType = !requiredWeaponType || currentWeaponType === requiredWeaponType;
      const matchesRarity = rarityFilter === "all" || String(getWeaponRarity(weapon)) === rarityFilter;
      const matchesType = weaponTypeFilter === "all" || currentWeaponType === weaponTypeFilter;
      const matchesSeries = seriesFilter === "all" || weaponSeriesText === seriesFilter;

      return matchesRequiredType && matchesKeyword && matchesRarity && matchesType && matchesSeries;
    });
  }, [weaponList, keyword, rarityFilter, weaponTypeFilter, seriesFilter, requiredWeaponType, allowAllWeaponList]);

  const filteredGears = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return gearList.filter((gear: GearDetail) => {
      const rawGear = gear as any;
      const matchesKeyword =
        !normalizedKeyword ||
        gear.name.toLowerCase().includes(normalizedKeyword) ||
        gear.enName.toLowerCase().includes(normalizedKeyword) ||
        gear.slug.toLowerCase().includes(normalizedKeyword) ||
        String(gear.setName ?? "").toLowerCase().includes(normalizedKeyword);
      const matchesSet = gearSetFilter === "all" || String(gear.setName ?? "") === gearSetFilter;
      const matchesAbility =
        gearAbilityFilters.length === 0 ||
        gearAbilityFilters.every((filter) => gearTypeMatches(rawGear.abilityTypes, filter));
      const matchesAttribute =
        gearAttributeFilter === "all" || gearTypeMatches(rawGear.attributeTypes, gearAttributeFilter);
      const matchesQuality = rarityFilter === "all" || String(gear.quality) === rarityFilter;
      const matchesLevel = gearLevelFilter === "all" || String(gear.level) === gearLevelFilter;

      return matchesKeyword && matchesSet && matchesAbility && matchesAttribute && matchesQuality && matchesLevel;
    });
  }, [gearList, keyword, gearSetFilter, gearAbilityFilters, gearAttributeFilter, rarityFilter, gearLevelFilter]);

  const resultCount =
    kind === "operator"
      ? filteredOperators.length
      : kind === "weapon"
        ? filteredWeapons.length
        : filteredGears.length;

  return (
    <PickerShell
      title={title ?? (kind === "operator" ? "오퍼레이터 선택" : kind === "weapon" ? "무기 선택" : getGearTitle(gearSlot))}
      count={resultCount}
      searchValue={keyword}
      searchPlaceholder="이름 / 코드 검색"
      onSearch={setKeyword}
      onClose={onClose}
      aside={
        <>
          {kind !== "gear" ? (
            <SelectFilterGroup title="등급">
              <SelectFilterButton active={rarityFilter === "all"} label="전체" onClick={() => setRarityFilter("all")} />
              {(kind === "operator" ? [6, 5, 4] : [6, 5, 4, 3]).map((rarityOption) => (
                <SelectFilterButton
                  key={rarityOption}
                  active={rarityFilter === String(rarityOption)}
                  label={`${rarityOption}성`}
                  iconSrc={rarityIconMap[rarityOption]}
                  onClick={() => setRarityFilter(String(rarityOption))}
                />
              ))}
            </SelectFilterGroup>
          ) : null}

          {kind === "operator" ? (
            <>
              <SelectFilterGroup title="속성">
                <SelectFilterButton active={elementFilter === "all"} label="전체" onClick={() => setElementFilter("all")} />
                {Object.entries(elementLabelMap).map(([elementKey, elementLabel]) => (
                  <SelectFilterButton
                    key={elementKey}
                    active={elementFilter === elementKey}
                    label={elementLabel}
                    iconSrc={elementIconMap[elementKey]}
                    onClick={() => setElementFilter(elementKey)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="클래스">
                <SelectFilterButton active={classFilter === "all"} label="전체" onClick={() => setClassFilter("all")} />
                {Object.entries(classLabelMap).map(([classKey, classLabel]) => (
                  <SelectFilterButton
                    key={classKey}
                    active={classFilter === classKey}
                    label={classLabel}
                    iconSrc={classIconMap[classKey]}
                    onClick={() => setClassFilter(classKey)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="무기" last>
                <SelectFilterButton active={operatorWeaponFilter === "all"} label="전체" onClick={() => setOperatorWeaponFilter("all")} />
                {operatorWeaponTypes.map((weaponType) => (
                  <SelectFilterButton
                    key={weaponType}
                    active={operatorWeaponFilter === weaponType}
                    label={weaponTypeLabelMap[weaponType] ?? weaponType}
                    iconSrc={weaponIconMap[weaponType]}
                    onClick={() => setOperatorWeaponFilter(weaponType)}
                  />
                ))}
              </SelectFilterGroup>
            </>
          ) : null}

          {kind === "weapon" ? (
            <>
              <SelectFilterGroup title="무기 유형">
                <SelectFilterButton active={weaponTypeFilter === "all"} label="전체" onClick={() => setWeaponTypeFilter("all")} />
                {visibleWeaponTypes.map((weaponType) => (
                  <SelectFilterButton
                    key={weaponType}
                    active={weaponTypeFilter === weaponType || Boolean(requiredWeaponType)}
                    label={weaponTypeLabelMap[weaponType] ?? weaponType}
                    iconSrc={weaponIconMap[weaponType]}
                    onClick={() => setWeaponTypeFilter(weaponType)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="시리즈" last>
                <SelectFilterButton active={seriesFilter === "all"} label="전체" onClick={() => setSeriesFilter("all")} />
                {weaponSeries.map((weaponSeriesName) => (
                  <SelectFilterButton
                    key={weaponSeriesName}
                    active={seriesFilter === weaponSeriesName}
                    label={weaponSeriesName}
                    onClick={() => setSeriesFilter(weaponSeriesName)}
                  />
                ))}
              </SelectFilterGroup>
            </>
          ) : null}

          {kind === "gear" ? (
            <>
              <SelectFilterGroup title="세트 유형">
                <SelectFilterButton active={gearSetFilter === "all"} label="전체" onClick={() => setGearSetFilter("all")} />
                {gearSets.map((gearSetName) => (
                  <SelectFilterButton
                    key={gearSetName}
                    active={gearSetFilter === gearSetName}
                    label={gearSetName}
                    onClick={() => setGearSetFilter(gearSetName)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="속성">
                {gearAttributeOptions.map((attributeOption) => (
                  <SelectFilterButton
                    key={attributeOption.value}
                    active={gearAttributeFilter === attributeOption.value}
                    label={attributeOption.label}
                    onClick={() => setGearAttributeFilter(attributeOption.value)}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title={`능력치 (${gearAbilityFilters.length}/2)`}>
                {gearAbilityOptions.map((abilityOption) => (
                  <SelectFilterButton
                    key={abilityOption.value}
                    active={
                      abilityOption.value === "all"
                        ? gearAbilityFilters.length === 0
                        : gearAbilityFilters.includes(abilityOption.value)
                    }
                    label={abilityOption.label}
                    onClick={() =>
                      setGearAbilityFilters((prev) =>
                        toggleLimitedFilter(prev, abilityOption.value, 2),
                      )
                    }
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="품질">
                <SelectFilterButton active={rarityFilter === "all"} label="전체" onClick={() => setRarityFilter("all")} />
                {[5, 4, 3, 2, 1].map((qualityOption) => (
                  <SelectFilterButton
                    key={qualityOption}
                    active={rarityFilter === String(qualityOption)}
                    label={qualityLabelMap[qualityOption]}
                    color={qualityColorMap[qualityOption]}
                    onClick={() => setRarityFilter(String(qualityOption))}
                  />
                ))}
              </SelectFilterGroup>

              <SelectFilterGroup title="장비 레벨" last>
                <SelectFilterButton active={gearLevelFilter === "all"} label="전체" onClick={() => setGearLevelFilter("all")} />
                {[70, 50, 36, 28, 20, 10].map((gearLevelOption) => (
                  <SelectFilterButton
                    key={gearLevelOption}
                    active={gearLevelFilter === String(gearLevelOption)}
                    label={`레벨 ${gearLevelOption}`}
                    onClick={() => setGearLevelFilter(String(gearLevelOption))}
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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:gap-3">
            {filteredOperators.map((operator) => (
              <OperatorSelectCard
                key={operator.slug}
                operator={operator as any}
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
        !requiredWeaponType && !allowAllWeaponList ? (
          <EmptyResult label="오퍼레이터를 먼저 선택한 뒤 무기를 선택하세요." />
        ) : filteredWeapons.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:gap-3">
            {filteredWeapons.map((weapon) => (
              <WeaponSelectCard
                key={weapon.slug}
                weapon={weapon as any}
                active={weapon.slug === selectedSlug}
                onClick={() => {
                  onSelectWeapon?.(weapon.slug);
                  onClose();
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyResult label={requiredWeaponType ? "선택한 오퍼레이터의 무기 유형과 맞는 무기가 없습니다." : "조건에 맞는 무기가 없습니다."} />
        )
      ) : null}

      {kind === "gear" ? (
        filteredGears.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:gap-3">
            {filteredGears.map((gear) => (
              <GearSelectCard
                key={gear.slug}
                gear={gear as any}
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
