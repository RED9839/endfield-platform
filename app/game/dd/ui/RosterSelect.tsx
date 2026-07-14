"use client";

import { useState } from "react";

import { OPERATORS, SKILLS, OP_BASIC, avatarUrl, fullUrl, skillIcon, makeAlly, type OpMeta } from "../roster";
import { OP_TALENTS } from "../operator-talents";
import { activeSets, setEffectText, recommendedSet, recommendedLoadout, loadoutPieces, pieceImage, gearSlotName, bestFreePiece, slotOptions, GEAR_SET_CANON, SET_NAMES, type Loadout, type GearSlot } from "../gear";
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
const DMG_KO: Record<string, string> = { ult: "궁극", battle: "배틀", link: "연계", attack: "일반", all: "물리", elem: "원소", atkPct: "공격력", hpPct: "생명력", critRate: "치명확", critDmg: "치명피", energy: "궁충" };
const pieceDmg = (p: { dmg?: { kind: string; base: number } }) => { if (!p.dmg) return ""; const pct = p.dmg.kind === "hpPct" || p.dmg.base < 1; return `${DMG_KO[p.dmg.kind] ?? p.dmg.kind} +${pct ? Math.round(p.dmg.base * 100) + "%" : Math.round(p.dmg.base)}`; };
const AXES = [{ key: "skillRank" as const, name: "스킬 강화", max: SKILL_MAX, fmt: (v: number) => skillLabel(v), tone: "#67e8f9" }];

