import type { ReactNode } from "react";

import { cn } from "./cn";

// 반응형 auto-fill 그리드. min(카드 최소 너비)으로 모바일~PC 자동 조정.
export function EndfieldGrid({
  children,
  min = 160,
  className,
}: {
  children: ReactNode;
  min?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-3", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
