"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";

type SkillStat = {
  label: string;
  value: string | number;
};

type SkillLevelValue = {
  rank: string;
  description?: string;
  stats?: SkillStat[];
};

type SkillCompareRow = {
  label: string;
  values: (string | number)[];
};

type WeaponSkillMeta = {
  label: string;
  value: string | number;
};

export type WeaponSkillDetail = {
  key: string;
  typeLabel?: string;
  name: string;
  icon?: string;
  meta?: WeaponSkillMeta[];
  levelValues: SkillLevelValue[];
  compareRows?: SkillCompareRow[];
};

type Props = {
  skill: WeaponSkillDetail;
  accentColor?: string;
};

type TextHighlightMatch = {
  start: number;
  end: number;
  text: string;
};

const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectValueMatches(
  text: string,
  statValues: Array<string | number>
): TextHighlightMatch[] {
  if (!text || !statValues.length) return [];

  const targets = Array.from(
    new Set(
      statValues
        .map((value) => String(value).trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
    )
  );

  if (!targets.length) return [];

  const matches: TextHighlightMatch[] = [];

  for (const target of targets) {
    const regex = new RegExp(escapeRegExp(target), "g");

    for (const match of text.matchAll(regex)) {
      const start = match.index ?? 0;
      const value = match[0];

      matches.push({
        start,
        end: start + value.length,
        text: value,
      });
    }
  }

  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  const filtered: TextHighlightMatch[] = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  return filtered;
}

function highlightElementTerms(text: string): ReactNode {
  const colorMap: Array<{ pattern: RegExp; color: string }> = [
    { pattern: /물리 피해/g, color: "#cfd8e3" },
    { pattern: /열기 피해/g, color: "#ff7a59" },
    { pattern: /전기 피해/g, color: "#FBCB38" },
    { pattern: /냉기 피해/g, color: "#63b3ff" },
    { pattern: /자연 피해/g, color: "#7ddc6d" },
    { pattern: /물리/g, color: "#cfd8e3" },
    { pattern: /열기/g, color: "#ff7a59" },
    { pattern: /전기/g, color: "#FBCB38" },
    { pattern: /냉기/g, color: "#63b3ff" },
    { pattern: /자연/g, color: "#7ddc6d" },
    { pattern: /연소/g, color: "#ff7a59" },
    { pattern: /감전/g, color: "#FBCB38" },
    { pattern: /동결/g, color: "#63b3ff" },
    { pattern: /부식/g, color: "#7ddc6d" },
    { pattern: /띄우기/g, color: "#cfd8e3" },
    { pattern: /방어 불능/g, color: "#cfd8e3" },
  ];

  const matches: Array<{
    start: number;
    end: number;
    text: string;
    color: string;
  }> = [];

  colorMap.forEach(({ pattern, color }) => {
    for (const match of text.matchAll(pattern)) {
      const start = match.index ?? 0;
      const value = match[0];

      matches.push({
        start,
        end: start + value.length,
        text: value,
        color,
      });
    }
  });

  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  const filtered: typeof matches = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  if (!filtered.length) return text;

  const parts: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (match.start > cursor) {
      parts.push(
        <Fragment key={`plain-${index}-${cursor}`}>
          {text.slice(cursor, match.start)}
        </Fragment>
      );
    }

    parts.push(
      <span
        key={`hl-${index}-${match.start}`}
        style={{
          color: match.color,
          fontWeight: 800,
        }}
      >
        {match.text}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(
      <Fragment key={`tail-${cursor}`}>{text.slice(cursor)}</Fragment>
    );
  }

  return parts;
}

function renderHighlightedDescription(
  text: string,
  statValues: Array<string | number>
): ReactNode {
  const matches = collectValueMatches(text, statValues);

  if (!matches.length) {
    return highlightElementTerms(text);
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match, index) => {
    if (match.start > cursor) {
      parts.push(
        <Fragment key={`text-${index}-${cursor}`}>
          {highlightElementTerms(text.slice(cursor, match.start))}
        </Fragment>
      );
    }

    parts.push(
      <span
        key={`value-${index}-${match.start}`}
        style={{
          color: ACCENT,
          fontWeight: 900,
        }}
      >
        {match.text}
      </span>
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(
      <Fragment key={`tail-${cursor}`}>
        {highlightElementTerms(text.slice(cursor))}
      </Fragment>
    );
  }

  return parts;
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
    <div className="mt-3.5 border border-ef-line bg-ef-card" style={CUT}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between bg-transparent px-3.5 py-3 font-mono text-[13px] font-black uppercase tracking-wide text-ef-ink"
      >
        <span>{title}</span>
        <span style={{ color: ACCENT }}>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div className="border-t border-ef-line">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function inferTypeLabel(skill: WeaponSkillDetail) {
  const raw = (skill.typeLabel ?? "").trim();
  const key = (skill.key ?? "").toLowerCase();
  const name = (skill.name ?? "").toLowerCase();
  const metas = skill.meta ?? [];

  const metaHas = (target: string) =>
    metas.some(
      (meta) =>
        String(meta.label).includes(target) || String(meta.value).includes(target)
    );

  if (metaHas("능력치")) return "능력치";
  if (metaHas("속성")) return "속성";
  if (metaHas("시리즈 스킬")) return "시리즈 스킬";

  if (raw.includes("능력치")) return "능력치";
  if (raw.includes("속성")) return "속성";
  if (raw.includes("시리즈")) return "시리즈 스킬";

  if (
    key.includes("stat") ||
    key.includes("status") ||
    key.includes("ability") ||
    key.includes("main-attribute") ||
    key.includes("strength") ||
    key.includes("agility") ||
    key.includes("intelligence") ||
    key.includes("will") ||
    name.includes("주요 능력치") ||
    name.includes("힘 증가") ||
    name.includes("민첩 증가") ||
    name.includes("지능 증가") ||
    name.includes("의지 증가")
  ) {
    return "능력치";
  }

  if (
    key.includes("attack") ||
    key.includes("hp") ||
    key.includes("crit") ||
    key.includes("element") ||
    key.includes("attr") ||
    key.includes("property") ||
    key.includes("ultimate-gain") ||
    key.includes("arts-intensity") ||
    key.includes("heal") ||
    name.includes("공격력 증가") ||
    name.includes("생명력 증가") ||
    name.includes("치명타 확률 증가") ||
    name.includes("치유 효율 증가") ||
    name.includes("궁극기 충전 효율 증가") ||
    name.includes("오리지늄 아츠 강도 증가") ||
    name.includes("물리 피해 증가") ||
    name.includes("열기 피해 증가") ||
    name.includes("전기 피해 증가") ||
    name.includes("냉기 피해 증가") ||
    name.includes("자연 피해 증가") ||
    name.includes("아츠 피해 증가")
  ) {
    return "속성";
  }

  return "시리즈 스킬";
}

function getDisplayTypeLabel(skill: WeaponSkillDetail) {
  const directMeta = skill.meta?.find((meta) =>
    ["능력치", "속성", "시리즈 스킬"].includes(String(meta.label).trim())
  );

  if (directMeta) {
    return String(directMeta.label).trim();
  }

  return inferTypeLabel(skill);
}

export default function WeaponSkillAtlasPanel({ skill }: Props) {
  const levels = useMemo(() => skill.levelValues ?? [], [skill.levelValues]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = levels[selectedIndex] ?? levels[0];

  if (!current) return null;

  const normalizedTypeLabel = getDisplayTypeLabel(skill);
  const isSimpleSkill =
    normalizedTypeLabel === "능력치" || normalizedTypeLabel === "속성";

  const showStats = !isSimpleSkill && !!current.stats?.length;
  const showDescription = !!current.description;
  const showCompareRows = !!skill.compareRows?.length;

  const currentStatValues = (current.stats ?? []).map((stat) => stat.value);

  const descriptionNodes =
    current.description && showDescription
      ? renderHighlightedDescription(current.description, currentStatValues)
      : null;

  return (
    <section className="border border-ef-line bg-ef-card2 p-4" style={CUT}>
      <div>
        <div className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ef-muted">
          {normalizedTypeLabel}
        </div>

        <div className="break-keep text-3xl font-black leading-tight" style={{ color: ACCENT }}>
          {skill.name}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {levels.map((level, index) => {
          const active = selectedIndex === index;

          return (
            <button
              key={`${skill.name}-${level.rank}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="h-[34px] min-w-[70px] px-2.5 font-mono text-xs font-black uppercase tracking-wide transition"
              style={active
                ? { ...CUT_SM, borderWidth: 1, borderStyle: "solid", borderColor: ACCENT, background: "rgba(255,210,74,0.2)", color: "#ffffff", boxShadow: "inset 0 -2px 0 0 #ff9a2f" }
                : { ...CUT_SM, borderWidth: 1, borderStyle: "solid", borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }}
            >
              Rank {level.rank}
            </button>
          );
        })}
      </div>

      {showDescription && (
        <div
          className="mt-3 whitespace-pre-line break-keep border border-ef-line bg-ef-card px-4 py-3.5 text-[15px] leading-[1.8] text-ef-muted"
          style={CUT_SM}
        >
          {descriptionNodes}
        </div>
      )}

      {showStats && (
        <div
          className="mt-3 grid gap-2.5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
        >
          {current.stats!.map((stat) => (
            <div
              key={`${skill.name}-${current.rank}-${stat.label}`}
              className="border border-ef-line bg-ef-card p-3"
              style={CUT_SM}
            >
              <div className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">
                {stat.label}
              </div>
              <div className="font-mono text-xl font-black tabular-nums" style={{ color: ACCENT }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCompareRows && (
        <FoldSection title="Rank 비교" defaultOpen={false}>
          <div className="grid gap-2.5 p-3">
            {skill.compareRows!.map((row) => (
              <div
                key={`${skill.name}-${row.label}`}
                className="overflow-hidden border border-ef-line bg-ef-card2"
                style={CUT_SM}
              >
                <div className="border-b border-ef-line px-3 py-2.5 font-mono text-[13px] font-black uppercase tracking-wide" style={{ color: ACCENT }}>
                  {row.label}
                </div>

                <div
                  className="grid gap-px bg-ef-line"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))" }}
                >
                  {row.values.map((value, index) => {
                    const rank = levels[index]?.rank ?? index + 1;

                    return (
                      <div
                        key={`${skill.name}-${row.label}-${index}`}
                        className="bg-ef-card2 p-2.5 text-center"
                      >
                        <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">
                          Rank {rank}
                        </div>

                        <div className="break-keep font-mono text-[13px] font-black tabular-nums" style={{ color: ACCENT }}>
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </FoldSection>
      )}
    </section>
  );
}