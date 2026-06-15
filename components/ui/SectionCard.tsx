import type { ReactNode } from "react";

import { cn } from "./cn";

type SectionCardProps = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

// 제목 헤더 + 본문 구조의 섹션 카드.
export function SectionCard({
  title,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-ef-line bg-ef-card",
        className,
      )}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-3 border-b border-ef-line px-4 py-3 sm:px-5 sm:py-4">
          {title ? (
            <h2 className="text-sm font-black tracking-tight text-ef-accent-soft sm:text-base">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}

      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
