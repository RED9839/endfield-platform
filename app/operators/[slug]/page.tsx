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

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function PageSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-3 mt-5 text-[22px] font-black tracking-tight"
      style={{ color: YELLOW_TEXT }}
    >
      {children}
    </div>
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

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-6 text-white md:px-6">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-6 rounded-[24px] bg-[#05070b] p-5 shadow-[0_0_30px_rgba(250,204,21,0.04)]"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="text-[11px] font-semibold tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                ENDFIELD SUPPORT PLATFORM
              </p>

              <h1
                className="mt-2 text-4xl font-black tracking-tight"
                style={{ color: YELLOW_TEXT }}
              >
                OPERATORS
              </h1>

              <p className="mt-1 text-sm text-zinc-500">Operator Detail</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/operators"
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018]"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                목록으로
              </Link>

              <Link
                href="/"
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018]"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                홈으로
              </Link>
            </div>
          </div>
        </header>

        {isAdminHeroSlider && adminHeroSlides.length > 1 ? (
          <HeroSlider
            images={adminHeroSlides}
            alt={operator.name}
            enName={operator.enName}
          />
        ) : (
          <section
            className="relative mb-5 overflow-hidden rounded-[24px] bg-black shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
            style={{
              height: "min(58vw, 620px)",
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

            <div className="absolute bottom-6 left-6 z-10">
              <div className="text-[clamp(42px,5vw,88px)] font-black leading-none text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
                {operator.name}
              </div>
              <div className="mt-2 text-xl text-[#dbe4f0] drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                {operator.enName}
              </div>
            </div>
          </section>
        )}

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

        <PageSectionTitle>전투 스킬</PageSectionTitle>

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

        {!!operator.elite.length && (
          <>
            <PageSectionTitle>정예화</PageSectionTitle>
            <ElitePanel elite={operator.elite} />
          </>
        )}

        {!!operator.talents.length && (
          <>
            <PageSectionTitle>재능</PageSectionTitle>
            <TalentPanel
              items={operator.talents}
              accentColor={panelAccentColor}
            />
          </>
        )}

        {!!operator.infrastructureSkills.length && (
          <>
            <PageSectionTitle>인프라 스킬</PageSectionTitle>
            <InfrastructureSkillPanel
              groups={operator.infrastructureSkills}
              accentColor={panelAccentColor}
            />
          </>
        )}

        {!!operator.trustBonus.length && (
          <>
            <PageSectionTitle>신뢰도 보너스</PageSectionTitle>
            <TrustBonusPanel items={operator.trustBonus} />
          </>
        )}

        {!!operator.potential.length && (
          <>
            <PageSectionTitle>잠재능력</PageSectionTitle>
            <PotentialPanel items={operator.potential} />
          </>
        )}
      </div>
    </main>
  );
}