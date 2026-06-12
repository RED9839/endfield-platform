import { Radio } from "lucide-react";

import type { GameEvent } from "../types/game";

export default function EventScreen({
  event,
  onChoose,
}: {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-[28px] border border-violet-300/20 bg-[radial-gradient(circle_at_50%_0%,rgba(167,139,250,0.12),transparent_45%),#08090d] p-6 sm:p-10">
        <Radio className="h-9 w-9 text-violet-300" />
        <p className="mt-6 text-[10px] font-black tracking-[0.32em] text-violet-300/60">
          UNKNOWN SIGNAL
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">{event.title}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300">
          {event.description}
        </p>
        <div className="mt-8 space-y-3">
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onChoose(choice.id)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-violet-300/40 hover:bg-violet-300/[0.06]"
            >
              <span className="font-black text-white">{choice.label}</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">
                {choice.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
