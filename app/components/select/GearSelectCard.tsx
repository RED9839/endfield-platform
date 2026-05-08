"use client";

import Image from "next/image";
import type { GearDetail } from "@/data/gear-types";

const YELLOW_MAIN = "#ffd24a";

const qualityColorMap: Record<number, string> = {
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
  2: "#84cc16",
  1: "#9ca3af",
};

const statIconMap: Record<string, string> = {
  strength: "/icons/stats/strength.webp",
  agility: "/icons/stats/agility.webp",
  intelligence: "/icons/stats/intelligence.webp",
  will: "/icons/stats/will.webp",
};

const statLabelMap: Record<string, string> = {
  strength: "힘",
  agility: "민첩",
  intelligence: "지능",
  will: "의지",
};

const gearAttributeLabelMap: Record<string, string> = {
  attack: "공격력",
  hp: "생명력",
  critRate: "치명타 확률",
  originiumArts: "오리지늄 아츠 강도",
  healEfficiency: "치유 효율 보너스",
  physicalDamage: "물리 피해 보너스",
  ultimateEfficiency: "궁극기 충전 효율",
  normalAttack: "일반 공격 피해 보너스",
  normalAttackDamage: "일반 공격 피해 보너스",
  skillDamage: "배틀 스킬 피해 보너스",
  battleSkillDamage: "배틀 스킬 피해 보너스",
  comboSkillDamage: "연계 스킬 피해 보너스",
  ultimateDamage: "궁극기 피해 보너스",
  unbalancedTargetDamage: "불균형 목표에 주는 피해 보너스",
  mainStat: "주요 능력치",
  artsDamage: "아츠 피해 보너스",
  cryoElectricDamage: "냉기와 전기 피해 보너스",
  damageReduction: "모든 피해 감소",
  subStat: "보조 능력치",
  allSkillDamage: "모든 스킬 피해 보너스",
  heatNatureDamage: "열기와 자연 피해 보너스",
};

function getGearImage(gear: GearDetail) {
  return gear.image || gear.fullImage || `/gear/${gear.slug}.webp`;
}

export default function GearSelectCard({
  gear,
  active,
  onClick,
}: {
  gear: GearDetail;
  active: boolean;
  onClick: () => void;
}) {
  const borderColor = active ? YELLOW_MAIN : "rgba(255,255,255,0.08)";
  const qualityColor = qualityColorMap[gear.quality] ?? "#f0c94a";
  const statKeys = (gear.abilityTypes ?? []).slice(0, 2);

  const attributeKey = gear.attributeTypes?.[0] ?? gear.attribute?.key ?? "";
  const attributeLabel =
    gearAttributeLabelMap[attributeKey] ??
    gear.attribute?.name ??
    gear.attribute?.label ??
    "속성";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block overflow-hidden rounded-[18px] bg-black text-left transition hover:-translate-y-1"
      style={{
        width: "100%",
        minWidth: "170px",
        height: "222px",
        border: `1px solid ${borderColor}`,
        boxShadow: active ? "0 0 20px rgba(255,210,74,0.32)" : "none",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-[138px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_62%)]">
        <Image
          src={getGearImage(gear)}
          alt={gear.name}
          fill
          sizes="170px"
          className="object-contain p-5 transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-3">
        <h3 className="line-clamp-1 text-[16px] font-black leading-[1.1] text-yellow-300">
          {gear.name}
        </h3>

        <p className="mt-[2px] line-clamp-1 text-[11px] tracking-wide text-zinc-300">
          {gear.enName}
        </p>

        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full border px-2 py-[2px] text-[10px] font-black"
              style={{
                borderColor: qualityColor,
                color: qualityColor,
                background: "rgba(0,0,0,0.45)",
                boxShadow: `0 0 10px ${qualityColor}25`,
              }}
            >
              Lv.{gear.level}
            </span>

            <div className="flex items-center gap-1">
              {statKeys.map((key) => {
                const statLabel = statLabelMap[key] ?? "능력치";
                const statIcon = statIconMap[key];

                return (
                  <span
                    key={key}
                    className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-2 py-[4px]"
                    title={statLabel}
                  >
                    {statIcon ? (
                      <span className="relative h-4 w-4 shrink-0">
                        <Image
                          src={statIcon}
                          alt={statLabel}
                          fill
                          sizes="16px"
                          className="object-contain"
                        />
                      </span>
                    ) : null}
                  </span>
                );
              })}
            </div>
          </div>

          <span className="w-fit max-w-full truncate rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-[2px] text-[10px] font-black text-yellow-200">
            {attributeLabel}
          </span>
        </div>
      </div>
    </button>
  );
}
