import type { GearDetail } from "@/data/gear-types";

const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function CompareRow({
  label,
  values,
  highlight,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "grid border-t border-white/10 bg-yellow-500/[0.04]"
          : "grid border-t border-white/10 bg-[#071019]"
      }
      style={{
        gridTemplateColumns: `180px repeat(${values.length}, minmax(0, 1fr))`,
      }}
    >
      <div className="border-r border-white/10 px-4 py-3 text-sm font-bold text-zinc-400">
        {label}
      </div>

      {values.map((value, index) => (
        <div
          key={`${label}-${index}`}
          className="border-r border-white/10 px-4 py-3 text-sm font-black text-white last:border-r-0"
        >
          {value}
        </div>
      ))}
    </div>
  );
}

export default function GearUpgradeComparePanel({
  gear,
}: {
  gear: GearDetail;
}) {
  const headers = [
    "기본",
    ...(gear.ability1.values.level1 || gear.attribute.values.level1
      ? ["1강"]
      : []),
    ...(gear.ability1.values.level2 || gear.attribute.values.level2
      ? ["2강"]
      : []),
    ...(gear.ability1.values.level3 || gear.attribute.values.level3
      ? ["3강"]
      : []),
  ];

  const makeValues = (values: {
    base: string;
    level1?: string;
    level2?: string;
    level3?: string;
  }) => [
    values.base,
    ...(values.level1 ? [values.level1] : []),
    ...(values.level2 ? [values.level2] : []),
    ...(values.level3 ? [values.level3] : []),
  ];

  const compareRows = [
    {
      label: gear.baseStat.label,
      values: [gear.baseStat.value],
      highlight: true,
    },
    {
      label: gear.ability1.label,
      values: makeValues(gear.ability1.values),
    },
    ...(gear.ability2
      ? [
          {
            label: gear.ability2.label,
            values: makeValues(gear.ability2.values),
          },
        ]
      : []),
    {
      label: gear.attribute.label,
      values: makeValues(gear.attribute.values),
    },
  ];

  return (
    <details
      className="overflow-hidden rounded-[24px] bg-[#05070b] p-5 shadow-[0_0_30px_rgba(250,204,21,0.04)]"
      style={{ border: `1px solid ${YELLOW_BORDER}` }}
    >
      <summary className="cursor-pointer list-none outline-none">
        <div
          className="flex items-center justify-between gap-3 border-b pb-3"
          style={{ borderColor: YELLOW_BORDER_SOFT }}
        >
          <div>
            <p
              className="text-[11px] font-bold tracking-[0.28em]"
              style={{ color: YELLOW_TEXT }}
            >
              LEVEL COMPARISON
            </p>
            <h2 className="mt-1 text-xl font-black text-white">레벨 비교표</h2>
          </div>

          <p className="text-sm font-bold text-zinc-400">펼쳐서 보기</p>
        </div>
      </summary>

      <div
        className="mt-4 overflow-hidden rounded-[18px]"
        style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
      >
        <div
          className="grid bg-[#0b1018]"
          style={{
            gridTemplateColumns: `180px repeat(${headers.length}, minmax(0, 1fr))`,
          }}
        >
          <div className="border-r border-white/10 px-4 py-3 text-sm font-black text-zinc-400">
            항목
          </div>

          {headers.map((label) => (
            <div
              key={label}
              className="border-r border-white/10 px-4 py-3 text-sm font-black last:border-r-0"
              style={{ color: YELLOW_TEXT }}
            >
              {label}
            </div>
          ))}
        </div>

        {compareRows.map((row, index) => (
          <CompareRow
            key={`${row.label}-${index}`}
            label={row.label}
            values={row.values}
            highlight={row.highlight}
          />
        ))}
      </div>
    </details>
  );
}