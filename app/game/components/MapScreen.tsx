import {
  Castle,
  Flame,
  HelpCircle,
  ShieldAlert,
  Swords,
} from "lucide-react";

import { mapNodes } from "../data/maps";
import type { MapNode } from "../types/game";

const nodeVisual: Record<
  MapNode["type"],
  { icon: typeof Swords; color: string; label: string }
> = {
  battle: { icon: Swords, color: "border-sky-400/40 text-sky-200", label: "전투" },
  elite: { icon: ShieldAlert, color: "border-red-400/50 text-red-200", label: "정예" },
  event: { icon: HelpCircle, color: "border-violet-400/40 text-violet-200", label: "사건" },
  camp: { icon: Flame, color: "border-amber-400/50 text-amber-200", label: "야영" },
  boss: { icon: Castle, color: "border-orange-400/60 text-orange-200", label: "보스" },
};

export default function MapScreen({
  availableNodes,
  visitedNodes,
  onEnter,
}: {
  availableNodes: string[];
  visitedNodes: string[];
  onEnter: (nodeId: string) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <p className="text-[10px] font-black tracking-[0.38em] text-yellow-300/60">
          TALOS-II / SECTOR 07
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          붕괴 지대 탐사
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          다음 경로를 선택하세요. 지나간 노드로는 돌아갈 수 없습니다.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070a0e] p-4 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="relative grid min-h-[520px] grid-cols-5 grid-rows-3 gap-3 sm:gap-6">
          {mapNodes.map((node) => {
            const visual = nodeVisual[node.type];
            const Icon = visual.icon;
            const available = availableNodes.includes(node.id);
            const visited = visitedNodes.includes(node.id);

            return (
              <button
                key={node.id}
                type="button"
                disabled={!available}
                onClick={() => onEnter(node.id)}
                style={{ gridColumn: node.column + 1, gridRow: 4 - node.floor }}
                className={`group relative self-center rounded-2xl border p-2 text-left transition sm:p-4 ${
                  available
                    ? `${visual.color} bg-white/[0.045] shadow-[0_0_32px_rgba(250,204,21,0.08)] hover:-translate-y-1 hover:bg-white/[0.08]`
                    : visited
                      ? "border-yellow-300/20 bg-yellow-300/[0.04] text-zinc-500"
                      : "border-white/8 bg-black/30 text-zinc-600"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-current/20 bg-black/30 sm:h-11 sm:w-11">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span className="mt-3 hidden text-[9px] font-black tracking-[0.2em] opacity-60 sm:block">
                  {visual.label}
                </span>
                <span className="mt-1 hidden text-sm font-black text-white sm:block">
                  {node.title}
                </span>
                {available && (
                  <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-yellow-300 shadow-[0_0_12px_#fde047]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
