import { operatorSummaries } from "@/data/operators-summary-data";
import OperatorsPageClient, {
  type OperatorListItem,
} from "./_components/OperatorsPageClient";

export default function OperatorsPage() {
  const operators: OperatorListItem[] = operatorSummaries.map((operator) => ({
    slug: operator.slug,
    name: operator.name,
    enName: operator.enName,
    rarity: operator.rarity,
    element: operator.element,
    class: operator.class,
    weapon: operator.weapon,
    avatar: operator.avatar,
    avatarSecondary: operator.avatarSecondary,
  }));

  return <OperatorsPageClient operators={operators} />;
}
