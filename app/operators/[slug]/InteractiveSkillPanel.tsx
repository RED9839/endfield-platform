"use client";

import Image from "next/image";
import { Fragment, useMemo, useState, type ReactNode } from "react";

const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

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

type AggregatedMaterial = {
  name: string;
  icon?: string;
  count: string | number;
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

function aggregateMaterials(upgradeMaterialList: SkillUpgradeMaterial[]) {
  const materialMap = new Map<string, AggregatedMaterial>();

  upgradeMaterialList.forEach((upgrade) => {
    upgrade.materials.forEach((material) => {
      const key = material.name;
      const prev = materialMap.get(key);
      const prevCount = Number(prev?.count ?? 0);
      const nextCount = Number(material.count);
      const count = Number.isFinite(prevCount) && Number.isFinite(nextCount)
        ? prevCount + nextCount
        : material.count;

      materialMap.set(key, {
        name: material.name,
        icon: prev?.icon ?? material.icon,
        count,
      });
    });
  });

  return Array.from(materialMap.values());
}

function FoldSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-4 min-w-0 overflow-hidden border border-ef-line bg-ef-card2" style={CUT}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-[58px] w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/[0.04]"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-4 w-1 shrink-0" style={{ background: PRIMARY }} />
          <span className="font-mono text-sm font-black uppercase tracking-[0.16em] text-white">{title}</span>
          {subtitle ? (
            <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">{subtitle}</span>
          ) : null}
        </div>
        <span className="text-xl font-black text-ef-muted">{isOpen ? "⌃" : "⌄"}</span>
      </button>

      {isOpen ? <div className="border-t border-ef-line p-3">{children}</div> : null}
    </div>
  );
}

function MaterialIcon({ src, alt, size = "normal" }: { src?: string; alt: string; size?: "normal" | "large" }) {
  const boxClass = size === "large" ? "h-12 w-12 sm:h-14 sm:w-14" : "h-7 w-7";

  if (!src) {
    return (
      <div className={`flex ${boxClass} shrink-0 items-center justify-center border border-ef-line bg-black text-[8px] font-black text-ef-muted`} style={CUT_SM}>
        I
      </div>
    );
  }

  return (
    <div className={`relative ${boxClass} shrink-0`}>
      <Image src={src} alt={alt} fill sizes={size === "large" ? "56px" : "28px"} className="object-contain" />
    </div>
  );
}

function MaterialBadge({ material }: { material: AggregatedMaterial }) {
  return (
    <div className="flex min-w-[64px] flex-col items-center gap-1.5 border border-ef-line bg-ef-card px-2 py-2" style={CUT_SM}>
      <MaterialIcon src={material.icon} alt={material.name} size="large" />
      <div className="font-mono text-sm font-black leading-none tabular-nums" style={{ color: ACCENT }}>{material.count}</div>
    </div>
  );
}

