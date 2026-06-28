// 순수 로직 시뮬레이터: 브라우저 없이 전투 reducer를 직접 구동.
// 덱 스타일별로 실제 맵 전투 노드(층 1~20)를 순서대로 클리어 시도 → 사망층/클리어 측정.
import { freshParty, enemyActionEvery, drawHand, makeIntent, playCardOnState, endTurnOnState, shuffle, equipGearToMember } from "../app/game/hooks/useRunState";
import { buildDeck, startingDeck, deckCardFromToken } from "../app/game/data/cards";
import { getEnemies } from "../app/game/data/enemies";
import { getRelicEffects, RELIC_IDS } from "../app/game/data/relics";
import { getMapNode } from "../app/game/data/maps";
import { getGameGear, chooseGearRewards } from "../app/game/data/game-gears";
import { computeBattleDrop } from "../app/game/data/enemy-traits";

type Any = any;
const PATH = process.argv.includes("risky") ? "risky" : "safe"; // 경로: safe(일반우선) | risky(정예우선)

// ── 실제 맵(세력0)에서 층별 전투/정예/보스 노드 수집 ──
function collectCombatNodes(fi = 0): Any[] {
  const out: Any[] = [];
  for (let floor = 1; floor <= 20; floor++) {
    let battle: Any = null, elite: Any = null, boss: Any = null;
    for (let idx = 0; idx < 5; idx++) {
      let n: Any = null;
      try { n = getMapNode(`f${fi}-${floor}-${idx}`); } catch (e) { continue; }
      if (!n) continue;
      if (n.type === "boss") boss = n;
      else if (n.type === "battle" && n.enemyIds?.length) battle = battle || n;
      else if (n.type === "elite" && n.enemyIds?.length) elite = elite || n;
    }
    const best = boss || (PATH === "safe" ? (battle || elite) : (elite || battle)); // 안전=일반우선 / 위험=정예우선
    if (best) out.push(best);
  }
  return out;
}

// ── 실제 세팅 목록(사이트 등록 파티 세팅)에서 가져온 메타 파티 조합으로 덱 구성 ──
// 출처: UserOperatorSetting(type=party) — 조회수/추천순. 슬롯 main/member1~3 → 게임 오퍼 ID.
const STYLE_PARTY: Record<string, string[]> = {
  "탕이탕본":   ["yvonne", "tangtang", "gilberta", "xaihi"],
  "미에알포":   ["mifu", "estella", "alesh", "pogranichnik"],
  "미포여천물리": ["mifu", "pogranichnik", "lifeng", "chenqianyu"],
  "개장빙":     ["zhuangfangyi", "perlica", "arclight", "alesh"],
  "로탕포관":   ["rossi", "tangtang", "pogranichnik", "endministrator"],
  "풀돌로시":   ["rossi", "akekuri", "antal", "gilberta"],
  "미브쇄빙":   ["mifu", "chenqianyu", "alesh", "estella"],
  "미아로아":   ["mifu", "akekuri", "rossi", "ardelia"],
  "로덴TA물리": ["chenqianyu", "pogranichnik", "lifeng", "dapan"],
};
// 덱 = 파티 전원의 풀 스킬킷(배틀/연계/궁극). 미보유 스킬은 deckCardFromToken에서 자동 제외.
const FULL_KIT = ["battle-skill", "link-skill", "ultimate"];
function styleDeck(party: Any[], style: string) {
  const { deck } = startingDeck(0, party);
  const ops = party.map((o) => o.id);
  const add: string[] = [];
  ops.forEach((id) => FULL_KIT.forEach((k) => add.push(`op:${id}:${k}`)));
  let seq = deck.length;
  for (const tok of add) { try { deck.push(deckCardFromToken(tok, `c${seq++}`)); } catch (e) {} }
  return deck;
}

