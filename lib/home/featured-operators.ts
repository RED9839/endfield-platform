export type HomeFeaturedOperator = {
  slug: string;
  name: string;
  enName: string;
  href: string;
  heroImage: string;
  avatar: string;
  fullImage: string;
  rarity?: number;
  class?: string;
  element?: string;
  aliases?: string[];
};

const homeOperatorMetas: HomeFeaturedOperator[] = [
  {
  slug: "mifu",
  name: "미브",
  enName: "Mifu",
  href: "/operators/mifu",
  heroImage: "/operators/mifu/full.webp",
  avatar: "/operators/mifu/avatar.webp",
  fullImage: "/operators/mifu/full.webp",
  rarity: 6,
  element: "physical",
  class: "guard",
  aliases: ["Mifu", "mifu", "미브"],
},
  {
    slug: "zhuangfangyi",
    name: "장방이",
    enName: "Zhuang Fangyi",
    href: "/operators/zhuangfangyi",
    heroImage: "/operators/zhuangfangyi/full.webp",
    avatar: "/operators/zhuangfangyi/avatar.webp",
    fullImage: "/operators/zhuangfangyi/full.webp",
    rarity: 6,
    element: "electric",
    class: "striker",
    aliases: ["ZhuangFangyi", "Zhuang Fangyi", "zhuangfangyi"],
  },
  {
    slug: "rossi",
    name: "로시",
    enName: "Rossi",
    href: "/operators/rossi",
    heroImage: "/operators/rossi/full.webp",
    avatar: "/operators/rossi/avatar.webp",
    fullImage: "/operators/rossi/full.webp",
    rarity: 6,
    aliases: ["Rossi"],
  },
  {
    slug: "snowshine",
    name: "샤이닝",
    enName: "Snowshine",
    href: "/operators/snowshine",
    heroImage: "/operators/snowshine/full.webp",
    avatar: "/operators/snowshine/avatar.webp",
    fullImage: "/operators/snowshine/full.webp",
    rarity: 6,
    aliases: ["Snowshine", "스노우샤인"],
  },
  {
    slug: "lastrite",
    name: "라스트 라이트",
    enName: "Last Rite",
    href: "/operators/lastrite",
    heroImage: "/operators/lastrite/full.webp",
    avatar: "/operators/lastrite/avatar.webp",
    fullImage: "/operators/lastrite/full.webp",
    rarity: 6,
    aliases: ["Last Rite", "LastRite", "lastrite"],
  },
  {
    slug: "perlica",
    name: "펠리카",
    enName: "Perlica",
    href: "/operators/perlica",
    heroImage: "/operators/perlica/full.webp",
    avatar: "/operators/perlica/avatar.webp",
    fullImage: "/operators/perlica/full.webp",
    aliases: ["Perlica"],
  },
  {
    slug: "wulfgard",
    name: "울프가드",
    enName: "Wulfgard",
    href: "/operators/wulfgard",
    heroImage: "/operators/wulfgard/full.webp",
    avatar: "/operators/wulfgard/avatar.webp",
    fullImage: "/operators/wulfgard/full.webp",
    aliases: ["Wulfgard"],
  },
  {
    slug: "arclight",
    name: "아크라이트",
    enName: "Arclight",
    href: "/operators/arclight",
    heroImage: "/operators/arclight/full.webp",
    avatar: "/operators/arclight/avatar.webp",
    fullImage: "/operators/arclight/full.webp",
    aliases: ["Arclight"],
  },
  {
    slug: "gilberta",
    name: "길버타",
    enName: "Gilberta",
    href: "/operators/gilberta",
    heroImage: "/operators/gilberta/full.webp",
    avatar: "/operators/gilberta/avatar.webp",
    fullImage: "/operators/gilberta/full.webp",
    aliases: ["Gilberta"],
  },
  {
    slug: "ember",
    name: "엠버",
    enName: "Ember",
    href: "/operators/ember",
    heroImage: "/operators/ember/full.webp",
    avatar: "/operators/ember/avatar.webp",
    fullImage: "/operators/ember/full.webp",
    aliases: ["Ember"],
  },
  {
    slug: "endministrator",
    name: "관리자",
    enName: "Endministrator",
    href: "/operators/endministrator",
    heroImage: "/operators/endministrator/full.webp",
    avatar: "/operators/endministrator/avatar.webp",
    fullImage: "/operators/endministrator/full.webp",
    aliases: ["Endministrator", "Administrator"],
  },
];

const searchableEntries = homeOperatorMetas
  .flatMap((operator) =>
    [operator.name, operator.enName, operator.slug, ...(operator.aliases ?? [])]
      .filter(Boolean)
      .map((value) => ({
        key: normalizeOperatorKey(value),
        raw: String(value),
        operator,
      })),
  )
  .sort((a, b) => b.key.length - a.key.length);

const featuredOperatorByName = new Map(
  searchableEntries.map((entry) => [entry.key, entry.operator] as const),
);

export const defaultHomeFeaturedOperator = homeOperatorMetas[0];

function normalizeOperatorKey(value: string) {
  return value.replace(/[\s「」<>《》『』\[\]()]/g, "").trim().toLowerCase();
}

export function getHomeFeaturedOperator(name: string) {
  return featuredOperatorByName.get(normalizeOperatorKey(name));
}

export function findHomeFeaturedOperatorFromTitle(title: string) {
  const normalizedTitle = normalizeOperatorKey(title);

  return searchableEntries.find((entry) => normalizedTitle.includes(entry.key))?.operator;
}
