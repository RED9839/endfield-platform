import Image from "next/image";

import {
  artsAttachmentIconPaths,
  type ArtsAttachmentIconKey,
} from "@/data/combat-icon-paths";

type ArtsAttachmentStackIconProps = {
  element: ArtsAttachmentIconKey;
  stacks: number;
  size?: "sm" | "md";
};

const stackMarkerClasses = [
  "left-1/2 top-0 h-2 w-4 -translate-x-1/2 -translate-y-1/2 rounded-t-full border-x-2 border-t-2",
  "right-0 top-1/2 h-4 w-2 -translate-y-1/2 translate-x-1/2 rounded-r-full border-y-2 border-r-2",
  "bottom-0 left-1/2 h-2 w-4 -translate-x-1/2 translate-y-1/2 rounded-b-full border-x-2 border-b-2",
  "left-0 top-1/2 h-4 w-2 -translate-x-1/2 -translate-y-1/2 rounded-l-full border-y-2 border-l-2",
] as const;

export default function ArtsAttachmentStackIcon({
  element,
  stacks,
  size = "md",
}: ArtsAttachmentStackIconProps) {
  const normalizedStacks = Math.min(4, Math.max(1, Math.trunc(stacks)));
  const frameClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconClass = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const markerScaleClass = size === "sm" ? "scale-90" : "scale-100";

  return (
    <span
      className={`relative inline-flex ${frameClass} items-center justify-center`}
      title={`${element} 부착 ${normalizedStacks}스택`}
    >
      <span className={`relative ${iconClass}`}>
        <Image
          src={artsAttachmentIconPaths[element]}
          alt={`${element} 부착`}
          fill
          sizes={size === "sm" ? "20px" : "28px"}
          className="object-contain"
        />
      </span>

      {stackMarkerClasses.slice(0, normalizedStacks).map((markerClass) => (
        <span
          key={markerClass}
          className={[
            "absolute border-white bg-transparent shadow-[0_0_5px_rgba(255,255,255,0.85)]",
            markerScaleClass,
            markerClass,
          ].join(" ")}
        />
      ))}
    </span>
  );
}
