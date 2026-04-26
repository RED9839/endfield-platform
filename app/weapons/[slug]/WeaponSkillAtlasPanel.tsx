"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";

type SkillStat = {
  label: string;
  value: string | number;
};

type SkillLevelValue = {
  rank: string;
  description?: string;
  stats?: SkillStat[];
};

type SkillCompareRow = {
  label: string;
  values: (string | number)[];
};

type WeaponSkillMeta = {
  label: string;
  value: string | number;
};

export type WeaponSkillDetail = {
  key: string;
  typeLabel?: string;
  name: string;
  icon?: string;
  meta?: WeaponSkillMeta[];
  levelValues: SkillLevelValue[];
  compareRows?: SkillCompareRow[];
};

type Props = {
  skill: WeaponSkillDetail;
  accentColor?: string;
};

type TextHighlightMatch = {
  start: number;
  end: number;
  text: string;
};

const UNIFIED_YELLOW = "#ffd24a";
const UNIFIED_YELLOW_SOFT = "#ffdc70";
const PANEL_BG = "#06080c";
const PANEL_INNER_BG = "#0d1118";
const PANEL_BUTTON_BG = "#0c1016";
const PANEL_BORDER = "rgba(255,196,74,0.14)";
const PANEL_BORDER_SOFT = "rgba(255,196,74,0.10)";
const PANEL_BORDER_FAINT = "rgba(255,196,74,0.08)";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectValueMatches(
  text: string,
  statValues: Array<string | number>
): TextHighlightMatch[] {
  if (!text || !statValues.length) return [];

  const targets = Array.from(
    new Set(
      statValues
        .map((value) => String(value).trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
    )
  );

  if (!targets.length) return [];

  const matches: TextHighlightMatch[] = [];

  for (const target of targets) {
    const regex = new RegExp(escapeRegExp(target), "g");

    for (const match of text.matchAll(regex)) {
      const start = match.index ?? 0;
      const value = match[0];

      matches.push({
        start,
        end: start + value.length,
        text: value,
      });
    }
  }

  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  const filtered: TextHighlightMatch[] = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  return filtered;
}

function highlightElementTerms(text: string): ReactNode {
  const colorMap: Array<{ pattern: RegExp; color: string }> = [
    { pattern: /물리 피해/g, color: "#cfd8e3" },
    { pattern: /열기 피해/g, color: "#ff7a59" },
    { pattern: /전기 피해/g, color: "#FBCB38" },
    { pattern: /냉기 피해/g, color: "#63b3ff" },
    { pattern: /자연 피해/g, color: "#7ddc6d" },
    { pattern: /물리/g, color: "#cfd8e3" },
    { pattern: /열기/g, color: "#ff7a59" },
    { pattern: /전기/g, color: "#FBCB38" },
    { pattern: /냉기/g, color: "#63b3ff" },
    { pattern: /자연/g, color: "#7ddc6d" },
    { pattern: /연소/g, color: "#ff7a59" },
    { pattern: /감전/g, color: "#FBCB38" },
    { pattern: /동결/g, color: "#63b3ff" },
    { pattern: /부식/g, color: "#7ddc6d" },
    { pattern: /띄우기/g, color: "#cfd8e3" },
    { pattern: /방어 불능/g, color: "#cfd8e3" },
  ];

  const matches: Array<{
    start: number;
    end: number;
    text: string;
    color: string;
  }> = [];

  colorMap.forEach(({ pattern, color }) => {
    for (const match of text.matchAll(pattern)) {
      const start = match.index ?? 0;
      const value = match[0];

      matches.push({
        start,
        end: start + value.length,
        text: value,
        color,
      });
    }
  });

  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  const filtered: typeof matches = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  if (!filtered.length) return text;

  const parts: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (match.start > cursor) {
      parts.push(
        <Fragment key={`plain-${index}-${cursor}`}>
          {text.slice(cursor, match.start)}
        </Fragment>
      );
    }

    parts.push(
      <span
        key={`hl-${index}-${match.start}`}
        style={{
          color: match.color,
          fontWeight: 800,
        }}
      >
        {match.text}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(
      <Fragment key={`tail-${cursor}`}>{text.slice(cursor)}</Fragment>
    );
  }

  return parts;
}

function renderHighlightedDescription(
  text: string,
  statValues: Array<string | number>
): ReactNode {
  const matches = collectValueMatches(text, statValues);

  if (!matches.length) {
    return highlightElementTerms(text);
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match, index) => {
    if (match.start > cursor) {
      parts.push(
        <Fragment key={`text-${index}-${cursor}`}>
          {highlightElementTerms(text.slice(cursor, match.start))}
        </Fragment>
      );
    }

    parts.push(
      <span
        key={`value-${index}-${match.start}`}
        style={{
          color: UNIFIED_YELLOW,
          fontWeight: 900,
        }}
      >
        {match.text}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(
      <Fragment key={`tail-${cursor}`}>
        {highlightElementTerms(text.slice(cursor))}
      </Fragment>
    );
  }

  return parts;
}

function FoldSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        marginTop: "14px",
        border: `1px solid ${PANEL_BORDER}`,
        background: "#0a0d12",
        clipPath:
          "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "13px 14px",
          background: "transparent",
          border: "none",
          color: "#edf2f7",
          fontSize: "13px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          cursor: "pointer",
        }}
      >
        <span>{title}</span>
        <span style={{ color: UNIFIED_YELLOW }}>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div style={{ borderTop: `1px solid ${PANEL_BORDER_SOFT}` }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function inferTypeLabel(skill: WeaponSkillDetail) {
  const raw = (skill.typeLabel ?? "").trim();
  const key = (skill.key ?? "").toLowerCase();
  const name = (skill.name ?? "").toLowerCase();
  const metas = skill.meta ?? [];

  const metaHas = (target: string) =>
    metas.some(
      (meta) =>
        String(meta.label).includes(target) || String(meta.value).includes(target)
    );

  if (metaHas("능력치")) return "능력치";
  if (metaHas("속성")) return "속성";
  if (metaHas("시리즈 스킬")) return "시리즈 스킬";

  if (raw.includes("능력치")) return "능력치";
  if (raw.includes("속성")) return "속성";
  if (raw.includes("시리즈")) return "시리즈 스킬";

  if (
    key.includes("stat") ||
    key.includes("status") ||
    key.includes("ability") ||
    key.includes("main-attribute") ||
    key.includes("strength") ||
    key.includes("agility") ||
    key.includes("intelligence") ||
    key.includes("will") ||
    name.includes("주요 능력치") ||
    name.includes("힘 증가") ||
    name.includes("민첩 증가") ||
    name.includes("지능 증가") ||
    name.includes("의지 증가")
  ) {
    return "능력치";
  }

  if (
    key.includes("attack") ||
    key.includes("hp") ||
    key.includes("crit") ||
    key.includes("element") ||
    key.includes("attr") ||
    key.includes("property") ||
    key.includes("ultimate-gain") ||
    key.includes("arts-intensity") ||
    key.includes("heal") ||
    name.includes("공격력 증가") ||
    name.includes("생명력 증가") ||
    name.includes("치명타 확률 증가") ||
    name.includes("치유 효율 증가") ||
    name.includes("궁극기 충전 효율 증가") ||
    name.includes("오리지늄 아츠 강도 증가") ||
    name.includes("물리 피해 증가") ||
    name.includes("열기 피해 증가") ||
    name.includes("전기 피해 증가") ||
    name.includes("냉기 피해 증가") ||
    name.includes("자연 피해 증가") ||
    name.includes("아츠 피해 증가")
  ) {
    return "속성";
  }

  return "시리즈 스킬";
}

function getDisplayTypeLabel(skill: WeaponSkillDetail) {
  const directMeta = skill.meta?.find((meta) =>
    ["능력치", "속성", "시리즈 스킬"].includes(String(meta.label).trim())
  );

  if (directMeta) {
    return String(directMeta.label).trim();
  }

  return inferTypeLabel(skill);
}

export default function WeaponSkillAtlasPanel({ skill }: Props) {
  const levels = useMemo(() => skill.levelValues ?? [], [skill.levelValues]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = levels[selectedIndex] ?? levels[0];

  if (!current) return null;

  const normalizedTypeLabel = getDisplayTypeLabel(skill);
  const isSimpleSkill =
    normalizedTypeLabel === "능력치" || normalizedTypeLabel === "속성";

  const showStats = !isSimpleSkill && !!current.stats?.length;
  const showDescription = !!current.description;
  const showCompareRows = !!skill.compareRows?.length;

  const currentStatValues = (current.stats ?? []).map((stat) => stat.value);

  const descriptionNodes =
    current.description && showDescription
      ? renderHighlightedDescription(current.description, currentStatValues)
      : null;

  return (
    <section
      style={{
        clipPath:
          "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
        background: PANEL_BG,
        border: `1px solid ${PANEL_BORDER}`,
        padding: "16px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
      }}
    >
      <div>
        <div
          style={{
            color: "#aeb8c7",
            fontSize: "12px",
            letterSpacing: "0.14em",
            marginBottom: "6px",
          }}
        >
          {normalizedTypeLabel}
        </div>

        <div
          style={{
            color: UNIFIED_YELLOW_SOFT,
            fontSize: "30px",
            fontWeight: 900,
            lineHeight: 1.1,
            wordBreak: "keep-all",
          }}
        >
          {skill.name}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginTop: "16px",
        }}
      >
        {levels.map((level, index) => {
          const active = selectedIndex === index;

          return (
            <button
              key={`${skill.name}-${level.rank}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              style={{
                minWidth: "70px",
                height: "34px",
                padding: "0 10px",
                border: active
                  ? `1px solid ${UNIFIED_YELLOW}`
                  : `1px solid ${PANEL_BORDER}`,
                background: active ? "rgba(255,210,74,0.14)" : PANEL_BUTTON_BG,
                color: "#f3f4f6",
                fontWeight: 800,
                cursor: "pointer",
                clipPath:
                  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                boxShadow: active
                  ? "inset 0 0 0 1px rgba(255,210,74,0.10)"
                  : "none",
              }}
            >
              Rank {level.rank}
            </button>
          );
        })}
      </div>

      {showDescription && (
        <div
          style={{
            marginTop: "12px",
            border: `1px solid ${PANEL_BORDER_SOFT}`,
            background: PANEL_INNER_BG,
            padding: "14px 16px",
            color: "#d1d5db",
            fontSize: "15px",
            lineHeight: 1.8,
            whiteSpace: "pre-line",
            clipPath:
              "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
          }}
        >
          {descriptionNodes}
        </div>
      )}

      {showStats && (
        <div
          style={{
            marginTop: "12px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          {current.stats!.map((stat) => (
            <div
              key={`${skill.name}-${current.rank}-${stat.label}`}
              style={{
                border: `1px solid ${PANEL_BORDER_SOFT}`,
                background: PANEL_INNER_BG,
                padding: "12px",
                clipPath:
                  "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
              }}
            >
              <div
                style={{
                  color: "#9fb3c8",
                  fontSize: "12px",
                  marginBottom: "6px",
                  fontWeight: 800,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  color: UNIFIED_YELLOW,
                  fontSize: "20px",
                  fontWeight: 900,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCompareRows && (
        <FoldSection title="Rank 비교" defaultOpen={false}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "860px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      color: "#9fb3c8",
                      fontSize: "12px",
                      padding: "12px",
                      borderBottom: `1px solid ${PANEL_BORDER_SOFT}`,
                    }}
                  >
                    항목
                  </th>
                  {levels.map((level) => (
                    <th
                      key={`${skill.name}-thead-${level.rank}`}
                      style={{
                        textAlign: "center",
                        color: "#9fb3c8",
                        fontSize: "12px",
                        padding: "12px",
                        borderBottom: `1px solid ${PANEL_BORDER_SOFT}`,
                      }}
                    >
                      Rank {level.rank}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {skill.compareRows!.map((row) => (
                  <tr key={`${skill.name}-${row.label}`}>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: `1px solid ${PANEL_BORDER_FAINT}`,
                        color: "#e5e7eb",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      {row.label}
                    </td>

                    {row.values.map((value, index) => (
                      <td
                        key={`${skill.name}-${row.label}-${index}`}
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${PANEL_BORDER_FAINT}`,
                          color: "#d1d5db",
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FoldSection>
      )}
    </section>
  );
}