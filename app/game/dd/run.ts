"use client";
// 닼던류 런 상태 — 편성 → 던전 맵(노드 진행) → 전투(HP 지속 소모) → 야영/보스. DD 엔진 위에 로그라이크 흐름.
import { useCallback, useMemo, useState } from "react";

import { makeAlly } from "./roster";
import { GEAR_SLOTS, GEAR_PIECE_BY_ID, type Loadout } from "./gear";
import { rewardItemPool } from "./items";
import { SKILL_MAX, DEFAULT_PROGRESS, type OpProgress } from "./progress";
import { initialCraft, craftPiece as doCraft, forgePiece as doForge, cloneCraft, craftCost, skillForgeCost, canAfford, type CraftState } from "./craft";
import { FACTIONS, enemyDrop, resetEncounterHistory } from "./sim";

const MAX_DEPTH = 6; // 층당 구역 7개(0~6), 6=층 보스
// 6층 타워 — 각 층 = 보스 세력 리전. 층 보스를 깨면 다음 층으로.
export type Floor = { faction: string; boss: string; name: string };
export const FLOORS: Floor[] = [
  { faction: "랜드브레이커", boss: "rhodagn-the-bonekrushing-fist", name: "본 크러셔 캠프" },   // 1층 로댄
  { faction: "아겔로스", boss: "triaggelos", name: "형성의 둥지" },                            // 2층 트리아겔로스
  { faction: "아겔로스", boss: "marble-aggelo", name: "각성한 마블" },                         // 3층 마블 아겔로미레
  { faction: "청파채", boss: "ruan-yi", name: "청파채 거점" },                                // 4층 원일
  { faction: "랜드브레이커", boss: "nefarith-conqueror", name: "정복자의 왕좌" },              // 5층 정복자 네파리스
  { faction: "그림자에 물든", boss: "alleikhreos", name: "초자연의 균열" },                    // 6층 알레이크레오스
];
export const LOOT_DECAY = 0.94; // 층당 재화 획득 -6%
const pickRand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export type NodeKind = "battle" | "elite" | "rest" | "boss";
export type RunNode = { id: string; depth: number; lane: number; kind: NodeKind; next: string[] };
export type RunPhase = "select" | "map" | "battle" | "rest" | "craft" | "spoils" | "victory" | "defeat";
export type PartyPick = { id: string; loadout?: Loadout; progress?: OpProgress; ult?: number };
export type PartyMember = { id: string; hp: number; maxHp: number; loadout?: Loadout; progress?: OpProgress; ult?: number };
export type BattleResult = { id: string; hp: number; ult?: number }; // ult: 궁 게이지 이월(HP처럼 런 내내 유지 — 보스 전 만충이 목표)

export const REST_HEAL = 0.4; // 야영 회복 비율(최대 HP)

const ENCOUNTER_OF: Record<NodeKind, string> = { battle: "normal", elite: "elite", boss: "boss", rest: "normal" };
export const encounterForNode = (k: NodeKind) => ENCOUNTER_OF[k];

// 던전 맵 레이아웃(깊이별 노드 수 + 종류 풀). 각 노드는 다음 깊이 전체와 연결(항상 도달 가능).
const LAYOUT: { count: number; pool: NodeKind[] }[] = [
  { count: 1, pool: ["battle"] },                    // 구역 1 — 도입
  { count: 3, pool: ["battle", "elite", "battle"] }, // 구역 2 — 정예 선택지
  { count: 2, pool: ["rest", "battle"] },            // 구역 3 — 회복
  { count: 3, pool: ["battle", "elite", "battle"] }, // 구역 4 — 정예 선택지
  { count: 3, pool: ["elite", "battle", "elite"] },  // 구역 5 — 정예 밀집
  { count: 2, pool: ["rest", "battle"] },            // 구역 6 — 보스 직전 회복
  { count: 1, pool: ["boss"] },                      // 구역 7 — 층 보스
];

function genMap(): RunNode[] {
  const byDepth: RunNode[][] = [];
  const all: RunNode[] = [];
  LAYOUT.forEach((L, d) => {
    const row: RunNode[] = [];
    // 종류 풀을 가볍게 섞어 판마다 배치 변화
    const pool = [...L.pool].sort(() => Math.random() - 0.5);
    for (let lane = 0; lane < L.count; lane++) {
      row.push({ id: `d${d}l${lane}`, depth: d, lane, kind: pool[lane % pool.length], next: [] });
    }
    byDepth.push(row);
    all.push(...row);
  });
  for (let d = 0; d < byDepth.length - 1; d++) for (const n of byDepth[d]) n.next = byDepth[d + 1].map((x) => x.id);
  return all;
}

