export type OperatorRarity = 4 | 5 | 6;
export type OperatorElement = "physical" | "cryo" | "heat" | "nature" | "electric";
export type OperatorClass =
  | "vanguard"
  | "guard"
  | "defender"
  | "supporter"
  | "caster"
  | "striker";
export type WeaponType = "sword" | "greatsword" | "polearm" | "handcannon" | "artsunit";

export type MaterialCostItem = {
  name: string;
  icon: string;
  count: string | number;
};

export type LevelUpCost = {
  to: number;
  materials: MaterialCostItem[];
};

export type TrustBonusCost = {
  stage: number;
  trust: number;
  elite: number;
  materials: MaterialCostItem[];
};

export type InfrastructureCost = {
  slot: number;
  stage: number;
  elite: number;
  materials: MaterialCostItem[];
};

export type TalentCost = {
  talent: number;
  stage: number;
  elite: number;
  materials: MaterialCostItem[];
};

export type RequiredMaterials = {
  levelUp: LevelUpCost[];
  trustBonus: TrustBonusCost[];
  infrastructure: InfrastructureCost[];
  talents: TalentCost[];
};

export type StatGrowth = {
  level: number;
  hp: number;
  attack: number;
  defense: number;
  resistance: number;
  power?: number;
  agility?: number;
  intelligence?: number;
  will?: number;
};

export type SkillLevelValue = {
  level: string;
  description: string;
  stats: {
    label: string;
    value: string | number;
  }[];
};

export type SkillCompareRow = {
  label: string;
  values: (string | number)[];
};

export type SkillUpgradeMaterial = {
  level: string;
  materials: MaterialCostItem[];
};

export type SkillMeta = {
  label: string;
  value?: string | number;
  valueRowLabel?: string;
};

export type SkillDetail = {
  name: string;
  typeLabel: string;
  icon?: string;
  summary?: string;
  meta?: SkillMeta[];
  levelValues: SkillLevelValue[];
  compareRows: SkillCompareRow[];
  upgradeCosts: SkillUpgradeMaterial[];
};

export type EliteStage = {
  stage: string;
  description: string;
  materials: MaterialCostItem[];
};

export type PotentialDetail = {
  title: string;
  subtitle?: string;
  description: string;
};

export type InfrastructureSkillLevel = {
  tier: "α" | "β" | "γ";
  unlockText: string;
  description: string;
};

export type InfrastructureSkillGroup = {
  name: string;
  icon: string;
  levels: InfrastructureSkillLevel[];
};

export type TrustBonus = {
  level: number;
  label: string;
};

export type TalentDetail = {
  name: string;
  unlock: string;
  description: string;
  icon?: string;
};

export type OperatorDetail = {
  id: string;
  slug: string;
  name: string;
  enName: string;
  rarity: OperatorRarity;
  element: OperatorElement;
  class: OperatorClass;
  weapon: WeaponType;
  avatar: string;
  avatarSecondary?: string;
  fullImage: string;
  fullImageSecondary?: string;
  summary: string;
  mainStatLabel?: string;
  subStatLabel?: string;
  mainStats: {
    hp: number;
    attack: number;
    defense: number;
  };
  subStats: {
    resistance: number;
    critRate: string;
    critDamage: string;
    attackSpeed: string;
  };
  levelStats: StatGrowth[];
  skills: {
    normalAttack: SkillDetail;
    battleSkill: SkillDetail;
    comboSkill: SkillDetail;
    ultimate: SkillDetail;
  };
  elite: EliteStage[];
  talents: TalentDetail[];
  trustBonus: TrustBonus[];
  infrastructureSkills: InfrastructureSkillGroup[];
  potential: PotentialDetail[];
  requiredMaterials?: RequiredMaterials;
};

export type SourceSkillRow = {
  label: string;
  values: readonly (string | number)[];
};

export type SourceSkillUpgradeMaterial = {
  level: string;
  materials: readonly {
    name: string;
    icon?: string;
    count: string | number;
  }[];
};

