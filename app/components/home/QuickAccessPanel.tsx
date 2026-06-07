"use client";

import Link from "next/link";

export type QuickAccessItem = {
  label: string;
  href: string;
  description: string;
};

interface QuickAccessPanelProps {
  items: QuickAccessItem[];
  compact?: boolean;
}

export default function QuickAccessPanel({
  items,
  compact = false,
}: QuickAccessPanelProps) {
  return (
    <div
      className={
        compact
          ? "mobile-scroll-row -mx-1 px-1 pb-1 md:mx-0 md:grid md:grid-cols-3 md:px-0 xl:grid-cols-6"
          : "grid gap-3 md:grid-cols-2 xl:grid-cols-2"
      }
    >
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={[
            "group rounded-[18px] border border-yellow-500/15 bg-[#060b14] transition hover:border-yellow-500/35 hover:bg-[#0a1120]",
            compact
              ? "min-w-[138px] p-3.5 md:min-w-0 md:p-4"
              : "p-6",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div
                className={
                  compact
                    ? "truncate text-base font-bold text-white"
                    : "text-3xl font-bold text-white"
                }
              >
                {item.label}
              </div>

              <p
                className={
                  compact
                    ? "mt-2 line-clamp-2 text-xs leading-5 text-zinc-400"
                    : "mt-2 text-sm leading-6 text-zinc-400"
                }
              >
                {item.description}
              </p>
            </div>

            {!compact ? (
              <div className="text-5xl font-black tracking-tight text-yellow-400/35">
                {String(index + 1).padStart(2, "0")}
              </div>
            ) : null}
          </div>

          <div className={compact ? "mt-4 flex items-center justify-between" : "mt-8 flex items-center justify-between"}>
            <span
              className={
                compact
                  ? "text-sm font-bold text-yellow-400"
                  : "text-xl font-bold text-yellow-400"
              }
            >
              이동
            </span>

            <span className="text-zinc-500 transition group-hover:translate-x-1 group-hover:text-yellow-400">
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
