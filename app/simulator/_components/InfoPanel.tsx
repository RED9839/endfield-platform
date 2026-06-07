"use client";

import { useState, type ReactNode } from "react";

export const YELLOW_MAIN = "#ffd24a";
export const YELLOW_TEXT = "#ffdc70";
export const YELLOW_BORDER = "rgba(255,196,74,0.14)";
export const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
export const PANEL_BG = "#05070b";
export const CARD_BG = "rgba(9,13,20,0.96)";

export default function InfoPanel({
  title,
  children,
  summary,
  defaultCollapsed = false,
}: {
  title: string;
  children: ReactNode;
  summary?: string;
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <section
      className="overflow-hidden rounded-[22px] border shadow-[0_12px_36px_rgba(0,0,0,0.22)]"
      style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
    >
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 border-b px-4 py-3.5 text-left transition hover:bg-white/[0.02] sm:px-5 sm:py-4"
        style={{ borderBottomColor: YELLOW_BORDER_SOFT }}
      >
        <div className="min-w-0">
          <h3
            className="truncate text-base font-black tracking-[-0.03em] sm:text-lg"
            style={{ color: YELLOW_TEXT }}
          >
            {title}
          </h3>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          {collapsed ? (
            <div className="hidden max-w-[560px] truncate text-right text-sm font-semibold text-zinc-400 md:block">
              {summary?.trim() ? summary : "설정 내용을 확인해 주세요."}
            </div>
          ) : null}

          <div
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-base"
            style={{ border: `1px solid ${YELLOW_BORDER}`, color: YELLOW_TEXT }}
          >
            {collapsed ? "+" : "−"}
          </div>
        </div>
      </button>

      {collapsed ? (
        <div className="px-5 py-4 text-sm font-semibold text-zinc-400 md:hidden">
          {summary?.trim() ? summary : "설정 내용을 확인해 주세요."}
        </div>
      ) : (
        <div className="p-4 sm:p-5" style={{ background: "rgba(0,0,0,0.06)" }}>{children}</div>
      )}
    </section>
  );
}
