import type { SourceWeaponDetail } from "../weapons-detail-data";

const slug = "flickersinthemist";

export const flickersinthemist: SourceWeaponDetail = {
  slug,
  name: "안개 속 불빛",
  enName: "Flickers in the Mist",
  rarity: 6,
  weaponType: "artsunit",
  image: "/weapons/flickersinthemist.webp",
  series: "효율 · 중첩된 빛",
  mainStatLabel: "의지",
  subStatLabel: "전기 피해",

  levelStats: [
    { level: 1, attack: 50 },
    { level: 2, attack: 54 },
    { level: 3, attack: 59 },
    { level: 4, attack: 64 },
    { level: 5, attack: 69 },
    { level: 6, attack: 74 },
    { level: 7, attack: 79 },
    { level: 8, attack: 84 },
    { level: 9, attack: 89 },
    { level: 10, attack: 94 },
    { level: 11, attack: 99 },
    { level: 12, attack: 104 },
    { level: 13, attack: 109 },
    { level: 14, attack: 114 },
    { level: 15, attack: 119 },
    { level: 16, attack: 124 },
    { level: 17, attack: 129 },
    { level: 18, attack: 134 },
    { level: 19, attack: 139 },
    { level: 20, attack: 144 },
    { level: 21, attack: 149 },
    { level: 22, attack: 153 },
    { level: 23, attack: 158 },
    { level: 24, attack: 163 },
    { level: 25, attack: 168 },
    { level: 26, attack: 173 },
    { level: 27, attack: 178 },
    { level: 28, attack: 183 },
    { level: 29, attack: 188 },
    { level: 30, attack: 193 },
    { level: 31, attack: 198 },
    { level: 32, attack: 203 },
    { level: 33, attack: 208 },
    { level: 34, attack: 213 },
    { level: 35, attack: 218 },
    { level: 36, attack: 223 },
    { level: 37, attack: 228 },
    { level: 38, attack: 233 },
    { level: 39, attack: 238 },
    { level: 40, attack: 243 },
    { level: 41, attack: 248 },
    { level: 42, attack: 252 },
    { level: 43, attack: 257 },
    { level: 44, attack: 262 },
    { level: 45, attack: 267 },
    { level: 46, attack: 272 },
    { level: 47, attack: 277 },
    { level: 48, attack: 282 },
    { level: 49, attack: 287 },
    { level: 50, attack: 292 },
    { level: 51, attack: 297 },
    { level: 52, attack: 302 },
    { level: 53, attack: 307 },
    { level: 54, attack: 312 },
    { level: 55, attack: 317 },
    { level: 56, attack: 322 },
    { level: 57, attack: 327 },
    { level: 58, attack: 332 },
    { level: 59, attack: 337 },
    { level: 60, attack: 342 },
    { level: 61, attack: 347 },
    { level: 62, attack: 351 },
    { level: 63, attack: 356 },
    { level: 64, attack: 361 },
    { level: 65, attack: 366 },
    { level: 66, attack: 371 },
    { level: 67, attack: 376 },
    { level: 68, attack: 381 },
    { level: 69, attack: 386 },
    { level: 70, attack: 391 },
    { level: 71, attack: 396 },
    { level: 72, attack: 401 },
    { level: 73, attack: 406 },
    { level: 74, attack: 411 },
    { level: 75, attack: 416 },
    { level: 76, attack: 421 },
    { level: 77, attack: 426 },
    { level: 78, attack: 431 },
    { level: 79, attack: 436 },
    { level: 80, attack: 441 },
    { level: 81, attack: 446 },
    { level: 82, attack: 450 },
    { level: 83, attack: 455 },
    { level: 84, attack: 460 },
    { level: 85, attack: 465 },
    { level: 86, attack: 470 },
    { level: 87, attack: 475 },
    { level: 88, attack: 480 },
    { level: 89, attack: 485 },
    { level: 90, attack: 490 },
  ],

  breakthrough: [
    {
      stage: 0,
      requiredLevel: 1,
      materials: [],
      bonuses: [
        "의지 증가 · 대: 1/3",
        "전기 피해 증가 · 대: 1/3",
        "효율 · 중첩된 빛: 1/4",
      ],
    },
    {
      stage: 1,
      requiredLevel: 20,
      materials: [
        { name: "탈로시안 화폐", count: 2200, icon: "/items/탈로시안 화폐.webp" },
        { name: "모형 틀", count: 5, icon: "/items/모형 틀.webp" },
        { name: "연한 흑암석", count: 3, icon: "/items/연한 흑암석.webp" },
      ],
      bonuses: [
        "의지 증가 · 대: 2/5",
        "전기 피해 증가 · 대: 1/4",
        "효율 · 중첩된 빛: 1/4",
      ],
    },
    {
      stage: 2,
      requiredLevel: 40,
      materials: [
        { name: "탈로시안 화폐", count: 8500, icon: "/items/탈로시안 화폐.webp" },
        { name: "모형 틀", count: 18, icon: "/items/모형 틀.webp" },
        { name: "일반 흑암석", count: 5, icon: "/items/일반 흑암석.webp" },
      ],
      bonuses: [
        "의지 증가 · 대: 2/6",
        "전기 피해 증가 · 대: 2/6",
        "효율 · 중첩된 빛: 1/4",
      ],
    },
    {
      stage: 3,
      requiredLevel: 60,
      materials: [
        { name: "탈로시안 화폐", count: 25000, icon: "/items/탈로시안 화폐.webp" },
        { name: "중형 모형 틀", count: 20, icon: "/items/중형 모형 틀.webp" },
        { name: "진한 흑암석", count: 5, icon: "/items/진한 흑암석.webp" },
      ],
      bonuses: [
        "의지 증가 · 대: 3/8",
        "전기 피해 증가 · 대: 2/7",
        "효율 · 중첩된 빛: 1/4",
      ],
    },
    {
      stage: 4,
      requiredLevel: 80,
      materials: [
        { name: "탈로시안 화폐", count: 90000, icon: "/items/탈로시안 화폐.webp" },
        { name: "중형 모형 틀", count: 30, icon: "/items/중형 모형 틀.webp" },
        { name: "3상 나노 플레이크 칩", count: 16, icon: "/items/3상 나노 플레이크 칩.webp" },
        { name: "무릉석", count: 8, icon: "/items/무릉석.webp" },
      ],
      bonuses: [
        "의지 증가 · 대: 3/9",
        "전기 피해 증가 · 대: 3/9",
        "효율 · 중첩된 빛: 1/4",
      ],
    },
  ],

  skills: [
    {
      key: "ability",
      name: "의지 증가 · 대",
      typeLabel: "능력치",
      meta: [{ label: "능력치", value: "의지" }],
      levelValues: [
        { rank: "1", description: "의지 +20" },
        { rank: "2", description: "의지 +36" },
        { rank: "3", description: "의지 +52" },
        { rank: "4", description: "의지 +68" },
        { rank: "5", description: "의지 +84" },
        { rank: "6", description: "의지 +100" },
        { rank: "7", description: "의지 +116" },
        { rank: "8", description: "의지 +132" },
        { rank: "9", description: "의지 +156" },
      ],
      compareRows: [
        {
          label: "의지",
          values: ["+20", "+36", "+52", "+68", "+84", "+100", "+116", "+132", "+156"],
        },
      ],
    },
    {
      key: "attribute",
      name: "전기 피해 증가 · 대",
      typeLabel: "속성",
      meta: [{ label: "속성", value: "전기 피해" }],
      levelValues: [
        { rank: "1", description: "전기 피해 +5.6%" },
        { rank: "2", description: "전기 피해 +10.0%" },
        { rank: "3", description: "전기 피해 +14.4%" },
        { rank: "4", description: "전기 피해 +18.9%" },
        { rank: "5", description: "전기 피해 +23.3%" },
        { rank: "6", description: "전기 피해 +27.8%" },
        { rank: "7", description: "전기 피해 +32.2%" },
        { rank: "8", description: "전기 피해 +36.7%" },
        { rank: "9", description: "전기 피해 +43.3%" },
      ],
      compareRows: [
        {
          label: "전기 피해",
          values: ["+5.6%", "+10.0%", "+14.4%", "+18.9%", "+23.3%", "+27.8%", "+32.2%", "+36.7%", "+43.3%"],
        },
      ],
    },
    {
      key: "efficiency",
      name: "효율 · 중첩된 빛",
      typeLabel: "시리즈 스킬",
      meta: [
        { label: "시리즈 스킬", value: "효율" },
        { label: "속성", value: "공격력" },
      ],
      levelValues: [
        {
          rank: "1",
          description:
            "공격력 +7.0%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +5.5%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
        {
          rank: "2",
          description:
            "공격력 +8.4%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +6.6%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
        {
          rank: "3",
          description:
            "공격력 +9.8%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +7.7%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
        {
          rank: "4",
          description:
            "공격력 +11.2%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +8.8%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
        {
          rank: "5",
          description:
            "공격력 +12.6%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +9.9%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
        {
          rank: "6",
          description:
            "공격력 +14.0%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +11.0%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
        {
          rank: "7",
          description:
            "공격력 +15.4%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +12.1%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
        {
          rank: "8",
          description:
            "공격력 +16.8%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +13.2%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
        {
          rank: "9",
          description:
            "공격력 +19.6%\n장착자가 전기 증폭을 획득할 때, 전기 피해 +15.4%, 30초 동안 지속됩니다.\n같은 이름의 효과는 최대 3스택까지 중첩되며, 중첩될 때마다 지속 시간은 따로 계산됩니다. 0.1초마다 최대 1회만 발동합니다.",
        },
      ],
      compareRows: [
        {
          label: "공격력",
          values: ["+7.0%", "+8.4%", "+9.8%", "+11.2%", "+12.6%", "+14.0%", "+15.4%", "+16.8%", "+19.6%"],
        },
        {
          label: "전기 증폭 획득 시 전기 피해",
          values: ["+5.5%", "+6.6%", "+7.7%", "+8.8%", "+9.9%", "+11.0%", "+12.1%", "+13.2%", "+15.4%"],
        },
      ],
    },
  ],
};