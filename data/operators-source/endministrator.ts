const slug = "endministrator";

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
      { name: "D96강 시제품 4번", count: 3, icon: "/items/D96강 시제품 4번.webp" },
      { name: "탈로시안 화폐", count: 24000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M2",
    materials: [
      { name: "존속의 흔적", count: 2, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 24, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 16, icon: "/items/타키온 차폐 구조체.webp" },
      { name: "D96강 시제품 4번", count: 6, icon: "/items/D96강 시제품 4번.webp" },
      { name: "탈로시안 화폐", count: 30000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
  {
    level: "M3",
    materials: [
      { name: "존속의 흔적", count: 3, icon: "/items/존속의 흔적.webp" },
      { name: "프로토콜 프리즘 세트", count: 50, icon: "/items/프로토콜 프리즘 세트.webp" },
      { name: "타키온 차폐 구조체", count: 36, icon: "/items/타키온 차폐 구조체.webp" },
      { name: "D96강 시제품 4번", count: 12, icon: "/items/D96강 시제품 4번.webp" },
      { name: "탈로시안 화폐", count: 65000, icon: "/items/탈로시안 화폐.webp" },
    ],
  },
] as const;

const battleAndUltimateSkillUpgradeMaterials = normalAndComboSkillUpgradeMaterials;

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

const EMPTY_TRUST_BONUS_COSTS = [] as const;
const EMPTY_INFRASTRUCTURE_COSTS = [] as const;

const ENDMINISTRATOR_TALENT_COSTS = [
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

export const endministratorOperatorDetailData = {
  slug,
  id: "endministrator",

  name: "관리자",
  enName: "Endministrator",
  rarity: 6 as const,

  element: "physical" as const,
  class: "guard" as const,
  weaponType: "한손검",

  mainStatLabel: "민첩",
  subStatLabel: "힘",

  // 카드 목록용
  avatar: `/operators/${slug}/avatar1.webp`,
  avatarSecondary: `/operators/${slug}/avatar2.webp`,

  // 상세 페이지용
  fullImage: `/operators/${slug}/full1.webp`,
  fullImageSecondary: `/operators/${slug}/full2.webp`,

  levelStats: {
    summary: {
      levels: [1, 20, 40, 60, 80, 90],
      str: [14, 38, 62, 86, 111, 123],
      dex: [14, 41, 69, 98, 126, 140],
      int: [9, 28, 47, 67, 87, 96],
      will: [10, 31, 53, 74, 96, 107],
      atk: [30, 92, 157, 222, 287, 319],
      hp: [500, 1566, 2689, 3811, 4934, 5495],
    },

    detail: {
      levels: Array.from({ length: 90 }, (_, i) => i + 1),

      str: [
        14, 15, 17, 18, 19, 20, 22, 23, 24, 25,
        26, 28, 29, 30, 31, 33, 34, 35, 36, 38,
        39, 40, 41, 42, 44, 45, 46, 47, 49, 50,
        51, 52, 53, 55, 56, 57, 58, 60, 61, 62,
        63, 64, 66, 67, 68, 69, 71, 72, 73, 74,
        75, 77, 78, 79, 80, 82, 83, 84, 85, 86,
        88, 89, 90, 91, 93, 94, 95, 96, 97, 99,
        100, 101, 102, 104, 105, 106, 107, 109, 110, 111,
        112, 113, 115, 116, 117, 118, 120, 121, 122, 123,
      ],

      dex: [
        14, 15, 17, 18, 19, 21, 22, 24, 25, 27,
        28, 29, 31, 32, 34, 35, 36, 38, 39, 41,
        42, 44, 45, 46, 48, 49, 51, 52, 54, 55,
        56, 58, 59, 61, 62, 64, 65, 66, 68, 69,
        71, 72, 73, 75, 76, 78, 79, 81, 82, 83,
        85, 86, 88, 89, 91, 92, 93, 95, 96, 98,
        99, 101, 102, 103, 105, 106, 108, 109, 110, 112,
        113, 115, 116, 118, 119, 120, 122, 123, 125, 126,
        128, 129, 130, 132, 133, 135, 136, 137, 139, 140,
      ],

      int: [
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

      will: [
        10, 11, 12, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 27, 28, 29, 30, 31,
        32, 33, 34, 35, 36, 37, 38, 40, 41, 42,
        43, 44, 45, 46, 47, 48, 49, 50, 51, 53,
        54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
        64, 66, 67, 68, 69, 70, 71, 72, 73, 74,
        75, 76, 77, 79, 80, 81, 82, 83, 84, 85,
        86, 87, 88, 89, 90, 92, 93, 94, 95, 96,
        97, 98, 99, 100, 101, 102, 103, 104, 106, 107,
      ],

      atk: [
        30, 33, 36, 40, 43, 46, 49, 53, 56, 59,
        62, 66, 69, 72, 75, 79, 82, 85, 88, 92,
        95, 98, 101, 105, 108, 111, 114, 118, 121, 124,
        127, 131, 134, 137, 140, 144, 147, 150, 153, 157,
        160, 163, 166, 170, 173, 176, 179, 183, 186, 189,
        192, 196, 199, 202, 205, 209, 212, 215, 218, 222,
        225, 228, 231, 235, 238, 241, 244, 248, 251, 254,
        257, 261, 264, 267, 270, 274, 277, 280, 283, 287,
        290, 293, 296, 300, 303, 306, 309, 313, 316, 319,
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
        { name: "초거리 빛 반사 파이프", count: 20, icon: "/items/초거리 빛 반사 파이프.webp" },
        { name: "피버섯", count: 8, icon: "/items/피버섯.webp" },
        { name: "탈로시안 화폐", count: 100000, icon: "/items/탈로시안 화폐.webp" },
      ],
    },
  ],

  talents: [
    {
      name: "본질 붕괴",
      unlock: "Promote to E1 to unlock",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "적에게 부착한 오리지늄 결정이 소모됐을 때, 자신의 공격력 +15%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
    {
      name: "본질 붕괴",
      unlock: "Promote to E2 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent1.webp`,
      description: "적에게 부착한 오리지늄 결정이 소모됐을 때, 자신의 공격력 +30%, 15초 동안 지속. 해당 효과는 중첩되지 않습니다.",
    },
    {
      name: "현실 정지",
      unlock: "Promote to E2 to unlock",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "오리지늄 결정이 부착된 적이 받는 물리 피해 +10%",
    },
    {
      name: "현실 정지",
      unlock: "Promote to E3 to activate the upgraded effect",
      icon: `/operators/${slug}/talents/talent2.webp`,
      description: "오리지늄 결정이 부착된 적이 받는 물리 피해 +20%",
    },
  ],

  potential: [
    {
      title: "1",
      subtitle: "마지막 각성",
      description: "배틀 스킬 구성 시퀀스가 오리지늄 결정을 소모했을 때, 스킬 게이지를 50포인트 반환합니다.",
    },
    {
      title: "2",
      subtitle: "권능 반영",
      description: "재능 '본질 붕괴' 효과 강화: 자신이 공격력 증가 효과를 획득할 때, 다른 아군 오퍼레이터가 공격력 증가 효과의 절반을 획득합니다.",
    },
    {
      title: "3",
      subtitle: "???",
      description: "???",
    },
    {
      title: "4",
      subtitle: "???",
      description: "???",
    },
    {
      title: "5",
      subtitle: "???",
      description: "???",
    },
  ],

  skills: {
    normalAttack: {
      name: "훼손 시퀀스",
      typeLabel: "일반 공격",
      icon: `/operators/${slug}/skills/normal.webp`,
      description: [
        "일반 공격: 적에게 최대 5단 공격을 하여 물리 피해를 줍니다. 메인 컨트롤 오퍼레이터라면 강력한 일격이 18포인트의 불균형 피해를 줍니다.",
        "낙하 공격: 공중에 떴을 때, 일반 공격을 사용하면 낙하하며 주변의 적을 공격하고 물리 피해를 줍니다.",
        "처형 공격: 주변에 불균형 상태의 적이 있을 때, 일반 공격을 사용하면 해당 적을 처형하여 대량의 물리 피해를 주고 일정량의 스킬 게이지를 회복합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "일반 공격 제1단계 배율", values: ["23%", "25%", "27%", "29%", "32%", "34%", "36%", "39%", "41%", "44%", "47%", "51%"] },
        { label: "일반 공격 제2단계 배율", values: ["27%", "30%", "32%", "35%", "38%", "41%", "43%", "46%", "49%", "52%", "56%", "61%"] },
        { label: "일반 공격 제3단계 배율", values: ["30%", "33%", "36%", "39%", "42%", "45%", "48%", "51%", "54%", "58%", "63%", "68%"] },
        { label: "일반 공격 제4단계 배율", values: ["35%", "38%", "41%", "45%", "48%", "52%", "55%", "59%", "62%", "67%", "72%", "78%"] },
        { label: "일반 공격 제5단계 배율", values: ["40%", "44%", "48%", "52%", "56%", "60%", "64%", "68%", "72%", "77%", "83%", "90%"] },
        { label: "처형 공격 배율", values: ["400%", "440%", "480%", "520%", "560%", "600%", "640%", "680%", "720%", "770%", "830%", "900%"] },
        { label: "낙하 공격 배율", values: ["80%", "88%", "96%", "104%", "112%", "120%", "128%", "136%", "144%", "154%", "166%", "180%"] },
      ],
    },

    battleSkill: {
      name: "구성 시퀀스",
      typeLabel: "배틀 스킬",
      icon: `/operators/${slug}/skills/battle.webp`,
      meta: [{ label: "스킬 게이지 소모", value: 100 }],
      description: [
        "오리지늄 아츠를 사용해 전방 일정 범위 내의 적을 공격하여 물리 피해를 주고 강타합니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["156%", "171%", "187%", "202%", "218%", "234%", "249%", "265%", "280%", "300%", "323%", "350%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
      ],
    },

    comboSkill: {
      name: "봉인 시퀀스",
      typeLabel: "연계 스킬",
      icon: `/operators/${slug}/skills/combo.webp`,
      meta: [{ label: "쿨타임", value: 16 }],
      description: [
        "팀 내 다른 오퍼레이터의 연계 스킬이 피해를 줄 때 사용할 수 있습니다.",
        "적의 근처로 돌진하여 대상에게 물리 피해를 주고 오리지늄 결정을 부착하며 일정 시간 봉인합니다. 물리 이상 효과 혹은 방어 불능 상태를 부여하면 오리지늄 결정을 소모하고 추가 물리 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: normalAndComboSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["45%", "49%", "54%", "58%", "62%", "67%", "71%", "76%", "80%", "86%", "93%", "100%"] },
        { label: "결정 파괴 피해 배율", values: ["178%", "196%", "213%", "231%", "249%", "267%", "284%", "302%", "320%", "342%", "369%", "400%"] },
        { label: "불균형치", values: ["10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10", "10"] },
        { label: "봉인 시간(초)", values: ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4.5", "4.5", "5"] },
      ],
    },

    ultimate: {
      name: "폭격 시퀀스",
      typeLabel: "궁극기",
      icon: `/operators/${slug}/skills/ultimate.webp`,
      meta: [
        { label: "필요한 궁극기 게이지", value: 80 },
        { label: "쿨타임", value: "10초" },
      ],
      description: [
        "오리지늄 아츠로 지면을 강타하여, 전방 부채꼴 범위 내의 적에게 대량의 물리 피해를 줍니다. 적에게 오리지늄 결정이 부착되어 있을 경우, 오리지늄 결정을 소모하며 1회에 한하여 추가로 물리 피해를 줍니다.",
      ],
      levels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "M1", "M2", "M3"],
      upgradeMaterials: battleAndUltimateSkillUpgradeMaterials,
      rows: [
        { label: "피해 배율", values: ["356%", "391%", "427%", "462%", "498%", "533%", "569%", "604%", "640%", "684%", "738%", "800%"] },
        { label: "추가 피해 배율", values: ["267%", "294%", "320%", "347%", "374%", "400%", "427%", "454%", "480%", "514%", "554%", "600%"] },
        { label: "불균형치", values: ["25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25", "25"] },
      ],
    },
  },

  infrastructureSkills: [],
  trustBonus: [],

  requiredMaterials: {
    levelUp: COMMON_LEVEL_UP_COSTS,
    trustBonus: EMPTY_TRUST_BONUS_COSTS,
    infrastructure: EMPTY_INFRASTRUCTURE_COSTS,
    talents: ENDMINISTRATOR_TALENT_COSTS,
  },
} as const;