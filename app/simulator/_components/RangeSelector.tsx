function RangeSelect({
  value,
  options,
  getLabel,
  onChange,
}: {
  value: number;
  options: number[];
  getLabel: (stage: number) => string;
  onChange: (stage: number) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-11 rounded-xl border border-yellow-500/15 bg-black px-3 text-sm font-semibold text-yellow-300 outline-none transition focus:border-yellow-400/50"
    >
      {options.map((stage) => (
        <option key={stage} value={stage}>
          {getLabel(stage)}
        </option>
      ))}
    </select>
  );
}

export default function RangeSelector({
  titleCurrent = "현재",
  titleTarget = "목표",
  current,
  target,
  stages,
  getLabel,
  onChangeCurrent,
  onChangeTarget,
}: {
  titleCurrent?: string;
  titleTarget?: string;
  current: number;
  target: number;
  stages: number[];
  getLabel: (stage: number) => string;
  onChangeCurrent: (stage: number) => void;
  onChangeTarget: (stage: number) => void;
}) {
  const targetStages = stages.filter((stage) => stage >= current);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="grid gap-2">
        <div className="text-xs font-semibold text-yellow-300">
          {titleCurrent}
        </div>
        <RangeSelect
          value={current}
          options={stages}
          getLabel={getLabel}
          onChange={onChangeCurrent}
        />
      </div>

      <div className="grid gap-2">
        <div className="text-xs font-semibold text-yellow-300">
          {titleTarget}
        </div>
        <RangeSelect
          value={target}
          options={targetStages}
          getLabel={getLabel}
          onChange={onChangeTarget}
        />
      </div>
    </div>
  );
}
