"use client";

import Image from "next/image";
import { Fragment, useMemo, useState, type ReactNode } from "react";

type SkillStat = {
  label: string;
  value: string | number;
};

type SkillLevelValue = {
  level: string;
  description: string;
  stats: SkillStat[];
};

type SkillCompareRow = {
  label: string;
  values: (string | number)[];
};

type SkillUpgradeMaterial = {
  level: string;
  materials: {
    name: string;
    icon?: string;
    count: string | number;
  }[];
};

type SkillMeta = {
  label: string;
  value?: string | number;
  valueRowLabel?: string;
};

type SkillDetail = {
  name: string;
  typeLabel: string;
  icon?: string;
  summary?: string;
  meta?: SkillMeta[];
  levelValues: SkillLevelValue[];
  compareRows: SkillCompareRow[];
  upgradeMaterials?: SkillUpgradeMaterial[];
  upgradeCosts?: SkillUpgradeMaterial[];
};

type Props = {
  skill: SkillDetail;
  accentColor: string;
};

const elementTextColorMap: Record<string, string> = {
  물리: "#cfd8e3",
  열기: "#ff7a59",
  냉기: "#63b3ff",
  냉정: "#63b3ff",
  자연: "#7ddc6d",
  전기: "#FBCB38",
};

const elementKeywordMap: Record<string, string[]> = {
  물리: ["물리 피해", "물리 부착"],
  열기: ["열기 피해", "열기 부착"],
  냉기: ["냉기 피해", "냉기 부착"],
  냉정: ["냉정 피해", "냉정 부착"],
  자연: ["자연 피해", "자연 부착"],
  전기: ["전기 피해", "전기 부착"],
};

const elementOrder = ["물리", "열기", "냉기", "냉정", "자연", "전기"] as const;

function getElementColor(element: string) {
  return elementTextColorMap[element] ?? "#f3f4f6";
}

function detectDamageElement(skill: SkillDetail, current?: SkillLevelValue) {
  const texts = [
    current?.description ?? "",
    skill.summary ?? "",
    ...(current?.stats?.map((stat) => stat.label) ?? []),
  ];

  for (const text of texts) {
    for (const element of elementOrder) {
      const keywords = elementKeywordMap[element];
      if (keywords.some((keyword) => keyword.includes("피해") && text.includes(keyword))) {
        return element;
      }
    }
  }

  for (const text of texts) {
    for (const element of elementOrder) {
      const keywords = elementKeywordMap[element];
      if (keywords.some((keyword) => text.includes(keyword))) return element;
    }
  }

  for (const text of texts) {
    for (const element of elementOrder) {
      if (text.includes(element)) return element;
    }
  }

  return null;
}

function detectElementFromText(text: string) {
  for (const element of elementOrder) {
    const keywords = elementKeywordMap[element];
    if (keywords.some((keyword) => text.includes(keyword))) return element;
  }

  for (const element of elementOrder) {
    if (text.includes(element)) return element;
  }

  return null;
}

function formatSkillDescription(text: string) {
  return text
    .replace(/\s*(일반 공격:)/g, "\n$1")
    .replace(/\s*(낙하 공격:)/g, "\n$1")
    .replace(/\s*(처형 공격:)/g, "\n$1")
    .replace(/\s*(강공격:)/g, "\n$1")
    .replace(/\s*(연계 공격:)/g, "\n$1")
    .replace(/\s*(메인 컨트롤 오퍼레이터라면)/g, "\n$1")
    .trim();
}

function getHighlightTargets(text: string) {
  const matches: { start: number; end: number; color: string }[] = [];

  for (const element of elementOrder) {
    const color = getElementColor(element);
    for (const keyword of elementKeywordMap[element]) {
      let searchIndex = 0;
      while (searchIndex < text.length) {
        const foundIndex = text.indexOf(keyword, searchIndex);
        if (foundIndex === -1) break;
        matches.push({ start: foundIndex, end: foundIndex + keyword.length, color });
        searchIndex = foundIndex + keyword.length;
      }
    }
  }

  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  const filtered: { start: number; end: number; color: string }[] = [];
  for (const match of matches) {
    const overlaps = filtered.some(
      (item) => !(match.end <= item.start || match.start >= item.end)
    );
    if (!overlaps) filtered.push(match);
  }

  return filtered;
}

