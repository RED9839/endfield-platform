import { ArrowLeft, Swords, Trophy } from "lucide-react";

import { getEnemy } from "../data/enemies";
import { CHALLENGE_BOSSES, loadBestScores } from "../lib/challenge";

const ACCENT = "#ffd24a";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };

export default function ChallengeScreen({
  onStart,
  onBack,
}: {
  onStart: (bossId: string) => void;
  onBack: () => void;
}) {
  const best = typeof window !== "undefined" ? loadBestScores() : {};
  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-4xl flex-col px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="flex h-9 w-9 items-center justify-center border border-ef-line bg-ef-card text-ef-muted transition hover:text-ef-accent-soft" style={CUT_SM} aria-label="뒤로">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="font-mono text-[12px] font-bold uppercase tracking-[0.3em] text-ef-muted">Boss Challenge // 보스 도전</p>
          <h1 className="text-2xl font-black text-white">저장한 덱으로 보스 도전 <span className="text-sm font-bold text-ef-muted">· 처치 턴수 기록</span></h1>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CHALLENGE_BOSSES.map((b) => {
          const enemy = (() => { try { return getEnemy(b.id); } catch { return undefined; } })();
          const record = best[b.id];
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onStart(b.id)}
              className="flex items-center justify-between border border-ef-line bg-ef-card2 p-4 text-left transition hover:-translate-y-0.5 hover:border-ef-accent/50"
              style={CUT_SM}
            >
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">{b.faction}</p>
                <p className="mt-0.5 truncate text-lg font-black text-white">{enemy?.name ?? b.id}</p>
                <p className="mt-1 flex items-center gap-1 font-mono text-[13px] font-bold tabular-nums" style={{ color: record != null ? ACCENT : "#52525b" }}>
                  <Trophy className="h-3.5 w-3.5" /> {record != null ? `최고 ${record}턴` : "기록 없음"}
                </p>
              </div>
              <span className="flex items-center gap-1.5 border px-3 py-2 font-mono text-xs font-black uppercase text-black" style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}>
                <Swords className="h-4 w-4" /> 도전
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-ef-muted">덱을 정예화·복제·장비로 키울수록 처치 턴수가 줄어듭니다. 최고 기록에 도전하세요.</p>
    </section>
  );
}
