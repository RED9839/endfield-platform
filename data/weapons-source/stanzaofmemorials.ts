import type { SourceWeaponDetail } from "../weapons-detail-data";

export const stanzaofmemorials = {
  slug: "stanzaofmemorials",
  name: "망자의 노래",
  enName: "Stanza of Memorials",
  rarity: 5,
  weaponType: "artsunit",
  image: "/weapons/stanzaofmemorials.webp",
  series: "어둠",
  mainStatLabel: "공격력",
  subStatLabel: "지능",

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
        "지능 증가 · 중: 1/3",
        "공격력 증가 · 중: 1/3",
        "어둠 · 무덤 위의 불씨: 1/4",
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
        "지능 증가 · 중: 2/5",
        "공격력 증가 · 중: 1/4",
        "어둠 · 무덤 위의 불씨: 1/4",
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
        "지능 증가 · 중: 2/6",
        "공격력 증가 · 중: 2/6",
        "어둠 · 무덤 위의 불씨: 1/4",
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
        "지능 증가 · 중: 3/8",
        "공격력 증가 · 중: 2/7",
        "어둠 · 무덤 위의 불씨: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: "90k" },
        { name: "중형 모형 틀", count: 30 },
        { name: "정합용 유체", count: 16 },
        { name: "무릉석", count: 8 },
      ],
      bonuses: [
        "지능 증가 · 중: 3/9",
        "공격력 증가 · 중: 3/9",
        "어둠 · 무덤 위의 불씨: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "intellect-medium",
      typeLabel: "무기 스킬",
      name: "지능 증가 · 중",
      icon: "",
      meta: [{ label: "능력치", value: "지능" }],
      levelValues: [
        { rank: "1", description: "지능 +16", stats: [{ label: "지능", value: "+16" }] },
        { rank: "2", description: "지능 +28", stats: [{ label: "지능", value: "+28" }] },
        { rank: "3", description: "지능 +41", stats: [{ label: "지능", value: "+41" }] },
        { rank: "4", description: "지능 +54", stats: [{ label: "지능", value: "+54" }] },
        { rank: "5", description: "지능 +67", stats: [{ label: "지능", value: "+67" }] },
        { rank: "6", description: "지능 +80", stats: [{ label: "지능", value: "+80" }] },
        { rank: "7", description: "지능 +92", stats: [{ label: "지능", value: "+92" }] },
        { rank: "8", description: "지능 +105", stats: [{ label: "지능", value: "+105" }] },
        { rank: "9", description: "지능 +124", stats: [{ label: "지능", value: "+124" }] },
      ],
      compareRows: [
        {
          label: "지능",
          values: ["+16", "+28", "+41", "+54", "+67", "+80", "+92", "+105", "+124"],
        },
      ],
    },
    {
      key: "attack-medium",
      typeLabel: "무기 스킬",
      name: "공격력 증가 · 중",
      icon: "",
      meta: [{ label: "속성", value: "공격력" }],
      levelValues: [
        {
          rank: "1",
          description: "공격력 +4.0%",
          stats: [{ label: "공격력", value: "+4.0%" }],
        },
        {
          rank: "2",
          description: "공격력 +7.2%",
          stats: [{ label: "공격력", value: "+7.2%" }],
        },
        {
          rank: "3",
          description: "공격력 +10.4%",
          stats: [{ label: "공격력", value: "+10.4%" }],
        },
        {
          rank: "4",
          description: "공격력 +13.6%",
          stats: [{ label: "공격력", value: "+13.6%" }],
        },
        {
          rank: "5",
          description: "공격력 +16.8%",
          stats: [{ label: "공격력", value: "+16.8%" }],
        },
        {
          rank: "6",
          description: "공격력 +20.0%",
          stats: [{ label: "공격력", value: "+20.0%" }],
        },
        {
          rank: "7",
          description: "공격력 +23.2%",
          stats: [{ label: "공격력", value: "+23.2%" }],
        },
        {
          rank: "8",
          description: "공격력 +26.4%",
          stats: [{ label: "공격력", value: "+26.4%" }],
        },
        {
          rank: "9",
          description: "공격력 +31.2%",
          stats: [{ label: "공격력", value: "+31.2%" }],
        },
      ],
      compareRows: [
        {
          label: "공격력",
          values: ["+4.0%", "+7.2%", "+10.4%", "+13.6%", "+16.8%", "+20.0%", "+23.2%", "+26.4%", "+31.2%"],
        },
      ],
    },
    {
      key: "dark-spark-above-the-grave",
      typeLabel: "무기 스킬",
      name: "어둠 · 무덤 위의 불씨",
      icon: "",
      meta: [{ label: "시리즈 스킬", value: "어둠" }],
      levelValues: [
        {
          rank: "1",
          description:
            "최대 생명력 +10.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +8.0%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+10.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+8.0%" },
          ],
        },
        {
          rank: "2",
          description:
            "최대 생명력 +12.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +9.6%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+12.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+9.6%" },
          ],
        },
        {
          rank: "3",
          description:
            "최대 생명력 +14.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +11.2%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+14.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+11.2%" },
          ],
        },
        {
          rank: "4",
          description:
            "최대 생명력 +16.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +12.8%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+16.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+12.8%" },
          ],
        },
        {
          rank: "5",
          description:
            "최대 생명력 +18.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +14.4%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+18.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+14.4%" },
          ],
        },
        {
          rank: "6",
          description:
            "최대 생명력 +20.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +16.0%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+20.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+16.0%" },
          ],
        },
        {
          rank: "7",
          description:
            "최대 생명력 +22.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +17.6%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+22.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+17.6%" },
          ],
        },
        {
          rank: "8",
          description:
            "최대 생명력 +24.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +19.2%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+24.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+19.2%" },
          ],
        },
        {
          rank: "9",
          description:
            "최대 생명력 +28.0%\n장착자가 궁극기를 사용할 때, 자신과 속성이 다른 오퍼레이터의 공격력 +22.4%, 20초 동안 지속.\n같은 이름의 효과는 중첩되지 않습니다.",
          stats: [
            { label: "최대 생명력", value: "+28.0%" },
            { label: "다른 속성 오퍼레이터 공격력", value: "+22.4%" },
          ],
        },
      ],
      compareRows: [
        {
          label: "최대 생명력",
          values: ["+10.0%", "+12.0%", "+14.0%", "+16.0%", "+18.0%", "+20.0%", "+22.0%", "+24.0%", "+28.0%"],
        },
        {
          label: "다른 속성 오퍼레이터 공격력",
          values: ["+8.0%", "+9.6%", "+11.2%", "+12.8%", "+14.4%", "+16.0%", "+17.6%", "+19.2%", "+22.4%"],
        },
      ],
    },
  ],
} satisfies SourceWeaponDetail;