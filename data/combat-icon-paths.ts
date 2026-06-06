export const physicalCombatIconPaths = {
  physical: "/icons/elements/physical.webp",
  defenseBreak: "/icons/status/defense-break.webp",
  launch: "/icons/status/launch.webp",
  knockdown: "/icons/status/knockdown.webp",
  smash: "/icons/status/smash.webp",
  armorBreak: "/icons/status/armor-break.webp",
} as const;

export type PhysicalCombatIconKey = keyof typeof physicalCombatIconPaths;

export const artsAttachmentIconPaths = {
  heat: "/icons/elements/heat.webp",
  electric: "/icons/elements/electric.webp",
  cryo: "/icons/elements/cryo.webp",
  nature: "/icons/elements/nature.webp",
} as const;

export type ArtsAttachmentIconKey = keyof typeof artsAttachmentIconPaths;
