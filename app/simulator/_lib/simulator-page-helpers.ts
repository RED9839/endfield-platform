import type { OperatorDetail } from "@/data/operators-detail-data";
import type { SourceWeaponDetail } from "@/data/weapons-detail-data";
import {
  normalizeMaterials,
  type RawMaterialItem,
  type SimMaterial,
  type SimStep,
} from "./simulator-utils";

export type WeaponCurrentLevel = 1 | 20 | 40 | 60 | 80;
export type WeaponTargetLevel = 20 | 40 | 60 | 80 | 90;

export const WEAPON_CURRENT_LEVEL_OPTIONS: readonly WeaponCurrentLevel[] = [
  1, 20, 40, 60, 80,
] as const;

export const WEAPON_TARGET_LEVEL_OPTIONS: readonly WeaponTargetLevel[] = [
  20, 40, 60, 80, 90,
] as const;

export type SkillLevel =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "M1"
  | "M2"
  | "M3";

export type CombatSkillKey = "normal" | "combo" | "battle" | "ultimate";

export type CombatSkillState = Record<
  CombatSkillKey,
  {
    current: SkillLevel;
    target: SkillLevel;
  }
>;

export type CombatSkillCostEntry = {
  level: string | number;
  materials: RawMaterialItem[];
};

export type CombatSkillMeta = {
  key: CombatSkillKey;
  label: string;
  icon?: string;
  costs: CombatSkillCostEntry[];
};

export type TalentGroup = {
  id: number;
  name: string;
  icon?: string;
  maxStage: number;
};

export type InfrastructureGroup = {
  id: number;
  name: string;
  icon?: string;
  maxStage: number;
};

export type TrustStageInfo = {
  stage: number;
  label: string;
};

export type EliteViewItem = {
  level: number;
  label: string;
  icon?: string;
};

export type WeaponBreakthroughItem = {
  stage: number;
  label: string;
  materials: RawMaterialItem[];
};

export const SKILL_LEVEL_OPTIONS: readonly SkillLevel[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "M1",
  "M2",
  "M3",
] as const;

export const COMBAT_LABEL_MAP: Record<CombatSkillKey, string> = {
  normal: "일반공격",
  combo: "연계스킬",
  battle: "배틀스킬",
  ultimate: "궁극기",
};

export function toWeaponCurrentLevel(value: number): WeaponCurrentLevel {
  if ((WEAPON_CURRENT_LEVEL_OPTIONS as readonly number[]).includes(value)) {
    return value as WeaponCurrentLevel;
  }
  return 1;
}

export function toWeaponTargetLevel(value: number): WeaponTargetLevel {
  if ((WEAPON_TARGET_LEVEL_OPTIONS as readonly number[]).includes(value)) {
    return value as WeaponTargetLevel;
  }
  return 90;
}

export function normalizeSkillLevelValue(
  value: string | number | undefined | null
) {
  if (value === undefined || value === null) return "";
  return String(value).trim().toUpperCase();
}

export function formatSkillLevelLabel(level: SkillLevel) {
  const normalized = normalizeSkillLevelValue(level);
  return normalized.startsWith("M") ? normalized : `Lv. ${normalized}`;
}

export function getAvailableTargetLevels(
  skillLevelOptions: readonly SkillLevel[],
  current: SkillLevel
) {
  const currentIndex = skillLevelOptions.findIndex((level) => level === current);
  return skillLevelOptions.filter((_, index) => index > currentIndex);
}

export function toSimMaterials(items: RawMaterialItem[] = []): SimMaterial[] {
  return normalizeMaterials(items);
}

function getOperatorSkillsSource(raw: any) {
  return raw.skills ?? raw.skill ?? {};
}

function pickSkillBlock(skills: any, key: CombatSkillKey) {
  if (key === "normal") {
    return (
      skills.normalAttack ??
      skills.normal ??
      skills.basicAttack ??
      skills.basic
    );
  }

  if (key === "combo") {
    return skills.comboSkill ?? skills.combo ?? skills.chainSkill;
  }

  if (key === "battle") {
    return skills.battleSkill ?? skills.battle ?? skills.activeSkill;
  }

  return skills.ultimate ?? skills.ult ?? skills.ultimateSkill;
}

function getTalentSourceList(raw: any) {
  const candidates = [
    Array.isArray(raw.talentSkills) ? raw.talentSkills : [],
    Array.isArray(raw.skillTalents) ? raw.skillTalents : [],
    Array.isArray(raw.talents) ? raw.talents : [],
  ] as Array<Array<{ name?: string; icon?: string; unlock?: string; levels?: any[] }>>;

  const normalizeTalentList = (
    list: Array<{ name?: string; icon?: string; unlock?: string; levels?: any[] }>
  ) => {
    const grouped = new Map<
      string,
      { name?: string; icon?: string; unlock?: string; levels?: any[] }
    >();

    for (const item of list) {
      const key = `${item?.name ?? ""}__${item?.icon ?? ""}`;
      if (!grouped.has(key)) grouped.set(key, item);
    }

    return Array.from(grouped.values());
  };

  return candidates
    .map((list) => normalizeTalentList(list))
    .sort((a, b) => b.length - a.length)[0] ?? [];
}

