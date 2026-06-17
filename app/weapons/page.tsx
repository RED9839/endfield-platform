import { weaponSummaries } from "@/data/weapons-summary-data";
import { getWeaponDetailBySlug, getWeaponStatTags } from "@/data/weapons-detail-data";
import WeaponsPageClient, {
  type WeaponListItem,
} from "./_components/WeaponsPageClient";

export default function WeaponsPage() {
  const weapons: WeaponListItem[] = weaponSummaries.map((weapon) => {
    // 능력치/속성은 라벨이 아니라 무기 스킬 데이터(ground-truth)로 매칭 → 기초 공격력은 속성으로 안 나옴.
    const detail = getWeaponDetailBySlug(weapon.slug);
    const tags = detail ? getWeaponStatTags(detail) : { ability: "", attribute: "", series: "" };
    return {
      slug: weapon.slug,
      name: weapon.name,
      enName: weapon.enName,
      image: weapon.image,
      weaponType: weapon.weaponType,
      rarity: weapon.rarity,
      series: weapon.series,
      abilityStat: tags.ability,
      attributeStat: tags.attribute,
    };
  });

  return <WeaponsPageClient weapons={weapons} />;
}
