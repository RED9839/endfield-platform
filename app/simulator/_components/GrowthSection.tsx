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
    <section
      className="border border-ef-line bg-ef-card p-4"
      style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
    >
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-1 shrink-0" style={{ background: "#ff9a2f" }} />
          <h3 className="text-sm font-black tracking-tight text-white">{title}</h3>
        </div>
        {summary ? (
          <p className="line-clamp-1 text-xs font-semibold text-ef-muted">
            {summary}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
