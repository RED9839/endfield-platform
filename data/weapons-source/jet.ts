import type { SourceWeaponDetail } from "../weapons-detail-data";

export const jet = {
  slug: "jet",
  name: "J.E.T.",
  enName: "JET",
  rarity: 6,
  weaponType: "polearm",
  image: "/weapons/jet.webp",
  series: "억제",
  mainStatLabel: "공격력",
  subStatLabel: "주요 능력치",

  levelStats: [
    { level: 1, attack: 51 },
    { level: 2, attack: 56 },
    { level: 3, attack: 61 },
    { level: 4, attack: 66 },
    { level: 5, attack: 71 },
    { level: 6, attack: 76 },
    { level: 7, attack: 81 },
    { level: 8, attack: 86 },
    { level: 9, attack: 91 },
    { level: 10, attack: 96 },
    { level: 11, attack: 101 },
    { level: 12, attack: 106 },
    { level: 13, attack: 111 },
    { level: 14, attack: 116 },
    { level: 15, attack: 121 },
    { level: 16, attack: 126 },
    { level: 17, attack: 131 },
    { level: 18, attack: 136 },
    { level: 19, attack: 141 },
    { level: 20, attack: 146 },
    { level: 21, attack: 152 },
    { level: 22, attack: 157 },
    { level: 23, attack: 162 },
    { level: 24, attack: 167 },
    { level: 25, attack: 172 },
    { level: 26, attack: 177 },
    { level: 27, attack: 182 },
    { level: 28, attack: 187 },
    { level: 29, attack: 192 },
    { level: 30, attack: 197 },
    { level: 31, attack: 202 },
    { level: 32, attack: 207 },
    { level: 33, attack: 212 },
    { level: 34, attack: 217 },
    { level: 35, attack: 222 },
    { level: 36, attack: 227 },
    { level: 37, attack: 232 },
    { level: 38, attack: 237 },
    { level: 39, attack: 242 },
    { level: 40, attack: 247 },
    { level: 41, attack: 253 },
    { level: 42, attack: 258 },
    { level: 43, attack: 263 },
    { level: 44, attack: 268 },
    { level: 45, attack: 273 },
    { level: 46, attack: 278 },
    { level: 47, attack: 283 },
    { level: 48, attack: 288 },
    { level: 49, attack: 293 },
    { level: 50, attack: 298 },
    { level: 51, attack: 303 },
    { level: 52, attack: 308 },
    { level: 53, attack: 313 },
    { level: 54, attack: 318 },
    { level: 55, attack: 323 },
    { level: 56, attack: 328 },
    { level: 57, attack: 333 },
    { level: 58, attack: 338 },
    { level: 59, attack: 343 },
    { level: 60, attack: 348 },
    { level: 61, attack: 354 },
    { level: 62, attack: 359 },
    { level: 63, attack: 364 },
    { level: 64, attack: 369 },
    { level: 65, attack: 374 },
    { level: 66, attack: 379 },
    { level: 67, attack: 384 },
    { level: 68, attack: 389 },
    { level: 69, attack: 394 },
    { level: 70, attack: 399 },
    { level: 71, attack: 404 },
    { level: 72, attack: 409 },
    { level: 73, attack: 414 },
    { level: 74, attack: 419 },
    { level: 75, attack: 424 },
    { level: 76, attack: 429 },
    { level: 77, attack: 434 },
    { level: 78, attack: 439 },
    { level: 79, attack: 444 },
    { level: 80, attack: 449 },
    { level: 81, attack: 455 },
    { level: 82, attack: 460 },
    { level: 83, attack: 465 },
    { level: 84, attack: 470 },
    { level: 85, attack: 475 },
    { level: 86, attack: 480 },
    { level: 87, attack: 485 },
    { level: 88, attack: 490 },
    { level: 89, attack: 495 },
    { level: 90, attack: 500 },
  ],

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "주요 능력치 증가 · 대: 1/3",
        "공격력 증가 · 대: 1/3",
        "억제 · 천체 물리학: 1/4",
      ],
    },
    {
      stage: 1,
      requiredLevel: 20,
      materials: [
        { name: "탈로시안 화폐", count: "2.2k" },
        { name: "모형 틀", count: 5 },
        { name: "연한 흑암석", count: 3 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 2/5",
        "공격력 증가 · 대: 1/4",
        "억제 · 천체 물리학: 1/4",
      ],
    },
    {
      stage: 2,
      requiredLevel: 40,
      materials: [
        { name: "탈로시안 화폐", count: "8.5k" },
        { name: "모형 틀", count: 18 },
        { name: "일반 흑암석", count: 5 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 2/6",
        "공격력 증가 · 대: 2/6",
        "억제 · 천체 물리학: 1/4",
      ],
    },
    {
      stage: 3,
      requiredLevel: 60,
      materials: [
        { name: "탈로시안 화폐", count: "25k" },
        { name: "중형 모형 틀", count: 20 },
        { name: "진한 흑암석", count: 5 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 3/8",
        "공격력 증가 · 대: 2/7",
        "억제 · 천체 물리학: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "정합용 유체", count: 16 },
        { name: "무릉석", count: 8 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 3/9",
        "공격력 증가 · 대: 3/9",
        "억제 · 천체 물리학: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "main-attribute-large",
      typeLabel: "무기 스킬",
      name: "주요 능력치 증가 · 대",
      icon: "/icons/weapons/skills/main-attribute-large.webp",
      meta: [{ label: "능력치", value: "주요 능력치" }],
      levelValues: [
        {
          rank: "1",
          description: "주요 능력치 +17",
          stats: [{ label: "주요 능력치", value: "+17" }],
        },
        {
          rank: "2",
          description: "주요 능력치 +30",
          stats: [{ label: "주요 능력치", value: "+30" }],
        },
        {
          rank: "3",
          description: "주요 능력치 +44",
          stats: [{ label: "주요 능력치", value: "+44" }],
        },
        {
          rank: "4",
          description: "주요 능력치 +57",
          stats: [{ label: "주요 능력치", value: "+57" }],
        },
        {
          rank: "5",
          description: "주요 능력치 +71",
          stats: [{ label: "주요 능력치", value: "+71" }],
        },
        {
          rank: "6",
          description: "주요 능력치 +85",
          stats: [{ label: "주요 능력치", value: "+85" }],
        },
        {
          rank: "7",
          description: "주요 능력치 +98",
          stats: [{ label: "주요 능력치", value: "+98" }],
        },
        {
          rank: "8",
          description: "주요 능력치 +112",
          stats: [{ label: "주요 능력치", value: "+112" }],
        },
        {
          rank: "9",
          description: "주요 능력치 +132",
          stats: [{ label: "주요 능력치", value: "+132" }],
        },
      ],
      compareRows: [
        {
          label: "주요 능력치",
          values: ["+17", "+30", "+44", "+57", "+71", "+85", "+98", "+112", "+132"],
        },
      ],
    },
    {
      key: "attack-large",
      typeLabel: "무기 스킬",
      name: "공격력 증가 · 대",
      icon: "/icons/weapons/skills/attack-large.webp",
      meta: [{ label: "속성", value: "공격력" }],
      levelValues: [
        {
          rank: "1",
          description: "공격력 +5.0%",
          stats: [{ label: "공격력", value: "+5.0%" }],
        },
        {
          rank: "2",
          description: "공격력 +9.0%",
          stats: [{ label: "공격력", value: "+9.0%" }],
        },
        {
          rank: "3",
          description: "공격력 +13.0%",
          stats: [{ label: "공격력", value: "+13.0%" }],
        },
        {
          rank: "4",
          description: "공격력 +17.0%",
          stats: [{ label: "공격력", value: "+17.0%" }],
        },
        {
          rank: "5",
          description: "공격력 +21.0%",
          stats: [{ label: "공격력", value: "+21.0%" }],
        },
        {
          rank: "6",
          description: "공격력 +25.0%",
          stats: [{ label: "공격력", value: "+25.0%" }],
        },
        {
          rank: "7",
          description: "공격력 +29.0%",
          stats: [{ label: "공격력", value: "+29.0%" }],
        },
        {
          rank: "8",
          description: "공격력 +33.0%",
          stats: [{ label: "공격력", value: "+33.0%" }],
        },
        {
          rank: "9",
          description: "공격력 +39.0%",
          stats: [{ label: "공격력", value: "+39.0%" }],
        },
      ],
      compareRows: [
        {
          label: "공격력",
          values: ["+5.0%", "+9.0%", "+13.0%", "+17.0%", "+21.0%", "+25.0%", "+29.0%", "+33.0%", "+39.0%"],
        },
      ],
    },
    {
      key: "suppression-astrophysics",
      typeLabel: "무기 스킬",
      name: "억제 · 천체 물리학",
      icon: "/icons/weapons/skills/suppression.webp",
      meta: [{ label: "시리즈 스킬", value: "억제" }],
      levelValues: [
        {
          rank: "1",
          description:
            "아츠 피해 +12.0%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +12.0%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +12.0%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+12.0%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+12.0%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+12.0%" },
          ],
        },
        {
          rank: "2",
          description:
            "아츠 피해 +14.4%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +14.4%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +14.4%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+14.4%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+14.4%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+14.4%" },
          ],
        },
        {
          rank: "3",
          description:
            "아츠 피해 +16.8%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +16.8%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +16.8%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+16.8%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+16.8%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+16.8%" },
          ],
        },
        {
          rank: "4",
          description:
            "아츠 피해 +19.2%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +19.2%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +19.2%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+19.2%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+19.2%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+19.2%" },
          ],
        },
        {
          rank: "5",
          description:
            "아츠 피해 +21.6%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +21.6%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +21.6%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+21.6%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+21.6%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+21.6%" },
          ],
        },
        {
          rank: "6",
          description:
            "아츠 피해 +24.0%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +24.0%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +24.0%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+24.0%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+24.0%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+24.0%" },
          ],
        },
        {
          rank: "7",
          description:
            "아츠 피해 +26.4%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +26.4%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +26.4%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+26.4%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+26.4%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+26.4%" },
          ],
        },
        {
          rank: "8",
          description:
            "아츠 피해 +28.8%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +28.8%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +28.8%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+28.8%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+28.8%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+28.8%" },
          ],
        },
        {
          rank: "9",
          description:
            "아츠 피해 +33.6%\n장착자가 배틀 스킬을 사용할 때, 아츠 피해 +33.6%, 15초 동안 지속. 장착자가 연계 스킬을 사용할 때, 아츠 피해 +33.6%, 15초 동안 지속.\n두 가지 효과는 독립적으로 적용되며 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+33.6%" },
            { label: "배틀 스킬 사용 시 아츠 피해", value: "+33.6%" },
            { label: "연계 스킬 사용 시 아츠 피해", value: "+33.6%" },
          ],
        },
      ],
      compareRows: [
        {
          label: "아츠 피해",
          values: ["+12.0%", "+14.4%", "+16.8%", "+19.2%", "+21.6%", "+24.0%", "+26.4%", "+28.8%", "+33.6%"],
        },
        {
          label: "배틀 스킬 사용 시 아츠 피해",
          values: ["+12.0%", "+14.4%", "+16.8%", "+19.2%", "+21.6%", "+24.0%", "+26.4%", "+28.8%", "+33.6%"],
        },
        {
          label: "연계 스킬 사용 시 아츠 피해",
          values: ["+12.0%", "+14.4%", "+16.8%", "+19.2%", "+21.6%", "+24.0%", "+26.4%", "+28.8%", "+33.6%"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;