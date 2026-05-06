"use client";

import Image from "next/image";

type StageSectionItem = {
  id: number;
  title: string;
  icon?: string;
  currentStage: number;
  targetStage: number;
  maxStage: number;
  currentRightLabel?: string;
  targetRightLabel?: string;
  getStageLabel: (stage: number) => string;
  onChangeCurrent: (stage: number) => void;
  onChangeTarget: (stage: number) => void;
};

function StageSelect({
  value,
  options,
  getStageLabel,
  onChange,
}: {
  value: number;
  options: number[];
  getStageLabel: (stage: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-11 rounded-xl border border-yellow-500/15 bg-black px-3 text-sm text-yellow-300 outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {getStageLabel(option)}
        </option>
      ))}
    </select>
  );
}

export default function SimulatorStageSection({
  items,
  emptyText,
}: {
  items: StageSectionItem[];
  emptyText?: string;
}) {
  if (!items.length) {
    return (
      <div className="text-sm text-zinc-500">
        {emptyText ?? "등록된 데이터가 없습니다."}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const currentOptions = Array.from(
          { length: item.maxStage + 1 },
          (_, index) => index
        );
        const targetOptions = currentOptions.filter(
          (stage) => stage >= item.currentStage
        );

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-yellow-500/10 bg-[#090d14] p-4"
          >
            <div className="flex items-center gap-3">
              {item.icon ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-yellow-500/10 bg-black/40">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="min-w-0">
                <div className="truncate text-sm font-semibold" style={{ color: "#ffd24a" }}>
                  {item.title}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-yellow-300">
                    현재
                  </span>
                </div>

                <StageSelect
                  value={item.currentStage}
                  options={currentOptions}
                  getStageLabel={item.getStageLabel}
                  onChange={item.onChangeCurrent}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-yellow-300">
                    목표
                  </span>
                </div>

                <StageSelect
                  value={item.targetStage}
                  options={targetOptions}
                  getStageLabel={item.getStageLabel}
                  onChange={item.onChangeTarget}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}