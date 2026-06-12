import { RotateCcw, Skull, Trophy } from "lucide-react";

import type { RunState } from "../types/game";

export default function RunSummaryScreen({
  state,
  onRestart,
}: {
  state: RunState;
  onRestart: () => void;
}) {
  const victory = state.result === "victory";
  return (
    <section className="mx-auto flex min-h-[650px] w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-[30px] border border-white/10 bg-[#080a0d] p-7 text-center sm:p-10">
        {victory ? (
          <Trophy className="mx-auto h-12 w-12 text-yellow-300" />
        ) : (
          <Skull className="mx-auto h-12 w-12 text-zinc-500" />
        )}
        <p className="mt-5 text-[10px] font-black tracking-[0.35em] text-zinc-500">
          RUN COMPLETE
        </p>
        <h1 className="mt-2 text-4xl font-black text-white">
          {victory ? "구역 확보" : state.result === "defeat" ? "작전 실패" : "탐사 중단"}
        </h1>
        <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3">
          {[
            ["승리", state.battlesWon],
            ["크레딧", state.credits],
            ["유물", state.relics.length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="mt-1 text-[10px] font-bold text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-yellow-300/30 bg-yellow-300/10 px-6 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/20"
        >
          <RotateCcw className="h-4 w-4" />
          새 탐사 시작
        </button>
      </div>
    </section>
  );
}
