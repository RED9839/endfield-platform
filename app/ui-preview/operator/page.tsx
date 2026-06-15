"use client";

import Image from "next/image";
import { useState } from "react";

import {
  EndfieldBadge,
  EndfieldGrid,
  EndfieldPanel,
  EndfieldStatsCard,
  EndfieldTabs,
  EndfieldTag,
  SectionCard,
} from "@/components/ui";
import {
  getOperatorDetailBySlug,
  operatorDetails,
} from "@/data/operators-detail-data";

const elementLabel: Record<string, string> = {
  physical: "물리",
  cryo: "냉기",
  heat: "열기",
  nature: "자연",
  electric: "전기",
};
const elementColor: Record<string, string> = {
  physical: "#cbd5e1",
  cryo: "#4fa3ff",
  heat: "#ff8a1f",
  nature: "#3ecf8e",
  electric: "#c084fc",
};
const classLabel: Record<string, string> = {
  vanguard: "뱅가드",
  guard: "가드",
  defender: "디펜더",
  supporter: "서포터",
  caster: "캐스터",
  striker: "스트라이커",
};
const weaponLabel: Record<string, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};
const elementIcon: Record<string, string> = {
  physical: "/icons/elements/physical.webp",
  cryo: "/icons/elements/cryo.webp",
  heat: "/icons/elements/heat.webp",
  nature: "/icons/elements/nature.webp",
  electric: "/icons/elements/electric.webp",
};

// 디자인 시스템 적용 예시: 오퍼레이터 상세(인게임 정보창 느낌) — 비파괴 프리뷰.
export default function OperatorRedesignPreview() {
  const operator = getOperatorDetailBySlug("laevatain") ?? operatorDetails[0];
  const [tab, setTab] = useState("skills");

  const el = operator.element;
  const accent = elementColor[el] ?? "#ffd24a";
  const hero = operator.fullImage || operator.avatar;

  const skills = [
    { ...operator.skills.normalAttack, kind: "일반 공격" },
    { ...operator.skills.battleSkill, kind: "배틀 스킬" },
    { ...operator.skills.comboSkill, kind: "연계 스킬" },
    { ...operator.skills.ultimate, kind: "궁극기" },
  ];

  return (
    <main className="min-h-screen bg-ef-bg text-ef-ink">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[440px] overflow-hidden sm:h-[520px]">
          <Image
            src={hero}
            alt={operator.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.15)_0%,rgba(5,5,5,0.55)_55%,#050505_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="mx-auto max-w-[1100px]">
              <div className="flex flex-wrap items-center gap-2">
                <EndfieldBadge tone="accent">{operator.rarity}★</EndfieldBadge>
                <EndfieldTag color={accent} icon={
                  elementIcon[el] ? (
                    <span className="relative inline-block h-3.5 w-3.5">
                      <Image src={elementIcon[el]} alt="" fill sizes="14px" className="object-contain" />
                    </span>
                  ) : null
                }>
                  {elementLabel[el] ?? el}
                </EndfieldTag>
                <EndfieldTag>{classLabel[operator.class] ?? operator.class}</EndfieldTag>
                <EndfieldTag>{weaponLabel[operator.weapon] ?? operator.weapon}</EndfieldTag>
              </div>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-ef-ink drop-shadow-lg sm:text-6xl">
                {operator.name}
              </h1>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-ef-muted sm:text-base">
                {operator.enName}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-3 grid max-w-[1100px] gap-4 px-3 pb-10 sm:px-6">
        {/* QUICK STATS */}
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <EndfieldStatsCard label="생명력" value={operator.mainStats.hp.toLocaleString()} />
          <EndfieldStatsCard label="공격력" value={operator.mainStats.attack.toLocaleString()} />
          <EndfieldStatsCard label="방어력" value={operator.mainStats.defense.toLocaleString()} />
          <EndfieldStatsCard label="주 능력치" value={operator.mainStatLabel ?? "-"} />
        </section>

        {/* TABS */}
        <EndfieldTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "stats", label: "스탯" },
            { value: "skills", label: "스킬" },
            { value: "talents", label: "재능", count: operator.talents.length },
            { value: "potential", label: "잠재", count: operator.potential.length },
          ]}
        />

        {tab === "skills" ? (
          <SectionCard title="전투 스킬">
            <EndfieldGrid min={240}>
              {skills.map((skill) => (
                <EndfieldPanel key={skill.kind} inset className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <EndfieldBadge tone="accent">{skill.kind}</EndfieldBadge>
                    {skill.typeLabel ? (
                      <span className="text-[11px] font-bold text-ef-muted">
                        {skill.typeLabel}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-base font-black text-ef-ink">{skill.name}</p>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-ef-muted">
                    {skill.summary ?? skill.typeLabel ?? "스킬 설명"}
                  </p>
                </EndfieldPanel>
              ))}
            </EndfieldGrid>
          </SectionCard>
        ) : null}

        {tab === "stats" ? (
          <SectionCard title="기본 정보 / 스탯">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["속성", elementLabel[el] ?? el],
                ["클래스", classLabel[operator.class] ?? operator.class],
                ["무기", weaponLabel[operator.weapon] ?? operator.weapon],
                ["레어도", `${operator.rarity}성`],
                ["보조 능력치", operator.subStatLabel ?? "-"],
                ["치명타 확률", operator.subStats.critRate],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-ef-line bg-ef-card2 px-4 py-3"
                >
                  <span className="text-xs font-bold text-ef-muted">{label}</span>
                  <span className="text-sm font-black text-ef-accent-soft">{value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {(tab === "talents" || tab === "potential") ? (
          <SectionCard title={tab === "talents" ? "재능" : "잠재능력"}>
            <div className="grid gap-2">
              {(tab === "talents" ? operator.talents : operator.potential)
                .slice(0, 4)
                .map((item: any, index: number) => (
                  <EndfieldPanel key={index} inset className="p-4">
                    <p className="text-sm font-black text-ef-accent-soft">
                      {item.name ?? item.title ?? `항목 ${index + 1}`}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ef-muted">
                      {item.description ??
                        (Array.isArray(item.descriptions)
                          ? item.descriptions[0]
                          : "설명")}
                    </p>
                  </EndfieldPanel>
                ))}
            </div>
          </SectionCard>
        ) : null}
      </div>
    </main>
  );
}
