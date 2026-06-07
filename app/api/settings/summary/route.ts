import { NextResponse } from "next/server";

import {
  getOperatorSkillArtsEffects,
  type OperatorSkillKey,
} from "@/data/operator-arts-effects";
import { getOperatorSkillPhysicalEffects } from "@/data/operator-physical-effects";
import { operatorDetails } from "@/data/operators-detail-data";
import { weaponSummaries } from "@/data/weapons-summary-data";

export const dynamic = "force-static";

function pickSkill(operatorSlug: string, skillKey: OperatorSkillKey, skill: any) {
  if (!skill?.icon) return null;

  return {
    name: skill.name ?? "",
    icon: skill.icon,
    artsEffects: getOperatorSkillArtsEffects(operatorSlug, skillKey),
    physicalEffects: getOperatorSkillPhysicalEffects(operatorSlug, skillKey),
  };
}

export function GET() {
  return NextResponse.json({
    ok: true,
    operators: operatorDetails.map((operator: any) => ({
      slug: operator.slug,
      name: operator.name,
      avatar: operator.avatar ?? operator.image ?? "",
      image: operator.image ?? operator.avatar ?? "",
      element: operator.element ?? operator.elementKey ?? operator.attribute ?? "",
      elementKey: operator.elementKey ?? operator.element ?? operator.attribute ?? "",
      attribute: operator.attribute ?? operator.element ?? operator.elementKey ?? "",
      skills: {
        normalAttack: pickSkill(operator.slug, "normalAttack", operator.skills?.normalAttack),
        battleSkill: pickSkill(operator.slug, "battleSkill", operator.skills?.battleSkill),
        comboSkill: pickSkill(operator.slug, "comboSkill", operator.skills?.comboSkill),
        ultimate: pickSkill(operator.slug, "ultimate", operator.skills?.ultimate),
      },
    })),
    weapons: weaponSummaries.map((weapon) => ({
      slug: weapon.slug,
      name: weapon.name,
      image: weapon.image ?? "",
      avatar: weapon.image ?? "",
    })),
  });
}
