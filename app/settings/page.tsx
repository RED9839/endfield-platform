import SettingsPageClient from "./_components/SettingsPageClient";

import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

export default function SettingsPage() {
  const operators = operatorDetails.map((operator) => ({
    slug: operator.slug,
    name: operator.name,
    enName: operator.enName,
    rarity: operator.rarity,
    element: operator.element,
    class: operator.class,
    weapon: operator.weapon,
    avatar: operator.avatar,
    avatarSecondary: operator.avatarSecondary,
    fullImage: operator.fullImage,
  }));

  const weapons = weaponDetails.map((weapon) => ({
    slug: weapon.slug,
    name: weapon.name,
    enName: weapon.enName,
    rarity: weapon.rarity,
    weaponType: weapon.weaponType,
    image: weapon.image,
    fullImage: weapon.fullImage,
    series: weapon.series,
  }));

  return <SettingsPageClient operators={operators} weapons={weapons} />;
}
