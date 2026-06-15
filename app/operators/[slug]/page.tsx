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

// 속성별 포인트 컬러(캐릭터 accent). 노란색은 게임 UI 공통 포인트로 유지.
const elementAccent: Record<string, { color: string; glow: string }> = {
  physical: { color: "#d6dae3", glow: "rgba(214,218,227,0.22)" },
  cryo: { color: "#4fa3ff", glow: "rgba(79,163,255,0.40)" },
  heat: { color: "#ff8a1f", glow: "rgba(255,138,31,0.42)" },
  nature: { color: "#3ecf8e", glow: "rgba(62,207,142,0.36)" },
  electric: { color: "#c084fc", glow: "rgba(192,132,252,0.40)" },
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
const elementIconMap: Record<string, string> = {
  physical: "/icons/elements/physical.webp",
  cryo: "/icons/elements/cryo.webp",
  heat: "/icons/elements/heat.webp",
  nature: "/icons/elements/nature.webp",
  electric: "/icons/elements/electric.webp",
};

// 각진 코너(인게임 mech 패널 느낌)
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
};

function StatCell({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent: string;
  icon?: string;
}) {
  return (
    <div className="bg-ef-card px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2" style={{ background: accent }} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ef-muted">
          {label}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        {icon ? (
          <span className="relative h-4 w-4 shrink-0">
            <Image src={icon} alt="" fill sizes="16px" className="object-contain" />
          </span>
        ) : null}
        <p className="truncate text-lg font-black text-ef-accent-soft sm:text-xl">
          {value}
        </p>
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
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group scroll-mt-24 overflow-hidden border border-ef-line bg-ef-card"
      style={CUT}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 lg:px-5 lg:py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="h-4 w-1 shrink-0 bg-ef-accent" />
          <span className="min-w-0 truncate text-base font-black tracking-tight text-ef-accent-soft lg:text-lg">
            {title}
          </span>
        </span>
        <span className="shrink-0 font-mono text-xs text-ef-muted transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>
      <div className="min-w-0 border-t border-ef-line p-3 sm:p-4 lg:p-5">
        {children}
      </div>
    </details>
  );
}

