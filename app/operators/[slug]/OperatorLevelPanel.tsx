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

const elementAccent: Record<string, string> = {
  physical: "#d6dae3",
  cryo: "#4fa3ff",
  heat: "#ff8a1f",
  nature: "#3ecf8e",
  electric: "#c084fc",
};

const STAT_EN: Record<string, string> = {
  생명력: "VITALITY",
  공격력: "ATTACK",
  힘: "STRENGTH",
  민첩: "AGILITY",
  지능: "INTELLIGENCE",
  의지: "WILL",
};

const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
};
const SECONDARY = "#7aa2c4";

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
      className="flex shrink-0 items-center justify-center border border-ef-line bg-ef-card2 font-black text-ef-muted"
      style={{ width: size, height: size, fontSize: Math.max(9, Math.floor(size * 0.4)) }}
    >
      {safeText.slice(0, 1)}
    </div>
  );
}

function SmallIcon({ src, alt, size = 18 }: { src?: string; alt?: string; size?: number }) {
  const [hasError, setHasError] = useState(false);
  const safeAlt = alt ?? "icon";
  if (!src || hasError) return <IconFallback text={safeAlt} size={size} />;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image src={src} alt={safeAlt} fill sizes={`${size}px`} className="object-contain" onError={() => setHasError(true)} />
    </div>
  );
}

function TechHeader({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 shrink-0" style={{ background: accent }} />
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ef-muted">
        {children}
      </span>
    </div>
  );
}

// 주/보조 능력치 — PRIMARY / SECONDARY ATTRIBUTE (EN 라벨 + 큰 수치 + 데이터 바)
function AttributeFocus({
  title,
  label,
  value,
  maxValue,
  icon,
  accent,
}: {
  title: string;
  label: string;
  value: number;
  maxValue: number;
  icon?: string;
  accent: string;
}) {
  const percent = getBarPercent(value, maxValue);
  const en = STAT_EN[label] ?? label;
  return (
    <div className="relative overflow-hidden border border-ef-line bg-ef-card2 p-4 pl-5" style={CUT}>
      <span className="absolute left-0 top-0 h-full w-1" style={{ background: accent }} />
      <TechHeader accent={accent}>{title}</TechHeader>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <SmallIcon src={icon} alt={label} size={22} />
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-black uppercase tracking-wide text-ef-ink">{en}</p>
            <p className="truncate text-[11px] text-ef-muted">{label}</p>
          </div>
        </div>
        <p className="font-mono text-[40px] font-black leading-none" style={{ color: accent }}>
          {value}
        </p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden bg-ef-bg">
        <div className="h-full" style={{ width: `${percent}%`, background: accent }} />
      </div>
    </div>
  );
}

// 능력치 정보 — 카드 나열 금지: 데이터 행(매트릭스)
function StatRow({
  config,
  value,
  highlight,
  accent,
}: {
  config: StatConfig;
  value: number;
  highlight: boolean;
  accent: string;
}) {
  const percent = getBarPercent(value, config.maxValue);
  const en = STAT_EN[config.label] ?? config.label;
  return (
    <div className="flex items-center gap-3 px-1.5 py-2.5">
      <SmallIcon src={config.icon} alt={config.label} size={18} />
      <div className="w-[88px] shrink-0">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ef-muted">{en}</p>
        <p className="truncate text-xs font-black text-ef-ink">{config.label}</p>
      </div>
      <div className="relative h-1.5 flex-1 overflow-hidden bg-ef-bg">
        <div className="h-full" style={{ width: `${percent}%`, background: highlight ? accent : "#3a3a3a" }} />
      </div>
      <p
        className="w-14 shrink-0 text-right font-mono text-sm font-black"
        style={{ color: highlight ? accent : "#ffffff" }}
      >
        {value}
      </p>
    </div>
  );
}

