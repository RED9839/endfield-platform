import type { Relic } from "../types/game";

export const relics: Relic[] = [
  {
    id: "field-ration",
    name: "압축 야전식",
    description: "모든 오퍼레이터를 18 회복합니다.",
    icon: "R-01",
    effect: "heal",
    value: 18,
  },
  {
    id: "combat-stimulant",
    name: "전투 자극제",
    description: "모든 오퍼레이터의 공격력이 3 증가합니다.",
    icon: "R-02",
    effect: "attack",
    value: 3,
  },
  {
    id: "xiranite-plate",
    name: "시라나이트 장갑판",
    description: "최대 체력과 현재 체력이 14 증가합니다.",
    icon: "R-03",
    effect: "max-hp",
    value: 14,
  },
  {
    id: "protocol-battery",
    name: "프로토콜 축전지",
    description: "최대 SP가 1 증가하고 SP를 모두 회복합니다.",
    icon: "R-04",
    effect: "sp",
    value: 1,
  },
];

export function getRelic(id: string) {
  const relic = relics.find((item) => item.id === id);
  if (!relic) throw new Error(`Unknown relic: ${id}`);
  return relic;
}
