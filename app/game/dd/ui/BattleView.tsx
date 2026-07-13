"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import { act, canAct, isOver, startRound, perTurn, nextActor, turnOrder, type DDClass, type DDSkill, type DDState, type DDUnit, type Element } from "../combat";
import { OPERATORS, SKILLS, enemyDefFor, avatarUrl, skillIcon, enemyImage } from "../roster";
import { ENCOUNTERS, allyChoose, createBattle, enemyAct, usableSkills, regionEncounter } from "../sim";
import { activeSets, setEffectText } from "../gear";
import { weaponOf, weaponEffectText, weaponImage, weaponSeriesName, weaponSeriesDesc, WEAPON_KO, WEAPON_ICON } from "../weapons";
import { OP_TALENTS } from "../operator-talents";
import { ITEMS, useItem as applyItem, canUseItem, condText, itemColor, itemImage } from "../items";
import type { BattleResult, NodeKind, PartyMember } from "../run";

const PRIMARY = "#ff9a2f";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const elementName: Record<"physical" | Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const classLabel: Record<DDClass, string> = { guard: "가드", caster: "캐스터", striker: "스트라이커", vanguard: "뱅가드", defender: "디펜더", supporter: "서포터" };
const kindLabel: Record<DDSkill["kind"], string> = { attack: "기본공격", battle: "배틀스킬", link: "연계스킬", ult: "궁극기" };
const statusLabel: Record<string, string> = { stun: "기절", combustion: "연소", corrosion: "부식", crystal: "결정", "armor-break": "갑옷파괴", shock: "감전", wing: "날개" };
const nodeTitle: Record<NodeKind, string> = { battle: "교전", elite: "정예 교전", boss: "보스 교전", rest: "야영" };
const behaviorLabel: Record<string, string> = { melee: "근접 돌격", snipe: "원거리 저격", heavy: "중장 강타", aoe: "광역 자폭", heal: "치유 지원", buff: "강화 지원" };
const tierLabel: Record<string, string> = { normal: "일반", common: "일반", enhanced: "강화", advanced: "정예", elite: "정예", boss: "보스" };

// 유닛 원소색(플로팅 데미지·이펙트용)
function unitElement(u: DDUnit): "physical" | Element {
  if (u.side === "ally") return OPERATORS.find((o) => o.id === u.id)?.element ?? "physical";
  return enemyDefFor(u.id)?.element ?? "physical";
}
// 로그 마지막 액션에서 스킬명 추출("이름[pos] → 스킬명")
function castFromLog(line?: string): string | null {
  if (!line) return null;
  const i = line.indexOf("→");
  return i >= 0 ? line.slice(i + 1).trim() : null;
}

type Floater = { id: string; amt: number; crit: boolean; tone: string };
type Fx = { tick: number; activeId: string | null; actingSide: "ally" | "enemy" | null; floaters: Floater[]; cast: { id: string; text: string } | null };
const NO_FX: Fx = { tick: 0, activeId: null, actingSide: null, floaters: [], cast: null };

function Bar({ value, max, color, h = "h-2" }: { value: number; max: number; color: string; h?: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return <div className={`${h} w-full overflow-hidden border border-ef-line bg-black/60`}><div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} /></div>;
}
function Chip({ children, tone = "#a1a1aa" }: { children: React.ReactNode; tone?: string }) {
  return <span className="border px-1 py-px font-mono text-[12px] font-bold uppercase tracking-wider" style={{ borderColor: `${tone}55`, color: tone }}>{children}</span>;
}
function unitChips(u: DDUnit) {
  const c: { k: string; label: string; tone: string }[] = [];
  if (u.physBreak > 0) c.push({ k: "pb", label: `방불 ${u.physBreak}`, tone: "#fca5a5" });
  if (u.frozen > 0) c.push({ k: "fz", label: `동결 ${u.frozen}`, tone: "#67e8f9" });
  for (const st of u.statuses) c.push({ k: st, label: statusLabel[st] ?? st, tone: "#fbbf24" });
  (["heat", "electric", "cryo", "nature"] as Element[]).forEach((e) => { if (u.arts[e] > 0) c.push({ k: e, label: `${elementName[e]}부착 ${u.arts[e]}`, tone: elementColor[e] }); });
  if (u.dot > 0) c.push({ k: "dot", label: `지속 ${u.dot}`, tone: "#fb923c" });
  if ((u.atkBuff ?? 0) > 0) c.push({ k: "atk", label: `공격+${Math.round(u.atkBuff * 100)}%`, tone: "#ffd24a" });
  if (u.weakenMul < 1) c.push({ k: "wk", label: `허약 ${Math.round((1 - u.weakenMul) * 100)}%`, tone: "#c084fc" });
  const amp = (Object.values(u.amp) as number[]).reduce((a, b) => a + b, 0);
  if (amp > 0) c.push({ k: "amp", label: `증폭 ${Math.round(amp * 100)}%`, tone: "#86efac" });
  const vuln = (Object.values(u.vuln) as number[]).reduce((a, b) => a + b, 0);
  if (vuln > 0) c.push({ k: "vuln", label: `취약 ${Math.round(vuln * 100)}%`, tone: "#f87171" });
  if (u.protection > 0) c.push({ k: "prot", label: `비호 ${Math.round(u.protection * 100)}%`, tone: "#38bdf8" });
  if (u.multiHit > 0) c.push({ k: "mh", label: `연타 ${u.multiHit}`, tone: "#fb923c" });
  return c;
}