export type SourceSkill = {
  name: string;
  typeLabel: string;
  icon?: string;
  meta?: readonly SkillMeta[];
  description: readonly string[];
  levels: readonly string[];
  rows: readonly SourceSkillRow[];
  upgradeMaterials?: readonly SourceSkillUpgradeMaterial[];
  upgradeCosts?: readonly SourceSkillUpgradeMaterial[];
};

export type SourceOperatorDetail = {
  slug: string;
  name: string;
  enName: string;
  rarity: OperatorRarity;
  element: OperatorElement;
  class: OperatorClass;
  weaponType: string;
  mainStatLabel?: string;
  subStatLabel?: string;
  avatar: string;
  avatarSecondary?: string;
  fullImage: string;
  fullImageSecondary?: string;
  levelStats: {
    summary: {
      levels: readonly number[];
      str: readonly number[];
      dex: readonly number[];
      int: readonly number[];
      will: readonly number[];
      atk: readonly number[];
      hp: readonly number[];
    };
    detail: {
      levels: readonly number[];
      str: readonly number[];
      dex: readonly number[];
      int: readonly number[];
      will: readonly number[];
      atk: readonly number[];
      hp: readonly number[];
    };
  };
  elite: readonly {
    phase: string;
    unlockText: string;
    materials: readonly {
      name: string;
      icon?: string;
      count: string | number;
    }[];
  }[];
  skills: {
    normalAttack: SourceSkill;
    battleSkill: SourceSkill;
    comboSkill: SourceSkill;
    ultimate: SourceSkill;
  };
  potential: readonly PotentialDetail[];
  trustBonus: readonly TrustBonus[];
  infrastructureSkills: readonly {
    name: string;
    icon: string;
    levels: readonly {
      tier: string;
      unlockText: string;
      description: string;
    }[];
  }[];
  talents: readonly {
    name: string;
    unlock: string;
    description: string;
    icon?: string;
  }[];
  requiredMaterials?: {
    levelUp: readonly {
      to: number;
      materials: readonly {
        name: string;
        icon?: string;
        count: string | number;
      }[];
    }[];
    trustBonus: readonly {
      stage: number;
      trust: number;
      elite: number;
      materials: readonly {
        name: string;
        icon?: string;
        count: string | number;
      }[];
    }[];
    infrastructure: readonly {
      slot: number;
      stage: number;
      elite: number;
      materials: readonly {
        name: string;
        icon?: string;
        count: string | number;
      }[];
    }[];
    talents: readonly {
      talent: number;
      stage: number;
      elite: number;
      materials: readonly {
        name: string;
        icon?: string;
        count: string | number;
      }[];
    }[];
  };
};

function normalizeWeaponType(weaponType: string): WeaponType {
  switch (weaponType) {
    case "한손검":
    case "sword":
      return "sword";
    case "양손검":
    case "greatsword":
      return "greatsword";
    case "장병기":
    case "polearm":
      return "polearm";
    case "권총":
    case "handcannon":
      return "handcannon";
    case "아츠 유닛":
    case "artsunit":
      return "artsunit";
    default:
      return "sword";
  }
}

function getDefaultDefense(operatorClass: OperatorClass, rarity: OperatorRarity) {
  const base = rarity === 6 ? 180 : rarity === 5 ? 155 : 135;

  switch (operatorClass) {
    case "defender":
      return Math.round(base * 1.22);
    case "guard":
      return Math.round(base * 1.04);
    case "striker":
      return Math.round(base * 0.96);
    case "vanguard":
      return Math.round(base * 0.98);
    case "supporter":
      return Math.round(base * 0.9);
    case "caster":
      return Math.round(base * 0.88);
  }
}

function getDefaultResistance(operatorClass: OperatorClass) {
  switch (operatorClass) {
    case "caster":
      return 18;
    case "supporter":
      return 16;
    case "defender":
      return 12;
    default:
      return 10;
  }
}

