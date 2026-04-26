"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import type { GearDetail } from "@/data/gear-types";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_BORDER = "rgba(255,210,74,0.18)";
const YELLOW_BORDER_SOFT = "rgba(255,210,74,0.12)";
const YELLOW_BORDER_FAINT = "rgba(255,210,74,0.08)";

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getQualityColor(quality: GearDetail["quality"]) {
  switch (quality) {
    case 5:
      return "#ffcc4d";
    case 4:
      return "#a855f7";
    case 3:
      return "#38bdf8";
    case 2:
      return "#84cc16";
    case 1:
    default:
      return "#9ca3af";
  }
}

function getQualityTheme(quality: GearDetail["quality"]) {
  const main = getQualityColor(quality);

  return {
    main,
    panelBorder:
      quality === 5
        ? "rgba(255,204,77,0.18)"
        : quality === 4
        ? "rgba(168,85,247,0.18)"
        : quality === 3
        ? "rgba(56,189,248,0.18)"
        : quality === 2
        ? "rgba(132,204,22,0.18)"
        : "rgba(156,163,175,0.18)",
    softBorder:
      quality === 5
        ? "rgba(255,204,77,0.12)"
        : quality === 4
        ? "rgba(168,85,247,0.12)"
        : quality === 3
        ? "rgba(56,189,248,0.12)"
        : quality === 2
        ? "rgba(132,204,22,0.12)"
        : "rgba(156,163,175,0.12)",
    faintBorder:
      quality === 5
        ? "rgba(255,204,77,0.08)"
        : quality === 4
        ? "rgba(168,85,247,0.08)"
        : quality === 3
        ? "rgba(56,189,248,0.08)"
        : quality === 2
        ? "rgba(132,204,22,0.08)"
        : "rgba(156,163,175,0.08)",
    softBg:
      quality === 5
        ? "rgba(255,204,77,0.04)"
        : quality === 4
        ? "rgba(168,85,247,0.04)"
        : quality === 3
        ? "rgba(56,189,248,0.04)"
        : quality === 2
        ? "rgba(132,204,22,0.04)"
        : "rgba(156,163,175,0.04)",
  };
}

function isSecondNumberRange(text: string, start: number, end: number) {
  const after = text.slice(end);
  return /^\s*초/.test(after);
}

