"use client";

import { useMemo, useState } from "react";
import WeaponSkillAtlasPanel, { type WeaponSkillDetail } from "./WeaponSkillAtlasPanel";

type WeaponLevelStatRow = {
  level: number;
  attack: number;
};

type Props = {
  levelStats?: WeaponLevelStatRow[] | null;
  skills?: WeaponSkillDetail[];
};

const LEVEL_MARKS = [1, 20, 40, 60, 80, 90];
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

export default function WeaponLevelPanel({ levelStats, skills = [] }: Props) {
  const safeStats = useMemo<WeaponLevelStatRow[]>((() => {
    if (!Array.isArray(levelStats)) return [];

    return [...levelStats]
      .filter(
        (row): row is WeaponLevelStatRow =>
          !!row && typeof row.level === "number" && typeof row.attack === "number",
      )
      .sort((a, b) => a.level - b.level);
  }), [levelStats]);

  const selectableLevels = useMemo(() => {
    const existing = new Set(safeStats.map((row) => row.level));
    const marks = LEVEL_MARKS.filter((level) => existing.has(level));
    return marks.length ? marks : safeStats.map((row) => row.level).slice(0, 6);
  }, [safeStats]);

  const initialLevel = selectableLevels[0] ?? safeStats[0]?.level ?? 1;
  const [level, setLevel] = useState(initialLevel);

  const currentStats = useMemo(() => {
    return (
      safeStats.find((row) => row.level === level) ??
      safeStats.find((row) => row.level === initialLevel) ??
      safeStats[0] ??
      null
    );
  }, [initialLevel, level, safeStats]);

  if (!currentStats) return null;

  return (
    <section className="overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_14px_34px_rgba(0,0,0,0.24)] lg:rounded-[26px]">
      <div className="border-b border-yellow-500/10 px-4 py-4 lg:px-5 lg:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.24em] text-zinc-500">
              CURRENT LEVEL
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-5xl font-black leading-none text-white">
                Lv. {currentStats.level}
              </span>
              <span className="pb-1 text-sm font-black text-zinc-500">/ 90</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:min-w-[720px]">
            {selectableLevels.map((mark) => {
              const active = currentStats.level === mark;

              return (
                <button
                  key={mark}
                  type="button"
                  onClick={() => setLevel(mark)}
                  className={[
                    "h-11 rounded-xl border px-3 text-sm font-black transition",
                    active
                      ? "border-yellow-300/70 bg-yellow-400/20 text-yellow-100 shadow-[inset_0_0_0_1px_rgba(255,210,74,0.10)]"
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
        <div className="rounded-[20px] border border-yellow-500/10 bg-[#071019]/80 p-3 lg:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-base font-black" style={{ color: YELLOW_TEXT }}>
              능력치 정보
            </p>
            <p className="text-[10px] font-bold text-yellow-200/70">
              LEVEL {currentStats.level}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="text-[10px] font-black tracking-[0.12em] text-zinc-500">
                기본 공격력
              </p>
              <p className="mt-2 text-2xl font-black" style={{ color: YELLOW_TEXT }}>
                {currentStats.attack}
              </p>
            </div>
          </div>
        </div>

        {!!skills.length && (
          <div className="mt-5 rounded-[20px] border border-yellow-500/10 bg-[#071019]/60 p-3 lg:p-4">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-base font-black" style={{ color: YELLOW_TEXT }}>
                  무기 스킬
                </p>
                <p className="mt-1 text-xs font-bold text-zinc-500">
                  무기 능력치, 속성, 시리즈 스킬을 함께 확인합니다.
                </p>
              </div>
              <p className="text-[10px] font-bold text-yellow-200/70">
                {skills.length} SKILLS
              </p>
            </div>

            <div className="grid gap-3 lg:gap-4">
              {skills.map((skill) => (
                <WeaponSkillAtlasPanel
                  key={skill.key}
                  accentColor={YELLOW_TEXT}
                  skill={skill}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
