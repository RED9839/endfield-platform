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
    <div className="relative h-9 w-9 shrink-0">
      <Image src={resolvedSrc} alt={alt} fill sizes="36px" className="object-contain" />
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
  const [showMaterials, setShowMaterials] = useState(true);

  const current = stages[selectedIndex] ?? stages[0];

  if (!current) return null;

  return (
    <section className="overflow-hidden rounded-[28px] border border-yellow-500/15 bg-[#05070b]/95 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
      <div className="relative overflow-hidden border-b border-yellow-500/10 p-4 lg:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,210,74,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] lg:items-center">
          <div>
            <p className="text-[10px] font-black tracking-[0.32em]" style={{ color: YELLOW_TEXT }}>
              WEAPON TUNING
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">무기 돌파</h2>
            <p className="mt-2 text-sm font-bold text-zinc-500">단계별 요구 레벨, 보너스, 돌파 재료를 확인합니다.</p>
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
                    "h-11 rounded-xl border px-3 text-sm font-black transition",
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

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(360px,1fr)] lg:p-5">
        <div className="rounded-[22px] border border-yellow-500/20 bg-black/35 p-5">
          <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">CURRENT TUNING</p>
          <h3 className="mt-3 text-5xl font-black leading-none text-white">{current.stage}단계</h3>

          <div className="mt-5 rounded-[18px] border border-white/10 bg-[#080b11]/85 p-4">
            <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">요구 레벨</p>
            <p className="mt-2 text-3xl font-black" style={{ color: YELLOW_TEXT }}>
              Lv. {current.requiredLevel}
            </p>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#080b11]/85 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-base font-black" style={{ color: YELLOW_TEXT }}>
              돌파 보너스
            </p>
            <p className="text-xs font-bold text-yellow-200/70">{current.stage}단계 기준</p>
          </div>

          {current.bonuses.length ? (
            <div className="grid gap-2">
              {current.bonuses.map((bonus, index) => (
                <div key={`${current.stage}-bonus-${index}`} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold leading-7 text-zinc-200">
                  {bonus}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold text-zinc-500">등록된 보너스가 없습니다.</p>
          )}
        </div>
      </div>

      <div className="border-t border-yellow-500/10 p-4 lg:p-5">
        <button
          type="button"
          onClick={() => setShowMaterials((prev) => !prev)}
          className="mb-4 flex w-full items-center justify-between rounded-[18px] border border-yellow-500/10 bg-black/30 px-4 py-3 text-left text-sm font-black text-zinc-200 transition hover:border-yellow-400/30 hover:bg-yellow-400/10"
        >
          <span>돌파 재료</span>
          <span style={{ color: YELLOW_TEXT }}>{showMaterials ? "−" : "+"}</span>
        </button>

        {showMaterials ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage) => (
              <div key={stage.stage} className="rounded-[20px] border border-white/10 bg-[#080b11]/85 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
                    {stage.stage}단계
                  </p>
                  <p className="text-xs font-bold text-zinc-500">Lv. {stage.requiredLevel}</p>
                </div>

                {stage.materials.length ? (
                  <div className="grid gap-2">
                    {stage.materials.map((material, index) => (
                      <div key={`${stage.stage}-${index}`} className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-3 py-2">
                        <MaterialIcon src={material.icon} alt={material.name} />
                        <p className="min-w-0 break-keep text-xs font-bold leading-5 text-zinc-200">{material.name}</p>
                        <p className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
                          {material.count}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-zinc-500">재료 데이터 없음</p>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
