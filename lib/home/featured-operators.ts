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
};

const featuredOperators: HomeFeaturedOperator[] = [
  {
    slug: "zhuangfangyi",
    name: "장방이",
    enName: "Zhuang Fangyi",
    href: "/operators/zhuangfangyi",
    heroImage: "/operators/zhuangfangyi/full.webp",
    avatar: "/operators/zhuangfangyi/avatar.webp",
    fullImage: "/operators/zhuangfangyi/full.webp",
    rarity: 6,
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
  },
];

const featuredOperatorByName = new Map(
  featuredOperators.flatMap((operator) =>
    [operator.name, operator.enName, operator.slug]
      .filter(Boolean)
      .map((value) => [normalizeOperatorKey(value), operator] as const),
  ),
);

export const defaultHomeFeaturedOperator = featuredOperators[0];

function normalizeOperatorKey(value: string) {
  return value.replace(/\s+/g, "").trim().toLowerCase();
}

export function getHomeFeaturedOperator(name: string) {
  return featuredOperatorByName.get(normalizeOperatorKey(name));
}
