import type { SourceWeaponDetail } from "../weapons-detail-data";

const attackValues = [
  51, 56, 61, 66, 71, 76, 81, 86, 91, 96, 101, 106, 111, 116, 121,
  126, 131, 136, 141, 146, 152, 157, 162, 167, 172, 177, 182, 187, 192, 197,
  202, 207, 212, 217, 222, 227, 232, 237, 242, 247, 253, 258, 263, 268, 273,
  278, 283, 288, 293, 298, 303, 308, 313, 318, 323, 328, 333, 338, 343, 348,
  354, 359, 364, 369, 374, 379, 384, 389, 394, 399, 404, 409, 414, 419, 424,
  429, 434, 439, 444, 449, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500,
];

const agilityValues = [20, 36, 52, 68, 84, 100, 116, 132, 156];
const heatDamageValues = [5.6, 10.0, 14.4, 18.9, 23.3, 27.8, 32.2, 36.7, 43.3];
const ultimateEfficiencyValues = [18.0, 21.6, 25.2, 28.8, 32.4, 36.0, 39.6, 43.2, 50.4];
const teamBuffValues = [6.0, 7.2, 8.4, 9.6, 10.8, 12.0, 13.2, 14.4, 16.8];

function percent(value: number) {
  return `+${value.toFixed(1)}%`;
}

export const blessingoflustrouscarmine = {
  slug: "blessingoflustrouscarmine",
  name: "붉게 물든 가호",
  enName: "Blessing of Lustrous Carmine",
  rarity: 6,
  weaponType: "polearm",
  image: "/weapons/blessingoflustrouscarmine.webp",
  series: "흐름",
  mainStatLabel: "민첩",
  subStatLabel: "열기 피해",
  summary:
    "엔드필드 오퍼레이터용 무기, 장착 시 오퍼레이터의 작전 능력이 크게 증가합니다.",
  description:
    "주술 타임에서 발행한 장창 중 하나, 세쉬카 오픈 데이에 출시된 특별 기념 모델로, 창대에 특수 코팅 공법을 적용하여 실용성과 미학적 가치를 모두 갖추었습니다.",

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
        "열기 피해 증가 · 대: 1/3",
        "흐름 · 심판: 1/4",
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
        "열기 피해 증가 · 대: 1/4",
        "흐름 · 심판: 1/4",
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
        "열기 피해 증가 · 대: 2/6",
        "흐름 · 심판: 1/4",
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
        "열기 피해 증가 · 대: 2/7",
        "흐름 · 심판: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: 90000 },
        { name: "중형 모형 틀", count: 30 },
        { name: "D96강 시제품 4번", count: 16 },
        { name: "무릉석", count: 8 },
      ],
      bonuses: [
        "민첩 증가 · 대: 3/9",
        "열기 피해 증가 · 대: 3/9",
        "흐름 · 심판: 1/4",
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
      key: "heat-damage-large",
      name: "열기 피해 증가 · 대",
      typeLabel: "속성",
      meta: [{ label: "속성", value: "열기 피해" }],
      levelValues: heatDamageValues.map((value, index) => ({
        rank: String(index + 1),
        description: `열기 피해 ${percent(value)}`,
        stats: [{ label: "열기 피해", value: percent(value) }],
      })),
      compareRows: [
        {
          label: "열기 피해",
          values: heatDamageValues.map(percent),
        },
      ],
    },
    {
      key: "flow-judgment",
      name: "흐름 · 심판",
      typeLabel: "시리즈 스킬",
      meta: [
        { label: "시리즈 스킬", value: "흐름" },
        { label: "속성", value: "궁극기 충전 효율" },
      ],
      levelValues: ultimateEfficiencyValues.map((efficiency, index) => {
        const buff = teamBuffValues[index];

        return {
          rank: String(index + 1),
          description:
            `궁극기 충전 효율 ${percent(efficiency)}\n` +
            `장착자가 자신의 스킬로 스킬 게이지를 회복한 후, 팀 전체의 공격력 ${percent(buff)}, 20초 동안 지속. ` +
            `장착자가 자신의 스킬로 열기 부착을 부여할 때, 팀 전체가 주는 열기 피해 ${percent(buff)}, 20초 동안 지속.\n` +
            "두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "궁극기 충전 효율", value: percent(efficiency) },
            { label: "팀 전체 공격력", value: percent(buff) },
            { label: "팀 전체 열기 피해", value: percent(buff) },
          ],
        };
      }),
      compareRows: [
        {
          label: "궁극기 충전 효율",
          values: ultimateEfficiencyValues.map(percent),
        },
        {
          label: "팀 전체 공격력",
          values: teamBuffValues.map(percent),
        },
        {
          label: "팀 전체 열기 피해",
          values: teamBuffValues.map(percent),
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;
