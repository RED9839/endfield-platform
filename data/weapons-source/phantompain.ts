import type { SourceWeaponDetail } from "../weapons-detail-data";

const attackValues = [
  50, 54, 59, 64, 69, 74, 79, 84, 89, 94, 99, 104, 109, 114, 119,
  124, 129, 134, 139, 144, 149, 153, 158, 163, 168, 173, 178, 183, 188,
  193, 198, 203, 208, 213, 218, 223, 228, 233, 238, 243, 248, 252, 257,
  262, 267, 272, 277, 282, 287, 292, 297, 302, 307, 312, 317, 322, 327,
  332, 337, 342, 347, 351, 356, 361, 366, 371, 376, 381, 386, 391, 396,
  401, 406, 411, 416, 421, 426, 431, 436, 441, 446, 450, 455, 460, 465,
  470, 475, 480, 485, 490,
];

const strengthValues = [20, 36, 52, 68, 84, 100, 116, 132, 156];
const artsIntensityValues = [10, 18, 26, 34, 42, 50, 58, 66, 78];
const physicalDamageValues = [7, 8.4, 9.8, 11.2, 12.6, 14, 15.4, 16.8, 19.6];
const stackedDamageValues = [5.5, 6.6, 7.7, 8.8, 9.9, 11, 12.1, 13.2, 15.4];

function percent(value: number) {
  return `+${value.toFixed(1)}%`;
}

export const phantompain = {
  slug: "phantompain",
  name: "환상통",
  enName: "Phantom Pain",
  rarity: 6,
  weaponType: "greatsword",
  image: "/weapons/phantompain.webp",
  series: "억제",
  mainStatLabel: "힘",
  subStatLabel: "오리지늄 아츠 강도",
  summary:
    "엔드필드 오퍼레이터용 무기, 장착 시 오퍼레이터의 작전 능력이 크게 증가합니다.",
  description:
    "경량 초자연 기술 실험실의 실험형 제품, 검신에 첨단 소재를 사용해 무게가 매우 가볍습니다. 물론, 그 파괴력까지 줄어든 것은 아닙니다.",

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
        "오리지늄 아츠 강도 증가 · 대: 1/3",
        "억제 · 고통 누적: 1/4",
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
        "오리지늄 아츠 강도 증가 · 대: 1/4",
        "억제 · 고통 누적: 1/4",
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
        "오리지늄 아츠 강도 증가 · 대: 2/6",
        "억제 · 고통 누적: 1/4",
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
        "오리지늄 아츠 강도 증가 · 대: 2/7",
        "억제 · 고통 누적: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: 90000 },
        { name: "중형 모형 틀", count: 30 },
        { name: "타키온 차폐 구조체", count: 16 },
        { name: "화염석", count: 8 },
      ],
      bonuses: [
        "힘 증가 · 대: 3/9",
        "오리지늄 아츠 강도 증가 · 대: 3/9",
        "억제 · 고통 누적: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "strength-large",
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
      key: "arts-intensity-large",
      name: "오리지늄 아츠 강도 증가 · 대",
      typeLabel: "속성",
      meta: [{ label: "속성", value: "오리지늄 아츠 강도" }],
      levelValues: artsIntensityValues.map((value, index) => ({
        rank: String(index + 1),
        description: `오리지늄 아츠 강도 +${value}`,
        stats: [{ label: "오리지늄 아츠 강도", value: `+${value}` }],
      })),
      compareRows: [
        {
          label: "오리지늄 아츠 강도",
          values: artsIntensityValues.map((value) => `+${value}`),
        },
      ],
    },
    {
      key: "suppression-layered-pain",
      name: "억제 · 고통 누적",
      typeLabel: "시리즈 스킬",
      meta: [
        { label: "시리즈 스킬", value: "억제" },
        { label: "속성", value: "물리 피해" },
      ],
      levelValues: physicalDamageValues.map((physicalDamage, index) => {
        const stackedDamage = stackedDamageValues[index];

        return {
          rank: String(index + 1),
          description:
            `물리 피해 ${percent(physicalDamage)}\n` +
            `장착자가 배틀 스킬 또는 연계 스킬을 사용할 때, 물리 피해 ${percent(stackedDamage)}, 20초 동안 지속됩니다.\n` +
            "같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "물리 피해", value: percent(physicalDamage) },
            { label: "스킬 사용 시 물리 피해", value: percent(stackedDamage) },
            { label: "최대 중첩", value: "3스택" },
          ],
        };
      }),
      compareRows: [
        {
          label: "물리 피해",
          values: physicalDamageValues.map(percent),
        },
        {
          label: "스킬 사용 시 물리 피해",
          values: stackedDamageValues.map(percent),
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;
