import type { SourceWeaponDetail } from "../weapons-detail-data";

export const valiant = {
  slug: "valiant",
  name: "용사",
  enName: "Valiant",
  rarity: 6,
  weaponType: "polearm",
  image: "/weapons/valiant.webp",
  series: "기예",
  mainStatLabel: "공격력",
  subStatLabel: "민첩",

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
        "민첩 증가 · 대: 1/3",
        "물리 피해 증가 · 대: 1/3",
        "기예 · 좋은 품성의 결실: 1/4",
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
        "민첩 증가 · 대: 2/5",
        "물리 피해 증가 · 대: 1/4",
        "기예 · 좋은 품성의 결실: 1/4",
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
        "민첩 증가 · 대: 2/6",
        "물리 피해 증가 · 대: 2/6",
        "기예 · 좋은 품성의 결실: 1/4",
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
        "민첩 증가 · 대: 3/8",
        "물리 피해 증가 · 대: 2/7",
        "기예 · 좋은 품성의 결실: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "타키온 차폐 구조체", count: 16 },
        { name: "화염석", count: 8 },
      ],
      bonuses: [
        "민첩 증가 · 대: 3/9",
        "물리 피해 증가 · 대: 3/9",
        "기예 · 좋은 품성의 결실: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "agility-large",
      typeLabel: "무기 스킬",
      name: "민첩 증가 · 대",
      icon: "/icons/weapons/skills/agility-large.webp",
      meta: [{ label: "능력치", value: "민첩" }],
      levelValues: [
        { rank: "1", description: "민첩 +20", stats: [{ label: "민첩", value: "+20" }] },
        { rank: "2", description: "민첩 +36", stats: [{ label: "민첩", value: "+36" }] },
        { rank: "3", description: "민첩 +52", stats: [{ label: "민첩", value: "+52" }] },
        { rank: "4", description: "민첩 +68", stats: [{ label: "민첩", value: "+68" }] },
        { rank: "5", description: "민첩 +84", stats: [{ label: "민첩", value: "+84" }] },
        { rank: "6", description: "민첩 +100", stats: [{ label: "민첩", value: "+100" }] },
        { rank: "7", description: "민첩 +116", stats: [{ label: "민첩", value: "+116" }] },
        { rank: "8", description: "민첩 +132", stats: [{ label: "민첩", value: "+132" }] },
        { rank: "9", description: "민첩 +156", stats: [{ label: "민첩", value: "+156" }] },
      ],
      compareRows: [
        {
          label: "민첩",
          values: ["+20", "+36", "+52", "+68", "+84", "+100", "+116", "+132", "+156"],
        },
      ],
    },
    {
      key: "physical-dmg-large",
      typeLabel: "무기 스킬",
      name: "물리 피해 증가 · 대",
      icon: "/icons/weapons/skills/physical-dmg-large.webp",
      meta: [{ label: "속성", value: "물리 피해" }],
      levelValues: [
        {
          rank: "1",
          description: "물리 피해 +5.6%",
          stats: [{ label: "물리 피해", value: "+5.6%" }],
        },
        {
          rank: "2",
          description: "물리 피해 +10.0%",
          stats: [{ label: "물리 피해", value: "+10.0%" }],
        },
        {
          rank: "3",
          description: "물리 피해 +14.4%",
          stats: [{ label: "물리 피해", value: "+14.4%" }],
        },
        {
          rank: "4",
          description: "물리 피해 +18.9%",
          stats: [{ label: "물리 피해", value: "+18.9%" }],
        },
        {
          rank: "5",
          description: "물리 피해 +23.3%",
          stats: [{ label: "물리 피해", value: "+23.3%" }],
        },
        {
          rank: "6",
          description: "물리 피해 +27.8%",
          stats: [{ label: "물리 피해", value: "+27.8%" }],
        },
        {
          rank: "7",
          description: "물리 피해 +32.2%",
          stats: [{ label: "물리 피해", value: "+32.2%" }],
        },
        {
          rank: "8",
          description: "물리 피해 +36.7%",
          stats: [{ label: "물리 피해", value: "+36.7%" }],
        },
        {
          rank: "9",
          description: "물리 피해 +43.3%",
          stats: [{ label: "물리 피해", value: "+43.3%" }],
        },
      ],
      compareRows: [
        {
          label: "물리 피해",
          values: ["+5.6%", "+10.0%", "+14.4%", "+18.9%", "+23.3%", "+27.8%", "+32.2%", "+36.7%", "+43.3%"],
        },
      ],
    },
    {
      key: "technique-fruit-of-good-character",
      typeLabel: "무기 스킬",
      name: "기예 · 좋은 품성의 결실",
      icon: "/icons/weapons/skills/technique.webp",
      meta: [{ label: "시리즈 스킬", value: "기예" }],
      levelValues: [
        {
          rank: "1",
          description:
            "공격력 +10.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 120.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+10.0%" },
            { label: "추가 물리 피해", value: "공격력 120.0%" },
          ],
        },
        {
          rank: "2",
          description:
            "공격력 +12.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 144.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+12.0%" },
            { label: "추가 물리 피해", value: "공격력 144.0%" },
          ],
        },
        {
          rank: "3",
          description:
            "공격력 +14.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 168.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+14.0%" },
            { label: "추가 물리 피해", value: "공격력 168.0%" },
          ],
        },
        {
          rank: "4",
          description:
            "공격력 +16.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 192.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+16.0%" },
            { label: "추가 물리 피해", value: "공격력 192.0%" },
          ],
        },
        {
          rank: "5",
          description:
            "공격력 +18.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 216.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+18.0%" },
            { label: "추가 물리 피해", value: "공격력 216.0%" },
          ],
        },
        {
          rank: "6",
          description:
            "공격력 +20.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 240.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+20.0%" },
            { label: "추가 물리 피해", value: "공격력 240.0%" },
          ],
        },
        {
          rank: "7",
          description:
            "공격력 +22.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 264.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+22.0%" },
            { label: "추가 물리 피해", value: "공격력 264.0%" },
          ],
        },
        {
          rank: "8",
          description:
            "공격력 +24.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 288.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+24.0%" },
            { label: "추가 물리 피해", value: "공격력 288.0%" },
          ],
        },
        {
          rank: "9",
          description:
            "공격력 +28.0%\n장착자가 물리 이상 효과를 준 후, 추가로 자신의 공격력 336.0%의 물리 피해를 줍니다.",
          stats: [
            { label: "공격력", value: "+28.0%" },
            { label: "추가 물리 피해", value: "공격력 336.0%" },
          ],
        },
      ],
      compareRows: [
        {
          label: "공격력",
          values: ["+10.0%", "+12.0%", "+14.0%", "+16.0%", "+18.0%", "+20.0%", "+22.0%", "+24.0%", "+28.0%"],
        },
        {
          label: "추가 물리 피해",
          values: ["120.0%", "144.0%", "168.0%", "192.0%", "216.0%", "240.0%", "264.0%", "288.0%", "336.0%"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;