import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "./cn";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

// 모든 페이지 상단 헤더. 일관된 eyebrow / title / subtitle / 액션 구조.
export function PageHeader({
  title,
  eyebrow,
  subtitle,
  actions,
  backHref,
  backLabel = "뒤로",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "rounded-2xl border border-ef-line bg-ef-card p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ef-accent-soft/80">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="mt-1.5 truncate text-2xl font-black tracking-tight text-ef-accent-soft sm:text-3xl">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-1 line-clamp-1 text-xs text-ef-muted sm:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>

        {actions || backHref ? (
          <div className="flex shrink-0 items-center gap-2">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex min-h-11 items-center rounded-xl border border-ef-line bg-ef-bg px-3 text-xs font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft sm:px-4 sm:text-sm"
              >
                {backLabel}
              </Link>
            ) : null}
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
