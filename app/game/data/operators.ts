import type { Operator } from "../types/game";

export const operators: Operator[] = [
  {
    id: "endministrator",
    name: "관리자",
    role: "전위",
    element: "physical",
    image: "/operators/endministrator/avatar1.webp",
    maxHp: 92,
    attack: 13,
    skillName: "프로토콜 절단",
    skillPower: 27,
    skillCost: 2,
  },
  {
    id: "perlica",
    name: "펠리카",
    role: "술사",
    element: "electric",
    image: "/operators/perlica/avatar.webp",
    maxHp: 72,
    attack: 11,
    skillName: "궤도 낙뢰",
    skillPower: 31,
    skillCost: 3,
  },
  {
    id: "chenqianyu",
    name: "진천우",
    role: "근위",
    element: "physical",
    image: "/operators/chenqianyu/avatar.webp",
    maxHp: 84,
    attack: 15,
    skillName: "돌파 연격",
    skillPower: 25,
    skillCost: 2,
  },
  {
    id: "ember",
    name: "엠버",
    role: "중장",
    element: "heat",
    image: "/operators/ember/avatar.webp",
    maxHp: 112,
    attack: 10,
    skillName: "열압 방벽",
    skillPower: 22,
    skillCost: 2,
  },
];

export const startingParty = operators;
