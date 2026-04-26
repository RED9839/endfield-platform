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
      className={`relative grid gap-3 ${
        compact
          ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
          : "md:grid-cols-2 xl:grid-cols-2"
      }`}
    >
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`group rounded-[18px] border border-yellow-500/15 bg-[#060b14] transition hover:border-yellow-500/35 hover:bg-[#0a1120] ${
            compact ? "p-4" : "p-6"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className={`font-bold text-white ${
                  compact ? "text-lg" : "text-3xl"
                }`}
              >
                {item.label}
              </div>

              <p
                className={`mt-2 leading-6 text-zinc-400 ${
                  compact ? "text-xs" : "text-sm"
                }`}
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

          <div
            className={`flex items-center justify-between ${
              compact ? "mt-4" : "mt-8"
            }`}
          >
            <span
              className={`font-bold text-yellow-400 ${
                compact ? "text-sm" : "text-xl"
              }`}
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