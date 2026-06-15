"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { OperatorDetail } from "@/data/operators-transformers";

import ElitePanel from "./ElitePanel";
import HeroSlider from "./HeroSlider";
import InfrastructureSkillPanel from "./InfrastructureSkillPanel";
import OperatorLevelPanel from "./OperatorLevelPanel";
import OperatorSkillsDeck from "./OperatorSkillsDeck";
import PopularOperatorSettingsPanel from "./PopularOperatorSettingsPanel";
import PotentialPanel from "./PotentialPanel";
import TalentPanel from "./TalentPanel";
import TrustBonusPanel from "./TrustBonusPanel";

type PopularOperatorItem = {
  slug: string;
  name: string;
  enName: string;
  avatar: string;
  element: string;
};
type PopularWeaponItem = { slug: string; name: string; image: string };

const YELLOW = "#ffd24a";

const elementAccent: Record<string, { color: string; glow: string }> = {
  physical: { color: "#d6dae3", glow: "rgba(214,218,227,0.20)" },
  cryo: { color: "#4fa3ff", glow: "rgba(79,163,255,0.38)" },
  heat: { color: "#ff8a1f", glow: "rgba(255,138,31,0.40)" },
  nature: { color: "#3ecf8e", glow: "rgba(62,207,142,0.34)" },
  electric: { color: "#c084fc", glow: "rgba(192,132,252,0.38)" },
};
const elementLabelMap: Record<string, string> = {
  physical: "물리",
  cryo: "냉기",
  heat: "열기",
  nature: "자연",
  electric: "전기",
};
const classLabelMap: Record<string, string> = {
  vanguard: "뱅가드",
  guard: "가드",
  defender: "디펜더",
  supporter: "서포터",
  caster: "캐스터",
  striker: "스트라이커",
};
const weaponLabelMap: Record<string, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};

const CUT12 = {
  clipPath:
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
};

type Section = { id: string; label: string; en: string; node: React.ReactNode };

