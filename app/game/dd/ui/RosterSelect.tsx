"use client";

import { useState } from "react";

import { OPERATORS, type OpMeta } from "../roster";
import { GEAR_SLOTS, SET_NAMES, activeSets, gearSlotName, setEffectText, recommendedSet, recommendedLoadout, GEAR_PIECE_BY_ID, type GearSlot, type Loadout } from "../gear";
import { DEFAULT_PROGRESS, PROMO_MAX, SKILL_MAX, GEAR_MAX, PROMO_LABEL, skillLabel, gearLabel, clampProgress, type OpProgress } from "../progress";
import { PRESET_PARTIES, ARCHETYPE_LABEL } from "../parties";
import type { PartyPick } from "../run";
import type { DDClass, Element } from "../combat";

const PRIMARY = "#c9822c";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const elementName: Record<"physical" | Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const classLabel: Record<DDClass, string> = { guard: "가드", caster: "캐스터", striker: "스트라이커", vanguard: "뱅가드", defender: "디펜더", supporter: "서포터" };
const classOrder: DDClass[] = ["striker", "guard", "vanguard", "caster", "defender", "supporter"];

// 오퍼 추천 세트(시트 공략 기준, gear.ts OP_RECOMMENDED_SET) — 기본 로드아웃
const recSet = (op: OpMeta): string => recommendedSet(op.id, op.cls, op.element);

// 성장 3축 스테퍼 정의(라벨·최대치·표시)
const AXES = [
  { key: "promotion" as const, name: "정예화", max: PROMO_MAX, fmt: (v: number) => PROMO_LABEL[v], tone: "#fbbf24" },
  { key: "skillRank" as const, name: "스킬 단조", max: SKILL_MAX, fmt: (v: number) => skillLabel(v), tone: "#67e8f9" },
  { key: "gearLevel" as const, name: "장비 단조", max: GEAR_MAX, fmt: (v: number) => gearLabel(v), tone: "#c4b5fd" },
];
const pieceName = (ref?: string) => (ref ? GEAR_PIECE_BY_ID[ref]?.name ?? ref : "—");

