import type { ReactNode } from "react";

import { cn } from "./cn";

// 데이터 없음/검색 결과 없음 상태.
export function EndfieldEmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-ef-line bg-ef-card px-6 py-10 text-center",
        className,
      )}
    >
      {icon ? <div className="mb-3 text-ef-muted">{icon}</div> : null}
      <p className="text-sm font-black text-ef-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-xs leading-5 text-ef-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
