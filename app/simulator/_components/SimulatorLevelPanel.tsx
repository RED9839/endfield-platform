"use client";

import {
  type WeaponCurrentLevel,
  type WeaponTargetLevel,
  toWeaponCurrentLevel,
  toWeaponTargetLevel,
} from "../_lib/simulator-page-helpers";

type SimulatorLevelPanelProps = {
  operatorCurrentLevel: number;
  operatorTargetLevel: number;
  operatorCurrentOptions: readonly number[];
  operatorTargetOptions: readonly number[];
  weaponCurrentLevel: WeaponCurrentLevel;
  weaponTargetLevel: WeaponTargetLevel;
  weaponCurrentOptions: readonly WeaponCurrentLevel[];
  weaponTargetOptions: readonly WeaponTargetLevel[];
  onChangeOperatorCurrent: (value: number) => void;
  onChangeOperatorTarget: (value: number) => void;
  onChangeWeaponCurrent: (value: WeaponCurrentLevel) => void;
  onChangeWeaponTarget: (value: WeaponTargetLevel) => void;
};

export default function SimulatorLevelPanel({
  operatorCurrentLevel,
  operatorTargetLevel,
  operatorCurrentOptions,
  operatorTargetOptions,
  weaponCurrentLevel,
  weaponTargetLevel,
  weaponCurrentOptions,
  weaponTargetOptions,
  onChangeOperatorCurrent,
  onChangeOperatorTarget,
  onChangeWeaponCurrent,
  onChangeWeaponTarget,
}: SimulatorLevelPanelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm text-zinc-400">오퍼레이터 현재 레벨</label>
        <select
          value={operatorCurrentLevel}
          onChange={(e) => onChangeOperatorCurrent(Number(e.target.value))}
          className="h-12 w-full rounded-2xl border border-yellow-500/15 bg-black px-4 text-yellow-300 outline-none"
        >
          {operatorCurrentOptions.map((level) => (
            <option key={level} value={level}>
              Lv. {level}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-400">오퍼레이터 목표 레벨</label>
        <select
          value={operatorTargetLevel}
          onChange={(e) => onChangeOperatorTarget(Number(e.target.value))}
          className="h-12 w-full rounded-2xl border border-yellow-500/15 bg-black px-4 text-yellow-300 outline-none"
        >
          {operatorTargetOptions.map((level) => (
            <option key={level} value={level}>
              Lv. {level}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-400">무기 현재 레벨</label>
        <select
          value={weaponCurrentLevel}
          onChange={(e) => onChangeWeaponCurrent(toWeaponCurrentLevel(Number(e.target.value)))}
          className="h-12 w-full rounded-2xl border border-yellow-500/15 bg-black px-4 text-yellow-300 outline-none"
        >
          {weaponCurrentOptions.map((level) => (
            <option key={level} value={level}>
              Lv. {level}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-400">무기 목표 레벨</label>
        <select
          value={weaponTargetLevel}
          onChange={(e) => onChangeWeaponTarget(toWeaponTargetLevel(Number(e.target.value)))}
          className="h-12 w-full rounded-2xl border border-yellow-500/15 bg-black px-4 text-yellow-300 outline-none"
        >
          {weaponTargetOptions.map((level) => (
            <option key={level} value={level}>
              Lv. {level}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}