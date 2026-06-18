"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { farmStages } from "@/data/farming/farm-stages";
import type { EliteStage, MaterialCostItem, OperatorDetail, PotentialDetail, TalentDetail, TrustBonus } from "@/data/operators-transformers";

import HeroSlider from "./HeroSlider";
import OperatorLevelPanel from "./OperatorLevelPanel";

type OperatorRef = { slug: string; name: string; enName: string; avatar: string; element: string };
type WeaponRef = { slug: string; name: string; image: string };
type GearRef = { slug: string; name: string; setName: string; image: string };

const PRIMARY = "#ff9a2f";
const elementColor: Record<string, string> = { physical: "#d6dae3", cryo: "#4fa3ff", heat: "#ff8a1f", nature: "#3ecf8e", electric: "#c084fc" };
const elementLabelMap: Record<string, string> = { physical: "물리", cryo: "냉기", heat: "열기", nature: "자연", electric: "전기" };
const classLabelMap: Record<string, string> = { vanguard: "뱅가드", guard: "가드", defender: "디펜더", supporter: "서포터", caster: "캐스터", striker: "스트라이커" };
const weaponLabelMap: Record<string, string> = { sword: "한손검", greatsword: "양손검", polearm: "장병기", handcannon: "권총", artsunit: "아츠 유닛" };

const CUT = { clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" };
const ACCENT = "#ffd24a";
// 공용 호버: 노란 테두리 + 내부 5% 노란 틴트(기존 배경 유지) + 미세 상승. 모든 카드/칩 통일(0.2s).
const HOVER = "transition duration-200 hover:-translate-y-0.5 hover:border-[#ffd24a]/70 hover:shadow-[inset_0_0_0_999px_rgba(255,210,74,0.05),0_6px_18px_rgba(0,0,0,0.45)]";

// 스킬 타입 태그 — [일반 공격]/[배틀 스킬] 등 시각 강조 pill.
function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-wide" style={{ borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}>
      {children}
    </span>
  );
}

