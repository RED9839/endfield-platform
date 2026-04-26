import type { GearDetail } from "./gear-types";

import { frontiersarmor } from "./gear-source/frontiersarmor";
import { frontiersarmort1 } from "./gear-source/frontiersarmort1";
import { frontiersarmort2 } from "./gear-source/frontiersarmort2";
import { frontiersarmort3 } from "./gear-source/frontiersarmort3";
import { frontiersprotectionsuit } from "./gear-source/frontiersprotectionsuit";
import { frontiersblightresgloves } from "./gear-source/frontiersblightresgloves";
import { frontiersfibergloves } from "./gear-source/frontiersfibergloves";
import { frontiersextrao2tube } from "./gear-source/frontiersextrao2tube";
import { frontierscommt1 } from "./gear-source/frontierscommt1";
import { frontierscomm } from "./gear-source/frontierscomm";
import { frontiersanalyzer } from "./gear-source/frontiersanalyzer";
import { frontierso2tube } from "./gear-source/frontierso2tube";
import { type50yinglungheavyarmor } from "./gear-source/type50yinglungheavyarmor";
import { type50yinglungheavyarmort1 } from "./gear-source/type50yinglungheavyarmort1";
import { type50yinglungheavyarmort2 } from "./gear-source/type50yinglungheavyarmort2";
import { type50yinglunglightarmor } from "./gear-source/type50yinglunglightarmor";
import { type50yinglungglovest1 } from "./gear-source/type50yinglungglovest1";
import { type50yinglunggloves } from "./gear-source/type50yinglunggloves";
import { type50yinglungknife } from "./gear-source/type50yinglungknife";
import { type50yinglungknifet1 } from "./gear-source/type50yinglungknifet1";
import { type50yinglungradar } from "./gear-source/type50yinglungradar";
import { type50yinglungradart1 } from "./gear-source/type50yinglungradart1";
import { type50yinglungradart2 } from "./gear-source/type50yinglungradart2";
import { bonecrusherponcho } from "./gear-source/bonecrusherponcho";
import { bonecrusherponchot1 } from "./gear-source/bonecrusherponchot1";
import { bonecrusherheavyarmor } from "./gear-source/bonecrusherheavyarmor";
import { bonecrusherheavyarmort1 } from "./gear-source/bonecrusherheavyarmort1";
import { bonecrusherheavyarmort2 } from "./gear-source/bonecrusherheavyarmort2";
import { bonecrusherwristband } from "./gear-source/bonecrusherwristband";
import { bonecrusherwristbandt1 } from "./gear-source/bonecrusherwristbandt1";
import { bonecrusherfigurine } from "./gear-source/bonecrusherfigurine";
import { bonecrusherfigurinet1 } from "./gear-source/bonecrusherfigurinet1";
import { bonecrushermask } from "./gear-source/bonecrushermask";
import { bonecrushermaskt1 } from "./gear-source/bonecrushermaskt1";
import { bonecrushermaskt2 } from "./gear-source/bonecrushermaskt2";
import { tidefalllightarmor } from "./gear-source/tidefalllightarmor";
import { tidesurgegauntlets } from "./gear-source/tidesurgegauntlets";
import { turbidcuttingtorch } from "./gear-source/turbidcuttingtorch";
import { hangingrivero2tube } from "./gear-source/hangingrivero2tube";
import { misecurityoveralls } from "./gear-source/misecurityoveralls";
import { misecurityarmort1 } from "./gear-source/misecurityarmort1";
import { misecurityoverallst2 } from "./gear-source/misecurityoverallst2";
import { misecurityarmor } from "./gear-source/misecurityarmor";
import { misecurityoverallst1 } from "./gear-source/misecurityoverallst1";
import { misecuritygloves } from "./gear-source/misecuritygloves";
import { misecurityglovest1 } from "./gear-source/misecurityglovest1";
import { misecurityhandsppe } from "./gear-source/misecurityhandsppe";
import { misecurityhandssppet1 } from "./gear-source/misecurityhandssppet1";
import { misecuritypushknifet1 } from "./gear-source/misecuritypushknifet1";
import { misecuritypushknife } from "./gear-source/misecuritypushknife";
import { misecurityarmband } from "./gear-source/misecurityarmband";
import { misecurityscope } from "./gear-source/misecurityscope";
import { misecuritytoolkit } from "./gear-source/misecuritytoolkit";
import { misecurityscopet1 } from "./gear-source/misecurityscopet1";
import { hotworkexoskeleton } from "./gear-source/hotworkexoskeleton";
import { hotworkexorig } from "./gear-source/hotworkexorig";
import { hotworkgauntlets } from "./gear-source/hotworkgauntlets";
import { hotworkgauntletst1 } from "./gear-source/hotworkgauntletst1";
import { hotworkgloves } from "./gear-source/hotworkgloves";
import { hotworkpowerbank } from "./gear-source/hotworkpowerbank";
import { hotworkpyrometer } from "./gear-source/hotworkpyrometer";
import { hotworkpowercartridge } from "./gear-source/hotworkpowercartridge";
import { lynxcuirass } from "./gear-source/lynxcuirass";
import { lynxheavyarmor } from "./gear-source/lynxheavyarmor";
import { lynxgauntlets } from "./gear-source/lynxgauntlets";
import { lynxgloves } from "./gear-source/lynxgloves";
import { lynxconnector } from "./gear-source/lynxconnector";
import { lynxaegisinjector } from "./gear-source/lynxaegisinjector";
import { lynxslab } from "./gear-source/lynxslab";
import { lynxconnectort1 } from "./gear-source/lynxconnectort1";
import { lynxconnectort2 } from "./gear-source/lynxconnectort2";
import { swordmancerlightarmor } from "./gear-source/swordmancerlightarmor";
import { swordmancerheavyarmor } from "./gear-source/swordmancerheavyarmor";
import { swordmancertacgauntlets } from "./gear-source/swordmancertacgauntlets";
import { swordmancertacgloves } from "./gear-source/swordmancertacgloves";
import { swordmancernavbeacon } from "./gear-source/swordmancernavbeacon";
import { swordmancermicrofilter } from "./gear-source/swordmancermicrofilter";
import { swordmancerflint } from "./gear-source/swordmancerflint";
import { aethertechplating } from "./gear-source/aethertechplating";
import { aethertechlightgloves } from "./gear-source/aethertechlightgloves";
import { aethertechgloves } from "./gear-source/aethertechgloves";
import { aethertechwatch } from "./gear-source/aethertechwatch";
import { aethertechstabilizert1 } from "./gear-source/aethertechstabilizert1";
import { aethertechanalysisband } from "./gear-source/aethertechanalysisband";
import { aethertechstabilizer } from "./gear-source/aethertechstabilizer";
import { pulserlabsdisruptorsuit } from "./gear-source/pulserlabsdisruptorsuit";
import { pulserlabsgloves } from "./gear-source/pulserlabsgloves";
import { pulserlabsinvasioncore } from "./gear-source/pulserlabsinvasioncore";
import { pulserlabscalibrator } from "./gear-source/pulserlabscalibrator";
import { pulserlabsprobe } from "./gear-source/pulserlabsprobe";
import { eternalxiranitearmor } from "./gear-source/eternalxiranitearmor";
import { eternalxiranitegloves } from "./gear-source/eternalxiranitegloves";
import { eternalxiraniteglovest1 } from "./gear-source/eternalxiraniteglovest1";
import { eternalxiraniteauxiliaryarm } from "./gear-source/eternalxiraniteauxiliaryarm";
import { eternalxiranitepowercore } from "./gear-source/eternalxiranitepowercore";
import { eternalxiranitepowercoret1 } from "./gear-source/eternalxiranitepowercoret1";
import { rovingmsgrjackett1 } from "./gear-source/rovingmsgrjackett1";
import { rovingmsgrjacket } from "./gear-source/rovingmsgrjacket";
import { rovingmsgrfistst1 } from "./gear-source/rovingmsgrfistst1";
import { rovingmsgrfists } from "./gear-source/rovingmsgrfists";
import { rovingmsgrflashlightt1 } from "./gear-source/rovingmsgrflashlightt1";
import { rovingmsgrflashlightt2 } from "./gear-source/rovingmsgrflashlightt2";
import { rovingmsgrgyrot1 } from "./gear-source/rovingmsgrgyrot1";
import { rovingmsgrflashlight } from "./gear-source/rovingmsgrflashlight";
import { rovingmsgrgyro } from "./gear-source/rovingmsgrgyro";
import { aburreyauditorychip } from "./gear-source/aburreyauditorychip";
import { aburreyauditorychipt1 } from "./gear-source/aburreyauditorychipt1";
import { aburreyflashlight } from "./gear-source/aburreyflashlight";
import { aburreygauntlets } from "./gear-source/aburreygauntlets";
import { aburreyheavyarmor } from "./gear-source/aburreyheavyarmor";
import { aburreyheavyarmort1 } from "./gear-source/aburreyheavyarmort1";
import { aburreylightarmor } from "./gear-source/aburreylightarmor";
import { aburreylightarmort1 } from "./gear-source/aburreylightarmort1";
import { aburreysensorchip } from "./gear-source/aburreysensorchip";
import { aburreysensorchipt1 } from "./gear-source/aburreysensorchipt1";
import { aburreyuvlamp } from "./gear-source/aburreyuvlamp";
import { armoredmsgrjackett1 } from "./gear-source/armoredmsgrjackett1";
import { armoredmsgrjacket } from "./gear-source/armoredmsgrjacket";
import { armoredmsgrglovest1 } from "./gear-source/armoredmsgrglovest1";
import { armoredmsgrglovest2 } from "./gear-source/armoredmsgrglovest2";
import { armoredmsgrgloves } from "./gear-source/armoredmsgrgloves";
import { armoredmsgrflashlightt1 } from "./gear-source/armoredmsgrflashlightt1";
import { armoredmsgrgyrot1 } from "./gear-source/armoredmsgrgyrot1";
import { armoredmsgrflashlight } from "./gear-source/armoredmsgrflashlight";
import { armoredmsgrgyro } from "./gear-source/armoredmsgrgyro";
import { catastropheheavyarmor } from "./gear-source/catastropheheavyarmor";
import { catastropheheavyarmort1 } from "./gear-source/catastropheheavyarmort1";
import { catastrophegloves } from "./gear-source/catastrophegloves";
import { catastrophefilter } from "./gear-source/catastrophefilter";
import { catastrophegauzecartridge } from "./gear-source/catastrophegauzecartridge";
import { catastrophegauzecartridget1 } from "./gear-source/catastrophegauzecartridget1";
import { mordvoltresistantvestt1 } from "./gear-source/mordvoltresistantvestt1";
import { mordvoltresistantvest } from "./gear-source/mordvoltresistantvest";
import { mordvoltresistantglovest1 } from "./gear-source/mordvoltresistantglovest1";
import { mordvoltresistantgloves } from "./gear-source/mordvoltresistantgloves";
import { mordvoltresistantbatteryt1 } from "./gear-source/mordvoltresistantbatteryt1";
import { mordvoltresistantwrencht1 } from "./gear-source/mordvoltresistantwrencht1";
import { mordvoltresistantwrench } from "./gear-source/mordvoltresistantwrench";
import { mordvoltresistantbattery } from "./gear-source/mordvoltresistantbattery";
import { mordvoltinsulationvestt1 } from "./gear-source/mordvoltinsulationvestt1";
import { mordvoltinsulationvestt2 } from "./gear-source/mordvoltinsulationvestt2";
import { mordvoltinsulationvest } from "./gear-source/mordvoltinsulationvest";
import { mordvoltinsulationglovest1 } from "./gear-source/mordvoltinsulationglovest1";
import { mordvoltinsulationgloves } from "./gear-source/mordvoltinsulationgloves";
import { mordvoltinsulationbatteryt1 } from "./gear-source/mordvoltinsulationbatteryt1";
import { mordvoltinsulationwrencht2 } from "./gear-source/mordvoltinsulationwrencht2";
import { mordvoltinsulationwrench } from "./gear-source/mordvoltinsulationwrench";
import { mordvoltinsulationwrencht1 } from "./gear-source/mordvoltinsulationwrencht1";
import { mordvoltinsulationbattery } from "./gear-source/mordvoltinsulationbattery";
import { aicheavyarmor } from "./gear-source/aicheavyarmor";
import { aicgauntlets } from "./gear-source/aicgauntlets";
import { aicheavyplate } from "./gear-source/aicheavyplate";
import { aicalloyplate } from "./gear-source/aicalloyplate";
import { aiclightarmor } from "./gear-source/aiclightarmor";
import { aictacticalgloves } from "./gear-source/aictacticalgloves";
import { aiclightplate } from "./gear-source/aiclightplate";
import { aicceramicplate } from "./gear-source/aicceramicplate";
import { redeemerarmor } from "./gear-source/redeemerarmor";
import { redeemerplates } from "./gear-source/redeemerplates";
import { minerarmort1 } from "./gear-source/minerarmort1";
import { mineroverallst1 } from "./gear-source/mineroverallst1";
import { minerarmor } from "./gear-source/minerarmor";
import { mineroveralls } from "./gear-source/mineroveralls";
import { prototypeheavyarmor } from "./gear-source/prototypeheavyarmor";
import { prototypeheavyarmort1 } from "./gear-source/prototypeheavyarmort1";
import { minervest } from "./gear-source/minervest";
import { minercleansuit } from "./gear-source/minercleansuit";
import { basicarmor } from "./gear-source/basicarmor";
import { basicppe } from "./gear-source/basicppe";
import { redeemergloves } from "./gear-source/redeemergloves";
import { redeemerhands } from "./gear-source/redeemerhands";
import { minerglovest2 } from "./gear-source/minerglovest2";
import { minerfistst1 } from "./gear-source/minerfistst1";
import { minergauntletst1 } from "./gear-source/minergauntletst1";
import { minerglovest1 } from "./gear-source/minerglovest1";
import { minergauntlets } from "./gear-source/minergauntlets";
import { minerwrists } from "./gear-source/minerwrists";
import { minergloves } from "./gear-source/minergloves";
import { minerfists } from "./gear-source/minerfists";
import { basicgauntlets } from "./gear-source/basicgauntlets";
import { basicgloves } from "./gear-source/basicgloves";
import { redeemerseal } from "./gear-source/redeemerseal";
import { redeemersealt1 } from "./gear-source/redeemersealt1";
import { redeemertag } from "./gear-source/redeemertag";
import { redeemertagt1 } from "./gear-source/redeemertagt1";
import { minerturbinet1 } from "./gear-source/minerturbinet1";
import { minerdrivewheelt1 } from "./gear-source/minerdrivewheelt1";
import { minercompressioncoret1 } from "./gear-source/minercompressioncoret1";
import { minercommt1 } from "./gear-source/minercommt1";
import { minerturbine } from "./gear-source/minerturbine";
import { minerdrivewheel } from "./gear-source/minerdrivewheel";
import { minercompressioncore } from "./gear-source/minercompressioncore";
import { minercomm } from "./gear-source/minercomm";
import { emergencycomm } from "./gear-source/emergencycomm";
import { emergencycompressioncore } from "./gear-source/emergencycompressioncore";

