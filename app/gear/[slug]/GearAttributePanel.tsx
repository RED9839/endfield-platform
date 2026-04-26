"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { GearStatLine } from "@/data/gear-types";

type UpgradeKey = "base" | "level1" | "level2" | "level3";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_SOFT = "#ffdc70";

const PANEL_BG = "#06080c";
const PANEL_INNER_BG = "#0d1118";
const PANEL_BUTTON_BG = "#0c1016";

const PANEL_BORDER = "rgba(255,196,74,0.14)";
const PANEL_BORDER_SOFT = "rgba(255,196,74,0.10)";
const PANEL_BORDER_FAINT = "rgba(255,196,74,0.08)";

const TEXT_MAIN = "#edf2f7";
const TEXT_SUB = "#aeb8c7";

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

  const numberStyle: CSSProperties = {
    color: YELLOW_MAIN,
    fontWeight: 900,
  };

  const defaultTextStyle: CSSProperties = {
    color: YELLOW_SOFT,
    fontWeight: 800,
  };

  const matches: Array<{
    start: number;
    end: number;
    text: string;
    style: CSSProperties;
    priority: number;
  }> = [];

  colorMap.forEach(({ pattern, color }) => {
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const index = match.index ?? 0;

      matches.push({
        start: index,
        end: index + value.length,
        text: value,
        style: { color, fontWeight: 800 },
        priority: value.length,
      });
    }
  });

  const numberPattern = /[+\-]?\d+(?:\.\d+)?%?/g;
  for (const match of text.matchAll(numberPattern)) {
    const value = match[0];
    const index = match.index ?? 0;

    matches.push({
      start: index,
      end: index + value.length,
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
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  if (filtered.length === 0) {
    return <span style={defaultTextStyle}>{text}</span>;
  }

  const result: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (cursor < match.start) {
      result.push(
        <span key={`plain-${cursor}-${match.start}`} style={defaultTextStyle}>
          {text.slice(cursor, match.start)}
        </span>
      );
    }

    result.push(
      <span key={`${match.text}-${match.start}-${index}`} style={match.style}>
        {match.text}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    result.push(
      <span key={`plain-tail-${cursor}`} style={defaultTextStyle}>
        {text.slice(cursor)}
      </span>
    );
  }

  return result;
}

export default function GearAttributePanel({
  block,
}: {
  block: GearStatLine;
}) {
  const upgradeButtonMap = useMemo(() => {
    const result: Array<{ key: UpgradeKey; label: string }> = [
      { key: "base", label: "기본" },
    ];

    if (block.values.level1) result.push({ key: "level1", label: "1강" });
    if (block.values.level2) result.push({ key: "level2", label: "2강" });
    if (block.values.level3) result.push({ key: "level3", label: "3강" });

    return result;
  }, [block.values]);

  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeKey>("base");

  useEffect(() => {
    const isValid = upgradeButtonMap.some((item) => item.key === selectedUpgrade);
    if (!isValid) {
      setSelectedUpgrade("base");
    }
  }, [selectedUpgrade, upgradeButtonMap]);

  const currentValue = useMemo(() => {
    return block.values[selectedUpgrade] || block.values.base || "-";
  }, [block.values, selectedUpgrade]);

  return (
    <section
      style={{
        overflow: "hidden",
        border: `1px solid ${PANEL_BORDER}`,
        background: PANEL_BG,
        padding: "18px",
        clipPath:
          "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
        boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          marginBottom: "14px",
          borderBottom: `1px solid ${PANEL_BORDER_SOFT}`,
          paddingBottom: "10px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: TEXT_SUB,
          }}
        >
          ATTRIBUTE
        </div>

        <div
          style={{
            marginTop: "4px",
            fontSize: "18px",
            fontWeight: 800,
            color: TEXT_MAIN,
          }}
        >
          속성
        </div>

        <div
          style={{
            marginTop: "6px",
            fontSize: "14px",
            fontWeight: 700,
            color: YELLOW_SOFT,
          }}
        >
          {highlightElementTerms(block.label)}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${upgradeButtonMap.length}, 1fr)`,
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        {upgradeButtonMap.map((item) => {
          const active = selectedUpgrade === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedUpgrade(item.key)}
              style={{
                minHeight: "36px",
                border: active
                  ? `1px solid ${YELLOW_MAIN}`
                  : `1px solid ${PANEL_BORDER}`,
                background: active
                  ? "rgba(255,210,74,0.14)"
                  : PANEL_BUTTON_BG,
                color: TEXT_MAIN,
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                clipPath:
                  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                boxShadow: active
                  ? "inset 0 0 0 1px rgba(255,210,74,0.10)"
                  : "none",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          border: `1px solid ${PANEL_BORDER_SOFT}`,
          background: PANEL_INNER_BG,
          clipPath:
            "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            borderBottom: `1px solid ${PANEL_BORDER_FAINT}`,
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              color: TEXT_SUB,
              fontWeight: 700,
              fontSize: "13px",
              borderRight: `1px solid ${PANEL_BORDER_FAINT}`,
            }}
          >
            선택 단계
          </div>
          <div
            style={{
              padding: "10px 12px",
              color: TEXT_MAIN,
              fontWeight: 800,
              fontSize: "13px",
            }}
          >
            {upgradeButtonMap.find((item) => item.key === selectedUpgrade)?.label}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            borderBottom: `1px solid ${PANEL_BORDER_FAINT}`,
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              color: TEXT_SUB,
              fontWeight: 700,
              fontSize: "13px",
              borderRight: `1px solid ${PANEL_BORDER_FAINT}`,
            }}
          >
            현재 수치
          </div>
          <div
            style={{
              padding: "14px 12px",
              color: YELLOW_MAIN,
              fontWeight: 900,
              fontSize: "26px",
              lineHeight: 1.1,
              textShadow: "0 0 10px rgba(255,210,74,0.35)",
            }}
          >
            {highlightElementTerms(currentValue)}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              color: TEXT_SUB,
              fontWeight: 700,
              fontSize: "13px",
              borderRight: `1px solid ${PANEL_BORDER_FAINT}`,
            }}
          >
            기본 수치
          </div>
          <div
            style={{
              padding: "14px 12px",
              color: TEXT_MAIN,
              fontWeight: 800,
              fontSize: "26px",
              lineHeight: 1.1,
            }}
          >
            {block.values.base}
          </div>
        </div>
      </div>
    </section>
  );
}