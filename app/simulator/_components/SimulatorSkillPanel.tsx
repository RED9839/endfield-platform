"use client";

import Image from "next/image";
const YELLOW_MAIN = "#ffd24a";

import {
  COMBAT_LABEL_MAP,
  type CombatSkillKey,
  type CombatSkillMeta,
  type CombatSkillState,
  type SkillLevel,
} from "../_lib/simulator-page-helpers";

export default function SimulatorSkillPanel({
  metas,
  state,
  skillLevelOptions,
  getAvailableTargetLevels,
  onChangeCurrent,
  onChangeTarget,
}: {
  metas: CombatSkillMeta[];
  state: CombatSkillState;
  skillLevelOptions: readonly SkillLevel[];
  getAvailableTargetLevels: (current: SkillLevel) => SkillLevel[];
  onChangeCurrent: (key: CombatSkillKey, value: SkillLevel) => void;
  onChangeTarget: (key: CombatSkillKey, value: SkillLevel) => void;
}) {
  if (!metas.length) {
    return <div className="text-sm text-zinc-500">등록된 전투 스킬 데이터가 없습니다.</div>;
  }

  return (
    <div className="grid gap-3">
      {metas.map((meta) => {
        const current = state[meta.key]?.current ?? "1";
        const target = state[meta.key]?.target ?? "M3";
        const targetOptions = getAvailableTargetLevels(current);

        return (
          <div
            key={meta.key}
            className="rounded-2xl border border-yellow-500/10 bg-[#090d14] p-4"
          >
            <div className="flex items-center gap-3">
              {meta.icon ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-yellow-500/10 bg-black/40">
                  <Image
                    src={meta.icon}
                    alt={meta.label || COMBAT_LABEL_MAP[meta.key]}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="min-w-0">
                <div className="text-sm font-semibold" style={{ color: YELLOW_MAIN }}>
                  {meta.label || COMBAT_LABEL_MAP[meta.key]}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  현재 / 목표 레벨 선택
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-zinc-400">현재</span>
                <select
                  value={current}
                  onChange={(e) =>
                    onChangeCurrent(meta.key, e.target.value as SkillLevel)
                  }
                  className="h-11 rounded-xl border border-yellow-500/15 bg-black px-3 text-sm text-yellow-300 outline-none"
                >
                  {skillLevelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold text-zinc-400">목표</span>
                <select
                  value={target}
                  onChange={(e) =>
                    onChangeTarget(meta.key, e.target.value as SkillLevel)
                  }
                  className="h-11 rounded-xl border border-yellow-500/15 bg-black px-3 text-sm text-yellow-300 outline-none"
                >
                  {targetOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}