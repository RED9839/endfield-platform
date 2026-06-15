import { cn } from "./cn";

// 로딩 스피너(산업 디자인: 얇은 링 + 노란 포인트). 과한 애니메이션 지양.
export function EndfieldLoading({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[160px] flex-col items-center justify-center gap-3 text-ef-muted",
        className,
      )}
    >
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-ef-line border-t-ef-accent" />
      {label ? <p className="text-xs font-bold">{label}</p> : null}
    </div>
  );
}
