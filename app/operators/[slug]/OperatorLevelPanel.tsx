"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type OperatorRarity = 4 | 5 | 6;
type OperatorElement = "physical" | "cryo" | "heat" | "nature" | "electric";
type OperatorClass =
  | "vanguard"
  | "guard"
  | "defender"
  | "supporter"
  | "caster"
  | "striker";
type WeaponType = "sword" | "greatsword" | "polearm" | "handcannon" | "artsunit";

type LevelStatRow = {
  level: number;
  hp: number;
  attack: number;
  power?: number;
  agility?: number;
  intelligence?: number;
  will?: number;
};

type Props = {
  name: string;
  enName: string;
  avatar?: string;
  element: OperatorElement;
  operatorClass: OperatorClass;
  weapon: WeaponType;
  rarity: OperatorRarity;
  mainStatLabel: string;
  subStatLabel: string;
  levelStats?: LevelStatRow[] | null;
};

type StatKey = "hp" | "attack" | "power" | "agility" | "intelligence" | "will";

type StatConfig = {
  key: StatKey;
  label: string;
  maxValue: number;
  icon: string;
};

const LEVEL_MARKS = [1, 20, 40, 60, 80, 90];
const LEVEL_MIN = 1;
const LEVEL_MAX = 90;

const STAT_CONFIGS: StatConfig[] = [
  { key: "hp", label: "생명력", maxValue: 5500, icon: "/icons/stats/hp.webp" },
  { key: "attack", label: "공격력", maxValue: 350, icon: "/icons/stats/attack.webp" },
  { key: "power", label: "힘", maxValue: 200, icon: "/icons/stats/strength.webp" },
  { key: "agility", label: "민첩", maxValue: 200, icon: "/icons/stats/agility.webp" },
  { key: "intelligence", label: "지능", maxValue: 200, icon: "/icons/stats/intelligence.webp" },
  { key: "will", label: "의지", maxValue: 200, icon: "/icons/stats/will.webp" },
];

const statIconMap: Record<string, string> = {
  생명력: "/icons/stats/hp.webp",
  공격력: "/icons/stats/attack.webp",
  힘: "/icons/stats/strength.webp",
  민첩: "/icons/stats/agility.webp",
  지능: "/icons/stats/intelligence.webp",
  의지: "/icons/stats/will.webp",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getStatValue(stats: LevelStatRow, key: StatKey) {
  if (key === "hp") return stats.hp;
  if (key === "attack") return stats.attack;
  return stats[key] ?? 0;
}

function findStatConfig(label: string) {
  return STAT_CONFIGS.find((item) => item.label === label) ?? null;
}

function getBarPercent(value: number, maxValue: number) {
  return Math.max(4, Math.min(100, (value / maxValue) * 100));
}

function IconFallback({ text, size }: { text?: string; size: number }) {
  const safeText = text ?? "?";

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#080b10] font-black text-zinc-400"
      style={{ width: size, height: size, fontSize: Math.max(10, Math.floor(size * 0.4)) }}
    >
      {safeText.slice(0, 1)}
    </div>
  );
}

