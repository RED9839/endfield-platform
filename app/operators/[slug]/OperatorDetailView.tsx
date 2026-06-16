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
import PotentialPanel from "./PotentialPanel";
import TalentPanel from "./TalentPanel";
import TrustBonusPanel from "./TrustBonusPanel";

type OperatorRef = { slug: string; name: string; enName: string; avatar: string; element: string };
type WeaponRef = { slug: string; name: string; image: string };
type GearRef = { slug: string; name: string; setName: string; image: string };

// 브랜드 팔레트(고정): Primary 주황 / Accent 옐로. 속성색은 배지에만 사용.
const PRIMARY = "#ff9a2f";
const elementColor: Record<string, string> = {
  physical: "#d6dae3",
  cryo: "#4fa3ff",
  heat: "#ff8a1f",
  nature: "#3ecf8e",
  electric: "#c084fc",
};
const elementLabelMap: Record<string, string> = { physical: "물리", cryo: "냉기", heat: "열기", nature: "자연", electric: "전기" };
const classLabelMap: Record<string, string> = { vanguard: "뱅가드", guard: "가드", defender: "디펜더", supporter: "서포터", caster: "캐스터", striker: "스트라이커" };
const classRoleMap: Record<string, string> = { vanguard: "선봉 · 자원", guard: "근접 딜러", defender: "방어", supporter: "지원", caster: "원거리 딜러", striker: "돌격 딜러" };
const weaponLabelMap: Record<string, string> = { sword: "한손검", greatsword: "양손검", polearm: "장병기", handcannon: "권총", artsunit: "아츠 유닛" };

const CUT = { clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" };

type ModuleId = "build" | "data" | "skill" | "material" | "gallery";
type DataSub = "attr" | "trust" | "potential";

type BuildItem = {
  id: string;
  title: string;
  likeCount?: number;
  viewCount?: number;
  nickname?: string | null;
  userNickname?: string | null;
  slotsSummary?: { mainOperatorSlug?: string; mainWeaponSlug?: string; memberOperatorSlugs?: string[] };
};

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ef-muted">{children}</span>;
}
function ModuleHeader({ en }: { en: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-4 w-1" style={{ background: PRIMARY }} />
      <span className="font-mono text-xs font-black uppercase tracking-[0.24em] text-ef-accent-soft">{en}</span>
    </div>
  );
}
function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center border border-dashed border-ef-line bg-ef-card px-6 py-12 text-center" style={CUT}>
      <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-muted">{title}</p>
      <p className="mt-2 max-w-xs text-xs leading-5 text-ef-muted/70">{note}</p>
    </div>
  );
}