export default function OperatorLevelPanel({
  element,
  mainStatLabel,
  subStatLabel,
  levelStats,
}: Props) {
  const accent = elementAccent[element] ?? "#ffd24a";

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

  const currentStats = useMemo(
    () => safeStats.find((row) => row.level === level) ?? null,
    [level, safeStats],
  );

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

  const mainStatConfig = findStatConfig(mainStatLabel);
  const subStatConfig = findStatConfig(subStatLabel);

  if (!currentStats) {
    return (
      <div className="border border-ef-line bg-ef-card2 p-4 text-sm font-bold text-ef-muted" style={CUT}>
        해당 레벨 데이터가 없음
      </div>
    );
  }

  const mainStatValue = mainStatConfig ? getStatValue(currentStats, mainStatConfig.key) : 0;
  const subStatValue = subStatConfig ? getStatValue(currentStats, subStatConfig.key) : 0;

  return (
    <div className="grid min-w-0 gap-3">
      {/* LEVEL SYNCHRONIZATION — 높이 압축(약 -18%): 패딩·LV·버튼 영역 축소 */}
      <div className="relative overflow-hidden border border-ef-line bg-ef-card2 p-3" style={CUT}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <TechHeader accent={accent}>Level Synchronization</TechHeader>
            <div className="mt-1.5 flex items-end gap-2">
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
                  className="h-9 w-20 border border-ef-line bg-ef-bg px-2 font-mono text-2xl font-black text-ef-ink outline-none"
                  style={{ borderColor: `${accent}66` }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(String(level));
                    setIsEditing(true);
                  }}
                  className="font-mono text-[32px] font-black leading-none text-white transition hover:opacity-80"
                >
                  LV {String(level).padStart(2, "0")}
                </button>
              )}
              <span className="pb-0.5 font-mono text-[11px] font-black text-ef-muted">/ 90</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setInputValue(String(level));
              setIsEditing(true);
            }}
            className="inline-flex min-h-7 items-center border border-ef-line/70 bg-ef-card px-2 font-mono text-[9px] font-bold uppercase tracking-wide text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
          >
            Manual Input
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-6 gap-1.5">
          {LEVEL_MARKS.map((mark) => {
            const active = mark === level;
            return (
              <button
                key={mark}
                type="button"
                onClick={() => selectLevel(mark)}
                className="h-8 border font-mono text-xs font-black transition sm:text-sm"
                style={{
                  background: active ? `${accent}24` : "#0b0b0b",
                  borderColor: active ? accent : "#202020",
                  color: active ? "#ffffff" : "#a0a0a0",
                }}
              >
                {String(mark).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIMARY / SECONDARY ATTRIBUTE */}
      <div className="grid gap-3 sm:grid-cols-2">
        {mainStatConfig ? (
          <AttributeFocus
            title="Primary Attribute"
            label={mainStatLabel}
            value={mainStatValue}
            maxValue={mainStatConfig.maxValue}
            icon={mainStatConfig.icon}
            accent={accent}
          />
        ) : null}
        {subStatConfig ? (
          <AttributeFocus
            title="Secondary Attribute"
            label={subStatLabel}
            value={subStatValue}
            maxValue={subStatConfig.maxValue}
            icon={subStatConfig.icon}
            accent={SECONDARY}
          />
        ) : null}
      </div>

      {/* ATTRIBUTE DATA (능력치 정보 — 매트릭스) */}
      <div className="relative overflow-hidden border border-ef-line bg-ef-card2 p-3 sm:p-4" style={CUT}>
        <TechHeader accent={accent}>Attribute Data</TechHeader>
        <div className="mt-2 divide-y divide-ef-line">
          {STAT_CONFIGS.map((config) => (
            <StatRow
              key={config.key}
              config={config}
              value={getStatValue(currentStats, config.key)}
              highlight={config.label === mainStatLabel || config.label === subStatLabel}
              accent={config.label === subStatLabel ? SECONDARY : accent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
