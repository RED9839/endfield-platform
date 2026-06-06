import type { SourceWeaponDetail } from "../weapons-detail-data";

const attackValues = [
  52, 57, 62, 67, 72, 77, 82, 88, 93, 98, 103, 108, 113, 118, 124,
  129, 134, 139, 144, 149, 155, 160, 165, 170, 175, 180, 185, 191, 196,
  201, 206, 211, 216, 221, 227, 232, 237, 242, 247, 252, 258, 263, 268,
  273, 278, 283, 288, 294, 299, 304, 309, 314, 319, 324, 330, 335, 340,
  345, 350, 355, 361, 366, 371, 376, 381, 386, 391, 397, 402, 407, 412,
  417, 422, 427, 433, 438, 443, 448, 453, 458, 464, 469, 474, 479, 484,
  489, 494, 500, 505, 510,
];

const strengthValues = [20, 36, 52, 68, 84, 100, 116, 132, 156];
const attackBonusValues = [5, 9, 13, 17, 21, 25, 29, 33, 39];
const physicalDamageValues = [16, 19.2, 22.4, 25.6, 28.8, 32, 35.2, 38.4, 44.8];
const artsIntensityValues = [30, 36, 42, 48, 54, 60, 66, 72, 84];
const baseCrushValues = [9, 10.8, 12.6, 14.4, 16.2, 18, 19.8, 21.6, 25.2];
const stackCrushValues = [3, 3.6, 4.2, 4.8, 5.4, 6, 6.6, 7.2, 8.4];

function percent(value: number) {
  return `+${value.toFixed(1)}%`;
}

export const amaranthinetassel = {
  slug: "amaranthinetassel",
  name: "적영",
  enName: "Amaranthine Tassel",
  rarity: 6,
  weaponType: "greatsword",
  image: "/weapons/amaranthinetassel.webp",
  series: "기예",
  mainStatLabel: "힘",
  subStatLabel: "공격력",
  summary:
    "엔드필드 오퍼레이터용 무기, 장착 시 오퍼레이터의 작전 능력이 크게 증가합니다.",
  description:
    "홍산 선검국이 십여 년간 공들여 설계하고 제작한 대검, 만듦새가 정교하며, 휘두를 때 뿜어내는 기세가 맹렬합니다. 육중한 중무기의 표본과도 같은 걸작입니다.",

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
        "힘 증가 · 대: 1/3",
        "공격력 증가 · 대: 1/3",
        "기예 · 붉은색의 단절: 1/4",
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
        "힘 증가 · 대: 2/5",
        "공격력 증가 · 대: 1/4",
        "기예 · 붉은색의 단절: 1/4",
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
        "힘 증가 · 대: 2/6",
        "공격력 증가 · 대: 2/6",
        "기예 · 붉은색의 단절: 1/4",
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
        "힘 증가 · 대: 3/8",
        "공격력 증가 · 대: 2/7",
        "기예 · 붉은색의 단절: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: 90000 },
        { name: "중형 모형 틀", count: 30 },
        { name: "정합용 유체", count: 16 },
        { name: "화염석", count: 8 },
      ],
      bonuses: [
        "힘 증가 · 대: 3/9",
        "공격력 증가 · 대: 3/9",
        "기예 · 붉은색의 단절: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "ability",
      name: "힘 증가 · 대",
      typeLabel: "능력치",
      meta: [{ label: "능력치", value: "힘" }],
      levelValues: strengthValues.map((value, index) => ({
        rank: String(index + 1),
        description: `힘 +${value}`,
        stats: [{ label: "힘", value: `+${value}` }],
      })),
      compareRows: [
        {
          label: "힘",
          values: strengthValues.map((value) => `+${value}`),
        },
      ],
    },
    {
      key: "attribute",
      name: "공격력 증가 · 대",
      typeLabel: "속성",
      meta: [{ label: "속성", value: "공격력" }],
      levelValues: attackBonusValues.map((value, index) => ({
        rank: String(index + 1),
        description: `공격력 ${percent(value)}`,
        stats: [{ label: "공격력", value: percent(value) }],
      })),
      compareRows: [
        {
          label: "공격력",
          values: attackBonusValues.map(percent),
        },
      ],
    },
    {
      key: "technique-amaranthine-cleave",
      name: "기예 · 붉은색의 단절",
      typeLabel: "시리즈 스킬",
      meta: [
        { label: "시리즈 스킬", value: "기예" },
        { label: "속성", value: "물리 피해" },
      ],
      levelValues: physicalDamageValues.map((physicalDamage, index) => {
        const artsIntensity = artsIntensityValues[index];
        const baseCrush = baseCrushValues[index];
        const stackCrush = stackCrushValues[index];

        return {
          rank: String(index + 1),
          description:
            `물리 피해 ${percent(physicalDamage)}\n` +
            `장착자가 물리 취약을 부여할 때, 오리지늄 아츠 강도 +${artsIntensity}, 20초 동안 지속. ` +
            `장착자가 강타 피해를 줄 때, 소모한 최대 방어 불능 스택 수치에 따라, ` +
            `자신의 물리 피해 +[${baseCrush.toFixed(1)}%+${stackCrush.toFixed(1)}%×소모한 스택 수치], 30초 동안 지속.\n` +
            "두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "물리 피해", value: percent(physicalDamage) },
            { label: "오리지늄 아츠 강도", value: `+${artsIntensity}` },
            {
              label: "강타 후 물리 피해",
              value: `+[${baseCrush.toFixed(1)}%+${stackCrush.toFixed(1)}%×스택]`,
            },
          ],
        };
      }),
      compareRows: [
        {
          label: "물리 피해",
          values: physicalDamageValues.map(percent),
        },
        {
          label: "오리지늄 아츠 강도",
          values: artsIntensityValues.map((value) => `+${value}`),
        },
        {
          label: "강타 후 기본 물리 피해",
          values: baseCrushValues.map(percent),
        },
        {
          label: "소모 스택당 물리 피해",
          values: stackCrushValues.map(percent),
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;