// 설명 내 수치(+12%, x1.5, 30 등)를 노란색으로 강조 — DATA 잠재/신뢰도 가독성.
function highlightNums(text: string): React.ReactNode {
  const matches = [...text.matchAll(/([+\-x×]?\s*\d+(?:\.\d+)?%?)/gi)];
  if (!matches.length) return text;
  const parts: React.ReactNode[] = [];
  let last = 0;
  matches.forEach((m, i) => {
    const v = m[0];
    const s = m.index ?? 0;
    if (s > last) parts.push(text.slice(last, s));
    parts.push(<span key={i} className="font-black" style={{ color: ACCENT }}>{v.replace(/\s+/g, "")}</span>);
    last = s + v.length;
  });
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

type ModuleId = "build" | "data" | "skill" | "material";

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
  return <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">{children}</span>;
}
function SectionLabel({ en, num, action, sub }: { en: string; num?: string; action?: React.ReactNode; sub?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${sub ? "mb-1.5" : "mb-2.5"}`}>
      <span className={sub ? "h-2.5 w-0.5" : "h-4 w-1"} style={{ background: sub ? "#5a5a5a" : PRIMARY }} />
      {num ? <span className="font-mono text-xs font-black tabular-nums" style={{ color: PRIMARY }}>{num}</span> : null}
      <span className={`font-mono font-black uppercase ${sub ? "text-[11px] tracking-[0.2em] text-ef-muted" : "text-[13px] tracking-[0.2em] text-white"}`}>{en}</span>
      {/* 메인 섹션만 라벨 우측으로 얇은 구분선 — 서브 섹션과 위계 차이 */}
      {!sub ? <span className="ml-2 hidden h-px flex-1 bg-gradient-to-r from-ef-line to-transparent sm:block" /> : null}
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
        <span className="block w-full truncate text-center text-[11px] font-black leading-tight text-ef-ink sm:hidden">{shortLabel}</span>
        <span className="hidden w-full text-center text-[11px] font-black leading-tight text-ef-ink sm:line-clamp-2">{label}</span>
      </span>
    </span>
  );
}

// PARTY COMPOSITION 섹션(BUILD=대표 빌드 기준 / USER SETTINGS=내 세팅 기준 공용). party=[메인,서브1,서브2,서브3] 슬러그.
function PartyComposition({ party, operatorBySlug }: { party: string[]; operatorBySlug: Map<string, OperatorRef> }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 min-[1440px]:justify-start min-[1440px]:gap-3 min-[1440px]:[grid-template-columns:repeat(4,minmax(130px,200px))]">
      {(["메인", "서브 1", "서브 2", "서브 3"] as const).map((label, i) => {
        const slug = party[i];
        const m = slug ? operatorBySlug.get(slug) : undefined;
        return (
          <div key={label} className="min-w-0 border border-ef-line bg-ef-card2 px-1 pb-1 pt-0.5 text-center lg:px-1.5 lg:pb-2 lg:pt-1.5" style={CUT}>
            <span className="relative mx-auto block h-11 w-11 overflow-hidden border border-ef-line bg-black sm:h-12 sm:w-12 lg:h-[60px] lg:w-[60px]">
              {slug ? <Image src={m?.avatar ?? `/operators/${slug}/avatar.webp`} alt="" fill sizes="64px" className="object-cover object-top" /> : <span className="flex h-full w-full items-center justify-center text-base font-black text-ef-muted">+</span>}
            </span>
            <p className="mt-0.5 truncate font-mono text-[10px] font-black uppercase tracking-wide leading-none lg:mt-1.5 lg:text-[11px]" style={{ color: i === 0 ? PRIMARY : "#a0a0a0" }}>{label}</p>
            <p className="mt-0.5 truncate text-[11px] font-bold leading-none text-ef-muted lg:mt-1 lg:text-xs lg:leading-tight">{m?.name ?? "빈 슬롯"}</p>
          </div>
        );
      })}
    </div>
  );
}

// ROTATION / CYCLE 섹션 — 기본 1~6단계, 7단계+면 "전체 사이클 보기 (+N)" 토글. 펼침은 max-height+opacity 트랜지션(250ms).
const CYCLE_CAP = 6;
const CYCLE_GRID = "grid grid-cols-2 gap-x-2 gap-y-2 min-[390px]:grid-cols-3 sm:grid-cols-6 sm:gap-y-2.5 xl:grid-cols-6 xl:gap-x-3 xl:gap-y-3 min-[1440px]:justify-start min-[1440px]:[grid-template-columns:repeat(6,minmax(0,108px))]";
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

// ===== MATERIAL 탭 유틸 =====
function parseCount(c: string | number): number {
  const n = typeof c === "number" ? c : parseInt(String(c).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}
// 여러 재료 비용 배열 합산 → 이름별 총합(아이콘 유지). 총합 내림차순.
function aggregateMaterials(...lists: (MaterialCostItem[] | undefined)[]): { name: string; icon: string; total: number }[] {
  const map = new Map<string, { name: string; icon: string; total: number }>();
  for (const list of lists)
    for (const it of list ?? []) {
      const prev = map.get(it.name);
      if (prev) prev.total += parseCount(it.count);
      else map.set(it.name, { name: it.name, icon: it.icon, total: parseCount(it.count) });
    }
  return [...map.values()].sort((a, b) => b.total - a.total);
}
// 스킬의 강화 재료(전 레벨) 평탄화. 데이터에 따라 upgradeMaterials 또는 upgradeCosts.
function skillMats(s: { upgradeCosts?: { materials: MaterialCostItem[] }[] }): MaterialCostItem[] {
  const u = s as { upgradeMaterials?: { materials: MaterialCostItem[] }[]; upgradeCosts?: { materials: MaterialCostItem[] }[] };
  return (u.upgradeMaterials ?? u.upgradeCosts ?? []).flatMap((x) => x.materials ?? []);
}
// 재료명 → 파밍 획득처 카테고리(farmStages 스테이지명에서 "N레벨/· …" 접미 제거).
const farmCategoryByMaterial: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const s of farmStages) {
    if (m.has(s.material)) continue;
    const cat = s.name.replace(/\s*\d+\s*레벨.*$/, "").replace(/\s*·.*$/, "").trim();
    m.set(s.material, cat || s.name);
  }
  return m;
})();
// 재료 칩(아이콘 + 이름 + 개수). MATERIAL 탭 공용.
function MaterialChip({ name, icon, count, large }: { name: string; icon: string; count: number | string; large?: boolean }) {
  return (
    <div className={`flex items-center gap-2 border border-ef-line bg-ef-card2 ${HOVER} ${large ? "min-h-[60px] px-2.5 py-2 min-[2560px]:py-2.5" : "min-h-[56px] px-2 py-1.5"}`} style={CUT}>
      <span className={`relative shrink-0 overflow-hidden border border-ef-line bg-black ${large ? "h-11 w-11 min-[2560px]:h-12 min-[2560px]:w-12" : "h-10 w-10"}`}>{icon ? <Image src={icon} alt="" fill sizes={large ? "48px" : "40px"} className="object-contain p-0.5" /> : null}</span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-bold leading-tight text-ef-ink ${large ? "text-xs min-[2560px]:text-sm" : "text-xs"}`}>{name}</span>
        <span className={`block font-mono font-black leading-tight ${large ? "text-sm min-[2560px]:text-base" : "text-xs"}`} style={{ color: PRIMARY }}>×{count}</span>
      </span>
    </div>
  );
}

