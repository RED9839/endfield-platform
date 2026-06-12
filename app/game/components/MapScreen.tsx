"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeInfo,
  ChevronRight,
  Crosshair,
  Eye,
  Flag,
  Gem,
  Search,
  Shield,
  Skull,
  Sparkles,
  Zap,
} from "lucide-react";
import { getEnemies } from "../data/enemies";
import { chooseGearRewards, getGameGear } from "../data/game-gears";
import { mapNodes } from "../data/maps";
import { startingParty } from "../data/operators";
import type { MapNode, Operator } from "../types/game";

const nodeVisual: Record<
  MapNode["type"],
  { label: string; icon: typeof Skull; color: string; difficulty: number }
> = {
  battle: { label: "COMBAT", icon: Skull, color: "from-red-500 to-orange-400", difficulty: 2 },
  elite: { label: "ELITE", icon: Flag, color: "from-fuchsia-500 to-violet-500", difficulty: 4 },
  event: { label: "EVENT", icon: Sparkles, color: "from-cyan-400 to-blue-500", difficulty: 1 },
  shop: { label: "SHOP", icon: Gem, color: "from-yellow-300 to-orange-500", difficulty: 1 },
  camp: { label: "CAMP", icon: BadgeInfo, color: "from-emerald-400 to-teal-500", difficulty: 1 },
  boss: { label: "BOSS", icon: Gem, color: "from-amber-400 to-red-600", difficulty: 5 },
};

const operatorAccents = [
  "from-cyan-300 via-violet-400 to-fuchsia-500",
  "from-orange-300 via-rose-400 to-violet-500",
  "from-emerald-300 via-cyan-300 to-blue-500",
  "from-yellow-300 via-orange-400 to-red-500",
];

function difficultyMarks(count: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <span key={index} className={`h-2.5 w-8 rounded-full ${index < count ? "bg-orange-300" : "bg-white/10"}`} />
  ));
}

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center shadow-inner shadow-white/5">
      <span className="block text-[9px] font-black tracking-[0.2em] text-cyan-100/40">{label}</span>
      <span className="mt-1 block text-sm font-black text-white">{value}</span>
    </span>
  );
}

