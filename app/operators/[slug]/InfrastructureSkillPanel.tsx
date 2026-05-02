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

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const BG = "#06080c";
const BUTTON_BG = "#0c1016";

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
        style={{
          color: shouldHighlight ? YELLOW_MAIN : "#d1d5db",
          fontWeight: shouldHighlight ? 900 : 700,
        }}
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
  accentColor,
}: Props) {
  if (!groups.length) return null;

  return (
    <section style={{ display: "grid", gap: "14px" }}>
      {groups.map((group, index) => (
        <InfrastructureCard
          key={`${group.name}-${index}`}
          group={group}
          accentColor={accentColor}
        />
      ))}
    </section>
  );
}

function InfrastructureCard({
  group,
  accentColor,
}: {
  group: InfrastructureSkillGroup;
  accentColor: string;
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
              src={group.icon}
              alt={group.name}
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
            {group.name}
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

      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginTop: "16px",
        }}
      >
        {sortedLevels.map((level) => {
          const numericLevel = tierToLevel(level.tier);
          const active = selectedTier === level.tier;

          return (
            <button
              key={`${group.name}-${level.tier}`}
              type="button"
              onClick={() => setSelectedTier(level.tier)}
              style={{
                minWidth: "58px",
                height: "34px",
                padding: "0 10px",
                border: active
                  ? `1px solid ${accentColor}`
                  : `1px solid ${YELLOW_BORDER}`,
                background: active ? "rgba(255,196,74,0.14)" : BUTTON_BG,
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                borderRadius: "20px",
              }}
            >
              Lv.{numericLevel}
            </button>
          );
        })}
      </div>
    </section>
  );
}