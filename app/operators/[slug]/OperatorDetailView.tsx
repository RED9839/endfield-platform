"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const elementAccent: Record<string, { color: string; glow: string }> = {
  physical: { color: "#d6dae3", glow: "rgba(214,218,227,0.22)" },
  cryo: { color: "#4fa3ff", glow: "rgba(79,163,255,0.42)" },
  heat: { color: "#ff8a1f", glow: "rgba(255,138,31,0.46)" },
  nature: { color: "#3ecf8e", glow: "rgba(62,207,142,0.40)" },
  electric: { color: "#c084fc", glow: "rgba(192,132,252,0.42)" },
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
const classRoleMap: Record<string, string> = {
  vanguard: "선봉 · 자원",
  guard: "근접 딜러",
  defender: "방어",
  supporter: "지원",
  caster: "원거리 딜러",
  striker: "돌격 딜러",
};
const weaponLabelMap: Record<string, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};

const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
};

type TopBuild = {
  id: string;
  title: string;
  likeCount?: number;
  viewCount?: number;
  nickname?: string | null;
  userNickname?: string | null;
  slotsSummary?: {
    mainOperatorSlug?: string;
    mainWeaponSlug?: string;
    memberOperatorSlugs?: string[];
  };
};

type TabId = "data" | "skill" | "build" | "material" | "archive";

function SubHeader({ en, accent }: { en: string; accent: string }) {
  return (
    <div className="mb-2 mt-1 flex items-center gap-2">
      <span className="h-3.5 w-1" style={{ background: accent }} />
      <span className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">
        {en}
      </span>
    </div>
  );
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ef-muted">
      {children}
    </span>
  );
}

