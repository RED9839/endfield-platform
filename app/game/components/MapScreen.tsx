"use client";

import {
  ArrowRight,
  BadgeInfo,
  Bone,
  Flag,
  Gem,
  Mountain,
  Pickaxe,
  Skull,
  Sparkles,
  Store,
  Tent,
  Waves,
} from "lucide-react";
import { mapNodes } from "../data/maps";
import type { MapNode } from "../types/game";

type NodeVisual = {
  label: string;
  icon: typeof Skull;
  fieldIcon: typeof Mountain;
  tone: string;
  line: string;
};

const nodeVisual: Record<MapNode["type"], NodeVisual> = {
  battle: {
    label: "COMBAT",
    icon: Skull,
    fieldIcon: Mountain,
    tone: "border-yellow-200/45 bg-yellow-200/[0.09] text-yellow-100",
    line: "bg-yellow-200/30",
  },
  elite: {
    label: "ELITE",
    icon: Flag,
    fieldIcon: Bone,
    tone: "border-red-300/45 bg-red-300/[0.09] text-red-100",
    line: "bg-red-300/30",
  },
  event: {
    label: "EVENT",
    icon: Sparkles,
    fieldIcon: Waves,
    tone: "border-cyan-300/45 bg-cyan-300/[0.09] text-cyan-100",
    line: "bg-cyan-300/30",
  },
  shop: {
    label: "SUPPLY",
    icon: Store,
    fieldIcon: Pickaxe,
    tone: "border-emerald-300/45 bg-emerald-300/[0.09] text-emerald-100",
    line: "bg-emerald-300/30",
  },
  camp: {
    label: "CAMP",
    icon: Tent,
    fieldIcon: Tent,
    tone: "border-blue-300/45 bg-blue-300/[0.09] text-blue-100",
    line: "bg-blue-300/30",
  },
  boss: {
    label: "BOSS",
    icon: Gem,
    fieldIcon: Gem,
    tone: "border-orange-300/55 bg-orange-300/[0.12] text-orange-100",
    line: "bg-orange-300/40",
  },
};

function nodePosition(node: MapNode) {
  return {
    left: `${node.floor * 118}px`,
    top: `${34 + node.column * 52}px`,
  };
}

function RouteNode({ node, available, visited, onEnter }: { node: MapNode; available: boolean; visited: boolean; onEnter: (nodeId: string) => void }) {
  const visual = nodeVisual[node.type];
  const Icon = visual.icon;
  const FieldIcon = visual.fieldIcon;

  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => onEnter(node.id)}
      style={nodePosition(node)}
      className={`absolute h-[124px] w-[176px] overflow-hidden rounded-[22px] border px-3 py-3 text-left shadow-[0_16px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl transition ${
        available
          ? `${visual.tone} hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(250,204,21,0.16)]`
          : visited
            ? "border-white/16 bg-white/[0.045] text-white/48"
            : "border-white/7 bg-black/32 text-white/18"
      }`}
    >
      <FieldIcon className="pointer-events-none absolute -right-3 -top-2 h-20 w-20 opacity-[0.055]" />
      <span className={`absolute inset-x-0 top-0 h-1 ${available || visited ? visual.line : "bg-white/10"}`} />

      <div className="relative flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-current/25 bg-black/45">
          <Icon className="h-4 w-4" />
        </span>
        <span className="rounded-lg border border-current/20 bg-black/45 px-2 py-1 text-[9px] font-black tracking-[0.18em]">
          F{node.floor}
        </span>
      </div>

      <p className="relative mt-3 text-[9px] font-black tracking-[0.24em] opacity-55">{visual.label}</p>
      <h3 className="relative mt-1 line-clamp-1 text-base font-black text-white">{node.title}</h3>
      <p className="relative mt-1 line-clamp-1 text-[11px] font-bold opacity-55">{node.subtitle}</p>
      <div className="relative mt-3 flex items-center justify-between border-t border-current/14 pt-2 text-[9px] font-black tracking-[0.18em]">
        <span>{available ? "SELECT" : visited ? "CLEARED" : "LOCKED"}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}

export default function MapScreen({ availableNodes, visitedNodes, onEnter }: { availableNodes: string[]; visitedNodes: string[]; onEnter: (nodeId: string) => void }) {
  const availableSet = new Set(availableNodes);
  const visitedSet = new Set(visitedNodes);

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black px-4 py-5 text-white sm:px-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(250,204,21,0.14),transparent_31%),radial-gradient(circle_at_82%_12%,rgba(34,211,238,0.1),transparent_34%),linear-gradient(135deg,#050505_0%,#111009_48%,#000000_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(250,204,21,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />

      <div className="relative mx-auto max-w-[1880px]">
        <header className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.42em] text-yellow-100/55">ENDFIELD ROUTE MAP</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">작전 경로 선택</h1>
            <p className="mt-2 text-sm font-bold text-white/45">왼쪽에서 오른쪽으로 진행하며 다음 작전 노드를 선택합니다.</p>
          </div>
          <div className="rounded-full border border-yellow-100/20 bg-yellow-100/8 px-5 py-3 text-sm font-black text-yellow-100 shadow-[0_0_30px_rgba(250,204,21,0.12)] backdrop-blur-xl">
            CLEARED {visitedNodes.length} / ROUTE {mapNodes.length}
          </div>
        </header>

        <div className="relative overflow-x-auto overflow-y-hidden rounded-[30px] border border-yellow-100/10 bg-black/58 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative h-[374px] min-w-[1780px]">
            <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-yellow-200/5 via-yellow-200/22 to-yellow-200/5" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_38%,rgba(250,204,21,0.09),transparent_18%),radial-gradient(circle_at_48%_50%,rgba(34,211,238,0.055),transparent_22%),radial-gradient(circle_at_84%_42%,rgba(248,113,113,0.055),transparent_20%)]" />
            {mapNodes.map((node) => (
              <RouteNode key={node.id} node={node} available={availableSet.has(node.id)} visited={visitedSet.has(node.id)} onEnter={onEnter} />
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[22px] border border-yellow-100/10 bg-black/50 p-3 text-sm font-bold text-white/55 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <BadgeInfo className="h-4 w-4 text-yellow-200/60" />
            선택 가능한 노드만 밝게 표시됩니다. 교전 완료 후 이 경로 선택 화면으로 복귀합니다.
          </div>
        </div>
      </div>
    </section>
  );
}
