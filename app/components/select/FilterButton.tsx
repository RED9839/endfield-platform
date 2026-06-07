"use client";

import Image from "next/image";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const FILTER_BG = "#071019";

export default function FilterButton({
  active,
  label,
  onClick,
  iconSrc,
  color = YELLOW_MAIN,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  iconSrc?: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 max-w-full shrink-0 items-center justify-start gap-2 rounded-xl px-3 text-left text-xs font-bold transition hover:bg-[#101923] lg:h-9 lg:min-h-0 lg:w-full"
      style={{
        background: active ? "rgba(255,212,74,0.10)" : FILTER_BG,
        border: `1px solid ${active ? color : "rgba(255,255,255,0.10)"}`,
        color: active ? YELLOW_TEXT : "#d4d4d8",
      }}
    >
      {iconSrc ? (
        <span className="relative h-4 w-4 shrink-0">
          <Image
            src={iconSrc}
            alt={label}
            fill
            sizes="16px"
            className="object-contain"
          />
        </span>
      ) : (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: color }}
        />
      )}

      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}