function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center border border-dashed border-ef-line bg-ef-card px-6 py-12 text-center"
      style={CUT}
    >
      <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-muted">
        {title}
      </p>
      <p className="mt-2 max-w-xs text-xs leading-5 text-ef-muted/70">{note}</p>
    </div>
  );
}

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
  const role = classRoleMap[operator.class] ?? "오퍼레이터";
  const elementLabel = elementLabelMap[operator.element] ?? operator.element;
  const maxLevel =
    Array.isArray(operator.levelStats) && operator.levelStats.length
      ? Math.max(...operator.levelStats.map((row) => row.level))
      : 90;

  const [tab, setTab] = useState<TabId>("data");
  const [topBuild, setTopBuild] = useState<TopBuild | null>(null);
  const [topBuildLoading, setTopBuildLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams({
      operators: operator.slug,
      sort: "popular",
      limit: "1",
      page: "1",
    });
    fetch(`/api/operator-settings?${params.toString()}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!mounted) return;
        setTopBuild(data?.settings?.[0] ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setTopBuildLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [operator.slug]);

  const operatorBySlug = new Map(operators.map((item) => [item.slug, item]));
  const topWeapon = topBuild?.slotsSummary?.mainWeaponSlug
    ? weapons.find((weapon) => weapon.slug === topBuild.slotsSummary?.mainWeaponSlug)
    : undefined;
  const partySlugs = [
    operator.slug,
    ...(topBuild?.slotsSummary?.memberOperatorSlugs ?? []),
  ]
    .filter(Boolean)
    .slice(0, 4);

  const tabs: { id: TabId; label: string }[] = [
    { id: "data", label: "DATA" },
    { id: "skill", label: "SKILL" },
    { id: "build", label: "BUILD" },
    { id: "material", label: "MATERIAL" },
    { id: "archive", label: "ARCHIVE" },
  ];

  return (
    <main className="relative min-h-screen bg-ef-bg text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-50 [background-image:repeating-linear-gradient(180deg,transparent_0,transparent_2px,rgba(0,0,0,0.4)_3px)]" />

      {/* HUD */}
      <div className="relative z-20 mx-auto flex max-w-[1840px] items-center justify-between px-3 py-2.5 sm:px-6 lg:px-7">
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
          <Link href="/operators" className="inline-flex min-h-9 items-center border border-ef-line bg-black/60 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>
            목록
          </Link>
          <Link href="/" className="inline-flex min-h-9 items-center border border-ef-line bg-black/60 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>
            홈
          </Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1840px] gap-4 px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-6 lg:px-7 lg:pb-12">
        {/* ============ LEFT: 캐릭터 지배 패널 (PC 풀하이트 sticky) ============ */}
        <div className="lg:sticky lg:top-3 lg:h-[calc(100vh-1.25rem)]">
          <section className="flex h-full flex-col overflow-hidden border border-ef-line bg-ef-card" style={CUT}>
            {/* 캐릭터 일러 — object-contain bottom 으로 전신 부각 */}
            <div className="relative min-h-[300px] flex-1 overflow-hidden">
              <Image src={heroImage} alt="" fill priority sizes="(max-width:1024px) 100vw, 460px" className="scale-110 object-cover object-center blur-2xl brightness-[0.4]" />
              <div className="absolute inset-0" style={{ background: `radial-gradient(46% 38% at 50% 30%, ${accent.glow}, transparent 70%)` }} />
              <div className="absolute inset-0">
                {isAdminSlider ? (
                  <HeroSlider images={adminSlides} alt={operator.name} enName={operator.enName} />
                ) : (
                  <Image src={heroImage} alt={operator.name} fill priority sizes="(max-width:1024px) 100vw, 460px" className="object-cover object-[center_18%]" />
                )}
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_46%,rgba(11,11,11,0.55)_78%,#0b0b0b_100%)]" />

              {/* HUD 프레임 */}
              <span className="pointer-events-none absolute left-2.5 top-2.5 h-7 w-7 border-l-2 border-t-2" style={{ borderColor: `${accent.color}99` }} />
              <span className="pointer-events-none absolute right-2.5 top-2.5 h-7 w-7 border-r-2 border-t-2" style={{ borderColor: `${accent.color}66` }} />
              <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-end gap-1.5">
                {Array.from({ length: 7 }).map((_, index) => (
                  <span key={index} className="block h-px" style={{ width: index % 3 === 0 ? 16 : 8, background: index % 3 === 0 ? accent.color : "#3a3a3a" }} />
                ))}
              </div>

              {/* 아이덴티티 오버레이 */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black" style={{ ...CUT, background: accent.color, color: "#050505" }}>
                    <span className="relative inline-block h-3.5 w-3.5">
                      <Image src={elementIcon} alt="" fill sizes="14px" className="object-contain" />
                    </span>
                    {elementLabel}
                  </span>
                  <span className="text-sm font-black tracking-widest text-ef-accent">{"★".repeat(operator.rarity)}</span>
                </div>
                <h1 className="break-keep text-[clamp(34px,9vw,54px)] font-black leading-[0.9] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">
                  {operator.name}
                </h1>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.24em]" style={{ color: accent.color }}>{operator.enName}</span>
                  <span className="h-3 w-px bg-ef-line" />
                  <span className="text-xs font-black text-ef-ink">{role}</span>
                </div>
              </div>
            </div>

            {/* 메타: 정체성 + GROWTH + RECOMMENDED BUILD (좌측 sticky 활용 극대화) */}
            <div className="shrink-0 border-t border-ef-line">
              <div className="grid grid-cols-3 gap-px bg-ef-line">
                {[
                  ["CLASS", classLabelMap[operator.class] ?? operator.class],
                  ["WEAPON", weaponLabelMap[operator.weapon] ?? operator.weapon],
                  ["MAIN", operator.mainStatLabel || "-"],
                ].map(([en, value]) => (
                  <div key={en} className="bg-ef-card px-3 py-2.5">
                    <MetaLabel>{en}</MetaLabel>
                    <p className="mt-0.5 truncate text-sm font-black text-ef-ink">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-px border-t border-ef-line bg-ef-line">
                {[
                  ["MAX LV", String(maxLevel)],
                  ["정예화", `${operator.elite.length}단계`],
                  ["주 능력치", operator.mainStatLabel || "-"],
                ].map(([en, value]) => (
                  <div key={en} className="bg-ef-card px-3 py-2.5">
                    <MetaLabel>{en}</MetaLabel>
                    <p className="mt-0.5 truncate text-base font-black" style={{ color: accent.color }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* RECOMMENDED BUILD — Hero급 콘텐츠 */}
              <div className="border-t-2 p-3.5" style={{ borderTopColor: `${accent.color}66` }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm" style={{ color: accent.color }}>★</span>
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">Recommended Build</span>
                  </div>
                  <button type="button" onClick={() => setTab("build")} className="font-mono text-[10px] font-black uppercase tracking-wide text-ef-muted transition hover:text-ef-accent-soft">전체 →</button>
                </div>

                {topBuildLoading ? (
                  <div className="mt-3 h-20 animate-pulse bg-ef-card2" />
                ) : topBuild ? (
                  <button type="button" onClick={() => setTab("build")} className="mt-3 block w-full border border-ef-line bg-ef-card2 p-3 text-left transition hover:border-ef-accent/40" style={CUT}>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <MetaLabel>Weapon</MetaLabel>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="relative h-7 w-7 shrink-0 overflow-hidden border border-ef-line bg-black">
                            {topWeapon?.image ? (
                              <Image src={topWeapon.image} alt="" fill sizes="28px" className="object-cover" />
                            ) : null}
                          </span>
                          <span className="truncate text-xs font-black text-ef-ink">{topWeapon?.name ?? "—"}</span>
                        </div>
                      </div>
                      <div>
                        <MetaLabel>Attribute</MetaLabel>
                        <p className="mt-1 truncate text-xs font-black" style={{ color: accent.color }}>
                          {operator.mainStatLabel || "-"}{operator.subStatLabel ? ` · ${operator.subStatLabel}` : ""}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <MetaLabel>Party</MetaLabel>
                        <div className="mt-1 flex items-center gap-1">
                          {partySlugs.map((slug) => {
                            const member = operatorBySlug.get(slug);
                            const img = member?.avatar ?? `/operators/${slug}/avatar.webp`;
                            return (
                              <span key={slug} className="relative h-7 w-7 shrink-0 overflow-hidden border border-ef-line bg-black">
                                <Image src={img} alt="" fill sizes="28px" className="object-cover object-top" />
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-ef-line pt-2">
                      <span className="truncate text-[11px] font-bold text-ef-muted">{topBuild.title}</span>
                      <span className="shrink-0 text-[11px] font-black" style={{ color: accent.color }}>♥ {topBuild.likeCount ?? 0}</span>
                    </div>
                  </button>
                ) : (
                  <div className="mt-3 border border-ef-line bg-ef-card2 p-3 text-center" style={CUT}>
                    <p className="text-xs text-ef-muted">아직 추천 빌드가 없습니다.</p>
                    <Link href="/settings/party" className="mt-2 inline-flex px-3 py-1.5 text-xs font-black text-black" style={{ background: accent.color }}>첫 빌드 등록</Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ============ RIGHT: 탭 + 콘텐츠 ============ */}
        <div className="min-w-0">
          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ef-line bg-black/92 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:static lg:z-auto lg:border lg:bg-black/85 lg:px-1.5 lg:pb-0">
            <div className="mx-auto flex max-w-[1840px] items-center gap-1 overflow-x-auto py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:max-w-none">
              {tabs.map((item, index) => {
                const isActive = item.id === tab;
                return (
                  <button key={item.id} type="button" onClick={() => setTab(item.id)} className="group relative inline-flex min-h-11 flex-1 shrink-0 items-center justify-center gap-1.5 px-3 lg:flex-none lg:justify-start" style={isActive ? { background: `${accent.color}1f` } : undefined}>
                    <span className="font-mono text-[10px] font-bold" style={{ color: isActive ? accent.color : "#a0a0a0" }}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={`font-mono text-xs font-black tracking-wide transition ${isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>{item.label}</span>
                    <span className={`absolute inset-x-2 bottom-0 h-0.5 transition ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} style={{ background: accent.color }} />
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="mt-3 grid min-w-0 gap-4">
            {tab === "data" ? (
              <>
                <div>
                  <SubHeader en="Attribute Data" accent={accent.color} />
                  <OperatorLevelPanel name={operator.name} enName={operator.enName} avatar={operator.avatar} element={operator.element} operatorClass={operator.class} weapon={operator.weapon} rarity={operator.rarity} mainStatLabel={operator.mainStatLabel ?? ""} subStatLabel={operator.subStatLabel ?? ""} levelStats={operator.levelStats} />
                </div>
                {operator.trustBonus.length ? (
                  <div>
                    <SubHeader en="Trust Data" accent={accent.color} />
                    <TrustBonusPanel items={operator.trustBonus} />
                  </div>
                ) : null}
                {operator.potential.length ? (
                  <div>
                    <SubHeader en="Potential Data" accent={accent.color} />
                    <PotentialPanel items={operator.potential} />
                  </div>
                ) : null}
              </>
            ) : null}

            {tab === "skill" ? (
              <>
                <div>
                  <SubHeader en="Skill Data" accent={accent.color} />
                  <OperatorSkillsDeck accentColor={accent.color} skills={[operator.skills.normalAttack, operator.skills.battleSkill, operator.skills.comboSkill, operator.skills.ultimate]} />
                </div>
                {operator.talents.length ? (
                  <div>
                    <SubHeader en="Tactical Data · 재능" accent={accent.color} />
                    <TalentPanel items={operator.talents} accentColor={accent.color} />
                  </div>
                ) : null}
                {operator.infrastructureSkills.length ? (
                  <div>
                    <SubHeader en="Facility Data · 인프라" accent={accent.color} />
                    <InfrastructureSkillPanel groups={operator.infrastructureSkills} accentColor={accent.color} />
                  </div>
                ) : null}
                {operator.elite.length ? (
                  <div>
                    <SubHeader en="Promotion Data · 정예화" accent={accent.color} />
                    <ElitePanel elite={operator.elite} />
                  </div>
                ) : null}
              </>
            ) : null}

            {tab === "build" ? (
              <div>
                <SubHeader en="Popular Settings" accent={accent.color} />
                <PopularOperatorSettingsPanel accent={accent.color} operatorSlug={operator.slug} operatorName={operator.name} operators={operators} weapons={weapons} />
                <div className="mt-3 flex justify-center">
                  <Link href="/settings/party" className="inline-flex min-h-11 items-center border px-5 text-sm font-black text-black" style={{ ...CUT, background: accent.color }}>내 세팅 만들기</Link>
                </div>
              </div>
            ) : null}

            {tab === "material" ? (
              <div>
                <SubHeader en="Material Requirements" accent={accent.color} />
                <Placeholder title="MATERIAL — Stage 5" note="정예화·스킬 육성 재료와 파밍 계산기 연계를 5단계에서 구현합니다." />
              </div>
            ) : null}

            {tab === "archive" ? (
              <div>
                <SubHeader en="Archive Data" accent={accent.color} />
                <Placeholder title="ARCHIVE — Stage 5" note="프로필·일러스트 갤러리·보이스 아카이브를 5단계에서 구현합니다." />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
