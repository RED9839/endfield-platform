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
  { icon: typeof Swords; color: string; glow: string; label: string }
> = {
  battle: {
    icon: Swords,
    color: "border-sky-400/40 text-sky-100",
    glow: "shadow-[0_0_24px_rgba(56,189,248,0.1)]",
    label: "전투",
  },
  elite: {
    icon: ShieldAlert,
    color: "border-red-400/50 text-red-100",
    glow: "shadow-[0_0_26px_rgba(248,113,113,0.13)]",
    label: "정예",
  },
  event: {
    icon: HelpCircle,
    color: "border-violet-400/40 text-violet-100",
    glow: "shadow-[0_0_24px_rgba(167,139,250,0.12)]",
    label: "사건",
  },
  camp: {
    icon: Flame,
    color: "border-amber-400/50 text-amber-100",
    glow: "shadow-[0_0_26px_rgba(251,191,36,0.12)]",
    label: "야영",
  },
  boss: {
    icon: Castle,
    color: "border-orange-400/60 text-orange-100",
    glow: "shadow-[0_0_30px_rgba(251,146,60,0.16)]",
    label: "보스",
  },
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
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[10px] font-black tracking-[0.38em] text-yellow-300/60">
            TALOS-II / STAGE 01
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            외곽 채굴지 진입로
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            초반에는 낮은 레벨 장비를 확보하고, 중반부터 정예 전투와 야영지를 선택해 보스전을 준비하세요.
          </p>
        </div>
        <div className="rounded-[28px] border border-yellow-300/15 bg-yellow-300/[0.04] p-5">
          <p className="text-[10px] font-black tracking-[0.28em] text-yellow-200/60">ROUTE RULE</p>
          <div className="mt-4 space-y-2 text-xs font-bold text-zinc-400">
            <p>초반 전투: Lv.10~20 장비 중심</p>
            <p>중반 전투: Lv.20~28 장비 중심</p>
            <p>정예 전투: Lv.28~36 장비 중심</p>
            <p>보스 전초: Lv.36~50 장비 후보</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#05070a] p-4 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(234,179,8,0.12),transparent_35%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:100%_100%,40px_40px,40px_40px]" />
        <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent" />

        <div className="relative grid min-h-[660px] grid-cols-5 grid-rows-5 gap-3 sm:gap-5">
          {mapNodes.map((node) => {
            const visual = nodeVisual[node.type];
            const Icon = visual.icon;
            const available = availableNodes.includes(node.id);
            const visited = visitedNodes.includes(node.id);
            const locked = !available && !visited;

            return (
              <button
                key={node.id}
                type="button"
                disabled={!available}
                onClick={() => onEnter(node.id)}
                style={{ gridColumn: node.column + 1, gridRow: 6 - node.floor }}
                className={`group relative self-center rounded-2xl border p-3 text-left transition sm:p-4 ${
                  available
                    ? `${visual.color} ${visual.glow} bg-white/[0.055] hover:-translate-y-1 hover:bg-white/[0.09]`
                    : visited
                      ? "border-yellow-300/25 bg-yellow-300/[0.055] text-zinc-400"
                      : "border-white/8 bg-black/30 text-zinc-700"
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-current/20 bg-black/35 sm:h-12 sm:w-12">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <span className={`rounded-full border px-2 py-1 text-[9px] font-black ${locked ? "border-white/8 text-zinc-700" : "border-current/20"}`}>
                    F{node.floor}
                  </span>
                </span>
                <span className="mt-3 block text-[9px] font-black tracking-[0.2em] opacity-60">
                  {visual.label}
                </span>
                <span className="mt-1 block text-sm font-black text-white/90">
                  {node.title}
                </span>
                <span className="mt-1 hidden text-[10px] leading-4 text-zinc-500 sm:block">
                  {node.subtitle}
                </span>
                {available && (
                  <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-yellow-300 shadow-[0_0_12px_#fde047]" />
                )}
                {visited && (
                  <span className="absolute bottom-2 right-2 text-[9px] font-black text-yellow-200/50">
                    CLEAR
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
