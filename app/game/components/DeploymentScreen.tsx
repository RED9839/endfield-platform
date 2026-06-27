"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, RotateCcw, Shield, Users } from "lucide-react";

import { allOperators } from "../data/operators";
import type { Element, Operator, OperatorClass } from "../types/game";

const TEAM_SIZE = 4;

// 직군 패시브(직군 공통 베이스라인) 라벨 — useRunState의 CLASS_PASSIVE와 동일 개념.
const CLASS_PASSIVE_LABEL: Record<OperatorClass, string> = {
  "가드": "불균형 적 피해+",
  "디펜더": "파티 보호막",
  "캐스터": "이상 적 피해+",
  "스트라이커": "치명타 확률+",
  "서포터": "파티 회복",
  "뱅가드": "불균형 시 에너지+",
};

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
  electric: { label: "전기", color: "#a78bfa" },
  cryo: { label: "냉기", color: "#67e8f9" },
  nature: { label: "자연", color: "#86efac" },
};

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="block border border-ef-line bg-ef-card px-2 py-1.5 text-center" style={CUT_SM}>
      <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-ef-muted">{label}</span>
      <span className="mt-0.5 block font-mono text-xs font-black tabular-nums text-ef-ink">{value}</span>
    </span>
  );
}

function RosterCard({
  operator,
  order,
  locked,
  onToggle,
}: {
  operator: Operator;
  order: number;
  locked: boolean;
  onToggle: () => void;
}) {
  const selected = order > 0;
  const element = elementMeta[operator.element];

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={locked}
      aria-pressed={selected}
      style={CUT}
      className={`group relative flex flex-col overflow-hidden border p-3 text-left transition duration-200 ${
        selected
          ? "border-ef-accent bg-ef-accent/[0.06]"
          : locked
            ? "cursor-not-allowed border-ef-line bg-ef-card opacity-40"
            : "border-ef-line bg-ef-card2 hover:-translate-y-1 hover:border-ef-accent/45"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${element.color}, transparent 70%)` }} />

      {selected && (
        <span className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center border border-ef-accent/70 bg-ef-bg/85 font-mono text-sm font-black tabular-nums text-ef-accent" style={CUT_SM}>
          {order}
        </span>
      )}

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
      </div>

      <div className="relative z-10 mt-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-ef-muted">OPERATOR</p>
          <span
            className="border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wide"
            style={{ ...CUT_SM, borderColor: `${element.color}66`, background: `${element.color}1a`, color: element.color }}
          >
            {element.label}
          </span>
        </div>
        <h3 className="mt-1 truncate text-xl font-black text-white">{operator.name}</h3>
        <p className="truncate text-[11px] font-bold text-ef-muted">
          {operator.className} · {operator.role}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <StatChip label="ATK" value={operator.attack} />
          <StatChip label="CRIT" value={`${Math.round(operator.critRate * 100)}%`} />
          <StatChip label="HP" value={operator.maxHp} />
        </div>

        <div className="mt-2 space-y-0.5 border-t border-ef-line pt-2">
          <p className="truncate font-mono text-[9px] text-ef-muted">
            <span className="font-bold text-ef-accent-soft">직군 패시브</span> · {CLASS_PASSIVE_LABEL[operator.className] ?? "-"}
          </p>
          <p className="truncate font-mono text-[9px] text-ef-muted">
            <span className="font-bold text-ef-accent-soft">재능</span> · {operator.passiveName}
          </p>
        </div>
      </div>
    </button>
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

  const ready = selected.length === TEAM_SIZE;
  const atCapacity = selected.length >= TEAM_SIZE;

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= TEAM_SIZE) return prev;
      return [...prev, id];
    });
  }

  const slots = Array.from({ length: TEAM_SIZE }, (_, index) => {
    const id = selected[index];
    return id ? allOperators.find((operator) => operator.id === id) : undefined;
  });

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-ef-bg px-4 pb-32 pt-6 text-ef-ink sm:px-7">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative mx-auto max-w-[1500px]">
        <header className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.42em] text-ef-muted">
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {allOperators.map((operator) => {
            const order = selected.indexOf(operator.id) + 1;
            const locked = atCapacity && order === 0;
            return (
              <RosterCard
                key={operator.id}
                operator={operator}
                order={order}
                locked={locked}
                onToggle={() => toggle(operator.id)}
              />
            );
          })}
        </div>
      </div>

      {/* 하단 편성 컨트롤 바 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ef-line bg-ef-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {slots.map((operator, index) => (
              <div
                key={operator?.id ?? `slot-${index}`}
                style={CUT_SM}
                className={`relative h-12 w-12 overflow-hidden border ${
                  operator ? "border-ef-accent/60 bg-ef-card" : "border-dashed border-ef-line bg-ef-card"
                }`}
                title={operator?.name ?? "빈 슬롯"}
              >
                {operator ? (
                  <Image src={operator.image} alt={operator.name} fill sizes="48px" className="object-cover object-top" />
                ) : (
                  <span className="flex h-full items-center justify-center font-mono text-sm font-black tabular-nums text-ef-muted/40">
                    {index + 1}
                  </span>
                )}
              </div>
            ))}
            <p className="ml-2 hidden text-xs font-bold text-ef-muted sm:block">
              {ready ? "편성 완료. 작전을 시작할 수 있습니다." : `${TEAM_SIZE - selected.length}명 더 선택하세요.`}
            </p>
          </div>

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
    </section>
  );
}