// 정적 데이터 기반이므로 빌드 시 모든 슬러그를 프리렌더(SSG)한다 → CDN 캐시.
export function generateStaticParams() {
  return operatorDetails.map((operator) => ({ slug: operator.slug }));
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
  const adminSlides = [operator.fullImage, operator.fullImageSecondary].filter(
    (item): item is string => !!item,
  );
  const isAdminSlider = operator.name === "관리자" && adminSlides.length > 1;

  const accent = elementAccent[operator.element] ?? elementAccent.physical;
  const elementLabel = elementLabelMap[operator.element] ?? operator.element;
  const classLabel = classLabelMap[operator.class] ?? operator.class;
  const weaponLabel = weaponLabelMap[operator.weapon] ?? operator.weapon;
  const elementIcon = elementIconMap[operator.element];

  const sectionLinks = [
    { href: "#level", label: "스탯" },
    { href: "#skills", label: "스킬" },
    ...(operator.elite.length ? [{ href: "#elite", label: "정예화" }] : []),
    ...(operator.talents.length ? [{ href: "#talents", label: "재능" }] : []),
    ...(operator.infrastructureSkills.length
      ? [{ href: "#infra", label: "인프라" }]
      : []),
    ...(operator.trustBonus.length ? [{ href: "#trust", label: "신뢰도" }] : []),
    ...(operator.potential.length
      ? [{ href: "#potential", label: "잠재" }]
      : []),
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-ef-bg text-ef-ink">
      {/* ===== HERO — 캐릭터 중심 게임 UI (PC 좌우 분할 / 모바일 일러 배경) ===== */}
      <section className="relative min-h-[660px] overflow-hidden sm:min-h-[760px] lg:min-h-[88vh]">
        {/* 배경: 블러 일러 + 속성 글로우 + 그리드 HUD + 스크림 */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-125 object-cover object-top blur-2xl brightness-[0.3]"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(56% 46% at 70% 34%, ${accent.glow}, transparent 72%)`,
            }}
          />
          <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        {/* 선명한 캐릭터 풀 일러: 모바일=전면 cover / PC=우측 정렬 */}
        <div className="absolute inset-0 lg:left-[34%]">
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
              sizes="100vw"
              className="object-cover object-top drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] lg:object-contain lg:object-bottom"
            />
          )}
        </div>

        {/* 스크림: 모바일=하단 / PC=좌측(텍스트 가독) */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.15)_0%,rgba(5,5,5,0.45)_50%,#050505_96%)] lg:hidden" />
        <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,#050505_2%,rgba(5,5,5,0.86)_28%,rgba(5,5,5,0.2)_52%,transparent_66%)]" />

        {/* 상단 HUD 바 (빈 공간 제거 — 라벨 + 네비) */}
        <div className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between px-4 pt-5 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3" style={{ background: accent.color }} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">
              Operator File
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/operators"
              className="inline-flex min-h-9 items-center border border-ef-line bg-black/60 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
              style={CUT}
            >
              목록
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-9 items-center border border-ef-line bg-black/60 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
              style={CUT}
            >
              홈
            </Link>
          </div>
        </div>

        {/* 코너 브래킷 */}
        <span
          className="pointer-events-none absolute left-3 top-16 z-20 h-8 w-8 border-l-2 border-t-2 sm:left-6 lg:left-10"
          style={{ borderColor: `${accent.color}88` }}
        />

        {/* 콘텐츠: 모바일=하단 / PC=좌측 중앙 */}
        <div className="relative z-20 mx-auto flex min-h-[560px] max-w-[1400px] flex-col justify-end px-4 pb-8 sm:min-h-[660px] sm:px-6 lg:min-h-[76vh] lg:justify-center lg:px-10 lg:pb-0">
          <div className="lg:max-w-[460px]">
            {/* 속성 + 레어도 */}
            <div className="mb-3 flex items-center gap-2.5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-black"
                style={{ ...CUT, background: accent.color, color: "#050505" }}
              >
                {elementIcon ? (
                  <span className="relative inline-block h-3.5 w-3.5">
                    <Image
                      src={elementIcon}
                      alt=""
                      fill
                      sizes="14px"
                      className="object-contain"
                    />
                  </span>
                ) : null}
                {elementLabel}
              </span>
              <span className="text-base font-black tracking-widest text-ef-accent">
                {"★".repeat(operator.rarity)}
              </span>
            </div>

            {/* 이름 */}
            <div className="flex items-end gap-3">
              <span
                className="hidden h-24 w-1.5 shrink-0 sm:block"
                style={{
                  background: `linear-gradient(180deg, ${accent.color}, #ffd24a)`,
                }}
              />
              <div className="min-w-0">
                <h1 className="break-keep text-[clamp(44px,13vw,92px)] font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
                  {operator.name}
                </h1>
                <p
                  className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.26em] sm:text-base"
                  style={{ color: accent.color }}
                >
                  {operator.enName}
                </p>
              </div>
            </div>

            {/* 스탯 패널 강화: HP/ATK/DEF/속성/클래스/무기 */}
            <div
              className="mt-6 grid grid-cols-3 gap-px overflow-hidden border bg-ef-line"
              style={{ ...CUT, borderColor: `${accent.color}40` }}
            >
              <StatCell label="HP" value={operator.mainStats.hp.toLocaleString()} accent={accent.color} />
              <StatCell label="ATK" value={operator.mainStats.attack.toLocaleString()} accent={accent.color} />
              <StatCell label="DEF" value={operator.mainStats.defense.toLocaleString()} accent={accent.color} />
              <StatCell label="속성" value={elementLabel} accent={accent.color} icon={elementIcon} />
              <StatCell label="클래스" value={classLabel} accent={accent.color} />
              <StatCell label="무기" value={weaponLabel} accent={accent.color} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 본문 ===== */}
      <div className="relative mx-auto max-w-[1400px] px-3 py-4 sm:px-6 md:py-6 lg:px-10">
        {/* 기술 문서 스타일 섹션 탭 */}
        <QuickSectionNav links={sectionLinks} accent={accent.color} />

        {/* 인기 세팅(기능 보존) */}
        <div className="mb-3 lg:mb-5">
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
              accentColor={YELLOW_MAIN}
              skills={[
                operator.skills.normalAttack,
                operator.skills.battleSkill,
                operator.skills.comboSkill,
                operator.skills.ultimate,
              ]}
            />
          </DetailSection>
          {!!operator.elite.length && (
            <DetailSection id="elite" title="정예화" defaultOpen>
              <ElitePanel elite={operator.elite} />
            </DetailSection>
          )}
          {!!operator.talents.length && (
            <DetailSection id="talents" title="재능" defaultOpen>
              <TalentPanel items={operator.talents} accentColor={YELLOW_MAIN} />
            </DetailSection>
          )}
          {!!operator.infrastructureSkills.length && (
            <DetailSection id="infra" title="인프라 스킬" defaultOpen>
              <InfrastructureSkillPanel
                groups={operator.infrastructureSkills}
                accentColor={YELLOW_MAIN}
              />
            </DetailSection>
          )}
          {!!operator.trustBonus.length && (
            <DetailSection id="trust" title="신뢰도 보너스" defaultOpen>
              <TrustBonusPanel items={operator.trustBonus} />
            </DetailSection>
          )}
          {!!operator.potential.length && (
            <DetailSection id="potential" title="잠재능력" defaultOpen>
              <PotentialPanel items={operator.potential} />
            </DetailSection>
          )}
        </div>
      </div>
    </main>
  );
}
