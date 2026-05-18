"use client";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder,
  className = "",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
}) {
  function clamp(next: number) {
    if (!Number.isFinite(next)) return min;
    const lower = Math.max(next, min);
    return typeof max === "number" ? Math.min(lower, max) : lower;
  }

  function update(next: number) {
    onChange(clamp(next));
  }

  return (
    <div
      className={`flex h-10 overflow-hidden rounded-xl border bg-black ${className}`}
      style={{ borderColor: YELLOW_BORDER }}
    >
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(event) => update(Number(event.target.value || 0))}
        className="min-w-0 flex-1 bg-black px-3 text-right text-sm font-bold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <div
        className="flex w-8 flex-col border-l"
        style={{ borderColor: YELLOW_BORDER }}
      >
        <button
          type="button"
          onClick={() => update(value + step)}
          className="flex flex-1 items-center justify-center text-[9px] leading-none transition hover:bg-yellow-400/10"
          style={{ color: YELLOW_MAIN }}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => update(value - step)}
          className="flex flex-1 items-center justify-center text-[9px] leading-none transition hover:bg-yellow-400/10"
          style={{ color: YELLOW_MAIN }}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
