"use client";

// 부대 현황 — 오퍼별 장비(제작·단조)와 스킬 마스터리를 한눈에. 모달·읽기 전용(제작은 야영지 공업소에서).
import { X } from "lucide-react";
import { OPERATORS, avatarUrl, SKILLS, skillIcon } from "../roster";
import { GEAR_PIECE_BY_ID, LOADOUT_SLOTS, OP_GEAR, gearSlotName, type LoadoutSlot } from "../gear";
import { skillLabel, SKILL_MAX } from "../progress";
import { SKILL_KIND_SHORT } from "../labels";
import type { CraftState } from "../craft";
import type { PartyMember } from "../run";

const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<string, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const KIND_TONE: Record<string, string> = { attack: "#9a9aa2", battle: "#ff9a2f", link: "#67e8f9", ult: "#f5c542" };

function ForgePips({ lv }: { lv: number }) {
  return <span className="inline-flex items-center gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i < lv ? "#ff9a2f" : "#3a3a40", boxShadow: i < lv ? "0 0 4px #ff9a2f" : undefined }} />)}</span>;
}

export default function StatusPanel({ party, craft, onClose }: { party: PartyMember[]; craft: CraftState; onClose: () => void }) {
  const opName = (id: string) => OPERATORS.find((o) => o.id === id)?.name ?? id;
  return (
    <div className="flex items-center justify-center p-4" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="hud-panel dd-cut flex max-h-[92vh] w-full max-w-[1180px] flex-col" style={{ boxShadow: "0 0 60px -12px rgba(255,154,47,0.4)" }} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="flex items-center gap-3 border-b border-ef-line/50 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[13px] font-bold uppercase tracking-[0.32em] text-ef-accent/70">Squad · 부대 현황</p>
            <h2 className="font-mono text-2xl font-black uppercase tracking-[0.12em] text-white">오퍼레이터 상태</h2>
            <p className="mt-0.5 font-mono text-[13px] text-ef-muted">여기선 <b className="text-ef-ink/70">확인만</b> — 장비 제작·단조와 스킬 마스터리는 <b style={{ color: "#f5c542" }}>야영지 공업소</b>에서만.</p>
          </div>
          <button type="button" onClick={onClose} className="hud-btn flex h-10 w-10 shrink-0 items-center justify-center text-ef-muted hover:text-white" style={CUT_SM} aria-label="닫기"><X className="h-5 w-5" /></button>
        </div>

        {/* 본문 스크롤 */}
        <div className="grid gap-3 overflow-y-auto p-5 lg:grid-cols-2">
          {party.map((m) => {
            const op = OPERATORS.find((o) => o.id === m.id);
            const el = op?.element ?? "physical";
            const rec = (OP_GEAR[m.id] ?? {}) as Partial<Record<LoadoutSlot, string>>;
            const slots = LOADOUT_SLOTS.map((slot) => {
              const pid = rec[slot];
              const owned = pid != null && craft.owned[pid] != null;
              return { slot, pid, owned, lv: pid != null ? (craft.owned[pid] ?? 0) : 0 };
            });
            const ownedN = slots.filter((s) => s.owned).length;
            const totalN = slots.filter((s) => s.pid).length;
            const ranks = m.progress?.skillRanks ?? { attack: 0, battle: 0, link: 0, ult: 0 };
            const maxRank = Math.max(...Object.values(ranks));
            const skills = (SKILLS[m.id] ?? []).filter((s) => s.kind !== "attack");
            return (
              <div key={m.id} className="hud-panel dd-cut p-3.5">
                {/* 오퍼 헤더 */}
                <div className="mb-2.5 flex items-center gap-2.5">
                  <img src={avatarUrl(m.id)} alt="" loading="lazy" className="h-12 w-12 shrink-0 border-2 object-cover" style={{ borderColor: `${elementColor[el]}aa`, background: "#000" }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><span className="font-mono text-lg font-bold text-white">{opName(m.id)}</span><span className="font-mono text-[12px] uppercase" style={{ color: elementColor[el] }}>{el}</span></div>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[13px]">
                      <span style={{ color: ownedN === totalN && totalN > 0 ? "#86efac" : "#c9c9cf" }}>장비 {ownedN}/{totalN}</span>
                      <span className="text-ef-line">·</span>
                      <span style={{ color: maxRank > 0 ? "#67e8f9" : "#8a8a90" }}>마스터리 {maxRank >= SKILL_MAX ? "M3(최대)" : skillLabel(maxRank)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {/* 장비 */}
                  <div>
                    <div className="mb-1 font-mono text-[12px] font-bold uppercase tracking-wider text-ef-muted">장비</div>
                    <div className="flex flex-col gap-1">
                      {slots.map(({ slot, pid, owned, lv }) => {
                        const p = pid ? GEAR_PIECE_BY_ID[pid] : undefined;
                        return (
                          <div key={slot} className={`flex items-center gap-2 border px-2 py-1 ${owned ? "border-ef-accent/35" : "border-ef-line/40"}`} style={{ ...CUT_SM, opacity: owned ? 1 : 0.5 }}>
                            <span className="w-11 shrink-0 font-mono text-[10px] uppercase tracking-wide text-ef-muted">{gearSlotName(slot)}</span>
                            <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-white" title={p?.name}>{owned ? p?.name : "미제작"}</span>
                            {owned ? <ForgePips lv={lv} /> : <span className="shrink-0 font-mono text-[10px] text-ef-muted">—</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 스킬(마스터리 — 기본/배틀/연계/궁 각각) */}
                  <div>
                    <div className="mb-1 font-mono text-[12px] font-bold uppercase tracking-wider text-ef-muted">스킬 마스터리</div>
                    <div className="flex flex-col gap-1">
                      {[{ kind: "attack" as const, name: "일반 공격" }, ...skills].map((sk) => {
                        const r = ranks[sk.kind] ?? 0;
                        return (
                        <div key={sk.kind === "attack" ? "attack" : (sk as { id: string }).id} className="flex items-center gap-2 border border-ef-line/40 px-2 py-1" style={CUT_SM}>
                          {sk.kind !== "attack" && <img src={skillIcon(m.id, sk.kind)} alt="" className="h-4 w-4 shrink-0 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
                          <span className="w-8 shrink-0 font-mono text-[10px] font-bold uppercase" style={{ color: KIND_TONE[sk.kind] }}>{SKILL_KIND_SHORT[sk.kind as keyof typeof SKILL_KIND_SHORT] ?? sk.kind}</span>
                          <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-white" title={sk.name}>{sk.name}</span>
                          <span className="shrink-0 font-mono text-[11px] font-bold" style={{ color: r > 0 ? "#67e8f9" : "#8a8a90" }}>{skillLabel(r)}</span>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
