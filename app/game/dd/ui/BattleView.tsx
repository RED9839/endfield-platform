"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import { act, canAct, isOver, startRound, perTurn, nextActor, turnOrder, usable, BASIC, type DDClass, type DDSkill, type DDState, type DDUnit, type Element } from "../combat";
import { OPERATORS, SKILLS, OP_BASIC, enemyDefFor, avatarUrl, fullUrl, skillIcon, enemyImage, enemyArchetype } from "../roster";
import { ENCOUNTERS, allyChoose, createBattle, enemyAct, regionEncounter } from "../sim";
import { activeSets, setEffectText, loadoutPieces } from "../gear";
import { weaponOf, weaponEffectText, weaponImage, weaponSeriesName, weaponSeriesDesc, WEAPON_KO, WEAPON_ICON } from "../weapons";
import { OP_TALENTS } from "../operator-talents";
import { ITEMS, useItem as applyItem, canUseItem, itemColor, itemImage } from "../items";
import type { BattleResult, NodeKind, PartyMember } from "../run";

const PRIMARY = "#ff9a2f";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const elementName: Record<"physical" | Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const classLabel: Record<DDClass, string> = { guard: "가드", caster: "캐스터", striker: "스트라이커", vanguard: "뱅가드", defender: "디펜더", supporter: "서포터" };
const kindLabel: Record<DDSkill["kind"], string> = { attack: "기본공격", battle: "배틀스킬", link: "연계스킬", ult: "궁극기" };
const targetLabel: Record<DDSkill["target"], string> = { "single-front": "단일", "single-lowhp": "단일", row: "범위", all: "범위", self: "자신" };
// 스킬 사용 불가 사유(usable()과 동일 순서). null=사용 가능.
function skillReason(s: DDState, u: DDUnit, sk: DDSkill): string | null {
  if (usable(s, u, sk)) return null;
  if (sk.selfUlt && u.ultCharge < u.ultCost) return "궁 게이지 부족";
  if (sk.kind === "battle" && s.skillGauge < (sk.gaugeCost ?? 100)) return "스킬 게이지 부족";
  if (sk.kind === "link" && u.linkCd > 0) return `쿨타임 ${u.linkCd}턴`;
  if (sk.requiresStance != null && u.stance < sk.requiresStance) return "자세 전환 필요";
  return sk.requiresText ?? "조건 미충족";
}
const statusLabel: Record<string, string> = { stun: "기절", combustion: "연소", corrosion: "부식", crystal: "결정", "armor-break": "갑옷파괴", shock: "감전", wing: "날개" };
const nodeTitle: Record<NodeKind, string> = { battle: "교전", elite: "정예 교전", boss: "보스 교전", rest: "야영" };
const behaviorLabel: Record<string, string> = { melee: "근접 돌격", snipe: "원거리 저격", heavy: "중장 강타", aoe: "광역 자폭", heal: "치유 지원", buff: "강화 지원" };
const targetDesc: Record<string, string> = { front: "전열 강타 — 최전열(탱커) 우선", wounded: "부상자 저격 — 체력% 낮은 대상 마무리", threat: "고위협 직격 — 공격력 높은 딜러 조준" };
const tierLabel: Record<string, string> = { normal: "일반", common: "일반", enhanced: "강화", advanced: "정예", elite: "정예", boss: "보스" };
const DMG_KO: Record<string, string> = { ult: "궁극", battle: "배틀", link: "연계", attack: "일반", all: "물리", elem: "원소", atkPct: "공격력", hpPct: "생명력", critRate: "치명확", critDmg: "치명피", energy: "궁충" };
const pieceDmgText = (d?: { kind: string; base: number }) => { if (!d) return ""; const pct = d.kind === "hpPct" || d.base < 1; return `${DMG_KO[d.kind] ?? d.kind} +${pct ? Math.round(d.base * 100) + "%" : Math.round(d.base)}`; };

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
  return (
    <div className={`${h} relative w-full overflow-hidden rounded-[2px] bg-black/75`} style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 3px rgba(0,0,0,0.9)" }}>
      <div className="relative h-full rounded-[2px] transition-all duration-300 ease-out" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 7px ${color}77` }}>
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[45%] rounded-t-[2px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.42), transparent)" }} />
      </div>
    </div>
  );
}
function Chip({ children, tone = "#a1a1aa" }: { children: React.ReactNode; tone?: string }) {
  return <span className="inline-flex items-center border px-1.5 py-0.5 font-mono text-[12px] font-bold leading-none tracking-wide" style={{ borderColor: `${tone}99`, color: tone, background: `${tone}22` }}>{children}</span>;
}
// 상태 칩. dir: +1=버프(▲), -1=디버프(▼), 0=중립(부착 등). turns=잔여 지속 턴. src=출처(누가·무엇으로).
type EffSrc = { by: string; via: string; kind: "skill" | "weapon" | "gear" | "item" };
type StatusChip = { k: string; label: string; tone: string; dir: number; turns?: number; src?: EffSrc };
function unitChips(u: DDUnit): StatusChip[] {
  const T = u.timers || {};
  const S = (u.effectSrc || {}) as Record<string, EffSrc>;
  const maxKey = (pre: string) => { let m = 0, mk = ""; for (const k in T) if (k.startsWith(pre) && T[k] > m) { m = T[k]; mk = k; } return mk; };
  const c: StatusChip[] = [];
  if (u.physBreak > 0) c.push({ k: "pb", label: `▼ 방불 ${u.physBreak}`, tone: "#fca5a5", dir: -1, turns: T.physBreak, src: S.physBreak });
  if (u.frozen > 0) c.push({ k: "fz", label: `❄ 동결 ${u.frozen}`, tone: "#67e8f9", dir: -1, turns: T.frozen, src: S.frozen });
  for (const st of u.statuses) c.push({ k: st, label: `▼ ${statusLabel[st] ?? st}`, tone: "#fbbf24", dir: -1, turns: T[st], src: S[st] });
  (["heat", "electric", "cryo", "nature"] as Element[]).forEach((e) => { if (u.arts[e] > 0) c.push({ k: e, label: `${elementName[e]}부착 ${u.arts[e]}`, tone: elementColor[e], dir: 0, turns: T["arts:" + e], src: S["arts:" + e] }); });
  if (u.dot > 0) c.push({ k: "dot", label: `🔥 지속 ${u.dot}`, tone: "#fb923c", dir: -1, turns: T.dot, src: S.dot });
  if ((u.atkBuff ?? 0) > 0) c.push({ k: "atk", label: `▲ 공격 +${Math.round(u.atkBuff * 100)}%`, tone: "#ffd24a", dir: 1, turns: T.atkBuff, src: S.atkBuff });
  if (u.weakenMul < 1) c.push({ k: "wk", label: `▼ 허약 ${Math.round((1 - u.weakenMul) * 100)}%`, tone: "#c084fc", dir: -1, turns: T.weaken, src: S.weaken });
  const amp = (Object.values(u.amp) as number[]).reduce((a, b) => a + b, 0);
  if (amp > 0) { const mk = maxKey("amp:"); c.push({ k: "amp", label: `▲ 증폭 ${Math.round(amp * 100)}%`, tone: "#86efac", dir: 1, turns: T[mk] || undefined, src: S[mk] }); }
  const vuln = (Object.values(u.vuln) as number[]).reduce((a, b) => a + b, 0);
  if (vuln > 0) { const mk = maxKey("vuln:"); c.push({ k: "vuln", label: `▼ 취약 ${Math.round(vuln * 100)}%`, tone: "#f87171", dir: -1, turns: T[mk] || undefined, src: S[mk] }); }
  if (u.protection > 0) c.push({ k: "prot", label: `▲ 비호 ${Math.round(u.protection * 100)}%`, tone: "#38bdf8", dir: 1, turns: T.protection, src: S.protection });
  if (u.multiHit > 0) c.push({ k: "mh", label: `▲ 연타 ${u.multiHit}`, tone: "#fb923c", dir: 1 });
  return c;
}
const SRC_KIND_KO: Record<string, string> = { skill: "스킬", weapon: "무기", gear: "장비", item: "아이템" };

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
  const [detailId, setDetailId] = useState<string | null>(null); // 스킬 상세 펼침
  const [showLog, setShowLog] = useState(false);
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
      else if (u.frozen > 0) s.log.push(`${u.name} 동결 — 행동 불가`);
      else if ((u.timers.stun || 0) > 0) s.log.push(`${u.name} 시간 정지 — 행동 불가`);
      fxTick.current += 1; setFx({ tick: fxTick.current, activeId: u.id, actingSide: u.side, floaters: [], cast: { id: u.id, text: u.staggered ? "불균형!" : u.frozen > 0 ? "동결!" : "행동 불가" } }); bump();
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
  const skills = current ? [...(SKILLS[current.id] ?? []), BASIC].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]) : []; // 4종 전부(불가 스킬 포함)
  const upcoming = winner ? [] : turnOrder(s, 6); // ATB 예측 순서(비파괴)

  return (
    <div className="dd-battle relative mx-auto max-w-[1640px] px-3 py-4 sm:px-5">
      {/* 행동 순서 — 속도 기반 턴 오더(이름·연결선·아군/적 색·현재 강조) */}
      {!winner && upcoming.length > 0 && (
        <div className="absolute left-1 top-[60px] z-30 sm:left-2">
          <div className="mb-1.5 flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ef-accent/80">⏱ 속도 순서</div>
          <div className="relative flex flex-col gap-1">
            {/* 흐름 연결선 */}
            <span className="pointer-events-none absolute bottom-4 left-[17px] top-4 w-0.5 bg-gradient-to-b from-ef-accent/60 via-ef-line to-transparent" />
            {(current && upcoming[0] !== current ? [current, ...upcoming] : upcoming).slice(0, 6).map((u, i) => {
              const ally = u.side === "ally";
              const nm = ally ? OPERATORS.find((o) => o.id === u.id)?.name ?? u.id : u.name;
              const el = ally ? (OPERATORS.find((o) => o.id === u.id)?.element ?? "physical") : (enemyDefFor(u.id)?.element ?? "physical");
              const tone = ally ? elementColor[el] : "#e0655c";
              const now = i === 0;
              const r = Math.max(0, Math.min(1, u.hp / u.maxHp));
              return (
                <div key={`${u.id}-${i}`} className="relative flex items-center gap-2" style={{ opacity: now ? 1 : Math.max(0.5, 1 - i * 0.11) }}>
                  <span className={`relative z-10 shrink-0 overflow-hidden border-2 transition-all ${now ? "h-11 w-11" : "h-8 w-8"}`} style={{ borderColor: now ? "#ffbe6b" : tone, background: ally ? `center/cover url(${avatarUrl(u.id)})` : `radial-gradient(circle at 50% 35%, ${tone}66, #2a1210 75%)`, boxShadow: now ? `0 0 12px ${tone}, 0 0 0 2px #ffbe6b` : `0 0 0 1px ${tone}55` }}>
                    {!ally && <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-red-200/90">✦</span>}
                    <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: `linear-gradient(90deg, ${r < 0.35 ? "#e0655c" : ally ? "#8fb84a" : "#e0655c"} ${r * 100}%, rgba(0,0,0,0.85) ${r * 100}%)` }} />
                  </span>
                  <span className={`dd-cut flex items-center gap-1 border px-1.5 py-0.5 font-mono leading-none ${now ? "text-[12px] font-black" : "text-[11px] font-bold"}`} style={{ borderColor: now ? "#ffbe6b99" : `${tone}44`, background: now ? "linear-gradient(90deg, rgba(255,190,107,0.2), rgba(13,9,6,0.6))" : "rgba(13,9,6,0.8)", color: now ? "#ffdf9e" : ally ? "#e6e6e8" : "#f0a8a0" }}>
                    {now ? <span className="text-ef-accent">▶ 지금</span> : nm}
                    {!now && <span className="text-[9px] text-ef-muted">{ally ? "" : "·적"}</span>}
                  </span>
                  {now && <span className="font-mono text-[11px] font-bold text-white/90">{nm}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* 상단 HUD — 스킬 게이지(좌) · 라운드 인디케이터(중앙) · 컨트롤(우) */}
      <div className="hud-panel dd-cut mb-3 flex items-center gap-3 px-3 py-2 sm:gap-5 sm:px-4">
        <div className="ml-8 min-w-[150px] flex-1 sm:ml-12">
          <div className="mb-1 flex justify-between font-mono text-[11px] uppercase tracking-wider text-ef-muted"><span>스킬 게이지 · 공유</span><span className="font-bold text-ef-ink">{Math.round(s.skillGauge)}/{s.maxGauge}</span></div>
          <Bar value={s.skillGauge} max={s.maxGauge} color={PRIMARY} h="h-2.5" />
        </div>
        <div className="flex shrink-0 flex-col items-center px-1">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: nodeKind === "boss" ? "#f0776e" : "#ff9a2f" }}>{nodeTitle[nodeKind]}</span>
          <span className="font-mono text-2xl font-black uppercase leading-none tracking-wide" style={{ color: nodeKind === "boss" ? "#f0776e" : "#f4e9d2", textShadow: `0 2px 12px ${nodeKind === "boss" ? "rgba(180,49,42,0.6)" : "rgba(0,0,0,0.7)"}` }}>R{s.round}</span>
        </div>
        <div className="flex min-w-[150px] flex-1 items-center justify-end gap-2">
          <button type="button" onClick={() => setShowLog((v) => !v)} className={`hud-btn dd-cut px-3 py-1.5 font-mono text-[13px] font-bold uppercase tracking-wider ${showLog ? "hud-btn-on" : "text-ef-muted"}`} title="데미지·전투 기록">기록 {showLog ? "▴" : "▾"}</button>
          {!winner && <button type="button" onClick={cycleSpeed} className="hud-btn dd-cut px-3 py-1.5 font-mono text-[13px] font-bold uppercase tracking-wider text-ef-muted" title="재생 속도">{speed}배속</button>}
          {!winner && <button type="button" onClick={toggleAuto} className={`hud-btn dd-cut px-3.5 py-1.5 font-mono text-[13px] font-bold uppercase tracking-wider ${auto ? "hud-btn-on" : "text-ef-muted"}`}>{auto ? "자동 ON" : "수동"}</button>}
        </div>
      </div>

      {/* 데미지·전투 기록 — 상단 드롭다운(기본 접힘) */}
      {showLog && (() => {
        const dmgList = allies.map((a) => ({ id: a.id, name: OPERATORS.find((o) => o.id === a.id)?.name ?? a.id, dmg: Math.round(dmgRef.current[a.id] ?? 0), el: unitElement(a) })).sort((x, y) => y.dmg - x.dmg);
        const dmgMax = Math.max(1, ...dmgList.map((d) => d.dmg));
        const dmgTotal = Math.max(1, dmgList.reduce((sum, d) => sum + d.dmg, 0));
        return (
          <div className="absolute right-3 top-[62px] z-40 w-[440px] max-w-[calc(100%-1.5rem)] sm:right-5">
            <div className="hud-panel dd-cut shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-ef-line px-2.5 py-1.5">
                {(["dmg", "log"] as const).map((k) => <button key={k} type="button" onClick={() => setTab(k)} className={`dd-cut px-2.5 py-1 font-mono text-[12px] font-bold uppercase tracking-wider transition ${tab === k ? "border border-ef-accent/70 bg-ef-accent/15 text-ef-accent" : "border border-ef-line text-ef-muted hover:text-ef-ink"}`}>{k === "dmg" ? "데미지 기록" : "전투 기록"}</button>)}
                <button type="button" onClick={() => setShowLog(false)} className="ml-auto border border-ef-line px-2 py-1 font-mono text-[12px] font-bold text-ef-muted transition hover:border-ef-accent/60 hover:text-white">✕ 닫기</button>
              </div>
              {tab === "dmg" && (
                <div className="flex flex-col gap-2 px-3 py-3">
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
              {tab === "log" && (
                <div className="flex max-h-[42vh] flex-col-reverse gap-0.5 overflow-y-auto px-3 py-2 font-mono text-[13px] leading-relaxed">
                  {[...s.log].slice(-160).reverse().map((line, i) => (
                    <div key={s.log.length - i} className={line.startsWith("──") ? "mt-1 font-bold text-ef-accent" : line.includes("불균형 상태") || line.includes("승리") ? "text-yellow-300" : line.includes("→") && !line.startsWith("  ") ? "text-white" : line.includes("✗") ? "text-red-300" : "text-ef-muted"}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
      <div className="hud-stage relative flex min-h-[56vh] flex-col justify-center gap-2 overflow-hidden border border-ef-line px-3 py-6 sm:px-6" style={{ ...CUT_SM, boxShadow: "inset 0 0 80px -20px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
        {/* ===== 적진 (스테이지 상단, 서 있는 피규어) ===== */}
        <div className="mb-1 flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-red-300/70"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/25" />적 {enemies.filter((e) => e.hp > 0).length}/{enemies.length}<span className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/25" /></div>
        <div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-2">
          {enemies.map((e) => {
            const ed = enemyDefFor(e.id);
            const el = ed?.element ?? "physical";
            const dead = e.hp <= 0;
            const hit = fx.floaters.some((f) => f.id === e.id && f.amt < 0);
            const isAct = fx.activeId === e.id;
            const weak = ed?.resist ? (Object.entries(ed.resist) as [Element | "physical", number][]).filter(([, v]) => v < 0) : [];
            return (
              <div key={e.id} className={`group relative flex w-[150px] flex-col items-center ${shakeCls(hit, fx.tick)} ${actCls(isAct, fx.tick)}`}>
                <FxLayer id={e.id} fx={fx} />
                {aiming && !dead && <span className="absolute -top-1 z-20 font-mono text-[11px] font-bold text-ef-accent" style={{ textShadow: "0 0 6px #000" }}>🎯 대상</span>}
                {/* 아트(접지 그림자·선택 링) */}
                <div onClick={aiming && !dead ? () => playerAct(aiming, e.id) : () => setInspectId(e.id)} className="relative flex h-32 w-full cursor-pointer items-end justify-center">
                  <span className="pointer-events-none absolute bottom-1 h-2.5 w-24 rounded-[50%]" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.6), transparent)" }} />
                  {isAct && !dead && <span className="pointer-events-none absolute bottom-0 h-6 w-28 rounded-[50%]" style={{ background: `radial-gradient(50% 50% at 50% 50%, ${elementColor[el]}66, transparent 70%)` }} />}
                  <img src={enemyImage(e.id)} alt="" loading="lazy" className={`relative max-h-full w-auto object-contain transition group-hover:scale-[1.03] ${dead ? "opacity-30 grayscale" : ""}`} style={{ filter: dead ? undefined : aiming ? "drop-shadow(0 3px 10px rgba(255,154,47,0.7))" : e.staggered ? "drop-shadow(0 3px 10px rgba(250,204,21,0.6))" : "drop-shadow(0 6px 12px rgba(0,0,0,0.6))" }} onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
                  {dead && <span className="absolute text-4xl">💀</span>}
                </div>
                {/* 정보 */}
                <div className="w-full">
                  <div className="flex items-center justify-between gap-1"><span className="flex min-w-0 items-center gap-1"><span className="h-1.5 w-1.5 shrink-0" style={{ background: elementColor[el] }} /><span className="truncate font-mono text-[13px] font-bold text-white" style={{ textShadow: "0 1px 3px #000" }}>{e.name}</span></span><span className="font-mono text-[11px] text-ef-muted">{Math.max(0, e.hp)}</span></div>
                  <Bar value={e.hp} max={e.maxHp} color="#e0655c" />
                  {e.staggerMax > 0 && !dead && <div className="mt-0.5"><Bar value={e.staggered ? e.staggerMax : e.stagger} max={e.staggerMax} color={e.staggered ? "#facc15" : "#a16207"} h="h-1" /></div>}
                  {!dead && <div className="mt-0.5"><Bar value={e.atb} max={100} color="#67e8f9" h="h-1" /></div>}
                  {!dead && <div className="mt-1 flex flex-wrap justify-center gap-1">
                    {e.staggered && <Chip tone="#facc15">⚡ 불균형</Chip>}
                    {weak.map(([eln, v]) => <Chip key={eln} tone={elementColor[eln]}>{elementName[eln]}약점{Math.round(-v * 100)}</Chip>)}
                    {unitChips(e).map((c) => <Chip key={c.k} tone={c.tone}>{c.label}</Chip>)}
                  </div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 교전선 */}
        <div className="my-3 flex items-center justify-center gap-3"><span className="hud-horizon w-1/3" /><span className="font-mono text-[11px] uppercase tracking-[0.45em] text-ef-accent/70">교전</span><span className="hud-horizon w-1/3" /></div>

        {/* ===== 아군진 (스테이지 하단, 전신 피규어) ===== */}
        <div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-3">
          {allies.map((a) => {
            const op = OPERATORS.find((o) => o.id === a.id);
            const el = op?.element ?? "physical";
            const dead = a.hp <= 0;
            const lowHp = a.hp / a.maxHp < 0.35;
            const hit = fx.floaters.some((f) => f.id === a.id && f.amt < 0);
            const isAct = fx.activeId === a.id;
            const isCur = current?.id === a.id;
            const sets = activeSets(party.find((p) => p.id === a.id)?.loadout ?? {});
            const ready = a.ultCharge >= a.ultCost;
            return (
              <div key={a.id} className={`group relative flex w-[176px] flex-col items-center ${shakeCls(hit, fx.tick)} ${actCls(isAct, fx.tick)}`}>
                <FxLayer id={a.id} fx={fx} />
                {/* 전신 아트 */}
                <div onClick={() => setInspectId(a.id)} className="relative flex h-52 w-full cursor-pointer items-end justify-center">
                  <span className="pointer-events-none absolute bottom-1 h-3 w-28 rounded-[50%]" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.6), transparent)" }} />
                  {isCur && !dead && <span className="pointer-events-none absolute bottom-0 h-7 w-32 rounded-[50%]" style={{ background: `radial-gradient(50% 50% at 50% 50%, ${elementColor[el]}88, transparent 70%)` }} />}
                  <img src={fullUrl(a.id)} alt="" loading="lazy" className={`relative max-h-full w-auto object-contain transition group-hover:brightness-110 ${dead ? "opacity-35 grayscale" : ""}`} style={{ filter: dead ? undefined : isCur ? "drop-shadow(0 6px 16px rgba(255,190,107,0.55))" : "drop-shadow(0 8px 16px rgba(0,0,0,0.6))" }} onError={(ev) => { (ev.currentTarget as HTMLImageElement).src = avatarUrl(a.id); }} />
                  {dead && <span className="absolute inset-0 flex items-center justify-center text-5xl">💀</span>}
                  {isCur && !dead && <span className="absolute -top-1 z-10 font-mono text-[12px] font-black uppercase tracking-wider text-ef-accent" style={{ textShadow: "0 0 8px #000, 0 0 4px #000" }}>▶ 행동</span>}
                </div>
                {/* 정보 패널 — 라벨 정렬·값 오버레이로 깔끔하게 */}
                <div className="hud-tile dd-cut w-full px-2.5 py-2" style={isCur ? { borderColor: `${PRIMARY}aa`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 -5px 16px -9px ${PRIMARY}` } : undefined}>
                  {/* 헤더 */}
                  {/* 이름 + HP 수치(바 없음 — 체력·속도는 순서 레일에서 확인) */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 shrink-0" style={{ background: elementColor[el], boxShadow: `0 0 5px ${elementColor[el]}`, clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }} />
                    <span className="truncate font-mono text-[13px] font-bold text-white">{a.name}</span>
                    <span className="ml-auto shrink-0 font-mono text-[11px] font-bold tabular-nums" style={{ color: lowHp ? "#f0776e" : "#cfe8b0" }}>{Math.max(0, a.hp)}<span className="text-ef-muted">/{a.maxHp}</span></span>
                  </div>
                  {/* 궁 바(유지) */}
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`shrink-0 font-mono text-[9px] font-bold uppercase ${ready ? "text-amber-300" : "text-ef-muted"}`}>궁</span>
                    <div className="relative flex-1" style={ready ? { filter: "drop-shadow(0 0 4px #f5c54299)" } : undefined}>
                      <Bar value={a.ultCharge} max={a.ultCost} color={ready ? "#f5c542" : "#7a611c"} h="h-2.5" />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold leading-none" style={{ color: ready ? "#1a1206" : "#e5c98a", textShadow: ready ? "none" : "0 1px 2px #000" }}>{ready ? "⚡ READY" : `${Math.round(a.ultCharge)}/${a.ultCost}`}</span>
                    </div>
                  </div>
                  {/* 보호막 · 상태(세트 제외) */}
                  {(a.shield > 0 || unitChips(a).length > 0) && <div className="mt-1.5 flex flex-wrap gap-1">
                    {a.shield > 0 && <Chip tone="#38bdf8">🛡 {a.shield}</Chip>}
                    {unitChips(a).map((c) => <Chip key={c.k} tone={c.tone}>{c.label}</Chip>)}
                  </div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 수동 조작 — 스킬 선택 */}
      {!winner && current && !auto && (
        <div className="hud-panel dd-cut mt-3 p-3" style={{ borderColor: "rgba(255,154,47,0.4)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 -8px 30px -20px rgba(255,154,47,0.4)" }}>
          <div className="flex gap-3">
          {/* 행동 오퍼레이터 아트(에픽세븐식) */}
          <div className="relative hidden w-24 shrink-0 self-stretch overflow-hidden border sm:block" style={{ ...CUT_SM, minHeight: 156, borderColor: `${elementColor[unitElement(current)]}99`, background: `radial-gradient(80% 55% at 50% 12%, ${elementColor[unitElement(current)]}33, transparent 65%), #0d0906` }}>
            <img src={fullUrl(current.id)} alt="" className="absolute inset-0 h-full w-full object-cover object-top" onError={(ev) => { (ev.currentTarget as HTMLImageElement).src = avatarUrl(current!.id); }} />
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/85 to-transparent px-1 py-1 text-center font-mono text-[10px] font-black uppercase tracking-wider text-ef-accent" style={{ textShadow: "0 0 6px #000" }}>▶ 행동</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-1 pb-2 pt-3 text-center font-mono text-[12px] font-bold text-white" style={{ textShadow: "0 1px 3px #000" }}>{current.name}</div>
            <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: elementColor[unitElement(current)] }} />
          </div>
          {/* 스킬 영역 */}
          <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 font-mono text-[13px] font-bold uppercase tracking-wider text-ef-accent">
            {aiming ? <><span className="text-ef-accent-soft">🎯 {aiming.name} — 공격할 적을 선택</span><button type="button" onClick={() => setAiming(null)} className="ml-auto border border-ef-line px-2 py-0.5 text-[12px] text-ef-muted hover:text-white">취소</button></> : <span>{current.name} — 스킬 선택</span>}
          </div>
          <div className={`flex flex-wrap gap-2 ${aiming ? "pointer-events-none opacity-40" : ""}`}>
            {skills.map((sk) => {
              const dmg = sk.power > 0 && current ? Math.round(current.attack * (1 + (current.atkBuff || 0)) * (current.weakenMul ?? 1) * sk.power) : 0;
              const el = sk.element ?? "physical";
              const open = detailId === sk.id;
              const reason = current ? skillReason(s, current, sk) : null;
              const off = !!reason;
              return (
              <button key={sk.id} type="button" onClick={() => { if (!off) chooseSkill(sk); }} className={`hud-tile dd-cut group relative flex w-[236px] items-start gap-2 px-2.5 py-2 pr-8 text-left ${off ? "cursor-not-allowed opacity-55 hover:!border-ef-line/40" : open ? "!border-ef-accent" : ""}`}>
                <img src={skillIcon(current!.id, sk.kind)} alt="" loading="lazy" className={`mt-0.5 h-9 w-9 shrink-0 border border-ef-line/60 bg-black/40 object-contain p-0.5 ${off ? "opacity-40 grayscale" : ""}`} onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5"><span className="border px-1 py-px font-mono text-[11px] font-bold uppercase" style={{ borderColor: `${PRIMARY}66`, color: off ? "#7a6a4a" : PRIMARY }}>{kindLabel[sk.kind]}</span><span className={`truncate font-mono text-sm font-bold ${off ? "text-ef-muted" : "text-white"}`}>{sk.name}</span></span>
                  <span className="mt-1 flex items-center gap-2">
                    {off ? <span className="font-mono text-[12px] font-bold text-red-400/90">🔒 {reason}</span>
                      : dmg > 0 ? <span className="font-mono text-[15px] font-bold tabular-nums" style={{ color: elementColor[el] }}>{dmg.toLocaleString()}<span className="ml-0.5 text-[11px] font-normal text-ef-muted">피해</span></span>
                      : <span className="font-mono text-[12px] text-ef-muted">{sk.target === "self" ? "버프/유틸" : "유틸"}</span>}
                    <span className="font-mono text-[11px] text-ef-muted">{targetLabel[sk.target]}</span>
                  </span>
                </span>
                <span onClick={(ev) => { ev.stopPropagation(); setDetailId(open ? null : sk.id); }} className={`absolute right-1 top-1 flex h-5 w-5 items-center justify-center border font-mono text-[12px] font-bold transition ${open ? "border-ef-accent bg-ef-accent/20 text-ef-accent" : "border-ef-line text-ef-muted hover:border-ef-accent/60 hover:text-ef-accent"}`} title="상세">{open ? "×" : "ⓘ"}</span>
              </button>
            ); })}
            {!skills.length && <span className="font-mono text-xs text-ef-muted">사용 가능한 스킬 없음</span>}
          </div>
          {/* 스킬 상세 */}
          {(() => {
            const sk = skills.find((x) => x.id === detailId);
            if (!sk || !current) return null;
            const el = sk.element ?? "physical";
            const dmg = sk.power > 0 ? Math.round(current.attack * (1 + (current.atkBuff || 0)) * (current.weakenMul ?? 1) * sk.power) : 0;
            const Row = ({ k, v, tone }: { k: string; v: string; tone?: string }) => <div className="flex items-baseline gap-1.5"><span className="w-14 shrink-0 font-mono text-[11px] uppercase tracking-wider text-ef-muted">{k}</span><span className="font-mono text-[13px] font-bold" style={{ color: tone ?? "#e6e1d6" }}>{v}</span></div>;
            return (
              <div className="mt-2 border border-ef-accent/40 bg-black/40 p-3" style={CUT_SM}>
                <div className="mb-2 flex items-center gap-2"><span className="border px-1 py-px font-mono text-[11px] font-bold uppercase" style={{ borderColor: `${PRIMARY}66`, color: PRIMARY }}>{kindLabel[sk.kind]}</span><span className="font-mono text-sm font-bold text-white">{sk.name}</span><button type="button" onClick={() => setDetailId(null)} className="ml-auto border border-ef-line px-1.5 py-0.5 font-mono text-[12px] text-ef-muted hover:border-ef-accent/60 hover:text-white">✕</button></div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
                  {dmg > 0 ? <Row k="예상 피해" v={`${dmg.toLocaleString()} (배율 ${Math.round(sk.power * 100)}%)`} tone={elementColor[el]} /> : <Row k="유형" v="버프 / 유틸" />}
                  <Row k="대상" v={targetLabel[sk.target]} />
                  <Row k="속성" v={elementName[el]} tone={elementColor[el]} />
                  {(sk.staggerVal ?? 0) > 0 && <Row k="불균형" v={`+${sk.staggerVal}`} tone="#facc15" />}
                  {sk.kind === "link" && <Row k="쿨타임" v={`${sk.cooldown ?? 3}턴`} />}
                  {sk.requiresText && <Row k="발동 조건" v={sk.requiresText} tone="#fca5a5" />}
                </div>
                {sk.note && <div className="mt-2 border-t border-ef-line/50 pt-2 font-mono text-[13px] leading-relaxed text-ef-muted">{sk.note}</div>}
              </div>
            );
          })()}
          </div>{/* /스킬 영역 */}
          </div>{/* /flex 행 */}
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
                      <div className="mt-0.5 max-w-[220px] truncate text-[12px] text-ef-muted group-hover:text-ef-ink">{it.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}


      {/* 유닛 조회 패널 */}
      {inspectId && (() => {
        const u = s.units.find((x) => x.id === inspectId);
        if (!u) return null;
        const ally = u.side === "ally";
        const op = ally ? OPERATORS.find((o) => o.id === u.id) : null;
        const ed = ally ? null : enemyDefFor(u.id);
        const el = unitElement(u);
        const talents = ally ? OP_TALENTS[u.id] ?? [] : [];
        const uskills = ally ? [
          ...(OP_BASIC[u.id] ? [{ id: `${u.id}-basic`, name: OP_BASIC[u.id].name, kind: "attack" as const, note: OP_BASIC[u.id].note, power: 0.5, target: "single-front", element: unitElement(u) }] : []),
          ...(SKILLS[u.id] ?? []).map((s) => ({ id: s.id, name: s.name, kind: s.kind, note: s.note, power: s.power, target: s.target, element: s.element ?? "physical" })),
        ] : [];
        const loadout = ally ? party.find((p) => p.id === u.id)?.loadout ?? {} : {};
        const ownedMap = owned ?? {};
        const craftedSlot = (slot: string) => { const ref = (loadout as Record<string, string>)[slot]; return !!(ref && ownedMap[ref] != null); }; // 공업소에서 제작(장착)된 슬롯만
        const equipped = Object.fromEntries(Object.entries(loadout).filter(([slot]) => craftedSlot(slot)));
        const sets = ally ? activeSets(equipped as never) : []; // 실제 장착(제작)된 피스로만 세트 발동
        const pieces = ally ? loadoutPieces(loadout) : [];
        const wId = ally ? weaponOf(u.id) : null;
        const RES_ELEMS: (Element | "physical")[] = ["physical", "heat", "electric", "cryo", "nature"];
        const hpR = u.maxHp > 0 ? u.hp / u.maxHp : 0;
        const hpTone = hpR > 0.5 ? "#7cc04a" : hpR > 0.25 ? "#f0b429" : "#e5484d";
        const close = () => setInspectId(null);
        const hide = (ev: React.SyntheticEvent<HTMLImageElement>) => { (ev.currentTarget as HTMLImageElement).style.visibility = "hidden"; };
        const St = ({ label, value }: { label: string; value: string | number }) => (
          <div className="bg-[#120c07] px-2 py-1.5 text-center"><div className="font-mono text-[10px] uppercase tracking-wider text-ef-muted">{label}</div><div className="mt-0.5 font-mono text-[14px] font-bold text-ef-ink">{value}</div></div>
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
              {/* 체력 바 + 핵심 스탯 */}
              <div className="border-b border-ef-line px-3 py-2.5">
                <div className="mb-1 flex items-baseline justify-between font-mono">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ef-muted">체력</span>
                  <span className="text-[13px] font-bold text-ef-ink">{Math.max(0, u.hp).toLocaleString()} <span className="text-[11px] font-normal text-ef-muted">/ {u.maxHp.toLocaleString()}</span>{u.shield > 0 && <span className="ml-1.5 text-[12px] text-sky-300">🛡 {u.shield}</span>}</span>
                </div>
                <div className="relative mb-2.5 h-2.5 overflow-hidden rounded-[2px] bg-black/70" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-[2px] transition-all" style={{ width: `${Math.max(0, Math.min(100, hpR * 100))}%`, background: hpTone, boxShadow: `0 0 8px ${hpTone}99` }} />
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <St label="공격" value={u.attack} />
                  <St label="방어" value={u.defense} />
                  <St label="속도" value={Math.max(1, u.speed + (u.speedMod || 0))} />
                  {ally ? <St label="치명" value={`${Math.round(u.critRate * 100)}%`} /> : <St label="불균형" value={`${Math.round(u.stagger)}/${u.staggerMax}`} />}
                </div>
                {ally && u.attrs && (
                  <div className="mt-1.5 flex flex-wrap justify-between gap-x-2 gap-y-0.5 font-mono text-[11px]">
                    {([["힘", u.attrs.str], ["민첩", u.attrs.agi], ["지능", u.attrs.int], ["의지", u.attrs.wil]] as [string, number][]).map(([k, v]) => <span key={k} className="text-ef-muted">{k} <b className="text-ef-ink">{v}</b></span>)}
                  </div>
                )}
              </div>
              {/* 속성 저항 — 0%=약점(풀 피해) 초록 강조, 고저항 붉게 */}
              <div className="border-b border-ef-line px-3 py-2.5">
                <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[12px] font-bold uppercase tracking-wider text-ef-accent/70">속성 저항{!ally && <span className="font-normal normal-case tracking-normal text-ef-muted">· 초록=약점</span>}</div>
                <div className="grid grid-cols-5 gap-1">
                  {RES_ELEMS.map((e) => { const r = u.resist[e] ?? 0; const weak = r <= 0.001; const strong = r >= 0.5; return (
                    <div key={e} className="flex flex-col items-center gap-0.5 border py-1" style={{ borderColor: weak ? "#7cc04a66" : strong ? "#f8717155" : "#ffffff12", background: weak ? "#7cc04a15" : "transparent" }}>
                      <span className="h-2 w-2" style={{ background: elementColor[e], boxShadow: `0 0 5px ${elementColor[e]}` }} />
                      <span className="font-mono text-[10px] text-ef-muted">{elementName[e]}</span>
                      <span className="font-mono text-[11px] font-bold" style={{ color: weak ? "#8fd36a" : strong ? "#f87171" : "#c8c8cc" }}>{weak ? "약점" : `${Math.round(r * 100)}%`}</span>
                    </div>
                  ); })}
                </div>
              </div>
              {/* 상태 효과(버프/디버프) — 방향 분류 + 잔여 턴 + 출처(누가·무엇으로) */}
              {(() => {
                const all = [...(u.shield > 0 ? [{ k: "shield", label: `🛡 보호막 ${u.shield}`, tone: "#38bdf8", dir: 1, turns: u.timers?.shield, src: (u.effectSrc as Record<string, EffSrc>)?.shield } as StatusChip] : []), ...unitChips(u)];
                const chipRow = (c: StatusChip) => (
                  <div key={c.k} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <Chip tone={c.tone}>{c.label}{c.turns ? <span className="ml-1 opacity-75">· {c.turns}턴</span> : null}</Chip>
                    {c.src && <span className="font-mono text-[11px] text-ef-muted">← {c.src.by} · <span className="text-ef-ink/70">{c.src.via}</span> <span className="opacity-60">({SRC_KIND_KO[c.src.kind] ?? c.src.kind})</span></span>}
                  </div>
                );
                const group = (label: string, tone: string, dir: (n: number) => boolean) => {
                  const list = all.filter((c) => dir(c.dir));
                  if (!list.length) return null;
                  return <div><div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: tone }}>{label}</div><div className="space-y-1">{list.map(chipRow)}</div></div>;
                };
                return (
                  <Sec title="상태 효과">
                    {all.length ? (
                      <div className="space-y-2.5">
                        {group("버프", "#86efac", (n) => n > 0)}
                        {group("디버프", "#f87171", (n) => n < 0)}
                        {group("상태", "#a1a1aa", (n) => n === 0)}
                      </div>
                    ) : <span className="font-mono text-[13px] text-ef-muted">활성 효과 없음</span>}
                  </Sec>
                );
              })()}
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
                <Sec title="장비">
                  {/* 슬롯별 목표 피스 — 공업소 제작(장착)된 것만 활성, 미제작은 목표(회색) 표시 */}
                  <div className="mb-2 space-y-1.5">
                    {pieces.map((p) => { const named = p.set && p.set !== "?"; const empty = p.name === "없음"; const crafted = craftedSlot(p.slot); const on = crafted && named && sets.includes(p.set); return (
                      <div key={p.slot} className={`flex items-center gap-2 ${!crafted && !empty ? "opacity-45" : ""}`}>
                        <span className="w-9 shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-ef-muted">{p.slotName}</span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-ef-line/60 bg-black/40" style={{ boxShadow: on ? "inset 0 0 0 1px #e8c56a55" : undefined }}>
                          {p.image ? <img src={p.image} alt="" loading="lazy" className={`h-full w-full object-contain ${!crafted && !empty ? "grayscale" : ""}`} onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} /> : <span className="font-mono text-[10px] text-ef-muted">—</span>}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-mono text-[13px] font-bold text-ef-ink" title={p.name}>{p.name}</div>
                          {empty ? <div className="font-mono text-[10px] text-ef-muted">미장착</div>
                            : crafted ? <div className="font-mono text-[10px] text-ef-muted">능력치 <b className="text-ef-ink/80">+{p.grade}</b> · 방어 <b className="text-ef-ink/80">+{p.def}</b>{p.dmg ? <> · <span className="text-ef-accent-soft">{pieceDmgText(p.dmg)}</span></> : null}</div>
                            : <div className="font-mono text-[10px] text-amber-500/80">미제작 — 공업소에서 제작 필요 (능력치 미적용)</div>}
                        </div>
                        <span className="shrink-0 font-mono text-[10px]" style={{ color: empty ? "#8a8a92" : !crafted ? "#d99a3a" : on ? "#e8c56a" : named ? "#8a8a92" : "#67e8f9aa" }}>{empty ? "" : !crafted ? "미제작" : named ? `${on ? "◆" : "◇"} ${p.set}` : "자유"}</span>
                      </div>
                    ); })}
                  </div>
                  {/* 활성 세트 효과 — 제작된 피스 기준 */}
                  <div className="border-t border-ef-line/40 pt-2">
                    {sets.length ? sets.map((n) => <div key={n} className="mb-1.5 last:mb-0"><span className="font-mono text-[14px] font-bold text-[#e8c56a]">◆ {n} <span className="text-[12px] font-normal text-ef-muted">2부위</span></span><div className="mt-0.5 font-mono text-[13px] leading-relaxed text-ef-muted">{setEffectText(n)}</div></div>) : <div className="font-mono text-[13px] text-ef-muted">활성 세트 없음 — 공업소에서 같은 세트 2부위 제작 필요</div>}
                  </div>
                </Sec>
                <Sec title="스킬">
                  {[...uskills].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]).map((sk) => <div key={sk.id} className="mb-2.5 flex items-start gap-2.5 last:mb-0">
                    <img src={skillIcon(u.id, sk.kind)} alt="" className="h-9 w-9 shrink-0 border border-ef-line object-cover" onError={hide} />
                    <div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-1.5"><span className="font-mono text-[14px] font-bold text-white">{sk.name}</span><span className="font-mono text-[11px] uppercase text-ef-accent/70">{kindLabel[sk.kind]}</span>{sk.power > 0 && <span className="font-mono text-[11px]" style={{ color: elementColor[sk.element as Element | "physical"] ?? "#e8c56a" }}>배율 {Math.round(sk.power * 100)}% · {targetLabel[sk.target as DDSkill["target"]]} · ~{Math.round(u.attack * (1 + (u.atkBuff || 0)) * (u.weakenMul ?? 1) * sk.power).toLocaleString()}</span>}</div>{sk.note && <div className="mt-0.5 font-mono text-[13px] leading-relaxed text-ef-muted">{sk.note}</div>}</div>
                  </div>)}
                </Sec>
                {talents.length > 0 && <Sec title="재능">
                  {talents.map((t, i) => <div key={i} className="mb-2.5 flex items-start gap-2.5 last:mb-0">
                    {t.icon && <img src={t.icon} alt="" className="h-9 w-9 shrink-0 border border-ef-line object-cover" onError={hide} />}
                    <div className="min-w-0"><div className="font-mono text-[14px] font-bold text-white">{t.name}</div><div className="mt-0.5 font-mono text-[13px] leading-relaxed text-ef-muted">{t.desc}</div></div>
                  </div>)}
                </Sec>}
              </>}
              {ed && <Sec title="행동 유형"><div className="font-mono text-[13px] text-ef-muted">{behaviorLabel[ed.behavior] ?? ed.behavior}</div><div className="mt-1 font-mono text-[12px] text-ef-accent-soft">🎯 {targetDesc[enemyArchetype(ed.role, ed.behavior).tgt]}</div></Sec>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
