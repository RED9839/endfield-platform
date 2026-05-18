import type { SourceWeaponDetail } from "../weapons-detail-data";

export const chivalricvirtues = {
  slug: "chivalricvirtues",
  name: "기사도 정신",
  enName: "Chivalric Virtues",
  rarity: 6,
  weaponType: "artsunit",
  image: "/weapons/chivalricvirtues.webp",
  series: "의료",
  mainStatLabel: "공격력",
  subStatLabel: "의지",

  levelStats: [
    { level: 1, attack: 49 },
    { level: 2, attack: 54 },
    { level: 3, attack: 59 },
    { level: 4, attack: 64 },
    { level: 5, attack: 69 },
    { level: 6, attack: 74 },
    { level: 7, attack: 78 },
    { level: 8, attack: 83 },
    { level: 9, attack: 88 },
    { level: 10, attack: 93 },
    { level: 11, attack: 98 },
    { level: 12, attack: 103 },
    { level: 13, attack: 108 },
    { level: 14, attack: 113 },
    { level: 15, attack: 118 },
    { level: 16, attack: 123 },
    { level: 17, attack: 127 },
    { level: 18, attack: 132 },
    { level: 19, attack: 137 },
    { level: 20, attack: 142 },
    { level: 21, attack: 147 },
    { level: 22, attack: 152 },
    { level: 23, attack: 157 },
    { level: 24, attack: 162 },
    { level: 25, attack: 167 },
    { level: 26, attack: 172 },
    { level: 27, attack: 176 },
    { level: 28, attack: 181 },
    { level: 29, attack: 186 },
    { level: 30, attack: 191 },
    { level: 31, attack: 196 },
    { level: 32, attack: 201 },
    { level: 33, attack: 206 },
    { level: 34, attack: 211 },
    { level: 35, attack: 216 },
    { level: 36, attack: 221 },
    { level: 37, attack: 225 },
    { level: 38, attack: 230 },
    { level: 39, attack: 235 },
    { level: 40, attack: 240 },
    { level: 41, attack: 245 },
    { level: 42, attack: 250 },
    { level: 43, attack: 255 },
    { level: 44, attack: 260 },
    { level: 45, attack: 265 },
    { level: 46, attack: 270 },
    { level: 47, attack: 274 },
    { level: 48, attack: 279 },
    { level: 49, attack: 284 },
    { level: 50, attack: 289 },
    { level: 51, attack: 294 },
    { level: 52, attack: 299 },
    { level: 53, attack: 304 },
    { level: 54, attack: 309 },
    { level: 55, attack: 314 },
    { level: 56, attack: 319 },
    { level: 57, attack: 323 },
    { level: 58, attack: 328 },
    { level: 59, attack: 333 },
    { level: 60, attack: 338 },
    { level: 61, attack: 343 },
    { level: 62, attack: 348 },
    { level: 63, attack: 353 },
    { level: 64, attack: 358 },
    { level: 65, attack: 363 },
    { level: 66, attack: 368 },
    { level: 67, attack: 372 },
    { level: 68, attack: 377 },
    { level: 69, attack: 382 },
    { level: 70, attack: 387 },
    { level: 71, attack: 392 },
    { level: 72, attack: 397 },
    { level: 73, attack: 402 },
    { level: 74, attack: 407 },
    { level: 75, attack: 412 },
    { level: 76, attack: 417 },
    { level: 77, attack: 421 },
    { level: 78, attack: 426 },
    { level: 79, attack: 431 },
    { level: 80, attack: 436 },
    { level: 81, attack: 441 },
    { level: 82, attack: 446 },
    { level: 83, attack: 451 },
    { level: 84, attack: 456 },
    { level: 85, attack: 461 },
    { level: 86, attack: 466 },
    { level: 87, attack: 470 },
    { level: 88, attack: 475 },
    { level: 89, attack: 480 },
    { level: 90, attack: 485 },
  ],

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "의지 증가 · 대: 1/3",
        "생명력 증가 · 대: 1/3",
        "의료 · 침식성 광기의 불꽃: 1/4",
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
        "의료 · 침식성 광기의 불꽃: 1/4",
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
        "의료 · 침식성 광기의 불꽃: 1/4",
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
        "의료 · 침식성 광기의 불꽃: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "D96강 시제품 4번", count: 16 },
        { name: "무릉석", count: 8 },
      ],
      bonuses: [
        "의지 증가 · 대: 3/9",
        "생명력 증가 · 대: 3/9",
        "의료 · 침식성 광기의 불꽃: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "will-large",
      typeLabel: "무기 스킬",
      name: "의지 증가 · 대",
      icon: "",
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
      key: "max-hp-large",
      typeLabel: "무기 스킬",
      name: "생명력 증가 · 대",
      icon: "",
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
      key: "medical-flame-of-corrosive-madness",
      typeLabel: "무기 스킬",
      name: "의료 · 침식성 광기의 불꽃",
      icon: "",
      meta: [{ label: "시리즈 스킬", value: "의료" }],
      levelValues: [
        {
          rank: "1",
          description:
            "치유 효율 +10.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +9.0%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+10.0%" },
            { label: "팀 전체 공격력", value: "+9.0%" },
          ],
        },
        {
          rank: "2",
          description:
            "치유 효율 +12.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +10.8%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+12.0%" },
            { label: "팀 전체 공격력", value: "+10.8%" },
          ],
        },
        {
          rank: "3",
          description:
            "치유 효율 +14.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +12.6%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+14.0%" },
            { label: "팀 전체 공격력", value: "+12.6%" },
          ],
        },
        {
          rank: "4",
          description:
            "치유 효율 +16.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +14.4%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+16.0%" },
            { label: "팀 전체 공격력", value: "+14.4%" },
          ],
        },
        {
          rank: "5",
          description:
            "치유 효율 +18.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +16.2%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+18.0%" },
            { label: "팀 전체 공격력", value: "+16.2%" },
          ],
        },
        {
          rank: "6",
          description:
            "치유 효율 +20.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +18.0%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+20.0%" },
            { label: "팀 전체 공격력", value: "+18.0%" },
          ],
        },
        {
          rank: "7",
          description:
            "치유 효율 +22.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +19.8%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+22.0%" },
            { label: "팀 전체 공격력", value: "+19.8%" },
          ],
        },
        {
          rank: "8",
          description:
            "치유 효율 +24.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +21.6%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+24.0%" },
            { label: "팀 전체 공격력", value: "+21.6%" },
          ],
        },
        {
          rank: "9",
          description:
            "치유 효율 +28.0%\n장착자가 자신의 스킬로 치유한 후, 팀 전체의 공격력 +25.2%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "치유 효율", value: "+28.0%" },
            { label: "팀 전체 공격력", value: "+25.2%" },
          ],
        },
      ],
      compareRows: [
        {
          label: "치유 효율",
          values: ["+10.0%", "+12.0%", "+14.0%", "+16.0%", "+18.0%", "+20.0%", "+22.0%", "+24.0%", "+28.0%"],
        },
        {
          label: "팀 전체 공격력",
          values: ["+9.0%", "+10.8%", "+12.6%", "+14.4%", "+16.2%", "+18.0%", "+19.8%", "+21.6%", "+25.2%"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;