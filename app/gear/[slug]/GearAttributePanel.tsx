"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { GearStatLine } from "@/data/gear-types";

type UpgradeKey = "base" | "level1" | "level2" | "level3";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function highlightTerms(text: string): ReactNode {
  const patterns: Array<{ pattern: RegExp; color: string }> = [
    { pattern: /물리 피해|물리/g, color: "#cfd8e3" },
    { pattern: /열기 피해|열기|연소/g, color: "#ff7a59" },
    { pattern: /전기 피해|전기|감전/g, color: "#facc15" },
    { pattern: /냉기 피해|냉기|동결/g, color: "#63b3ff" },
    { pattern: /자연 피해|자연|부식/g, color: "#7ddc6d" },
    { pattern: /힘|민첩|지능|의지/g, color: YELLOW_TEXT },
    { pattern: /[+\-]?\d+(?:\.\d+)?%?/g, color: YELLOW_TEXT },
  ];

  const matches: Array<{
    start: number;
    end: number;
    text: string;
    color: string;
    priority: number;
  }> = [];

  patterns.forEach(({ pattern, color }, priority) => {
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const start = match.index ?? 0;
      matches.push({
        start,
        end: start + value.length,
        text: value,
        color,
        priority,
      });
    }
  });

  matches.sort((a, b) =>
    a.start !== b.start ? a.start - b.start : b.priority - a.priority,
  );

  const filtered: typeof matches = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start < lastEnd) continue;
    filtered.push(match);
    lastEnd = match.end;
  }

  if (!filtered.length) return text;

  const result: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (cursor < match.start) result.push(text.slice(cursor, match.start));

    result.push(
      <span
        key={`${match.text}-${match.start}-${index}`}
        style={{ color: match.color, fontWeight: 900 }}
      >
        {match.text}
      </span>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) result.push(text.slice(cursor));

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
    if (!isValid) setSelectedUpgrade("base");
  }, [selectedUpgrade, upgradeButtonMap]);

  const currentValue = useMemo(() => {
    return block.values[selectedUpgrade] || block.values.base || "-";
  }, [block.values, selectedUpgrade]);

  return (
    <section
      className="overflow-hidden rounded-[24px] bg-[#05070b] p-5 shadow-[0_0_30px_rgba(250,204,21,0.04)]"
      style={{ border: `1px solid ${YELLOW_BORDER}` }}
    >
      <div
        className="mb-4 border-b pb-3"
        style={{ borderColor: YELLOW_BORDER_SOFT }}
      >
        <p
          className="text-[11px] font-bold tracking-[0.28em]"
          style={{ color: YELLOW_MAIN }}
        >
          ATTRIBUTE
        </p>
        <h2 className="mt-1 text-xl font-black text-white">속성</h2>
        <p className="mt-2 text-sm font-bold" style={{ color: YELLOW_TEXT }}>
          {highlightTerms(block.label)}
        </p>
      </div>

      <div
        className="mb-4 grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${upgradeButtonMap.length}, minmax(0, 1fr))`,
        }}
      >
        {upgradeButtonMap.map((item) => {
          const active = selectedUpgrade === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedUpgrade(item.key)}
              className="h-9 rounded-xl border text-xs font-black transition"
              style={{
                borderColor: active ? YELLOW_MAIN : YELLOW_BORDER_SOFT,
                background: active ? YELLOW_BORDER_SOFT : "#071019",
                color: active ? "#ffffff" : "#d4d4d8",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        className="overflow-hidden rounded-[18px] bg-[#071019]"
        style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
      >
        <InfoRow label="선택 단계">
          {upgradeButtonMap.find((item) => item.key === selectedUpgrade)?.label}
        </InfoRow>

        <InfoRow label="현재 수치" highlight>
          {highlightTerms(currentValue)}
        </InfoRow>

        <InfoRow label="기본 수치" last>
          {block.values.base}
        </InfoRow>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  children,
  highlight,
  last,
}: {
  label: string;
  children: ReactNode;
  highlight?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={
        last
          ? "grid grid-cols-[120px_minmax(0,1fr)]"
          : "grid grid-cols-[120px_minmax(0,1fr)] border-b border-white/10"
      }
    >
      <div className="border-r border-white/10 px-3 py-3 text-sm font-bold text-zinc-400">
        {label}
      </div>

      <div
        className={
          highlight
            ? "px-3 py-3 text-2xl font-black"
            : "px-3 py-3 text-sm font-bold text-zinc-100"
        }
        style={highlight ? { color: YELLOW_TEXT } : undefined}
      >
        {children}
      </div>
    </div>
  );
}