export const physicalCombatIconPaths = {
  physical: "/icons/elements/physical.webp",
  defenseBreak: "/icons/status/defense-break.webp",
  launch: "/icons/status/launch.png",
  knockdown: "/icons/status/knockdown.png",
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

export const artsReactionLabels = {
  burning: "연소",
  frozen: "동결",
  electrified: "감전",
  corroded: "부식",
  shatter: "쇄빙",
  heatBurst: "열기 폭발",
  cryoBurst: "냉기 폭발",
  electricBurst: "전기 폭발",
  natureBurst: "자연 폭발",
} as const;

export type ArtsReactionIconKey = keyof typeof artsReactionLabels;

export const artsReactionIconPaths: Record<ArtsReactionIconKey, string> = {
  burning: "/icons/reactions/burning.webp",
  frozen: "/icons/reactions/frozen.webp",
  electrified: "/icons/reactions/electrified.webp",
  corroded: "/icons/reactions/corroded.webp",
  shatter: "/icons/reactions/shatter.webp",
  heatBurst: "/icons/reactions/heat-burst.webp",
  cryoBurst: "/icons/reactions/cryo-burst.webp",
  electricBurst: "/icons/reactions/electric-burst.webp",
  natureBurst: "/icons/reactions/nature-burst.webp",
};

export const artsBurstIconPaths = {
  heat: "/icons/reactions/heat-burst.webp",
  cryo: "/icons/reactions/cryo-burst.webp",
  electric: "/icons/reactions/electric-burst.webp",
  nature: "/icons/reactions/nature-burst.webp",
  shatter: "/icons/reactions/shatter.webp",
} as const;
