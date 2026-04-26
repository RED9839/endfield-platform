const slug = "ardelia";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준: D96강 시제품 4번, 타키온 차폐 구조체

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

const ARDELIA_TALENT_COSTS = [
  {
    talent: 1,
    stage: 2,
    elite: 1,
    materials: [
      { name: "프로토콜 프리즘", count: 36, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 7200, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 1,
    stage: 3,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 86, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 26000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
  {
    talent: 2,
    stage: 1,
    elite: 2,
    materials: [
      { name: "프로토콜 프리즘", count: 85, icon: "/materials/프로토콜 프리즘.webp" },
      { name: "탈로시안 화폐", count: 26000, icon: "/materials/탈로시안 화폐.webp" },
    ],
  },
] as const;

export const ardeliaOperatorDetailData = {
  slug,
  name: "아델리아",
  enName: "Ardelia",
  rarity: 6 as const,

  element: "nature" as const,
  class: "supporter" as const,
  weaponType: "아츠 유닛",

  mainStatLabel: "지능",
  subStatLabel: "의지",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [9, 31, 54, 77, 100, 112],
      dex: [9, 27, 46, 65, 84, 93],
      int: [20, 46, 75, 103, 131, 145],
      will: [15, 37, 60, 83, 106, 118],
      atk: [30, 93, 159, 225, 291, 323],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        9, 10, 12, 13, 14, 15, 16, 17, 18, 20,
        21, 22, 23, 24, 25, 27, 28, 29, 30, 31,
        32, 33, 35, 36, 37, 38, 39, 40, 41, 43,
        44, 45, 46, 47, 48, 50, 51, 52, 53, 54,
        55, 56, 58, 59, 60, 61, 62, 63, 64, 66,
        67, 68, 69, 70, 71, 73, 74, 75, 76, 77,
        78, 79, 81, 82, 83, 84, 85, 86, 87, 89,
        90, 91, 92, 93, 94, 96, 97, 98, 99, 100,
        101, 102, 104, 105, 106, 107, 108, 109, 110, 112,
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
        85, 86, 87, 88, 89, 90, 91, 92, 92, 93,
      ],

      int: [
        20, 21, 22, 24, 25, 27, 28, 30, 31, 32,
        34, 35, 37, 38, 39, 41, 42, 44, 45, 46,
        48, 49, 51, 52, 54, 55, 56, 58, 59, 61,
        62, 63, 65, 66, 68, 69, 71, 72, 73, 75,
        76, 78, 79, 80, 82, 83, 85, 86, 87, 89,
        90, 92, 93, 95, 96, 97, 99, 100, 102, 103,
        104, 106, 107, 109, 110, 112, 113, 114, 116, 117,
        119, 120, 121, 123, 124, 126, 127, 128, 130, 131,
        133, 134, 136, 137, 138, 140, 141, 143, 144, 145,
      ],

      will: [
        15, 17, 18, 19, 20, 21, 22, 23, 25, 26,
        27, 28, 29, 30, 31, 33, 34, 35, 36, 37,
        38, 40, 41, 42, 43, 44, 45, 46, 48, 49,
        50, 51, 52, 53, 54, 56, 57, 58, 59, 60,
        61, 63, 64, 65, 66, 67, 68, 69, 71, 72,
        73, 74, 75, 76, 77, 79, 80, 81, 82, 83,
        84, 86, 87, 88, 89, 90, 91, 92, 94, 95,
        96, 97, 98, 99, 100, 102, 103, 104, 105, 106,
        107, 109, 110, 111, 112, 113, 114, 115, 117, 118,
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
        { name: "정합용 유체", count: 20, icon: "/materials/정합용 유체.webp" },
        { name: "스타게이트 버섯", count: 8, icon: "/materials/스타게이트 버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/materials/탈로시안 화폐.webp" },
      ],
    },
  ],

  skills: {
    normalAttack: {
      name: "바위의 속삭임",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 4단 공격을 하여 자연 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 18포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 자연 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 자연 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["30%", "33%", "36%", "39%", "42%", "45%", "48%", "51%", "54%", "58%", "62%", "68%"] },
        { label: "일반 공격 제2단계 배율", values: ["40%", "44%", "48%", "52%", "56%", "60%", "64%", "68%", "72%", "77%", "83%", "90%"] },
        { label: "일반 공격 제3단계 배율", values: ["53%", "58%", "63%", "68%", "74%", "79%", "84%", "89%", "95%", "101%", "109%", "118%"] },
        { label: "일반 공격 제4단계 배율", values: ["55%", "61%", "66%", "72%", "77%", "83%", "88%", "94%", "99%", "106%", "114%", "124%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "질주하는 돌리",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "돌리 씨를 타고 목표를 향해 돌진하여 자연 피해를 줍니다. 목표가 부식 상태일 때, 부식 상태를 소모하고, 대상에게 물리 취약과 아츠 취약 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["142%", "156%", "171%", "185%", "199%", "213%", "228%", "242%", "256%", "274%", "295%", "320%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "취약 효과", values: ["12%", "12%", "12%", "13%", "13%", "13%", "14%", "14%", "16%", "17%", "18%", "20%"] },
        { label: "취약 지속 시간(초)", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"] },
      ],
    },

    comboSkill: {
      name: "화산 분화",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "메인 컨트롤 오퍼레이터가 방어 불능 혹은 아츠 부착 상태에 처해 있지 않은 적에게 강력한 일격을 준 후 사용할 수 있습니다.",
        "화산 구름 한 덩이를 목표에 던지고 목표와 가까워진 후, 자연 피해를 주게 됩니다. 화산 구름은 목표를 추적한 다음, 일정 시간 뒤 폭발하며 주변의 다른 적에게 절반의 자연 피해를 주고 강제로 잠깐 부식 상태를 부여합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "18s", "17s"] },
        { label: "피해 배율", values: ["45%", "49%", "54%", "58%", "62%", "67%", "71%", "76%", "80%", "86%", "93%", "100%"] },
        { label: "폭발 피해 배율", values: ["111%", "122%", "133%", "144%", "155%", "167%", "178%", "189%", "200%", "214%", "230%", "250%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "부식 지속 시간(초)", values: ["7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "7"] },
      ],
    },

    ultimate: {
      name: "복슬복슬 파티",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" },
        { label: "쿨타임", value: "15s" },
      ],
      description: [
        "아델리아가 이동 가능한 지속 시전 상태에 들어가며, 돌리 씨를 소환하여 돌리 씨의 분신을 무작위로 사방에 던집니다. 각 분신이 적을 공격할 때마다 자연 피해를 주고, 적은 0.3초마다 최대 1회만 피해를 받습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90", "90"] },
        { label: "피해 배율", values: ["73%", "81%", "88%", "95%", "103%", "110%", "117%", "125%", "132%", "141%", "152%", "165%"] },
        { label: "불균형치", values: ["2", "2", "2", "2", "2", "2", "2", "2", "2", "3", "3", "3"] },
        { label: "지속 시간(초)", values: ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "양들의 천국",
      description: "배틀 스킬 질주하는 돌리가 부식을 소모했을 때, 부여하는 물리 취약과 아츠 취약 효과 +8%",
    },
    {
      title: "2",
      subtitle: "게임 보상",
      description: "재능 '친구의 그림자' 효과 강화: 메인 컨트롤 오퍼레이터가 돌리 씨의 그림자와 접촉한 후, 아델리아는 생명력 백분율이 가장 낮은 다른 아군 오퍼레이터 1명을 추가로 치유합니다. 해당 효과는 절반의 효과만 적용됩니다.",
    },
    {
      title: "3",
      subtitle: "격렬한 분출",
      description: "궁극기 복슬복슬 파티의 지속 시간 +1초, 돌리 씨의 그림자의 생성 확률이 기존의 1.2배로 증가합니다.",
    },
    {
      title: "4",
      subtitle: "바위틈의 꽃",
      description: "궁극기 복슬복슬 파티의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "화산 증기",
      description: "연계 스킬 화산 분화 쿨타임 -2초, 피해 배율이 기존의 1.2배로 증가합니다. 적에게 부여하는 부식 효과의 지속 시간 +4초",
    },
  ],

  talents: [
    {
      name: "친구의 그림자",
      unlock: "기본 해제",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 질주하는 돌리가 적에게 명중했을 때, 돌리 씨의 그림자 3개를 생성합니다. 궁극기 복슬복슬 파티로 흩어진 돌리 씨의 분신이 지면에 착지할 때, 10% 확률로 돌리 씨의 그림자를 생성합니다. 메인 컨트롤 오퍼레이터가 돌리 씨의 그림자를 닿은 후, 아델리아가 [45+의지×0.38]포인트의 생명력을 회복시킵니다.\n메인 컨트롤 오퍼레이터의 생명력이 가득 차 있으면, 팀 내 생명력 백분율이 가장 낮은 오퍼레이터를 대신 치유합니다.\n돌리 씨의 그림자는 10초 동안 지속되며, 동시에 최대 10개까지 존재할 수 있습니다.",
    },
    {
      name: "친구의 그림자",
      unlock: "정예화 단계 1 달성 시 활성화 가능",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 질주하는 돌리가 적에게 명중했을 때, 돌리 씨의 그림자 3개를 생성합니다. 궁극기 복슬복슬 파티로 흩어진 돌리 씨의 분신이 지면에 착지할 때, 10% 확률로 돌리 씨의 그림자를 생성합니다. 메인 컨트롤 오퍼레이터가 돌리 씨의 그림자를 닿은 후, 아델리아가 [63+의지×0.53]포인트의 생명력을 회복시킵니다.\n메인 컨트롤 오퍼레이터의 생명력이 가득 차 있으면, 팀 내 생명력 백분율이 가장 낮은 오퍼레이터를 대신 치유합니다.\n돌리 씨의 그림자는 10초 동안 지속되며, 동시에 최대 10개까지 존재할 수 있습니다.",
    },
    {
      name: "친구의 그림자",
      unlock: "정예화 단계 2 달성 시 활성화 가능",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 질주하는 돌리가 적에게 명중했을 때, 돌리 씨의 그림자 3개를 생성합니다. 궁극기 복슬복슬 파티로 흩어진 돌리 씨의 분신이 지면에 착지할 때, 10% 확률로 돌리 씨의 그림자를 생성합니다. 메인 컨트롤 오퍼레이터가 돌리 씨의 그림자를 닿은 후, 아델리아가 [90+의지×0.75]포인트의 생명력을 회복시킵니다.\n메인 컨트롤 오퍼레이터의 생명력이 가득 차 있으면, 팀 내 생명력 백분율이 가장 낮은 오퍼레이터를 대신 치유합니다.\n돌리 씨의 그림자는 10초 동안 지속되며, 동시에 최대 10개까지 존재할 수 있습니다.",
    },
    {
      name: "마운틴 서퍼",
      unlock: "정예화 단계 2 달성 시 해제 가능",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "아델리아의 배틀 스킬 질주하는 돌리가 추가 효과를 발동한 후, 근처에 부식 상태인 다른 적이 있을 경우, 즉시 대상에게 한 번 더 배틀 스킬을 발동합니다.\n해당 효과는 주동적으로 배틀 스킬을 사용할 때마다 1회만 발동합니다.",
    },
  ],

  infrastructureSkills: [
    {
      name: "대지의 이야기",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "응접실에 배치 시, 오퍼레이터의 단서 수집 기본 효율 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "응접실에 배치 시, 오퍼레이터의 단서 수집 기본 효율 30% 증가",
        },
      ],
    },
    {
      name: "돌리 씨의 게임",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "응접실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 14% 감소",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "응접실에 배치 시, 선실에 있는 오퍼레이터의 컨디션 소모 속도 18% 감소",
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
    talents: ARDELIA_TALENT_COSTS,
  },
} as const;