export const gearDetails: GearDetail[] = [
  frontiersarmor,
  frontiersarmort1,
  frontiersarmort2,
  frontiersarmort3,
  frontiersprotectionsuit,
  frontiersblightresgloves,
  frontiersfibergloves,
  frontiersextrao2tube,
  frontierscommt1,
  frontierscomm,
  frontiersanalyzer,
  frontierso2tube,
  type50yinglungheavyarmor,
  type50yinglungheavyarmort1,
  type50yinglungheavyarmort2,
  type50yinglunglightarmor,
  type50yinglungglovest1,
  type50yinglunggloves,
  type50yinglungknife,
  type50yinglungknifet1,
  type50yinglungradar,
  type50yinglungradart1,
  type50yinglungradart2,
  bonecrusherponcho,
  bonecrusherponchot1,
  bonecrusherheavyarmor,
  bonecrusherheavyarmort1,
  bonecrusherheavyarmort2,
  bonecrusherwristband,
  bonecrusherwristbandt1,
  bonecrusherfigurine,
  bonecrusherfigurinet1,
  bonecrushermask,
  bonecrushermaskt1,
  bonecrushermaskt2,
  tidefalllightarmor,
  tidesurgegauntlets,
  turbidcuttingtorch,
  hangingrivero2tube,
  misecurityoveralls,
  misecurityarmort1,
  misecurityoverallst2,
  misecurityarmor,
  misecurityoverallst1,
  misecuritygloves,
  misecurityglovest1,
  misecurityhandsppe,
  misecurityhandssppet1,
  misecuritypushknifet1,
  misecuritypushknife,
  misecurityarmband,
  misecurityscope,
  misecuritytoolkit,
  misecurityscopet1,
  hotworkexoskeleton,
  hotworkexorig,
  hotworkgauntlets,
  hotworkgauntletst1,
  hotworkgloves,
  hotworkpowerbank,
  hotworkpyrometer,
  hotworkpowercartridge,
  lynxcuirass,
  lynxheavyarmor,
  lynxgauntlets,
  lynxgloves,
  lynxconnector,
  lynxaegisinjector,
  lynxslab,
  lynxconnectort1,
  lynxconnectort2,
  swordmancerlightarmor,
  swordmancerheavyarmor,
  swordmancertacgauntlets,
  swordmancertacgloves,
  swordmancernavbeacon,
  swordmancermicrofilter,
  swordmancerflint,
  aethertechplating,
  aethertechlightgloves,
  aethertechgloves,
  aethertechwatch,
  aethertechstabilizert1,
  aethertechanalysisband,
  aethertechstabilizer,
  pulserlabsdisruptorsuit,
  pulserlabsgloves,
  pulserlabsinvasioncore,
  pulserlabscalibrator,
  pulserlabsprobe,
  eternalxiranitearmor,
  eternalxiranitegloves,
  eternalxiraniteglovest1,
  eternalxiraniteauxiliaryarm,
  eternalxiranitepowercore,
  eternalxiranitepowercoret1,
  rovingmsgrjackett1,
  rovingmsgrjacket,
  rovingmsgrfistst1,
  rovingmsgrfists,
  rovingmsgrflashlightt1,
  rovingmsgrflashlightt2,
  rovingmsgrgyrot1,
  rovingmsgrflashlight,
  rovingmsgrgyro,
  aburreyheavyarmor,
  aburreyheavyarmort1,
  aburreylightarmor,
  aburreylightarmort1,
  aburreygauntlets,
  aburreyauditorychip,
  aburreyauditorychipt1,
  aburreyflashlight,
  aburreysensorchip,
  aburreysensorchipt1,
  aburreyuvlamp,
  armoredmsgrjackett1,
  armoredmsgrjacket,
  armoredmsgrglovest1,
  armoredmsgrglovest2,
  armoredmsgrgloves,
  armoredmsgrflashlightt1,
  armoredmsgrgyrot1,
  armoredmsgrflashlight,
  armoredmsgrgyro,
  catastropheheavyarmor,
  catastropheheavyarmort1,
  catastrophegloves,
  catastrophefilter,
  catastrophegauzecartridge,
  catastrophegauzecartridget1,
  mordvoltresistantvestt1,
  mordvoltresistantvest,
  mordvoltresistantglovest1,
  mordvoltresistantgloves,
  mordvoltresistantbatteryt1,
  mordvoltresistantwrencht1,
  mordvoltresistantwrench,
  mordvoltresistantbattery,
  mordvoltinsulationvestt1,
  mordvoltinsulationvestt2,
  mordvoltinsulationvest,
  mordvoltinsulationglovest1,
  mordvoltinsulationgloves,
  mordvoltinsulationbatteryt1,
  mordvoltinsulationwrencht2,
  mordvoltinsulationwrench,
  mordvoltinsulationwrencht1,
  mordvoltinsulationbattery,
  aicheavyarmor,
  aicgauntlets,
  aicheavyplate,
  aicalloyplate,
  aiclightarmor,
  aictacticalgloves,
  aiclightplate,
  aicceramicplate,
  redeemerarmor,
  redeemerplates,
  minerarmort1,
  mineroverallst1,
  minerarmor,
  mineroveralls,
  prototypeheavyarmor,
  prototypeheavyarmort1,
  minervest,
  minercleansuit,
  basicarmor,
  basicppe,
  redeemergloves,
  redeemerhands,
  minerglovest2,
  minerfistst1,
  minergauntletst1,
  minerglovest1,
  minergauntlets,
  minerwrists,
  minergloves,
  minerfists,
  basicgauntlets,
  basicgloves,
  redeemerseal,
  redeemersealt1,
  redeemertag,
  redeemertagt1,
  minerturbinet1,
  minerdrivewheelt1,
  minercompressioncoret1,
  minercommt1,
  minerturbine,
  minerdrivewheel,
  minercompressioncore,
  minercomm,
  emergencycomm,
  emergencycompressioncore,
];

export function getGearDetailBySlug(slug: string) {
  return gearDetails.find((item) => item.slug === slug) ?? null;
}