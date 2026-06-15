import type { ReactNode } from "react";

import { cn } from "./cn";

// 라벨 + 수치 통계 카드.
export function EndfieldStatsCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border border-ef-line bg-ef-card p-3 sm:p-4",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-ef-muted">
        {icon ? (
          <span className="shrink-0 text-ef-accent-soft/70">{icon}</span>
        ) : null}
        <p className="truncate text-[10px] font-black uppercase tracking-[0.14em]">
          {label}
        </p>
      </div>
      <p className="mt-2 truncate text-xl font-black text-ef-accent-soft sm:text-2xl">
        {value}
      </p>
    </div>
  );
}
