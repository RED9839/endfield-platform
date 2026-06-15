import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "./cn";

// 모바일: 필터 트리거 버튼(Drawer/BottomSheet 호출) / 데스크톱: 인라인 필터.
export function EndfieldFilterBar({
  children,
  onOpen,
  activeCount = 0,
  label = "필터",
  className,
}: {
  children?: ReactNode;
  onOpen?: () => void;
  activeCount?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-ef-line bg-ef-card px-4 text-sm font-bold text-ef-ink lg:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-ef-accent-soft" />
            {label}
          </span>
          {activeCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ef-accent px-1.5 text-[11px] font-black text-black">
              {activeCount}
            </span>
          ) : null}
        </button>
      ) : null}

      {children ? <div className="hidden lg:block">{children}</div> : null}
    </div>
  );
}
