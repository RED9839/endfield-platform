import { grandvision } from "./weapons-source/grandvision";
import { whitenightnova } from "./weapons-source/whitenightnova";
import { forgebornscathe } from "./weapons-source/forgebornscathe";
import { rapidascent } from "./weapons-source/rapidascent";
import { umbraltorch } from "./weapons-source/umbraltorch";
import { thermitecutter } from "./weapons-source/thermitecutter";
import { eminentrepute } from "./weapons-source/eminentrepute";
import { neverrest } from "./weapons-source/neverrest";
import { gloriousmemory } from "./weapons-source/gloriousmemory";
import { lupinescarlet } from "./weapons-source/lupinescarlet";
import { objedgeoflightness } from "./weapons-source/objedgeoflightness";
import { twelvequestions } from "./weapons-source/twelvequestions";
import { finchaser30 } from "./weapons-source/finchaser30";
import { sunderingsteel } from "./weapons-source/sunderingsteel";
import { fortmaker } from "./weapons-source/fortmaker";
import { aspirant } from "./weapons-source/aspirant";
import { wavetide } from "./weapons-source/wavetide";
import { prominentedge } from "./weapons-source/prominentedge";
import { tarr11 } from "./weapons-source/tarr11";
import { opusetchfigure } from "./weapons-source/opusetchfigure";
import { detonationunit } from "./weapons-source/detonationunit";
import { oblivion } from "./weapons-source/oblivion";
import { chivalricvirtues } from "./weapons-source/chivalricvirtues";
import { deliveryguaranteed } from "./weapons-source/deliveryguaranteed";
import { dreamsofthestarrybeach } from "./weapons-source/dreamsofthestarrybeach";
import { monaihe } from "./weapons-source/monaihe";
import { wildwanderer } from "./weapons-source/wildwanderer";
import { stanzaofmemorials } from "./weapons-source/stanzaofmemorials";
import { freedomtoproselytize } from "./weapons-source/freedomtoproselytize";
import { objartsidentifier } from "./weapons-source/objartsidentifier";
import { fluorescentroc } from "./weapons-source/fluorescentroc";
import { hypernovaauto } from "./weapons-source/hypernovaauto";
import { jiminy12 } from "./weapons-source/jiminy12";
import { exemplar } from "./weapons-source/exemplar";
import { formerfinery } from "./weapons-source/formerfinery";
import { thunderberge } from "./weapons-source/thunderberge";
import { sunderedprince } from "./weapons-source/sunderedprince";
import { khravengger } from "./weapons-source/khravengger";
import { finishingcall } from "./weapons-source/finishingcall";
import { seekerofdarklung } from "./weapons-source/seekerofdarklung";
import { ancientcanal } from "./weapons-source/ancientcanal";
import { objheavyburden } from "./weapons-source/objheavyburden";
import { industry01 } from "./weapons-source/industry01";
import { quencher } from "./weapons-source/quencher";
import { darhoff7 } from "./weapons-source/darhoff7";
import { jet } from "./weapons-source/jet";
import { valiant } from "./weapons-source/valiant";
import { mountainbearer } from "./weapons-source/mountainbearer";
import { chimericjustice } from "./weapons-source/chimericjustice";
import { cohesivetraction } from "./weapons-source/cohesivetraction";
import { objrazorhorn } from "./weapons-source/objrazorhorn";
import { pathfindersbeacon } from "./weapons-source/pathfindersbeacon";
import { aggeloslayer } from "./weapons-source/aggeloslayer";
import { opero77 } from "./weapons-source/opero77";
import { homelonging } from "./weapons-source/homelonging";
import { wedge } from "./weapons-source/wedge";
import { navigator } from "./weapons-source/navigator";
import { clannibal } from "./weapons-source/clannibal";
import { artzytyrannical } from "./weapons-source/artzytyrannical";
import { brigandscalling } from "./weapons-source/brigandscalling";
import { objvelocitous } from "./weapons-source/objvelocitous";
import { rationalfarewell } from "./weapons-source/rationalfarewell";
import { opustheliving } from "./weapons-source/opustheliving";
import { howlingguard } from "./weapons-source/howlingguard";
import { longroad } from "./weapons-source/longroad";
import { peco5 } from "./weapons-source/peco5";
import { lonebarge } from "./weapons-source/lonebarge";
import { flickersinthemist } from "./weapons-source/flickersinthemist";

export type WeaponRarity = 3 | 4 | 5 | 6;

export type WeaponType =
  | "sword"
  | "greatsword"
  | "polearm"
  | "handcannon"
  | "artsunit";

export type RawMaterialItem = {
  name: string;
  count: string | number;
  icon?: string;
};

export type WeaponLevelStat = {
  level: number;
  attack: number;
};

/** 소스 파일에서 들어오는 느슨한 타입 */
export type SourceWeaponBreakthroughStage = {
  stage?: number;
  level?: number;
  phase?: number;
  label?: string;
  requiredLevel?: number;
  bonuses?: string[];
  materials?: RawMaterialItem[];
  costs?: RawMaterialItem[];
  items?: RawMaterialItem[];
};

