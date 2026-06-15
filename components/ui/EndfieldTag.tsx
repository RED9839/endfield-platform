import type { ReactNode } from "react";

import { cn } from "./cn";

// 속성/세트/카테고리 등 색상 강조 칩. color 미지정 시 중성 보더.
export function EndfieldTag({
  children,
  icon,
  color,
  className,
}: {
  children: ReactNode;
  icon?: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 max-w-full items-center gap-1 rounded-md border bg-black px-2 text-[11px] font-black leading-none",
        className,
      )}
      style={{
        borderColor: color ?? "var(--color-ef-line)",
        color: color ?? "var(--color-ef-ink)",
      }}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}
