"use client";

import { useState, type ReactNode } from "react";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/72 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="flex h-[92vh] w-full max-w-[1540px] flex-col overflow-hidden rounded-t-[24px] bg-[#05070b] shadow-[0_22px_90px_rgba(0,0,0,0.62)] sm:max-h-[90vh] sm:rounded-[28px]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 p-4 sm:p-5"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div className="min-w-0">
            <p
              className="text-[10px] font-semibold tracking-[0.28em] sm:text-[11px] sm:tracking-[0.35em]"
              style={{ color: YELLOW_TEXT }}
            >
              엔드필드 지원 플랫폼
            </p>

            <h2
              className="mt-1 truncate text-xl font-black tracking-tight sm:mt-2 sm:text-3xl"
              style={{ color: YELLOW_TEXT }}
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-lg font-black text-white transition hover:bg-[#0b1018] sm:h-11 sm:w-11"
            style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
          >
            ×
          </button>
        </div>

        <div className="hidden min-h-0 flex-1 gap-5 overflow-hidden p-5 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
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
            className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[24px] bg-[#05070b] p-3"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="mb-3 flex shrink-0 items-center justify-between pb-3"
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

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {children}
            </div>
          </section>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 lg:hidden">
          <section
            className="sticky top-0 z-30 mb-3 overflow-hidden rounded-[20px] bg-[#05070b] shadow-[0_0_24px_rgba(0,0,0,0.32)]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <span className="min-w-0">
                <span
                  className="block text-[11px] font-black tracking-[0.2em]"
                  style={{ color: YELLOW_TEXT }}
                >
                  검색 / 필터
                </span>

                <span className="mt-1 block truncate text-xs text-zinc-500">
                  이름 검색 및 조건 필터
                </span>
              </span>

              <span
                className={[
                  "shrink-0 text-lg font-black text-yellow-300 transition-transform",
                  isFilterOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                ▼
              </span>
            </button>

            <div className={isFilterOpen ? "block" : "hidden"}>
              <div
                className="bg-[#05070b] p-3"
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
                    className="h-10 w-full rounded-xl border border-white/20 bg-[#071019] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400/50"
                  />
                </div>
              </div>

              <div className="p-3">{aside}</div>
            </div>
          </section>

          <section
            className="min-w-0 rounded-[20px] bg-[#05070b] p-3"
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

            {children}
          </section>
        </div>
      </div>
    </div>
  );
}