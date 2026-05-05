import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import {
  getWeaponDetailBySlug,
  type WeaponRarity,
} from "@/data/weapons-detail-data";

import WeaponLevelPanel from "./WeaponLevelPanel";
import WeaponSkillAtlasPanel from "./WeaponSkillAtlasPanel";
import WeaponBreakthroughPanel from "./WeaponBreakthroughPanel";

const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const YELLOW_BORDER_FAINT = "rgba(255,196,74,0.08)";
const LABEL_BORDER = "rgba(255,196,74,0.42)";

const rarityColorMap: Record<WeaponRarity, string> = {
  6: "#ff8a1f",
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
};

const rarityLabelMap: Record<WeaponRarity, string> = {
  6: "6성",
  5: "5성",
  4: "4성",
  3: "3성",
};

const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검",
  artsunit: "아츠 유닛",
  artsUnit: "아츠 유닛",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
};

const rarityIconMap: Record<WeaponRarity, string> = {
  3: "/icons/rarity/3star.webp",
  4: "/icons/rarity/4star.webp",
  5: "/icons/rarity/5star.webp",
  6: "/icons/rarity/6star.webp",
};

const weaponTypeIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp",
  artsunit: "/icons/weapons/artsunit.webp",
  artsUnit: "/icons/weapons/artsunit.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
};

type WeaponMeta = {
  label: string;
  value: string | number;
};

type WeaponSkillStat = {
  label: string;
  value: string | number;
};

type WeaponSkillLevelValue = {
  rank: string;
  description?: string;
  stats?: WeaponSkillStat[];
};

type WeaponSkill = {
  key: string;
  name: string;
  typeLabel?: string;
  meta?: WeaponMeta[];
  levelValues?: WeaponSkillLevelValue[];
};

type WeaponLike = {
  slug: string;
  series?: string;
  skills?: WeaponSkill[];
  levelStats?: { level: number; attack: number }[] | null;
  rarity: WeaponRarity;
  weaponType: string;
  name: string;
  enName?: string;
  mainStatLabel?: string;
  breakthrough?: unknown[];
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#fff",
    padding: "24px 28px 40px",
  },
  shell: {
    width: "100%",
    maxWidth: "1840px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
    border: `1px solid ${YELLOW_BORDER}`,
    borderRadius: "24px",
    background: "#05070b",
    padding: "20px",
    boxShadow: "0 0 30px rgba(250,204,21,0.04)",
  },
  subTitle: {
    fontSize: "11px",
    letterSpacing: "0.35em",
    color: YELLOW_TEXT,
    fontWeight: 700,
  },
  headerTopRow: {
    marginTop: "10px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  title: {
    marginTop: "8px",
    fontSize: "42px",
    fontWeight: 900,
    color: YELLOW_TEXT,
    letterSpacing: "-0.02em",
  },
  desc: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#71717a",
  },
  headerButtonRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  topLinkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "38px",
    padding: "0 14px",
    background: "#000000",
    color: "#e4e4e7",
    border: `1px solid ${YELLOW_BORDER_SOFT}`,
    borderRadius: "14px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 800,
  },
  sectionTitle: {
    marginTop: "22px",
    marginBottom: "12px",
    fontSize: "22px",
    fontWeight: 900,
    color: YELLOW_TEXT,
    letterSpacing: "-0.01em",
  },
};

function PageSectionTitle({ children }: { children: ReactNode }) {
  return <div style={styles.sectionTitle}>{children}</div>;
}

