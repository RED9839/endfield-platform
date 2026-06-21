// ===== 유물(슬더스식 렐릭) =====
// 장비와 별개로, 런 내내 상시 적용되는 패시브. 엘리트/보스 보상·상점에서 획득.

export type RelicDef = {
  id: string;
  name: string;
  icon: string; // lucide 아이콘 키(컴포넌트에서 매핑)
  description: string;
  price: number; // 상점가
  effect: RelicEffect;
};

export type RelicEffect = {
  startEnergy?: number; // 전투 첫 턴 에너지 +N (1회)
  maxEnergyBonus?: number; // 매 턴 최대 에너지 +N
  handBonus?: number; // 매 턴 드로우 +N
  startShield?: number; // 전투 시작 시 파티 보호막 +N
  critBonus?: number; // 치명타 확률 +N(0~1)
  damageMult?: number; // 카드 피해 +N 비율(0.1 = +10%)
};

export const RELICS: Record<string, RelicDef> = {
  "rel-core": {
    id: "rel-core",
    name: "예비 동력 코어",
    icon: "battery",
    description: "전투 시작 첫 턴에 에너지 +1.",
    price: 140,
    effect: { startEnergy: 1 },
  },
  "rel-reactor": {
    id: "rel-reactor",
    name: "증폭 리액터",
    icon: "zap",
    description: "매 턴 최대 에너지 +1.",
    price: 260,
    effect: { maxEnergyBonus: 1 },
  },
  "rel-scope": {
    id: "rel-scope",
    name: "정밀 조준경",
    icon: "crosshair",
    description: "모든 카드의 치명타 확률 +8%.",
    price: 170,
    effect: { critBonus: 0.08 },
  },
  "rel-amp": {
    id: "rel-amp",
    name: "출력 증폭기",
    icon: "trending-up",
    description: "카드 피해 +10%.",
    price: 200,
    effect: { damageMult: 0.1 },
  },
  "rel-barrier": {
    id: "rel-barrier",
    name: "전개식 보호 모듈",
    icon: "shield",
    description: "전투 시작 시 파티 전원 보호막 +12.",
    price: 150,
    effect: { startShield: 12 },
  },
  "rel-loader": {
    id: "rel-loader",
    name: "자동 장전기",
    icon: "layers",
    description: "매 턴 카드를 1장 더 뽑는다.",
    price: 190,
    effect: { handBonus: 1 },
  },
};

export const RELIC_IDS = Object.keys(RELICS);

export function getRelic(id: string): RelicDef | undefined {
  return RELICS[id];
}

// 보유 유물들의 효과를 합산.
export function getRelicEffects(ids: string[]): Required<RelicEffect> {
  const total: Required<RelicEffect> = { startEnergy: 0, maxEnergyBonus: 0, handBonus: 0, startShield: 0, critBonus: 0, damageMult: 0 };
  ids.forEach((id) => {
    const fx = RELICS[id]?.effect;
    if (!fx) return;
    total.startEnergy += fx.startEnergy ?? 0;
    total.maxEnergyBonus += fx.maxEnergyBonus ?? 0;
    total.handBonus += fx.handBonus ?? 0;
    total.startShield += fx.startShield ?? 0;
    total.critBonus += fx.critBonus ?? 0;
    total.damageMult += fx.damageMult ?? 0;
  });
  return total;
}

// 보상/상점 추첨용: 아직 보유하지 않은 유물 중 결정적으로 N개.
export function pickRelics(owned: string[], count: number, seed: number): string[] {
  const pool = RELIC_IDS.filter((id) => !owned.includes(id));
  const out: string[] = [];
  let s = (seed * 40503 + 12345) & 0x7fffffff;
  for (let i = 0; i < count && pool.length > 0; i += 1) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out.push(pool.splice(s % pool.length, 1)[0]);
  }
  return out;
}
