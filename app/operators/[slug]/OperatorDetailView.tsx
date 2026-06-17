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
const weaponLabelMap: Record<string, string> = { sword: "한손검", greatsword: "양손검", polearm: "장병기", handcannon: "권총", artsunit: "아츠 유닛" };

const CUT = { clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" };

type ModuleId = "build" | "data" | "skill" | "material" | "gallery";
type DataSub = "attr" | "trust" | "potential";

// 세팅 목록 항목(/api/operator-settings 응답).
type BuildItem = {
  id: string;
  title: string;
  type?: string;
  likeCount?: number;
  viewCount?: number;
  nickname?: string | null;
  userNickname?: string | null;
  slotsSummary?: { mainOperatorSlug?: string; mainWeaponSlug?: string; memberOperatorSlugs?: string[]; gearSetName?: string };
};

// 세팅에 저장되는 사이클 스텝 구조(세팅 상세/파티 빌더와 동일 필드).
type CycleStep = {
  id?: string;
  element?: string;
  skillKey?: string;
  type?: string;
  skillIcon?: string;
  skillName?: string;
  skillLabel?: string;
  skillVariant?: string;
  variant?: string;
  operatorIcon?: string;
  operatorName?: string;
  operatorSlug?: string;
};

// actionType(skillKey/variant) → 오퍼레이터 스킬 아이콘 파일명 매핑(통일 테이블).
// 실제 아이콘은 /operators/<slug>/skills/<file>.webp 패턴으로 항상 존재한다.
const CYCLE_ICON_FILE: Record<string, string> = {
  // 기본 스킬키
  normalAttack: "normal",
  basic: "normal",
  battleSkill: "battle",
  battle: "battle",
  comboSkill: "combo",
  combo: "combo",
  chain: "combo",
  ultimate: "ultimate",
  // 변형(강공/낙공/지원 등)은 평타 계열 아이콘으로 폴백
  charged: "normal",
  heavy: "normal",
  plunge: "normal",
  support: "battle",
};

// skillIcon 이 비어있을 때만 사용하는 결정적 폴백 아이콘 경로. 못 만들면 빈 문자열(→ 중립 박스).
function cycleFallbackIcon(step: CycleStep): string {
  const slug = String(step?.operatorSlug ?? "").trim();
  if (!slug) return "";
  const variant = String(step?.skillVariant ?? step?.variant ?? "");
  const key = String(step?.skillKey ?? step?.type ?? "");
  const file =
    CYCLE_ICON_FILE[variant === "charged" || variant === "plunge" ? variant : key] ??
    CYCLE_ICON_FILE[key] ??
    "normal";
  return `/operators/${slug}/skills/${file}.webp`;
}

// 최종 아이콘: 저장된 skillIcon 우선, 없으면 결정적 폴백. 절대 undefined/null 아님.
function cycleStepIcon(step: CycleStep): string {
  const saved = typeof step?.skillIcon === "string" ? step.skillIcon.trim() : "";
  return saved || cycleFallbackIcon(step);
}

// 속성별 아이콘 테두리색(세팅 상세 getElementBorderClass 와 동일 의미).
const cycleElementBorder: Record<string, string> = {
  heat: "#ff6b5e",
  electric: "#ffd24a",
  cryo: "#5fd0ff",
  nature: "#3ecf8e",
  physical: "#cfd4dc",
};

// 스킬 타입 → 표시 라벨. 파티 빌더 getCycleSkillLabel 과 동일 규칙.
function cycleSkillLabel(step: CycleStep): string {
  const variant = String(step?.skillVariant ?? step?.variant ?? "");
  const key = String(step?.skillKey ?? step?.type ?? "");
  const fallback = String(step?.skillLabel ?? "");
  if (variant === "charged") return "강공";
  if (variant === "plunge") return "낙공";
  if (key === "normalAttack") return fallback || "평타";
  if (key === "battleSkill") return "배틀 스킬";
  if (key === "comboSkill") return "연계 스킬";
  if (key === "ultimate") return "궁극기";
  return fallback || String(step?.skillName ?? "스킬");
}

// 모바일용 짧은 타입 라벨(궁극/배틀/연계/강공/낙공/평타) — 1줄 강제용.
function cycleSkillShortLabel(step: CycleStep): string {
  const variant = String(step?.skillVariant ?? step?.variant ?? "");
  const key = String(step?.skillKey ?? step?.type ?? "");
  if (variant === "charged") return "강공";
  if (variant === "plunge") return "낙공";
  if (key === "normalAttack") return "평타";
  if (key === "battleSkill") return "배틀";
  if (key === "comboSkill") return "연계";
  if (key === "ultimate") return "궁극";
  return cycleSkillLabel(step);
}

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">{children}</span>;
}
function SectionLabel({ en, num, action }: { en: string; num?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-3.5 w-1" style={{ background: PRIMARY }} />
      {num ? <span className="font-mono text-xs font-black tabular-nums" style={{ color: PRIMARY }}>{num}</span> : null}
      <span className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-ef-accent-soft">{en}</span>
      {action ? <span className="ml-auto">{action}</span> : null}
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

// 사이클 스텝 1개: 실제 스킬 아이콘 + 타입 라벨(+ 시전 오퍼레이터 배지 + 순번).
// 그리드 셀에 맞춰 폭을 채우고(w-full), 모바일 12개 초과 숨김은 className 으로 제어.
function CycleStepChip({ step, order, className = "" }: { step: CycleStep; order?: number; className?: string }) {
  const label = cycleSkillLabel(step);
  const shortLabel = cycleSkillShortLabel(step);
  const icon = cycleStepIcon(step); // 통일 매핑(저장값 우선 → 결정적 폴백). 빈 문자열일 때만 중립 박스.
  const opIcon = typeof step?.operatorIcon === "string" && step.operatorIcon.trim() ? step.operatorIcon : "";
  const border = cycleElementBorder[String(step?.element ?? "physical")] ?? "#cfd4dc";
  return (
    <span className={`flex flex-col items-center gap-1 ${className}`} title={`${step?.operatorName ?? ""} · ${step?.skillName ?? label}`}>
      {/* 아이콘 박스: 번호(좌상단)·아이콘(중앙)·오퍼레이터(우하단)가 겹치지 않도록 절대배치 분리. 모바일은 식별성 위해 확대(55px). */}
      <span className="relative aspect-square w-[55px] shrink-0 overflow-hidden border-2 bg-black sm:w-full sm:max-w-[60px] xl:max-w-[82px]" style={{ borderColor: `${border}cc` }}>
        {/* 아이콘 — 중앙(코너 배지를 피하도록 패딩 확보) */}
        {icon ? <Image src={icon} alt={step?.skillName ?? label} fill sizes="60px" className="object-contain p-2" /> : <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-ef-muted">—</span>}
        {/* 번호 — 좌상단 절대배치(불투명 배경으로 아이콘과 분리) */}
        {order ? <span className="absolute left-0 top-0 z-20 min-w-[15px] bg-black px-0.5 text-center font-mono text-[8px] font-black leading-[13px]" style={{ color: PRIMARY }}>{String(order).padStart(2, "0")}</span> : null}
        {/* 오퍼레이터 — 우하단 절대배치 */}
        {opIcon ? (
          <span className="absolute bottom-0 right-0 z-20 h-4 w-4 overflow-hidden border border-black bg-black sm:h-[18px] sm:w-[18px]">
            <Image src={opIcon} alt={step?.operatorName ?? ""} fill sizes="18px" className="object-cover object-top" />
          </span>
        ) : null}
      </span>
      {/* 라벨 영역 — min-height 고정으로 모든 카드 높이 동일. 모바일 짧은 라벨 1줄 강제 / sm+ 전체 라벨 2줄까지 */}
      <span className="flex min-h-[14px] w-full items-start justify-center sm:min-h-[26px]">
        <span className="block w-full truncate text-center text-[10px] font-black leading-tight text-ef-ink sm:hidden">{shortLabel}</span>
        <span className="hidden w-full text-center text-[10px] font-black leading-tight text-ef-ink sm:line-clamp-2">{label}</span>
      </span>
    </span>
  );
}

// PARTY COMPOSITION 섹션(BUILD=대표 빌드 기준 / USER SETTINGS=내 세팅 기준 공용). party=[메인,서브1,서브2,서브3] 슬러그.
function PartyComposition({ party, operatorBySlug }: { party: string[]; operatorBySlug: Map<string, OperatorRef> }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
      {(["메인", "서브 1", "서브 2", "서브 3"] as const).map((label, i) => {
        const slug = party[i];
        const m = slug ? operatorBySlug.get(slug) : undefined;
        return (
          <div key={label} className="min-w-0 border border-ef-line bg-ef-card2 px-1 pb-1 pt-0.5 text-center lg:px-1.5 lg:pb-2 lg:pt-1.5" style={CUT}>
            <span className="relative mx-auto block h-11 w-11 overflow-hidden border border-ef-line bg-black sm:h-12 sm:w-12 lg:h-[60px] lg:w-[60px]">
              {slug ? <Image src={m?.avatar ?? `/operators/${slug}/avatar.webp`} alt="" fill sizes="64px" className="object-cover object-top" /> : <span className="flex h-full w-full items-center justify-center text-base font-black text-ef-muted">+</span>}
            </span>
            <p className="mt-0.5 truncate font-mono text-[9px] font-black uppercase tracking-wide leading-none lg:mt-1.5 lg:text-[10px]" style={{ color: i === 0 ? PRIMARY : "#a0a0a0" }}>{label}</p>
            <p className="mt-0.5 truncate text-[10px] font-bold leading-none text-ef-muted lg:mt-1 lg:text-xs lg:leading-tight">{m?.name ?? "빈 슬롯"}</p>
          </div>
        );
      })}
    </div>
  );
}

// ROTATION / CYCLE 섹션 — 기본 1~6단계, 7단계+면 "전체 사이클 보기 (+N)" 토글. 펼침은 max-height+opacity 트랜지션(250ms).
const CYCLE_CAP = 6;
const CYCLE_GRID = "grid grid-cols-2 gap-x-2 gap-y-2 min-[390px]:grid-cols-3 sm:grid-cols-6 sm:gap-y-2.5 xl:grid-cols-6 xl:gap-x-3 xl:gap-y-3";
function RotationCycle({ steps }: { steps: CycleStep[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!steps.length) return null;
  const first = steps.slice(0, CYCLE_CAP);
  const extra = steps.slice(CYCLE_CAP);
  return (
    <div>
      <div className={CYCLE_GRID}>
        {first.map((step, i) => (
          <CycleStepChip key={step.id ?? i} step={step} order={i + 1} className="w-full" />
        ))}
      </div>
      {extra.length ? (
        <>
          {/* 펼침 영역 — max-height/opacity 트랜지션(250ms)으로 부드럽게 열고 닫힘 */}
          <div className={`overflow-hidden transition-all duration-[250ms] ease-out ${expanded ? "mt-2 max-h-[1400px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className={CYCLE_GRID}>
              {extra.map((step, i) => (
                <CycleStepChip key={step.id ?? i + CYCLE_CAP} step={step} order={i + 1 + CYCLE_CAP} className="w-full" />
              ))}
            </div>
          </div>
          <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-2 flex h-10 min-h-10 w-full items-center justify-center gap-1.5 border font-mono text-[11px] font-black uppercase tracking-wide transition duration-200 hover:brightness-110" style={{ ...CUT, borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}>
            {expanded ? "▲ 접기" : `▼ 전체 사이클 보기 (+${extra.length})`}
          </button>
        </>
      ) : null}
    </div>
  );
}

// 4슬롯(갑옷/장갑/부품1/부품2) 중 같은 세트가 3개 이상이면 활성 세트명. 없으면 빈 문자열(서버 getActiveGearSet 와 동일 임계값).
function activeGearSetName(gears: GearRef[]): string {
  const counts = new Map<string, number>();
  for (const g of gears) {
    const name = g.setName;
    if (!name || name === "세트 없음") continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  for (const [name, count] of counts) if (count >= 3) return name;
  return "";
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
  const elementLabel = elementLabelMap[element] ?? element;
  const maxLevel = Array.isArray(operator.levelStats) && operator.levelStats.length ? Math.max(...operator.levelStats.map((r) => r.level)) : 90;

  const [activeModule, setActiveModule] = useState<ModuleId>("build");
  const [dataSub, setDataSub] = useState<DataSub>("attr");
  // BUILD 탭 = 세팅 목록(커뮤니티/유저 등록 세팅). USER SETTINGS 탭 = 선택한 세팅 상세.
  const [builds, setBuilds] = useState<BuildItem[]>([]);
  const [buildsLoading, setBuildsLoading] = useState(true);
  const [buildsExpanded, setBuildsExpanded] = useState(false); // 모바일: 상위 5개 외 펼침
  const [selectedId, setSelectedId] = useState<string | null>(null); // 선택 세팅 상세
  const [selForm, setSelForm] = useState<Record<string, unknown> | null>(null);
  const [selCycle, setSelCycle] = useState<unknown[]>([]);
  const [selParty, setSelParty] = useState<string[]>([]);

  // 세팅 목록 로드. 첫 항목을 USER SETTINGS 기본 선택으로 둔다.
  useEffect(() => {
    let mounted = true;
    setBuildsLoading(true);
    const params = new URLSearchParams({ operators: operator.slug, sort: "popular", limit: "12", page: "1" });
    fetch(`/api/operator-settings?${params.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted) return;
        const list: BuildItem[] = data?.settings ?? [];
        setBuilds(list);
        setBuildsLoading(false);
        setSelectedId(list[0]?.id ?? null);
      })
      .catch(() => {
        if (mounted) setBuildsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [operator.slug]);

  // 선택 세팅 상세(USER SETTINGS 탭). BUILD 목록에서 항목을 클릭해 selectedId 가 바뀌면 무기/장비/파티/사이클 재로드.
  useEffect(() => {
    if (!selectedId) {
      setSelForm(null);
      setSelCycle([]);
      setSelParty([]);
      return;
    }
    let mounted = true;
    fetch(`/api/operator-settings/${selectedId}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((detail) => {
        if (!mounted) return;
        const slots = detail?.setting?.slots;
        if (slots) {
          const members = [slots.member1?.operatorSlug, slots.member2?.operatorSlug, slots.member3?.operatorSlug].map((x: unknown) => String(x ?? "").trim()).filter(Boolean);
          setSelParty([String(slots.main?.operatorSlug ?? operator.slug), ...members].filter(Boolean).slice(0, 4));
          setSelForm((slots.main?.form ?? null) as Record<string, unknown> | null);
        } else {
          setSelParty([]);
          setSelForm(null);
        }
        setSelCycle(Array.isArray(detail?.setting?.cycle) ? detail.setting.cycle : []);
      })
      .catch(() => {
        if (mounted) {
          setSelForm(null);
          setSelCycle([]);
          setSelParty([]);
        }
      });
    return () => {
      mounted = false;
    };
  }, [selectedId, operator.slug]);

  const operatorBySlug = new Map(operators.map((o) => [o.slug, o]));
  const weaponBySlug = new Map(weapons.map((w) => [w.slug, w]));
  const gearBySlug = new Map(gears.map((g) => [g.slug, g]));

  // USER SETTINGS 탭 = 선택한 세팅 상세.
  const selected = builds.find((b) => b.id === selectedId) ?? null;
  const selWeapon = (() => {
    const slug = (selForm?.weaponSlug as string) ?? selected?.slotsSummary?.mainWeaponSlug;
    return slug ? weaponBySlug.get(slug) : undefined;
  })();
  const selGears = [selForm?.armorSlug, selForm?.glovesSlug, selForm?.kit1Slug, selForm?.kit2Slug]
    .map((s) => String(s ?? "").trim())
    .filter(Boolean)
    .map((s) => gearBySlug.get(s))
    .filter((g): g is GearRef => Boolean(g))
    .slice(0, 4);
  const selSetName = selected?.slotsSummary?.gearSetName || activeGearSetName(selGears);
  const selPartyResolved = selParty.length ? selParty : selected ? [operator.slug] : [];
  const selCycleSteps = (selCycle as CycleStep[]).filter((s) => s && typeof s === "object");
  const selAuthor = selected?.userNickname ?? selected?.nickname ?? "익명";

  // BUILD 목록에서 세팅 클릭 → 같은 페이지(BUILD 탭) 우측 상세 패널 즉시 갱신(탭 이동 없음).
  const openSetting = (id: string) => setSelectedId(id);

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

      {/* TOP HUD */}
      <div className="relative z-30 flex items-center justify-between px-4 py-2.5 sm:px-6 lg:px-7 min-[1920px]:px-10">
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

      {/* 2컬럼: 좌 HERO(일러스트) / 우 MODULE(목록+상세). max-width 없이 확장. 비율 ~1919=50:50 / 1920=45:55 / 2560=42:58(우측 빌드 영역 확대). */}
      <div className="relative z-10 lg:grid lg:gap-6 lg:px-7 min-[1024px]:grid-cols-[minmax(0,50%)_minmax(0,50%)] min-[1920px]:grid-cols-[minmax(0,45%)_minmax(0,55%)] min-[1920px]:gap-7 min-[1920px]:px-10 min-[2560px]:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
        {/* ===== LEFT: HERO COLUMN — sticky 풀하이트(모니터가 클수록 더 크고 길어짐) ===== */}
        <div className="lg:sticky lg:top-3 lg:self-start">
          <section className="relative flex h-[69vh] max-h-[86vh] min-h-[480px] flex-col overflow-hidden sm:h-[60vh] sm:max-h-[78vh] lg:h-[calc(100vh-1.5rem)] lg:max-h-none lg:border lg:border-ef-line" style={CUT}>
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

            {/* 콘텐츠: 시선 흐름 = 일러 → 이름 → 영문 → 프로필 패널 (DOM·시각 순서 일치). 하단 정렬 */}
            <div className="relative z-10 mt-auto p-4 sm:p-5 lg:px-8 lg:pb-[11vh]">
              {/* 1) 이름 — Hero 핵심 시선 요소 */}
              <h1 className="max-w-[calc(100vw-2rem)] break-keep text-[clamp(45px,10.6vw,102px)] font-black leading-[0.86] tracking-tight text-white drop-shadow-[0_8px_34px_rgba(0,0,0,0.92)] lg:max-w-none">
                {operator.name}
              </h1>
              {/* 2) 영문명 — 이름 바로 아래(모바일 14px / PC 8px) */}
              <p className="mt-3.5 max-w-[calc(100vw-2rem)] break-words font-mono text-[15px] font-bold uppercase tracking-[0.22em] sm:mt-2 sm:text-base sm:tracking-[0.26em] lg:max-w-none" style={{ color: elColor }}>{operator.enName}</p>
              {/* 3) 프로필 패널 — 이름과 더 분리(모바일 48px / PC 32px)해 텍스트 충돌 감소·일러 감상 영역 확보. 보조 요소: 더 투명·약한 blur·얇은 1px 구분선, 박스 프레임 금지 */}
              <div className="mt-12 w-full max-w-[min(440px,calc(100vw-2rem))] border border-ef-line/70 bg-ef-card/65 backdrop-blur-sm sm:mt-8" style={CUT}>
                <div className="flex items-center justify-between gap-2 border-b border-ef-line/70 px-3 py-1">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-ef-muted">Operator Profile</span>
                  <span className="text-sm tracking-widest text-ef-accent">{"★".repeat(operator.rarity)}</span>
                </div>
                {/* 모바일: 라벨 위·값 아래(가독성) / sm+: 라벨·값 한 줄 */}
                <div className="grid grid-cols-2">
                  <div className="flex min-w-0 flex-col gap-0.5 border-b border-r border-ef-line/70 px-3 py-1 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-ef-muted">속성</span>
                    <span className="flex min-w-0 items-center gap-1 text-[13px] font-black text-ef-ink sm:text-xs">
                      <span className="relative h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3"><Image src={elementIcon} alt="" fill sizes="14px" className="object-contain" /></span>
                      <span className="truncate">{elementLabel}</span>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5 border-b border-ef-line/70 px-3 py-1 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-ef-muted">직군</span>
                    <span className="min-w-0 truncate text-[13px] font-black text-ef-ink sm:text-xs">{classLabelMap[operator.class] ?? operator.class}</span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5 border-r border-ef-line/70 px-3 py-1 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-ef-muted">무기</span>
                    <span className="min-w-0 truncate text-[13px] font-black text-ef-ink sm:text-xs">{weaponLabelMap[operator.weapon] ?? operator.weapon}</span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5 px-3 py-1 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-ef-muted">성장</span>
                    <span className="min-w-0 truncate text-[13px] font-black sm:text-xs" style={{ color: PRIMARY }}>MAX {maxLevel} · 정예 {operator.elite.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== RIGHT: MODULE STAGE ===== */}
        <div className="px-3 pb-16 sm:px-6 lg:px-0 lg:pb-12">
          {/* 모듈 탭: 모바일/PC 모두 상단 Sticky — 콘텐츠(특히 ROTATION) 중간에 절대 끼어들지 않음 */}
          <nav className="sticky top-0 z-40 -mx-3 border-b border-ef-line bg-black px-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-0 lg:bg-black/85 lg:px-0">
            <div className="mx-auto flex max-w-[1840px] items-center gap-1 overflow-x-auto py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {modules.map((m, index) => {
                const isActive = m.id === activeModule;
                return (
                  <button key={m.id} type="button" onClick={() => setActiveModule(m.id)} className="group relative inline-flex min-h-12 flex-1 shrink-0 items-center justify-center gap-1 px-1.5 sm:gap-1.5 sm:px-2.5 lg:min-h-11 lg:flex-none lg:justify-start lg:px-3.5" style={isActive ? { background: `${PRIMARY}22` } : undefined}>
                    <span className="hidden font-mono text-[10px] font-bold sm:inline" style={{ color: isActive ? PRIMARY : "#a0a0a0" }}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={`whitespace-nowrap font-mono text-[11px] font-black tracking-tight transition sm:text-xs sm:tracking-wide ${isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>{m.label}</span>
                    <span className={`absolute inset-x-2 bottom-0 h-0.5 transition ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} style={{ background: PRIMARY }} />
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="mt-4 min-w-0">
            {/* ===== BUILD MODULE ===== */}
            {activeModule === "build" ? (
              <div className="flex flex-col gap-4 min-[2560px]:gap-5">
                {/* COMMUNITY BUILDS — 커뮤니티 세팅 목록. 제목 우측 "전체 보기 →". 모바일은 상위 5개 + 펼치기(데스크톱은 전체) */}
                <div className="min-w-0">
                  <SectionLabel en="Community Builds" action={<Link href={`/settings?operators=${encodeURIComponent(operator.slug)}`} className="-my-1 inline-flex items-center px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wide text-ef-accent-soft transition duration-200 hover:translate-x-0.5 hover:brightness-125">전체 보기 →</Link>} />
                  {buildsLoading ? (
                    <div className="grid gap-2">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 animate-pulse bg-ef-card2" style={CUT} />)}</div>
                  ) : builds.length > 0 ? (
                    <>
                      <div className="divide-y divide-ef-line/50 border-y border-ef-line/50">
                        {builds.map((b, idx) => {
                          const w = b.slotsSummary?.mainWeaponSlug ? weaponBySlug.get(b.slotsSummary.mainWeaponSlug) : undefined;
                          const party = (b.slotsSummary?.memberOperatorSlugs ?? []).slice(0, 3);
                          const isParty = b.type === "party" || party.length > 0;
                          const isSel = b.id === selectedId;
                          // 모바일: 상위 5개만 기본 노출(펼치면 전체). 데스크톱(lg): 항상 전체.
                          const hideMobile = idx >= 5 && !buildsExpanded;
                          return (
                            <button key={b.id} type="button" onClick={() => openSetting(b.id)} className={`${hideMobile ? "hidden lg:flex" : "flex"} w-full items-center gap-3 py-2.5 pr-1 text-left transition-all duration-200 hover:translate-x-0.5 hover:bg-white/[0.04] min-[2560px]:py-3.5`} style={{ borderLeft: isSel ? "4px solid #ffb347" : "4px solid transparent", paddingLeft: "8px", background: isSel ? "rgba(255,170,60,0.15)" : undefined, boxShadow: isSel ? "0 0 20px rgba(255,170,60,0.18)" : undefined }}>
                              <span className="relative h-11 w-11 shrink-0 overflow-hidden border bg-black min-[2560px]:h-12 min-[2560px]:w-12" style={{ borderColor: isSel ? "#ffb347" : "#202020" }}>{w?.image ? <Image src={w.image} alt="" fill sizes="48px" className="object-cover" /> : null}</span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5">
                                  <span className="shrink-0 font-mono text-xs font-black" style={{ color: PRIMARY }}>♥ {b.likeCount ?? 0}</span>
                                  <span className="min-w-0 truncate text-sm font-black leading-tight" style={{ color: isSel ? "#fff" : undefined }}>{b.title}</span>
                                  <span className="shrink-0 font-mono text-[8px] font-black tracking-wider text-ef-muted">{isParty ? "PARTY" : "SOLO"}</span>
                                </span>
                                <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-ef-muted">
                                  <span className="shrink-0 truncate">{b.userNickname ?? b.nickname ?? "익명"}</span>
                                  {b.slotsSummary?.gearSetName ? <span className="truncate" style={{ color: PRIMARY }}>· {b.slotsSummary.gearSetName}</span> : null}
                                </span>
                              </span>
                              <span className="shrink-0 font-mono text-[10px] font-black uppercase tracking-wide" style={{ color: isSel ? "#ffb347" : "#a0a0a0" }}>상세 →</span>
                            </button>
                          );
                        })}
                      </div>
                      {/* 모바일 전용: 6개 이상이면 전체 보기/접기 */}
                      {builds.length > 5 ? (
                        <button type="button" onClick={() => setBuildsExpanded((v) => !v)} className="mt-2 flex min-h-10 w-full items-center justify-center font-mono text-[11px] font-black uppercase tracking-wide text-ef-accent-soft transition hover:brightness-125 lg:hidden">
                          {buildsExpanded ? "▲ 접기" : `▼ 커뮤니티 빌드 전체 보기 (+${builds.length - 5})`}
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <Placeholder title="No Community Builds" note="이 오퍼레이터의 커뮤니티 빌드가 아직 없습니다." />
                  )}
                </div>

                {/* SETTING DETAIL — 선택한 세팅 상세(같은 페이지 인라인). 제목/작성자/추천수/무기/장비/스탯 */}
                {selected ? (
                  <>
                    <div className="min-w-0">
                      <SectionLabel en="Setting Detail" />
                      <div className="overflow-hidden border bg-ef-card" style={{ ...CUT, borderColor: `${PRIMARY}55` }}>
                        <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
                        <div className="p-2 sm:px-3 sm:py-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-ef-ink">{selected.title}</p>
                              <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-ef-muted">by {selAuthor} · {(selected.type === "party") ? "PARTY" : "SOLO"}</p>
                            </div>
                            <span className="shrink-0 text-sm font-black" style={{ color: PRIMARY }}>♥ {selected.likeCount ?? 0}</span>
                          </div>
                          <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 sm:mt-2.5 sm:grid-cols-4 sm:gap-y-2">
                            <div className="min-w-0">
                              <Meta>Weapon</Meta>
                              <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="relative h-8 w-8 shrink-0 overflow-hidden border border-ef-line bg-black">{selWeapon?.image ? <Image src={selWeapon.image} alt="" fill sizes="32px" className="object-cover" /> : null}</span>
                                <span className="min-w-0 truncate text-xs font-black text-ef-ink">{selWeapon?.name ?? "—"}</span>
                              </div>
                            </div>
                            <div className="min-w-0">
                              <Meta>Gear Set</Meta>
                              <div className="mt-0.5 flex items-center gap-1">{selGears.length ? selGears.map((g) => (<span key={g.slug} className="relative h-7 w-7 shrink-0 overflow-hidden border border-ef-line bg-black"><Image src={g.image} alt="" fill sizes="28px" className="object-cover" /></span>)) : <span className="text-xs font-black text-ef-muted">—</span>}</div>
                              <span className="mt-0.5 block truncate text-[11px] font-black leading-tight" style={{ color: selSetName ? PRIMARY : "#a0a0a0" }}>{selSetName || "세트 없음"}</span>
                            </div>
                            <div><Meta>Main Stat</Meta><p className="mt-0.5 truncate text-xs font-black" style={{ color: PRIMARY }}>{operator.mainStatLabel || "-"}</p></div>
                            <div><Meta>Sub Stat</Meta><p className="mt-0.5 truncate text-xs font-black text-ef-ink">{operator.subStatLabel || "-"}</p></div>
                          </div>
                          <div className="mt-1.5 border-t border-ef-line pt-1.5 sm:mt-3 sm:pt-2.5">
                            <Link href={`/settings/${selected.id}`} className="font-mono text-[10px] font-black uppercase tracking-wide transition hover:brightness-125" style={{ color: PRIMARY }}>전체 세팅 페이지 →</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PARTY COMPOSITION — 선택 세팅 기준 */}
                    <div className="min-w-0">
                      <SectionLabel en="Party Composition" />
                      <PartyComposition party={selPartyResolved} operatorBySlug={operatorBySlug} />
                    </div>

                    {/* ROTATION / CYCLE — 선택 세팅의 등록 스킬 카드만(있을 때만) */}
                    {selCycleSteps.length ? (
                      <div className="min-w-0 mb-0">
                        <SectionLabel en="Rotation / Cycle" />
                        <RotationCycle steps={selCycleSteps} />
                      </div>
                    ) : null}
                  </>
                ) : null}
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
