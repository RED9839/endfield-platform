"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "./cn";

// 모바일 Bottom Sheet / 우측 Drawer. 필터·선택 패널용.
export function EndfieldDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = "bottom",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "bottom" | "right";
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute flex flex-col bg-ef-card",
          side === "bottom"
            ? "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t border-ef-line"
            : "inset-y-0 right-0 w-[88%] max-w-sm border-l border-ef-line",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-ef-line px-4 py-3">
          <h2 className="truncate text-base font-black text-ef-accent-soft">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ef-muted transition hover:text-ef-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-ef-line p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
