"use client";

import type { ReactNode } from "react";
import type { GearDetail } from "@/data/gear-types";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function getQualityBadge(quality: number) {
  switch (quality) {
    case 5:
      return {
        label: "노란색 품질",
        border: "rgba(255,210,74,0.5)",
        bg: "rgba(255,210,74,0.14)",
        text: "#fff1a6",
      };
    case 4:
      return {
        label: "보라색 품질",
        border: "rgba(168,85,247,0.45)",
        bg: "rgba(168,85,247,0.14)",
        text: "#d8b4fe",
      };
    case 3:
      return {
        label: "파란색 품질",
        border: "rgba(96,165,250,0.45)",
        bg: "rgba(96,165,250,0.14)",
        text: "#93c5fd",
      };
    case 2:
      return {
        label: "초록색 품질",
        border: "rgba(74,222,128,0.45)",
        bg: "rgba(74,222,128,0.14)",
        text: "#86efac",
      };
    default:
      return {
        label: "회색 품질",
        border: "rgba(161,161,170,0.35)",
        bg: "rgba(161,161,170,0.10)",
        text: "#d4d4d8",
      };
  }
}

function highlightTerms(text: string): ReactNode {
  const patterns: Array<{ pattern: RegExp; color: string }> = [
    { pattern: /물리 피해|물리/g, color: "#cfd8e3" },
    { pattern: /열기 피해|열기|연소/g, color: "#ff7a59" },
    { pattern: /전기 피해|전기|감전/g, color: "#facc15" },
    { pattern: /냉기 피해|냉기|동결/g, color: "#63b3ff" },
    { pattern: /자연 피해|자연|부식/g, color: "#7ddc6d" },
    { pattern: /힘|민첩|지능|의지|공격력|생명력/g, color: YELLOW_TEXT },
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

function ProfileBlock({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-[18px] bg-black/35 px-4 py-3" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
      <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">{label}</p>
      <div className="mt-2 text-base font-black text-white">{value}</div>
    </div>
  );
}

export default function GearHeroPanel({ gear, categoryLabel }: { gear: GearDetail; categoryLabel: string }) {
  const quality = getQualityBadge(gear.quality);

  return (
    <section className="overflow-hidden rounded-[30px] bg-[#05070b] shadow-[0_20px_60px_rgba(0,0,0,0.34)]" style={{ border: `1px solid ${YELLOW_BORDER}` }}>
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[520px] overflow-hidden bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,210,74,0.16),transparent_32%)]" />

          <img src={gear.image} alt={gear.name} className="absolute inset-0 h-full w-full object-contain p-8 drop-shadow-[0_24px_42px_rgba(0,0,0,0.72)]" />
        </div>

        <div className="relative p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,210,74,0.12),transparent_32%)]" />

          <div className="relative">
            <p className="text-[11px] font-black tracking-[0.32em]" style={{ color: YELLOW_MAIN }}>
              GEAR PROFILE
            </p>

            <p className="mt-3 text-xl font-black text-zinc-300">{gear.enName}</p>

            <h1 className="mt-2 break-keep text-[clamp(44px,6vw,72px)] font-black leading-[0.92] text-white">
              {gear.name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-black" style={{ border: `1px solid ${quality.border}`, background: quality.bg, color: quality.text }}>
                {quality.label}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-zinc-300">
                {categoryLabel}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <ProfileBlock label="방어력" value={highlightTerms(`${gear.baseStat.label} ${gear.baseStat.value}`)} />

              <ProfileBlock label="능력치1" value={highlightTerms(`${gear.ability1.label} ${gear.ability1.values.base}`)} />

              <ProfileBlock label="능력치2" value={gear.ability2 ? highlightTerms(`${gear.ability2.label} ${gear.ability2.values.base}`) : "-"} />

              <ProfileBlock label="속성" value={highlightTerms(`${gear.attribute.label} ${gear.attribute.values.base}`)} />

              <ProfileBlock label="세트효과" value={highlightTerms(gear.setName)} />
            </div>

            <div className="mt-6 rounded-[22px] bg-[#06090f]/90 p-5" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-zinc-300">세트효과</p>
                <p className="text-xs font-black" style={{ color: YELLOW_TEXT }}>
                  {gear.setName}
                </p>
              </div>

              <div className="grid gap-3">
                {gear.setEffects.map((effect) => (
                  <div key={`${effect.pieces}-${effect.description}`} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                    <p className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
                      {effect.pieces}세트 효과
                    </p>

                    <div className="mt-2 text-sm font-bold leading-7 text-zinc-200">
                      {highlightTerms(effect.description)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
