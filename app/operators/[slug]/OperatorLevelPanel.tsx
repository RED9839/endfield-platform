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

const weaponLabelMap: Record<WeaponType, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};

const rarityIconMap: Record<OperatorRarity, string> = {
  4: "/icons/rarity/4star.webp",
  5: "/icons/rarity/5star.webp",
  6: "/icons/rarity/6star.webp",
};

const rarityBorderMap: Record<OperatorRarity, string> = {
  4: "rgba(154,99,255,0.42)",
  5: "rgba(240,201,74,0.42)",
  6: "rgba(255,138,31,0.42)",
};

const elementLabelMap: Record<OperatorElement, string> = {
  physical: "물리",
  cryo: "냉기",
  heat: "열기",
  nature: "자연",
  electric: "전기",
};

const elementBorderMap: Record<OperatorElement, string> = {
  physical: "rgba(160,160,160,0.42)",
  cryo: "rgba(66,211,255,0.42)",
  heat: "rgba(255,122,69,0.42)",
  nature: "rgba(141,224,74,0.42)",
  electric: "rgba(255,210,61,0.42)",
};

const classLabelMap: Record<OperatorClass, string> = {
  vanguard: "뱅가드",
  guard: "가드",
  defender: "디펜더",
  supporter: "서포터",
  caster: "캐스터",
  striker: "스트라이커",
};

const classIconMap: Record<OperatorClass, string> = {
  vanguard: "/icons/classes/vanguard.webp",
  guard: "/icons/classes/guard.webp",
  defender: "/icons/classes/defender.webp",
  supporter: "/icons/classes/supporter.webp",
  caster: "/icons/classes/caster.webp",
  striker: "/icons/classes/striker.webp",
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

function formatPercent(value: number, maxValue: number) {
  return Math.round(Math.max(0, Math.min(100, (value / maxValue) * 100)));
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

function ProfileChip({
  value,
  iconSrc,
  borderColor,
}: {
  value: string;
  iconSrc?: string;
  borderColor?: string;
}) {
  return (
    <div
      className="inline-flex min-h-10 items-center gap-2 rounded-full border bg-black/25 px-4 text-sm font-black text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
      style={{ borderColor: borderColor ?? "rgba(255,255,255,0.12)" }}
    >
      <SmallIcon src={iconSrc} alt={value} size={18} />
      {value}
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
  const percent = formatPercent(value, maxValue);
  const accentClass = tone === "yellow" ? "text-yellow-200" : "text-sky-300";
  const borderClass = tone === "yellow" ? "border-yellow-300/25" : "border-sky-300/25";
  const bgClass = tone === "yellow" ? "bg-yellow-400/10" : "bg-sky-400/10";
  const barClass = tone === "yellow" ? "bg-yellow-300" : "bg-sky-400";

  return (
    <div className={`min-w-0 rounded-[20px] border ${borderClass} bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]`}>
      <div className={`text-sm font-black ${accentClass}`}>{title}</div>
      <div className="mt-4 grid grid-cols-[52px_minmax(0,1fr)_58px] items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 ${bgClass}`}>
          <SmallIcon src={icon} alt={label} size={28} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-zinc-200">{label}</div>
          <div className={`mt-0.5 text-4xl font-black leading-none ${accentClass}`}>{value}</div>
        </div>
        <div className="text-right text-lg font-black text-zinc-300">{percent}%</div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#151b24]">
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
  const percent = formatPercent(value, config.maxValue);
  const isMain = variant === "mainStat";
  const isSub = variant === "subStat";

  return (
    <div
      className={[
        "min-w-0 rounded-[18px] border bg-black/25 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
        isMain ? "border-yellow-300/25" : isSub ? "border-sky-300/25" : "border-white/10",
      ].join(" ")}
    >
      <div className="grid min-w-0 grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/35">
          <SmallIcon src={config.icon} alt={config.label} size={23} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-zinc-100">{config.label}</div>
          <div className="mt-0.5 text-2xl font-black leading-none text-white">{value}</div>
        </div>
        <div className="text-sm font-black text-zinc-500">{percent}%</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#141a24]">
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
            "mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black",
            isMain
              ? "border-yellow-300/25 bg-yellow-400/10 text-yellow-200"
              : "border-sky-300/25 bg-sky-400/10 text-sky-300",
          ].join(" ")}
        >
          {isMain ? "주요 능력치" : "보조 능력치"}
        </div>
      )}
    </div>
  );
}

