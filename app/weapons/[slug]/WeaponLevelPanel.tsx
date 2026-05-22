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
    <div className="rounded-2xl border border-yellow-500/10 bg-black/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-black text-zinc-300">{label}</span>
        <span className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#1a2230]">
        <div
          className="h-full rounded-full"
          style={{ width: `${width}%`, background: YELLOW_TEXT }}
        />
      </div>
    </div>
  );
}

export default function WeaponLevelPanel({ levelStats }: Props) {
  const safeStats = useMemo<WeaponLevelStatRow[]>(() => {
    if (!Array.isArray(levelStats)) return [];
    return [...levelStats]
      .filter(
        (row): row is WeaponLevelStatRow =>
          !!row && typeof row.level === "number" && typeof row.attack === "number",
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
      className="overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b]/95 p-3 shadow-[0_14px_34px_rgba(0,0,0,0.24)] lg:rounded-[26px] lg:p-4"
    >
      <style jsx>{`
        .level-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 18px;
          background: transparent;
          outline: none;
          display: block;
        }

        .level-range::-webkit-slider-runnable-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.32);
          border-radius: 999px;
        }

        .level-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: ${YELLOW_TEXT};
          border: 2px solid #05070b;
          margin-top: -6px;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(255, 220, 112, 0.16);
        }

        .level-range::-moz-range-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.32);
          border-radius: 999px;
          border: none;
        }

        .level-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: ${YELLOW_TEXT};
          border: 2px solid #05070b;
          cursor: pointer;
        }
      `}</style>

      <div className="rounded-[20px] border border-yellow-500/10 bg-[#071019]/80 p-3 lg:p-4">
        <div className="grid gap-3 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">
              현재 레벨
            </p>

            {isEditing ? (
              <input
                autoFocus
                value={inputValue}
                onChange={(event) =>
                  setInputValue(event.target.value.replace(/[^0-9]/g, ""))
                }
                onBlur={commitInputLevel}
                onKeyDown={(event) => {
                  if (event.key === "Enter") commitInputLevel();
                  if (event.key === "Escape") {
                    setInputValue(String(level));
                    setIsEditing(false);
                  }
                }}
                className="mt-2 h-11 w-full rounded-2xl border border-yellow-500/15 bg-black/60 px-3 text-2xl font-black outline-none"
                style={{ color: YELLOW_TEXT }}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setInputValue(String(level));
                  setIsEditing(true);
                }}
                className="mt-2 rounded-2xl border border-yellow-500/10 bg-black/45 px-4 py-3 text-left text-3xl font-black leading-none transition hover:border-yellow-400/30 hover:bg-yellow-400/10"
                style={{ color: YELLOW_TEXT }}
              >
                Lv. {level}
              </button>
            )}
          </div>

          <div className="min-w-0">
            <input
              className="level-range"
              type="range"
              min={1}
              max={90}
              step={1}
              value={level}
              onChange={(event) => {
                const nextLevel = Number(event.target.value);
                setLevel(nextLevel);
                setInputValue(String(nextLevel));
              }}
            />

            <div className="relative mt-2 ml-2 h-5 w-[calc(100%-16px)]">
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
                    className="absolute top-0 text-[11px] font-black leading-none transition hover:text-yellow-200"
                    style={{
                      left: `${ratio * 100}%`,
                      transform:
                        index === 0
                          ? "translateX(0)"
                          : index === LEVEL_MARKS.length - 1
                            ? "translateX(calc(-100% + 4px))"
                            : "translateX(-50%)",
                      color: mark === level ? YELLOW_TEXT : "#a1a1aa",
                    }}
                  >
                    {mark}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
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
