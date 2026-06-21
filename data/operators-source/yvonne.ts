const slug = "yvonne";

// 규칙:
// 앞 재료 = 기본공격 + 연계스킬
// 뒤 재료 = 배틀스킬 + 궁극기
// 이번 데이터 기준: 초거리 빛 반사 파이프, D96강 시제품 4번

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
      { name: "D96강 시제품 4번", count: 6, icon: "/items/D96강 시제품 4번.webp" },
      { name: "바위아겔로스 잎", count: 3, icon: "/items/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "D96강 시제품 4번", count: 16, icon: "/items/D96강 시제품 4번.webp" },
      { name: "바위아겔로스 잎", count: 6, icon: "/items/바위아겔로스 잎.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "D96강 시제품 4번", count: 36, icon: "/items/D96강 시제품 4번.webp" },
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

export const yvonneOperatorDetailData = {
  slug,
  name: "이본",
  enName: "Yvonne",
  rarity: 6 as const,

  element: "cryo" as const,
  class: "striker" as const,
  weaponType: "handcannon" as const,

  mainStatLabel: "지능",
  subStatLabel: "민첩",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [8, 24, 40, 57, 74, 82],
      dex: [14, 38, 64, 89, 115, 128],
      int: [24, 57, 91, 125, 159, 176],
      will: [10, 30, 52, 73, 94, 105],
      atk: [30, 92, 157, 223, 288, 321],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        8, 9, 10, 10, 11, 12, 13, 14, 15, 15,
        16, 17, 18, 19, 20, 20, 21, 22, 23, 24,
        25, 25, 26, 27, 28, 29, 30, 30, 31, 32,
        33, 34, 35, 35, 36, 37, 38, 39, 40, 40,
        41, 42, 43, 44, 45, 45, 46, 47, 48, 49,
        50, 50, 51, 52, 53, 54, 55, 55, 56, 57,
        58, 59, 60, 60, 61, 62, 63, 64, 65, 65,
        66, 67, 68, 69, 70, 70, 71, 72, 73, 74,
        75, 75, 76, 77, 78, 79, 80, 81, 81, 82,
      ],

      dex: [
        14, 16, 17, 18, 19, 21, 22, 23, 24, 26,
        27, 28, 30, 31, 32, 33, 35, 36, 37, 38,
        40, 41, 42, 44, 45, 46, 47, 49, 50, 51,
        52, 54, 55, 56, 58, 59, 60, 61, 63, 64,
        65, 66, 68, 69, 70, 72, 73, 74, 75, 77,
        78, 79, 81, 82, 83, 84, 86, 87, 88, 89,
        91, 92, 93, 95, 96, 97, 98, 100, 101, 102,
        103, 105, 106, 107, 109, 110, 111, 112, 114, 115,
        116, 117, 119, 120, 121, 123, 124, 125, 126, 128,
      ],

      int: [
        24, 26, 28, 29, 31, 33, 34, 36, 38, 39,
        41, 43, 45, 46, 48, 50, 51, 53, 55, 57,
        58, 60, 62, 63, 65, 67, 69, 70, 72, 74,
        75, 77, 79, 80, 82, 84, 86, 87, 89, 91,
        92, 94, 96, 98, 99, 101, 103, 104, 106, 108,
        110, 111, 113, 115, 116, 118, 120, 121, 123, 125,
        127, 128, 130, 132, 133, 135, 137, 139, 140, 142,
        144, 145, 147, 149, 151, 152, 154, 156, 157, 159,
        161, 163, 164, 166, 168, 169, 171, 173, 174, 176,
      ],

      will: [
        10, 11, 12, 13, 14, 15, 16, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 35, 36, 37, 38, 39, 40, 41,
        42, 43, 44, 45, 46, 47, 48, 49, 50, 52,
        53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 69, 70, 71, 72, 73,
        74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
        84, 86, 87, 88, 89, 90, 91, 92, 93, 94,
        95, 96, 97, 98, 99, 100, 101, 102, 104, 105,
      ],

      atk: [
        30, 33, 37, 40, 43, 46, 50, 53, 56, 59,
        63, 66, 69, 72, 76, 79, 82, 85, 89, 92,
        95, 99, 102, 105, 108, 112, 115, 118, 121, 125,
        128, 131, 134, 138, 141, 144, 148, 151, 154, 157,
        161, 164, 167, 170, 174, 177, 180, 183, 187, 190,
        193, 196, 200, 203, 206, 210, 213, 216, 219, 223,
        226, 229, 232, 236, 239, 242, 245, 249, 252, 255,
        259, 262, 265, 268, 272, 275, 278, 281, 285, 288,
        291, 294, 298, 301, 304, 307, 311, 314, 317, 321,
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
        { name: "타키온 차폐 구조체", count: 20, icon: "/items/타키온 차폐 구조체.webp" },
        { name: "피버섯", count: 8, icon: "/items/피버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
  ],

  skills: {
    normalAttack: {
      name: "점프 트리거",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 냉기 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 17포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 냉기 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 냉기 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["24%", "26%", "28%", "31%", "33%", "35%", "38%", "40%", "42%", "45%", "49%", "53%"] },
        { label: "일반 공격 제2단계 배율", values: ["25%", "28%", "30%", "33%", "35%", "38%", "40%", "43%", "45%", "48%", "52%", "56%"] },
        { label: "일반 공격 제3단계 배율", values: ["32%", "35%", "38%", "41%", "44%", "47%", "50%", "54%", "57%", "61%", "65%", "71%"] },
        { label: "일반 공격 제4단계 배율", values: ["41%", "45%", "49%", "53%", "58%", "62%", "66%", "70%", "74%", "79%", "85%", "92%"] },
        { label: "일반 공격 제5단계 배율", values: ["56%", "62%", "67%", "73%", "79%", "84%", "90%", "96%", "101%", "108%", "117%", "126%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "얼음 폭탄 · β형",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "전방을 향해 냉각탄을 발사합니다. 냉각탄은 적에게 명중된 다음 폭발하며 냉기 피해를 줍니다.",
        "냉기 부착 혹은 자연 부착 상태의 적에게 명중했을 때, 목표가 보유한 모든 아츠 부착을 소모하고, 대상에게 강제로 동결을 부여하며 소모한 스택 수치에 따라 냉기 피해를 줍니다.",
        "배틀 스킬로 적에게 동결 상태를 부여한 후, 소모한 스택 수치에 따라 추가로 궁극기 에너지를 획득하며 여러 목표를 명중했을 경우 1회만 획득합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "기초 피해 배율", values: ["111%", "122%", "133%", "144%", "155%", "167%", "178%", "189%", "200%", "214%", "230%", "250%"] },
        { label: "동결을 부여할 때 피해 배율", values: ["67%", "73%", "80%", "87%", "93%", "100%", "107%", "113%", "120%", "128%", "138%", "150%"] },
        { label: "중첩된 부착 스택을 소모할 때마다 추가되는 피해 배율", values: ["89%", "98%", "107%", "116%", "124%", "133%", "142%", "151%", "160%", "171%", "185%", "200%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "동결을 부여할 때 획득하는 궁극기 에너지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "중첩된 부착 스택을 소모할 때마다 추가로 획득하는 궁극기 에너지", values: ["30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"] },
      ],
    },

    comboSkill: {
      name: "꽁꽁이 · υ37",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "메인 컨트롤 오퍼레이터가 동결 상태의 적에게 강력한 일격을 사용했을 때 사용할 수 있습니다.",
        "즉시 목표의 곁에 꽁꽁이를 배치하고 끊임없이 충격파를 발사합니다. 주변의 적에게 냉기 피해를 주고, 지속적으로 모든 적을 중심으로 끌어당깁니다.",
        "지속 시간이 끝나면, 꽁꽁이가 자폭하여 주위의 적에게 강제로 동결 상태를 부여하고 냉기 피해를 줍니다.",
        "연계 스킬이 적을 명중한 후, 추가로 궁극기 에너지를 획득합니다. 여러 목표를 명중하더라도 1회만 획득합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "19s", "19s", "19s", "18s"] },
        { label: "지속 시간(초)", values: ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"] },
        { label: "에너지 사용 횟수", values: ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4"] },
        { label: "에너지 피해 배율", values: ["45%", "49%", "54%", "58%", "62%", "67%", "71%", "76%", "80%", "86%", "93%", "100%"] },
        { label: "폭발 피해 배율", values: ["89%", "98%", "107%", "116%", "125%", "134%", "142%", "151%", "160%", "171%", "185%", "200%"] },
        { label: "폭발 불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "추가로 획득하는 궁극기 에너지", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    ultimate: {
      name: "아이스 슈터",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [{ label: "필요한 궁극기 에너지", valueRowLabel: "필요한 궁극기 에너지" }],
      description: [
        "삐삐를 배치하여 지원을 요청하고 메인 컨트롤 오퍼레이터로 전환합니다.",
        "일정 시간 동안, 이본의 일반 공격이 강화되며 일반 공격을 할 때마다 자신의 치명타 확률이 증가합니다.",
        "스택 수치가 최대로 쌓였을 경우, 자신의 치명타 피해가 증가합니다.",
        "지속 시간이 끝나기 전의 마지막 공격은 강력한 일격으로 바뀌어 대량의 냉기 피해를 줍니다.",
        "적이 동결 상태라면, 추가로 냉기 피해를 1회 준 후, 동결 상태를 소모합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["220", "220", "220", "220", "220", "220", "220", "220", "220", "220", "220", "220"] },
        { label: "지속 시간(초)", values: ["7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "7", "7"] },
        { label: "일반 공격 피해 배율", values: ["8.9%", "9.8%", "10.7%", "11.6%", "12.5%", "13.4%", "14.3%", "15.1%", "16%", "17.2%", "18.5%", "20%"] },
        { label: "강력 공격 피해 배율", values: ["133%", "147%", "160%", "173%", "186%", "200%", "213%", "226%", "240%", "256%", "276%", "300%"] },
        { label: "추가 공격 피해 배율", values: ["267%", "294%", "320%", "347%", "374%", "400%", "427%", "454%", "480%", "514%", "554%", "600%"] },
        { label: "강력한 공격 불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
        { label: "최대 중첩 스택 수치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "1스택마다 증가하는 치명타 확률", values: ["3%", "3%", "3%", "3%", "3%", "3%", "3%", "3%", "3%", "3%", "3%", "3%"] },
        { label: "최대 중첩 시 증가하는 치명타 피해", values: ["60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%", "60%"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "급속 냉동 도우미",
      description: "연계 스킬 꽁꽁이 · υ37의 적용 범위 +20%, 추가로 에너지를 2회 더 방출하고, 피해를 준 후 추가로 15포인트의 궁극기 에너지를 획득합니다.",
    },
    {
      title: "2",
      subtitle: "완벽한 창조물",
      description: "지능 +20, 치명타 확률 +7%",
    },
    {
      title: "3",
      subtitle: "똑딱 충전",
      description: "재능 빙점 효과 강화: 냉기 부착 상태의 적에게 주는 추가 치명타 피해 +10%, 동결 상태의 적에게도 동일하게 효과가 두 배로 적용됩니다.",
    },
    {
      title: "4",
      subtitle: "거스르는 마음",
      description: "배틀 스킬 얼음 폭탄 · β형의 폭발이 단일 목표에 명중했을 때, 스킬 게이지 10포인트를 반환합니다.",
    },
    {
      title: "5",
      subtitle: "기교 전문가",
      description: "궁극기 아이스 슈터가 지속되는 동안, 공격력 +10%, 치명타 피해 +30%",
    },
  ],

  talents: [
    {
      name: "하이테크 버스트",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 얼음 폭탄 · β형이 동결을 부여한 후, 다음 일반 공격에서 바로 강력한 일격을 사용합니다.",
    },
    {
      name: "하이테크 버스트",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "배틀 스킬 얼음 폭탄 · β형이 동결을 부여한 후, 다음 일반 공격에서 바로 강력한 일격을 사용합니다. 해당 강력한 일격이 주는 피해 +50%",
    },
    {
      name: "빙점",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "냉기 부착 상태의 적에게 주는 치명타 피해 +10%. 동결 상태의 적에게는 두 배의 피해를 줍니다.",
    },
    {
      name: "빙점",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "냉기 부착 상태의 적에게 주는 치명타 피해 +20%. 동결 상태의 적에게는 두 배의 피해를 줍니다.",
    },
  ],

  infrastructureSkills: [
    {
      name: "버섯 색소 추출",
      icon: `/operators/${slug}/infrastructure/skill1.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 1 달성 시 해제 가능",
          description: "재배실에 배치 시, 버섯 재료의 육성 속도 20% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 3 달성 시 활성화 가능",
          description: "재배실에 배치 시, 버섯 재료의 육성 속도 30% 증가",
        },
      ],
    },
    {
      name: "패션 피플",
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
    { level: 1, label: "지능 +10" },
    { level: 2, label: "지능 +15" },
    { level: 3, label: "지능 +15" },
    { level: 4, label: "지능 +20" },
  ],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: [
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
    ],
    infrastructure: [
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
    ],
    talents: [
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
    ],
  },
} as const;