export default function OperatorDetailView({
  operator,
  operators,
  weapons,
  gears,
}: {
  operator: OperatorDetail;
  operators: OperatorRef[];
  weapons: WeaponRef[];
  gears: GearRef[];
}) {
  const element = operator.element;
  const elColor = elementColor[element] ?? "#d6dae3";
  const heroImage = operator.fullImage || operator.avatar;
  const adminSlides = [operator.fullImage, operator.fullImageSecondary].filter((i): i is string => !!i);
  const isAdminSlider = operator.name === "관리자" && adminSlides.length > 1;
  const elementIcon = `/icons/elements/${element}.webp`;
  const role = classRoleMap[operator.class] ?? "오퍼레이터";
  const elementLabel = elementLabelMap[element] ?? element;
  const maxLevel = Array.isArray(operator.levelStats) && operator.levelStats.length ? Math.max(...operator.levelStats.map((r) => r.level)) : 90;

  const [activeModule, setActiveModule] = useState<ModuleId>("build");
  const [dataSub, setDataSub] = useState<DataSub>("attr");
  const [scrolled, setScrolled] = useState(false);
  const [builds, setBuilds] = useState<BuildItem[]>([]);
  const [buildsLoading, setBuildsLoading] = useState(true);
  const [featuredForm, setFeaturedForm] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 340);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams({ operators: operator.slug, sort: "popular", limit: "6", page: "1" });
    fetch(`/api/operator-settings?${params.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(async (data) => {
        if (!mounted) return;
        const list: BuildItem[] = data?.settings ?? [];
        setBuilds(list);
        setBuildsLoading(false);
        if (list[0]?.id) {
          const detail = await fetch(`/api/operator-settings/${list[0].id}`, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null);
          const form = detail?.setting?.slots?.main?.form;
          if (mounted && form) setFeaturedForm(form as Record<string, unknown>);
        }
      })
      .catch(() => {
        if (mounted) setBuildsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [operator.slug]);

  const operatorBySlug = new Map(operators.map((o) => [o.slug, o]));
  const weaponBySlug = new Map(weapons.map((w) => [w.slug, w]));
  const gearBySlug = new Map(gears.map((g) => [g.slug, g]));

  const featured = builds[0];
  const featWeaponSlug = (featuredForm?.weaponSlug as string) ?? featured?.slotsSummary?.mainWeaponSlug;
  const featWeapon = featWeaponSlug ? weaponBySlug.get(featWeaponSlug) : undefined;
  const featGearSlugs = [
    featuredForm?.armorSlug as string | undefined,
    ...(Array.isArray(featuredForm?.gearSlugs) ? (featuredForm?.gearSlugs as string[]) : []),
  ].filter((s): s is string => Boolean(s));
  const featGears = featGearSlugs.map((s) => gearBySlug.get(s)).filter((g): g is GearRef => Boolean(g)).slice(0, 3);
  const featSetName = featGears[0]?.setName;
  const featParty = [operator.slug, ...(featured?.slotsSummary?.memberOperatorSlugs ?? [])].filter(Boolean).slice(0, 4);
  const featAuthor = featured?.userNickname ?? featured?.nickname ?? "익명";

  const modules: { id: ModuleId; label: string }[] = [
    { id: "build", label: "BUILD" },
    { id: "data", label: "DATA" },
    { id: "skill", label: "SKILL" },
    { id: "material", label: "MATERIAL" },
    { id: "gallery", label: "GALLERY" },
  ];
  const dataSubs: { id: DataSub; label: string; show: boolean }[] = [
    { id: "attr", label: "능력치", show: true },
    { id: "trust", label: "신뢰도", show: operator.trustBonus.length > 0 },
    { id: "potential", label: "잠재", show: operator.potential.length > 0 },
  ];

  return (
    <main className="relative min-h-screen bg-ef-bg text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* MINI HEADER (모바일, 스크롤 시) */}
      <div className={`fixed inset-x-0 top-0 z-50 flex items-center gap-2 border-b border-ef-line bg-black/95 px-3 py-2 backdrop-blur transition-transform lg:hidden ${scrolled ? "translate-y-0" : "-translate-y-full"}`}>
        <span className="relative h-8 w-8 shrink-0 overflow-hidden border border-ef-line bg-black">
          <Image src={operator.avatar} alt="" fill sizes="32px" className="object-cover object-top" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-black text-ef-ink">{operator.name}</span>
          <span className="block truncate font-mono text-[9px] uppercase tracking-wide text-ef-muted">{elementLabel} · {classLabelMap[operator.class] ?? operator.class}</span>
        </span>
        <span className="ml-auto font-mono text-[10px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>{modules.find((m) => m.id === activeModule)?.label}</span>
      </div>

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto flex max-w-[1840px] items-center justify-between px-4 py-2.5 sm:px-6 lg:px-7">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Operator File</span>
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ID:${operator.slug.toUpperCase()}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/operators" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>목록</Link>
          <Link href="/" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>홈</Link>
        </div>
      </div>

      {/* 2컬럼: 좌 HERO COLUMN(sticky) / 우 MODULE STAGE */}
      <div className="relative z-10 mx-auto max-w-[1840px] lg:grid lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] lg:gap-6 lg:px-7">
        {/* ===== LEFT: HERO COLUMN ===== */}
        <div className="lg:sticky lg:top-3">
          <section className="relative flex h-[72vh] min-h-[460px] flex-col overflow-hidden sm:h-[78vh] lg:h-[calc(100vh-1.5rem)] lg:border lg:border-ef-line" style={CUT}>
            <div className="absolute inset-0">
              {isAdminSlider ? (
                <HeroSlider images={adminSlides} alt={operator.name} enName={operator.enName} />
              ) : (
                <Image src={heroImage} alt={operator.name} fill priority sizes="(max-width:1024px) 100vw, 600px" className="object-cover object-[center_12%]" />
              )}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.45)_0%,transparent_26%,transparent_44%,rgba(5,5,5,0.78)_72%,#0b0b0b_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:50px_50px]" />
            <span className="pointer-events-none absolute left-3 top-3 h-7 w-7 border-l-2 border-t-2" style={{ borderColor: `${elColor}99` }} />
            <span className="pointer-events-none absolute right-3 top-3 h-7 w-7 border-r-2 border-t-2" style={{ borderColor: `${elColor}55` }} />

            {/* 하단: 아이덴티티 + 이름 + 역할 + TACTICAL BRIEFING */}
            <div className="relative z-10 mt-auto p-5 lg:p-7">
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-black" style={{ ...CUT, background: elColor, color: "#050505" }}>
                  <span className="relative inline-block h-4 w-4"><Image src={elementIcon} alt="" fill sizes="16px" className="object-contain" /></span>
                  {elementLabel}
                </span>
                <span className="text-base font-black tracking-widest text-ef-accent">{"★".repeat(operator.rarity)}</span>
                <span className="hidden h-3 w-px bg-ef-line sm:block" />
                <span className="hidden font-mono text-xs font-bold uppercase tracking-[0.2em] text-ef-muted sm:inline">{classLabelMap[operator.class] ?? operator.class}</span>
              </div>

              <h1 className="break-keep text-[clamp(52px,13vw,104px)] font-black leading-[0.86] tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.92)]">
                {operator.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-sm font-bold uppercase tracking-[0.24em] sm:text-base" style={{ color: elColor }}>{operator.enName}</span>
                <span className="h-3 w-px bg-ef-line" />
                <span className="text-sm font-black text-ef-ink">{role} · {elementLabel}</span>
              </div>

              {/* TACTICAL BRIEFING (Hero 내부) */}
              <div className="mt-4 grid gap-px border border-ef-line bg-ef-line" style={CUT}>
                {/* IDENTITY + GROWTH */}
                <div className="grid grid-cols-2 gap-px bg-ef-line sm:grid-cols-3">
                  {[
                    ["속성/클래스", `${elementLabel} · ${classLabelMap[operator.class] ?? operator.class}`],
                    ["무기", weaponLabelMap[operator.weapon] ?? operator.weapon],
                    ["주 능력치", operator.mainStatLabel || "-"],
                  ].map(([en, v]) => (
                    <div key={en} className="bg-ef-card/92 px-3 py-2 backdrop-blur">
                      <Meta>{en}</Meta>
                      <p className="mt-0.5 truncate text-[13px] font-black text-ef-ink">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-px bg-ef-line">
                  {[
                    ["MAX LV", String(maxLevel)],
                    ["정예화", `${operator.elite.length}단계`],
                    ["역할", role],
                  ].map(([en, v]) => (
                    <div key={en} className="bg-ef-card/92 px-3 py-2 backdrop-blur">
                      <Meta>{en}</Meta>
                      <p className="mt-0.5 truncate text-[13px] font-black" style={{ color: PRIMARY }}>{v}</p>
                    </div>
                  ))}
                </div>
                {/* TOP BUILD 티저 */}
                <button type="button" onClick={() => setActiveModule("build")} className="flex items-center gap-2 bg-ef-card/92 px-3 py-2.5 text-left backdrop-blur transition hover:bg-ef-card2/92">
                  <span className="text-sm" style={{ color: PRIMARY }}>★</span>
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-ef-accent-soft">Top Build</span>
                  {buildsLoading ? (
                    <span className="ml-2 h-3 w-24 animate-pulse bg-ef-card2" />
                  ) : featured ? (
                    <span className="ml-2 min-w-0 truncate text-xs font-bold text-ef-muted">{featWeapon?.name ?? "—"}{featSetName ? ` · ${featSetName}` : ""} · ♥{featured.likeCount ?? 0}</span>
                  ) : (
                    <span className="ml-2 truncate text-xs text-ef-muted">추천 빌드 없음</span>
                  )}
                  <span className="ml-auto shrink-0 font-mono text-[10px] font-black" style={{ color: PRIMARY }}>▶</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ===== RIGHT: MODULE STAGE ===== */}
        <div className="px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-0 lg:pb-12">
          {/* MODULE SELECTOR (모바일 하단 고정 / PC sticky 상단) */}
          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ef-line bg-black/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:sticky lg:top-0 lg:z-30 lg:mt-3 lg:border lg:bg-black/85 lg:px-1.5 lg:pb-0">
            <div className="mx-auto flex max-w-[1840px] items-center gap-1 overflow-x-auto py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {modules.map((m, index) => {
                const isActive = m.id === activeModule;
                return (
                  <button key={m.id} type="button" onClick={() => setActiveModule(m.id)} className="group relative inline-flex min-h-11 flex-1 shrink-0 items-center justify-center gap-1.5 px-2.5 lg:flex-none lg:justify-start lg:px-3.5" style={isActive ? { background: `${PRIMARY}22` } : undefined}>
                    <span className="font-mono text-[10px] font-bold" style={{ color: isActive ? PRIMARY : "#a0a0a0" }}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={`font-mono text-[11px] font-black tracking-wide transition sm:text-xs ${isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>{m.label}</span>
                    <span className={`absolute inset-x-2 bottom-0 h-0.5 transition ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} style={{ background: PRIMARY }} />
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="mt-4 min-w-0">
            {/* ===== BUILD MODULE (기본) ===== */}
            {activeModule === "build" ? (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                {/* FEATURED BUILD */}
                <div>
                  <ModuleHeader en="Featured Build" />
                  <div className="overflow-hidden border bg-ef-card" style={{ ...CUT, borderColor: `${PRIMARY}55` }}>
                    <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
                    <div className="p-4">
                      {buildsLoading ? (
                        <div className="h-40 animate-pulse bg-ef-card2" />
                      ) : featured ? (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <p className="min-w-0 truncate text-base font-black text-ef-ink">{featured.title}</p>
                            <span className="shrink-0 text-sm font-black" style={{ color: PRIMARY }}>♥ {featured.likeCount ?? 0}</span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="col-span-2">
                              <Meta>Weapon</Meta>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="relative h-10 w-10 shrink-0 overflow-hidden border border-ef-line bg-black">{featWeapon?.image ? <Image src={featWeapon.image} alt="" fill sizes="40px" className="object-cover" /> : null}</span>
                                <span className="truncate text-sm font-black text-ef-ink">{featWeapon?.name ?? "—"}</span>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <Meta>Gear Set</Meta>
                              <div className="mt-1 flex items-center gap-1.5">
                                {featGears.length ? featGears.map((g) => (
                                  <span key={g.slug} className="relative h-9 w-9 shrink-0 overflow-hidden border border-ef-line bg-black"><Image src={g.image} alt="" fill sizes="36px" className="object-cover" /></span>
                                )) : <span className="text-sm font-black text-ef-muted">—</span>}
                                {featSetName ? <span className="ml-1 truncate text-xs font-black" style={{ color: PRIMARY }}>{featSetName}</span> : null}
                              </div>
                            </div>
                            <div>
                              <Meta>Main</Meta>
                              <p className="mt-1 truncate text-sm font-black" style={{ color: PRIMARY }}>{operator.mainStatLabel || "-"}</p>
                            </div>
                            <div>
                              <Meta>Sub</Meta>
                              <p className="mt-1 truncate text-sm font-black text-ef-ink">{operator.subStatLabel || "-"}</p>
                            </div>
                            <div className="col-span-2">
                              <Meta>Party</Meta>
                              <div className="mt-1 flex items-center gap-1">
                                {featParty.map((slug) => {
                                  const img = operatorBySlug.get(slug)?.avatar ?? `/operators/${slug}/avatar.webp`;
                                  return <span key={slug} className="relative h-9 w-9 shrink-0 overflow-hidden border border-ef-line bg-black"><Image src={img} alt="" fill sizes="36px" className="object-cover object-top" /></span>;
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-ef-line pt-2.5">
                            <span className="truncate text-[11px] font-bold text-ef-muted">by {featAuthor}</span>
                            <Link href={`/settings/${featured.id}`} className="font-mono text-[10px] font-black uppercase tracking-wide transition hover:text-ef-accent-soft" style={{ color: PRIMARY }}>빌드 상세 →</Link>
                          </div>
                        </>
                      ) : (
                        <div className="py-6 text-center">
                          <p className="text-sm text-ef-muted">아직 등록된 추천 빌드가 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CREATE BUILD CTA */}
                  <Link href="/settings/party" className="mt-3 flex min-h-12 items-center justify-center border text-sm font-black text-black transition hover:brightness-110" style={{ ...CUT, background: PRIMARY }}>
                    + 내 세팅 만들기
                  </Link>
                </div>

                {/* COMMUNITY BUILDS */}
                <div>
                  <ModuleHeader en="Community Builds" />
                  {buildsLoading ? (
                    <div className="grid gap-2">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse bg-ef-card2" style={CUT} />)}</div>
                  ) : builds.length > 1 ? (
                    <div className="grid gap-2">
                      {builds.slice(1).map((b) => {
                        const w = b.slotsSummary?.mainWeaponSlug ? weaponBySlug.get(b.slotsSummary.mainWeaponSlug) : undefined;
                        return (
                          <Link key={b.id} href={`/settings/${b.id}`} className="flex items-center gap-3 border border-ef-line bg-ef-card p-2.5 transition hover:border-ef-accent/40" style={CUT}>
                            <span className="relative h-11 w-11 shrink-0 overflow-hidden border border-ef-line bg-black">{w?.image ? <Image src={w.image} alt="" fill sizes="44px" className="object-cover" /> : null}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-black text-ef-ink">{b.title}</span>
                              <span className="block truncate text-[11px] text-ef-muted">{b.userNickname ?? b.nickname ?? "익명"}</span>
                            </span>
                            <span className="shrink-0 text-xs font-black" style={{ color: PRIMARY }}>♥ {b.likeCount ?? 0}</span>
                          </Link>
                        );
                      })}
                      <Link href={`/settings?operators=${encodeURIComponent(operator.slug)}`} className="mt-1 flex min-h-11 items-center justify-center border border-ef-line bg-ef-card2 text-xs font-black text-ef-muted transition hover:text-ef-accent-soft" style={CUT}>
                        커뮤니티 빌드 전체 보기 →
                      </Link>
                    </div>
                  ) : (
                    <Placeholder title="No Community Builds" note="이 오퍼레이터의 커뮤니티 빌드가 아직 없습니다. 첫 세팅을 등록해 보세요." />
                  )}
                </div>
              </div>
            ) : null}

            {/* ===== DATA MODULE (서브탭) ===== */}
            {activeModule === "data" ? (
              <div>
                <div className="mb-3 flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {dataSubs.filter((s) => s.show).map((s) => {
                    const isActive = s.id === dataSub;
                    return (
                      <button key={s.id} type="button" onClick={() => setDataSub(s.id)} className="inline-flex min-h-9 shrink-0 items-center border px-4 text-xs font-black transition" style={{ ...CUT, background: isActive ? `${PRIMARY}22` : "#0b0b0b", borderColor: isActive ? PRIMARY : "#202020", color: isActive ? "#fff" : "#a0a0a0" }}>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
                {dataSub === "attr" ? (
                  <>
                    <ModuleHeader en="Attribute Data" />
                    <OperatorLevelPanel name={operator.name} enName={operator.enName} avatar={operator.avatar} element={operator.element} operatorClass={operator.class} weapon={operator.weapon} rarity={operator.rarity} mainStatLabel={operator.mainStatLabel ?? ""} subStatLabel={operator.subStatLabel ?? ""} levelStats={operator.levelStats} />
                  </>
                ) : null}
                {dataSub === "trust" && operator.trustBonus.length ? (<><ModuleHeader en="Trust Data" /><TrustBonusPanel items={operator.trustBonus} /></>) : null}
                {dataSub === "potential" && operator.potential.length ? (<><ModuleHeader en="Potential Data" /><PotentialPanel items={operator.potential} /></>) : null}
              </div>
            ) : null}

            {/* ===== SKILL MODULE ===== */}
            {activeModule === "skill" ? (
              <div className="grid gap-4">
                <div><ModuleHeader en="Combat Skill" /><OperatorSkillsDeck accentColor={PRIMARY} skills={[operator.skills.normalAttack, operator.skills.battleSkill, operator.skills.comboSkill, operator.skills.ultimate]} /></div>
                {operator.talents.length ? (<div><ModuleHeader en="Talent" /><TalentPanel items={operator.talents} accentColor={PRIMARY} /></div>) : null}
                {operator.infrastructureSkills.length ? (<div><ModuleHeader en="Infrastructure" /><InfrastructureSkillPanel groups={operator.infrastructureSkills} accentColor={PRIMARY} /></div>) : null}
                {operator.elite.length ? (<div><ModuleHeader en="Elite" /><ElitePanel elite={operator.elite} /></div>) : null}
              </div>
            ) : null}

            {activeModule === "material" ? (<div><ModuleHeader en="Material Requirements" /><Placeholder title="MATERIAL — Phase 3" note="정예화·스킬 재료 총합과 파밍 계산기 연계를 Phase 3에서 구현합니다." /></div>) : null}
            {activeModule === "gallery" ? (<div><ModuleHeader en="Gallery" /><Placeholder title="GALLERY — Phase 3" note="프로필·일러스트·보이스를 Phase 3에서 비주얼 우선으로 구현합니다." /></div>) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