function OperatorCard({ operator, index }: { operator: Operator; index: number }) {
  const accent = operatorAccents[index % operatorAccents.length];
  const selected = index === 0;

  return (
    <article
      className={`group relative min-h-[640px] overflow-hidden rounded-[34px] border p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
        selected
          ? "border-cyan-200/70 bg-cyan-200/[0.08] shadow-[0_0_60px_rgba(34,211,238,0.28)]"
          : "border-white/15 bg-white/[0.065] shadow-[0_26px_70px_rgba(0,0,0,0.24)] hover:border-cyan-200/45"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(168,85,247,0.34),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.12),transparent_42%)]" />
      <div className="absolute inset-4 rounded-[28px] border border-white/10" />
      <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full border border-cyan-200/15 bg-cyan-200/5 shadow-[0_0_60px_rgba(34,211,238,0.12)]" />
      <div className="absolute left-1/2 top-28 h-44 w-44 -translate-x-1/2 rounded-full border border-white/10" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="grid gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/45 text-cyan-100 shadow-lg shadow-black/20">
            <Crosshair className="h-5 w-5" />
          </span>
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-zinc-950 shadow-[0_0_24px_rgba(34,211,238,0.25)]`}>
            <Zap className="h-5 w-5" />
          </span>
          <span className="rounded-lg border border-white/15 bg-black/55 px-3 py-1 text-xl font-black leading-none text-white">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur transition hover:bg-white/25" aria-label={`${operator.name} 상세 보기`}>
          <Eye className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-10 mt-2 h-[390px] overflow-hidden rounded-[28px]">
        <div className="absolute inset-x-6 top-16 h-64 rounded-full bg-cyan-300/10 blur-3xl" />
        <Image src={operator.image} alt={operator.name} fill sizes="(min-width: 1536px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain object-bottom drop-shadow-[0_28px_36px_rgba(0,0,0,0.65)] transition duration-500 group-hover:scale-105" priority={index === 0} />
      </div>

      <div className="relative z-10 -mt-2 rounded-[26px] border border-white/12 bg-black/45 p-4 shadow-[0_18px_38px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black tracking-[0.28em] text-cyan-100/45">OPERATOR</p>
            <h3 className="mt-1 truncate text-3xl font-black tracking-tight text-white">{operator.name}</h3>
            <p className="mt-1 truncate text-xs font-bold text-white/45">{operator.className} / {operator.role}</p>
          </div>
          <span className="shrink-0 rounded-xl border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-center text-xs font-black text-cyan-100">
            LV <span className="ml-1 text-lg text-white">60</span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatChip label="ATK" value={operator.attack} />
          <StatChip label="SPD" value={operator.speed} />
          <StatChip label="HP" value={operator.maxHp} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white/35">
            <Shield className="h-4 w-4 text-cyan-200/55" />
            DEPLOY READY
          </span>
          <button type="button" className="flex items-center gap-1 text-xs font-black text-cyan-100/80">
            교체 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function MapScreen({ availableNodes, visitedNodes, onEnter }: { availableNodes: string[]; visitedNodes: string[]; onEnter: (nodeId: string) => void }) {
  const [selectedNodeId, setSelectedNodeId] = useState(availableNodes[0] ?? mapNodes[0]?.id);
  const selectedNode = mapNodes.find((node) => node.id === selectedNodeId && availableNodes.includes(node.id)) ?? mapNodes.find((node) => availableNodes.includes(node.id)) ?? mapNodes[0];
  const visual = nodeVisual[selectedNode.type];
  const Icon = visual.icon;
  const enemies = useMemo(() => getEnemies(selectedNode.enemyIds ?? []).slice(0, 3), [selectedNode.enemyIds]);
  const rewards = useMemo(() => chooseGearRewards(visitedNodes.length + 1, 4, selectedNode.rewardTier ?? "early").map(getGameGear), [selectedNode.rewardTier, visitedNodes.length]);

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#070914] px-4 py-6 text-white sm:px-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(168,85,247,0.26),transparent_34%),linear-gradient(135deg,#070914_0%,#12142a_45%,#05060b_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="relative mx-auto max-w-[1880px]">
        <header className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.42em] text-cyan-200/55">ENDFIELD FIELD OPERATION</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">작전 투입 편성</h1>
            <p className="mt-3 text-sm font-bold text-white/45">목표 구역: 탈로스-II 외곽 / 위험도 A+ / 추천 Lv.60</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-cyan-200/20 bg-white/8 px-5 py-3 text-sm font-black text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-xl">TEAM 04 / READY</div>
            <div className="rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm font-black text-white/70 backdrop-blur-xl">POWER 128,400</div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px] 2xl:grid-cols-[minmax(0,1fr)_500px]">
          <div>
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
              {startingParty.map((operator, index) => <OperatorCard key={operator.id} operator={operator} index={index} />)}
            </div>
            <div className="mt-6 flex flex-col gap-3 rounded-[28px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] text-cyan-100/45">DEPLOYMENT CONTROL</p>
                <p className="mt-1 text-sm font-bold text-white/55">오퍼레이터 4명을 확인하고 선택한 작전 구역으로 진입합니다.</p>
              </div>
              <div className="flex gap-3">
                <button type="button" className="rounded-2xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-black text-white/70 transition hover:bg-white/12">편성 초기화</button>
                <button type="button" onClick={() => onEnter(selectedNode.id)} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-500 px-7 py-3 text-sm font-black text-zinc-950 shadow-[0_0_42px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:brightness-110">작전 시작 <ArrowRight className="h-5 w-5" /></button>
              </div>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#0b0817]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(139,92,246,0.28),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black tracking-[0.32em] text-violet-200/50">OPERATION SELECT</p>
                  <h2 className="mt-2 text-4xl font-black text-white">{selectedNode.title}</h2>
                  <p className="mt-2 text-sm font-bold text-violet-100/55">{selectedNode.subtitle}</p>
                </div>
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${visual.color} shadow-lg`}><Icon className="h-7 w-7 text-white" /></span>
              </div>

              <div className="mt-8 border-y border-white/10 py-4">
                <p className="mb-1 text-center text-sm font-black text-white/70">난이도</p>
                <div className="flex items-center justify-center gap-6">{difficultyMarks(visual.difficulty)}</div>
              </div>

              <div className="mt-5 grid gap-3">
                {availableNodes.map((nodeId) => {
                  const node = mapNodes.find((item) => item.id === nodeId);
                  if (!node) return null;
                  const nodeInfo = nodeVisual[node.type];
                  const NodeIcon = nodeInfo.icon;
                  const active = node.id === selectedNode.id;
                  return (
                    <button key={node.id} type="button" onClick={() => setSelectedNodeId(node.id)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${active ? "border-cyan-200/45 bg-cyan-200/10 text-white shadow-[0_0_28px_rgba(34,211,238,0.12)]" : "border-white/8 bg-white/[0.045] text-violet-100/70 hover:border-white/20 hover:bg-white/[0.08]"}`}>
                      <span className="flex min-w-0 items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${nodeInfo.color}`}><NodeIcon className="h-5 w-5 text-white" /></span>
                        <span className="min-w-0"><span className="block truncate text-sm font-black">{node.title}</span><span className="block text-[10px] font-bold tracking-[0.18em] text-white/35">{nodeInfo.label} / F{node.floor}</span></span>
                      </span>
                      <ArrowRight className={`h-4 w-4 ${active ? "text-cyan-200" : "text-white/25"}`} />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.045] p-4">
                <div className="mb-3 flex items-center justify-between"><p className="text-sm font-black text-white/70">등장 몬스터</p><Search className="h-5 w-5 text-white/45" /></div>
                <div className="flex gap-3">
                  {enemies.length > 0 ? enemies.map((enemy) => (
                    <div key={enemy.id} className="relative h-24 w-24 overflow-hidden rounded-xl border border-red-300/25 bg-black/35">
                      {enemy.image && <Image src={enemy.image} alt="" fill sizes="96px" className="object-contain p-2" />}
                      <span className="absolute left-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[8px] font-black">{enemy.boss ? "BOSS" : enemy.elite ? "EL" : "EN"}</span>
                    </div>
                  )) : <p className="text-sm font-bold text-white/45">비전투 구역</p>}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.045] p-4">
                <div className="mb-3 flex items-center justify-between"><p className="text-sm font-black text-white/70">획득 가능 전리품</p><BadgeInfo className="h-5 w-5 text-white/45" /></div>
                <div className="grid grid-cols-4 gap-3">
                  {rewards.map((gear) => (
                    <div key={gear.slug} className="relative h-20 overflow-hidden rounded-xl border border-yellow-200/15 bg-gradient-to-br from-yellow-200/18 to-violet-400/10">
                      <Image src={gear.image} alt="" fill sizes="80px" className="object-contain p-2" />
                      <span className="absolute left-1 top-1 rounded bg-white px-1.5 py-0.5 text-[8px] font-black text-zinc-900">Q{gear.quality}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => onEnter(selectedNode.id)} className="mt-7 flex w-full items-center justify-center gap-3 rounded-[28px] bg-gradient-to-r from-zinc-950 via-violet-900 to-fuchsia-500 px-6 py-5 text-xl font-black text-white shadow-[0_18px_45px_rgba(168,85,247,0.3)] transition hover:-translate-y-0.5 hover:brightness-110">진입 <ArrowRight className="h-6 w-6" /></button>
              <p className="mt-4 text-center text-[11px] font-bold text-white/35">CLEARED {visitedNodes.length} / ROUTE {mapNodes.length}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
