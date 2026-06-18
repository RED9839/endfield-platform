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
      className="h-11 border border-ef-line bg-ef-card px-3 text-sm font-semibold text-ef-accent outline-none transition focus:border-ef-accent/50"
      style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
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
        <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-accent-soft">
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
        <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-accent-soft">
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
