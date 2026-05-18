const classOrderMap: Record<string, number> = {
  vanguard: 0,
  guard: 1,
  defender: 2,
  supporter: 3,
  caster: 4,
  striker: 5,
};

export function sortOperatorSelectList<
  T extends {
    rarity: number;
    class: string;
    name: string;
  },
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (b.rarity !== a.rarity) return b.rarity - a.rarity;

    const classA = classOrderMap[a.class] ?? 999;
    const classB = classOrderMap[b.class] ?? 999;

    if (classA !== classB) return classA - classB;

    return a.name.localeCompare(b.name, "ko");
  });
}