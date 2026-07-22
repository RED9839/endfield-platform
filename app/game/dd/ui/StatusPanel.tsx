"use client";

// 부대 현황 — 오퍼별 장비(제작·단조 상태)와 스킬 마스터리를 한눈에. 읽기 전용(제작은 야영지 공업소에서).
import { ChevronLeft } from "lucide-react";
import { OPERATORS, avatarUrl } from "../roster";
import { GEAR_PIECE_BY_ID, LOADOUT_SLOTS, OP_GEAR, gearSlotName, type LoadoutSlot } from "../gear";
import { skillLabel, SKILL_MAX } from "../progress";
import type { CraftState } from "../craft";
import type { PartyMember } from "../run";

const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<string, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };

// 단조 레벨(0~3) 핍 — 4피스 슬롯의 상태를 한 눈에
function ForgePips({ lv }: { lv: number }) {
  return <span className="inline-flex items-center gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i < lv ? "#ff9a2f" : "#3a3a40", boxShadow: i < lv ? "0 0 4px #ff9a2f" : undefined }} />)}</span>;
}

export default function StatusPanel({ party, craft, onClose }: { party: PartyMember[]; craft: CraftState; onClose: () => void }) {
  const opName = (id: string) => OPERATORS.find((o) => o.id === id)?.name ?? id;
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-5 sm:px-6">
      <div className="hud-panel dd-cut mb-3 flex items-center gap-3 px-3 py-2.5">
        <button type="button" onClick={onClose} className="hud-btn flex h-9 shrink-0 items-center gap-1 whitespace-nowrap px-2.5 font-mono text-[13px] font-bold text-ef-muted hover:text-white" style={CUT_SM}><ChevronLeft className="h-5 w-5" />던전으로</button>
        <div>
          <p className="font-mono text-[13px] font-bold uppercase tracking-[0.32em] text-ef-accent/70">Squad · 부대 현황</p>
          <h2 className="font-mono text-xl font-black uppercase tracking-[0.12em] text-white">오퍼레이터 상태</h2>
          <p className="mt-0.5 font-mono text-[13px] text-ef-muted">장비·스킬 마스터리 확인(읽기 전용) — 제작·강화는 <b className="text-ef-ink/70">야영지 공업소</b>에서</p>
        </div>
      </div>

      <div className="grid gap-2.5 lg:grid-cols-2">
        {party.map((m) => {
          const op = OPERATORS.find((o) => o.id === m.id);
          const rec = (OP_GEAR[m.id] ?? {}) as Partial<Record<LoadoutSlot, string>>;
          const slots = LOADOUT_SLOTS.map((slot) => {
            const pid = rec[slot];
            const owned = pid != null && craft.owned[pid] != null;
            return { slot, pid, owned, lv: pid != null ? (craft.owned[pid] ?? 0) : 0 };
          });
          const ownedN = slots.filter((s) => s.owned).length;
          const totalN = slots.filter((s) => s.pid).length;
          const rank = m.progress?.skillRank ?? 0;
          const el = op?.element ?? "physical";
          return (
            <div key={m.id} className="hud-panel dd-cut p-3">
              <div className="mb-2 flex items-center gap-2">
                <img src={avatarUrl(m.id)} alt="" loading="lazy" className="h-10 w-10 shrink-0 border object-cover" style={{ borderColor: `${elementColor[el]}88`, background: "#000" }} />
                <span className="font-mono text-[17px] font-bold text-white">{opName(m.id)}</span>
                <span className="font-mono text-[12px] uppercase" style={{ color: elementColor[el] }}>{el}</span>
                {/* 요약: 장비 N/4 · 마스터리 랭크 */}
                <span className="ml-auto flex items-center gap-2 font-mono text-[13px]">
                  <span style={{ color: ownedN === totalN ? "#86efac" : "#e6e6e8" }}>장비 {ownedN}/{totalN}</span>
                  <span style={{ color: rank > 0 ? "#67e8f9" : "#8a8a90" }}>{skillLabel(rank)}{rank >= SKILL_MAX ? " · 최대" : ""}</span>
                </span>
              </div>
              {/* 장비 4슬롯 — 착용/미제작 + 단조 핍 */}
              <div className="grid grid-cols-2 gap-1.5">
                {slots.map(({ slot, pid, owned, lv }) => {
                  const p = pid ? GEAR_PIECE_BY_ID[pid] : undefined;
                  return (
                    <div key={slot} className={`flex items-center gap-2 border px-2 py-1.5 ${owned ? "border-ef-accent/35" : "border-ef-line/40"}`} style={{ ...CUT_SM, opacity: owned ? 1 : 0.55 }}>
                      <span className="shrink-0 border border-ef-line/60 px-1 py-px font-mono text-[10px] uppercase tracking-wide text-ef-muted">{gearSlotName(slot)}</span>
                      <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-white" title={p?.name}>{owned ? p?.name : "미제작"}</span>
                      {owned ? <ForgePips lv={lv} /> : <span className="shrink-0 font-mono text-[11px] text-ef-muted">—</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
