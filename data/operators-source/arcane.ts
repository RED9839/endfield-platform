const slug = "arcane";

// 출처: warfarin.wiki(/kr/operators/arcane) 실측. 스탯/재료 = turbo-stream .data(floor, 웹 요약 6종 일치 검증),
// 스킬 배율·설명·재능·잠재 = 웹페이지 실측. 결(Arcane)은 지능≥의지→진결·지혜(딜), 의지>지능→진결·의지(서폿) 듀얼폼.

const normalAndComboSkillUpgradeMaterials = [
      {
        level: "2",
        materials: [{ name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" }, { name: "칼코덴드라", count: 1, icon: "/items/칼코덴드라.webp" }, { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "3",
        materials: [{ name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" }, { name: "칼코덴드라", count: 2, icon: "/items/칼코덴드라.webp" }, { name: "탈로시안 화폐", count: 2700, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "4",
        materials: [{ name: "프로토콜 프리즘", count: 16, icon: "/items/프로토콜 프리즘.webp" }, { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" }, { name: "탈로시안 화폐", count: 3200, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "5",
        materials: [{ name: "프로토콜 프리즘", count: 21, icon: "/items/프로토콜 프리즘.webp" }, { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" }, { name: "탈로시안 화폐", count: 4200, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "6",
        materials: [{ name: "프로토콜 프리즘", count: 27, icon: "/items/프로토콜 프리즘.webp" }, { name: "크리소덴드라", count: 2, icon: "/items/크리소덴드라.webp" }, { name: "탈로시안 화폐", count: 5400, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "7",
        materials: [{ name: "프로토콜 프리즘 세트", count: 6, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" }, { name: "탈로시안 화폐", count: 8200, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "8",
        materials: [{ name: "프로토콜 프리즘 세트", count: 8, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" }, { name: "탈로시안 화폐", count: 10500, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "9",
        materials: [{ name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "비트로덴드라", count: 2, icon: "/items/비트로덴드라.webp" }, { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M1",
        materials: [{ name: "존속의 흔적", count: 1, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "타키온 차폐 구조체", count: 6, icon: "/items/타키온 차폐 구조체.webp" }, { name: "붉은 창 잎", count: 3, icon: "/items/붉은 창 잎.webp" }, { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M2",
        materials: [{ name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "타키온 차폐 구조체", count: 16, icon: "/items/타키온 차폐 구조체.webp" }, { name: "붉은 창 잎", count: 6, icon: "/items/붉은 창 잎.webp" }, { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M3",
        materials: [{ name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "타키온 차폐 구조체", count: 36, icon: "/items/타키온 차폐 구조체.webp" }, { name: "붉은 창 잎", count: 12, icon: "/items/붉은 창 잎.webp" }, { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" }],
      },
] as const;

const battleAndUltimateSkillUpgradeMaterials = [
      {
        level: "2",
        materials: [{ name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" }, { name: "칼코덴드라", count: 1, icon: "/items/칼코덴드라.webp" }, { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "3",
        materials: [{ name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" }, { name: "칼코덴드라", count: 2, icon: "/items/칼코덴드라.webp" }, { name: "탈로시안 화폐", count: 2700, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "4",
        materials: [{ name: "프로토콜 프리즘", count: 16, icon: "/items/프로토콜 프리즘.webp" }, { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" }, { name: "탈로시안 화폐", count: 3200, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "5",
        materials: [{ name: "프로토콜 프리즘", count: 21, icon: "/items/프로토콜 프리즘.webp" }, { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" }, { name: "탈로시안 화폐", count: 4200, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "6",
        materials: [{ name: "프로토콜 프리즘", count: 27, icon: "/items/프로토콜 프리즘.webp" }, { name: "크리소덴드라", count: 2, icon: "/items/크리소덴드라.webp" }, { name: "탈로시안 화폐", count: 5400, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "7",
        materials: [{ name: "프로토콜 프리즘 세트", count: 6, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" }, { name: "탈로시안 화폐", count: 8200, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "8",
        materials: [{ name: "프로토콜 프리즘 세트", count: 8, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" }, { name: "탈로시안 화폐", count: 10500, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "9",
        materials: [{ name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "비트로덴드라", count: 2, icon: "/items/비트로덴드라.webp" }, { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M1",
        materials: [{ name: "존속의 흔적", count: 1, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "3상 나노 플레이크 칩", count: 6, icon: "/items/3상 나노 플레이크 칩.webp" }, { name: "붉은 창 잎", count: 3, icon: "/items/붉은 창 잎.webp" }, { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M2",
        materials: [{ name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "3상 나노 플레이크 칩", count: 16, icon: "/items/3상 나노 플레이크 칩.webp" }, { name: "붉은 창 잎", count: 6, icon: "/items/붉은 창 잎.webp" }, { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M3",
        materials: [{ name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "3상 나노 플레이크 칩", count: 36, icon: "/items/3상 나노 플레이크 칩.webp" }, { name: "붉은 창 잎", count: 12, icon: "/items/붉은 창 잎.webp" }, { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" }],
      },
] as const;

const COMMON_LEVEL_UP_COSTS = [
  {
    to: 20,
    materials: [
      { name: "초급 작전 기록", count: 5, icon: "/items/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 2, icon: "/items/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 2, icon: "/items/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 820, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 40,
    materials: [
      { name: "초급 작전 기록", count: 3, icon: "/items/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 8, icon: "/items/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 24, icon: "/items/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 12540, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 60,
    materials: [
      { name: "초급 작전 기록", count: 4, icon: "/items/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 5, icon: "/items/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 47, icon: "/items/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 23900, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 80,
    materials: [
      { name: "초급 인지 매개체", count: 6, icon: "/items/초급 인지 매개체.webp" },
      { name: "고급 인지 매개체", count: 46, icon: "/items/고급 인지 매개체.webp" },
      { name: "탈로시안 화폐", count: 109180, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 90,
    materials: [
      { name: "고급 인지 매개체", count: 58, icon: "/items/고급 인지 매개체.webp" },
      { name: "탈로시안 화폐", count: 238980, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const arcaneOperatorDetailData = {
  slug,
  name: "결",
  enName: "Arcane",
  rarity: 6 as const,

  element: "nature" as const,
  class: "caster" as const,
  weaponType: "artsunit" as const,

  mainStatLabel: "지능",
  subStatLabel: "의지",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [9, 26, 45, 64, 82, 91],
      dex: [9, 27, 46, 65, 84, 93],
      int: [21, 54, 89, 124, 159, 176],
      will: [14, 37, 61, 85, 109, 121],
      atk: [30, 90, 153, 217, 280, 312],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        9, 10, 11, 12, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 25, 26,
        27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
        37, 38, 38, 39, 40, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 50, 51, 51, 52, 53, 54,
        55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
        64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
        74, 75, 76, 77, 77, 78, 79, 80, 81, 82,
        83, 84, 85, 86, 87, 88, 89, 89, 90, 91,
      ],

      dex: [
        9, 10, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
        28, 29, 30, 30, 31, 32, 33, 34, 35, 36,
        37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 50, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
        66, 67, 68, 69, 70, 70, 71, 72, 73, 74,
        75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
        85, 86, 87, 88, 89, 90, 91, 91, 92, 93,
      ],

      int: [
        21, 23, 25, 27, 28, 30, 32, 34, 35, 37,
        39, 41, 42, 44, 46, 47, 49, 51, 53, 54,
        56, 58, 60, 61, 63, 65, 67, 68, 70, 72,
        74, 75, 77, 79, 80, 82, 84, 86, 87, 89,
        91, 93, 94, 96, 98, 100, 101, 103, 105, 107,
        108, 110, 112, 113, 115, 117, 119, 120, 122, 124,
        126, 127, 129, 131, 133, 134, 136, 138, 139, 141,
        143, 145, 146, 148, 150, 152, 153, 155, 157, 159,
        160, 162, 164, 166, 167, 169, 171, 172, 174, 176,
      ],

      will: [
        14, 16, 17, 18, 19, 20, 22, 23, 24, 25,
        26, 28, 29, 30, 31, 32, 34, 35, 36, 37,
        38, 40, 41, 42, 43, 44, 46, 47, 48, 49,
        50, 52, 53, 54, 55, 56, 58, 59, 60, 61,
        62, 64, 65, 66, 67, 68, 70, 71, 72, 73,
        74, 76, 77, 78, 79, 80, 81, 83, 84, 85,
        86, 87, 89, 90, 91, 92, 93, 95, 96, 97,
        98, 99, 101, 102, 103, 104, 105, 107, 108, 109,
        110, 111, 113, 114, 115, 116, 117, 119, 120, 121,
      ],

      atk: [
        30, 33, 36, 39, 43, 46, 49, 52, 55, 58,
        62, 65, 68, 71, 74, 77, 81, 84, 87, 90,
        93, 96, 100, 103, 106, 109, 112, 115, 119, 122,
        125, 128, 131, 134, 138, 141, 144, 147, 150, 153,
        157, 160, 163, 166, 169, 172, 176, 179, 182, 185,
        188, 191, 195, 198, 201, 204, 207, 210, 214, 217,
        220, 223, 226, 229, 233, 236, 239, 242, 245, 248,
        252, 255, 258, 261, 264, 267, 271, 274, 277, 280,
        283, 286, 290, 293, 296, 299, 302, 305, 309, 312,
      ],

      hp: [
        500, 556, 612, 668, 724, 781, 837, 893, 949, 1005,
        1061, 1117, 1173, 1230, 1286, 1342, 1398, 1454, 1510, 1566,
        1622, 1679, 1735, 1791, 1847, 1903, 1959, 2015, 2071, 2128,
        2184, 2240, 2296, 2352, 2408, 2464, 2520, 2577, 2633, 2689,
        2745, 2801, 2857, 2913, 2969, 3026, 3082, 3138, 3194, 3250,
        3306, 3362, 3418, 3474, 3531, 3587, 3643, 3699, 3755, 3811,
        3867, 3923, 3980, 4036, 4092, 4148, 4204, 4260, 4316, 4372,
        4429, 4485, 4541, 4597, 4653, 4709, 4765, 4821, 4878, 4934,
        4990, 5046, 5102, 5158, 5214, 5270, 5327, 5383, 5439, 5495,
      ],
    },
  },

  elite: [
    {
      phase: "정예화 I",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 40레벨까지 증가",
      materials: [{ name: "프로토콜 디스크", count: 8, icon: "/items/프로토콜 디스크.webp" }, { name: "연한 붉은 기둥 버섯", count: 3, icon: "/items/연한 붉은 기둥 버섯.webp" }, { name: "탈로시안 화폐", count: 1600, icon: "/items/탈로시안 화폐.webp" }],
    },
    {
      phase: "정예화 II",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 60레벨까지 증가",
      materials: [{ name: "프로토콜 디스크", count: 25, icon: "/items/프로토콜 디스크.webp" }, { name: "보통 붉은 기둥 버섯", count: 5, icon: "/items/보통 붉은 기둥 버섯.webp" }, { name: "탈로시안 화폐", count: 6500, icon: "/items/탈로시안 화폐.webp" }],
    },
    {
      phase: "정예화 III",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 80레벨까지 증가",
      materials: [{ name: "프로토콜 디스크 세트", count: 24, icon: "/items/프로토콜 디스크 세트.webp" }, { name: "진한 붉은 기둥 버섯", count: 5, icon: "/items/진한 붉은 기둥 버섯.webp" }, { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" }],
    },
    {
      phase: "정예화 IV",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 90레벨까지 증가",
      materials: [{ name: "프로토콜 디스크 세트", count: 36, icon: "/items/프로토콜 디스크 세트.webp" }, { name: "3상 나노 플레이크 칩", count: 20, icon: "/items/3상 나노 플레이크 칩.webp" }, { name: "탈로스 버섯", count: 8, icon: "/items/탈로스 버섯.webp" }, { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" }],
    },
  ],

  skills: {
    normalAttack: {
      name: "중화력 요격",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 자연 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 17포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 자연 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 자연 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["19%", "21%", "22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "39%", "42%"] },
        { label: "일반 공격 제2단계 배율", values: ["21%", "23%", "26%", "28%", "30%", "32%", "34%", "36%", "38%", "41%", "44%", "48%"] },
        { label: "일반 공격 제3단계 배율", values: ["33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%", "64%", "69%", "75%"] },
        { label: "일반 공격 제4단계 배율", values: ["36%", "39%", "43%", "46%", "50%", "53%", "57%", "61%", "64%", "69%", "74%", "80%"] },
        { label: "일반 공격 제5단계 배율", values: ["47%", "52%", "56%", "61%", "66%", "71%", "75%", "80%", "85%", "90%", "98%", "106%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "결정 파쇄 그리드",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "목표의 발밑에 결정 파쇄 그리드를 생성합니다. 범위 내의 적에게 자연 피해를 주고, 자연 부착을 부여합니다.",
        "진결 · 지혜(지능 수치 ≥ 의지 수치): 주는 피해가 증가합니다.",
        "진결 · 의지(의지 수치 ＞ 지능 수치): 피해를 줄 때, 범위 내의 적을 중심으로 끌어당깁니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "진결 · 지혜 피해 배율", values: ["222%", "245%", "267%", "289%", "311%", "333%", "356%", "378%", "400%", "428%", "461%", "500%"] },
        { label: "진결 · 의지 피해 배율", values: ["133%", "147%", "160%", "173%", "187%", "200%", "213%", "227%", "240%", "257%", "277%", "300%"] },
      ],
    },

    comboSkill: {
      name: "응룡 4식",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "진결 · 지혜(지능 수치 ≥ 의지 수치): 자연 부착 또는 2스택 이상의 다른 아츠 부착이 부여된 적이 있을 때 발동할 수 있습니다. 목표에게 돌진하여 네 명의 전술 분신을 배치해 대상과 주변의 적에게 자연 취약과 냉기 취약을 부여하고, 자연 피해를 주며, 해당 목표를 구속 상태로 만듭니다. 구속 상태가 종료될 때, 전술 분신이 대상을 공격하고 폭발 피해를 줍니다.",
        "진결 · 지혜: 자신의 배틀 스킬이 구속 상태의 적에게 명중할 때, 일정량의 스킬 게이지를 반환하고, 구속 상태를 조기에 종료함과 동시에 폭발 피해를 주고, 다시 자연 취약과 냉기 취약을 부여하며, 잠시 후 여러 단계의 추가 피해를 줍니다. 연계 스킬의 쿨타임이 더 짧아집니다.",
        "진결 · 의지(의지 수치 ＞ 지능 수치): 아츠 부착이 부여된 적이 있을 때 발동할 수 있습니다. 목표에게 돌진하여 네 명의 전술 분신을 배치해 대상과 주변의 적에게 아츠 부착과 자연 취약, 냉기 취약을 부여하고, 자연 피해를 주며, 해당 목표를 구속 상태로 만듭니다. 의지는 연계 스킬이 부여하는 자연 취약과 냉기 취약 효과를 추가로 증가시킵니다.",
        "구속 상태: 모든 행동이 느려집니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "19s", "19s", "19s", "18s"] },
        { label: "기초 피해 배율", values: ["35%", "39%", "42%", "46%", "50%", "53%", "57%", "60%", "64%", "68%", "73%", "80%"] },
        { label: "기초 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "폭발 피해 배율", values: ["53%", "59%", "64%", "69%", "75%", "80%", "85%", "91%", "96%", "103%", "111%", "120%"] },
        { label: "폭발 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "획득하는 궁극기 에너지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "진결 · 지혜 · 구속 및 취약 지속 시간(초)", values: ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4"] },
        { label: "진결 · 지혜 · 취약 효과", values: ["4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%"] },
        { label: "진결 · 지혜 · 추가 피해 배율", values: ["222%", "244%", "266%", "289%", "311%", "333%", "355%", "377%", "400%", "427%", "461%", "500%"] },
        { label: "진결 · 지혜 · 추가 취약 지속 시간(초)", values: ["2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2"] },
        { label: "진결 · 지혜 · 스킬 게이지 반환", values: ["28", "28", "28", "28", "28", "28", "28", "28", "28", "30", "30", "30"] },
        { label: "진결 · 의지 · 구속 및 취약 지속 시간(초)", values: ["6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6"] },
        { label: "진결 · 의지 · 기초 취약 효과", values: ["4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%", "4%"] },
        { label: "진결 · 의지 · 의지가 제공하는 최대 추가 취약 효과", values: ["7%", "7%", "7%", "7%", "7%", "7%", "7%", "7%", "7.5%", "7.5%", "7.5%", "8%"] },
        { label: "진결 · 의지 · 최대 추가 취약 효과에 필요한 의지 수치", values: ["560", "560", "560", "560", "560", "560", "560", "560", "600", "600", "600", "640"] },
      ],
    },

    ultimate: {
      name: "어스름 파훼",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [{ label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" }],
      description: [
        "어스름 파훼의 진을 생성하여, 구역 내의 적에게 즉시 자연 피해를 줍니다.",
        "어스름 파훼의 진 내의 적이 처형되거나 메인 컨트롤 오퍼레이터의 강력한 일격을 받을 경우, 어스름 파훼의 진은 대상에게 집중 공격을 발동하여 범위 피해를 줍니다. 최대 2회까지 발동. 집중 공격이 2회 발동된 후, 궁극기가 어스름 파훼의 깨달음으로 전환됩니다.",
        "어스름 파훼의 깨달음: 전방 넓은 범위 내의 적에게 자연 피해를 줍니다.",
        "진결 · 지혜(지능 수치 ≥ 의지 수치): 어스름 파훼의 진이 생성될 때, 해당 구역 내의 적에게 강제로 부식을 부여합니다.",
        "진결 · 의지(의지 수치 ＞ 지능 수치): 어스름 파훼의 진이 생성될 때, 해당 구역 내의 아츠 부착 상태의 적에게 다시 해당 아츠 부착을 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"] },
        { label: "생성한 어스름 파훼의 진 피해 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
        { label: "생성한 어스름 파훼의 진 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "어스름 파훼의 진 지속 시간(초)", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
        { label: "어스름 파훼의 깨달음 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "진결 · 지혜 · 강제 부식 지속 시간(초)", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
        { label: "진결 · 지혜 · 집중 공격 총피해 배율", values: ["160%", "176%", "192%", "208%", "224%", "240%", "256%", "272%", "288%", "308%", "332%", "360%"] },
        { label: "진결 · 지혜 · 어스름 파훼의 깨달음 피해 배율", values: ["640%", "704%", "768%", "832%", "896%", "960%", "1024%", "1088%", "1152%", "1232%", "1328%", "1440%"] },
        { label: "진결 · 의지 · 집중 공격 총피해 배율", values: ["160%", "176%", "192%", "208%", "224%", "240%", "256%", "272%", "288%", "308%", "332%", "360%"] },
        { label: "진결 · 의지 · 어스름 파훼의 깨달음 피해 배율", values: ["160%", "176%", "192%", "208%", "224%", "240%", "256%", "272%", "288%", "308%", "332%", "360%"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "조류를 향한 시선",
      description: "연계 스킬 응룡 4식 효과가 강화됩니다. 피해 배율이 기존의 1.3배로 증가합니다. 진결 · 지혜: 자신의 배틀 스킬이 구속 상태의 적에게 명중할 때, 추가로 스킬 게이지를 10포인트 반환합니다. 진결 · 의지: 부여하는 자연 취약 및 냉기 취약 효과가 추가로 +6%.",
    },
    {
      title: "2",
      subtitle: "한결 같은 마음",
      description: "지능과 의지 +15, 오리지늄 아츠 강도 +16.",
    },
    {
      title: "3",
      subtitle: "끈기",
      description: "재능 무장 강화 효과가 강화됩니다. 자신이 부여하는 부식 효과의 지속 시간이 추가로 +5초, 감소하는 최대 저항이 추가로 기존의 20%만큼 증가합니다.",
    },
    {
      title: "4",
      subtitle: "흔들림 없는 정신",
      description: "궁극기 어스름 파훼의 사용에 필요한 궁극기 에너지 -15%.",
    },
    {
      title: "5",
      subtitle: "회상",
      description: "궁극기 어스름 파훼 효과가 강화됩니다. 진결 · 지혜: 궁극기 지속 중 추가로 16%의 아츠 증폭을 획득하며, 궁극기 2단계 어스름 파훼의 깨달음의 피해 배율이 기존의 1.3배로 증가합니다. 진결 · 의지: 궁극기 1단계 어스름 파훼의 진 및 2단계 어스름 파훼의 깨달음이 부여하는 자연 취약 및 냉기 취약 효과가 추가로 +7%, 궁극기 2단계 어스름 파훼의 깨달음 사용 후, 연계 스킬 응룡 4식이 쿨타임 상태라면 쿨타임을 즉시 30% 회복합니다.",
    },
  ],

  talents: [
    {
      name: "전략 수립",
      unlock: "Unlocked by default",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "자신의 지능 수치 ≥ 의지 수치일 경우, 스킬 형태가 진결 · 지혜로 전환됩니다. 그 반대의 경우 스킬 형태가 진결 · 의지로 전환됩니다. 두 진결의 능력치 조건은 오퍼레이터 레벨 증가, 재능, 잠재 능력, 장비 및 무기가 제공하는 패널 능력치의 영향만 받습니다.",
    },
    {
      name: "전략 수립",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "궁극기 어스름 파훼의 효과가 강화됩니다. 진결 · 지혜: 궁극기 지속 중, 자신이 24% 아츠 증폭을 획득합니다. 진결 · 의지: 궁극기 1단계 어스름 파훼의 진 및 2단계 어스름 파훼의 깨달음이 적에게 피해를 줄 때, [의지×0.02%]의 자연 취약 및 냉기 취약(최대 12.8%)을 부여합니다. 10초 동안 지속, 해당 효과는 중첩되지 않습니다.",
    },
    {
      name: "무장 강화",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "자신이 부여하는 부식 효과의 지속 시간 +5초, 감소하는 최대 저항이 기존의 1.05배로 증가합니다.",
    },
    {
      name: "무장 강화",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "자신이 부여하는 부식 효과의 지속 시간 +10초, 감소하는 최대 저항이 기존의 1.1배로 증가합니다.",
    },
  ],

  infrastructureSkills: [
    {
      name: "산을 따고, 바다를 끓여라!",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "재배실에 배치 시, 광물 재료의 육성 속도 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "재배실에 배치 시, 광물 재료의 육성 속도 30% 증가",
        },
      ],
    },
    {
      name: "식물 박사",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "재배실에 배치 시, 결정화 식물 재료의 육성 속도 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "재배실에 배치 시, 결정화 식물 재료의 육성 속도 30% 증가",
        },
      ],
    },
  ],

  trustBonus: [
    { level: 1, label: "지능·의지 +8" },
    { level: 2, label: "지능·의지 +10" },
    { level: 3, label: "지능·의지 +10" },
    { level: 4, label: "지능·의지 +15" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: [
      { stage: 1, trust: 20, elite: 1, materials: [{ name: "프로토콜 프리즘", count: 5, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" }] },
      { stage: 2, trust: 50, elite: 2, materials: [{ name: "프로토콜 프리즘", count: 10, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 1800, icon: "/items/탈로시안 화폐.webp" }] },
      { stage: 3, trust: 100, elite: 3, materials: [{ name: "프로토콜 프리즘 세트", count: 10, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "탈로시안 화폐", count: 6000, icon: "/items/탈로시안 화폐.webp" }] },
      { stage: 4, trust: 100, elite: 4, materials: [{ name: "프로토콜 프리즘 세트", count: 20, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "탈로시안 화폐", count: 12000, icon: "/items/탈로시안 화폐.webp" }] },
    ],
    infrastructure: [
      { slot: 1, stage: 1, elite: 1, materials: [{ name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 1600, icon: "/items/탈로시안 화폐.webp" }] },
      { slot: 1, stage: 2, elite: 3, materials: [{ name: "프로토콜 프리즘 세트", count: 12, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "탈로시안 화폐", count: 8000, icon: "/items/탈로시안 화폐.webp" }] },
      { slot: 2, stage: 1, elite: 2, materials: [{ name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 3000, icon: "/items/탈로시안 화폐.webp" }] },
      { slot: 2, stage: 2, elite: 4, materials: [{ name: "프로토콜 프리즘 세트", count: 20, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "탈로시안 화폐", count: 20000, icon: "/items/탈로시안 화폐.webp" }] },
    ],
    talents: [
      { talent: 1, stage: 2, elite: 2, materials: [{ name: "프로토콜 프리즘", count: 48, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 10800, icon: "/items/탈로시안 화폐.webp" }] },
      { talent: 2, stage: 1, elite: 1, materials: [{ name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 2400, icon: "/items/탈로시안 화폐.webp" }] },
      { talent: 2, stage: 2, elite: 3, materials: [{ name: "프로토콜 프리즘 세트", count: 36, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "탈로시안 화폐", count: 32000, icon: "/items/탈로시안 화폐.webp" }] },
    ],
  },
} as const;
