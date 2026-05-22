"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";

type WeaponLevelStatRow = {
  level: number;
  attack: number;
};

type SkillStat = {
  label: string;
  value: string | number;
};

type SkillLevelValue = {
  rank: string;
  description?: string;
  stats?: SkillStat[];
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
  levelValues?: SkillLevelValue[];
};

type SkillTabKey = "ability" | "attribute" | "series";

type Props = {
  weaponName: string;
  weaponEnName?: string;
  weaponImage?: string;
  weaponTypeLabel: string;
  levelStats?: WeaponLevelStatRow[] | null;
  skills?: WeaponSkillDetail[];
};

const LEVEL_MARKS = [1, 20, 40, 60, 80, 90];
const TAB_ORDER: SkillTabKey[] = ["ability", "attribute", "series"];
const YELLOW_TEXT = "#ffdc70";

const TAB_LABEL_MAP: Record<SkillTabKey, string> = {
  ability: "능력치",
  attribute: "속성",
  series: "시리즈 스킬",
};

function normalizeText(value?: string | number) {
  return String(value ?? "").trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSkillSourceText(skill: WeaponSkillDetail) {
  const metaText = (skill.meta ?? [])
    .map((meta) => `${normalizeText(meta.label)} ${normalizeText(meta.value)}`)
    .join(" ");

  return `${normalizeText(skill.typeLabel)} ${normalizeText(skill.name)} ${normalizeText(
    skill.key,
  ).toLowerCase()} ${metaText}`;
}

function getSkillTabKey(skill: WeaponSkillDetail): SkillTabKey {
  const source = getSkillSourceText(skill);

  if (source.includes("시리즈")) return "series";

  if (
    source.includes("속성") ||
    source.includes("물리") ||
    source.includes("열기") ||
    source.includes("전기") ||
    source.includes("냉기") ||
    source.includes("자연") ||
    source.includes("치명타") ||
    source.includes("공격력") ||
    source.includes("생명력") ||
    source.includes("오리지늄") ||
    source.includes("치유") ||
    source.includes("ultimate") ||
    source.includes("crit") ||
    source.includes("element") ||
    source.includes("attack")
  ) {
    return "attribute";
  }

  return "ability";
}

function getFirstValue(skill?: WeaponSkillDetail) {
  const first = skill?.levelValues?.[0];
  const firstStat = first?.stats?.[0];

  if (firstStat?.value !== undefined && firstStat?.value !== null) {
    return `${firstStat.label} ${firstStat.value}`;
  }

  return first?.description?.match(/[+\-]?\d+(?:\.\d+)?%?/)?.[0] ?? "-";
}

function highlightElementTerms(text: string): ReactNode {
  const colorMap: Array<{ pattern: RegExp; color: string }> = [
    { pattern: /물리 피해/g, color: "#cfd8e3" },
    { pattern: /열기 피해/g, color: "#ff7a59" },
    { pattern: /전기 피해/g, color: "#f0c94a" },
    { pattern: /냉기 피해/g, color: "#63b3ff" },
    { pattern: /자연 피해/g, color: "#7ddc6d" },
    { pattern: /물리/g, color: "#cfd8e3" },
    { pattern: /열기/g, color: "#ff7a59" },
    { pattern: /전기/g, color: "#f0c94a" },
    { pattern: /냉기/g, color: "#63b3ff" },
    { pattern: /자연/g, color: "#7ddc6d" },
    { pattern: /연소/g, color: "#ff7a59" },
    { pattern: /감전/g, color: "#f0c94a" },
    { pattern: /동결/g, color: "#63b3ff" },
    { pattern: /부식/g, color: "#7ddc6d" },
    { pattern: /띄우기/g, color: "#cfd8e3" },
    { pattern: /방어 불능/g, color: "#cfd8e3" },
  ];

  const matches: Array<{ start: number; end: number; text: string; color: string }> = [];

  colorMap.forEach(({ pattern, color }) => {
    for (const match of text.matchAll(pattern)) {
      const start = match.index ?? 0;
      const value = match[0];
      matches.push({ start, end: start + value.length, text: value, color });
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
      parts.push(<Fragment key={`plain-${index}-${cursor}`}>{text.slice(cursor, match.start)}</Fragment>);
    }

    parts.push(
      <span key={`hl-${index}-${match.start}`} style={{ color: match.color, fontWeight: 900 }}>
        {match.text}
      </span>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(<Fragment key={`tail-${cursor}`}>{text.slice(cursor)}</Fragment>);
  }

  return parts;
}

function renderHighlightedDescription(text: string, statValues: Array<string | number>) {
  const targets = Array.from(
    new Set(
      statValues
        .map((value) => String(value).trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length),
    ),
  );

  if (!targets.length) return highlightElementTerms(text);

  const matches: Array<{ start: number; end: number; text: string }> = [];

  for (const target of targets) {
    const regex = new RegExp(escapeRegExp(target), "g");

    for (const match of text.matchAll(regex)) {
      const start = match.index ?? 0;
      const value = match[0];
      matches.push({ start, end: start + value.length, text: value });
    }
  }

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

  if (!filtered.length) return highlightElementTerms(text);

  const parts: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (match.start > cursor) {
      parts.push(
        <Fragment key={`text-${index}-${cursor}`}>
          {highlightElementTerms(text.slice(cursor, match.start))}
        </Fragment>,
      );
    }

    parts.push(
      <span key={`value-${index}-${match.start}`} style={{ color: YELLOW_TEXT, fontWeight: 900 }}>
        {match.text}
      </span>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(<Fragment key={`tail-${cursor}`}>{highlightElementTerms(text.slice(cursor))}</Fragment>);
  }

  return parts;
}

function StatValueGrid({ stats, rank }: { stats: SkillStat[]; rank?: string }) {
  if (!stats.length) {
    return <p className="text-sm font-bold text-zinc-500">표시할 수치가 없습니다.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={`${rank ?? "rank"}-${stat.label}`}
          className="relative overflow-hidden rounded-[22px] border border-yellow-500/10 bg-[#05070b]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,210,74,0.10),transparent_40%)]" />
          <div className="relative">
            <p className="text-[10px] font-black tracking-[0.16em] text-zinc-500">{stat.label}</p>
            <p className="mt-2 break-words text-2xl font-black leading-none" style={{ color: YELLOW_TEXT }}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillHudPanel({ skill, tabKey }: { skill?: WeaponSkillDetail; tabKey: SkillTabKey }) {
  const [rankIndex, setRankIndex] = useState(0);

  useEffect(() => {
    setRankIndex(0);
  }, [skill?.key]);

  if (!skill) {
    return (
      <div className="rounded-[26px] border border-yellow-500/10 bg-black/35 p-5 text-sm font-bold text-zinc-500">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  const levels = skill.levelValues ?? [];
  const safeRankIndex = levels[rankIndex] ? rankIndex : 0;
  const current = levels[safeRankIndex];
  const stats = current?.stats ?? [];
  const description = current?.description?.trim();
  const isSeries = tabKey === "series";

  return (
    <div className="overflow-hidden rounded-[30px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_20px_48px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="relative overflow-hidden border-b border-yellow-500/10 p-5 lg:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(255,210,74,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_52%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black tracking-[0.26em] text-zinc-500">WEAPON SKILL</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-[10px] font-black text-yellow-100">
                {TAB_LABEL_MAP[tabKey]}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black text-zinc-400">
                {current?.rank ?? "Rank 1"}
              </span>
            </div>
            <h3 className="mt-3 break-keep text-[clamp(28px,4.5vw,44px)] font-black leading-tight text-white">
              {skill.name}
            </h3>
          </div>

          {!!levels.length && (
            <div className="flex flex-wrap gap-1.5 lg:max-w-[560px] lg:justify-end">
              {levels.map((level, index) => {
                const active = safeRankIndex === index;

                return (
                  <button
                    key={`${skill.key}-${level.rank}`}
                    type="button"
                    onClick={() => setRankIndex(index)}
                    className={[
                      "h-10 min-w-12 rounded-xl border px-3 text-xs font-black transition",
                      active
                        ? "border-yellow-300/70 bg-yellow-400/20 text-yellow-100 shadow-[0_0_18px_rgba(255,210,74,0.12)]"
                        : "border-white/10 bg-black/55 text-zinc-300 hover:border-yellow-400/35 hover:bg-yellow-400/10 hover:text-yellow-100",
                    ].join(" ")}
                  >
                    {level.rank}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 lg:p-6">
        {isSeries && description ? (
          <div className="mb-4 rounded-[24px] border border-yellow-500/10 bg-[#071019]/80 p-5 text-sm font-bold leading-7 text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <p className="mb-3 text-sm font-black" style={{ color: YELLOW_TEXT }}>
              설명
            </p>
            {renderHighlightedDescription(description, stats.map((stat) => stat.value))}
          </div>
        ) : null}

        <div className="rounded-[24px] border border-yellow-500/10 bg-black/35 p-4 lg:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
              수치 정보
            </p>
            <p className="text-[10px] font-bold text-yellow-200/70">{current?.rank ?? "Rank 1"} 기준</p>
          </div>
          <StatValueGrid stats={stats} rank={current?.rank} />
        </div>
      </div>
    </div>
  );
}

export default function WeaponLevelPanel({
  weaponName,
  weaponEnName,
  weaponImage,
  weaponTypeLabel,
  levelStats,
  skills = [],
}: Props) {
  const safeWeaponName = normalizeText(weaponName) || "무기";
  const safeWeaponImage = normalizeText(weaponImage);

  const safeStats = useMemo<WeaponLevelStatRow[]>(() => {
    if (!Array.isArray(levelStats)) return [];

    return [...levelStats]
      .filter((row): row is WeaponLevelStatRow => !!row && Number.isFinite(row.level) && Number.isFinite(row.attack))
      .sort((a, b) => a.level - b.level);
  }, [levelStats]);

  const selectableLevels = useMemo(() => {
    const existing = new Set(safeStats.map((row) => row.level));
    const marks = LEVEL_MARKS.filter((level) => existing.has(level));
    return marks.length ? marks : safeStats.map((row) => row.level).slice(0, 6);
  }, [safeStats]);

  const initialLevel = selectableLevels[0] ?? safeStats[0]?.level ?? 1;
  const [level, setLevel] = useState(initialLevel);

  useEffect(() => {
    if (!safeStats.some((row) => row.level === level)) {
      setLevel(initialLevel);
    }
  }, [initialLevel, level, safeStats]);

  const groupedSkills = useMemo(() => {
    const grouped: Record<SkillTabKey, WeaponSkillDetail | undefined> = {
      ability: undefined,
      attribute: undefined,
      series: undefined,
    };

    for (const skill of skills) {
      if (!skill) continue;
      const key = getSkillTabKey(skill);
      grouped[key] ??= skill;
    }

    return grouped;
  }, [skills]);

  const firstAvailableTab = useMemo<SkillTabKey>(() => {
    return TAB_ORDER.find((key) => groupedSkills[key]) ?? "ability";
  }, [groupedSkills]);

  const [activeTab, setActiveTab] = useState<SkillTabKey>(firstAvailableTab);

  useEffect(() => {
    if (!groupedSkills[activeTab]) {
      setActiveTab(firstAvailableTab);
    }
  }, [activeTab, firstAvailableTab, groupedSkills]);

  const currentStats = useMemo(() => {
    return safeStats.find((row) => row.level === level) ?? safeStats[0] ?? null;
  }, [level, safeStats]);

  if (!currentStats) {
    return (
      <section className="rounded-[28px] border border-yellow-500/15 bg-[#05070b]/95 p-5 text-sm font-bold text-zinc-500">
        표시할 무기 레벨 데이터가 없습니다.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
      <div className="relative overflow-hidden border-b border-yellow-500/10 bg-[radial-gradient(circle_at_14%_0%,rgba(255,210,74,0.14),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent)] p-4 lg:p-5">
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
          <div className="flex min-w-0 items-center gap-4 rounded-[24px] border border-yellow-500/10 bg-black/25 p-3">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-black/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:h-28 sm:w-28">
              {safeWeaponImage ? (
                <img
                  src={safeWeaponImage}
                  alt={safeWeaponName}
                  className="h-full w-full object-contain p-2 drop-shadow-[0_10px_18px_rgba(0,0,0,0.58)]"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-3xl font-black text-yellow-100">?</div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black tracking-[0.24em] text-zinc-500">WEAPON STATUS</p>
              <h2 className="mt-1 break-keep text-[clamp(30px,5vw,46px)] font-black leading-none text-white">
                {safeWeaponName}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-black text-zinc-400">
                {weaponEnName ? <span>{weaponEnName}</span> : null}
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-zinc-300">
                  {weaponTypeLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-yellow-500/15 bg-black/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">주요 보조 능력치</p>
            <div className="mt-4 rounded-[20px] border border-yellow-500/10 bg-[#070a10]/90 p-4">
              <p className="text-xs font-black text-zinc-500">무기 공격력</p>
              <p className="mt-2 text-5xl font-black leading-none" style={{ color: YELLOW_TEXT }}>
                {currentStats.attack}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-yellow-500/10 px-4 py-4 lg:px-5 lg:py-5">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="text-[10px] font-black tracking-[0.24em] text-zinc-500">CURRENT LEVEL</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-5xl font-black leading-none text-white">Lv. {currentStats.level}</span>
              <span className="pb-1 text-sm font-black text-zinc-500">/ 90</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {selectableLevels.map((mark) => {
              const active = currentStats.level === mark;

              return (
                <button
                  key={mark}
                  type="button"
                  onClick={() => setLevel(mark)}
                  className={[
                    "h-12 rounded-2xl border px-3 text-sm font-black transition",
                    active
                      ? "border-yellow-300/70 bg-yellow-400/20 text-yellow-100 shadow-[0_0_20px_rgba(255,210,74,0.10),inset_0_0_0_1px_rgba(255,210,74,0.10)]"
                      : "border-white/10 bg-black/45 text-zinc-300 hover:border-yellow-400/35 hover:bg-yellow-400/10 hover:text-yellow-100",
                  ].join(" ")}
                >
                  {mark}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-5">
        <div className="mb-4 overflow-hidden rounded-[26px] border border-yellow-500/10 bg-black/35 p-2">
          <div className="grid gap-2 lg:grid-cols-3">
            {TAB_ORDER.map((key) => {
              const skill = groupedSkills[key];
              const active = activeTab === key;
              const disabled = !skill;

              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => setActiveTab(key)}
                  className={[
                    "group relative min-h-[74px] overflow-hidden rounded-[20px] border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-45",
                    active
                      ? "border-yellow-300/45 bg-yellow-400/15 shadow-[0_0_28px_rgba(255,210,74,0.10),inset_0_1px_0_rgba(255,255,255,0.04)]"
                      : "border-white/10 bg-[#05070b]/85 hover:border-yellow-400/30 hover:bg-yellow-400/10",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,210,74,0.08),transparent_55%)] opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500">{TAB_LABEL_MAP[key]}</p>
                      <p className={["mt-2 truncate text-lg font-black", active ? "text-yellow-100" : "text-zinc-200"].join(" ")}>
                        {skill?.name ?? "-"}
                      </p>
                    </div>
                    <p className="shrink-0 rounded-full border border-yellow-500/10 bg-black/50 px-3 py-1 text-xs font-black text-yellow-100">
                      {getFirstValue(skill)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <SkillHudPanel
          skill={groupedSkills[activeTab] ?? groupedSkills[firstAvailableTab]}
          tabKey={groupedSkills[activeTab] ? activeTab : firstAvailableTab}
        />
      </div>
    </section>
  );
}
