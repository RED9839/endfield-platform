import type { Element, RewardTier } from "../types/game";

// 세력별 원소 약점(본편 컨셉): 해당 원소로 공격하면 추가 피해 → 원소·아츠 매칭 보상.
//  · 광석수(감염수): 열기로 불태움
//  · 아겔로스(구조체): 전기로 전자 교란
//  · 침식체(조석/부식): 물은 전기를 전도 → 전기
//  · 본크러셔(방화·헤이즈파이어): 냉기로 화염 진압
//  · 청파채(녹림 무법): 자연 아츠가 천적
export const FACTION_WEAKNESS: Record<string, Element> = {
  "광석수": "heat",
  "아겔로스": "electric",
  "침식체": "electric",
  "본크러셔": "cryo",
  "청파채": "nature",
};

export const WEAKNESS_AMP = 1.2; // 약점 원소 피해 +20%

export function getEnemyWeakness(faction?: string): Element | undefined {
  return faction ? FACTION_WEAKNESS[faction] : undefined;
}

// ===== 적 티어별 드랍 테이블 =====
// 처치한 적의 티어에 따라 전리품이 결정된다. 저티어=소액·하급 장비 / 고티어=대량·고급 장비·유물·포션.
type TierDrop = { credits: number; gearTier: RewardTier; relic: boolean };
export const TIER_DROP: Record<string, TierDrop> = {
  Common: { credits: 10, gearTier: "early", relic: false },
  Normal: { credits: 16, gearTier: "early", relic: false },
  Enhanced: { credits: 24, gearTier: "mid", relic: false },
  Advanced: { credits: 30, gearTier: "mid", relic: false },
  Alpha: { credits: 36, gearTier: "late", relic: false },
  Elite: { credits: 60, gearTier: "elite", relic: true },
  Boss: { credits: 140, gearTier: "boss", relic: true },
};
const GEAR_RANK: Record<RewardTier, number> = { early: 1, mid: 2, late: 3, elite: 4, boss: 5 };

// 전투 전리품 계산: 처치한 적들의 티어를 합산 + 계층(외곽<중심부<심층부) 배수.
export function computeBattleDrop(enemies: { tier?: string }[], floor: number) {
  const layerMult = floor <= 7 ? 1 : floor <= 14 ? 1.4 : 1.9;
  let value = 0;
  let gearTier: RewardTier = "early";
  let wantRelic = false;
  for (const e of enemies) {
    const d = TIER_DROP[e.tier ?? "Normal"] ?? TIER_DROP.Normal;
    value += d.credits;
    if (GEAR_RANK[d.gearTier] > GEAR_RANK[gearTier]) gearTier = d.gearTier;
    if (d.relic) wantRelic = true;
  }
  return {
    credits: Math.round(value * layerMult),
    value, // 계층 배수 전 원시 가치(포션 드랍 판정용)
    gearTier,
    gearCount: gearTier === "boss" ? 5 : gearTier === "elite" ? 4 : 3,
    wantRelic,
  };
}
