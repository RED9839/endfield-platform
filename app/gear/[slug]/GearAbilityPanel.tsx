"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { GearStatLine } from "@/data/gear-types";

type UpgradeKey = "base" | "level1" | "level2" | "level3";

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
    { pattern: /[+\-]\d+(?:\.\d+)?%?|\d+(?:\.\d+)?%/g, color: YELLOW_TEXT },
  ];

  const matches: Array<{ start: number; end: number; text: string; color: string; priority: number }> = [];

  patterns.forEach(({ pattern, color }, priority) => {
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const start = match.index ?? 0;
      matches.push({ start, end: start + value.length, text: value, color, priority });
    }
  });

  matches.sort((a, b) => (a.start !== b.start ? a.start - b.start : b.priority - a.priority));

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
      <span key={`${match.text}-${match.start}-${index}`} style={{ color: match.color, fontWeight: 900 }}>
        {match.text}
      </span>,
    );
    cursor = match.end;
  });
  if (cursor < text.length) result.push(text.slice(cursor));
  return result;
}

export default function GearAbilityPanel({ title, block }: { title: string; block: GearStatLine }) {
  const upgradeButtonMap = useMemo(() => {
    const result: Array<{ key: UpgradeKey; label: string }> = [{ key: "base", label: "기본" }];
    if (block.values.level1) result.push({ key: "level1", label: "1강" });
    if (block.values.level2) result.push({ key: "level2", label: "2강" });
    if (block.values.level3) result.push({ key: "level3", label: "3강" });
    return result;
  }, [block.values]);

  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeKey>("base");

  useEffect(() => {
    if (!upgradeButtonMap.some((item) => item.key === selectedUpgrade)) setSelectedUpgrade("base");
  }, [selectedUpgrade, upgradeButtonMap]);

  const currentValue = useMemo(() => block.values[selectedUpgrade] || block.values.base || "-", [block.values, selectedUpgrade]);

  return (
    <section className="overflow-hidden rounded-[24px] bg-[#05070b] shadow-[0_18px_42px_rgba(0,0,0,0.28)]" style={{ border: `1px solid ${YELLOW_BORDER}` }}>
      <div className="relative overflow-hidden border-b border-yellow-500/10 p-4 lg:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,210,74,0.12),transparent_34%)]" />
        <div className="relative">
          <p className="text-[10px] font-black tracking-[0.28em]" style={{ color: YELLOW_TEXT }}>ABILITY</p>
          <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
          <p className="mt-2 text-sm font-black text-zinc-300">{highlightTerms(block.label)}</p>
        </div>
      </div>

      <div className="p-4 lg:p-5">
        <div className="mb-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${upgradeButtonMap.length}, minmax(0, 1fr))` }}>
          {upgradeButtonMap.map((item) => {
            const active = selectedUpgrade === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedUpgrade(item.key)}
                className={[
                  "h-10 rounded-xl border text-xs font-black transition",
                  active
                    ? "border-yellow-300/70 bg-yellow-400/20 text-yellow-100"
                    : "border-white/10 bg-[#071019] text-zinc-300 hover:border-yellow-400/35 hover:bg-yellow-400/10",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <InfoCard label="선택 단계" value={upgradeButtonMap.find((item) => item.key === selectedUpgrade)?.label ?? "기본"} />
          <InfoCard label="현재 수치" value={highlightTerms(currentValue)} highlight />
          <InfoCard label="기본 수치" value={highlightTerms(block.values.base)} />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value, highlight }: { label: string; value: ReactNode; highlight?: boolean }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-[#080b11]/85 p-4">
      <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">{label}</p>
      <div className={highlight ? "mt-2 text-2xl font-black" : "mt-2 text-base font-black text-zinc-100"} style={highlight ? { color: YELLOW_TEXT } : undefined}>
        {value}
      </div>
    </div>
  );
}
