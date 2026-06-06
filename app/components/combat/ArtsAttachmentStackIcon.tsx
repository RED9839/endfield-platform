import Image from "next/image";

import {
  artsAttachmentIconPaths,
  type ArtsAttachmentIconKey,
} from "@/data/combat-icon-paths";
import StackArcMarkers from "./StackArcMarkers";

type ArtsAttachmentStackIconProps = {
  element: ArtsAttachmentIconKey;
  stacks: number;
  size?: "sm" | "md";
};

export default function ArtsAttachmentStackIcon({
  element,
  stacks,
  size = "md",
}: ArtsAttachmentStackIconProps) {
  const normalizedStacks = Math.min(4, Math.max(1, Math.trunc(stacks)));
  const frameClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconClass = size === "sm" ? "h-5 w-5" : "h-7 w-7";

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

      <StackArcMarkers stacks={normalizedStacks} size={size} />
    </span>
  );
}
