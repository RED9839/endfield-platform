import { useState } from "react";
import Image from "next/image";
import { PackageOpen, Search } from "lucide-react";

import { getGameGear, getGameSetEffectDescription } from "../data/game-gears";
import type { PartyMember, RunGear } from "../types/game";

function categoryLabel(category: string) {
  if (category === "armor") return "방어구";
  if (category === "gloves") return "장갑";
  return "부품";
}

function primaryStat(gear: RunGear) {
  const bonus = Math.round(gear.level * 0.45 + gear.quality * 5 + (gear.category === "armor" ? 2 : 0));
  if (gear.category === "armor") return `방어력 +${bonus}`;
  if (gear.category === "gloves") return `공격력 +${bonus}`;
  return `전술 출력 +${bonus}`;
}

function effectLine(gear: RunGear) {
  const setEffect = getGameSetEffectDescription(gear.setName);
  if (setEffect !== "세트 효과 없음") return setEffect.replace("3세트:", "3세트 효과 ·");
  return `개별 보정 · ${gear.attributeLabel}`;
}

function qualityStars(quality: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={index < quality ? "text-amber-200" : "text-zinc-500/70"}
    >
      ★
    </span>
  ));
}

export default function RewardScreen({
  gearSlugs,
  party,
  credits,
  onEquip,
}: {
  gearSlugs: string[];
  party: PartyMember[];
  credits: number;
  onEquip: (gearSlug: string, operatorId: string) => void;
}) {
  const [selectedGearSlug, setSelectedGearSlug] = useState<string | null>(null);
  const selectedGear = selectedGearSlug ? getGameGear(selectedGearSlug) : null;

  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-[28px] border border-white/10 bg-[#05080b]/90 p-5 shadow-2xl shadow-cyan-950/20 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-300/30 bg-amber-300/[0.08]">
                <PackageOpen className="h-5 w-5 text-amber-200" />
              </span>
              <div>
                <p className="text-[10px] font-black tracking-[0.35em] text-cyan-200/60">
                  OPERATION COMPLETE
                </p>
                <h1 className="mt-1 text-3xl font-black text-white">전술 장비 회수</h1>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              {credits} 크레딧 확보. 회수한 장비 하나를 선택해 오퍼레이터에게 장착하세요.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] px-4 py-3 text-right">
            <p className="text-[10px] font-black tracking-[0.25em] text-cyan-100/50">RECOVERED</p>
            <p className="mt-1 text-2xl font-black text-cyan-100">{gearSlugs.length}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {gearSlugs.map((slug) => {
            const gear = getGameGear(slug);
            const selected = selectedGearSlug === gear.slug;
            return (
              <button
                key={gear.slug}
                type="button"
                onClick={() => setSelectedGearSlug(gear.slug)}
                className={`group relative flex w-full overflow-hidden rounded-[18px] border text-left transition hover:-translate-y-0.5 ${
                  selected
                    ? "border-cyan-200/70 bg-cyan-200/[0.08] shadow-lg shadow-cyan-950/30"
                    : "border-white/10 bg-white/[0.035] hover:border-amber-200/50 hover:bg-amber-200/[0.045]"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-1 ${
                    selected ? "bg-cyan-200" : "bg-amber-300/70"
                  }`}
                />
                <span className="relative h-32 w-32 shrink-0 overflow-hidden bg-[linear-gradient(135deg,#5d382e_0%,#a36b45_50%,#d1a767_100%)] sm:h-36 sm:w-36">
                  <span className="absolute inset-5 rotate-45 border border-white/20" />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.24),transparent_34%),linear-gradient(135deg,transparent_52%,rgba(0,0,0,0.24)_53%)]" />
                  <Image
                    src={gear.image}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-contain p-5 drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
                  />
                  <span className="absolute bottom-0 left-0 right-0 flex h-7 items-center gap-0.5 bg-black/35 px-2 text-sm">
                    {qualityStars(gear.quality)}
                  </span>
                </span>

                <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 sm:px-6">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-md border border-amber-200/30 bg-amber-200/[0.08] px-2 py-1 text-[10px] font-black text-amber-100">
                      {categoryLabel(gear.category)}
                    </span>
                    <span className="text-[10px] font-black tracking-[0.18em] text-cyan-100/45">
                      LV.{gear.level} / TIER {gear.quality}
                    </span>
                  </span>
                  <span className="mt-2 line-clamp-1 text-xl font-black text-amber-300">
                    {gear.name}
                  </span>
                  <span className="mt-1 text-xs font-bold text-cyan-100/65">{gear.setName} 세트</span>
                  <span className="mt-4 grid gap-2 text-sm sm:grid-cols-[160px_1fr]">
                    <span className="font-black text-white">{primaryStat(gear)}</span>
                    <span className="leading-6 text-zinc-300">{effectLine(gear)}</span>
                  </span>
                </span>

                <span className="hidden w-14 shrink-0 place-items-start justify-center border-l border-white/10 bg-black/20 pt-4 sm:grid">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition group-hover:border-cyan-200/50 group-hover:text-cyan-100">
                    <Search className="h-4 w-4" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {selectedGear && (
          <div className="mt-6 rounded-[24px] border border-cyan-200/15 bg-[#080d12] p-5">
            <p className="text-[10px] font-black tracking-[0.3em] text-cyan-200/60">
              EQUIP TARGET
            </p>
            <h2 className="mt-2 text-xl font-black text-white">
              {selectedGear.name} 장착 대상 선택
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {party.map((member) => {
                const currentGear =
                  selectedGear.category === "armor"
                    ? member.gear.armor
                    : selectedGear.category === "gloves"
                      ? member.gear.gloves
                      : member.gear.kit1 && member.gear.kit2
                        ? member.gear.kit1
                        : undefined;
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => onEquip(selectedGear.slug, member.id)}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-900">
                        <Image src={member.image} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-white">{member.name}</p>
                        <p className="text-[10px] font-bold text-zinc-500">{member.className} · {member.role}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[10px] leading-4 text-zinc-500">
                      {currentGear ? `${currentGear.name} 교체` : "빈 슬롯에 장착"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
