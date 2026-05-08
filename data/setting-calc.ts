export type StatKey =
  | "hp"
  | "attack"
  | "strength"
  | "agility"
  | "intelligence"
  | "will"
  | "critRate"
  | "critDamage"
  | "ultimateChargeEfficiency"
  | "physicalDamage"
  | "heatDamage"
  | "electricDamage"
  | "cryoDamage"
  | "natureDamage";

export type FlatStats = Partial<Record<StatKey, number>>;

export type OperatorSettingInput = {
  operatorStats?: FlatStats;
  weaponStats?: FlatStats;
  armorStats?: FlatStats;
  glovesStats?: FlatStats;
  kitStats?: FlatStats;

  mainStatKey?: "strength" | "agility" | "intelligence" | "will";
  subStatKey?: "strength" | "agility" | "intelligence" | "will";

  attackBonusPercent?: number;
};

export type CalculatedSettingStats = {
  hp: number;
  baseHp: number;
  strengthBonusHp: number;

  attack: number;
  baseAttack: number;
  operatorAttack: number;
  weaponAttack: number;

  attackBonusPercent: number;
  statBonusPercent: number;

  strength: number;
  agility: number;
  intelligence: number;
  will: number;

  critRate: number;
  critDamage: number;
  ultimateChargeEfficiency: number;

  physicalDamage: number;
  heatDamage: number;
  electricDamage: number;
  cryoDamage: number;
  natureDamage: number;
};

const BASE_CRIT_RATE = 5;
const BASE_CRIT_DAMAGE = 50;
const BASE_ULTIMATE_CHARGE_EFFICIENCY = 100;

function n(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sumStats(...stats: Array<FlatStats | undefined>): FlatStats {
  const result: FlatStats = {};

  for (const stat of stats) {
    if (!stat) continue;

    for (const [key, value] of Object.entries(stat)) {
      const statKey = key as StatKey;
      result[statKey] = n(result[statKey]) + n(value);
    }
  }

  return result;
}

export function floorStat(value: number): number {
  return Math.floor(value);
}

export function floorPercent(value: number): number {
  return Math.floor(value * 10) / 10;
}

export function calculateSettingStats(
  input: OperatorSettingInput
): CalculatedSettingStats {
  const total = sumStats(
    input.operatorStats,
    input.weaponStats,
    input.armorStats,
    input.glovesStats,
    input.kitStats
  );

  const strength = n(total.strength);
  const agility = n(total.agility);
  const intelligence = n(total.intelligence);
  const will = n(total.will);

  const baseHp = n(total.hp);
  const strengthBonusHp = strength * 5;
  const hp = baseHp + strengthBonusHp;

  const operatorAttack = n(input.operatorStats?.attack);
  const weaponAttack = n(input.weaponStats?.attack);
  const baseAttack = operatorAttack + weaponAttack;

  const mainStatValue = input.mainStatKey ? n(total[input.mainStatKey]) : 0;
  const subStatValue = input.subStatKey ? n(total[input.subStatKey]) : 0;

  const statBonusPercent = mainStatValue * 0.5 + subStatValue * 0.2;
  const attackBonusPercent = n(input.attackBonusPercent) + n(total.attack);

  const attack =
    baseAttack *
    (1 + attackBonusPercent / 100) *
    (1 + statBonusPercent / 100);

  return {
    hp: floorStat(hp),
    baseHp: floorStat(baseHp),
    strengthBonusHp: floorStat(strengthBonusHp),

    attack: floorStat(attack),
    baseAttack: floorStat(baseAttack),
    operatorAttack: floorStat(operatorAttack),
    weaponAttack: floorStat(weaponAttack),

    attackBonusPercent: floorPercent(attackBonusPercent),
    statBonusPercent: floorPercent(statBonusPercent),

    strength: floorStat(strength),
    agility: floorStat(agility),
    intelligence: floorStat(intelligence),
    will: floorStat(will),

    critRate: floorPercent(BASE_CRIT_RATE + n(total.critRate)),
    critDamage: floorPercent(BASE_CRIT_DAMAGE + n(total.critDamage)),
    ultimateChargeEfficiency: floorPercent(
      BASE_ULTIMATE_CHARGE_EFFICIENCY + n(total.ultimateChargeEfficiency)
    ),

    physicalDamage: floorPercent(n(total.physicalDamage)),
    heatDamage: floorPercent(n(total.heatDamage)),
    electricDamage: floorPercent(n(total.electricDamage)),
    cryoDamage: floorPercent(n(total.cryoDamage)),
    natureDamage: floorPercent(n(total.natureDamage)),
  };
}