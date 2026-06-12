import type { Enemy } from "../types/game";

export const enemies: Enemy[] = [
  {
    id: "raider",
    name: "본크러셔 약탈자",
    maxHp: 46,
    attack: 8,
    intent: "전열을 공격",
  },
  {
    id: "pyromancer",
    name: "본크러셔 방화술사",
    maxHp: 38,
    attack: 11,
    intent: "후열에 화염 공격",
  },
  {
    id: "armorbeast",
    name: "도끼갑주 야수",
    maxHp: 74,
    attack: 12,
    intent: "강한 일격을 준비",
    elite: true,
  },
  {
    id: "stalker",
    name: "운해 추적자",
    maxHp: 42,
    attack: 10,
    intent: "가장 약한 대상을 노림",
  },
  {
    id: "rhodagn",
    name: "뼈를 부수는 주먹 로다곤",
    maxHp: 210,
    attack: 18,
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
