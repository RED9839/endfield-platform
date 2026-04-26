import type { GearDetail } from "@/data/gear-types";

const COLOR = "#ffcc4d";

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
      style={{
        display: "grid",
        gridTemplateColumns: `180px repeat(${values.length}, 1fr)`,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: highlight ? "rgba(250,204,21,0.04)" : "#090d14",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          color: "#9ca3af",
          fontWeight: 700,
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {label}
      </div>

      {values.map((value, index) => (
        <div
          key={`${label}-${index}`}
          style={{
            padding: "12px 14px",
            color: "#fff",
            fontWeight: 800,
            borderRight:
              index < values.length - 1
                ? "1px solid rgba(255,255,255,0.08)"
                : "none",
          }}
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
    ...(gear.ability1.values.level1 || gear.attribute.values.level1 ? ["1강"] : []),
    ...(gear.ability1.values.level2 || gear.attribute.values.level2 ? ["2강"] : []),
    ...(gear.ability1.values.level3 || gear.attribute.values.level3 ? ["3강"] : []),
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
      style={{
        border: `1px solid ${COLOR}44`,
        background: "#05070b",
        padding: "18px",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          listStyle: "none",
          outline: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            borderBottom: "1px solid rgba(247,166,0,0.12)",
            paddingBottom: "10px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.28em",
                color: "rgba(255,210,90,0.68)",
              }}
            >
              LEVEL COMPARISON
            </div>
            <div
              style={{
                marginTop: "4px",
                fontSize: "22px",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              레벨 비교표
            </div>
          </div>

          <div
            style={{
              color: "#9ca3af",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            펼쳐서 보기
          </div>
        </div>
      </summary>

      <div style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `180px repeat(${headers.length}, 1fr)`,
            background: "#0b1018",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              color: "#9ca3af",
              fontWeight: 800,
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            항목
          </div>

          {headers.map((label, index) => (
            <div
              key={label}
              style={{
                padding: "12px 14px",
                color: COLOR,
                fontWeight: 900,
                borderRight:
                  index < headers.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "none",
            overflow: "hidden",
          }}
        >
          {compareRows.map((row, index) => (
            <CompareRow
              key={`${row.label}-${index}`}
              label={row.label}
              values={row.values}
              highlight={row.highlight}
            />
          ))}
        </div>
      </div>
    </details>
  );
}