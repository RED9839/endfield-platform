import { weaponSummaries } from "@/data/weapons-summary-data";
import WeaponsPageClient, {
  type WeaponListItem,
} from "./_components/WeaponsPageClient";

export default function WeaponsPage() {
  const weapons: WeaponListItem[] = weaponSummaries.map((weapon) => ({
    slug: weapon.slug,
    name: weapon.name,
    enName: weapon.enName,
    image: weapon.image,
    weaponType: weapon.weaponType,
    rarity: weapon.rarity,
    series: weapon.series,
  }));

  return <WeaponsPageClient weapons={weapons} />;
}
