import type { SourceWeaponDetail } from "../weapons-detail-data";

export const whitenightnova = {
  slug: "whitenightnova",
  name: "백야의 별",
  enName: "White Night Nova",
  rarity: 6,
  weaponType: "sword",
  image: "/weapons/whitenightnova.webp",
  series: "고통",
  mainStatLabel: "공격력",
  subStatLabel: "주요 능력치",

  levelStats: [
    { level: 1, attack: 51 },
    { level: 2, attack: 56 },
    { level: 3, attack: 61 },
    { level: 4, attack: 66 },
    { level: 5, attack: 71 },
    { level: 6, attack: 77 },
    { level: 7, attack: 82 },
    { level: 8, attack: 87 },
    { level: 9, attack: 92 },
    { level: 10, attack: 97 },
    { level: 11, attack: 102 },
    { level: 12, attack: 107 },
    { level: 13, attack: 112 },
    { level: 14, attack: 117 },
    { level: 15, attack: 122 },
    { level: 16, attack: 128 },
    { level: 17, attack: 133 },
    { level: 18, attack: 138 },
    { level: 19, attack: 143 },
    { level: 20, attack: 148 },
    { level: 21, attack: 153 },
    { level: 22, attack: 158 },
    { level: 23, attack: 163 },
    { level: 24, attack: 168 },
    { level: 25, attack: 173 },
    { level: 26, attack: 179 },
    { level: 27, attack: 184 },
    { level: 28, attack: 189 },
    { level: 29, attack: 194 },
    { level: 30, attack: 199 },
    { level: 31, attack: 204 },
    { level: 32, attack: 209 },
    { level: 33, attack: 214 },
    { level: 34, attack: 219 },
    { level: 35, attack: 224 },
    { level: 36, attack: 230 },
    { level: 37, attack: 235 },
    { level: 38, attack: 240 },
    { level: 39, attack: 245 },
    { level: 40, attack: 250 },
    { level: 41, attack: 255 },
    { level: 42, attack: 260 },
    { level: 43, attack: 265 },
    { level: 44, attack: 270 },
    { level: 45, attack: 275 },
    { level: 46, attack: 281 },
    { level: 47, attack: 286 },
    { level: 48, attack: 291 },
    { level: 49, attack: 296 },
    { level: 50, attack: 301 },
    { level: 51, attack: 306 },
    { level: 52, attack: 311 },
    { level: 53, attack: 316 },
    { level: 54, attack: 321 },
    { level: 55, attack: 326 },
    { level: 56, attack: 332 },
    { level: 57, attack: 337 },
    { level: 58, attack: 342 },
    { level: 59, attack: 347 },
    { level: 60, attack: 352 },
    { level: 61, attack: 357 },
    { level: 62, attack: 362 },
    { level: 63, attack: 367 },
    { level: 64, attack: 372 },
    { level: 65, attack: 377 },
    { level: 66, attack: 383 },
    { level: 67, attack: 388 },
    { level: 68, attack: 393 },
    { level: 69, attack: 398 },
    { level: 70, attack: 403 },
    { level: 71, attack: 408 },
    { level: 72, attack: 413 },
    { level: 73, attack: 418 },
    { level: 74, attack: 423 },
    { level: 75, attack: 428 },
    { level: 76, attack: 434 },
    { level: 77, attack: 439 },
    { level: 78, attack: 444 },
    { level: 79, attack: 449 },
    { level: 80, attack: 454 },
    { level: 81, attack: 459 },
    { level: 82, attack: 464 },
    { level: 83, attack: 469 },
    { level: 84, attack: 474 },
    { level: 85, attack: 479 },
    { level: 86, attack: 485 },
    { level: 87, attack: 490 },
    { level: 88, attack: 495 },
    { level: 89, attack: 500 },
    { level: 90, attack: 505 },
  ],

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "주요 능력치 증가 · 대: 1/3",
        "오리지늄 아츠 강도 증가 · 대: 1/3",
        "고통 · 백야의 별: 1/4",
      ],
    },
    {
      stage: 1,
      requiredLevel: 20,
      materials: [
        { name: "탈로시안 화폐", count: "2.2k" },
        { name: "모형 틀", count: 5 },
        { name: "연한 흑암석", count: 3 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 2/5",
        "오리지늄 아츠 강도 증가 · 대: 1/4",
        "고통 · 백야의 별: 1/4",
      ],
    },
    {
      stage: 2,
      requiredLevel: 40,
      materials: [
        { name: "탈로시안 화폐", count: "8.5k" },
        { name: "모형 틀", count: 18 },
        { name: "일반 흑암석", count: 5 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 2/6",
        "오리지늄 아츠 강도 증가 · 대: 2/6",
        "고통 · 백야의 별: 1/4",
      ],
    },
    {
      stage: 3,
      requiredLevel: 60,
      materials: [
        { name: "탈로시안 화폐", count: "25k" },
        { name: "중형 모형 틀", count: 20 },
        { name: "진한 흑암석", count: 5 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 3/8",
        "오리지늄 아츠 강도 증가 · 대: 2/7",
        "고통 · 백야의 별: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "정합용 유체", count: 16 },
        { name: "화염석", count: 8 },
      ],
      bonuses: [
        "주요 능력치 증가 · 대: 3/9",
        "오리지늄 아츠 강도 증가 · 대: 3/9",
        "고통 · 백야의 별: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "main-attribute-large",
      typeLabel: "무기 스킬",
      name: "주요 능력치 증가 · 대",
      icon: "",
      meta: [{ label: "능력치", value: "주요 능력치" }],
      levelValues: [
        {
          rank: "1",
          description: "주요 능력치 +17",
          stats: [{ label: "주요 능력치", value: "+17" }],
        },
        {
          rank: "2",
          description: "주요 능력치 +30",
          stats: [{ label: "주요 능력치", value: "+30" }],
        },
        {
          rank: "3",
          description: "주요 능력치 +44",
          stats: [{ label: "주요 능력치", value: "+44" }],
        },
        {
          rank: "4",
          description: "주요 능력치 +57",
          stats: [{ label: "주요 능력치", value: "+57" }],
        },
        {
          rank: "5",
          description: "주요 능력치 +71",
          stats: [{ label: "주요 능력치", value: "+71" }],
        },
        {
          rank: "6",
          description: "주요 능력치 +85",
          stats: [{ label: "주요 능력치", value: "+85" }],
        },
        {
          rank: "7",
          description: "주요 능력치 +98",
          stats: [{ label: "주요 능력치", value: "+98" }],
        },
        {
          rank: "8",
          description: "주요 능력치 +112",
          stats: [{ label: "주요 능력치", value: "+112" }],
        },
        {
          rank: "9",
          description: "주요 능력치 +132",
          stats: [{ label: "주요 능력치", value: "+132" }],
        },
      ],
      compareRows: [
        {
          label: "주요 능력치",
          values: ["+17", "+30", "+44", "+57", "+71", "+85", "+98", "+112", "+132"],
        },
      ],
    },
    {
      key: "arts-intensity-large",
      typeLabel: "무기 스킬",
      name: "오리지늄 아츠 강도 증가 · 대",
      icon: "",
      meta: [{ label: "속성", value: "오리지늄 아츠 강도" }],
      levelValues: [
        {
          rank: "1",
          description: "오리지늄 아츠 강도 +10",
          stats: [{ label: "오리지늄 아츠 강도", value: "+10" }],
        },
        {
          rank: "2",
          description: "오리지늄 아츠 강도 +18",
          stats: [{ label: "오리지늄 아츠 강도", value: "+18" }],
        },
        {
          rank: "3",
          description: "오리지늄 아츠 강도 +26",
          stats: [{ label: "오리지늄 아츠 강도", value: "+26" }],
        },
        {
          rank: "4",
          description: "오리지늄 아츠 강도 +34",
          stats: [{ label: "오리지늄 아츠 강도", value: "+34" }],
        },
        {
          rank: "5",
          description: "오리지늄 아츠 강도 +42",
          stats: [{ label: "오리지늄 아츠 강도", value: "+42" }],
        },
        {
          rank: "6",
          description: "오리지늄 아츠 강도 +50",
          stats: [{ label: "오리지늄 아츠 강도", value: "+50" }],
        },
        {
          rank: "7",
          description: "오리지늄 아츠 강도 +58",
          stats: [{ label: "오리지늄 아츠 강도", value: "+58" }],
        },
        {
          rank: "8",
          description: "오리지늄 아츠 강도 +66",
          stats: [{ label: "오리지늄 아츠 강도", value: "+66" }],
        },
        {
          rank: "9",
          description: "오리지늄 아츠 강도 +78",
          stats: [{ label: "오리지늄 아츠 강도", value: "+78" }],
        },
      ],
      compareRows: [
        {
          label: "오리지늄 아츠 강도",
          values: ["+10", "+18", "+26", "+34", "+42", "+50", "+58", "+66", "+78"],
        },
      ],
    },
    {
      key: "pain-white-night-nova",
      typeLabel: "무기 스킬",
      name: "고통 · 백야의 별",
      icon: "",
      meta: [{ label: "시리즈 스킬", value: "고통" }],
      levelValues: [
        {
          rank: "1",
          description:
            "아츠 피해 +12.0%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +12.0%, 오리지늄 아츠 강도 +25, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+12.0%" },
            { label: "오리지늄 아츠 강도", value: "+25" },
          ],
        },
        {
          rank: "2",
          description:
            "아츠 피해 +14.4%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +14.4%, 오리지늄 아츠 강도 +30, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+14.4%" },
            { label: "오리지늄 아츠 강도", value: "+30" },
          ],
        },
        {
          rank: "3",
          description:
            "아츠 피해 +16.8%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +16.8%, 오리지늄 아츠 강도 +35, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+16.8%" },
            { label: "오리지늄 아츠 강도", value: "+35" },
          ],
        },
        {
          rank: "4",
          description:
            "아츠 피해 +19.2%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +19.2%, 오리지늄 아츠 강도 +40, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+19.2%" },
            { label: "오리지늄 아츠 강도", value: "+40" },
          ],
        },
        {
          rank: "5",
          description:
            "아츠 피해 +21.6%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +21.6%, 오리지늄 아츠 강도 +45, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+21.6%" },
            { label: "오리지늄 아츠 강도", value: "+45" },
          ],
        },
        {
          rank: "6",
          description:
            "아츠 피해 +24.0%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +24.0%, 오리지늄 아츠 강도 +50, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+24.0%" },
            { label: "오리지늄 아츠 강도", value: "+50" },
          ],
        },
        {
          rank: "7",
          description:
            "아츠 피해 +26.4%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +26.4%, 오리지늄 아츠 강도 +55, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+26.4%" },
            { label: "오리지늄 아츠 강도", value: "+55" },
          ],
        },
        {
          rank: "8",
          description:
            "아츠 피해 +28.8%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +28.8%, 오리지늄 아츠 강도 +60, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+28.8%" },
            { label: "오리지늄 아츠 강도", value: "+60" },
          ],
        },
        {
          rank: "9",
          description:
            "아츠 피해 +33.6%\n장착자가 적에게 연소 혹은 감전을 부여한 후, 아츠 피해 +33.6%, 오리지늄 아츠 강도 +70, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "아츠 피해", value: "+33.6%" },
            { label: "오리지늄 아츠 강도", value: "+70" },
          ],
        },
      ],
      compareRows: [
        {
          label: "아츠 피해",
          values: ["+12.0%", "+14.4%", "+16.8%", "+19.2%", "+21.6%", "+24.0%", "+26.4%", "+28.8%", "+33.6%"],
        },
        {
          label: "오리지늄 아츠 강도",
          values: ["+25", "+30", "+35", "+40", "+45", "+50", "+55", "+60", "+70"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;