function normalizeText(value?: string | number) {
  return String(value ?? "").trim();
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findSkillByType(
  weapon: WeaponLike,
  target: "능력치" | "속성" | "시리즈 스킬",
) {
  const skills = weapon.skills ?? [];

  const exactMeta = skills.find((skill) =>
    skill.meta?.some((meta) => normalizeText(meta.label) === target),
  );
  if (exactMeta) return exactMeta;

  const exactType = skills.find(
    (skill) => normalizeText(skill.typeLabel) === target,
  );
  if (exactType) return exactType;

  if (target === "능력치") {
    return skills.find((skill) => {
      const name = normalizeText(skill.name);
      return (
        name.includes("힘") ||
        name.includes("민첩") ||
        name.includes("지능") ||
        name.includes("의지") ||
        name.includes("주요 능력치")
      );
    });
  }

  if (target === "속성") {
    return skills.find((skill) => {
      const name = normalizeText(skill.name);
      return (
        name.includes("물리") ||
        name.includes("열기") ||
        name.includes("전기") ||
        name.includes("냉기") ||
        name.includes("자연") ||
        name.includes("공격력") ||
        name.includes("치명타") ||
        name.includes("오리지늄") ||
        name.includes("치유 효율")
      );
    });
  }

  return skills.find((skill) => {
    const metas = skill.meta ?? [];
    return metas.some((meta) => normalizeText(meta.label).includes("시리즈"));
  });
}

function getRank1ValueFromSkill(skill?: WeaponSkill) {
  if (!skill) return "-";

  const firstLevel = skill.levelValues?.[0];
  if (!firstLevel) return "-";

  if (firstLevel.stats?.length) {
    const firstStat = firstLevel.stats[0];
    if (firstStat?.value !== undefined && firstStat?.value !== null) {
      return String(firstStat.value);
    }
  }

  if (firstLevel.description) {
    const match = firstLevel.description.match(/[+\-]?\d+(?:\.\d+)?%?/);
    if (match) return match[0];
  }

  return "-";
}

function getRank1Description(skill?: WeaponSkill) {
  if (!skill) return "-";
  return skill.levelValues?.[0]?.description?.trim() || "-";
}

function getWeaponAbilityInfo(weapon: WeaponLike) {
  const skill = findSkillByType(weapon, "능력치");

  if (!skill) {
    return {
      name: "-",
      rank1Value: "-",
    };
  }

  return {
    name: normalizeText(skill.name) || "-",
    rank1Value: getRank1ValueFromSkill(skill),
  };
}

function getWeaponAttributeInfo(weapon: WeaponLike) {
  const skill = findSkillByType(weapon, "속성");

  if (!skill) {
    return {
      name: "-",
      rank1Value: "-",
    };
  }

  return {
    name: normalizeText(skill.name) || "-",
    rank1Value: getRank1ValueFromSkill(skill),
  };
}

function getWeaponSeriesSkillInfo(weapon: WeaponLike) {
  const skill = findSkillByType(weapon, "시리즈 스킬");

  if (!skill) {
    return {
      name: weapon.series ?? "-",
      rank1Value: "-",
      rank1Description: "-",
    };
  }

  return {
    name: normalizeText(skill.name) || weapon.series || "-",
    rank1Value: getRank1ValueFromSkill(skill),
    rank1Description: getRank1Description(skill),
  };
}

function getInitialAttack(weapon: WeaponLike) {
  const stats = Array.isArray(weapon.levelStats) ? weapon.levelStats : [];
  const level1 = stats.find((row) => row.level === 1);
  return level1?.attack ?? stats[0]?.attack ?? "-";
}

function highlightElementTerms(text: string): ReactNode {
  const colorMap: Array<{ pattern: RegExp; color: string }> = [
    { pattern: /물리 피해/g, color: "#cfd8e3" },
    { pattern: /열기 피해/g, color: "#ff7a59" },
    { pattern: /전기 피해/g, color: "#f0c94a" },
    { pattern: /냉기 피해/g, color: "#63b3ff" },
    { pattern: /자연 피해/g, color: "#7ddc6d" },
    { pattern: /물리/g, color: "#cfd8e3" },
    { pattern: /열기/g, color: "#ff7a59" },
    { pattern: /전기/g, color: "#f0c94a" },
    { pattern: /냉기/g, color: "#63b3ff" },
    { pattern: /자연/g, color: "#7ddc6d" },
    { pattern: /연소/g, color: "#ff7a59" },
    { pattern: /감전/g, color: "#f0c94a" },
    { pattern: /동결/g, color: "#63b3ff" },
    { pattern: /부식/g, color: "#7ddc6d" },
    { pattern: /띄우기/g, color: "#cfd8e3" },
    { pattern: /방어 불능/g, color: "#cfd8e3" },
  ];

  const matches: Array<{
    start: number;
    end: number;
    text: string;
    style: CSSProperties;
    priority: number;
  }> = [];

  colorMap.forEach(({ pattern, color }) => {
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const index = match.index ?? 0;
      matches.push({
        start: index,
        end: index + value.length,
        text: value,
        style: { color, fontWeight: 800 },
        priority: value.length,
      });
    }
  });

  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.priority - a.priority;
  });

  const filtered: typeof matches = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  if (filtered.length === 0) return text;

  const result: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (cursor < match.start) {
      result.push(text.slice(cursor, match.start));
    }

    result.push(
      <span key={`${match.text}-${match.start}-${index}`} style={match.style}>
        {match.text}
      </span>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    result.push(text.slice(cursor));
  }

  return result;
}

