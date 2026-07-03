"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import { act, canAct, isOver, startRound, turnOrder, type DDClass, type DDSkill, type DDState, type DDUnit, type Element } from "../combat";
import { OPERATORS, enemyDefFor } from "../roster";
import { ENCOUNTERS, allyChoose, createBattle, enemyAct, usableSkills, regionEncounter } from "../sim";
import { activeSets } from "../gear";
import { ITEMS, useItem as applyItem, canUseItem, condText, itemColor } from "../items";
import type { BattleResult, NodeKind, PartyMember } from "../run";

const PRIMARY = "#c9822c";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const elementName: Record<"physical" | Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const classLabel: Record<DDClass, string> = { guard: "가드", caster: "캐스터", striker: "스트라이커", vanguard: "뱅가드", defender: "디펜더", supporter: "서포터" };
const kindLabel: Record<DDSkill["kind"], string> = { attack: "기본", battle: "배틀", link: "연계", ult: "궁극" };
const statusLabel: Record<string, string> = { stun: "기절", combustion: "연소", corrosion: "부식", crystal: "결정", "armor-break": "갑옷파괴", shock: "감전", wing: "날개" };
const nodeTitle: Record<NodeKind, string> = { battle: "교전", elite: "정예 교전", boss: "보스 교전", rest: "야영" };

