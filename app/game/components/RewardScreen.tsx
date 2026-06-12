import { useState } from "react";
import Image from "next/image";
import { PackageOpen } from "lucide-react";

import { getGameGear } from "../data/game-gears";
import type { PartyMember } from "../types/game";

function categoryLabel(category: string) {
  if (category === "armor") return "방어구";
  if (category === "gloves") return "장갑";
  return "부품";
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
    <section className="mx-auto flex min-h-[620px] w-full max-w-5xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="text-center">
        <PackageOpen className="mx-auto h-10 w-10 text-yellow-300" />
        <p className="mt-4 text-[10px] font-black tracking-[0.35em] text-yellow-300/60">
          OPERATION COMPLETE
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">전술 장비 선택</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {credits} 크레딧 확보. 장비 하나를 선택해 오퍼레이터에게 장착하세요.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {gearSlugs.map((slug) => {
          const gear = getGameGear(slug);
          const selected = selectedGearSlug === gear.slug;
          return (
            <button
              key={gear.slug}
              type="button"
              onClick={() => setSelectedGearSlug(gear.slug)}
              className={`group rounded-[24px] border p-5 text-left transition hover:-translate-y-1 ${
                selected
                  ? "border-yellow-300/70 bg-yellow-300/[0.09]"
                  : "border-yellow-300/20 bg-yellow-300/[0.035] hover:border-yellow-300/60 hover:bg-yellow-300/[0.08]"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <Image src={gear.image} alt="" fill sizes="64px" className="object-contain p-2" />
                </span>
                <div className="min-w-0">
                  <span className="inline-flex rounded-lg border border-yellow-300/20 bg-black/30 px-2 py-1 text-[10px] font-black text-yellow-200">
                    Lv.{gear.level} · {categoryLabel(gear.category)}
                  </span>
                  <h2 className="mt-3 line-clamp-2 text-lg font-black text-white">{gear.name}</h2>
                  <p className="mt-1 text-xs font-bold text-cyan-100/60">{gear.setName} 세트</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{gear.combatDescription}</p>
              <p className="mt-4 text-xs font-black text-yellow-200">{gear.attributeLabel}</p>
            </button>
          );
        })}
      </div>

      {selectedGear && (
        <div className="mt-8 rounded-[24px] border border-white/10 bg-[#080b0f] p-5">
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
    </section>
  );
}
