"use client";

import Image from "next/image";
import { Fragment, useMemo, useState } from "react";

type InfrastructureSkillLevel = {
  tier: "α" | "β" | "γ";
  unlockText: string;
  description: string;
};

type InfrastructureSkillGroup = {
  name: string;
  icon: string;
  levels: InfrastructureSkillLevel[];
};

type Props = {
  groups?: InfrastructureSkillGroup[];
  accentColor: string;
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

function tierToLevel(tier: "α" | "β" | "γ") {
  if (tier === "α") return 1;
  if (tier === "β") return 2;
  return 3;
}

function getNumberMatches(text?: string) {
  if (!text) return [];
  return [...text.matchAll(/(\d+(?:\.\d+)?%?)/g)];
}

function buildBidirectionalHighlight(
  currentText: string,
  previousText?: string,
  nextText?: string
): React.ReactNode {
  const currentMatches = getNumberMatches(currentText);
  const previousMatches = getNumberMatches(previousText);
  const nextMatches = getNumberMatches(nextText);

  if (!currentMatches.length) return currentText;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  currentMatches.forEach((match, index) => {
    const currentValue = match[0];
    const prevValue = previousMatches[index]?.[0];
    const nextValue = nextMatches[index]?.[0];

    const changedFromPrev =
      prevValue !== undefined && prevValue !== currentValue;
    const changedToNext =
      nextValue !== undefined && nextValue !== currentValue;

    const shouldHighlight = changedFromPrev || changedToNext;

    const start = match.index ?? 0;
    const end = start + currentValue.length;

    if (start > lastIndex) {
      parts.push(
        <Fragment key={`text-${index}-${start}`}>
          {currentText.slice(lastIndex, start)}
        </Fragment>
      );
    }

    parts.push(
      <span
        key={`num-${index}-${start}`}
        className={shouldHighlight ? "font-black" : "font-bold text-ef-muted"}
        style={shouldHighlight ? { color: ACCENT } : undefined}
      >
        {currentValue}
      </span>
    );

    lastIndex = end;
  });

  if (lastIndex < currentText.length) {
    parts.push(
      <Fragment key={`tail-${lastIndex}`}>
        {currentText.slice(lastIndex)}
      </Fragment>
    );
  }

  return parts;
}

export default function InfrastructureSkillPanel({
  groups = [],
}: Props) {
  if (!groups.length) return null;

  return (
    <section className="grid gap-3.5">
      {groups.map((group, index) => (
        <InfrastructureCard
          key={`${group.name}-${index}`}
          group={group}
        />
      ))}
    </section>
  );
}

function InfrastructureCard({
  group,
}: {
  group: InfrastructureSkillGroup;
}) {
  const sortedLevels = useMemo(() => {
    return [...group.levels].sort((a, b) => tierToLevel(a.tier) - tierToLevel(b.tier));
  }, [group.levels]);

  const [selectedTier, setSelectedTier] = useState(sortedLevels[0]?.tier);

  const current = sortedLevels.find((level) => level.tier === selectedTier) ?? sortedLevels[0];
  const currentIndex = sortedLevels.findIndex((level) => level.tier === selectedTier);
  const previous = currentIndex > 0 ? sortedLevels[currentIndex - 1] : undefined;
  const next =
    currentIndex < sortedLevels.length - 1
      ? sortedLevels[currentIndex + 1]
      : undefined;

  if (!current) return null;

  const descriptionNodes = buildBidirectionalHighlight(
    current.description,
    previous?.description,
    next?.description
  );

  return (
    <section className="border border-ef-line bg-ef-card2 p-4" style={CUT}>
      <div className="grid items-start gap-3.5" style={{ gridTemplateColumns: "64px 1fr" }}>
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden border border-ef-line bg-ef-card" style={CUT_SM}>
          <div style={{ position: "relative", width: "56px", height: "56px" }}>
            <Image
              src={group.icon}
              alt={group.name}
              fill
              sizes="56px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div>
          <div className="text-3xl font-black leading-tight text-ef-ink">
            {group.name}
          </div>

          <div className="mt-2.5 whitespace-pre-line text-sm leading-7 text-ef-muted">
            {descriptionNodes}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {sortedLevels.map((level) => {
          const numericLevel = tierToLevel(level.tier);
          const active = selectedTier === level.tier;

          return (
            <button
              key={`${group.name}-${level.tier}`}
              type="button"
              onClick={() => setSelectedTier(level.tier)}
              className={`flex h-[34px] min-w-[58px] items-center justify-center border px-2.5 font-mono text-xs font-black uppercase tracking-wide transition ${
                active ? "border-ef-accent text-white" : "border-ef-line bg-ef-card text-ef-muted"
              }`}
              style={
                active
                  ? { ...CUT_SM, background: "rgba(255,210,74,0.2)", boxShadow: "inset 0 -2px 0 0 #ff9a2f" }
                  : CUT_SM
              }
            >
              Lv.{numericLevel}
            </button>
          );
        })}
      </div>
    </section>
  );
}
