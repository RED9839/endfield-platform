export const physicalCombatIconPaths = {
  physical: "/icons/elements/physical.webp",
  defenseBreak: "/icons/status/defense-break.webp",
  launch: "/icons/status/launch.png",
  knockdown: "/icons/status/knockdown.png",
  smash: "/icons/status/smash.webp",
  armorBreak: "/icons/status/armor-break.webp",
  solidification: "/icons/status/solidification.webp", // 오리지늄 결정(crystal) — endfield.wiki.gg Solidification_icon
  encasement: "/icons/status/encasement.webp",         // 기절/봉인(stun) — endfield.wiki.gg Edit_Encasement_icon
} as const;

export type PhysicalCombatIconKey = keyof typeof physicalCombatIconPaths;

export const artsAttachmentIconPaths = {
  heat: "/icons/attachments/heat.webp",
  electric: "/icons/attachments/electric.webp",
  cryo: "/icons/attachments/cryo.webp",
  nature: "/icons/attachments/nature.webp",
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

// 전투 효과 버프/디버프 아이콘 — warfarin TermIcon(icon_term_ba_*) 원본.
export const combatEffectIconPaths = {
  amplify: "/icons/effects/amplify.webp",     // 증폭
  vulnerable: "/icons/effects/vulnerable.webp", // 취약
  guard: "/icons/effects/guard.webp",         // 비호
  weaken: "/icons/effects/weaken.webp",       // 허약
  haste: "/icons/effects/haste.webp",         // 가속
  slow: "/icons/effects/slow.webp",           // 감속
  combo: "/icons/effects/combo.webp",         // 연타
} as const;

export type CombatEffectIconKey = keyof typeof combatEffectIconPaths;

// 스탯 아이콘 — 전투 칩에서 공격 버프·재생 등에 재사용(icons/stats 원본).
export const statCombatIconPaths = {
  attack: "/icons/stats/attack.webp",       // 공격력 버프
  heal: "/icons/stats/heal_efficiency.webp", // 재생·치유
} as const;

export const artsBurstIconPaths = {
  heat: "/icons/reactions/heat-burst.webp",
  cryo: "/icons/reactions/cryo-burst.webp",
  electric: "/icons/reactions/electric-burst.webp",
  nature: "/icons/reactions/nature-burst.webp",
  shatter: "/icons/reactions/shatter.webp",
} as const;
