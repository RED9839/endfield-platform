import type { MapNode } from "../types/game";

export const mapNodes: MapNode[] = [
  {
    id: "battle-1a",
    floor: 1,
    column: 1,
    type: "battle",
    title: "외곽 검문소",
    subtitle: "일반 전투 · 초급 장비",
    next: ["event-1a", "battle-2a"],
    enemyIds: ["raider", "pyromancer"],
  },
  {
    id: "battle-1b",
    floor: 1,
    column: 3,
    type: "battle",
    title: "붕괴 협곡 입구",
    subtitle: "일반 전투 · 초급 장비",
    next: ["battle-2a", "camp-1a"],
    enemyIds: ["raider", "stalker"],
  },
  {
    id: "event-1a",
    floor: 2,
    column: 0,
    type: "event",
    title: "정지된 운송선",
    subtitle: "사건 · 장비 후보",
    next: ["elite-1a", "camp-1a"],
  },
  {
    id: "battle-2a",
    floor: 2,
    column: 2,
    type: "battle",
    title: "오염된 보급로",
    subtitle: "일반 전투 · 중급 장비",
    next: ["elite-1a", "event-1b"],
    enemyIds: ["raider", "stalker", "pyromancer"],
  },
  {
    id: "camp-1a",
    floor: 2,
    column: 4,
    type: "camp",
    title: "이동식 야영지",
    subtitle: "회복 또는 훈련",
    next: ["event-1b", "elite-1a"],
  },
  {
    id: "elite-1a",
    floor: 3,
    column: 1,
    type: "elite",
    title: "갑주 야수 둥지",
    subtitle: "정예 전투 · 상급 장비",
    next: ["camp-1b", "boss-1"],
    enemyIds: ["armorbeast", "pyromancer"],
  },
  {
    id: "event-1b",
    floor: 3,
    column: 3,
    type: "event",
    title: "불명 구조 신호",
    subtitle: "사건 · 선택 보상",
    next: ["camp-1b", "boss-1"],
  },
  {
    id: "camp-1b",
    floor: 4,
    column: 2,
    type: "camp",
    title: "보스 전초기지",
    subtitle: "최종 정비",
    next: ["boss-1"],
  },
  {
    id: "boss-1",
    floor: 5,
    column: 2,
    type: "boss",
    title: "붕괴한 채굴장",
    subtitle: "지역 보스",
    next: [],
    enemyIds: ["rhodagn"],
  },
];

export const startingNodeIds = ["battle-1a", "battle-1b"];

export function getMapNode(id: string) {
  const node = mapNodes.find((item) => item.id === id);
  if (!node) throw new Error(`Unknown map node: ${id}`);
  return node;
}
