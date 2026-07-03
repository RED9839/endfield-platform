"use client";
// 닼던류 런 상태 — 편성 → 던전 맵(노드 진행) → 전투(HP 지속 소모) → 야영/보스. DD 엔진 위에 로그라이크 흐름.
import { useCallback, useMemo, useState } from "react";

import { makeAlly } from "./roster";
import { GEAR_SLOTS, GEAR_PIECE_BY_ID, type Loadout } from "./gear";
import { rewardItemPool } from "./items";
import type { OpProgress } from "./progress";
import { initialCraft, craftPiece as doCraft, forgePiece as doForge, cloneCraft, type CraftState } from "./craft";
import { FACTIONS, enemyDrop } from "./sim";

const MAX_DEPTH = 6; // LAYOUT 최종 깊이(보스)
const pickRand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export type NodeKind = "battle" | "elite" | "rest" | "boss";
export type RunNode = { id: string; depth: number; lane: number; kind: NodeKind; next: string[] };
export type RunPhase = "select" | "map" | "battle" | "rest" | "craft" | "victory" | "defeat";
export type PartyPick = { id: string; loadout?: Loadout; progress?: OpProgress };
export type PartyMember = { id: string; hp: number; maxHp: number; loadout?: Loadout; progress?: OpProgress };
export type BattleResult = { id: string; hp: number };

export const REST_HEAL = 0.4; // 야영 회복 비율(최대 HP)

const ENCOUNTER_OF: Record<NodeKind, string> = { battle: "normal", elite: "elite", boss: "boss", rest: "normal" };
export const encounterForNode = (k: NodeKind) => ENCOUNTER_OF[k];

// 던전 맵 레이아웃(깊이별 노드 수 + 종류 풀). 각 노드는 다음 깊이 전체와 연결(항상 도달 가능).
const LAYOUT: { count: number; pool: NodeKind[] }[] = [
  { count: 1, pool: ["battle"] },
  { count: 3, pool: ["battle", "rest", "battle"] },
  { count: 3, pool: ["battle", "elite", "battle"] },
  { count: 2, pool: ["rest", "battle"] },
  { count: 3, pool: ["elite", "battle", "elite"] },
  { count: 2, pool: ["rest", "battle"] },
  { count: 1, pool: ["boss"] },
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
  const [faction, setFaction] = useState<string>(FACTIONS[0]); // 이번 런 세력 리전

  const useItem = useCallback((id: string) => setItems((m) => { const n = (m[id] ?? 0) - 1; const c = { ...m }; if (n <= 0) delete c[id]; else c[id] = n; return c; }), []);
  const addItem = useCallback((id: string) => setItems((m) => ({ ...m, [id]: (m[id] ?? 0) + 1 })), []);
  // 피스 제작 / 단조 — 성공 시 상태 갱신, 성공 여부 반환
  const craftPiece = useCallback((pieceId: string) => { let ok = false; setCraft((c) => { const n = cloneCraft(c); ok = doCraft(n, pieceId); return ok ? n : c; }); return ok; }, []);
  const forgePiece = useCallback((pieceId: string) => { let ok = false; setCraft((c) => { const n = cloneCraft(c); ok = doForge(n, pieceId); return ok ? n : c; }); return ok; }, []);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const activeNode = activeId ? nodeMap[activeId] : null;

  const startRun = useCallback((picks: PartyPick[]) => {
    const p = picks.map((pick) => { const u = makeAlly(pick.id, 1, pick.progress); return { id: pick.id, hp: u.maxHp, maxHp: u.maxHp, loadout: pick.loadout, progress: pick.progress }; });
    // 시작 보유 피스: 각 오퍼 장착 피스(실제 id)를 정예화 장비 단조 레벨로 시드 → 공업소에서 단조로 강화
    const owned: Record<string, number> = {};
    for (const pick of picks) { const lo = pick.loadout ?? {}; const lv = pick.progress?.gearLevel ?? 0; for (const slot of GEAR_SLOTS) { const ref = lo[slot]; if (ref && GEAR_PIECE_BY_ID[ref]) owned[ref] = Math.max(owned[ref] ?? 0, lv); } }
    const map = genMap();
    setParty(p);
    setNodes(map);
    setFrontier(map.filter((n) => n.depth === 0).map((n) => n.id));
    setCleared([]);
    setDepthReached(0);
    setActiveId(null);
    setItems({ "heal-cap-1": 2, "can-1": 1, "recov-1": 1 }); // 시작 키트
    setCraft({ mats: { parts: 30, permits: 5 }, owned }); // 시작 제작 재료 + 장착 피스 시드
    setFaction(pickRand(FACTIONS)); // 이번 런 세력 리전 무작위
    setPhase("map");
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
      setParty((cur) => cur.map((m) => { const s = survivors.find((x) => x.id === m.id); return { ...m, hp: s ? s.hp : 0 }; }));
      const drop = enemyDrop(activeNode.kind, activeNode.depth, faction); // 세력·티어·깊이별 드랍테이블
      setCraft((c) => ({ ...c, mats: { parts: c.mats.parts + drop.parts, permits: c.mats.permits + drop.permits } })); // 제작 재료
      addItem(pickRand(drop.items)); // 소모품
      if (activeNode.kind === "boss") { setPhase("victory"); setActiveId(null); }
      else advanceFrom(activeNode);
    } else {
      setPhase("defeat");
      setActiveId(null);
    }
  }, [activeNode, advanceFrom, addItem, faction]);

  const rest = useCallback(() => {
    if (!activeNode) return;
    setParty((cur) => cur.map((m) => (m.hp > 0 ? { ...m, hp: Math.min(m.maxHp, Math.round(m.hp + m.maxHp * REST_HEAL)) } : m)));
    advanceFrom(activeNode);
  }, [activeNode, advanceFrom]);

  const restart = useCallback(() => { setPhase("select"); setParty([]); setNodes([]); setFrontier([]); setCleared([]); setActiveId(null); setItems({}); setCraft(initialCraft()); }, []);
  const openCraft = useCallback(() => setPhase("craft"), []);
  const closeCraft = useCallback(() => setPhase("map"), []);

  return { phase, party, nodes, frontier, cleared, activeNode, depthReached, faction, maxDepth: MAX_DEPTH, items, useItem, addItem, craft, craftPiece, forgePiece, openCraft, closeCraft, startRun, enterNode, finishBattle, rest, restart };
}