export type WeaponMetaItem = {
  label: string;
  value: string | number;
};

export type WeaponSkillStat = {
  label: string;
  value: string | number;
};

export type WeaponSkillLevelValue = {
  rank: string;
  description?: string;
  stats?: WeaponSkillStat[];
};

export type WeaponSkillCompareRow = {
  label: string;
  values: (string | number)[];
};

/** 소스 파일에서 들어오는 느슨한 타입 */
export type SourceWeaponSkillPanel = {
  key?: string;
  type?: string;
  name?: string;
  typeLabel?: string;
  icon?: string;
  description?: string;
  meta?: WeaponMetaItem[];
  levelValues?: WeaponSkillLevelValue[];
  compareRows?: WeaponSkillCompareRow[];
};

/** 상세 페이지/목록 페이지에서 실제로 쓰는 엄격한 타입 */
export type WeaponBreakthroughStage = {
  stage: number;
  requiredLevel: number;
  materials: RawMaterialItem[];
  bonuses: string[];
};

export type WeaponSkillPanel = {
  key: string;
  name: string;
  typeLabel?: string;
  icon?: string;
  description?: string;
  meta: WeaponMetaItem[];
  levelValues: WeaponSkillLevelValue[];
  compareRows: WeaponSkillCompareRow[];
};

export type SourceWeaponDetail = {
  slug: string;
  name: string;
  enName: string;
  rarity: WeaponRarity;
  weaponType: WeaponType | string;
  image: string;
  fullImage?: string;
  series?: string;
  mainStatLabel?: string;
  subStatLabel?: string;
  summary?: string;
  description?: string;
  levelStats: WeaponLevelStat[];
  breakthrough?: SourceWeaponBreakthroughStage[];
  skills?: SourceWeaponSkillPanel[];
};

export type WeaponDetail = {
  slug: string;
  name: string;
  enName: string;
  rarity: WeaponRarity;
  weaponType: WeaponType;
  image: string;
  fullImage?: string;
  series?: string;
  mainStatLabel?: string;
  subStatLabel?: string;
  summary?: string;
  description?: string;
  levelStats: WeaponLevelStat[];
  breakthrough: WeaponBreakthroughStage[];
  skills: WeaponSkillPanel[];
};

function normalizeWeaponType(weaponType: WeaponType | string): WeaponType {
  switch (weaponType) {
    case "한손검":
    case "sword":
      return "sword";
    case "양손검":
    case "greatsword":
      return "greatsword";
    case "장병기":
    case "polearm":
      return "polearm";
    case "권총":
    case "handcannon":
      return "handcannon";
    case "아츠 유닛":
    case "artsunit":
      return "artsunit";
    default:
      return "sword";
  }
}

function normalizeMaterialName(name: unknown) {
  const text = String(name ?? "").trim();
  const compact = text.replace(/\s+/g, "").toLowerCase();

  if (
    text === "T-크레딧" ||
    text === "티 크레딧" ||
    compact === "t-credit" ||
    compact === "t-credits" ||
    compact === "tcredit" ||
    compact === "tcredits" ||
    compact === "talosiancurrency" ||
    compact === "talosiancredits" ||
    compact === "탈로시안화폐"
  ) {
    return "탈로시안 화폐";
  }

  return text;
}

function parseMaterialCount(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value) : 0;
  }

  const raw = String(value ?? "")
    .trim()
    .replace(/,/g, "")
    .toLowerCase();

  if (!raw) return 0;

  const match = raw.match(/^(-?\d+(?:\.\d+)?)(k|m)?$/);
  if (match) {
    const base = Number(match[1]);
    const unit = match[2];
    const multiplier = unit === "m" ? 1_000_000 : unit === "k" ? 1_000 : 1;
    return Number.isFinite(base) ? Math.round(base * multiplier) : 0;
  }

  const numeric = Number(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? Math.round(numeric) : 0;
}

function normalizeMaterialItem(item: any): RawMaterialItem | null {
  const name = normalizeMaterialName(item?.name ?? item?.material ?? item?.materialName ?? item?.key);
  const count = parseMaterialCount(item?.count ?? item?.amount ?? item?.quantity ?? item?.value ?? 0);

  if (!name || count <= 0) return null;

  return {
    name,
    count,
    icon: item?.icon ?? `/materials/${name}.webp`,
  };
}

function getStageCurrencyMaterial(stage: any): RawMaterialItem[] {
  const currency = parseMaterialCount(
    stage?.currency ??
      stage?.credit ??
      stage?.credits ??
      stage?.coin ??
      stage?.cost ??
      stage?.tCredit ??
      stage?.tCredits ??
      stage?.tCreditCost ??
      stage?.tCreditsCost ??
      stage?.talosianCurrency ??
      stage?.talosianCredits ??
      stage?.upgradeCurrency ??
      stage?.breakthroughCurrency ??
      stage?.talosianCurrencyCost ??
      stage?.talosianCost ??
      stage?.tCurrency ??
      stage?.money ??
      stage?.gold ??
      0
  );

  if (!currency) return [];

  return [{ name: "탈로시안 화폐", count: currency, icon: "/materials/탈로시안 화폐.webp" }];
}

