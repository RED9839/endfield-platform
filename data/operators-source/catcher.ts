const slug = "catcher";

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
      { name: "바위아겔로스 잎", count: 3, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 16, icon: "/materials/초거리 빛 반사 파이프.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 36, icon: "/materials/초거리 빛 반사 파이프.webp" },
      { name: "바위아겔로스 잎", count: 12, icon: "/materials/바위아겔로스 잎.webp" },
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
      { name: "바위아겔로스 잎", count: 3, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "D96강 시제품 4번", count: 16, icon: "/materials/D96강 시제품 4번.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "D96강 시제품 4번", count: 36, icon: "/materials/D96강 시제품 4번.webp" },
      { name: "바위아겔로스 잎", count: 12, icon: "/materials/바위아겔로스 잎.webp" },
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

const CATCHER_TALENT_COSTS = [
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

export const catcherOperatorDetailData = {
  slug,
  name: "카치르",
  enName: "Catcher",
  rarity: 4 as const,

  element: "physical" as const,
  class: "defender" as const,
  weaponType: "양손검",

  mainStatLabel: "힘",
  subStatLabel: "의지",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [21, 54, 89, 124, 159, 176],
      dex: [9, 28, 47, 67, 87, 96],
      int: [8, 25, 42, 60, 77, 86],
      will: [11, 31, 53, 74, 96, 106],
      atk: [30, 88, 148, 209, 270, 300],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        21, 23, 25, 26, 28, 30, 32, 33, 35, 37,
        39, 40, 42, 44, 45, 47, 49, 51, 52, 54,
        56, 58, 59, 61, 63, 65, 66, 68, 70, 72,
        73, 75, 77, 79, 80, 82, 84, 85, 87, 89,
        91, 92, 94, 96, 98, 99, 101, 103, 105, 106,
        108, 110, 112, 113, 115, 117, 119, 120, 122, 124,
        125, 127, 129, 131, 132, 134, 136, 138, 139, 141,
        143, 145, 146, 148, 150, 152, 153, 155, 157, 159,
        160, 162, 164, 165, 167, 169, 171, 172, 174, 176,
      ],

      dex: [
        9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 47,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
        68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
        78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
        88, 89, 90, 91, 92, 93, 94, 95, 95, 96,
      ],

      int: [
        8, 9, 10, 11, 12, 13, 14, 14, 15, 16,
        17, 18, 19, 20, 21, 21, 22, 23, 24, 25,
        26, 27, 28, 28, 29, 30, 31, 32, 33, 34,
        35, 35, 36, 37, 38, 39, 40, 41, 42, 42,
        43, 44, 45, 46, 47, 48, 49, 49, 50, 51,
        52, 53, 54, 55, 56, 56, 57, 58, 59, 60,
        61, 62, 63, 63, 64, 65, 66, 67, 68, 69,
        70, 70, 71, 72, 73, 74, 75, 76, 77, 77,
        78, 79, 80, 81, 82, 83, 84, 85, 85, 86,
      ],

      will: [
        11, 12, 13, 14, 15, 16, 17, 18, 20, 21,
        22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        32, 33, 35, 36, 37, 38, 39, 40, 41, 42,
        43, 44, 45, 46, 47, 48, 49, 51, 52, 53,
        54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
        64, 66, 67, 68, 69, 70, 71, 72, 73, 74,
        75, 76, 77, 78, 79, 81, 82, 83, 84, 85,
        86, 87, 88, 89, 90, 91, 92, 93, 94, 96,
        97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
      ],

      atk: [
        30, 33, 36, 39, 42, 45, 48, 51, 54, 57,
        60, 63, 66, 69, 72, 75, 79, 82, 85, 88,
        91, 94, 97, 100, 103, 106, 109, 112, 115, 118,
        121, 124, 127, 130, 133, 136, 139, 142, 145, 148,
        151, 154, 157, 160, 163, 166, 170, 173, 176, 179,
        182, 185, 188, 191, 194, 197, 200, 203, 206, 209,
        212, 215, 218, 221, 224, 227, 230, 233, 236, 239,
        242, 245, 248, 251, 254, 257, 261, 264, 267, 270,
        273, 276, 279, 282, 285, 288, 291, 294, 297, 300,
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
      name: "강인한 방어선",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "의지 10포인트마다 방어력 +1.0",
    },
    {
      name: "강인한 방어선",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "의지 10포인트마다 방어력 +1.2",
    },
    {
      name: "전장을 꿰뚫는 통찰",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "궁극기 교과서적인 맹공의 마지막 공격이 2회의 충격파를 발동하며, 충격파마다 공격력 30%의 물리 피해를 줍니다.",
    },
    {
      name: "전장을 꿰뚫는 통찰",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "궁극기 교과서적인 맹공의 마지막 공격이 3회의 충격파를 발동하며, 충격파마다 공격력 45%의 물리 피해를 줍니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "다중 전투준비",
      description: "배틀 스킬 강력한 저지와 궁극기 교과서적인 맹공이 적을 명중한 후, 추가로 [300+방어력×5.0]의 물리 피해를 줍니다.",
    },
    {
      title: "2",
      subtitle: "추가 특훈",
      description: "방어력 +20, 의지 +10",
    },
    {
      title: "3",
      subtitle: "불굴의 심장",
      description: "연계 스킬 실시간 억제가 제공하는 보호의 지속 시간 +5초",
    },
    {
      title: "4",
      subtitle: "고난의 대가",
      description: "궁극기 교과서적인 맹공의 사용에 필요한 궁극기 에너지 -10%",
    },
    {
      title: "5",
      subtitle: "후회 없는 선택",
      description: "카치르가 보호를 보유 중일 때, 배틀 스킬 강력한 저지가 적에게 명중하면 스킬 게이지를 10포인트 반환합니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "기초 전술",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 4단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 22포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["35%", "39%", "42%", "46%", "49%", "53%", "56%", "60%", "63%", "67%", "73%", "79%"] },
        { label: "일반 공격 제2단계 배율", values: ["39%", "42%", "46%", "50%", "54%", "58%", "62%", "65%", "69%", "74%", "80%", "87%"] },
        { label: "일반 공격 제3단계 배율", values: ["54%", "59%", "65%", "70%", "76%", "81%", "86%", "92%", "97%", "104%", "112%", "122%"] },
        { label: "일반 공격 제4단계 배율", values: ["71%", "78%", "85%", "92%", "99%", "107%", "114%", "121%", "128%", "137%", "147%", "160%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "강력한 저지",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "방패를 들어 공격을 막으며 자신과 주변의 오퍼레이터에게 비호를 부여하고, 일정 스킬 게이지를 반환합니다.",
        "방패를 들고 있는 동안 공격을 받으면 반격하며 적에게 물리 피해를 주고 방어 불능 1스택을 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["178%", "196%", "213%", "231%", "249%", "267%", "285%", "302%", "320%", "342%", "369%", "400%"] },
        { label: "불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
        { label: "비호 효과", values: ["90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%"] },
        { label: "스킬 게이지 반환", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"] },
      ],
    },

    comboSkill: {
      name: "실시간 억제",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "적이 차지를 시작했거나, 메인 컨트롤 오퍼레이터가 공격받아 생명력이 40% 미만일 때 사용할 수 있습니다.",
        "주먹을 전방으로 힘껏 내려꽂아, 적에게 물리 피해를 주며, 자신과 다른 아군 오퍼레이터(메인 컨트롤 오퍼레이터 우선)에게 보호를 부여합니다.",
        "방어력은 보호 수치를 추가로 증가시킵니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["35s", "35s", "35s", "35s", "35s", "35s", "35s", "35s", "35s", "35s", "35s", "33s"] },
        { label: "제1단계 피해 배율", values: ["25%", "27%", "30%", "32%", "34%", "37%", "39%", "42%", "44%", "47%", "51%", "55%"] },
        { label: "제2단계 피해 배율", values: ["100%", "110%", "120%", "130%", "140%", "150%", "160%", "170%", "180%", "193%", "208%", "225%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "기초 보호 수치", values: ["360", "432", "504", "576", "612", "648", "684", "720", "756", "774", "792", "810"] },
        { label: "방어력 1포인트마다 증가하는 보호 수치", values: ["2.25", "2.7", "3.15", "3.6", "3.83", "4.05", "4.28", "4.5", "4.73", "4.84", "4.95", "5.06"] },
        { label: "보호 지속 시간(초)", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    ultimate: {
      name: "교과서적인 맹공",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "15초" },
      ],
      description: [
        "대검을 휘둘러 전방으로 빠르게 2단 베기를 사용하여, 물리 피해를 주고, 허약 상태를 부여합니다.",
        "마지막에 아래로 힘차게 내리찍어 목표 범위 내의 모든 적에게 대량의 물리 피해와 넘어뜨리기 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["80", "80", "80", "80", "80", "80", "80", "80", "80", "80", "80", "80"] },
        { label: "제1단계 피해 배율", values: ["89%", "98%", "107%", "116%", "125%", "134%", "143%", "151%", "160%", "172%", "185%", "200%"] },
        { label: "제1단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "제2단계 피해 배율", values: ["120%", "132%", "144%", "156%", "168%", "180%", "192%", "204%", "216%", "231%", "249%", "270%"] },
        { label: "제2단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "제3단계 피해 배율", values: ["178%", "196%", "213%", "231%", "249%", "267%", "284%", "302%", "320%", "342%", "369%", "400%"] },
        { label: "제3단계 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "허약 효과", values: ["20%", "20%", "20%", "20%", "20%", "25%", "25%", "25%", "25%", "30%", "30%", "30%"] },
        { label: "허약 지속 시간(초)", values: ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8"] },
      ],
    },
  },

  infrastructureSkills: [
    {
      name: "조용한 배려",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 8% 증가",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 12% 증가",
        },
      ],
    },
    {
      name: "실용적 사고",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "재배실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "재배실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 18% 감소",
        },
      ],
    },
  ],

  trustBonus: [
    { level: 1, label: "힘 +10" },
    { level: 2, label: "힘 +15" },
    { level: 3, label: "힘 +15" },
    { level: 4, label: "힘 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: COMMON_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: CATCHER_TALENT_COSTS,
  },
} as const;