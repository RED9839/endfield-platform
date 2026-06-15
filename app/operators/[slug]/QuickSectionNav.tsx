"use client";

import { useState } from "react";

type SectionLink = {
  href: string;
  label: string;
};

type Props = {
  links: SectionLink[];
  accent?: string;
};

// 기술 문서(인게임 데이터 인덱스) 스타일 섹션 네비. 동작은 그대로(아코디언 열기 + 스크롤).
export default function QuickSectionNav({ links, accent = "#ffd24a" }: Props) {
  const [active, setActive] = useState(links[0]?.href ?? "");

  function handleMove(href: string) {
    setActive(href);
    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);

    document.querySelectorAll("details[id]").forEach((item) => {
      const detail = item as HTMLDetailsElement;
      detail.open = detail.id === targetId;
    });

    window.history.replaceState(null, "", href);

    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    }
  }

  return (
    <nav
      className="sticky top-2 z-30 mb-3 border border-ef-line bg-black/85 p-1 backdrop-blur lg:top-4 lg:mb-5"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
      }}
    >
      <div className="flex items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="ml-2 mr-1 hidden shrink-0 items-center gap-1.5 sm:flex">
          <span className="h-2 w-2" style={{ background: accent }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ef-muted">
            Index
          </span>
        </span>

        {links.map((item, index) => {
          const isActive = item.href === active;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => handleMove(item.href)}
              className="group relative inline-flex min-h-10 shrink-0 items-center gap-2 px-3.5"
              style={isActive ? { background: `${accent}1f` } : undefined}
            >
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: isActive ? accent : "#a0a0a0" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-xs font-black transition sm:text-sm ${
                  isActive
                    ? "text-white"
                    : "text-zinc-300 group-hover:text-white"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`absolute inset-x-2 bottom-0 h-0.5 transition ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                style={{ background: accent }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
