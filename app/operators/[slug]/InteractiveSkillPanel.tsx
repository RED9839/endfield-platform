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
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <span className="text-base font-black text-yellow-200">{title}</span>
          {subtitle ? (
            <span className="ml-2 text-sm font-bold text-zinc-500">{subtitle}</span>
          ) : null}
        </div>
        <span className="text-2xl font-black text-yellow-200 transition-transform">
          {isOpen ? "⌃" : "⌄"}
        </span>
      </button>

      {isOpen ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function MaterialIcon({ src, alt, size = "normal" }: { src?: string; alt: string; size?: "normal" | "large" }) {
  const boxClass = size === "large" ? "h-12 w-12 sm:h-14 sm:w-14" : "h-7 w-7";

  if (!src) {
    return (
      <div className={`flex ${boxClass} shrink-0 items-center justify-center rounded-xl border border-yellow-500/10 bg-[#05070b] text-[8px] font-black text-zinc-500`}>
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
    <div className="flex min-w-[64px] flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.025] px-2 py-2">
      <MaterialIcon src={material.icon} alt={material.name} size="large" />
      <div className="text-sm font-black leading-none text-zinc-200">{material.count}</div>
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

function StatCard({ stat, icon }: { stat: SkillStat; icon?: string }) {
  const statElement = detectElementFromText(stat.label);
  const statColor = statElement ? getElementColor(statElement) : "#d8e0ec";

  return (
    <div className="grid min-w-0 grid-cols-[38px_minmax(0,1fr)] items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.025] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/35">
        {icon ? (
          <Image src={icon} alt="skill stat" fill sizes="36px" className="object-contain p-2" />
        ) : (
          <span className="text-xs font-black text-zinc-500">S</span>
        )}
      </div>
      <div className="min-w-0">
        <div className="break-keep text-[11px] font-black leading-snug" style={{ color: statColor }}>
          {renderHighlightedText(stat.label)}
        </div>
        <div className="mt-0.5 text-lg font-black leading-none text-yellow-200">{stat.value}</div>
      </div>
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

  const iconBorderColor = detectedElement ? getElementColor(detectedElement) : "rgba(255,196,74,0.34)";
  const iconGlowColor = detectedElement ? `${getElementColor(detectedElement)}55` : "rgba(255,196,74,0.22)";

  if (!current) return null;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b] shadow-[0_14px_34px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,210,74,0.10),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.004))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 bg-[repeating-linear-gradient(135deg,rgba(255,210,74,0.07)_0px,rgba(255,210,74,0.07)_2px,transparent_2px,transparent_8px)] opacity-25" />

      <div className="relative p-3 sm:p-4">
        <div className="grid min-w-0 grid-cols-[64px_minmax(0,1fr)] gap-3 sm:grid-cols-[78px_minmax(0,1fr)] sm:gap-4">
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border bg-[#0b0f16] sm:h-[78px] sm:w-[78px]"
            style={{ borderColor: iconBorderColor, boxShadow: `0 0 20px ${iconGlowColor}` }}
          >
            {skill.icon ? (
              <div className="relative h-14 w-14 sm:h-[68px] sm:w-[68px]">
                <Image src={skill.icon} alt={skill.name} fill sizes="68px" className="object-contain" />
              </div>
            ) : (
              <div className="text-xs font-black text-zinc-500">ICON</div>
            )}
          </div>

          <div className="min-w-0 self-center">
            <div className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-[11px] font-black text-yellow-200">
              {skill.typeLabel}
            </div>

            <h3 className="mt-2 break-keep text-[clamp(24px,4.6vw,38px)] font-black leading-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              {skill.name}
            </h3>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto overscroll-x-contain border-b border-yellow-500/20 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-2">
            {levels.map((level, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={`${skill.name}-${level.level}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={[
                    "relative flex h-10 min-w-12 items-center justify-center border px-3 text-sm font-black transition active:scale-[0.98]",
                    active
                      ? "border-yellow-300/90 bg-yellow-400/15 text-yellow-100 shadow-[0_0_18px_rgba(255,210,74,0.22)]"
                      : "border-white/15 bg-black/35 text-zinc-300 hover:border-yellow-300/40 hover:text-yellow-100",
                  ].join(" ")}
                  style={{
                    borderColor: active ? accentColor : undefined,
                    clipPath:
                      "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)",
                  }}
                >
                  {active ? (
                    <>
                      <span className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-0 border-b-[7px] border-x-transparent border-b-yellow-300" />
                      <span className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-0 border-t-[7px] border-x-transparent border-t-yellow-300" />
                    </>
                  ) : null}
                  {level.level}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="min-w-0 rounded-[18px] border border-white/10 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
            <div className="mb-4 flex items-center gap-2 text-base font-black text-yellow-200">
              <span className="h-4 w-0.5 rounded-full bg-yellow-300" />
              스킬 설명
            </div>
            <div className="break-keep text-sm font-semibold leading-[1.86] text-zinc-100 sm:text-[15px]">
              {renderHighlightedText(current.description)}
            </div>
          </div>

          {!!current.stats?.length && (
            <div className="grid min-w-0 auto-rows-min grid-cols-1 gap-2 sm:grid-cols-2">
              {current.stats.map((stat) => (
                <StatCard key={`${skill.name}-${current.level}-${stat.label}`} stat={stat} icon={skill.icon} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 grid gap-3 rounded-[18px] border border-white/10 bg-black/20 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,1fr)]">
          <div className="min-w-0">
            <div className="mb-3 text-base font-black text-yellow-200">
              강화 재료
              <span className="ml-2 text-sm font-bold text-zinc-500">현재 레벨 {current.level} 기준</span>
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
              <div className="rounded-2xl border border-yellow-500/10 bg-[#070a0f] px-3 py-3 text-sm font-bold text-zinc-500">
                현재 선택한 레벨의 강화 재료 데이터가 없습니다.
              </div>
            )}
          </div>

          <div className="min-w-0 border-white/10 pt-3 lg:border-l lg:pl-5 lg:pt-0">
            <FoldSection title="전체 강화 재료" subtitle="최대 M3 기준" defaultOpen>
              {totalMaterials.length ? (
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {totalMaterials.map((material) => (
                    <MaterialBadge key={material.name} material={material} />
                  ))}
                </div>
              ) : (
                <div className="text-sm font-bold text-zinc-500">재료 데이터 없음</div>
              )}
            </FoldSection>
          </div>
        </div>

        {!!skill.compareRows?.length && (
          <FoldSection title="레벨 비교" defaultOpen={false}>
            <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 bg-black/20">
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

        <FoldSection title="레벨별 강화 재료" defaultOpen={false}>
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
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
