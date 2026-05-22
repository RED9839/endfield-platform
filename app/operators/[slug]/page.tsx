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

const HERO_IMAGE_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1840px";

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
      className="group scroll-mt-24 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_0_34px_rgba(250,204,21,0.04)] backdrop-blur lg:rounded-[26px]"
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

  const heroImage = operator.fullImage || operator.avatar;
  const panelAccentColor = YELLOW_MAIN;

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
    <main className="min-h-screen bg-[#050505] text-white">
      <section
        className="relative overflow-hidden border-b border-yellow-500/10"
        style={{ minHeight: "clamp(560px, 82vh, 860px)" }}
      >
        <Image
          src={heroImage}
          alt={operator.name}
          fill
          priority
          sizes={HERO_IMAGE_SIZES}
          className="object-cover blur-[18px] brightness-[0.25] scale-110"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,210,74,0.16),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.48),rgba(0,0,0,0.88))]" />

        <div className="relative z-10 mx-auto flex min-h-[clamp(560px,82vh,860px)] max-w-[1840px] flex-col px-3 py-3 sm:px-4 md:px-6 md:py-5">
          <header className="mb-4 flex items-center justify-between gap-3">
            <Link
              href="/operators"
              className="rounded-xl bg-black/60 px-3 py-2 text-xs font-black text-zinc-200 backdrop-blur transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              ← 목록
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-black/60 px-3 py-2 text-xs font-black text-zinc-200 backdrop-blur transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              홈
            </Link>
          </header>

          <div className="grid flex-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_460px] xl:grid-cols-[minmax(0,1fr)_520px]">
            <div className="relative min-h-[360px] overflow-hidden rounded-[24px] border border-yellow-500/15 bg-black/20 shadow-[0_18px_50px_rgba(0,0,0,0.45)] lg:min-h-[640px] lg:rounded-[30px]">
              {isAdminHeroSlider && adminHeroSlides.length > 1 ? (
                <HeroSlider
                  images={adminHeroSlides}
                  alt={operator.name}
                  enName={operator.enName}
                />
              ) : (
                <>
                  <Image
                    src={heroImage}
                    alt={operator.name}
                    fill
                    priority
                    sizes={HERO_IMAGE_SIZES}
                    className="object-contain object-center"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 to-transparent" />
                </>
              )}
            </div>

            <aside
              className="rounded-[24px] bg-black/68 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:rounded-[30px] lg:p-6"
              style={{ border: `1px solid ${YELLOW_BORDER}` }}
            >
              <p
                className="text-[10px] font-bold tracking-[0.32em] sm:text-[11px]"
                style={{ color: YELLOW_TEXT }}
              >
                엔드필드 오퍼레이터
              </p>

              <h1 className="mt-3 text-[clamp(38px,8vw,76px)] font-black leading-none tracking-tight text-white">
                {operator.name}
              </h1>

              <p className="mt-2 text-lg font-bold text-zinc-300">
                {operator.enName}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-black text-yellow-200">
                  {operator.element}
                </span>
                <span className="rounded-full border border-yellow-500/20 bg-white/5 px-3 py-1 text-xs font-black text-zinc-200">
                  {operator.class}
                </span>
                <span className="rounded-full border border-yellow-500/20 bg-white/5 px-3 py-1 text-xs font-black text-zinc-200">
                  {operator.weapon}
                </span>
                <span className="rounded-full border border-yellow-500/20 bg-white/5 px-3 py-1 text-xs font-black text-zinc-200">
                  {operator.rarity}성
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-yellow-500/10 bg-[#080b10] p-3">
                  <p className="text-[10px] font-bold text-zinc-500">주 능력치</p>
                  <p className="mt-1 text-sm font-black text-yellow-200">
                    {operator.mainStatLabel || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-500/10 bg-[#080b10] p-3">
                  <p className="text-[10px] font-bold text-zinc-500">보조 능력치</p>
                  <p className="mt-1 text-sm font-black text-yellow-200">
                    {operator.subStatLabel || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-yellow-500/10 bg-[#080b10]/95 p-3">
                <p className="text-xs font-black text-zinc-400">빠른 이동</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {sectionLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="rounded-xl border border-yellow-500/10 bg-black px-2 py-2 text-center text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1840px] px-3 py-3 sm:px-4 md:px-6 md:py-5">
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
