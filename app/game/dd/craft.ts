// ===== 장비 제작 시스템 (원작 Endfield 공업식) =====
// 런에서 재료(장비 부품·관리권) 획득 → 원하는 피스 확정 제작(랜덤 X) → 보유 피스 장착.
// 220 랜덤 드롭 대신 "재료 모아 만들고 싶은 걸 제작" → 그라인드 없이 목표 빌드 달성.
import { GEAR_PIECE_BY_ID, GEAR_SLOTS, LOADOUT_SLOTS, OP_GEAR, type GearPiece, type GearSlot, type Loadout, type LoadoutSlot } from "./gear";

export type CraftMats = { parts: number; permits: number }; // 장비 부품 · 지역 관리권
export type CraftState = { mats: CraftMats; owned: Record<string, number> }; // owned: 피스 id → 단조 레벨(0~3)

export const initialCraft = (): CraftState => ({ mats: { parts: 0, permits: 0 }, owned: {} });
export const cloneCraft = (c: CraftState): CraftState => ({ mats: { ...c.mats }, owned: { ...c.owned } });

// 제작 비용(레어도 비례). 5★ 세트 피스 ≈ 부품14·관리권2.
// 파워의 대부분은 "12피스 소유"에서 나오므로(단조는 부차적), 중반에 풀 커버리지 되도록 부품 낮게.
export const craftCost = (p: GearPiece): CraftMats => { const r = p.rarity || 4; return { parts: 4 + r * 2, permits: r >= 5 ? 2 : 1 }; };
// 단조 비용(현재 레벨 → +1). +0→+1→+2→+3.
export const forgeCost = (lv: number): CraftMats => [{ parts: 5, permits: 1 }, { parts: 9, permits: 1 }, { parts: 15, permits: 2 }][lv] ?? { parts: Infinity, permits: Infinity };
// 스킬 단조 비용(현재 랭크 → +1). 9Lv(M0)→M1→M2→M3. 스킬은 오퍼 딜 전반을 올려 장비 단조보다 비싸다.
export const skillForgeCost = (rank: number): CraftMats => [{ parts: 14, permits: 2 }, { parts: 22, permits: 3 }, { parts: 34, permits: 4 }][rank] ?? { parts: Infinity, permits: Infinity };
export const canAfford = (m: CraftMats, c: CraftMats) => m.parts >= c.parts && m.permits >= c.permits;

const afford = (m: CraftMats, c: CraftMats) => m.parts >= c.parts && m.permits >= c.permits;
const spend = (m: CraftMats, c: CraftMats) => { m.parts -= c.parts; m.permits -= c.permits; };

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
