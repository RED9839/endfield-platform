import type { GearDetail } from "../gear-types";

const setEffect =
  "장착자의 공격력 +8%. 장착자가 강타, 갑옷 파괴 피해를 줄 때, 소모한 최대 방어 불능 스택 수치에 따라 자신의 물리 피해 +[6%×소모한 스택 수치], 20초 동안 지속. 만약 목표가 물리 취약, 불균형 상태거나 오리지늄 결정이 부착된 상태라면 위의 버프 효과가 1.5배로 변경됩니다. 버프 효과는 중첩되지 않습니다.";

export const grizzlededgepushknife: GearDetail = {
  slug: "grizzlededgepushknife",
  name: "고검의 잔향 단검",
  enName: "Grizzled Edge Push Knife",
  category: "kit",
  level: 70,
  quality: 5,
  setName: "고검의 잔향",
  image: "/gear/grizzlededgepushknife.webp",
  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 유실된 기술 문서를 회수한 뒤 개발한 종합 방어 장비. 날카로운 칼날은 언제든 견갑이나 장갑에 장착할 수 있으며, 그 위치는 착용자의 격투 유파에 따라 달라집니다.",
  baseStat: {
    label: "방어력",
    value: "+21",
  },
  ability1: {
    label: "힘",
    values: { base: "+32", level1: "+35", level2: "+38", level3: "+41" },
  },
  ability2: {
    label: "의지",
    values: { base: "+21", level1: "+23", level2: "+25", level3: "+27" },
  },
  attribute: {
    label: "물리 피해 보너스",
    values: { base: "+23.0%", level1: "+25.3%", level2: "+27.6%", level3: "+29.9%" },
  },
  abilityTypes: ["strength", "will"],
  attributeTypes: ["physicalDamage"],
  setEffects: [{ pieces: 3, description: setEffect }],
};
