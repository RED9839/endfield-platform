import SettingsPageClient from "./_components/SettingsPageClient";

import { operatorSummaries } from "@/data/operators-summary-data";
import { weaponSummaries } from "@/data/weapons-summary-data";
import { getSettingsList } from "@/lib/operator-settings/list-query";
import { DEFAULT_SETTINGS_LIMIT } from "@/lib/operator-settings/pagination";

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

  // 첫 페이지(기본 정렬/필터)를 서버에서 미리 조회해 클라이언트 마운트 fetch 워터폴을 제거.
  const initialData = await getSettingsList({
    page: 1,
    limit: DEFAULT_SETTINGS_LIMIT,
    operatorFilters: initialOperatorFilters,
  });

  return (
    <SettingsPageClient
      operators={operators}
      weapons={weapons}
      initialOperatorFilters={initialOperatorFilters}
      initialData={initialData}
    />
  );
}