function highlightSetEffectTerms(
  text: string,
  color: string,
  setName?: string
): ReactNode {
  const colorMap: Array<{
    pattern: RegExp;
    style: CSSProperties;
    priority?: number;
  }> = [
    { pattern: /물리 피해/g, style: { color: "#cfd8e3", fontWeight: 800 } },
    { pattern: /열기 피해/g, style: { color: "#ff7a59", fontWeight: 800 } },
    { pattern: /전기 피해/g, style: { color: "#FBCB38", fontWeight: 800 } },
    { pattern: /냉기 피해/g, style: { color: "#63b3ff", fontWeight: 800 } },
    { pattern: /자연 피해/g, style: { color: "#7ddc6d", fontWeight: 800 } },
    { pattern: /물리/g, style: { color: "#cfd8e3", fontWeight: 800 } },
    { pattern: /열기/g, style: { color: "#ff7a59", fontWeight: 800 } },
    { pattern: /전기/g, style: { color: "#FBCB38", fontWeight: 800 } },
    { pattern: /냉기/g, style: { color: "#63b3ff", fontWeight: 800 } },
    { pattern: /자연/g, style: { color: "#7ddc6d", fontWeight: 800 } },
    { pattern: /연소/g, style: { color: "#ff7a59", fontWeight: 800 } },
    { pattern: /감전/g, style: { color: "#FBCB38", fontWeight: 800 } },
    { pattern: /동결/g, style: { color: "#63b3ff", fontWeight: 800 } },
    { pattern: /부식/g, style: { color: "#7ddc6d", fontWeight: 800 } },
    { pattern: /띄우기/g, style: { color: "#cfd8e3", fontWeight: 800 } },
    { pattern: /방어 불능/g, style: { color: "#cfd8e3", fontWeight: 800 } },
    {
      pattern: /\d+개 세트 효과/g,
      style: {
        color,
        fontWeight: 900,
        textShadow: `0 0 8px ${color}44`,
      },
      priority: 2000,
    },
  ];

  if (setName?.trim()) {
    colorMap.unshift({
      pattern: new RegExp(escapeRegExp(setName), "g"),
      style: {
        color,
        fontWeight: 900,
      },
      priority: 1500,
    });
  }

  const numberStyle: CSSProperties = {
    color,
    fontWeight: 900,
  };

  const matches: Array<{
    start: number;
    end: number;
    text: string;
    style: CSSProperties;
    priority: number;
  }> = [];

  colorMap.forEach(({ pattern, style, priority = 100 }) => {
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const index = match.index ?? 0;

      matches.push({
        start: index,
        end: index + value.length,
        text: value,
        style,
        priority,
      });
    }
  });

  const numberPattern = /[+\-]?\d+(?:\.\d+)?%?/g;
  for (const match of text.matchAll(numberPattern)) {
    const value = match[0];
    const index = match.index ?? 0;
    const end = index + value.length;

    if (isSecondNumberRange(text, index, end)) {
      continue;
    }

    matches.push({
      start: index,
      end,
      text: value,
      style: numberStyle,
      priority: 1000,
    });
  }

  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.priority - a.priority;
  });

  const filtered: typeof matches = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start < lastEnd) continue;
    filtered.push(match);
    lastEnd = match.end;
  }

  if (filtered.length === 0) return text;

  const result: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (cursor < match.start) {
      result.push(text.slice(cursor, match.start));
    }

    result.push(
      <span key={`${match.text}-${match.start}-${index}`} style={match.style}>
        {match.text}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    result.push(text.slice(cursor));
  }

  return result;
}

