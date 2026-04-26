"use client";

import Image from "next/image";
import { Fragment, useMemo, useState } from "react";

type SkillStat = {
  label: string;
  value: string | number;
};

type SkillLevelValue = {
  level: string;
  description: string;
  stats: SkillStat[];
};

type SkillCompareRow = {
  label: string;
  values: (string | number)[];
};

type SkillUpgradeMaterial = {
  level: string;
  materials: {
    name: string;
    icon?: string;
    count: string | number;
  }[];
};

type SkillMeta = {
  label: string;
  value?: string | number;
  valueRowLabel?: string;
};

type SkillDetail = {
  name: string;
  typeLabel: string;
  icon?: string;
  summary?: string;
  meta?: SkillMeta[];
  levelValues: SkillLevelValue[];
  compareRows: SkillCompareRow[];
  upgradeMaterials?: SkillUpgradeMaterial[];
  upgradeCosts?: SkillUpgradeMaterial[];
};

type Props = {
  skill: SkillDetail;
  accentColor: string;
};

const elementTextColorMap: Record<string, string> = {
  물리: "#cfd8e3",
  열기: "#ff7a59",
  냉기: "#63b3ff",
  냉정: "#63b3ff",
  자연: "#7ddc6d",
  전기: "#FBCB38",
};

const elementKeywordMap: Record<string, string[]> = {
  물리: ["물리 피해", "물리 부착"],
  열기: ["열기 피해", "열기 부착"],
  냉기: ["냉기 피해", "냉기 부착"],
  냉정: ["냉정 피해", "냉정 부착"],
  자연: ["자연 피해", "자연 부착"],
  전기: ["전기 피해", "전기 부착"],
};

const elementOrder = ["물리", "열기", "냉기", "냉정", "자연", "전기"] as const;

function getElementColor(element: string) {
  return elementTextColorMap[element] ?? "#f3f4f6";
}

function detectDamageElement(
  skill: SkillDetail,
  current?: SkillLevelValue
): string | null {
  const texts = [
    current?.description ?? "",
    skill.summary ?? "",
    ...(current?.stats?.map((stat) => stat.label) ?? []),
  ];

  for (const text of texts) {
    for (const element of elementOrder) {
      const keywords = elementKeywordMap[element];

      if (keywords.some((keyword) => keyword.includes("피해") && text.includes(keyword))) {
        return element;
      }
    }
  }

  for (const text of texts) {
    for (const element of elementOrder) {
      const keywords = elementKeywordMap[element];

      if (keywords.some((keyword) => text.includes(keyword))) {
        return element;
      }
    }
  }

  for (const text of texts) {
    for (const element of elementOrder) {
      if (text.includes(element)) {
        return element;
      }
    }
  }

  return null;
}

function detectElementFromText(text: string): string | null {
  for (const element of elementOrder) {
    const keywords = elementKeywordMap[element];
    if (keywords.some((keyword) => text.includes(keyword))) {
      return element;
    }
  }

  for (const element of elementOrder) {
    if (text.includes(element)) {
      return element;
    }
  }

  return null;
}

function formatSkillDescription(text: string) {
  return text
    .replace(/\s*(일반 공격:)/g, "\n$1")
    .replace(/\s*(낙하 공격:)/g, "\n$1")
    .replace(/\s*(처형 공격:)/g, "\n$1")
    .replace(/\s*(강공격:)/g, "\n$1")
    .replace(/\s*(연계 공격:)/g, "\n$1")
    .replace(/\s*(메인 컨트롤 오퍼레이터라면)/g, "\n$1")
    .trim();
}

function getHighlightTargets(text: string) {
  const matches: { start: number; end: number; color: string }[] = [];

  for (const element of elementOrder) {
    const color = getElementColor(element);

    for (const keyword of elementKeywordMap[element]) {
      let searchIndex = 0;

      while (searchIndex < text.length) {
        const foundIndex = text.indexOf(keyword, searchIndex);
        if (foundIndex === -1) break;

        matches.push({
          start: foundIndex,
          end: foundIndex + keyword.length,
          color,
        });

        searchIndex = foundIndex + keyword.length;
      }
    }
  }

  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  const filtered: { start: number; end: number; color: string }[] = [];

  for (const match of matches) {
    const overlaps = filtered.some(
      (item) => !(match.end <= item.start || match.start >= item.end)
    );

    if (!overlaps) {
      filtered.push(match);
    }
  }

  return filtered;
}

