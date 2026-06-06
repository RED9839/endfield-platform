type StackArcMarkersProps = {
  stacks: number;
  size?: "sm" | "md";
};

const arcRotations = [0, 90, 180, 270] as const;

export default function StackArcMarkers({
  stacks,
  size = "md",
}: StackArcMarkersProps) {
  const normalizedStacks = Math.min(4, Math.max(1, Math.trunc(stacks)));
  const svgSize = size === "sm" ? 34 : 42;
  const strokeWidth = size === "sm" ? 4 : 5;
  const radius = size === "sm" ? 14 : 17;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.16;
  const gapLength = circumference - arcLength;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 overflow-visible"
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      width={svgSize}
    >
      {arcRotations.slice(0, normalizedStacks).map((rotation) => (
        <circle
          key={rotation}
          cx={svgSize / 2}
          cy={svgSize / 2}
          fill="none"
          r={radius}
          stroke="white"
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(${rotation - 126} ${svgSize / 2} ${svgSize / 2})`}
        />
      ))}
    </svg>
  );
}
