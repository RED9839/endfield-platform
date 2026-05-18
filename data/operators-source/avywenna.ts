const slug = "avywenna";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준:
// 앞 핵심 재료 = 정합용 유체
// 뒤 핵심 재료 = 3상 나노 플레이크 칩

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
      { name: "정합용 유체", count: 6, icon: "/materials/정합용 유체.webp" },
      { name: "바위아겔로스 잎", count: 3, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 16, icon: "/materials/정합용 유체.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "정합용 유체", count: 36, icon: "/materials/정합용 유체.webp" },
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
      { name: "3상 나노 플레이크 칩", count: 6, icon: "/materials/3상 나노 플레이크 칩.webp" },
      { name: "바위아겔로스 잎", count: 3, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 16, icon: "/materials/3상 나노 플레이크 칩.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "3상 나노 플레이크 칩", count: 36, icon: "/materials/3상 나노 플레이크 칩.webp" },
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

const AVYWENNA_TALENT_COSTS = [
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

export const avywennaOperatorDetailData = {
  slug,
  name: "아비웨나",
  enName: "Avywenna",
  rarity: 5 as const,

  element: "electric" as const,
  class: "striker" as const,
  weaponType: "장병기",

  mainStatLabel: "의지",
  subStatLabel: "민첩",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [12, 33, 54, 75, 96, 107],
      dex: [10, 31, 52, 74, 95, 106],
      int: [14, 34, 56, 78, 99, 110],
      will: [15, 43, 73, 103, 133, 148],
      atk: [30, 90, 153, 217, 280, 312],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        12, 13, 15, 16, 17, 18, 19, 20, 21, 22,
        23, 24, 25, 26, 27, 28, 29, 30, 31, 33,
        34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
        44, 45, 46, 47, 48, 50, 51, 52, 53, 54,
        55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
        65, 67, 68, 69, 70, 71, 72, 73, 74, 75,
        76, 77, 78, 79, 80, 81, 82, 84, 85, 86,
        87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
        97, 98, 99, 100, 102, 103, 104, 105, 106, 107,
      ],

      dex: [
        10, 11, 12, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 28, 29, 30, 31,
        32, 33, 34, 35, 36, 37, 38, 39, 40, 42,
        43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
        53, 54, 56, 57, 58, 59, 60, 61, 62, 63,
        64, 65, 66, 67, 68, 70, 71, 72, 73, 74,
        75, 76, 77, 78, 79, 80, 81, 82, 84, 85,
        86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
        96, 98, 99, 100, 101, 102, 103, 104, 105, 106,
      ],

      int: [
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
        24, 26, 27, 28, 29, 30, 31, 32, 33, 34,
        35, 36, 37, 39, 40, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 50, 52, 53, 54, 55, 56,
        57, 58, 59, 60, 61, 62, 63, 65, 66, 67,
        68, 69, 70, 71, 72, 73, 74, 75, 76, 78,
        79, 80, 81, 82, 83, 84, 85, 86, 87, 88,
        89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
        100, 101, 102, 104, 105, 106, 107, 108, 109, 110,
      ],

      will: [
        15, 16, 18, 19, 21, 22, 24, 25, 27, 28,
        30, 31, 33, 34, 36, 37, 39, 40, 42, 43,
        45, 46, 48, 49, 51, 52, 54, 55, 57, 58,
        60, 61, 63, 64, 66, 67, 69, 70, 72, 73,
        75, 76, 78, 79, 81, 82, 84, 85, 87, 88,
        90, 91, 93, 94, 96, 97, 99, 100, 102, 103,
        105, 106, 108, 109, 111, 112, 114, 115, 117, 118,
        120, 121, 123, 124, 126, 127, 129, 130, 132, 133,
        135, 136, 138, 139, 141, 142, 144, 145, 147, 148,
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
      name: "고효율 배송",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "투척한/회수한 썬더랜스, 강력한 썬더랜스가 적을 명중한 후, 궁극기 에너지 3포인트를 획득합니다.",
    },
    {
      name: "고효율 배송",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "투척한/회수한 썬더랜스, 강력한 썬더랜스가 적을 명중한 후, 궁극기 에너지 4포인트를 획득합니다.",
    },
    {
      name: "완곡한 수단",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "궁극기 썬더랜스 · 결전의 떨림이 적에게 명중했을 때, 대상에게 6%만큼 전기 취약을 부여하고, 10초 동안 지속됩니다.",
    },
    {
      name: "완곡한 수단",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "궁극기 썬더랜스 · 결전의 떨림이 적에게 명중했을 때, 대상에게 10%만큼 전기 취약을 부여하고, 10초 동안 지속됩니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "더블 베팅",
      description: "재능 '고효율 배송' 효과 강화: 획득하는 궁극기 에너지 +2포인트",
    },
    {
      title: "2",
      subtitle: "눈앞에 닥친 위험",
      description: "썬더랜스, 강력한 썬더랜스의 존재 시간 +20초",
    },
    {
      title: "3",
      subtitle: "끝없는 저항",
      description: "의지 +15, 주는 전기 피해 +8%",
    },
    {
      title: "4",
      subtitle: "숙련자의 여유",
      description: "궁극기 썬더랜스 · 결전의 떨림의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "회유와 위압",
      description: "회수한 썬더랜스 및 강력한 썬더랜스가 전기 취약 상태의 적을 명중했을 때, 피해 배율이 기존의 1.15배로 증가합니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "썬더랜스 · 신속 공격",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 17포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["17%", "18%", "20%", "21%", "23%", "25%", "26%", "28%", "30%", "32%", "34%", "37%"] },
        { label: "일반 공격 제2단계 배율", values: ["22%", "24%", "26%", "28%", "30%", "32%", "34%", "37%", "39%", "41%", "45%", "48%"] },
        { label: "일반 공격 제3단계 배율", values: ["21%", "23%", "25%", "27%", "29%", "31%", "33%", "35%", "37%", "39%", "43%", "46%"] },
        { label: "일반 공격 제4단계 배율", values: ["30%", "33%", "36%", "39%", "42%", "45%", "48%", "51%", "54%", "58%", "62%", "68%"] },
        { label: "일반 공격 제5단계 배율", values: ["50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "96%", "104%", "113%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "썬더랜스 · 가로채기",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "점프하여 창을 휘둘러 회오리바람을 일으킵니다. 주변의 적에게 소량의 전기 피해를 주며, 모든 썬더랜스와 강력한 썬더랜스를 회수합니다.",
        "썬더랜스가 회수되는 과정에서 적을 공격할 경우, 대상에게 전기 피해를 줍니다. 강력한 썬더랜스는 더욱 큰 전기 피해를 주고 전기 부착 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["67%", "73%", "80%", "87%", "93%", "100%", "107%", "113%", "120%", "128%", "138%", "150%"] },
        { label: "불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "썬더랜스 피해 배율", values: ["75%", "82%", "90%", "97%", "104%", "112%", "119%", "127%", "134%", "144%", "155%", "168%"] },
        { label: "썬더랜스 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "강력한 썬더랜스 피해 배율", values: ["192%", "211%", "230%", "250%", "269%", "288%", "307%", "326%", "346%", "370%", "398%", "432%"] },
        { label: "강력한 썬더랜스 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    comboSkill: {
      name: "썬더랜스 · 번개 타격",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "메인 컨트롤 오퍼레이터가 전기 부착 혹은 감전 상태의 목표에 강력한 일격을 준 후 사용할 수 있습니다.",
        "점프하여 목표에 썬더랜스 3개를 던져, 전방 범위 내의 적에게 전기 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["13s", "13s", "13s", "13s", "13s", "13s", "13s", "13s", "13s", "13s", "13s", "12s"] },
        { label: "피해 배율", values: ["169%", "186%", "203%", "219%", "236%", "253%", "270%", "287%", "304%", "325%", "350%", "380%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "썬더랜스가 존재하는 시간(초)", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"] },
      ],
    },

    ultimate: {
      name: "썬더랜스 · 결전의 떨림",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "10초" },
      ],
      description: [
        "목표 구역에 강력한 썬더랜스 하나를 투척하여 주변의 적에게 대량의 전기 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"] },
        { label: "피해 배율", values: ["422%", "464%", "507%", "549%", "591%", "633%", "675%", "718%", "760%", "813%", "876%", "950%"] },
        { label: "불균형치", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "20", "20", "20"] },
        { label: "강력한 썬더랜스가 존재하는 시간(초)", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"] },
      ],
    },
  },

  infrastructureSkills: [
    {
      name: "가정 상담사",
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
      name: "전달자의 비밀",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 2 - 탈로스 II 상업연합회를 수집할 확률 약간 증가. (배치 시 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 2 - 탈로스 II 상업연합회를 수집할 확률 증가. (배치 시 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
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
    talents: AVYWENNA_TALENT_COSTS,
  },
} as const;