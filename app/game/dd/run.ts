"use client";
// 닼던류 런 상태 — 편성 → 던전 맵(노드 진행) → 전투(HP 지속 소모) → 야영/보스. DD 엔진 위에 로그라이크 흐름.
import { useCallback, useMemo, useRef, useState } from "react";

import { makeAlly } from "./roster";
import { GEAR_SLOTS, LOADOUT_SLOTS, GEAR_PIECE_BY_ID, type Loadout } from "./gear";
import { rewardItemPool, ITEMS } from "./items";
import { SKILL_MAX, DEFAULT_PROGRESS, type OpProgress, type SkillKind } from "./progress";
import { initialCraft, craftPiece as doCraft, forgePiece as doForge, cloneCraft, craftCost, skillForgeCost, canAfford, canBuy, sellUnit, matAmount, itemSellValue, SHOP, type CraftState, type ShopItem, type SellMat } from "./craft";
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
export type PartyPick = { id: string; loadout?: Loadout; progress?: OpProgress; ult?: number; main?: boolean; stacks?: number };
// main: 메인딜러(메인 컨트롤 오퍼레이터). 위치는 편성 순서를 그대로 쓰므로 1번과 별개로 지정할 수 있다.
export type PartyMember = { id: string; hp: number; maxHp: number; loadout?: Loadout; progress?: OpProgress; ult?: number; main?: boolean; stacks?: number };
export type BattleResult = { id: string; hp: number; ult?: number; stacks?: number }; // ult: 궁 게이지 이월(HP처럼 런 내내 유지 — 보스 전 만충이 목표)
                                                                                       // stacks: 전투 밖으로 들고 나가는 스택(레바테인 녹아내린 불꽃)
// 전투 종료 시 학습용 통계(BattleView가 넘김): 라운드 수·상대 목록·가한 총 피해.
export type BattleStats = { rounds: number; enemies: string[]; dmgDealt: number; dmgByOp?: Record<string, number> };
// 원정 1회 완주/실패 기록 — 학습·밸런스 분석용. localStorage 이력 + /api/dd-record(디스크 JSONL).
export type RunRecord = {
  ts: number; date: string; result: "victory" | "defeat"; floorReached: number; totalFloors: number; durationSec: number;
  party: { id: string; main: boolean; promotion: number; skillRanks: Record<string, number>; gearLevel: number; loadout: Record<string, string | undefined>; dmgDealt: number }[];
  battles: { floor: number; kind: NodeKind; boss?: string; rounds: number; enemies: string[]; dmgDealt: number; dmgByOp?: Record<string, number>; partyHp: { id: string; hpFrac: number }[] }[];
  economy: { credits: number; parts: number; permits: number; chips: number; kills: number; items: Record<string, number> };
  totals: { battles: number; rounds: number; dmgDealt: number };
};

