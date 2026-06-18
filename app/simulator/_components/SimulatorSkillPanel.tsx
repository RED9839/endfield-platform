"use client";

import Image from "next/image";

const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

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
    return <div className="text-sm text-ef-muted">등록된 전투 스킬 데이터가 없습니다.</div>;
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
            className="border border-ef-line bg-ef-card p-4"
            style={CUT_SM}
          >
            <div className="flex items-center gap-3">
              {meta.icon ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-ef-line bg-black" style={CUT_SM}>
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
                <div className="text-sm font-black text-ef-ink">
                  {meta.label || COMBAT_LABEL_MAP[meta.key]}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ef-muted">
                  현재 / 목표 레벨 선택
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">현재</span>
                <select
                  value={current}
                  onChange={(e) =>
                    onChangeCurrent(meta.key, e.target.value as SkillLevel)
                  }
                  className="h-11 border border-ef-line bg-ef-card2 px-3 text-sm text-ef-accent outline-none focus:border-ef-accent/50"
                  style={CUT_SM}
                >
                  {skillLevelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">목표</span>
                <select
                  value={target}
                  onChange={(e) =>
                    onChangeTarget(meta.key, e.target.value as SkillLevel)
                  }
                  className="h-11 border border-ef-line bg-ef-card2 px-3 text-sm text-ef-accent outline-none focus:border-ef-accent/50"
                  style={CUT_SM}
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