function getDefaultCritRate(operatorClass: OperatorClass) {
  if (operatorClass === "guard" || operatorClass === "striker") return "8%";
  return "5%";
}

function getDefaultAttackSpeed(weapon: WeaponType) {
  if (weapon === "greatsword") return "느림";
  if (weapon === "handcannon") return "보통";
  return "빠름";
}

function getSummaryIndex(source: SourceOperatorDetail, level: number) {
  return source.levelStats.summary.levels.findIndex((summaryLevel) => summaryLevel === level);
}

function getSummaryValue(
  source: SourceOperatorDetail,
  key: "hp" | "atk" | "str" | "dex" | "int" | "will",
  level: number,
) {
  const summaryIndex = getSummaryIndex(source, level);
  if (summaryIndex < 0) return undefined;

  return source.levelStats.summary[key][summaryIndex];
}

function buildLevelStats(source: SourceOperatorDetail): StatGrowth[] {
  const levels = source.levelStats.detail.levels.slice(0, 90);
  const defense = getDefaultDefense(source.class, source.rarity);
  const resistance = getDefaultResistance(source.class);

  return levels.map((level, index) => ({
    level,
    hp: getSummaryValue(source, "hp", level) ?? source.levelStats.detail.hp[index] ?? 0,
    attack: getSummaryValue(source, "atk", level) ?? source.levelStats.detail.atk[index] ?? 0,
    defense,
    resistance,
    power: getSummaryValue(source, "str", level) ?? source.levelStats.detail.str[index] ?? 0,
    agility: getSummaryValue(source, "dex", level) ?? source.levelStats.detail.dex[index] ?? 0,
    intelligence: getSummaryValue(source, "int", level) ?? source.levelStats.detail.int[index] ?? 0,
    will: getSummaryValue(source, "will", level) ?? source.levelStats.detail.will[index] ?? 0,
  }));
}

function buildSkillLevelValues(skill: SourceSkill): SkillLevelValue[] {
  return skill.levels.map((level, levelIndex) => ({
    level,
    description: skill.description.join(" "),
    stats: skill.rows.map((row) => ({
      label: row.label,
      value: row.values[levelIndex] ?? "-",
    })),
  }));
}

function buildSkillUpgradeCosts(skill: SourceSkill): SkillUpgradeMaterial[] {
  const sourceUpgradeCosts = skill.upgradeMaterials ?? skill.upgradeCosts ?? [];

  if (!sourceUpgradeCosts.length) {
    return skill.levels
      .filter((level) => level !== "1")
      .map((level) => ({
        level,
        materials: [],
      }));
  }

  return sourceUpgradeCosts.map((cost) => ({
    level: cost.level,
    materials: cost.materials.map((material) => ({
      name: material.name,
      icon: material.icon ?? "/items/placeholder.webp",
      count: material.count,
    })),
  }));
}

function buildSkillDetail(skill: SourceSkill): SkillDetail {
  const levelValues = buildSkillLevelValues(skill);

  return {
    name: skill.name,
    typeLabel: skill.typeLabel,
    icon: skill.icon,
    summary: skill.description.join(" "),
    meta: skill.meta ? skill.meta.map((item) => ({ ...item })) : [],
    levelValues,
    compareRows: skill.rows.map((row) => ({
      label: row.label,
      values: [...row.values],
    })),
    upgradeCosts: buildSkillUpgradeCosts(skill),
  };
}

function buildEliteStages(source: SourceOperatorDetail): EliteStage[] {
  return source.elite.map((stage) => ({
    stage: stage.phase,
    description: stage.unlockText,
    materials: stage.materials.map((material) => ({
      name: material.name,
      icon: material.icon ?? "/items/placeholder.webp",
      count: material.count,
    })),
  }));
}

