const slug = "arclight";

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
      { name: "바위아겔로스 잎", count: 3, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 16, icon: "/materials/타키온 차폐 구조체.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/materials/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/materials/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/materials/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 36, icon: "/materials/타키온 차폐 구조체.webp" },
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

const ARCLIGHT_TALENT_COSTS = [
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

export const arclightOperatorDetailData = {
  slug,
  name: "아크라이트",
  enName: "Arclight",
  rarity: 5 as const,

  element: "electric" as const,
  class: "vanguard" as const,
  weaponType: "한손검",

  mainStatLabel: "민첩",
  subStatLabel: "지능",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [14, 33, 54, 75, 96, 107],
      dex: [14, 42, 71, 101, 130, 145],
      int: [12, 36, 61, 86, 111, 123],
      will: [10, 29, 49, 69, 89, 100],
      atk: [30, 89, 151, 213, 275, 306],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
        35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
        56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
        66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
        77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
        87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
        98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
      ],

      dex: [
        14, 16, 17, 19, 20, 22, 23, 24, 26, 27,
        29, 30, 32, 33, 35, 36, 38, 39, 41, 42,
        44, 45, 47, 48, 49, 51, 52, 54, 55, 57,
        58, 60, 61, 63, 64, 66, 67, 69, 70, 71,
        73, 74, 76, 77, 79, 80, 82, 83, 85, 86,
        88, 89, 91, 92, 94, 95, 96, 98, 99, 101,
        102, 104, 105, 107, 108, 110, 111, 113, 114, 116,
        117, 118, 120, 121, 123, 124, 126, 127, 129, 130,
        132, 133, 135, 136, 138, 139, 141, 142, 143, 145,
      ],

      int: [
        12, 13, 14, 16, 17, 18, 19, 21, 22, 23,
        24, 26, 27, 28, 29, 31, 32, 33, 34, 36,
        37, 38, 39, 41, 42, 43, 44, 46, 47, 48,
        49, 51, 52, 53, 54, 56, 57, 58, 59, 61,
        62, 63, 64, 66, 67, 68, 69, 71, 72, 73,
        74, 76, 77, 78, 79, 81, 82, 83, 84, 86,
        87, 88, 89, 91, 92, 93, 94, 96, 97, 98,
        99, 101, 102, 103, 104, 106, 107, 108, 109, 111,
        112, 113, 114, 116, 117, 118, 119, 120, 122, 123,
      ],

      will: [
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
        60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
        70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
        90, 91, 92, 93, 94, 95, 96, 98, 99, 100,
      ],

      atk: [
        30, 33, 36, 39, 42, 45, 49, 52, 55, 58,
        61, 64, 67, 70, 73, 76, 80, 83, 86, 89,
        92, 95, 98, 101, 104, 107, 111, 114, 117, 120,
        123, 126, 129, 132, 135, 138, 142, 145, 148, 151,
        154, 157, 160, 163, 166, 169, 173, 176, 179, 182,
        185, 188, 191, 194, 197, 200, 204, 207, 210, 213,
        216, 219, 222, 225, 228, 231, 235, 238, 241, 244,
        247, 250, 253, 256, 259, 262, 266, 269, 272, 275,
        278, 281, 284, 287, 290, 293, 297, 300, 303, 306,
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
      name: "황무지의 여행자",
      unlock: "정예화 단계 1 달성 시 해제 가능",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 질풍 섬광을 사용하여 3회의 추가 효과를 발동한 후, 자신의 지능에 따라 팀 전체의 전기 피해가 증가합니다. 지능 1포인트당 +0.05%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
    {
      name: "황무지의 여행자",
      unlock: "정예화 단계 2 달성 시 활성화 가능",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 질풍 섬광을 사용하여 3회의 추가 효과를 발동한 후, 자신의 지능에 따라 팀 전체의 전기 피해가 증가합니다. 지능 1포인트당 +0.08%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
    {
      name: "만물의 지혜",
      unlock: "정예화 단계 2 달성 시 해제 가능",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "아츠 부착 상태가 부여될 때, 30%의 확률로 해당 효과에 면역됩니다.",
    },
    {
      name: "만물의 지혜",
      unlock: "정예화 단계 3 달성 시 활성화 가능",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "아츠 부착 상태가 부여될 때, 50%의 확률로 해당 효과에 면역됩니다.",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "폭풍의 아이",
      description: "배틀 스킬 질풍 섬광으로 추가 효과를 발동한 후, 추가로 스킬 게이지 10포인트를 회복합니다.",
    },
    {
      title: "2",
      subtitle: "속전속결",
      description: "민첩 +15, 지능 +15",
    },
    {
      title: "3",
      subtitle: "'노래'",
      description: "재능 '황무지의 여행자' 효과 강화: 피해 증가 효과가 기존의 1.3배로 증가합니다.",
    },
    {
      title: "4",
      subtitle: "사자의 가르침",
      description: "궁극기 천둥번개의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "황무지의 수행자",
      description: "재능 '황무지의 여행자' 효과 강화: 발동에 필요한 횟수가 2회로 감소합니다.",
    },
  ],

  skills: {
    normalAttack: {
      name: "추적 사냥",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 16포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "21%", "23%"] },
        { label: "일반 공격 제2단계 배율", values: ["13%", "14%", "15%", "16%", "18%", "19%", "20%", "21%", "23%", "24%", "26%", "28%"] },
        { label: "일반 공격 제3단계 배율", values: ["26%", "29%", "31%", "34%", "36%", "39%", "42%", "44%", "47%", "50%", "54%", "59%"] },
        { label: "일반 공격 제4단계 배율", values: ["36%", "40%", "43%", "47%", "50%", "54%", "58%", "61%", "65%", "69%", "75%", "81%"] },
        { label: "일반 공격 제5단계 배율", values: ["48%", "52%", "57%", "62%", "67%", "71%", "76%", "81%", "86%", "91%", "99%", "107%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "질풍 섬광",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "적의 옆으로 순간 이동해 2회의 베기 공격을 하며 소량의 물리 피해를 줍니다. 적이 감전 상태일 경우, 감전 상태를 소모하여 추가로 1회 공격하고 전기 피해를 주며 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "제1단계 피해 배율", values: ["45%", "50%", "54%", "59%", "63%", "68%", "72%", "77%", "81%", "87%", "93%", "101%"] },
        { label: "제2단계 피해 배율", values: ["45%", "50%", "54%", "59%", "63%", "68%", "72%", "77%", "81%", "87%", "93%", "101%"] },
        { label: "제2단계 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "추가 피해 배율", values: ["180%", "198%", "216%", "234%", "252%", "270%", "288%", "306%", "324%", "347%", "374%", "405%"] },
        { label: "추가 불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "스킬 게이지 회복", values: ["30", "30", "30", "30", "30", "35", "35", "35", "35", "35", "35", "40"] },
      ],
    },

    comboSkill: {
      name: "천둥의 울림",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "적이 감전 상태거나, 감전 상태를 소모한 후, 사용할 수 있습니다.",
        "적의 옆으로 순간 이동해 연속으로 베기 공격을 하여 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["3s", "3s", "3s", "3s", "3s", "3s", "3s", "3s", "3s", "3s", "3s", "3s"] },
        { label: "피해 배율", values: ["155%", "171%", "186%", "202%", "218%", "233%", "249%", "264%", "280%", "299%", "322%", "350%"] },
        { label: "스킬 게이지 회복", values: ["8", "8", "8", "8", "8", "9", "9", "9", "9", "10", "10", "10"] },
        { label: "불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
      ],
    },

    ultimate: {
      name: "천둥번개",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "15초" },
      ],
      description: [
        "전기 아크로 자신을 둘러싼 다음, 전방 일정 거리를 돌진하며 경로 상의 적에게 전기 피해를 주고 전기 부착 상태를 부여합니다. 일정 시간이 지나면, 남겨 둔 전기 아크를 폭파시켜 다시 전기 피해를 줍니다. 적이 전기 부착 상태일 경우, 전기 부착 상태를 소모하여 감전 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90"] },
        { label: "제1단계 피해 배율", values: ["156%", "171%", "187%", "202%", "218%", "234%", "249%", "265%", "280%", "300%", "323%", "350%"] },
        { label: "제1단계 불균형치", values: ["7", "7", "7", "7", "7", "7", "7", "7", "7", "10", "10", "10"] },
        { label: "제2단계 피해 배율", values: ["244%", "269%", "293%", "318%", "342%", "367%", "391%", "415%", "440%", "470%", "507%", "550%"] },
        { label: "제2단계 불균형치", values: ["7", "7", "7", "7", "7", "7", "7", "7", "7", "10", "10", "10"] },
      ],
    },
  },

  infrastructureSkills: [
    {
      name: "황무지의 칼날",
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
      name: "노래의 전승",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "α",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 6 - 만물의 대지를 수집할 확률 약간 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
        {
          tier: "β",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "응접실에 배치 시, 오퍼레이터가 단서 6 - 만물의 대지를 수집할 확률 증가. (배치 즉시 효력 발생, 같은 유형의 효과는 중첩되지 않음.)",
        },
      ],
    },
  ],

  trustBonus: [
    { level: 1, label: "민첩 +10" },
    { level: 2, label: "민첩 +15" },
    { level: 3, label: "민첩 +15" },
    { level: 4, label: "민첩 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: COMMON_TRUST_BONUS_COSTS,
    infrastructure: COMMON_INFRASTRUCTURE_COSTS,
    talents: ARCLIGHT_TALENT_COSTS,
  },
} as const;