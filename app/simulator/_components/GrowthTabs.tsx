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
              className="min-h-11 shrink-0 px-3 py-2 font-mono text-[11px] font-black uppercase tracking-wide transition duration-150"
              style={selected
                ? { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))", borderWidth: 1, borderStyle: "solid", borderColor: "#ffd24a", background: "rgba(255,210,74,0.2)", color: "#ffffff", boxShadow: "inset 0 -2px 0 0 #ff9a2f, 0 0 14px rgba(255,210,74,0.18)" }
                : { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))", borderWidth: 1, borderStyle: "solid", borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }}
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
