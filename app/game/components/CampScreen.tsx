import { Dumbbell, Flame, HeartPulse } from "lucide-react";

export default function CampScreen({
  onRest,
}: {
  onRest: (mode: "heal" | "train") => void;
}) {
  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="text-center">
        <Flame className="mx-auto h-11 w-11 text-amber-300" />
        <p className="mt-4 text-[10px] font-black tracking-[0.34em] text-amber-300/60">
          MOBILE CAMP
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">짧은 정비</h1>
        <p className="mt-2 text-sm text-zinc-400">출발하기 전 한 가지 행동을 선택하세요.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onRest("heal")}
          className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/[0.04] p-6 text-left transition hover:-translate-y-1 hover:border-emerald-300/50"
        >
          <HeartPulse className="h-7 w-7 text-emerald-300" />
          <h2 className="mt-5 text-xl font-black text-white">응급 정비</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            모든 오퍼레이터의 체력을 28 회복합니다.
          </p>
        </button>
        <button
          type="button"
          onClick={() => onRest("train")}
          className="rounded-[24px] border border-orange-300/20 bg-orange-300/[0.04] p-6 text-left transition hover:-translate-y-1 hover:border-orange-300/50"
        >
          <Dumbbell className="h-7 w-7 text-orange-300" />
          <h2 className="mt-5 text-xl font-black text-white">전술 훈련</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            파티의 기본 공격과 스킬 위력이 2 증가합니다.
          </p>
        </button>
      </div>
    </section>
  );
}
