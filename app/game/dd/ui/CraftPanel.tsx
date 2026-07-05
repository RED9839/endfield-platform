"use client";

import { useState } from "react";
import { ChevronLeft, Hammer, Check, Lock } from "lucide-react";

import { GEAR_PIECES_BY_SET_SLOT, GEAR_PIECE_BY_ID, GEAR_SLOTS, gearSlotName, type GearPiece, type GearSlot } from "../gear";
import { craftCost, forgeCost, pieceLevel, isOwned, type CraftState } from "../craft";
import { OPERATORS } from "../roster";
import type { PartyMember } from "../run";

const CUT = { clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" };
const PRIMARY = "#ff9a2f";
const DMG_KO: Record<string, string> = { ult: "궁극 피해", battle: "배틀 피해", link: "연계 피해", attack: "일반 피해", all: "물리 피해", elem: "원소 피해", atkPct: "공격력", hpPct: "생명력", critRate: "치명 확률", critDmg: "치명 피해", energy: "궁충 효율" };
const dmgText = (p: GearPiece) => { if (!p.dmg) return ""; const pct = ["hpPct"].includes(p.dmg.kind) || p.dmg.base < 1; return `${DMG_KO[p.dmg.kind] ?? p.dmg.kind} +${pct ? Math.round(p.dmg.base * 100) + "%" : Math.round(p.dmg.base)}`; };

// 오퍼 사용 세트만(카탈로그 정리)
const SETS = ["개척", "열 작업용", "M. I. 경찰용", "본 크러셔", "식양의 흐름", "고검의 잔향", "검술사", "생체 보조", "식양의 숨결", "조류의 물결", "청파", "응룡 50식", "펄스식", "재앙 방호"];

export default function CraftPanel({ craft, party = [], onCraft, onForge, onClose }: { craft: CraftState; party?: PartyMember[]; onCraft: (id: string) => boolean; onForge: (id: string) => boolean; onClose: () => void }) {
  const [set, setSet] = useState(SETS[0]);
  const affordCraft = (p: GearPiece) => { const c = craftCost(p); return craft.mats.parts >= c.parts && craft.mats.permits >= c.permits; };
  const affordForge = (lv: number) => { const c = forgeCost(lv); return craft.mats.parts >= c.parts && craft.mats.permits >= c.permits; };
  const opName = (id: string) => OPERATORS.find((o) => o.id === id)?.name ?? id;

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7">
      <div className="mb-4 flex items-center gap-3">
        <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center border border-ef-line bg-ef-card text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT} aria-label="닫기"><ChevronLeft className="h-5 w-5" /></button>
        <div className="flex items-center gap-2">
          <Hammer className="h-6 w-6 text-ef-accent" />
          <div>
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.3em] text-ef-muted">Industry · 장비 제조</p>
            <h2 className="font-mono text-xl font-black uppercase tracking-[0.15em] text-white">공업소</h2>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 font-mono text-sm">
          <span className="border border-ef-line bg-ef-card px-2.5 py-1 text-white" style={CUT}>부품 <b className="text-ef-accent-soft">{craft.mats.parts}</b></span>
          <span className="border border-ef-line bg-ef-card px-2.5 py-1 text-white" style={CUT}>관리권 <b className="text-yellow-300">{craft.mats.permits}</b></span>
        </div>
      </div>

      {/* 부대 장착 장비 — 실제 사용 피스 바로 단조 */}
      {party.length > 0 && (
        <div className="mb-4 border border-ef-accent/25 bg-ef-accent/[0.04] p-2.5" style={CUT}>
          <div className="mb-2 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ef-accent-soft">부대 장착 장비 <span className="text-ef-line">· 단조로 강화</span></div>
          <div className="grid gap-2 sm:grid-cols-2">
            {party.map((m) => (
              <div key={m.id} className="border border-ef-line/60 bg-black/30 p-2" style={CUT}>
                <div className="mb-1.5 font-mono text-xs font-bold text-white">{opName(m.id)}</div>
                <div className="flex flex-col gap-1">
                  {GEAR_SLOTS.map((slot) => {
                    const ref = m.loadout?.[slot]; const p = ref ? GEAR_PIECE_BY_ID[ref] : undefined;
                    if (!p) return null;
                    const lv = pieceLevel(craft, p.id); const owned = isOwned(craft, p.id); const fc = forgeCost(lv); const cc = craftCost(p);
                    return (
                      <div key={slot} className="flex items-center gap-1.5">
                        <span className="w-8 shrink-0 font-mono text-[11px] uppercase text-ef-line">{gearSlotName(slot)}</span>
                        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-ef-muted" title={p.name}>{p.name}</span>
                        {p.dmg && <span className="shrink-0 font-mono text-[11px] text-ef-accent-soft">{dmgText(p)}</span>}
                        {!owned ? (
                          <button type="button" disabled={!affordCraft(p)} onClick={() => onCraft(p.id)} className="shrink-0 border border-ef-line px-1.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider transition enabled:hover:border-ef-accent/50 enabled:text-ef-ink disabled:opacity-40" style={CUT}>제작 {cc.parts}·{cc.permits}</button>
                        ) : lv < 3 ? (
                          <button type="button" disabled={!affordForge(lv)} onClick={() => onForge(p.id)} className="shrink-0 border border-ef-accent/40 px-1.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ef-accent transition enabled:hover:bg-ef-accent/10 disabled:opacity-40" style={CUT}>단조 {lv}→{lv + 1} · {fc.parts}·{fc.permits}</button>
                        ) : (
                          <span className="shrink-0 flex items-center gap-0.5 font-mono text-[11px] font-bold text-green-300"><Check className="h-3 w-3" />MAX</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 세트 탭 — 대체 피스 제작 카탈로그 */}
      <div className="mb-2 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ef-muted">전체 카탈로그 <span className="text-ef-line">· 대체 피스 제작</span></div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {SETS.map((s) => (
          <button key={s} type="button" onClick={() => setSet(s)} className={`border px-2.5 py-1 font-mono text-[13px] font-bold transition ${set === s ? "border-ef-accent/70 text-ef-accent" : "border-ef-line text-ef-muted hover:text-ef-ink"}`} style={{ ...CUT, background: set === s ? PRIMARY + "18" : "transparent" }}>{s}</button>
        ))}
      </div>

      {/* 부위별 피스 */}
      <div className="grid gap-3 md:grid-cols-3">
        {GEAR_SLOTS.map((slot: GearSlot) => {
          const pieces = GEAR_PIECES_BY_SET_SLOT[set]?.[slot] ?? [];
          return (
            <div key={slot} className="border border-ef-line bg-ef-card/40 p-2.5" style={CUT}>
              <div className="mb-2 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ef-muted">{gearSlotName(slot)} <span className="text-ef-line">· {pieces.length}</span></div>
              <div className="flex flex-col gap-1.5">
                {pieces.map((p) => {
                  const owned = isOwned(craft, p.id); const lv = pieceLevel(craft, p.id); const cc = craftCost(p); const fc = forgeCost(lv);
                  return (
                    <div key={p.id} className={`border p-2 ${owned ? "border-ef-accent/40 bg-ef-accent/5" : "border-ef-line bg-ef-card"}`} style={CUT}>
                      <div className="flex items-center gap-1.5">
                        <span className="min-w-0 flex-1 truncate font-mono text-xs font-bold text-white">{p.name}</span>
                        {owned && <span className="font-mono text-[12px] font-bold text-ef-accent">단조 {lv}/3</span>}
                      </div>
                      <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[12px] text-ef-muted">
                        <span>방어 {p.def}</span>
                        <span className="text-ef-ink">능력치 {p.grade.base}</span>
                        {p.dmg && <span className="text-ef-accent-soft">{dmgText(p)}</span>}
                      </div>
                      {!owned ? (
                        <button type="button" disabled={!affordCraft(p)} onClick={() => onCraft(p.id)} className="mt-1.5 flex w-full items-center justify-center gap-1 border border-ef-line py-1 font-mono text-[12px] font-bold uppercase tracking-wider transition enabled:hover:border-ef-accent/50 enabled:text-ef-ink disabled:opacity-40" style={CUT}>
                          {affordCraft(p) ? <Hammer className="h-3 w-3" /> : <Lock className="h-3 w-3" />} 제작 · {cc.parts}부품 {cc.permits}관리권
                        </button>
                      ) : lv < 3 ? (
                        <button type="button" disabled={!affordForge(lv)} onClick={() => onForge(p.id)} className="mt-1.5 flex w-full items-center justify-center gap-1 border border-ef-accent/40 py-1 font-mono text-[12px] font-bold uppercase tracking-wider text-ef-accent transition enabled:hover:bg-ef-accent/10 disabled:opacity-40" style={CUT}>
                          단조 +1 · {fc.parts}부품 {fc.permits}관리권
                        </button>
                      ) : (
                        <div className="mt-1.5 flex w-full items-center justify-center gap-1 border border-green-400/30 py-1 font-mono text-[12px] font-bold uppercase tracking-wider text-green-300" style={CUT}><Check className="h-3 w-3" /> 단조 최대</div>
                      )}
                    </div>
                  );
                })}
                {!pieces.length && <div className="py-4 text-center font-mono text-[12px] text-ef-line">피스 없음</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
