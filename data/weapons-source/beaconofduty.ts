import type { SourceWeaponDetail } from "../weapons-detail-data";

const attackValues = [
  49, 54, 59, 64, 69, 74, 78, 83, 88, 93, 98, 103, 108, 113, 118,
  123, 127, 132, 137, 142, 147, 152, 157, 162, 167, 172, 176, 181, 186,
  191, 196, 201, 206, 211, 216, 221, 225, 230, 235, 240, 245, 250, 255,
  260, 265, 270, 274, 279, 284, 289, 294, 299, 304, 309, 314, 319, 323,
  328, 333, 338, 343, 348, 353, 358, 363, 368, 372, 377, 382, 387, 392,
  397, 402, 407, 412, 417, 421, 426, 431, 436, 441, 446, 451, 456, 461,
  466, 470, 475, 480, 485,
];

const agilityValues = [20, 36, 52, 68, 84, 100, 116, 132, 156];
const ultimateEfficiencyValues = [6, 10.7, 15.5, 20.2, 25, 29.8, 34.5, 39.3, 46.4];
const heatDamageValues = [7, 8.4, 9.8, 11.2, 12.6, 14, 15.4, 16.8, 19.6];
const selfDamageValues = [8, 9.6, 11.2, 12.8, 14.4, 16, 17.6, 19.2, 22.4];
const teamDamageValues = [4, 4.8, 5.6, 6.4, 7.2, 8, 8.8, 9.6, 11.2];

function percent(value: number) {
  return `+${value.toFixed(1)}%`;
}

export const beaconofduty = {
  slug: "beaconofduty",
  name: "등불의 사명",
  enName: "Beacon of Duty",
  rarity: 6,
  weaponType: "polearm",
  image: "/weapons/beaconofduty.webp",
  series: "효율",
  mainStatLabel: "민첩",
  subStatLabel: "궁극기 충전 효율",
  summary:
    "엔드필드 오퍼레이터용 무기, 장착 시 오퍼레이터의 작전 능력이 크게 증가합니다.",
  description:
    "노스마치 중공업 지원소의 구형 제품, 조작성은 떨어지지만 놀라운 위력을 자랑합니다. 지나친 무게 탓에 대중에게 환영받지는 못하지만, 과감한 전투 스타일을 선호하는 이들에게는 큰 인기를 끌고 있습니다.",

  levelStats: attackValues.map((attack, index) => ({
    level: index + 1,
    attack,
  })),

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "민첩 증가 · 대: 1/3",
        "궁극기 충전 효율 증가 · 대: 1/3",
        "효율 · 불빛 연소: 1/4",
      ],
    },
    {
      stage: 1,
      requiredLevel: 20,
      materials: [
        { name: "탈로시안 화폐", count: 2200 },
        { name: "모형 틀", count: 5 },
        { name: "연한 흑암석", count: 3 },
      ],
      bonuses: [
        "민첩 증가 · 대: 2/5",
        "궁극기 충전 효율 증가 · 대: 1/4",
        "효율 · 불빛 연소: 1/4",
      ],
    },
    {
      stage: 2,
      requiredLevel: 40,
      materials: [
        { name: "탈로시안 화폐", count: 8500 },
        { name: "모형 틀", count: 18 },
        { name: "일반 흑암석", count: 5 },
      ],
      bonuses: [
        "민첩 증가 · 대: 2/6",
        "궁극기 충전 효율 증가 · 대: 2/6",
        "효율 · 불빛 연소: 1/4",
      ],
    },
    {
      stage: 3,
      requiredLevel: 60,
      materials: [
        { name: "탈로시안 화폐", count: 25000 },
        { name: "중형 모형 틀", count: 20 },
        { name: "진한 흑암석", count: 5 },
      ],
      bonuses: [
        "민첩 증가 · 대: 3/8",
        "궁극기 충전 효율 증가 · 대: 2/7",
        "효율 · 불빛 연소: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: 90000 },
        { name: "중형 모형 틀", count: 30 },
        { name: "3상 나노 플레이크 칩", count: 16 },
        { name: "화염석", count: 8 },
      ],
      bonuses: [
        "민첩 증가 · 대: 3/9",
        "궁극기 충전 효율 증가 · 대: 3/9",
        "효율 · 불빛 연소: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "agility-large",
      name: "민첩 증가 · 대",
      typeLabel: "능력치",
      meta: [{ label: "능력치", value: "민첩" }],
      levelValues: agilityValues.map((value, index) => ({
        rank: String(index + 1),
        description: `민첩 +${value}`,
        stats: [{ label: "민첩", value: `+${value}` }],
      })),
      compareRows: [
        {
          label: "민첩",
          values: agilityValues.map((value) => `+${value}`),
        },
      ],
    },
    {
      key: "ultimate-efficiency-large",
      name: "궁극기 충전 효율 증가 · 대",
      typeLabel: "속성",
      meta: [{ label: "속성", value: "궁극기 충전 효율" }],
      levelValues: ultimateEfficiencyValues.map((value, index) => ({
        rank: String(index + 1),
        description: `궁극기 충전 효율 ${percent(value)}`,
        stats: [{ label: "궁극기 충전 효율", value: percent(value) }],
      })),
      compareRows: [
        {
          label: "궁극기 충전 효율",
          values: ultimateEfficiencyValues.map(percent),
        },
      ],
    },
    {
      key: "efficiency-burning-light",
      name: "효율 · 불빛 연소",
      typeLabel: "시리즈 스킬",
      meta: [
        { label: "시리즈 스킬", value: "효율" },
        { label: "속성", value: "열기 피해" },
      ],
      levelValues: heatDamageValues.map((heatDamage, index) => {
        const selfDamage = selfDamageValues[index];
        const teamDamage = teamDamageValues[index];

        return {
          rank: String(index + 1),
          description:
            `열기 피해 ${percent(heatDamage)}\n` +
            `장착자가 자신의 스킬로 열기 부착을 부여할 때, 자신의 물리 및 열기 피해 ${percent(selfDamage)}, 20초 동안 지속. ` +
            `장착자가 자신의 스킬로 열기 취약을 부여할 때, 팀 전체의 물리 및 열기 피해 ${percent(teamDamage)}, 30초 동안 지속.\n` +
            "두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "열기 피해", value: percent(heatDamage) },
            { label: "자신의 물리 및 열기 피해", value: percent(selfDamage) },
            { label: "팀 전체의 물리 및 열기 피해", value: percent(teamDamage) },
          ],
        };
      }),
      compareRows: [
        {
          label: "열기 피해",
          values: heatDamageValues.map(percent),
        },
        {
          label: "자신의 물리 및 열기 피해",
          values: selfDamageValues.map(percent),
        },
        {
          label: "팀 전체의 물리 및 열기 피해",
          values: teamDamageValues.map(percent),
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;
