"use client";

import type { ReactNode } from "react";

const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

export default function PickerShell({
  title,
  count,
  searchValue,
  searchPlaceholder,
  onSearch,
  onClose,
  aside,
  children,
}: {
  title: string;
  count: number;
  searchValue: string;
  searchPlaceholder: string;
  onSearch: (value: string) => void;
  onClose: () => void;
  aside: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm">
      <div
        className="max-h-[90vh] w-full max-w-[1540px] overflow-hidden rounded-[28px] bg-[#05070b] shadow-[0_22px_90px_rgba(0,0,0,0.62)]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="flex items-center justify-between gap-4 p-5"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div>
            <p
              className="text-[11px] font-semibold tracking-[0.35em]"
              style={{ color: YELLOW_TEXT }}
            >
              ENDFIELD SUPPORT PLATFORM
            </p>

            <h2
              className="mt-2 text-3xl font-black tracking-tight"
              style={{ color: YELLOW_TEXT }}
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-lg font-black text-white transition hover:bg-[#0b1018]"
            style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
          >
            ×
          </button>
        </div>

        <div className="grid max-h-[calc(90vh-104px)] min-h-0 gap-5 overflow-hidden p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside
            className="flex max-h-[calc(90vh-144px)] min-h-0 flex-col overflow-hidden rounded-[24px] bg-[#05070b]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="shrink-0 bg-[#05070b] p-4"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <h3
                className="mb-2 text-[11px] font-black tracking-[0.2em]"
                style={{ color: YELLOW_TEXT }}
              >
                검색
              </h3>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  ⌕
                </span>

                <input
                  value={searchValue}
                  onChange={(event) => onSearch(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-xl border border-white/20 bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400/50"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">{aside}</div>
          </aside>

          <section
            className="min-w-0 overflow-hidden rounded-[24px] bg-[#05070b] p-3"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="mb-3 flex items-center justify-between pb-3"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <p className="text-sm text-zinc-400">
                총{" "}
                <span className="font-black" style={{ color: YELLOW_TEXT }}>
                  {count}
                </span>
                개
              </p>
            </div>

            <div className="max-h-[calc(90vh-210px)] overflow-y-auto pr-1">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}