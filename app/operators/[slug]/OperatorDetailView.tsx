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

const elementAccent: Record<string, string> = {
  physical: "#d6dae3",
  cryo: "#4fa3ff",
  heat: "#ff8a1f",
  nature: "#3ecf8e",
  electric: "#c084fc",
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
  nickname?: string | null;
  userNickname?: string | null;
  slotsSummary?: { mainWeaponSlug?: string; memberOperatorSlugs?: string[] };
};

type TabId = "data" | "skill" | "build" | "material" | "archive";
type DataSub = "attr" | "trust" | "potential";

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
    <div className="flex min-h-[200px] flex-col items-center justify-center border border-dashed border-ef-line bg-ef-card px-6 py-12 text-center" style={CUT}>
      <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-muted">{title}</p>
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
  const accent = elementAccent[operator.element] ?? "#ffd24a";
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
  const [dataSub, setDataSub] = useState<DataSub>("attr");
  const [topBuild, setTopBuild] = useState<TopBuild | null>(null);
  const [topBuildLoading, setTopBuildLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams({ operators: operator.slug, sort: "popular", limit: "1", page: "1" });
    fetch(`/api/operator-settings?${params.toString()}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (mounted) setTopBuild(data?.settings?.[0] ?? null);
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
  const partySlugs = [operator.slug, ...(topBuild?.slotsSummary?.memberOperatorSlugs ?? [])].filter(Boolean).slice(0, 4);
  const topAuthor = topBuild?.userNickname ?? topBuild?.nickname ?? "익명";

  const tabs: { id: TabId; label: string }[] = [
    { id: "data", label: "DATA" },
    { id: "skill", label: "SKILL" },
    { id: "build", label: "BUILD" },
    { id: "material", label: "MATERIAL" },
    { id: "archive", label: "ARCHIVE" },
  ];

  const dataSubs: { id: DataSub; label: string; show: boolean }[] = [
    { id: "attr", label: "능력치", show: true },
    { id: "trust", label: "신뢰도", show: operator.trustBonus.length > 0 },
    { id: "potential", label: "잠재", show: operator.potential.length > 0 },
  ];

  const RecommendedBuild = (
    <div className="overflow-hidden border bg-ef-card/92 backdrop-blur" style={{ ...CUT, borderColor: `${accent}55` }}>
      <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent 55%)` }} />
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm" style={{ color: accent }}>★</span>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">Recommended Build</span>
          </div>
          <button type="button" onClick={() => setTab("build")} className="font-mono text-[10px] font-black uppercase tracking-wide text-ef-muted transition hover:text-ef-accent-soft">전체 →</button>
        </div>

        {topBuildLoading ? (
          <div className="mt-3 h-24 animate-pulse bg-ef-card2" />
        ) : topBuild ? (
          <button type="button" onClick={() => setTab("build")} className="mt-3 block w-full border border-ef-line bg-ef-card2 p-3 text-left transition hover:border-ef-accent/40" style={CUT}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
              <div className="col-span-2">
                <MetaLabel>Weapon</MetaLabel>
                <div className="mt-1 flex items-center gap-2">
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden border border-ef-line bg-black">
                    {topWeapon?.image ? <Image src={topWeapon.image} alt="" fill sizes="36px" className="object-cover" /> : null}
                  </span>
                  <span className="truncate text-sm font-black text-ef-ink">{topWeapon?.name ?? "—"}</span>
                </div>
              </div>
              <div>
                <MetaLabel>Main</MetaLabel>
                <p className="mt-1 truncate text-sm font-black" style={{ color: accent }}>{operator.mainStatLabel || "-"}</p>
              </div>
              <div>
                <MetaLabel>Sub</MetaLabel>
                <p className="mt-1 truncate text-sm font-black text-ef-ink">{operator.subStatLabel || "-"}</p>
              </div>
              <div className="col-span-2 sm:col-span-4">
                <MetaLabel>Party</MetaLabel>
                <div className="mt-1 flex items-center gap-1">
                  {partySlugs.map((slug) => {
                    const img = operatorBySlug.get(slug)?.avatar ?? `/operators/${slug}/avatar.webp`;
                    return (
                      <span key={slug} className="relative h-8 w-8 shrink-0 overflow-hidden border border-ef-line bg-black">
                        <Image src={img} alt="" fill sizes="32px" className="object-cover object-top" />
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-ef-line pt-2.5">
              <span className="min-w-0 truncate text-[11px] font-bold text-ef-muted">{topBuild.title} · by {topAuthor}</span>
              <span className="shrink-0 text-sm font-black" style={{ color: accent }}>♥ {topBuild.likeCount ?? 0}</span>
            </div>
          </button>
        ) : (
          <div className="mt-3 border border-ef-line bg-ef-card2 p-3 text-center" style={CUT}>
            <p className="text-xs text-ef-muted">아직 추천 빌드가 없습니다.</p>
            <Link href="/settings/party" className="mt-2 inline-flex px-3 py-1.5 text-xs font-black text-black" style={{ background: accent }}>첫 빌드 등록</Link>
          </div>
        )}
      </div>
    </div>
  );

  const GrowthStrip = (
    <div className="grid grid-cols-3 gap-px border border-ef-line bg-ef-line" style={CUT}>
      {[
        ["MAX LV", String(maxLevel)],
        ["정예화", `${operator.elite.length}단계`],
        ["주 능력치", operator.mainStatLabel || "-"],
      ].map(([en, value]) => (
        <div key={en} className="bg-ef-card/92 px-3 py-2.5 backdrop-blur">
          <MetaLabel>{en}</MetaLabel>
          <p className="mt-0.5 truncate text-lg font-black" style={{ color: accent }}>{value}</p>
        </div>
      ))}
    </div>
  );

  return (
    <main className="relative min-h-screen bg-ef-bg text-ef-ink">
      {/* ============ HERO 100vh — 캐릭터 + 정보 + 추천 빌드 = 첫 화면 ============ */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* 캐릭터 일러 */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[64%]">
          {isAdminSlider ? (
            <HeroSlider images={adminSlides} alt={operator.name} enName={operator.enName} />
          ) : (
            <Image src={heroImage} alt={operator.name} fill priority sizes="100vw" className="object-cover object-[center_12%]" />
          )}
          <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.6)_26%,rgba(5,5,5,0.08)_54%,transparent_72%)]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.5)_0%,transparent_22%,transparent_46%,rgba(5,5,5,0.72)_78%,#050505_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:52px_52px]" />
        <span className="absolute left-0 top-0 hidden h-full w-px lg:block" style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }} />

        {/* HUD 바 */}
        <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[1840px] items-center justify-between px-4 py-3 sm:px-7">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3" style={{ background: accent }} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Operator File</span>
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ID:${operator.slug.toUpperCase()}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/operators" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>목록</Link>
            <Link href="/" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>홈</Link>
          </div>
        </div>

        {/* 좌측(PC)/하단(모바일) 콘텐츠: 이름 → 칩 → 추천빌드 → Growth */}
        <div className="relative z-10 flex min-h-screen flex-col justify-end px-5 pb-7 pt-20 sm:px-7 lg:max-w-[600px] lg:justify-center lg:px-12 lg:pb-0">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-black" style={{ ...CUT, background: accent, color: "#050505" }}>
              <span className="relative inline-block h-4 w-4">
                <Image src={elementIcon} alt="" fill sizes="16px" className="object-contain" />
              </span>
              {elementLabel}
            </span>
            <span className="text-base font-black tracking-widest text-ef-accent">{"★".repeat(operator.rarity)}</span>
            <span className="hidden h-3 w-px bg-ef-line sm:block" />
            <span className="hidden font-mono text-xs font-bold uppercase tracking-[0.2em] text-ef-muted sm:inline">{classLabelMap[operator.class] ?? operator.class}</span>
          </div>

          <h1 className="break-keep text-[clamp(56px,12vw,160px)] font-black leading-[0.82] tracking-tight text-white drop-shadow-[0_12px_44px_rgba(0,0,0,0.92)]">
            {operator.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="font-mono text-base font-bold uppercase tracking-[0.26em] sm:text-xl" style={{ color: accent }}>{operator.enName}</span>
            <span className="h-3.5 w-px bg-ef-line" />
            <span className="text-sm font-black text-ef-ink sm:text-lg">{role} · {elementLabel}</span>
          </div>

          {/* 정체성 칩 */}
          <div className="mt-5 inline-grid w-full max-w-[440px] grid-cols-3 gap-px border border-ef-line bg-ef-line" style={CUT}>
            {[
              ["CLASS", classLabelMap[operator.class] ?? operator.class],
              ["WEAPON", weaponLabelMap[operator.weapon] ?? operator.weapon],
              ["MAIN", operator.mainStatLabel || "-"],
            ].map(([en, value]) => (
              <div key={en} className="bg-ef-card/92 px-3 py-2.5 backdrop-blur">
                <MetaLabel>{en}</MetaLabel>
                <p className="mt-0.5 truncate text-sm font-black text-ef-ink">{value}</p>
              </div>
            ))}
          </div>

          {/* 추천 빌드 (칩 다음) */}
          <div className="mt-4 w-full max-w-[560px]">{RecommendedBuild}</div>

          {/* Growth (추천빌드 다음) */}
          <div className="mt-3 w-full max-w-[440px]">{GrowthStrip}</div>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 lg:flex">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ef-muted">scroll</span>
          <span className="h-4 w-px" style={{ background: accent }} />
        </div>
      </section>

      {/* ============ 본문 (스크롤) ============ */}
      <div className="relative z-10 mx-auto max-w-[1840px] px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-7 lg:pb-12">
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ef-line bg-black/92 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:sticky lg:top-0 lg:z-30 lg:mt-2 lg:border lg:bg-black/85 lg:px-1.5 lg:pb-0">
          <div className="mx-auto flex max-w-[1840px] items-center gap-1 overflow-x-auto py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((item, index) => {
              const isActive = item.id === tab;
              return (
                <button key={item.id} type="button" onClick={() => setTab(item.id)} className="group relative inline-flex min-h-11 flex-1 shrink-0 items-center justify-center gap-1.5 px-3 lg:flex-none lg:justify-start" style={isActive ? { background: `${accent}1f` } : undefined}>
                  <span className="font-mono text-[10px] font-bold" style={{ color: isActive ? accent : "#a0a0a0" }}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={`font-mono text-xs font-black tracking-wide transition ${isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>{item.label}</span>
                  <span className={`absolute inset-x-2 bottom-0 h-0.5 transition ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} style={{ background: accent }} />
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mt-4 grid min-w-0 gap-4">
          {tab === "data" ? (
            <div>
              {/* DATA 서브탭 — 능력치 / 신뢰도 / 잠재 (스크롤 분산) */}
              <div className="mb-3 flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {dataSubs.filter((s) => s.show).map((s) => {
                  const isActive = s.id === dataSub;
                  return (
                    <button key={s.id} type="button" onClick={() => setDataSub(s.id)} className="inline-flex min-h-9 shrink-0 items-center border px-4 text-xs font-black transition" style={{ ...CUT, background: isActive ? `${accent}1f` : "#0b0b0b", borderColor: isActive ? accent : "#202020", color: isActive ? "#fff" : "#a0a0a0" }}>
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {dataSub === "attr" ? (
                <>
                  <SubHeader en="Attribute Data" accent={accent} />
                  <OperatorLevelPanel name={operator.name} enName={operator.enName} avatar={operator.avatar} element={operator.element} operatorClass={operator.class} weapon={operator.weapon} rarity={operator.rarity} mainStatLabel={operator.mainStatLabel ?? ""} subStatLabel={operator.subStatLabel ?? ""} levelStats={operator.levelStats} />
                </>
              ) : null}
              {dataSub === "trust" && operator.trustBonus.length ? (
                <>
                  <SubHeader en="Trust Data" accent={accent} />
                  <TrustBonusPanel items={operator.trustBonus} />
                </>
              ) : null}
              {dataSub === "potential" && operator.potential.length ? (
                <>
                  <SubHeader en="Potential Data" accent={accent} />
                  <PotentialPanel items={operator.potential} />
                </>
              ) : null}
            </div>
          ) : null}

          {tab === "skill" ? (
            <>
              <div>
                <SubHeader en="Skill Data" accent={accent} />
                <OperatorSkillsDeck accentColor={accent} skills={[operator.skills.normalAttack, operator.skills.battleSkill, operator.skills.comboSkill, operator.skills.ultimate]} />
              </div>
              {operator.talents.length ? (
                <div>
                  <SubHeader en="Tactical Data · 재능" accent={accent} />
                  <TalentPanel items={operator.talents} accentColor={accent} />
                </div>
              ) : null}
              {operator.infrastructureSkills.length ? (
                <div>
                  <SubHeader en="Facility Data · 인프라" accent={accent} />
                  <InfrastructureSkillPanel groups={operator.infrastructureSkills} accentColor={accent} />
                </div>
              ) : null}
              {operator.elite.length ? (
                <div>
                  <SubHeader en="Promotion Data · 정예화" accent={accent} />
                  <ElitePanel elite={operator.elite} />
                </div>
              ) : null}
            </>
          ) : null}

          {tab === "build" ? (
            <div>
              <SubHeader en="Popular Settings" accent={accent} />
              <PopularOperatorSettingsPanel accent={accent} operatorSlug={operator.slug} operatorName={operator.name} operators={operators} weapons={weapons} />
              <div className="mt-3 flex justify-center">
                <Link href="/settings/party" className="inline-flex min-h-11 items-center border px-5 text-sm font-black text-black" style={{ ...CUT, background: accent }}>내 세팅 만들기</Link>
              </div>
            </div>
          ) : null}

          {tab === "material" ? (
            <div>
              <SubHeader en="Material Requirements" accent={accent} />
              <Placeholder title="MATERIAL — Stage 5" note="정예화·스킬 육성 재료와 파밍 계산기 연계를 5단계에서 구현합니다." />
            </div>
          ) : null}

          {tab === "archive" ? (
            <div>
              <SubHeader en="Archive Data" accent={accent} />
              <Placeholder title="ARCHIVE — Stage 5" note="프로필·일러스트 갤러리·보이스 아카이브를 5단계에서 구현합니다." />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