function UpgradeColumn({ item }: { item: SkillUpgradeMaterial }) {
  return (
    <div className="min-w-0 border border-ef-line bg-ef-card p-2.5" style={CUT}>
      <div className="mb-2 font-mono text-sm font-black" style={{ color: PRIMARY }}>{item.level}</div>

      {item.materials.length ? (
        <div className="grid gap-1.5">
          {item.materials.map((material, index) => (
            <div
              key={`${item.level}-${material.name}-${index}`}
              className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2 border border-ef-line bg-ef-card2 px-2 py-1.5"
              style={CUT_SM}
            >
              <MaterialIcon src={material.icon} alt={material.name} />
              <div className="min-w-0 break-keep text-xs font-bold leading-snug text-ef-ink">
                {material.name}
              </div>
              <div className="pl-1 font-mono text-xs font-black tabular-nums" style={{ color: ACCENT }}>
                {material.count}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs font-bold text-ef-muted">재료 데이터 없음</div>
      )}
    </div>
  );
}

function StatCard({ stat }: { stat: SkillStat }) {
  const statElement = detectElementFromText(stat.label);
  const statColor = statElement ? getElementColor(statElement) : "#d8e0ec";

  return (
    <div className="min-w-0 border border-ef-line bg-ef-card px-3 py-2.5" style={CUT_SM}>
      <div className="break-keep text-[11px] font-black leading-snug" style={{ color: statColor }}>
        {renderHighlightedText(stat.label)}
      </div>
      <div className="mt-1 font-mono text-lg font-black leading-none tabular-nums" style={{ color: ACCENT }}>{stat.value}</div>
    </div>
  );
}

export default function InteractiveSkillPanel({ skill }: Props) {
  const levels = useMemo(() => skill.levelValues ?? [], [skill.levelValues]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = levels[selectedIndex] ?? levels[0];

  const upgradeMaterialList = useMemo(
    () => skill.upgradeMaterials ?? skill.upgradeCosts ?? [],
    [skill.upgradeMaterials, skill.upgradeCosts]
  );

  const upgradeRows = useMemo(
    () => buildUpgradeRows(upgradeMaterialList),
    [upgradeMaterialList]
  );

  const totalMaterials = useMemo(
    () => aggregateMaterials(upgradeMaterialList),
    [upgradeMaterialList]
  );

  const currentUpgrade = useMemo(() => {
    return upgradeMaterialList.find((item) => item.level === current?.level) ?? null;
  }, [current?.level, upgradeMaterialList]);

  const detectedElement = useMemo(
    () => detectDamageElement(skill, current),
    [skill, current]
  );

  const iconBorderColor = detectedElement ? getElementColor(detectedElement) : "#202020";

  if (!current) return null;

  return (
    <section className="relative min-w-0 overflow-hidden border border-ef-line bg-ef-card2" style={CUT}>
      <div className="relative p-3 sm:p-4">
        <div className="grid min-w-0 grid-cols-[64px_minmax(0,1fr)] gap-3 sm:grid-cols-[78px_minmax(0,1fr)] sm:gap-4">
          <div
            className="relative flex h-16 w-16 items-center justify-center border bg-black sm:h-[78px] sm:w-[78px]"
            style={{ ...CUT_SM, borderColor: iconBorderColor }}
          >
            {skill.icon ? (
              <div className="relative h-14 w-14 sm:h-[68px] sm:w-[68px]">
                <Image src={skill.icon} alt={skill.name} fill sizes="68px" className="object-contain" />
              </div>
            ) : (
              <div className="text-xs font-black text-ef-muted">ICON</div>
            )}
          </div>

          <div className="min-w-0 self-center">
            <div className="inline-flex items-center border px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-wide" style={{ ...CUT_SM, borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}>
              {skill.typeLabel}
            </div>

            <h3 className="mt-2 break-keep text-[clamp(24px,4.6vw,38px)] font-black leading-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              {skill.name}
            </h3>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto overscroll-x-contain border-b border-ef-line pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-1.5">
            {levels.map((level, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={`${skill.name}-${level.level}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className="min-h-8 min-w-[44px] border px-3 font-mono text-xs font-black uppercase tracking-wide transition duration-150 active:scale-[0.98]"
                  style={active
                    ? { ...CUT_SM, borderColor: ACCENT, background: "rgba(255,210,74,0.2)", color: "#ffffff", boxShadow: "inset 0 -2px 0 0 #ff9a2f" }
                    : { ...CUT_SM, borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }}
                >
                  {level.level}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="min-w-0 border border-ef-line bg-ef-card p-4" style={CUT}>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-4 w-1 shrink-0" style={{ background: PRIMARY }} />
              <span className="font-mono text-sm font-black uppercase tracking-[0.16em] text-white">스킬 설명</span>
            </div>
            <div className="break-keep text-sm font-semibold leading-[1.86] text-ef-ink sm:text-[15px]">
              {renderHighlightedText(current.description)}
            </div>
          </div>

          {!!current.stats?.length && (
            <div className="grid min-w-0 auto-rows-min grid-cols-1 gap-2 sm:grid-cols-2">
              {current.stats.map((stat) => (
                <StatCard key={`${skill.name}-${current.level}-${stat.label}`} stat={stat} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 grid gap-3 border border-ef-line bg-ef-card p-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,1fr)]" style={CUT}>
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-4 w-1 shrink-0" style={{ background: PRIMARY }} />
              <span className="font-mono text-sm font-black uppercase tracking-[0.16em] text-white">강화 재료</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">현재 레벨 {current.level} 기준</span>
            </div>

            {currentUpgrade?.materials?.length ? (
              <div className="flex flex-wrap gap-3 sm:gap-5">
                {currentUpgrade.materials.map((material, index) => (
                  <MaterialBadge
                    key={`${current.level}-${material.name}-${index}`}
                    material={material}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-ef-line bg-ef-card2 px-3 py-3 text-sm font-bold text-ef-muted" style={CUT_SM}>
                현재 선택한 레벨의 강화 재료 데이터가 없습니다.
              </div>
            )}
          </div>

          <div className="min-w-0 border-ef-line pt-3 lg:border-l lg:pl-5 lg:pt-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-4 w-1 shrink-0" style={{ background: PRIMARY }} />
              <span className="font-mono text-sm font-black uppercase tracking-[0.16em] text-white">전체 강화 재료</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">최대 M3 기준</span>
            </div>
            {totalMaterials.length ? (
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {totalMaterials.map((material) => (
                  <MaterialBadge key={material.name} material={material} />
                ))}
              </div>
            ) : (
              <div className="text-sm font-bold text-ef-muted">재료 데이터 없음</div>
            )}
          </div>
        </div>

        {!!skill.compareRows?.length && (
          <FoldSection title="레벨 비교" defaultOpen={false}>
            <div className="max-w-full overflow-x-auto overscroll-x-contain border border-ef-line bg-ef-card" style={CUT_SM}>
              <table className="w-max min-w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 min-w-[130px] border-b border-ef-line bg-ef-card2 p-3 text-left font-mono text-xs font-black uppercase tracking-wide text-ef-muted">
                      항목
                    </th>
                    {levels.map((level) => (
                      <th
                        key={`${skill.name}-thead-${level.level}`}
                        className="min-w-[86px] border-b border-ef-line p-3 text-center font-mono text-xs font-black text-ef-muted"
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
                          className="sticky left-0 z-10 min-w-[130px] border-b border-ef-line bg-ef-card2 p-3 text-xs font-black sm:text-sm"
                          style={{ color: rowColor }}
                        >
                          {renderHighlightedText(row.label)}
                        </td>
                        {row.values.map((value, index) => (
                          <td
                            key={`${skill.name}-${row.label}-${index}`}
                            className="min-w-[86px] border-b border-ef-line p-3 text-center font-mono text-xs font-bold tabular-nums text-ef-ink sm:text-sm"
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

        <FoldSection title="레벨별 강화 재료" defaultOpen={false}>
          <div className="grid gap-3 border border-ef-line bg-ef-card p-3" style={CUT}>
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
              <div className="text-xs font-bold text-ef-muted">재료 데이터 없음</div>
            ) : null}
          </div>
        </FoldSection>
      </div>
    </section>
  );
}