function Bar({ value, max, color, h = "h-2" }: { value: number; max: number; color: string; h?: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return <div className={`${h} w-full overflow-hidden border border-ef-line bg-black/60`}><div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} /></div>;
}
function Chip({ children, tone = "#a1a1aa" }: { children: React.ReactNode; tone?: string }) {
  return <span className="border px-1 py-px font-mono text-[9px] font-bold uppercase tracking-wider" style={{ borderColor: `${tone}55`, color: tone }}>{children}</span>;
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

export default function BattleView({ party, encounterKey, nodeKind, faction, depth = 0, maxDepth = 6, owned, items, onUseItem, onEnd }: { party: PartyMember[]; encounterKey: string; nodeKind: NodeKind; faction?: string; depth?: number; maxDepth?: number; owned?: Record<string, number>; items: Record<string, number>; onUseItem: (id: string) => void; onEnd: (result: "ally" | "enemy", survivors: BattleResult[]) => void }) {
  const stateRef = useRef<DDState | null>(null);
  if (!stateRef.current) {
    const base = ENCOUNTERS.find((e) => e.key === encounterKey) ?? ENCOUNTERS[0];
    const enc = faction ? { ...base, make: () => regionEncounter(faction, nodeKind, depth, maxDepth) } : base; // 세력 리전 편성(깊이별 티어)
    stateRef.current = createBattle(party, enc, owned); // 지속 HP + 장비 세트 효과 + 제작 단조 반영
  }
  const queueRef = useRef<DDUnit[]>([]);
  const autoRef = useRef(false);
  const [auto, setAuto] = useState(false);
  const [current, setCurrent] = useState<DDUnit | null>(null);
  const [winner, setWinner] = useState<"ally" | "enemy" | null>(null);
  const [, bump] = useReducer((x) => x + 1, 0);

  function advance() {
    const s = stateRef.current!;
    let guard = 0;
    while (guard++ < 800) {
      const over = isOver(s);
      if (over) { setWinner(over); setCurrent(null); bump(); return; }
      if (!queueRef.current.length) {
        if (s.round >= 40) { setWinner("enemy"); setCurrent(null); bump(); return; }
        startRound(s); s.log.push(`── 라운드 ${s.round} ──`); queueRef.current = turnOrder(s);
      }
      const u = queueRef.current[0];
      if (u.hp <= 0) { queueRef.current.shift(); continue; }
      if (!canAct(u)) {
        if (u.staggered) s.log.push(`${u.name} 불균형 — 행동 불가`);
        else if ((u.timers.stun || 0) > 0) s.log.push(`${u.name} 시간 정지 — 행동 불가`);
        queueRef.current.shift(); continue;
      }
      if (u.side === "enemy") { enemyAct(s, u); queueRef.current.shift(); continue; }
      if (autoRef.current) { const sk = allyChoose(s, u); if (sk) act(s, u, sk); else s.log.push(`${u.name} 행동 불가(스킬 없음)`); queueRef.current.shift(); continue; }
      setCurrent(u); bump(); return;
    }
    bump();
  }
  // 최초 진행은 마운트 후(렌더 중 setState 방지)
  useEffect(() => { advance(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  function playerAct(sk: DDSkill) { const s = stateRef.current!; if (!current) return; act(s, current, sk); queueRef.current.shift(); setCurrent(null); advance(); }
  function playerUseItem(id: string) { const s = stateRef.current!; if (!current || !items[id] || !canUseItem(s, id)) return; applyItem(s, id, current); onUseItem(id); bump(); } // 아이템=자유 행동(턴 유지). HP 조건 충족 시만
  function toggleAuto() { const n = !autoRef.current; autoRef.current = n; setAuto(n); if (n && current) { setCurrent(null); advance(); } }

  const s = stateRef.current!;
  const allies = s.units.filter((u) => u.side === "ally");
  const enemies = s.units.filter((u) => u.side === "enemy");
  const skills = current ? usableSkills(s, current) : [];

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="border px-3 py-1.5 font-mono text-sm font-bold" style={{ ...CUT_SM, borderColor: nodeKind === "boss" ? "#f8717166" : "#2a2a2a", color: nodeKind === "boss" ? "#f87171" : "#fff", background: "#141414" }}>{nodeTitle[nodeKind]} · 라운드 {s.round}</span>
        <div className="min-w-[180px] flex-1">
          <div className="mb-0.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-ef-muted"><span>스킬 게이지(공유)</span><span>{Math.round(s.skillGauge)}/{s.maxGauge}</span></div>
          <Bar value={s.skillGauge} max={s.maxGauge} color={PRIMARY} />
        </div>
        {!winner && <button type="button" onClick={toggleAuto} className={`border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition ${auto ? "border-ef-accent/60 bg-ef-accent/15 text-ef-accent" : "border-ef-line bg-ef-card text-ef-muted hover:text-white"}`} style={CUT_SM}>자동 {auto ? "ON" : "OFF"}</button>}
      </div>

      {winner && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border px-4 py-3" style={{ ...CUT_SM, borderColor: winner === "ally" ? "#86efac66" : "#f8717166", background: winner === "ally" ? "#86efac12" : "#f8717112" }}>
          <span className="font-mono text-lg font-black uppercase tracking-[0.2em]" style={{ color: winner === "ally" ? "#86efac" : "#f87171" }}>{winner === "ally" ? (nodeKind === "boss" ? "🏆 던전 클리어" : "✔ 교전 승리") : "💀 부대 전멸"}</span>
          <button type="button" onClick={() => onEnd(winner, allies.map((a) => ({ id: a.id, hp: a.hp })))} className="border border-ef-line px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider text-white transition hover:border-ef-accent/50" style={{ ...CUT_SM, background: PRIMARY, color: "#0a0a0a" }}>계속 →</button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div>
            <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-red-300/70">적 {enemies.filter((e) => e.hp > 0).length}/{enemies.length}</div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {enemies.map((e) => {
                const ed = enemyDefFor(e.id);
                return (
                <div key={e.id} className={`border p-2.5 transition ${e.hp <= 0 ? "border-ef-line/40 opacity-40" : e.staggered ? "border-yellow-400/60 bg-yellow-400/5" : "border-red-400/30 bg-ef-card"}`} style={CUT_SM}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      {ed && <span className="h-2 w-2 shrink-0" style={{ background: elementColor[ed.element] }} />}
                      <span className="truncate font-mono text-sm font-bold text-white">{e.name}</span>
                    </span>
                    <span className="font-mono text-[10px] text-ef-muted">{e.hp}/{e.maxHp}</span>
                  </div>
                  {ed && <div className="mb-1 flex items-center gap-1"><Chip tone="#f87171">{ed.faction}</Chip><Chip tone="#a1a1aa">{ed.role}</Chip></div>}
                  {ed?.resist && Object.values(ed.resist).some((v) => v) && (
                    <div className="mb-1 flex flex-wrap gap-1">
                      {(Object.entries(ed.resist) as [Element | "physical", number][]).filter(([, v]) => v).map(([el, v]) => (
                        <span key={el} className="border px-1 py-px font-mono text-[9px] font-bold" style={{ borderColor: `${elementColor[el]}66`, color: v > 0 ? elementColor[el] : "#fca5a5" }}>{elementName[el]} {v > 0 ? `저항${Math.round(v * 100)}` : `약점${Math.round(-v * 100)}`}</span>
                      ))}
                    </div>
                  )}
                  <Bar value={e.hp} max={e.maxHp} color="#f87171" />
                  {e.staggerMax > 0 && <div className="mt-1"><Bar value={e.staggered ? e.staggerMax : e.stagger} max={e.staggerMax} color={e.staggered ? "#facc15" : "#a16207"} h="h-1" /></div>}
                  {e.staggered && <div className="mt-1 font-mono text-[9px] font-bold uppercase tracking-wider text-yellow-400">⚡ 불균형 (+30% 받는 피해)</div>}
                  <div className="mt-1.5 flex flex-wrap gap-1">{unitChips(e).map((c) => <Chip key={c.k} tone={c.tone}>{c.label}</Chip>)}</div>
                </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">아군</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {allies.map((a) => {
                const op = OPERATORS.find((o) => o.id === a.id);
                const isCur = current?.id === a.id;
                const sets = activeSets(party.find((p) => p.id === a.id)?.loadout ?? {});
                return (
                  <div key={a.id} className={`border p-2.5 transition ${a.hp <= 0 ? "border-ef-line/40 opacity-40" : isCur ? "border-ef-accent bg-ef-accent/10" : "border-ef-line bg-ef-card"}`} style={CUT_SM}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0" style={{ background: elementColor[op?.element ?? "physical"] }} />
                      <span className="truncate font-mono text-sm font-bold text-white">{a.name}</span>
                      {op && <span className="font-mono text-[9px] uppercase text-ef-muted">{classLabel[op.cls]}</span>}
                      {isCur && <span className="ml-auto font-mono text-[9px] font-bold uppercase tracking-wider text-ef-accent">▶ 턴</span>}
                      <span className={`font-mono text-[10px] ${isCur ? "ml-1" : "ml-auto"} text-ef-muted`}>{a.hp}/{a.maxHp}</span>
                    </div>
                    <Bar value={a.hp} max={a.maxHp} color={a.hp / a.maxHp < 0.35 ? "#f87171" : "#86efac"} />
                    {a.shield > 0 && <div className="mt-0.5 font-mono text-[9px] text-sky-300">보호막 {a.shield}</div>}
                    <div className="mt-1 flex items-center gap-1.5"><span className="font-mono text-[9px] uppercase tracking-wider text-ef-muted">궁</span><Bar value={a.ultCharge} max={a.ultCost} color={a.ultCharge >= a.ultCost ? "#ffd24a" : "#8a6d1f"} h="h-1" /><span className="font-mono text-[9px] text-ef-muted">{Math.round(a.ultCharge)}/{a.ultCost}</span></div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {sets.map((n) => <Chip key={`set-${n}`} tone="#c9a227">◆{n}</Chip>)}
                      {unitChips(a).map((c) => <Chip key={c.k} tone={c.tone}>{c.label}</Chip>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!winner && current && !auto && (
            <div className="border border-ef-accent/40 bg-ef-accent/5 p-3" style={CUT_SM}>
              <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-ef-accent">{current.name} — 스킬 선택</div>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk) => (
                  <button key={sk.id} type="button" onClick={() => playerAct(sk)} className="group border border-ef-line bg-ef-card px-3 py-2 text-left transition hover:border-ef-accent/60" style={CUT_SM}>
                    <div className="flex items-center gap-1.5"><span className="border px-1 py-px font-mono text-[9px] font-bold uppercase" style={{ borderColor: `${PRIMARY}66`, color: PRIMARY }}>{kindLabel[sk.kind]}</span><span className="font-mono text-sm font-bold text-white">{sk.name}</span>{sk.power > 0 && <span className="font-mono text-[10px] text-ef-muted">{Math.round(sk.power * 100)}%</span>}</div>
                    {sk.note && <div className="mt-0.5 max-w-[230px] truncate text-[10px] text-ef-muted group-hover:text-ef-ink">{sk.note}</div>}
                  </button>
                ))}
                {!skills.length && <span className="font-mono text-xs text-ef-muted">사용 가능한 스킬 없음</span>}
              </div>
            </div>
          )}

          {!winner && current && !auto && Object.keys(items).length > 0 && (
            <div className="border border-ef-line bg-ef-card p-3" style={CUT_SM}>
              <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-ef-muted">전술 아이템 <span className="text-ef-line">· 자유 행동(턴 유지) · 최저 체력 아군 조건 충족 시</span></div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(items).map(([id, n]) => {
                  const it = ITEMS[id];
                  if (!it) return null;
                  const usable = canUseItem(s, id);
                  return (
                    <button key={id} type="button" disabled={!usable} onClick={() => playerUseItem(id)} className={`group border bg-black/40 px-2.5 py-1.5 text-left transition ${usable ? "border-ef-line hover:border-ef-accent/60" : "border-ef-line/40 opacity-45"}`} style={CUT_SM}>
                      <div className="flex items-center gap-1.5"><span className="h-2 w-2 shrink-0" style={{ background: itemColor(it.kind) }} /><span className="font-mono text-xs font-bold text-white">{it.name}</span><span className="font-mono text-[10px] text-ef-accent">×{n}</span></div>
                      <div className="mt-0.5 max-w-[230px] truncate text-[10px] text-ef-muted group-hover:text-ef-ink">{it.desc} · {condText(it.cond)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
          <div className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">전투 로그</div>
          <div className="flex max-h-[70vh] flex-col-reverse gap-0.5 overflow-y-auto font-mono text-[11px] leading-relaxed">
            {[...s.log].slice(-120).reverse().map((line, i) => (
              <div key={s.log.length - i} className={line.startsWith("──") ? "mt-1 font-bold text-ef-accent" : line.includes("불균형 상태") || line.includes("승리") ? "text-yellow-300" : line.includes("→") && !line.startsWith("  ") ? "text-white" : line.includes("✗") ? "text-red-300" : "text-ef-muted"}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