export function getCombatSkillMeta(
  operator: OperatorDetail
): CombatSkillMeta[] {
  const raw = operator as any;
  const skills = getOperatorSkillsSource(raw);

  return (["normal", "combo", "battle", "ultimate"] as CombatSkillKey[]).map(
    (key) => {
      const block = pickSkillBlock(skills, key) ?? {};
      return {
        key,
        label: block.name ?? COMBAT_LABEL_MAP[key],
        icon: block.icon ?? block.skillIcon ?? block.image,
        costs: (block.upgradeCosts ??
          block.costs ??
          raw.requiredMaterials?.skills?.[key] ??
          []) as CombatSkillCostEntry[],
      };
    }
  );
}

export function getTalentGroups(operator: OperatorDetail): TalentGroup[] {
  const raw = operator as any;

  const costs = (raw.requiredMaterials?.talents ?? []) as Array<{
    talent: number;
    stage: number;
    materials: RawMaterialItem[];
  }>;

  const talentSources = getTalentSourceList(raw);

  const idsFromCosts = costs
    .map((item) => Number(item.talent ?? 0))
    .filter((value) => value > 0);

  const idsFromSources = talentSources.map((_, index) => index + 1);

  const talentIds = Array.from(new Set([...idsFromCosts, ...idsFromSources])).sort(
    (a, b) => a - b
  );

  return talentIds.map((talentId) => {
    const source = talentSources[talentId - 1] ?? {};
    const relatedCosts = costs.filter(
      (item) => Number(item.talent ?? 0) === talentId
    );

    const costMaxStage = Math.max(
      0,
      ...relatedCosts.map((item) => Number(item.stage ?? 0))
    );

    const sourceMaxStage = Array.isArray(source.levels)
      ? source.levels.length
      : 0;

    return {
      id: talentId,
      name: source.name ?? `재능스킬 ${talentId}`,
      icon: source.icon,
      maxStage: Math.max(costMaxStage, sourceMaxStage, 1),
    };
  });
}

export function getSelectedTalentSteps(
  operator: OperatorDetail,
  selectedTalentTargets: Record<number, number>
): SimStep[] {
  const raw = operator as any;

  const costs = (raw.requiredMaterials?.talents ?? []) as Array<{
    talent: number;
    stage: number;
    materials: RawMaterialItem[];
  }>;

  const talentSources = getTalentSourceList(raw);
  const steps: SimStep[] = [];

  for (const [talentIdText, targetStage] of Object.entries(
    selectedTalentTargets
  )) {
    const talentId = Number(talentIdText);
    const source = talentSources[talentId - 1] ?? {};
    const title = source.name ?? `재능스킬 ${talentId}`;

    for (let stage = 1; stage <= Number(targetStage); stage += 1) {
      const found = costs.find(
        (item) =>
          Number(item.talent) === talentId && Number(item.stage) === stage
      );

      if (!found) continue;

      steps.push({
        label: `${title} ${stage}단계`,
        materials: toSimMaterials(found.materials ?? []),
      });
    }
  }

  return steps;
}

export function getInfrastructureGroups(
  operator: OperatorDetail
): InfrastructureGroup[] {
  const raw = operator as any;

  const infraSource = [
    ...(Array.isArray(raw.infrastructureSkills) ? raw.infrastructureSkills : []),
    ...(Array.isArray(raw.infrastructure) ? raw.infrastructure : []),
    ...(Array.isArray(raw.baseSkills) ? raw.baseSkills : []),
  ] as Array<{
    name?: string;
    icon?: string;
    levels?: Array<{ tier?: string }>;
  }>;

  const costs = (raw.requiredMaterials?.infrastructure ?? []) as Array<{
    slot: number;
    stage: number;
  }>;

  const grouped = new Map<number, InfrastructureGroup>();

  for (const cost of costs) {
    const slot = Number(cost.slot ?? 0);
    if (!slot) continue;

    const source = infraSource[slot - 1] ?? {};
    const prev = grouped.get(slot);

    grouped.set(slot, {
      id: slot,
      name: source.name ?? `인프라스킬 ${slot}`,
      icon: source.icon,
      maxStage: Math.max(prev?.maxStage ?? 0, Number(cost.stage ?? 0)),
    });
  }

  if (!grouped.size) {
    infraSource.forEach((source, index) => {
      grouped.set(index + 1, {
        id: index + 1,
        name: source.name ?? `인프라스킬 ${index + 1}`,
        icon: source.icon,
        maxStage: Array.isArray(source.levels) ? source.levels.length : 1,
      });
    });
  }

  return Array.from(grouped.values()).sort((a, b) => a.id - b.id);
}

