"use client";

import { useState } from "react";
import { ChevronLeft, Hammer, Check, Lock } from "lucide-react";

import { GEAR_PIECES_BY_SET_SLOT, GEAR_PIECE_BY_ID, GEAR_SLOTS, gearSlotName, pieceImage, slotOptions, type GearPiece, type GearSlot } from "../gear";
import { craftCost, forgeCost, skillForgeCost, canAfford, pieceLevel, isOwned, type CraftState } from "../craft";
import { SKILL_MAX, skillLabel } from "../progress";
import { OPERATORS, avatarUrl } from "../roster";
import type { PartyMember } from "../run";
import { RESOURCE_ICON } from "../items";

const CUT = { clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" };
const DMG_KO: Record<string, string> = { ult: "궁극 피해", battle: "배틀 피해", link: "연계 피해", attack: "일반 피해", all: "물리 피해", elem: "아츠 피해", atkPct: "공격력", hpPct: "생명력", critRate: "치명 확률", critDmg: "치명 피해", energy: "궁충 효율", ultEff: "궁충 효율", artsStr: "아츠 강도", vsBroken: "불균형 피해" };
const dmgText = (p: GearPiece) => { if (!p.dmg) return ""; const pct = ["hpPct"].includes(p.dmg.kind) || p.dmg.base < 1; return `${DMG_KO[p.dmg.kind] ?? p.dmg.kind} +${pct ? Math.round(p.dmg.base * 100) + "%" : Math.round(p.dmg.base)}`; };
const SETS = ["개척", "열 작업용", "M. I. 경찰용", "본 크러셔", "식양의 흐름", "고검의 잔향", "검술사", "생체 보조", "식양의 숨결", "조류의 물결", "청파", "응룡 50식", "펄스식", "재앙 방호"];

// 단조 레벨(0~3) 핍
function ForgePips({ lv }: { lv: number }) {
  return <span className="inline-flex items-center gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i < lv ? "#ff9a2f" : "#3a3a40", boxShadow: i < lv ? "0 0 4px #ff9a2f" : undefined }} />)}</span>;
}
// 재료 비용(감당 가능 여부 색상)
function Cost({ parts, permits, ok }: { parts: number; permits: number; ok: boolean }) {
  return <span className={`font-mono text-[12px] tabular-nums ${ok ? "text-ef-muted" : "text-red-400/90"}`} title="제작 비용 — 부품 · 관리권">{parts}<span className="opacity-55">부품</span> {permits}<span className="opacity-55">관리권</span></span>;
}

export default function CraftPanel({ craft, party = [], onCraft, onForge, onSwap, onForgeSkill, onClose }: { craft: CraftState; party?: PartyMember[]; onCraft: (id: string) => boolean; onForge: (id: string) => boolean; onSwap?: (opId: string, slot: GearSlot, pieceId: string) => void; onForgeSkill?: (opId: string) => boolean; onClose: () => void }) {
  const [set, setSet] = useState(SETS[0]);
  const [tab, setTab] = useState<"party" | "catalog">(party.length > 0 ? "party" : "catalog");
  const [swap, setSwap] = useState<{ opId: string; slot: GearSlot } | null>(null); // 교체 피커 열림 슬롯
  const affordCraft = (p: GearPiece) => { const c = craftCost(p); return craft.mats.parts >= c.parts && craft.mats.permits >= c.permits; };
  const affordForge = (lv: number) => { const c = forgeCost(lv); return craft.mats.parts >= c.parts && craft.mats.permits >= c.permits; };
  const opName = (id: string) => OPERATORS.find((o) => o.id === id)?.name ?? id;

  // 피스 타일(부대·카탈로그 공용). onSwapClick 주면 "변경" 버튼 표시(부대 장비 슬롯 교체).
  const PieceTile = ({ p, slotLabel, onSwapClick, swapOpen }: { p: GearPiece; slotLabel?: boolean; onSwapClick?: () => void; swapOpen?: boolean }) => {
    const owned = isOwned(craft, p.id); const lv = pieceLevel(craft, p.id); const cc = craftCost(p); const fc = forgeCost(lv);
    const img = pieceImage(p.name); const canC = affordCraft(p); const canF = affordForge(lv);
    return (
      <div className={`hud-tile dd-cut flex items-center gap-2.5 p-2 ${owned ? "!border-ef-accent/45" : ""}`}>
        {onSwapClick && <button type="button" onClick={onSwapClick} title="장착한 장비를 다른 피스로 교체" className={`dd-cut flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-[15px] font-bold transition ${swapOpen ? "border-ef-accent bg-ef-accent/15 text-ef-accent" : "border-ef-line text-ef-muted hover:border-ef-accent/60 hover:text-ef-accent"}`}>⇄</button>}
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center border border-ef-line/60 bg-black/50" style={owned ? { boxShadow: "inset 0 0 0 1px #ff9a2f44" } : undefined}>
          {img ? <img src={img} alt="" loading="lazy" className="h-full w-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} /> : <span className="font-mono text-[12px] text-ef-muted">—</span>}
          {owned && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-sm bg-black/90 px-1 py-px"><ForgePips lv={lv} /></span>}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate font-mono text-[14px] font-bold text-white" title={p.name}>{slotLabel && <span className="shrink-0 border border-ef-line/60 px-1 py-px text-[11px] font-normal uppercase tracking-wide text-ef-muted">{gearSlotName(p.slot)}</span>}<span className="truncate">{p.name}</span></div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[13px] text-ef-muted">
            <span>방어 <b className="text-ef-ink/80">{p.def}</b></span>
            <span>능력치 <b className="text-ef-ink/80">{p.grade.base}</b></span>
            {p.dmg && <span className="text-emerald-300/75">{dmgText(p)}</span>}
          </div>
        </div>
        {!owned ? (
          <button type="button" disabled={!canC} onClick={() => onCraft(p.id)} className={`dd-cut flex shrink-0 flex-col items-center gap-0.5 border px-3 py-1.5 transition disabled:opacity-45 ${canC ? "border-ef-accent bg-ef-accent/15 text-ef-accent shadow-[0_0_10px_rgba(255,154,47,0.18)] hover:bg-ef-accent/28" : "border-ef-line text-ef-muted"}`}>
            <span className="flex items-center gap-1 font-mono text-[14px] font-bold uppercase">{canC ? <Hammer className="h-3 w-3" /> : <Lock className="h-3 w-3" />}제작</span>
            <Cost parts={cc.parts} permits={cc.permits} ok={canC} />
          </button>
        ) : lv < 3 ? (
          <button type="button" disabled={!canF} onClick={() => onForge(p.id)} className={`dd-cut flex shrink-0 flex-col items-center gap-0.5 border px-2.5 py-1.5 transition disabled:opacity-45 ${canF ? "border-ef-accent/60 text-ef-accent-soft hover:bg-ef-accent/10" : "border-ef-line text-ef-muted"}`}>
            <span className="font-mono text-[14px] font-bold uppercase">단조 {lv}→{lv + 1}</span>
            <Cost parts={fc.parts} permits={fc.permits} ok={canF} />
          </button>
        ) : (
          <span className="flex shrink-0 flex-col items-center gap-0.5 border border-green-400/30 px-2.5 py-1.5 font-mono text-[14px] font-bold uppercase text-green-300" style={CUT}><Check className="h-3.5 w-3.5" />최대</span>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6">
      {/* 헤더 */}
      <div className="hud-panel dd-cut mb-3 flex items-center gap-3 px-3 py-2.5">
        {/* 뉴비가 '원정 포기'밖에 못 찾던 문제 — 나가는 길에 라벨을 붙인다 */}
        <button type="button" onClick={onClose} className="hud-btn flex h-9 shrink-0 items-center gap-1 whitespace-nowrap px-2.5 font-mono text-[13px] font-bold text-ef-muted hover:text-white" style={CUT} aria-label="던전으로 돌아가기"><ChevronLeft className="h-5 w-5" />던전으로</button>
        <Hammer className="h-6 w-6 text-ef-accent" style={{ filter: "drop-shadow(0 0 6px rgba(255,154,47,0.5))" }} />
        <div>
          <p className="font-mono text-[13px] font-bold uppercase tracking-[0.32em] text-ef-accent/70">Industry · 장비 제조</p>
          <h2 className="font-mono text-xl font-black uppercase tracking-[0.12em] text-white">공업소</h2>
          <p className="mt-0.5 font-mono text-[13px] text-ef-muted">장비를 제작·단조하면 능력치·피해가 올라 전투가 수월해집니다 (부품·관리권 소모)</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hud-tile flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-sm" style={CUT} title="장비 부품 — 제작·단조 재료"><img src={RESOURCE_ICON.parts} alt="" className="h-4.5 w-4.5 shrink-0 object-contain" /><b className="text-white">{craft.mats.parts}</b><span className="text-[13px] text-ef-muted">부품</span></span>
          <span className="hud-tile flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-sm" style={CUT} title="관리권 — 제작·단조 재료"><img src={RESOURCE_ICON.permits} alt="" className="h-4.5 w-4.5 shrink-0 object-contain" /><b className="text-white">{craft.mats.permits}</b><span className="text-[13px] text-ef-muted">관리권</span></span>
          {/* 제작을 마치고 돌아가는 주 동선 — 강조해서 '원정 포기'와 헷갈리지 않게 */}
          <button type="button" onClick={onClose} className="dd-cut flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap border border-ef-accent/70 bg-ef-accent/15 px-3 font-mono text-sm font-bold text-ef-accent hover:bg-ef-accent/25">제작 완료 · 던전으로 ▶</button>
        </div>
      </div>

      {/* 탭: 부대 장비 / 전체 카탈로그 */}
      <div className="mb-3 flex items-center gap-2">
        {party.length > 0 && <button type="button" onClick={() => setTab("party")} className={`hud-btn dd-cut px-3.5 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider ${tab === "party" ? "hud-btn-on" : "text-ef-muted"}`}>부대 장비</button>}
        <button type="button" onClick={() => setTab("catalog")} className={`hud-btn dd-cut px-3.5 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider ${tab === "catalog" ? "hud-btn-on" : "text-ef-muted"}`}>전체 카탈로그</button>
        <span className="ml-1 font-mono text-[13px] text-ef-muted">{tab === "party" ? "부대가 실제 착용한 피스 — 제작·단조 우선" : "세트별 대체 피스 제작"}</span>
      </div>

      {/* 부대 장비 */}
      {tab === "party" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {party.map((m) => {
            const op = OPERATORS.find((o) => o.id === m.id);
            return (
              <div key={m.id} className="hud-panel dd-cut p-3">
                <div className="mb-2 flex items-center gap-2">
                  <img src={avatarUrl(m.id)} alt="" loading="lazy" className="h-9 w-9 shrink-0 border border-ef-line object-cover" style={{ background: "#000" }} />
                  <span className="font-mono text-[17px] font-bold text-white">{opName(m.id)}</span>
                  {op && <span className="font-mono text-[13px] uppercase text-ef-muted">{op.element}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {GEAR_SLOTS.map((slot) => {
                    const ref = m.loadout?.[slot]; const p = ref ? GEAR_PIECE_BY_ID[ref] : undefined;
                    const open = swap?.opId === m.id && swap.slot === slot;
                    return (
                      <div key={slot}>
                        {p ? <PieceTile p={p} slotLabel onSwapClick={onSwap ? () => setSwap(open ? null : { opId: m.id, slot }) : undefined} swapOpen={open} /> : null}
                        {/* 교체 피커 */}
                        {open && onSwap && (
                          <div className="mt-1 grid max-h-48 grid-cols-2 gap-1 overflow-y-auto border border-ef-accent/30 bg-black/40 p-1.5" style={CUT}>
                            {slotOptions(slot, op?.element).map((opt) => { const sel = ref === opt.id; return (
                              <button key={opt.id} type="button" onClick={() => { onSwap(m.id, slot, opt.id); setSwap(null); }} className={`dd-cut flex items-center gap-1.5 border p-1 text-left transition ${sel ? "border-ef-accent bg-ef-accent/10" : "border-ef-line hover:border-ef-accent/50"}`}>
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-ef-line/50 bg-black/40">{pieceImage(opt.name) ? <img src={pieceImage(opt.name)} alt="" className="h-full w-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} /> : null}</span>
                                <span className="min-w-0"><span className="block truncate font-mono text-[13px] font-bold text-white">{opt.name}</span><span className="font-mono text-[12px] text-emerald-300/70">{dmgText(opt)}</span></span>
                              </button>
                            ); })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* 스킬 단조 — 재화(부품·관리권)로 skillRank 업그레이드. 다음 전투부터 스킬 딜 반영 */}
                {onForgeSkill && (() => {
                  const rank = m.progress?.skillRank ?? 0;
                  const maxed = rank >= SKILL_MAX;
                  const cost = skillForgeCost(rank);
                  const ok = canAfford(craft.mats, cost);
                  return (
                    <div className="mt-2 flex items-center gap-2 border-t border-ef-line/40 pt-2">
                      <span className="font-mono text-[13px] text-ef-muted">스킬 강화</span>
                      <span className="font-mono text-sm font-bold" style={{ color: rank > 0 ? "#67e8f9" : "#e6e6e8" }}>{skillLabel(rank)}</span>
                      {maxed ? <span className="ml-auto font-mono text-[13px] text-ef-accent-soft">최대 강화</span> : <>
                        <span className="font-mono text-[13px] text-ef-muted">→ {skillLabel(rank + 1)}</span>
                        <button type="button" disabled={!ok} onClick={() => onForgeSkill(m.id)} title="스킬 랭크를 올려 딜을 강화 (다음 전투부터 반영)" className={`dd-cut ml-auto flex items-center gap-1.5 px-2.5 py-1 font-mono text-[13px] font-bold ${ok ? "border border-ef-accent/60 text-ef-accent hover:bg-ef-accent/10" : "border border-ef-line/40 text-ef-muted opacity-50 cursor-not-allowed"}`}>
                          <Hammer className="h-3 w-3" />단조 <Cost parts={cost.parts} permits={cost.permits} ok={ok} /></button>
                      </>}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* 전체 카탈로그 */}
      {tab === "catalog" && (
        <>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SETS.map((s) => <button key={s} type="button" onClick={() => setSet(s)} className={`hud-btn dd-cut px-2.5 py-1 font-mono text-[15px] font-bold ${set === s ? "hud-btn-on" : "text-ef-muted"}`}>{s}</button>)}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {GEAR_SLOTS.map((slot: GearSlot) => {
              const pieces = GEAR_PIECES_BY_SET_SLOT[set]?.[slot] ?? [];
              return (
                <div key={slot} className="hud-panel dd-cut p-2.5">
                  <div className="mb-2 font-mono text-[15px] font-bold uppercase tracking-[0.2em] text-ef-accent/80">{gearSlotName(slot)} <span className="font-normal text-ef-muted">· {pieces.length}</span></div>
                  <div className="flex flex-col gap-1.5">
                    {pieces.map((p) => <PieceTile key={p.id} p={p} />)}
                    {!pieces.length && <div className="py-4 text-center font-mono text-[14px] text-ef-muted">피스 없음</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
