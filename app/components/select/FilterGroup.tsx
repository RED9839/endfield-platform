"use client";

import type { ReactNode } from "react";

const YELLOW_TEXT = "#ffdc70";

export default function FilterGroup({
  title,
  children,
  last = false,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-4 lg:mb-5"}>
      <h2
        className="mb-2 text-[11px] font-black tracking-[0.2em]"
        style={{ color: YELLOW_TEXT }}
      >
        {title}
      </h2>

      <div className="flex flex-wrap gap-2 lg:flex-col">
        {children}
      </div>
    </div>
  );
}