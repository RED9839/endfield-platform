const slug = "zhuangfangyi";

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

const ZHUANGFANGYI_TALENT_COSTS = [
  {
    talent: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "탈로시안 화폐", count: 2400, icon: "/materials/탈로시안 화폐.webp" },
      { name: "프로토콜 프리즘", count: 12, icon: "/materials/프로토콜 프리즘.webp" },
    ],
  },
  {
    talent: 1,
    stage: 2,
    elite: 2,
    materials: [
      { name: "탈로시안 화폐", count: 8600, icon: "/materials/탈로시안 화폐.webp" },
      { name: "프로토콜 프리즘", count: 40, icon: "/materials/프로토콜 프리즘.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "탈로시안 화폐", count: 10800, icon: "/materials/탈로시안 화폐.webp" },
      { name: "프로토콜 프리즘", count: 48, icon: "/materials/프로토콜 프리즘.webp" },
    ],
  },
  {
    talent: 2,
    stage: 2,
    elite: 3,
    materials: [
      { name: "탈로시안 화폐", count: 24600, icon: "/materials/탈로시안 화폐.webp" },
      { name: "프로토콜 프리즘 세트", count: 28, icon: "/materials/프로토콜 프리즘 세트.webp" },
    ],
  },
] as const;

export const zhuangfangyiOperatorDetailData = {
  slug,
  name: "장방이",
  enName: "Zhuang Fangyi",
  rarity: 6 as const,

  element: "electric" as const,
  class: "striker" as const,
  weaponType: "artsunit" as const,

  mainStatLabel: "의지",
  subStatLabel: "지능",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [10, 29, 49, 69, 89, 99],
      dex: [10, 29, 49, 69, 89, 99],
      int: [17, 39, 63, 87, 111, 123],
      will: [24, 58, 94, 130, 166, 184],
      atk: [30, 93, 160, 227, 293, 326],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        49, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
        68, 69, 69, 70, 71, 72, 73, 74, 75, 76,
        77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
        87, 88, 89, 89, 90, 91, 92, 93, 94, 95,
        96, 97, 98, 99,
      ],

      dex: [
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        49, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
        68, 69, 69, 70, 71, 72, 73, 74, 75, 76,
        77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
        87, 88, 89, 89, 90, 91, 92, 93, 94, 95,
        96, 97, 98, 99,
      ],

      int: [
        17, 18, 19, 20, 21, 23, 24, 25, 26, 27,
        29, 30, 31, 32, 33, 35, 36, 37, 38, 39,
        39, 41, 42, 43, 44, 45, 47, 48, 49, 50,
        51, 53, 54, 55, 56, 57, 59, 60, 61, 62,
        63, 63, 65, 66, 67, 68, 69, 71, 72, 73,
        74, 75, 77, 78, 79, 80, 81, 83, 84, 85,
        86, 87, 87, 89, 90, 91, 92, 93, 95, 96,
        97, 98, 99, 101, 102, 103, 104, 105, 107, 108,
        109, 110, 111, 111, 113, 114, 115, 116, 117, 119,
        120, 121, 122, 123,
      ],

      will: [
        24, 26, 28, 30, 31, 33, 35, 37, 39, 40,
        42, 44, 46, 48, 49, 51, 53, 55, 57, 58,
        58, 60, 62, 64, 65, 67, 69, 71, 73, 74,
        76, 78, 80, 82, 83, 85, 87, 89, 91, 92,
        94, 94, 96, 98, 100, 101, 103, 105, 107, 108,
        110, 112, 114, 116, 117, 119, 121, 123, 125, 126,
        128, 130, 130, 132, 134, 135, 137, 139, 141, 143,
        144, 146, 148, 150, 152, 153, 155, 157, 159, 160,
        162, 164, 166, 166, 168, 169, 171, 173, 175, 177,
        178, 180, 182, 184,
      ],

      atk: [
        30, 33, 37, 40, 43, 47, 50, 53, 57, 60,
        63, 67, 70, 73, 77, 80, 83, 87, 90, 93,
        93, 97, 100, 103, 107, 110, 113, 117, 120, 123,
        127, 130, 133, 137, 140, 143, 147, 150, 153, 157,
        160, 160, 163, 167, 170, 173, 177, 180, 183, 187,
        190, 193, 197, 200, 203, 207, 210, 213, 217, 220,
        223, 227, 227, 230, 233, 236, 240, 243, 246, 250,
        253, 256, 260, 263, 266, 270, 273, 276, 280, 283,
        286, 290, 293, 293, 296, 300, 303, 306, 310, 313,
        316, 320, 323, 326,
      ],

      hp: [
        500, 556, 612, 668, 724, 781, 837, 893, 949, 1005,
        1061, 1117, 1173, 1230, 1286, 1342, 1398, 1454, 1510, 1566,
        1566, 1622, 1679, 1735, 1791, 1847, 1903, 1959, 2015, 2071,
        2128, 2184, 2240, 2296, 2352, 2408, 2464, 2520, 2577, 2633,
        2689, 2689, 2745, 2801, 2857, 2913, 2969, 3026, 3082, 3138,
        3194, 3250, 3306, 3362, 3418, 3474, 3531, 3587, 3643, 3699,
        3755, 3811, 3811, 3867, 3923, 3980, 4036, 4092, 4148, 4204,
        4260, 4316, 4372, 4429, 4485, 4541, 4597, 4653, 4709, 4765,
        4821, 4878, 4934, 4934, 4990, 5046, 5102, 5158, 5214, 5270,
        5327, 5383, 5439, 5495,
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
        { name: "3상 나노 플레이크 칩", count: 20, icon: "/materials/3상 나노 플레이크 칩.webp" },
        { name: "스타게이트 버섯", count: 8, icon: "/materials/스타게이트 버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
  ],

  talents: [
    {
      name: "천지의 조화",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "배틀 스킬 뇌정의 부름을 사용할 때, 자신에게 9%의 전기 증폭을 부여합니다. 5초 동안 지속. 배틀 스킬의 뇌격이 적에게 명중할 때, 해당 효과 +1%. 배틀 스킬 뇌정의 부름을 사용할 때마다 전기 증폭 효과는 초기화됩니다.",
    },
    {
      name: "천지의 조화",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "배틀 스킬 뇌정의 부름을 사용할 때, 자신에게 18%의 전기 증폭을 부여합니다. 5초 동안 지속. 배틀 스킬의 뇌격이 적에게 명중할 때, 해당 효과 +2%. 배틀 스킬 뇌정의 부름을 사용할 때마다 전기 증폭 효과는 초기화됩니다.",
    },
    {
      name: "하늘의 가호",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "9% 확률로 피해를 면역합니다. 근처에 존재하는 청뢰검 1자루마다 해당 확률 +1%. 피해 면역 효과를 발동한 후, 자기 최대 생명력 9%의 생명력을 회복합니다. 99초마다 최대 1회만 회복합니다.",
    },
    {
      name: "하늘의 가호",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "9% 확률로 피해를 면역합니다. 근처에 존재하는 청뢰검 1자루마다 해당 확률 +1%. 피해 면역 효과를 발동한 후, 자기 최대 생명력 18%의 생명력을 회복합니다. 99초마다 최대 1회만 회복합니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "화합",
      description:
        "배틀 스킬 뇌정의 부름의 피해 배율이 기존의 1.15배로 증가합니다. 또한 전투 진입 후, 가장 처음 사용하는 배틀 스킬이 청뢰검 1자루를 추가로 생성합니다. 추가로 생성하는 청뢰검은 한 번의 배틀 스킬로 생성할 수 있는 청뢰검의 수량 제한을 무시합니다.",
    },
    {
      title: "2",
      subtitle: "통찰",
      description: "의지 +20, 배틀 스킬 피해 +{NormalSkillDamageIncrease:0%}",
    },
    {
      title: "3",
      subtitle: "감응",
      description:
        "배틀 스킬 뇌정의 부름이 감전을 소모한 후, 10포인트의 스킬 게이지를 반환합니다. 청뢰검의 지속 시간 +10초.",
    },
    {
      title: "4",
      subtitle: "결심",
      description: "궁극기 심판의 폭풍의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "격변",
      description:
        "천리의 경지 상태에서 자신이 주는 피해가 적의 전기 저항 15포인트를 무시합니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "전격술",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 전기 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 18포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 전기 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 전기 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["16%", "18%", "19%", "21%", "22%", "24%", "26%", "27%", "29%", "31%", "33%", "36%"] },
        { label: "일반 공격 제2단계 배율", values: ["24%", "26%", "29%", "31%", "34%", "36%", "38%", "41%", "43%", "46%", "50%", "54%"] },
        { label: "일반 공격 제3단계 배율", values: ["32%", "35%", "39%", "42%", "45%", "48%", "52%", "55%", "58%", "62%", "67%", "72%"] },
        { label: "일반 공격 제4단계 배율", values: ["45%", "50%", "54%", "59%", "63%", "68%", "72%", "77%", "81%", "87%", "93%", "101%"] },
        { label: "일반 공격 제5단계 배율", values: ["48%", "53%", "58%", "62%", "67%", "72%", "77%", "82%", "86%", "92%", "100%", "108%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "뇌정의 부름",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      description: [
        "목표의 감전 상태를 소모하여 이번 배틀 스킬의 피해 배율을 증가시키고, 소모한 감전 상태의 이상 레벨 +1자루의 청뢰검을 생성합니다. 현재 존재하는 청뢰검이 3자루보다 적으면, 목표의 감전 상태를 소모하지 않았더라도 청뢰검 1자루를 생성할 수 있습니다.",
        "이후 근처의 청뢰검을 유도해 목표를 뇌격으로 공격하여, 전기 피해를 주고 추가로 궁극기 에너지를 획득합니다. 마지막 뇌격은 6배의 피해를 줍니다.",
        "한 번의 배틀 스킬로 최대로 생성할 수 있는 청뢰검은 3자루입니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "뇌격 피해 배율", values: ["20%", "22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "39%", "42%", "45%"] },
        { label: "총 불균형치", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
        { label: "감전 상태를 소모할 때마다 추가되는 피해 배율", values: ["3%", "4%", "4%", "4%", "5%", "5%", "5%", "6%", "6%", "7%", "8%", "9%"] },
        { label: "뇌격을 사용할 때마다 추가로 획득하는 궁극기 에너지", values: ["6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6"] },
        { label: "청뢰검 수량 제한", values: ["9", "9", "9", "9", "9", "9", "9", "9", "9", "9", "9", "9"] },
        { label: "청뢰검이 존재하는 시간(초)", values: ["36", "36", "36", "36", "36", "36", "36", "36", "36", "36", "36", "36"] },
        { label: "궁극기 사용 중 뇌격 피해 배율", values: ["36%", "40%", "43%", "47%", "50%", "54%", "58%", "61%", "65%", "69%", "75%", "81%"] },
        { label: "궁극기 사용 중 감전 상태를 소모할 때마다 추가되는 피해 배율", values: ["8%", "9%", "10%", "11%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%"] },
      ],
    },

    comboSkill: {
      name: "변화의 숨결",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "메인 컨트롤 오퍼레이터의 강력한 일격 또는 처형으로 전기 부착 상태의 적을 명중한 후 사용할 수 있습니다.",
        "식뢰 진법을 구축해 적을 공격하고 전기 피해를 줍니다. 전기 부착 상태의 적을 명중할 때, 그 전기 부착 상태를 소모하고 강제로 감전 상태를 부여합니다. 또한 소모한 스택 수치에 따라 추가로 궁극기 에너지를 획득합니다.",
        "강제로 감전 상태를 부여할 때, 적이 이미 감전 상태라면 부여되는 감전의 이상 레벨+1.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "17s"] },
        { label: "피해 배율", values: ["160%", "176%", "192%", "208%", "224%", "240%", "256%", "272%", "288%", "308%", "332%", "360%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "획득하는 궁극기 에너지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "중첩된 부착 스택을 소모할 때마다 추가로 획득하는 궁극기 에너지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "궁극기 사용 중 피해 배율", values: ["240%", "264%", "288%", "312%", "336%", "360%", "384%", "408%", "432%", "462%", "498%", "540%"] },
      ],
    },

    ultimate: {
      name: "심판의 폭풍",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
      ],
      description: [
        "천리의 경지 상태에 진입합니다.",
        "일반 공격이 강화되고, 행동이 몬스터의 방해를 받지 않습니다.",
        "배틀 스킬 뇌정의 부름의 피해 배율이 증가하고 공격 범위가 확대되며, 마지막 뇌격이 적을 명중할 때 전기 부착을 부여합니다.",
        "연계 스킬 변화의 숨결은 일정 범위 내의 적에게 적용되며, 피해 배율이 증가하고 쿨타임 회복 속도가 기존의 4배로 증가합니다.",
        "배틀 스킬 뇌정의 부름을 처음 사용할 때는 스킬 게이지와 감전 상태를 소모하지 않으며, 목표의 감전 상태 여부와 무관하게, 반드시 청뢰검 3자루를 생성합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["240", "240", "240", "240", "240", "240", "240", "240", "240", "240", "240", "240"] },
        { label: "지속 시간(초)", values: ["25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25"] },
        { label: "궁극기 사용 중 일반 공격 제1단계 배율", values: ["67%", "73%", "80%", "86%", "93%", "100%", "106%", "113%", "120%", "128%", "138%", "150%"] },
        { label: "궁극기 사용 중 일반 공격 제2단계 배율", values: ["94%", "103%", "112%", "122%", "131%", "140%", "150%", "159%", "168%", "180%", "194%", "210%"] },
        { label: "궁극기 사용 중 일반 공격 제3단계 배율", values: ["134%", "147%", "160%", "174%", "187%", "200%", "214%", "227%", "240%", "257%", "277%", "300%"] },
      ],
    },
  },

  infrastructureSkills: [
    {
      name: "책임자의 노련함",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "제조실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "제조실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 18% 감소",
        },
      ],
    },
    {
      name: "천사의 호흡 수련법",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "제조실에 배치 시, 오퍼레이터 경험치 재료의 생산 효율 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "제조실에 배치 시, 오퍼레이터 경험치 재료의 생산 효율 30% 증가",
        },
      ],
    },
  ],

  trustBonus: [
    { level: 1, label: "의지 +10" },
    { level: 2, label: "의지 +15" },
    { level: 3, label: "의지 +15" },
    { level: 4, label: "의지 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: COMMON_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: ZHUANGFANGYI_TALENT_COSTS,
  },
} as const;

export const zhuangfangyiDetailData = zhuangfangyiOperatorDetailData;
