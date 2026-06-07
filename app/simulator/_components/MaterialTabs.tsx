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
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-xl px-3 py-2 text-xs font-black transition ${
              activeTab.key === tab.key
                ? "bg-[#ffd24a] text-black"
                : "bg-black text-zinc-300 hover:text-yellow-200"
            }`}
            style={{
              border: `1px solid ${
                activeTab.key === tab.key
                  ? "rgba(255,210,74,0.55)"
                  : "rgba(255,196,74,0.10)"
              }`,
            }}
          >
            {tab.label}
            <span className="ml-2 opacity-70">
              {tab.items.length.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {!activeTab.enabled ? (
        <div className="rounded-2xl border border-yellow-500/10 bg-[#090d14] p-5 text-sm text-zinc-500">
          {activeTab.emptyText}
        </div>
      ) : activeTab.items.length ? (
        <MaterialList items={activeTab.items} columns={4} />
      ) : (
        <div className="rounded-2xl border border-yellow-500/10 bg-[#090d14] p-5 text-sm text-zinc-500">
          계산된 필요 재화가 없습니다.
        </div>
      )}
    </>
  );
}
