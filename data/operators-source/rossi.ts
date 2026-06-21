const slug = "rossi";

const normalAndComboSkillUpgradeMaterials = [
  {
    level: "2",
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 1, icon: "/items/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "3",
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 2, icon: "/items/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 2700, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "4",
    materials: [
      { name: "프로토콜 프리즘", count: 16, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 3200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "5",
    materials: [
      { name: "프로토콜 프리즘", count: 21, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 4200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "6",
    materials: [
      { name: "프로토콜 프리즘", count: 27, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 2, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 5400, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "7",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 6, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 8200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "8",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 8, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 10500, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "9",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 2, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M1",
    materials: [
      { name: "존속의 흔적", count: 1, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 6, icon: "/items/타키온 차폐 구조체.webp" },
      { name: "바위아겔로스 잎", count: 3, icon: "/items/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 16, icon: "/items/타키온 차폐 구조체.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/items/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 36, icon: "/items/타키온 차폐 구조체.webp" },
      { name: "바위아겔로스 잎", count: 12, icon: "/items/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const battleAndUltimateSkillUpgradeMaterials = [
  {
    level: "2",
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 1, icon: "/items/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "3",
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" },
      { name: "칼코덴드라", count: 2, icon: "/items/칼코덴드라.webp" },
      { name: "탈로시안 화폐", count: 2700, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "4",
    materials: [
      { name: "프로토콜 프리즘", count: 16, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 3200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "5",
    materials: [
      { name: "프로토콜 프리즘", count: 21, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 1, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 4200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "6",
    materials: [
      { name: "프로토콜 프리즘", count: 27, icon: "/items/프로토콜 프리즘.webp" },
      { name: "크리소덴드라", count: 2, icon: "/items/크리소덴드라.webp" },
      { name: "탈로시안 화폐", count: 5400, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "7",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 6, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 8200, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "8",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 8, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 1, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 10500, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "9",
    materials: [
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "비트로덴드라", count: 2, icon: "/items/비트로덴드라.webp" },
      { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M1",
    materials: [
      { name: "존속의 흔적", count: 1, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 6, icon: "/items/초거리 빛 반사 파이프.webp" },
      { name: "바위아겔로스 잎", count: 3, icon: "/items/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 16, icon: "/items/초거리 빛 반사 파이프.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/items/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "초거리 빛 반사 파이프", count: 36, icon: "/items/초거리 빛 반사 파이프.webp" },
      { name: "바위아겔로스 잎", count: 12, icon: "/items/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" },
    ],
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

const ROSSI_TRUST_BONUS_COSTS = [
  {
    stage: 1,
    trust: 20,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 5, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 2,
    trust: 50,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 10, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1800, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 3,
    trust: 100,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 10, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 6000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    stage: 4,
    trust: 100,
    elite: 4,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 20, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 12000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const COMMON_INFRASTRUCTURE_COSTS = [
  {
    slot: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 6, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 1600, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 1,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 12, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 8000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 3000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    slot: 2,
    stage: 2,
    elite: 4,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 20, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 20000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const ROSSI_TALENT_COSTS = [
  {
    talent: 1,
    stage: 1,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 2400, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 1,
    stage: 2,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 40, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 8600, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 48, icon: "/items/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 10000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 2,
    elite: 3,
    materials: [
      { name: "프로토콜 프리즘 세트", count: 28, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const rossiOperatorDetailData = {
  slug,
  name: "로시",
  enName: "Rossi",
  rarity: 6 as const,

  element: "physical" as const,
  class: "guard" as const,
  weaponType: "한손검",

  mainStatLabel: "민첩",
  subStatLabel: "지능",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [9, 28, 48, 68, 88, 97],
      dex: [23, 55, 90, 124, 159, 176],
      int: [14, 36, 59, 83, 106, 118],
      will: [9, 26, 44, 62, 80, 89],
      atk: [30, 93, 159, 225, 291, 323],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
        59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
        69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
        79, 80, 81, 82, 83, 84, 85, 86, 87, 88,
        89, 90, 91, 92, 93, 94, 95, 95, 96, 97,
      ],

      dex: [
        23, 24, 26, 28, 30, 31, 33, 35, 36, 38,
        40, 42, 43, 45, 47, 49, 50, 52, 54, 55,
        57, 59, 61, 62, 64, 66, 67, 69, 71, 73,
        74, 76, 78, 80, 81, 83, 85, 86, 88, 90,
        92, 93, 95, 97, 99, 100, 102, 104, 105, 107,
        109, 111, 112, 114, 116, 117, 119, 121, 123, 124,
        126, 128, 130, 131, 133, 135, 136, 138, 140, 142,
        143, 145, 147, 148, 150, 152, 154, 155, 157, 159,
        161, 162, 164, 166, 167, 169, 171, 173, 174, 176,
      ],

      int: [
        14, 15, 16, 17, 18, 19, 21, 22, 23, 24,
        25, 26, 28, 29, 30, 31, 32, 33, 35, 36,
        37, 38, 39, 40, 42, 43, 44, 45, 46, 47,
        49, 50, 51, 52, 53, 54, 56, 57, 58, 59,
        60, 61, 63, 64, 65, 66, 67, 68, 70, 71,
        72, 73, 74, 76, 77, 78, 79, 80, 81, 83,
        84, 85, 86, 87, 88, 90, 91, 92, 93, 94,
        95, 97, 98, 99, 100, 101, 102, 104, 105, 106,
        107, 108, 109, 111, 112, 113, 114, 115, 116, 118,
      ],

      will: [
        9, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 19, 20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 48, 49, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 87, 88, 89,
      ],

      atk: [
        30, 33, 37, 40, 43, 46, 50, 53, 56, 60,
        63, 66, 70, 73, 76, 79, 83, 86, 89, 93,
        96, 99, 103, 106, 109, 112, 116, 119, 122, 126,
        129, 132, 136, 139, 142, 145, 149, 152, 155, 159,
        162, 165, 168, 172, 175, 178, 182, 185, 188, 192,
        195, 198, 201, 205, 208, 211, 215, 218, 221, 225,
        228, 231, 234, 238, 241, 244, 248, 251, 254, 258,
        261, 264, 267, 271, 274, 277, 281, 284, 287, 291,
        294, 297, 300, 304, 307, 310, 314, 317, 320, 323,
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
        { name: "프로토콜 디스크", count: 8, icon: "/items/프로토콜 디스크.webp" },
        { name: "연한 붉은 기둥 버섯", count: 3, icon: "/items/연한 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 1600, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 II",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 60레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크", count: 25, icon: "/items/프로토콜 디스크.webp" },
        { name: "보통 붉은 기둥 버섯", count: 5, icon: "/items/보통 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 6500, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 III",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 80레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크 세트", count: 24, icon: "/items/프로토콜 디스크 세트.webp" },
        { name: "진한 붉은 기둥 버섯", count: 5, icon: "/items/진한 붉은 기둥 버섯.webp" },
        { name: "탈로시안 화폐", count: 18000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
    {
      phase: "정예화 IV",
      unlockText: "활성화 후, 오퍼레이터 레벨 최대치 90레벨까지 증가",
      materials: [
        { name: "프로토콜 디스크 세트", count: 36, icon: "/items/프로토콜 디스크 세트.webp" },
        { name: "정합용 유체", count: 20, icon: "/items/정합용 유체.webp" },
        { name: "스타게이트 버섯", count: 8, icon: "/items/스타게이트 버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
  ],

  skills: {
    normalAttack: {
      name: "끓어오르는 늑대의 피",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      meta: [{ label: "스킬 게이지 회복", value: "처형 공격 시" }],
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 18포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["27%", "30%", "32%", "35%", "38%", "41%", "43%", "46%", "49%", "52%", "56%", "61%"] },
        { label: "일반 공격 제2단계 배율", values: ["32%", "35%", "38%", "41%", "44%", "47%", "50%", "54%", "57%", "61%", "65%", "71%"] },
        { label: "일반 공격 제3단계 배율", values: ["34%", "37%", "41%", "44%", "48%", "51%", "54%", "58%", "61%", "65%", "71%", "77%"] },
        { label: "일반 공격 제4단계 배율", values: ["41%", "45%", "49%", "53%", "57%", "61%", "65%", "69%", "73%", "78%", "84%", "91%"] },
        { label: "일반 공격 제5단계 배율", values: ["50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "96%", "104%", "113%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "붉은색의 그림자",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "목표를 향해 돌진하여 물리 피해를 주고 띄우기 피해를 줍니다.",
        "만약 목표가 이미 방어 불능 상태를 보유하고 있으면, 추가로 울프팀의 진주가 발동해 목표에 돌진하며 열기 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "제1단계 피해 배율", values: ["85%", "94%", "102%", "111%", "119%", "128%", "137%", "145%", "154%", "164%", "177%", "192%"] },
        { label: "제1단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "제2단계 피해 배율", values: ["128%", "141%", "153%", "166%", "179%", "192%", "204%", "217%", "230%", "246%", "265%", "288%"] },
        { label: "제2단계 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "12", "12", "12", "15"] },
      ],
    },

    comboSkill: {
      name: "그림자가 타오르는 순간",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "적이 동시에 방어 불능과 아츠 부착 상태일 때 발동할 수 있습니다.",
        "로시의 연계 스킬은 연속으로 2회 발동할 수 있습니다. 첫 공격은 목표에 물리 피해를 줍니다.",
        "두 번째 공격은 목표의 아츠 부착을 모두 소모한 뒤, 적에게 소모한 스택 수치에 따른 물리 피해와 띄우기 피해를 주고, 일정 시간 동안 자신의 치명타 확률과 치명타 피해를 증가시킵니다.",
        "연계 스킬의 두 번째 공격이 정확하게 연계되면, 추가로 방어 불능 1스택을 쌓습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["15s", "15s", "15s", "15s", "15s", "15s", "15s", "15s", "15s", "15s", "15s", "14s"] },
        { label: "제1단계 피해 배율", values: ["67%", "73%", "80%", "87%", "93%", "100%", "107%", "113%", "120%", "128%", "138%", "150%"] },
        { label: "제2단계 피해 배율", values: ["133%", "147%", "160%", "173%", "187%", "200%", "213%", "227%", "240%", "257%", "277%", "300%"] },
        { label: "중첩된 부착 스택을 소모할 때마다 추가되는 피해 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
        { label: "제2단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "치명타 확률 증가", values: ["15%", "15%", "15%", "17%", "17%", "17%", "19%", "19%", "21%", "21%", "23%", "25%"] },
        { label: "치명타 피해 증가", values: ["30%", "30%", "30%", "34%", "34%", "34%", "38%", "38%", "42%", "42%", "46%", "50%"] },
        { label: "버프 효과의 지속 시간(초)", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
      ],
    },

    ultimate: {
      name: "기습 '날카로운 발톱'",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "10초" },
      ],
      description: [
        "망토를 휘날리며 재빠르게 찌릅니다.",
        "짧은 시간 동안 목표에 여러 차례 열기 피해를 준 후, 즉시 단검으로 2단 베기를 하여 대량의 열기 피해를 주고 열기 부착을 부여합니다.",
        "이번 스킬이 만약 치명타 피해를 줬을 경우, 더 강한 치명타 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["110", "110", "110", "110", "110", "110", "110", "110", "110", "110", "110", "110"] },
        { label: "찌르기 총피해 배율", values: ["275%", "300%", "325%", "350%", "375%", "400%", "425%", "450%", "475%", "525%", "550%", "600%"] },
        { label: "제1단 베기 피해 배율", values: ["111%", "122%", "133%", "144%", "156%", "167%", "178%", "189%", "200%", "214%", "231%", "250%"] },
        { label: "제2단 베기 피해 배율", values: ["333%", "367%", "400%", "433%", "467%", "500%", "534%", "567%", "600%", "642%", "692%", "750%"] },
        { label: "불균형치", values: ["25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25"] },
        { label: "치명타 피해 증가", values: ["60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "동경의 서막",
      description:
        "배틀 스킬 붉은색의 그림자와 연계 스킬 그림자가 타오르는 순간의 피해 배율이 기존의 1.15배로 증가합니다. 배틀 스킬로 인해 나타난 울프팀의 진주는 적을 명중한 후, 10포인트의 스킬 게이지를 반환합니다.",
    },
    { title: "2", subtitle: "완벽한 간격", description: "민첩 +20, 치명타 확률 +7%." },
    {
      title: "3",
      subtitle: "가시화된 책임",
      description:
        "재능 끓어오르는 피 효과 강화: 기초 피해 배율 +8%, 기초 생명력을 +[지능×0.04]만큼 회복.",
    },
    { title: "4", subtitle: "순수한 소망", description: "궁극기 기습 '날카로운 발톱'의 사용에 필요한 궁극기 에너지 -15%." },
    {
      title: "5",
      subtitle: "전설의 종착지",
      description:
        "궁극기 기습 '날카로운 발톱'의 피해 배율이 기존의 1.1배, 추가로 치명타 피해 +30%.",
    },
  ],

  trustBonus: [
    { level: 1, label: "+10 민첩" },
    { level: 2, label: "+15 민첩" },
    { level: 3, label: "+15 민첩" },
    { level: 4, label: "+20 민첩" },
  ],

  infrastructureSkills: [
    {
      name: "집단의 의례",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "응접실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "응접실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 18% 감소",
        },
      ],
    },
    {
      name: "사냥꾼의 후각",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "응접실에 배치 시, 오퍼레이터의 단서 수집 기본 효율 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "응접실에 배치 시, 오퍼레이터의 단서 수집 기본 효율 30% 증가",
        },
      ],
    },
  ],

  talents: [
    {
      name: "절흔",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "배틀 스킬 울프팀의 진주가 피해를 준 후, 목표에게 늑대의 발톱 상태를 부여합니다. 15초 동안 지속되며, 해당 효과는 중첩되지 않습니다.\n\n늑대의 발톱이 지속되는 동안, 목표는 매초 로시의 공격력 25%의 물리 피해를 받고, 받는 물리 피해와 열기 피해 +6%.",
    },
    {
      name: "절흔",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description:
        "배틀 스킬 울프팀의 진주가 피해를 준 후, 목표에게 늑대의 발톱 상태를 부여합니다. 25초 동안 지속되며, 해당 효과는 중첩되지 않습니다.\n\n늑대의 발톱이 지속되는 동안, 목표는 매초 로시의 공격력 30%의 물리 피해를 받고, 받는 물리 피해와 열기 피해 +12%.",
    },
    {
      name: "끓어오르는 피",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "로시가 늑대의 발톱 상태의 적에게 스킬을 사용해 치명타 피해를 주면, 추가로 공격력 12%의 열기 피해를 1회 주고, [지능×0.04]만큼 자신의 생명력을 회복합니다. 목표가 연소 상태도 보유하고 있다면, 위의 피해 및 치유 효과가 1.5배로 증가합니다.",
    },
    {
      name: "끓어오르는 피",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description:
        "로시가 늑대의 발톱 상태의 적에게 스킬을 사용해 치명타 피해를 주면, 추가로 공격력 24%의 열기 피해를 1회 주고, [지능×0.08]만큼 자신의 생명력을 회복합니다. 목표가 연소 상태도 보유하고 있다면, 위의 피해 및 치유 효과가 1.5배로 증가합니다.",
    },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: ROSSI_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: ROSSI_TALENT_COSTS,
  },
} as const;