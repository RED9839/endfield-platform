"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";

type WeaponLevelStatRow = { level: number; attack: number };
type SkillStat = { label: string; value: string | number };
type SkillLevelValue = { rank: string; description?: string; stats?: SkillStat[] };
type WeaponSkillMeta = { label: string; value: string | number };

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

const TAB_SUB_LABEL_MAP: Record<SkillTabKey, string> = {
  ability: "WEAPON ABILITY",
  attribute: "WEAPON ATTRIBUTE",
  series: "SERIES SKILL",
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

  matches.sort((a, b) => (a.start !== b.start ? a.start - b.start : b.end - a.end));

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

  if (cursor < text.length) parts.push(<Fragment key={`tail-${cursor}`}>{text.slice(cursor)}</Fragment>);

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

  matches.sort((a, b) => (a.start !== b.start ? a.start - b.start : b.end - a.end));

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

function ValueGrid({ stats, rank }: { stats: SkillStat[]; rank?: string }) {
  if (!stats.length) return <p className="text-sm font-bold text-zinc-500">표시할 수치가 없습니다.</p>;

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={`${rank ?? "rank"}-${stat.label}`}
          className="rounded-2xl border border-white/10 bg-[#0b0d12]/90 px-4 py-3"
        >
          <p className="text-[11px] font-black text-zinc-500">{stat.label}</p>
          <p className="mt-1 break-words text-xl font-black leading-none" style={{ color: YELLOW_TEXT }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function WeaponSkillMainPanel({ skill, tabKey }: { skill?: WeaponSkillDetail; tabKey: SkillTabKey }) {
  const [rankIndex, setRankIndex] = useState(0);

  useEffect(() => setRankIndex(0), [skill?.key]);

  if (!skill) {
    return (
      <div className="rounded-[22px] border border-yellow-500/10 bg-black/35 p-4 text-sm font-bold text-zinc-500">
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
    <div className="overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#06080c]/95 shadow-[0_14px_38px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="relative overflow-hidden border-b border-yellow-500/10 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,210,74,0.12),transparent_30%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black tracking-[0.26em] text-zinc-500">WEAPON SKILL</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-yellow-400/25 bg-yellow-400/15 px-3 py-1 text-xs font-black text-yellow-100">
                {TAB_LABEL_MAP[tabKey]}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-zinc-400">
                {current?.rank ?? "Rank 1"}
              </span>
            </div>
            <h3 className="mt-2 break-keep text-[clamp(24px,3.6vw,36px)] font-black leading-tight text-white">
              {skill.name}
            </h3>
          </div>

          {!!levels.length && (
            <div className="flex flex-wrap gap-1.5 lg:max-w-[620px] lg:justify-end">
              {levels.map((level, index) => {
                const active = safeRankIndex === index;
                return (
                  <button
                    key={`${skill.key}-${level.rank}`}
                    type="button"
                    onClick={() => setRankIndex(index)}
                    className={[
                      "h-8 min-w-10 rounded-lg border px-2.5 text-xs font-black transition",
                      active
                        ? "border-yellow-300/80 bg-yellow-400/25 text-yellow-100 shadow-[0_0_18px_rgba(255,210,74,0.14)]"
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

      {isSeries ? (
        <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
          <div className="min-h-[160px] rounded-[18px] border border-white/10 bg-[#080b11]/85 p-4 text-sm font-bold leading-7 text-zinc-100">
            <p className="mb-3 border-l-4 border-yellow-300 pl-3 text-sm font-black" style={{ color: YELLOW_TEXT }}>
              스킬 설명
            </p>
            {description ? renderHighlightedDescription(description, stats.map((stat) => stat.value)) : "-"}
          </div>

          <div className="rounded-[18px] border border-white/10 bg-[#080b11]/85 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
                수치 정보
              </p>
              <p className="text-[11px] font-bold text-yellow-200/70">{current?.rank ?? "Rank 1"} 기준</p>
            </div>
            <ValueGrid stats={stats} rank={current?.rank} />
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="rounded-[18px] border border-white/10 bg-[#080b11]/85 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
                수치 정보
              </p>
              <p className="text-[11px] font-bold text-yellow-200/70">{current?.rank ?? "Rank 1"} 기준</p>
            </div>
            <ValueGrid stats={stats} rank={current?.rank} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function WeaponLevelPanel({
  weaponName,
  weaponEnName,
  weaponImage,
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
    if (!safeStats.some((row) => row.level === level)) setLevel(initialLevel);
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

  const firstAvailableTab = useMemo<SkillTabKey>(
    () => TAB_ORDER.find((key) => groupedSkills[key]) ?? "ability",
    [groupedSkills],
  );
  const [activeTab, setActiveTab] = useState<SkillTabKey>(firstAvailableTab);

  useEffect(() => {
    if (!groupedSkills[activeTab]) setActiveTab(firstAvailableTab);
  }, [activeTab, firstAvailableTab, groupedSkills]);

  const currentStats = useMemo(
    () => safeStats.find((row) => row.level === level) ?? safeStats[0] ?? null,
    [level, safeStats],
  );

  if (!currentStats) {
    return (
      <section className="rounded-[24px] border border-yellow-500/15 bg-[#05070b]/95 p-4 text-sm font-bold text-zinc-500">
        표시할 무기 레벨 데이터가 없습니다.
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_14px_38px_rgba(0,0,0,0.28)]">
        <div className="relative overflow-hidden border-b border-yellow-500/10 bg-[radial-gradient(circle_at_8%_0%,rgba(255,210,74,0.12),transparent_34%)] p-4">
          <div className="relative flex min-w-0 items-center gap-4 rounded-[20px] border border-white/10 bg-black/20 p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-yellow-500/15 bg-black/45 sm:h-20 sm:w-20">
              {safeWeaponImage ? (
                <img
                  src={safeWeaponImage}
                  alt={safeWeaponName}
                  className="h-full w-full object-contain p-2 drop-shadow-[0_10px_18px_rgba(0,0,0,0.58)]"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-2xl font-black text-yellow-100">?</div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="break-keep text-[clamp(26px,4vw,38px)] font-black leading-none text-white">
                {safeWeaponName}
              </h2>
              {weaponEnName ? (
                <p className="mt-2 truncate text-xs font-black text-zinc-400 sm:text-sm">{weaponEnName}</p>
              ) : null}
            </div>
          </div>

          <div className="relative mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.45fr)]">
            <div className="rounded-[20px] border border-white/10 bg-black/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black tracking-[0.24em] text-zinc-500">CURRENT LEVEL</p>
                <span className="rounded-lg border border-yellow-400/25 bg-yellow-400/15 px-2.5 py-1.5 text-[11px] font-black text-yellow-100">
                  직접 입력
                </span>
              </div>
              <div className="mt-2.5 flex items-end gap-2">
                <span className="text-4xl font-black leading-none text-white">Lv. {currentStats.level}</span>
                <span className="pb-1 text-xs font-black text-zinc-500">/ 90</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {selectableLevels.map((mark) => {
                  const active = currentStats.level === mark;
                  return (
                    <button
                      key={mark}
                      type="button"
                      onClick={() => setLevel(mark)}
                      className={[
                        "h-10 rounded-xl border px-2 text-xs font-black transition",
                        active
                          ? "border-yellow-300/75 bg-yellow-400/20 text-yellow-100"
                          : "border-white/10 bg-black/45 text-zinc-300 hover:border-yellow-400/35 hover:bg-yellow-400/10",
                      ].join(" ")}
                    >
                      {mark}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[20px] border border-yellow-500/20 bg-black/35 p-4">
              <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">무기 공격력</p>
              <p className="mt-3 text-4xl font-black leading-none" style={{ color: YELLOW_TEXT }}>
                {currentStats.attack}
              </p>
              <div className="mt-4 h-1.5 rounded-full bg-zinc-800">
                <div className="h-full w-[16%] rounded-full bg-yellow-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_14px_38px_rgba(0,0,0,0.28)]">
        <div className="relative overflow-hidden border-b border-yellow-500/10 p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,210,74,0.12),transparent_34%)]" />
          <div className="relative grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(480px,1.15fr)] lg:items-center">
            <div>
              <p className="text-[10px] font-black tracking-[0.3em]" style={{ color: YELLOW_TEXT }}>
                WEAPON SKILL DECK
              </p>
              <h3 className="mt-1 text-2xl font-black text-white">무기 스킬 덱</h3>
              <p className="mt-1.5 text-xs font-bold text-zinc-500">스킬을 선택해서 상세 수치와 Rank 정보를 확인합니다.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {TAB_ORDER.map((key) => {
                const skill = groupedSkills[key];
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!skill}
                    onClick={() => setActiveTab(key)}
                    className={[
                      "rounded-[16px] border px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-45",
                      active
                        ? "border-yellow-300/70 bg-yellow-400/20 text-yellow-100"
                        : "border-white/10 bg-[#05070b]/85 text-zinc-300 hover:border-yellow-400/35 hover:bg-yellow-400/10",
                    ].join(" ")}
                  >
                    <p className="text-[9px] font-black tracking-[0.16em] text-zinc-500">{TAB_SUB_LABEL_MAP[key]}</p>
                    <p className="mt-1 truncate text-sm font-black">{skill?.name ?? "-"}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4">
          <WeaponSkillMainPanel
            skill={groupedSkills[activeTab] ?? groupedSkills[firstAvailableTab]}
            tabKey={groupedSkills[activeTab] ? activeTab : firstAvailableTab}
          />
        </div>
      </section>
    </div>
  );
}
