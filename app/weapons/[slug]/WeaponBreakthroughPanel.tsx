"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type BreakthroughMaterial = {
  name: string;
  icon?: string;
  count: string | number;
};

type BreakthroughStage = {
  stage: number;
  requiredLevel: number;
  materials: BreakthroughMaterial[];
  bonuses: string[];
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

function makeMaterialIconPath(name: string) {
  return `/items/${encodeURIComponent(name)}.webp`;
}

function MaterialIcon({ src, alt }: { src?: string; alt: string }) {
  const resolvedSrc = src || makeMaterialIconPath(alt);

  return (
    <div className="relative h-8 w-8 shrink-0">
      <Image src={resolvedSrc} alt={alt} fill sizes="32px" className="object-contain" />
    </div>
  );
}

export default function WeaponBreakthroughPanel({
  breakthrough,
}: {
  breakthrough: BreakthroughStage[];
  accentColor?: string;
}) {
  const stages = useMemo(() => breakthrough ?? [], [breakthrough]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMaterials, setShowMaterials] = useState(false);

  const current = stages[selectedIndex] ?? stages[0];

  if (!current) return null;

  return (
    <section className="overflow-hidden border border-ef-line bg-ef-card2" style={CUT}>
      <div className="relative overflow-hidden border-b border-ef-line p-4">
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(480px,1.15fr)] lg:items-center">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-ef-muted">
              WEAPON TUNING
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">무기 돌파</h2>
            <p className="mt-1.5 text-xs font-bold text-ef-muted">단계별 요구 레벨, 보너스, 돌파 재료를 확인합니다.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {stages.map((stage, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={stage.stage}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className="h-10 border px-2 font-mono text-xs font-black uppercase tracking-wide transition"
                  style={active
                    ? { ...CUT_SM, borderColor: ACCENT, background: "rgba(255,210,74,0.2)", color: "#ffffff", boxShadow: "inset 0 -2px 0 0 #ff9a2f" }
                    : { ...CUT_SM, borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }}
                >
                  {stage.stage}단계
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(340px,1fr)]">
        <div className="border border-ef-line bg-ef-card p-4" style={CUT}>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ef-muted">CURRENT TUNING</p>
          <h3 className="mt-2 text-3xl font-black leading-none text-white">{current.stage}단계</h3>

          <div className="mt-4 border border-ef-line bg-ef-card2 p-3.5" style={CUT_SM}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ef-muted">요구 레벨</p>
            <p className="mt-1.5 font-mono text-2xl font-black tabular-nums" style={{ color: ACCENT }}>
              Lv. {current.requiredLevel}
            </p>
          </div>
        </div>

        <div className="border border-ef-line bg-ef-card p-4" style={CUT}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black" style={{ color: ACCENT }}>
              돌파 보너스
            </p>
            <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">{current.stage}단계 기준</p>
          </div>

          {current.bonuses.length ? (
            <div className="grid gap-2">
              {current.bonuses.map((bonus, index) => (
                <div key={`${current.stage}-bonus-${index}`} className="border border-ef-line bg-ef-card2 px-3.5 py-2.5 text-xs font-bold leading-6 text-ef-muted" style={CUT_SM}>
                  {bonus}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-ef-line p-4">
        <button
          type="button"
          onClick={() => setShowMaterials((prev) => !prev)}
          className="mb-3 flex w-full items-center justify-between border border-ef-line bg-ef-card px-4 py-3 text-left font-mono text-xs font-black uppercase tracking-wide text-ef-ink transition hover:border-ef-accent/40"
          style={CUT_SM}
        >
          <span>돌파 재료</span>
          <span style={{ color: ACCENT }}>{showMaterials ? "−" : "+"}</span>
        </button>

        {showMaterials ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stages
              .filter((stage) => stage.stage > 0 && stage.materials.length > 0)
              .map((stage) => (
                <div key={stage.stage} className="border border-ef-line bg-ef-card p-3.5" style={CUT}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-black" style={{ color: ACCENT }}>
                      {stage.stage}단계
                    </p>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ef-muted">Lv. {stage.requiredLevel}</p>
                  </div>

                  <div className="grid gap-2">
                    {stage.materials.map((material, index) => (
                      <div key={`${stage.stage}-${index}`} className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 border border-ef-line bg-ef-card2 px-3 py-2" style={CUT_SM}>
                        <MaterialIcon src={material.icon} alt={material.name} />
                        <p className="min-w-0 break-keep text-[11px] font-bold leading-5 text-ef-ink">{material.name}</p>
                        <p className="font-mono text-xs font-black tabular-nums" style={{ color: PRIMARY }}>
                          {material.count}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
