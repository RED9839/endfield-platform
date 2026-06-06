import SettingsPageClient from "./_components/SettingsPageClient";

import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

type SettingsPageProps = {
  searchParams?: Promise<{
    operators?: string | string[];
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
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

  const resolvedSearchParams = await searchParams;
  const operatorParam = Array.isArray(resolvedSearchParams?.operators)
    ? resolvedSearchParams.operators.join(",")
    : resolvedSearchParams?.operators ?? "";
  const validOperatorSlugs = new Set(
    operators.map((operator) => operator.slug),
  );
  const initialOperatorFilters = Array.from(
    new Set(
      operatorParam
        .split(",")
        .map((slug) => slug.trim())
        .filter((slug) => validOperatorSlugs.has(slug)),
    ),
  ).slice(0, 4);

  return (
    <SettingsPageClient
      operators={operators}
      weapons={weapons}
      initialOperatorFilters={initialOperatorFilters}
    />
  );
}
