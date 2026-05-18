import type { SourceWeaponDetail } from "../weapons-detail-data";

export const objrazorhorn = {
  slug: "objrazorhorn",
  name: "O.B.J. 스파이크",
  enName: "OBJ Razorhorn",
  rarity: 5,
  weaponType: "polearm",
  image: "/weapons/objrazorhorn.webp",
  series: "고통",
  mainStatLabel: "공격력",
  subStatLabel: "의지",

  levelStats: [
    { level: 1, attack: 42 },
    { level: 2, attack: 46 },
    { level: 3, attack: 50 },
    { level: 4, attack: 54 },
    { level: 5, attack: 58 },
    { level: 6, attack: 62 },
    { level: 7, attack: 66 },
    { level: 8, attack: 71 },
    { level: 9, attack: 75 },
    { level: 10, attack: 79 },
    { level: 11, attack: 83 },
    { level: 12, attack: 87 },
    { level: 13, attack: 91 },
    { level: 14, attack: 95 },
    { level: 15, attack: 100 },
    { level: 16, attack: 104 },
    { level: 17, attack: 108 },
    { level: 18, attack: 112 },
    { level: 19, attack: 116 },
    { level: 20, attack: 120 },
    { level: 21, attack: 125 },
    { level: 22, attack: 129 },
    { level: 23, attack: 133 },
    { level: 24, attack: 137 },
    { level: 25, attack: 141 },
    { level: 26, attack: 145 },
    { level: 27, attack: 149 },
    { level: 28, attack: 154 },
    { level: 29, attack: 158 },
    { level: 30, attack: 162 },
    { level: 31, attack: 166 },
    { level: 32, attack: 170 },
    { level: 33, attack: 174 },
    { level: 34, attack: 178 },
    { level: 35, attack: 183 },
    { level: 36, attack: 187 },
    { level: 37, attack: 191 },
    { level: 38, attack: 195 },
    { level: 39, attack: 199 },
    { level: 40, attack: 203 },
    { level: 41, attack: 208 },
    { level: 42, attack: 212 },
    { level: 43, attack: 216 },
    { level: 44, attack: 220 },
    { level: 45, attack: 224 },
    { level: 46, attack: 228 },
    { level: 47, attack: 232 },
    { level: 48, attack: 237 },
    { level: 49, attack: 241 },
    { level: 50, attack: 245 },
    { level: 51, attack: 249 },
    { level: 52, attack: 253 },
    { level: 53, attack: 257 },
    { level: 54, attack: 261 },
    { level: 55, attack: 266 },
    { level: 56, attack: 270 },
    { level: 57, attack: 274 },
    { level: 58, attack: 278 },
    { level: 59, attack: 282 },
    { level: 60, attack: 286 },
    { level: 61, attack: 291 },
    { level: 62, attack: 295 },
    { level: 63, attack: 299 },
    { level: 64, attack: 303 },
    { level: 65, attack: 307 },
    { level: 66, attack: 311 },
    { level: 67, attack: 315 },
    { level: 68, attack: 320 },
    { level: 69, attack: 324 },
    { level: 70, attack: 328 },
    { level: 71, attack: 332 },
    { level: 72, attack: 336 },
    { level: 73, attack: 340 },
    { level: 74, attack: 344 },
    { level: 75, attack: 349 },
    { level: 76, attack: 353 },
    { level: 77, attack: 357 },
    { level: 78, attack: 361 },
    { level: 79, attack: 365 },
    { level: 80, attack: 369 },
    { level: 81, attack: 374 },
    { level: 82, attack: 378 },
    { level: 83, attack: 382 },
    { level: 84, attack: 386 },
    { level: 85, attack: 390 },
    { level: 86, attack: 394 },
    { level: 87, attack: 398 },
    { level: 88, attack: 403 },
    { level: 89, attack: 407 },
    { level: 90, attack: 411 },
  ],

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "의지 증가 · 중: 1/3",
        "물리 피해 증가 · 중: 1/3",
        "고통 · 빙산을 넘어서: 1/4",
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
        "의지 증가 · 중: 2/5",
        "물리 피해 증가 · 중: 1/4",
        "고통 · 빙산을 넘어서: 1/4",
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
        "의지 증가 · 중: 2/6",
        "물리 피해 증가 · 중: 2/6",
        "고통 · 빙산을 넘어서: 1/4",
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
        "의지 증가 · 중: 3/8",
        "물리 피해 증가 · 중: 2/7",
        "고통 · 빙산을 넘어서: 1/4",
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
        "의지 증가 · 중: 3/9",
        "물리 피해 증가 · 중: 3/9",
        "고통 · 빙산을 넘어서: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "will-medium",
      typeLabel: "무기 스킬",
      name: "의지 증가 · 중",
      icon: "/icons/weapons/skills/will-medium.webp",
      meta: [{ label: "능력치", value: "의지" }],
      levelValues: [
        { rank: "1", description: "의지 +16", stats: [{ label: "의지", value: "+16" }] },
        { rank: "2", description: "의지 +28", stats: [{ label: "의지", value: "+28" }] },
        { rank: "3", description: "의지 +41", stats: [{ label: "의지", value: "+41" }] },
        { rank: "4", description: "의지 +54", stats: [{ label: "의지", value: "+54" }] },
        { rank: "5", description: "의지 +67", stats: [{ label: "의지", value: "+67" }] },
        { rank: "6", description: "의지 +80", stats: [{ label: "의지", value: "+80" }] },
        { rank: "7", description: "의지 +92", stats: [{ label: "의지", value: "+92" }] },
        { rank: "8", description: "의지 +105", stats: [{ label: "의지", value: "+105" }] },
        { rank: "9", description: "의지 +124", stats: [{ label: "의지", value: "+124" }] },
      ],
      compareRows: [
        {
          label: "의지",
          values: ["+16", "+28", "+41", "+54", "+67", "+80", "+92", "+105", "+124"],
        },
      ],
    },
    {
      key: "physical-dmg-medium",
      typeLabel: "무기 스킬",
      name: "물리 피해 증가 · 중",
      icon: "/icons/weapons/skills/physical-dmg-medium.webp",
      meta: [{ label: "속성", value: "물리 피해" }],
      levelValues: [
        {
          rank: "1",
          description: "물리 피해 +4.4%",
          stats: [{ label: "물리 피해", value: "+4.4%" }],
        },
        {
          rank: "2",
          description: "물리 피해 +8.0%",
          stats: [{ label: "물리 피해", value: "+8.0%" }],
        },
        {
          rank: "3",
          description: "물리 피해 +11.6%",
          stats: [{ label: "물리 피해", value: "+11.6%" }],
        },
        {
          rank: "4",
          description: "물리 피해 +15.1%",
          stats: [{ label: "물리 피해", value: "+15.1%" }],
        },
        {
          rank: "5",
          description: "물리 피해 +18.7%",
          stats: [{ label: "물리 피해", value: "+18.7%" }],
        },
        {
          rank: "6",
          description: "물리 피해 +22.2%",
          stats: [{ label: "물리 피해", value: "+22.2%" }],
        },
        {
          rank: "7",
          description: "물리 피해 +25.8%",
          stats: [{ label: "물리 피해", value: "+25.8%" }],
        },
        {
          rank: "8",
          description: "물리 피해 +29.3%",
          stats: [{ label: "물리 피해", value: "+29.3%" }],
        },
        {
          rank: "9",
          description: "물리 피해 +34.7%",
          stats: [{ label: "물리 피해", value: "+34.7%" }],
        },
      ],
      compareRows: [
        {
          label: "물리 피해",
          values: ["+4.4%", "+8.0%", "+11.6%", "+15.1%", "+18.7%", "+22.2%", "+25.8%", "+29.3%", "+34.7%"],
        },
      ],
    },
    {
      key: "pain-beyond-the-iceberg",
      typeLabel: "무기 스킬",
      name: "고통 · 빙산을 넘어서",
      icon: "/icons/weapons/skills/pain.webp",
      meta: [{ label: "시리즈 스킬", value: "고통" }],
      levelValues: [
        {
          rank: "1",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +8.0%. 동결을 소모한 후, 공격력 +12.0%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+8.0%" },
            { label: "동결 소모 후 공격력", value: "+12.0%" },
          ],
        },
        {
          rank: "2",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +9.6%. 동결을 소모한 후, 공격력 +14.4%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+9.6%" },
            { label: "동결 소모 후 공격력", value: "+14.4%" },
          ],
        },
        {
          rank: "3",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +11.2%. 동결을 소모한 후, 공격력 +16.8%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+11.2%" },
            { label: "동결 소모 후 공격력", value: "+16.8%" },
          ],
        },
        {
          rank: "4",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +12.8%. 동결을 소모한 후, 공격력 +19.2%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+12.8%" },
            { label: "동결 소모 후 공격력", value: "+19.2%" },
          ],
        },
        {
          rank: "5",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +14.4%. 동결을 소모한 후, 공격력 +21.6%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+14.4%" },
            { label: "동결 소모 후 공격력", value: "+21.6%" },
          ],
        },
        {
          rank: "6",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +16.0%. 동결을 소모한 후, 공격력 +24.0%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+16.0%" },
            { label: "동결 소모 후 공격력", value: "+24.0%" },
          ],
        },
        {
          rank: "7",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +17.6%. 동결을 소모한 후, 공격력 +26.4%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+17.6%" },
            { label: "동결 소모 후 공격력", value: "+26.4%" },
          ],
        },
        {
          rank: "8",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +19.2%. 동결을 소모한 후, 공격력 +28.8%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+19.2%" },
            { label: "동결 소모 후 공격력", value: "+28.8%" },
          ],
        },
        {
          rank: "9",
          description:
            "장착자가 냉기 부착과 동결 상태의 적에게 주는 피해 +22.4%. 동결을 소모한 후, 공격력 +33.6%, 15초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "냉기 부착 및 동결 적 대상 피해", value: "+22.4%" },
            { label: "동결 소모 후 공격력", value: "+33.6%" },
          ],
        },
      ],
      compareRows: [
        {
          label: "냉기 부착 및 동결 적 대상 피해",
          values: ["+8.0%", "+9.6%", "+11.2%", "+12.8%", "+14.4%", "+16.0%", "+17.6%", "+19.2%", "+22.4%"],
        },
        {
          label: "동결 소모 후 공격력",
          values: ["+12.0%", "+14.4%", "+16.8%", "+19.2%", "+21.6%", "+24.0%", "+26.4%", "+28.8%", "+33.6%"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;