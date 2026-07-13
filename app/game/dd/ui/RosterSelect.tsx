"use client";

import { useState } from "react";

import { OPERATORS, avatarUrl, type OpMeta } from "../roster";
import { activeSets, setEffectText, recommendedSet, recommendedLoadout, type Loadout } from "../gear";
import { DEFAULT_PROGRESS, SKILL_MAX, skillLabel, clampProgress, type OpProgress } from "../progress";
import { weaponOf, weaponName, weaponEffectText, weaponImage, weaponSeriesName, weaponSeriesText, OP_WEAPON_STATS, WEAPON_KO, WEAPON_ICON } from "../weapons";
import { PRESET_PARTIES, ARCHETYPE_LABEL } from "../parties";
import type { PartyPick } from "../run";
import type { DDClass, Element } from "../combat";

const PRIMARY = "#ff9a2f";
const CUT = { clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const elementName: Record<"physical" | Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const classLabel: Record<DDClass, string> = { guard: "가드", caster: "캐스터", striker: "스트라이커", vanguard: "뱅가드", defender: "디펜더", supporter: "서포터" };
const classOrder: DDClass[] = ["striker", "guard", "vanguard", "caster", "defender", "supporter"];

const recSet = (op: OpMeta): string => recommendedSet(op.id, op.cls, op.element);

// 스킬 단조만 편성에서 지정(정예화 없음). 장비는 공업소 제작.
const AXES = [{ key: "skillRank" as const, name: "스킬 단조", max: SKILL_MAX, fmt: (v: number) => skillLabel(v), tone: "#67e8f9" }];

export default function RosterSelect({ onStart }: { onStart: (picks: PartyPick[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [setChoice, setSetChoice] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<Record<string, OpProgress>>({});

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
    const S: Record<string, string> = {};
    const P: Record<string, OpProgress> = {};
    for (const id of p.members) {
      const op = OPERATORS.find((o) => o.id === id);
      S[id] = op ? recSet(op) : "검술사";
      P[id] = DEFAULT_PROGRESS;
    }
    setSetChoice(S);
    setProgress(P);
  };

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7">
      {/* ===== 헤더 HUD 스트립 ===== */}
      <div className="hud-panel dd-cut mb-5 flex flex-wrap items-center gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.34em] text-ef-accent/70">Darkest Protocol · 원정 편성</p>
          <h2 className="font-mono text-2xl font-black uppercase tracking-[0.12em] text-white">부대 편성</h2>
        </div>
        {/* 부대 슬롯 프리뷰 */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }, (_, i) => {
            const id = selected[i];
            const op = id ? OPERATORS.find((o) => o.id === id) : null;
            return (
              <div key={i} className="relative h-12 w-12 overflow-hidden border" style={{ ...CUT, borderColor: op ? elementColor[op.element] : "#2a2a2e", background: op ? `center top/cover url(${avatarUrl(op.id)}), #0d0906` : "linear-gradient(180deg,#131316,#0b0b0d)" }}>
                {!op && <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-black text-ef-line">{i + 1}</span>}
                {op && <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: elementColor[op.element] }} />}
              </div>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-lg font-black tabular-nums" style={{ color: selected.length === 4 ? PRIMARY : "#85858e" }}>{selected.length}<span className="text-sm text-ef-muted">/4</span></span>
          <button type="button" disabled={selected.length < 1} onClick={start} className="dd-cut px-5 py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40" style={{ background: selected.length ? `linear-gradient(180deg,#ffb257,${PRIMARY})` : "#16161a", color: selected.length ? "#0a0a0a" : "#777", boxShadow: selected.length ? "0 0 22px -4px rgba(255,154,47,0.7)" : "none" }}>원정 출발 ▶</button>
        </div>
      </div>
      <p className="mb-4 text-[13px] leading-relaxed text-ef-muted">오퍼레이터 4명 선택. <b className="text-ef-ink">HP는 전투마다 이어지고</b> 야영에서만 회복. 장비는 <b className="text-ef-accent-soft">맨몸 시작</b> — 런에서 재료 모아 공업소에서 <b className="text-ef-ink">추천 빌드</b> 제작(같은 세트 2부위부터 효과).</p>

      {/* ===== 추천 부대 ===== */}
      <div className="mb-6">
        <SectionLabel>추천 부대 <span className="font-normal text-ef-muted">· 원클릭 로드</span></SectionLabel>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {PRESET_PARTIES.map((p, i) => {
            const on = selected.length > 0 && p.members.every((m) => selected.includes(m)) && selected.length === p.members.length;
            return (
              <button key={p.id} type="button" onClick={() => loadPreset(p)} className={`hud-tile dd-cut group relative overflow-hidden py-2.5 pl-3.5 pr-3 text-left ${on ? "!border-ef-accent" : ""}`}>
                <span className="absolute inset-y-0 left-0 w-1" style={{ background: elementColor[p.element], boxShadow: `0 0 10px ${elementColor[p.element]}` }} />
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-bold text-ef-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[14px] font-bold text-white">{p.name}</span>
                  <span className="ml-auto font-mono text-[10px] font-bold uppercase tracking-wider text-ef-accent/70">{ARCHETYPE_LABEL[p.archetype]}</span>
                </div>
                {/* 멤버 초상 라인 */}
                <div className="mt-1.5 flex items-center gap-1">
                  {p.members.map((id) => { const o = OPERATORS.find((x) => x.id === id); return (
                    <span key={id} className="h-7 w-7 shrink-0 overflow-hidden rounded-[2px] border" style={{ borderColor: o ? `${elementColor[o.element]}88` : "#2a2a2e", background: `center top/cover url(${avatarUrl(id)}), #000` }} title={o?.name} />
                  ); })}
                </div>
                <div className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-ef-muted group-hover:text-ef-ink">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== 선택된 부대 상세 ===== */}
      {selected.length > 0 && (
        <div className="mb-6">
          <SectionLabel>내 부대 <span className="font-normal text-ef-muted">· 빌드 상세</span></SectionLabel>
          <div className="grid gap-3 lg:grid-cols-2">
            {selected.map((id, i) => {
              const op = OPERATORS.find((o) => o.id === id)!;
              const lo = opLoadout(id);
              const active = activeSets(lo);
              const pr = opProg(id);
              const el = op.element;
              return (
                <div key={id} className="hud-panel dd-cut relative overflow-hidden p-3">
                  <span className="absolute inset-y-0 left-0 w-1" style={{ background: elementColor[el], boxShadow: `0 0 10px ${elementColor[el]}` }} />
                  {/* 헤더: 초상 + 이름 */}
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden border" style={{ borderColor: elementColor[el], background: `center top/cover url(${avatarUrl(op.id)}), #0d0906`, boxShadow: `inset 0 0 0 1px #0008, 0 0 12px ${elementColor[el]}33` }}>
                      <span className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center bg-ef-accent font-mono text-[12px] font-black text-black">{i + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[16px] font-bold text-white">{op.name}</span>
                        <span className="font-mono text-[11px] uppercase tracking-wide text-ef-muted">{classLabel[op.cls]}</span>
                      </div>
                      <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-[12px]" style={{ color: elementColor[el] }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: elementColor[el] }} />{elementName[el]}</span>
                    </div>
                    <button type="button" onClick={() => toggle(id)} className="shrink-0 border border-ef-line px-2 py-1 font-mono text-[11px] text-ef-muted transition hover:border-red-400/60 hover:text-red-300">해제</button>
                  </div>

                  {/* 무기 + 시리즈 */}
                  {weaponOf(id) && (
                    <div className="hud-tile dd-cut mb-2.5 px-2.5 py-2">
                      <div className="flex items-center gap-2">
                        {weaponImage(id) ? <img src={weaponImage(id)} alt="" loading="lazy" className="h-8 w-8 shrink-0 object-contain" /> : <span className="text-base leading-none">{WEAPON_ICON[weaponOf(id)!]}</span>}
                        <span className="min-w-0 flex-1 truncate font-mono text-[13px] font-bold text-ef-ink">{weaponName(id)} <span className="font-normal text-ef-muted">{WEAPON_KO[weaponOf(id)!]}</span></span>
                        <span className="shrink-0 font-mono text-[12px] font-bold text-ef-accent-soft">ATK {OP_WEAPON_STATS[id]?.atk ?? "-"} · {weaponEffectText(id)}</span>
                      </div>
                      {weaponSeriesText(id) && (
                        <div className="mt-1.5 border-t border-ef-line/40 pt-1.5">
                          <div className="font-mono text-[12px] font-bold text-purple-300">◈ {weaponSeriesName(id)}</div>
                          <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-ef-ink/70" title={weaponSeriesText(id)}>{weaponSeriesText(id)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-stretch gap-2.5">
                    {/* 스킬 단조 */}
                    {AXES.map((ax) => {
                      const v = pr[ax.key];
                      return (
                        <div key={ax.key} className="hud-tile dd-cut min-w-[150px] flex-1 px-2.5 py-2">
                          <div className="font-mono text-[11px] uppercase tracking-wider text-ef-muted">{ax.name}</div>
                          <div className="mt-1 flex items-center justify-between gap-1">
                            <button type="button" onClick={() => bumpProg(id, ax.key, -1)} disabled={v <= 0} className="flex h-6 w-6 items-center justify-center border border-ef-line font-mono text-base leading-none text-ef-muted transition enabled:hover:border-ef-accent/50 enabled:hover:text-white disabled:opacity-25">−</button>
                            <span className="font-mono text-[16px] font-black" style={{ color: ax.tone }}>{ax.fmt(v)}</span>
                            <button type="button" onClick={() => bumpProg(id, ax.key, 1)} disabled={v >= ax.max} className="flex h-6 w-6 items-center justify-center border border-ef-line font-mono text-base leading-none text-ef-muted transition enabled:hover:border-ef-accent/50 enabled:hover:text-white disabled:opacity-25">+</button>
                          </div>
                          <div className="mt-1.5 flex gap-0.5">{Array.from({ length: ax.max }, (_, k) => <span key={k} className="h-1 flex-1 rounded-full" style={{ background: k < v ? ax.tone : "#2a2a2a", boxShadow: k < v ? `0 0 5px ${ax.tone}88` : "none" }} />)}</div>
                        </div>
                      );
                    })}
                    {/* 추천 세트 */}
                    <div className="hud-tile dd-cut min-w-[190px] flex-[2] px-2.5 py-2">
                      <div className="flex items-center gap-2"><span className="font-mono text-[11px] uppercase tracking-wider text-ef-muted">추천 세트</span><span className="font-mono text-[13px] font-bold text-ef-ink">{opSet(id)}</span><span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-ef-muted">공업소 제작</span></div>
                      <div className="mt-1 space-y-0.5">{active.length ? active.map((n) => <div key={n} className="font-mono text-[12px] leading-snug text-green-300">◆ {setEffectText(n)}</div>) : <div className="font-mono text-[12px] text-ef-muted">2부위부터 세트 효과</div>}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== 오퍼레이터 목록 ===== */}
      {classOrder.map((cls) => {
        const ops = OPERATORS.filter((o) => o.cls === cls);
        if (!ops.length) return null;
        return (
          <div key={cls} className="mt-5">
            <div className="mb-2 flex items-center gap-2 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ef-accent-soft"><span className="h-1.5 w-1.5 rotate-45 bg-ef-accent/70" />{classLabel[cls]}<span className="font-normal tracking-normal text-ef-muted">· {ops.length}</span><span className="hud-horizon ml-1 flex-1 opacity-50" /></div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {ops.map((op: OpMeta) => {
                const on = selected.includes(op.id);
                const order = selected.indexOf(op.id) + 1;
                const full = !on && selected.length >= 4;
                return (
                  <button key={op.id} type="button" onClick={() => toggle(op.id)} disabled={full} className={`hud-tile dd-cut group relative flex items-center gap-2.5 px-2 py-2 text-left ${on ? "!border-ef-accent" : ""} ${full ? "cursor-not-allowed opacity-40" : ""}`} style={on ? { boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 0 18px -3px ${elementColor[op.element]}66` } : undefined}>
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden border" style={{ borderColor: on ? elementColor[op.element] : `${elementColor[op.element]}66`, background: `center top/cover url(${avatarUrl(op.id)}), #000` }}>
                      <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: elementColor[op.element] }} />
                      {on && <span className="absolute left-0 top-0 flex h-4 w-4 items-center justify-center bg-ef-accent font-mono text-[11px] font-black text-black">{order}</span>}
                    </div>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[14px] font-bold text-white">{op.name}</span>
                      <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider" style={{ color: elementColor[op.element] }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: elementColor[op.element] }} />{elementName[op.element]}</span>
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ef-ink">{children}</div>;
}
