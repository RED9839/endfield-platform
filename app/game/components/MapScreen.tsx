import {
  Castle,
  Check,
  Flame,
  HelpCircle,
  Lock,
  Map,
  Route,
  ShieldAlert,
  ShoppingBag,
  Skull,
  Sparkles,
  Swords,
} from "lucide-react";

import { mapNodes } from "../data/maps";
import type { MapNode } from "../types/game";

const nodeVisual: Record<
  MapNode["type"],
  { icon: typeof Swords; label: string; color: string; glow: string }
> = {
  battle: {
    icon: Swords,
    label: "COMBAT",
    color: "border-yellow-200/55 bg-yellow-300/[0.12] text-yellow-50",
    glow: "shadow-[0_0_26px_rgba(250,204,21,0.18)]",
  },
  elite: {
    icon: ShieldAlert,
    label: "ELITE",
    color: "border-red-300/55 bg-red-400/[0.12] text-red-50",
    glow: "shadow-[0_0_26px_rgba(248,113,113,0.18)]",
  },
  event: {
    icon: HelpCircle,
    label: "EVENT",
    color: "border-violet-300/50 bg-violet-400/[0.12] text-violet-50",
    glow: "shadow-[0_0_26px_rgba(167,139,250,0.18)]",
  },
  shop: {
    icon: ShoppingBag,
    label: "SUPPLY",
    color: "border-emerald-300/50 bg-emerald-400/[0.12] text-emerald-50",
    glow: "shadow-[0_0_26px_rgba(52,211,153,0.16)]",
  },
  camp: {
    icon: Flame,
    label: "CAMP",
    color: "border-orange-300/55 bg-orange-400/[0.12] text-orange-50",
    glow: "shadow-[0_0_26px_rgba(251,146,60,0.18)]",
  },
  boss: {
    icon: Castle,
    label: "BOSS",
    color: "border-red-200/70 bg-red-500/[0.16] text-red-50",
    glow: "shadow-[0_0_34px_rgba(248,113,113,0.28)]",
  },
};

const laneLabels = ["LOW", "LEFT", "MID", "RIGHT", "HIGH"];
const boardWidth = Math.max(...mapNodes.map((node) => node.floor)) * 176 + 260;
const boardHeight = 620;
const nodeWidth = 154;
const nodeHeight = 116;
const xGap = 176;
const yGap = 110;
const xStart = 84;
const yStart = 64;

function getPosition(node: MapNode) {
  return {
    left: xStart + (node.floor - 1) * xGap,
    top: yStart + node.column * yGap,
  };
}

function nodeTitle(node: MapNode) {
  if (node.type === "boss") return "Final Operation";
  if (node.type === "elite") return `Elite Route ${node.floor}`;
  if (node.type === "event") return `Field Event ${node.floor}`;
  if (node.type === "shop") return `Supply Point ${node.floor}`;
  if (node.type === "camp") return `Forward Camp ${node.floor}`;
  return `Combat Zone ${node.floor}`;
}

function nodeSubtitle(node: MapNode) {
  if (node.type === "boss") return "boss sector";
  if (node.type === "elite") return "high-threat encounter";
  if (node.type === "event") return "random field event";
  if (node.type === "shop") return "gear resupply";
  if (node.type === "camp") return "recover or train";
  return node.rewardTier ? `${node.rewardTier} reward` : "standard route";
}

function RouteLine({
  from,
  to,
  active,
  cleared,
}: {
  from: MapNode;
  to: MapNode;
  active: boolean;
  cleared: boolean;
}) {
  const fromPosition = getPosition(from);
  const toPosition = getPosition(to);
  const x1 = fromPosition.left + nodeWidth;
  const y1 = fromPosition.top + nodeHeight / 2;
  const x2 = toPosition.left;
  const y2 = toPosition.top + nodeHeight / 2;
  const width = Math.max(24, x2 - x1);
  const top = Math.min(y1, y2);
  const height = Math.abs(y2 - y1) || 1;
  const midX = width / 2;

  return (
    <svg
      className="pointer-events-none absolute overflow-visible"
      style={{
        left: x1,
        top,
        width,
        height: Math.max(1, height),
      }}
      aria-hidden="true"
    >
      <path
        d={`M 0 ${y1 - top} C ${midX} ${y1 - top}, ${midX} ${y2 - top}, ${width} ${y2 - top}`}
        fill="none"
        stroke={active ? "rgba(250,204,21,0.95)" : cleared ? "rgba(250,204,21,0.35)" : "rgba(255,255,255,0.08)"}
        strokeLinecap="round"
        strokeWidth={active ? 3 : 2}
      />
    </svg>
  );
}

