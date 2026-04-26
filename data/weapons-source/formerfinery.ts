import type { SourceWeaponDetail } from "../weapons-detail-data";

export const formerfinery = {
  slug: "formerfinery",
  name: "과거의 일품",
  enName: "Former Finery",
  rarity: 6,
  weaponType: "greatsword",
  image: "/weapons/formerfinery.webp",
  series: "효율",
  mainStatLabel: "공격력",
  subStatLabel: "의지",

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
        "의지 증가 · 대: 1/3",
        "생명력 증가 · 대: 1/3",
        "효율 · 절개 의료법: 1/4",
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
        "의지 증가 · 대: 2/5",
        "생명력 증가 · 대: 1/4",
        "효율 · 절개 의료법: 1/4",
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
        "의지 증가 · 대: 2/6",
        "생명력 증가 · 대: 2/6",
        "효율 · 절개 의료법: 1/4",
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
        "의지 증가 · 대: 3/8",
        "생명력 증가 · 대: 2/7",
        "효율 · 절개 의료법: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "초거리 빛 반사 파이프", count: 16 },
        { name: "무릉석", count: 8 },
      ],
      bonuses: [
        "의지 증가 · 대: 3/9",
        "생명력 증가 · 대: 3/9",
        "효율 · 절개 의료법: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "will-large",
      typeLabel: "무기 스킬",
      name: "의지 증가 · 대",
      icon: "/icons/weapons/skills/will-large.webp",
      meta: [{ label: "능력치", value: "의지" }],
      levelValues: [
        { rank: "1", description: "의지 +20", stats: [{ label: "의지", value: "+20" }] },
        { rank: "2", description: "의지 +36", stats: [{ label: "의지", value: "+36" }] },
        { rank: "3", description: "의지 +52", stats: [{ label: "의지", value: "+52" }] },
        { rank: "4", description: "의지 +68", stats: [{ label: "의지", value: "+68" }] },
        { rank: "5", description: "의지 +84", stats: [{ label: "의지", value: "+84" }] },
        { rank: "6", description: "의지 +100", stats: [{ label: "의지", value: "+100" }] },
        { rank: "7", description: "의지 +116", stats: [{ label: "의지", value: "+116" }] },
        { rank: "8", description: "의지 +132", stats: [{ label: "의지", value: "+132" }] },
        { rank: "9", description: "의지 +156", stats: [{ label: "의지", value: "+156" }] },
      ],
      compareRows: [
        {
          label: "의지",
          values: ["+20", "+36", "+52", "+68", "+84", "+100", "+116", "+132", "+156"],
        },
      ],
    },
    {
      key: "hp-large",
      typeLabel: "무기 스킬",
      name: "생명력 증가 · 대",
      icon: "/icons/weapons/skills/hp-large.webp",
      meta: [{ label: "속성", value: "최대 생명력" }],
      levelValues: [
        {
          rank: "1",
          description: "최대 생명력 +10.0%",
          stats: [{ label: "최대 생명력", value: "+10.0%" }],
        },
        {
          rank: "2",
          description: "최대 생명력 +18.0%",
          stats: [{ label: "최대 생명력", value: "+18.0%" }],
        },
        {
          rank: "3",
          description: "최대 생명력 +26.0%",
          stats: [{ label: "최대 생명력", value: "+26.0%" }],
        },
        {
          rank: "4",
          description: "최대 생명력 +34.0%",
          stats: [{ label: "최대 생명력", value: "+34.0%" }],
        },
        {
          rank: "5",
          description: "최대 생명력 +42.0%",
          stats: [{ label: "최대 생명력", value: "+42.0%" }],
        },
        {
          rank: "6",
          description: "최대 생명력 +50.0%",
          stats: [{ label: "최대 생명력", value: "+50.0%" }],
        },
        {
          rank: "7",
          description: "최대 생명력 +58.0%",
          stats: [{ label: "최대 생명력", value: "+58.0%" }],
        },
        {
          rank: "8",
          description: "최대 생명력 +66.0%",
          stats: [{ label: "최대 생명력", value: "+66.0%" }],
        },
        {
          rank: "9",
          description: "최대 생명력 +78.0%",
          stats: [{ label: "최대 생명력", value: "+78.0%" }],
        },
      ],
      compareRows: [
        {
          label: "최대 생명력",
          values: ["+10.0%", "+18.0%", "+26.0%", "+34.0%", "+42.0%", "+50.0%", "+58.0%", "+66.0%", "+78.0%"],
        },
      ],
    },
    {
      key: "efficiency-incision-medicine",
      typeLabel: "무기 스킬",
      name: "효율 · 절개 의료법",
      icon: "/icons/weapons/skills/efficiency.webp",
      meta: [{ label: "시리즈 스킬", value: "효율" }],
      levelValues: [
        {
          rank: "1",
          description:
            "치유 효율 +10.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [84+의지×1]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+10.0%" },
            { label: "회복량", value: "[84+의지×1]" },
          ],
        },
        {
          rank: "2",
          description:
            "치유 효율 +12.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [101+의지×1]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+12.0%" },
            { label: "회복량", value: "[101+의지×1]" },
          ],
        },
        {
          rank: "3",
          description:
            "치유 효율 +14.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [118+의지×1]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+14.0%" },
            { label: "회복량", value: "[118+의지×1]" },
          ],
        },
        {
          rank: "4",
          description:
            "치유 효율 +16.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [134+의지×1]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+16.0%" },
            { label: "회복량", value: "[134+의지×1]" },
          ],
        },
        {
          rank: "5",
          description:
            "치유 효율 +18.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [151+의지×1]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+18.0%" },
            { label: "회복량", value: "[151+의지×1]" },
          ],
        },
        {
          rank: "6",
          description:
            "치유 효율 +20.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [168+의지×1]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+20.0%" },
            { label: "회복량", value: "[168+의지×1]" },
          ],
        },
        {
          rank: "7",
          description:
            "치유 효율 +22.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [185+의지×2]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+22.0%" },
            { label: "회복량", value: "[185+의지×2]" },
          ],
        },
        {
          rank: "8",
          description:
            "치유 효율 +24.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [202+의지×2]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+24.0%" },
            { label: "회복량", value: "[202+의지×2]" },
          ],
        },
        {
          rank: "9",
          description:
            "치유 효율 +28.0%\n비호 상태의 오퍼레이터가 피해를 받은 후, 장착자가 회복시키는 대상의 생명력 [235+의지×2]포인트.\n15초마다 최대 1회만 발동합니다.",
          stats: [
            { label: "치유 효율", value: "+28.0%" },
            { label: "회복량", value: "[235+의지×2]" },
          ],
        },
      ],
      compareRows: [
        {
          label: "치유 효율",
          values: ["+10.0%", "+12.0%", "+14.0%", "+16.0%", "+18.0%", "+20.0%", "+22.0%", "+24.0%", "+28.0%"],
        },
        {
          label: "회복량",
          values: [
            "[84+의지×1]",
            "[101+의지×1]",
            "[118+의지×1]",
            "[134+의지×1]",
            "[151+의지×1]",
            "[168+의지×1]",
            "[185+의지×2]",
            "[202+의지×2]",
            "[235+의지×2]",
          ],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;