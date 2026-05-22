"use client";

import { useMemo, useState } from "react";
import InteractiveSkillPanel from "./InteractiveSkillPanel";

type SkillDetail = React.ComponentProps<typeof InteractiveSkillPanel>["skill"];

type Props = {
  skills: SkillDetail[];
  accentColor: string;
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
    <section className="overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#06080c] shadow-[0_18px_45px_rgba(0,0,0,0.32)]">
      <div className="border-b border-yellow-500/10 bg-[radial-gradient(circle_at_20%_0%,rgba(255,210,74,0.12),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.045),rgba(255,255,255,0.01))] p-3 lg:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.28em] text-yellow-200/80">
              COMBAT SKILLS
            </p>
            <h3 className="mt-1 text-xl font-black text-yellow-100 lg:text-2xl">
              전투 스킬 덱
            </h3>
            <p className="mt-1 text-xs font-medium text-zinc-500 lg:text-sm">
              스킬을 선택해서 상세 수치와 강화 재료를 확인합니다.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {safeSkills.map((skill, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={`${skill.typeLabel}-${skill.name}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={[
                    "shrink-0 rounded-2xl border px-3 py-2 text-left transition lg:min-w-[136px]",
                    active
                      ? "border-yellow-300/60 bg-yellow-400/15 text-yellow-100 shadow-[0_0_18px_rgba(255,210,74,0.12)]"
                      : "border-yellow-500/10 bg-black/40 text-zinc-400 hover:border-yellow-400/30 hover:text-yellow-100",
                  ].join(" ")}
                >
                  <span className="block text-[10px] font-black tracking-[0.12em] opacity-70">
                    {skill.typeLabel}
                  </span>
                  <span className="mt-1 block max-w-[160px] truncate text-xs font-black lg:text-sm">
                    {skill.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-3 lg:p-4">
        <InteractiveSkillPanel skill={selectedSkill} accentColor={accentColor} />
      </div>
    </section>
  );
}
