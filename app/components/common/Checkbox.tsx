"use client";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_BORDER = "rgba(255,196,74,0.18)";

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
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
        disabled ? "opacity-45" : "hover:border-yellow-400/35"
      }`}
      style={{
        borderColor: YELLOW_BORDER,
        background: "#090d14",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer hidden"
      />

      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[12px] font-black transition peer-checked:border-yellow-400 peer-checked:bg-yellow-400 peer-checked:text-black"
        style={{
          borderColor: YELLOW_BORDER,
          color: YELLOW_MAIN,
        }}
      >
        {checked ? "✓" : ""}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-bold text-white">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