function SmallIcon({ src, alt, size = 20 }: { src?: string; alt?: string; size?: number }) {
  const [hasError, setHasError] = useState(false);
  const safeAlt = alt ?? "icon";

  if (!src || hasError) return <IconFallback text={safeAlt} size={size} />;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={safeAlt}
        fill
        sizes={`${size}px`}
        className="object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

function OperatorAvatar({ src, name }: { src?: string; name: string }) {
  if (!src) return <IconFallback text={name} size={58} />;

  return (
    <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[18px] border border-yellow-400/25 bg-black/45 shadow-[0_0_18px_rgba(255,210,74,0.10)] sm:h-16 sm:w-16">
      <Image src={src} alt={name} fill sizes="64px" className="object-cover object-top" />
    </div>
  );
}

function FocusStatCard({
  title,
  label,
  value,
  maxValue,
  icon,
  tone = "yellow",
}: {
  title: string;
  label: string;
  value: number;
  maxValue: number;
  icon?: string;
  tone?: "yellow" | "blue";
}) {
  const percent = getBarPercent(value, maxValue);
  const accentClass = tone === "yellow" ? "text-yellow-200" : "text-sky-300";
  const borderClass = tone === "yellow" ? "border-yellow-300/25" : "border-sky-300/25";
  const bgClass = tone === "yellow" ? "bg-yellow-400/10" : "bg-sky-400/10";
  const barClass = tone === "yellow" ? "bg-yellow-300" : "bg-sky-400";

  return (
    <div className={`min-w-0 rounded-[18px] border ${borderClass} bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]`}>
      <div className={`text-sm font-black ${accentClass}`}>{title}</div>
      <div className="mt-3 grid grid-cols-[42px_minmax(0,1fr)] items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 ${bgClass}`}>
          <SmallIcon src={icon} alt={label} size={24} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-zinc-200">{label}</div>
          <div className={`mt-0.5 text-[30px] font-black leading-none ${accentClass}`}>{value}</div>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#151b24]">
        <div className={`h-full rounded-full ${barClass} shadow-[0_0_14px_rgba(255,210,74,0.25)]`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function StatCard({
  config,
  value,
  variant,
}: {
  config: StatConfig;
  value: number;
  variant: "normal" | "mainStat" | "subStat";
}) {
  const percent = getBarPercent(value, config.maxValue);
  const isMain = variant === "mainStat";
  const isSub = variant === "subStat";

  return (
    <div
      className={[
        "min-w-0 rounded-[16px] border bg-black/25 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
        isMain ? "border-yellow-300/25" : isSub ? "border-sky-300/25" : "border-white/10",
      ].join(" ")}
    >
      <div className="grid min-w-0 grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/35">
          <SmallIcon src={config.icon} alt={config.label} size={20} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-xs font-black text-zinc-100">{config.label}</div>
          <div className="mt-0.5 text-xl font-black leading-none text-white">{value}</div>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#141a24]">
        <div
          className={[
            "h-full rounded-full shadow-[0_0_12px_rgba(247,180,35,0.22)]",
            isSub ? "bg-sky-400" : "bg-yellow-300",
          ].join(" ")}
          style={{ width: `${percent}%` }}
        />
      </div>
      {(isMain || isSub) && (
        <div
          className={[
            "mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black",
            isMain
              ? "border-yellow-300/25 bg-yellow-400/10 text-yellow-200"
              : "border-sky-300/25 bg-sky-400/10 text-sky-300",
          ].join(" ")}
        >
          {isMain ? "주요" : "보조"}
        </div>
      )}
    </div>
  );
}

export default function OperatorLevelPanel({
  name,
  enName,
  avatar,
  mainStatLabel,
  subStatLabel,
  levelStats,
}: Props) {
  const safeStats = useMemo<LevelStatRow[]>(() => {
    if (!Array.isArray(levelStats)) return [];

    return [...levelStats]
      .filter(
        (row): row is LevelStatRow =>
          !!row && typeof row === "object" && typeof row.level === "number",
      )
      .sort((a, b) => a.level - b.level);
  }, [levelStats]);

  const initialLevel =
    safeStats.find((row) => row.level === 1)?.level ?? safeStats[0]?.level ?? 1;

  const [level, setLevel] = useState(initialLevel);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(initialLevel));

  const currentStats = useMemo(() => {
    return safeStats.find((row) => row.level === level) ?? null;
  }, [level, safeStats]);

  const commitInputLevel = () => {
    const parsed = Number(inputValue);

    if (Number.isNaN(parsed)) {
      setInputValue(String(level));
      setIsEditing(false);
      return;
    }

    const nextLevel = clamp(Math.floor(parsed), LEVEL_MIN, LEVEL_MAX);
    setLevel(nextLevel);
    setInputValue(String(nextLevel));
    setIsEditing(false);
  };

  const selectLevel = (nextLevel: number) => {
    setLevel(nextLevel);
    setInputValue(String(nextLevel));
    setIsEditing(false);
  };

  const getStatVariant = (label: string): "normal" | "mainStat" | "subStat" => {
    if (label === mainStatLabel) return "mainStat";
    if (label === subStatLabel) return "subStat";
    return "normal";
  };

  const mainStatConfig = findStatConfig(mainStatLabel);
  const subStatConfig = findStatConfig(subStatLabel);

  if (!currentStats) {
    return (
      <section className="rounded-[22px] border border-yellow-500/15 bg-[#05070b] p-4 text-sm font-bold text-zinc-500">
        해당 레벨 데이터가 없음
      </section>
    );
  }

  const mainStatValue = mainStatConfig ? getStatValue(currentStats, mainStatConfig.key) : 0;
  const subStatValue = subStatConfig ? getStatValue(currentStats, subStatConfig.key) : 0;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b] shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(255,210,74,0.10),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.004))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 bg-[repeating-linear-gradient(135deg,rgba(255,210,74,0.06)_0px,rgba(255,210,74,0.06)_2px,transparent_2px,transparent_8px)] opacity-25" />

      <div className="relative p-3 sm:p-4">
        <div className="rounded-[18px] border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
          <div className="grid min-w-0 grid-cols-[58px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[64px_minmax(0,1fr)]">
            <OperatorAvatar src={avatar} name={name} />
            <div className="min-w-0">
              <h3 className="break-keep text-[clamp(28px,6vw,38px)] font-black leading-none text-white">
                {name}
              </h3>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-zinc-500">
                {enName}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
          <section className="min-w-0 rounded-[18px] border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
            <div className="text-[10px] font-black tracking-[0.2em] text-zinc-500">
              CURRENT LEVEL
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-wrap items-end gap-2">
                {isEditing ? (
                  <input
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ""))}
                    onBlur={commitInputLevel}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitInputLevel();
                      if (e.key === "Escape") {
                        setInputValue(String(level));
                        setIsEditing(false);
                      }
                    }}
                    className="h-11 w-28 rounded-xl border border-yellow-500/25 bg-[#05070b] px-3 text-3xl font-black text-white outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue(String(level));
                      setIsEditing(true);
                    }}
                    className="text-left text-[40px] font-black leading-none text-white transition hover:text-yellow-100"
                  >
                    Lv. {level}
                  </button>
                )}
                <span className="pb-1 text-xs font-black text-zinc-500">/ 90</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInputValue(String(level));
                  setIsEditing(true);
                }}
                className="h-9 rounded-xl border border-yellow-500/20 bg-yellow-400/10 px-3 text-xs font-black text-yellow-100 transition hover:bg-yellow-400/15"
              >
                직접 입력
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {LEVEL_MARKS.map((mark) => (
                <button
                  key={mark}
                  type="button"
                  onClick={() => selectLevel(mark)}
                  className={[
                    "h-10 rounded-xl border text-sm font-black transition",
                    mark === level
                      ? "border-yellow-300/45 bg-yellow-400/18 text-yellow-100 shadow-[0_0_16px_rgba(255,210,74,0.16)]"
                      : "border-white/10 bg-black/25 text-zinc-400 hover:border-yellow-300/25 hover:bg-yellow-400/10 hover:text-yellow-100",
                  ].join(" ")}
                >
                  {mark}
                </button>
              ))}
            </div>
          </section>

          <section className="grid min-w-0 gap-3 sm:grid-cols-2">
            {mainStatConfig ? (
              <FocusStatCard
                title="주요 능력치"
                label={mainStatLabel}
                value={mainStatValue}
                maxValue={mainStatConfig.maxValue}
                icon={mainStatConfig.icon}
              />
            ) : null}

            {subStatConfig ? (
              <FocusStatCard
                title="보조 능력치"
                label={subStatLabel}
                value={subStatValue}
                maxValue={subStatConfig.maxValue}
                icon={subStatConfig.icon}
                tone="blue"
              />
            ) : null}
          </section>
        </div>

        <section className="mt-3 rounded-[18px] border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-base font-black text-yellow-200">능력치 정보</div>
          </div>

          <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {STAT_CONFIGS.map((config) => (
              <StatCard
                key={config.key}
                config={config}
                value={getStatValue(currentStats, config.key)}
                variant={getStatVariant(config.label)}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
