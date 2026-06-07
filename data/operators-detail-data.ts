import { rossiOperatorDetailData } from "./operators-source/rossi";
import { tangtangOperatorDetailData } from "./operators-source/tangtang";
import { lifengOperatorDetailData } from "./operators-source/lifeng";
import { emberOperatorDetailData } from "./operators-source/ember";
import { gilbertaOperatorDetailData } from "./operators-source/gilberta";
import { ardeliaOperatorDetailData } from "./operators-source/ardelia";
import { pogranichnikOperatorDetailData } from "./operators-source/pogranichnik";
import { laevatainOperatorDetailData } from "./operators-source/laevatain";
import { yvonneOperatorDetailData } from "./operators-source/yvonne";
import { lastRiteOperatorDetailData } from "./operators-source/lastrite";
import { chenQianyuOperatorDetailData } from "./operators-source/chenqianyu";
import { snowshineOperatorDetailData } from "./operators-source/snowshine";
import { xaihiOperatorDetailData } from "./operators-source/xaihi";
import { perlicaOperatorDetailData } from "./operators-source/perlica";
import { wulfgardOperatorDetailData } from "./operators-source/wulfgard";
import { arclightOperatorDetailData } from "./operators-source/arclight";
import { aleshOperatorDetailData } from "./operators-source/alesh";
import { avywennaOperatorDetailData } from "./operators-source/avywenna";
import { daPanOperatorDetailData } from "./operators-source/dapan";
import { estellaOperatorDetailData } from "./operators-source/estella";
import { catcherOperatorDetailData } from "./operators-source/catcher";
import { antalOperatorDetailData } from "./operators-source/antal";
import { fluoriteOperatorDetailData } from "./operators-source/fluorite";
import { akekuriOperatorDetailData } from "./operators-source/akekuri";
import { endministratorOperatorDetailData } from "./operators-source/endministrator";
import { zhuangfangyiDetailData } from "./operators-source/zhuangfangyi";
import { mifuOperatorDetailData } from "./operators-source/mifu";

import {
  buildOperatorDetailFromSource,
  type InfrastructureCost,
  type InfrastructureSkillGroup,
  type LevelUpCost,
  type MaterialCostItem,
  type OperatorClass,
  type OperatorDetail,
  type OperatorElement,
  type OperatorRarity,
  type PotentialDetail,
  type RequiredMaterials,
  type TalentCost,
  type TalentDetail,
  type TrustBonus,
  type TrustBonusCost,
  type WeaponType,
} from "./operators-transformers";

export type {
  InfrastructureCost,
  InfrastructureSkillGroup,
  LevelUpCost,
  MaterialCostItem,
  OperatorClass,
  OperatorDetail,
  OperatorElement,
  OperatorRarity,
  PotentialDetail,
  RequiredMaterials,
  TalentCost,
  TalentDetail,
  TrustBonus,
  TrustBonusCost,
  WeaponType,
} from "./operators-transformers";

export const operatorDetails: OperatorDetail[] = [
  buildOperatorDetailFromSource(rossiOperatorDetailData),
  buildOperatorDetailFromSource(tangtangOperatorDetailData),
  buildOperatorDetailFromSource(lifengOperatorDetailData),
  buildOperatorDetailFromSource(emberOperatorDetailData),
  buildOperatorDetailFromSource(gilbertaOperatorDetailData),
  buildOperatorDetailFromSource(ardeliaOperatorDetailData),
  buildOperatorDetailFromSource(pogranichnikOperatorDetailData),
  buildOperatorDetailFromSource(laevatainOperatorDetailData),
  buildOperatorDetailFromSource(yvonneOperatorDetailData),
  buildOperatorDetailFromSource(lastRiteOperatorDetailData),
  buildOperatorDetailFromSource(chenQianyuOperatorDetailData),
  buildOperatorDetailFromSource(snowshineOperatorDetailData),
  buildOperatorDetailFromSource(xaihiOperatorDetailData),
  buildOperatorDetailFromSource(perlicaOperatorDetailData),
  buildOperatorDetailFromSource(wulfgardOperatorDetailData),
  buildOperatorDetailFromSource(arclightOperatorDetailData),
  buildOperatorDetailFromSource(aleshOperatorDetailData),
  buildOperatorDetailFromSource(avywennaOperatorDetailData),
  buildOperatorDetailFromSource(daPanOperatorDetailData),
  buildOperatorDetailFromSource(estellaOperatorDetailData),
  buildOperatorDetailFromSource(catcherOperatorDetailData),
  buildOperatorDetailFromSource(antalOperatorDetailData),
  buildOperatorDetailFromSource(fluoriteOperatorDetailData),
  buildOperatorDetailFromSource(akekuriOperatorDetailData),
  buildOperatorDetailFromSource(endministratorOperatorDetailData),
  buildOperatorDetailFromSource(zhuangfangyiDetailData),
  buildOperatorDetailFromSource(mifuOperatorDetailData),
];

const operatorDetailBySlug = new Map(
  operatorDetails.map((operator) => [operator.slug, operator]),
);

export function getOperatorDetailBySlug(slug: string) {
  return operatorDetailBySlug.get(slug);
}

export function getOperatorDetailByName(name: string) {
  const normalizedInput = name.replace(/\s+/g, "").trim().toLowerCase();

  return operatorDetails.find((operator) => {
    const candidates = [
      operator.name,
      operator.enName,
      operator.slug,
      (operator as { koreanName?: string }).koreanName,
      (operator as { displayName?: string }).displayName,
    ]
      .filter(Boolean)
      .map((value) => String(value).replace(/\s+/g, "").trim().toLowerCase());

    return candidates.includes(normalizedInput);
  });
}
