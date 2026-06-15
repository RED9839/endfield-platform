"use client";

import Image from "next/image";
import { useState } from "react";

import {
  getOperatorDetailBySlug,
  operatorDetails,
} from "@/data/operators-detail-data";

// 속성별 포인트 컬러(캐릭터별 accent). 노란색은 게임 UI 공통 포인트로 유지.
const EL: Record<
  string,
  { label: string; color: string; glow: string }
> = {
  physical: { label: "물리", color: "#d6dae3", glow: "rgba(214,218,227,0.22)" },
  cryo: { label: "냉기", color: "#4fa3ff", glow: "rgba(79,163,255,0.40)" },
  heat: { label: "열기", color: "#ff8a1f", glow: "rgba(255,138,31,0.42)" },
  nature: { label: "자연", color: "#3ecf8e", glow: "rgba(62,207,142,0.36)" },
  electric: { label: "전기", color: "#c084fc", glow: "rgba(192,132,252,0.40)" },
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

// 각진 코너(인게임 mech 패널 느낌)
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
};

function TechLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">
      {children}
    </span>
  );
}

export default function OperatorRedesignPreview() {
  const operator = getOperatorDetailBySlug("laevatain") ?? operatorDetails[0];
  const [tab, setTab] = useState("skills");

  const el = EL[operator.element] ?? EL.physical;
  const accent = el.color;
  const hero = operator.fullImage || operator.avatar;
  const elIcon = `/icons/elements/${operator.element}.webp`;

  const skills = [
    { ...operator.skills.normalAttack, kind: "일반 공격" },
    { ...operator.skills.battleSkill, kind: "배틀 스킬" },
    { ...operator.skills.comboSkill, kind: "연계 스킬" },
    { ...operator.skills.ultimate, kind: "궁극기" },
  ];

  return (
    <main className="min-h-screen bg-ef-bg text-ef-ink">
      {/* ===== HERO (확대 · 캐릭터 중심) ===== */}
      <section className="relative min-h-[660px] overflow-hidden sm:min-h-[820px] lg:min-h-[92vh]">
        {/* 블러 배경 일러 + 속성 글로우 + 그리드 텍스처 */}
        <div className="absolute inset-0">
          <Image
            src={hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-125 object-cover object-top blur-2xl brightness-[0.3]"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(58% 48% at 68% 32%, ${el.glow}, transparent 72%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.18)_0%,rgba(5,5,5,0.5)_52%,#050505_100%)]" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        {/* 선명한 캐릭터 풀 일러 */}
        <div className="absolute inset-0">
          <Image
            src={hero}
            alt={operator.name}
            fill
            priority
            sizes="100vw"
            className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] sm:object-[58%_bottom]"
          />
        </div>

        {/* 상단 HUD */}
        <div className="relative z-10 mx-auto flex max-w-[1200px] items-center justify-between px-4 pt-5 sm:px-8 sm:pt-7">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3" style={{ background: accent }} />
            <TechLabel>Operator File</TechLabel>
          </div>
          <span
            className="font-mono text-[11px] font-black tracking-[0.3em]"
            style={{ color: accent }}
          >
            NO.06
          </span>
        </div>

        {/* 코너 브래킷 */}
        <span className="pointer-events-none absolute left-3 top-16 h-8 w-8 border-l-2 border-t-2 sm:left-7" style={{ borderColor: `${accent}88` }} />
        <span className="pointer-events-none absolute right-3 top-16 h-8 w-8 border-r-2 border-t-2 sm:right-7" style={{ borderColor: `${accent}88` }} />

        {/* 하단 아이덴티티 */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-8 sm:pb-12">
            <div className="mb-3 flex items-center gap-2.5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-black"
                style={{ ...CUT, background: accent, color: "#050505" }}
              >
                <span className="relative inline-block h-3.5 w-3.5">
                  <Image src={elIcon} alt="" fill sizes="14px" className="object-contain" />
                </span>
                {el.label}
              </span>
              <span className="text-base font-black tracking-widest text-ef-accent">
                {"★".repeat(operator.rarity)}
              </span>
            </div>

            <div className="flex items-end gap-3">
              <span
                className="hidden h-24 w-1.5 shrink-0 sm:block"
                style={{ background: `linear-gradient(180deg, ${accent}, #ffd24a)` }}
              />
              <div className="min-w-0">
                <h1 className="break-keep text-[clamp(48px,15vw,104px)] font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                  {operator.name}
                </h1>
                <p
                  className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.28em] sm:text-base"
                  style={{ color: accent }}
                >
                  {operator.enName}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                classLabel[operator.class] ?? operator.class,
                weaponLabel[operator.weapon] ?? operator.weapon,
                `${operator.mainStatLabel ?? "주능력치"}`,
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center border border-ef-line bg-black/60 px-3 py-1.5 text-xs font-black text-ef-ink backdrop-blur"
                  style={CUT}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 정보 패널 (게임 정보창) ===== */}
      <div className="mx-auto -mt-6 grid max-w-[1200px] gap-5 px-4 pb-14 sm:px-8">
        {/* 스탯 리드아웃 — 헤어라인 분할 mech 패널 */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-6" style={{ background: accent }} />
            <TechLabel>Combat Stats</TechLabel>
          </div>
          <div
            className="grid grid-cols-3 gap-px overflow-hidden border bg-ef-line"
            style={{ ...CUT, borderColor: `${accent}40` }}
          >
            {[
              ["생명력", operator.mainStats.hp.toLocaleString()],
              ["공격력", operator.mainStats.attack.toLocaleString()],
              ["방어력", operator.mainStats.defense.toLocaleString()],
            ].map(([label, value]) => (
              <div key={label} className="bg-ef-card px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2" style={{ background: accent }} />
                  <TechLabel>{label}</TechLabel>
                </div>
                <p className="mt-2 text-2xl font-black text-ef-accent-soft sm:text-4xl">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 탭 (mech) */}
        <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { value: "skills", label: "스킬" },
            { value: "stats", label: "스탯" },
            { value: "talents", label: `재능 ${operator.talents.length}` },
            { value: "potential", label: `잠재 ${operator.potential.length}` },
          ].map((t) => {
            const active = t.value === tab;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className="inline-flex min-h-11 shrink-0 items-center px-5 text-sm font-black transition"
                style={{
                  ...CUT,
                  background: active ? `${accent}1f` : "#0b0b0b",
                  color: active ? "#fff" : "#a0a0a0",
                  border: `1px solid ${active ? accent : "#202020"}`,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 스킬 — 구조 다양화: 01~03 행 카드 + 궁극기(04) 와이드 하이라이트 */}
        {tab === "skills" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((skill, index) => {
              const ult = index === 3;
              const barColor = ult ? "#ffd24a" : accent;
              return (
                <div
                  key={skill.kind}
                  className={ult ? "sm:col-span-2" : ""}
                >
                  <div
                    className="relative overflow-hidden border bg-ef-card p-4 pl-6 sm:p-5 sm:pl-7"
                    style={{
                      ...CUT,
                      borderColor: ult ? "#ffd24a55" : "#202020",
                      background: ult
                        ? "linear-gradient(100deg, rgba(255,210,74,0.08), #0b0b0b 45%)"
                        : "#0b0b0b",
                    }}
                  >
                    <span
                      className="absolute left-0 top-0 h-full w-1.5"
                      style={{ background: barColor }}
                    />
                    <span className="pointer-events-none absolute right-3 top-2 font-mono text-4xl font-black text-white/5 sm:text-6xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="relative flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                        style={{
                          background: `${barColor}1f`,
                          color: barColor,
                          border: `1px solid ${barColor}55`,
                        }}
                      >
                        {skill.kind}
                      </span>
                      {skill.typeLabel ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ef-muted">
                          {skill.typeLabel}
                        </span>
                      ) : null}
                    </div>

                    <p className="relative mt-3 text-lg font-black text-ef-accent-soft sm:text-xl">
                      {skill.name}
                    </p>
                    <p
                      className={`relative mt-2 text-xs leading-5 text-ef-muted ${ult ? "line-clamp-3 sm:max-w-[70%]" : "line-clamp-3"}`}
                    >
                      {skill.summary ?? skill.typeLabel ?? "스킬 설명"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === "stats" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["속성", el.label],
              ["클래스", classLabel[operator.class] ?? operator.class],
              ["무기", weaponLabel[operator.weapon] ?? operator.weapon],
              ["레어도", `${operator.rarity}성`],
              ["보조 능력치", operator.subStatLabel ?? "-"],
              ["치명타 확률", operator.subStats.critRate],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between border border-ef-line bg-ef-card px-4 py-3.5"
                style={CUT}
              >
                <TechLabel>{label}</TechLabel>
                <span className="text-sm font-black text-ef-accent-soft">{value}</span>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "talents" || tab === "potential" ? (
          <div className="grid gap-2">
            {(tab === "talents" ? operator.talents : operator.potential)
              .slice(0, 4)
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className="relative border border-ef-line bg-ef-card p-4 pl-6"
                  style={CUT}
                >
                  <span
                    className="absolute left-0 top-0 h-full w-1.5"
                    style={{ background: accent }}
                  />
                  <p className="text-sm font-black text-ef-accent-soft">
                    {item.name ?? item.title ?? `항목 ${index + 1}`}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ef-muted">
                    {item.description ??
                      (Array.isArray(item.descriptions)
                        ? item.descriptions[0]
                        : "설명")}
                  </p>
                </div>
              ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