export default function GearHeroPanel({
  gear,
  categoryLabel,
}: {
  gear: GearDetail;
  categoryLabel: string;
}) {
  const primarySetEffect = gear.setEffects[0];
  const qualityTheme = getQualityTheme(gear.quality);

  const iconMap: Record<string, string> = {
    힘: "/icons/stats/strength.webp",
    민첩: "/icons/stats/agility.webp",
    지능: "/icons/stats/intelligence.webp",
    의지: "/icons/stats/will.webp",
    공격력: "/icons/stats/attack.webp",
    생명력: "/icons/stats/hp.webp",
    방어구: "/icons/gear/armor.webp",
    "보호 장갑": "/icons/gear/gloves.webp",
    부품: "/icons/gear/kit.webp",
  };

  const qualityLabelMap: Record<GearDetail["quality"], string> = {
    5: "노란색 품질",
    4: "보라색 품질",
    3: "파란색 품질",
    2: "초록색 품질",
    1: "회색 품질",
  };

  const badges = [
    {
      label: `Lv. ${gear.level} ${categoryLabel}`,
      icon: iconMap[categoryLabel],
      border: qualityTheme.softBorder,
      color: qualityTheme.main,
      background: qualityTheme.softBg,
    },
    {
      label: gear.setName,
      border: YELLOW_BORDER_FAINT,
      color: "#ffffff",
      background: "#000000",
    },
    {
      label: qualityLabelMap[gear.quality],
      border: qualityTheme.softBorder,
      color: qualityTheme.main,
      background: qualityTheme.softBg,
    },
    {
      label: gear.ability1.label,
      icon: iconMap[gear.ability1.label],
      border: YELLOW_BORDER_FAINT,
      color: "#ffffff",
      background: "#000000",
    },
    ...(gear.ability2
      ? [
          {
            label: gear.ability2.label,
            icon: iconMap[gear.ability2.label],
            border: YELLOW_BORDER_FAINT,
            color: "#ffffff",
            background: "#000000",
          },
        ]
      : []),
    {
      label: gear.attribute.label,
      icon: iconMap[gear.attribute.label],
      border: YELLOW_BORDER_FAINT,
      color: "#ffffff",
      background: "#000000",
    },
  ];

  const baseRows = [
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
  ];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${YELLOW_BORDER}`,
        background: "#05070b",
        boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
        padding: "22px",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "22px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: "420px",
            background: "#000",
            border: `2px solid ${qualityTheme.main}`,
            boxShadow: `0 0 0 1px ${qualityTheme.main}33`,
            overflow: "hidden",
          }}
        >
          <Image
            src={gear.image}
            alt={gear.name}
            fill
            sizes="340px"
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.25), rgba(0,0,0,0))",
            }}
          />
        </div>

        <div
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            {badges.map((badge) => (
              <span
                key={`${badge.label}-${badge.border}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  minHeight: "28px",
                  padding: "4px 10px",
                  border: `1px solid ${badge.border}`,
                  color: badge.color,
                  fontSize: "12px",
                  fontWeight: 800,
                  background: badge.background,
                }}
              >
                {badge.icon ? (
                  <span
                    style={{
                      position: "relative",
                      width: "16px",
                      height: "16px",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={badge.icon}
                      alt=""
                      fill
                      sizes="16px"
                      style={{ objectFit: "contain" }}
                    />
                  </span>
                ) : null}
                <span>{badge.label}</span>
              </span>
            ))}
          </div>

          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: YELLOW_MAIN,
              letterSpacing: "0.04em",
            }}
          >
            {gear.enName}
          </div>

          <h1
            style={{
              marginTop: "6px",
              fontSize: "40px",
              lineHeight: 1.1,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            {gear.name}
          </h1>

          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: YELLOW_MAIN,
                marginBottom: "8px",
              }}
            >
              BASIC STAT
            </div>

            <div
              style={{
                border: `1px solid ${YELLOW_BORDER_FAINT}`,
                background: "#0b1018",
              }}
            >
              {baseRows.map((row, index) => {
                const iconSrc = iconMap[row.label];

                return (
                  <div
                    key={`${row.label}-${index}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "180px 1fr",
                      borderBottom:
                        index !== baseRows.length - 1
                          ? `1px solid ${YELLOW_BORDER_FAINT}`
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderRight: `1px solid ${YELLOW_BORDER_FAINT}`,
                        color: "#ffffff",
                        fontWeight: 700,
                        minWidth: 0,
                      }}
                    >
                      {iconSrc ? (
                        <span
                          style={{
                            position: "relative",
                            width: "18px",
                            height: "18px",
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={iconSrc}
                            alt=""
                            fill
                            sizes="18px"
                            style={{ objectFit: "contain" }}
                          />
                        </span>
                      ) : null}

                      <span
                        style={{
                          minWidth: 0,
                          lineHeight: 1.4,
                          wordBreak: "keep-all",
                        }}
                      >
                        {row.label}
                      </span>
                    </div>

                    <div
                      style={{
                        padding: "12px",
                        color: YELLOW_MAIN,
                        fontWeight: 900,
                        fontSize: "18px",
                      }}
                    >
                      {row.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: YELLOW_MAIN,
                marginBottom: "6px",
              }}
            >
              SET EFFECT
            </div>

            <div
              style={{
                fontWeight: 800,
                marginBottom: "6px",
                color: "#fff",
              }}
            >
              {highlightSetEffectTerms(gear.setName, YELLOW_MAIN, gear.setName)}
            </div>

            {primarySetEffect ? (
              <div
                style={{
                  border: `1px solid ${YELLOW_BORDER_SOFT}`,
                  background: "#0b1018",
                  padding: "12px",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "#ffffff",
                }}
              >
                <div
                  style={{
                    marginBottom: "6px",
                    fontWeight: 900,
                    color: YELLOW_MAIN,
                  }}
                >
                  {highlightSetEffectTerms(
                    `${primarySetEffect.pieces}개 세트 효과`,
                    YELLOW_MAIN,
                    gear.setName
                  )}
                </div>

                <div>
                  {highlightSetEffectTerms(
                    primarySetEffect.description,
                    YELLOW_MAIN,
                    gear.setName
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
} 