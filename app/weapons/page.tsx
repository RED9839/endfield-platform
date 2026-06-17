import { weaponSummaries } from "@/data/weapons-summary-data";
import { getWeaponDetailBySlug } from "@/data/weapons-detail-data";
import WeaponsPageClient, {
  type WeaponListItem,
} from "./_components/WeaponsPageClient";

export default function WeaponsPage() {
  const weapons: WeaponListItem[] = weaponSummaries.map((weapon) => {
    // 목록 카드에 속성(mainStatLabel)/능력치(subStatLabel)도 표기 → 상세 데이터에서 보강(없으면 undefined).
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
