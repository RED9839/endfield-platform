import { weaponSummaries } from "@/data/weapons-summary-data";
import { getWeaponDetailBySlug } from "@/data/weapons-detail-data";
import WeaponsPageClient, {
  type WeaponListItem,
} from "./_components/WeaponsPageClient";

export default function WeaponsPage() {
  const weapons: WeaponListItem[] = weaponSummaries.map((weapon) => {
    // 목록 카드에 주/부 능력치도 표기 → 상세 데이터에서 안전하게 보강(없으면 undefined).
    const detail = getWeaponDetailBySlug(weapon.slug);
    return {
      slug: weapon.slug,
      name: weapon.name,
      enName: weapon.enName,
      image: weapon.image,
      weaponType: weapon.weaponType,
      rarity: weapon.rarity,
      series: weapon.series,
      mainStatLabel: detail?.mainStatLabel,
      subStatLabel: detail?.subStatLabel,
    };
  });

  return <WeaponsPageClient weapons={weapons} />;
}
