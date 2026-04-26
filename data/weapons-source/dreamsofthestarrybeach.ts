import type { SourceWeaponDetail } from "../weapons-detail-data";

export const dreamsofthestarrybeach = {
  slug: "dreamsofthestarrybeach",
  name: "바다와 별의 꿈",
  enName: "Dreams of the Starry Beach",
  rarity: 6,
  weaponType: "artsunit",
  image: "/weapons/dreamsofthestarrybeach.webp",
  series: "고통",
  mainStatLabel: "공격력",
  subStatLabel: "지능",

  levelStats: [
    { level: 1, attack: 50 },
    { level: 2, attack: 55 },
    { level: 3, attack: 60 },
    { level: 4, attack: 65 },
    { level: 5, attack: 70 },
    { level: 6, attack: 75 },
    { level: 7, attack: 80 },
    { level: 8, attack: 85 },
    { level: 9, attack: 90 },
    { level: 10, attack: 95 },
    { level: 11, attack: 100 },
    { level: 12, attack: 105 },
    { level: 13, attack: 110 },
    { level: 14, attack: 115 },
    { level: 15, attack: 120 },
    { level: 16, attack: 125 },
    { level: 17, attack: 130 },
    { level: 18, attack: 135 },
    { level: 19, attack: 140 },
    { level: 20, attack: 145 },
    { level: 21, attack: 150 },
    { level: 22, attack: 155 },
    { level: 23, attack: 160 },
    { level: 24, attack: 165 },
    { level: 25, attack: 170 },
    { level: 26, attack: 175 },
    { level: 27, attack: 180 },
    { level: 28, attack: 185 },
    { level: 29, attack: 190 },
    { level: 30, attack: 195 },
    { level: 31, attack: 200 },
    { level: 32, attack: 205 },
    { level: 33, attack: 210 },
    { level: 34, attack: 215 },
    { level: 35, attack: 220 },
    { level: 36, attack: 225 },
    { level: 37, attack: 230 },
    { level: 38, attack: 235 },
    { level: 39, attack: 240 },
    { level: 40, attack: 245 },
    { level: 41, attack: 250 },
    { level: 42, attack: 255 },
    { level: 43, attack: 260 },
    { level: 44, attack: 265 },
    { level: 45, attack: 270 },
    { level: 46, attack: 275 },
    { level: 47, attack: 280 },
    { level: 48, attack: 285 },
    { level: 49, attack: 290 },
    { level: 50, attack: 295 },
    { level: 51, attack: 300 },
    { level: 52, attack: 305 },
    { level: 53, attack: 310 },
    { level: 54, attack: 315 },
    { level: 55, attack: 320 },
    { level: 56, attack: 325 },
    { level: 57, attack: 330 },
    { level: 58, attack: 335 },
    { level: 59, attack: 340 },
    { level: 60, attack: 345 },
    { level: 61, attack: 350 },
    { level: 62, attack: 355 },
    { level: 63, attack: 360 },
    { level: 64, attack: 365 },
    { level: 65, attack: 370 },
    { level: 66, attack: 375 },
    { level: 67, attack: 380 },
    { level: 68, attack: 385 },
    { level: 69, attack: 390 },
    { level: 70, attack: 395 },
    { level: 71, attack: 400 },
    { level: 72, attack: 405 },
    { level: 73, attack: 410 },
    { level: 74, attack: 415 },
    { level: 75, attack: 420 },
    { level: 76, attack: 425 },
    { level: 77, attack: 430 },
    { level: 78, attack: 435 },
    { level: 79, attack: 440 },
    { level: 80, attack: 445 },
    { level: 81, attack: 450 },
    { level: 82, attack: 455 },
    { level: 83, attack: 460 },
    { level: 84, attack: 465 },
    { level: 85, attack: 470 },
    { level: 86, attack: 475 },
    { level: 87, attack: 480 },
    { level: 88, attack: 485 },
    { level: 89, attack: 490 },
    { level: 90, attack: 495 },
  ],

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "지능 증가 · 대: 1/3",
        "치유 효율 증가 · 대: 1/3",
        "고통 · 밀물과 썰물의 속삭임: 1/4",
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
        "지능 증가 · 대: 2/5",
        "치유 효율 증가 · 대: 1/4",
        "고통 · 밀물과 썰물의 속삭임: 1/4",
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
        "지능 증가 · 대: 2/6",
        "치유 효율 증가 · 대: 2/6",
        "고통 · 밀물과 썰물의 속삭임: 1/4",
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
        "지능 증가 · 대: 3/8",
        "치유 효율 증가 · 대: 2/7",
        "고통 · 밀물과 썰물의 속삭임: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "정합용 유체", count: 16 },
        { name: "화염석", count: 8 },
      ],
      bonuses: [
        "지능 증가 · 대: 3/9",
        "치유 효율 증가 · 대: 3/9",
        "고통 · 밀물과 썰물의 속삭임: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "intellect-large",
      typeLabel: "무기 스킬",
      name: "지능 증가 · 대",
      icon: "",
      meta: [{ label: "능력치", value: "지능" }],
      levelValues: [
        { rank: "1", description: "지능 +20", stats: [{ label: "지능", value: "+20" }] },
        { rank: "2", description: "지능 +36", stats: [{ label: "지능", value: "+36" }] },
        { rank: "3", description: "지능 +52", stats: [{ label: "지능", value: "+52" }] },
        { rank: "4", description: "지능 +68", stats: [{ label: "지능", value: "+68" }] },
        { rank: "5", description: "지능 +84", stats: [{ label: "지능", value: "+84" }] },
        { rank: "6", description: "지능 +100", stats: [{ label: "지능", value: "+100" }] },
        { rank: "7", description: "지능 +116", stats: [{ label: "지능", value: "+116" }] },
        { rank: "8", description: "지능 +132", stats: [{ label: "지능", value: "+132" }] },
        { rank: "9", description: "지능 +156", stats: [{ label: "지능", value: "+156" }] },
      ],
      compareRows: [
        {
          label: "지능",
          values: ["+20", "+36", "+52", "+68", "+84", "+100", "+116", "+132", "+156"],
        },
      ],
    },
    {
      key: "healing-efficiency-large",
      typeLabel: "무기 스킬",
      name: "치유 효율 증가 · 대",
      icon: "",
      meta: [{ label: "속성", value: "치유 효율" }],
      levelValues: [
        {
          rank: "1",
          description: "치유 효율 +6.0%",
          stats: [{ label: "치유 효율", value: "+6.0%" }],
        },
        {
          rank: "2",
          description: "치유 효율 +10.7%",
          stats: [{ label: "치유 효율", value: "+10.7%" }],
        },
        {
          rank: "3",
          description: "치유 효율 +15.5%",
          stats: [{ label: "치유 효율", value: "+15.5%" }],
        },
        {
          rank: "4",
          description: "치유 효율 +20.2%",
          stats: [{ label: "치유 효율", value: "+20.2%" }],
        },
        {
          rank: "5",
          description: "치유 효율 +25.0%",
          stats: [{ label: "치유 효율", value: "+25.0%" }],
        },
        {
          rank: "6",
          description: "치유 효율 +29.8%",
          stats: [{ label: "치유 효율", value: "+29.8%" }],
        },
        {
          rank: "7",
          description: "치유 효율 +34.5%",
          stats: [{ label: "치유 효율", value: "+34.5%" }],
        },
        {
          rank: "8",
          description: "치유 효율 +39.3%",
          stats: [{ label: "치유 효율", value: "+39.3%" }],
        },
        {
          rank: "9",
          description: "치유 효율 +46.4%",
          stats: [{ label: "치유 효율", value: "+46.4%" }],
        },
      ],
      compareRows: [
        {
          label: "치유 효율",
          values: ["+6.0%", "+10.7%", "+15.5%", "+20.2%", "+25.0%", "+29.8%", "+34.5%", "+39.3%", "+46.4%"],
        },
      ],
    },
    {
      key: "pain-whisper-of-tides",
      typeLabel: "무기 스킬",
      name: "고통 · 밀물과 썰물의 속삭임",
      icon: "",
      meta: [{ label: "시리즈 스킬", value: "고통" }],
      levelValues: [
        {
          rank: "1",
          description:
            "보조 능력치 +16.0%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +10.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+16.0%" },
            { label: "목표가 받는 아츠 피해", value: "+10.0%" },
          ],
        },
        {
          rank: "2",
          description:
            "보조 능력치 +19.2%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +12.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+19.2%" },
            { label: "목표가 받는 아츠 피해", value: "+12.0%" },
          ],
        },
        {
          rank: "3",
          description:
            "보조 능력치 +22.4%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +14.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+22.4%" },
            { label: "목표가 받는 아츠 피해", value: "+14.0%" },
          ],
        },
        {
          rank: "4",
          description:
            "보조 능력치 +25.6%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +16.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+25.6%" },
            { label: "목표가 받는 아츠 피해", value: "+16.0%" },
          ],
        },
        {
          rank: "5",
          description:
            "보조 능력치 +28.8%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +18.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+28.8%" },
            { label: "목표가 받는 아츠 피해", value: "+18.0%" },
          ],
        },
        {
          rank: "6",
          description:
            "보조 능력치 +32.0%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +20.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+32.0%" },
            { label: "목표가 받는 아츠 피해", value: "+20.0%" },
          ],
        },
        {
          rank: "7",
          description:
            "보조 능력치 +35.2%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +22.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+35.2%" },
            { label: "목표가 받는 아츠 피해", value: "+22.0%" },
          ],
        },
        {
          rank: "8",
          description:
            "보조 능력치 +38.4%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +24.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+38.4%" },
            { label: "목표가 받는 아츠 피해", value: "+24.0%" },
          ],
        },
        {
          rank: "9",
          description:
            "보조 능력치 +44.8%\n장착자가 부식을 소모한 후, 목표가 받는 아츠 피해 +28.0%, 25초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "보조 능력치", value: "+44.8%" },
            { label: "목표가 받는 아츠 피해", value: "+28.0%" },
          ],
        },
      ],
      compareRows: [
        {
          label: "보조 능력치",
          values: ["+16.0%", "+19.2%", "+22.4%", "+25.6%", "+28.8%", "+32.0%", "+35.2%", "+38.4%", "+44.8%"],
        },
        {
          label: "목표가 받는 아츠 피해",
          values: ["+10.0%", "+12.0%", "+14.0%", "+16.0%", "+18.0%", "+20.0%", "+22.0%", "+24.0%", "+28.0%"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;