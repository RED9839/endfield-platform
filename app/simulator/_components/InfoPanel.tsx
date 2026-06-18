"use client";

import { useState, type ReactNode } from "react";

export const YELLOW_MAIN = "#ffd24a";
export const YELLOW_TEXT = "#ffdc70";
export const YELLOW_BORDER = "rgba(255,196,74,0.14)";
export const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
export const PANEL_BG = "#05070b";
export const CARD_BG = "rgba(9,13,20,0.96)";

const PRIMARY = "#ff9a2f";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};

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
      className="overflow-hidden border border-ef-line bg-ef-card2"
      style={CUT}
    >
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 border-b border-ef-line px-3.5 py-3 text-left transition hover:bg-white/[0.02] sm:gap-4 sm:px-5 sm:py-4"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-4 w-1 shrink-0" style={{ background: PRIMARY }} />
          <h3 className="truncate text-base font-black tracking-tight text-white sm:text-lg">
            {title}
          </h3>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          {collapsed ? (
            <div className="hidden max-w-[560px] truncate text-right text-sm font-semibold text-ef-muted md:block">
              {summary?.trim() ? summary : "설정 내용을 확인해 주세요."}
            </div>
          ) : null}

          <div className="inline-flex h-9 w-9 items-center justify-center border border-ef-line bg-ef-card text-base text-ef-accent-soft">
            {collapsed ? "+" : "−"}
          </div>
        </div>
      </button>

      {collapsed ? (
        <div className="px-5 py-4 text-sm font-semibold text-ef-muted md:hidden">
          {summary?.trim() ? summary : "설정 내용을 확인해 주세요."}
        </div>
      ) : (
        <div className="p-3 sm:p-5">{children}</div>
      )}
    </section>
  );
}