export default function RosterSelect({ onStart }: { onStart: (picks: PartyPick[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [setChoice, setSetChoice] = useState<Record<string, string>>({}); // 오퍼별 폴백 세트(OP_GEAR 누락 슬롯 채움)
  const [progress, setProgress] = useState<Record<string, OpProgress>>({});

  const opSet = (id: string) => { const op = OPERATORS.find((o) => o.id === id); return setChoice[id] ?? (op ? recSet(op) : "검술사"); };
  const opProg = (id: string) => progress[id] ?? DEFAULT_PROGRESS;
  const opLoadout = (id: string): Loadout => recommendedLoadout(id, opSet(id));

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
    const S: Record<string, string> = {};
    const P: Record<string, OpProgress> = {};
    for (const id of p.members) {
      const op = OPERATORS.find((o) => o.id === id);
      S[id] = op ? recSet(op) : "검술사"; // 시트 기준 추천 세트(OP_RECOMMENDED_SET)로 통일
      P[id] = DEFAULT_PROGRESS;
    }
    setSetChoice(S);
    setProgress(P);
  };

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Darkest Protocol · 원정 편성</p>
          <h2 className="font-mono text-xl font-black uppercase tracking-[0.15em] text-white">부대 편성</h2>
          <p className="mt-1 text-xs text-ef-muted">오퍼레이터 4명 선택(선택 순서 = 전열). <b className="text-ef-ink">HP는 전투마다 이어지고</b> 야영에서만 회복. 장비는 <b className="text-ef-ink">같은 세트 2부위</b>부터 효과 발동.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-ef-muted">{selected.length}/4</span>
          <button type="button" disabled={selected.length < 1} onClick={start} className="border border-ef-line px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider transition enabled:hover:border-ef-accent/50 disabled:opacity-40" style={{ ...CUT_SM, background: selected.length ? PRIMARY : "#141414", color: selected.length ? "#0a0a0a" : "#888" }}>원정 출발 ▶</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">프리셋 조합 <span className="text-ef-line">· 시트 순서 · 원클릭 로드</span></div>
        <div className="flex flex-wrap gap-2">
          {PRESET_PARTIES.map((p, i) => (
            <button key={p.id} type="button" onClick={() => loadPreset(p)} className="group max-w-[340px] border border-ef-line bg-ef-card px-3 py-2 text-left transition hover:border-ef-accent/60" style={CUT_SM}>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-ef-line">{i + 1}</span>
                <span className="h-2.5 w-2.5 shrink-0" style={{ background: elementColor[p.element] }} />
                <span className="font-mono text-sm font-bold text-white">{p.name}</span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-ef-muted">{ARCHETYPE_LABEL[p.archetype]}</span>
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-ef-accent">{p.members.map((id) => OPERATORS.find((o) => o.id === id)?.name ?? id).join("·")}</div>
              <div className="mt-0.5 truncate text-[10px] text-ef-muted group-hover:text-ef-ink">{p.desc}</div>
              {p.note && <div className="mt-0.5 truncate text-[9px] text-ef-line">{p.note}</div>}
              {p.alternates?.map((alt) => (
                <div key={alt.role} className="mt-0.5 flex flex-wrap items-center gap-1 text-[9px]">
                  <span className="text-ef-line">↔ {alt.role}:</span>
                  {alt.ids.map((id) => <span key={id} className="text-ef-accent-soft">{OPERATORS.find((o) => o.id === id)?.name ?? id}</span>)}
                </div>
              ))}
            </button>
          ))}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="mb-5 grid gap-2 sm:grid-cols-2">
          {selected.map((id, i) => {
            const op = OPERATORS.find((o) => o.id === id)!;
            const lo = opLoadout(id);
            const active = activeSets(lo);
            const pr = opProg(id);
            return (
              <div key={id} className="border border-ef-accent/40 bg-ef-accent/5 p-2.5" style={CUT_SM}>
                <div className="mb-2 flex items-center gap-1.5">
                  <b className="font-mono text-xs text-ef-accent">{i + 1}</b>
                  <span className="h-2.5 w-2.5 shrink-0" style={{ background: elementColor[op.element] }} />
                  <span className="font-mono text-sm font-bold text-white">{op.name}</span>
                  <span className="font-mono text-[9px] uppercase text-ef-muted">{classLabel[op.cls]}</span>
                  <button type="button" onClick={() => toggle(id)} className="ml-auto font-mono text-[10px] text-ef-muted hover:text-red-300">해제</button>
                </div>

                {/* 성장 3축 — 정예화 · 스킬 단조 · 장비 단조 */}
                <div className="mb-2 grid grid-cols-3 gap-1.5">
                  {AXES.map((ax) => {
                    const v = pr[ax.key];
                    return (
                      <div key={ax.key} className="border border-ef-line bg-black/40 px-1.5 py-1" style={CUT_SM}>
                        <div className="font-mono text-[8px] uppercase tracking-wider text-ef-muted">{ax.name}</div>
                        <div className="mt-0.5 flex items-center justify-between gap-1">
                          <button type="button" onClick={() => bumpProg(id, ax.key, -1)} disabled={v <= 0} className="font-mono text-xs leading-none text-ef-muted transition enabled:hover:text-white disabled:opacity-25">−</button>
                          <span className="font-mono text-xs font-bold" style={{ color: ax.tone }}>{ax.fmt(v)}</span>
                          <button type="button" onClick={() => bumpProg(id, ax.key, 1)} disabled={v >= ax.max} className="font-mono text-xs leading-none text-ef-muted transition enabled:hover:text-white disabled:opacity-25">+</button>
                        </div>
                        <div className="mt-0.5 flex gap-0.5">{Array.from({ length: ax.max }, (_, k) => <span key={k} className="h-0.5 flex-1" style={{ background: k < v ? ax.tone : "#2a2a2a" }} />)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* 장착 피스(시트 빌드 + 폴백 세트) */}
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-ef-line">세트</span>
                  <select value={opSet(id)} onChange={(e) => setSetChoice((S) => ({ ...S, [id]: e.target.value }))} className="border border-ef-line bg-black/60 px-1 py-0.5 font-mono text-[10px] text-ef-ink focus:border-ef-accent/60 focus:outline-none">
                    {SET_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <span className="font-mono text-[8px] text-ef-line">누락 슬롯 폴백</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {GEAR_SLOTS.map((slot) => (
                    <span key={slot} className="max-w-[46%] truncate border border-ef-line/50 bg-black/30 px-1 py-0.5 font-mono text-[9px] text-ef-muted" title={pieceName(lo[slot])}>
                      <b className="text-ef-line">{gearSlotName(slot)}</b> {pieceName(lo[slot])}
                    </span>
                  ))}
                </div>
                {active.length ? (
                  active.map((n) => <div key={n} className="mt-1 font-mono text-[10px] text-green-300">◆ {setEffectText(n)}</div>)
                ) : (
                  <div className="mt-1 font-mono text-[10px] text-ef-muted">세트 미발동 (같은 세트 2부위 이상)</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {classOrder.map((cls) => {
        const ops = OPERATORS.filter((o) => o.cls === cls);
        if (!ops.length) return null;
        return (
          <div key={cls} className="mt-5">
            <div className="dd-title mb-2 flex items-center gap-2 text-sm text-ef-accent-soft"><span className="h-px w-4 bg-ef-line" />{classLabel[cls]} <span className="font-mono text-[10px] font-normal tracking-normal text-ef-muted">· {ops.length}</span><span className="h-px flex-1 bg-gradient-to-r from-ef-line to-transparent" /></div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {ops.map((op: OpMeta) => {
                const on = selected.includes(op.id);
                return (
                  <button key={op.id} type="button" onClick={() => toggle(op.id)} className={`flex items-center gap-2 border px-2.5 py-2 text-left transition ${on ? "border-ef-accent/70 bg-ef-accent/10" : "border-ef-line bg-ef-card hover:border-ef-line/80"}`} style={CUT_SM}>
                    <span className="h-2.5 w-2.5 shrink-0" style={{ background: elementColor[op.element] }} />
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-sm font-bold text-white">{op.name}</span>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-ef-muted">{elementName[op.element]}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