// ── 전투 1회 초기 RunState 구성(enterNode 전투부 재현) ──
function makeBattleState(party: Any[], deck: Any[], relics: string[], node: Any, seed: number): Any {
  const fx = getRelicEffects(relics);
  const FIX = process.argv.includes("fix");
  const enemies = getEnemies(node.enemyIds ?? []).map((enemy: Any, i: number) => {
    // 진단용 수정: 일반 전투 노드의 Elite 적을 Enhanced급으로 강등(절벽 완화 검증)
    if (FIX && node.type === "battle" && enemy.tier === "Elite") {
      enemy = { ...enemy, tier: "Enhanced", maxHp: Math.round(enemy.maxHp * 0.31), defense: Math.round(enemy.defense * 0.5), attack: Math.round((enemy.attack ?? 14) * 0.47), staggerHp: Math.round((enemy.staggerHp ?? 270) * 0.32) };
    }
    const every = enemyActionEvery(enemy);
    const e = { ...enemy, hp: enemy.maxHp, statuses: [], actionGauge: Math.min(i, every - 1) - fx.enemyStartDelay, actionEvery: every, stagger: 0, physBreakStacks: 0 };
    return { ...e, telegraph: makeIntent(e, 1) };
  });
  // 생존형 장비 세트(식양의 숨결/생체 보조): 전투 시작 보호막 +16 + 회복(풀). gearset 플래그.
  const GEARSET = process.argv.includes("gearset");
  const battleParty = party.map((m) => ({ ...m, hp: m.hp > 0 && GEARSET ? m.maxHp : m.hp, shield: m.hp > 0 ? fx.startShield + (GEARSET ? 16 : 0) : 0, actionGauge: 0, passiveStacks: 0, ultimateCharge: 0 }));
  const cards = buildDeck(battleParty, deck, { battle: true });
  const maxEnergy = 3 + fx.maxEnergyBonus;
  const drawn = drawHand(shuffle(cards, seed), [], [], 5 + fx.handBonus, 11);
  return {
    screen: "battle", party: battleParty, relics, deck, factionIndex: 0,
    currentNodeId: node.id, visitedNodes: [], battlesWon: 0, credits: 0, potions: [],
    pendingPromotes: 0, sp: 0, maxSp: 100, challengeBossId: undefined, availableNodes: [],
    battle: { enemies, hand: drawn.hand, drawPile: drawn.drawPile, discardPile: [], energy: maxEnergy + fx.startEnergy, maxEnergy, multiHit: fx.startMultiHit > 0 ? fx.startMultiHit : undefined, turn: 1, log: [] },
  };
}

// ── 전략 AI: 카드 선택 ──
function chooseAction(s: Any): { uid: string; target?: string } | null {
  const b = s.battle; if (!b) return null;
  const living = b.enemies.filter((e: Any) => e.hp > 0);
  if (!living.length) return null;
  const target = living.reduce((lo: Any, e: Any) => (e.hp < lo.hp ? e : lo), living[0]);
  const downed = new Set(s.party.filter((m: Any) => m.hp <= 0).map((m: Any) => m.id));
  const playable = b.hand.filter((c: Any) => b.energy >= c.cost && (c.tactical || !c.operatorId || !downed.has(c.operatorId)));
  if (!playable.length) return null;
  // 콤보 실행형: 불균형 전엔 스태거 빌드(배틀스킬), 불균형 적엔 연계 강타(×1.5) 우선. 딜 카드만(방어/회복은 폴백).
  const broken = target.statuses?.includes("defense-break");
  const dmg = playable.filter((c: Any) => c.target !== "party" && !c.effect);
  const pool = dmg.length ? dmg : playable;
  const val = (c: Any) => {
    let v = (c.power || 0);
    if (broken && c.kind === "link-skill") v += 110;                           // 불균형 적 연계 강타
    if (!broken && c.kind === "battle-skill" && (c.stagger || 0) > 0) v += (c.stagger || 0) * 2; // 스태거 빌드(불균형 유도)
    if (c.target === "all-enemies" && living.length > 1) v += 30;              // AoE
    if (c.kind === "ultimate") v += 18;
    return v;
  };
  const best = pool.reduce((a: Any, c: Any) => (val(c) > val(a) ? c : a), pool[0]);
  return { uid: best.uid, target: target.id };
}

// ── 전투 실행 ──
function runBattle(state: Any): { win: boolean; state: Any; turns: number } {
  let s = state, guard = 0;
  while (s.screen === "battle" && guard++ < 600) {
    if ((s.battle?.turn ?? 0) > 50) return { win: false, state: s, turns: s.battle.turn }; // 교착 = 클리어 실패
    const act = chooseAction(s);
    if (act) {
      const next = playCardOnState(s, act.uid, act.target);
      if (next === s) { s = endTurnOnState(s); } else { s = next; }
    } else {
      s = endTurnOnState(s);
    }
    if (s.screen === "summary") return { win: s.result !== "defeat", state: s, turns: s.battle?.turn ?? 0 };
    if (s.screen !== "battle") return { win: true, state: s, turns: s.battle?.turn ?? 0 }; // reward = 승리
  }
  return { win: s.screen !== "battle" || s.result !== "defeat", state: s, turns: s.battle?.turn ?? guard };
}

