import Image from "next/image";

import {
  artsReactionIconPaths,
  artsReactionLabels,
  type ArtsReactionIconKey,
} from "@/data/combat-icon-paths";

type ArtsReactionStatusIconProps = {
  reaction: ArtsReactionIconKey;
  size?: "sm" | "md";
};

export default function ArtsReactionStatusIcon({
  reaction,
  size = "md",
}: ArtsReactionStatusIconProps) {
  const frameClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconClass = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <span
      className={`relative inline-flex ${frameClass} items-center justify-center`}
      title={artsReactionLabels[reaction]}
    >
      <span className={`relative ${iconClass}`}>
        <Image
          src={artsReactionIconPaths[reaction]}
          alt={artsReactionLabels[reaction]}
          fill
          sizes={size === "sm" ? "24px" : "32px"}
          className="object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.45)]"
        />
      </span>
    </span>
  );
}