export default function RosterSelect({ onStart }: { onStart: (picks: PartyPick[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [setChoice, setSetChoice] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<Record<string, OpProgress>>({});
  const [focusId, setFocusId] = useState<string>(OPERATORS[0].id);
  const [setPicker, setSetPicker] = useState(false); // 목표 세트 선택 피커
  const [pieceChoice, setPieceChoice] = useState<Record<string, Partial<Record<GearSlot, string>>>>({}); // 부위별 직접 교체(오퍼→슬롯→피스id)
  const [pickSlot, setPickSlot] = useState<GearSlot | null>(null); // 부위 교체 피커 열림 슬롯
  const opRecSet = (id: string) => { const op = OPERATORS.find((o) => o.id === id); return op ? recSet(op) : "검술사"; };
  const opSet = (id: string) => setChoice[id] ?? opRecSet(id);
  const opProg = (id: string) => progress[id] ?? DEFAULT_PROGRESS;
  // 목표 로드아웃 — 추천 세트면 시트 1순위 빌드. 다른 세트를 고르면 그 세트 "2부위"(방어구+장갑) → 세트 효과 발동 + 부품은 자유 슬롯(최고 부옵).
  // 실제 피스 id 사용(세트명 X) → 공업소 제작·소유(owned) 시스템과 호환.
  const opLoadout = (id: string): Loadout => {
    const set = opSet(id);
    const element = OPERATORS.find((o) => o.id === id)?.element;
    let base: Loadout;
    if (set !== opRecSet(id)) {
      const free = bestFreePiece("kit", element ?? "physical");
      base = {
        armor: GEAR_SET_CANON[set]?.armor?.id ?? set,
        gloves: GEAR_SET_CANON[set]?.gloves?.id ?? set,
        kit: free?.id ?? GEAR_SET_CANON[set]?.kit?.id ?? set,
      };
    } else base = recommendedLoadout(id, set, element);
    const pc = pieceChoice[id]; // 부위별 직접 교체 override
    return pc ? { ...base, ...pc } : base;
  };

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
  const skills = [
    ...(OP_BASIC[focusId] ? [{ id: `${focusId}-basic`, name: OP_BASIC[focusId].name, kind: "attack" as const, note: OP_BASIC[focusId].note }] : []),
    ...(SKILLS[focusId] ?? []).map((s) => ({ id: s.id, name: s.name, kind: s.kind, note: s.note })),
  ].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
  const talents = OP_TALENTS[focusId] ?? [];
  const unit = makeAlly(focusId, 1, pr); // 기초 전투 스탯(정예화·스킬강화 반영)
  const pcs = loadoutPieces(lo);
  const gearGrade = pcs.reduce((n, p) => n + p.grade, 0); // 장비 능력치 합
  const gearDef = pcs.reduce((n, p) => n + p.def, 0);     // 장비 방어 합

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
                      <button key={o.id} type="button" onClick={() => { setFocusId(o.id); setSetPicker(false); setPickSlot(null); }} title={o.name} className="group relative aspect-square overflow-hidden border transition" style={{ ...CUT, borderColor: foc ? "#ffbe6b" : on ? elementColor[o.element] : `${elementColor[o.element]}44`, background: `center top/cover url(${avatarUrl(o.id)}), #000`, boxShadow: foc ? "0 0 14px -2px rgba(255,190,107,0.8)" : on ? `0 0 10px -3px ${elementColor[o.element]}` : "none" }}>
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

          {/* 능력치 */}
          <div className="hud-tile dd-cut mb-2.5 px-2.5 py-2">
            <div className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ef-muted">능력치 <span className="font-normal text-ef-accent/60">· 장비 포함</span></div>
            <div className="grid grid-cols-4 gap-x-2 gap-y-1">
              {([["HP", unit.maxHp], ["공격", unit.attack], ["속도", unit.speed], ["방어", gearDef]] as [string, number][]).map(([k, v]) => (
                <div key={k} className="flex flex-col leading-tight">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ef-muted">{k}</span>
                  <span className="font-mono text-[15px] font-black tabular-nums text-white">{v}</span>
                </div>
              ))}
            </div>
            {unit.attrs && (
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 border-t border-ef-line/40 pt-1.5 font-mono text-[11px]">
                {([["힘", unit.attrs.str], ["민첩", unit.attrs.agi], ["지능", unit.attrs.int], ["의지", unit.attrs.wil]] as [string, number][]).map(([k, v]) => (
                  <span key={k} className="text-ef-muted">{k} <b className="text-ef-ink">{v}</b></span>
                ))}
              </div>
            )}
          </div>

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

          {/* 스킬 강화 + 추천 세트 */}
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
          </div>

          {/* 목표 장비 — 맨몸 시작 → 공업소에서 이 빌드를 목표로 제작. 세트(빌드) 선택 가능. */}
          <div className="hud-tile dd-cut mb-3 px-2.5 py-2.5">
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ef-muted">목표 장비</span>
              <span className="font-mono text-[13px] font-bold text-ef-ink">{opSet(focusId)} 세트</span>
              {opSet(focusId) === opRecSet(focusId) && <span className="font-mono text-[10px] text-ef-accent">★추천</span>}
              <button type="button" onClick={() => setSetPicker((v) => !v)} className={`dd-cut ml-auto shrink-0 border px-2 py-0.5 font-mono text-[11px] font-bold uppercase transition ${setPicker ? "border-ef-accent bg-ef-accent/15 text-ef-accent" : "border-ef-line text-ef-muted hover:border-ef-accent/60 hover:text-ef-accent"}`}>{setPicker ? "닫기" : "세트 변경 ▾"}</button>
              <span className="w-full font-mono text-[10px] text-ef-muted">맨몸으로 시작 · 공업소에서 이 빌드를 목표로 제작 · <span className="font-mono text-[11px] text-ef-accent-soft">능력치 +{gearGrade} · 방어 +{gearDef}</span></span>
              {active.map((n) => <span key={n} className="w-full truncate font-mono text-[11px] text-green-300">◆ {setEffectText(n)}</span>)}
            </div>
            {/* 목표 세트(빌드) 선택 — 추천 강제 아님 */}
            {setPicker && (
              <div className="mb-2 border-b border-ef-line/40 pb-2">
                <div className="grid max-h-56 grid-cols-1 gap-1 overflow-y-auto pr-1">
                  {[...SET_NAMES].sort((a, b) => (a === opRecSet(focusId) ? -1 : 0) - (b === opRecSet(focusId) ? -1 : 0)).map((sn) => { const sel = opSet(focusId) === sn; const rec = sn === opRecSet(focusId); return (
                    <button key={sn} type="button" onClick={() => { setSetChoice((c) => { const n = { ...c }; if (rec) delete n[focusId]; else n[focusId] = sn; return n; }); setSetPicker(false); }} className={`dd-cut flex items-start gap-1.5 border px-2 py-1 text-left transition ${sel ? "border-ef-accent bg-ef-accent/10" : "border-ef-line hover:border-ef-accent/50"}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5"><span className="font-mono text-[12px] font-bold text-white">{sn}</span>{rec && <span className="font-mono text-[9px] text-ef-accent">★추천</span>}{sel && <span className="font-mono text-[9px] text-ef-accent-soft">● 선택</span>}</div>
                        <div className="truncate font-mono text-[10px] text-ef-muted">{setEffectText(sn)}</div>
                      </div>
                    </button>
                  ); })}
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              {pcs.map((pc) => { const named = pc.set && pc.set !== "?"; const on = named && active.includes(pc.set); const empty = pc.name === "없음"; const opening = pickSlot === pc.slot; const swapped = !!pieceChoice[focusId]?.[pc.slot]; return (
                <div key={pc.slot}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-ef-line/60 bg-black/40">{!empty && pieceImage(pc.name) ? <img src={pieceImage(pc.name)} alt="" className="h-full w-full object-contain" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} /> : <span className="text-[10px] text-ef-muted">—</span>}</span>
                    <span className="w-9 shrink-0 font-mono text-[10px] uppercase tracking-wider text-ef-accent/70">{gearSlotName(pc.slot)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-[12px] font-bold text-ef-ink" title={pc.name}>{pc.name}{swapped && <span className="ml-1 text-[9px] text-ef-accent">교체됨</span>}</div>
                      {empty ? <div className="font-mono text-[10px] text-ef-muted">미장착</div>
                        : <div className="font-mono text-[10px] text-ef-muted">능력치 <b className="text-ef-ink/80">+{pc.grade}</b> · 방어 <b className="text-ef-ink/80">+{pc.def}</b>{pc.dmg ? <> · <span className="text-ef-accent-soft">{pieceDmg(pc)}</span></> : null} · {named ? <span style={{ color: on ? "#e8c56a" : "#8a8a92" }}>{on ? "◆" : "◇"} {pc.set}</span> : <span className="text-[#67e8f9aa]">자유</span>}</div>}
                    </div>
                    <button type="button" onClick={() => setPickSlot(opening ? null : pc.slot)} className={`dd-cut shrink-0 border px-2 py-0.5 font-mono text-[10px] font-bold uppercase transition ${opening ? "border-ef-accent bg-ef-accent/15 text-ef-accent" : "border-ef-line text-ef-muted hover:border-ef-accent/60 hover:text-ef-accent"}`}>{opening ? "닫기" : "교체 ▾"}</button>
                  </div>
                  {opening && (
                    <div className="mt-1 mb-1 border-y border-ef-line/40 py-1.5 pl-11">
                      <div className="grid max-h-44 grid-cols-2 gap-1 overflow-y-auto pr-1">
                        {slotOptions(pc.slot, op.element).map((opt) => { const sel = lo[pc.slot] === opt.id; return (
                          <button key={opt.id} type="button" onClick={() => { setPieceChoice((c) => ({ ...c, [focusId]: { ...c[focusId], [pc.slot]: opt.id } })); setPickSlot(null); }} className={`dd-cut flex items-center gap-1.5 border p-1 text-left transition ${sel ? "border-ef-accent bg-ef-accent/10" : "border-ef-line hover:border-ef-accent/50"}`}>
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-ef-line/50 bg-black/40">{pieceImage(opt.name) ? <img src={pieceImage(opt.name)} alt="" className="h-full w-full object-contain" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} /> : null}</span>
                            <span className="min-w-0"><span className="block truncate font-mono text-[11px] font-bold text-white">{opt.name}</span><span className="font-mono text-[10px] text-ef-accent-soft">능력치 +{opt.grade.base} · {pieceDmg(opt)}</span></span>
                          </button>
                        ); })}
                      </div>
                      {swapped && <button type="button" onClick={() => { setPieceChoice((c) => { const n = { ...c }; const s = { ...n[focusId] }; delete s[pc.slot]; if (Object.keys(s).length) n[focusId] = s; else delete n[focusId]; return n; }); setPickSlot(null); }} className="mt-1 w-full border border-ef-line py-1 font-mono text-[10px] font-bold uppercase text-ef-muted transition hover:border-ef-accent/50 hover:text-ef-ink">↺ 추천 부위로 복원</button>}
                    </div>
                  )}
                </div>
              ); })}
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