export default function OperatorLevelPanel({
  name,
  enName,
  element,
  operatorClass,
  weapon,
  rarity,
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

    const nextLevel = clamp(Math.floor(parsed), 1, 90);
    setLevel(nextLevel);
    setInputValue(String(nextLevel));
    setIsEditing(false);
  };

  const elementIcon = `/icons/elements/${element}.webp`;
  const classIcon = classIconMap[operatorClass];
  const weaponIcon = `/icons/weapons/${weapon}.webp`;
  const rarityIcon = rarityIconMap[rarity];

  const elementLabel = elementLabelMap[element] ?? element;
  const classLabel = classLabelMap[operatorClass] ?? operatorClass;
  const weaponLabel = weaponLabelMap[weapon] ?? weapon;
  const rarityLabel = `${rarity}성`;

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
    <section className="relative min-w-0 overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#05070b] shadow-[0_14px_34px_rgba(0,0,0,0.24)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(255,210,74,0.11),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.035),rgba(255,255,255,0.004))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-[repeating-linear-gradient(135deg,rgba(255,210,74,0.07)_0px,rgba(255,210,74,0.07)_2px,transparent_2px,transparent_8px)] opacity-25" />

      <div className="relative p-3 sm:p-4">
        <div className="rounded-[20px] border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid min-w-0 grid-cols-[54px_minmax(0,1fr)] items-center gap-3">
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[18px] border border-white/10 bg-black/35">
                <SmallIcon src={classIcon} alt={classLabel} size={34} />
              </div>
              <div className="min-w-0">
                <h3 className="break-keep text-[clamp(28px,7vw,42px)] font-black leading-none text-white">
                  {name}
                </h3>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-zinc-500">
                  {enName}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <ProfileChip value={rarityLabel} iconSrc={rarityIcon} borderColor={rarityBorderMap[rarity]} />
              <ProfileChip value={elementLabel} iconSrc={elementIcon} borderColor={elementBorderMap[element]} />
              <ProfileChip value={classLabel} iconSrc={classIcon} />
              <ProfileChip value={weaponLabel} iconSrc={weaponIcon} />
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
          <section className="min-w-0 rounded-[20px] border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
            <div className="text-[10px] font-black tracking-[0.2em] text-zinc-500">
              CURRENT LEVEL
            </div>
            <div className="mt-2 flex flex-wrap items-end gap-3">
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
                  className="h-12 w-32 rounded-xl border border-yellow-500/25 bg-[#05070b] px-3 text-3xl font-black text-white outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(String(level));
                    setIsEditing(true);
                  }}
                  className="text-left text-[46px] font-black leading-none text-white transition hover:text-yellow-100"
                >
                  Lv. {level}
                </button>
              )}
              <span className="pb-1 text-sm font-black text-zinc-500">/ 90</span>
            </div>

            <div className="mt-5">
              <input
                className="operator-level-range w-full"
                type="range"
                min={1}
                max={90}
                step={1}
                value={level}
                onChange={(e) => {
                  const nextLevel = Number(e.target.value);
                  setLevel(nextLevel);
                  setInputValue(String(nextLevel));
                }}
              />
              <div className="mt-2 grid grid-cols-6 text-center text-xs font-black text-zinc-500">
                {LEVEL_MARKS.map((mark) => (
                  <button
                    key={mark}
                    type="button"
                    onClick={() => {
                      setLevel(mark);
                      setInputValue(String(mark));
                    }}
                    className={[
                      "transition hover:text-yellow-200",
                      mark === level ? "text-yellow-200" : "text-zinc-500",
                    ].join(" ")}
                  >
                    {mark}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-zinc-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[11px] text-zinc-300">i</span>
              레벨을 올리면 스탯이 증가합니다.
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

        <section className="mt-3 rounded-[20px] border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-lg font-black text-yellow-200">능력치 정보</div>
            <div className="text-xs font-bold text-zinc-500">
              능력치는 레벨과 성장 값에 따라 변동됩니다.
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

      <style jsx>{`
        .operator-level-range {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          background: transparent;
          outline: none;
          display: block;
        }

        .operator-level-range::-webkit-slider-runnable-track {
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(247, 180, 35, 0.95), rgba(247, 180, 35, 0.4)), #141a24;
        }

        .operator-level-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #ffd24a;
          border: 2px solid #050505;
          margin-top: -5.5px;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(255, 210, 74, 0.45);
        }

        .operator-level-range::-moz-range-track {
          height: 7px;
          border-radius: 999px;
          background: #141a24;
          border: none;
        }

        .operator-level-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #ffd24a;
          border: 2px solid #050505;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(255, 210, 74, 0.45);
        }
      `}</style>
    </section>
  );
}
