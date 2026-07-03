"use client";

import { Swords, Skull, Tent, Crown } from "lucide-react";

import { OPERATORS } from "../roster";
import { ITEMS, itemColor } from "../items";
import type { NodeKind, PartyMember, RunNode } from "../run";
import type { Element } from "../combat";

const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };

const NODE_META: Record<NodeKind, { label: string; icon: typeof Swords; tone: string }> = {
  battle: { label: "교전", icon: Swords, tone: "#d4d4d8" },
  elite: { label: "정예", icon: Skull, tone: "#fca5a5" },
  rest: { label: "야영", icon: Tent, tone: "#86efac" },
  boss: { label: "보스", icon: Crown, tone: "#ffd24a" },
};

function PartyBar({ party }: { party: PartyMember[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {party.map((m) => {
        const op = OPERATORS.find((o) => o.id === m.id);
        const ratio = m.hp / m.maxHp;
        const dead = m.hp <= 0;
        return (
          <div key={m.id} className={`min-w-[150px] flex-1 border p-2 ${dead ? "border-red-500/40 opacity-50" : "border-ef-line bg-ef-card"}`} style={CUT_SM}>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0" style={{ background: elementColor[op?.element ?? "physical"] }} />
              <span className="truncate font-mono text-xs font-bold text-white">{op?.name ?? m.id}</span>
              <span className="ml-auto font-mono text-[10px] text-ef-muted">{Math.max(0, m.hp)}/{m.maxHp}</span>
            </div>
            <div className="h-2 w-full overflow-hidden border border-ef-line bg-black/60"><div className="h-full transition-all" style={{ width: `${Math.max(0, ratio) * 100}%`, background: dead ? "#7f1d1d" : ratio < 0.35 ? "#f87171" : "#86efac" }} /></div>
          </div>
        );
      })}
    </div>
  );
}

export default function RunMap({ nodes, frontier, cleared, party, items, onEnter }: { nodes: RunNode[]; frontier: string[]; cleared: string[]; party: PartyMember[]; items: Record<string, number>; onEnter: (n: RunNode) => void }) {
  const maxDepth = Math.max(...nodes.map((n) => n.depth));
  const depths = Array.from({ length: maxDepth + 1 }, (_, d) => nodes.filter((n) => n.depth === d).sort((a, b) => a.lane - b.lane));

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7">
      <div className="mb-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Darkest Protocol · 던전 진행</p>
        <h2 className="font-mono text-xl font-black uppercase tracking-[0.15em] text-white">경로 선택</h2>
        <p className="mt-1 text-xs text-ef-muted">진행 가능한 방(강조)을 선택. 정예·보스는 위험하나 보상이 큽니다. HP는 야영에서만 회복.</p>
      </div>

      <div className="mb-3"><PartyBar party={party} /></div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ef-muted">소지 아이템</span>
        {Object.entries(items).length === 0 && <span className="font-mono text-[10px] text-ef-line">없음</span>}
        {Object.entries(items).map(([id, n]) => { const it = ITEMS[id]; if (!it) return null; return (
          <span key={id} className="flex items-center gap-1 border border-ef-line bg-ef-card px-2 py-0.5" style={CUT_SM}>
            <span className="h-2 w-2 shrink-0" style={{ background: itemColor(it.kind) }} />
            <span className="font-mono text-[10px] text-ef-ink">{it.name}</span>
            <span className="font-mono text-[10px] font-bold text-ef-accent">×{n}</span>
          </span>
        ); })}
      </div>

      <div className="overflow-x-auto border border-ef-line bg-ef-card/50 p-4" style={CUT_SM}>
        <div className="flex min-w-max items-stretch gap-6">
          {depths.map((row, d) => (
            <div key={d} className="flex flex-col justify-center gap-3">
              <div className="text-center font-mono text-[9px] uppercase tracking-wider text-ef-line">{d === maxDepth ? "심층" : `구역 ${d + 1}`}</div>
              {row.map((n) => {
                const meta = NODE_META[n.kind];
                const Icon = meta.icon;
                const isFrontier = frontier.includes(n.id);
                const isCleared = cleared.includes(n.id);
                const dim = !isFrontier && !isCleared;
                return (
                  <button
                    key={n.id}
                    type="button"
                    disabled={!isFrontier}
                    onClick={() => onEnter(n)}
                    className={`flex w-[120px] items-center gap-2 border px-3 py-2.5 text-left transition ${isFrontier ? "border-ef-accent/70 bg-ef-accent/10 hover:bg-ef-accent/20" : isCleared ? "border-ef-line/60 bg-black/30" : "border-ef-line/40 bg-ef-card/40"} ${dim ? "opacity-45" : ""}`}
                    style={{ ...CUT_SM, boxShadow: isFrontier ? `0 0 0 1px ${meta.tone}44` : undefined }}
                  >
                    <Icon className="h-5 w-5 shrink-0" style={{ color: isCleared ? "#555" : meta.tone }} />
                    <span className="min-w-0">
                      <span className="block font-mono text-sm font-bold" style={{ color: isCleared ? "#666" : "#fff" }}>{meta.label}</span>
                      {isCleared && <span className="block font-mono text-[9px] uppercase text-ef-line">완료</span>}
                      {isFrontier && <span className="block font-mono text-[9px] uppercase tracking-wider text-ef-accent">▶ 진입</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
