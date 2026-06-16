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

const PRIMARY = "#ff9a2f";
const elementColor: Record<string, string> = { physical: "#d6dae3", cryo: "#4fa3ff", heat: "#ff8a1f", nature: "#3ecf8e", electric: "#c084fc" };
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
  type?: string;
  likeCount?: number;
  nickname?: string | null;
  userNickname?: string | null;
  slotsSummary?: { mainWeaponSlug?: string; memberOperatorSlugs?: string[] };
};

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">{children}</span>;
}
function SectionLabel({ en }: { en: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-3.5 w-1" style={{ background: PRIMARY }} />
      <span className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">{en}</span>
    </div>
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
  const [featForm, setFeatForm] = useState<Record<string, unknown> | null>(null);
  const [featCycle, setFeatCycle] = useState<unknown[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 340);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams({ operators: operator.slug, sort: "popular", limit: "8", page: "1" });
    fetch(`/api/operator-settings?${params.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(async (data) => {
        if (!mounted) return;
        const list: BuildItem[] = data?.settings ?? [];
        setBuilds(list);
        setBuildsLoading(false);
        if (list[0]?.id) {
          const detail = await fetch(`/api/operator-settings/${list[0].id}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
          if (!mounted) return;
          const form = detail?.setting?.slots?.main?.form;
          if (form) setFeatForm(form as Record<string, unknown>);
          if (Array.isArray(detail?.setting?.cycle)) setFeatCycle(detail.setting.cycle);
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
  const featWeapon = (() => {
    const slug = (featForm?.weaponSlug as string) ?? featured?.slotsSummary?.mainWeaponSlug;
    return slug ? weaponBySlug.get(slug) : undefined;
  })();
  const featGears = [featForm?.armorSlug as string | undefined, ...(Array.isArray(featForm?.gearSlugs) ? (featForm?.gearSlugs as string[]) : [])]
    .filter((s): s is string => Boolean(s))
    .map((s) => gearBySlug.get(s))
    .filter((g): g is GearRef => Boolean(g))
    .slice(0, 3);
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

      {/* MINI HEADER (mobile) */}
      <div className={`fixed inset-x-0 top-0 z-50 flex items-center gap-2 border-b border-ef-line bg-black/95 px-3 py-2 backdrop-blur transition-transform lg:hidden ${scrolled ? "translate-y-0" : "-translate-y-full"}`}>
        <span className="relative h-8 w-8 shrink-0 overflow-hidden border border-ef-line bg-black"><Image src={operator.avatar} alt="" fill sizes="32px" className="object-cover object-top" /></span>
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

      {/* 2컬럼: 좌 HERO(42~44%) / 우 MODULE */}
      <div className="relative z-10 mx-auto max-w-[1840px] lg:grid lg:grid-cols-[minmax(0,43%)_minmax(0,57%)] lg:gap-6 lg:px-7">
        {/* ===== LEFT: HERO COLUMN (정체성만) ===== */}
        <div className="lg:sticky lg:top-3">
          <section className="relative flex h-[66vh] min-h-[440px] flex-col overflow-hidden sm:h-[70vh] lg:h-[calc(100vh-1.5rem)] lg:border lg:border-ef-line" style={CUT}>
            <div className="absolute inset-0">
              {isAdminSlider ? (
                <HeroSlider images={adminSlides} alt={operator.name} enName={operator.enName} />
              ) : (
                <Image src={heroImage} alt={operator.name} fill priority sizes="(max-width:1024px) 100vw, 900px" className="scale-[1.08] object-cover object-[center_6%]" />
              )}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.3)_0%,transparent_22%,transparent_64%,rgba(5,5,5,0.74)_87%,#0b0b0b_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:50px_50px]" />
            <span className="pointer-events-none absolute left-3 top-3 h-7 w-7 border-l-2 border-t-2" style={{ borderColor: `${elColor}99` }} />
            <span className="pointer-events-none absolute right-3 top-3 h-7 w-7 border-r-2 border-t-2" style={{ borderColor: `${elColor}55` }} />

            {/* 콘텐츠: TACTICAL BRIEFING CLUSTER(이름 위) + 이름 — 하단 25~35% 영역 */}
            <div className="relative z-10 mt-auto p-5 lg:px-8 lg:pb-[13vh]">
              {/* 단일 Briefing Cluster (이름 바로 위) */}
              <div className="mb-4 inline-grid w-full max-w-[440px] gap-px border border-ef-line bg-ef-card/82 backdrop-blur" style={CUT}>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-3 py-2">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-black" style={{ background: elColor, color: "#050505" }}>
                    <span className="relative inline-block h-3 w-3"><Image src={elementIcon} alt="" fill sizes="12px" className="object-contain" /></span>{elementLabel}
                  </span>
                  <Meta>IDENTITY</Meta>
                  <span className="text-xs font-black text-ef-ink">{classLabelMap[operator.class] ?? operator.class} · {weaponLabelMap[operator.weapon] ?? operator.weapon}</span>
                  <span className="ml-auto text-sm tracking-widest text-ef-accent">{"★".repeat(operator.rarity)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ef-line px-3 py-2">
                  <Meta>ROLE</Meta><span className="text-xs font-black text-ef-ink">{role}</span>
                  <span className="mx-1.5 h-3 w-px bg-ef-line" />
                  <Meta>GROWTH</Meta><span className="text-xs font-black" style={{ color: PRIMARY }}>MAX {maxLevel} · 정예 {operator.elite.length}</span>
                </div>
              </div>
              <h1 className="break-keep text-[clamp(54px,12vw,120px)] font-black leading-[0.84] tracking-tight text-white drop-shadow-[0_8px_34px_rgba(0,0,0,0.92)]">
                {operator.name}
              </h1>
              <p className="mt-2.5 font-mono text-base font-bold uppercase tracking-[0.26em] sm:text-lg" style={{ color: elColor }}>{operator.enName}</p>
            </div>
          </section>
        </div>

        {/* ===== RIGHT: MODULE STAGE ===== */}
        <div className="px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-0 lg:pb-12">
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
            {/* ===== BUILD MODULE ===== */}
            {activeModule === "build" ? (
              <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
                {/* FEATURED + CREATE — 2x2 좌상 */}
                <div className="grid content-start gap-4 xl:order-1">
                  {/* FEATURED BUILD — 고밀도(전 정보) */}
                  <div>
                    <SectionLabel en="Featured Build" />
                    <div className="overflow-hidden border bg-ef-card" style={{ ...CUT, borderColor: `${PRIMARY}55` }}>
                      <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
                      {buildsLoading ? (
                        <div className="m-3 h-28 animate-pulse bg-ef-card2" />
                      ) : featured ? (
                        <div className="p-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="min-w-0 truncate text-sm font-black text-ef-ink">{featured.title}</p>
                            <span className="shrink-0 text-sm font-black" style={{ color: PRIMARY }}>♥ {featured.likeCount ?? 0}</span>
                          </div>
                          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
                            <div className="flex items-center gap-2">
                              <span className="relative h-9 w-9 shrink-0 overflow-hidden border border-ef-line bg-black">{featWeapon?.image ? <Image src={featWeapon.image} alt="" fill sizes="36px" className="object-cover" /> : null}</span>
                              <span className="min-w-0"><Meta>Weapon</Meta><span className="block truncate text-xs font-black text-ef-ink">{featWeapon?.name ?? "—"}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="flex shrink-0 items-center gap-1">{featGears.length ? featGears.map((g) => (<span key={g.slug} className="relative h-9 w-9 overflow-hidden border border-ef-line bg-black"><Image src={g.image} alt="" fill sizes="36px" className="object-cover" /></span>)) : <span className="text-xs font-black text-ef-muted">—</span>}</span>
                              <span className="min-w-0"><Meta>Gear Set</Meta><span className="block truncate text-xs font-black" style={{ color: PRIMARY }}>{featSetName ?? "세트 없음"}</span></span>
                            </div>
                            <div><Meta>Main</Meta><p className="text-xs font-black" style={{ color: PRIMARY }}>{operator.mainStatLabel || "-"}</p></div>
                            <div><Meta>Sub</Meta><p className="text-xs font-black text-ef-ink">{operator.subStatLabel || "-"}</p></div>
                            <div>
                              <Meta>Party</Meta>
                              <span className="mt-1 flex items-center gap-1">{featParty.map((s) => (<span key={s} className="relative h-7 w-7 overflow-hidden border border-ef-line bg-black"><Image src={operatorBySlug.get(s)?.avatar ?? `/operators/${s}/avatar.webp`} alt="" fill sizes="28px" className="object-cover object-top" /></span>))}</span>
                            </div>
                            <div><Meta>Cycle</Meta><p className="mt-1 text-xs font-black" style={{ color: featCycle.length ? PRIMARY : "#a0a0a0" }}>{featCycle.length ? `${featCycle.length}-STEP` : "없음"}</p></div>
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-ef-line pt-2.5">
                            <Meta>by {featAuthor}</Meta>
                            <Link href={`/settings/${featured.id}`} className="font-mono text-[10px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>빌드 상세 →</Link>
                          </div>
                        </div>
                      ) : (
                        <p className="p-5 text-center text-sm text-ef-muted">아직 추천 빌드가 없습니다.</p>
                      )}
                    </div>
                  </div>

                  {/* CREATE CTA — FEATURED 바로 아래 */}
                  <Link href="/settings/party" className="flex min-h-12 items-center justify-center border text-sm font-black text-black transition hover:brightness-110" style={{ ...CUT, background: PRIMARY }}>+ 내 세팅 만들기</Link>
                </div>

                {/* PARTY COMPOSITION — 2x2 좌하 */}
                <div className="xl:order-3">
                  <div>
                    <SectionLabel en="Party Composition" />
                    <div className="grid grid-cols-4 gap-2">
                      {(["메인", "서브 1", "서브 2", "서브 3"] as const).map((label, i) => {
                        const slug = featParty[i];
                        const m = slug ? operatorBySlug.get(slug) : undefined;
                        return (
                          <div key={label} className="border border-ef-line bg-ef-card2 p-2 text-center" style={CUT}>
                            <span className="relative mx-auto block h-12 w-12 overflow-hidden border border-ef-line bg-black sm:h-14 sm:w-14">
                              {slug ? <Image src={m?.avatar ?? `/operators/${slug}/avatar.webp`} alt="" fill sizes="56px" className="object-cover object-top" /> : <span className="flex h-full w-full items-center justify-center text-lg font-black text-ef-muted">+</span>}
                            </span>
                            <p className="mt-1.5 truncate font-mono text-[9px] font-black uppercase tracking-wide" style={{ color: i === 0 ? PRIMARY : "#a0a0a0" }}>{label}</p>
                            <p className="truncate text-[10px] font-bold text-ef-muted">{m?.name ?? "빈 슬롯"}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ROTATION — 2x2 우하 */}
                <div className="xl:order-4">
                  {/* ROTATION / CYCLE — 전술 플로우 */}
                  <div>
                    <SectionLabel en="Rotation / Cycle" />
                    <div className="border border-ef-line bg-ef-card p-3.5" style={CUT}>
                      {featCycle.length ? (
                        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                          {featCycle.slice(0, 12).map((_, i, arr) => (
                            <span key={i} className="flex items-center">
                              <span className="inline-flex h-9 items-center gap-1.5 border px-2.5 font-mono text-[11px] font-black" style={{ borderColor: `${PRIMARY}66`, background: `${PRIMARY}14`, color: "#fff" }}>
                                <span style={{ color: PRIMARY }}>{String(i + 1).padStart(2, "0")}</span> STEP
                              </span>
                              {i < arr.length - 1 ? <span className="px-1 font-black" style={{ color: PRIMARY }}>→</span> : null}
                            </span>
                          ))}
                          <span className="ml-1 font-mono text-[10px] text-ef-muted">{featCycle.length}-STEP</span>
                        </div>
                      ) : (
                        <p className="py-3 text-center text-xs font-bold text-ef-muted">등록된 사이클 없음</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* COMMUNITY — 2x2 우상 */}
                <div className="xl:order-2">
                  {/* COMMUNITY BUILDS — 강화 */}
                  <div>
                    <SectionLabel en="Community Builds" />
                    {buildsLoading ? (
                      <div className="grid gap-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse bg-ef-card2" style={CUT} />)}</div>
                    ) : builds.length > 1 ? (
                      <div className="grid gap-2">
                        {builds.slice(1).map((b) => {
                          const w = b.slotsSummary?.mainWeaponSlug ? weaponBySlug.get(b.slotsSummary.mainWeaponSlug) : undefined;
                          const party = (b.slotsSummary?.memberOperatorSlugs ?? []).slice(0, 3);
                          const isParty = b.type === "party" || party.length > 0;
                          return (
                            <Link key={b.id} href={`/settings/${b.id}`} className="group flex items-center gap-3 border border-ef-line bg-ef-card p-2.5 transition hover:border-ef-accent/40" style={CUT}>
                              <span className="relative h-11 w-11 shrink-0 overflow-hidden border border-ef-line bg-black">{w?.image ? <Image src={w.image} alt="" fill sizes="44px" className="object-cover" /> : null}</span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5">
                                  <span className="truncate text-sm font-black text-ef-ink">{b.title}</span>
                                  <span className="shrink-0 border border-ef-line px-1 font-mono text-[8px] font-black text-ef-muted">{isParty ? "PARTY" : "SOLO"}</span>
                                </span>
                                <span className="flex items-center gap-2 text-[11px] text-ef-muted">
                                  <span className="truncate">{b.userNickname ?? b.nickname ?? "익명"}</span>
                                  <span style={{ color: PRIMARY }}>· {operator.mainStatLabel || "-"}</span>
                                </span>
                              </span>
                              <span className="hidden shrink-0 items-center gap-0.5 group-hover:flex">{party.map((s) => (<span key={s} className="relative h-6 w-6 overflow-hidden border border-ef-line bg-black"><Image src={operatorBySlug.get(s)?.avatar ?? `/operators/${s}/avatar.webp`} alt="" fill sizes="24px" className="object-cover object-top" /></span>))}</span>
                              <span className="shrink-0 text-xs font-black group-hover:hidden" style={{ color: PRIMARY }}>♥ {b.likeCount ?? 0}</span>
                            </Link>
                          );
                        })}
                        <Link href={`/settings?operators=${encodeURIComponent(operator.slug)}`} className="mt-1 flex min-h-11 items-center justify-center border border-ef-line bg-ef-card2 text-xs font-black text-ef-muted transition hover:text-ef-accent-soft" style={CUT}>커뮤니티 빌드 전체 →</Link>
                      </div>
                    ) : (
                      <Placeholder title="No Community Builds" note="이 오퍼레이터의 커뮤니티 빌드가 아직 없습니다." />
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* ===== DATA MODULE (성장정보 이동: MAX LV/정예화/주능력치) ===== */}
            {activeModule === "data" ? (
              <div>
                <div className="mb-3 flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {dataSubs.filter((s) => s.show).map((s) => {
                    const isActive = s.id === dataSub;
                    return (<button key={s.id} type="button" onClick={() => setDataSub(s.id)} className="inline-flex min-h-9 shrink-0 items-center border px-4 text-xs font-black transition" style={{ ...CUT, background: isActive ? `${PRIMARY}22` : "#0b0b0b", borderColor: isActive ? PRIMARY : "#202020", color: isActive ? "#fff" : "#a0a0a0" }}>{s.label}</button>);
                  })}
                </div>
                {dataSub === "attr" ? (<><SectionLabel en="Attribute Data" /><OperatorLevelPanel name={operator.name} enName={operator.enName} avatar={operator.avatar} element={operator.element} operatorClass={operator.class} weapon={operator.weapon} rarity={operator.rarity} mainStatLabel={operator.mainStatLabel ?? ""} subStatLabel={operator.subStatLabel ?? ""} levelStats={operator.levelStats} /></>) : null}
                {dataSub === "trust" && operator.trustBonus.length ? (<><SectionLabel en="Trust Data" /><TrustBonusPanel items={operator.trustBonus} /></>) : null}
                {dataSub === "potential" && operator.potential.length ? (<><SectionLabel en="Potential Data" /><PotentialPanel items={operator.potential} /></>) : null}
              </div>
            ) : null}

            {/* ===== SKILL MODULE ===== */}
            {activeModule === "skill" ? (
              <div className="grid gap-4">
                <div><SectionLabel en="Combat Skill" /><OperatorSkillsDeck accentColor={PRIMARY} skills={[operator.skills.normalAttack, operator.skills.battleSkill, operator.skills.comboSkill, operator.skills.ultimate]} /></div>
                {operator.talents.length ? (<div><SectionLabel en="Talent" /><TalentPanel items={operator.talents} accentColor={PRIMARY} /></div>) : null}
                {operator.infrastructureSkills.length ? (<div><SectionLabel en="Infrastructure" /><InfrastructureSkillPanel groups={operator.infrastructureSkills} accentColor={PRIMARY} /></div>) : null}
                {operator.elite.length ? (<div><SectionLabel en="Elite" /><ElitePanel elite={operator.elite} /></div>) : null}
              </div>
            ) : null}

            {activeModule === "material" ? (<div><SectionLabel en="Material Requirements" /><Placeholder title="MATERIAL — Phase 3" note="정예화·스킬 재료 총합과 파밍 계산기 연계를 Phase 3에서 구현합니다." /></div>) : null}
            {activeModule === "gallery" ? (<div><SectionLabel en="Gallery" /><Placeholder title="GALLERY — Phase 3" note="프로필·일러스트·보이스를 Phase 3에서 비주얼 우선으로 구현합니다." /></div>) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
