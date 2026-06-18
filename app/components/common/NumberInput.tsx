"use client";

const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

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
      className={`flex h-10 overflow-hidden border border-ef-line bg-ef-card ${className}`}
      style={CUT_SM}
    >
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(event) => update(Number(event.target.value || 0))}
        className="min-w-0 flex-1 bg-transparent px-3 text-right text-sm font-bold text-ef-accent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <div className="flex w-8 flex-col border-l border-ef-line">
        <button
          type="button"
          onClick={() => update(value + step)}
          className="flex flex-1 items-center justify-center text-[9px] leading-none text-ef-accent transition hover:bg-ef-accent/10"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => update(value - step)}
          className="flex flex-1 items-center justify-center text-[9px] leading-none text-ef-accent transition hover:bg-ef-accent/10"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
