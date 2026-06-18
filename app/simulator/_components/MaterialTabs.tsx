import MaterialList from "./MaterialList";

export type MaterialTabKey = "all" | "operator" | "weapon";

type MaterialTabItem = {
  name: string;
  icon?: string;
  count: number;
  owned?: number;
  lacking?: number;
};

export type MaterialTab = {
  key: MaterialTabKey;
  label: string;
  summary: string;
  items: MaterialTabItem[];
  enabled: boolean;
  emptyText: string;
};

export default function MaterialTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: MaterialTab[];
  value: MaterialTabKey;
  onChange: (key: MaterialTabKey) => void;
}) {
  const activeTab = tabs.find((tab) => tab.key === value) ?? tabs[0];

  return (
    <>
      <div className="mobile-scroll-row -mx-1 mb-3 px-1 pb-1 sm:mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="min-h-11 shrink-0 px-3 py-2 font-mono text-[11px] font-black uppercase tracking-wide transition duration-150"
            style={activeTab.key === tab.key
              ? { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))", borderWidth: 1, borderStyle: "solid", borderColor: "#ffd24a", background: "rgba(255,210,74,0.2)", color: "#ffffff", boxShadow: "inset 0 -2px 0 0 #ff9a2f, 0 0 14px rgba(255,210,74,0.18)" }
              : { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))", borderWidth: 1, borderStyle: "solid", borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }}
          >
            {tab.label}
            <span className="ml-2 tabular-nums opacity-70">
              {tab.items.length.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {!activeTab.enabled ? (
        <div className="border border-ef-line bg-ef-card p-5 text-sm text-ef-muted" style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
          {activeTab.emptyText}
        </div>
      ) : activeTab.items.length ? (
        <MaterialList items={activeTab.items} columns={4} />
      ) : (
        <div className="border border-ef-line bg-ef-card p-5 text-sm text-ef-muted" style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
          계산된 필요 재화가 없습니다.
        </div>
      )}
    </>
  );
}