// 유닛 위 플로팅 이펙트(데미지/힐/피격/캐스트) 레이어
function FxLayer({ id, fx }: { id: string; fx: Fx }) {
  const mine = fx.floaters.filter((f) => f.id === id);
  const hit = mine.some((f) => f.amt < 0);
  return (
    <>
      {hit && <span key={`fl-${fx.tick}`} className="dd-flash" />}
      {mine.map((f, i) => (
        <span key={`fn-${fx.tick}-${i}`} className="dd-float font-mono font-black" style={{ top: `${-2 - i * 16}px`, color: f.amt > 0 ? "#8fd36a" : f.crit ? "#ffd24a" : "#ff6b5a", fontSize: f.crit ? "1.55rem" : "1.05rem" }}>
          {f.amt > 0 ? `+${f.amt}` : f.amt}{f.crit ? "!" : ""}
        </span>
      ))}
      {fx.cast && fx.cast.id === id && <span key={`ct-${fx.tick}`} className="dd-cast border border-ef-accent/50 bg-black/85 px-2 py-0.5 font-mono text-[12px] font-bold text-ef-accent-soft" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>{fx.cast.text}</span>}
    </>
  );
}
const shakeCls = (hit: boolean, tick: number) => (hit ? (tick % 2 ? "dd-shake-a" : "dd-shake-b") : "");
const actCls = (active: boolean, tick: number) => (active ? (tick % 2 ? "dd-act-a" : "dd-act-b") : "");

