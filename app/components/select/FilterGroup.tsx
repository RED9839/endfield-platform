"use client";

import type { ReactNode } from "react";

const YELLOW_TEXT = "#ffdc70";

export default function FilterGroup({
  title,
  children,
  last = false,
  grid = false,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
  grid?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-4 lg:mb-5"}>
      <h2
        className="mb-2 text-[11px] font-black tracking-[0.2em]"
        style={{ color: YELLOW_TEXT }}
      >
        {title}
      </h2>

      <div
        className={
          grid
            ? "grid min-w-0 max-w-full grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-2 lg:grid-cols-1"
            : "flex min-w-0 max-w-full flex-wrap gap-2 pb-1 lg:flex-col lg:flex-nowrap lg:pb-0"
        }
      >
        {children}
      </div>
    </div>
  );
}
