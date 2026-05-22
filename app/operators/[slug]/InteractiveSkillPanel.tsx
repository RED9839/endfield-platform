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

function MaterialIcon({ src, alt, size = "normal" }: { src?: string; alt: string; size?: "normal" | "large" }) {
  const boxClass = size === "large" ? "h-14 w-14 sm:h-16 sm:w-16" : "h-7 w-7";

  if (!src) {
    return (
      <div className={`flex ${boxClass} shrink-0 items-center justify-center rounded-xl border border-yellow-500/10 bg-[#05070b] text-[8px] font-black text-zinc-500`}>
        I
      </div>
    );
  }

  return (
    <div className={`relative ${boxClass} shrink-0`}>
      <Image src={src} alt={alt} fill sizes={size === "large" ? "64px" : "28px"} className="object-contain" />
    </div>
  );
}

function MetaLine({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-[92px]">
      <div className="text-[11px] font-black text-zinc-500">{label}</div>
      <div className="mt-0.5 text-sm font-black text-zinc-200">{value}</div>
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
    <div className="grid min-w-0 grid-cols-[42px_minmax(0,1fr)] items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.025] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/35">
        {icon ? (
          <Image src={icon} alt="skill stat" fill sizes="40px" className="object-contain p-2" />
        ) : (
          <span className="text-xs font-black text-zinc-500">S</span>
        )}
      </div>
      <div className="min-w-0">
        <div className="break-keep text-xs font-black leading-snug" style={{ color: statColor }}>
          {renderHighlightedText(stat.label)}
        </div>
        <div className="mt-1 text-xl font-black leading-none text-yellow-200">{stat.value}</div>
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

  const visibleMetaItems = useMemo(() => {
    if (isNormalAttackSkill(skill)) return [];
    return resolveMetaItems(skill, selectedIndex);
  }, [skill, selectedIndex]);

  const upgradeRows = useMemo(
    () => buildUpgradeRows(upgradeMaterialList),
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
    <section className="relative min-w-0 overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#05070b] shadow-[0_18px_44px_rgba(0,0,0,0.34)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,210,74,0.11),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-[repeating-linear-gradient(135deg,rgba(255,210,74,0.08)_0px,rgba(255,210,74,0.08)_2px,transparent_2px,transparent_8px)] opacity-25" />

      <div className="relative p-3 sm:p-4 lg:p-5">
        <div className="grid min-w-0 grid-cols-[72px_minmax(0,1fr)] gap-3 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-4">
          <div
            className="relative flex h-[72px] w-[72px] items-center justify-center rounded-[22px] border bg-[#0b0f16] sm:h-[88px] sm:w-[88px]"
            style={{ borderColor: iconBorderColor, boxShadow: `0 0 22px ${iconGlowColor}` }}
          >
            {skill.icon ? (
              <div className="relative h-16 w-16 sm:h-[78px] sm:w-[78px]">
                <Image src={skill.icon} alt={skill.name} fill sizes="78px" className="object-contain" />
              </div>
            ) : (
              <div className="text-xs font-black text-zinc-500">ICON</div>
            )}
          </div>

          <div className="min-w-0 self-center">
            <div className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-[11px] font-black text-yellow-200">
              {skill.typeLabel}
            </div>

            <h3 className="mt-2 break-keep text-[clamp(26px,5vw,42px)] font-black leading-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              {skill.name}
            </h3>

            <div className="mt-3 flex min-w-0 flex-wrap gap-x-8 gap-y-2">
              {visibleMetaItems.length ? (
                visibleMetaItems.map((item) => (
                  <MetaLine key={`${skill.name}-${item.label}`} label={item.label} value={item.value} />
                ))
              ) : (
                <>
                  <MetaLine label="공격 타입" value={detectedElement ?? "물리"} />
                  <MetaLine label="공격 범위" value="단일" />
                  <MetaLine label="재사용 대기" value="-" />
                  <MetaLine label="원소 타입" value={detectedElement ?? "-"} />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto overscroll-x-contain border-b border-yellow-500/20 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {levels.map((level, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={`${skill.name}-${level.level}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={[
                    "min-h-9 min-w-[58px] rounded-full border px-3 text-sm font-black transition active:scale-[0.98]",
                    active
                      ? "border-yellow-300/80 bg-yellow-400/20 text-yellow-100 shadow-[0_0_16px_rgba(255,210,74,0.16)]"
                      : "border-yellow-500/15 bg-black/45 text-zinc-300 hover:border-yellow-300/40 hover:text-yellow-100",
                  ].join(" ")}
                  style={active ? { borderColor: accentColor } : undefined}
                >
                  {level.level}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)]">
          <div className="min-w-0 rounded-[18px] border border-white/10 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
            <div className="mb-4 flex items-center gap-2 text-base font-black text-yellow-200">
              <span className="h-4 w-0.5 rounded-full bg-yellow-300" />
              스킬 설명
            </div>
            <div className="break-keep text-sm font-semibold leading-[1.95] text-zinc-100 sm:text-base">
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

        <div className="mt-3 grid gap-3 rounded-[18px] border border-white/10 bg-black/20 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)]">
          <div className="min-w-0">
            <div className="mb-3 text-base font-black text-yellow-200">강화 재료</div>
            {currentUpgrade?.materials?.length ? (
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {currentUpgrade.materials.map((material, index) => (
                  <div key={`${current.level}-${material.name}-${index}`} className="flex min-w-[70px] flex-col items-center gap-2">
                    <MaterialIcon src={material.icon} alt={material.name} size="large" />
                    <div className="text-sm font-black text-zinc-200">{material.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-yellow-500/10 bg-[#070a0f] px-3 py-3 text-sm font-bold text-zinc-500">
                현재 선택한 레벨의 강화 재료 데이터가 없습니다.
              </div>
            )}
          </div>

          <div className="min-w-0 border-white/10 pt-3 lg:border-l lg:pl-5 lg:pt-0">
            <div className="mb-3 text-base font-black text-yellow-200">스킬 안내</div>
            <div className="space-y-2 text-sm font-semibold leading-relaxed text-zinc-400">
              <p>· 오퍼레이터 레벨과 스킬 레벨이 함께 상승합니다.</p>
              <p>· 최대 레벨 도달 시 추가 강화가 가능합니다.</p>
            </div>
          </div>
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

        <FoldSection title="전체 강화 재료" defaultOpen={false}>
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
