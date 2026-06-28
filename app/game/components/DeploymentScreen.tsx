"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Heart,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  Users,
  X,
  Zap,
} from "lucide-react";

import { allOperators } from "../data/operators";
import { makeCard, makeOperatorUtilCard } from "../data/cards";
import { OPERATOR_TALENTS } from "../data/operator-talents";
import type {
  Card,
  Element,
  Operator,
  OperatorClass,
  PassiveMechanic,
  SkillKind,
} from "../types/game";

const TEAM_SIZE = 4;

// 직군 → 전술 역할(편성 분석용)
const CLASS_ROLE: Record<OperatorClass, "공격" | "방어" | "지원"> = {
  "가드": "공격",
  "스트라이커": "공격",
  "캐스터": "공격",
  "뱅가드": "공격",
  "디펜더": "방어",
  "서포터": "지원",
};

// 개별 재능(passiveMechanic) → 한눈에 보는 시너지 태그. useRunState 구현과 1:1.
const MECH_TAG: Partial<Record<PassiveMechanic, string>> = {
  "team-amp": "팀 증폭",
  "vs-broken": "불균형 특화",
  "vs-status": "이상 특화",
  "crystal-burst": "취약 특화",
  "blade-stacks": "누적 강타",
  "essence-collapse": "결정 분쇄",
  "flat-power": "상시 화력",
  "crit-surge": "치명 폭발",
  "energy-surge": "에너지 순환",
  "support-heal": "회복",
  "guardian-shield": "보호막",
};

const TEAM_AMP_PER_HOLDER = 10; // useRunState: 생존 team-amp 보유자당 +10% 파티 카드 피해

const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

// 속성별 의미 색상 보존 — 카드 상단 액센트 바 + 칩 테두리에 사용
const elementMeta: Record<Element, { label: string; color: string }> = {
  physical: { label: "물리", color: "#c7cdd6" },
  heat: { label: "열기", color: "#ff8a4c" },
  electric: { label: "전기", color: "#FBCB38" },
  cryo: { label: "냉기", color: "#67e8f9" },
  nature: { label: "자연", color: "#86efac" },
};
const ELEMENT_ORDER: Element[] = ["physical", "heat", "electric", "cryo", "nature"];
const CLASS_ORDER: OperatorClass[] = [
  "가드",
  "스트라이커",
  "캐스터",
  "디펜더",
  "서포터",
  "뱅가드",
];

type SortKey = "default" | "atk" | "hp";
const SORT_LABEL: Record<SortKey, string> = { default: "기본", atk: "공격", hp: "체력" };

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="block border border-ef-line bg-ef-card px-2 py-1.5 text-center" style={CUT_SM}>
      <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ef-muted">{label}</span>
      <span className="mt-0.5 block font-mono text-xs font-black tabular-nums text-ef-ink">{value}</span>
    </span>
  );
}

// 필터/정렬 칩 — 활성 시 액센트 강조
function FilterChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        ...CUT_SM,
        ...(active && color
          ? { borderColor: `${color}99`, background: `${color}1f`, color }
          : {}),
      }}
      className={`border px-3 py-1.5 font-mono text-[13px] font-black uppercase tracking-wide transition ${
        active
          ? color
            ? ""
            : "border-ef-accent/60 bg-ef-accent/15 text-ef-accent"
          : "border-ef-line bg-ef-card text-ef-muted hover:border-ef-accent/40 hover:text-ef-accent-soft"
      }`}
    >
      {children}
    </button>
  );
}