function buildInfrastructureSkills(source: SourceOperatorDetail): InfrastructureSkillGroup[] {
  return source.infrastructureSkills.map((group) => ({
    name: group.name,
    icon: group.icon,
    levels: group.levels.map((level) => ({
      tier: level.tier === "α" || level.tier === "β" || level.tier === "γ" ? level.tier : "β",
      unlockText: level.unlockText,
      description: level.description,
    })),
  }));
}

function buildTalents(source: SourceOperatorDetail): TalentDetail[] {
  return source.talents.map((talent) => ({
    name: talent.name,
    unlock: talent.unlock,
    description: talent.description,
    icon: talent.icon,
  }));
}

function buildRequiredMaterials(source: SourceOperatorDetail): RequiredMaterials | undefined {
  if (!source.requiredMaterials) return undefined;

  return {
    levelUp: source.requiredMaterials.levelUp.map((entry) => ({
      to: entry.to,
      materials: entry.materials.map((material) => ({
        name: material.name,
        icon: material.icon ?? "/items/placeholder.webp",
        count: material.count,
      })),
    })),
    trustBonus: source.requiredMaterials.trustBonus.map((entry) => ({
      stage: entry.stage,
      trust: entry.trust,
      elite: entry.elite,
      materials: entry.materials.map((material) => ({
        name: material.name,
        icon: material.icon ?? "/items/placeholder.webp",
        count: material.count,
      })),
    })),
    infrastructure: source.requiredMaterials.infrastructure.map((entry) => ({
      slot: entry.slot,
      stage: entry.stage,
      elite: entry.elite,
      materials: entry.materials.map((material) => ({
        name: material.name,
        icon: material.icon ?? "/items/placeholder.webp",
        count: material.count,
      })),
    })),
    talents: source.requiredMaterials.talents.map((entry) => ({
      talent: entry.talent,
      stage: entry.stage,
      elite: entry.elite,
      materials: entry.materials.map((material) => ({
        name: material.name,
        icon: material.icon ?? "/items/placeholder.webp",
        count: material.count,
      })),
    })),
  };
}

function buildSummary(source: SourceOperatorDetail) {
  return `${source.mainStatLabel ?? "주요 능력치"} 기반의 ${source.rarity}성 ${source.class} 오퍼레이터. ${source.skills.battleSkill.name}와 ${source.skills.ultimate.name}를 중심으로 전투를 전개합니다.`;
}

export function buildOperatorDetailFromSource(source: SourceOperatorDetail): OperatorDetail {
  const weapon = normalizeWeaponType(source.weaponType);
  const levelStats = buildLevelStats(source);
  const levelOne = levelStats[0];

  return {
    id: source.slug,
    slug: source.slug,
    name: source.name,
    enName: source.enName,
    rarity: source.rarity,
    element: source.element,
    class: source.class,
    weapon,
    avatar: source.avatar,
    avatarSecondary: source.avatarSecondary,
    fullImage: source.fullImage,
    fullImageSecondary: source.fullImageSecondary,
    summary: buildSummary(source),
    mainStatLabel: source.mainStatLabel,
    subStatLabel: source.subStatLabel,
    mainStats: {
      hp: levelOne?.hp ?? 0,
      attack: levelOne?.attack ?? 0,
      defense: levelOne?.defense ?? 0,
    },
    subStats: {
      resistance: levelOne?.resistance ?? 0,
      critRate: getDefaultCritRate(source.class),
      critDamage: "150%",
      attackSpeed: getDefaultAttackSpeed(weapon),
    },
    levelStats,
    skills: {
      normalAttack: buildSkillDetail(source.skills.normalAttack),
      battleSkill: buildSkillDetail(source.skills.battleSkill),
      comboSkill: buildSkillDetail(source.skills.comboSkill),
      ultimate: buildSkillDetail(source.skills.ultimate),
    },
    elite: buildEliteStages(source),
    talents: buildTalents(source),
    trustBonus: [...source.trustBonus],
    infrastructureSkills: buildInfrastructureSkills(source),
    potential: [...source.potential],
    requiredMaterials: buildRequiredMaterials(source),
  };
}