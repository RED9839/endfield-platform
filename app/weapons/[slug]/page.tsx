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

  return skills.find((skill) =>
    skill.meta?.some((meta) => normalizeText(meta.label).includes("시리즈")),
  );
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
  if (!skill) return { name: "-", rank1Value: "-" };

  return {
    name: normalizeText(skill.name) || "-",
    rank1Value: getRank1ValueFromSkill(skill),
  };
}

function getWeaponAttributeInfo(weapon: WeaponLike) {
  const skill = findSkillByType(weapon, "속성");
  if (!skill) return { name: "-", rank1Value: "-" };

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

  if (!filtered.length) return text;

  const result: ReactNode[] = [];
  let cursor = 0;

  filtered.forEach((match, index) => {
    if (cursor < match.start) result.push(text.slice(cursor, match.start));

    result.push(
      <span key={`${match.text}-${match.start}-${index}`} style={match.style}>
        {match.text}
      </span>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) result.push(text.slice(cursor));

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
        style: { color: YELLOW_TEXT, fontWeight: 900 },
        priority: 2000,
      });
    }
  }

  const numberPattern = /(?:[+\-]\d+(?:\.\d+)?%?|\d+(?:\.\d+)?%)/g;

  for (const match of raw.matchAll(numberPattern)) {
    const value = match[0];
    const start = match.index ?? 0;
    const end = start + value.length;

    matches.push({
      start,
      end,
      text: value,
      style: { color: YELLOW_TEXT, fontWeight: 900 },
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

  if (!filtered.length) return highlightElementTerms(raw);

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

  if (cursor < raw.length) result.push(highlightElementTerms(raw.slice(cursor)));

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
      className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black"
      style={{
        border: `1px solid ${borderColor}`,
        color: textColor,
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
      className="grid grid-cols-1 sm:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]"
      style={{
        borderBottom: noBorder ? "none" : `1px solid ${YELLOW_BORDER_FAINT}`,
      }}
    >
      <div
        className="px-3 py-2.5 text-sm font-bold text-white sm:border-r sm:py-3"
        style={{
          borderRightColor: YELLOW_BORDER_FAINT,
        }}
      >
        {label}
      </div>

      <div className="px-3 pb-3 text-sm font-black leading-7 text-zinc-100 sm:py-3 sm:text-base">
        {value}
      </div>
    </div>
  );
}

function DetailSection({
  id,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group scroll-mt-24 overflow-hidden rounded-[20px] border border-yellow-500/15 bg-[#05070b] shadow-[0_0_30px_rgba(250,204,21,0.035)] lg:rounded-[24px]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-4 [&::-webkit-details-marker]:hidden">
        <span
          className="text-base font-black tracking-tight lg:text-[22px]"
          style={{ color: YELLOW_TEXT }}
        >
          {title}
        </span>

        <span className="shrink-0 text-lg font-black text-yellow-300 transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>

      <div
        className="px-3 pb-4 lg:px-5 lg:pb-5"
        style={{ borderTop: `1px solid ${YELLOW_BORDER_SOFT}` }}
      >
        {children}
      </div>
    </details>
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

  const sectionLinks = [
    { href: "#summary", label: "요약" },
    { href: "#level", label: "레벨" },
    ...(weapon.skills?.length ? [{ href: "#skills", label: "스킬" }] : []),
    ...(weapon.breakthrough?.length
      ? [{ href: "#breakthrough", label: "돌파" }]
      : []),
  ];

  return (
    <main className="min-h-screen bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-3 rounded-[20px] bg-[#05070b] p-4 shadow-[0_0_30px_rgba(250,204,21,0.04)] sm:mb-5 sm:rounded-[24px] sm:p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold tracking-[0.28em] sm:text-[11px] sm:tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                엔드필드 지원 플랫폼
              </p>

              <h1
                className="mt-2 text-2xl font-black tracking-tight sm:text-4xl"
                style={{ color: YELLOW_TEXT }}
              >
                무기
              </h1>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                무기 상세 정보
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Link
                href="/weapons"
                className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                목록
              </Link>

              <Link
                href="/"
                className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                홈
              </Link>
            </div>
          </div>
        </header>

        <nav className="sticky top-2 z-30 mb-3 rounded-[18px] border border-yellow-500/15 bg-black/90 p-2 backdrop-blur lg:top-5 lg:hidden">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sectionLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200 sm:text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <section
          id="summary"
          className="relative mb-3 scroll-mt-24 overflow-hidden rounded-[20px] bg-[#05070b] p-3 shadow-[0_10px_28px_rgba(0,0,0,0.28)] lg:mb-5 lg:rounded-[24px] lg:p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,196,74,0.035),transparent_18%)]" />

          <div className="relative grid gap-3 lg:grid-cols-[340px_1fr] lg:gap-5">
            <div
              className="relative min-h-[320px] overflow-hidden rounded-[18px] bg-black lg:min-h-[540px] lg:rounded-[20px]"
              style={{ border: `1px solid ${YELLOW_BORDER}` }}
            >
              <Image
                src={heroImage}
                alt={weapon.name}
                fill
                priority
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 340px"
                className="object-contain"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
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
                  className="text-xs font-bold tracking-[0.04em] sm:text-sm"
                  style={{ color: YELLOW_TEXT }}
                >
                  {weapon.enName}
                </div>
              )}

              <h1 className="mt-1 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-[40px]">
                {weapon.name}
              </h1>

              <div className="mt-4 lg:mt-5">
                <div
                  className="mb-2 text-[11px] font-black tracking-[0.25em]"
                  style={{ color: YELLOW_TEXT }}
                >
                  기본 능력치
                </div>

                <div
                  className="overflow-hidden rounded-[18px] bg-[#06080c] lg:rounded-[20px]"
                  style={{ border: `1px solid ${YELLOW_BORDER}` }}
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
            </div>
          </div>
        </section>

        <div className="grid gap-3 lg:gap-5">
          <DetailSection id="level" title="레벨별 능력치" defaultOpen>
            <WeaponLevelPanel levelStats={weapon.levelStats} />
          </DetailSection>

          {!!weapon.skills?.length && (
            <DetailSection id="skills" title="무기 스킬" defaultOpen>
              <div className="grid gap-3 lg:gap-4">
                {weapon.skills.map((skill) => (
                  <WeaponSkillAtlasPanel
                    key={skill.key}
                    accentColor={YELLOW_TEXT}
                    skill={skill}
                  />
                ))}
              </div>
            </DetailSection>
          )}

          {!!weapon.breakthrough?.length && (
            <DetailSection id="breakthrough" title="돌파">
              <WeaponBreakthroughPanel
                breakthrough={weapon.breakthrough}
                accentColor={YELLOW_TEXT}
              />
            </DetailSection>
          )}
        </div>
      </div>
    </main>
  );
}