const slug = "perlica";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준:
// 앞 핵심 재료 = 초거리 빛 반사 파이프
// 뒤 핵심 재료 = D96강 시제품 4번

const normalAndComboSkillUpgradeMaterials = [
  {
    level: "2",
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 1, icon: "/materials/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "3",
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 2, icon: "/materials/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 2700, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "4",
    materials: [
      { name: "프로토콜 프리즘", count: 16, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 3200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "5",
    materials: [
      { name: "프로토콜 프리즘", count: 21, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 4200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "6",
    materials: [
      { name: "프로토콜 프리즘", count: 27, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 2, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 5400, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "7",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 6, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 8200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "8",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 8, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 10500, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "9",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 2, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 18000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M1",
    materials: [
      { name: "존속의 흔적", count: 1, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 6, icon: "/materials/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 16, icon: "/materials/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 36, icon: "/materials/초거리 빛 반사 파이프.webp" },
      { name: "침식된 옥 잎", count: 12, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const battleAndUltimateSkillUpgradeMaterials = [
  {
    level: "2",
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 1, icon: "/materials/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "3",
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 2, icon: "/materials/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 2700, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "4",
    materials: [
      { name: "프로토콜 프리즘", count: 16, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 3200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "5",
    materials: [
      { name: "프로토콜 프리즘", count: 21, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 4200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "6",
    materials: [
      { name: "프로토콜 프리즘", count: 27, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 2, icon: "/materials/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 5400, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "7",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 6, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 8200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "8",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 8, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 10500, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "9",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 2, icon: "/materials/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 18000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M1",
    materials: [
      { name: "존속의 흔적", count: 1, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "D96강 시제품 4번", count: 6, icon: "/materials/D96강 시제품 4번.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "D96강 시제품 4번", count: 16, icon: "/materials/D96강 시제품 4번.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "D96강 시제품 4번", count: 36, icon: "/materials/D96강 시제품 4번.webp" },
      { name: "침식된 옥 잎", count: 12, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_LEVEL_UP_COSTS = [
  {
    to: 20,
    materials: [
      { name: "초급 작전 기록", count: 5, icon: "/materials/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 2, icon: "/materials/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 2, icon: "/materials/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 820, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 40,
    materials: [
      { name: "초급 작전 기록", count: 3, icon: "/materials/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 8, icon: "/materials/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 24, icon: "/materials/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 12540, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 60,
    materials: [
      { name: "초급 작전 기록", count: 4, icon: "/materials/초급 작전 기록.webp" },
      { name: "중급 작전 기록", count: 5, icon: "/materials/중급 작전 기록.webp" },
      { name: "고급 작전 기록", count: 47, icon: "/materials/고급 작전 기록.webp" },
      { name: "탈로시안 화폐", count: 23900, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 80,
    materials: [
      { name: "초급 인지 매개체", count: 6, icon: "/materials/초급 인지 매개체.webp" },
      { name: "고급 인지 매개체", count: 46, icon: "/materials/고급 인지 매개체.webp" },
      { name: "탈로시안 화폐", count: 109180, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    to: 90,
    materials: [
      { name: "고급 인지 매개체", count: 58, icon: "/materials/고급 인지 매개체.webp" },
      { name: "탈로시안 화폐", count: 238980, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const PERLICA_TRUST_BONUS_COSTS = [
  {
    stage: 1,
    trust: 20,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 5, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 2,
    trust: 50,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 10, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1800, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 3,
    trust: 100,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 10, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 6000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 4,
    trust: 100,
    elite: 4,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 20, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 12000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_INFRASTRUCTURE_COSTS = [
  {
    slot: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1600, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 1,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 12, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 8000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 3000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 2,
    stage: 2,
    elite: 4,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 20, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 20000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

const PERLICA_TALENT_COSTS = [
  {
    talent: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 2400, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 1,
    stage: 2,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 48, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 10800, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 36, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 32000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const perlicaOperatorDetailData = {
  slug,
  name: "펠리카",
  enName: "Perlica",
  rarity: 5 as const,

  element: "electric" as const,
  class: "caster" as const,
  weaponType: "아츠 유닛",

  mainStatLabel: "지능",
  subStatLabel: "의지",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [9, 26, 45, 64, 82, 91],
      dex: [9, 27, 46, 65, 84, 93],
      int: [21, 51, 83, 114, 145, 161],
      will: [13, 34, 57, 79, 102, 113],
      atk: [30, 88, 150, 211, 272, 303],
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
        82, 83, 84, 85, 86, 87, 88, 89, 89, 90,
        91,
      ],

      dex: [
        9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
        28, 29, 30, 31, 32, 33, 34, 35, 36, 36,
        37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 50, 51, 52, 53, 54, 55, 55,
        56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
        66, 67, 68, 69, 70, 71, 72, 73, 73, 74,
        75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
        84, 85, 86, 87, 88, 89, 90, 91, 92, 92,
        93,
      ],

      int: [
        21, 23, 24, 26, 27, 29, 31, 32, 34, 35,
        37, 38, 40, 42, 43, 45, 46, 48, 49, 51,
        53, 54, 56, 57, 59, 60, 62, 64, 65, 67,
        68, 70, 72, 73, 75, 76, 78, 79, 81, 83,
        84, 86, 87, 89, 90, 92, 94, 95, 97, 98,
        100, 101, 103, 105, 106, 108, 109, 111, 112, 114,
        116, 117, 119, 120, 122, 123, 125, 127, 128, 130,
        131, 133, 134, 136, 138, 139, 141, 142, 144, 145,
        147, 149, 150, 152, 153, 155, 156, 158, 160, 161,
      ],

      will: [
        13, 14, 15, 16, 18, 19, 20, 21, 22, 23,
        24, 25, 27, 28, 29, 30, 31, 32, 33, 34,
        36, 37, 38, 39, 40, 41, 42, 43, 45, 46,
        47, 48, 49, 50, 51, 52, 54, 55, 56, 57,
        58, 59, 60, 61, 63, 64, 65, 66, 67, 68,
        69, 70, 72, 73, 74, 75, 76, 77, 78, 79,
        81, 82, 83, 84, 85, 86, 87, 88, 89, 91,
        92, 93, 94, 95, 96, 97, 98, 100, 101, 102,
        103, 104, 105, 106, 107, 109, 110, 111, 112, 113,
      ],

      atk: [
        30, 33, 36, 39, 42, 45, 48, 51, 55, 58,
        61, 64, 67, 70, 73, 76, 79, 82, 85, 88,
        91, 94, 97, 101, 104, 107, 110, 113, 116, 119,
        122, 125, 128, 131, 134, 137, 140, 143, 147, 150,
        153, 156, 159, 162, 165, 168, 171, 174, 177, 180,
        183, 186, 189, 193, 196, 199, 202, 205, 208, 211,
        214, 217, 220, 223, 226, 229, 232, 235, 238, 242,
        245, 248, 251, 254, 257, 260, 263, 266, 269, 272,
        275, 278, 281, 284, 288, 291, 294, 297, 300, 303,
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
      materials: [
        { name: "프로토콜 디스크", count: 8, icon: "/materials/프로토콜 디스크.webp" },
        { name: "연한 붉은 기둥 버섯", count: 3, icon: "/materials/연한 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 1600, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 II",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 60레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크", count: 25, icon: "/materials/프로토콜 디스크.webp" },
        { name: "보통 붉은 기둥 버섯", count: 5, icon: "/materials/보통 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 6500, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 III",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 80레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크 세트", count: 24, icon: "/materials/프로토콜 디스크 세트.webp" },
        { name: "진한 붉은 기둥 버섯", count: 5, icon: "/materials/진한 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 18000, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 IV",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 90레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크 세트", count: 36, icon: "/materials/프로토콜 디스크 세트.webp" },
        { name: "타키온 차폐 구조체", count: 20, icon: "/materials/타키온 차폐 구조체.webp" },
        { name: "피버섯", count: 8, icon: "/materials/피버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
  ],

  talents: [
    {
      name: "오블리터레이션 프로토콜",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "불균형 상태의 적에게 주는 피해 +20%",
    },
    {
      name: "오블리터레이션 프로토콜",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "불균형 상태의 적에게 주는 피해 +30%",
    },
    {
      name: "순환 프로토콜",
      unlock: "Promote to E3 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "연계 스킬 실시간 프로토콜 · 연쇄 섬광이 방어 불능 상태의 적에게 명중했을 때, 스킬이 1회 더 튕깁니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "위기 대책",
      description: "연계 스킬 실시간 프로토콜 · 연쇄 섬광이 부여하는 감전의 지속 시간 +75%",
    },
    {
      title: "2",
      subtitle: "협상의 기술",
      description: "궁극기 프로토콜ε · 70.41κ의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "3",
      subtitle: "감독관의 책임",
      description: "펠리카가 적에게 감전을 부여한 후, 5초 동안 공격력 +20%, 해당 효과는 최대 2스택까지 중첩됩니다.",
    },
    {
      title: "4",
      subtitle: "계속되는 가르침",
      description: "연계 스킬 실시간 프로토콜 · 연쇄 섬광이 부여하는 감전의 적이 받는 아츠 피해 증가 효과가 기존의 1.33배로 증가",
    },
    {
      title: "5",
      subtitle: "재진입 통제 시스템",
      description: "궁극기 프로토콜ε · 70.41κ의 치명타 확률 +30%",
    },
  ],

  skills: {
    normalAttack: {
      name: "프로토콜α · 돌파",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 4단 공격을 하여 전기 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 15포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 전기 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 전기 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["25%", "28%", "31%", "33%", "36%", "38%", "41%", "43%", "46%", "49%", "53%", "57%"] },
        { label: "일반 공격 제2단계 배율", values: ["30%", "33%", "36%", "39%", "42%", "45%", "48%", "51%", "54%", "58%", "62%", "68%"] },
        { label: "일반 공격 제3단계 배율", values: ["37%", "41%", "45%", "48%", "52%", "56%", "59%", "63%", "67%", "71%", "77%", "84%"] },
        { label: "일반 공격 제4단계 배율", values: ["57%", "62%", "68%", "73%", "79%", "85%", "90%", "96%", "102%", "109%", "117%", "127%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "프로토콜ω · 뇌격",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "하늘에서 전기 에너지를 떨어뜨려, 좁은 범위 내의 적에게 전기 피해를 주고 전기 부착 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["178%", "196%", "213%", "231%", "249%", "267%", "285%", "302%", "320%", "342%", "369%", "400%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    comboSkill: {
      name: "실시간 프로토콜 · 연쇄 섬광",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "메인 컨트롤 오퍼레이터가 적에게 강력한 일격 피해를 준 다음 사용할 수 있습니다.",
        "누적된 전기 에너지를 방출해 목표를 강타하며 전기 피해를 주고, 짧은 강제 감전 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "19s"] },
        { label: "피해 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "감전 시간(초)", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
      ],
    },

    ultimate: {
      name: "프로토콜ε · 70.41κ",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "10초" },
      ],
      description: [
        "즉시 거대한 궤도 부유물을 전송하여 목표 구역에 치명적인 타격을 줍니다. 구역 내의 적은 대량의 전기 피해를 받습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["80", "80", "80", "80", "80", "80", "80", "80", "80", "80", "80", "80"] },
        { label: "피해 배율", values: ["445%", "489%", "534%", "578%", "622%", "667%", "711%", "756%", "800%", "856%", "923%", "1000%"] },
        { label: "불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
      ],
    },
  },

  infrastructureSkills: [
    {
      name: "감독관",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 8% 증가",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 3 달성 시 업그레이드 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 12% 증가",
        },
      ],
    },
    {
      name: "프로토콜 관리",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "제조실에 배치 시, 무기 경험치 재료의 생산 효율 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "제조실에 배치 시, 무기 경험치 재료의 생산 효율 30% 증가",
        },
      ],
    },
  ],

  trustBonus: [
    { level: 1, label: "지능 +10" },
    { level: 2, label: "지능 +15" },
    { level: 3, label: "지능 +15" },
    { level: 4, label: "지능 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: PERLICA_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: PERLICA_TALENT_COSTS,
  },
} as const;