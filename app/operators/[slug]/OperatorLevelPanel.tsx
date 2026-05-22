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

const LEVEL_MARKS = [1, 20, 40, 60, 80, 90];

const BAR_MAX = {
  hp: 5500,
  attack: 350,
  power: 200,
  agility: 200,
  intelligence: 200,
  will: 200,
};

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

function InfoChip({
  title,
  value,
  iconSrc,
  borderColor,
  valueColor = "#f8fafc",
}: {
  title: string;
  value: string;
  iconSrc?: string;
  borderColor?: string;
  valueColor?: string;
}) {
  return (
    <div
      className="min-w-0 rounded-[16px] border bg-black/25 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
      style={{ borderColor: borderColor ?? "rgba(255,255,255,0.10)" }}
    >
      <div className="mb-1.5 text-[10px] font-black tracking-[0.13em] text-zinc-500">
        {title}
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <SmallIcon src={iconSrc} alt={value} size={18} />
        <div className="min-w-0 truncate text-sm font-black" style={{ color: valueColor }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  maxValue,
  variant = "normal",
}: {
  label: string;
  value: number;
  maxValue: number;
  variant?: "normal" | "mainStat" | "subStat";
}) {
  const width = Math.max(4, Math.min(100, (value / maxValue) * 100));
  const icon = statIconMap[label];
  const isMain = variant === "mainStat";
  const isSub = variant === "subStat";

  return (
    <div
      className={[
        "min-w-0 rounded-[16px] border bg-black/25 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
        isMain ? "border-yellow-300/25" : isSub ? "border-zinc-300/20" : "border-white/10",
      ].join(" ")}
    >
      <div className="mb-2 grid min-w-0 grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2">
        <SmallIcon src={icon} alt={label} size={18} />
        <div className="min-w-0 truncate text-sm font-black text-zinc-100">
          {label}
        </div>
        <div className="text-sm font-black text-yellow-200">{value}</div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#141a24]">
        <div
          className="h-full rounded-full bg-[#f7b423] shadow-[0_0_12px_rgba(247,180,35,0.25)]"
          style={{ width: `${width}%` }}
        />
      </div>
      {(isMain || isSub) && (
        <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.035] px-2 py-0.5 text-[10px] font-black text-zinc-300">
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

  if (!currentStats) {
    return (
      <section className="rounded-[22px] border border-yellow-500/15 bg-[#05070b] p-4 text-sm font-bold text-zinc-500">
        해당 레벨 데이터가 없음
      </section>
    );
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b] shadow-[0_14px_34px_rgba(0,0,0,0.24)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(255,210,74,0.10),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.004))]" />

      <div className="relative p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black tracking-[0.24em] text-yellow-200/80">
              LEVEL STATUS
            </div>
            <h3 className="mt-1 text-xl font-black text-yellow-100 sm:text-2xl">
              레벨 능력치
            </h3>
          </div>
          <div className="hidden rounded-full border border-yellow-500/15 bg-black/35 px-3 py-1 text-xs font-black text-zinc-400 sm:block">
            1 - 90
          </div>
        </div>

        <div className="grid min-w-0 gap-3 xl:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="min-w-0 rounded-[18px] border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
            <div className="mb-4">
              <div className="break-keep text-[clamp(28px,7vw,40px)] font-black leading-none text-white">
                {name}
              </div>
              <div className="mt-2 break-words text-xs font-bold uppercase tracking-[0.05em] text-zinc-500">
                {enName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoChip
                title="레어도"
                value={rarityLabel}
                iconSrc={rarityIcon}
                borderColor={rarityBorderMap[rarity]}
              />
              <InfoChip
                title="속성"
                value={elementLabel}
                iconSrc={elementIcon}
                borderColor={elementBorderMap[element]}
              />
              <InfoChip title="클래스" value={classLabel} iconSrc={classIcon} />
              <InfoChip title="무기 타입" value={weaponLabel} iconSrc={weaponIcon} />
              <InfoChip
                title="주요 능력치"
                value={mainStatLabel}
                iconSrc={statIconMap[mainStatLabel]}
                borderColor="rgba(255,214,92,0.28)"
                valueColor="#ffd24a"
              />
              <InfoChip
                title="보조 능력치"
                value={subStatLabel}
                iconSrc={statIconMap[subStatLabel]}
                borderColor="rgba(203,213,225,0.24)"
                valueColor="#d5dde8"
              />
            </div>
          </aside>

          <section className="min-w-0 rounded-[18px] border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:p-4">
            <div className="grid min-w-0 gap-3 lg:grid-cols-[140px_minmax(0,1fr)] lg:items-start">
              <div className="min-w-0">
                <div className="text-[10px] font-black tracking-[0.16em] text-zinc-500">
                  CURRENT LEVEL
                </div>

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
                    className="mt-1 h-10 w-full rounded-xl border border-yellow-500/25 bg-[#05070b] px-3 text-2xl font-black text-white outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue(String(level));
                      setIsEditing(true);
                    }}
                    className="mt-1 text-left text-[34px] font-black leading-none text-white transition hover:text-yellow-100"
                  >
                    Lv. {level}
                  </button>
                )}
              </div>

              <div className="min-w-0">
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

                <div className="mt-2 grid grid-cols-6 text-center text-[10px] font-black text-zinc-500">
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
            </div>

            <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="생명력"
                value={currentStats.hp}
                maxValue={BAR_MAX.hp}
                variant={getStatVariant("생명력")}
              />
              <StatCard
                label="공격력"
                value={currentStats.attack}
                maxValue={BAR_MAX.attack}
                variant={getStatVariant("공격력")}
              />
              <StatCard
                label="힘"
                value={currentStats.power ?? 0}
                maxValue={BAR_MAX.power}
                variant={getStatVariant("힘")}
              />
              <StatCard
                label="민첩"
                value={currentStats.agility ?? 0}
                maxValue={BAR_MAX.agility}
                variant={getStatVariant("민첩")}
              />
              <StatCard
                label="지능"
                value={currentStats.intelligence ?? 0}
                maxValue={BAR_MAX.intelligence}
                variant={getStatVariant("지능")}
              />
              <StatCard
                label="의지"
                value={currentStats.will ?? 0}
                maxValue={BAR_MAX.will}
                variant={getStatVariant("의지")}
              />
            </div>
          </section>
        </div>
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
          background: linear-gradient(90deg, rgba(247, 180, 35, 0.95), rgba(247, 180, 35, 0.35)), #141a24;
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
