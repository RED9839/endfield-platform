import { Radio } from "lucide-react";

import type { GameEvent } from "../types/game";

const PRIMARY = "#ff9a2f";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function EventScreen({
  event,
  onChoose,
}: {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="overflow-hidden border border-ef-line bg-ef-card2" style={CUT}>
        <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
        <div className="p-6 sm:p-10">
          <Radio className="h-9 w-9" style={{ color: PRIMARY }} />
          <p className="mt-6 font-mono text-[12px] font-bold uppercase tracking-[0.32em] text-ef-muted">
            UNKNOWN SIGNAL
          </p>
          <h1 className="mt-2 text-3xl font-black text-white">{event.title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ef-muted">
            {event.description}
          </p>
          <div className="mt-8 space-y-3">
            {event.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => onChoose(choice.id)}
                className="w-full border border-ef-line bg-ef-card p-4 text-left transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
                style={CUT_SM}
              >
                <span className="font-black text-white">{choice.label}</span>
                <span className="mt-1 block text-xs leading-5 text-ef-muted">
                  {choice.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