export default function OperatorDetailView({
  operator,
  operators,
  weapons,
}: {
  operator: OperatorDetail;
  operators: PopularOperatorItem[];
  weapons: PopularWeaponItem[];
}) {
  const accent = elementAccent[operator.element] ?? elementAccent.physical;
  const heroImage = operator.fullImage || operator.avatar;
  const adminSlides = [operator.fullImage, operator.fullImageSecondary].filter(
    (item): item is string => !!item,
  );
  const isAdminSlider = operator.name === "관리자" && adminSlides.length > 1;
  const elementIcon = `/icons/elements/${operator.element}.webp`;

  const sections: Section[] = [
    {
      id: "stats",
      label: "스탯",
      en: "ATTRIBUTE DATA",
      node: (
        <OperatorLevelPanel
          name={operator.name}
          enName={operator.enName}
          avatar={operator.avatar}
          element={operator.element}
          operatorClass={operator.class}
          weapon={operator.weapon}
          rarity={operator.rarity}
          mainStatLabel={operator.mainStatLabel ?? ""}
          subStatLabel={operator.subStatLabel ?? ""}
          levelStats={operator.levelStats}
        />
      ),
    },
    {
      id: "skills",
      label: "스킬",
      en: "SKILL DATA",
      node: (
        <OperatorSkillsDeck
          accentColor={accent.color}
          skills={[
            operator.skills.normalAttack,
            operator.skills.battleSkill,
            operator.skills.comboSkill,
            operator.skills.ultimate,
          ]}
        />
      ),
    },
    ...(operator.elite.length
      ? [
          {
            id: "elite",
            label: "정예화",
            en: "PROMOTION DATA",
            node: <ElitePanel elite={operator.elite} />,
          },
        ]
      : []),
    ...(operator.talents.length
      ? [
          {
            id: "talents",
            label: "재능",
            en: "TACTICAL DATA",
            node: <TalentPanel items={operator.talents} accentColor={accent.color} />,
          },
        ]
      : []),
    ...(operator.infrastructureSkills.length
      ? [
          {
            id: "infra",
            label: "인프라",
            en: "FACILITY DATA",
            node: (
              <InfrastructureSkillPanel
                groups={operator.infrastructureSkills}
                accentColor={accent.color}
              />
            ),
          },
        ]
      : []),
    ...(operator.trustBonus.length
      ? [
          {
            id: "trust",
            label: "신뢰도",
            en: "TRUST DATA",
            node: <TrustBonusPanel items={operator.trustBonus} />,
          },
        ]
      : []),
    ...(operator.potential.length
      ? [
          {
            id: "potential",
            label: "잠재",
            en: "POTENTIAL DATA",
            node: <PotentialPanel items={operator.potential} />,
          },
        ]
      : []),
    {
      id: "settings",
      label: "세팅",
      en: "POPULAR SETTINGS",
      node: (
        <PopularOperatorSettingsPanel
          accent={accent.color}
          operatorSlug={operator.slug}
          operatorName={operator.name}
          operators={operators}
          weapons={weapons}
        />
      ),
    },
  ];

  const [tabId, setTabId] = useState(sections[0].id);
  const active = sections.find((section) => section.id === tabId) ?? sections[0];

  return (
    <main className="relative min-h-screen bg-ef-bg text-ef-ink">
      {/* 배경 데이터 레이어 */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-50 [background-image:repeating-linear-gradient(180deg,transparent_0,transparent_2px,rgba(0,0,0,0.4)_3px)]" />

      {/* 상단 HUD 바 */}
      <div className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: accent.color }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">
            Operator File
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ef-muted/60 sm:inline">
            {`// ID:${operator.slug.toUpperCase()}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/operators"
            className="inline-flex min-h-9 items-center border border-ef-line bg-black/60 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT12}
          >
            목록
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-9 items-center border border-ef-line bg-black/60 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT12}
          >
            홈
          </Link>
        </div>
      </div>

      {/* 2컬럼: 좌 캐릭터(고정) / 우 데이터 */}
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-4 px-3 pb-28 sm:px-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-6 lg:px-8 lg:pb-10">
        {/* ===== LEFT: 압축 Hero ===== */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <section
            className="relative overflow-hidden border border-ef-line"
            style={CUT12}
          >
            <div className="relative h-[40vh] min-h-[300px] sm:h-[44vh] lg:h-[420px]">
              <Image
                src={heroImage}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
                className="scale-125 object-cover object-top blur-2xl brightness-[0.32]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(60% 50% at 60% 30%, ${accent.glow}, transparent 72%)`,
                }}
              />
              <div className="absolute inset-0">
                {isAdminSlider ? (
                  <HeroSlider
                    images={adminSlides}
                    alt={operator.name}
                    enName={operator.enName}
                  />
                ) : (
                  <Image
                    src={heroImage}
                    alt={operator.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover object-top"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(11,11,11,0.6)_70%,#0b0b0b_100%)]" />

              {/* 코너 브래킷 */}
              <span className="pointer-events-none absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2" style={{ borderColor: `${accent.color}88` }} />
              <span className="pointer-events-none absolute right-2 top-2 h-6 w-6 border-r-2 border-t-2" style={{ borderColor: `${accent.color}55` }} />

              {/* 아이덴티티 오버레이 */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black"
                    style={{ ...CUT12, background: accent.color, color: "#050505" }}
                  >
                    <span className="relative inline-block h-3.5 w-3.5">
                      <Image src={elementIcon} alt="" fill sizes="14px" className="object-contain" />
                    </span>
                    {elementLabelMap[operator.element] ?? operator.element}
                  </span>
                  <span className="text-sm font-black tracking-widest text-ef-accent">
                    {"★".repeat(operator.rarity)}
                  </span>
                </div>
                <h1 className="break-keep text-[clamp(34px,9vw,52px)] font-black leading-[0.92] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)]">
                  {operator.name}
                </h1>
                <p
                  className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.24em]"
                  style={{ color: accent.color }}
                >
                  {operator.enName}
                </p>
              </div>
            </div>

            {/* 아이덴티티 칩 (스탯은 스탯 탭으로 통합 — 중복 제거) */}
            <div className="grid grid-cols-3 gap-px bg-ef-line">
              {[
                ["CLASS", classLabelMap[operator.class] ?? operator.class],
                ["WEAPON", weaponLabelMap[operator.weapon] ?? operator.weapon],
                ["RARITY", `${operator.rarity}★`],
              ].map(([en, value]) => (
                <div key={en} className="bg-ef-card px-2.5 py-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-ef-muted">{en}</p>
                  <p className="mt-0.5 truncate text-sm font-black text-ef-ink">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ===== RIGHT: 탭 + 활성 섹션 ===== */}
        <div className="min-w-0">
          {/* 탭바: 모바일=하단 고정(한 손) / PC=우측 상단 정적 */}
          <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t border-ef-line bg-black/92 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:static lg:z-auto lg:border lg:bg-black/85 lg:px-1 lg:pb-0"
            style={{ clipPath: undefined }}
          >
            <div className="flex items-center gap-0.5 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="ml-2 mr-1 hidden shrink-0 items-center gap-1.5 lg:flex">
                <span className="h-2 w-2" style={{ background: accent.color }} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ef-muted">
                  Index
                </span>
              </span>
              {sections.map((section, index) => {
                const isActive = section.id === tabId;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setTabId(section.id)}
                    className="group relative inline-flex min-h-11 shrink-0 items-center gap-1.5 px-3"
                    style={isActive ? { background: `${accent.color}1f` } : undefined}
                  >
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: isActive ? accent.color : "#a0a0a0" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-xs font-black transition sm:text-sm ${
                        isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                      }`}
                    >
                      {section.label}
                    </span>
                    <span
                      className={`absolute inset-x-1.5 bottom-0 h-0.5 transition ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      style={{ background: accent.color }}
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* 활성 섹션 헤더 + 콘텐츠 */}
          <div className="mt-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3.5 w-1" style={{ background: accent.color }} />
              <span className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">
                {active.en}
              </span>
              <span className="ml-auto font-mono text-[10px] tracking-[0.2em] text-ef-muted/60">
                {String(sections.findIndex((s) => s.id === active.id) + 1).padStart(2, "0")}/
                {String(sections.length).padStart(2, "0")}
              </span>
            </div>
            <div className="min-w-0">{active.node}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
