import Image from "next/image";

import { physicalCombatIconPaths } from "@/data/combat-icon-paths";

type PhysicalStatusIconKey = "launch" | "knockdown" | "smash" | "armorBreak";

type PhysicalCombatStatusIconProps = {
  status: PhysicalStatusIconKey;
  size?: "sm" | "md";
};

const physicalStatusLabels: Record<PhysicalStatusIconKey, string> = {
  launch: "띄우기",
  knockdown: "넘어뜨리기",
  smash: "강타",
  armorBreak: "갑옷 파괴",
};

export default function PhysicalCombatStatusIcon({
  status,
  size = "md",
}: PhysicalCombatStatusIconProps) {
  const frameClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconClass = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <span
      className={`relative inline-flex ${frameClass} items-center justify-center`}
      title={physicalStatusLabels[status]}
    >
      <span className={`relative ${iconClass}`}>
        <Image
          src={physicalCombatIconPaths[status]}
          alt={physicalStatusLabels[status]}
          fill
          sizes={size === "sm" ? "24px" : "32px"}
          className="object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.45)]"
        />
      </span>
    </span>
  );
}
