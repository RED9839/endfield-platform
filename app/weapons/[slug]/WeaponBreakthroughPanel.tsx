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

const YELLOW_TEXT = "#ffdc70";

function makeMaterialIconPath(name: string) {
  return `/materials/${encodeURIComponent(name)}.webp`;
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
    <section className="overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_14px_38px_rgba(0,0,0,0.28)]">
      <div className="relative overflow-hidden border-b border-yellow-500/10 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,210,74,0.12),transparent_34%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(480px,1.15fr)] lg:items-center">
          <div>
            <p className="text-[10px] font-black tracking-[0.28em]" style={{ color: YELLOW_TEXT }}>
              WEAPON TUNING
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">무기 돌파</h2>
            <p className="mt-1.5 text-xs font-bold text-zinc-500">단계별 요구 레벨, 보너스, 돌파 재료를 확인합니다.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {stages.map((stage, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={stage.stage}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={[
                    "h-10 rounded-xl border px-2 text-xs font-black transition",
                    active
                      ? "border-yellow-300/75 bg-yellow-400/20 text-yellow-100"
                      : "border-white/10 bg-black/45 text-zinc-300 hover:border-yellow-400/35 hover:bg-yellow-400/10",
                  ].join(" ")}
                >
                  {stage.stage}단계
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(340px,1fr)]">
        <div className="rounded-[20px] border border-yellow-500/20 bg-black/35 p-4">
          <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">CURRENT TUNING</p>
          <h3 className="mt-2 text-3xl font-black leading-none text-white">{current.stage}단계</h3>

          <div className="mt-4 rounded-[16px] border border-white/10 bg-[#080b11]/85 p-3.5">
            <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">요구 레벨</p>
            <p className="mt-1.5 text-2xl font-black" style={{ color: YELLOW_TEXT }}>
              Lv. {current.requiredLevel}
            </p>
          </div>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-[#080b11]/85 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
              돌파 보너스
            </p>
            <p className="text-[11px] font-bold text-yellow-200/70">{current.stage}단계 기준</p>
          </div>

          {current.bonuses.length ? (
            <div className="grid gap-2">
              {current.bonuses.map((bonus, index) => (
                <div key={`${current.stage}-bonus-${index}`} className="rounded-2xl border border-white/10 bg-black/35 px-3.5 py-2.5 text-xs font-bold leading-6 text-zinc-200">
                  {bonus}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-yellow-500/10 p-4">
        <button
          type="button"
          onClick={() => setShowMaterials((prev) => !prev)}
          className="mb-3 flex w-full items-center justify-between rounded-[16px] border border-yellow-500/10 bg-black/30 px-4 py-3 text-left text-xs font-black text-zinc-200 transition hover:border-yellow-400/30 hover:bg-yellow-400/10"
        >
          <span>돌파 재료</span>
          <span style={{ color: YELLOW_TEXT }}>{showMaterials ? "−" : "+"}</span>
        </button>

        {showMaterials ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stages
              .filter((stage) => stage.stage > 0 && stage.materials.length > 0)
              .map((stage) => (
                <div key={stage.stage} className="rounded-[18px] border border-white/10 bg-[#080b11]/85 p-3.5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-black" style={{ color: YELLOW_TEXT }}>
                      {stage.stage}단계
                    </p>
                    <p className="text-[11px] font-bold text-zinc-500">Lv. {stage.requiredLevel}</p>
                  </div>

                  <div className="grid gap-2">
                    {stage.materials.map((material, index) => (
                      <div key={`${stage.stage}-${index}`} className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                        <MaterialIcon src={material.icon} alt={material.name} />
                        <p className="min-w-0 break-keep text-[11px] font-bold leading-5 text-zinc-200">{material.name}</p>
                        <p className="text-xs font-black" style={{ color: YELLOW_TEXT }}>
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