export const REST_HEAL = 0.30; // 야영 회복 비율(최대 HP)
export const REST_SALVAGE = { credits: 30 }; // 야영 중 크레딧 회수 — 상점에서 원하는 재료로 바꾼다

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
  const [loot, setLoot] = useState<{ credits: number; parts: number; permits: number; chips: number; items: Record<string, number>; kills: number }>({ credits: 0, parts: 0, permits: 0, chips: 0, items: {}, kills: 0 }); // 이번 원정 누적 전리품(승리 화면 표시)
  const [lastLoot, setLastLoot] = useState<{ credits: number; parts: number; permits: number; chips: number; item: string | null; kind: NodeKind } | null>(null); // 방금 교전 획득(전리품 화면 표시)
  const [lastRecord, setLastRecord] = useState<RunRecord | null>(null); // 방금 완주/실패 기록(승리 화면 표시·복사)
  // 최신 상태 미러(콜백 클로저에서 stale 방지) + 원정 기록 누적
  const partyRef = useRef(party); partyRef.current = party;
  const lootRef = useRef(loot); lootRef.current = loot;
  const floorRef = useRef(floor); floorRef.current = floor;
  const battlesRef = useRef<RunRecord["battles"]>([]);
  const startRef = useRef(0);

  // 원정 종료(완주/실패) 기록 — 학습·밸런스 분석용. localStorage 이력(최근 30) + /api/dd-record(디스크 JSONL).
  const saveRecord = useCallback((result: "victory" | "defeat") => {
    const now = Date.now();
    const p = partyRef.current, l = lootRef.current, battles = battlesRef.current;
    const rec: RunRecord = {
      ts: now, date: new Date(now).toISOString(), result,
      floorReached: result === "victory" ? FLOORS.length : floorRef.current + 1, totalFloors: FLOORS.length,
      durationSec: startRef.current ? Math.round((now - startRef.current) / 1000) : 0,
      party: p.map((m) => ({ id: m.id, main: !!m.main, promotion: m.progress?.promotion ?? DEFAULT_PROGRESS.promotion, skillRanks: m.progress?.skillRanks ?? DEFAULT_PROGRESS.skillRanks, gearLevel: m.progress?.gearLevel ?? 0, loadout: (m.loadout ?? {}) as Record<string, string | undefined>, dmgDealt: battles.reduce((n, b) => n + (b.dmgByOp?.[m.id] ?? 0), 0) })),
      battles: [...battles],
      economy: { credits: l.credits, parts: l.parts, permits: l.permits, chips: l.chips, kills: l.kills, items: l.items },
      totals: { battles: battles.length, rounds: battles.reduce((n, b) => n + b.rounds, 0), dmgDealt: battles.reduce((n, b) => n + b.dmgDealt, 0) },
    };
    setLastRecord(rec);
    try { const key = "dd_run_history"; const hist = JSON.parse(localStorage.getItem(key) || "[]"); hist.unshift(rec); localStorage.setItem(key, JSON.stringify(hist.slice(0, 30))); } catch { /* localStorage 불가 무시 */ }
    try { fetch("/api/dd-record", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(rec), keepalive: true }).catch(() => {}); } catch { /* 오프라인 무시 */ }
  }, []);

  const useItem = useCallback((id: string) => setItems((m) => { const n = (m[id] ?? 0) - 1; const c = { ...m }; if (n <= 0) delete c[id]; else c[id] = n; return c; }), []);
  const addItem = useCallback((id: string) => setItems((m) => ({ ...m, [id]: (m[id] ?? 0) + 1 })), []);
  // 피스 제작 / 단조 — 성공 시 상태 갱신, 성공 여부 반환
  const craftPiece = useCallback((pieceId: string) => { let ok = false; setCraft((c) => { const n = cloneCraft(c); ok = doCraft(n, pieceId); return ok ? n : c; }); return ok; }, []);
  const forgePiece = useCallback((pieceId: string) => { let ok = false; setCraft((c) => { const n = cloneCraft(c); ok = doForge(n, pieceId); return ok ? n : c; }); return ok; }, []);
  // 장비 슬롯 교체(런 중) — 파티원 로드아웃의 해당 슬롯을 다른 피스로. 다음 전투 createBattle에 반영.
  const swapGear = useCallback((opId: string, slot: keyof Loadout, pieceId: string) => setParty((ps) => ps.map((p) => p.id === opId ? { ...p, loadout: { ...p.loadout, [slot]: pieceId } } : p)), []);
  // 스킬 마스터리(런 중) — 프로토콜 프리즘 소모 → 파티원의 특정 스킬 트랙(기본/배틀/연계/궁) +1.
  const forgeSkill = useCallback((opId: string, kind: SkillKind) => {
    const m = party.find((p) => p.id === opId);
    const ranks = m?.progress?.skillRanks ?? DEFAULT_PROGRESS.skillRanks;
    const rank = ranks[kind] ?? 0;
    if (!m || rank >= SKILL_MAX || !canAfford(craft.mats, skillForgeCost(rank))) return false;
    const cost = skillForgeCost(rank);
    setCraft((c) => ({ ...c, mats: { parts: c.mats.parts - cost.parts, permits: c.mats.permits - cost.permits, chips: (c.mats.chips ?? 0) - (cost.chips ?? 0) } }));
    setParty((ps) => ps.map((p) => p.id === opId ? { ...p, progress: { ...(p.progress ?? DEFAULT_PROGRESS), skillRanks: { ...(p.progress?.skillRanks ?? DEFAULT_PROGRESS.skillRanks), [kind]: rank + 1 } } } : p));
    return true;
  }, [party, craft]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const activeNode = activeId ? nodeMap[activeId] : null;

  // 파티 목표 장비 중 아직 안 만들었고 재화로 만들 수 있는 피스가 있는가(공업소 진입 유도용)
  const hasCraftable = useMemo(() => party.some((m) => m.loadout && LOADOUT_SLOTS.some((slot) => {
    const ref = m.loadout![slot]; const p = ref ? GEAR_PIECE_BY_ID[ref] : undefined;
    return p && craft.owned[ref!] == null && canAfford(craft.mats, craftCost(p));
  })), [party, craft]);

  const startRun = useCallback((picks: PartyPick[]) => {
    resetEncounterHistory(); // 새 원정 — 적 등장 이력 초기화
    battlesRef.current = []; startRef.current = Date.now(); setLastRecord(null); // 기록 누적 초기화
    const p = picks.map((pick) => { const u = makeAlly(pick.id, 1, pick.progress); return { id: pick.id, main: pick.main, hp: u.maxHp, maxHp: u.maxHp, loadout: pick.loadout, progress: pick.progress }; });
    const map = genMap();
    setParty(p);
    setNodes(map);
    setFrontier(map.filter((n) => n.depth === 0).map((n) => n.id));
    setCleared([]);
    setDepthReached(0);
    setActiveId(null);
    setItems({ "heal-cap-1": 2 }); // 시작 키트 — 메밀꽃 치유 캡슐 2개
    setCraft({ mats: { parts: 30, permits: 8, chips: 10 }, owned: {}, credits: 100 }); // 시작 지급 — 0강 풀세트 2층 완성 목표 // 맨몸 시작 — 소량 재료 + 크레딧(야영 상점 교환)
    setLoot({ credits: 0, parts: 0, permits: 0, chips: 0, items: {}, kills: 0 }); // 전리품 초기화
    setFloor(0); // 1층부터
    setFaction(FLOORS[0].faction); // 1층 세력
    setPhase("map");
  }, []);

  // 층 보스 격파 → 다음 층 진입(전열 재정비 = HP 회복, 재화 이월, 새 세력 맵)
  const advanceFloor = useCallback(() => {
    setParty((cur) => cur.map((m) => (m.hp > 0 ? { ...m, hp: m.maxHp } : m))); // 층 클리어 보상: 생존자 HP 완전 회복
    setFloor((f) => {
      const nf = f + 1;
      if (nf >= FLOORS.length) { saveRecord("victory"); setPhase("victory"); return f; } // 최종 층(알레이크레오스) 클리어 → 완주 기록
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
  }, [saveRecord]);

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

  const finishBattle = useCallback((result: "ally" | "enemy", survivors: BattleResult[], stats?: BattleStats) => {
    if (!activeNode) return;
    // 전투 1건 기록(승패 무관) — 층·종류·보스·라운드·상대·가한 피해·파티 잔여 HP
    battlesRef.current.push({
      floor: floorRef.current + 1, kind: activeNode.kind, boss: activeNode.kind === "boss" ? FLOORS[floorRef.current]?.boss : undefined,
      rounds: stats?.rounds ?? 0, enemies: stats?.enemies ?? [], dmgDealt: stats?.dmgDealt ?? 0, dmgByOp: stats?.dmgByOp,
      partyHp: partyRef.current.map((m) => { const s = survivors.find((x) => x.id === m.id); return { id: m.id, hpFrac: Math.round(((s?.hp ?? 0) / Math.max(1, m.maxHp)) * 100) / 100 }; }),
    });
    if (result === "ally") {
      setParty((cur) => cur.map((m) => { const s = survivors.find((x) => x.id === m.id); return { ...m, hp: s ? s.hp : 0, ult: s?.ult ?? m.ult, stacks: s?.stacks ?? m.stacks }; })); // HP·궁 게이지·스택 이월
      const raw = enemyDrop(activeNode.kind, activeNode.depth, faction); // 세력·티어·깊이별 드랍테이블
      const mult = Math.pow(LOOT_DECAY, floor); // 층당 재화 -6%(후반 인플레 억제)
      const drop = { credits: Math.round(raw.credits * mult), parts: Math.round(raw.parts * mult), permits: Math.round(raw.permits * mult), chips: Math.round(raw.chips * mult), items: raw.items };
      const dropItem = drop.items.length ? pickRand(drop.items) : null; // 기본 몹은 소비템 없음(빈 풀)
      setCraft((c) => ({ ...c, credits: c.credits + drop.credits, mats: { parts: c.mats.parts + drop.parts, permits: c.mats.permits + drop.permits, chips: (c.mats.chips ?? 0) + drop.chips } })); // 크레딧 + 소량 재료
      if (dropItem) addItem(dropItem); // 소모품(정예·보스만)
      setLoot((l) => ({ credits: l.credits + drop.credits, parts: l.parts + drop.parts, permits: l.permits + drop.permits, chips: l.chips + drop.chips, items: dropItem ? { ...l.items, [dropItem]: (l.items[dropItem] ?? 0) + 1 } : l.items, kills: l.kills + 1 }));
      setLastLoot({ credits: drop.credits, parts: drop.parts, permits: drop.permits, chips: drop.chips, item: dropItem, kind: activeNode.kind });
      setPhase("spoils"); // 교전·보스 승리 → 전리품 화면(계속 시 다음 구역/층)
    } else {
      saveRecord("defeat"); // 원정 실패 기록
      setPhase("defeat");
      setActiveId(null);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [activeNode, addItem, faction, floor, saveRecord]);

  // 전리품 화면 "계속" → 다음 구역으로(교전 승리 후 advanceFrom 지연분)
  const continueSpoils = useCallback(() => { if (!activeNode) return; if (activeNode.kind === "boss") advanceFloor(); else advanceFrom(activeNode); }, [activeNode, advanceFrom, advanceFloor]);

  const rest = useCallback(() => {
    if (!activeNode) return;
    setParty((cur) => cur.map((m) => (m.hp > 0 ? { ...m, hp: Math.min(m.maxHp, Math.round(m.hp + m.maxHp * REST_HEAL)) } : m)));
    // 정비 중 회수분은 크레딧으로 — 상점에서 원하는 재료로 바꾸라고.
    setCraft((c) => ({ ...c, credits: c.credits + REST_SALVAGE.credits }));
    advanceFrom(activeNode);
  }, [activeNode, advanceFrom]);

  const restart = useCallback(() => { setPhase("select"); setParty([]); setNodes([]); setFrontier([]); setCleared([]); setActiveId(null); setItems({}); setCraft(initialCraft()); setLoot({ credits: 0, parts: 0, permits: 0, chips: 0, items: {}, kills: 0 }); }, []);
  const [craftOrigin, setCraftOrigin] = useState<RunPhase>("map"); // 공업소를 어디서 열었나 → 닫으면 그리로
  const [craftTab, setCraftTab] = useState<"party" | "mastery">("party"); // 공업소 진입 탭(장비/마스터리)
  const openCraft = useCallback((tab: "party" | "mastery" = "party") => { setCraftTab(tab); setCraftOrigin("map"); setPhase("craft"); }, []);
  const openCraftFromRest = useCallback((tab: "party" | "mastery" = "party") => { setCraftTab(tab); setCraftOrigin("rest"); setPhase("craft"); }, []);
  // 야영지 상점: 크레딧으로 재료·소비템 구매
  const buyShop = useCallback((s: ShopItem) => {
    setCraft((c) => {
      if (!canBuy(c, s)) return c;
      const n = cloneCraft(c); n.credits -= s.price;
      if (s.kind === "mat") { const g = s.give as Partial<{ parts: number; permits: number; chips: number }>;
        n.mats.parts += g.parts ?? 0; n.mats.permits += g.permits ?? 0; n.mats.chips = (n.mats.chips ?? 0) + (g.chips ?? 0); }
      return n;
    });
    if (s.kind === "item") { const it = (s.give as { itemId: string }).itemId; addItem(it); }
  }, [addItem]);
  // 안 쓰는 재료 되팔기 — 구매가 30%
  const sellMat = useCallback((mat: SellMat, qty = 1) => {
    setCraft((c) => {
      const have = mat === "chips" ? c.mats.chips ?? 0 : c.mats[mat];
      const q = Math.min(qty, have); if (q <= 0) return c;
      const n = cloneCraft(c);
      if (mat === "chips") n.mats.chips = (n.mats.chips ?? 0) - q; else n.mats[mat] -= q;
      n.credits += sellUnit(mat) * q;
      return n;
    });
  }, []);
  // 소비 아이템 되팔기 — 레어도 기준가 30%
  const sellItem = useCallback((itemId: string) => {
    const def = ITEMS[itemId]; if (!def) return;
    setItems((m) => { if (!(m[itemId] > 0)) return m; return { ...m, [itemId]: m[itemId] - 1 }; });
    setCraft((c) => (items[itemId] > 0 ? { ...cloneCraft(c), credits: c.credits + itemSellValue(def.rarity) } : c));
  }, [items]);
  const closeCraft = useCallback(() => setPhase(craftOrigin), [craftOrigin]);

  return { phase, craftTab, buyShop, sellMat, sellItem, itemSellValue, sellUnit, shop: SHOP, party, nodes, frontier, cleared, activeNode, depthReached, faction, maxDepth: MAX_DEPTH, floor, floorName: FLOORS[floor].name, floorBoss: FLOORS[floor].boss, totalFloors: FLOORS.length, hasCraftable, items, useItem, addItem, craft, craftPiece, forgePiece, swapGear, forgeSkill, loot, lastLoot, lastRecord, continueSpoils, openCraft, closeCraft, openCraftFromRest, startRun, enterNode, finishBattle, rest, restart };
}
