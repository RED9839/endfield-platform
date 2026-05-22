import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOperatorDetailBySlug } from "@/data/operators-detail-data";

import HeroSlider from "./HeroSlider";
import OperatorLevelPanel from "./OperatorLevelPanel";
import OperatorSkillsDeck from "./OperatorSkillsDeck";
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
  "(max-width: 768px) 100vw, (max-width: 1280px) 62vw, 1120px";

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

function InfoTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-yellow-500/10 bg-black/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-[10px] font-black tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-yellow-100">
        {value || "-"}
      </p>
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

  const heroImage = operator.fullImage || operator.avatar;
  const panelAccentColor = YELLOW_MAIN;

  const isAdminHeroSlider = operator.name === "관리자";
  const adminHeroSlides = [
    operator.fullImage,
    operator.fullImageSecondary,
  ].filter((item): item is string => !!item);

  const elementLabel = elementLabelMap[operator.element] ?? operator.element;
  const classLabel = classLabelMap[operator.class] ?? operator.class;
  const weaponLabel = weaponLabelMap[operator.weapon] ?? operator.weapon;

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
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <section className="relative min-h-[760px] overflow-hidden border-b border-yellow-500/10 sm:min-h-[820px] lg:min-h-[920px]">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={operator.name}
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover blur-[18px] brightness-[0.2]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(255,210,74,0.18),transparent_28%),radial-gradient(circle_at_24%_70%,rgba(255,210,74,0.08),transparent_32%),linear-gradient(180deg,rgba(5,5,5,0.1)_0%,rgba(5,5,5,0.78)_72%,#050505_100%),linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.34)_48%,rgba(0,0,0,0.86)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1840px] flex-col px-3 py-3 sm:min-h-[820px] sm:px-4 md:px-6 md:py-5 lg:min-h-[920px]">
          <header className="mb-4 flex items-center justify-between gap-3">
            <Link
              href="/operators"
              className="rounded-xl bg-black/55 px-3 py-2 text-xs font-black text-zinc-200 shadow-[0_10px_22px_rgba(0,0,0,0.28)] transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              ← 목록
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-black/55 px-3 py-2 text-xs font-black text-zinc-200 shadow-[0_10px_22px_rgba(0,0,0,0.28)] transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              홈
            </Link>
          </header>

          <div className="relative grid flex-1 items-center gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-6">
            <div className="relative order-1 min-h-[420px] lg:order-none lg:min-h-[780px]">
              <div className="absolute inset-x-[-18%] bottom-0 top-[-3%] sm:inset-x-[-10%] lg:inset-x-[-8%]">
                {isAdminHeroSlider && adminHeroSlides.length > 1 ? (
                  <div className="relative h-full overflow-hidden rounded-[30px] border border-yellow-500/10 bg-black/20">
                    <HeroSlider
                      images={adminHeroSlides}
                      alt={operator.name}
                      enName={operator.enName}
                    />
                  </div>
                ) : (
                  <Image
                    src={heroImage}
                    alt={operator.name}
                    fill
                    priority
                    sizes={HERO_IMAGE_SIZES}
                    className="object-contain object-bottom drop-shadow-[0_24px_42px_rgba(0,0,0,0.68)]"
                  />
                )}
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
                    OPERATOR PROFILE
                  </p>

                  <h1 className="mt-3 break-keep text-[clamp(42px,13vw,88px)] font-black leading-none tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                    {operator.name}
                  </h1>

                  <p className="mt-2 break-words text-base font-bold text-zinc-300 sm:text-xl">
                    {operator.enName}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/15 px-3 py-1.5 text-xs font-black text-yellow-100">
                      {elementLabel}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-zinc-200">
                      {classLabel}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-zinc-200">
                      {weaponLabel}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-zinc-200">
                      {operator.rarity}성
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <InfoTile label="속성" value={elementLabel} />
                    <InfoTile label="클래스" value={classLabel} />
                    <InfoTile label="무기" value={weaponLabel} />
                    <InfoTile label="레어도" value={`${operator.rarity}성`} />
                    <InfoTile label="주 능력치" value={operator.mainStatLabel || "-"} />
                    <InfoTile label="보조 능력치" value={operator.subStatLabel || "-"} />
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
        <div className="lg:hidden">
          <QuickSectionNav links={sectionLinks} />
        </div>

        <div className="grid min-w-0 gap-3 lg:gap-5">
          <DetailSection id="level" title="기본 정보 / 스탯" defaultOpen>
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
          </DetailSection>

          <DetailSection id="skills" title="전투 스킬" defaultOpen>
            <OperatorSkillsDeck
              accentColor={panelAccentColor}
              skills={[
                operator.skills.normalAttack,
                operator.skills.battleSkill,
                operator.skills.comboSkill,
                operator.skills.ultimate,
              ]}
            />
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
