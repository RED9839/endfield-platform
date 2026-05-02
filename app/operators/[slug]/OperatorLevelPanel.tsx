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

const PANEL_LEFT_MIN_WIDTH = 280;
const PANEL_LEFT_MAX_WIDTH = 320;

const CURRENT_LEVEL_LABEL_WIDTH = 56;
const LEVEL_VALUE_WIDTH = 120;
const TOP_SECTION_GAP = 12;

const SLIDER_THUMB_SIZE = 16;
const SLIDER_TRACK_HEIGHT = 6;

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
  4: "rgba(168,210,255,0.42)",
  5: "rgba(198,139,255,0.42)",
  6: "rgba(255,196,74,0.42)",
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

function IconFallback({
  text,
  size,
}: {
  text?: string;
  size: number;
}) {
  const safeText = text ?? "?";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#080b10",
        color: "#cbd5e1",
        fontSize: `${Math.max(10, Math.floor(size * 0.42))}px`,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {safeText.slice(0, 1)}
    </div>
  );
}

function SmallIcon({
  src,
  alt,
  size = 20,
}: {
  src?: string;
  alt?: string;
  size?: number;
}) {
  const [hasError, setHasError] = useState(false);
  const safeAlt = alt ?? "icon";

  if (!src || hasError) {
    return <IconFallback text={safeAlt} size={size} />;
  }

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt={safeAlt}
        fill
        sizes={`${size}px`}
        style={{ objectFit: "contain" }}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

function OverviewBox({
  title,
  value,
  iconSrc,
  borderColor,
  valueColor = "#ffffff",
}: {
  title: string;
  value: string;
  iconSrc?: string;
  borderColor?: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${borderColor ?? "rgba(255,255,255,0.1)"}`,
        padding: "9px 11px",
        background: "#0d1118",
        minWidth: 0,
        borderRadius: "20px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color: "#8b98ad",
          marginBottom: "7px",
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minHeight: "20px",
          minWidth: 0,
        }}
      >
        <SmallIcon src={iconSrc} alt={value} size={17} />
        <div
          style={{
            fontSize: "14px",
            fontWeight: 800,
            lineHeight: 1.2,
            wordBreak: "keep-all",
            color: valueColor,
            minWidth: 0,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function StatBar({
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
      className="operator-stat-bar"
      style={{
        display: "grid",
        gridTemplateColumns: "22px minmax(64px, 84px) minmax(40px, 56px) minmax(0, 1fr)",
        gap: "10px",
        alignItems: "center",
        padding: "6px 9px",
        background:
          isMain || isSub
            ? "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))"
            : "transparent",
        boxShadow: isMain
          ? "0 0 0 1px rgba(255,214,92,0.16) inset"
          : isSub
            ? "0 0 0 1px rgba(203,213,225,0.14) inset"
            : "none",
        borderRadius: "6px",
        minWidth: 0,
      }}
    >
      <SmallIcon src={icon} alt={label} size={17} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: "20px",
          minWidth: 0,
        }}
      >
        {isMain || isSub ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "32px",
              height: "20px",
              padding: "0 7px",
              background: isMain ? "#ffd24a" : "#cbd5e1",
              color: "#111111",
              fontSize: "12px",
              fontWeight: 900,
              borderRadius: "3px",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        ) : (
          <span
            style={{
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        )}
      </div>

      <div
        style={{
          color: "#ffd24a",
          fontSize: "13px",
          fontWeight: 800,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>

      <div
        style={{
          height: "7px",
          background: "#1a2230",
          borderRadius: "999px",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            background: "#f7b423",
            borderRadius: "999px",
          }}
        />
      </div>
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
          !!row &&
          typeof row === "object" &&
          typeof row.level === "number"
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
      <section
        style={{
          borderRadius: "20px",
          border: "1px solid rgba(255,196,74,0.16)",
          background: "#06080c",
          padding: "12px",
        }}
      >
        <div
          style={{
            color: "#ffd65c",
            fontSize: "17px",
            fontWeight: 900,
            marginBottom: "10px",
          }}
        >
          레벨 능력치
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: "13px",
            padding: "14px",
            border: "1px solid rgba(255,196,74,0.10)",
            background: "#0a0d12",
            borderRadius: "20px",
          }}
        >
          해당 레벨 데이터가 없음
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(255,196,74,0.16)",
        background: "#06080c",
        padding: "12px",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        .operator-level-grid {
          display: grid;
          grid-template-columns: minmax(${PANEL_LEFT_MIN_WIDTH}px, ${PANEL_LEFT_MAX_WIDTH}px) minmax(0, 1fr);
          gap: 12px;
          align-items: start;
        }

        .operator-left-panel,
        .operator-right-panel {
          min-width: 0;
        }

        .operator-top-row {
          display: grid;
          grid-template-columns: ${CURRENT_LEVEL_LABEL_WIDTH}px ${LEVEL_VALUE_WIDTH}px minmax(0, 1fr);
          align-items: start;
          column-gap: ${TOP_SECTION_GAP}px;
          row-gap: 4px;
          margin-bottom: 12px;
          min-width: 0;
        }

        .slider-area {
          min-width: 0;
          width: 100%;
        }

        .slider-track-wrap {
          width: 100%;
          height: ${SLIDER_THUMB_SIZE}px;
          margin-top: 7px;
        }

        .level-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: ${SLIDER_THUMB_SIZE}px;
          background: transparent;
          outline: none;
          display: block;
        }

        .level-range::-webkit-slider-runnable-track {
          height: ${SLIDER_TRACK_HEIGHT}px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 999px;
        }

        .level-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: ${SLIDER_THUMB_SIZE}px;
          height: ${SLIDER_THUMB_SIZE}px;
          border-radius: 999px;
          background: #f7b423;
          border: none;
          margin-top: -5px;
          cursor: pointer;
        }

        .level-range::-moz-range-track {
          height: ${SLIDER_TRACK_HEIGHT}px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 999px;
          border: none;
        }

        .level-range::-moz-range-thumb {
          width: ${SLIDER_THUMB_SIZE}px;
          height: ${SLIDER_THUMB_SIZE}px;
          border-radius: 999px;
          background: #f7b423;
          border: none;
          cursor: pointer;
        }

        .level-marks {
          position: relative;
          margin-top: 8px;
          width: calc(100% - ${SLIDER_THUMB_SIZE}px);
          margin-left: ${SLIDER_THUMB_SIZE / 2}px;
          height: 16px;
        }

        @media (max-width: 1200px) {
          .operator-top-row {
            grid-template-columns: ${CURRENT_LEVEL_LABEL_WIDTH}px ${LEVEL_VALUE_WIDTH}px minmax(220px, 1fr);
          }
        }

        @media (max-width: 980px) {
          .operator-level-grid {
            grid-template-columns: 1fr;
          }

          .operator-top-row {
            grid-template-columns: 1fr;
            row-gap: 10px;
          }

          .operator-current-label {
            padding-top: 0 !important;
          }

          .operator-level-value {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
          }
        }

        @media (max-width: 640px) {
          .operator-stat-bar {
            grid-template-columns: 22px minmax(56px, 72px) minmax(36px, 48px) minmax(0, 1fr) !important;
            gap: 8px !important;
          }
        }
      `}</style>

      <div
        style={{
          color: "#ffd65c",
          fontSize: "17px",
          fontWeight: 900,
          marginBottom: "10px",
        }}
      >
        레벨 능력치
      </div>

      <div className="operator-level-grid">
        <div
          className="operator-left-panel"
          style={{
            border: "1px solid rgba(255,196,74,0.12)",
            background: "#0a0d12",
            padding: "12px",
            borderRadius: "20px",
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                color: "#fff",
                fontSize: "28px",
                fontWeight: 900,
                lineHeight: 1.02,
                textShadow: "0 0 14px rgba(255,255,255,0.08)",
                wordBreak: "keep-all",
              }}
            >
              {name}
            </div>

            <div
              style={{
                color: "#c2cad6",
                fontSize: "12px",
                marginTop: "6px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                opacity: 0.92,
                wordBreak: "break-word",
              }}
            >
              {enName}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px",
            }}
          >
            <OverviewBox
              title="레어도"
              value={rarityLabel}
              iconSrc={rarityIcon}
              borderColor={rarityBorderMap[rarity]}
            />
            <OverviewBox
              title="속성"
              value={elementLabel}
              iconSrc={elementIcon}
              borderColor={elementBorderMap[element]}
            />
            <OverviewBox title="클래스" value={classLabel} iconSrc={classIcon} />
            <OverviewBox title="무기 타입" value={weaponLabel} iconSrc={weaponIcon} />
            <OverviewBox
              title="주요 능력치"
              value={mainStatLabel}
              iconSrc={statIconMap[mainStatLabel]}
              borderColor="rgba(255,214,92,0.28)"
              valueColor="#ffd24a"
            />
            <OverviewBox
              title="보조 능력치"
              value={subStatLabel}
              iconSrc={statIconMap[subStatLabel]}
              borderColor="rgba(203,213,225,0.24)"
              valueColor="#d5dde8"
            />
          </div>
        </div>

        <div
          className="operator-right-panel"
          style={{
            border: "1px solid rgba(255,196,74,0.12)",
            background: "#0a0d12",
            padding: "12px",
            borderRadius: "20px",
          }}
        >
          <div className="operator-top-row">
            <div
              className="operator-current-label"
              style={{
                color: "#8b98ad",
                fontSize: "11px",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
                paddingTop: "10px",
              }}
            >
              현재 레벨
            </div>

            <div
              className="operator-level-value"
              style={{
                width: `${LEVEL_VALUE_WIDTH}px`,
                minWidth: `${LEVEL_VALUE_WIDTH}px`,
                maxWidth: `${LEVEL_VALUE_WIDTH}px`,
              }}
            >
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
                  style={{
                    width: "100%",
                    height: "34px",
                    background: "#05070b",
                    color: "#fff",
                    border: "1px solid rgba(255,196,74,0.18)",
                    padding: "0 8px",
                    fontSize: "20px",
                    fontWeight: 900,
                    outline: "none",
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(String(level));
                    setIsEditing(true);
                  }}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: 900,
                    lineHeight: 1,
                    cursor: "pointer",
                    padding: 0,
                    whiteSpace: "nowrap",
                    textAlign: "left",
                  }}
                >
                  Lv. {level}
                </button>
              )}
            </div>

            <div className="slider-area">
              <div className="slider-track-wrap">
                <input
                  className="level-range"
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
              </div>

              <div className="level-marks">
                {LEVEL_MARKS.map((mark, index) => {
                  const ratio = (mark - 1) / 89;

                  return (
                    <button
                      key={mark}
                      type="button"
                      onClick={() => {
                        setLevel(mark);
                        setInputValue(String(mark));
                      }}
                      style={{
                        position: "absolute",
                        left: `${ratio * 100}%`,
                        transform:
                          index === 0
                            ? "translateX(0)"
                            : index === LEVEL_MARKS.length - 1
                              ? "translateX(calc(-100% + 4px))"
                              : "translateX(-50%)",
                        background: "transparent",
                        border: "none",
                        color: mark === level ? "#ffd24a" : "#f3f4f6",
                        fontSize: "11px",
                        fontWeight: mark === level ? 800 : 600,
                        cursor: "pointer",
                        padding: 0,
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {mark}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
            <StatBar
              label="생명력"
              value={currentStats.hp}
              maxValue={BAR_MAX.hp}
              variant={getStatVariant("생명력")}
            />
            <StatBar
              label="공격력"
              value={currentStats.attack}
              maxValue={BAR_MAX.attack}
              variant={getStatVariant("공격력")}
            />
            <StatBar
              label="힘"
              value={currentStats.power ?? 0}
              maxValue={BAR_MAX.power}
              variant={getStatVariant("힘")}
            />
            <StatBar
              label="민첩"
              value={currentStats.agility ?? 0}
              maxValue={BAR_MAX.agility}
              variant={getStatVariant("민첩")}
            />
            <StatBar
              label="지능"
              value={currentStats.intelligence ?? 0}
              maxValue={BAR_MAX.intelligence}
              variant={getStatVariant("지능")}
            />
            <StatBar
              label="의지"
              value={currentStats.will ?? 0}
              maxValue={BAR_MAX.will}
              variant={getStatVariant("의지")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}