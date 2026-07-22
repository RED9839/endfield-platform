// ===== 장비 제작 시스템 (원작 Endfield 공업식) =====
// 런에서 재료(장비 부품·관리권) 획득 → 원하는 피스 확정 제작(랜덤 X) → 보유 피스 장착.
// 220 랜덤 드롭 대신 "재료 모아 만들고 싶은 걸 제작" → 그라인드 없이 목표 빌드 달성.
import { GEAR_PIECE_BY_ID, GEAR_SLOTS, LOADOUT_SLOTS, OP_GEAR, type GearPiece, type GearSlot, type Loadout, type LoadoutSlot } from "./gear";

// 재료: 장비 부품 · 지역 관리권 · 프로토콜 프리즘(마스터리 전용). 원작대로 스킬 재료는 장비 재료와 별개다.
export type CraftMats = { parts: number; permits: number; chips?: number };
// credits: 몹 처치 보상 통화 — 야영지 상점에서 위 재료·소비템으로 교환한다(직접 제작엔 안 쓰임).
export type CraftState = { mats: CraftMats; owned: Record<string, number>; credits: number }; // owned: 피스 id → 단조 레벨(0~3)

export const initialCraft = (): CraftState => ({ mats: { parts: 0, permits: 0, chips: 0 }, owned: {}, credits: 0 });
export const cloneCraft = (c: CraftState): CraftState => ({ mats: { ...c.mats }, owned: { ...c.owned }, credits: c.credits });

// 제작 비용(레어도 비례). 5★ 세트 피스 ≈ 부품14·관리권2.
// 파워의 대부분은 "12피스 소유"에서 나오므로(단조는 부차적), 중반에 풀 커버리지 되도록 부품 낮게.
export const craftCost = (p: GearPiece): CraftMats => { const r = p.rarity || 4; return { parts: 4 + r * 2, permits: r >= 5 ? 2 : 1 }; };
// 단조 비용(현재 레벨 → +1). +0→+1→+2→+3. 풀단조를 런의 장기 목표로 두어 매 층 일부만 단조하도록 잡는다.
export const forgeCost = (lv: number): CraftMats => [{ parts: 5, permits: 1 }, { parts: 10, permits: 2 }, { parts: 15, permits: 3 }][lv] ?? { parts: Infinity, permits: Infinity };
// 스킬 강화 비용(현재 랭크 → +1). 9Lv(M0)→M1→M2→M3. 장비 재료가 아니라 프로토콜 프리즘만 쓴다(원작: 스킬 재료 ≠ 장비 재료).
export const skillForgeCost = (rank: number): CraftMats => [{ parts: 0, permits: 0, chips: 15 }, { parts: 0, permits: 0, chips: 25 }, { parts: 0, permits: 0, chips: 35 }][rank] ?? { parts: Infinity, permits: Infinity, chips: Infinity };
export const canAfford = (m: CraftMats, c: CraftMats) => m.parts >= c.parts && m.permits >= c.permits && (m.chips ?? 0) >= (c.chips ?? 0);

const afford = canAfford;
const spend = (m: CraftMats, c: CraftMats) => { m.parts -= c.parts; m.permits -= c.permits; m.chips = (m.chips ?? 0) - (c.chips ?? 0); };

// ── 야영지 크레딧 상점 ── 몹이 준 크레딧으로 재료·소비템을 산다. 재료는 상점에서만 구매(정예·보스는 소량 직접 드롭도).
export type ShopItem = { key: string; label: string; kind: "mat" | "item"; give: Partial<CraftMats> | { itemId: string }; price: number; desc: string };
export const SHOP: ShopItem[] = [
  { key: "buy-parts", label: "장비 부품 ×10", kind: "mat", give: { parts: 10 }, price: 30, desc: "장비 제작·단조 재료" },
  { key: "buy-permits", label: "관리권 ×5", kind: "mat", give: { permits: 5 }, price: 40, desc: "장비 제작·단조 재료" },
  { key: "buy-chips", label: "프로토콜 프리즘 ×5", kind: "mat", give: { chips: 5 }, price: 45, desc: "마스터리 전용 재료" },
  // 상점은 하급(tier3) 소비템만. 상급·최상급은 정예·보스가 드롭한다(상점 판매 X).
  { key: "buy-heal", label: "메밀꽃 치유 캡슐 ×1", kind: "item", give: { itemId: "heal-cap-1" }, price: 20, desc: "즉시 회복 620 (기본 회복제)" },
  { key: "buy-can", label: "시트론 통조림 ×1", kind: "item", give: { itemId: "can-1" }, price: 15, desc: "3라운드 재생 (기본 재생제)" },
];
export const canBuy = (cs: CraftState, s: ShopItem) => cs.credits >= s.price;