function renderHighlightedText(text: string) {
  const lines = formatSkillDescription(text).split("\n");

  return lines.map((line, lineIndex) => {
    const targets = getHighlightTargets(line);

    if (!targets.length) {
      return (
        <Fragment key={`line-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 ? <br /> : null}
        </Fragment>
      );
    }

    const pieces: React.ReactNode[] = [];
    let cursor = 0;

    targets.forEach((target, index) => {
      if (cursor < target.start) {
        pieces.push(
          <Fragment key={`plain-${lineIndex}-${index}`}>
            {line.slice(cursor, target.start)}
          </Fragment>
        );
      }

      pieces.push(
        <span
          key={`hl-${lineIndex}-${index}`}
          style={{
            color: target.color,
            fontWeight: 800,
          }}
        >
          {line.slice(target.start, target.end)}
        </span>
      );

      cursor = target.end;
    });

    if (cursor < line.length) {
      pieces.push(
        <Fragment key={`tail-${lineIndex}`}>
          {line.slice(cursor)}
        </Fragment>
      );
    }

    return (
      <Fragment key={`line-${lineIndex}`}>
        {pieces}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </Fragment>
    );
  });
}

function FoldSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        marginTop: "14px",
        border: "1px solid rgba(255,196,74,0.12)",
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
        <span style={{ color: "#ffd968" }}>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div style={{ borderTop: "1px solid rgba(255,196,74,0.10)" }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function MaterialIcon({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return (
      <div
        style={{
          width: "26px",
          height: "26px",
          border: "1px solid rgba(255,196,74,0.10)",
          background: "#05070b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: "8px",
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        I
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "26px",
        height: "26px",
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="26px"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

function MetaChip({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        height: "30px",
        padding: "0 10px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        border: accent
          ? "1px solid rgba(255,196,74,0.32)"
          : "1px solid rgba(255,196,74,0.14)",
        background: accent ? "rgba(247,166,0,0.12)" : "#0d1118",
        color: "#f3f4f6",
        fontSize: "12px",
        fontWeight: 700,
        whiteSpace: "nowrap",
        clipPath:
          "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
      }}
    >
      <span style={{ color: "#9fb3c8" }}>{label}</span>
      <span style={{ color: "#ffd24a", fontWeight: 900 }}>{value}</span>
    </div>
  );
}

function buildUpgradeRows(upgradeMaterialList: SkillUpgradeMaterial[]) {
  const normalOrder = ["2", "3", "4", "5", "6", "7", "8", "9"];
  const masteryOrder = ["M1", "M2", "M3"];

  const normal = normalOrder
    .map((level) => upgradeMaterialList.find((item) => item.level === level))
    .filter((item): item is SkillUpgradeMaterial => !!item);

  const mastery = masteryOrder
    .map((level) => upgradeMaterialList.find((item) => item.level === level))
    .filter((item): item is SkillUpgradeMaterial => !!item);

  return {
    normal,
    mastery,
  };
}

function UpgradeColumn({ item }: { item: SkillUpgradeMaterial }) {
  return (
    <div
      style={{
        borderLeft: "1px solid rgba(255,196,74,0.12)",
        paddingLeft: "10px",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          color: "#ffea61",
          fontSize: "13px",
          fontWeight: 900,
          marginBottom: "8px",
        }}
      >
        {item.level}
      </div>

      {item.materials.length ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {item.materials.map((material, index) => (
            <div
              key={`${item.level}-${material.name}-${index}`}
              style={{
                border: "1px solid rgba(255,196,74,0.08)",
                background: "#0e131b",
                padding: "6px 8px",
                display: "grid",
                gridTemplateColumns: "26px 1fr auto",
                gap: "8px",
                alignItems: "center",
                clipPath:
                  "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
              }}
            >
              <MaterialIcon src={material.icon} alt={material.name} />

              <div
                style={{
                  color: "#f3f4f6",
                  fontSize: "11px",
                  lineHeight: 1.3,
                  wordBreak: "keep-all",
                }}
              >
                {material.name}
              </div>

              <div
                style={{
                  color: "#ffd24a",
                  fontSize: "11px",
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                  paddingLeft: "6px",
                }}
              >
                {material.count}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "#94a3b8", fontSize: "12px" }}>재료 데이터 없음</div>
      )}
    </div>
  );
}

function findCompareRowValue(
  compareRows: SkillCompareRow[],
  label: string,
  index: number
) {
  const row = compareRows.find((item) => item.label === label);
  return row?.values[index];
}

function formatMetaValue(value: string | number) {
  if (typeof value === "number") return value;
  if (/^\d+(?:\.\d+)?s$/i.test(value)) {
    return `${value.slice(0, -1)}초`;
  }
  return value;
}

function resolveMetaItems(
  skill: SkillDetail,
  selectedIndex: number
): { label: string; value: string | number }[] {
  const rawMeta = skill.meta ?? [];

  return rawMeta
    .map((item) => {
      const resolvedValue =
        item.valueRowLabel != null
          ? findCompareRowValue(skill.compareRows, item.valueRowLabel, selectedIndex)
          : item.value;

      if (resolvedValue === undefined || resolvedValue === null || resolvedValue === "") {
        return null;
      }

      return {
        label: item.label,
        value: formatMetaValue(resolvedValue),
      };
    })
    .filter((item): item is { label: string; value: string | number } => item !== null);
}

export default function InteractiveSkillPanel({ skill, accentColor }: Props) {
  const levels = useMemo(() => skill.levelValues ?? [], [skill.levelValues]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = levels[selectedIndex] ?? levels[0];

  const upgradeMaterialList = useMemo(
    () => skill.upgradeMaterials ?? skill.upgradeCosts ?? [],
    [skill.upgradeMaterials, skill.upgradeCosts]
  );

  const resolvedMetaItems = useMemo(
    () => resolveMetaItems(skill, selectedIndex),
    [selectedIndex, skill]
  );

  const upgradeRows = useMemo(
    () => buildUpgradeRows(upgradeMaterialList),
    [upgradeMaterialList]
  );

  const detectedElement = useMemo(() => {
    return detectDamageElement(skill, current);
  }, [skill, current]);

  const iconBorderColor = detectedElement
    ? getElementColor(detectedElement)
    : "rgba(255,196,74,0.14)";

  const iconGlowColor = detectedElement
    ? `${getElementColor(detectedElement)}88`
    : "rgba(255,196,74,0.18)";

  if (!current) return null;

  return (
    <section
      style={{
        clipPath:
          "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
        background: "#06080c",
        border: "1px solid rgba(255,196,74,0.14)",
        padding: "16px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          gap: "14px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            border: `1px solid ${iconBorderColor}`,
            boxShadow: `0 0 0 1px ${iconGlowColor}, 0 0 18px ${iconGlowColor}`,
            background: "#0c1016",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            clipPath:
              "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          {skill.icon ? (
            <div style={{ position: "relative", width: "64px", height: "64px" }}>
              <Image
                src={skill.icon}
                alt={skill.name}
                fill
                sizes="64px"
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              ICON
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              color: "#aeb8c7",
              fontSize: "12px",
              letterSpacing: "0.14em",
              marginBottom: "4px",
            }}
          >
            {skill.typeLabel}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                color: "#ffdc70",
                fontSize: "30px",
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              {skill.name}
            </div>

            {resolvedMetaItems.map((item) => (
              <MetaChip
                key={`${skill.name}-${item.label}`}
                label={item.label}
                value={item.value}
                accent
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "16px" }}>
        {levels.map((level, index) => {
          const active = selectedIndex === index;

          return (
            <button
              key={`${skill.name}-${level.level}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              style={{
                minWidth: "58px",
                height: "34px",
                padding: "0 10px",
                border: active ? `1px solid ${accentColor}` : "1px solid rgba(255,196,74,0.14)",
                background: active ? "rgba(247,166,0,0.14)" : "#0c1016",
                color: active ? "#fff" : "#e5e7eb",
                fontWeight: 800,
                cursor: "pointer",
                clipPath:
                  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
              }}
            >
              {level.level}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "14px",
          padding: "14px",
          background: "#0a0d12",
          border: "1px solid rgba(255,196,74,0.10)",
          clipPath:
            "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
        }}
      >
        <div
          style={{
            color: "#9fb3c8",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          설명
        </div>

        <div
          style={{
            color: "#edf2f7",
            fontSize: "15px",
            lineHeight: 1.95,
            whiteSpace: "pre-line",
          }}
        >
          {renderHighlightedText(current.description)}
        </div>
      </div>

      {!!current.stats?.length && (
        <div
          style={{
            marginTop: "12px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          {current.stats.map((stat) => {
            const statElement = detectElementFromText(stat.label);
            const statColor = statElement ? getElementColor(statElement) : "#9fb3c8";

            return (
              <div
                key={`${skill.name}-${current.level}-${stat.label}`}
                style={{
                  border: "1px solid rgba(255,196,74,0.10)",
                  background: "#0d1118",
                  padding: "12px",
                  clipPath:
                    "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
                }}
              >
                <div
                  style={{
                    color: statColor,
                    fontSize: "12px",
                    marginBottom: "6px",
                    fontWeight: 800,
                  }}
                >
                  {renderHighlightedText(stat.label)}
                </div>
                <div style={{ color: "#ffd24a", fontSize: "20px", fontWeight: 900 }}>
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!!skill.compareRows?.length && (
        <FoldSection title="레벨 비교" defaultOpen={false}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "720px",
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
                      borderBottom: "1px solid rgba(255,196,74,0.10)",
                    }}
                  >
                    항목
                  </th>
                  {levels.map((level) => (
                    <th
                      key={`${skill.name}-thead-${level.level}`}
                      style={{
                        textAlign: "center",
                        color: "#9fb3c8",
                        fontSize: "12px",
                        padding: "12px",
                        borderBottom: "1px solid rgba(255,196,74,0.10)",
                      }}
                    >
                      {level.level}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {skill.compareRows.map((row) => {
                  const rowElement = detectElementFromText(row.label);
                  const rowColor = rowElement ? getElementColor(rowElement) : "#e5e7eb";

                  return (
                    <tr key={`${skill.name}-${row.label}`}>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid rgba(255,196,74,0.08)",
                          color: rowColor,
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        {renderHighlightedText(row.label)}
                      </td>

                      {row.values.map((value, index) => (
                        <td
                          key={`${skill.name}-${row.label}-${index}`}
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid rgba(255,196,74,0.08)",
                            color: "#d1d5db",
                            fontSize: "14px",
                            textAlign: "center",
                          }}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FoldSection>
      )}

      <FoldSection title="업그레이드 재료" defaultOpen={false}>
        <div style={{ padding: "10px" }}>
          {!!upgradeRows.normal.length && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                gap: "10px",
                alignItems: "start",
              }}
            >
              {upgradeRows.normal.map((item) => (
                <UpgradeColumn key={item.level} item={item} />
              ))}
            </div>
          )}

          {!!upgradeRows.mastery.length && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                gap: "10px",
                alignItems: "start",
                marginTop: upgradeRows.normal.length ? "12px" : 0,
              }}
            >
              {upgradeRows.mastery.map((item) => (
                <UpgradeColumn key={item.level} item={item} />
              ))}

              {Array.from({ length: Math.max(0, 8 - upgradeRows.mastery.length) }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
            </div>
          )}

          {!upgradeRows.normal.length && !upgradeRows.mastery.length ? (
            <div style={{ color: "#94a3b8", fontSize: "12px" }}>재료 데이터 없음</div>
          ) : null}
        </div>
      </FoldSection>
    </section>
  );
}