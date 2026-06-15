import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOperatorDetailBySlug,
  operatorDetails,
} from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

import HeroSlider from "./HeroSlider";
import OperatorLevelPanel from "./OperatorLevelPanel";
import OperatorSkillsDeck from "./OperatorSkillsDeck";
import ElitePanel from "./ElitePanel";
import TalentPanel from "./TalentPanel";
import InfrastructureSkillPanel from "./InfrastructureSkillPanel";
import TrustBonusPanel from "./TrustBonusPanel";
import PotentialPanel from "./PotentialPanel";
import QuickSectionNav from "./QuickSectionNav";
import PopularOperatorSettingsPanel from "./PopularOperatorSettingsPanel";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

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

const elementIconMap: Record<string, string> = {
  physical: "/icons/elements/physical.webp",
  cryo: "/icons/elements/cryo.webp",
  heat: "/icons/elements/heat.webp",
  nature: "/icons/elements/nature.webp",
  electric: "/icons/elements/electric.webp",
};

const classIconMap: Record<string, string> = {
  vanguard: "/icons/classes/vanguard.webp",
  guard: "/icons/classes/guard.webp",
  defender: "/icons/classes/defender.webp",
  supporter: "/icons/classes/supporter.webp",
  caster: "/icons/classes/caster.webp",
  striker: "/icons/classes/striker.webp",
};

const weaponIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
  artsunit: "/icons/weapons/artsunit.webp",
};

const statIconMap: Record<string, string> = {
  힘: "/icons/stats/strength.webp",
  민첩: "/icons/stats/agility.webp",
  지능: "/icons/stats/intelligence.webp",
  의지: "/icons/stats/will.webp",
};

function InlineIcon({ src, alt, size = 16 }: { src?: string; alt: string; size?: 14 | 16 | 18 | 20 }) {
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

function InfoBadge({ label, icon, highlight = false }: { label: string; icon?: string; highlight?: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black",
        highlight
          ? "border border-yellow-400/30 bg-yellow-400/15 text-yellow-100"
          : "border border-white/10 bg-white/5 text-zinc-200",
      ].join(" ")}
    >
      <InlineIcon src={icon} alt={label} size={16} />
      <span>{label}</span>
    </span>
  );
}

function InfoTile({ label, value, icon }: { label: string; value: string | number; icon?: string }) {
  return (
    <div className="rounded-2xl border border-yellow-500/10 bg-black/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-[10px] font-black tracking-[0.12em] text-zinc-500">{label}</p>
      <div className="mt-2 flex min-w-0 items-center gap-1.5">
        <InlineIcon src={icon} alt={label} size={18} />
        <p className="min-w-0 truncate text-sm font-black text-yellow-100">{value || "-"}</p>
      </div>
    </div>
  );
}

function DetailSection({ id, title, children, defaultOpen = false }: { id: string; title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details id={id} open={defaultOpen} className="group scroll-mt-24 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_14px_34px_rgba(0,0,0,0.24)] lg:rounded-[26px]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-4 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 text-base font-black tracking-tight lg:text-[22px]" style={{ color: YELLOW_TEXT }}>{title}</span>
        <span className="shrink-0 text-lg font-black text-yellow-300 transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="min-w-0 px-2 pb-3 sm:px-3 sm:pb-4 lg:px-5 lg:pb-5" style={{ borderTop: `1px solid ${YELLOW_BORDER_SOFT}` }}>{children}</div>
    </details>
  );
}

// 정적 데이터 기반이므로 빌드 시 모든 슬러그를 프리렌더(SSG)한다 → CDN 캐시.
export function generateStaticParams() {
  return operatorDetails.map((operator) => ({ slug: operator.slug }));
}

