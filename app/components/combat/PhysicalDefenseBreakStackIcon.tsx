import Image from "next/image";

import { physicalCombatIconPaths } from "@/data/combat-icon-paths";
import StackArcMarkers from "./StackArcMarkers";

type PhysicalDefenseBreakStackIconProps = {
  stacks: number;
  size?: "sm" | "md";
};

export default function PhysicalDefenseBreakStackIcon({
  stacks,
  size = "md",
}: PhysicalDefenseBreakStackIconProps) {
  const normalizedStacks = Math.min(4, Math.max(1, Math.trunc(stacks)));
  const frameClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconClass = size === "sm" ? "h-5 w-5" : "h-7 w-7";

  return (
    <span
      className={`relative inline-flex ${frameClass} items-center justify-center`}
      title={`방어 불능 ${normalizedStacks}스택`}
    >
      <span className={`relative ${iconClass}`}>
        <Image
          src={physicalCombatIconPaths.defenseBreak}
          alt="방어 불능"
          fill
          sizes={size === "sm" ? "20px" : "28px"}
          className="object-contain"
        />
      </span>

      <StackArcMarkers stacks={normalizedStacks} size={size} />
    </span>
  );
}
