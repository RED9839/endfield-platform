const slug = "liino";

// 출처: warfarin.wiki(/kr/operators/liino) 실측. 스탯/재료/신뢰도 = turbo-stream .data(floor),
// 스킬 배율·설명 = 웹 표 + skillGroupMap, 재능·잠재 = 웹페이지 실측(.data 쪽은 치환 전 템플릿).
// 리노(Liino, chr_0035_liino)는 1.4 후반 추가된 6★ 전기·장병기 서포터.
// 배틀 스킬로 라이브 모드(팀 공격력+지속 치유), 궁극기로 보컬 모드(전기·자연 증폭 + 강제 감전)를 돌린다.

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
        materials: [{ name: "존속의 흔적", count: 1, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "초거리 빛 반사 파이프", count: 6, icon: "/items/초거리 빛 반사 파이프.webp" }, { name: "침식된 옥 잎", count: 3, icon: "/items/침식된 옥 잎.webp" }, { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M2",
        materials: [{ name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "초거리 빛 반사 파이프", count: 16, icon: "/items/초거리 빛 반사 파이프.webp" }, { name: "침식된 옥 잎", count: 6, icon: "/items/침식된 옥 잎.webp" }, { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M3",
        materials: [{ name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "초거리 빛 반사 파이프", count: 36, icon: "/items/초거리 빛 반사 파이프.webp" }, { name: "침식된 옥 잎", count: 12, icon: "/items/침식된 옥 잎.webp" }, { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" }],
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
        materials: [{ name: "존속의 흔적", count: 1, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 15, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "D96강 시제품 4번", count: 6, icon: "/items/D96강 시제품 4번.webp" }, { name: "침식된 옥 잎", count: 3, icon: "/items/침식된 옥 잎.webp" }, { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M2",
        materials: [{ name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "D96강 시제품 4번", count: 16, icon: "/items/D96강 시제품 4번.webp" }, { name: "침식된 옥 잎", count: 6, icon: "/items/침식된 옥 잎.webp" }, { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" }],
      },
      {
        level: "M3",
        materials: [{ name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" }, { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "D96강 시제품 4번", count: 36, icon: "/items/D96강 시제품 4번.webp" }, { name: "침식된 옥 잎", count: 12, icon: "/items/침식된 옥 잎.webp" }, { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" }],
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

export const liinoOperatorDetailData = {
  slug,
  name: "리노",
  enName: "Liino",
  rarity: 6 as const,

  element: "electric" as const,
  class: "supporter" as const,
  weaponType: "polearm" as const,

  mainStatLabel: "의지",
  subStatLabel: "민첩",

  avatar: `/operators/${slug}/avatar.webp`,
  fullImage: `/operators/${slug}/full.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [9, 26, 44, 62, 80, 89],
      dex: [14, 37, 61, 85, 109, 121],
      int: [9, 26, 45, 64, 82, 91],
      will: [21, 55, 90, 125, 160, 177],
      atk: [30, 90, 152, 215, 277, 309],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        9, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 19, 20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 48, 49, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 88, 89,
      ],

      dex: [
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

      int: [
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

      will: [
        21, 23, 25, 27, 28, 30, 32, 34, 35, 37,
        39, 41, 42, 44, 46, 48, 50, 51, 53, 55,
        57, 58, 60, 62, 64, 65, 67, 69, 71, 72,
        74, 76, 78, 79, 81, 83, 85, 86, 88, 90,
        92, 93, 95, 97, 99, 100, 102, 104, 106, 107,
        109, 111, 113, 114, 116, 118, 120, 121, 123, 125,
        127, 128, 130, 132, 134, 135, 137, 139, 141, 142,
        144, 146, 148, 149, 151, 153, 155, 156, 158, 160,
        162, 163, 165, 167, 169, 170, 172, 174, 176, 177,
      ],

      atk: [
        30, 33, 36, 39, 43, 46, 49, 52, 55, 58,
        61, 64, 68, 71, 74, 77, 80, 83, 86, 90,
        93, 96, 99, 102, 105, 108, 111, 115, 118, 121,
        124, 127, 130, 133, 136, 140, 143, 146, 149, 152,
        155, 158, 162, 165, 168, 171, 174, 177, 180, 183,
        187, 190, 193, 196, 199, 202, 205, 209, 212, 215,
        218, 221, 224, 227, 230, 234, 237, 240, 243, 246,
        249, 252, 256, 259, 262, 265, 268, 271, 274, 277,
        281, 284, 287, 290, 293, 296, 299, 303, 306, 309,
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
      materials: [{ name: "프로토콜 디스크 세트", count: 36, icon: "/items/프로토콜 디스크 세트.webp" }, { name: "정합용 유체", count: 20, icon: "/items/정합용 유체.webp" }, { name: "탈로스 버섯", count: 8, icon: "/items/탈로스 버섯.webp" }, { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" }],
    },
  ],

  skills: {
    normalAttack: {
      name: "반짝이는 하트",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 전기 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 19포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 전기 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 전기 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["19%", "21%", "22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "39%", "42%"] },
        { label: "일반 공격 제2단계 배율", values: ["27%", "29%", "32%", "35%", "37%", "40%", "43%", "45%", "48%", "51%", "56%", "60%"] },
        { label: "일반 공격 제3단계 배율", values: ["27%", "29%", "32%", "35%", "37%", "40%", "43%", "45%", "48%", "51%", "56%", "60%"] },
        { label: "일반 공격 제4단계 배율", values: ["36%", "40%", "43%", "47%", "50%", "54%", "58%", "61%", "65%", "69%", "75%", "81%"] },
        { label: "일반 공격 제5단계 배율", values: ["45%", "49%", "53%", "58%", "62%", "67%", "71%", "76%", "80%", "86%", "92%", "100%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "스포트라이트",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 25 }],
      description: [
        "적에게 전기 피해를 주고, 라이브 모드로 진입합니다. 이 기간 동안 근처에 적이 있으면 일정 시간마다 추가 공격을 하여 적에게 전기 피해를 줍니다. 라이브 모드: 지속 시간 동안 팀 전체의 공격력을 증가시키고, 전투에 들어간 후에는 범위 내의 오퍼레이터를 지속적으로 치유합니다. 지속 시간 동안 배틀 스킬이 모드 중단으로 대체되며, 모드 중단 사용 시 라이브 모드가 조기에 종료됩니다. 이때 스킬 게이지를 소모하지 않고, 배틀 스킬이 잠깐의 쿨타임에 들어갑니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "스킬 게이지 소모", values: ["25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25"] },
        { label: "초회 피해 배율", values: ["107%", "117%", "128%", "139%", "149%", "160%", "170%", "181%", "192%", "205%", "221%", "240%"] },
        { label: "추가 공격 피해 배율", values: ["53%", "59%", "64%", "69%", "75%", "80%", "85%", "91%", "96%", "103%", "111%", "120%"] },
        { label: "추가 공격 간격(초)", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "노랫소리 간격(초)", values: ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"] },
        { label: "라이브 모드 지속 시간(초)", values: ["60", "60", "60", "60", "60", "60", "60", "60", "60", "60", "60", "60"] },
        { label: "공격력 증가", values: ["6%", "6%", "6%", "7%", "7%", "7%", "8%", "8%", "8%", "9%", "9%", "10%"] },
        { label: "기초 치유 수치", values: ["18", "22", "25", "29", "31", "32", "34", "36", "38", "39", "40", "41"] },
        { label: "민첩 1포인트마다 증가하는 치유 수치", values: ["0.04", "0.05", "0.06", "0.07", "0.07", "0.08", "0.08", "0.08", "0.09", "0.09", "0.09", "0.09"] },
        { label: "불균형치", values: ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3"] },
      ],
    },

    comboSkill: {
      name: "기쁨의 멜로디",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", valueRowLabel: "쿨타임" }],
      description: [
        "라이브 모드의 지속 시간 동안, 적이 아츠 이상을 부여받거나 아츠 이상이 소모됐을 때 발동할 수 있습니다. 적에게 전기 피해를 주고, 메인 컨트롤 오퍼레이터를 치유하며, 추가로 궁극기 에너지를 획득합니다. 연계 스킬 기쁨의 멜로디를 사용하면 라이브 모드가 중단되지 않습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "쿨타임", values: ["10s", "10s", "10s", "10s", "10s", "10s", "10s", "10s", "9s", "9s", "9s", "8s"] },
        { label: "피해 배율", values: ["160%", "176%", "192%", "208%", "224%", "240%", "256%", "272%", "288%", "308%", "332%", "360%"] },
        { label: "불균형치", values: ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"] },
        { label: "획득하는 궁극기 에너지", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
        { label: "기초 치유 수치", values: ["72", "86", "101", "115", "122", "130", "137", "144", "151", "155", "158", "162"] },
        { label: "민첩 1포인트마다 증가하는 치유 수치", values: ["0.17", "0.2", "0.24", "0.27", "0.29", "0.3", "0.32", "0.34", "0.35", "0.36", "0.37", "0.38"] },
      ],
    },

    ultimate: {
      name: "샛별의 협주곡",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [{ label: "필요한 궁극기 에너지", value: 160 }],
      description: [
        "팀 전체를 치유함과 동시에, 보컬 모드에 진입하여 지속적으로 무대 위 특수 효과를 사용해 전기 피해를 주고, 이어서 클라이맥스를 구성해 넓은 범위 내의 적에게 전기 피해를 주며, 강제로 감전을 부여합니다. 보컬 모드: 라이브 모드를 대체하며, 지속 시간 동안 팀 전체의 공격력을 증가시키고, 의지에 따라 증가하는 전기 증폭과 자연 증폭을 부여합니다. 노랫소리가 범위 내의 적에게 지속적으로 전기 피해를 주고, 범위 내의 아군 오퍼레이터를 지속적으로 치유합니다. 종료 시, 범위 내의 적에게 단일 노랫소리 피해의 3배에 해당하는 피해를 주고, 팀 전체에게 단일 치유량의 3배에 해당하는 생명력을 회복시킵니다. 조기 종료 시 해당 효과는 발동하지 않습니다. 지속 시간 동안 배틀 스킬이 모드 중단으로 대체되며, 모드 중단 사용 시 보컬 모드가 조기에 종료됩니다. 이때 스킬 게이지를 소모하지 않습니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "필요한 궁극기 에너지", values: ["160", "160", "160", "160", "160", "160", "160", "160", "160", "160", "160", "160"] },
        { label: "쿨타임", values: ["20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s", "20s"] },
        { label: "무대 위 특수 효과 피해 배율", values: ["142%", "156%", "171%", "185%", "199%", "213%", "228%", "242%", "256%", "274%", "295%", "320%"] },
        { label: "클라이맥스 피해 배율", values: ["284%", "313%", "341%", "370%", "398%", "427%", "455%", "483%", "512%", "547%", "590%", "640%"] },
        { label: "공격력 증가", values: ["10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%"] },
        { label: "의지 1포인트마다 증가하는 증폭 효과", values: ["0.018%", "0.02%", "0.021%", "0.023%", "0.025%", "0.027%", "0.028%", "0.03%", "0.032%", "0.034%", "0.037%", "0.04%"] },
        { label: "의지 증가 증폭 최대치", values: ["40%", "40%", "40%", "40%", "45%", "45%", "45%", "45%", "45%", "50%", "55%", "60%"] },
        { label: "초회 기초 치유 수치", values: ["324", "389", "454", "518", "551", "583", "616", "648", "680", "697", "713", "729"] },
        { label: "민첩 1포인트마다 증가하는 치유 수치", values: ["0.76", "0.91", "1.06", "1.21", "1.29", "1.36", "1.44", "1.51", "1.59", "1.63", "1.66", "1.7"] },
        { label: "노랫소리 1회 피해 배율", values: ["27%", "29%", "32%", "35%", "37%", "40%", "42%", "45%", "48%", "51%", "55%", "60%"] },
        { label: "1회 기초 치유 수치", values: ["36", "43", "50", "58", "61", "65", "68", "72", "76", "77", "79", "81"] },
        { label: "민첩 1포인트마다 증가하는 치유 수치", values: ["0.08", "0.1", "0.12", "0.13", "0.14", "0.15", "0.16", "0.17", "0.18", "0.18", "0.18", "0.19"] },
        { label: "노랫소리 간격(초)", values: ["1.5", "1.5", "1.5", "1.5", "1.5", "1.5", "1.5", "1.5", "1.5", "1.5", "1.5", "1.5"] },
        { label: "보컬 모드 지속 시간(초)", values: ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"] },
        { label: "클라이맥스 불균형치", values: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20", "20"] },
      ],
    },
  },

  potential: [
    {
      title: "1",
      subtitle: "완벽한 무대",
      description: "라이브 모드가 아닌 상태로 전투에 진입한 후, 처음으로 배틀 스킬 스포트라이트를 사용하면 추가로 스킬 게이지 25포인트를 반환합니다. 라이브 모드 및 보컬 모드의 공격력 증가 효과 추가 +6%",
    },
    {
      title: "2",
      subtitle: "무대 뒤의 결의",
      description: "의지 +20, 치유 효율 +10%.",
    },
    {
      title: "3",
      subtitle: "하늘을 향한 동경",
      description: "연계 스킬 기쁨의 멜로디 효과가 강화됩니다. 쿨타임 -1초, 피해 배율과 치료 효과가 기존의 1.4배로 증가합니다.",
    },
    {
      title: "4",
      subtitle: "유성의 리듬",
      description: "궁극기 샛별의 협주곡의 사용에 필요한 궁극기 에너지 -15%",
    },
    {
      title: "5",
      subtitle: "마음을 채찍질하는 질문",
      description: "궁극기 샛별의 협주곡이 제공하는 증폭 효과가 기존의 1.2배로 증가합니다. 배틀 스킬 스포트라이트 및 궁극기 샛별의 협주곡의 피해 배율이 기존의 1.2배로 증가합니다.",
    },
  ],

  talents: [
    {
      name: "아이돌 영역",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "라이브 모드 및 보컬 모드 지속 시간 동안, 범위 내 오퍼레이터가 받는 치유량 보너스 +10%, 받는 피해 -10%. 범위를 벗어난 후에도 해당 효과는 3초 동안 지속됩니다.",
    },
    {
      name: "아이돌 영역",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "라이브 모드 및 보컬 모드 지속 시간 동안, 범위 내 오퍼레이터가 받는 치유량 보너스 +20%, 받는 피해 -20%. 범위를 벗어난 후에도 해당 효과는 3초 동안 지속됩니다.",
    },
    {
      name: "일등성의 격려",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "연계 스킬 기쁨의 멜로디 사용 후, 팀 내 전기 또는 자연 속성 오퍼레이터가 다음 배틀 스킬을 사용할 시 5 스킬 게이지를 반환합니다. 해당 효과는 30초간 지속, 중첩되지 않으며, 발동 후 효과가 종료됩니다.",
    },
    {
      name: "일등성의 격려",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "연계 스킬 기쁨의 멜로디 사용 후, 팀 내 전기 또는 자연 속성 오퍼레이터가 다음 배틀 스킬을 사용할 시 10 스킬 게이지를 반환합니다. 해당 효과는 30초간 지속, 중첩되지 않으며, 발동 후 효과가 종료됩니다.",
    },
  ],

  infrastructureSkills: [
    {
      name: "아이돌의 열정",
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
      name: "무대의 여운",
      icon: `/operators/${slug}/infrastructure/skill2.webp`,
      levels: [
        {
          tier: "β",
          unlockText: "정예화 단계 2 달성 시 해제 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 12% 증가",
        },
        {
          tier: "γ",
          unlockText: "정예화 단계 4 달성 시 활성화 가능",
          description: "핵심 제어 중추에 배치 시, 모든 오퍼레이터의 컨디션 회복 속도 16% 증가",
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
      { talent: 1, stage: 1, elite: 1, materials: [{ name: "프로토콜 프리즘", count: 12, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 2400, icon: "/items/탈로시안 화폐.webp" }] },
      { talent: 1, stage: 2, elite: 2, materials: [{ name: "프로토콜 프리즘", count: 40, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 8600, icon: "/items/탈로시안 화폐.webp" }] },
      { talent: 2, stage: 1, elite: 2, materials: [{ name: "프로토콜 프리즘", count: 48, icon: "/items/프로토콜 프리즘.webp" }, { name: "탈로시안 화폐", count: 10000, icon: "/items/탈로시안 화폐.webp" }] },
      { talent: 2, stage: 2, elite: 3, materials: [{ name: "프로토콜 프리즘 세트", count: 28, icon: "/items/프로토콜 프리즘 세트.webp" }, { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" }] },
    ],
  },
} as const;
