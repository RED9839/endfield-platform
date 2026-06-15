import type { ReactNode } from "react";

import { cn } from "./cn";

type Tone = "default" | "accent" | "success" | "danger" | "muted";

const toneClass: Record<Tone, string> = {
  default: "border-ef-line bg-ef-card2 text-ef-ink",
  accent: "border-ef-accent/40 bg-ef-accent/10 text-ef-accent-soft",
  success: "border-ef-success/30 bg-ef-success/10 text-ef-success",
  danger: "border-ef-danger/30 bg-ef-danger/10 text-ef-danger",
  muted: "border-ef-line bg-transparent text-ef-muted",
};

// 상태/메타 표시용 작은 배지.
export function EndfieldBadge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-black leading-none",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
