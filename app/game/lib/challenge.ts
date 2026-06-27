// 보스 점수 도전: 로그라이크로 빚은 덱을 저장해, 보스를 '처치 턴수'로 도전한다.
import type { DeckCard, PartyMember } from "../types/game";

export type DeckSnapshot = {
  party: PartyMember[]; // 장비·정예화가 반영된 파티(전투 직전 상태)
  deck: DeckCard[]; // 보유 덱(eliteLevel·copyLock 포함)
  relics: string[];
  sp: number;
  maxSp: number;
  savedAt: number; // 저장 시각(표시용)
};

// 도전 가능한 보스(5세력 최종 보스)
export type ChallengeBoss = { id: string; faction: string };
export const CHALLENGE_BOSSES: ChallengeBoss[] = [
  { id: "craghowler", faction: "탈로스 광석수" },
  { id: "triaggelos", faction: "아겔로이 강습" },
  { id: "tidalklast", faction: "무릉 조석" },
  { id: "nefarith-conqueror", faction: "변경 본크러셔" },
  { id: "ruan-yi", faction: "청파채" },
];

const DECK_KEY = "endfield-challenge-deck";
const SCORE_KEY = "endfield-challenge-scores";

export function saveDeckSnapshot(snapshot: DeckSnapshot) {
  try { localStorage.setItem(DECK_KEY, JSON.stringify(snapshot)); } catch { /* 무시 */ }
}
export function loadDeckSnapshot(): DeckSnapshot | null {
  try { const raw = localStorage.getItem(DECK_KEY); return raw ? (JSON.parse(raw) as DeckSnapshot) : null; } catch { return null; }
}
export function hasDeckSnapshot() { return loadDeckSnapshot() != null; }

// 보스별 최고 기록(처치 턴수, 적을수록 좋음)
export function loadBestScores(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(SCORE_KEY) || "{}"); } catch { return {}; }
}
// 갱신되면 true 반환(신기록)
export function recordScore(bossId: string, turns: number): boolean {
  const scores = loadBestScores();
  if (scores[bossId] == null || turns < scores[bossId]) {
    scores[bossId] = turns;
    try { localStorage.setItem(SCORE_KEY, JSON.stringify(scores)); } catch { /* 무시 */ }
    return true;
  }
  return false;
}
