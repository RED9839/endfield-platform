"use client";

import { useState } from "react";
import { Swords, Skull, Tent, Crown, ChevronRight } from "lucide-react";

import { OPERATORS } from "../roster";
import { ITEMS, itemColor, itemImage, RESOURCE_ICON } from "../items";
import { enemyDrop } from "../sim";
import { LOOT_DECAY, REST_HEAL, type NodeKind, type PartyMember, type RunNode } from "../run";
import type { Element } from "../combat";

const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };

const ITEM_KIND_KO: Record<string, string> = { heal: "즉시 회복", "heal-shield": "회복+보호막", regen: "재생", ult: "궁 충전", revive: "부활", buff: "강화" };
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

export default function RunMap({ nodes, frontier, cleared, party, items, faction, floor = 0, totalFloors = 6, onEnter }: { nodes: RunNode[]; frontier: string[]; cleared: string[]; party: PartyMember[]; items: Record<string, number>; faction?: string; floor?: number; totalFloors?: number; onEnter: (n: RunNode) => void }) {
  const [itemDetail, setItemDetail] = useState<string | null>(null);
  // 노드 예상 보상(교전·정예·보스: 재화 × 층 배율 / 야영: HP 회복)
  const nodeReward = (n: RunNode) => {
    if (n.kind === "rest") return null;
    const d = enemyDrop(n.kind, n.depth, faction ?? "");
    const m = Math.pow(LOOT_DECAY, floor);
    return { parts: Math.round(d.parts * m), permits: Math.round(d.permits * m) };
  };
  const maxDepth = Math.max(...nodes.map((n) => n.depth));
  const depths = Array.from({ length: maxDepth + 1 }, (_, d) => nodes.filter((n) => n.depth === d).sort((a, b) => a.lane - b.lane));

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7">
      <div className="hud-panel dd-cut mb-4 px-4 py-3">
        <p className="font-mono text-[13px] font-bold uppercase tracking-[0.32em] text-ef-accent/70">Darkest Protocol · 던전 진행</p>
        <h2 className="font-mono text-2xl font-black uppercase tracking-[0.12em] text-white">경로 선택</h2>
        <p className="mt-1 text-[15px] text-ef-muted"><b className="text-ef-ink">{totalFloors}개 층</b>의 보스를 차례로 격파하며 등반합니다 — <span className="text-amber-300/85">층이 오를수록 적이 강해집니다</span>. 각 구역에서 방 하나(강조 표시)를 골라 다음 구역으로. 정예·보스는 위험하나 보상↑, HP는 야영에서만 회복.</p>
      </div>

      <div className="mb-3"><PartyBar party={party} /></div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[14px] font-bold uppercase tracking-wider text-ef-muted">소지 아이템</span>
        {Object.entries(items).length === 0 && <span className="font-mono text-[14px] text-ef-muted">없음</span>}
        {Object.entries(items).map(([id, n]) => { const it = ITEMS[id]; if (!it) return null; const on = itemDetail === id; return (
          <button key={id} type="button" onClick={() => setItemDetail(on ? null : id)} title="눌러서 효과 보기" className={`hud-tile dd-cut flex items-center gap-1 px-2 py-0.5 transition ${on ? "!border-ef-accent bg-ef-accent/10" : "hover:!border-ef-accent/50"}`}>
            <img src={itemImage(id)} alt="" loading="lazy" className="h-5 w-5 shrink-0 rounded-sm object-contain" style={{ background: `${itemColor(it.kind)}18` }} />
            <span className="font-mono text-[14px] text-ef-ink">{it.name}</span>
            <span className="font-mono text-[14px] font-bold text-ef-accent">×{n}</span>
          </button>
        ); })}
        {/* 선택 아이템 효과 상세 */}
        {itemDetail && ITEMS[itemDetail] && (() => { const it = ITEMS[itemDetail]; return (
          <div className="flex w-full items-start gap-2 border border-ef-accent/40 bg-black/40 px-3 py-2" style={CUT_SM}>
            <img src={itemImage(itemDetail)} alt="" loading="lazy" className="h-8 w-8 shrink-0 rounded-sm object-contain" style={{ background: `${itemColor(it.kind)}22` }} />
            <div className="min-w-0">
              <div className="flex items-center gap-2"><span className="font-mono text-sm font-bold text-white">{it.name}</span><span className="border px-1 font-mono text-[11px]" style={{ color: itemColor(it.kind), borderColor: itemColor(it.kind) + "66" }}>{ITEM_KIND_KO[it.kind] ?? it.kind}</span><span className="font-mono text-[11px] text-ef-muted">{"★".repeat(Math.min(3, Math.ceil(it.rarity / 2)))}</span></div>
              <p className="mt-0.5 font-mono text-[13px] leading-snug text-ef-muted">{it.desc}</p>
            </div>
          </div>
        ); })()}
      </div>

      <div className="hud-panel dd-cut overflow-x-auto p-4">
        <div className="flex min-w-max items-stretch gap-3">
          {depths.map((row, d) => (
            <div key={d} className="flex items-stretch gap-3">
              {d > 0 && <div className="flex items-center" aria-hidden><ChevronRight className="h-7 w-7 text-ef-accent/35" /></div>}
              <div className="flex flex-col justify-center gap-3">
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
                      {isCleared ? <span className="block font-mono text-[14px] uppercase text-ef-muted">완료</span> : (() => {
                        const rw = nodeReward(n);
                        if (n.kind === "rest") return <span className="block font-mono text-[12px] font-bold text-green-300/85">✚ HP +{Math.round(REST_HEAL * 100)}%</span>;
                        return <span className="block whitespace-nowrap font-mono text-[12px] text-amber-300/75" title="예상 보상 — 부품 · 관리권"><img src={RESOURCE_ICON.parts} alt="" className="mr-0.5 inline-block h-3.5 w-3.5 align-[-2px] object-contain" />{rw?.parts} <img src={RESOURCE_ICON.permits} alt="" className="ml-1 mr-0.5 inline-block h-3.5 w-3.5 align-[-2px] object-contain" />{rw?.permits}</span>;
                      })()}
                      {isFrontier && <span className="block font-mono text-[13px] font-bold uppercase tracking-wider text-ef-accent">▶ 진입</span>}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
