"use client";

import type { ReactNode } from "react";
import type { GearDetail } from "@/data/gear-types";

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
    { pattern: /힘|민첩|지능|의지|공격력|생명력/g, color: YELLOW_TEXT },
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
      matches.push({ start, end: start + value.length, text: value, color, priority });
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
      <span key={`${match.text}-${match.start}-${index}`} style={{ color: match.color, fontWeight: 900 }}>
        {match.text}
      </span>,
    );
    cursor = match.end;
  });

  if (cursor < text.length) result.push(text.slice(cursor));
  return result;
}

function SmallStatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-[#070a10]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">{label}</p>
      <div className="mt-2 text-2xl font-black leading-tight" style={{ color: YELLOW_TEXT }}>
        {value}
      </div>
    </div>
  );
}

export default function GearHeroPanel({
  gear,
  categoryLabel,
}: {
  gear: GearDetail;
  categoryLabel: string;
}) {
  const primarySetEffect = gear.setEffects[0];
  const baseRows = [
    { label: gear.baseStat.label, value: gear.baseStat.value },
    { label: gear.ability1.label, value: gear.ability1.values.base },
    ...(gear.ability2 ? [{ label: gear.ability2.label, value: gear.ability2.values.base }] : []),
    { label: gear.attribute.label, value: gear.attribute.values.base },
  ];

  return (
    <section
      className="overflow-hidden rounded-[28px] bg-[#05070b] shadow-[0_18px_50px_rgba(0,0,0,0.30)]"
      style={{ border: `1px solid ${YELLOW_BORDER}` }}
    >
      <div className="relative overflow-hidden border-b border-yellow-500/10 bg-[radial-gradient(circle_at_8%_0%,rgba(255,210,74,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent)] p-4 lg:p-5">
        <div className="relative flex min-w-0 items-center gap-4 rounded-[22px] border border-white/10 bg-black/20 p-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-yellow-500/15 bg-black/45 sm:h-24 sm:w-24">
            <img
              src={gear.image}
              alt={gear.name}
              className="h-full w-full object-contain p-2 drop-shadow-[0_10px_18px_rgba(0,0,0,0.58)]"
            />
          </div>

          <div className="min-w-0">
            <h1 className="break-keep text-[clamp(32px,5vw,48px)] font-black leading-none text-white">
              {gear.name}
            </h1>
            <p className="mt-2 truncate text-sm font-black text-zinc-400 sm:text-base">
              {gear.enName}
            </p>
          </div>
        </div>

        <div className="relative mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.55fr)]">
          <div className="rounded-[22px] border border-white/10 bg-black/35 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl border border-yellow-400/25 bg-yellow-400/15 px-3 py-2 text-xs font-black text-yellow-100">
                Lv. {gear.level}
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-300">
                {categoryLabel}
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-300">
                품질 {gear.quality}
              </span>
            </div>

            <p className="mt-4 text-[10px] font-black tracking-[0.24em] text-zinc-500">SET</p>
            <h2 className="mt-2 break-keep text-3xl font-black leading-tight text-white">
              {gear.setName}
            </h2>
          </div>

          <div className="rounded-[22px] border border-yellow-500/20 bg-black/35 p-4">
            <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">기본 능력치</p>
            <p className="mt-3 text-base font-black text-zinc-300">{gear.baseStat.label}</p>
            <p className="mt-1 text-5xl font-black leading-none" style={{ color: YELLOW_TEXT }}>
              {gear.baseStat.value}
            </p>
            <div className="mt-4 h-1.5 rounded-full bg-zinc-800">
              <div className="h-full w-[18%] rounded-full bg-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)] lg:p-5">
        <div className="rounded-[22px] border border-white/10 bg-black/25 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black tracking-[0.28em]" style={{ color: YELLOW_TEXT }}>
              GEAR STATS
            </p>
            <p className="text-xs font-bold text-yellow-200/70">기본 기준</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {baseRows.map((row, index) => (
              <SmallStatCard key={`${row.label}-${index}`} label={row.label} value={row.value} />
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-black/25 p-4">
          <p className="text-[10px] font-black tracking-[0.28em]" style={{ color: YELLOW_TEXT }}>
            SET EFFECT
          </p>
          <h3 className="mt-2 break-keep text-2xl font-black text-white">
            {highlightTerms(gear.setName)}
          </h3>

          {primarySetEffect ? (
            <div className="mt-4 rounded-[18px] border border-white/10 bg-[#080b11]/85 p-4 text-sm font-bold leading-7 text-zinc-200">
              <p className="mb-1 font-black" style={{ color: YELLOW_TEXT }}>
                {primarySetEffect.pieces}개 세트 효과
              </p>
              {highlightTerms(primarySetEffect.description)}
            </div>
          ) : (
            <p className="mt-3 text-sm font-bold text-zinc-500">등록된 세트 효과가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
