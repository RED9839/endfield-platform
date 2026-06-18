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
        <label className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">오퍼레이터 현재 레벨</label>
        <select
          value={operatorCurrentLevel}
          onChange={(e) => onChangeOperatorCurrent(Number(e.target.value))}
          className="h-11 w-full border border-ef-line bg-ef-card2 px-3 text-sm font-semibold text-ef-accent outline-none transition focus:border-ef-accent/50"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
        >
          {operatorCurrentOptions.map((level) => (
            <option key={level} value={level}>
              레벨 {level}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">오퍼레이터 목표 레벨</label>
        <select
          value={operatorTargetLevel}
          onChange={(e) => onChangeOperatorTarget(Number(e.target.value))}
          className="h-11 w-full border border-ef-line bg-ef-card2 px-3 text-sm font-semibold text-ef-accent outline-none transition focus:border-ef-accent/50"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
        >
          {operatorTargetOptions.map((level) => (
            <option key={level} value={level}>
              레벨 {level}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">무기 현재 레벨</label>
        <select
          value={weaponCurrentLevel}
          onChange={(e) => onChangeWeaponCurrent(toWeaponCurrentLevel(Number(e.target.value)))}
          className="h-11 w-full border border-ef-line bg-ef-card2 px-3 text-sm font-semibold text-ef-accent outline-none transition focus:border-ef-accent/50"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
        >
          {weaponCurrentOptions.map((level) => (
            <option key={level} value={level}>
              레벨 {level}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">무기 목표 레벨</label>
        <select
          value={weaponTargetLevel}
          onChange={(e) => onChangeWeaponTarget(toWeaponTargetLevel(Number(e.target.value)))}
          className="h-11 w-full border border-ef-line bg-ef-card2 px-3 text-sm font-semibold text-ef-accent outline-none transition focus:border-ef-accent/50"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
        >
          {weaponTargetOptions.map((level) => (
            <option key={level} value={level}>
              레벨 {level}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
