import type { GearDetail } from "../gear-types";

const setEffect =
  "장착자의 공격력 +8%. 장착자가 강타, 갑옷 파괴 피해를 줄 때, 소모한 최대 방어 불능 스택 수치에 따라 자신의 물리 피해 +[6%×소모한 스택 수치], 20초 동안 지속. 만약 목표가 물리 취약, 불균형 상태거나 오리지늄 결정이 부착된 상태라면 위의 버프 효과가 1.5배로 변경됩니다. 버프 효과는 중첩되지 않습니다.";

export const grizzlededgearmort1: GearDetail = {
  slug: "grizzlededgearmort1",
  name: "고검의 잔향 장갑 · I",
  enName: "Grizzled Edge Armor T1",
  category: "armor",
  level: 70,
  quality: 5,
  setName: "고검의 잔향",
  image: "/gear/grizzlededgearmort1.webp",
  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 유실된 기술 문서를 회수한 뒤 개발한 종합 방어 장비. 아겔로스 전쟁 시기의 흔적을 간직하고 있어 무겁고 투박하지만, 그만큼 충분한 효율을 자랑합니다.",
  baseStat: {
    label: "방어력",
    value: "+56",
  },
  ability1: {
    label: "민첩",
    values: { base: "+87", level1: "+95", level2: "+104", level3: "+113" },
  },
  ability2: {
    label: "힘",
    values: { base: "+58", level1: "+63", level2: "+69", level3: "+75" },
  },
  attribute: {
    label: "오리지늄 아츠 강도",
    values: { base: "+20", level1: "+22", level2: "+24", level3: "+26" },
  },
  abilityTypes: ["agility", "strength"],
  attributeTypes: ["originiumArts"],
  setEffects: [{ pieces: 3, description: setEffect }],
};