export default function BattleView({ party, encounterKey, nodeKind, faction, depth = 0, maxDepth = 6, owned, items, onUseItem, onEnd }: { party: PartyMember[]; encounterKey: string; nodeKind: NodeKind; faction?: string; depth?: number; maxDepth?: number; owned?: Record<string, number>; items: Record<string, number>; onUseItem: (id: string) => void; onEnd: (result: "ally" | "enemy", survivors: BattleResult[]) => void }) {
  const stateRef = useRef<DDState | null>(null);
  if (!stateRef.current) {
    const base = ENCOUNTERS.find((e) => e.key === encounterKey) ?? ENCOUNTERS[0];
    const enc = faction ? { ...base, make: () => regionEncounter(faction, nodeKind, depth, maxDepth) } : base; // 세력 리전 편성(깊이별 티어)
    stateRef.current = createBattle(party, enc, owned); // 지속 HP + 장비 세트 효과 + 제작 단조 반영
  }
  const cycleActsRef = useRef(0); // ATB: 사이클(모두 1회) 내 행동 수
  const cycleSizeRef = useRef(1); // 사이클 크기(생존 유닛 수)
  const dmgRef = useRef<Record<string, number>>({}); // 아군별 누적 가한 피해(데미지 기록)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRef = useRef(false); // 기본 수동(전투 스킬 직접 선택). 자동은 토글.
  const speedRef = useRef(1);
  const fxTick = useRef(0);
  const [auto, setAuto] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [current, setCurrent] = useState<DDUnit | null>(null);
  const [winner, setWinner] = useState<"ally" | "enemy" | null>(null);
  const [fx, setFx] = useState<Fx>(NO_FX);
  const [roundBanner, setRoundBanner] = useState<{ n: number; tick: number } | null>(null);
  const [aiming, setAiming] = useState<DDSkill | null>(null); // 대상 선택 중인 단일 스킬
  const [inspectId, setInspectId] = useState<string | null>(null); // 스탯 조회 유닛
  const [showLog, setShowLog] = useState(true);
  const [tab, setTab] = useState<"dmg" | "log">("dmg"); // 하단 패널: 데미지 기록 / 전투 기록
  const [, bump] = useReducer((x) => x + 1, 0);

  const delay = () => 780 / speedRef.current;

  // 한 액션 수행 → HP 변화로 플로팅 데미지/피격 이펙트 산출
  function doAction(actor: DDUnit, run: () => void, cast: string | null) {
    const s = stateRef.current!;
    const before = new Map(s.units.map((u) => [u.id, u.hp]));
    const logStart = s.log.length;
    run();
    const newLines = s.log.slice(logStart);
    const crit = newLines.some((l) => /폭발|치명/.test(l));
    const floaters: Floater[] = [];
    for (const u of s.units) { const d = u.hp - (before.get(u.id) ?? u.hp); if (d !== 0) floaters.push({ id: u.id, amt: d, crit: crit && d < 0, tone: elementColor[unitElement(actor)] }); }
    // 데미지 기록: 아군 행동이 적에게 준 총 피해를 액터에 누적
    if (actor.side === "ally") { let dealt = 0; for (const u of s.units) if (u.side === "enemy") { const d = (before.get(u.id) ?? u.hp) - u.hp; if (d > 0) dealt += d; } if (dealt > 0) dmgRef.current[actor.id] = (dmgRef.current[actor.id] ?? 0) + dealt; }
    fxTick.current += 1;
    setRoundBanner(null);
    setFx({ tick: fxTick.current, activeId: actor.id, actingSide: actor.side, floaters, cast: cast ? { id: actor.id, text: cast } : null });
    bump();
  }

  function finish(w: "ally" | "enemy") { setWinner(w); setCurrent(null); setFx((f) => ({ ...f, activeId: null })); bump(); }

  // 스텝 진행: 죽은 유닛은 즉시 건너뛰고, 실제 행동/라운드 전환은 딜레이를 두고 연출
  // 한 행동 후 사이클 관리: 모두 1회 행동(사이클)마다 공유 라운드 효과 + 라운드 배너.
  function afterAction() {
    const s = stateRef.current!;
    if (++cycleActsRef.current >= cycleSizeRef.current) {
      cycleActsRef.current = 0;
      cycleSizeRef.current = Math.max(1, s.units.filter((u) => u.hp > 0).length);
      startRound(s); // 스킬 게이지 회복·라운드++
      fxTick.current += 1; setRoundBanner({ n: s.round, tick: fxTick.current });
    }
  }

  // ATB 스텝: 게이지 채워 다음 행동자 결정 → 자기 턴 효과 → 행동(적 자동/아군 자동·수동)
  function step() {
    const s = stateRef.current!;
    const over = isOver(s); if (over) { finish(over); return; }
    if (s.round >= 40) { finish("enemy"); return; }
    const u = nextActor(s);
    if (!u) { finish(isOver(s) ?? "enemy"); return; }
    perTurn(s, u); // 지속피해·재생·불균형회복·타이머 감쇠
    if (u.hp <= 0) { afterAction(); timerRef.current = setTimeout(step, 120); return; } // 지속피해로 사망
    if (!canAct(u)) {
      if (u.staggered) s.log.push(`${u.name} 불균형 — 행동 불가`);
      else if ((u.timers.stun || 0) > 0) s.log.push(`${u.name} 시간 정지 — 행동 불가`);
      fxTick.current += 1; setFx({ tick: fxTick.current, activeId: u.id, actingSide: u.side, floaters: [], cast: { id: u.id, text: u.staggered ? "불균형!" : "행동 불가" } }); bump();
      afterAction();
      timerRef.current = setTimeout(step, 480 / speedRef.current); return;
    }
    if (u.side === "enemy") {
      doAction(u, () => enemyAct(s, u), null);
      const line = stateRef.current!.log.slice(-6).reverse().find((l) => l.startsWith(`${u.name}`) && l.includes("→"));
      if (line) setFx((f) => ({ ...f, cast: { id: u.id, text: castFromLog(line) ?? "공격" } }));
      afterAction();
      timerRef.current = setTimeout(step, delay()); return;
    }
    if (autoRef.current) {
      const sk = allyChoose(s, u);
      doAction(u, () => { if (sk) act(s, u, sk); else s.log.push(`${u.name} 행동 불가(스킬 없음)`); }, sk ? sk.name : null);
      afterAction();
      timerRef.current = setTimeout(step, delay()); return;
    }
    // 수동: 플레이어 입력 대기(행동은 playerAct에서)
    setCurrent(u); fxTick.current += 1; setFx({ tick: fxTick.current, activeId: u.id, actingSide: "ally", floaters: [], cast: null }); bump();
  }

  useEffect(() => { const s = stateRef.current!; cycleSizeRef.current = Math.max(1, s.units.filter((u) => u.hp > 0).length); timerRef.current = setTimeout(step, 420); return () => { if (timerRef.current) clearTimeout(timerRef.current); }; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // 단일 대상 스킬? (자기/전체/열 대상 제외)
  const isSingleTarget = (sk: DDSkill) => sk.target !== "self" && sk.target !== "all" && sk.target !== "row";
  function chooseSkill(sk: DDSkill) {
    const foes = stateRef.current!.units.filter((u) => u.side === "enemy" && u.hp > 0);
    if (isSingleTarget(sk) && foes.length > 1) setAiming(sk); // 대상 여러 → 선택 모드
    else playerAct(sk); // 자동 대상(단일 적/광역/자기)
  }
  function playerAct(sk: DDSkill, targetId?: string) {
    const s = stateRef.current!; if (!current) return;
    const actor = current;
    s.forcedTargetId = targetId; // 플레이어 지정 대상(단일 스킬)
    doAction(actor, () => act(s, actor, sk), sk.name);
    s.forcedTargetId = undefined;
    setCurrent(null); setAiming(null); afterAction();
    timerRef.current = setTimeout(step, delay());
  }
  function playerUseItem(id: string) {
    const s = stateRef.current!; if (!current || !items[id] || !canUseItem(s, id)) return;
    const before = new Map(s.units.map((u) => [u.id, u.hp]));
    applyItem(s, id, current); onUseItem(id);
    const floaters: Floater[] = [];
    for (const u of s.units) { const d = u.hp - (before.get(u.id) ?? u.hp); if (d !== 0) floaters.push({ id: u.id, amt: d, crit: false, tone: "#8fd36a" }); }
    fxTick.current += 1; setFx({ tick: fxTick.current, activeId: current.id, actingSide: "ally", floaters, cast: { id: current.id, text: ITEMS[id]?.name ?? "아이템" } }); bump();
  }
  function toggleAuto() { const n = !autoRef.current; autoRef.current = n; setAuto(n); if (n && current) { setCurrent(null); timerRef.current = setTimeout(step, 200); } }
  function cycleSpeed() { const n = speedRef.current >= 3 ? 1 : speedRef.current + 1; speedRef.current = n; setSpeed(n); }
  function setSpeedTo(n: number) { speedRef.current = n; setSpeed(n); }

  const s = stateRef.current!;
  const allies = s.units.filter((u) => u.side === "ally");
  const enemies = s.units.filter((u) => u.side === "enemy");
  const KIND_ORDER: Record<DDSkill["kind"], number> = { attack: 0, battle: 1, link: 2, ult: 3 };
  const skills = current ? [...usableSkills(s, current)].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]) : [];
  const upcoming = winner ? [] : turnOrder(s, 6); // ATB 예측 순서(비파괴)

  return (
    <div className="dd-battle relative mx-auto max-w-[1500px] px-4 py-5 sm:px-7">
      {/* 행동 순서 — 화면 왼쪽 세로 컬럼(엔필식 턴 오더) */}
      {!winner && upcoming.length > 0 && (
        <div className="absolute left-1 top-[68px] z-30 flex flex-col gap-1.5 sm:left-2">
          <span className="mb-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ef-muted">순서</span>
          {upcoming.slice(0, 6).map((u, i) => {
            const ally = u.side === "ally";
            const nm = ally ? OPERATORS.find((o) => o.id === u.id)?.name ?? u.id : u.name;
            const now = i === 0;
            return (
              <div key={`${u.id}-${i}`} className="flex items-center gap-1.5" title={`${i + 1}. ${nm}`}>
                <span className={`relative shrink-0 border-2 ${now ? "h-12 w-12" : "h-9 w-9"}`} style={{ borderColor: now ? "#ffbe6b" : ally ? "#3c2c1a" : "#5a2420", background: ally ? `center/cover url(${avatarUrl(u.id)})` : "#3a1512", opacity: now ? 1 : 0.7, boxShadow: now ? "0 0 10px rgba(255,190,107,0.75)" : undefined }}>
                  {!ally && <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-red-300/90">✦</span>}
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-4 w-4 items-center justify-center border border-ef-line bg-black font-mono text-[10px] font-black" style={{ color: now ? "#ffbe6b" : "#a0a0a0" }}>{i + 1}</span>
                </span>
                {now && <span className="font-mono text-[11px] font-black uppercase tracking-wider text-ef-accent">지금</span>}
              </div>
            );
          })}
        </div>
      )}
      {/* 상단 바 — 교전 정보 · 게이지 · 속도 · 자동 */}
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <span className="border px-3 py-1.5 font-mono text-sm font-bold" style={{ ...CUT_SM, borderColor: nodeKind === "boss" ? "#b3312a88" : "#3c2c1a", color: nodeKind === "boss" ? "#e0655c" : "#ecdfc2", background: "#150e08" }}>{nodeTitle[nodeKind]} · 라운드 {s.round}</span>
        <div className="min-w-[180px] flex-1">
          <div className="mb-0.5 flex justify-between font-mono text-[12px] uppercase tracking-wider text-ef-muted"><span>스킬 게이지(공유)</span><span>{Math.round(s.skillGauge)}/{s.maxGauge}</span></div>
          <Bar value={s.skillGauge} max={s.maxGauge} color={PRIMARY} />
        </div>
        {!winner && <button type="button" onClick={cycleSpeed} className="border border-ef-line bg-ef-card px-3 py-1.5 font-mono text-[13px] font-bold uppercase tracking-wider text-ef-muted transition hover:text-white" style={CUT_SM} title="재생 속도">{speed}배속</button>}
        {!winner && <button type="button" onClick={toggleAuto} className={`border px-3.5 py-1.5 font-mono text-[13px] font-bold uppercase tracking-wider transition ${auto ? "border-ef-accent/60 bg-ef-accent/15 text-ef-accent" : "border-ef-line bg-ef-card text-ef-muted hover:text-white"}`} style={CUT_SM}>{auto ? "자동 ON" : "수동"}</button>}
      </div>

      {/* 라운드 배너 */}
      {roundBanner && !winner && (
        <div key={roundBanner.tick} className="dd-round pointer-events-none absolute inset-x-0 top-24 z-40 text-center" style={{ fontFamily: "var(--dd-display)", fontSize: "2.4rem", fontWeight: 800, letterSpacing: "0.28em", color: "#e8c56a", textShadow: "0 3px 16px rgba(0,0,0,0.9)" }}>라운드 {roundBanner.n}</div>
      )}

      {winner && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 dd-frame px-4 py-3" style={{ ...CUT_SM, borderColor: winner === "ally" ? "#ff9a2f66" : "#b3312a66" }}>
          <span className="text-2xl" style={{ fontFamily: "var(--dd-display)", letterSpacing: "0.16em", color: winner === "ally" ? "#e8c56a" : "#c23b32", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{winner === "ally" ? (nodeKind === "boss" ? "던전 클리어" : "교전 승리") : "부대 전멸"}</span>
          <button type="button" onClick={() => onEnd(winner, allies.map((a) => ({ id: a.id, hp: a.hp })))} className="dd-torch border border-ef-line px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider transition hover:border-ef-accent/50" style={{ ...CUT_SM, background: PRIMARY, color: "#0a0a0a" }}>계속 →</button>
        </div>
      )}

      {/* ===== 전장 ===== */}
      <div className="relative overflow-hidden border border-ef-line p-3 sm:p-5" style={{ ...CUT_SM, background: "radial-gradient(120% 90% at 50% 0%, rgba(120,40,30,0.18), transparent 55%), radial-gradient(100% 80% at 50% 100%, rgba(201,122,44,0.10), transparent 55%), #0d0906" }}>
        {/* 적진 */}
        <div className="mb-1.5 flex items-center gap-2 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-red-300/70"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/30" />적 {enemies.filter((e) => e.hp > 0).length}/{enemies.length}<span className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/30" /></div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {enemies.map((e) => {
            const ed = enemyDefFor(e.id);
            const el = ed?.element ?? "physical";
            const dead = e.hp <= 0;
            const hit = fx.floaters.some((f) => f.id === e.id && f.amt < 0);
            const isAct = fx.activeId === e.id;
            return (
              <div key={e.id} className={`relative w-[180px] ${shakeCls(hit, fx.tick)} ${actCls(isAct, fx.tick)}`}>
                <FxLayer id={e.id} fx={fx} />
                <div onClick={aiming && !dead ? () => playerAct(aiming, e.id) : () => setInspectId(e.id)} className={`relative border p-2.5 transition ${dead ? "cursor-pointer border-ef-line/40 opacity-35 grayscale" : aiming ? "cursor-pointer border-ef-accent bg-ef-accent/10 hover:bg-ef-accent/20" : e.staggered ? "cursor-pointer border-yellow-400/70 bg-yellow-400/5 hover:border-yellow-400" : "cursor-pointer border-red-500/40 bg-[#1a0e0b] hover:border-red-400"} ${isAct && !dead ? "dd-active" : ""}`} style={CUT_SM}>
                  {aiming && !dead && <span className="absolute right-1 top-1 z-10 font-mono text-[11px] font-bold text-ef-accent">🎯 대상</span>}
                  {/* 적 이미지 */}
                  <div className="relative mb-1.5 flex h-16 items-center justify-center overflow-hidden border border-ef-line/50" style={{ background: `radial-gradient(circle at 50% 35%, ${el === "physical" ? "#5a2a22" : elementColor[el] + "40"}, #140a08 70%)` }}>
                    <span className="absolute text-3xl opacity-40">{nodeKind === "boss" && ed?.role === "boss" ? "☠" : ed?.role === "elite" ? "✧" : "✦"}</span>
                    <img src={enemyImage(e.id)} alt="" loading="lazy" className="relative h-full w-full object-contain" onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    {dead && <span className="absolute text-3xl">💀</span>}
                  </div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">{ed && <span className="h-2 w-2 shrink-0" style={{ background: elementColor[el] }} />}<span className="truncate font-mono text-sm font-bold text-white">{e.name}</span></span>
                    <span className="font-mono text-[12px] text-ef-muted">{Math.max(0, e.hp)}</span>
                  </div>
                  <Bar value={e.hp} max={e.maxHp} color="#e0655c" />
                  {!dead && <div className="mt-0.5"><Bar value={e.atb} max={100} color="#67e8f9" h="h-1" /></div>}
                  {e.staggerMax > 0 && <div className="mt-1"><Bar value={e.staggered ? e.staggerMax : e.stagger} max={e.staggerMax} color={e.staggered ? "#facc15" : "#a16207"} h="h-1" /></div>}
                  {e.staggered && <div className="mt-1 font-mono text-[12px] font-bold uppercase tracking-wider text-yellow-400">⚡ 불균형 +30%</div>}
                  {ed && <div className="mt-1 flex flex-wrap gap-1"><Chip tone="#e0655c">{ed.faction}</Chip>{ed.resist && (Object.entries(ed.resist) as [Element | "physical", number][]).filter(([, v]) => v < 0).map(([eln, v]) => <Chip key={eln} tone={elementColor[eln]}>{elementName[eln]} 약점{Math.round(-v * 100)}</Chip>)}</div>}
                  <div className="mt-1 flex flex-wrap gap-1">{unitChips(e).map((c) => <Chip key={c.k} tone={c.tone}>{c.label}</Chip>)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 교전선 */}
        <div className="my-4 flex items-center justify-center gap-3"><span className="h-px w-1/4 bg-gradient-to-r from-transparent via-ef-line to-ef-line" /><span className="font-mono text-[12px] uppercase tracking-[0.4em] text-ef-muted">교전</span><span className="h-px w-1/4 bg-gradient-to-l from-transparent via-ef-line to-ef-line" /></div>

        {/* 아군진 */}
        <div className="mb-1.5 flex items-center gap-2 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ef-accent/70"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-ef-accent/25" />부대<span className="h-px flex-1 bg-gradient-to-l from-transparent to-ef-accent/25" /></div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {allies.map((a) => {
            const op = OPERATORS.find((o) => o.id === a.id);
            const el = op?.element ?? "physical";
            const dead = a.hp <= 0;
            const lowHp = a.hp / a.maxHp < 0.35;
            const hit = fx.floaters.some((f) => f.id === a.id && f.amt < 0);
            const isAct = fx.activeId === a.id;
            const isCur = current?.id === a.id;
            const sets = activeSets(party.find((p) => p.id === a.id)?.loadout ?? {});
            return (
              <div key={a.id} className={`relative w-[212px] ${shakeCls(hit, fx.tick)} ${actCls(isAct, fx.tick)}`}>
                <FxLayer id={a.id} fx={fx} />
                <div onClick={() => setInspectId(a.id)} className={`relative cursor-pointer border p-2 transition ${dead ? "border-ef-line/40 opacity-40 grayscale" : isCur ? "border-ef-accent bg-ef-accent/10" : "border-ef-line bg-[#150e08] hover:border-ef-accent/40"} ${isAct && !dead ? "dd-active" : ""}`} style={CUT_SM}>
                  <div className="mb-1.5 flex gap-2">
                    {/* 초상 */}
                    <div className="relative h-16 w-16 shrink-0 border border-ef-line" style={{ background: `center top/cover url(${avatarUrl(a.id)}), #0d0906`, boxShadow: `inset 0 0 0 1px ${elementColor[el]}55` }}>
                      <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: elementColor[el] }} />
                      {dead && <span className="absolute inset-0 flex items-center justify-center text-2xl">💀</span>}
                      {isCur && <span className="absolute -right-1 -top-1 font-mono text-[12px] font-bold text-ef-accent">▶</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate font-mono text-sm font-bold text-white">{a.name}</span>
                        {weaponOf(a.id) && (weaponImage(a.id) ? <img src={weaponImage(a.id)} alt="" loading="lazy" className="h-4 w-4 shrink-0 object-contain" title={`${WEAPON_KO[weaponOf(a.id)!]} · ${weaponEffectText(a.id)}`} /> : <span className="text-[13px] leading-none" title={`${WEAPON_KO[weaponOf(a.id)!]} · ${weaponEffectText(a.id)}`}>{WEAPON_ICON[weaponOf(a.id)!]}</span>)}
                        {op && <span className="font-mono text-[12px] uppercase text-ef-muted">{classLabel[op.cls]}</span>}
                      </div>
                      <div className="mt-0.5 flex justify-between font-mono text-[12px] text-ef-muted"><span>HP</span><span>{Math.max(0, a.hp)}/{a.maxHp}</span></div>
                      <Bar value={a.hp} max={a.maxHp} color={lowHp ? "#e0655c" : "#8fb84a"} />
                      {a.shield > 0 && <div className="mt-0.5 font-mono text-[12px] text-sky-300">보호막 {a.shield}</div>}
                      <div className="mt-1 flex items-center gap-1"><span className="font-mono text-[12px] uppercase text-ef-muted">궁</span><Bar value={a.ultCharge} max={a.ultCost} color={a.ultCharge >= a.ultCost ? "#e8c56a" : "#8a6d1f"} h="h-1" /></div>
                      <div className="mt-0.5 flex items-center gap-1"><span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-ef-muted">속도</span><Bar value={a.atb} max={100} color="#67e8f9" h="h-1" /></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sets.map((n) => <Chip key={`set-${n}`} tone="#c9a227">◆{n}</Chip>)}
                    {unitChips(a).map((c) => <Chip key={c.k} tone={c.tone}>{c.label}</Chip>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 수동 조작 — 스킬 선택 */}
      {!winner && current && !auto && (
        <div className="mt-3 border border-ef-accent/40 bg-ef-accent/5 p-3" style={CUT_SM}>
          <div className="mb-2 flex items-center gap-2 font-mono text-[13px] font-bold uppercase tracking-wider text-ef-accent">
            {aiming ? <><span className="text-ef-accent-soft">🎯 {aiming.name} — 공격할 적을 선택</span><button type="button" onClick={() => setAiming(null)} className="ml-auto border border-ef-line px-2 py-0.5 text-[12px] text-ef-muted hover:text-white">취소</button></> : <span>{current.name} — 스킬 선택</span>}
          </div>
          <div className={`flex flex-wrap gap-2 ${aiming ? "pointer-events-none opacity-40" : ""}`}>
            {skills.map((sk) => (
              <button key={sk.id} type="button" onClick={() => chooseSkill(sk)} className="group flex items-start gap-2 border border-ef-line bg-ef-card px-2.5 py-2 text-left transition hover:border-ef-accent/60" style={CUT_SM}>
                <img src={skillIcon(current!.id, sk.kind)} alt="" loading="lazy" className="mt-0.5 h-9 w-9 shrink-0 border border-ef-line/60 bg-black/40 object-contain p-0.5" onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5"><span className="border px-1 py-px font-mono text-[12px] font-bold uppercase" style={{ borderColor: `${PRIMARY}66`, color: PRIMARY }}>{kindLabel[sk.kind]}</span><span className="font-mono text-sm font-bold text-white">{sk.name}</span>{sk.power > 0 && <span className="font-mono text-[12px] text-ef-muted">{Math.round(sk.power * 100)}%</span>}</span>
                  {sk.note && <span className="mt-0.5 block max-w-[230px] truncate text-[12px] text-ef-muted group-hover:text-ef-ink">{sk.note}</span>}
                </span>
              </button>
            ))}
            {!skills.length && <span className="font-mono text-xs text-ef-muted">사용 가능한 스킬 없음</span>}
          </div>
          {Object.keys(items).length > 0 && (
            <div className="mt-2 border-t border-ef-line/50 pt-2">
              <div className="mb-1.5 font-mono text-[12px] font-bold uppercase tracking-wider text-ef-muted">전술 아이템 <span className="text-ef-muted">· 자유 행동</span></div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(items).map(([id, n]) => {
                  const it = ITEMS[id]; if (!it) return null;
                  const usable = canUseItem(s, id);
                  return (
                    <button key={id} type="button" disabled={!usable} onClick={() => playerUseItem(id)} className={`group border bg-black/40 px-2.5 py-1.5 text-left transition ${usable ? "border-ef-line hover:border-ef-accent/60" : "border-ef-line/40 opacity-45"}`} style={CUT_SM}>
                      <div className="flex items-center gap-1.5"><img src={itemImage(id)} alt="" loading="lazy" className="h-6 w-6 shrink-0 rounded-sm object-contain" style={{ background: `${itemColor(it.kind)}18` }} /><span className="font-mono text-xs font-bold text-white">{it.name}</span><span className="font-mono text-[12px] text-ef-accent">×{n}</span></div>
                      <div className="mt-0.5 max-w-[220px] truncate text-[12px] text-ef-muted group-hover:text-ef-ink">{it.desc} · {condText(it.cond)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 하단 패널 — 데미지 기록 / 전투 기록 탭 */}
      {(() => {
        const dmgList = allies.map((a) => ({ id: a.id, name: OPERATORS.find((o) => o.id === a.id)?.name ?? a.id, dmg: Math.round(dmgRef.current[a.id] ?? 0), el: unitElement(a) })).sort((x, y) => y.dmg - x.dmg);
        const dmgMax = Math.max(1, ...dmgList.map((d) => d.dmg));
        const dmgTotal = Math.max(1, dmgList.reduce((sum, d) => sum + d.dmg, 0));
        const TabBtn = ({ k, label }: { k: "dmg" | "log"; label: string }) => (
          <button type="button" onClick={() => { setTab(k); setShowLog(true); }} className={`border px-2.5 py-1 font-mono text-[12px] font-bold uppercase tracking-wider transition ${tab === k && showLog ? "border-ef-accent/70 bg-ef-accent/15 text-ef-accent" : "border-ef-line bg-ef-card text-ef-muted hover:text-ef-ink"}`} style={CUT_SM}>{label}</button>
        );
        return (
          <div className="mt-3 border border-ef-line bg-ef-card/70" style={CUT_SM}>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5">
              <TabBtn k="dmg" label="데미지 기록" />
              <TabBtn k="log" label="전투 기록" />
              <button type="button" onClick={() => setShowLog((v) => !v)} className="ml-auto font-mono text-[12px] font-bold uppercase tracking-wider text-ef-muted transition hover:text-ef-ink">{showLog ? "▲ 접기" : "▼ 펼치기"}</button>
            </div>
            {showLog && tab === "dmg" && (
              <div className="flex flex-col gap-2 border-t border-ef-line px-3 py-3">
                {dmgList.map((d, i) => (
                  <div key={d.id} className="flex items-center gap-2.5">
                    <span className="w-5 shrink-0 text-right font-mono text-sm font-black" style={{ color: i === 0 ? "#ffbe6b" : "#85858e" }}>{i + 1}</span>
                    <img src={avatarUrl(d.id)} alt="" loading="lazy" className="h-8 w-8 shrink-0 border object-cover" style={{ background: "#000", borderColor: i === 0 ? "#ffbe6b88" : "#262629" }} />
                    <span className="w-24 shrink-0 truncate font-mono text-sm font-bold" style={{ color: i === 0 ? "#fff" : "#e8e8ea" }}>{d.name}</span>
                    <div className="relative h-6 flex-1 overflow-hidden border border-ef-line bg-black/50">
                      <div className="h-full transition-all duration-300" style={{ width: `${(d.dmg / dmgMax) * 100}%`, background: `linear-gradient(90deg, ${elementColor[d.el]}cc, ${elementColor[d.el]})` }} />
                      <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[12px] font-bold tabular-nums text-white" style={{ textShadow: "0 1px 3px #000" }}>{Math.round((d.dmg / dmgTotal) * 100)}%</span>
                    </div>
                    <span className="w-24 shrink-0 text-right font-mono text-[15px] font-bold tabular-nums text-ef-ink">{d.dmg.toLocaleString()}</span>
                  </div>
                ))}
                {dmgTotal <= 1 && <div className="py-3 text-center font-mono text-[13px] text-ef-muted">아직 가한 피해 없음</div>}
              </div>
            )}
            {showLog && tab === "log" && (
              <div className="flex max-h-[38vh] flex-col-reverse gap-0.5 overflow-y-auto border-t border-ef-line px-3 py-2 font-mono text-[13px] leading-relaxed">
                {[...s.log].slice(-160).reverse().map((line, i) => (
                  <div key={s.log.length - i} className={line.startsWith("──") ? "mt-1 font-bold text-ef-accent" : line.includes("불균형 상태") || line.includes("승리") ? "text-yellow-300" : line.includes("→") && !line.startsWith("  ") ? "text-white" : line.includes("✗") ? "text-red-300" : "text-ef-muted"}>{line}</div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* 유닛 조회 패널 */}
      {inspectId && (() => {
        const u = s.units.find((x) => x.id === inspectId);
        if (!u) return null;
        const ally = u.side === "ally";
        const op = ally ? OPERATORS.find((o) => o.id === u.id) : null;
        const ed = ally ? null : enemyDefFor(u.id);
        const el = unitElement(u);
        const talents = ally ? OP_TALENTS[u.id] ?? [] : [];
        const uskills = ally ? SKILLS[u.id] ?? [] : [];
        const sets = ally ? activeSets(party.find((p) => p.id === u.id)?.loadout ?? {}) : [];
        const wId = ally ? weaponOf(u.id) : null;
        const resists = Object.entries(u.resist) as [Element | "physical", number][];
        const close = () => setInspectId(null);
        const hide = (ev: React.SyntheticEvent<HTMLImageElement>) => { (ev.currentTarget as HTMLImageElement).style.visibility = "hidden"; };
        const St = ({ label, value }: { label: string; value: string | number }) => (
          <div className="bg-[#120c07] px-2.5 py-2"><div className="font-mono text-[11px] uppercase tracking-wider text-ef-muted">{label}</div><div className="mt-0.5 font-mono text-[15px] font-bold text-ef-ink">{value}</div></div>
        );
        const Sec = ({ title, children }: { title: string; children: React.ReactNode }) => (
          <div className="border-t border-ef-line p-3"><div className="mb-2 font-mono text-[12px] font-bold uppercase tracking-wider text-ef-accent/70">{title}</div>{children}</div>
        );
        return (
          <div onClick={close} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div onClick={(e) => e.stopPropagation()} className="max-h-[86vh] w-full max-w-[540px] overflow-y-auto border border-ef-accent/50 bg-[#0d0906]" style={CUT_SM}>
              {/* 헤더 */}
              <div className="flex items-center gap-3 border-b border-ef-line p-3.5">
                <div className="h-14 w-14 shrink-0 border border-ef-line" style={{ background: ally ? `center top/cover url(${avatarUrl(u.id)}), #0d0906` : `center/contain no-repeat url(${enemyImage(u.id)}), radial-gradient(circle at 50% 35%, ${el === "physical" ? "#5a2a22" : elementColor[el] + "40"}, #140a08 70%)` }} />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-lg font-bold text-white">{u.name}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 font-mono text-[13px] text-ef-muted">
                    <span className="inline-block h-2 w-2" style={{ background: elementColor[el] }} /><span>{elementName[el]}</span>
                    {op && <span>· {classLabel[op.cls]}</span>}
                    {ed && <span>· {tierLabel[ed.tier] ?? ed.tier} · {ed.faction} · {ed.role}</span>}
                  </div>
                </div>
                <button type="button" onClick={close} className="shrink-0 border border-ef-line px-2 py-1 font-mono text-sm text-ef-muted transition hover:border-ef-accent/60 hover:text-white">✕</button>
              </div>
              {/* 스탯 */}
              <div className="grid grid-cols-3 gap-px bg-ef-line p-px">
                <St label="HP" value={`${Math.max(0, u.hp)}/${u.maxHp}`} />
                <St label="공격력" value={u.attack} />
                <St label="방어력" value={u.defense} />
                <St label="속도" value={u.speed + (u.speedMod || 0)} />
                <St label="치명" value={`${Math.round(u.critRate * 100)}%`} />
                <St label="치명피해" value={`${Math.round(u.critDmg * 100)}%`} />
              </div>
              {/* 저항 */}
              <Sec title="속성 저항">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {resists.map(([k, v]) => <span key={k} className="font-mono text-[13px]" style={{ color: v < 0 ? "#f87171" : elementColor[k] }}>{elementName[k]} {v > 0 ? `저항 ${Math.round(v * 100)}` : v < 0 ? `약점 ${Math.round(-v * 100)}` : "0"}</span>)}
                </div>
              </Sec>
              {ally && <>
                {wId && <Sec title="무기">
                  <div className="flex items-start gap-2.5">
                    {weaponImage(u.id) && <img src={weaponImage(u.id)} alt="" className="h-9 w-9 shrink-0 object-contain" onError={hide} />}
                    <div className="min-w-0">
                      <div className="font-mono text-[14px] font-bold text-white">{WEAPON_KO[wId]}{weaponSeriesName(u.id) && <span className="text-ef-muted"> · {weaponSeriesName(u.id)}</span>}</div>
                      <div className="mt-0.5 font-mono text-[13px] text-ef-accent-soft">{weaponEffectText(u.id)}</div>
                      {weaponSeriesDesc(u.id) && <div className="mt-0.5 font-mono text-[12px] leading-relaxed text-ef-muted">{weaponSeriesDesc(u.id)}</div>}
                    </div>
                  </div>
                </Sec>}
                <Sec title="장비 세트">
                  {sets.length ? sets.map((n) => <div key={n} className="mb-1.5 last:mb-0"><span className="font-mono text-[14px] font-bold text-[#e8c56a]">◆ {n}</span><div className="mt-0.5 font-mono text-[13px] leading-relaxed text-ef-muted">{setEffectText(n)}</div></div>) : <div className="font-mono text-[13px] text-ef-muted">활성 세트 없음</div>}
                </Sec>
                <Sec title="스킬">
                  {[...uskills].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]).map((sk) => <div key={sk.id} className="mb-2.5 flex items-start gap-2.5 last:mb-0">
                    <img src={skillIcon(u.id, sk.kind)} alt="" className="h-9 w-9 shrink-0 border border-ef-line object-cover" onError={hide} />
                    <div className="min-w-0"><div><span className="font-mono text-[14px] font-bold text-white">{sk.name}</span> <span className="font-mono text-[11px] uppercase text-ef-accent/70">{kindLabel[sk.kind]}</span></div>{sk.note && <div className="mt-0.5 font-mono text-[13px] leading-relaxed text-ef-muted">{sk.note}</div>}</div>
                  </div>)}
                </Sec>
                {talents.length > 0 && <Sec title="재능">
                  {talents.map((t, i) => <div key={i} className="mb-2.5 flex items-start gap-2.5 last:mb-0">
                    {t.icon && <img src={t.icon} alt="" className="h-9 w-9 shrink-0 border border-ef-line object-cover" onError={hide} />}
                    <div className="min-w-0"><div className="font-mono text-[14px] font-bold text-white">{t.name}</div><div className="mt-0.5 font-mono text-[13px] leading-relaxed text-ef-muted">{t.desc}</div></div>
                  </div>)}
                </Sec>}
              </>}
              {ed && <Sec title="행동 유형"><div className="font-mono text-[13px] text-ef-muted">{behaviorLabel[ed.behavior] ?? ed.behavior}</div></Sec>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