function highlightSeriesDescription(
  text: string,
  seriesSkillName?: string,
): ReactNode {
  const raw = normalizeText(text);
  if (!raw) return "-";

  const matches: Array<{
    start: number;
    end: number;
    text: string;
    style: CSSProperties;
    priority: number;
  }> = [];

  if (seriesSkillName?.trim()) {
    const pattern = new RegExp(escapeRegExp(seriesSkillName), "g");
    for (const match of raw.matchAll(pattern)) {
      const value = match[0];
      const index = match.index ?? 0;
      matches.push({
        start: index,
        end: index + value.length,
        text: value,
        style: {
          color: YELLOW_TEXT,
          fontWeight: 900,
        },
        priority: 2000,
      });
    }
  }

  const colorMap: Array<{ pattern: RegExp; color: string }> = [
    { pattern: /물리 피해/g, color: "#cfd8e3" },
    { pattern: /열기 피해/g, color: "#ff7a59" },
    { pattern: /전기 피해/g, color: "#f0c94a" },
    { pattern: /냉기 피해/g, color: "#63b3ff" },
    { pattern: /자연 피해/g, color: "#7ddc6d" },
    { pattern: /물리/g, color: "#cfd8e3" },
    { pattern: /열기/g, color: "#ff7a59" },
    { pattern: /전기/g, color: "#f0c94a" },
    { pattern: /냉기/g, color: "#63b3ff" },
    { pattern: /자연/g, color: "#7ddc6d" },
    { pattern: /연소/g, color: "#ff7a59" },
    { pattern: /감전/g, color: "#f0c94a" },
    { pattern: /동결/g, color: "#63b3ff" },
    { pattern: /부식/g, color: "#7ddc6d" },
    { pattern: /띄우기/g, color: "#cfd8e3" },
    { pattern: /방어 불능/g, color: "#cfd8e3" },
  ];

  colorMap.forEach(({ pattern, color }) => {
    for (const match of raw.matchAll(pattern)) {
      const value = match[0];
      const index = match.index ?? 0;
      matches.push({
        start: index,
        end: index + value.length,
        text: value,
        style: { color, fontWeight: 800 },
        priority: value.length,
      });
    }
  });

  const numberPattern = /(?:[+\-]\d+(?:\.\d+)?%?|\d+(?:\.\d+)?%)/g;

  for (const match of raw.matchAll(numberPattern)) {
    const value = match[0];
    const start = match.index ?? 0;
    const end = start + value.length;

    matches.push({
      start,
      end,
      text: value,
      style: {
        color: YELLOW_TEXT,
        fontWeight: 900,
      },
      priority: 1500,
    });
  }

  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.priority - a.priority;
  });

  const filtered: typeof matches = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  if (!filtered.length) {
    return highlightElementTerms(raw);
  }

  const result: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (cursor < match.start) {
      result.push(highlightElementTerms(raw.slice(cursor, match.start)));
    }

    result.push(
      <span key={`${match.text}-${match.start}-${index}`} style={match.style}>
        {match.text}
      </span>,
    );

    cursor = match.end;
  });

  if (cursor < raw.length) {
    result.push(highlightElementTerms(raw.slice(cursor)));
  }

  return result;
}

function SmallIcon({
  src,
  alt,
  size = 16,
}: {
  src?: string;
  alt: string;
  size?: number;
}) {
  if (!src) return null;

  return (
    <span
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        style={{ objectFit: "contain" }}
      />
    </span>
  );
}

function InfoBadge({
  label,
  iconSrc,
  borderColor = LABEL_BORDER,
  textColor = YELLOW_TEXT,
  background = "#000000",
}: {
  label: string;
  iconSrc?: string;
  borderColor?: string;
  textColor?: string;
  background?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        minHeight: "28px",
        padding: "4px 10px",
        border: `1px solid ${borderColor}`,
        borderRadius: "999px",
        color: textColor,
        fontSize: "12px",
        fontWeight: 800,
        background,
      }}
    >
      <SmallIcon src={iconSrc} alt={label} size={16} />
      <span>{label}</span>
    </span>
  );
}

