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

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const BG = "#06080c";
const BUTTON_BG = "#0c1016";

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
        style={{
          color: shouldHighlight ? YELLOW_MAIN : "#d1d5db",
          fontWeight: shouldHighlight ? 900 : 700,
        }}
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
  accentColor,
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
    <section style={{ display: "grid", gap: "14px" }}>
      {groupedTalents.map((group, groupIndex) => (
        <TalentCard
          key={`${group.name}-${groupIndex}`}
          group={group}
          accentColor={accentColor}
          fallbackIcon={`/icons/talents/${groupIndex + 1}.webp`}
        />
      ))}
    </section>
  );
}

function TalentCard({
  group,
  accentColor,
  fallbackIcon,
}: {
  group: GroupedTalent;
  accentColor: string;
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
    <section
      style={{
        borderRadius: "20px",
        background: BG,
        border: `1px solid ${YELLOW_BORDER}`,
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "64px 1fr",
          gap: "14px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            border: `1px solid ${YELLOW_BORDER}`,
            background: BUTTON_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: "20px",
          }}
        >
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
          <div
            style={{
              color: YELLOW_TEXT,
              fontSize: "30px",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            {current.name}
          </div>

          <div
            style={{
              marginTop: "10px",
              color: "#d1d5db",
              fontSize: "15px",
              lineHeight: 1.8,
              whiteSpace: "pre-line",
            }}
          >
            {descriptionNodes}
          </div>
        </div>
      </div>

      {group.entries.length > 1 ? (
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginTop: "16px",
          }}
        >
          {group.entries.map((_, index) => {
            const active = selectedIndex === index;

            return (
              <button
                key={`${group.name}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                style={{
                  minWidth: "58px",
                  height: "34px",
                  padding: "0 10px",
                  border: active
                    ? `1px solid ${accentColor}`
                    : `1px solid ${YELLOW_BORDER}`,
                  background: active
                    ? "rgba(255,196,74,0.14)"
                    : BUTTON_BG,
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                  borderRadius: "20px",
                }}
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