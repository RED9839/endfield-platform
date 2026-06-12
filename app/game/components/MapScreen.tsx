"use client";

import Image from "next/image";
import { ArrowRight, ChevronRight, Crosshair, Eye, Shield } from "lucide-react";
import { startingParty } from "../data/operators";
import type { Operator } from "../types/game";

const operatorAccents = [
  "from-yellow-200 via-yellow-400 to-cyan-300",
  "from-yellow-300 via-orange-300 to-white",
  "from-cyan-300 via-yellow-300 to-white",
  "from-yellow-300 via-orange-400 to-red-400",
];

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="rounded-xl border border-yellow-200/15 bg-black/55 px-2 py-2 text-center shadow-inner shadow-yellow-200/5">
      <span className="block text-[9px] font-black tracking-[0.2em] text-yellow-100/45">{label}</span>
      <span className="mt-1 block text-sm font-black text-white">{value}</span>
    </span>
  );
}

function OperatorCard({ operator, index }: { operator: Operator; index: number }) {
  const accent = operatorAccents[index % operatorAccents.length];
  const selected = index === 0;

  return (
    <article
      className={`group relative min-h-[760px] overflow-hidden rounded-[34px] border p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
        selected
          ? "border-yellow-200/75 bg-yellow-200/[0.07] shadow-[0_0_55px_rgba(250,204,21,0.22)]"
          : "border-white/12 bg-zinc-950/58 shadow-[0_26px_70px_rgba(0,0,0,0.3)] hover:border-yellow-200/45"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(250,204,21,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="absolute inset-4 rounded-[28px] border border-yellow-100/10" />
      <div className="absolute left-1/2 top-28 h-80 w-80 -translate-x-1/2 rounded-full border border-yellow-200/16 bg-yellow-200/5" />
      <div className="absolute left-1/2 top-40 h-60 w-60 -translate-x-1/2 rounded-full border border-white/10" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="grid gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-100/15 bg-black/65 text-yellow-100 shadow-lg shadow-black/20">
            <Crosshair className="h-5 w-5" />
          </span>
          <span className="rounded-lg border border-yellow-100/20 bg-black/75 px-3 py-1 text-xl font-black leading-none text-white">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-100/20 bg-white/10 text-white shadow-lg backdrop-blur transition hover:bg-yellow-100/15" aria-label={`${operator.name} 상세 보기`}>
          <Eye className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-10 -mt-4 h-[540px] overflow-hidden rounded-[28px]">
        <div className="absolute inset-x-2 top-24 h-72 rounded-full bg-yellow-300/10 blur-3xl" />
        <Image src={operator.image} alt={operator.name} fill sizes="(min-width: 1536px) 25vw, (min-width: 768px) 50vw, 100vw" className="scale-[1.22] object-contain object-center drop-shadow-[0_32px_42px_rgba(0,0,0,0.75)] transition duration-500 group-hover:scale-[1.28]" priority={index === 0} />
      </div>

      <div className="relative z-10 -mt-8 rounded-[26px] border border-yellow-100/12 bg-black/70 p-4 shadow-[0_18px_38px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.28em] text-yellow-100/45">OPERATOR</p>
          <h3 className="mt-1 truncate text-3xl font-black tracking-tight text-white">{operator.name}</h3>
          <p className="mt-1 truncate text-xs font-bold text-white/45">{operator.className} / {operator.role}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatChip label="ATK" value={operator.attack} />
          <StatChip label="SPD" value={operator.speed} />
          <StatChip label="HP" value={operator.maxHp} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-yellow-100/10 pt-3">
          <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white/35">
            <Shield className="h-4 w-4 text-yellow-200/55" />
            DEPLOY READY
          </span>
          <button type="button" className="flex items-center gap-1 text-xs font-black text-yellow-100/80">
            교체 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function MapScreen({ onEnter, availableNodes }: { availableNodes: string[]; visitedNodes: string[]; onEnter: (nodeId: string) => void }) {
  const firstNodeId = availableNodes[0];

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black px-4 py-6 text-white sm:px-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(250,204,21,0.18),transparent_31%),radial-gradient(circle_at_82%_12%,rgba(34,211,238,0.12),transparent_34%),linear-gradient(135deg,#050505_0%,#111009_48%,#000000_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(250,204,21,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black to-transparent" />

      <div className="relative mx-auto max-w-[1880px]">
        <header className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.42em] text-yellow-100/55">ENDFIELD FIELD OPERATION</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">오퍼레이터 선택</h1>
          </div>
          <div className="rounded-full border border-yellow-100/20 bg-yellow-100/8 px-5 py-3 text-sm font-black text-yellow-100 shadow-[0_0_30px_rgba(250,204,21,0.12)] backdrop-blur-xl">TEAM 04 / READY</div>
        </header>

        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {startingParty.map((operator, index) => <OperatorCard key={operator.id} operator={operator} index={index} />)}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-[28px] border border-yellow-100/10 bg-black/55 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] text-yellow-100/45">DEPLOYMENT CONTROL</p>
            <p className="mt-1 text-sm font-bold text-white/55">오퍼레이터 4명을 확인하고 선택한 작전 구역으로 진입합니다.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="rounded-2xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-black text-white/70 transition hover:bg-white/12">편성 초기화</button>
            <button type="button" onClick={() => onEnter(firstNodeId)} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 px-7 py-3 text-sm font-black text-black shadow-[0_0_42px_rgba(250,204,21,0.26)] transition hover:-translate-y-0.5 hover:brightness-110">작전 시작 <ArrowRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
