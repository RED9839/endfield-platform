"use client";

import { useState } from "react";

import { OPERATORS, SKILLS, avatarUrl, fullUrl, skillIcon, type OpMeta } from "../roster";
import { OP_TALENTS } from "../operator-talents";
import { activeSets, setEffectText, recommendedSet, recommendedLoadout, type Loadout } from "../gear";
import { DEFAULT_PROGRESS, SKILL_MAX, skillLabel, clampProgress, type OpProgress } from "../progress";
import { weaponOf, weaponName, weaponEffectText, weaponImage, weaponSeriesName, weaponSeriesText, OP_WEAPON_STATS, WEAPON_KO, WEAPON_ICON } from "../weapons";
import { PRESET_PARTIES, ARCHETYPE_LABEL } from "../parties";
import type { PartyPick } from "../run";
import type { DDClass, DDSkill, Element } from "../combat";

const PRIMARY = "#ff9a2f";
const CUT = { clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const elementName: Record<"physical" | Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const classLabel: Record<DDClass, string> = { guard: "가드", caster: "캐스터", striker: "스트라이커", vanguard: "뱅가드", defender: "디펜더", supporter: "서포터" };
const classOrder: DDClass[] = ["striker", "guard", "vanguard", "caster", "defender", "supporter"];
const kindLabel: Record<DDSkill["kind"], string> = { attack: "기본", battle: "배틀", link: "연계", ult: "궁극" };
const KIND_ORDER: Record<DDSkill["kind"], number> = { attack: 0, battle: 1, link: 2, ult: 3 };

const recSet = (op: OpMeta): string => recommendedSet(op.id, op.cls, op.element);
const AXES = [{ key: "skillRank" as const, name: "스킬 단조", max: SKILL_MAX, fmt: (v: number) => skillLabel(v), tone: "#67e8f9" }];

export default function RosterSelect({ onStart }: { onStart: (picks: PartyPick[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [setChoice, setSetChoice] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<Record<string, OpProgress>>({});
  const [focusId, setFocusId] = useState<string>(OPERATORS[0].id);

  const opSet = (id: string) => { const op = OPERATORS.find((o) => o.id === id); return setChoice[id] ?? (op ? recSet(op) : "검술사"); };
  const opProg = (id: string) => progress[id] ?? DEFAULT_PROGRESS;
  const opLoadout = (id: string): Loadout => recommendedLoadout(id, opSet(id), OPERATORS.find((o) => o.id === id)?.element);

  const toggle = (id: string) => {
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= 4) return cur;
      setProgress((P) => (P[id] ? P : { ...P, [id]: DEFAULT_PROGRESS }));
      return [...cur, id];
    });
  };
  const bumpProg = (id: string, key: keyof OpProgress, delta: number) =>
    setProgress((P) => ({ ...P, [id]: clampProgress({ ...(P[id] ?? DEFAULT_PROGRESS), [key]: (P[id] ?? DEFAULT_PROGRESS)[key] + delta }) }));

  const start = () => onStart(selected.map((id) => ({ id, loadout: opLoadout(id), progress: opProg(id) })));

  const loadPreset = (p: (typeof PRESET_PARTIES)[number]) => {
    setSelected(p.members);
    const S: Record<string, string> = {}; const P: Record<string, OpProgress> = {};
    for (const id of p.members) { const op = OPERATORS.find((o) => o.id === id); S[id] = op ? recSet(op) : "검술사"; P[id] = DEFAULT_PROGRESS; }
    setSetChoice(S); setProgress(P); setFocusId(p.members[0]);
  };

  const op = OPERATORS.find((o) => o.id === focusId)!;
  const el = op.element;
  const focusOn = selected.includes(focusId);
  const focusFull = !focusOn && selected.length >= 4;
  const lo = opLoadout(focusId);
  const active = activeSets(lo);
  const pr = opProg(focusId);
  const skills = [...(SKILLS[focusId] ?? [])].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
  const talents = OP_TALENTS[focusId] ?? [];

  return (
    <div className="mx-auto max-w-[1640px] px-4 py-5 sm:px-6">
      {/* ===== 헤더 HUD 스트립 ===== */}
      <div className="hud-panel dd-cut mb-3 flex flex-wrap items-center gap-4 px-4 py-2.5">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.34em] text-ef-accent/70">Darkest Protocol · 원정 편성</p>
          <h2 className="font-mono text-xl font-black uppercase tracking-[0.12em] text-white">부대 편성</h2>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }, (_, i) => {
            const id = selected[i]; const o = id ? OPERATORS.find((x) => x.id === id) : null;
            return (
              <button key={i} type="button" onClick={() => o && setFocusId(o.id)} className="relative h-11 w-11 overflow-hidden border transition hover:brightness-110" style={{ ...CUT, borderColor: o ? elementColor[o.element] : "#2a2a2e", background: o ? `center top/cover url(${avatarUrl(o.id)}), #0d0906` : "linear-gradient(180deg,#131316,#0b0b0d)" }}>
                {!o && <span className="absolute inset-0 flex items-center justify-center font-mono text-base font-black text-ef-line">{i + 1}</span>}
                {o && <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: elementColor[o.element] }} />}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-lg font-black tabular-nums" style={{ color: selected.length === 4 ? PRIMARY : "#85858e" }}>{selected.length}<span className="text-sm text-ef-muted">/4</span></span>
          <button type="button" disabled={selected.length < 1} onClick={start} className="dd-cut px-5 py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40" style={{ background: selected.length ? `linear-gradient(180deg,#ffb257,${PRIMARY})` : "#16161a", color: selected.length ? "#0a0a0a" : "#777", boxShadow: selected.length ? "0 0 22px -4px rgba(255,154,47,0.7)" : "none" }}>원정 출발 ▶</button>
        </div>
      </div>

      {/* ===== 추천 부대(컴팩트 로우) ===== */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">추천 부대</span>
        {PRESET_PARTIES.map((p, i) => {
          const on = selected.length === p.members.length && p.members.every((m) => selected.includes(m));
          return (
            <button key={p.id} type="button" onClick={() => loadPreset(p)} title={p.desc} className={`hud-btn dd-cut flex items-center gap-1.5 px-2 py-1 font-mono text-[12px] font-bold ${on ? "hud-btn-on" : "text-ef-muted"}`}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: elementColor[p.element] }} />{p.name.replace(" 조합", "")}
            </button>
          );
        })}
      </div>

      {/* ===== 3열 스포트라이트 ===== */}
      <div className="grid gap-3 lg:grid-cols-[minmax(300px,0.9fr)_minmax(320px,1fr)_minmax(360px,1.05fr)]">
        {/* 왼쪽: 로스터 그리드 */}
        <div className="hud-panel dd-cut max-h-[74vh] overflow-y-auto p-3">
          {classOrder.map((cls) => {
            const ops = OPERATORS.filter((o) => o.cls === cls);
            if (!ops.length) return null;
            return (
              <div key={cls} className="mb-3 last:mb-0">
                <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ef-accent-soft"><span className="h-1.5 w-1.5 rotate-45 bg-ef-accent/70" />{classLabel[cls]}<span className="font-normal tracking-normal text-ef-muted">{ops.length}</span></div>
                <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                  {ops.map((o) => {
                    const on = selected.includes(o.id); const order = selected.indexOf(o.id) + 1; const foc = focusId === o.id;
                    return (
                      <button key={o.id} type="button" onClick={() => setFocusId(o.id)} title={o.name} className="group relative aspect-square overflow-hidden border transition" style={{ ...CUT, borderColor: foc ? "#ffbe6b" : on ? elementColor[o.element] : `${elementColor[o.element]}44`, background: `center top/cover url(${avatarUrl(o.id)}), #000`, boxShadow: foc ? "0 0 14px -2px rgba(255,190,107,0.8)" : on ? `0 0 10px -3px ${elementColor[o.element]}` : "none" }}>
                        <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: elementColor[o.element] }} />
                        {on && <span className="absolute left-0 top-0 flex h-4 w-4 items-center justify-center bg-ef-accent font-mono text-[10px] font-black text-black">{order}</span>}
                        {!on && selected.length >= 4 && <span className="absolute inset-0 bg-black/50" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 가운데: 스포트라이트 아트 — 세로(높이)에 맞춤, 폭 넘치면 좌우 크롭 */}
        <div className="hud-stage dd-cut relative flex h-[74vh] min-h-[440px] items-end justify-center overflow-hidden" style={{ background: `radial-gradient(90% 70% at 50% 8%, ${elementColor[el]}22, transparent 60%), linear-gradient(180deg,#0f0b09,#080605)` }}>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/85 to-transparent" />
          <img key={focusId} src={fullUrl(focusId)} alt={op.name} className="relative z-0 h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_10px_40px_rgba(0,0,0,0.7)]" style={{ animation: "op-spotlight 0.4s ease-out" }} onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatarUrl(focusId); }} />
          <div className="absolute bottom-4 left-5 z-20">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5" style={{ background: elementColor[el], boxShadow: `0 0 8px ${elementColor[el]}`, clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }} />
              <span className="font-mono text-[12px] font-bold uppercase tracking-wider" style={{ color: elementColor[el] }}>{elementName[el]} · {classLabel[op.cls]}</span>
            </div>
            <div className="font-mono text-3xl font-black uppercase tracking-wide text-white" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>{op.name}</div>
          </div>
          {focusOn && <span className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center bg-ef-accent font-mono text-base font-black text-black" style={CUT}>{selected.indexOf(focusId) + 1}</span>}
        </div>

        {/* 오른쪽: 상세 + 편성 */}
        <div className="hud-panel dd-cut flex max-h-[74vh] flex-col overflow-y-auto p-4">
          {/* 무기 */}
          {weaponOf(focusId) && (
            <div className="hud-tile dd-cut mb-2.5 px-2.5 py-2">
              <div className="flex items-center gap-2">
                {weaponImage(focusId) ? <img src={weaponImage(focusId)} alt="" className="h-8 w-8 shrink-0 object-contain" /> : <span className="text-base leading-none">{WEAPON_ICON[weaponOf(focusId)!]}</span>}
                <span className="min-w-0 flex-1 truncate font-mono text-[13px] font-bold text-ef-ink">{weaponName(focusId)} <span className="font-normal text-ef-muted">{WEAPON_KO[weaponOf(focusId)!]}</span></span>
                <span className="shrink-0 font-mono text-[12px] font-bold text-ef-accent-soft">ATK {OP_WEAPON_STATS[focusId]?.atk ?? "-"} · {weaponEffectText(focusId)}</span>
              </div>
              {weaponSeriesText(focusId) && (
                <div className="mt-1.5 border-t border-ef-line/40 pt-1.5">
                  <div className="font-mono text-[12px] font-bold text-purple-300">◈ {weaponSeriesName(focusId)}</div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-ef-ink/70">{weaponSeriesText(focusId)}</p>
                </div>
              )}
            </div>
          )}

          {/* 스킬 */}
          <div className="mb-2.5">
            <div className="mb-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-ef-accent/70">스킬</div>
            <div className="space-y-1.5">
              {skills.map((sk) => (
                <div key={sk.id} className="flex items-start gap-2">
                  <img src={skillIcon(focusId, sk.kind)} alt="" className="h-8 w-8 shrink-0 border border-ef-line/60 bg-black/40 object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} />
                  <div className="min-w-0"><div><span className="font-mono text-[13px] font-bold text-white">{sk.name}</span> <span className="font-mono text-[10px] uppercase text-ef-accent/70">{kindLabel[sk.kind]}</span></div>{sk.note && <div className="text-[12px] leading-snug text-ef-muted">{sk.note}</div>}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 재능 */}
          {talents.length > 0 && (
            <div className="mb-2.5">
              <div className="mb-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-ef-accent/70">재능</div>
              <div className="space-y-1.5">
                {talents.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {t.icon && <img src={t.icon} alt="" className="h-8 w-8 shrink-0 border border-ef-line/60 bg-black/40 object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} />}
                    <div className="min-w-0"><div className="font-mono text-[13px] font-bold text-white">{t.name}</div><div className="line-clamp-2 text-[12px] leading-snug text-ef-muted" title={t.desc}>{t.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 스킬 단조 + 추천 세트 */}
          <div className="mb-3 flex flex-wrap gap-2">
            {AXES.map((ax) => {
              const v = pr[ax.key];
              return (
                <div key={ax.key} className="hud-tile dd-cut min-w-[140px] flex-1 px-2.5 py-2">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-ef-muted">{ax.name}</div>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <button type="button" onClick={() => bumpProg(focusId, ax.key, -1)} disabled={v <= 0} className="flex h-6 w-6 items-center justify-center border border-ef-line font-mono text-base leading-none text-ef-muted transition enabled:hover:border-ef-accent/50 enabled:hover:text-white disabled:opacity-25">−</button>
                    <span className="font-mono text-[16px] font-black" style={{ color: ax.tone }}>{ax.fmt(v)}</span>
                    <button type="button" onClick={() => bumpProg(focusId, ax.key, 1)} disabled={v >= ax.max} className="flex h-6 w-6 items-center justify-center border border-ef-line font-mono text-base leading-none text-ef-muted transition enabled:hover:border-ef-accent/50 enabled:hover:text-white disabled:opacity-25">+</button>
                  </div>
                  <div className="mt-1.5 flex gap-0.5">{Array.from({ length: ax.max }, (_, k) => <span key={k} className="h-1 flex-1 rounded-full" style={{ background: k < v ? ax.tone : "#2a2a2a", boxShadow: k < v ? `0 0 5px ${ax.tone}88` : "none" }} />)}</div>
                </div>
              );
            })}
            <div className="hud-tile dd-cut min-w-[180px] flex-[1.6] px-2.5 py-2">
              <div className="flex items-center gap-2"><span className="font-mono text-[11px] uppercase tracking-wider text-ef-muted">추천 세트</span><span className="font-mono text-[13px] font-bold text-ef-ink">{opSet(focusId)}</span><span className="ml-auto font-mono text-[10px] uppercase text-ef-muted">공업소 제작</span></div>
              <div className="mt-1 space-y-0.5">{active.length ? active.map((n) => <div key={n} className="font-mono text-[12px] leading-snug text-green-300">◆ {setEffectText(n)}</div>) : <div className="font-mono text-[12px] text-ef-muted">2부위부터 세트 효과</div>}</div>
            </div>
          </div>

          {/* 편성 추가/해제 */}
          <button type="button" onClick={() => toggle(focusId)} disabled={focusFull} className="dd-cut mt-auto w-full py-3 font-mono text-sm font-black uppercase tracking-[0.14em] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={focusOn ? { background: "linear-gradient(180deg,#3a1512,#241010)", color: "#f0776e", border: "1px solid #b3312a88" } : focusFull ? { background: "#16161a", color: "#777" } : { background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a", boxShadow: "0 0 22px -4px rgba(255,154,47,0.7)" }}>
            {focusOn ? "◀ 편성 해제" : focusFull ? "부대 가득 참 (4/4)" : "편성 추가 ▶"}
          </button>
        </div>
      </div>
    </div>
  );
}