export function getInfrastructureTierLabel(
  operator: OperatorDetail,
  slot: number,
  stage: number
) {
  const raw = operator as any;

  const infraSource = [
    ...(Array.isArray(raw.infrastructureSkills) ? raw.infrastructureSkills : []),
    ...(Array.isArray(raw.infrastructure) ? raw.infrastructure : []),
    ...(Array.isArray(raw.baseSkills) ? raw.baseSkills : []),
  ] as Array<{
    levels?: Array<{ tier?: string }>;
  }>;

  return infraSource[slot - 1]?.levels?.[stage - 1]?.tier ?? `${stage}단계`;
}

export function getTrustStageInfos(operator: OperatorDetail): TrustStageInfo[] {
  const raw = operator as any;

  const requiredTrust = (raw.requiredMaterials?.trustBonus ??
    []) as Array<{ stage: number; materials?: RawMaterialItem[] }>;

  const dataTrust = Array.isArray(raw.trustBonus) ? raw.trustBonus : [];
  const sourceTrust = Array.isArray(raw.trust) ? raw.trust : [];

  const stagesFromRequired = requiredTrust
    .map((item) => Number(item.stage ?? 0))
    .filter((stage) => stage > 0);

  const stagesFromData = dataTrust.map((_: any, index: number) => index + 1);
  const stagesFromSource = sourceTrust.map((_: any, index: number) => index + 1);

  const stages = Array.from(
    new Set([...stagesFromRequired, ...stagesFromData, ...stagesFromSource])
  ).sort((a, b) => a - b);

  return stages.map((stage) => ({
    stage,
    label: `신뢰도 ${stage}단계`,
  }));
}

export function getEliteViewItems(): EliteViewItem[] {
  return [1, 2, 3, 4].map((level) => ({
    level,
    label: `${level}레벨`,
    icon: `/icons/elite/${level}.webp`,
  }));
}

function pickArray(...sources: any[]) {
  for (const source of sources) {
    if (Array.isArray(source) && source.length > 0) {
      return source;
    }
  }
  return [];
}

export function getWeaponBreakthroughItems(
  weapon: SourceWeaponDetail
): WeaponBreakthroughItem[] {
  const raw = weapon as any;
  const source = pickArray(
    raw.breakthrough,
    raw.breakthroughMaterials,
    raw.weaponBreakthrough,
    raw.weaponBreakthroughMaterials,
    raw.tuning,
    raw.tuningMaterials,
    raw.ascension,
    raw.ascensionMaterials,
    raw.requiredMaterials?.breakthrough,
    raw.requiredMaterials?.weaponBreakthrough,
    raw.requiredMaterials?.tuning
  );

  if (!Array.isArray(source)) return [];

  return source
    .map((item: any, index: number) => ({
      stage: Number(item.stage ?? item.phase ?? item.level ?? index + 1),
      label: `${Number(item.stage ?? item.phase ?? item.level ?? index + 1)}단계`,
      materials: (item.materials ?? item.costs ?? item.items ?? []) as RawMaterialItem[],
    }))
    .filter((item) => item.stage >= 1);
}

export function buildSkillStepsInRange(
  skillIndexMap: Map<SkillLevel, number>,
  skillLevelOptions: readonly SkillLevel[],
  label: string,
  costs: CombatSkillCostEntry[],
  current: SkillLevel,
  target: SkillLevel
): SimStep[] {
  if (!costs.length) return [];

  const currentIndex = skillIndexMap.get(current) ?? 0;
  const targetIndex = skillIndexMap.get(target) ?? 0;
  if (targetIndex <= currentIndex) return [];

  const normalizedCosts = costs.map((entry) => ({
    ...entry,
    normalizedLevel: normalizeSkillLevelValue(entry.level),
  }));

  const steps: SimStep[] = [];

  for (let i = currentIndex + 1; i <= targetIndex; i += 1) {
    const targetLevel = normalizeSkillLevelValue(skillLevelOptions[i]);
    const found = normalizedCosts.find(
      (entry) => entry.normalizedLevel === targetLevel
    );

    if (found) {
      steps.push({
        label: `${label} ${targetLevel}`,
        materials: toSimMaterials(found.materials ?? []),
      });
    }
  }

  return steps;
}

export function getSelectedEliteSteps(
  operator: OperatorDetail,
  selectedEliteLevel: number
): SimStep[] {
  const raw = operator as any;
  const elite = (raw.elite ?? []) as Array<{
    phase?: string;
    materials?: RawMaterialItem[];
  }>;

  return elite
    .slice(0, selectedEliteLevel)
    .map((item, index) => ({
      label: item.phase ?? `정예화 ${index + 1}`,
      materials: toSimMaterials(item.materials ?? []),
    }))
    .filter((step) => step.materials.length > 0);
}

export function getSelectedWeaponBreakthroughSteps(
  items: WeaponBreakthroughItem[],
  selectedStage: number
): SimStep[] {
  return items
    .filter((item) => item.stage <= selectedStage)
    .map((item) => ({
      label: `무기 돌파 ${item.stage}단계`,
      materials: toSimMaterials(item.materials ?? []),
    }))
    .filter((step) => step.materials.length > 0);
}