"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CircleDollarSign, Flag, PackageCheck } from "lucide-react";

import BattleScreen from "./components/BattleScreen";
import CampScreen from "./components/CampScreen";
import EventScreen from "./components/EventScreen";
import MapScreen from "./components/MapScreen";
import RewardScreen from "./components/RewardScreen";
import RunSummaryScreen from "./components/RunSummaryScreen";
import { events } from "./data/events";
import { useRunState } from "./hooks/useRunState";

export default function GamePage() {
  const run = useRunState();
  const activeEvent = events.find((event) => event.id === run.eventId);

  return (
    <main className="min-h-screen bg-[#030405] text-white">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center gap-3 px-4 py-2 sm:px-7">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:text-white"
            aria-label="홈으로"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="text-[8px] font-black tracking-[0.3em] text-yellow-300/60">
              ENDFIELD: FRONTIER PROTOCOL
            </p>
            <p className="truncate text-sm font-black">탐사 프로토타입</p>
          </div>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            {run.party.map((member) => (
              <div
                key={member.id}
                className="relative h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-zinc-900"
                title={`${member.name} ${member.hp}/${member.maxHp}`}
              >
                <Image src={member.image} alt="" fill sizes="36px" className="object-cover" />
                <span
                  className="absolute inset-x-0 bottom-0 bg-emerald-400/80"
                  style={{ height: `${Math.max(0, member.hp / member.maxHp) * 100}%`, opacity: 0.18 }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
            <CircleDollarSign className="h-4 w-4 text-yellow-300" />
            <span className="text-xs font-black">{run.credits}</span>
          </div>
          <div className="hidden items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 md:flex">
            <PackageCheck className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-black">{run.collectedGears.length} 장비</span>
          </div>
          {run.screen !== "summary" && (
            <button
              type="button"
              onClick={run.abandonRun}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition hover:border-red-300/30 hover:text-red-200"
              aria-label="탐사 중단"
            >
              <Flag className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {run.screen === "map" && (
        <MapScreen
          availableNodes={run.availableNodes}
          visitedNodes={run.visitedNodes}
          onEnter={run.enterNode}
        />
      )}
      {run.screen === "battle" && run.battle && (
        <BattleScreen
          party={run.party}
          battle={run.battle}
          sp={run.sp}
          maxSp={run.maxSp}
          cp={run.cp}
          maxCp={run.maxCp}
          onTick={run.tickBattle}
          onAction={run.performAction}
        />
      )}
      {run.screen === "reward" && (
        <RewardScreen
          gearSlugs={run.pendingGearSlugs}
          party={run.party}
          credits={run.credits}
          onEquip={run.equipRewardGear}
        />
      )}
      {run.screen === "event" && activeEvent && (
        <EventScreen event={activeEvent} onChoose={run.resolveEvent} />
      )}
      {run.screen === "camp" && <CampScreen onRest={run.rest} />}
      {run.screen === "summary" && (
        <RunSummaryScreen state={run} onRestart={run.startRun} />
      )}
    </main>
  );
}
