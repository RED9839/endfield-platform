import type { MapNode } from "../types/game";

export const mapNodes: MapNode[] = [
  {
    id: "battle-1",
    floor: 1,
    column: 1,
    type: "battle",
    title: "폐기된 검문소",
    subtitle: "일반 전투",
    next: ["event-1", "camp-1"],
    enemyIds: ["raider", "pyromancer"],
  },
  {
    id: "battle-2",
    floor: 1,
    column: 3,
    type: "battle",
    title: "오염된 협곡",
    subtitle: "일반 전투",
    next: ["camp-1", "elite-1"],
    enemyIds: ["raider", "stalker"],
  },
  {
    id: "event-1",
    floor: 2,
    column: 0,
    type: "event",
    title: "불명 신호",
    subtitle: "사건",
    next: ["boss-1"],
  },
  {
    id: "camp-1",
    floor: 2,
    column: 2,
    type: "camp",
    title: "이동식 야영지",
    subtitle: "회복 또는 훈련",
    next: ["boss-1"],
  },
  {
    id: "elite-1",
    floor: 2,
    column: 4,
    type: "elite",
    title: "갑주 야수의 둥지",
    subtitle: "정예 전투",
    next: ["boss-1"],
    enemyIds: ["armorbeast", "pyromancer"],
  },
  {
    id: "boss-1",
    floor: 3,
    column: 2,
    type: "boss",
    title: "붕괴한 채굴장",
    subtitle: "지역 보스",
    next: [],
    enemyIds: ["rhodagn"],
  },
];

export const startingNodeIds = ["battle-1", "battle-2"];

export function getMapNode(id: string) {
  const node = mapNodes.find((item) => item.id === id);
  if (!node) throw new Error(`Unknown map node: ${id}`);
  return node;
}
