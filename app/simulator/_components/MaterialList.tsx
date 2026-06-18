"use client";

import Image from "next/image";

const ACCENT = "#ffd24a";
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

type MaterialItem = {
  name: string;
  icon?: string;
  count: number;
  owned?: number;
  lacking?: number;
};

export default function MaterialList({
  items,
  columns = 4,
}: {
  items: MaterialItem[];
  columns?: 2 | 3 | 4;
}) {
  const gridClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 3
      ? "md:grid-cols-2 xl:grid-cols-3"
      : "md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={`grid gap-3 ${gridClass}`}>
      {items.map((item) => (
        <div
          key={item.name}
          className="border border-ef-line bg-ef-card p-3 transition hover:border-ef-accent/30"
          style={CUT_SM}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative h-11 w-11 shrink-0 overflow-hidden border border-ef-line bg-black"
              style={CUT_SM}
            >
              <Image
                src={item.icon ?? `/materials/${item.name}.webp`}
                alt={item.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-ef-ink">{item.name}</div>
              <div className="mt-1 font-mono text-sm font-bold tabular-nums" style={{ color: ACCENT }}>
                {item.count.toLocaleString()}
              </div>
            </div>
          </div>

          {typeof item.owned === "number" || typeof item.lacking === "number" ? (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div
                className="border border-ef-line bg-ef-card2 px-3 py-2 text-ef-muted"
                style={CUT_SM}
              >
                보유 <span className="ml-1 font-semibold tabular-nums text-ef-ink">{(item.owned ?? 0).toLocaleString()}</span>
              </div>
              <div
                className="border border-ef-line bg-ef-card2 px-3 py-2 text-ef-muted"
                style={CUT_SM}
              >
                부족 <span className="ml-1 font-semibold tabular-nums" style={{ color: ACCENT }}>{(item.lacking ?? 0).toLocaleString()}</span>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
