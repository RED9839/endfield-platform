"use client";

import { ArrowRight, BadgeInfo, Flag, Gem, Skull, Sparkles, Store, Tent } from "lucide-react";
import { mapNodes } from "../data/maps";
import type { MapNode } from "../types/game";

const nodeVisual: Record<MapNode["type"], { label: string; icon: typeof Skull; tone: string }> = {
  battle: { label: "COMBAT", icon: Skull, tone: "border-yellow-200/40 bg-yellow-200/[0.08] text-yellow-100" },
  elite: { label: "ELITE", icon: Flag, tone: "border-red-300/40 bg-red-300/[0.08] text-red-100" },
  event: { label: "EVENT", icon: Sparkles, tone: "border-cyan-300/40 bg-cyan-300/[0.08] text-cyan-100" },
  shop: { label: "SUPPLY", icon: Store, tone: "border-emerald-300/40 bg-emerald-300/[0.08] text-emerald-100" },
  camp: { label: "CAMP", icon: Tent, tone: "border-blue-300/40 bg-blue-300/[0.08] text-blue-100" },
  boss: { label: "BOSS", icon: Gem, tone: "border-orange-300/50 bg-orange-300/[0.1] text-orange-100" },
};

function nodePosition(node: MapNode) {
  return {
    left: `${node.floor * 150}px`,
    top: `${60 + node.column * 74}px`,
  };
}

function RouteNode({ node, available, visited, onEnter }: { node: MapNode; available: boolean; visited: boolean; onEnter: (nodeId: string) => void }) {
  const visual = nodeVisual[node.type];
  const Icon = visual.icon;

  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => onEnter(node.id)}
      style={nodePosition(node)}
      className={`absolute w-52 rounded-3xl border p-4 text-left shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition ${
        available
          ? `${visual.tone} hover:-translate-y-1 hover:shadow-[0_0_36px_rgba(250,204,21,0.16)]`
          : visited
            ? "border-white/15 bg-white/[0.045] text-white/45"
            : "border-white/8 bg-black/35 text-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-current/25 bg-black/45">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-lg border border-current/20 bg-black/45 px-2 py-1 text-[10px] font-black tracking-[0.2em]">
          F{node.floor}
        </span>
      </div>
      <p className="mt-4 text-[10px] font-black tracking-[0.26em] opacity-55">{visual.label}</p>
      <h3 className="mt-1 line-clamp-1 text-lg font-black text-white">{node.title}</h3>
      <p className="mt-1 line-clamp-1 text-xs font-bold opacity-55">{node.subtitle}</p>
      <div className="mt-4 flex items-center justify-between border-t border-current/15 pt-3 text-[10px] font-black tracking-[0.18em]">
        <span>{available ? "SELECT" : visited ? "CLEARED" : "LOCKED"}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
}

export default function MapScreen({ availableNodes, visitedNodes, onEnter }: { availableNodes: string[]; visitedNodes: string[]; onEnter: (nodeId: string) => void }) {
  const availableSet = new Set(availableNodes);
  const visitedSet = new Set(visitedNodes);

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black px-4 py-6 text-white sm:px-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(250,204,21,0.14),transparent_31%),radial-gradient(circle_at_82%_12%,rgba(34,211,238,0.1),transparent_34%),linear-gradient(135deg,#050505_0%,#111009_48%,#000000_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(250,204,21,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />

      <div className="relative mx-auto max-w-[1880px]">
        <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.42em] text-yellow-100/55">ENDFIELD ROUTE MAP</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">작전 경로 선택</h1>
            <p className="mt-3 text-sm font-bold text-white/45">왼쪽에서 오른쪽으로 진행하며 다음 작전 노드를 선택합니다.</p>
          </div>
          <div className="rounded-full border border-yellow-100/20 bg-yellow-100/8 px-5 py-3 text-sm font-black text-yellow-100 shadow-[0_0_30px_rgba(250,204,21,0.12)] backdrop-blur-xl">
            CLEARED {visitedNodes.length} / ROUTE {mapNodes.length}
          </div>
        </header>

        <div className="relative overflow-x-auto rounded-[34px] border border-yellow-100/10 bg-black/55 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative h-[470px] min-w-[2200px]">
            <div className="absolute left-10 right-10 top-1/2 h-px bg-gradient-to-r from-yellow-200/5 via-yellow-200/25 to-yellow-200/5" />
            {mapNodes.map((node) => (
              <RouteNode key={node.id} node={node} available={availableSet.has(node.id)} visited={visitedSet.has(node.id)} onEnter={onEnter} />
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-yellow-100/10 bg-black/50 p-4 text-sm font-bold text-white/55 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <BadgeInfo className="h-4 w-4 text-yellow-200/60" />
            선택 가능한 노드만 밝게 표시됩니다. 교전 완료 후 이 경로 선택 화면으로 복귀합니다.
          </div>
        </div>
      </div>
    </section>
  );
}
