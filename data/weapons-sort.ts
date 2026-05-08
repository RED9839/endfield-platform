const weaponTypeOrderMap: Record<string, number> = {
  sword: 0,
  artsunit: 1,
  artsUnit: 1,
  greatsword: 2,
  polearm: 3,
  handcannon: 4,
};

export function sortWeaponSelectList<
  T extends {
    name: string;
    type?: string;
    weaponType?: string;
    rarity?: number;
    quality?: number;
  },
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const rarityA = Number(a.rarity ?? a.quality ?? 0);
    const rarityB = Number(b.rarity ?? b.quality ?? 0);

    if (rarityB !== rarityA) return rarityB - rarityA;

    const typeA = weaponTypeOrderMap[a.weaponType ?? a.type ?? ""] ?? 999;
    const typeB = weaponTypeOrderMap[b.weaponType ?? b.type ?? ""] ?? 999;

    if (typeA !== typeB) return typeA - typeB;

    return a.name.localeCompare(b.name, "ko");
  });
}