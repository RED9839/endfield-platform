import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOperatorDetailBySlug } from "@/data/operators-detail-data";

import HeroSlider from "./HeroSlider";
import OperatorLevelPanel from "./OperatorLevelPanel";
import InteractiveSkillPanel from "./InteractiveSkillPanel";
import ElitePanel from "./ElitePanel";
import TalentPanel from "./TalentPanel";
import InfrastructureSkillPanel from "./InfrastructureSkillPanel";
import TrustBonusPanel from "./TrustBonusPanel";
import PotentialPanel from "./PotentialPanel";
import QuickSectionNav from "./QuickSectionNav";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function DetailSection({
  id,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
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

export default async function OperatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const operator = getOperatorDetailBySlug(slug);

  if (!operator) notFound();

  const panelAccentColor = YELLOW_MAIN;
  const heroImage = operator.fullImage || operator.avatar;

  const isAdminHeroSlider = operator.name === "관리자";
  const adminHeroSlides = [
    operator.fullImage,
    operator.fullImageSecondary,
  ].filter((item): item is string => !!item);

  const sectionLinks = [
    { href: "#level", label: "스탯" },
    { href: "#skills", label: "스킬" },
    ...(operator.elite.length ? [{ href: "#elite", label: "정예화" }] : []),
    ...(operator.talents.length ? [{ href: "#talents", label: "재능" }] : []),
    ...(operator.infrastructureSkills.length
      ? [{ href: "#infra", label: "인프라" }]
      : []),
    ...(operator.trustBonus.length ? [{ href: "#trust", label: "신뢰도" }] : []),
    ...(operator.potential.length ? [{ href: "#potential", label: "잠재" }] : []),
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
                오퍼레이터
              </h1>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                오퍼레이터 상세 정보
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Link
                href="/operators"
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

        {isAdminHeroSlider && adminHeroSlides.length > 1 ? (
          <div className="mb-3 overflow-hidden rounded-[20px] lg:mb-5 lg:rounded-[24px]">
            <HeroSlider
              images={adminHeroSlides}
              alt={operator.name}
              enName={operator.enName}
            />
          </div>
        ) : (
          <section
            className="relative mb-3 overflow-hidden rounded-[20px] bg-black shadow-[0_10px_28px_rgba(0,0,0,0.28)] lg:mb-5 lg:rounded-[24px]"
            style={{
              height: "clamp(320px, 58vw, 620px)",
              border: `1px solid ${YELLOW_BORDER}`,
            }}
          >
            <Image
              src={heroImage}
              alt={operator.name}
              fill
              priority
              sizes="100vw"
              className="object-cover blur-[16px] brightness-[0.25]"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={heroImage}
                alt={operator.name}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

            <div className="absolute bottom-4 left-4 z-10 lg:bottom-6 lg:left-6">
              <div className="text-[clamp(34px,10vw,88px)] font-black leading-none text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
                {operator.name}
              </div>

              <div className="mt-2 text-sm text-[#dbe4f0] drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] sm:text-xl">
                {operator.enName}
              </div>
            </div>
          </section>
        )}

        <QuickSectionNav links={sectionLinks} />

        <div className="grid gap-3 lg:gap-5">
          <DetailSection id="level" title="기본 정보 / 스탯" defaultOpen>
            <OperatorLevelPanel
              name={operator.name}
              enName={operator.enName}
              element={operator.element}
              operatorClass={operator.class}
              weapon={operator.weapon}
              rarity={operator.rarity}
              mainStatLabel={operator.mainStatLabel ?? ""}
              subStatLabel={operator.subStatLabel ?? ""}
              levelStats={operator.levelStats}
            />
          </DetailSection>

          <DetailSection id="skills" title="전투 스킬" defaultOpen>
            <div className="grid gap-3 lg:gap-4">
              <InteractiveSkillPanel
                skill={operator.skills.normalAttack}
                accentColor={panelAccentColor}
              />
              <InteractiveSkillPanel
                skill={operator.skills.battleSkill}
                accentColor={panelAccentColor}
              />
              <InteractiveSkillPanel
                skill={operator.skills.comboSkill}
                accentColor={panelAccentColor}
              />
              <InteractiveSkillPanel
                skill={operator.skills.ultimate}
                accentColor={panelAccentColor}
              />
            </div>
          </DetailSection>

          {!!operator.elite.length && (
            <DetailSection id="elite" title="정예화">
              <ElitePanel elite={operator.elite} />
            </DetailSection>
          )}

          {!!operator.talents.length && (
            <DetailSection id="talents" title="재능">
              <TalentPanel
                items={operator.talents}
                accentColor={panelAccentColor}
              />
            </DetailSection>
          )}

          {!!operator.infrastructureSkills.length && (
            <DetailSection id="infra" title="인프라 스킬">
              <InfrastructureSkillPanel
                groups={operator.infrastructureSkills}
                accentColor={panelAccentColor}
              />
            </DetailSection>
          )}

          {!!operator.trustBonus.length && (
            <DetailSection id="trust" title="신뢰도 보너스">
              <TrustBonusPanel items={operator.trustBonus} />
            </DetailSection>
          )}

          {!!operator.potential.length && (
            <DetailSection id="potential" title="잠재능력">
              <PotentialPanel items={operator.potential} />
            </DetailSection>
          )}
        </div>
      </div>
    </main>
  );
}