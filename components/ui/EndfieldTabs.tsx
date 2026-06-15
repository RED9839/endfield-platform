import { cn } from "./cn";

type Tab = { value: string; label: string; count?: number };

// 가로 스크롤 탭(모바일 우선). 상태는 부모가 소유(controlled).
export function EndfieldTabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border px-4 text-sm font-bold transition",
              active
                ? "border-ef-accent/50 bg-ef-accent/10 text-ef-accent-soft"
                : "border-ef-line bg-ef-card text-ef-muted hover:text-ef-ink",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span className="text-[11px] font-black text-ef-muted">
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
