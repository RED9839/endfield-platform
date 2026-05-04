"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { GearDetail } from "@/data/gear-types";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

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

function getQualityLabel(quality: GearDetail["quality"]) {
  switch (quality) {
    case 5:
      return "노란색 품질";
    case 4:
      return "보라색 품질";
    case 3:
      return "파란색 품질";
    case 2:
      return "초록색 품질";
    case 1:
    default:
      return "회색 품질";
  }
}

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

function Badge({
  children,
  color = YELLOW_TEXT,
  icon,
}: {
  children: ReactNode;
  color?: string;
  icon?: string;
}) {
  return (
    <span
      className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-xl bg-black px-3 py-1 text-xs font-black"
      style={{
        border: `1px solid ${color}55`,
        color,
      }}
    >
      {icon ? (
        <span className="relative h-4 w-4 shrink-0">
          <Image
            src={icon}
            alt=""
            fill
            sizes="16px"
            className="object-contain"
          />
        </span>
      ) : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default function GearHeroPanel({
  gear,
  categoryLabel,
}: {
  gear: GearDetail;
  categoryLabel: string;
}) {
  const qualityColor = getQualityColor(gear.quality);
  const qualityLabel = getQualityLabel(gear.quality);
  const primarySetEffect = gear.setEffects[0];

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

  const baseRows = [
    { label: gear.baseStat.label, value: gear.baseStat.value },
    { label: gear.ability1.label, value: gear.ability1.values.base },
    ...(gear.ability2
      ? [{ label: gear.ability2.label, value: gear.ability2.values.base }]
      : []),
    { label: gear.attribute.label, value: gear.attribute.values.base },
  ];

  return (
    <section
      className="overflow-hidden rounded-[26px] bg-[#05070b] p-5 shadow-[0_0_30px_rgba(250,204,21,0.04)]"
      style={{ border: `1px solid ${YELLOW_BORDER}` }}
    >
      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div
          className="relative min-h-[460px] overflow-hidden rounded-[24px] bg-black"
          style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div className="relative mx-auto h-full w-[90%]">
            <Image
              src={gear.image}
              alt={gear.name}
              fill
              priority
              sizes="360px"
              className="object-contain object-center"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4">
            <p
              className="text-xs font-bold tracking-[0.28em]"
              style={{ color: YELLOW_TEXT }}
            >
              GEAR VISUAL
            </p>
            <p className="mt-1 text-sm text-zinc-400">{gear.enName}</p>
          </div>
        </div>

        <div
          className="min-w-0 rounded-[24px] bg-black/30 p-5"
          style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div className="flex flex-wrap gap-2">
            <Badge color={qualityColor} icon={iconMap[categoryLabel]}>
              Lv. {gear.level} {categoryLabel}
            </Badge>
            <Badge>{gear.setName}</Badge>
            <Badge color={qualityColor}>{qualityLabel}</Badge>
            <Badge icon={iconMap[gear.ability1.label]}>
              {gear.ability1.label}
            </Badge>
            {gear.ability2 ? (
              <Badge icon={iconMap[gear.ability2.label]}>
                {gear.ability2.label}
              </Badge>
            ) : null}
            <Badge icon={iconMap[gear.attribute.label]}>
              {gear.attribute.label}
            </Badge>
          </div>

          <p
            className="mt-6 text-sm font-bold tracking-[0.08em]"
            style={{ color: YELLOW_TEXT }}
          >
            {gear.enName}
          </p>

          <h1 className="mt-2 text-4xl font-black leading-tight text-white">
            {gear.name}
          </h1>

          <div className="mt-6">
            <div
              className="mb-3 flex items-center justify-between border-b pb-2"
              style={{ borderColor: YELLOW_BORDER_SOFT }}
            >
              <h2
                className="text-sm font-black tracking-[0.24em]"
                style={{ color: YELLOW_TEXT }}
              >
                BASIC STAT
              </h2>
            </div>

            <div
              className="overflow-hidden rounded-[18px] bg-[#071019]"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              {baseRows.map((row, index) => {
                const iconSrc = iconMap[row.label];

                return (
                  <div
                    key={`${row.label}-${index}`}
                    className="grid grid-cols-[180px_minmax(0,1fr)] border-b border-white/10 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-2 border-r border-white/10 px-4 py-3 text-sm font-bold text-zinc-300">
                      {iconSrc ? (
                        <span className="relative h-5 w-5 shrink-0">
                          <Image
                            src={iconSrc}
                            alt=""
                            fill
                            sizes="20px"
                            className="object-contain"
                          />
                        </span>
                      ) : null}
                      <span className="min-w-0 truncate">{row.label}</span>
                    </div>

                    <div
                      className="px-4 py-3 text-lg font-black"
                      style={{ color: YELLOW_TEXT }}
                    >
                      {row.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <div
              className="mb-3 flex items-center justify-between border-b pb-2"
              style={{ borderColor: YELLOW_BORDER_SOFT }}
            >
              <h2
                className="text-sm font-black tracking-[0.24em]"
                style={{ color: YELLOW_TEXT }}
              >
                SET EFFECT
              </h2>
            </div>

            <div
              className="rounded-[18px] bg-[#071019] p-4"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <p className="text-base font-black text-white">
                {highlightTerms(gear.setName)}
              </p>

              {primarySetEffect ? (
                <div className="mt-3 text-sm leading-7 text-zinc-200">
                  <p className="font-black" style={{ color: YELLOW_TEXT }}>
                    {primarySetEffect.pieces}개 세트 효과
                  </p>
                  <p className="mt-1">
                    {highlightTerms(primarySetEffect.description)}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">
                  등록된 세트 효과가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}