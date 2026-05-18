"use client";

import { useMemo, useState } from "react";

type WeaponLevelStatRow = {
  level: number;
  attack: number;
};

type Props = {
  levelStats?: WeaponLevelStatRow[] | null;
};

const LEVEL_MARKS = [1, 20, 40, 60, 80, 90];

const BAR_MAX = {
  attack: 520,
};

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function StatBar({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) {
  const width = Math.max(4, Math.min(100, (value / maxValue) * 100));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(64px, 84px) minmax(40px, 64px) minmax(0, 1fr)",
        gap: "10px",
        alignItems: "center",
        padding: "6px 9px",
        minWidth: 0,
      }}
    >
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

      <div
        style={{
          color: YELLOW_TEXT,
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
            background: YELLOW_TEXT,
            borderRadius: "999px",
          }}
        />
      </div>
    </div>
  );
}

export default function WeaponLevelPanel({
  levelStats,
}: Props) {
  const safeStats = useMemo<WeaponLevelStatRow[]>(() => {
    if (!Array.isArray(levelStats)) return [];
    return [...levelStats]
      .filter(
        (row): row is WeaponLevelStatRow =>
          !!row && typeof row.level === "number" && typeof row.attack === "number"
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

  if (!currentStats) return null;

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

  return (
    <section
      style={{
        borderRadius: "20px",
        border: `1px solid ${YELLOW_BORDER}`,
        background: "#05070b",
        padding: "12px",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        .weapon-top-row {
          display: grid;
          grid-template-columns: 56px 120px minmax(0, 1fr);
          align-items: start;
          column-gap: 12px;
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
          height: 16px;
          margin-top: 7px;
        }

        .level-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 16px;
          background: transparent;
          outline: none;
          display: block;
        }

        .level-range::-webkit-slider-runnable-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 999px;
        }

        .level-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: ${YELLOW_TEXT};
          border: none;
          margin-top: -5px;
          cursor: pointer;
        }

        .level-range::-moz-range-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 999px;
          border: none;
        }

        .level-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: ${YELLOW_TEXT};
          border: none;
          cursor: pointer;
        }

        .level-marks {
          position: relative;
          margin-top: 8px;
          width: calc(100% - 16px);
          margin-left: 8px;
          height: 16px;
        }

        @media (max-width: 980px) {
          .weapon-top-row {
            grid-template-columns: 1fr;
            row-gap: 10px;
          }
        }
      `}</style>

      <div
        style={{
          color: YELLOW_TEXT,
          fontSize: "17px",
          fontWeight: 900,
          marginBottom: "10px",
        }}
      >
        레벨 능력치
      </div>

      <div
        style={{
          border: "1px solid rgba(255,196,74,0.12)",
          background: "#0a0d12",
          padding: "12px",
          borderRadius: "18px",
        }}
      >
        <div className="weapon-top-row">
          <div
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

          <div style={{ width: "120px", minWidth: "120px" }}>
            {isEditing ? (
              <input
                autoFocus
                value={inputValue}
                onChange={(e) =>
                  setInputValue(e.target.value.replace(/[^0-9]/g, ""))
                }
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
                  color: YELLOW_TEXT,
                  border: `1px solid ${YELLOW_BORDER}`,
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
                  color: YELLOW_TEXT,
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
                      color: mark === level ? YELLOW_TEXT : "#f3f4f6",
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
            label="기본 공격력"
            value={currentStats.attack}
            maxValue={BAR_MAX.attack}
          />
        </div>
      </div>
    </section>
  );
}