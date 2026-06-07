import SettingsPageClient from "./_components/SettingsPageClient";

import { operatorSummaries } from "@/data/operators-summary-data";
import { weaponSummaries } from "@/data/weapons-summary-data";

type SettingsPageProps = {
  searchParams?: Promise<{
    operators?: string | string[];
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const operators = operatorSummaries.map((operator) => ({
    slug: operator.slug,
    name: operator.name,
    enName: operator.enName,
    rarity: operator.rarity,
    element: operator.element,
    class: operator.class,
    weapon: operator.weapon,
    avatar: operator.avatar,
    avatarSecondary:
      operator.slug === "endministrator" ? operator.avatarSecondary : undefined,
  }));

  const weapons = weaponSummaries.map((weapon) => ({
    slug: weapon.slug,
    name: weapon.name,
    enName: weapon.enName,
    rarity: weapon.rarity,
    weaponType: weapon.weaponType,
    image: weapon.image,
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