function RosterCard({
  operator,
  order,
  locked,
  onToggle,
  onInspect,
}: {
  operator: Operator;
  order: number;
  locked: boolean;
  onToggle: () => void;
  onInspect: () => void;
}) {
  const selected = order > 0;
  const element = elementMeta[operator.element];
  const mechTag = MECH_TAG[operator.passiveMechanic];
  const talents = OPERATOR_TALENTS[operator.id] ?? [];
  const toggleLocked = locked && !selected; // 편성 꽉 참 + 미선택이면 추가 불가(상세 보기는 항상 가능)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onInspect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onInspect(); }
      }}
      style={CUT}
      className={`group relative flex cursor-pointer flex-col overflow-hidden border p-3 text-left transition duration-200 ${
        selected
          ? "border-ef-accent bg-ef-accent/[0.06]"
          : "border-ef-line bg-ef-card2 hover:-translate-y-1 hover:border-ef-accent/45"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${element.color}, transparent 70%)` }} />

      {/* 편성 토글(코너) — 카드 클릭은 상세, 이 버튼은 추가/해제 */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); if (!toggleLocked) onToggle(); }}
        disabled={toggleLocked}
        title={selected ? "편성 해제" : toggleLocked ? "편성이 가득 찼습니다" : "편성 추가"}
        style={CUT_SM}
        className={`absolute right-2.5 top-2.5 z-20 flex h-9 w-9 items-center justify-center border font-mono text-sm font-black tabular-nums transition ${
          selected
            ? "border-ef-accent bg-ef-accent text-black"
            : toggleLocked
              ? "cursor-not-allowed border-ef-line bg-ef-bg/85 text-ef-muted/40"
              : "border-ef-accent/55 bg-ef-bg/85 text-ef-accent hover:bg-ef-accent hover:text-black"
        }`}
      >
        {selected ? order : <Plus className="h-4 w-4" />}
      </button>

      <div className="relative mt-2 h-52 overflow-hidden border border-ef-line bg-black" style={CUT_SM}>
        <Image
          src={operator.image}
          alt={operator.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 33vw, 50vw"
          className={`object-contain object-bottom transition duration-300 ${
            selected ? "scale-105" : "group-hover:scale-105"
          }`}
        />
        {mechTag && (
          <span
            className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1 border border-ef-accent/40 bg-ef-bg/85 px-1.5 py-0.5 font-mono text-[11px] font-black tracking-wide text-ef-accent-soft backdrop-blur-sm"
            style={CUT_SM}
          >
            <Sparkles className="h-2.5 w-2.5" />
            {mechTag}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ef-muted">OPERATOR</p>
          <span
            className="border px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-wide"
            style={{ ...CUT_SM, borderColor: `${element.color}66`, background: `${element.color}1a`, color: element.color }}
          >
            {element.label}
          </span>
        </div>
        <h3 className="mt-1 truncate text-xl font-black text-white">{operator.name}</h3>
        <p className="truncate text-[13px] font-bold text-ef-muted">
          {operator.className} · {operator.role}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <StatChip label="ATK" value={operator.attack} />
          <StatChip label="CRIT" value={`${Math.round(operator.critRate * 100)}%`} />
          <StatChip label="HP" value={operator.maxHp} />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 border-t border-ef-line pt-2">
          <p className="truncate font-mono text-[11px] text-ef-muted">
            <span className="font-bold text-ef-accent-soft">재능 {talents.length || 1}</span> · {talents.map((t) => t.name).join(", ") || operator.passiveName}
          </p>
          <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wide text-ef-muted/60 transition group-hover:text-ef-accent-soft">상세 ›</span>
        </div>
      </div>
    </div>
  );
}

// ===== 오퍼레이터 상세 모달: 프로필 + 재능 + 스킬 카드 =====
const SKILL_VIEWS: { kind: SkillKind | "util"; label: string }[] = [
  { kind: "attack", label: "기본 공격" },
  { kind: "battle-skill", label: "배틀 스킬" },
  { kind: "link-skill", label: "연계 스킬" },
  { kind: "ultimate", label: "궁극기" },
  { kind: "util", label: "직군 유틸" },
];

function SkillCardView({ card, label }: { card: Card; label: string }) {
  const col = elementMeta[card.element]?.color ?? "#c7cdd6";
  const targetLabel = card.target === "all-enemies" ? "광역" : card.target === "party" ? "파티" : "단일";
  return (
    <div className="flex flex-col border border-ef-line bg-ef-card p-3" style={CUT_SM}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center border font-mono text-sm font-black tabular-nums text-black" style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}>{card.cost}</span>
          <span className="font-mono text-[11px] font-black uppercase tracking-wide" style={{ color: col }}>{label}</span>
        </span>
        <span className="border px-2 py-0.5 font-mono text-[10px] font-black uppercase" style={{ ...CUT_SM, borderColor: `${col}66`, color: col }}>{elementMeta[card.element]?.label}</span>
      </div>
      <h4 className="truncate text-base font-black text-white">{card.name}</h4>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {card.effect == null && <span className="border border-ef-line px-1.5 py-0.5 font-mono text-[10px] font-bold text-ef-ink" style={CUT_SM}>위력 {card.power}</span>}
        {card.stagger > 0 && <span className="border px-1.5 py-0.5 font-mono text-[10px] font-bold" style={{ ...CUT_SM, borderColor: `${PRIMARY}55`, color: PRIMARY }}>불균형 ◇{card.stagger}</span>}
        <span className="border border-ef-line px-1.5 py-0.5 font-mono text-[10px] font-bold text-ef-muted" style={CUT_SM}>{targetLabel}</span>
      </div>
      <p className="mt-1.5 font-mono text-[11px] font-bold leading-snug" style={{ color: card.effect ? "#7fd4a3" : ACCENT }}>{card.effectLine}</p>
      {card.description && card.description !== "직군 유틸 카드" && (
        <p className="mt-1.5 line-clamp-4 text-[12px] leading-relaxed text-ef-muted">{card.description}</p>
      )}
    </div>
  );
}

function OperatorDetailModal({
  operator,
  order,
  toggleLocked,
  onToggle,
  onClose,
}: {
  operator: Operator;
  order: number;
  toggleLocked: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const selected = order > 0;
  const element = elementMeta[operator.element];
  const cards = SKILL_VIEWS.map((v) => ({
    label: v.label,
    card: v.kind === "util"
      ? makeOperatorUtilCard(operator as never, `d-${operator.id}-util`)
      : makeCard(operator as never, v.kind, `d-${operator.id}-${v.kind}`),
  }));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        className="relative flex max-h-[92vh] w-full max-w-[980px] flex-col overflow-hidden border border-ef-line bg-ef-bg"
        style={CUT}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="block h-0.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${element.color}, transparent 60%)` }} />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center border border-ef-line bg-ef-bg/80 text-ef-muted transition hover:border-ef-accent/50 hover:text-ef-accent"
          style={CUT_SM}
          title="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* 프로필 헤더 */}
          <div className="grid gap-4 border-b border-ef-line p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-5">
            <div className="relative h-56 overflow-hidden border border-ef-line bg-black sm:h-60" style={CUT_SM}>
              <Image src={operator.image} alt={operator.name} fill sizes="200px" className="object-contain object-bottom" />
              <span className="absolute left-1.5 top-1.5 border px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-wide" style={{ ...CUT_SM, borderColor: `${element.color}66`, background: `${element.color}1a`, color: element.color }}>{element.label}</span>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ef-muted">Operator File</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-white">{operator.name}</h2>
              <p className="mt-1 text-[13px] font-bold text-ef-muted">{operator.className} · {operator.role}</p>

              <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
                <StatChip label="HP" value={operator.maxHp} />
                <StatChip label="ATK" value={operator.attack} />
                <StatChip label="DEF" value={operator.defense} />
                <StatChip label="CRIT" value={`${Math.round(operator.critRate * 100)}%`} />
                <StatChip label="SPD" value={operator.speed} />
              </div>

              {/* 재능(才能) — 오퍼별 전체 등록 */}
              <div className="mt-3 space-y-2">
                {(OPERATOR_TALENTS[operator.id] ?? [{ name: operator.passiveName, description: operator.passiveDescription }]).map((t, i) => (
                  <div key={`${t.name}-${i}`} className="border border-ef-line bg-ef-card2 p-3" style={CUT_SM}>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-ef-accent" />
                      <span className="font-mono text-[11px] font-black uppercase tracking-wide text-ef-accent-soft">재능 {i + 1}</span>
                      <span className="text-sm font-black text-white">{t.name}</span>
                    </div>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-ef-muted">{t.description}</p>
                  </div>
                ))}
                <p className="font-mono text-[10px] leading-relaxed text-ef-muted/70">※ 재능의 회복·보호막은 장착 장비 등급에 비례하여 증가합니다.</p>
              </div>
            </div>
          </div>

          {/* 스킬 카드 */}
          <div className="p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <h3 className="text-lg font-black tracking-tight text-white">스킬 카드</h3>
              <span className="font-mono text-[11px] text-ef-muted">// 전투 덱에 들어가는 카드</span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ label, card }) => (
                <SkillCardView key={label} card={card} label={label} />
              ))}
            </div>
          </div>
        </div>

        {/* 하단: 편성 토글 */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-ef-line bg-ef-card/60 px-4 py-3 sm:px-5">
          <p className="hidden font-mono text-[11px] text-ef-muted sm:block">
            {selected ? "현재 편성에 포함됨" : toggleLocked ? "편성이 가득 찼습니다" : "이 오퍼레이터를 편성에 추가할 수 있습니다"}
          </p>
          <button
            type="button"
            onClick={() => { if (selected || !toggleLocked) onToggle(); }}
            disabled={!selected && toggleLocked}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${
              selected ? "border border-ef-line bg-ef-card text-ef-muted hover:border-ef-accent/40 hover:text-ef-accent-soft" : "text-black hover:brightness-110"
            }`}
            style={selected ? CUT_SM : { ...CUT_SM, background: ACCENT }}
          >
            {selected ? <><X className="h-4 w-4" /> 편성 해제</> : <><Plus className="h-4 w-4" /> 편성 추가</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// 하단 도크 시너지 칩
function SynergyChip({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn";
}) {
  const toneCls =
    tone === "good"
      ? "border-ef-accent/40 text-ef-accent"
      : tone === "warn"
        ? "border-amber-400/40 text-amber-300"
        : "border-ef-line text-ef-muted";
  return (
    <span
      className={`flex items-center gap-1.5 border bg-ef-card px-2.5 py-1.5 ${toneCls}`}
      style={CUT_SM}
    >
      {icon}
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">{label}</span>
      <span className="font-mono text-xs font-black tabular-nums">{value}</span>
    </span>
  );
}

export default function DeploymentScreen({
  onConfirm,
  initialSelected = [],
  onOpenChallenge,
}: {
  onConfirm: (ids: string[]) => void;
  initialSelected?: string[];
  onOpenChallenge?: () => void;
}) {
  const hasSavedDeck = typeof window !== "undefined" && Boolean(localStorage.getItem("endfield-challenge-deck"));
  const [selected, setSelected] = useState<string[]>(() =>
    initialSelected.filter((id) => allOperators.some((operator) => operator.id === id)).slice(0, TEAM_SIZE),
  );
  const [elementFilter, setElementFilter] = useState<Element | "all">("all");
  const [classFilter, setClassFilter] = useState<OperatorClass | "all">("all");
  const [sort, setSort] = useState<SortKey>("default");
  const [detailId, setDetailId] = useState<string | null>(null);

  const ready = selected.length === TEAM_SIZE;
  const atCapacity = selected.length >= TEAM_SIZE;

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= TEAM_SIZE) return prev;
      return [...prev, id];
    });
  }

  const visible = useMemo(() => {
    const list = allOperators.filter(
      (op) =>
        (elementFilter === "all" || op.element === elementFilter) &&
        (classFilter === "all" || op.className === classFilter),
    );
    if (sort === "atk") return [...list].sort((a, b) => b.attack - a.attack);
    if (sort === "hp") return [...list].sort((a, b) => b.maxHp - a.maxHp);
    return list;
  }, [elementFilter, classFilter, sort]);

  const slots = Array.from({ length: TEAM_SIZE }, (_, index) => {
    const id = selected[index];
    return id ? allOperators.find((operator) => operator.id === id) : undefined;
  });

  // ===== 편성 분석(실시간 시너지) =====
  const team = useMemo(
    () => selected.map((id) => allOperators.find((o) => o.id === id)).filter(Boolean) as Operator[],
    [selected],
  );
  const elementSet = useMemo(() => {
    const set = new Map<Element, number>();
    team.forEach((o) => set.set(o.element, (set.get(o.element) ?? 0) + 1));
    return set;
  }, [team]);
  const teamAmpCount = team.filter((o) => o.passiveMechanic === "team-amp").length;
  const ampPct = teamAmpCount * TEAM_AMP_PER_HOLDER;
  const sustainCount = team.filter((o) => CLASS_ROLE[o.className] !== "공격").length;
  const dealerCount = team.filter((o) => CLASS_ROLE[o.className] === "공격").length;

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-ef-bg px-4 pb-36 pt-6 text-ef-ink sm:px-7">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative mx-auto max-w-[1500px]">
        <header className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.42em] text-ef-muted">
                Field Operation
              </p>
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              오퍼레이터 편성
            </h1>
            <p className="mt-2 text-sm font-bold text-ef-muted">
              로스터에서 오퍼레이터 {TEAM_SIZE}명을 선택해 작전 팀을 구성하세요.
            </p>
          </div>
          <div
            className={`flex items-center gap-2 border px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.18em] tabular-nums transition ${
              ready
                ? "border-ef-accent/40 bg-ef-accent/10 text-ef-accent"
                : "border-ef-line bg-ef-card text-ef-muted"
            }`}
            style={CUT_SM}
          >
            <Users className="h-4 w-4" />
            TEAM {selected.length} / {TEAM_SIZE}
          </div>
        </header>

        {/* ===== 필터 / 정렬 툴바 ===== */}
        <div className="mb-5 border border-ef-line bg-ef-card2/60 p-3 sm:p-4" style={CUT}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2.5">
              {/* 속성 */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 w-8 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">속성</span>
                <FilterChip active={elementFilter === "all"} onClick={() => setElementFilter("all")}>
                  전체
                </FilterChip>
                {ELEMENT_ORDER.map((el) => (
                  <FilterChip
                    key={el}
                    active={elementFilter === el}
                    color={elementMeta[el].color}
                    onClick={() => setElementFilter((cur) => (cur === el ? "all" : el))}
                  >
                    {elementMeta[el].label}
                  </FilterChip>
                ))}
              </div>
              {/* 직군 */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 w-8 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">직군</span>
                <FilterChip active={classFilter === "all"} onClick={() => setClassFilter("all")}>
                  전체
                </FilterChip>
                {CLASS_ORDER.map((cl) => (
                  <FilterChip
                    key={cl}
                    active={classFilter === cl}
                    onClick={() => setClassFilter((cur) => (cur === cl ? "all" : cl))}
                  >
                    {cl}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* 정렬 */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">정렬</span>
              {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
                <FilterChip key={key} active={sort === key} onClick={() => setSort(key)}>
                  {SORT_LABEL[key]}
                </FilterChip>
              ))}
              <span className="ml-1 font-mono text-[12px] font-bold tabular-nums text-ef-muted">
                {visible.length}명
              </span>
            </div>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="border border-dashed border-ef-line bg-ef-card2/40 py-20 text-center font-mono text-sm font-bold text-ef-muted" style={CUT}>
            조건에 맞는 오퍼레이터가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {visible.map((operator) => {
              const order = selected.indexOf(operator.id) + 1;
              const locked = atCapacity && order === 0;
              return (
                <RosterCard
                  key={operator.id}
                  operator={operator}
                  order={order}
                  locked={locked}
                  onToggle={() => toggle(operator.id)}
                  onInspect={() => setDetailId(operator.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ===== 하단 편성 도크: 슬롯 + 실시간 시너지 + 액션 ===== */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ef-line bg-ef-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          {/* 슬롯 */}
          <div className="flex items-center gap-2">
            {slots.map((operator, index) => (
              <button
                key={operator?.id ?? `slot-${index}`}
                type="button"
                onClick={() => operator && toggle(operator.id)}
                style={CUT_SM}
                disabled={!operator}
                title={operator ? `${operator.name} 해제` : "빈 슬롯"}
                className={`group relative h-12 w-12 overflow-hidden border transition ${
                  operator
                    ? "border-ef-accent/60 bg-ef-card hover:border-ef-accent"
                    : "cursor-default border-dashed border-ef-line bg-ef-card"
                }`}
              >
                {operator ? (
                  <>
                    <Image src={operator.image} alt={operator.name} fill sizes="48px" className="object-cover object-top" />
                    <span
                      className="absolute bottom-0 left-0 h-1 w-full"
                      style={{ background: elementMeta[operator.element].color }}
                    />
                    <span className="absolute inset-0 hidden items-center justify-center bg-ef-bg/70 group-hover:flex">
                      <X className="h-4 w-4 text-ef-accent" />
                    </span>
                  </>
                ) : (
                  <span className="flex h-full items-center justify-center font-mono text-sm font-black tabular-nums text-ef-muted/40">
                    {index + 1}
                  </span>
                )}
              </button>
            ))}

            {/* 실시간 편성 분석 */}
            {team.length > 0 ? (
              <div className="ml-2 hidden flex-wrap items-center gap-1.5 md:flex">
                <SynergyChip
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label="원소"
                  value={`${elementSet.size}종`}
                />
                <SynergyChip
                  icon={<Zap className="h-3.5 w-3.5" />}
                  label="팀증폭"
                  value={ampPct > 0 ? `+${ampPct}%` : "—"}
                  tone={ampPct > 0 ? "good" : "neutral"}
                />
                {/* 생존 역할은 선택 사항 — 딜 특화 편성도 클리어 가능하므로 부재 시 경고가 아닌 중립 표기 */}
                <SynergyChip
                  icon={sustainCount > 0 ? <Heart className="h-3.5 w-3.5" /> : <Swords className="h-3.5 w-3.5" />}
                  label="생존"
                  value={sustainCount > 0 ? `${sustainCount}` : "딜 특화"}
                  tone={sustainCount > 0 ? "good" : "neutral"}
                />
                <SynergyChip
                  icon={<Swords className="h-3.5 w-3.5" />}
                  label="딜러"
                  value={`${dealerCount}`}
                />
              </div>
            ) : (
              <p className="ml-2 hidden text-xs font-bold text-ef-muted sm:block">
                {`${TEAM_SIZE}명을 선택해 작전 팀을 구성하세요.`}
              </p>
            )}
          </div>

          {/* 액션 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelected([])}
              disabled={selected.length === 0}
              className="flex items-center gap-2 border border-ef-line bg-ef-card px-5 py-3 text-sm font-black text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft disabled:opacity-30"
              style={CUT_SM}
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </button>
            {onOpenChallenge && hasSavedDeck && (
              <button
                type="button"
                onClick={onOpenChallenge}
                className="flex items-center gap-2 border px-5 py-3 text-sm font-black transition hover:brightness-110"
                style={{ ...CUT_SM, borderColor: `${ACCENT}66`, color: ACCENT, background: `${ACCENT}0d` }}
              >
                보스 도전
              </button>
            )}
            <button
              type="button"
              onClick={() => ready && onConfirm(selected)}
              disabled={!ready}
              className="flex items-center gap-2 px-7 py-3 text-sm font-black text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:border disabled:border-ef-line disabled:bg-ef-card disabled:text-ef-muted/50"
              style={ready ? { ...CUT_SM, background: ACCENT } : CUT_SM}
            >
              {ready ? (
                <>
                  작전 시작 <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" /> {selected.length}/{TEAM_SIZE} 선택됨
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 오퍼레이터 상세 모달 */}
      {detailId && (() => {
        const op = allOperators.find((o) => o.id === detailId);
        if (!op) return null;
        const order = selected.indexOf(op.id) + 1;
        return (
          <OperatorDetailModal
            operator={op}
            order={order}
            toggleLocked={atCapacity && order === 0}
            onToggle={() => toggle(op.id)}
            onClose={() => setDetailId(null)}
          />
        );
      })()}
    </section>
  );
}
