import { RotateCcw, Skull, Trophy } from "lucide-react";

import type { RunState } from "../types/game";

const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function RunSummaryScreen({
  state,
  onRestart,
}: {
  state: RunState;
  onRestart: () => void;
}) {
  const victory = state.result === "victory";
  const defeat = state.result === "defeat";
  // 결과별 의미 색상 보존: 승리=초록, 실패=빨강, 중단=중립
  const resultColor = victory ? "#34d399" : defeat ? "#f87171" : "#a0a0a0";
  return (
    <section className="mx-auto flex min-h-[650px] w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="overflow-hidden border bg-ef-card2 text-center" style={{ ...CUT, borderColor: `${resultColor}66` }}>
        <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${resultColor}, transparent 55%)` }} />
        <div className="p-7 sm:p-10">
          {victory ? (
            <Trophy className="mx-auto h-12 w-12" style={{ color: resultColor }} />
          ) : (
            <Skull className="mx-auto h-12 w-12" style={{ color: resultColor }} />
          )}
          <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-ef-muted">
            RUN COMPLETE
          </p>
          <h1 className="mt-2 text-4xl font-black" style={{ color: resultColor }}>
            {victory ? "구역 확보" : defeat ? "작전 실패" : "탐사 중단"}
          </h1>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["승리", state.battlesWon],
              ["크레딧", state.credits],
              ["장비", state.collectedGears.length],
            ].map(([label, value]) => (
              <div key={label} className="border border-ef-line bg-ef-card p-4" style={CUT_SM}>
                <p className="font-mono text-2xl font-black tabular-nums text-white">{value}</p>
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">{label}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-black text-black transition hover:brightness-110"
            style={{ ...CUT_SM, background: "#ffd24a" }}
          >
            <RotateCcw className="h-4 w-4" />
            새 탐사 시작
          </button>
        </div>
      </div>
    </section>
  );
}