function RouteNode({
  node,
  available,
  visited,
  onEnter,
}: {
  node: MapNode;
  available: boolean;
  visited: boolean;
  onEnter: (nodeId: string) => void;
}) {
  const visual = nodeVisual[node.type];
  const Icon = visual.icon;
  const position = getPosition(node);
  const locked = !available && !visited;

  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => onEnter(node.id)}
      className={`group absolute rounded-[22px] border p-4 text-left transition duration-200 ${
        available
          ? `${visual.color} ${visual.glow} hover:-translate-y-1 hover:brightness-125`
          : visited
            ? "border-yellow-300/22 bg-yellow-300/[0.055] text-yellow-100/55"
            : "border-white/7 bg-black/42 text-white/18"
      }`}
      style={{
        left: position.left,
        top: position.top,
        width: nodeWidth,
        height: nodeHeight,
      }}
    >
      <span className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            available
              ? "border-current/30 bg-black/35"
              : visited
                ? "border-yellow-200/20 bg-black/25"
                : "border-white/8 bg-black/40"
          }`}
        >
          {visited ? <Check className="h-5 w-5" /> : locked ? <Lock className="h-4 w-4" /> : <Icon className="h-5 w-5" />}
        </span>
        <span className="rounded-full border border-current/15 bg-black/30 px-2 py-1 text-[10px] font-black">
          F{node.floor}
        </span>
      </span>
      <span className="mt-3 block text-[10px] font-black tracking-[0.18em] opacity-55">
        {visual.label}
      </span>
      <span className={`mt-1 block truncate text-base font-black ${available ? "text-white" : ""}`}>
        {nodeTitle(node)}
      </span>
      <span className="mt-1 block truncate text-[10px] font-bold opacity-45">
        {nodeSubtitle(node)}
      </span>
      {available && (
        <>
          <span className="absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.9)]" />
          <span className="absolute inset-0 rounded-[22px] ring-1 ring-inset ring-yellow-200/20" />
        </>
      )}
    </button>
  );
}

export default function MapScreen({
  availableNodes,
  visitedNodes,
  onEnter,
}: {
  availableNodes: string[];
  visitedNodes: string[];
  onEnter: (nodeId: string) => void;
}) {
  const availableSet = new Set(availableNodes);
  const visitedSet = new Set(visitedNodes);
  const currentNodes = mapNodes.filter((node) => availableSet.has(node.id));
  const currentLabel = currentNodes.length > 0 ? currentNodes.map(nodeTitle).join(" / ") : "No active route";
  const clearedCount = visitedNodes.length;

  return (
    <section className="min-h-[calc(100vh-64px)] overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(250,204,21,0.16),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(20,184,166,0.13),transparent_30%),linear-gradient(115deg,#080805_0%,#0d0c06_44%,#061511_100%)] px-4 py-7 text-white sm:px-7">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.5em] text-yellow-200/65">
              ENDFIELD ROUTE MAP
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
              작전 경로 선택
            </h1>
            <p className="mt-3 text-sm font-bold text-zinc-400">
              왼쪽에서 오른쪽으로 진행하며, 밝게 표시된 다음 작전 노드를 선택합니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-yellow-200/20 bg-yellow-200/[0.07] px-5 py-3 text-xs font-black text-yellow-100">
              CLEARED {clearedCount} / ROUTE {mapNodes.length}
            </span>
            <span className="rounded-full border border-white/10 bg-black/35 px-5 py-3 text-xs font-black text-zinc-300">
              ACTIVE {currentNodes.length}
            </span>
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-black/42 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.32)] backdrop-blur">
          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_390px]">
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3">
              <div className="flex items-center gap-3">
                <Route className="h-5 w-5 text-yellow-200" />
                <div>
                  <p className="text-[10px] font-black tracking-[0.24em] text-zinc-500">CURRENT CHOICE</p>
                  <p className="text-sm font-black text-zinc-100">{currentLabel}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/8 bg-white/[0.035] p-2">
              <div className="flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2 text-xs font-black text-zinc-300">
                <Swords className="h-4 w-4 text-yellow-200" /> Battle
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2 text-xs font-black text-zinc-300">
                <ShieldAlert className="h-4 w-4 text-red-200" /> Elite
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2 text-xs font-black text-zinc-300">
                <Sparkles className="h-4 w-4 text-violet-200" /> Utility
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto rounded-[28px] border border-white/8 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px),radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.07),transparent_34%)] bg-[size:64px_64px,64px_64px,100%_100%] p-4">
            <div className="sticky left-0 top-0 z-20 mb-3 flex w-fit items-center gap-2 rounded-full border border-yellow-200/20 bg-black/70 px-3 py-2 text-[10px] font-black tracking-[0.24em] text-yellow-100/75 backdrop-blur">
              <Map className="h-4 w-4" /> ROUTE BOARD
            </div>
            <div className="relative" style={{ width: boardWidth, height: boardHeight }}>
              <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black/45 to-transparent" />
              {laneLabels.map((label, index) => (
                <div
                  key={label}
                  className="absolute left-2 flex items-center gap-2 text-[9px] font-black tracking-[0.22em] text-white/20"
                  style={{ top: yStart + index * yGap + 43 }}
                >
                  <span className="h-px w-8 bg-white/10" />
                  {label}
                </div>
              ))}

              {mapNodes.flatMap((node) =>
                node.next.map((nextId) => {
                  const next = mapNodes.find((item) => item.id === nextId);
                  if (!next) return null;
                  const active = visitedSet.has(node.id) && availableSet.has(next.id);
                  const cleared = visitedSet.has(node.id) && visitedSet.has(next.id);
                  return (
                    <RouteLine
                      key={`${node.id}-${next.id}`}
                      from={node}
                      to={next}
                      active={active}
                      cleared={cleared}
                    />
                  );
                }),
              )}

              {mapNodes.map((node) => (
                <RouteNode
                  key={node.id}
                  node={node}
                  available={availableSet.has(node.id)}
                  visited={visitedSet.has(node.id)}
                  onEnter={onEnter}
                />
              ))}

              <div className="absolute bottom-0 left-0 right-0 h-4 rounded-full border border-yellow-200/20 bg-black/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-300"
                  style={{ width: `${Math.max(4, (clearedCount / Math.max(1, mapNodes.length)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/35 px-4 py-3 text-xs font-bold text-zinc-400">
            <Skull className="h-4 w-4 text-yellow-200/70" />
            선택 가능한 노드만 밝게 표시됩니다. 전투 완료 후 이 경로 선택 화면으로 복귀합니다.
          </div>
        </div>
      </div>
    </section>
  );
}
