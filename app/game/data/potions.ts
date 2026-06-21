// ===== 소비 아이템(전술 도구) =====
// Arknights: Endfield 실제 '전술 아이템/소모품'의 인게임 효과를 게임 스케일로 축약.
// 실수치(예: 즉시 470 회복, HoT 88/s×6, 피해 +18%, 궁극충전 +24%)를 카드 전투 규모(maxHp 56~90)로 환산.

export type PotionEffect =
  | { kind: "heal"; amount: number; pct?: number } // 즉시 회복(pct = maxHp 비율 0~1 추가)
  | { kind: "regen"; amount: number; turns: number } // 지속 회복(HoT): N턴간 매 턴 회복
  | { kind: "revive"; pct: number } // 전투 불능 아군 1명 부활(maxHp 비율로 회복)
  | { kind: "dmg-buff"; pct: number } // 이번 전투 카드 피해 +pct
  | { kind: "crit-buff"; crit: number; dmg: number } // 이번 전투 치명 확률 + 피해 증가
  | { kind: "max-energy"; amount: number } // 이번 전투 최대 에너지 +N
  | { kind: "strike"; amount: number; scope: "all" }; // 광역 피해

export type PotionDef = {
  id: string;
  name: string;
  image: string;
  color: string;
  rarity: number; // 1~3
  price: number;
  description: string;
  effect: PotionEffect;
};

// 실제 효과 → 게임 환산. (원문 효과를 주석에 병기)
export const POTIONS: Record<string, PotionDef> = {
  "pot-heal-s": {
    id: "pot-heal-s",
    name: "메밀꽃 치유 캡슐",
    image: "/items/메밀꽃 치유 캡슐.webp",
    color: "#86efac",
    rarity: 1,
    price: 55,
    description: "파티 전원 HP +22.", // 원문: 즉시 생명력 470 회복
    effect: { kind: "heal", amount: 22 },
  },
  "pot-heal-l": {
    id: "pot-heal-l",
    name: "금초 청량음료",
    image: "/items/금초 청량음료.webp",
    color: "#4ade80",
    rarity: 2,
    price: 80,
    description: "파티 전원 HP +44.", // 원문: 즉시 생명력 1278 회복
    effect: { kind: "heal", amount: 44 },
  },
  "pot-heal-pct": {
    id: "pot-heal-pct",
    name: "거점 지역의 비상식량",
    image: "/items/거점 지역의 비상식량.webp",
    color: "#22c55e",
    rarity: 2,
    price: 80,
    description: "파티 전원 최대 HP 20% + 10 회복.", // 원문: 전체 최대 생명력 8% + 289 회복
    effect: { kind: "heal", amount: 10, pct: 0.2 },
  },
  "pot-regen-s": {
    id: "pot-regen-s",
    name: "시트론 가루",
    image: "/items/시트론 가루.webp",
    color: "#67e8f9",
    rarity: 1,
    price: 55,
    description: "3턴간 매 턴 파티 HP +8 (지속 회복).", // 원문: 초당 88 회복, 6초 지속
    effect: { kind: "regen", amount: 8, turns: 3 },
  },
  "pot-regen-l": {
    id: "pot-regen-l",
    name: "야침 주사약",
    image: "/items/야침 주사약.webp",
    color: "#38bdf8",
    rarity: 2,
    price: 80,
    description: "3턴간 매 턴 파티 HP +15 (지속 회복).", // 원문: 초당 320 회복, 6초 지속
    effect: { kind: "regen", amount: 15, turns: 3 },
  },
  "pot-revive": {
    id: "pot-revive",
    name: "아츠를 각인한 병",
    image: "/items/아츠를 각인한 병.webp",
    color: "#ffd24a",
    rarity: 3,
    price: 120,
    description: "전투 불능 아군 1명을 최대 HP 45%로 부활.", // 원문: 전투 불능 아군 부활 + 10% 회복
    effect: { kind: "revive", pct: 0.45 },
  },
  "pot-dmg": {
    id: "pot-dmg",
    name: "아츠가 부여된 병",
    image: "/items/아츠가 부여된 병.webp",
    color: "#fb923c",
    rarity: 2,
    price: 85,
    description: "이번 전투 동안 카드 피해 +18%.", // 원문: 주는 모든 피해 +18%, 300초
    effect: { kind: "dmg-buff", pct: 0.18 },
  },
  "pot-crit": {
    id: "pot-crit",
    name: "원기 회복 탕약",
    image: "/items/원기 회복 탕약.webp",
    color: "#f87171",
    rarity: 3,
    price: 110,
    description: "이번 전투 동안 치명타 확률 +9% · 카드 피해 +12%.", // 원문: 치명 +9%, 피해 +18%, 300초
    effect: { kind: "crit-buff", crit: 0.09, dmg: 0.12 },
  },
  "pot-energy": {
    id: "pot-energy",
    name: "혼란의 약제",
    image: "/items/혼란의 약제.webp",
    color: "#c084fc",
    rarity: 3,
    price: 115,
    description: "이번 전투 동안 최대 에너지 +1.", // 원문: 궁극기 충전 효율 +24%, 300초
    effect: { kind: "max-energy", amount: 1 },
  },
  "pot-bomb": {
    id: "pot-bomb",
    name: "공업 폭발물",
    image: "/items/공업 폭발물.webp",
    color: "#f97316",
    rarity: 2,
    price: 85,
    description: "모든 적에게 24 피해.", // 원문: 폭발 시 주변 모든 적에게 피해
    effect: { kind: "strike", amount: 24, scope: "all" },
  },
};

export const POTION_IDS = Object.keys(POTIONS);
export const MAX_POTIONS = 3;

export function getPotion(id: string): PotionDef | undefined {
  return POTIONS[id];
}

// 현재 소비 아이템은 모두 자기/광역 대상 → 적 지정 불필요.
export function potionNeedsTarget(_id: string): boolean {
  return false;
}

// 등급 가중 추첨(낮은 등급일수록 흔함): T1×3 · T2×2 · T3×1
export function pickPotions(count: number, seed: number): string[] {
  const weighted: string[] = [];
  for (const id of POTION_IDS) {
    const w = 4 - (POTIONS[id].rarity ?? 1);
    for (let i = 0; i < w; i += 1) weighted.push(id);
  }
  const out: string[] = [];
  let s = (seed * 22695477 + 1) & 0x7fffffff;
  for (let i = 0; i < count; i += 1) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out.push(weighted[s % weighted.length]);
  }
  return out;
}
