// ===== 유물(슬더스식 렐릭) =====
// 장비와 별개로, 런 내내 상시 적용되는 패시브. 엘리트/보스 보상·상점에서 획득.

export type RelicDef = {
  id: string;
  name: string;
  icon: string; // lucide 아이콘 키(이미지 없을 때 폴백)
  image?: string; // 오퍼레이터 아바타 이미지 경로(/relics/<slug>.png)
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
  // === 오퍼레이터 특성 연동 효과 ===
  vsBrokenDamage?: number; // 불균형(방어 붕괴) 적에게 카드 피해 +N% (첸의 처단)
  aoeDamage?: number; // 전체(AoE) 카드 피해 +N% (실버애쉬의 일소)
  startMultiHit?: number; // 전투 시작 시 연타 N스택 (엑시아의 연사)
  regenPerTurn?: number; // 매 턴 파티 회복 +N (사리아·나이팅게일의 치유)
  enemyStartDelay?: number; // 전투 시작 시 모든 적 행동 게이지 -N (무성의 시간 감속)
};

// 원작 명일방주 오퍼레이터의 실제 시그니처(스킬·무기·특성)를 유물로. 이미지는 오퍼 아바타.
// 효과는 밸런스 우선으로 약하게, 강한 정수 레버(드로우)는 고가로 게이팅.
export const RELICS: Record<string, RelicDef> = {
  "rel-exusiai-mag": {
    id: "rel-exusiai-mag",
    name: "엑시아의 빠른 탄창",
    icon: "battery",
    image: "/relics/exusiai.png",
    description: "산타의 연사 특성. 전투 시작 시 연타 2스택을 얻는다(배틀·궁극 스킬 강화).",
    price: 150,
    effect: { startMultiHit: 2 },
  },
  "rel-chen-saber": {
    id: "rel-chen-saber",
    name: "첸의 참(斬)",
    icon: "crosshair",
    image: "/relics/chen.png",
    description: "치샤오 무영의 일격. 불균형(방어 붕괴) 상태의 적에게 카드 피해 +15%.",
    price: 170,
    effect: { vsBrokenDamage: 0.15 },
  },
  "rel-silverash-truth": {
    id: "rel-silverash-truth",
    name: "실버애쉬의 진은참",
    icon: "trending-up",
    image: "/relics/silverash.png",
    description: "설원을 가르는 진은참(Truesilver Slash). 전체(AoE) 카드 피해 +20%.",
    price: 180,
    effect: { aoeDamage: 0.2 },
  },
  "rel-saria-barrier": {
    id: "rel-saria-barrier",
    name: "사리아의 석회화",
    icon: "shield",
    image: "/relics/saria.png",
    description: "수호와 치유를 겸한다. 전투 시작 시 보호막 +8, 매 턴 파티 회복 +3.",
    price: 160,
    effect: { startShield: 8, regenPerTurn: 3 },
  },
  "rel-surtr-sword": {
    id: "rel-surtr-sword",
    name: "수르트의 레바테인",
    icon: "flame",
    image: "/relics/surtr.png",
    description: "폭주하는 마검 레바테인(Laevatain). 카드 피해 +8%.",
    price: 200,
    effect: { damageMult: 0.08 },
  },
  "rel-kaltsit-mephisto": {
    id: "rel-kaltsit-mephisto",
    name: "켈시의 메피스토",
    icon: "heart-pulse",
    image: "/relics/kaltsit.png",
    description: "메피스토의 치유 지령. 매 턴 파티 전원 회복 +5.",
    price: 150,
    effect: { regenPerTurn: 5 },
  },
  "rel-suzuran-foxfire": {
    id: "rel-suzuran-foxfire",
    name: "슈우의 여우불",
    icon: "zap",
    image: "/relics/suzuran.png",
    description: "여우불(Foxfire Haze)의 미혹. 전투 시작 시 모든 적의 행동을 2만큼 지연시킨다.",
    price: 170,
    effect: { enemyStartDelay: 2 },
  },
  "rel-ptilopsis-enkephalin": {
    id: "rel-ptilopsis-enkephalin",
    name: "필로프시스의 엔케팔린",
    icon: "layers",
    image: "/relics/ptilopsis.png",
    description: "정신 가속(Enkephalin). 매 턴 카드를 1장 더 뽑는다. (희귀)",
    price: 320,
    effect: { handBonus: 1 },
  },
};

export const RELIC_IDS = Object.keys(RELICS);

export function getRelic(id: string): RelicDef | undefined {
  return RELICS[id];
}

// 보유 유물들의 효과를 합산.
export function getRelicEffects(ids: string[]): Required<RelicEffect> {
  const total: Required<RelicEffect> = { startEnergy: 0, maxEnergyBonus: 0, handBonus: 0, startShield: 0, critBonus: 0, damageMult: 0, vsBrokenDamage: 0, aoeDamage: 0, startMultiHit: 0, regenPerTurn: 0, enemyStartDelay: 0 };
  ids.forEach((id) => {
    const fx = RELICS[id]?.effect;
    if (!fx) return;
    total.startEnergy += fx.startEnergy ?? 0;
    total.maxEnergyBonus += fx.maxEnergyBonus ?? 0;
    total.handBonus += fx.handBonus ?? 0;
    total.startShield += fx.startShield ?? 0;
    total.critBonus += fx.critBonus ?? 0;
    total.damageMult += fx.damageMult ?? 0;
    total.vsBrokenDamage += fx.vsBrokenDamage ?? 0;
    total.aoeDamage += fx.aoeDamage ?? 0;
    total.startMultiHit += fx.startMultiHit ?? 0;
    total.regenPerTurn += fx.regenPerTurn ?? 0;
    total.enemyStartDelay += fx.enemyStartDelay ?? 0;
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
