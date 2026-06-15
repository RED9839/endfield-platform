"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "./cn";

// 모바일 풀스크린 / 데스크톱 중앙 카드 모달. ESC + 배경 클릭 닫기 + 스크롤 락.
export function EndfieldModal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
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
    <div className="fixed inset-0 z-[120] flex items-stretch justify-center sm:items-center sm:p-4">
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
          "relative flex w-full flex-col border-ef-line bg-ef-card",
          "h-full border-0 sm:h-auto sm:max-h-[85vh] sm:max-w-lg sm:rounded-2xl sm:border",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-ef-line px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:pt-3">
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

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-ef-line p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
