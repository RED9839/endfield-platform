import type { SourceWeaponDetail } from "../weapons-detail-data";

export const thunderberge = {
  slug: "thunderberge",
  name: "천둥의 흔적",
  enName: "Thunderberge",
  rarity: 6,
  weaponType: "greatsword",
  image: "/weapons/thunderberge.webp",
  series: "의료",
  mainStatLabel: "공격력",
  subStatLabel: "힘",

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
        "힘 증가 · 대: 1/3",
        "생명력 증가 · 대: 1/3",
        "의료 · 탈로스의 눈: 1/4",
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
        "힘 증가 · 대: 2/5",
        "생명력 증가 · 대: 1/4",
        "의료 · 탈로스의 눈: 1/4",
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
        "힘 증가 · 대: 2/6",
        "생명력 증가 · 대: 2/6",
        "의료 · 탈로스의 눈: 1/4",
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
        "힘 증가 · 대: 3/8",
        "생명력 증가 · 대: 2/7",
        "의료 · 탈로스의 눈: 1/4",
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
        "힘 증가 · 대: 3/9",
        "생명력 증가 · 대: 3/9",
        "의료 · 탈로스의 눈: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "strength-large",
      typeLabel: "무기 스킬",
      name: "힘 증가 · 대",
      icon: "/icons/weapons/skills/strength-large.webp",
      meta: [{ label: "능력치", value: "힘" }],
      levelValues: [
        { rank: "1", description: "힘 +20", stats: [{ label: "힘", value: "+20" }] },
        { rank: "2", description: "힘 +36", stats: [{ label: "힘", value: "+36" }] },
        { rank: "3", description: "힘 +52", stats: [{ label: "힘", value: "+52" }] },
        { rank: "4", description: "힘 +68", stats: [{ label: "힘", value: "+68" }] },
        { rank: "5", description: "힘 +84", stats: [{ label: "힘", value: "+84" }] },
        { rank: "6", description: "힘 +100", stats: [{ label: "힘", value: "+100" }] },
        { rank: "7", description: "힘 +116", stats: [{ label: "힘", value: "+116" }] },
        { rank: "8", description: "힘 +132", stats: [{ label: "힘", value: "+132" }] },
        { rank: "9", description: "힘 +156", stats: [{ label: "힘", value: "+156" }] },
      ],
      compareRows: [
        {
          label: "힘",
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
      key: "medical-eye-of-talos",
      typeLabel: "무기 스킬",
      name: "의료 · 탈로스의 눈",
      icon: "/icons/weapons/skills/medical.webp",
      meta: [{ label: "시리즈 스킬", value: "의료" }],
      levelValues: [
        {
          rank: "1",
          description:
            "부여한 보호 효과 +24.0%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [7.0%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+24.0%" },
            { label: "보호 효과", value: "[7.0%×장착자의 최대 생명력]" },
          ],
        },
        {
          rank: "2",
          description:
            "부여한 보호 효과 +28.8%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [8.4%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+28.8%" },
            { label: "보호 효과", value: "[8.4%×장착자의 최대 생명력]" },
          ],
        },
        {
          rank: "3",
          description:
            "부여한 보호 효과 +33.6%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [9.8%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+33.6%" },
            { label: "보호 효과", value: "[9.8%×장착자의 최대 생명력]" },
          ],
        },
        {
          rank: "4",
          description:
            "부여한 보호 효과 +38.4%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [11.2%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+38.4%" },
            { label: "보호 효과", value: "[11.2%×장착자의 최대 생명력]" },
          ],
        },
        {
          rank: "5",
          description:
            "부여한 보호 효과 +43.2%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [12.6%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+43.2%" },
            { label: "보호 효과", value: "[12.6%×장착자의 최대 생명력]" },
          ],
        },
        {
          rank: "6",
          description:
            "부여한 보호 효과 +48.0%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [14.0%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+48.0%" },
            { label: "보호 효과", value: "[14.0%×장착자의 최대 생명력]" },
          ],
        },
        {
          rank: "7",
          description:
            "부여한 보호 효과 +52.8%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [15.4%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+52.8%" },
            { label: "보호 효과", value: "[15.4%×장착자의 최대 생명력]" },
          ],
        },
        {
          rank: "8",
          description:
            "부여한 보호 효과 +57.6%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [16.8%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+57.6%" },
            { label: "보호 효과", value: "[16.8%×장착자의 최대 생명력]" },
          ],
        },
        {
          rank: "9",
          description:
            "부여한 보호 효과 +67.2%\n장착자가 자신의 연계 스킬로 치유한 후, 추가로 메인 컨트롤 오퍼레이터가 [19.6%×장착자의 최대 생명력]의 보호 효과 획득, 15초 동안 지속.\n15초 내 최대 1회 발동합니다.",
          stats: [
            { label: "부여한 보호 효과", value: "+67.2%" },
            { label: "보호 효과", value: "[19.6%×장착자의 최대 생명력]" },
          ],
        },
      ],
      compareRows: [
        {
          label: "부여한 보호 효과",
          values: ["+24.0%", "+28.8%", "+33.6%", "+38.4%", "+43.2%", "+48.0%", "+52.8%", "+57.6%", "+67.2%"],
        },
        {
          label: "보호 효과",
          values: [
            "[7.0%×장착자의 최대 생명력]",
            "[8.4%×장착자의 최대 생명력]",
            "[9.8%×장착자의 최대 생명력]",
            "[11.2%×장착자의 최대 생명력]",
            "[12.6%×장착자의 최대 생명력]",
            "[14.0%×장착자의 최대 생명력]",
            "[15.4%×장착자의 최대 생명력]",
            "[16.8%×장착자의 최대 생명력]",
            "[19.6%×장착자의 최대 생명력]",
          ],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;