"use client";

import { useMemo, useState } from "react";

import { OPERATORS, SKILLS, OP_BASIC, OP_BASIC_ATK, skillExtraHit, avatarUrl, fullUrl, skillIcon, makeAlly, OP_MAINSUB, type OpMeta } from "../roster";
import { OP_TALENTS } from "../operator-talents";
import { DMG_SHORT as DMG_KO, SKILL_KIND_SHORT as kindLabel } from "../labels";
import { OP_GEAR_ALT, activeSets, setEffectText, recommendedSet, recommendedLoadout, loadoutPieces, pieceImage, gearSlotName, bestFreePiece, slotOptions, GEAR_SET_CANON, SET_NAMES, pieceSlotOf, LOADOUT_SLOTS, type LoadoutSlot, type Loadout, type GearSlot , applyGear , attrsText, sumAttrs, ATTR_KO } from "../gear";
import { DEFAULT_PROGRESS, type OpProgress } from "../progress";
import { applyWeapon, weaponOf, weaponName, weaponEffectText, weaponImage, weaponSeriesName, weaponSeriesText, OP_WEAPON_STATS, WEAPON_KO, WEAPON_ICON } from "../weapons";
import { PRESET_PARTIES, ARCHETYPE_LABEL } from "../parties";
import type { PartyPick } from "../run";
import { aggroShares } from "../aggro";
import type { DDClass, DDSkill, Element } from "../combat";

