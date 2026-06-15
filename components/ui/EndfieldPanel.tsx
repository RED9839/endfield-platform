import type { HTMLAttributes } from "react";

import { cn } from "./cn";

type EndfieldPanelProps = HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
};

// 모든 표면(카드/패널)의 기본 프리미티브. 검은 카드 + 얇은 중성 보더.
export function EndfieldPanel({
  className,
  inset = false,
  ...props
}: EndfieldPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ef-line",
        inset ? "bg-ef-card2" : "bg-ef-card",
        className,
      )}
      {...props}
    />
  );
}
