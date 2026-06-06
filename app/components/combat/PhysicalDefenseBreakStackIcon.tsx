import Image from "next/image";

import { physicalCombatIconPaths } from "@/data/combat-icon-paths";

type PhysicalDefenseBreakStackIconProps = {
  stacks: number;
  size?: "sm" | "md";
};

const stackMarkerPositions = [
  "left-1/2 top-0 -translate-x-1/2 -translate-y-1/3",
  "right-0 top-1/2 -translate-y-1/2 translate-x-1/3",
  "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3",
  "left-0 top-1/2 -translate-x-1/3 -translate-y-1/2",
] as const;

export default function PhysicalDefenseBreakStackIcon({
  stacks,
  size = "md",
}: PhysicalDefenseBreakStackIconProps) {
  const normalizedStacks = Math.min(4, Math.max(1, Math.trunc(stacks)));
  const frameClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconClass = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const markerClass = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

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

      {stackMarkerPositions.slice(0, normalizedStacks).map((position) => (
        <span
          key={position}
          className={[
            "absolute rounded-full border border-black/70 bg-white shadow-[0_0_5px_rgba(255,255,255,0.85)]",
            markerClass,
            position,
          ].join(" ")}
        />
      ))}
    </span>
  );
}
