import type { GearDetail } from "../gear-types";

const setEffect =
  "장착자의 공격력 +8%. 장착자가 강타, 갑옷 파괴 피해를 줄 때, 소모한 최대 방어 불능 스택 수치에 따라 자신의 물리 피해 +[6%×소모한 스택 수치], 20초 동안 지속. 만약 목표가 물리 취약, 불균형 상태거나 오리지늄 결정이 부착된 상태라면 위의 버프 효과가 1.5배로 변경됩니다. 버프 효과는 중첩되지 않습니다.";

export const grizzlededgegauntlets: GearDetail = {
  slug: "grizzlededgegauntlets",
  name: "고검의 잔향 금속 장갑",
  enName: "Grizzled Edge Gauntlets",
  category: "gloves",
  level: 70,
  quality: 5,
  setName: "고검의 잔향",
  image: "/gear/grizzlededgegauntlets.webp",
  summary:
    "이 장비는 홍산 선검국에서 설계하고, 통합 공업 시스템을 사용해 제작한 것으로, 사용자의 작전 능력을 올릴 수 있습니다.",
  description:
    "선검국이 유실된 기술 문서를 회수한 뒤 개발한 종합 방어 장비. 이상적인 기준에 비하면 이 장갑의 동력 보조 성능은 사실 다소 떨어지는 편입니다. 과거의 자원을 복제할 수는 없으니, 천사들은 다른 대안을 강구해야만 했습니다.",
  baseStat: {
    label: "방어력",
    value: "+42",
  },
  ability1: {
    label: "힘",
    values: { base: "+65", level1: "+71", level2: "+78", level3: "+84" },
  },
  ability2: {
    label: "의지",
    values: { base: "+43", level1: "+47", level2: "+51", level3: "+55" },
  },
  attribute: {
    label: "오리지늄 아츠 강도",
    values: { base: "+34", level1: "+37", level2: "+41", level3: "+44" },
  },
  abilityTypes: ["strength", "will"],
  attributeTypes: ["originiumArts"],
  setEffects: [{ pieces: 3, description: setEffect }],
};
