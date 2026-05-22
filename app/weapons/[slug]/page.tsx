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
const YELLOW_MAIN = "#ffd24a";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const YELLOW_BORDER_FAINT = "rgba(255,196,74,0.08)";

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

const statIconMap: Record<string, string> = {
  힘: "/icons/stats/strength.webp",
  민첩: "/icons/stats/agility.webp",
  지능: "/icons/stats/intelligence.webp",
  의지: "/icons/stats/will.webp",
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

function InlineIcon({
  src,
  alt,
  size = 16,
}: {
  src?: string;
  alt: string;
  size?: 14 | 16 | 18 | 20;
}) {
  if (!src) return null;

  const sizeClassMap = {
    14: "h-3.5 w-3.5",
    16: "h-4 w-4",
    18: "h-[18px] w-[18px]",
    20: "h-5 w-5",
  };

  return (
    <span className={`relative inline-block shrink-0 ${sizeClassMap[size]}`}>
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-contain" />
    </span>
  );
}

function InfoBadge({
  label,
  icon,
  highlight = false,
  borderColor,
  textColor,
}: {
  label: string;
  icon?: string;
  highlight?: boolean;
  borderColor?: string;
  textColor?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black",
        highlight
          ? "border bg-yellow-400/15 text-yellow-100"
          : "border border-white/10 bg-white/5 text-zinc-200",
      ].join(" ")}
      style={{
        borderColor: borderColor ?? (highlight ? "rgba(250,204,21,0.32)" : undefined),
        color: textColor,
      }}
    >
      <InlineIcon src={icon} alt={label} size={16} />
      <span>{label}</span>
    </span>
  );
}

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon?: string;
}) {
  return (
    <div className="rounded-2xl border border-yellow-500/10 bg-black/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-[10px] font-black tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-black text-yellow-100">
        <InlineIcon src={icon} alt={label} size={18} />
        <span className="min-w-0 truncate">{value || "-"}</span>
      </div>
    </div>
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
      style={{ borderBottom: noBorder ? "none" : `1px solid ${YELLOW_BORDER_FAINT}` }}
    >
      <div
        className="px-3 py-2.5 text-sm font-bold text-white sm:border-r sm:py-3"
        style={{ borderRightColor: YELLOW_BORDER_FAINT }}
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
      className="group scroll-mt-24 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_14px_34px_rgba(0,0,0,0.24)] lg:rounded-[26px]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-4 [&::-webkit-details-marker]:hidden">
        <span
          className="min-w-0 text-base font-black tracking-tight lg:text-[22px]"
          style={{ color: YELLOW_TEXT }}
        >
          {title}
        </span>
        <span className="shrink-0 text-lg font-black text-yellow-300 transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>
      <div
        className="min-w-0 px-2 pb-3 sm:px-3 sm:pb-4 lg:px-5 lg:pb-5"
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
  const weaponTypeLabel = weaponTypeLabelMap[weapon.weaponType] ?? weapon.weaponType;
  const weaponTypeIcon = weaponTypeIconMap[weapon.weaponType];
  const rarityIcon = rarityIconMap[weapon.rarity];
  const mainStatIcon = statIconMap[weapon.mainStatLabel ?? ""];

  const sectionLinks = [
    { href: "#level", label: "레벨" },
    ...(weapon.skills?.length ? [{ href: "#skills", label: "스킬" }] : []),
    ...(weapon.breakthrough?.length ? [{ href: "#breakthrough", label: "돌파" }] : []),
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <section className="relative min-h-[760px] overflow-hidden border-b border-yellow-500/10 sm:min-h-[820px] lg:min-h-[920px]">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={weapon.name}
            fill
            priority
            sizes="100vw"
            className="scale-110 object-contain blur-[18px] brightness-[0.22]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(255,210,74,0.18),transparent_28%),radial-gradient(circle_at_24%_70%,rgba(255,210,74,0.08),transparent_32%),linear-gradient(180deg,rgba(5,5,5,0.1)_0%,rgba(5,5,5,0.78)_72%,#050505_100%),linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.34)_48%,rgba(0,0,0,0.86)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1840px] flex-col px-3 py-3 sm:min-h-[820px] sm:px-4 md:px-6 md:py-5 lg:min-h-[920px]">
          <header
            className="mb-4 rounded-[20px] bg-[#05070b]/92 p-4 shadow-[0_0_30px_rgba(250,204,21,0.04)] backdrop-blur-md sm:mb-5 sm:rounded-[24px] sm:p-5"
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
                  className="mt-2 break-keep text-2xl font-black tracking-tight sm:text-4xl"
                  style={{ color: YELLOW_TEXT }}
                >
                  {weapon.name}
                </h1>
                <p className="mt-1 truncate text-xs text-zinc-500 sm:text-sm">
                  무기 상세 정보
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href="/weapons"
                  className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                >
                  목록으로
                </Link>
                <Link
                  href="/"
                  className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                >
                  홈으로
                </Link>
              </div>
            </div>
          </header>

          <div className="relative grid flex-1 items-center gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-6">
            <div className="relative order-1 min-h-[420px] lg:order-none lg:min-h-[780px]">
              <div className="absolute inset-x-[-8%] bottom-0 top-[-3%] lg:inset-x-[-4%]">
                <Image
                  src={heroImage}
                  alt={weapon.name}
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 62vw, 1120px"
                  className="object-contain object-center drop-shadow-[0_24px_42px_rgba(0,0,0,0.68)]"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/55 to-transparent" />
            </div>

            <aside className="relative order-2 z-10 min-w-0 lg:order-none">
              <div
                className="overflow-hidden rounded-[30px] bg-black/58 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-md sm:p-5 lg:p-6"
                style={{ border: `1px solid ${YELLOW_BORDER}` }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_20%_0%,rgba(255,210,74,0.12),transparent_32%)]" />
                <div className="relative">
                  <p
                    className="text-[10px] font-black tracking-[0.3em] sm:text-[11px]"
                    style={{ color: YELLOW_TEXT }}
                  >
                    WEAPON PROFILE
                  </p>

                  {!!weapon.enName && (
                    <p className="mt-3 break-words text-base font-bold text-zinc-300 sm:text-xl">
                      {weapon.enName}
                    </p>
                  )}

                  <h1 className="mt-2 break-keep text-[clamp(40px,10vw,76px)] font-black leading-none tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                    {weapon.name}
                  </h1>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <InfoBadge
                      label={rarityLabelMap[weapon.rarity]}
                      icon={rarityIcon}
                      highlight
                      borderColor={rarityColor}
                      textColor={rarityColor}
                    />
                    <InfoBadge label={weaponTypeLabel} icon={weaponTypeIcon} />
                    <InfoBadge label={abilityInfo.name} icon={mainStatIcon} />
                    <InfoBadge label={attributeInfo.name} />
                    <InfoBadge label={seriesSkillInfo.name} />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <InfoTile label="무기 종류" value={weaponTypeLabel} icon={weaponTypeIcon} />
                    <InfoTile label="레어도" value={rarityLabelMap[weapon.rarity]} icon={rarityIcon} />
                    <InfoTile label="기본 공격력" value={initialAttack} />
                    <InfoTile label="주 능력치" value={abilityInfo.name} icon={mainStatIcon} />
                    <InfoTile label="능력치 수치" value={abilityInfo.rank1Value} />
                    <InfoTile label="속성" value={attributeInfo.name} />
                  </div>

                  <div className="mt-5 rounded-3xl border border-yellow-500/10 bg-[#080b10]/80 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black text-zinc-400">빠른 이동</p>
                      <p className="text-[10px] font-bold text-yellow-200/70">
                        {sectionLinks.length} SECTIONS
                      </p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {sectionLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="rounded-2xl border border-yellow-500/10 bg-black/80 px-2 py-2.5 text-center text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:bg-yellow-400/10 hover:text-yellow-100"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-[1840px] px-3 py-3 sm:px-4 md:px-6 md:py-5">
        <nav className="sticky top-2 z-30 mb-3 rounded-[18px] border border-yellow-500/15 bg-black/90 p-2 backdrop-blur lg:hidden">
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

        <div className="grid min-w-0 gap-3 lg:gap-5">
          <DetailSection id="level" title="레벨별 능력치" defaultOpen>
            <WeaponLevelPanel levelStats={weapon.levelStats} />
          </DetailSection>

          <DetailSection id="summary" title="기본 능력치" defaultOpen>
            <div
              className="overflow-hidden rounded-[18px] bg-[#06080c] lg:rounded-[20px]"
              style={{ border: `1px solid ${YELLOW_BORDER}` }}
            >
              <BasicStatRow
                label={weapon.mainStatLabel ?? "공격력"}
                value={<span style={{ color: YELLOW_TEXT }}>{initialAttack}</span>}
              />
              <BasicStatRow
                label={abilityInfo.name}
                value={<span style={{ color: YELLOW_TEXT }}>{abilityInfo.rank1Value}</span>}
              />
              <BasicStatRow
                label={attributeInfo.name}
                value={<span style={{ color: YELLOW_TEXT }}>{attributeInfo.rank1Value}</span>}
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
            <DetailSection id="breakthrough" title="돌파" defaultOpen>
              <WeaponBreakthroughPanel
                breakthrough={weapon.breakthrough}
                accentColor={YELLOW_MAIN}
              />
            </DetailSection>
          )}
        </div>
      </div>
    </main>
  );
}