const PRIMARY = "#ff9a2f";
const CUT = { clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const elementName: Record<"physical" | Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const classLabel: Record<DDClass, string> = { guard: "가드", caster: "캐스터", striker: "스트라이커", vanguard: "뱅가드", defender: "디펜더", supporter: "서포터" };
const classOrder: DDClass[] = ["striker", "guard", "vanguard", "caster", "defender", "supporter"];
const kindTone: Record<DDSkill["kind"], string> = { attack: "#a1a1aa", battle: "#ff9a2f", link: "#67e8f9", ult: "#facc15" };
const tgtType = (t?: string) => (t === "self" ? "자신" : t === "all" || t === "row" ? "범위" : "단일");
const KIND_ORDER: Record<DDSkill["kind"], number> = { attack: 0, battle: 1, link: 2, ult: 3 };

const recSet = (op: OpMeta): string => recommendedSet(op.id, op.cls, op.element);
const pieceDmg = (p: { dmg?: { kind: string; base: number } }, mul = 1) => { if (!p.dmg) return ""; const v = p.dmg.base * mul; const pct = p.dmg.kind === "hpPct" || p.dmg.base < 1; return `${DMG_KO[p.dmg.kind] ?? p.dmg.kind} +${pct ? Math.round(v * 100) + "%" : Math.round(v)}`; };

export default function RosterSelect({ onStart }: { onStart: (picks: PartyPick[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  // 메인딜러(메인 컨트롤 오퍼레이터). 배치 순서와 별개다 — 탱이 1번 전열에 서도 메인은 딜러다.
  // 추천 부대는 parties.ts가 지정하고, 직접 편성하면 1번이 메인이 된다.
  const [mainId, setMainId] = useState<string | null>(null);
  const [setChoice, setSetChoice] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<Record<string, OpProgress>>({});
  const [focusId, setFocusId] = useState<string>(OPERATORS[0].id);
  const [pieceChoice, setPieceChoice] = useState<Record<string, Partial<Record<LoadoutSlot, string>>>>({}); // 부위별 직접 교체(오퍼→슬롯→피스id)
  const [gearTab, setGearTab] = useState<"set" | LoadoutSlot | null>(null); // 장비 변경 모달 탭(null=닫힘)
  const opRecSet = (id: string) => { const op = OPERATORS.find((o) => o.id === id); return op ? recSet(op) : "검술사"; };
  const [altBuild, setAltBuild] = useState<Record<string, number>>({}); // 오퍼별 대체 빌드 선택(결: 서폿/메인)
  const opSet = (id: string) => setChoice[id] ?? opRecSet(id);
  const opProg = (id: string) => progress[id] ?? DEFAULT_PROGRESS;
  // 목표 로드아웃 — 추천 세트면 시트 1순위 빌드. 다른 세트를 고르면 그 세트 "2부위"(방어구+장갑) → 세트 효과 발동 + 부품은 자유 슬롯(최고 부옵).
  // 실제 피스 id 사용(세트명 X) → 공업소 제작·소유(owned) 시스템과 호환.
  const opLoadout = (id: string): Loadout => {
    // 대체 빌드를 골랐으면 그것을 쓴다(결: 식양의 숨결=서폿 / 열 작업용=메인 — 빌드가 폼을 결정한다)
    const ai = altBuild[id];
    if (ai != null && OP_GEAR_ALT[id]?.[ai]) return OP_GEAR_ALT[id][ai].loadout;
    const set = opSet(id);
    const element = OPERATORS.find((o) => o.id === id)?.element;
    let base: Loadout;
    if (set !== opRecSet(id)) {
      const free = bestFreePiece("kit", element ?? "physical");
      base = {
        armor: GEAR_SET_CANON[set]?.armor?.id ?? set,
        gloves: GEAR_SET_CANON[set]?.gloves?.id ?? set,
        kit1: GEAR_SET_CANON[set]?.kit?.id ?? set,
        kit2: free?.id ?? GEAR_SET_CANON[set]?.kit?.id ?? set, // 3피스로 세트 유지 + 마지막 칸은 효율 우선
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
  // 유효한 메인딜러 — 프리셋 지정이 편성에 남아 있으면 그것, 아니면 1번.
  const mainPick = mainId && selected.includes(mainId) ? mainId : selected[0];
  // 피격 확률 — 전열/후열이 없으므로 직군 어그로 가중으로만 갈린다.
  // 적 83종 중 61종(무지향)이 이 확률로 대상을 고른다. 나머지는 저체력/최고위협 우선.
  const aggroPct = (() => {
    const ops = selected.map((id) => OPERATORS.find((o) => o.id === id));
    const sh = aggroShares(ops.map((o) => o?.cls));
    return Object.fromEntries(selected.map((id, i) => [id, sh[i]])) as Record<string, number>;
  })();
  const start = () => onStart(selected.map((id) => ({ id, loadout: opLoadout(id), progress: opProg(id), main: id === mainPick })));

  const loadPreset = (p: (typeof PRESET_PARTIES)[number]) => {
    setSelected(p.members);
    const S: Record<string, string> = {}; const P: Record<string, OpProgress> = {};
    for (const id of p.members) { const op = OPERATORS.find((o) => o.id === id); S[id] = op ? recSet(op) : "검술사"; P[id] = DEFAULT_PROGRESS; }
    setSetChoice(S); setProgress(P); setFocusId(p.main); setMainId(p.main);
  };

  const op = OPERATORS.find((o) => o.id === focusId)!;
  const el = op.element;
  const focusOn = selected.includes(focusId);
  const focusFull = !focusOn && selected.length >= 4;
  const lo = opLoadout(focusId);
  const active = activeSets(lo);
  const pr = opProg(focusId);
  const skills = [
    ...(OP_BASIC[focusId] ? [{ id: `${focusId}-basic`, name: OP_BASIC[focusId].name, kind: "attack" as const, note: OP_BASIC[focusId].note, power: OP_BASIC_ATK[focusId] ?? 0.9, target: "single-front", element: "physical" as Element, staggerVal: 6, gaugeCost: undefined as number | undefined, gaugeGain: 12 as number | undefined, requiresText: undefined as string | undefined, extra: null as string | null }] : []),
    ...(SKILLS[focusId] ?? []).map((s) => ({ id: s.id, name: s.name, kind: s.kind, note: s.note, power: s.power, target: s.target as string, element: (s.element ?? "physical") as Element, staggerVal: s.staggerVal, gaugeCost: s.gaugeCost, gaugeGain: s.gaugeGain, requiresText: s.requiresText, extra: skillExtraHit(s) })),
  ].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
  const talents = OP_TALENTS[focusId] ?? [];
  const unit = makeAlly(focusId, 1, pr); // 기초 전투 스탯(정예화·스킬강화 반영)
  // 목표 빌드(풀 제작·풀 단조)를 입힌 유닛 — 결의 진결 폼처럼 장비·무기 패널값이 필요한 표시에 쓴다.
  const geared = useMemo(() => { const u = makeAlly(focusId, 1, pr); applyGear(u, lo, 3); applyWeapon(u); return u; }, [focusId, pr, lo]);
  const pcs = loadoutPieces(lo);
  const gearGrade = pcs.reduce((n, p) => n + p.grade, 0); // 장비 능력치 합
  const gearAttrs = sumAttrs(pcs); // 힘/민첩/지능/의지 실제 합 — 어느 스탯이 오르는지 보이게
  const gearDef = pcs.reduce((n, p) => n + p.def, 0);     // 장비 방어 합

  return (
    <div className="mx-auto max-w-[1640px] px-4 py-5 sm:px-6">
      {/* ===== 헤더 HUD 스트립 ===== */}
      <div className="hud-panel dd-cut mb-3 flex flex-wrap items-center gap-4 px-4 py-2.5">
        <div className="min-w-0">
          <p className="font-mono text-[13px] font-bold uppercase tracking-[0.34em] text-ef-accent/70">Darkest Protocol · 원정 편성</p>
          <h2 className="font-mono text-xl font-black uppercase tracking-[0.12em] text-white">부대 편성</h2>
          <p className="mt-0.5 font-mono text-[13px] text-ef-muted">{selected.length === 0 ? "오퍼레이터를 골라 원정대를 편성합니다 (최대 4명)" : selected.length < 4 ? `${selected.length}명 편성됨 · 최대 4명까지 · 준비되면 「원정 출발」` : "편성 완료 · 「원정 출발」로 던전에 진입합니다"}</p>
        </div>
        <div className="flex items-end gap-2">
          {Array.from({ length: 4 }, (_, i) => {
            const id = selected[i]; const o = id ? OPERATORS.find((x) => x.id === id) : null;
            return (
              // 초상화 + 그 **아래** 피격 확률. 이미지 위에 얹으면 얼굴을 가리고 잘 안 읽힌다.
              <div key={i} className="flex flex-col items-center gap-1.5">
                <button type="button" onClick={() => o && setFocusId(o.id)} className="relative h-[68px] w-[68px] overflow-hidden border transition hover:brightness-110" style={{ ...CUT, borderColor: o ? elementColor[o.element] : "#2a2a2e", background: o ? `center top/cover url(${avatarUrl(o.id)}), #0d0906` : "linear-gradient(180deg,#131316,#0b0b0d)" }}>
                  {!o && <span className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-black text-ef-line">{i + 1}</span>}
                  {o && <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: elementColor[o.element] }} />}
                </button>
                {/* 피격 확률 — 누가 맞아 줄지가 편성의 핵심인데 화면에 아무 단서가 없었다 */}
                <span className="font-mono text-[13px] font-black leading-none tabular-nums" style={{ color: o ? "#ff9a8a" : "transparent" }}>
                  {o ? `${Math.round((aggroPct[o.id] ?? 0) * 100)}%` : "—"}
                </span>
              </div>
            );
          })}
        </div>
        {selected.length > 0 && (
          <span className="font-mono text-[12px] leading-tight text-ef-muted" title="적이 누구를 노릴지는 위치가 아니라 직군으로 갈립니다. 디펜더 2.5 · 뱅가드 1.8 · 가드 1.4 · 스트라이커 1.0 · 캐스터/서포터 0.8 가중. 적 83종 중 61종이 이 확률을 따르고, 나머지는 저체력·최고위협을 우선합니다.">
            초상화 아래 <b style={{ color: "#ff9a8a" }}>%</b> = 피격 확률<br />직군 어그로 · 편성 순서 무관
          </span>
        )}
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-lg font-black tabular-nums" style={{ color: selected.length === 4 ? PRIMARY : "#85858e" }}>{selected.length}<span className="text-sm text-ef-muted">/4</span></span>
          <button type="button" disabled={selected.length < 1} onClick={start} className="dd-cut px-5 py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40" style={{ background: selected.length ? `linear-gradient(180deg,#ffb257,${PRIMARY})` : "#16161a", color: selected.length ? "#0a0a0a" : "#777", boxShadow: selected.length ? "0 0 22px -4px rgba(255,154,47,0.7)" : "none" }}>원정 출발 ▶</button>
        </div>
      </div>

      {/* 테스트 버전 고지 — 밸런스·수치가 계속 바뀌는 단계임을 편성 시점에 알린다 */}
      <div className="dd-cut mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 border px-3.5 py-2"
           style={{ borderColor: "#f5c54266", background: "linear-gradient(90deg, rgba(245,197,66,0.12), rgba(245,197,66,0.03))" }}>
        <span className="shrink-0 border px-1.5 py-px font-mono text-[12px] font-black uppercase tracking-[0.14em]"
              style={{ borderColor: "#f5c542aa", color: "#f5c542" }}>TEST BUILD</span>
        <span className="font-mono text-[13px] font-bold text-white/90">테스트 버전입니다</span>
        <span className="min-w-0 hidden font-mono text-[12px] text-ef-muted sm:inline">
          오퍼레이터 수치·스킬 판정·적 밸런스가 원작 대조 과정에서 계속 바뀝니다. 진행 상황이나 승률은 언제든 달라질 수 있습니다.
          <b className="text-white/80">원작과 다르게 구현된 부분도 있습니다</b> — 턴제로 옮기며 조정한 것도, 아직 대조하지 못한 것도 있습니다.
        </span>
        <span className="min-w-0 font-mono text-[12px] text-ef-muted sm:hidden">수치·밸런스가 계속 바뀌며 원작과 다른 부분도 있습니다.</span>
      </div>

      {/* ===== 추천 부대(컴팩트 로우) ===== */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ef-muted">추천 부대</span>
        {PRESET_PARTIES.map((p, i) => {
          const on = selected.length === p.members.length && p.members.every((m) => selected.includes(m));
          return (
            <button key={p.id} type="button" onClick={() => loadPreset(p)} title={p.desc} className={`hud-btn dd-cut flex items-center gap-1.5 px-2 py-1 font-mono text-[14px] font-bold ${on ? "hud-btn-on" : "text-ef-muted"}`}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: elementColor[p.element] }} />{p.name.replace(" 조합", "")}
            </button>
          );
        })}
      </div>

      {/* ===== 3열 스포트라이트 ===== */}
      <div className="grid gap-3 lg:grid-cols-[minmax(300px,0.9fr)_minmax(320px,1fr)_minmax(360px,1.05fr)]">
        {/* 왼쪽: 로스터 그리드 */}
        <div className="hud-panel dd-cut max-h-[calc(100vh-350px)] overflow-y-auto p-3">
          {classOrder.map((cls) => {
            const ops = OPERATORS.filter((o) => o.cls === cls);
            if (!ops.length) return null;
            return (
              <div key={cls} className="mb-3 last:mb-0">
                <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-ef-muted"><span className="h-1.5 w-1.5 rotate-45 bg-ef-accent/50" />{classLabel[cls]}<span className="font-normal tracking-normal text-ef-muted">{ops.length}</span></div>
                <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                  {ops.map((o) => {
                    const on = selected.includes(o.id); const order = selected.indexOf(o.id) + 1; const foc = focusId === o.id;
                    return (
                      <button key={o.id} type="button" onClick={() => { setFocusId(o.id); setGearTab(null); }} title={o.name} className="group relative aspect-square overflow-hidden border transition" style={{ ...CUT, borderColor: foc ? "#ffbe6b" : on ? elementColor[o.element] : `${elementColor[o.element]}44`, background: `center top/cover url(${avatarUrl(o.id)}), #000`, boxShadow: foc ? "0 0 14px -2px rgba(255,190,107,0.8)" : on ? `0 0 10px -3px ${elementColor[o.element]}` : "none" }}>
                        <span className="pointer-events-none absolute inset-x-0 bottom-[3px] truncate bg-gradient-to-t from-black/85 via-black/40 to-transparent px-0.5 pb-px pt-2.5 text-center font-mono text-[11px] font-bold leading-tight text-white/90" style={{ textShadow: "0 1px 2px #000" }}>{o.name}</span>
                        <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: elementColor[o.element] }} />
                        {on && <span className="absolute left-0 top-0 flex h-4 w-4 items-center justify-center bg-ef-accent font-mono text-[12px] font-black text-black">{order}</span>}
                        {/* 메인딜러 표식 — 배치 순서(숫자)와 별개다. 탱이 1번 전열에 서도 메인은 딜러다. */}
                        {on && o.id === mainPick && <span className="absolute right-0 top-0 bg-[#f5c542] px-1 font-mono text-[10px] font-black leading-4 text-black" title="메인 컨트롤 오퍼레이터">M</span>}
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
              <span className="font-mono text-[14px] font-bold uppercase tracking-wider" style={{ color: elementColor[el] }}>{elementName[el]} · {classLabel[op.cls]}</span>
            </div>
            <div className="font-mono text-3xl font-black uppercase tracking-wide text-white" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>{op.name}</div>
          </div>
          {focusOn && <span className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center bg-ef-accent font-mono text-base font-black text-black" style={CUT}>{selected.indexOf(focusId) + 1}</span>}
        </div>

        {/* 오른쪽: 상세 + 편성 */}
        <div className="hud-panel dd-cut flex max-h-[calc(100vh-350px)] flex-col overflow-y-auto p-4">
          {/* 무기 */}
          {weaponOf(focusId) && (
            <div className="hud-tile dd-cut mb-2.5 px-2.5 py-2">
              <div className="flex items-center gap-2">
                {weaponImage(focusId) ? <img src={weaponImage(focusId)} alt="" className="h-8 w-8 shrink-0 object-contain" /> : <span className="text-base leading-none">{WEAPON_ICON[weaponOf(focusId)!]}</span>}
                <span className="min-w-0 flex-1 truncate font-mono text-[15px] font-bold text-ef-ink">{weaponName(focusId)} <span className="font-normal text-ef-muted">{WEAPON_KO[weaponOf(focusId)!]}</span></span>
                <span className="shrink-0 font-mono text-[14px] font-bold text-white/85">ATK {OP_WEAPON_STATS[focusId]?.atk ?? "-"} · {weaponEffectText(focusId)}</span>
              </div>
              {weaponSeriesText(focusId) && (
                <div className="mt-1.5 border-t border-ef-line/40 pt-1.5">
                  <div className="font-mono text-[14px] font-bold text-purple-300">◈ {weaponSeriesName(focusId)}</div>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-ef-ink/70">{weaponSeriesText(focusId)}</p>
                </div>
              )}
            </div>
          )}

          {/* 능력치 */}
          <div className="hud-tile dd-cut mb-2.5 px-2.5 py-2">
            <div className="mb-1.5 font-mono text-[13px] font-bold uppercase tracking-wider text-ef-muted">능력치 <span className="font-normal text-ef-muted">· 장비 포함</span></div>
            <div className="grid grid-cols-4 gap-x-2 gap-y-1">
              {([["HP", unit.maxHp], ["공격", unit.attack], ["속도", unit.speed], ["방어", gearDef]] as [string, number][]).map(([k, v]) => (
                <div key={k} className="flex flex-col leading-tight">
                  <span className="font-mono text-[12px] uppercase tracking-wider text-ef-muted">{k}</span>
                  <span className="font-mono text-[17px] font-black tabular-nums text-white">{v}</span>
                </div>
              ))}
            </div>
            {unit.attrs && (() => {
              const ms = OP_MAINSUB[unit.id]; // [주요, 보조] 능력치 키
              const rows: [string, "str" | "agi" | "int" | "wil", number, string][] = [["힘", "str", unit.attrs.str, "체력 · 일반 공격 피해"], ["민첩", "agi", unit.attrs.agi, "속도"], ["지능", "int", unit.attrs.int, "스킬 피해"], ["의지", "wil", unit.attrs.wil, "유틸 · 궁극기 게이지"]];
              return (
                <div className="mt-1.5 border-t border-ef-line/40 pt-1.5">
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[13px]">
                    {rows.map(([k, key, v, t]) => {
                      const main = ms?.[0] === key, sub = ms?.[1] === key;
                      return <span key={k} className={main ? "text-ef-accent-soft" : "text-ef-muted"} title={`${k} → ${t}${main ? " · 주요 능력치" : sub ? " · 보조 능력치" : ""}`}>{main ? "★ " : sub ? "☆ " : ""}{k} <b className={main ? "text-ef-accent" : "text-ef-ink"}>{v}</b></span>;
                    })}
                  </div>
                  {ms && <div className="mt-1 font-mono text-[12px] text-ef-muted">장비 제작 우선 → <b className="text-ef-accent-soft">★ 주요 {ATTR_KO[ms[0]]}</b> · <span className="text-ef-ink">☆ 보조 {ATTR_KO[ms[1]]}</span> <span className="text-ef-muted/60">— 공격력 = 주요×0.5% + 보조×0.2%</span></div>}
                </div>
              );
            })()}
            {/* 결 「전략 수립」 듀얼폼 — 장비 한 칸 차이로 뒤집히므로 현재 폼과 판정 근거를 항상 노출한다. */}
            {focusId === "arcane" && geared.panelAttrs && (() => {
              const p = geared.panelAttrs!; const wis = p.int >= p.wil; const gap = Math.abs(Math.round(p.int - p.wil));
              return (
                <div className="mt-1.5 border-t border-ef-line/40 pt-1.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[13px]">
                    <span className="font-bold" style={{ color: wis ? "#ff9a2f" : "#67e8f9" }}>{wis ? "진결 · 지혜" : "진결 · 의지"}</span>
                    <span className="text-ef-muted">{wis ? "딜 폼 — 배틀 222% · 궁 880% · 강제 부식" : "서폿 폼 — 배틀 133% · 궁 400% · 자연/냉기 취약↑ · 아츠 부착 부여"}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[12px] text-ef-muted">
                    패널 지능 {Math.round(p.int)} {wis ? "≥" : "<"} 의지 {Math.round(p.wil)} (차이 {gap}) — 장비·무기 능력치로 폼이 결정됩니다
                  </div>
                  <div className="mt-0.5 font-mono text-[12px]" style={{ color: "#86efac" }}>
                    {wis ? "결 본인 딜이 최대 — 범용 조합" : "자기 딜을 팀 딜로 환원 — 자연·냉기 딜러와 함께 쓸 때 이득"}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 스킬 */}
          <div className="mb-2.5">
            <div className="mb-1.5 font-mono text-[14px] font-bold uppercase tracking-[0.2em] text-ef-accent/70">스킬</div>
            <div className="space-y-1.5">
              {skills.map((sk) => {
                const el = sk.element ?? "physical";
                const stg = sk.staggerVal ?? (sk.kind === "ult" ? 25 : sk.kind === "attack" ? 0 : 10); // 불균형치 기본값
                const tone = kindTone[sk.kind];
                return (
                <div key={sk.id} className="flex items-start gap-2 border border-ef-line/40 bg-black/20 px-2 py-1.5">
                  <img src={skillIcon(focusId, sk.kind)} alt="" className="mt-0.5 h-9 w-9 shrink-0 border border-ef-line/60 bg-black/40 object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="shrink-0 border px-1 py-px font-mono text-[10px] font-bold uppercase tracking-wide" style={{ color: tone, borderColor: `${tone}66` }}>{kindLabel[sk.kind]}</span>
                      <span className="truncate font-mono text-[15px] font-bold text-white">{sk.name}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[12px]">
                      {sk.power > 0 && <span className="font-bold" style={{ color: elementColor[el] }}>{Math.round(sk.power * 100)}%</span>}
                      {sk.extra && <span className="font-bold text-orange-300/90">{sk.extra}</span>}
                      <span className="text-ef-muted">{elementName[el]} · {tgtType(sk.target)}</span>
                      {sk.kind === "battle" && <span className="text-orange-300/80">게이지 −{sk.gaugeCost ?? 100}</span>}
                      {sk.gaugeGain ? <span className="text-emerald-300/80">게이지 +{sk.gaugeGain}</span> : null}
                      {stg > 0 && <span className="text-yellow-300/75">불균형 +{stg}</span>}
                    </div>
                    {sk.requiresText && <div className="mt-0.5 font-mono text-[12px] text-red-300/75">🔒 발동 조건: {sk.requiresText}</div>}
                    {sk.note && <div className="mt-0.5 text-[13px] leading-snug text-ef-muted">{sk.note}</div>}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* 재능 */}
          {talents.length > 0 && (
            <div className="mb-2.5">
              <div className="mb-1.5 font-mono text-[14px] font-bold uppercase tracking-[0.2em] text-ef-accent/70">재능</div>
              <div className="space-y-1.5">
                {talents.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {t.icon && <img src={t.icon} alt="" className="h-8 w-8 shrink-0 border border-ef-line/60 bg-black/40 object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} />}
                    <div className="min-w-0"><div className="font-mono text-[15px] font-bold text-white">{t.name}</div><div className="line-clamp-2 text-[14px] leading-snug text-ef-muted" title={t.desc}>{t.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 목표 장비 — 맨몸 시작 → 공업소에서 이 빌드를 목표로 제작. [장비 변경] 모달에서 세트·부위 교체.
              (스킬 강화는 편성이 아니라 런 중 공업소에서 재화로 단조 — 성장축 통일) */}
          <div className="hud-tile dd-cut mb-3 px-2.5 py-2.5">
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-mono text-[13px] uppercase tracking-wider text-ef-muted">목표 장비</span>
              {/* 시트 1순위엔 세트 효과를 포기하고 부품 실능력치를 택한 조합 빌드가 있다(아케쿠리 등) → 발동 세트를 그대로 표기 */}
              <span className="font-mono text-[15px] font-bold text-ef-ink">{active.length ? `${active.join(" · ")} 세트` : "조합 빌드"}</span>
              {!active.length && <span className="font-mono text-[12px] text-ef-muted">세트 효과 대신 부품 능력치 우선</span>}
              {opSet(focusId) === opRecSet(focusId) && <span className="font-mono text-[12px] text-ef-accent">★추천</span>}
              <button type="button" title="목표 장비를 바꿉니다 — 세트를 통째로 고르거나 부위별로 다른 부품을 끼울 수 있습니다. 공업소는 여기서 정한 빌드를 목표로 제작합니다." onClick={() => setGearTab("set")} className="dd-cut ml-auto shrink-0 border border-ef-line px-2.5 py-0.5 font-mono text-[13px] font-bold uppercase text-ef-muted transition hover:border-ef-accent/60 hover:text-ef-accent">⚙ 장비 변경</button>
              {/* 「장비 변경」이 있는 줄 몰라 추천 세트를 그대로 쓰는 경우가 많다 — 바꿀 수 있다고 먼저 말해 준다 */}
              <span className="w-full font-mono text-[12px] text-ef-muted">맨몸으로 시작 · 공업소에서 이 빌드를 목표로 제작 · <b className="text-ef-accent-soft">우측 「⚙ 장비 변경」에서 세트·부위를 바꿀 수 있습니다</b> · <span className="font-mono text-[13px] text-ef-ink/70">{attrsText(gearAttrs) || `능력치 +${gearGrade}`} · 방어 +{gearDef}</span></span>
              {OP_GEAR_ALT[focusId] && (
                <span className="flex w-full flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[12px] text-ef-muted">빌드</span>
                  {[{ name: "서폿 세팅", note: "시트 1순위 — 궁 충전·의지" }, ...OP_GEAR_ALT[focusId]].map((b, i) => {
                    const on = (altBuild[focusId] ?? -1) === i - 1;
                    return (
                      <button key={b.name} type="button" title={b.note}
                        onClick={() => setAltBuild((m) => ({ ...m, [focusId]: i - 1 }))}
                        className={`dd-cut border px-2 py-0.5 font-mono text-[12px] font-bold transition ${on ? "border-ef-accent text-ef-accent" : "border-ef-line text-ef-muted hover:border-ef-accent/60 hover:text-white"}`}>
                        {b.name}
                      </button>
                    );
                  })}
                </span>
              )}
              {active.map((n) => <span key={n} className="w-full truncate font-mono text-[13px] text-green-300">◆ {setEffectText(n)}</span>)}
            </div>
            <div className="space-y-1.5">
              {pcs.map((pc) => { const named = pc.set && pc.set !== "?"; const on = named && active.includes(pc.set); const empty = pc.name === "없음"; const swapped = !!pieceChoice[focusId]?.[pc.slot]; return (
                <div key={pc.slot} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-ef-line/60 bg-black/40">{!empty && pieceImage(pc.name) ? <img src={pieceImage(pc.name)} alt="" loading="lazy" className="h-full w-full object-contain" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} /> : <span className="text-[12px] text-ef-muted">—</span>}</span>
                  <span className="w-9 shrink-0 font-mono text-[12px] uppercase tracking-wider text-ef-accent/70">{gearSlotName(pc.slot)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-[14px] font-bold text-ef-ink" title={pc.name}>{pc.name}{swapped && <span className="ml-1 text-[11px] text-ef-accent">교체됨</span>}</div>
                    {empty ? <div className="font-mono text-[12px] text-ef-muted">미장착</div>
                      : <div className="font-mono text-[12px] text-ef-muted">능력치 <b className="text-ef-ink/80">+{pc.grade}</b> · 방어 <b className="text-ef-ink/80">+{pc.def}</b>{pc.dmg ? <> · <span className="text-emerald-300/70">{pieceDmg(pc)}</span></> : null}{pc.slots > 1 ? <span className="text-ef-muted/70" title="원작은 부품 2슬롯 — 2슬롯 몫으로 2배 적용"> (2슬롯)</span> : null} ·{named ? <span style={{ color: on ? "#e8c56a" : "#8a8a92" }}>{on ? "◆" : "◇"} {pc.set}</span> : <span className="text-[#67e8f9aa]">자유</span>}</div>}
                  </div>
                  <button type="button" onClick={() => setGearTab(pc.slot)} className="dd-cut shrink-0 border border-ef-line px-2 py-0.5 font-mono text-[12px] font-bold uppercase text-ef-muted transition hover:border-ef-accent/60 hover:text-ef-accent">교체</button>
                </div>
              ); })}
            </div>
          </div>

          {/* 편성 추가/해제 — 패널 하단 고정(sticky). 스킬·재능·목표 장비가 길어 예전엔 스크롤을
              끝까지 내려야 버튼이 나왔다. 항상 손 닿는 곳에 둔다. */}
          <div className="sticky bottom-0 z-10 -mx-4 mt-auto px-4 pb-1 pt-2" style={{ background: "linear-gradient(180deg, transparent, #0e0e10 28%)" }}>
          <button type="button" onClick={() => toggle(focusId)} disabled={focusFull} className="dd-cut w-full py-3 font-mono text-sm font-black uppercase tracking-[0.14em] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={focusOn ? { background: "linear-gradient(180deg,#3a1512,#241010)", color: "#f0776e", border: "1px solid #b3312a88" } : focusFull ? { background: "#16161a", color: "#777" } : { background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a", boxShadow: "0 0 22px -4px rgba(255,154,47,0.7)" }}>
            {focusOn ? "◀ 편성 해제" : focusFull ? "부대 가득 참 (4/4)" : "편성 추가 ▶"}
          </button>
          </div>
        </div>
      </div>

      {/* 장비 변경 모달 — 세트/부위별 교체 */}
      {gearTab && (
        <div onClick={() => setGearTab(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div onClick={(e) => e.stopPropagation()} className="flex max-h-[88vh] w-full max-w-[640px] flex-col border border-ef-accent/50 bg-[#0d0906]" style={CUT}>
            {/* 헤더 */}
            <div className="flex items-center gap-2 border-b border-ef-line p-3.5">
              <span className="font-mono text-lg font-bold text-white">장비 변경 <span className="text-sm text-ef-muted">— {op.name}</span></span>
              <span className="ml-2 font-mono text-[13px] text-ef-ink/70">{attrsText(gearAttrs) || `능력치 +${gearGrade}`} · 방어 +{gearDef}</span>
              <button type="button" onClick={() => setGearTab(null)} className="ml-auto shrink-0 border border-ef-line px-2 py-1 font-mono text-sm text-ef-muted transition hover:border-ef-accent/60 hover:text-white">✕</button>
            </div>
            {/* 탭: 세트 / 방어구 / 장갑 / 부품 */}
            <div className="flex gap-1 border-b border-ef-line px-3 py-2">
              {(["set", "armor", "gloves", "kit1", "kit2"] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => setGearTab(tab)} className={`dd-cut flex-1 border px-2 py-1.5 font-mono text-[14px] font-bold uppercase tracking-wider transition ${gearTab === tab ? "border-ef-accent bg-ef-accent/15 text-ef-accent" : "border-ef-line text-ef-muted hover:border-ef-accent/50 hover:text-ef-ink"}`}>
                  {tab === "set" ? "세트" : gearSlotName(tab)}
                </button>
              ))}
            </div>
            {/* 콘텐츠 */}
            <div className="overflow-y-auto p-3">
              {gearTab === "set" ? (
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {[...SET_NAMES].sort((a, b) => (a === opRecSet(focusId) ? -1 : 0) - (b === opRecSet(focusId) ? -1 : 0)).map((sn) => { const sel = opSet(focusId) === sn; const rec = sn === opRecSet(focusId); return (
                    <button key={sn} type="button" onClick={() => { setSetChoice((c) => { const n = { ...c }; if (rec) delete n[focusId]; else n[focusId] = sn; return n; }); }} className={`dd-cut border px-2.5 py-1.5 text-left transition ${sel ? "border-ef-accent bg-ef-accent/10" : "border-ef-line hover:border-ef-accent/50"}`}>
                      <div className="flex items-center gap-1.5"><span className="font-mono text-[15px] font-bold text-white">{sn}</span>{rec && <span className="font-mono text-[11px] text-ef-accent">★추천</span>}{sel && <span className="font-mono text-[11px] text-ef-accent-soft">● 선택</span>}</div>
                      <div className="mt-0.5 font-mono text-[13px] leading-snug text-ef-muted">{setEffectText(sn)}</div>
                    </button>
                  ); })}
                </div>
              ) : (
                <>
                  <div className="mb-2 font-mono text-[13px] text-ef-muted">{gearSlotName(gearTab)} 후보 · <span className="text-ef-muted">{op.element} 효율순</span></div>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {slotOptions(pieceSlotOf(gearTab), op.element).map((opt) => { const sel = lo[gearTab as LoadoutSlot] === opt.id; return (
                      <button key={opt.id} type="button" onClick={() => { const slot = gearTab as LoadoutSlot; setPieceChoice((c) => ({ ...c, [focusId]: { ...c[focusId], [slot]: opt.id } })); }} className={`dd-cut flex items-center gap-2 border p-2 text-left transition ${sel ? "border-ef-accent bg-ef-accent/10" : "border-ef-line hover:border-ef-accent/50"}`}>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-ef-line/50 bg-black/40">{pieceImage(opt.name) ? <img src={pieceImage(opt.name)} alt="" loading="lazy" className="h-full w-full object-contain" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} /> : null}</span>
                        <span className="min-w-0 flex-1"><span className="block truncate font-mono text-[15px] font-bold text-white">{opt.name}{sel && <span className="ml-1 text-[11px] text-ef-accent">● 착용</span>}</span><span className="font-mono text-[13px] text-ef-ink/70">{attrsText(opt.attrs) || `능력치 +${opt.grade.base}`} · 방어 +{opt.def} · {pieceDmg(opt, 1)}</span><span className="block font-mono text-[12px] text-ef-muted">{opt.set !== "?" ? opt.set + " 세트" : "자유 슬롯"}</span></span>
                      </button>
                    ); })}
                  </div>
                  {!!pieceChoice[focusId]?.[gearTab as LoadoutSlot] && <button type="button" onClick={() => { const slot = gearTab as LoadoutSlot; setPieceChoice((c) => { const n = { ...c }; const st = { ...n[focusId] }; delete st[slot]; if (Object.keys(st).length) n[focusId] = st; else delete n[focusId]; return n; }); }} className="mt-2 w-full border border-ef-line py-1.5 font-mono text-[13px] font-bold uppercase text-ef-muted transition hover:border-ef-accent/50 hover:text-ef-ink">↺ 추천 부위로 복원</button>}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
