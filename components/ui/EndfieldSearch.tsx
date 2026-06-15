import { Search, X } from "lucide-react";

import { cn } from "./cn";

// 통합 검색 입력. controlled(부모 소유). 높이 44px.
export function EndfieldSearch({
  value,
  onChange,
  placeholder = "검색",
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-11 items-center gap-2 rounded-xl border border-ef-line bg-ef-card2 px-3 transition focus-within:border-ef-accent/50",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-ef-muted" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ef-ink outline-none placeholder:text-ef-muted/70"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="검색어 지우기"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-ef-muted transition hover:text-ef-ink"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
