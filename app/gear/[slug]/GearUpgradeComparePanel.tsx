import type { GearDetail } from "@/data/gear-types";

const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function UpgradeCard({
  title,
  rows,
  active,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[22px] border p-4 transition",
        active
          ? "border-yellow-300/40 bg-yellow-500/[0.06]"
          : "border-white/10 bg-[#080b11]/90",
      ].join(" ")}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p
          className="text-lg font-black"
          style={{ color: active ? YELLOW_TEXT : "#ffffff" }}
        >
          {title}
        </p>

        {active ? (
          <span className="rounded-full border border-yellow-300/40 bg-yellow-400/15 px-2 py-1 text-[10px] font-black text-yellow-100">
            CURRENT
          </span>
        ) : null}
      </div>

      <div className="grid gap-2">
        {rows.map((row) => (
          <div
            key={`${title}-${row.label}`}
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-3"
          >
            <p className="text-[10px] font-black tracking-[0.16em] text-zinc-500">
              {row.label}
            </p>
            <p className="mt-2 text-base font-black text-white">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GearUpgradeComparePanel({
  gear,
}: {
  gear: GearDetail;
}) {
  const columns = [
    {
      title: "기본",
      active: true,
      rows: [
        {
          label: gear.baseStat.label,
          value: gear.baseStat.value,
        },
        {
          label: gear.ability1.label,
          value: gear.ability1.values.base,
        },
        ...(gear.ability2
          ? [
              {
                label: gear.ability2.label,
                value: gear.ability2.values.base,
              },
            ]
          : []),
        {
          label: gear.attribute.label,
          value: gear.attribute.values.base,
        },
      ],
    },
    ...(gear.ability1.values.level1 || gear.attribute.values.level1
      ? [
          {
            title: "1강",
            rows: [
              {
                label: gear.ability1.label,
                value: gear.ability1.values.level1 ?? "-",
              },
              ...(gear.ability2
                ? [
                    {
                      label: gear.ability2.label,
                      value: gear.ability2.values.level1 ?? "-",
                    },
                  ]
                : []),
              {
                label: gear.attribute.label,
                value: gear.attribute.values.level1 ?? "-",
              },
            ],
          },
        ]
      : []),
    ...(gear.ability1.values.level2 || gear.attribute.values.level2
      ? [
          {
            title: "2강",
            rows: [
              {
                label: gear.ability1.label,
                value: gear.ability1.values.level2 ?? "-",
              },
              ...(gear.ability2
                ? [
                    {
                      label: gear.ability2.label,
                      value: gear.ability2.values.level2 ?? "-",
                    },
                  ]
                : []),
              {
                label: gear.attribute.label,
                value: gear.attribute.values.level2 ?? "-",
              },
            ],
          },
        ]
      : []),
    ...(gear.ability1.values.level3 || gear.attribute.values.level3
      ? [
          {
            title: "3강",
            rows: [
              {
                label: gear.ability1.label,
                value: gear.ability1.values.level3 ?? "-",
              },
              ...(gear.ability2
                ? [
                    {
                      label: gear.ability2.label,
                      value: gear.ability2.values.level3 ?? "-",
                    },
                  ]
                : []),
              {
                label: gear.attribute.label,
                value: gear.attribute.values.level3 ?? "-",
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <section
      className="overflow-hidden rounded-[24px] bg-[#05070b] shadow-[0_18px_42px_rgba(0,0,0,0.28)]"
      style={{ border: `1px solid ${YELLOW_BORDER}` }}
    >
      <div className="relative overflow-hidden border-b border-yellow-500/10 p-4 lg:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,210,74,0.12),transparent_34%)]" />
        <div className="relative">
          <p
            className="text-[10px] font-black tracking-[0.28em]"
            style={{ color: YELLOW_TEXT }}
          >
            UPGRADE COMPARISON
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            강화 비교표
          </h2>
        </div>
      </div>

      <div className="p-4 lg:p-5">
        <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
          {columns.map((column, index) => (
            <UpgradeCard
              key={`${column.title}-${index}`}
              title={column.title}
              rows={column.rows}
              active={column.active}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
