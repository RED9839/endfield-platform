import type { Enemy } from "../types/game";

const DEFAULT_BOSS_SPEED = 84;

export const enemies: Enemy[] = [
  {
    id: "raider",
    name: "본크러셔 약탈자",
    image: "/enemies/eny_0029_lbmob.webp",
    maxHp: 46,
    attack: 8,
    speed: 86,
    intent: "전열을 공격",
  },
  {
    id: "pyromancer",
    name: "본크러셔 염술사",
    image: "/enemies/eny_0046_lbshamman.webp",
    maxHp: 38,
    attack: 11,
    speed: 92,
    intent: "후열에 화염 공격",
  },
  {
    id: "armorbeast",
    name: "엑스 아머비스트",
    image: "/enemies/eny_0071_sandb.webp",
    maxHp: 74,
    attack: 12,
    speed: 104,
    intent: "강한 일격을 준비",
    elite: true,
  },
  {
    id: "stalker",
    name: "본크러셔 침투자",
    image: "/enemies/eny_0049_rogue.webp",
    maxHp: 42,
    attack: 10,
    speed: 108,
    intent: "가장 약한 대상을 노림",
  },
  {
    id: "rhodagn",
    name: "'본크러셔의 주먹' 로댄",
    image: "/enemies/eny_0051_rodin.webp",
    maxHp: 210,
    attack: 18,
    speed: DEFAULT_BOSS_SPEED,
    intent: "파괴적인 연속 공격",
    elite: true,
    boss: true,
  },
];

export function getEnemies(ids: string[]) {
  return ids.map((id) => {
    const enemy = enemies.find((item) => item.id === id);
    if (!enemy) throw new Error(`Unknown enemy: ${id}`);
    return enemy;
  });
}