export function useDDRun() {
  const [phase, setPhase] = useState<RunPhase>("select");
  const [party, setParty] = useState<PartyMember[]>([]);
  const [nodes, setNodes] = useState<RunNode[]>([]);
  const [frontier, setFrontier] = useState<string[]>([]); // 지금 선택 가능한 노드 id
  const [cleared, setCleared] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null); // 해결 중 노드
  const [depthReached, setDepthReached] = useState(0);
  const [items, setItems] = useState<Record<string, number>>({}); // 소지 소모품(id → 개수)
  const [craft, setCraft] = useState<CraftState>(initialCraft); // 제작: 재료(장비 부품·관리권) + 보유 피스
  const [floor, setFloor] = useState(0); // 현재 층(0~5) — FLOORS 인덱스
  const [faction, setFaction] = useState<string>(FLOORS[0].faction); // 이번 층 세력 리전(층 보스 세력)
  const [loot, setLoot] = useState<{ parts: number; permits: number; items: Record<string, number>; kills: number }>({ parts: 0, permits: 0, items: {}, kills: 0 }); // 이번 원정 누적 전리품(승리 화면 표시)
  const [lastLoot, setLastLoot] = useState<{ parts: number; permits: number; item: string; kind: NodeKind } | null>(null); // 방금 교전 획득(전리품 화면 표시)

  const useItem = useCallback((id: string) => setItems((m) => { const n = (m[id] ?? 0) - 1; const c = { ...m }; if (n <= 0) delete c[id]; else c[id] = n; return c; }), []);
  const addItem = useCallback((id: string) => setItems((m) => ({ ...m, [id]: (m[id] ?? 0) + 1 })), []);
  // 피스 제작 / 단조 — 성공 시 상태 갱신, 성공 여부 반환
  const craftPiece = useCallback((pieceId: string) => { let ok = false; setCraft((c) => { const n = cloneCraft(c); ok = doCraft(n, pieceId); return ok ? n : c; }); return ok; }, []);
  const forgePiece = useCallback((pieceId: string) => { let ok = false; setCraft((c) => { const n = cloneCraft(c); ok = doForge(n, pieceId); return ok ? n : c; }); return ok; }, []);
  // 장비 슬롯 교체(런 중) — 파티원 로드아웃의 해당 슬롯을 다른 피스로. 다음 전투 createBattle에 반영.
  const swapGear = useCallback((opId: string, slot: keyof Loadout, pieceId: string) => setParty((ps) => ps.map((p) => p.id === opId ? { ...p, loadout: { ...p.loadout, [slot]: pieceId } } : p)), []);
  // 스킬 단조(런 중) — 재화(부품·관리권) 소모 → 파티원 skillRank +1. 다음 전투 createBattle → makeAlly(progress)에 반영.
  const forgeSkill = useCallback((opId: string) => {
    const m = party.find((p) => p.id === opId);
    const rank = m?.progress?.skillRank ?? 0;
    if (!m || rank >= SKILL_MAX || !canAfford(craft.mats, skillForgeCost(rank))) return false;
    const cost = skillForgeCost(rank);
    setCraft((c) => ({ ...c, mats: { parts: c.mats.parts - cost.parts, permits: c.mats.permits - cost.permits } }));
    setParty((ps) => ps.map((p) => p.id === opId ? { ...p, progress: { ...(p.progress ?? DEFAULT_PROGRESS), skillRank: rank + 1 } } : p));
    return true;
  }, [party, craft]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const activeNode = activeId ? nodeMap[activeId] : null;

  // 파티 목표 장비 중 아직 안 만들었고 재화로 만들 수 있는 피스가 있는가(공업소 진입 유도용)
  const hasCraftable = useMemo(() => party.some((m) => m.loadout && GEAR_SLOTS.some((slot) => {
    const ref = m.loadout![slot]; const p = ref ? GEAR_PIECE_BY_ID[ref] : undefined;
    return p && craft.owned[ref!] == null && canAfford(craft.mats, craftCost(p));
  })), [party, craft]);

  const startRun = useCallback((picks: PartyPick[]) => {
    resetEncounterHistory(); // 새 원정 — 적 등장 이력 초기화
    const p = picks.map((pick) => { const u = makeAlly(pick.id, 1, pick.progress); return { id: pick.id, hp: u.maxHp, maxHp: u.maxHp, loadout: pick.loadout, progress: pick.progress }; });
    const map = genMap();
    setParty(p);
    setNodes(map);
    setFrontier(map.filter((n) => n.depth === 0).map((n) => n.id));
    setCleared([]);
    setDepthReached(0);
    setActiveId(null);
    setItems({ "heal-cap-1": 2, "can-1": 1, "recov-1": 1 }); // 시작 키트
    setCraft({ mats: { parts: 100, permits: 16 }, owned: {} }); // 맨몸 시작 — 공업소에서 목표 빌드 직접 제작
    setLoot({ parts: 0, permits: 0, items: {}, kills: 0 }); // 전리품 초기화
    setFloor(0); // 1층부터
    setFaction(FLOORS[0].faction); // 1층 세력
    setPhase("map");
  }, []);

  // 층 보스 격파 → 다음 층 진입(전열 재정비 = HP 회복, 재화 이월, 새 세력 맵)
  const advanceFloor = useCallback(() => {
    setParty((cur) => cur.map((m) => (m.hp > 0 ? { ...m, hp: m.maxHp } : m))); // 층 클리어 보상: 생존자 HP 완전 회복
    setFloor((f) => {
      const nf = f + 1;
      if (nf >= FLOORS.length) { setPhase("victory"); return f; } // 최종 층(알레이크레오스) 클리어
      const map = genMap();
      setFaction(FLOORS[nf].faction);
      setNodes(map);
      setFrontier(map.filter((n) => n.depth === 0).map((n) => n.id));
      setCleared([]);
      setDepthReached(0);
      setActiveId(null);
      resetEncounterHistory();
      setPhase("map");
      return nf;
    });
  }, []);

  const enterNode = useCallback((n: RunNode) => {
    setActiveId(n.id);
    setPhase(n.kind === "rest" ? "rest" : "battle");
  }, []);

  const advanceFrom = useCallback((n: RunNode) => {
    setCleared((c) => [...c, n.id]);
    setFrontier(n.next);
    setDepthReached((d) => Math.max(d, n.depth + 1));
    setActiveId(null);
    setPhase("map");
  }, []);

  const finishBattle = useCallback((result: "ally" | "enemy", survivors: BattleResult[]) => {
    if (!activeNode) return;
    if (result === "ally") {
      setParty((cur) => cur.map((m) => { const s = survivors.find((x) => x.id === m.id); return { ...m, hp: s ? s.hp : 0, ult: s?.ult ?? m.ult }; })); // HP·궁 게이지 이월
      const raw = enemyDrop(activeNode.kind, activeNode.depth, faction); // 세력·티어·깊이별 드랍테이블
      const mult = Math.pow(LOOT_DECAY, floor); // 층당 재화 -6%(후반 인플레 억제)
      const drop = { parts: Math.round(raw.parts * mult), permits: Math.round(raw.permits * mult), items: raw.items };
      const dropItem = pickRand(drop.items);
      setCraft((c) => ({ ...c, mats: { parts: c.mats.parts + drop.parts, permits: c.mats.permits + drop.permits } })); // 제작 재료
      addItem(dropItem); // 소모품
      setLoot((l) => ({ parts: l.parts + drop.parts, permits: l.permits + drop.permits, items: { ...l.items, [dropItem]: (l.items[dropItem] ?? 0) + 1 }, kills: l.kills + 1 })); // 누적 전리품
      setLastLoot({ parts: drop.parts, permits: drop.permits, item: dropItem, kind: activeNode.kind }); // 이번 교전 획득
      setPhase("spoils"); // 교전·보스 승리 → 전리품 화면(계속 시 다음 구역/층)
    } else {
      setPhase("defeat");
      setActiveId(null);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [activeNode, addItem, faction, floor]);

  // 전리품 화면 "계속" → 다음 구역으로(교전 승리 후 advanceFrom 지연분)
  const continueSpoils = useCallback(() => { if (!activeNode) return; if (activeNode.kind === "boss") advanceFloor(); else advanceFrom(activeNode); }, [activeNode, advanceFrom, advanceFloor]);

  const rest = useCallback(() => {
    if (!activeNode) return;
    setParty((cur) => cur.map((m) => (m.hp > 0 ? { ...m, hp: Math.min(m.maxHp, Math.round(m.hp + m.maxHp * REST_HEAL)) } : m)));
    advanceFrom(activeNode);
  }, [activeNode, advanceFrom]);

  const restart = useCallback(() => { setPhase("select"); setParty([]); setNodes([]); setFrontier([]); setCleared([]); setActiveId(null); setItems({}); setCraft(initialCraft()); setLoot({ parts: 0, permits: 0, items: {}, kills: 0 }); }, []);
  const openCraft = useCallback(() => setPhase("craft"), []);
  const closeCraft = useCallback(() => setPhase("map"), []);

  return { phase, party, nodes, frontier, cleared, activeNode, depthReached, faction, maxDepth: MAX_DEPTH, floor, floorName: FLOORS[floor].name, floorBoss: FLOORS[floor].boss, totalFloors: FLOORS.length, hasCraftable, items, useItem, addItem, craft, craftPiece, forgePiece, swapGear, forgeSkill, loot, lastLoot, continueSpoils, openCraft, closeCraft, startRun, enterNode, finishBattle, rest, restart };
}
