"use client";

const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border border-ef-line bg-ef-card px-4 py-3 transition ${
        disabled ? "opacity-45" : "hover:border-ef-accent/40"
      }`}
      style={CUT_SM}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer hidden"
      />

      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-ef-line text-[12px] font-black text-ef-accent transition peer-checked:border-ef-accent peer-checked:bg-ef-accent peer-checked:text-black">
        {checked ? "✓" : ""}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-bold text-ef-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-5 text-ef-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
