"use client";

import { Swords, Skull, Tent, Crown } from "lucide-react";

import { OPERATORS } from "../roster";
import { ITEMS, itemColor, itemImage } from "../items";
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
          <div key={m.id} className={`hud-tile dd-cut relative min-w-[150px] flex-1 overflow-hidden p-2 ${dead ? "opacity-50" : ""}`}>
            <span className="absolute inset-y-0 left-0 w-1" style={{ background: elementColor[op?.element ?? "physical"], boxShadow: `0 0 8px ${elementColor[op?.element ?? "physical"]}` }} />
            <div className="mb-1 flex items-center gap-1.5 pl-1">
              <span className="truncate font-mono text-xs font-bold text-white">{op?.name ?? m.id}</span>
              <span className="ml-auto font-mono text-[14px] text-ef-muted">{Math.max(0, m.hp)}/{m.maxHp}</span>
            </div>
            <div className="relative ml-1 h-2 overflow-hidden rounded-[2px] bg-black/75" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 3px rgba(0,0,0,0.9)" }}>
              <div className="relative h-full rounded-[2px] transition-all duration-300" style={{ width: `${Math.max(0, ratio) * 100}%`, background: dead ? "#7f1d1d" : ratio < 0.35 ? "#f87171" : "#86efac", boxShadow: `0 0 7px ${(dead ? "#7f1d1d" : ratio < 0.35 ? "#f87171" : "#86efac")}77` }}>
                <span className="pointer-events-none absolute inset-x-0 top-0 h-[45%]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent)" }} />
              </div>
            </div>
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
      <div className="hud-panel dd-cut mb-4 px-4 py-3">
        <p className="font-mono text-[13px] font-bold uppercase tracking-[0.32em] text-ef-accent/70">Darkest Protocol · 던전 진행</p>
        <h2 className="font-mono text-2xl font-black uppercase tracking-[0.12em] text-white">경로 선택</h2>
        <p className="mt-1 text-[15px] text-ef-muted">진행 가능한 방(강조)을 선택. 정예·보스는 위험하나 보상이 큽니다. HP는 야영에서만 회복.</p>
      </div>

      <div className="mb-3"><PartyBar party={party} /></div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[14px] font-bold uppercase tracking-wider text-ef-muted">소지 아이템</span>
        {Object.entries(items).length === 0 && <span className="font-mono text-[14px] text-ef-muted">없음</span>}
        {Object.entries(items).map(([id, n]) => { const it = ITEMS[id]; if (!it) return null; return (
          <span key={id} className="hud-tile dd-cut flex items-center gap-1 px-2 py-0.5">
            <img src={itemImage(id)} alt="" loading="lazy" className="h-5 w-5 shrink-0 rounded-sm object-contain" style={{ background: `${itemColor(it.kind)}18` }} />
            <span className="font-mono text-[14px] text-ef-ink">{it.name}</span>
            <span className="font-mono text-[14px] font-bold text-ef-accent">×{n}</span>
          </span>
        ); })}
      </div>

      <div className="hud-panel dd-cut overflow-x-auto p-4">
        <div className="flex min-w-max items-stretch gap-6">
          {depths.map((row, d) => (
            <div key={d} className="flex flex-col justify-center gap-3">
              <div className="text-center font-mono text-[14px] uppercase tracking-wider text-ef-muted">{d === maxDepth ? "심층" : `구역 ${d + 1}`}</div>
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
                    className={`hud-tile dd-cut flex w-[124px] items-center gap-2 px-3 py-2.5 text-left ${isFrontier ? "!border-ef-accent/70 bg-ef-accent/[0.08]" : isCleared ? "opacity-80" : ""} ${dim ? "opacity-45" : ""}`}
                    style={isFrontier ? { boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 18px -3px ${meta.tone}88` } : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" style={{ color: isCleared ? "#555" : meta.tone, filter: isFrontier ? `drop-shadow(0 0 5px ${meta.tone})` : undefined }} />
                    <span className="min-w-0">
                      <span className="block font-mono text-sm font-bold" style={{ color: isCleared ? "#666" : "#fff" }}>{meta.label}</span>
                      {isCleared && <span className="block font-mono text-[14px] uppercase text-ef-muted">완료</span>}
                      {isFrontier && <span className="block font-mono text-[14px] font-bold uppercase tracking-wider text-ef-accent">▶ 진입</span>}
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
