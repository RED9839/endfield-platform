"use client";

import Image from "next/image";
import { Fragment, useMemo, useState } from "react";

type TalentItem = {
  name: string;
  unlock: string;
  description: string;
  icon?: string;
};

type Props = {
  items?: TalentItem[];
  accentColor: string;
};

type GroupedTalent = {
  name: string;
  entries: TalentItem[];
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

function getTalentLevelLabel(index: number) {
  return `Lv.${index + 1}`;
}

function getNumberMatches(text?: string) {
  if (!text) return [];
  return [...text.matchAll(/([+\-x×]?\s*\d+(?:\.\d+)?%?)/gi)];
}

function normalizeHighlightedValue(value: string) {
  return value.replace(/\s+/g, "");
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
      prevValue !== undefined &&
      normalizeHighlightedValue(prevValue) !== normalizeHighlightedValue(currentValue);

    const changedToNext =
      nextValue !== undefined &&
      normalizeHighlightedValue(nextValue) !== normalizeHighlightedValue(currentValue);

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
        {normalizeHighlightedValue(currentValue)}
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

export default function TalentPanel({
  items = [],
}: Props) {
  const groupedTalents = useMemo<GroupedTalent[]>(() => {
    const map = new Map<string, TalentItem[]>();

    items.forEach((item) => {
      const prev = map.get(item.name) ?? [];
      prev.push(item);
      map.set(item.name, prev);
    });

    return Array.from(map.entries()).map(([name, entries]) => ({
      name,
      entries,
    }));
  }, [items]);

  if (!groupedTalents.length) return null;

  return (
    <section className="grid gap-3.5">
      {groupedTalents.map((group, groupIndex) => (
        <TalentCard
          key={`${group.name}-${groupIndex}`}
          group={group}
          fallbackIcon={`/icons/talents/${groupIndex + 1}.webp`}
        />
      ))}
    </section>
  );
}

function TalentCard({
  group,
  fallbackIcon,
}: {
  group: GroupedTalent;
  fallbackIcon: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = group.entries[selectedIndex] ?? group.entries[0];
  const previous = selectedIndex > 0 ? group.entries[selectedIndex - 1] : undefined;
  const next =
    selectedIndex < group.entries.length - 1
      ? group.entries[selectedIndex + 1]
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
              src={current.icon || fallbackIcon}
              alt={current.name}
              fill
              sizes="56px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div>
          <div className="text-3xl font-black leading-tight text-ef-ink">
            {current.name}
          </div>

          <div className="mt-2.5 whitespace-pre-line text-sm leading-7 text-ef-muted">
            {descriptionNodes}
          </div>
        </div>
      </div>

      {group.entries.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {group.entries.map((_, index) => {
            const active = selectedIndex === index;

            return (
              <button
                key={`${group.name}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`flex h-[34px] min-w-[58px] items-center justify-center border px-2.5 font-mono text-xs font-black uppercase tracking-wide transition ${
                  active ? "border-ef-accent text-white" : "border-ef-line bg-ef-card text-ef-muted"
                }`}
                style={
                  active
                    ? { ...CUT_SM, background: "rgba(255,210,74,0.2)", boxShadow: "inset 0 -2px 0 0 #ff9a2f" }
                    : CUT_SM
                }
              >
                {getTalentLevelLabel(index)}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
