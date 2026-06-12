import type { GameEvent } from "../types/game";

export const events: GameEvent[] = [
  {
    id: "silent-conveyor",
    title: "멈춰 선 운송선",
    description:
      "오염 지대 한가운데서 무인 운송선이 낮은 신호음을 반복한다. 적재함은 잠겨 있지만 아직 전력이 남아 있다.",
    choices: [
      {
        id: "force-open",
        label: "강제로 개방한다",
        description: "파티가 8 피해를 받고 90 크레딧을 얻습니다.",
        hpCost: 8,
        credits: 90,
      },
      {
        id: "reroute",
        label: "전력을 우회한다",
        description: "보관된 전술 장비를 획득합니다.",
        gearSlug: "frontierscomm",
      },
    ],
  },
  {
    id: "field-medic",
    title: "떠돌이 의료팀",
    description:
      "철수 중인 의료팀이 당신의 신분을 확인한다. 남은 약품은 많지 않지만 거래할 의향은 있어 보인다.",
    choices: [
      {
        id: "treatment",
        label: "응급 처치를 받는다",
        description: "모든 오퍼레이터가 22 회복합니다.",
        heal: 22,
      },
      {
        id: "escort",
        label: "안전 지대까지 호위한다",
        description: "120 크레딧을 얻습니다.",
        credits: 120,
      },
    ],
  },
];