// ── 풀런: 층 1~20 ──
const BUFF = process.argv.includes("buff"); // 실제 플레이어 강화 재현: 정예화 + 장비
const SUPPORT = process.argv.includes("support"); // 파티에 서포터(snowshine/샤이닝) 1명 편성
const GEAR = process.argv.includes("gear"); // 실제 장비 드랍·장착 검증
function equipDrops(party: Any[], floor: number, tier: Any, count: number): Any[] {
  const slugs = chooseGearRewards(floor, count, tier);
  let p = party;
  slugs.forEach((slug: string, i: number) => {
    const g = getGameGear(slug); if (!g) return;
    const mi = i % p.length;
    p = p.map((m: Any, j: number) => (j === mi ? equipGearToMember(m, g) : m));
  });
  return p;
}
function runFull(style: string, relics: string[], fi = 0) {
  let party = freshParty(STYLE_PARTY[style]); // 스타일별 실제 파티 조합
  const deck = styleDeck(party, style);
  if (BUFF) deck.forEach((dc: Any) => { if (dc.src === "operator" && dc.kind && dc.kind !== "util") dc.eliteLevel = 2; }); // 정예화 ×1.4
  const nodes = collectCombatNodes(fi);
  let curParty = party;
  const ops = party.map((o: Any) => o.id);
  // 보상 풀 = 파티 전원의 풀 스킬킷 카드(덱 강화).
  const pool = ops.flatMap((id: string) => FULL_KIT.map((k) => `op:${id}:${k}`));
  const rewardPool: Record<string, string[]> = { [style]: pool };
  let seq = deck.length, rIdx = 0;
  let cleared = 0, deathFloor = 0, log: string[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const st = makeBattleState(curParty, deck, relics, node, node.floor * 7 + 3);
    const res = runBattle(st);
    const enemyN = node.enemyIds?.length ?? 0;
    if (res.win) {
      cleared = node.floor;
      // 보상 카드 1장 획득(실제 런 덱 성장 재현). 정예/보스는 2장.
      const gain = node.type === "battle" ? 1 : 2;
      const pool = rewardPool[style];
      for (let g = 0; g < gain; g++) { try { const dc: Any = deckCardFromToken(pool[rIdx++ % pool.length], `r${seq++}`); if (BUFF && dc.src === "operator" && dc.kind && dc.kind !== "util") dc.eliteLevel = 2; deck.push(dc); } catch (e) {} }
      // 후반 덱 압축: 승리마다 기본 카드(기본공격·방어) 1장 제거(상점 카드 제거 재현) → 순수 스킬 덱화.
      const bi = deck.findIndex((dc: Any) => dc.src === "basic" || (dc.src === "operator" && dc.kind === "attack"));
      if (bi >= 0) deck.splice(bi, 1);
      // 실제 장비 드랍·장착(드랍 테이블 + 장비 재설계 검증)
      if (GEAR) { try { const d = computeBattleDrop(getEnemies(node.enemyIds ?? []), node.floor); curParty = equipDrops(res.state.party, node.floor, d.gearTier, d.gearCount); } catch (e) {} }
      else curParty = res.state.party;
      // 파티 HP 이월 + 회복. 다음이 보스면 풀 회복(게임: 보스 전 상점·캠프 확정).
      const nextBoss = nodes[i + 1]?.type === "boss";
      curParty = curParty.map((m: Any) => ({ ...m, hp: m.hp > 0 ? (nextBoss ? m.maxHp : Math.min(m.maxHp, m.hp + Math.ceil(m.maxHp * 0.25))) : 0, shield: 0 }));
      const aliveN = curParty.filter((m: Any) => m.hp > 0).length;
      log.push(`F${node.floor}(${node.type[0]},적${enemyN}) ✓ ${res.turns}턴 생존${aliveN}/4`);
    } else {
      deathFloor = node.floor;
      log.push(`F${node.floor}(${node.type[0]},적${enemyN}) ✗ 전멸 ${res.turns}턴`);
      break;
    }
  }
  return { style, cleared, deathFloor, full: deathFloor === 0 && cleared >= nodes[nodes.length - 1].floor, log };
}

const relicArg = process.argv.includes("relics") ? RELIC_IDS : [];
const matrix = process.argv.includes("matrix");
const FAC = ["광석수", "아겔로이", "조석", "본크러셔", "청파채"];
const STYLES = ["탕이탕본", "미에알포", "미포여천물리", "개장빙", "로탕포관", "풀돌로시", "미브쇄빙", "미아로아", "로덴TA물리"];
if (matrix) {
  // 파티(행) × 5세력(열) 매트릭스. 한글 2칸 너비 보정 패딩.
  const w = (s: string) => [...s].reduce((n, c) => n + (c.charCodeAt(0) > 0x2e7f ? 2 : 1), 0);
  const pad = (s: string, n: number) => s + " ".repeat(Math.max(1, n - w(s)));
  console.log(`=== 밸런스 매트릭스 (유물:${relicArg.length ? "O" : "X"} 강화:${BUFF ? "O" : "X"}) — 셀=사망/도달 층 ===`);
  console.log(pad("파티 \\ 세력", 14) + FAC.map((f) => pad(f, 9)).join(""));
  let clears = 0, total = 0;
  for (const style of STYLES) {
    const cells = FAC.map((_, fi) => {
      const r = runFull(style, relicArg, fi); total++; if (r.full) clears++;
      return pad(r.full ? "클리어" : `F${r.deathFloor || r.cleared}`, 9);
    });
    console.log(pad(style, 14) + cells.join(""));
  }
  console.log(`\n전체 클리어율: ${clears}/${total} (${Math.round((clears / total) * 100)}%)`);
} else {
  console.log(`=== 시뮬레이션 (유물: ${relicArg.length ? "전체" : "없음"}) ===`);
  for (const style of STYLES) {
    const r = runFull(style, relicArg);
    console.log(`\n[${style}] ${r.full ? "🏆 풀 클리어(20층)" : r.deathFloor ? `사망 F${r.deathFloor}` : `도달 F${r.cleared}`}`);
    console.log("  " + r.log.join("  "));
  }
}
