"use client";

import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import InteractiveSkillPanel from "./InteractiveSkillPanel";

type SkillDetail = ComponentProps<typeof InteractiveSkillPanel>["skill"];

type Props = {
  skills: SkillDetail[];
  accentColor: string;
};

const PRIMARY = "#ff9a2f";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function OperatorSkillsDeck({ skills, accentColor }: Props) {
  const safeSkills = useMemo(
    () => skills.filter((skill): skill is SkillDetail => !!skill),
    [skills]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSkill = safeSkills[selectedIndex] ?? safeSkills[0];

  if (!selectedSkill) return null;

  return (
    <section className="overflow-hidden border border-ef-line bg-ef-card2" style={CUT}>
      <div className="border-b border-ef-line bg-ef-card p-3 lg:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
                Combat Skills
              </p>
            </div>
            <h3 className="mt-1.5 text-xl font-black text-white lg:text-2xl">
              전투 스킬 덱
            </h3>
            <p className="mt-1 text-xs font-medium text-ef-muted lg:text-sm">
              스킬을 선택해서 상세 수치와 강화 재료를 확인합니다.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {safeSkills.map((skill, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={`${skill.typeLabel}-${skill.name}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={[
                    "min-h-[52px] shrink-0 border px-3 py-2 text-left transition lg:min-w-[136px]",
                    active
                      ? "border-ef-accent text-white"
                      : "border-ef-line bg-ef-card text-ef-muted hover:border-ef-accent/40",
                  ].join(" ")}
                  style={
                    active
                      ? { ...CUT_SM, background: "rgba(255,210,74,0.2)", boxShadow: "inset 0 -2px 0 0 #ff9a2f" }
                      : CUT_SM
                  }
                >
                  <span className="block font-mono text-[10px] font-black uppercase tracking-[0.12em] opacity-70">
                    {skill.typeLabel}
                  </span>
                  <span className="mt-1 block max-w-[150px] truncate text-xs font-black lg:text-sm">
                    {skill.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-3 lg:p-4">
        <InteractiveSkillPanel skill={selectedSkill} accentColor={accentColor} />
      </div>
    </section>
  );
}
