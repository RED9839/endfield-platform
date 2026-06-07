import type { ReactNode } from "react";

export default function GrowthSection({
  title,
  summary,
  children,
}: {
  title: string;
  summary?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-yellow-500/10 bg-black/30 p-4">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="text-sm font-black text-yellow-200">{title}</h3>
        {summary ? (
          <p className="line-clamp-1 text-xs font-semibold text-zinc-500">
            {summary}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