export default async function OperatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const operator = getOperatorDetailBySlug(slug);
  if (!operator) notFound();

  const heroImage = operator.fullImage || operator.avatar;
  const adminSlides = [operator.fullImage, operator.fullImageSecondary].filter((item): item is string => !!item);
  const elementLabel = elementLabelMap[operator.element] ?? operator.element;
  const classLabel = classLabelMap[operator.class] ?? operator.class;
  const weaponLabel = weaponLabelMap[operator.weapon] ?? operator.weapon;
  const elementIcon = elementIconMap[operator.element];
  const classIcon = classIconMap[operator.class];
  const weaponIcon = weaponIconMap[operator.weapon];
  const rarityIcon = `/icons/rarity/${operator.rarity}star.webp`;
  const mainStatIcon = statIconMap[operator.mainStatLabel || ""];
  const subStatIcon = statIconMap[operator.subStatLabel || ""];

  const sectionLinks = [
    { href: "#level", label: "스탯" },
    { href: "#skills", label: "스킬" },
    ...(operator.elite.length ? [{ href: "#elite", label: "정예화" }] : []),
    ...(operator.talents.length ? [{ href: "#talents", label: "재능" }] : []),
    ...(operator.infrastructureSkills.length ? [{ href: "#infra", label: "인프라" }] : []),
    ...(operator.trustBonus.length ? [{ href: "#trust", label: "신뢰도" }] : []),
    ...(operator.potential.length ? [{ href: "#potential", label: "잠재" }] : []),
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <section className="relative min-h-[760px] overflow-hidden border-b border-yellow-500/10 sm:min-h-[820px] lg:min-h-[920px]">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={operator.name} fill priority sizes="100vw" className="scale-110 object-cover blur-[18px] brightness-[0.2]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(255,210,74,0.18),transparent_28%),linear-gradient(180deg,rgba(5,5,5,0.1)_0%,rgba(5,5,5,0.78)_72%,#050505_100%),linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.34)_48%,rgba(0,0,0,0.86)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1840px] flex-col px-3 py-3 sm:min-h-[820px] sm:px-4 md:px-6 md:py-5 lg:min-h-[920px]">
          <header className="mb-4 rounded-[20px] bg-[#05070b]/92 p-4 shadow-[0_0_30px_rgba(250,204,21,0.04)] backdrop-blur-md sm:mb-5 sm:rounded-[24px] sm:p-5" style={{ border: `1px solid ${YELLOW_BORDER}` }}>
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.28em] sm:text-[11px] sm:tracking-[0.35em]" style={{ color: YELLOW_TEXT }}>엔드필드 지원 플랫폼</p>
                <h1 className="mt-2 break-keep text-2xl font-black tracking-tight sm:text-4xl" style={{ color: YELLOW_TEXT }}>{operator.name}</h1>
                <p className="mt-1 truncate text-xs text-zinc-500 sm:text-sm">오퍼레이터 상세 정보</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href="/operators" className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>목록으로</Link>
                <Link href="/" className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>홈으로</Link>
              </div>
            </div>
          </header>

          <div className="relative grid flex-1 items-center gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-6">
            <div className="relative order-1 min-h-[420px] lg:order-none lg:min-h-[780px]">
              <div className="absolute inset-x-[-18%] bottom-0 top-[-3%] sm:inset-x-[-10%] lg:inset-x-[-8%]">
                {operator.name === "관리자" && adminSlides.length > 1 ? (
                  <div className="relative h-full overflow-hidden rounded-[30px] border border-yellow-500/10 bg-black/20">
                    <HeroSlider images={adminSlides} alt={operator.name} enName={operator.enName} />
                  </div>
                ) : (
                  <Image src={heroImage} alt={operator.name} fill priority sizes="(max-width: 768px) 100vw, (max-width: 1280px) 62vw, 1120px" className="object-contain object-bottom drop-shadow-[0_24px_42px_rgba(0,0,0,0.68)]" />
                )}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/55 to-transparent" />
            </div>

            <aside className="relative order-2 z-10 min-w-0 lg:order-none">
              <PopularOperatorSettingsPanel
                operatorSlug={operator.slug}
                operatorName={operator.name}
                operators={operatorDetails.map((item) => ({
                  slug: item.slug,
                  name: item.name,
                  enName: item.enName,
                  avatar: item.avatar,
                  element: item.element,
                }))}
                weapons={weaponDetails.map((item) => ({
                  slug: item.slug,
                  name: item.name,
                  image: item.image,
                }))}
              />

              <div className="overflow-hidden rounded-[30px] bg-black/58 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-md sm:p-5 lg:p-6" style={{ border: `1px solid ${YELLOW_BORDER}` }}>
                <p className="text-[10px] font-black tracking-[0.3em] sm:text-[11px]" style={{ color: YELLOW_TEXT }}>OPERATOR PROFILE</p>
                <h1 className="mt-3 break-keep text-[clamp(42px,13vw,88px)] font-black leading-none tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">{operator.name}</h1>
                <p className="mt-2 break-words text-base font-bold text-zinc-300 sm:text-xl">{operator.enName}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <InfoBadge label={elementLabel} icon={elementIcon} highlight />
                  <InfoBadge label={classLabel} icon={classIcon} />
                  <InfoBadge label={weaponLabel} icon={weaponIcon} />
                  <InfoBadge label={`${operator.rarity}성`} icon={rarityIcon} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <InfoTile label="속성" value={elementLabel} icon={elementIcon} />
                  <InfoTile label="클래스" value={classLabel} icon={classIcon} />
                  <InfoTile label="무기" value={weaponLabel} icon={weaponIcon} />
                  <InfoTile label="레어도" value={`${operator.rarity}성`} icon={rarityIcon} />
                  <InfoTile label="주 능력치" value={operator.mainStatLabel || "-"} icon={mainStatIcon} />
                  <InfoTile label="보조 능력치" value={operator.subStatLabel || "-"} icon={subStatIcon} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-[1840px] px-3 py-3 sm:px-4 md:px-6 md:py-5">
        <div className="lg:hidden"><QuickSectionNav links={sectionLinks} /></div>
        <div className="grid min-w-0 gap-3 lg:gap-5">
          <DetailSection id="level" title="기본 정보 / 스탯" defaultOpen>
            <OperatorLevelPanel name={operator.name} enName={operator.enName} avatar={operator.avatar} element={operator.element} operatorClass={operator.class} weapon={operator.weapon} rarity={operator.rarity} mainStatLabel={operator.mainStatLabel ?? ""} subStatLabel={operator.subStatLabel ?? ""} levelStats={operator.levelStats} />
          </DetailSection>
          <DetailSection id="skills" title="전투 스킬" defaultOpen>
            <OperatorSkillsDeck accentColor={YELLOW_MAIN} skills={[operator.skills.normalAttack, operator.skills.battleSkill, operator.skills.comboSkill, operator.skills.ultimate]} />
          </DetailSection>
          {!!operator.elite.length && <DetailSection id="elite" title="정예화" defaultOpen><ElitePanel elite={operator.elite} /></DetailSection>}
          {!!operator.talents.length && <DetailSection id="talents" title="재능" defaultOpen><TalentPanel items={operator.talents} accentColor={YELLOW_MAIN} /></DetailSection>}
          {!!operator.infrastructureSkills.length && <DetailSection id="infra" title="인프라 스킬" defaultOpen><InfrastructureSkillPanel groups={operator.infrastructureSkills} accentColor={YELLOW_MAIN} /></DetailSection>}
          {!!operator.trustBonus.length && <DetailSection id="trust" title="신뢰도 보너스" defaultOpen><TrustBonusPanel items={operator.trustBonus} /></DetailSection>}
          {!!operator.potential.length && <DetailSection id="potential" title="잠재능력" defaultOpen><PotentialPanel items={operator.potential} /></DetailSection>}
        </div>
      </div>
    </main>
  );
}