// 재능(Talents) 카드 목록 — 카드 높이 통일. 모바일: 기본 1개만 펼침(탭 토글) / PC(sm+): 전부 펼침.
function TalentList({ talents }: { talents: TalentDetail[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2">
      {talents.map((tlt, i) => {
        const isOpen = open === i;
        return (
          <button key={i} type="button" onClick={() => setOpen(isOpen ? -1 : i)} className={`flex min-h-[92px] flex-col border border-ef-line bg-ef-card2 p-2 text-left ${HOVER} sm:cursor-default sm:p-2.5`} style={CUT}>
            <div className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden border border-ef-line bg-black">{tlt.icon ? <Image src={tlt.icon} alt="" fill sizes="36px" className="object-contain p-0.5" /> : null}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-ef-ink">{tlt.name}</p>
                {tlt.unlock ? <p className="truncate font-mono text-[10px] font-bold uppercase tracking-wide" style={{ color: PRIMARY }}>{tlt.unlock}</p> : null}
              </div>
              {tlt.description ? <span className="shrink-0 font-mono text-[11px] font-black sm:hidden" style={{ color: isOpen ? "#ffb347" : "#5a5a5a" }}>{isOpen ? "▲" : "▼"}</span> : null}
            </div>
            {tlt.description ? <p className={`mt-1.5 overflow-hidden break-keep text-xs leading-5 text-ef-muted transition-all duration-200 ease-out sm:line-clamp-none sm:max-h-none sm:opacity-100 ${isOpen ? "max-h-96 opacity-100" : "line-clamp-2 max-h-10 opacity-90"}`}>{tlt.description}</p> : null}
          </button>
        );
      })}
    </div>
  );
}

// 정예화(Elite) 카드 — MATERIAL/DATA 공용. 높이 통일(min-h-220).
function EliteCard({ stage, description, materials }: EliteStage) {
  return (
    <div className={`flex h-full min-h-[200px] flex-col border border-ef-line bg-ef-card2 p-2.5 ${HOVER}`} style={CUT}>
      <p className="font-mono text-[11px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>{stage}</p>
      {description ? <p className="mt-0.5 break-keep text-xs leading-5 text-ef-muted">{description}</p> : null}
      {materials.length ? (
        <div className="mt-auto grid grid-cols-1 gap-1.5 pt-2 min-[480px]:grid-cols-2">
          {materials.map((m, j) => <MaterialChip key={j} name={m.name} icon={m.icon} count={m.count} />)}
        </div>
      ) : null}
    </div>
  );
}

// 잠재능력(Potential) 카드 목록 — 카드 높이 통일, 수치 강조.
function PotentialList({ items }: { items: PotentialDetail[] }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2">
      {items.map((p, i) => (
        <div key={i} className={`flex min-h-[72px] gap-2.5 border border-ef-line bg-ef-card2 p-2 ${HOVER} sm:p-2.5`} style={CUT}>
          <span className="relative h-9 w-9 shrink-0 overflow-hidden border border-ef-line bg-black"><Image src={`/icons/potential/${i + 1}.webp`} alt="" fill sizes="36px" className="object-contain p-0.5" /></span>
          <div className="min-w-0">
            <p className="text-xs font-black text-ef-ink">{p.title}</p>
            <p className="mt-0.5 break-keep text-xs leading-5 text-ef-muted">{highlightNums(p.description)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 신뢰도 보너스(Trust) 그리드 — 다른 DATA 카드와 통일된 높이/구조(좌측 액센트 바 + 헤더 + 값).
function TrustGrid({ items }: { items: TrustBonus[] }) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((t) => (
        <div key={t.level} className={`relative flex min-h-[88px] flex-col justify-center gap-1.5 overflow-hidden border border-ef-line bg-ef-card2 p-3 pl-4 text-center ${HOVER}`} style={CUT}>
          <span className="absolute left-0 top-0 h-full w-1" style={{ background: PRIMARY }} />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-ef-muted">Trust Lv.{t.level}</span>
          <span className="break-keep text-base font-black text-ef-ink">{highlightNums(t.label)}</span>
        </div>
      ))}
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
  const elementLabel = elementLabelMap[element] ?? element;
  const maxLevel = Array.isArray(operator.levelStats) && operator.levelStats.length ? Math.max(...operator.levelStats.map((r) => r.level)) : 90;

  const [activeModule, setActiveModule] = useState<ModuleId>("build");
  // BUILD 탭 = 세팅 목록(커뮤니티/유저 등록 세팅). USER SETTINGS 탭 = 선택한 세팅 상세.
  const [builds, setBuilds] = useState<BuildItem[]>([]);
  const [buildsLoading, setBuildsLoading] = useState(true);
  const [buildsExpanded, setBuildsExpanded] = useState(false); // 모바일: 상위 5개 외 펼침
  const [skillKey, setSkillKey] = useState<"normalAttack" | "battleSkill" | "comboSkill" | "ultimate">("normalAttack"); // SKILL 탭 선택 스킬
  const [skillLvl, setSkillLvl] = useState<number | null>(null); // SKILL LEVEL TABLE 선택 레벨 인덱스(null=마지막/M3)
  const [selectedId, setSelectedId] = useState<string | null>(null); // 선택 세팅 상세
  const [selForm, setSelForm] = useState<Record<string, unknown> | null>(null);
  const [selIsMain, setSelIsMain] = useState(true); // 현재 오퍼레이터가 이 세팅의 메인인지(서브면 그 멤버 정보 표시)
  const [selCycle, setSelCycle] = useState<unknown[]>([]);
  const [selParty, setSelParty] = useState<string[]>([]);

  // 세팅 목록 로드. 첫 항목을 USER SETTINGS 기본 선택으로 둔다.
  useEffect(() => {
    let mounted = true;
    setBuildsLoading(true);
    const params = new URLSearchParams({ operators: operator.slug, sort: "popular", limit: "5", page: "1" });
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
          type Slot = { operatorSlug?: string; form?: Record<string, unknown> } | undefined;
          const slotKeys = ["main", "member1", "member2", "member3"] as const;
          const slugOf = (s: Slot) => String(s?.operatorSlug ?? (s?.form?.operatorSlug as string) ?? "").trim();
          const mainSlug = slugOf(slots.main);
          const members = [slots.member1, slots.member2, slots.member3].map(slugOf).filter(Boolean);
          setSelParty([mainSlug || operator.slug, ...members].filter(Boolean).slice(0, 4));
          // 현재 오퍼레이터가 차지한 슬롯의 form 을 사용 → 서브 멤버면 그 멤버의 무기/장비 표시(메인 정보 혼동 방지).
          const mySlot = (slotKeys.map((k) => slots[k] as Slot).find((s) => slugOf(s) === operator.slug)) ?? (slots.main as Slot);
          setSelIsMain(mainSlug === operator.slug || !mainSlug);
          setSelForm((mySlot?.form ?? null) as Record<string, unknown> | null);
        } else {
          setSelParty([]);
          setSelForm(null);
          setSelIsMain(true);
        }
        setSelCycle(Array.isArray(detail?.setting?.cycle) ? detail.setting.cycle : []);
      })
      .catch(() => {
        if (mounted) {
          setSelForm(null);
          setSelCycle([]);
          setSelParty([]);
          setSelIsMain(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [selectedId, operator.slug]);

  // 탭 전환 시 항상 최상단으로 스크롤 — 긴 탭에서 내려본 뒤 짧은 탭(SKILL/MATERIAL)으로 바꾸면
  // 좌측 히어로(데스크톱 sticky / 모바일 일반 흐름)가 뷰포트 밖에 남아 "배경 그리드만 보이는" 현상을 차단.
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, [activeModule]);

  const operatorBySlug = new Map(operators.map((o) => [o.slug, o]));
  const weaponBySlug = new Map(weapons.map((w) => [w.slug, w]));
  const gearBySlug = new Map(gears.map((g) => [g.slug, g]));

  // USER SETTINGS 탭 = 선택한 세팅 상세.
  const selected = builds.find((b) => b.id === selectedId) ?? null;
  const selWeapon = (() => {
    // 서브 멤버일 땐 그 멤버의 form 만 사용(메인 무기 fallback 금지 → 혼동 방지).
    const slug = (selForm?.weaponSlug as string) ?? (selIsMain ? selected?.slotsSummary?.mainWeaponSlug : undefined);
    return slug ? weaponBySlug.get(slug) : undefined;
  })();
  const selGears = [selForm?.armorSlug, selForm?.glovesSlug, selForm?.kit1Slug, selForm?.kit2Slug]
    .map((s) => String(s ?? "").trim())
    .filter(Boolean)
    .map((s) => gearBySlug.get(s))
    .filter((g): g is GearRef => Boolean(g))
    .slice(0, 4);
  // 메인일 때만 미리 계산된 세트명 사용, 서브는 그 멤버 장비로 계산.
  const selSetName = activeGearSetName(selGears) || (selIsMain ? (selected?.slotsSummary?.gearSetName ?? "") : "");
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
  ];

  return (
    <main className="relative min-h-screen bg-ef-bg text-ef-ink">
      {/* 레벨/탤런트 전환용 페이드 키프레임(클라이언트 전역 주입) */}
      <style>{`@keyframes efFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD — 본문과 동일한 중앙 정렬 최대폭(1720px) */}
      <div className="relative z-30 flex items-center justify-between px-4 py-2.5 sm:px-6 lg:px-7 min-[1024px]:mx-auto min-[1024px]:w-full min-[1024px]:max-w-[1720px] min-[1920px]:px-10">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">Operator File</span>
          <span className="hidden font-mono text-[11px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ID:${operator.slug.toUpperCase()}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/operators" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>목록</Link>
          <Link href="/" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>홈</Link>
        </div>
      </div>

      {/* 2컬럼: 좌 HERO(일러스트) / 우 MODULE(목록+상세).
          초광폭 안정화: 전체 컨테이너 max-width 1720px + 중앙 정렬. 비율 1024~1439=50:50 / 1440px↑=44:56(fr) 고정.
          1440px↑부터 좌(min 560) 우(min 720) minmax 로 과확장 방지 — 컨테이너 캡으로 우측이 ~960px 이상 늘어나지 않음. */}
      <div className="relative z-10 lg:grid lg:gap-6 lg:px-7 min-[1024px]:mx-auto min-[1024px]:w-full min-[1024px]:max-w-[1720px] min-[1024px]:grid-cols-[minmax(0,50%)_minmax(0,50%)] min-[1440px]:grid-cols-[minmax(560px,0.9fr)_minmax(720px,1.1fr)] min-[1920px]:gap-7 min-[1920px]:px-10">
        {/* ===== LEFT: HERO COLUMN — sticky 풀하이트 ===== */}
        <div className="lg:sticky lg:top-3 lg:self-start">
          <section className="relative flex h-[69vh] max-h-[86vh] min-h-[480px] flex-col overflow-hidden bg-black sm:h-[60vh] sm:max-h-[78vh] lg:h-[calc(100vh-1.5rem)] lg:max-h-none lg:border lg:border-ef-line" style={CUT}>
            <div className="absolute inset-0">
              {isAdminSlider ? (
                <HeroSlider images={adminSlides} alt={operator.name} />
              ) : (
                <Image src={heroImage} alt={operator.name} fill priority sizes="(max-width:1024px) 100vw, 900px" className="scale-[1.08] object-cover object-[center_6%]" />
              )}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.3)_0%,transparent_22%,transparent_64%,rgba(5,5,5,0.74)_87%,#0b0b0b_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:50px_50px]" />
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
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-ef-muted">Operator Profile</span>
                  <span className="text-sm tracking-widest text-ef-accent">{"★".repeat(operator.rarity)}</span>
                </div>
                {/* 모바일: 라벨 위·값 아래(가독성) / sm+: 라벨·값 한 줄 */}
                <div className="grid grid-cols-2">
                  <div className="flex min-w-0 flex-col gap-0.5 border-b border-r border-ef-line/70 px-3 py-1 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-ef-muted">속성</span>
                    <span className="flex min-w-0 items-center gap-1 text-[13px] font-black text-ef-ink sm:text-xs">
                      <span className="relative h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3"><Image src={elementIcon} alt="" fill sizes="14px" className="object-contain" /></span>
                      <span className="truncate">{elementLabel}</span>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5 border-b border-ef-line/70 px-3 py-1 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-ef-muted">직군</span>
                    <span className="min-w-0 truncate text-[13px] font-black text-ef-ink sm:text-xs">{classLabelMap[operator.class] ?? operator.class}</span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5 border-r border-ef-line/70 px-3 py-1 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-ef-muted">무기</span>
                    <span className="min-w-0 truncate text-[13px] font-black text-ef-ink sm:text-xs">{weaponLabelMap[operator.weapon] ?? operator.weapon}</span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5 px-3 py-1 sm:flex-row sm:items-center sm:gap-1.5">
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-ef-muted">성장</span>
                    <span className="min-w-0 truncate text-[13px] font-black sm:text-xs" style={{ color: PRIMARY }}>MAX {maxLevel} · 정예 {operator.elite.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== RIGHT: MODULE STAGE — 내부 콘텐츠 max-width 로 초광폭 과확장 방지(좌측 정렬) ===== */}
        <div className="px-3 pb-16 sm:px-6 lg:px-0 lg:pb-12 min-[1440px]:max-w-[1120px]">
          {/* 모듈 탭: 모바일/PC 모두 상단 Sticky — 콘텐츠(특히 ROTATION) 중간에 절대 끼어들지 않음 */}
          <nav className="sticky top-0 z-40 -mx-3 border-b border-ef-line bg-black px-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-0 lg:bg-black/85 lg:px-0">
            <div className="mx-auto flex max-w-[1840px] items-center gap-1 overflow-x-auto py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {modules.map((m, index) => {
                const isActive = m.id === activeModule;
                return (
                  <button key={m.id} type="button" onClick={() => setActiveModule(m.id)} className="group relative inline-flex min-h-12 flex-1 shrink-0 items-center justify-center gap-1 px-1.5 sm:gap-1.5 sm:px-2.5 lg:min-h-11 lg:flex-none lg:justify-start lg:px-3.5" style={isActive ? { background: `${PRIMARY}22` } : undefined}>
                    <span className="hidden font-mono text-[11px] font-bold sm:inline" style={{ color: isActive ? PRIMARY : "#a0a0a0" }}>{String(index + 1).padStart(2, "0")}</span>
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
                  <SectionLabel en="Community Builds" action={<Link href={`/settings?operators=${encodeURIComponent(operator.slug)}`} className="-my-1 inline-flex items-center px-2 py-1 font-mono text-[11px] font-black uppercase tracking-wide text-ef-accent-soft transition duration-200 hover:translate-x-0.5 hover:brightness-125">전체 보기 →</Link>} />
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
                              <span className="shrink-0 font-mono text-[11px] font-black uppercase tracking-wide" style={{ color: isSel ? "#ffb347" : "#a0a0a0" }}>상세 →</span>
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
                              <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">by {selAuthor} · {(selected.type === "party") ? "PARTY" : "SOLO"}</p>
                              {/* 현재 보고 있는 정보가 누구 것인지 명시(서브 멤버 혼동 방지) */}
                              <p className="mt-0.5 text-[11px] font-black"><span style={{ color: PRIMARY }}>{operator.name}</span><span className="ml-1 font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">· {selIsMain ? "메인" : "서브"} 기준</span></p>
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
                            <Link href={`/settings/${selected.id}`} className="font-mono text-[11px] font-black uppercase tracking-wide transition hover:brightness-125" style={{ color: PRIMARY }}>전체 세팅 페이지 →</Link>
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

            {/* ===== DATA MODULE — BUILD/SKILL/MATERIAL 와 동일한 카드 디자인 언어로 통일(스탯/재능/잠재/신뢰도/정예화) ===== */}
            {activeModule === "data" ? (
              <div className="flex flex-col gap-4 min-[2560px]:gap-5">
                {/* BASIC STATS — 레벨 동기화 + 주/보조 능력치 + 능력치 매트릭스 */}
                <div className="min-w-0">
                  <SectionLabel en="Basic Stats" />
                  <OperatorLevelPanel name={operator.name} enName={operator.enName} avatar={operator.avatar} element={operator.element} operatorClass={operator.class} weapon={operator.weapon} rarity={operator.rarity} mainStatLabel={operator.mainStatLabel ?? ""} subStatLabel={operator.subStatLabel ?? ""} levelStats={operator.levelStats} />
                </div>

                {/* TALENTS — 재능 카드(높이 통일) */}
                {operator.talents.length ? (
                  <div className="min-w-0">
                    <SectionLabel en="Talents" />
                    <TalentList talents={operator.talents} />
                  </div>
                ) : null}

                {/* POTENTIAL — 잠재능력 카드 */}
                {operator.potential.length ? (
                  <div className="min-w-0">
                    <SectionLabel en="Potential" />
                    <PotentialList items={operator.potential} />
                  </div>
                ) : null}

                {/* TRUST BONUS — 신뢰도 보너스 */}
                {operator.trustBonus.length ? (
                  <div className="min-w-0">
                    <SectionLabel en="Trust Bonus" />
                    <TrustGrid items={operator.trustBonus} />
                  </div>
                ) : null}

                {/* ELITE INFO — 정예화 단계 + 재료 */}
                {operator.elite.length ? (
                  <div className="min-w-0 mb-0">
                    <SectionLabel en="Elite Info" />
                    <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2">
                      {operator.elite.map((e, i) => <EliteCard key={i} stage={e.stage} description={e.description} materials={e.materials} />)}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* ===== SKILL MODULE — BUILD 디자인 카드 시스템(OVERVIEW → DETAIL → LEVEL) ===== */}
            {activeModule === "skill" ? (() => {
              const SKILL_LIST = [
                { key: "normalAttack", label: "기본 공격" },
                { key: "battleSkill", label: "배틀 스킬" },
                { key: "comboSkill", label: "연계 스킬" },
                { key: "ultimate", label: "궁극기" },
              ] as const;
              const sk = operator.skills[skillKey];
              return (
                <div className="flex flex-col gap-4 min-[2560px]:gap-5">
                  {/* SKILL OVERVIEW — 4개 스킬 카드(모바일 2×2 / PC 4열). 클릭 시 아래 상세 갱신 */}
                  <div className="min-w-0">
                    <SectionLabel en="Skill Overview" />
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                      {SKILL_LIST.map(({ key, label }) => {
                        const s = operator.skills[key];
                        const isSel = key === skillKey;
                        const cost = s.meta?.find((mt) => mt.value !== undefined);
                        return (
                          <button key={key} type="button" onClick={() => { setSkillKey(key); setSkillLvl(null); }} className={`flex flex-col items-center gap-1.5 border p-2.5 text-center ${isSel ? "" : `border-ef-line bg-ef-card ${HOVER}`}`} style={isSel ? { ...CUT, borderColor: "#ffb347", background: "rgba(255,170,60,0.12)", boxShadow: "0 0 16px rgba(255,170,60,0.16)" } : CUT}>
                            <span className="relative h-12 w-12 overflow-hidden border bg-black" style={{ borderColor: isSel ? "#ffb347" : "#202020" }}>{s.icon ? <Image src={s.icon} alt="" fill sizes="48px" className="object-contain p-1" /> : null}</span>
                            <span className="font-mono text-[10px] font-black uppercase tracking-wide" style={{ color: isSel ? "#ffb347" : "#a0a0a0" }}>{label}</span>
                            <span className="line-clamp-2 text-[11px] font-black leading-tight text-ef-ink">{s.name}</span>
                            {cost ? <span className="font-mono text-[10px] font-bold text-ef-muted">{cost.label} {cost.value}</span> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SKILL DETAIL — 선택 스킬 상세 */}
                  <div className="min-w-0">
                    <SectionLabel en="Skill Detail" />
                    <div className="overflow-hidden border bg-ef-card" style={{ ...CUT, borderColor: `${PRIMARY}55` }}>
                      <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
                      <div className="p-2.5 sm:p-3">
                        <div className="flex items-center gap-2.5">
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden border border-ef-line bg-black sm:h-12 sm:w-12">{sk.icon ? <Image src={sk.icon} alt="" fill sizes="48px" className="object-contain p-1" /> : null}</span>
                          <div className="min-w-0">
                            <SkillTag>{sk.typeLabel}</SkillTag>
                            <p className="mt-1 truncate text-sm font-black text-ef-ink sm:text-base">{sk.name}</p>
                          </div>
                        </div>
                        {sk.summary ? <p className="mt-2.5 max-w-[68ch] whitespace-pre-line break-keep text-[13px] leading-6 text-ef-muted">{sk.summary}</p> : null}
                        {sk.meta?.length ? (
                          <div className="mt-2.5 grid grid-cols-1 gap-1.5 border-t border-ef-line pt-2.5 sm:grid-cols-2">
                            {sk.meta.map((mt, i) => (
                              <div key={i} className="flex items-center justify-between gap-2 border border-ef-line bg-ef-card2 px-2.5 py-1" style={CUT}>
                                <span className="min-w-0 truncate text-[11px] font-bold text-ef-muted">{mt.label}</span>
                                {mt.value !== undefined ? <span className="shrink-0 font-mono text-xs font-black tabular-nums" style={{ color: PRIMARY }}>{mt.value}</span> : null}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* SKILL LEVEL TABLE — 레벨 선택 칩 + 선택 레벨 1개만 표시(기본 M3). 스크롤 길이 최소화 */}
                  {sk.levelValues?.length ? (() => {
                    const lastIdx = sk.levelValues.length - 1;
                    const curIdx = skillLvl == null ? lastIdx : Math.min(skillLvl, lastIdx);
                    const lv = sk.levelValues[curIdx];
                    return (
                      <div className="min-w-0">
                        <SectionLabel en="Skill Level Table" sub />
                        <div className="flex flex-wrap gap-1">
                          {sk.levelValues.map((l, i) => {
                            const on = i === curIdx;
                            return (
                              <button key={l.level} type="button" onClick={() => setSkillLvl(i)} className="min-w-[40px] border px-2 py-1 text-center font-mono text-[11px] font-black transition" style={{ ...CUT, borderColor: on ? "#ffb347" : "#202020", background: on ? "rgba(255,170,60,0.14)" : "#0b0b0b", color: on ? "#ffb347" : "#a0a0a0" }}>{/^[Mm]/.test(l.level) ? l.level : `Lv${l.level}`}</button>
                            );
                          })}
                        </div>
                        <div key={curIdx} className="mt-2 flex min-h-[168px] flex-col border border-ef-line bg-ef-card2 p-2.5" style={{ ...CUT, animation: "efFade 180ms ease-out" }}>
                          <p className="font-mono text-[11px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>LEVEL {lv.level}</p>
                          {lv.stats?.length ? (
                            <div className="mt-2 grid grid-cols-1 gap-1 border-t border-ef-line pt-2 sm:grid-cols-2">
                              {lv.stats.map((st, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 border border-ef-line bg-black px-2 py-1 text-[11px]" style={CUT}>
                                  <span className="min-w-0 truncate text-ef-muted">{st.label}</span>
                                  <span className="shrink-0 text-right font-mono font-black tabular-nums text-ef-ink">{st.value}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {lv.description ? <p className="mt-2 break-keep text-xs leading-5 text-ef-muted">{lv.description}</p> : null}
                        </div>
                      </div>
                    );
                  })() : null}

                  {/* TALENTS — 재능 카드(공용 TalentList: 모바일 1개 펼침 / PC 전부 펼침, 높이 통일) */}
                  {operator.talents.length ? (
                    <div className="min-w-0">
                      <SectionLabel en="Talents" sub />
                      <TalentList talents={operator.talents} />
                    </div>
                  ) : null}

                  {/* INFRASTRUCTURE — 기반시설 스킬 카드. 높이 통일 + 호버 */}
                  {operator.infrastructureSkills.length ? (
                    <div className="min-w-0 mb-0">
                      <SectionLabel en="Infrastructure" sub />
                      <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2">
                        {operator.infrastructureSkills.map((g, i) => (
                          <div key={i} className={`flex min-h-[120px] flex-col border border-ef-line bg-ef-card2 p-2.5 ${HOVER}`} style={CUT}>
                            <div className="flex items-center gap-2">
                              <span className="relative h-8 w-8 shrink-0 overflow-hidden border border-ef-line bg-black">{g.icon ? <Image src={g.icon} alt="" fill sizes="32px" className="object-contain p-0.5" /> : null}</span>
                              <p className="truncate text-xs font-black text-ef-ink">{g.name}</p>
                            </div>
                            <div className="mt-1.5 flex flex-col gap-1.5 border-t border-ef-line pt-1.5">
                              {g.levels.map((lv, j) => (
                                <div key={j} className="min-w-0">
                                  <p className="font-mono text-[10px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>{lv.tier} · {lv.unlockText}</p>
                                  <p className="break-keep text-xs leading-5 text-ef-muted">{lv.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })() : null}

            {/* ===== MATERIAL MODULE — 정예화 / 스킬 / 총합 / 파밍 카드 ===== */}
            {activeModule === "material" ? (() => {
              const SKILL_KEYS = ["normalAttack", "battleSkill", "comboSkill", "ultimate"] as const;
              const SKILL_LABELS: Record<(typeof SKILL_KEYS)[number], string> = { normalAttack: "기본 공격", battleSkill: "배틀 스킬", comboSkill: "연계 스킬", ultimate: "궁극기" };
              const rm = operator.requiredMaterials;
              const total = aggregateMaterials(
                operator.elite.flatMap((e) => e.materials),
                ...SKILL_KEYS.map((k) => skillMats(operator.skills[k])),
                ...(rm?.levelUp ?? []).map((x) => x.materials),
                ...(rm?.trustBonus ?? []).map((x) => x.materials),
                ...(rm?.infrastructure ?? []).map((x) => x.materials),
                ...(rm?.talents ?? []).map((x) => x.materials),
              );
              const hasSkillMats = SKILL_KEYS.some((k) => skillMats(operator.skills[k]).length);
              const hasAny = operator.elite.length || total.length;
              if (!hasAny) return <div className="min-w-0"><SectionLabel en="Materials" /><Placeholder title="No Material Data" note="이 오퍼레이터의 재료 데이터가 아직 없습니다." /></div>;
              return (
                <div className="flex flex-col gap-4 min-[2560px]:gap-5">
                  {/* OPERATOR UPGRADE — 정예화 재료(공용 EliteCard) */}
                  {operator.elite.length ? (
                    <div className="min-w-0">
                      <SectionLabel en="Operator Upgrade" />
                      <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2">
                        {operator.elite.map((e, i) => <EliteCard key={i} stage={e.stage} description={e.description} materials={e.materials} />)}
                      </div>
                    </div>
                  ) : null}

                  {/* SKILL UPGRADE — 스킬별 강화 재료(전 레벨 합산) */}
                  {hasSkillMats ? (
                    <div className="min-w-0">
                      <SectionLabel en="Skill Upgrade" />
                      <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2">
                        {SKILL_KEYS.map((k) => {
                          const agg = aggregateMaterials(skillMats(operator.skills[k]));
                          if (!agg.length) return null;
                          const s = operator.skills[k];
                          return (
                            <div key={k} className={`flex h-full min-h-[200px] flex-col border border-ef-line bg-ef-card2 p-2.5 ${HOVER}`} style={CUT}>
                              <div className="flex items-center gap-2">
                                <span className="relative h-9 w-9 shrink-0 overflow-hidden border border-ef-line bg-black">{s.icon ? <Image src={s.icon} alt="" fill sizes="36px" className="object-contain p-0.5" /> : null}</span>
                                <p className="min-w-0 truncate text-xs font-black text-ef-ink">{SKILL_LABELS[k]} <span className="text-ef-muted">· {s.name}</span></p>
                              </div>
                              <div className="mt-auto grid grid-cols-1 gap-1.5 pt-2 min-[480px]:grid-cols-2">
                                {agg.map((m, j) => <MaterialChip key={j} name={m.name} icon={m.icon} count={m.total} />)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* TOTAL MATERIALS — 전체 합산. 1920px↑ 3열 / 2560px↑ 4열로 세로 길이 단축, 카드 높이 통일 */}
                  {total.length ? (
                    <div className="min-w-0">
                      <SectionLabel en="Total Materials" />
                      <div className="grid grid-cols-1 items-stretch gap-1.5 min-[480px]:grid-cols-2 min-[1024px]:grid-cols-2 min-[1920px]:grid-cols-3">
                        {total.map((m, j) => <MaterialChip key={j} name={m.name} icon={m.icon} count={m.total} large />)}
                      </div>
                    </div>
                  ) : null}

                  {/* FARMING MATERIALS — 2줄 구조 카드(아이콘 / 재료명 / 획득처 태그). 클릭 시 파밍 계산기로 전달. 긴 텍스트도 레이아웃 유지(grid) */}
                  {total.length ? (
                    <div className="min-w-0 mb-0">
                      <SectionLabel en="Farming Materials" action={<Link href="/farming" className="-my-1 inline-flex items-center px-2 py-1 font-mono text-[11px] font-black uppercase tracking-wide text-ef-accent-soft transition duration-200 hover:translate-x-0.5 hover:brightness-125">파밍 계산기 →</Link>} />
                      <div className="grid grid-cols-2 items-stretch gap-2 min-[480px]:grid-cols-3 lg:grid-cols-2 min-[1440px]:grid-cols-3 min-[1920px]:grid-cols-4">
                        {total.map((m, j) => {
                          const src = farmCategoryByMaterial.get(m.name);
                          const href = `/farming?requiredMaterials=${encodeURIComponent(JSON.stringify([{ name: m.name, amount: m.total }]))}`;
                          return (
                            <Link key={j} href={href} title={`${m.name} · ${src ?? "특수 입수"}`} className={`flex h-[64px] items-center gap-2.5 border border-ef-line bg-ef-card2 px-2.5 py-2 ${HOVER}`} style={CUT}>
                              <span className="relative h-10 w-10 shrink-0 overflow-hidden border border-ef-line bg-black">{m.icon ? <Image src={m.icon} alt="" fill sizes="40px" className="object-contain p-0.5" /> : null}</span>
                              <span className="flex min-w-0 flex-1 flex-col gap-1">
                                <span className="truncate text-[11px] font-bold leading-tight text-ef-ink">{m.name}</span>
                                <span className="block h-[18px] w-fit max-w-full truncate border px-1.5 font-mono text-[10px] font-black uppercase leading-[16px] tracking-wide" style={{ borderColor: `${PRIMARY}55`, background: `${PRIMARY}14`, color: PRIMARY }}>{src ?? "특수 입수"}</span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })() : null}
          </div>
        </div>
      </div>
    </main>
  );
}
