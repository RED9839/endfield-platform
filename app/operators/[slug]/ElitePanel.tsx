"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type EliteMaterial = {
  name: string;
  icon?: string;
  count: string | number;
};

type EliteStage = {
  stage: string;
  description: string;
  materials: EliteMaterial[];
};

const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

function FoldSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-3.5 border border-ef-line bg-ef-card" style={CUT}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-3.5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-ef-ink"
      >
        <span>{title}</span>
        <span style={{ color: ACCENT }}>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div className="border-t border-ef-line">{children}</div>
      ) : null}
    </div>
  );
}

function getEliteStageIcon(stage: string) {
  if (stage.includes("IV")) return "/icons/elite/4.webp";
  if (stage.includes("III")) return "/icons/elite/3.webp";
  if (stage.includes("II")) return "/icons/elite/2.webp";
  if (stage.includes("I")) return "/icons/elite/1.webp";
  return "/icons/elite/1.webp";
}

function MaterialIcon({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return (
      <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center border border-ef-line bg-black font-black text-ef-muted" style={{ fontSize: "8px" }}>
        I
      </div>
    );
  }

  return (
    <div className="relative h-[26px] w-[26px] shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="26px"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

export default function ElitePanel({ elite }: { elite: EliteStage[] }) {
  const stages = useMemo(() => elite ?? [], [elite]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = stages[selectedIndex] ?? stages[0];

  if (!current) return null;

  return (
    <section className="border border-ef-line bg-ef-card2 p-4" style={CUT}>
      <div className="grid items-start gap-3.5" style={{ gridTemplateColumns: "72px 1fr" }}>
        <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden border border-ef-line bg-ef-card" style={CUT_SM}>
          <div style={{ position: "relative", width: "64px", height: "64px" }}>
            <Image
              src={getEliteStageIcon(current.stage)}
              alt={current.stage}
              fill
              sizes="64px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div>
          <div className="font-mono text-3xl font-black tabular-nums" style={{ color: ACCENT }}>
            {current.stage}
          </div>

          <div className="mt-2.5 break-keep text-sm leading-7 text-ef-muted">
            {current.description}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {stages.map((stage, index) => {
          const active = selectedIndex === index;

          return (
            <button
              key={stage.stage}
              onClick={() => setSelectedIndex(index)}
              className={`border px-3 py-1.5 font-mono text-xs font-black uppercase tracking-wide transition ${
                active ? "border-ef-accent text-white" : "border-ef-line bg-ef-card text-ef-muted"
              }`}
              style={
                active
                  ? { ...CUT_SM, background: "rgba(255,210,74,0.2)", boxShadow: "inset 0 -2px 0 0 #ff9a2f" }
                  : CUT_SM
              }
            >
              {stage.stage}
            </button>
          );
        })}
      </div>

      <FoldSection title="업그레이드 재료" defaultOpen={false}>
        <div
          className="grid items-start gap-2.5 p-2.5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
        >
          {stages.map((stage) => (
            <div
              key={stage.stage}
              className="min-h-full border-l border-ef-line pl-2.5"
            >
              <div className="mb-2 font-mono text-[13px] font-black uppercase tracking-wide" style={{ color: ACCENT }}>
                {stage.stage}
              </div>

              {stage.materials.length ? (
                <div className="flex flex-col gap-1.5">
                  {stage.materials.map((material, index) => (
                    <div
                      key={`${stage.stage}-${index}`}
                      className="grid items-center gap-2 border border-ef-line bg-ef-card2 px-2 py-1.5"
                      style={{ ...CUT_SM, gridTemplateColumns: "26px 1fr auto" }}
                    >
                      <MaterialIcon src={material.icon} alt={material.name} />

                      <div className="break-keep text-[11px] leading-tight text-ef-ink">
                        {material.name}
                      </div>

                      <div className="whitespace-nowrap pl-1.5 font-mono text-[11px] font-black tabular-nums" style={{ color: ACCENT }}>
                        {material.count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-ef-muted">재료 데이터 없음</div>
              )}
            </div>
          ))}
        </div>
      </FoldSection>
    </section>
  );
}
