"use client";

import Image from "next/image";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const CARD_BG = "rgba(9,13,20,0.96)";

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
          className="rounded-2xl border p-3 transition hover:border-yellow-400/25"
          style={{ borderColor: YELLOW_BORDER_SOFT, background: CARD_BG }}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black/50"
              style={{ borderColor: YELLOW_BORDER_SOFT }}
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
              <div className="truncate text-sm font-semibold text-white">{item.name}</div>
              <div className="mt-1 text-sm font-bold" style={{ color: YELLOW_MAIN }}>
                {item.count.toLocaleString()}
              </div>
            </div>
          </div>

          {typeof item.owned === "number" || typeof item.lacking === "number" ? (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div
                className="rounded-xl border bg-black/40 px-3 py-2 text-zinc-400"
                style={{ borderColor: YELLOW_BORDER_SOFT }}
              >
                보유 <span className="ml-1 font-semibold text-white">{(item.owned ?? 0).toLocaleString()}</span>
              </div>
              <div
                className="rounded-xl border bg-black/40 px-3 py-2 text-zinc-400"
                style={{ borderColor: YELLOW_BORDER_SOFT }}
              >
                부족 <span className="ml-1 font-semibold" style={{ color: YELLOW_MAIN }}>{(item.lacking ?? 0).toLocaleString()}</span>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