// 안 쓰는 재료는 상점에 되판다 — 구매 단가의 30%(내림). 부품 30원/10개=3원/개 → 되팔기 0원 방지 위해 올림 처리.
export const SELL_RATE = 0.3;
export type SellMat = "parts" | "permits" | "chips";
// 재료 1개당 구매 단가(SHOP 번들 기준): 부품 3 · 관리권 8 · 프로토콜 프리즘 9
const BUY_UNIT: Record<SellMat, number> = { parts: 3, permits: 8, chips: 9 };
export const sellUnit = (mat: SellMat) => Math.max(1, Math.round(BUY_UNIT[mat] * SELL_RATE)); // 부품 1 · 관리권 2 · 프로토콜 프리즘 3
export const matAmount = (cs: CraftState, mat: SellMat) => (mat === "chips" ? cs.mats.chips ?? 0 : cs.mats[mat]);
// 소비 아이템 되팔기 — 레어도별 기준가의 30%(내림, 최소 3). r2 15 → 5 · r3 20 → 6 · r4 25 → 8 · r6 40 → 12
const ITEM_BASE: Record<number, number> = { 2: 15, 3: 20, 4: 25, 5: 32, 6: 40 };
export const itemSellValue = (rarity: number) => Math.max(3, Math.round((ITEM_BASE[rarity] ?? 20) * SELL_RATE));

// 피스 제작(보유에 추가, 단조0). 이미 보유/재료 부족이면 false.
export function craftPiece(cs: CraftState, pieceId: string): boolean {
  const p = GEAR_PIECE_BY_ID[pieceId];
  if (!p || cs.owned[pieceId] != null || !afford(cs.mats, craftCost(p))) return false;
  spend(cs.mats, craftCost(p)); cs.owned[pieceId] = 0; return true;
}
// 보유 피스 단조 +1(최대 3). 미보유/최대/재료 부족이면 false.
export function forgePiece(cs: CraftState, pieceId: string): boolean {
  const lv = cs.owned[pieceId];
  if (lv == null || lv >= 3 || !afford(cs.mats, forgeCost(lv))) return false;
  spend(cs.mats, forgeCost(lv)); cs.owned[pieceId] = lv + 1; return true;
}
export const isOwned = (cs: CraftState, pieceId: string) => cs.owned[pieceId] != null;
export const pieceLevel = (cs: CraftState, pieceId: string) => cs.owned[pieceId] ?? 0;

// 오퍼 추천 빌드(OP_GEAR) 중 보유 피스만 장착 → 로드아웃 + 부위별 단조 레벨.
export function ownedLoadout(opId: string, cs: CraftState): { loadout: Loadout; levels: Partial<Record<LoadoutSlot, number>> } {
  const rec = (OP_GEAR[opId] ?? {}) as Loadout;
  const loadout: Loadout = {}, levels: Partial<Record<LoadoutSlot, number>> = {};
  for (const slot of LOADOUT_SLOTS) { const pid = rec[slot]; if (pid && cs.owned[pid] != null) { loadout[slot] = pid; levels[slot] = cs.owned[pid]; } }
  return { loadout, levels };
}
// 오퍼 추천 빌드에서 아직 미보유(제작 필요)인 피스 목록.
export function missingPieces(opId: string, cs: CraftState): GearPiece[] {
  const rec = (OP_GEAR[opId] ?? {}) as Loadout;
  return [...new Set(LOADOUT_SLOTS.map((s) => rec[s]))].filter((pid): pid is string => !!pid && cs.owned[pid] == null).map((pid) => GEAR_PIECE_BY_ID[pid]).filter(Boolean);
}
