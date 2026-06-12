import { PackageOpen } from "lucide-react";

import { getRelic } from "../data/relics";

export default function RewardScreen({
  relicIds,
  credits,
  onClaim,
}: {
  relicIds: string[];
  credits: number;
  onClaim: (relicId: string) => void;
}) {
  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-4xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="text-center">
        <PackageOpen className="mx-auto h-10 w-10 text-yellow-300" />
        <p className="mt-4 text-[10px] font-black tracking-[0.35em] text-yellow-300/60">
          OPERATION COMPLETE
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">전리품 선택</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {credits} 크레딧 확보. 유물 하나를 선택하세요.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {relicIds.map((id) => {
          const relic = getRelic(id);
          return (
            <button
              key={relic.id}
              type="button"
              onClick={() => onClaim(relic.id)}
              className="group rounded-[24px] border border-yellow-300/20 bg-yellow-300/[0.035] p-6 text-left transition hover:-translate-y-1 hover:border-yellow-300/60 hover:bg-yellow-300/[0.08]"
            >
              <span className="inline-flex rounded-lg border border-yellow-300/20 bg-black/30 px-2 py-1 text-[10px] font-black text-yellow-200">
                {relic.icon}
              </span>
              <h2 className="mt-5 text-xl font-black text-white">{relic.name}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{relic.description}</p>
              <p className="mt-6 text-xs font-black text-yellow-200">획득하기</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
