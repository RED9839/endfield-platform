import type { SourceWeaponDetail } from "../weapons-detail-data";

export const seekerofdarklung = {
  slug: "seekerofdarklung",
  name: "검은 추적자",
  enName: "Seeker of Dark Lung",
  rarity: 5,
  weaponType: "greatsword",
  image: "/weapons/seekerofdarklung.webp",
  series: "방출",
  mainStatLabel: "공격력",
  subStatLabel: "힘",

  levelStats: [
    { level: 1, attack: 42 },
    { level: 2, attack: 46 },
    { level: 3, attack: 50 },
    { level: 4, attack: 54 },
    { level: 5, attack: 58 },
    { level: 6, attack: 62 },
    { level: 7, attack: 66 },
    { level: 8, attack: 71 },
    { level: 9, attack: 75 },
    { level: 10, attack: 79 },
    { level: 11, attack: 83 },
    { level: 12, attack: 87 },
    { level: 13, attack: 91 },
    { level: 14, attack: 95 },
    { level: 15, attack: 100 },
    { level: 16, attack: 104 },
    { level: 17, attack: 108 },
    { level: 18, attack: 112 },
    { level: 19, attack: 116 },
    { level: 20, attack: 120 },
    { level: 21, attack: 125 },
    { level: 22, attack: 129 },
    { level: 23, attack: 133 },
    { level: 24, attack: 137 },
    { level: 25, attack: 141 },
    { level: 26, attack: 145 },
    { level: 27, attack: 149 },
    { level: 28, attack: 154 },
    { level: 29, attack: 158 },
    { level: 30, attack: 162 },
    { level: 31, attack: 166 },
    { level: 32, attack: 170 },
    { level: 33, attack: 174 },
    { level: 34, attack: 178 },
    { level: 35, attack: 183 },
    { level: 36, attack: 187 },
    { level: 37, attack: 191 },
    { level: 38, attack: 195 },
    { level: 39, attack: 199 },
    { level: 40, attack: 203 },
    { level: 41, attack: 208 },
    { level: 42, attack: 212 },
    { level: 43, attack: 216 },
    { level: 44, attack: 220 },
    { level: 45, attack: 224 },
    { level: 46, attack: 228 },
    { level: 47, attack: 232 },
    { level: 48, attack: 237 },
    { level: 49, attack: 241 },
    { level: 50, attack: 245 },
    { level: 51, attack: 249 },
    { level: 52, attack: 253 },
    { level: 53, attack: 257 },
    { level: 54, attack: 261 },
    { level: 55, attack: 266 },
    { level: 56, attack: 270 },
    { level: 57, attack: 274 },
    { level: 58, attack: 278 },
    { level: 59, attack: 282 },
    { level: 60, attack: 286 },
    { level: 61, attack: 291 },
    { level: 62, attack: 295 },
    { level: 63, attack: 299 },
    { level: 64, attack: 303 },
    { level: 65, attack: 307 },
    { level: 66, attack: 311 },
    { level: 67, attack: 315 },
    { level: 68, attack: 320 },
    { level: 69, attack: 324 },
    { level: 70, attack: 328 },
    { level: 71, attack: 332 },
    { level: 72, attack: 336 },
    { level: 73, attack: 340 },
    { level: 74, attack: 344 },
    { level: 75, attack: 349 },
    { level: 76, attack: 353 },
    { level: 77, attack: 357 },
    { level: 78, attack: 361 },
    { level: 79, attack: 365 },
    { level: 80, attack: 369 },
    { level: 81, attack: 374 },
    { level: 82, attack: 378 },
    { level: 83, attack: 382 },
    { level: 84, attack: 386 },
    { level: 85, attack: 390 },
    { level: 86, attack: 394 },
    { level: 87, attack: 398 },
    { level: 88, attack: 403 },
    { level: 89, attack: 407 },
    { level: 90, attack: 411 },
  ],

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "힘 증가 · 중: 1/3",
        "궁극기 충전 효율 증가 · 중: 1/3",
        "방출 · 꿰뚫는 이치: 1/4",
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
        "힘 증가 · 중: 2/5",
        "궁극기 충전 효율 증가 · 중: 1/4",
        "방출 · 꿰뚫는 이치: 1/4",
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
        "힘 증가 · 중: 2/6",
        "궁극기 충전 효율 증가 · 중: 2/6",
        "방출 · 꿰뚫는 이치: 1/4",
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
        "힘 증가 · 중: 3/8",
        "궁극기 충전 효율 증가 · 중: 2/7",
        "방출 · 꿰뚫는 이치: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "D96강 시제품 4번", count: 16 },
        { name: "화염석", count: 8 },
      ],
      bonuses: [
        "힘 증가 · 중: 3/9",
        "궁극기 충전 효율 증가 · 중: 3/9",
        "방출 · 꿰뚫는 이치: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "strength-medium",
      typeLabel: "무기 스킬",
      name: "힘 증가 · 중",
      icon: "/icons/weapons/skills/strength-medium.webp",
      meta: [{ label: "능력치", value: "힘" }],
      levelValues: [
        { rank: "1", description: "힘 +16", stats: [{ label: "힘", value: "+16" }] },
        { rank: "2", description: "힘 +28", stats: [{ label: "힘", value: "+28" }] },
        { rank: "3", description: "힘 +41", stats: [{ label: "힘", value: "+41" }] },
        { rank: "4", description: "힘 +54", stats: [{ label: "힘", value: "+54" }] },
        { rank: "5", description: "힘 +67", stats: [{ label: "힘", value: "+67" }] },
        { rank: "6", description: "힘 +80", stats: [{ label: "힘", value: "+80" }] },
        { rank: "7", description: "힘 +92", stats: [{ label: "힘", value: "+92" }] },
        { rank: "8", description: "힘 +105", stats: [{ label: "힘", value: "+105" }] },
        { rank: "9", description: "힘 +124", stats: [{ label: "힘", value: "+124" }] },
      ],
      compareRows: [
        {
          label: "힘",
          values: ["+16", "+28", "+41", "+54", "+67", "+80", "+92", "+105", "+124"],
        },
      ],
    },
    {
      key: "ultimate-gain-medium",
      typeLabel: "무기 스킬",
      name: "궁극기 충전 효율 증가 · 중",
      icon: "/icons/weapons/skills/ultimate-gain-medium.webp",
      meta: [{ label: "속성", value: "궁극기 충전 효율" }],
      levelValues: [
        {
          rank: "1",
          description: "궁극기 충전 효율 +4.8%",
          stats: [{ label: "궁극기 충전 효율", value: "+4.8%" }],
        },
        {
          rank: "2",
          description: "궁극기 충전 효율 +8.6%",
          stats: [{ label: "궁극기 충전 효율", value: "+8.6%" }],
        },
        {
          rank: "3",
          description: "궁극기 충전 효율 +12.4%",
          stats: [{ label: "궁극기 충전 효율", value: "+12.4%" }],
        },
        {
          rank: "4",
          description: "궁극기 충전 효율 +16.2%",
          stats: [{ label: "궁극기 충전 효율", value: "+16.2%" }],
        },
        {
          rank: "5",
          description: "궁극기 충전 효율 +20.0%",
          stats: [{ label: "궁극기 충전 효율", value: "+20.0%" }],
        },
        {
          rank: "6",
          description: "궁극기 충전 효율 +23.8%",
          stats: [{ label: "궁극기 충전 효율", value: "+23.8%" }],
        },
        {
          rank: "7",
          description: "궁극기 충전 효율 +27.6%",
          stats: [{ label: "궁극기 충전 효율", value: "+27.6%" }],
        },
        {
          rank: "8",
          description: "궁극기 충전 효율 +31.4%",
          stats: [{ label: "궁극기 충전 효율", value: "+31.4%" }],
        },
        {
          rank: "9",
          description: "궁극기 충전 효율 +37.1%",
          stats: [{ label: "궁극기 충전 효율", value: "+37.1%" }],
        },
      ],
      compareRows: [
        {
          label: "궁극기 충전 효율",
          values: ["+4.8%", "+8.6%", "+12.4%", "+16.2%", "+20.0%", "+23.8%", "+27.6%", "+31.4%", "+37.1%"],
        },
      ],
    },
    {
      key: "release-penetrating-truth",
      typeLabel: "무기 스킬",
      name: "방출 · 꿰뚫는 이치",
      icon: "/icons/weapons/skills/release.webp",
      meta: [{ label: "시리즈 스킬", value: "방출" }],
      levelValues: [
        {
          rank: "1",
          description:
            "주요 능력치 +5.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +6.0%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+5.0%" },
            { label: "공격력", value: "+6.0%" },
          ],
        },
        {
          rank: "2",
          description:
            "주요 능력치 +6.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +7.2%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+6.0%" },
            { label: "공격력", value: "+7.2%" },
          ],
        },
        {
          rank: "3",
          description:
            "주요 능력치 +7.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +8.4%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+7.0%" },
            { label: "공격력", value: "+8.4%" },
          ],
        },
        {
          rank: "4",
          description:
            "주요 능력치 +8.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +9.6%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+8.0%" },
            { label: "공격력", value: "+9.6%" },
          ],
        },
        {
          rank: "5",
          description:
            "주요 능력치 +9.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +10.8%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+9.0%" },
            { label: "공격력", value: "+10.8%" },
          ],
        },
        {
          rank: "6",
          description:
            "주요 능력치 +10.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +12.0%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+10.0%" },
            { label: "공격력", value: "+12.0%" },
          ],
        },
        {
          rank: "7",
          description:
            "주요 능력치 +11.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +13.2%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+11.0%" },
            { label: "공격력", value: "+13.2%" },
          ],
        },
        {
          rank: "8",
          description:
            "주요 능력치 +12.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +14.4%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+12.0%" },
            { label: "공격력", value: "+14.4%" },
          ],
        },
        {
          rank: "9",
          description:
            "주요 능력치 +14.0%\n장착자가 적에게 아츠 폭발 피해를 줄 때, 공격력 +16.8%, 30초 동안 지속.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "주요 능력치", value: "+14.0%" },
            { label: "공격력", value: "+16.8%" },
          ],
        },
      ],
      compareRows: [
        {
          label: "주요 능력치",
          values: ["+5.0%", "+6.0%", "+7.0%", "+8.0%", "+9.0%", "+10.0%", "+11.0%", "+12.0%", "+14.0%"],
        },
        {
          label: "공격력",
          values: ["+6.0%", "+7.2%", "+8.4%", "+9.6%", "+10.8%", "+12.0%", "+13.2%", "+14.4%", "+16.8%"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;