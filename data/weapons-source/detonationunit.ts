import type { SourceWeaponDetail } from "../weapons-detail-data";

export const detonationunit = {
  slug: "detonationunit",
  name: "폭발 유닛",
  enName: "Detonation Unit",
  rarity: 6,
  weaponType: "artsunit",
  image: "/weapons/detonationunit.webp",
  series: "방출",
  mainStatLabel: "공격력",
  subStatLabel: "주요 능력치",

  levelStats: [
    { level: 1, attack: 50 },
    { level: 2, attack: 54 },
    { level: 3, attack: 59 },
    { level: 4, attack: 64 },
    { level: 5, attack: 69 },
    { level: 6, attack: 74 },
    { level: 7, attack: 79 },
    { level: 8, attack: 84 },
    { level: 9, attack: 89 },
    { level: 10, attack: 94 },
    { level: 11, attack: 99 },
    { level: 12, attack: 104 },
    { level: 13, attack: 109 },
    { level: 14, attack: 114 },
    { level: 15, attack: 119 },
    { level: 16, attack: 124 },
    { level: 17, attack: 129 },
    { level: 18, attack: 134 },
    { level: 19, attack: 139 },
    { level: 20, attack: 144 },
    { level: 21, attack: 149 },
    { level: 22, attack: 153 },
    { level: 23, attack: 158 },
    { level: 24, attack: 163 },
    { level: 25, attack: 168 },
    { level: 26, attack: 173 },
    { level: 27, attack: 178 },
    { level: 28, attack: 183 },
    { level: 29, attack: 188 },
    { level: 30, attack: 193 },
    { level: 31, attack: 198 },
    { level: 32, attack: 203 },
    { level: 33, attack: 208 },
    { level: 34, attack: 213 },
    { level: 35, attack: 218 },
    { level: 36, attack: 223 },
    { level: 37, attack: 228 },
    { level: 38, attack: 233 },
    { level: 39, attack: 238 },
    { level: 40, attack: 243 },
    { level: 41, attack: 248 },
    { level: 42, attack: 252 },
    { level: 43, attack: 257 },
    { level: 44, attack: 262 },
    { level: 45, attack: 267 },
    { level: 46, attack: 272 },
    { level: 47, attack: 277 },
    { level: 48, attack: 282 },
    { level: 49, attack: 287 },
    { level: 50, attack: 292 },
    { level: 51, attack: 297 },
    { level: 52, attack: 302 },
    { level: 53, attack: 307 },
    { level: 54, attack: 312 },
    { level: 55, attack: 317 },
    { level: 56, attack: 322 },
    { level: 57, attack: 327 },
    { level: 58, attack: 332 },
    { level: 59, attack: 337 },
    { level: 60, attack: 342 },
    { level: 61, attack: 347 },
    { level: 62, attack: 351 },
    { level: 63, attack: 356 },
    { level: 64, attack: 361 },
    { level: 65, attack: 366 },
    { level: 66, attack: 371 },
    { level: 67, attack: 376 },
    { level: 68, attack: 381 },
    { level: 69, attack: 386 },
    { level: 70, attack: 391 },
    { level: 71, attack: 396 },
    { level: 72, attack: 401 },
    { level: 73, attack: 406 },
    { level: 74, attack: 411 },
    { level: 75, attack: 416 },
    { level: 76, attack: 421 },
    { level: 77, attack: 426 },
    { level: 78, attack: 431 },
    { level: 79, attack: 436 },
    { level: 80, attack: 441 },
    { level: 81, attack: 446 },
    { level: 82, attack: 450 },
    { level: 83, attack: 455 },
    { level: 84, attack: 460 },
    { level: 85, attack: 465 },
    { level: 86, attack: 470 },
    { level: 87, attack: 475 },
    { level: 88, attack: 480 },
    { level: 89, attack: 485 },
    { level: 90, attack: 490 },
  ],

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "주요 능력치 증가 · 대: 1/3",
        "오리지늄 아츠 강도 증가 · 대: 1/3",
        "방출 · 우승자의 위세: 1/4",
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
        "오리지늄 아츠 강도 증가 · 대: 1/4",
        "방출 · 우승자의 위세: 1/4",
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
        "오리지늄 아츠 강도 증가 · 대: 2/6",
        "방출 · 우승자의 위세: 1/4",
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
        "오리지늄 아츠 강도 증가 · 대: 2/7",
        "방출 · 우승자의 위세: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "3상 나노 플레이크 칩", count: 16 },
        { name: "무릉석", count: 8 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 3/9",
        "오리지늄 아츠 강도 증가 · 대: 3/9",
        "방출 · 우승자의 위세: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "main-attribute-large",
      typeLabel: "무기 스킬",
      name: "주요 능력치 증가 · 대",
      icon: "",
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
      key: "arts-intensity-large",
      typeLabel: "무기 스킬",
      name: "오리지늄 아츠 강도 증가 · 대",
      icon: "",
      meta: [{ label: "속성", value: "오리지늄 아츠 강도" }],
      levelValues: [
        {
          rank: "1",
          description: "오리지늄 아츠 강도 +10",
          stats: [{ label: "오리지늄 아츠 강도", value: "+10" }],
        },
        {
          rank: "2",
          description: "오리지늄 아츠 강도 +18",
          stats: [{ label: "오리지늄 아츠 강도", value: "+18" }],
        },
        {
          rank: "3",
          description: "오리지늄 아츠 강도 +26",
          stats: [{ label: "오리지늄 아츠 강도", value: "+26" }],
        },
        {
          rank: "4",
          description: "오리지늄 아츠 강도 +34",
          stats: [{ label: "오리지늄 아츠 강도", value: "+34" }],
        },
        {
          rank: "5",
          description: "오리지늄 아츠 강도 +42",
          stats: [{ label: "오리지늄 아츠 강도", value: "+42" }],
        },
        {
          rank: "6",
          description: "오리지늄 아츠 강도 +50",
          stats: [{ label: "오리지늄 아츠 강도", value: "+50" }],
        },
        {
          rank: "7",
          description: "오리지늄 아츠 강도 +58",
          stats: [{ label: "오리지늄 아츠 강도", value: "+58" }],
        },
        {
          rank: "8",
          description: "오리지늄 아츠 강도 +66",
          stats: [{ label: "오리지늄 아츠 강도", value: "+66" }],
        },
        {
          rank: "9",
          description: "오리지늄 아츠 강도 +78",
          stats: [{ label: "오리지늄 아츠 강도", value: "+78" }],
        },
      ],
      compareRows: [
        {
          label: "오리지늄 아츠 강도",
          values: ["+10", "+18", "+26", "+34", "+42", "+50", "+58", "+66", "+78"],
        },
      ],
    },
    {
      key: "discharge-champions-majesty",
      typeLabel: "무기 스킬",
      name: "방출 · 우승자의 위세",
      icon: "",
      meta: [{ label: "시리즈 스킬", value: "방출" }],
      levelValues: [
        {
          rank: "1",
          description:
            "보조 능력치 +10.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +9.0%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+10.0%" },
            { label: "목표가 받는 아츠 피해", value: "+9.0%" },
          ],
        },
        {
          rank: "2",
          description:
            "보조 능력치 +12.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +10.8%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+12.0%" },
            { label: "목표가 받는 아츠 피해", value: "+10.8%" },
          ],
        },
        {
          rank: "3",
          description:
            "보조 능력치 +14.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +12.6%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+14.0%" },
            { label: "목표가 받는 아츠 피해", value: "+12.6%" },
          ],
        },
        {
          rank: "4",
          description:
            "보조 능력치 +16.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +14.4%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+16.0%" },
            { label: "목표가 받는 아츠 피해", value: "+14.4%" },
          ],
        },
        {
          rank: "5",
          description:
            "보조 능력치 +18.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +16.2%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+18.0%" },
            { label: "목표가 받는 아츠 피해", value: "+16.2%" },
          ],
        },
        {
          rank: "6",
          description:
            "보조 능력치 +20.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +18.0%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+20.0%" },
            { label: "목표가 받는 아츠 피해", value: "+18.0%" },
          ],
        },
        {
          rank: "7",
          description:
            "보조 능력치 +22.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +19.8%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+22.0%" },
            { label: "목표가 받는 아츠 피해", value: "+19.8%" },
          ],
        },
        {
          rank: "8",
          description:
            "보조 능력치 +24.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +21.6%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+24.0%" },
            { label: "목표가 받는 아츠 피해", value: "+21.6%" },
          ],
        },
        {
          rank: "9",
          description:
            "보조 능력치 +28.0%\n장착자가 아츠 폭발 피해를 줄 때, 목표가 받는 아츠 피해 +25.2%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+28.0%" },
            { label: "목표가 받는 아츠 피해", value: "+25.2%" },
          ],
        },
      ],
      compareRows: [
        {
          label: "보조 능력치",
          values: ["+10.0%", "+12.0%", "+14.0%", "+16.0%", "+18.0%", "+20.0%", "+22.0%", "+24.0%", "+28.0%"],
        },
        {
          label: "목표가 받는 아츠 피해",
          values: ["+9.0%", "+10.8%", "+12.6%", "+14.4%", "+16.2%", "+18.0%", "+19.8%", "+21.6%", "+25.2%"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;