function normalizeMaterialList(items: any[] = []) {
  const map = new Map<string, RawMaterialItem>();

  for (const item of items) {
    const normalized = normalizeMaterialItem(item);
    if (!normalized) continue;

    const prev = map.get(normalized.name);
    map.set(normalized.name, {
      ...normalized,
      count: Number(prev?.count ?? 0) + Number(normalized.count),
      icon: prev?.icon ?? normalized.icon,
    });
  }

  return Array.from(map.values());
}

function getWeaponStageMaterials(stage: any) {
  return normalizeMaterialList([
    ...((stage?.materials ?? stage?.costs ?? stage?.items ?? []) as any[]),
    ...getStageCurrencyMaterial(stage),
  ]);
}

function normalizeSkillKey(skill: SourceWeaponSkillPanel, index: number): string {
  if (skill.key && skill.key.trim()) return skill.key;

  const metaSeries = skill.meta?.find((m) => String(m.label).includes("시리즈 스킬"))?.value;
  if (typeof metaSeries === "string" && metaSeries.trim()) {
    switch (metaSeries.trim()) {
      case "강공":
        return "heavyStrike";
      case "억제":
        return "suppression";
      case "추격":
        return "pursuit";
      case "분쇄":
        return "crush";
      case "사기":
        return "morale";
      case "기예":
        return "technique";
      case "잔혹":
        return "brutality";
      case "고통":
        return "pain";
      case "의료":
        return "medical";
      case "골절":
        return "fracture";
      case "방출":
        return "discharge";
      case "어둠":
        return "darkness";
      case "흐름":
        return "flow";
      case "효율":
        return "efficiency";
    }
  }

  if (skill.typeLabel === "능력치") return "ability";
  if (skill.typeLabel === "속성") return "attribute";
  if (skill.typeLabel === "시리즈 스킬") return `series-${index}`;

  if (skill.name && skill.name.trim()) {
    return skill.name.trim().toLowerCase().replace(/\s+/g, "-");
  }

  return `skill-${index}`;
}

function buildWeaponDetail(source: SourceWeaponDetail): WeaponDetail {
  return {
    slug: source.slug,
    name: source.name,
    enName: source.enName,
    rarity: source.rarity,
    weaponType: normalizeWeaponType(source.weaponType),
    image: source.image,
    fullImage: source.fullImage,
    series: source.series,
    mainStatLabel: source.mainStatLabel,
    subStatLabel: source.subStatLabel,
    summary: source.summary,
    description: source.description,
    levelStats: source.levelStats ?? [],

    breakthrough: (source.breakthrough ?? []).map((stage, index) => ({
      stage: stage.stage ?? stage.phase ?? index,
      requiredLevel: stage.requiredLevel ?? stage.level ?? 1,
      materials: getWeaponStageMaterials(stage),
      bonuses: stage.bonuses ?? [],
    })),

    skills: (source.skills ?? []).map((skill, index) => ({
      key: normalizeSkillKey(skill, index),
      name: skill.name ?? `스킬 ${index + 1}`,
      typeLabel: skill.typeLabel ?? skill.type,
      icon: skill.icon,
      description: skill.description,
      meta: skill.meta ?? [],
      levelValues: skill.levelValues ?? [],
      compareRows: skill.compareRows ?? [],
    })),
  };
}

const weaponSources: SourceWeaponDetail[] = [
  grandvision,
  whitenightnova,
  forgebornscathe,
  rapidascent,
  umbraltorch,
  thermitecutter,
  eminentrepute,
  neverrest,
  gloriousmemory,
  lupinescarlet,
  objedgeoflightness,
  twelvequestions,
  finchaser30,
  sunderingsteel,
  fortmaker,
  aspirant,
  wavetide,
  prominentedge,
  tarr11,
  opusetchfigure,
  detonationunit,
  oblivion,
  chivalricvirtues,
  deliveryguaranteed,
  dreamsofthestarrybeach,
  monaihe,
  wildwanderer,
  stanzaofmemorials,
  freedomtoproselytize,
  objartsidentifier,
  fluorescentroc,
  hypernovaauto,
  jiminy12,
  exemplar,
  formerfinery,
  thunderberge,
  sunderedprince,
  khravengger,
  finishingcall,
  seekerofdarklung,
  ancientcanal,
  objheavyburden,
  industry01,
  quencher,
  darhoff7,
  jet,
  valiant,
  mountainbearer,
  chimericjustice,
  cohesivetraction,
  objrazorhorn,
  pathfindersbeacon,
  aggeloslayer,
  opero77,
  homelonging,
  wedge,
  navigator,
  clannibal,
  artzytyrannical,
  brigandscalling,
  objvelocitous,
  rationalfarewell,
  opustheliving,
  howlingguard,
  longroad,
  peco5,
  lonebarge,
  flickersinthemist,
];

export const weaponDetails: WeaponDetail[] = weaponSources.map(buildWeaponDetail);

export function getWeaponDetailBySlug(slug: string) {
  return weaponDetails.find((weapon) => weapon.slug === slug);
}
