import { Children, type ReactNode } from "react";

export type GrowthTabKey =
  | "progression"
  | "combat"
  | "talent"
  | "infrastructure"
  | "trust";

export type GrowthTab = {
  key: GrowthTabKey;
  label: string;
  summary: string;
};

export default function GrowthTabs({
  tabs,
  value,
  onChange,
  children,
}: {
  tabs: GrowthTab[];
  value: GrowthTabKey;
  onChange: (key: GrowthTabKey) => void;
  children: ReactNode;
}) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === value),
  );
  const panels = Children.toArray(children);

  return (
    <>
      <div
        className="mobile-scroll-row -mx-1 mb-3 px-1 pb-1 sm:mb-4"
        role="tablist"
        aria-label="성장 설정"
      >
        {tabs.map((tab) => {
          const selected = tab.key === value;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.key)}
              className={`min-h-11 shrink-0 rounded-xl px-3 py-2 text-xs font-black transition ${
                selected
                  ? "bg-[#ffd24a] text-black"
                  : "bg-black text-zinc-300 hover:text-yellow-200"
              }`}
              style={{
                border: `1px solid ${
                  selected
                    ? "rgba(255,210,74,0.55)"
                    : "rgba(255,196,74,0.10)"
                }`,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel">{panels[activeIndex] ?? null}</div>
    </>
  );
}