function renderHighlightedText(text: string) {
  const lines = formatSkillDescription(text).split("\n");

  return lines.map((line, lineIndex) => {
    const targets = getHighlightTargets(line);

    if (!targets.length) {
      return (
        <Fragment key={`line-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 ? <br /> : null}
        </Fragment>
      );
    }

    const pieces: ReactNode[] = [];
    let cursor = 0;

    targets.forEach((target, index) => {
      if (cursor < target.start) {
        pieces.push(
          <Fragment key={`plain-${lineIndex}-${index}`}>
            {line.slice(cursor, target.start)}
          </Fragment>
        );
      }

      pieces.push(
        <span
          key={`hl-${lineIndex}-${index}`}
          style={{ color: target.color }}
          className="font-black"
        >
          {line.slice(target.start, target.end)}
        </span>
      );

      cursor = target.end;
    });

    if (cursor < line.length) {
      pieces.push(
        <Fragment key={`tail-${lineIndex}`}>{line.slice(cursor)}</Fragment>
      );
    }

    return (
      <Fragment key={`line-${lineIndex}`}>
        {pieces}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </Fragment>
    );
  });
}

function findCompareRowValue(compareRows: SkillCompareRow[], label: string, index: number) {
  const row = compareRows.find((item) => item.label === label);
  return row?.values[index];
}

function formatMetaValue(value: string | number) {
  if (typeof value === "number") return value;
  if (/^\d+(?:\.\d+)?s$/i.test(value)) return `${value.slice(0, -1)}초`;
  return value;
}

function resolveMetaItems(skill: SkillDetail, selectedIndex: number) {
  const rawMeta = skill.meta ?? [];

  return rawMeta
    .map((item) => {
      const resolvedValue =
        item.valueRowLabel != null
          ? findCompareRowValue(skill.compareRows, item.valueRowLabel, selectedIndex)
          : item.value;

      if (resolvedValue === undefined || resolvedValue === null || resolvedValue === "") return null;
      return { label: item.label, value: formatMetaValue(resolvedValue) };
    })
    .filter((item): item is { label: string; value: string | number } => item !== null);
}

function isNormalAttackSkill(skill: SkillDetail) {
  return skill.typeLabel.includes("일반 공격") || skill.name.includes("일반 공격");
}

function buildUpgradeRows(upgradeMaterialList: SkillUpgradeMaterial[]) {
  const normalOrder = ["2", "3", "4", "5", "6", "7", "8", "9"];
  const masteryOrder = ["M1", "M2", "M3"];

  return {
    normal: normalOrder
      .map((level) => upgradeMaterialList.find((item) => item.level === level))
      .filter((item): item is SkillUpgradeMaterial => !!item),
    mastery: masteryOrder
      .map((level) => upgradeMaterialList.find((item) => item.level === level))
      .filter((item): item is SkillUpgradeMaterial => !!item),
  };
}

function FoldSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-3 overflow-hidden rounded-[18px] border border-yellow-500/10 bg-[#070a0f]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs font-black tracking-[0.12em] text-zinc-300 transition hover:bg-yellow-400/5"
      >
        <span>{title}</span>
        <span className="text-base text-yellow-200">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? <div className="border-t border-yellow-500/10">{children}</div> : null}
    </div>
  );
}

function MaterialIcon({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-yellow-500/10 bg-[#05070b] text-[8px] font-black text-zinc-500">
        I
      </div>
    );
  }

  return (
    <div className="relative h-7 w-7 shrink-0">
      <Image src={src} alt={alt} fill sizes="28px" className="object-contain" />
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="inline-flex min-h-7 items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-[11px] font-bold text-zinc-100">
      <span className="text-zinc-400">{label}</span>
      <span className="font-black text-yellow-200">{value}</span>
    </div>
  );
}

function UpgradeColumn({ item }: { item: SkillUpgradeMaterial }) {
  return (
    <div className="min-w-0 rounded-[18px] border border-yellow-500/10 bg-[#0b0f16] p-2.5">
      <div className="mb-2 text-sm font-black text-yellow-200">{item.level}</div>

      {item.materials.length ? (
        <div className="grid gap-1.5">
          {item.materials.map((material, index) => (
            <div
              key={`${item.level}-${material.name}-${index}`}
              className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-yellow-500/10 bg-black/35 px-2 py-1.5"
            >
              <MaterialIcon src={material.icon} alt={material.name} />
              <div className="min-w-0 break-keep text-xs font-bold leading-snug text-zinc-200">
                {material.name}
              </div>
              <div className="pl-1 text-xs font-black text-yellow-200">
                {material.count}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs font-bold text-zinc-500">재료 데이터 없음</div>
      )}
    </div>
  );
}

export default function InteractiveSkillPanel({ skill, accentColor }: Props) {
  const levels = useMemo(() => skill.levelValues ?? [], [skill.levelValues]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = levels[selectedIndex] ?? levels[0];

  const upgradeMaterialList = useMemo(
    () => skill.upgradeMaterials ?? skill.upgradeCosts ?? [],
    [skill.upgradeMaterials, skill.upgradeCosts]
  );

  const visibleMetaItems = useMemo(() => {
    if (isNormalAttackSkill(skill)) return [];
    return resolveMetaItems(skill, selectedIndex);
  }, [skill, selectedIndex]);

  const upgradeRows = useMemo(
    () => buildUpgradeRows(upgradeMaterialList),
    [upgradeMaterialList]
  );

  const detectedElement = useMemo(
    () => detectDamageElement(skill, current),
    [skill, current]
  );

  const iconBorderColor = detectedElement ? getElementColor(detectedElement) : "rgba(255,196,74,0.28)";
  const iconGlowColor = detectedElement ? `${getElementColor(detectedElement)}55` : "rgba(255,196,74,0.22)";

  if (!current) return null;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b] shadow-[0_14px_34px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(255,210,74,0.10),transparent_28%)]" />

      <div className="relative p-3 sm:p-4">
        <div className="grid min-w-0 grid-cols-[64px_minmax(0,1fr)] gap-3 sm:grid-cols-[72px_minmax(0,1fr)]">
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border bg-[#0b0f16] sm:h-[72px] sm:w-[72px]"
            style={{ borderColor: iconBorderColor, boxShadow: `0 0 20px ${iconGlowColor}` }}
          >
            {skill.icon ? (
              <div className="relative h-14 w-14 sm:h-16 sm:w-16">
                <Image src={skill.icon} alt={skill.name} fill sizes="64px" className="object-contain" />
              </div>
            ) : (
              <div className="text-xs font-black text-zinc-500">ICON</div>
            )}
          </div>

          <div className="min-w-0 self-center">
            <div className="text-[10px] font-black tracking-[0.22em] text-zinc-500">
              {skill.typeLabel}
            </div>

            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="break-keep text-[clamp(22px,5vw,34px)] font-black leading-tight text-yellow-100">
                {skill.name}
              </h3>

              {visibleMetaItems.map((item) => (
                <MetaChip key={`${skill.name}-${item.label}`} label={item.label} value={item.value} />
              ))}
            </div>

            {!!skill.summary && (
              <p className="mt-1 line-clamp-1 text-xs font-medium leading-relaxed text-zinc-500 sm:line-clamp-2">
                {skill.summary}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-1.5">
            {levels.map((level, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={`${skill.name}-${level.level}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={[
                    "min-h-8 min-w-[48px] rounded-full border px-2.5 text-xs font-black transition active:scale-[0.98]",
                    active
                      ? "border-yellow-300/70 bg-yellow-400/15 text-white shadow-[0_0_14px_rgba(255,210,74,0.12)]"
                      : "border-yellow-500/15 bg-black/45 text-zinc-400 hover:border-yellow-300/40 hover:text-yellow-100",
                  ].join(" ")}
                  style={active ? { borderColor: accentColor } : undefined}
                >
                  {level.level}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.22fr)]">
          <div className="min-w-0 rounded-[18px] border border-yellow-500/10 bg-[#080b10] p-3">
            <div className="mb-2 text-[10px] font-black tracking-[0.18em] text-zinc-500">
              DESCRIPTION
            </div>
            <div className="break-keep text-sm font-semibold leading-[1.75] text-zinc-100">
              {renderHighlightedText(current.description)}
            </div>
          </div>

          {!!current.stats?.length && (
            <div className="grid min-w-0 auto-rows-min grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {current.stats.map((stat) => {
                const statElement = detectElementFromText(stat.label);
                const statColor = statElement ? getElementColor(statElement) : "#9fb3c8";

                return (
                  <div
                    key={`${skill.name}-${current.level}-${stat.label}`}
                    className="min-w-0 rounded-[18px] border border-yellow-500/10 bg-[#0b0f16] px-3 py-2.5"
                  >
                    <div
                      className="mb-0.5 break-keep text-[11px] font-black leading-snug"
                      style={{ color: statColor }}
                    >
                      {renderHighlightedText(stat.label)}
                    </div>
                    <div className="text-lg font-black leading-tight text-yellow-200">
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!!skill.compareRows?.length && (
          <FoldSection title="레벨 비교" defaultOpen={false}>
            <div className="max-w-full overflow-x-auto overscroll-x-contain">
              <table className="w-max min-w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 min-w-[130px] border-b border-yellow-500/10 bg-[#0a0d12] p-3 text-left text-xs font-black text-zinc-400">
                      항목
                    </th>
                    {levels.map((level) => (
                      <th
                        key={`${skill.name}-thead-${level.level}`}
                        className="min-w-[86px] border-b border-yellow-500/10 p-3 text-center text-xs font-black text-zinc-400"
                      >
                        {level.level}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {skill.compareRows.map((row) => {
                    const rowElement = detectElementFromText(row.label);
                    const rowColor = rowElement ? getElementColor(rowElement) : "#e5e7eb";

                    return (
                      <tr key={`${skill.name}-${row.label}`}>
                        <td
                          className="sticky left-0 z-10 min-w-[130px] border-b border-yellow-500/10 bg-[#0a0d12] p-3 text-xs font-black sm:text-sm"
                          style={{ color: rowColor }}
                        >
                          {renderHighlightedText(row.label)}
                        </td>
                        {row.values.map((value, index) => (
                          <td
                            key={`${skill.name}-${row.label}-${index}`}
                            className="min-w-[86px] border-b border-yellow-500/10 p-3 text-center text-xs font-bold text-zinc-300 sm:text-sm"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FoldSection>
        )}

        <FoldSection title="업그레이드 재료" defaultOpen={false}>
          <div className="grid gap-3 p-3">
            {!!upgradeRows.normal.length && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {upgradeRows.normal.map((item) => (
                  <UpgradeColumn key={item.level} item={item} />
                ))}
              </div>
            )}

            {!!upgradeRows.mastery.length && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {upgradeRows.mastery.map((item) => (
                  <UpgradeColumn key={item.level} item={item} />
                ))}
              </div>
            )}

            {!upgradeRows.normal.length && !upgradeRows.mastery.length ? (
              <div className="text-xs font-bold text-zinc-500">재료 데이터 없음</div>
            ) : null}
          </div>
        </FoldSection>
      </div>
    </section>
  );
}