function BasicStatRow({
  label,
  value,
  noBorder = false,
}: {
  label: string;
  value: ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        borderBottom: noBorder ? "none" : `1px solid ${YELLOW_BORDER_FAINT}`,
      }}
    >
      <div
        style={{
          padding: "12px",
          borderRight: `1px solid ${YELLOW_BORDER_FAINT}`,
          color: "#ffffff",
          fontWeight: 700,
          wordBreak: "keep-all",
        }}
      >
        {label}
      </div>

      <div
        style={{
          padding: "12px",
          color: "#f3f4f6",
          fontWeight: 800,
          fontSize: "16px",
          lineHeight: 1.7,
          whiteSpace: "pre-line",
          wordBreak: "keep-all",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default async function WeaponDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const weapon = getWeaponDetailBySlug(slug);

  if (!weapon) notFound();

  const rarityColor = rarityColorMap[weapon.rarity];
  const heroImage = `/weapons/${weapon.slug}.webp`;
  const initialAttack = getInitialAttack(weapon);

  const abilityInfo = getWeaponAbilityInfo(weapon);
  const attributeInfo = getWeaponAttributeInfo(weapon);
  const seriesSkillInfo = getWeaponSeriesSkillInfo(weapon);

  const weaponTypeLabel =
    weaponTypeLabelMap[weapon.weaponType] ?? weapon.weaponType;

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.subTitle}>ENDFIELD SUPPORT PLATFORM</div>

          <div style={styles.headerTopRow}>
            <div>
              <div style={styles.title}>WEAPONS</div>
              <div style={styles.desc}>{weapon.name} 상세 정보</div>
            </div>

            <div style={styles.headerButtonRow}>
              <Link href="/weapons" style={styles.topLinkButton}>
                목록으로
              </Link>

              <Link href="/" style={styles.topLinkButton}>
                홈으로
              </Link>
            </div>
          </div>
        </header>

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${YELLOW_BORDER}`,
            borderRadius: "24px",
            background: "#05070b",
            boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
            padding: "22px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,196,74,0.035), transparent 18%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "340px 1fr",
              gap: "22px",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                position: "relative",
                minHeight: "540px",
                background: "#000",
                border: `1px solid ${YELLOW_BORDER}`,
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <Image
                src={heroImage}
                alt={weapon.name}
                fill
                sizes="340px"
                loading="eager"
                style={{ objectFit: "contain" }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.25), rgba(0,0,0,0))",
                }}
              />
            </div>

            <div
              style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                }}
              >
                <InfoBadge
                  label={rarityLabelMap[weapon.rarity]}
                  iconSrc={rarityIconMap[weapon.rarity]}
                  borderColor={rarityColor}
                  textColor={rarityColor}
                />

                <InfoBadge
                  label={weaponTypeLabel}
                  iconSrc={weaponTypeIconMap[weapon.weaponType]}
                />

                <InfoBadge label={abilityInfo.name} />

                <InfoBadge label={attributeInfo.name} />

                <InfoBadge label={seriesSkillInfo.name} />
              </div>

              {!!weapon.enName && (
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: YELLOW_TEXT,
                    letterSpacing: "0.04em",
                  }}
                >
                  {weapon.enName}
                </div>
              )}

              <h1
                style={{
                  marginTop: "6px",
                  fontSize: "40px",
                  lineHeight: 1.1,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {weapon.name}
              </h1>

              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.25em",
                    color: YELLOW_TEXT,
                    marginBottom: "8px",
                    fontWeight: 800,
                  }}
                >
                  BASIC STAT
                </div>

                <div
                  style={{
                    border: `1px solid ${YELLOW_BORDER}`,
                    borderRadius: "20px",
                    background: "#06080c",
                    overflow: "hidden",
                  }}
                >
                  <BasicStatRow
                    label={weapon.mainStatLabel ?? "공격력"}
                    value={
                      <span style={{ color: YELLOW_TEXT }}>
                        {initialAttack}
                      </span>
                    }
                  />

                  <BasicStatRow
                    label={abilityInfo.name}
                    value={
                      <span style={{ color: YELLOW_TEXT }}>
                        {abilityInfo.rank1Value}
                      </span>
                    }
                  />

                  <BasicStatRow
                    label={attributeInfo.name}
                    value={
                      <span style={{ color: YELLOW_TEXT }}>
                        {attributeInfo.rank1Value}
                      </span>
                    }
                  />

                  <BasicStatRow
                    label={seriesSkillInfo.name}
                    value={highlightSeriesDescription(
                      seriesSkillInfo.rank1Description,
                      seriesSkillInfo.name,
                    )}
                    noBorder
                  />
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.25em",
                    color: YELLOW_TEXT,
                    marginBottom: "6px",
                    fontWeight: 800,
                  }}
                >
                  LEVEL PANEL
                </div>

                <WeaponLevelPanel levelStats={weapon.levelStats} />
              </div>
            </div>
          </div>
        </section>

        {!!weapon.skills?.length && (
          <>
            <PageSectionTitle>무기 스킬</PageSectionTitle>

            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {weapon.skills.map((skill) => (
                <WeaponSkillAtlasPanel
                  key={skill.key}
                  accentColor={YELLOW_TEXT}
                  skill={skill}
                />
              ))}
            </div>
          </>
        )}

        {!!weapon.breakthrough?.length && (
          <>
            <PageSectionTitle>돌파</PageSectionTitle>

            <WeaponBreakthroughPanel
              breakthrough={weapon.breakthrough}
              accentColor={YELLOW_TEXT}
            />
          </>
        )}
      </div>
    </div>
  );
}