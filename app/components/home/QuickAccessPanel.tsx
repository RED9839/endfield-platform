"use client";

import Link from "next/link";

const PRIMARY = "#ff9a2f";
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

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
            "group border border-ef-line bg-ef-card2 transition hover:border-ef-accent/40",
            compact
              ? "min-w-[138px] p-3.5 md:min-w-0 md:p-4"
              : "p-6",
          ].join(" ")}
          style={CUT_SM}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div
                className={
                  compact
                    ? "truncate text-base font-black text-white"
                    : "text-3xl font-black text-white"
                }
              >
                {item.label}
              </div>

              <p
                className={
                  compact
                    ? "mt-2 line-clamp-2 text-xs leading-5 text-ef-muted"
                    : "mt-2 text-sm leading-6 text-ef-muted"
                }
              >
                {item.description}
              </p>
            </div>

            {!compact ? (
              <div className="font-mono text-5xl font-black tracking-tight tabular-nums" style={{ color: `${PRIMARY}59` }}>
                {String(index + 1).padStart(2, "0")}
              </div>
            ) : null}
          </div>

          <div className={compact ? "mt-4 flex items-center justify-between" : "mt-8 flex items-center justify-between"}>
            <span
              className={
                compact
                  ? "text-sm font-black text-ef-accent"
                  : "text-xl font-black text-ef-accent"
              }
            >
              이동
            </span>

            <span className="text-ef-muted transition group-hover:translate-x-1 group-hover:text-ef-accent">
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
