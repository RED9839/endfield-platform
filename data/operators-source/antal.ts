const slug = "antal";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준:
// 앞 핵심 재료 = D96강 시제품 4번
// 뒤 핵심 재료 = 타키온 차폐 구조체

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
      { name: "타키온 차폐 구조체", count: 6, icon: "/materials/타키온 차폐 구조체.webp" },
      { name: "침식된 옥 잎", count: 3, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 16, icon: "/materials/타키온 차폐 구조체.webp" },
      { name: "침식된 옥 잎", count: 6, icon: "/materials/침식된 옥 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 36, icon: "/materials/타키온 차폐 구조체.webp" },
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

const COMMON_TRUST_BONUS_COSTS = [
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

const ANTAL_TALENT_COSTS = [
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
      { name: "프로토콜 프리즘", count: 40, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 8600, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 48, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 10000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 28, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const antalOperatorDetailData = {
  slug,
  name: "안탈",
  enName: "Antal",
  rarity: 4 as const,

  element: "electric" as const,
  class: "supporter" as const,
  weaponType: "아츠 유닛",

  mainStatLabel: "지능",
  subStatLabel: "힘",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [15, 40, 65, 91, 116, 129],
      dex: [9, 25, 43, 60, 78, 86],
      int: [15, 47, 81, 114, 148, 165],
      will: [9, 25, 41, 58, 74, 82],
      atk: [30, 87, 147, 207, 267, 297],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        15, 17, 18, 19, 20, 22, 23, 24, 26, 27,
        28, 29, 31, 32, 33, 35, 36, 37, 38, 40,
        41, 42, 43, 45, 46, 47, 49, 50, 51, 52,
        54, 55, 56, 57, 59, 60, 61, 63, 64, 65,
        66, 68, 69, 70, 71, 73, 74, 75, 77, 78,
        79, 80, 82, 83, 84, 86, 87, 88, 89, 91,
        92, 93, 94, 96, 97, 98, 100, 101, 102, 103,
        105, 106, 107, 108, 110, 111, 112, 114, 115, 116,
        117, 119, 120, 121, 122, 124, 125, 126, 128, 129,
      ],

      dex: [
        9, 10, 11, 12, 12, 13, 14, 15, 16, 17,
        18, 19, 19, 20, 21, 22, 23, 24, 25, 25,
        26, 27, 28, 29, 30, 31, 32, 32, 33, 34,
        35, 36, 37, 38, 39, 39, 40, 41, 42, 43,
        44, 45, 45, 46, 47, 48, 49, 50, 51, 52,
        52, 53, 54, 55, 56, 57, 58, 59, 59, 60,
        61, 62, 63, 64, 65, 65, 66, 67, 68, 69,
        70, 71, 72, 72, 73, 74, 75, 76, 77, 78,
        79, 80, 81, 82, 83, 84, 85, 85, 86,
      ],

      int: [
        15, 17, 18, 20, 22, 23, 25, 27, 28, 30,
        32, 33, 35, 37, 39, 40, 42, 44, 45, 47,
        49, 50, 52, 54, 55, 57, 59, 60, 62, 64,
        65, 67, 69, 70, 72, 74, 76, 77, 79, 81,
        82, 84, 86, 87, 89, 91, 92, 94, 96, 97,
        99, 101, 102, 104, 106, 108, 109, 111, 113, 114,
        116, 118, 119, 121, 123, 124, 126, 128, 129, 131,
        133, 134, 136, 138, 139, 141, 143, 145, 146, 148,
        150, 151, 153, 155, 156, 158, 160, 161, 163, 165,
      ],

      will: [
        9, 10, 11, 12, 13, 13, 14, 15, 16, 17,
        17, 18, 19, 20, 21, 22, 22, 23, 24, 25,
        26, 27, 27, 28, 29, 30, 31, 31, 32, 33,
        34, 35, 36, 36, 37, 38, 39, 40, 40, 41,
        42, 43, 44, 45, 45, 46, 47, 48, 49, 49,
        50, 51, 52, 53, 54, 54, 55, 56, 57, 58,
        59, 60, 61, 62, 63, 63, 64, 65, 66, 67,
        68, 68, 69, 70, 71, 72, 72, 73, 74, 74,
        75, 76, 77, 77, 78, 79, 80, 81, 81, 82,
      ],

      atk: [
        30, 33, 36, 39, 42, 45, 48, 51, 54, 57,
        60, 63, 66, 69, 72, 75, 78, 81, 84, 87,
        90, 93, 96, 99, 102, 105, 108, 111, 114, 117,
        120, 123, 126, 129, 132, 135, 138, 141, 144, 147,
        150, 153, 156, 159, 162, 165, 168, 171, 174, 177,
        180, 183, 186, 189, 192, 195, 198, 201, 204, 207,
        210, 213, 216, 219, 222, 225, 228, 231, 234, 237,
        240, 243, 246, 249, 252, 255, 258, 261, 264, 267,
        270, 273, 276, 279, 282, 285, 288, 291, 294, 297,
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
        { name: "초거리 빛 반사 파이프", count: 20, icon: "/materials/초거리 빛 반사 파이프.webp" },
        { name: "스타게이트 버섯", count: 8, icon: "/materials/스타게이트 버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
  ],

  talents: [
    {
      name: "즉흥적인 천재성",
      unlock: "정예화 단계 1 달성 시 해제 가능",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "증폭 상태의 팀원이 스킬 피해를 준 후, 안탈이 해당 오퍼레이터의 생명력을 [72+힘×0.6]포인트의 회복시킵니다. 30초 동안 최대 1회만 회복시킵니다.",
    },
    {
      name: "즉흥적인 천재성",
      unlock: "정예화 단계 2 달성 시 활성화 가능",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "증폭 상태의 팀원이 스킬 피해를 준 후, 안탈이 해당 오퍼레이터의 생명력을 [72+힘×0.6]포인트의 회복시킵니다. 30초 동안 최대 1회만 회복시킵니다.",
    },
    {
      name: "무의식",
      unlock: "정예화 단계 2 달성 시 해제 가능",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "30%의 확률로 물리 피해에 면역되고, 자기 생명력을 [27+힘×0.23]포인트 회복합니다.",
    },
    {
      name: "무의식",
      unlock: "정예화 단계 3 달성 시 활성화 가능",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "30%의 확률로 물리 피해에 면역되고, 자기 생명력을 [45+힘×0.38]포인트 회복합니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "아츠 적성",
      description:
        "궁극기 오버클록 타임이 제공하는 전기 증폭과 열기 증폭의 효과가 기존의 1.1배로 증가합니다.",
    },
    {
      title: "2",
      subtitle: "자동화 개량",
      description: "궁극기 오버클록 타임의 사용에 필요한 궁극기 에너지 -10%",
    },
    {
      title: "3",
      subtitle: "오리지늄 이론 응용",
      description:
        "포커싱 당한 적이 포커싱이 지속되는 동안 처치되면, 스킬 게이지 15포인트를 반환합니다.",
    },
    {
      title: "4",
      subtitle: "할머니의 말씀",
      description: "지능 +10, 최대 생명력 +10%",
    },
    {
      title: "5",
      subtitle: "고사양 기술 테스트",
      description:
        "같은 목표에 20초 동안 포커싱한 후, 전기 취약과 열기 취약 효과가 4% 증가합니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "교환 전류",
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
        { label: "일반 공격 제1단계 배율", values: ["23%", "25%", "28%", "30%", "32%", "35%", "37%", "39%", "41%", "44%", "48%", "52%"] },
        { label: "일반 공격 제2단계 배율", values: ["28%", "31%", "34%", "36%", "39%", "42%", "45%", "48%", "50%", "54%", "58%", "63%"] },
        { label: "일반 공격 제3단계 배율", values: ["34%", "37%", "41%", "44%", "48%", "51%", "54%", "58%", "61%", "65%", "71%", "77%"] },
        { label: "일반 공격 제4단계 배율", values: ["51%", "56%", "61%", "66%", "71%", "77%", "82%", "87%", "92%", "98%", "106%", "115%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "지정 연구 대상",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "적을 오랜 시간 포커싱하여 전기 피해를 줍니다. 포커싱 당한 적에게 전기 취약과 열기 취약 상태를 부여하고, 최대 1명의 적만 포커싱할 수 있습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["89%", "98%", "107%", "116%", "124%", "133%", "142%", "151%", "160%", "171%", "185%", "200%"] },
        { label: "지속 시간(초)", values: ["60", "60", "60", "60", "60", "60", "60", "60", "60", "60", "60", "60"] },
        { label: "전기 취약 효과", values: ["5%", "5%", "6%", "6%", "7%", "7%", "8%", "8%", "8%", "9%", "9%", "10%"] },
        { label: "열기 취약 효과", values: ["5%", "5%", "6%", "6%", "7%", "7%", "8%", "8%", "8%", "9%", "9%", "10%"] },
      ],
    },

    comboSkill: {
      name: "자기 폭풍 실험장",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "포커싱 당한 적이 물리 이상 효과 혹은 아츠 부착 상태일 때 사용할 수 있습니다.",
        "해당 적에게 에너지 폭발 1회를 일으켜 전기 피해를 주고, 다시 대상에게 해당 물리 이상 효과 혹은 아츠 부착 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["25s", "25s", "25s", "25s", "25s", "25s", "25s", "25s", "25s", "25s", "25s", "24s"] },
        { label: "피해 배율", values: ["151%", "166%", "181%", "196%", "211%", "227%", "242%", "257%", "272%", "291%", "313%", "340%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    ultimate: {
      name: "오버클록 타임",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "20초" },
      ],
      description: ["팀 전체에게 일정 시간 동안 전기 증폭과 열기 증폭을 부여합니다."],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"] },
        { label: "전기 증폭 효과", values: ["8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "20%"] },
        { label: "열기 증폭 효과", values: ["8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "20%"] },
        { label: "지속 시간(초)", values: ["12", "12", "12", "12", "12", "12", "12", "12", "12", "12", "12", "12"] },
      ],
    },
  },

  infrastructureSkills: [
  {
    name: "실험적 아츠 유닛",
    icon: `/operators/${slug}/infrastructure/skill1.webp`,
    levels: [
      {
        tier: "α",
        unlockText: "정예화 단계 1 달성 시 해제 가능",
        description: "제조실에 배치 시, 무기 경험치 재료의 생산 효율 10% 증가",
      },
      {
        tier: "β",
        unlockText: "정예화 단계 3 달성 시 활성화 가능",
        description: "제조실에 배치 시, 무기 경험치 재료의 생산 효율 20% 증가",
      },
    ],
  },
  {
    name: "썰렁한 농담 배우기",
    icon: `/operators/${slug}/infrastructure/skill2.webp`,
    levels: [
      {
        tier: "α",
        unlockText: "정예화 단계 2 달성 시 해제 가능",
        description: "재배실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
      },
      {
        tier: "β",
        unlockText: "정예화 단계 4 달성 시 활성화 가능",
        description: "재배실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 18% 감소",
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
    trustBonus: COMMON_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: ANTAL_TALENT_COSTS,
  },
} as const;