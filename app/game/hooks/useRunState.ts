"use client";

import { useCallback, useState } from "react";

import { buildDeck, cardRemovalCost, cardRewardPool, deckCardFromToken, isTransformOperator, makeCard, makeChaseCard, makeConsumableUltCard, makeMifuFormCard, makeTransformedCard, makeYvonneStanceCard, MAX_ELITE, MIN_DECK_SIZE, MIFU_FORM_COUNT, startingDeck } from "../data/cards";
import { getEnemies, getEnemy } from "../data/enemies";
import { loadBestScores, loadDeckSnapshot, recordScore, saveDeckSnapshot } from "../lib/challenge";
import { computeBattleDrop, getEnemyWeakness, WEAKNESS_AMP } from "../data/enemy-traits";
import { events } from "../data/events";
import { getRelic, getRelicEffects, pickRelics, RELIC_IDS } from "../data/relics";
import { getPotion, MAX_POTIONS, pickPotions, potionNeedsTarget } from "../data/potions";
import {
  chooseGearRewards,
  getActiveSets,
  getEquippedGears,
  getGameGear,
  getGearTalentPower,
  getGearStatTotals,
  getGearDamageMult,
  getGearBuyValue,
  getGearSellValue,
  getGearSlot,
  getSetEffects,
} from "../data/game-gears";
import { factions, getFactionStart, getMapNode } from "../data/maps";
import { allOperators, startingParty } from "../data/operators";
import { passiveSpec } from "../data/operator-passives";
import { ultEnergyReq, ultGainConditional, ultArtsConsumeBonus, ultKind } from "../data/operator-ult-energy";
import type {
  BattleEnemy,
  BattleState,
  Card,
  Element,
  Enemy,
  EnemyStatus,
  GameEventChoice,
  Operator,
  PartyMember,
  RunActions,
  RunGear,
  RunState,
  SkillKind,
} from "../types/game";

// 카드 전투 자원
const ENERGY_PER_TURN = 3;
const HAND_SIZE = 5;
// 포그라니치니크 「철의 서약」: 궁극 시 5포인트 생성, 물리 이상/연계 트리거마다 1 소모(방패병 추가타+게이지 회복), 마지막 1포인트=최후의 승부.
const IRON_OATH_POINTS = 5;
const IRON_OATH_GAUGE = 14; // 방패병 교란 시 포그 스킬 게이지 회복
const IRON_OATH_FINAL_GAUGE = 60; // 최후의 승부 대량 게이지 회복
// 질베르타 「전달자의 노래」 궁극 충전 효율 % 대상 직군(가드·캐스터·서포터).
const ULT_BATTERY_CLASSES = ["가드", "캐스터", "서포터"];
const EVASION_CAP = 25;
// 아츠 이상 4종(위키 §3.2.3). 적 statuses에는 '이상'이 발동했을 때만 부여된다(부착 자체는 enemy.attach로 별도 추적).
const ARTS_INFLICTIONS: EnemyStatus[] = ["combustion", "shock", "freeze", "corrosion"];
// 원소 → 발동되는 아츠 이상(마지막 부착 원소가 이상 타입을 결정)
const ELEMENT_INFLICTION: Partial<Record<Element, EnemyStatus>> = {
  heat: "combustion",
  electric: "shock",
  cryo: "freeze",
  nature: "corrosion",
};
const INFLICTION_LABEL: Record<string, string> = { combustion: "연소", shock: "감전", freeze: "동결", corrosion: "부식" };
// 원소 부착 표시 라벨(부착·폭발 단계)
const ELEM_LABEL: Partial<Record<Element, string>> = { heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const ARTS_ATTACHMENT_STATUSES = ARTS_INFLICTIONS;

function getBaseOperator(operatorId: string): Operator {
  const operator = allOperators.find((item) => item.id === operatorId);
  if (!operator) throw new Error(`Unknown operator: ${operatorId}`);
  return operator;
}

export function freshParty(operatorIds?: string[]): PartyMember[] {
  const roster =
    operatorIds && operatorIds.length > 0
      ? operatorIds
          .map((id) => allOperators.find((operator) => operator.id === id))
          .filter((operator): operator is Operator => Boolean(operator))
      : startingParty;
  return roster.map((operator) => ({
    ...operator,
    hp: operator.maxHp,
    shield: 0,
    ultimateCharge: 0,
    actionGauge: 0,
    passiveStacks: 0,
    gear: {},
  }));
}

function initialState(): RunState {
  // CZN식: 런마다 랜덤 세력(카오스) 1개를 골라 그 세력의 외곽→중심부→심층부 필드를 진행
  const factionIndex = Math.floor(Math.random() * factions.length);
  const party = freshParty();
  const sd = startingDeck(0, party);
  return {
    screen: "deployment",
    factionIndex,
    party,
    collectedGears: [],
    deck: sd.deck,
    deckSeq: sd.seq,
    cardsRemoved: 0,
    relics: [],
    potions: [],
    pendingCardOffers: [],
    shopRelics: [],
    shopPotions: [],
    visitedNodes: [],
    availableNodes: getFactionStart(factionIndex),
    pendingGearSlugs: [],
    credits: 0,
    sp: 2,
    maxSp: 3,
    cp: 0,
    maxCp: 3,
    battlesWon: 0,
  };
}

function healParty(party: PartyMember[], amount: number) {
  return party.map((member) => ({
    ...member,
    hp: Math.min(member.maxHp, member.hp + amount),
  }));
}

function damageParty(party: PartyMember[], amount: number) {
  return party.map((member) => ({
    ...member,
    hp: Math.max(1, member.hp - amount),
  }));
}

function addStatus(statuses: EnemyStatus[], status: EnemyStatus) {
  return statuses.includes(status) ? statuses : [...statuses, status];
}

function withoutStatus(statuses: EnemyStatus[], status: EnemyStatus) {
  return statuses.filter((item) => item !== status);
}

function absorbHit(member: PartyMember, amount: number) {
  const resist = passiveSpec(member.id).damageResist ?? 0; // 재능 피해 감소(부활의 불씨·무의식·하늘의 가호 등)
  const amt = resist > 0 ? Math.ceil(amount * (1 - resist)) : amount;
  const blocked = Math.min(member.shield, amt);
  return { ...member, shield: member.shield - blocked, hp: Math.max(0, member.hp - (amt - blocked)) };
}

function activeSets(member: PartyMember) {
  return getActiveSets(member.gear);
}

function hasSet(member: PartyMember, setName: string) {
  return activeSets(member).includes(setName);
}

function applyBattleStartSetEffects(
  party: PartyMember[],
  sp: number,
  maxSp: number,
) {
  // 전투 시작 세트 효과(데이터 기반): startShield/startHeal는 장착 오퍼에, startEnergy는 파티 공유.
  let startEnergy = 0;
  const out = party.map((member) => {
    if (member.hp <= 0) return member;
    let shield = 0;
    let heal = 0;
    for (const set of activeSets(member)) {
      for (const e of getSetEffects(set)) {
        if (e.type === "startShield") shield += e.v;
        else if (e.type === "startHeal") heal += e.v;
        else if (e.type === "startEnergy") startEnergy += e.v;
      }
    }
    return shield || heal ? { ...member, shield: member.shield + shield, hp: Math.min(member.maxHp, member.hp + heal) } : member;
  });
  return { party: out, sp, startEnergy };
}

function didEvade(member: PartyMember, battleTurn: number, enemyId: string) {
  const chance = Math.max(0, Math.min(EVASION_CAP, member.evasion));
  const seed = `${member.id}:${enemyId}:${battleTurn}:${member.actionGauge}`;
  const roll = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100;
  return roll < chance;
}

// 엔드필드 방어 공식: 받는 피해 배율 = 1 / (0.01 × 방어력 + 1). (방어 100 → ×0.5)
function defenseFactor(defense: number) {
  return 1 / (0.01 * Math.max(0, defense) + 1);
}

// 궁극기 게이지: 배틀/연계 스킬 사용 시 시전 오퍼는 실제 획득량(ultGainSelf, 레바테인 100 등), 그 외 파티는 소량 트리클.
// 만충치는 오퍼별 실제 "필요한 궁극기 에너지". 게이지는 전투 간 유지(런 내내 누적).
// 위키 §2.1.4 궁극 게이지 충전: 배틀스킬=아군 전체 +6.5 / 연계스킬=시전자만 +10(아크라이트 예외 5).
const ULT_CHARGE_BATTLE_TEAM = 6; // 배틀스킬 사용 시 아군 전체 충전(≈6.5)
const LINK_ULT_GAIN = 10;          // 연계스킬 사용 시 시전자만 충전
const LINK_ULT_GAIN_ARCLIGHT = 5;  // 아크라이트 예외(각주[5])

// 엔드필드 불균형(스태거) 받피증: 방어 붕괴 상태의 적은 받는 피해 +30% (×1.3)
const IMBALANCE_DAMAGE_TAKEN = 1.3;
// 쇄빙(Shatter): 동결 적을 물리로 치면 대량 물리 피해(×1.7) + 동결 해제
const SHATTER_AMP = 1.7;
// 아츠 부착 DoT: 연소·부식 적은 매 턴 시작 시 지속 피해
const DOT_DAMAGE = 4;
// 연계스킬 콤보: 이미 불균형(방어 붕괴)인 적에게 연계스킬을 쓰면 강타(×1.5). 배틀→연계 콤보 루프 유도.
const LINK_COMBO_AMP = 1.5;

// 불균형치(스태거 누적)는 카드별 card.stagger로 관리(data/cards.ts CARD_STAGGER). 적의 staggerHp를 채우면 불균형.
const STAGGER_INTERRUPT_BONUS = 26; // 차지/그랩 등 행동을 끊는 스킬은 추가 불균형
const BREAK_TURNS = 2; // 불균형 지속(적 행동 손실 횟수)
const TACTICAL_STAGGER = 16; // 포션 등 카드 외 피해의 불균형 누적

// 카드 템포: 적의 행동 주기(카드 N장당 1회). 빠른 적/보스일수록 자주 행동.
export function enemyActionEvery(e: Enemy): number {
  let every = e.speed >= 98 ? 2 : e.speed <= 88 ? 4 : 3;
  if (e.boss) every = 2;
  else if (e.elite && every > 3) every = 3;
  return every;
}

// 방어불능 스택(물리 전용, 최대 4). 빌더가 스킬로 적립, 컨슈머가 소모해 '갑옷 파괴' 부여.
const MAX_PHYS_BREAK_STACKS = 4;
const PHYS_BREAK_BUILD: Record<SkillKind, number> = { attack: 0, "battle-skill": 1, "link-skill": 1, ultimate: 2 };
const ARMOR_BREAK_AMP = 1.24; // 갑옷 파괴: 적 받는 물리 피해 +24%(위키 4스택 소모 기준 12/16/20/24%)

// 치명타 판정(시드 기반, 결정적). 확률은 오퍼레이터 critRate(0~1).
function rollCrit(actor: PartyMember, seedExtra: string, bonus = 0) {
  const rate = Math.max(0, Math.min(1, (actor.critRate ?? 0.05) + bonus));
  const seed = `${actor.id}:crit:${seedExtra}`;
  const roll = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
  return roll < rate * 1000;
}

function enemyHas(enemy: BattleEnemy, mechanic: BattleEnemy["mechanics"][number]) {
  return enemy.mechanics.includes(mechanic);
}

function isEnemyInterrupted(enemy: BattleEnemy) {
  return enemy.statuses.includes("defense-break");
}

function isEnemyEnraged(enemy: BattleEnemy) {
  return enemyHas(enemy, "enrage") && enemy.hp <= enemy.maxHp * 0.45 && !isEnemyInterrupted(enemy);
}

function getEnemyDamageTaken(enemy: BattleEnemy, damage: number, kind: SkillKind) {
  let nextDamage = damage;
  const notes: string[] = [];
  const interrupted = isEnemyInterrupted(enemy);
  if (enemyHas(enemy, "boss-shield") && !interrupted) {
    nextDamage = Math.ceil(nextDamage * (kind === "ultimate" ? 0.8 : 0.65));
    notes.push("boss shield");
  }
  if (enemyHas(enemy, "shield") && !interrupted) {
    nextDamage = Math.ceil(nextDamage * 0.7);
    notes.push("guard");
  }
  if (enemyHas(enemy, "armored") && kind === "attack" && !interrupted) {
    nextDamage = Math.ceil(nextDamage * 0.82);
    notes.push("armor");
  }
  if (enemyHas(enemy, "evasive") && kind === "attack" && !interrupted) {
    nextDamage = Math.ceil(nextDamage * 0.75);
    notes.push("evasion");
  }
  return { damage: Math.max(1, nextDamage), notes };
}

function shouldInterruptEnemy(enemy: BattleEnemy, kind: SkillKind) {
  if (kind === "attack") return false;
  return enemyHas(enemy, "charge") || enemyHas(enemy, "grab") || enemyHas(enemy, "evasive") || enemyHas(enemy, "shield") || enemyHas(enemy, "boss-shield");
}

function reviveEnemies(enemies: BattleEnemy[]) {
  const notes: string[] = [];
  const revived = enemies.map((enemy) => {
    if (enemy.hp > 0 || !enemyHas(enemy, "revive") || enemy.revived) return enemy;
    notes.push(`${enemy.name} revive`);
    return { ...enemy, hp: Math.max(1, Math.ceil(enemy.maxHp * 0.35)), revived: true, statuses: withoutStatus(withoutStatus(enemy.statuses, "defense-break"), "armor-break"), stagger: 0, breakTurns: undefined, physBreakStacks: 0, armorBreakTurns: undefined };
  });
  return { enemies: revived, notes };
}

function buildEnemyAction(actor: BattleEnemy, battleTurn: number) {
  let damage = actor.attack;
  const notes: string[] = [];
  const enraged = isEnemyEnraged(actor);
  const selfDestruct = enemyHas(actor, "self-destruct") && actor.hp <= actor.maxHp * 0.3;
  if (enraged) {
    damage = Math.ceil(damage * 1.25);
    notes.push("enrage");
  }
  if (enemyHas(actor, "charge") && (enraged || battleTurn % 3 === 0)) {
    damage = Math.ceil(damage * 1.35);
    notes.push("charge");
  }
  if (enemyHas(actor, "sniper")) {
    damage += 2;
    notes.push("sniper");
  }
  if (enemyHas(actor, "acid")) {
    damage += 2;
    notes.push("acid");
  }
  if (enemyHas(actor, "flame")) {
    damage += 1;
    notes.push("flame");
  }
  if (selfDestruct) {
    damage = Math.ceil(actor.attack * 1.85);
    notes.push("self destruct");
  }
  // 카드 경제 교란(ATB gaugeDelay 대체): 구속/빙결/감전은 다음 턴 에너지를 깎고, 속박/연막은 드로우를 줄인다.
  const energyDrain = (enemyHas(actor, "grab") ? 1 : 0) + (enemyHas(actor, "cold") ? 1 : 0) + (enemyHas(actor, "shock") ? 1 : 0);
  const drawReduce = (enemyHas(actor, "bind") ? 1 : 0) + (enemyHas(actor, "smoke") ? 1 : 0);
  // 독성: 행동 시 파티 전체에 고정 칩 피해(방어/회피 무시 DoT).
  const aoeChip = enemyHas(actor, "poison") ? 2 + Math.floor(battleTurn / 4) : 0;
  return {
    damage,
    notes,
    targetAll: enemyHas(actor, "rockfall") || (enemyHas(actor, "flame") && battleTurn % 4 === 0) || selfDestruct,
    energyDrain,
    drawReduce,
    aoeChip,
    selfDestruct,
    healsAllies: enemyHas(actor, "healer") || (enemyHas(actor, "summoner") && battleTurn % 4 === 0),
  };
}

// 아츠 부착 상태별 받피증(엔드필드 내재 효과). 장비 세트는 getSetDamageBonus에서 별도 처리.
// 아츠 이상 취약 — 이상 레벨(소모 스택 1~4)별 수치(위키 12/16/20/24%를 카드게임 밸런스로 보정해 상향).
const ANOMALY_VULN = [0, 0.2, 0.28, 0.36, 0.44];
// 위키 §3.2.3 기준 물리/아츠 분리:
//  · 감전 = 아츠 취약(받는 아츠 피해↑, 이상 레벨 비례) → 아츠 공격에만 적용
//  · 부식 = 모든 속성 저항 감소(이상 레벨 비례) → 물리·아츠 둘 다 적용(아츠 이상이지만 명시적 예외)
//  · 물리 증폭은 별도 계통(불균형 받피증·관통·쇄빙)에서 처리
function getStatusBonus(actor: PartyMember, target: BattleEnemy) {
  let bonus = 1;
  const arts = actor.element !== "physical";
  if (arts) bonus += target.artsVuln ?? 0;   // 감전 = 아츠 취약(아츠 전용, 레벨 비례)
  if (!arts) bonus += target.physVuln ?? 0;  // 물리 취약(여풍 신체 정화 등, 물리 전용)
  bonus += target.corrodeVuln ?? 0;          // 부식 = 모든 속성 저항 감소(물리·아츠 공통, 레벨 비례)
  if (!arts && target.statuses.includes("crystal")) bonus += 0.2; // 관리자 현실 정지: 오리지늄 결정 적이 받는 물리 피해 +20%
  return bonus;
}

// 장비 세트(데이터 기반) — 조건부 받피증 / 카드 종류 / 원소 피해 배수.
function getSetDamageBonus(actor: PartyMember, target: BattleEnemy, kind: SkillKind) {
  let mult = 1;
  const broken = target.statuses.includes("defense-break");
  const vulnerable = target.physBreakStacks > 0;
  const hasArts = target.statuses.some((s) => ARTS_INFLICTIONS.includes(s));
  for (const set of activeSets(actor)) {
    for (const e of getSetEffects(set)) {
      if (e.type === "dmgVs") {
        if ((e.cond === "broken" && broken) || (e.cond === "vulnerable" && vulnerable) || (e.cond === "arts" && hasArts)) mult += e.pct;
      } else if (e.type === "kindDmg" && (e.kind === "all" || e.kind === kind)) mult += e.pct;
      else if (e.type === "elementDmg" && (e.element === "all" || e.element === actor.element)) mult += e.pct;
    }
  }
  return mult;
}
// 세트 치명타 보너스(시전 오퍼 장비)
function getSetCrit(actor: PartyMember): { rate: number; dmg: number } {
  let rate = 0;
  let dmg = 0;
  for (const set of activeSets(actor)) for (const e of getSetEffects(set)) {
    if (e.type === "critRate") rate += e.v;
    if (e.type === "critDmg") dmg += e.v;
  }
  return { rate, dmg };
}
// 세트 불균형 누적 배수
function getSetStagger(actor: PartyMember): number {
  let pct = 0;
  for (const set of activeSets(actor)) for (const e of getSetEffects(set)) if (e.type === "stagger") pct += e.pct;
  return 1 + pct;
}
function hasBreakEnergySet(actor: PartyMember): boolean {
  return activeSets(actor).some((set) => getSetEffects(set).some((e) => e.type === "breakEnergy"));
}

// ===== 오퍼별 고유 패시브 (재능 2종 합성 스펙) =====
// 각 오퍼는 operator-passives.ts의 PassiveSpec(자기 두 재능 반영)으로 정의된다.
const ARTS_STATUSES: EnemyStatus[] = ["combustion", "shock", "freeze", "corrosion", "armor-break"];

function getPassiveDamageBonus(actor: PartyMember, target: BattleEnemy, kind: SkillKind, elite = 0) {
  const s = passiveSpec(actor.id);
  let bonus = 1;
  const e = 1 + 0.3 * elite; // 정예화: 재능 효과를 단계마다 +30% 강화
  const broken = target.statuses.includes("defense-break");
  const afflicted = broken || target.statuses.some((st) => ARTS_STATUSES.includes(st));
  const vulnerable = (target.physVuln ?? 0) > 0; // 물리 취약 디버프(미브 냉정 등)
  const stacks = Math.min(5, actor.passiveStacks);
  if (s.vsBroken && broken) bonus += s.vsBroken * e;              // 불균형 적 특화
  if (s.vsStatus && afflicted) bonus += s.vsStatus * e;          // 아츠/이상 적 특화
  if (s.vsVulnerable && vulnerable) bonus += s.vsVulnerable * e; // 물리 취약 적 특화
  if (s.selfPower) bonus += s.selfPower * e;                     // 상시 자기 화력(고정)
  if (s.statPower) bonus += s.statPower * e * (1 + getGearTalentPower(actor.gear) * TALENT_GEAR_SCALE); // 스탯(지능·의지) 파생 — 장비 등급 비례
  if (s.linkStatDamage && kind === "link-skill") bonus += s.linkStatDamage * e * (1 + getGearTalentPower(actor.gear) * TALENT_GEAR_SCALE); // 낚시의 달인: 연계 피해 +(지능=장비 등급 비례, 린수 강화 평균)
  if (s.stackPerHit && kind !== "attack") bonus += stacks * s.stackPerHit * e; // 누적 강타
  if (s.essenceStack) bonus += stacks * s.essenceStack * e;      // 분쇄 누적
  // 딜 재능은 고정 % — 데미지 성장은 기초 스탯(스킬위력×장비배율)이 담당(중복 방지).
  return bonus;
}

// 비피해 시전 효과(비기본 스킬): 재능 회복/보호막.
// 회복·보호막은 공격력과 무관한 고정값이라 장비 등급에 직접 비례시킨다(원작 지능/의지 스케일 게임화).
const TALENT_GEAR_SCALE = 0.06; // 회복·보호막: 장비 등급 1당 +6%
function passivePlayEffect(actor: PartyMember, kind: SkillKind): { heal: number; shield: number } {
  if (kind === "attack") return { heal: 0, shield: 0 };
  const s = passiveSpec(actor.id);
  const mult = 1 + getGearTalentPower(actor.gear) * TALENT_GEAR_SCALE; // 장비 0칸=1×, 풀장비 최대 ~1.9×
  return {
    heal: Math.round((s.healOnCast ?? 0) * mult),
    shield: Math.round((s.shieldOnCast ?? 0) * mult),
  };
}

function hasArtsAttachment(enemy: BattleEnemy) {
  return enemy.statuses.some((status) => ARTS_ATTACHMENT_STATUSES.includes(status));
}

function applySkillMechanic(actor: PartyMember, target: BattleEnemy, baseDamage: number, kind: SkillKind, elite = 0) {
  let damage = baseDamage;
  let statuses = target.statuses;
  const notes: string[] = [];
  // (장비 세트 피해 배수는 getSetDamageBonus에서 일괄 처리)
  // 콤보형(combo-strike): 비기본 스킬 추가 피해. 정예화 시 강화(+5%/단계).
  if (actor.skillMechanic === "combo-strike" && kind !== "attack") {
    damage += Math.ceil(baseDamage * (0.18 + 0.05 * elite));
    notes.push("연계 강타");
  }

  // 아츠 부착/폭발/이상(위키 §3.2)은 적별 부착 스택(enemy.attach) 추적이 필요해 메인 피해 루프에서 처리한다.
  return { damage, statuses, notes };
}

// 장비 등급 = 오퍼 성장. 장착 장비 등급합(0~15)이 기초 체력·공격력·스킬위력을 균일 배율한다.
// 직군 계수 없음 — 차등은 오퍼마다 다른 '기초 스탯'에서 나온다(디펜더 기초 HP↑, 스트라이커 기초 공격↑).
// 공격력·스킬위력은 같은 배율 → 배틀/연계/궁극 데미지가 공격력에 비례.
const GEAR_STAT_K = 0.05; // 등급 1당 +5% (풀장비 등급합 15 → 1.75×)

export function applyGearStats(member: PartyMember): PartyMember {
  const base = getBaseOperator(member.id);
  // 등급 합산 → 기본 배율. 속성 % 보너스(특화)는 배율에 가산. 부가(치명·방어)는 가산.
  const gradeMult = 1 + getGearTalentPower(member.gear) * GEAR_STAT_K;
  const t = getGearStatTotals(member.gear, member.element);
  const atkMult = gradeMult + t.atkMult; // 등급 + 공격 특화 속성
  const hpMult = gradeMult + t.hpMult;   // 등급 + 체력 특화 속성
  return {
    ...member,
    maxHp: Math.round(base.maxHp * hpMult),
    attack: Math.round(base.attack * atkMult),
    battleSkillPower: Math.round(base.battleSkillPower * atkMult), // 스킬 데미지 = 공격력에 비례
    linkSkillPower: Math.round(base.linkSkillPower * atkMult),
    ultimatePower: Math.round(base.ultimatePower * atkMult),
    defense: Math.round(base.defense * hpMult) + t.defense,
    evasion: base.evasion + t.evasion,
    critRate: Math.min(1, base.critRate + t.critRate),
    critDamage: base.critDamage + t.critDamage,
  };
}

export function equipGearToMember(member: PartyMember, gear: RunGear): PartyMember {
  const slot = getGearSlot(gear);
  const equipped = applyGearStats({ ...member, gear: { ...member.gear, [slot]: gear } });
  return { ...equipped, hp: Math.min(equipped.maxHp, member.hp + Math.max(0, equipped.maxHp - member.maxHp)) };
}

// ===== 카드 덱빌더 (makeCard/buildDeck/CARD_COST는 data/cards.ts로 분리) =====
export function shuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = (seed || 1) & 0x7fffffff;
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
export function drawHand(drawPile: Card[], discardPile: Card[], hand: Card[], n: number, seed: number) {
  let dp = drawPile.slice();
  let disc = discardPile.slice();
  const h = hand.slice();
  for (let i = 0; i < n; i += 1) {
    if (dp.length === 0) { dp = shuffle(disc, seed + i + 1); disc = []; }
    if (dp.length === 0) break;
    h.push(dp.shift() as Card);
  }
  return { hand: h, drawPile: dp, discardPile: disc };
}
export function makeIntent(enemy: BattleEnemy, turn: number): BattleEnemy["telegraph"] {
  if (enemy.statuses.includes("defense-break")) return { kind: "stunned", damage: 0, label: "불균형 · 행동 불가" };
  const a = buildEnemyAction(enemy, turn);
  const tags: string[] = [];
  if (a.energyDrain) tags.push(`⚡-${a.energyDrain}`);
  if (a.drawReduce) tags.push(`패-${a.drawReduce}`);
  if (a.aoeChip) tags.push(`독 ${a.aoeChip}`);
  if (enemyHas(enemy, "reflect")) tags.push("반사");
  const suffix = tags.length ? ` · ${tags.join(" ")}` : "";
  if (a.healsAllies) return { kind: "buff", damage: a.damage, label: `회복/공격 ${a.damage}${suffix}` };
  if (a.targetAll) return { kind: "attack-all", damage: a.damage, label: `전체 ${a.damage}${suffix}` };
  return { kind: "attack", damage: a.damage, label: `${a.damage}${suffix}` };
}
function finishBattle(current: RunState, battle: BattleState): RunState {
  // 보스 도전 모드: 일반 보상 대신 처치 턴수 기록.
  if (current.challengeBossId) {
    const turns = battle.turn;
    const newRecord = recordScore(current.challengeBossId, turns);
    const best = loadBestScores()[current.challengeBossId];
    return { ...current, battle, screen: "summary", result: "victory", challengeTurns: turns, challengeBest: best, challengeNewRecord: newRecord };
  }
  const node = getMapNode(current.currentNodeId ?? "");
  const won = current.battlesWon + 1;
  const seed = won * 13 + current.visitedNodes.length + 1;
  // 적 티어 기반 드랍: 처치한 적들의 티어를 합산해 크레딧·장비등급·유물·포션 결정.
  const drop = computeBattleDrop(battle.enemies, node.floor);
  // 포션 드랍: 드랍 가치가 높을수록(고티어) 잘 나온다.
  const wantPotion = current.potions.length < MAX_POTIONS && (drop.value >= 50 ? seed % 2 === 0 : seed % 4 === 0);
  const potions = wantPotion ? [...current.potions, pickPotions(1, seed)[0]] : current.potions;
  // 정예화 보상(하이리스크 하이리턴): 정예 노드 또는 Elite/Boss 티어 적을 처치하면 카드 정예화 1회 획득.
  const promoteEarned = node.type === "elite" || node.type === "boss" || battle.enemies.some((e) => e.boss || e.tier === "Elite" || e.tier === "Boss") ? 1 : 0;
  const pendingPromotes = (current.pendingPromotes ?? 0) + promoteEarned;
  if (node.type === "boss") return { ...current, battle, battlesWon: won, credits: current.credits + drop.credits, potions, pendingPromotes, screen: "summary", result: "victory" };
  // 유물 드랍: Elite/Boss 티어 적이 있으면.
  const grantedRelic = drop.wantRelic ? pickRelics(current.relics, 1, seed)[0] : undefined;
  const relics = grantedRelic ? [...current.relics, grantedRelic] : current.relics;
  // 필드보스(정예) 복제 보상: 기본 카드(기본공격·방어, 오퍼 기본공격) 제외한 습득 카드 중 랜덤 3장 제시.
  const dupPool = current.deck.filter((d) => !d.copyLocked && d.src !== "basic" && d.kind !== "attack").map((d) => d.uid);
  const pendingDuplicate = node.type === "elite" && dupPool.length > 0 ? shuffle(dupPool, seed * 7 + 3).slice(0, 3) : undefined;
  return {
    ...current,
    battle,
    battlesWon: won,
    credits: current.credits + drop.credits,
    potions,
    relics,
    pendingRelic: grantedRelic,
    pendingPromotes,
    pendingDuplicate,
    screen: "reward",
    pendingGearSlugs: chooseGearRewards(won, drop.gearCount, drop.gearTier),
    pendingCardOffers: cardRewardPool(current.party, current.factionIndex, seed, node.type === "elite"),
  };
}
// 전술 카드(중립): 오퍼 스탯/세트/치명 없이 고정 효과. 에너지/드로우/보호막/회복/피해.
function playTacticalCard(current: RunState, card: Card, targetEnemyId?: string): RunState {
  const battle = current.battle!;
  const baseBattle: BattleState = { ...battle, hand: battle.hand.filter((c) => c.uid !== card.uid), discardPile: [...battle.discardPile, card], energy: battle.energy - card.cost };
  const log = (msg: string) => [`전술: ${card.name} — ${msg}`, ...battle.log].slice(0, 8);

  if (card.effect === "energy") return advanceTempo({ ...current, battle: { ...baseBattle, energy: baseBattle.energy + card.power, log: log(`에너지 +${card.power}`) } }, 1);
  if (card.effect === "draw") {
    const drawn = drawHand(baseBattle.drawPile, baseBattle.discardPile, baseBattle.hand, card.power, battle.turn * 7 + baseBattle.hand.length + 1);
    return advanceTempo({ ...current, battle: { ...baseBattle, hand: drawn.hand, drawPile: drawn.drawPile, discardPile: drawn.discardPile, log: log(`카드 ${card.power}장`) } }, 1);
  }
  if (card.effect === "delay") {
    // 대응: 모든 적 행동 게이지 리셋 → 카드 템포 +1 후에도 1만 차서 다음 행동 지연.
    const enemies = baseBattle.enemies.map((e) => (e.hp > 0 ? { ...e, actionGauge: 0 } : e));
    return advanceTempo({ ...current, battle: { ...baseBattle, enemies, log: log("모든 적 행동 지연") } }, 1);
  }
  if (card.effect === "shield") {
    const party = current.party.map((m) => (m.hp > 0 ? { ...m, shield: m.shield + card.power } : m));
    return advanceTempo({ ...current, party, battle: { ...baseBattle, log: log(`보호막 +${card.power}`) } }, 1);
  }
  if (card.effect === "heal") return advanceTempo({ ...current, party: healParty(current.party, card.power), battle: { ...baseBattle, log: log(`회복 +${card.power}`) } }, 1);

  const target = targetEnemyId ? battle.enemies.find((e) => e.id === targetEnemyId && e.hp > 0) : battle.enemies.find((e) => e.hp > 0);
  if (!target) return current;
  const aoe = card.target === "all-enemies";
  const ids = new Set(aoe ? battle.enemies.filter((e) => e.hp > 0).map((e) => e.id) : [target.id]);
  const noteSet = new Set<string>();
  let totalDamage = 0;
  let brokeAny = false;
  const damaged = battle.enemies.map((enemy) => {
    if (!ids.has(enemy.id) || enemy.hp <= 0) return enemy;
    const raw = Math.ceil(card.power * (1 + (battle.dmgBuffPct ?? 0)) * defenseFactor(enemy.defense) * (enemy.statuses.includes("defense-break") ? IMBALANCE_DAMAGE_TAKEN : 1));
    const ed = getEnemyDamageTaken(enemy, raw, "battle-skill");
    ed.notes.forEach((n) => noteSet.add(n));
    totalDamage += ed.damage;
    const hp = Math.max(0, enemy.hp - ed.damage);
    const alreadyBroken = enemy.statuses.includes("defense-break");
    const nextStagger = Math.min(enemy.staggerHp, enemy.stagger + (alreadyBroken ? 0 : card.stagger));
    let statuses = enemy.statuses;
    let breakTurns = enemy.breakTurns;
    let staggerFinal = nextStagger;
    if (!alreadyBroken && enemy.staggerHp > 0 && nextStagger >= enemy.staggerHp && hp > 0) { statuses = addStatus(statuses, "defense-break"); breakTurns = BREAK_TURNS; staggerFinal = enemy.staggerHp; brokeAny = true; noteSet.add("불균형!"); }
    return { ...enemy, hp, statuses, stagger: staggerFinal, breakTurns };
  });
  const revival = reviveEnemies(damaged);
  revival.notes.forEach((n) => noteSet.add(n));
  const after = revival.enemies;
  const note = noteSet.size ? ` (${[...noteSet].join(", ")})` : "";
  const nextBattle: BattleState = { ...baseBattle, enemies: after, energy: baseBattle.energy + (brokeAny ? 1 : 0), log: [`전술: ${card.name} → ${aoe ? "모든 적" : target.name} ${totalDamage} 피해${note}`, ...battle.log].slice(0, 8) };
  if (after.every((e) => e.hp <= 0)) return finishBattle(current, nextBattle);
  return advanceTempo({ ...current, battle: nextBattle }, 1);
}

export function playCardOnState(current: RunState, uid: string, targetEnemyId?: string, injected?: Card): RunState {
  const battle = current.battle;
  if (!battle || current.screen !== "battle") return current;
  const origCard = injected ?? battle.hand.find((c) => c.uid === uid);
  if (!origCard) return current;
  if (!injected && battle.energy < origCard.cost) return current; // 주입 궁극은 에너지 무관(게이지로 발동)
  if (origCard.tactical) return playTacticalCard(current, origCard, targetEnemyId);
  const fx = getRelicEffects(current.relics);
  const actor = current.party.find((m) => m.id === origCard.operatorId && m.hp > 0);
  if (!actor) return current;
  // 변신(레바테인·장방이): 변신 중에는 평소 일반공격·배틀스킬도 강화 광역(범위 피해)으로 변환.
  // 코스트·소멸은 원본 유지, 버린덱엔 원본이 돌아가 변신 종료 후 단일 타겟으로 정상 복귀.
  const card: Card = (!injected && actor.transformed && isTransformOperator(actor.id)
    && (origCard.kind === "attack" || origCard.kind === "battle-skill") && !origCard.effect && origCard.target !== "all-enemies")
    ? { ...makeTransformedCard(actor, origCard.kind, origCard.uid, origCard.eliteLevel ?? 0), cost: origCard.cost, exhaust: origCard.exhaust, energyRefund: origCard.energyRefund }
    : origCard;
  // 주입 궁극: 손패/에너지/버린덱 변화 없음. 일반 카드: 손패 제거·에너지 차감·버린덱(소멸 카드는 제외=제거, 변신 변환 시 원본 복귀).
  const baseBattle: BattleState = injected
    ? battle
    : { ...battle, hand: battle.hand.filter((c) => c.uid !== uid), discardPile: origCard.exhaust ? battle.discardPile : [...battle.discardPile, origCard], energy: battle.energy - origCard.cost + (origCard.energyRefund ?? 0) };

  if (card.effect === "shield") {
    const amt = card.power || (card.kind === "ultimate" ? 18 : 12);
    const party = current.party.map((m) => (m.hp > 0 ? { ...m, shield: m.shield + amt } : m));
    return advanceTempo({ ...current, party, battle: { ...baseBattle, log: [`${actor.name}: ${card.name} — 보호막 +${amt}`, ...battle.log].slice(0, 8) } }, 1);
  }
  if (card.effect === "heal") {
    const amt = card.power || (card.kind === "ultimate" ? 26 : 14);
    return advanceTempo({ ...current, party: healParty(current.party, amt), battle: { ...baseBattle, log: [`${actor.name}: ${card.name} — 회복 +${amt}`, ...battle.log].slice(0, 8) } }, 1);
  }
  if (card.effect === "energy") {
    return advanceTempo({ ...current, battle: { ...baseBattle, energy: baseBattle.energy + card.power, log: [`${actor.name}: ${card.name} — 에너지 +${card.power}`, ...battle.log].slice(0, 8) } }, 1);
  }
  if (card.effect === "draw") {
    const drawn = drawHand(baseBattle.drawPile, baseBattle.discardPile, baseBattle.hand, card.power, battle.turn * 7 + baseBattle.hand.length + 1);
    return advanceTempo({ ...current, battle: { ...baseBattle, hand: drawn.hand, drawPile: drawn.drawPile, discardPile: drawn.discardPile, log: [`${actor.name}: ${card.name} — 카드 ${card.power}장`, ...battle.log].slice(0, 8) } }, 1);
  }
  if (card.effect === "buff") {
    const pct = card.power / 100;
    return advanceTempo({ ...current, battle: { ...baseBattle, dmgBuffPct: (battle.dmgBuffPct ?? 0) + pct, log: [`${actor.name}: ${card.name} — 카드 피해 +${card.power}%`, ...battle.log].slice(0, 8) } }, 1);
  }
  // (effect === "setup"은 별도 분기 없이 아래 피해 경로로 → 원소 아츠 부착 + 소량 피해)

  const target = targetEnemyId ? battle.enemies.find((e) => e.id === targetEnemyId && e.hp > 0) : battle.enemies.find((e) => e.hp > 0);
  if (!target) return current;
  const aoe = card.target === "all-enemies";
  const targetIds = new Set(aoe ? battle.enemies.filter((e) => e.hp > 0).map((e) => e.id) : [target.id]);
  const kind = card.kind;
  // 아츠 소모 보너스(배틀스킬 한정): 타깃이 아츠 부착/이상 상태일 때, 그 상태를 소모하며 추가 궁극 충전.
  const targetHadArts = kind === "battle-skill" && battle.enemies.some((e) => targetIds.has(e.id) && e.statuses.some((s) => ARTS_INFLICTIONS.includes(s)));
  // 정예화 단계(0/1/2): 단순 딜이 아니라 오퍼 컨셉 강화에 쓰인다(강타·빌더·갑옷파괴·치명·아츠).
  const elite = card.eliteLevel ?? 0;
  const aspec = passiveSpec(actor.id);
  // 재능 crit(자기 치명) · team-amp(파티 오라, 생존 보유자 spec 합산) — 오퍼별 스펙
  const critSurge = aspec.crit ?? 0;
  const eliteCrit = (aspec.crit ?? 0) > 0 ? elite * 0.06 : 0; // 치명형은 정예화마다 +6%
  const teamAmp = current.party.reduce((sum, m) => {
    if (m.hp <= 0) return sum;
    const sp = passiveSpec(m.id);
    return sum + (sp.teamAmp ?? 0) + (sp.teamStatAmp ?? 0) * (1 + getGearTalentPower(m.gear) * TALENT_GEAR_SCALE); // 스탯 파생 오라는 보유자 장비 등급 비례
  }, 0);
  // 유물 효과 + 소비 아이템 전투 버프 + 재능 + 장비 세트 합산
  const setCrit = getSetCrit(actor);
  const setStagger = getSetStagger(actor);
  const isCrit = rollCrit(actor, `${battle.turn}:${card.uid}`, fx.critBonus + (battle.critBuff ?? 0) + critSurge + eliteCrit + setCrit.rate);
  const dmgMult = 1 + fx.damageMult + (battle.dmgBuffPct ?? 0) + teamAmp + (aoe ? fx.aoeDamage : 0);
  // 연타(連打): 보유 스택만큼 배틀 스킬 +30~75% / 궁극 +20~50% (소모형)
  const multiHitStacks = Math.min(4, battle.multiHit ?? 0);
  const multiHitBonus = multiHitStacks > 0
    ? (kind === "battle-skill" ? 0.15 * multiHitStacks + 0.15 : kind === "ultimate" ? 0.1 * multiHitStacks + 0.1 : 0)
    : 0;
  const noteSet = new Set<string>();
  if (multiHitBonus > 0) noteSet.add(`연타 +${Math.round(multiHitBonus * 100)}%`);
  let totalDamage = 0;
  let reflectDmg = 0;
  let brokeAny = false;      // 불균형 돌파(스태거 게이지 만충 → 행동불가·받피증 30%·처형) — 별개 시스템
  let crushedAny = false;
  let physAnomalyFired = false; // 물리 이상(띄우기·넘어뜨리기·강타·갑옷 파괴) 효과가 실제 발동했는지 — 불균형과 무관
  let freezeApplied = false;    // 이 플레이로 동결(냉기 부착)을 새로 부여했는지 (알레쉬 궁극 충전용)
  let crystalConsumed = false;  // 관리자 오리지늄 결정을 이 플레이로 파괴했는지 (본질 붕괴·길잡이 트리거)
  let shatteredAny = false;     // 이 플레이로 쇄빙이 발동했는지 (에스텔라 공감 — 게이지 반환 트리거)
  let gaugeRefund = 0;          // 갑옷 파괴로 방불 소모 시 게이지(에너지) 수급 (포그라니치니크 전선 분쇄)
  const damaged = battle.enemies.map((enemy) => {
    if (!targetIds.has(enemy.id) || enemy.hp <= 0) return enemy;
    const mech = kind === "attack"
      ? { damage: card.power, statuses: enemy.statuses, notes: [] as string[] }
      : applySkillMechanic(actor, enemy, card.power, kind, elite);
    // 상태이상 받피증 + 장비 세트·속성 보정(모든 카드) → 재능 보정
    mech.damage = Math.ceil(mech.damage * getStatusBonus(actor, enemy));
    mech.damage = Math.ceil(mech.damage * getSetDamageBonus(actor, enemy, kind));
    mech.damage = Math.ceil(mech.damage * getGearDamageMult(actor.gear, actor.element, kind, enemy.statuses.includes("defense-break")));
    mech.damage = Math.ceil(mech.damage * getPassiveDamageBonus(actor, enemy, kind, elite));
    const armorBroken = enemy.statuses.includes("armor-break") && actor.element === "physical"; // 관통(Breach) 받피증
    const linkCombo = kind === "link-skill" && enemy.statuses.includes("defense-break");
    const shatter = actor.element === "physical" && enemy.statuses.includes("freeze"); // 쇄빙(Shatter)
    const weak = getEnemyWeakness(enemy.faction) === actor.element; // 세력 원소 약점
    const afflictedT = enemy.statuses.includes("defense-break") || enemy.statuses.some((st) => ARTS_STATUSES.includes(st));
    const vulnMark = enemy.vulnMark ?? 0; // 표식 디버프(targetVuln): 이 적이 받는 모든 피해 +
    const critDmg = isCrit ? 1 + actor.critDamage + setCrit.dmg + (afflictedT ? (aspec.critVsStatus ?? 0) : 0) : 1;
    mech.damage = Math.ceil(mech.damage * dmgMult * (1 + multiHitBonus) * (1 + vulnMark) * defenseFactor(enemy.defense) * (enemy.statuses.includes("defense-break") ? IMBALANCE_DAMAGE_TAKEN * (1 + fx.vsBrokenDamage) : 1) * (linkCombo ? LINK_COMBO_AMP : 1) * (armorBroken ? ARMOR_BREAK_AMP : 1) * (shatter ? SHATTER_AMP : 1) * (weak ? WEAKNESS_AMP : 1) * critDmg);
    if (isCrit) noteSet.add("치명타");
    if (weak) noteSet.add("약점!");
    if (linkCombo) noteSet.add("연계 강타");
    if (armorBroken) noteSet.add("관통");
    if (shatter) noteSet.add("쇄빙!");
    const ed = getEnemyDamageTaken(enemy, mech.damage, kind);
    mech.notes.forEach((n) => noteSet.add(n));
    ed.notes.forEach((n) => noteSet.add(n));
    totalDamage += ed.damage;
    // 반사(가시): 불균형이 아닌 반사형 적을 때리면 가한 피해의 20%를 시전 오퍼가 되받는다.
    if (enemyHas(enemy, "reflect") && !enemy.statuses.includes("defense-break")) reflectDmg += Math.ceil(ed.damage * 0.2);
    let hp = Math.max(0, enemy.hp - ed.damage);
    const alreadyBroken = enemy.statuses.includes("defense-break");
    const interrupting = shouldInterruptEnemy(enemy, kind);
    const staggerAdd = alreadyBroken ? 0 : Math.round(card.stagger * setStagger) + (interrupting ? STAGGER_INTERRUPT_BONUS + (enemyHas(enemy, "charge") ? (aspec.chargeBreakStagger ?? 0) : 0) : 0);
    const nextStagger = Math.min(enemy.staggerHp, enemy.stagger + staggerAdd);
    let statuses = mech.statuses;
    if (shatter) { statuses = withoutStatus(statuses, "freeze"); shatteredAny = true; } // 쇄빙: 동결 해제 + 공감 트리거
    let breakTurns = enemy.breakTurns;
    let staggerFinal = nextStagger;
    const forcedBreak = statuses.includes("defense-break") && !alreadyBroken;
    const gaugeBreak = !alreadyBroken && enemy.staggerHp > 0 && nextStagger >= enemy.staggerHp;
    if ((gaugeBreak || forcedBreak) && hp > 0) { statuses = addStatus(statuses, "defense-break"); breakTurns = BREAK_TURNS; staggerFinal = enemy.staggerHp; brokeAny = true; noteSet.add("불균형!"); }
    // ── 물리 이상(엔드필드 정의: 띄우기·넘어뜨리기·강타·갑옷 파괴) ──
    // 모두 '방어 불능' 스택(최대 4) 기반이며 불균형(스태거)과 별개. 방어 불능이 없는 적엔 효과가 발동되지 않고 1스택만 부여,
    // 방어 불능 스택이 있어야 실제 효과가 발동(강타·갑옷 파괴는 전 스택 소모). physBreakStacks = 방어 불능 스택.
    let physBreakStacks = enemy.physBreakStacks;
    let armorBreakTurns = enemy.armorBreakTurns;
    let physVuln = enemy.physVuln;
    let bleed = enemy.bleed;
    let ccDelay = false;
    // 로시 절흔: 배틀 스킬이 '이미 방어 불능' 적을 치면 울프팀의 진주 발동 → 출혈(매 턴 공격력 30%) 부여.
    if (hp > 0 && (aspec.bleed ?? 0) > 0 && kind === "battle-skill" && enemy.physBreakStacks > 0) {
      bleed = Math.max(bleed ?? 0, Math.round(actor.attack * aspec.bleed!));
      noteSet.add(`출혈 ${bleed}/턴`);
    }
    if (hp > 0 && actor.element === "physical" && kind !== "attack") {
      const anomaly = card.anomalyOverride ?? actor.physAnomaly ?? (actor.physBreak === "consume" ? "crush" : actor.physBreak === "build" ? "launch" : undefined);
      if (anomaly === "launch" || anomaly === "knockdown") {
        // 띄우기/넘어뜨리기: 방어 불능 1스택 부여(빌더 정예화 2차 +1). 이미 방어 불능이면 추가 물리 + 불균형 10 + CC.
        const add = PHYS_BREAK_BUILD[kind] + (elite >= 2 ? 1 : 0);
        if (add > 0) {
          const wasVuln = physBreakStacks > 0;
          // 여풍 신체 정화: 방어 불능이 없던 적에게만 물리 취약 부여(팀 전체 물리 딜↑).
          if ((aspec.appliesPhysVuln ?? 0) > 0 && !wasVuln && kind === "battle-skill") {
            physVuln = Math.max(physVuln ?? 0, aspec.appliesPhysVuln!);
            noteSet.add(`물리 취약 +${Math.round(aspec.appliesPhysVuln! * 100)}%`);
          }
          physBreakStacks = Math.min(MAX_PHYS_BREAK_STACKS, physBreakStacks + add);
          noteSet.add(`방어 불능 ${physBreakStacks}${elite >= 2 ? "↑" : ""}`);
          if (wasVuln) { // 방어 불능 적 → 물리 이상 발동
            let bonus = Math.ceil(card.power * 0.2);
            if ((aspec.knockdownBonus ?? 0) > 0 && anomaly === "knockdown") bonus += Math.ceil(actor.attack * aspec.knockdownBonus!); // 여풍 복마: 넘어뜨리기마다 공격력 비례 추가 물리
            hp = Math.max(0, hp - bonus);
            totalDamage += bonus;
            staggerFinal = Math.min(enemy.staggerHp, staggerFinal + 10);
            ccDelay = true;
            physAnomalyFired = true;
            noteSet.add(`${anomaly === "launch" ? "띄우기" : "넘어뜨리기"} ${bonus}`);
          }
        }
      } else if (anomaly === "crush") {
        if (physBreakStacks > 0) { // 강타: 방어 불능 전 스택 소모 → 스택수 비례 대량 물리(정예화 계수↑)
          const crush = Math.ceil(card.power * (0.5 + 0.1 * elite) * physBreakStacks);
          hp = Math.max(0, hp - crush);
          totalDamage += crush;
          physBreakStacks = 0;
          crushedAny = true; // 본질 붕괴 트리거
          physAnomalyFired = true;
          noteSet.add(`강타 ${crush}${elite ? "↑" : ""}`);
        } else { physBreakStacks = 1; noteSet.add("방어 불능 1"); } // 방어 불능 없으면 미발동·1스택만
      } else if (anomaly === "armor-break") {
        if (physBreakStacks > 0) { // 갑옷 파괴: 방어 불능 전 스택 소모 → 물리 + 관통(받는 물리 피해 증가)
          const ab = Math.ceil(card.power * (0.25 + 0.05 * elite) * physBreakStacks);
          hp = Math.max(0, hp - ab);
          totalDamage += ab;
          armorBreakTurns = 2 + physBreakStacks + elite; // 정예화: 관통 지속 +1턴/단계
          statuses = addStatus(statuses, "armor-break");
          // 포그라니치니크 전선 분쇄: 소모한 방불 스택에 비례해 게이지 수급(뛰어난 배틀 스킬 게이지 수급).
          if ((aspec.gaugeOnArmorBreak ?? 0) > 0) gaugeRefund = Math.max(gaugeRefund, Math.round(physBreakStacks * aspec.gaugeOnArmorBreak!));
          physBreakStacks = 0;
          crushedAny = true;
          physAnomalyFired = true;
          noteSet.add(`갑옷 파괴 ${ab} · 관통`);
        } else { physBreakStacks = 1; noteSet.add("방어 불능 1"); }
      }
    }
    // 에스텔라 「디스토션」: 연계 스킬로 물리 취약 부여(원소 무관 — 냉기 하이브리드).
    if (hp > 0 && kind === "link-skill" && (aspec.linkPhysVuln ?? 0) > 0) {
      physVuln = Math.max(physVuln ?? 0, aspec.linkPhysVuln!);
      noteSet.add(`물리 취약 +${Math.round(aspec.linkPhysVuln! * 100)}%`);
    }
    // ── 관리자 「오리지늄 결정」 ──
    // 연계 스킬 = 결정 부착(현실 정지로 받는 물리↑). 배틀/궁극 = 결정 파괴 → 추가 물리 + 본질 붕괴(공격력 누적).
    if (hp > 0 && actor.id === "endministrator") {
      if (kind === "link-skill" && !statuses.includes("crystal")) {
        statuses = addStatus(statuses, "crystal");
        noteSet.add("오리지늄 결정 부착");
      } else if ((kind === "battle-skill" || kind === "ultimate") && statuses.includes("crystal")) {
        const crystalDmg = Math.ceil(card.power * (kind === "ultimate" ? 1.2 : 0.9)); // 결정 파괴 피해(위키 추가/결정파괴 배율 보정)
        hp = Math.max(0, hp - crystalDmg);
        totalDamage += crystalDmg;
        statuses = withoutStatus(statuses, "crystal");
        crystalConsumed = true;
        noteSet.add(`결정 파괴 ${crystalDmg}`);
      }
    }
    // ── 아츠 부착 / 폭발 / 이상(위키 §3.2.1~3.2.3) ──
    // 부착 자체는 무효과. 같은 원소 2스택=아츠 폭발(미소모). 다른 원소 부착 존재 + 새 원소 = 아츠 이상
    // (전부 소모, 타입=새 원소, 이상 레벨=소모한 총 스택 1~4 → 피해·효과 스케일). 이상 상태는 그때만 statuses에 부여.
    let attach: Partial<Record<Element, number>> = { ...(enemy.attach ?? {}) };
    let artsVuln = enemy.artsVuln;
    let corrodeVuln = enemy.corrodeVuln;
    if (hp > 0 && actor.element !== "physical" && kind !== "attack") {
      const el = actor.element;
      const others = (Object.keys(attach) as Element[]).filter((k) => k !== el && (attach[k] ?? 0) > 0);
      if (aspec.forceFreezeOnCryo && el === "cryo" && kind === "battle-skill" && (attach.cryo ?? 0) > 0) {
        // 알레쉬 비정규 루어: 냉기 부착 적을 강제 동결(냉기 소모 → 동결 + 냉기 피해). 냉기 단일 조합으로도 동결 발동.
        const level = Math.min(4, attach.cryo ?? 0);
        const dmg = Math.ceil(card.power * (0.5 + 0.25 * level));
        hp = Math.max(0, hp - dmg);
        totalDamage += dmg;
        statuses = addStatus(statuses, "freeze");
        attach = {};
        noteSet.add(`강제 동결 Lv${level} ${dmg}`);
      } else if (others.length > 0) {
        // 아츠 이상 발동
        const level = Math.min(4, (Object.values(attach) as number[]).reduce((s, n) => s + (n ?? 0), 0));
        const anomaly = ELEMENT_INFLICTION[el];
        const dmg = Math.ceil(card.power * (0.55 + 0.3 * level)); // 이상 레벨 1~4 → 0.85~1.75배(셋업 보상, 위키 160~400% 보정)
        hp = Math.max(0, hp - dmg);
        totalDamage += dmg;
        if (anomaly) statuses = addStatus(statuses, anomaly);
        // 이상 레벨 비례 취약(감전=아츠 취약, 부식=모든 저항 감소) — 갱신 시 더 높은 값 유지
        if (anomaly === "shock") artsVuln = Math.max(artsVuln ?? 0, ANOMALY_VULN[level]);
        if (anomaly === "corrosion") corrodeVuln = Math.max(corrodeVuln ?? 0, ANOMALY_VULN[level]);
        attach = {};
        noteSet.add(`${anomaly ? INFLICTION_LABEL[anomaly] : "아츠 이상"} Lv${level} ${dmg}`);
      } else if ((attach[el] ?? 0) > 0) {
        // 아츠 폭발: 같은 원소 2스택 이상(부착 미소모, 1스택 추가) — 모노 원소 파티의 주 보상
        const burst = Math.ceil(card.power * 0.65);
        hp = Math.max(0, hp - burst);
        totalDamage += burst;
        attach[el] = Math.min(4, (attach[el] ?? 0) + 1);
        noteSet.add(`${ELEM_LABEL[el]} 폭발 ${burst}`);
      } else {
        attach[el] = 1; // 첫 부착(효과 없음)
        noteSet.add(`${ELEM_LABEL[el]} 부착`);
      }
    }
    // 표식 디버프(targetVuln): 이 오퍼가 때린 적이 받는 모든 피해 누적 부여(팀 전체 이득)
    const nextVuln = aspec.targetVuln ? Math.max(enemy.vulnMark ?? 0, aspec.targetVuln) : enemy.vulnMark;
    if (aspec.targetVuln && nextVuln !== (enemy.vulnMark ?? 0)) noteSet.add(`표식 +${Math.round(aspec.targetVuln * 100)}%`);
    if (statuses.includes("freeze") && !enemy.statuses.includes("freeze")) freezeApplied = true; // 동결 신규 부여

    return { ...enemy, hp, statuses, stagger: staggerFinal, breakTurns, physBreakStacks, armorBreakTurns, physVuln, bleed, vulnMark: nextVuln, attach, artsVuln, corrodeVuln, actionGauge: ccDelay ? Math.max(0, enemy.actionGauge - 2) : enemy.actionGauge };
  });
  const revival = reviveEnemies(damaged);
  revival.notes.forEach((n) => noteSet.add(n));
  let after = revival.enemies;
  // 포그라니치니크 「철의 서약」 소모: 적이 물리 이상(띄우기·넘어뜨리기·강타·갑옷 파괴) 효과를 받거나 포그 연계 스킬이 명중하면
  // 서약 1포인트를 소모해 방패병 추가 소환 — 대상에 물리 추가타 + 포그 스킬 게이지 회복. 마지막 1포인트면 최후의 승부(대량딜+대량게이지).
  // ※ 불균형(스태거)은 물리 이상이 아니므로 트리거에서 제외 — 실제 인게임 정의를 따른다.
  let oathPog: PartyMember | null = null;
  const pog = current.party.find((m) => m.id === "pogranichnik" && m.hp > 0);
  if (pog && (pog.ironOath ?? 0) > 0) {
    const oathTrigger = physAnomalyFired || (actor.id === "pogranichnik" && kind === "link-skill");
    const tgt = after.find((e) => e.id === target.id && e.hp > 0) ?? after.find((e) => e.hp > 0);
    if (oathTrigger && tgt) {
      const stacks = pog.ironOath ?? 0;
      const last = stacks <= 1;
      const dmg = Math.max(1, Math.round(pog.attack * (last ? 3.6 : 0.85) * defenseFactor(tgt.defense) * (1 + (tgt.vulnMark ?? 0))));
      const gauge = last ? IRON_OATH_FINAL_GAUGE : IRON_OATH_GAUGE;
      after = after.map((e) => (e.id === tgt.id ? { ...e, hp: Math.max(0, e.hp - dmg) } : e));
      oathPog = { ...pog, ironOath: stacks - 1, ultimateCharge: Math.min(ultEnergyReq(pog.id), (pog.ultimateCharge ?? 0) + gauge) };
      noteSet.add(last ? `방패병 최후의 승부 ${dmg}!` : `방패병 돌격 ${dmg}`);
    }
  }
  // 처형: 불균형 돌파 시 에너지 회복. 재능 breakEnergy +1(정예화 2차 시 +2), breakEnergy 세트 +1.
  const surge = (aspec.breakEnergy ?? 0) > 0;
  const gearSurge = hasBreakEnergySet(actor);
  const breakEnergy = brokeAny ? 2 + (surge ? 1 + (elite >= 2 ? 1 : 0) : 0) + (gearSurge ? 1 : 0) : 0; // 불균형 돌파 = 주 에너지원(+2)
  // 에스텔라 공감: 쇄빙 발동 시 게이지(전투 에너지) 반환(생존 보유자 합산).
  const shatterEnergy = shatteredAny ? current.party.reduce((s, m) => (m.hp > 0 ? s + (passiveSpec(m.id).shatterEnergy ?? 0) : s), 0) : 0;
  // 아케쿠리 승리의 함성: 연계 스킬 추가 에너지(지능=장비 등급 비례)
  const linkGauge = (aspec.linkStatGauge ?? 0) > 0 && kind === "link-skill" ? Math.round(aspec.linkStatGauge! * (1 + getGearTalentPower(actor.gear) * TALENT_GEAR_SCALE)) : 0;
  const energyBonus = breakEnergy + shatterEnergy + gaugeRefund + linkGauge;
  if (reflectDmg > 0) noteSet.add(`반사 -${reflectDmg}`);
  if (brokeAny) noteSet.add(`처형 — 에너지 +${breakEnergy}`);
  const peRaw = passivePlayEffect(actor, kind); // 재능: support-heal / guardian-shield
  // 정예화 컨셉(서포터): 재능 회복·보호막 +20%/단계
  const pe = { heal: Math.round(peRaw.heal * (1 + 0.2 * elite)), shield: Math.round(peRaw.shield * (1 + 0.2 * elite)) };
  if (pe.heal > 0) noteSet.add(`재능 회복 +${pe.heal}`);
  if (pe.shield > 0) noteSet.add(`재능 보호막 +${pe.shield}`);
  // 연타: 소모 시 0, 부여 오퍼(아케쿠리 등)가 스킬 사용 시 +1 (다음 배틀/궁극에 적용)
  const grantMultiHit = (actor.grantsMultiHit || aspec.grantMultiHit) && kind !== "attack" ? 1 : 0;
  const nextMultiHit = Math.min(4, (multiHitBonus > 0 ? 0 : multiHitStacks) + grantMultiHit);
  if (grantMultiHit > 0) noteSet.add(`연타 부여 → ${nextMultiHit}`);
  // 미브 청파 삼형: 초식 카드(단운1→추형2→개천3) 사용 시 다음 초식을 손패에 추가. 또한 연계(후회없는 주먹)·궁극(절심) 사용 후엔 추형(2식)으로 교체(단운 건너뜀). 중복 방지.
  const comboForm = card.comboForm ?? 0;
  let mifuNextForm = 0;
  if (actor.id === "mifu") {
    if (comboForm >= 1 && comboForm < MIFU_FORM_COUNT) mifuNextForm = comboForm + 1;       // 단운→추형, 추형→개천
    else if (kind === "link-skill" || kind === "ultimate") mifuNextForm = 2;               // 연계·궁극 → 추형
  }
  const mifuNext = mifuNextForm > 0 && !baseBattle.hand.some((c) => c.operatorId === "mifu" && c.comboForm === mifuNextForm)
    ? makeMifuFormCard(actor, mifuNextForm, `mf${mifuNextForm}-${battle.turn}-${baseBattle.discardPile.length}`)
    : null;
  if (mifuNext) noteSet.add(`다음 초식 [${mifuNext.name.split("· ")[1] ?? mifuNext.name}]`);
  const note = noteSet.size ? ` (${[...noteSet].join(", ")})` : "";
  const logLine = `${actor.name}: ${card.name} → ${aoe ? "모든 적" : target.name} ${totalDamage} 피해${note}`;
  const nextHand = mifuNext ? [...baseBattle.hand, mifuNext] : baseBattle.hand;
  const nextBattle: BattleState = { ...baseBattle, enemies: after, hand: nextHand, energy: baseBattle.energy + energyBonus, multiHit: nextMultiHit, log: [logLine, ...battle.log].slice(0, 8) };
  // 시전 오퍼: 반사 피해 + blade-stacks 적립 / 재능 회복·보호막은 파티 전체에 적용.
  // 궁극기 게이지(위키 §2.1.4): 배틀스킬=아군 전체 / 연계스킬=시전자만.
  // 질베르타 「전달자의 노래」: 생존한 보유자가 있으면 가드/캐스터/서포터 아군의 궁극 충전량 ×(1+효율%).
  const ultEffPct = current.party.reduce((s, m) => (m.hp > 0 ? s + (passiveSpec(m.id).teamUltPct ?? 0) : s), 0);
  // 아비웬나 「고효율 배송」(명중 시 +x) / 알레쉬 「급속 냉동」(동결 부여 시 +x) — 시전 오퍼 자기 궁극 충전.
  const selfUltGain = (aspec.ultOnHit && totalDamage > 0 ? aspec.ultOnHit : 0) + (aspec.ultOnFreeze && freezeApplied ? aspec.ultOnFreeze : 0);
  // 철의 서약 소모분(포그 ironOath/게이지)을 파티 기준값에 먼저 반영.
  const oathBaseParty = oathPog ? current.party.map((m) => (m.id === oathPog!.id ? oathPog! : m)) : current.party;
  const party = oathBaseParty.map((m) => {
    if (m.hp <= 0) return m;
    let next = m;
    if (m.id === actor.id) {
      if (reflectDmg > 0) next = absorbHit(next, reflectDmg);
      if ((aspec.stackPerHit ?? 0) > 0 && kind !== "attack") next = { ...next, passiveStacks: Math.min(5, next.passiveStacks + 1) }; // 누적 강타: 스킬 명중마다
      if ((aspec.essenceStack ?? 0) > 0 && (crushedAny || crystalConsumed)) next = { ...next, passiveStacks: Math.min(5, next.passiveStacks + 1) }; // 본질 붕괴: 강타/갑옷파괴·오리지늄 결정 소모 시 공격력 누적
      if (selfUltGain > 0) next = { ...next, ultimateCharge: Math.min(ultEnergyReq(next.id), (next.ultimateCharge ?? 0) + selfUltGain) }; // 명중/동결 자기 충전(기본 공격 포함)
    }
    if (kind === "battle-skill") {
      // 배틀스킬 = 아군 전체 충전. 시전자는 오퍼별 실제 획득량(레바테인 조건부 대량 등), 그 외 아군은 팀 충전(+6.5).
      let gain = next.id === actor.id ? ultGainConditional(actor.id, kind, actor.passiveStacks) : ULT_CHARGE_BATTLE_TEAM;
      // 아츠 소모 보너스(시전 오퍼): 아츠 적 타격 시 추가 충전 — 대궁(라스트라이트·이본·장방이)의 핵심
      if (next.id === actor.id && targetHadArts) gain += ultArtsConsumeBonus(actor.id);
      // 질베르타 충전 효율: 직군(가드·캐스터·서포터)이면 획득량 ×(1+효율%)
      if (ultEffPct > 0 && ULT_BATTERY_CLASSES.includes(next.className)) gain = Math.round(gain * (1 + ultEffPct));
      next = { ...next, ultimateCharge: Math.min(ultEnergyReq(next.id), (next.ultimateCharge ?? 0) + gain) };
    } else if (kind === "link-skill" && next.id === actor.id) {
      // 연계스킬 = 시전자만 충전(+10, 아크라이트 예외 5). 팀에는 충전 없음.
      let gain = actor.id === "arclight" ? LINK_ULT_GAIN_ARCLIGHT : LINK_ULT_GAIN;
      if (ultEffPct > 0 && ULT_BATTERY_CLASSES.includes(next.className)) gain = Math.round(gain * (1 + ultEffPct));
      next = { ...next, ultimateCharge: Math.min(ultEnergyReq(next.id), (next.ultimateCharge ?? 0) + gain) };
    }
    if (pe.heal > 0) next = { ...next, hp: Math.min(next.maxHp, next.hp + pe.heal) };
    if (pe.shield > 0) next = { ...next, shield: next.shield + pe.shield };
    return next;
  });
  if (party.every((m) => m.hp <= 0)) return { ...current, party, battle: { ...nextBattle, log: ["전멸 — 반사 피해", ...nextBattle.log].slice(0, 8) }, screen: "summary", result: "defeat" };
  if (after.every((e) => e.hp <= 0)) return finishBattle({ ...current, party }, nextBattle);
  return advanceTempo({ ...current, party, battle: nextBattle }, 1);
}

// ===== 궁극기 액티브 발동(게이지 만충 시) =====
// 레바테인·장방이: 변신(강화 카드 패 추가 + 변신 상태 3턴). 그 외: 광역 궁극 피해.
export function useUltimateOnState(current: RunState, operatorId: string, targetEnemyId?: string): RunState {
  const battle = current.battle;
  if (!battle || current.screen !== "battle") return current;
  const actor = current.party.find((m) => m.id === operatorId && m.hp > 0);
  if (!actor || (actor.ultimateCharge ?? 0) < ultEnergyReq(operatorId)) return current; // 만충 아니면 무시
  const charged = current.party.map((m) => (m.id === operatorId ? { ...m, ultimateCharge: 0 } : m)); // 게이지 소모

  if (isTransformOperator(operatorId)) {
    const tParty = charged.map((m) => (m.id === operatorId ? { ...m, transformed: true, transformTurns: 3 } : m));
    const tOp = tParty.find((m) => m.id === operatorId) as PartyMember;
    const seed = battle.turn;
    // 패 추가: 강화 일반공격 + 강화 배틀스킬. 변신 동안 일반 카드처럼 순환, 변신 종료 시 제거(uid 'tf-' 식별).
    // 장방이: 강화 배틀은 0코스트(인게임 변신 배틀 무코스트). 덱의 기존 일반/배틀도 변신 3턴 동안 강화 드로우.
    const added: Card[] = [makeTransformedCard(tOp, "attack", `tf-a-${operatorId}-${seed}`)];
    added.push(operatorId === "zhuangfangyi"
      ? makeConsumableUltCard(tOp, `tf-x-${seed}`) // 장방이 변신 배틀 = 0코스트
      : makeTransformedCard(tOp, "battle-skill", `tf-b-${operatorId}-${seed}`));
    const formName = operatorId === "laevatain" ? "황혼" : "천리의 경지";
    return advanceTempo({ ...current, party: tParty, battle: { ...battle, hand: [...battle.hand, ...added], log: [`${actor.name} 궁극 — 변신! [${formName}] 강화 카드 +${added.length}`, ...battle.log].slice(0, 8) } }, 1);
  }

  const kind = ultKind(operatorId);
  if (kind === "buff") {
    // 팀 증폭 궁극(샤이히 「스택 오버플로」·안탈 「오버클록 타임」): 파티 카드 피해 버프(전투 지속).
    const pct = 0.25;
    return advanceTempo({ ...current, party: charged, battle: { ...battle, dmgBuffPct: (battle.dmgBuffPct ?? 0) + pct, log: [`${actor.name} 궁극 — 증폭! 파티 피해 +${Math.round(pct * 100)}%`, ...battle.log].slice(0, 8) } }, 1);
  }
  if (kind === "zone") {
    // 질베르타 중력 혼란 구역: 모든 적에 범위 취약(받는 피해 +).
    const vuln = 0.25;
    const enemies = battle.enemies.map((e) => (e.hp > 0 ? { ...e, vulnMark: Math.max(e.vulnMark ?? 0, vuln) } : e));
    return advanceTempo({ ...current, party: charged, battle: { ...battle, enemies, log: [`${actor.name} 궁극 — 중력 구역! 전체 취약 +${Math.round(vuln * 100)}%`, ...battle.log].slice(0, 8) } }, 1);
  }
  if (kind === "energy") {
    // 아케쿠리 「소대, 집합!」: 집결 신호탄으로 스킬 게이지(=전투 에너지) 대량 회복 + 연타 부여(피해는 미미).
    const refund = 4;
    return advanceTempo({ ...current, party: charged, battle: { ...battle, energy: battle.energy + refund, multiHit: Math.min(4, (battle.multiHit ?? 0) + 1), log: [`${actor.name} 궁극 — 집결! 에너지 +${refund} · 연타 부여`, ...battle.log].slice(0, 8) } }, 1);
  }

  // 일반 오퍼: 궁극 = 광역 피해(궁극 카드 주입 → 기존 피해 파이프라인 재사용)
  const ultCard = makeCard(actor, "ultimate", `ult-${operatorId}-${battle.turn}`);
  // 엠버 「다시 불타오르는 맹세」: 광역 열기 피해와 동시에 팀 전체 보호막(엠버 최대 체력 기반) — 피격 전 부여되도록 시전 파티에 선반영.
  const emberShield = operatorId === "ember" ? Math.round(actor.maxHp * 0.25) : 0;
  const partyForUlt = emberShield > 0 ? charged.map((m) => (m.hp > 0 ? { ...m, shield: m.shield + emberShield } : m)) : charged;
  const struck = playCardOnState({ ...current, party: partyForUlt }, ultCard.uid, targetEnemyId, ultCard);
  if (emberShield > 0 && struck.battle) {
    return { ...struck, battle: { ...struck.battle, log: [`${actor.name} — 맹세의 보호막! 팀 전체 +${emberShield}`, ...struck.battle.log].slice(0, 8) } };
  }
  // 포그라니치니크 「방패병 부대, 전진」: 진군 광역타 후 철의 서약 5포인트 부여(이후 적 물리 이상·포그 연계 시 1 소모 → 방패병 추가타+게이지).
  if (operatorId === "pogranichnik" && struck.battle) {
    return {
      ...struck,
      party: struck.party.map((m) => (m.id === operatorId ? { ...m, ironOath: IRON_OATH_POINTS } : m)),
      battle: { ...struck.battle, log: [`${actor.name} — 철의 서약 ${IRON_OATH_POINTS}포인트 생성! 방패병 진군 개시`, ...struck.battle.log].slice(0, 8) },
    };
  }
  // 카뮤 「선혈의 비」: 광역 열기 후 추적 상태(3턴) — 배틀 스킬이 0코스트 연계 「추적」으로 교체(손패에 즉시 1장 추가).
  if (operatorId === "camu" && struck.battle) {
    const cOp = struck.party.find((m) => m.id === "camu") ?? actor;
    const chase = makeChaseCard(cOp, `tf-chase-camu-${battle.turn}`);
    return {
      ...struck,
      party: struck.party.map((m) => (m.id === "camu" && m.hp > 0 ? { ...m, transformed: true, transformTurns: 3 } : m)),
      battle: { ...struck.battle, hand: [...struck.battle.hand, chase], log: [`${actor.name} — 추적 상태! 배틀 스킬이 [추적]으로 교체 (3턴)`, ...struck.battle.log].slice(0, 8) },
    };
  }
  // 이본 「아이스 슈터」: 광역 냉기 후 강화 상태(3턴) — 일반 공격이 강화 사격으로 교체(손패에 즉시 1장 추가).
  if (operatorId === "yvonne" && struck.battle) {
    const yOp = struck.party.find((m) => m.id === "yvonne") ?? actor;
    const stance = makeYvonneStanceCard(yOp, `tf-ice-yvonne-${battle.turn}`);
    return {
      ...struck,
      party: struck.party.map((m) => (m.id === "yvonne" && m.hp > 0 ? { ...m, transformed: true, transformTurns: 3 } : m)),
      battle: { ...struck.battle, hand: [...struck.battle.hand, stance], log: [`${actor.name} — 아이스 슈터! 일반 공격 강화 (3턴)`, ...struck.battle.log].slice(0, 8) },
    };
  }
  return struck;
}

// 지정된 적들의 행동을 해소(불균형이면 행동 불가 + 회복 카운트). 행동한 적은 게이지 0으로 리셋.
function resolveEnemyActions(party: PartyMember[], enemies: BattleEnemy[], turn: number, actingIds: string[]) {
  const logs: string[] = [];
  let energyDrain = 0;
  let drawReduce = 0;
  let p = party;
  let es = enemies;
  for (const id of actingIds) {
    const actor = es.find((x) => x.id === id);
    if (!actor || actor.hp <= 0) continue;
    if (actor.statuses.includes("defense-break")) {
      const remaining = (actor.breakTurns ?? 1) - 1;
      const recovered = remaining <= 0;
      es = es.map((x) => (x.id === actor.id ? { ...x, actionGauge: 0, breakTurns: recovered ? undefined : remaining, statuses: recovered ? withoutStatus(x.statuses, "defense-break") : x.statuses, stagger: recovered ? 0 : x.stagger } : x));
      logs.push(`${actor.name} 불균형 — 행동 불가${recovered ? " · 회복" : ""}`);
      continue;
    }
    // 동결(Solidification): 행동 불가 1회, 이후 해제.
    if (actor.statuses.includes("freeze")) {
      es = es.map((x) => (x.id === actor.id ? { ...x, actionGauge: 0, statuses: withoutStatus(x.statuses, "freeze") } : x));
      logs.push(`${actor.name} 동결 — 행동 불가`);
      continue;
    }
    const living = p.filter((m) => m.hp > 0);
    if (!living.length) break;
    const action = buildEnemyAction(actor, turn);
    const targets = action.targetAll ? living : [enemyHas(actor, "ranged") || enemyHas(actor, "sniper") ? living.reduce((lo, m) => (m.hp < lo.hp ? m : lo), living[0]) : living.reduce((lo, m) => (m.shield < lo.shield ? m : lo), living[0])];
    const targetIds = new Set(targets.map((t) => t.id));
    let totalHit = 0;
    const evaded: string[] = [];
    p = p.map((m) => {
      if (!targetIds.has(m.id) || m.hp <= 0) return m;
      if (didEvade(m, turn, actor.id)) { evaded.push(m.name); return m; }
      const effDef = enemyHas(actor, "acid") ? m.defense * 0.5 : enemyHas(actor, "ranged") ? m.defense * 0.6 : m.defense;
      const hit = Math.max(1, Math.ceil(action.damage * defenseFactor(effDef)));
      totalHit += hit;
      return absorbHit(m, hit);
    });
    if (action.aoeChip > 0) {
      const before = p.filter((m) => m.hp > 0).length;
      p = p.map((m) => (m.hp > 0 ? absorbHit(m, action.aoeChip) : m));
      if (before > 0) logs.push(`${actor.name} 독성 — 전체 ${action.aoeChip} (DoT)`);
    }
    energyDrain += action.energyDrain;
    drawReduce += action.drawReduce;
    es = es.map((x) => {
      if (x.id === actor.id) {
        const t = x.armorBreakTurns != null ? x.armorBreakTurns - 1 : undefined;
        const exp = t != null && t <= 0;
        return { ...x, actionGauge: 0, hp: action.selfDestruct ? 0 : x.hp, armorBreakTurns: exp ? undefined : t, statuses: exp ? withoutStatus(x.statuses, "armor-break") : x.statuses };
      }
      if (action.healsAllies && x.hp > 0) return { ...x, hp: Math.min(x.maxHp, x.hp + Math.ceil(x.maxHp * 0.08)) };
      return x;
    });
    logs.push(`${actor.name}: ${action.targetAll ? "전체" : targets[0]?.name} ${totalHit} 피해${evaded.length ? ` · 회피 ${evaded.join(",")}` : ""}`);
  }
  return { party: p, enemies: es, energyDrain, drawReduce, logs };
}

// 카드 템포 진행: 생존 적 게이지 += ticks. 게이지가 actionEvery에 도달한 적이 즉시 행동.
// 교란(에너지/손패 감소)은 현재 턴에 바로 적용. 카드를 쓸수록 적이 더 빨리 반응한다.
function advanceTempo(current: RunState, ticks: number): RunState {
  const battle = current.battle;
  if (!battle || current.screen !== "battle") return current;
  let enemies = battle.enemies.map((e) => (e.hp > 0 ? { ...e, actionGauge: e.actionGauge + ticks } : e));
  const readyIds = enemies.filter((e) => e.hp > 0 && e.actionGauge >= e.actionEvery).map((e) => e.id);
  let party = current.party;
  let energy = battle.energy;
  let hand = battle.hand;
  let discardPile = battle.discardPile;
  const logs: string[] = [];
  if (readyIds.length) {
    const r = resolveEnemyActions(party, enemies, battle.turn, readyIds);
    party = r.party;
    enemies = r.enemies;
    logs.push(...r.logs);
    if (r.energyDrain > 0) { energy = Math.max(0, energy - r.energyDrain); logs.push(`교란 — 에너지 -${r.energyDrain}`); }
    if (r.drawReduce > 0 && hand.length > 0) {
      const keep = Math.max(0, hand.length - r.drawReduce);
      const removed = hand.slice(keep);
      hand = hand.slice(0, keep);
      discardPile = [...discardPile, ...removed];
      logs.push(`교란 — 손패 -${removed.length}`);
    }
  }
  enemies = enemies.map((e) => (e.hp > 0 ? { ...e, telegraph: makeIntent(e, battle.turn) } : e));
  const nextBattle: BattleState = { ...battle, enemies, energy, hand, discardPile, log: logs.length ? [...logs.reverse(), ...battle.log].slice(0, 10) : battle.log };
  if (party.every((m) => m.hp <= 0)) return { ...current, party, battle: nextBattle, screen: "summary", result: "defeat" };
  return { ...current, party, battle: nextBattle };
}

// 턴 넘기기(정비): 적 템포 +1 → 에너지 재충전 + 새 손패 + 지속 회복.
export function endTurnOnState(current: RunState): RunState {
  const battle = current.battle;
  if (!battle || current.screen !== "battle") return current;
  const afterEnemies = advanceTempo(current, 1);
  if (afterEnemies.screen !== "battle" || !afterEnemies.battle) return afterEnemies;
  const b = afterEnemies.battle;
  let party = afterEnemies.party;
  // 변신 만료: 새 턴마다 잔여 턴 감소, 0이면 원복(덱 일반/배틀이 평상시 카드로 복귀).
  const prevTransformed = new Set(party.filter((m) => m.transformed).map((m) => m.id));
  party = party.map((m) => {
    if (!m.transformed) return m;
    const t = (m.transformTurns ?? 1) - 1;
    return t > 0 ? { ...m, transformTurns: t } : { ...m, transformed: false, transformTurns: 0 };
  });
  const expiredOps = [...prevTransformed].filter((id) => !party.find((m) => m.id === id)?.transformed);
  const dropTf = (c: Card) => c.uid.startsWith("tf-") && expiredOps.includes(c.operatorId); // 변신 종료 오퍼의 추가 카드 제거
  const turn = b.turn + 1;
  const relicFx = getRelicEffects(afterEnemies.relics);
  const handSize = Math.max(2, HAND_SIZE + relicFx.handBonus);
  const drawn = drawHand(b.drawPile.filter((c) => !dropTf(c)), [...b.discardPile, ...b.hand].filter((c) => !dropTf(c)), [], handSize, turn * 31 + b.enemies.length);
  const regen = b.partyRegen;
  const regenActive = regen && regen.turns > 0;
  if (regenActive) party = healParty(party, regen.amount);
  const nextRegen = regenActive ? (regen.turns - 1 > 0 ? { amount: regen.amount, turns: regen.turns - 1 } : undefined) : regen;
  // 유물 상시 회복(사리아·나이팅게일): 매 턴 파티 회복
  if (relicFx.regenPerTurn > 0) party = healParty(party, relicFx.regenPerTurn);
  const regenLog = [
    ...(regenActive ? [`지속 회복 +${regen!.amount}`] : []),
    ...(relicFx.regenPerTurn > 0 ? [`유물 회복 +${relicFx.regenPerTurn}`] : []),
  ];
  // 아츠 DoT: 연소·부식 적은 매 턴 시작 시 지속 피해(부식은 강함).
  let dotTotal = 0;
  const enemies = b.enemies.map((e) => {
    if (e.hp <= 0) return { ...e, telegraph: makeIntent(e, turn) };
    let dot = 0;
    if (e.statuses.includes("combustion")) dot += DOT_DAMAGE;
    if (e.statuses.includes("corrosion")) dot += DOT_DAMAGE + 2;
    if ((e.bleed ?? 0) > 0) dot += e.bleed!; // 로시 절흔 출혈
    if (dot > 0) dotTotal += dot;
    const hp = Math.max(0, e.hp - dot);
    return { ...e, hp, telegraph: makeIntent({ ...e, hp }, turn) };
  });
  const dotLog = dotTotal > 0 ? [`아츠 DoT — 적 ${dotTotal} 피해`] : [];
  return { ...afterEnemies, party, battle: { ...b, enemies, hand: drawn.hand, drawPile: drawn.drawPile, discardPile: drawn.discardPile, energy: b.maxEnergy, turn, partyRegen: nextRegen, log: [`— ${turn}턴 시작 —`, ...dotLog, ...regenLog, ...b.log].slice(0, 10) } };
}

export function useRunState(): RunState & RunActions {
  const [state, setState] = useState<RunState>(initialState);
  const startRun = useCallback(() => setState(initialState()), []);
  // ===== 보스 점수 도전 =====
  const saveDeck = useCallback(() => {
    setState((current) => {
      saveDeckSnapshot({ party: current.party, deck: current.deck, relics: current.relics, sp: current.maxSp, maxSp: current.maxSp, savedAt: Date.now() });
      return current;
    });
    return true;
  }, []);
  const openChallenge = useCallback(() => setState((current) => ({ ...current, screen: "challenge" })), []);
  const exitChallenge = useCallback(() => setState((current) => ({ ...current, screen: "deployment" })), []);
  const startChallenge = useCallback((bossId: string) => {
    setState((current) => {
      const snap = loadDeckSnapshot();
      if (!snap) return current;
      const bs = applyBattleStartSetEffects(snap.party.map((m) => ({ ...m, hp: m.maxHp, shield: 0, ultimateCharge: 0, actionGauge: 0, passiveStacks: 0 })), snap.maxSp, snap.maxSp);
      const fx = getRelicEffects(snap.relics);
      const boss = getEnemy(bossId);
      const every = enemyActionEvery(boss);
      const e: BattleEnemy = { ...boss, hp: boss.maxHp, statuses: [], actionGauge: 0 - fx.enemyStartDelay, actionEvery: every, stagger: 0, physBreakStacks: 0 };
      const enemy = { ...e, telegraph: makeIntent(e, 1) };
      const party = fx.startShield > 0 ? bs.party.map((m) => ({ ...m, shield: m.shield + fx.startShield })) : bs.party;
      const deck = buildDeck(party, snap.deck, { battle: true });
      const maxEnergy = ENERGY_PER_TURN + fx.maxEnergyBonus;
      const handSize = HAND_SIZE + fx.handBonus;
      const drawn = drawHand(shuffle(deck, 17), [], [], handSize, 11);
      return { ...current, party, relics: snap.relics, sp: bs.sp, maxSp: snap.maxSp, challengeBossId: bossId, challengeTurns: undefined, screen: "battle", battle: { enemies: [enemy], hand: drawn.hand, drawPile: drawn.drawPile, discardPile: [], energy: maxEnergy + fx.startEnergy + bs.startEnergy, maxEnergy, multiHit: fx.startMultiHit > 0 ? fx.startMultiHit : undefined, turn: 1, log: [`보스 도전 — ${boss.name}`] } };
    });
  }, []);
  const confirmDeployment = useCallback((operatorIds: string[]) => setState((current) => {
    const party = freshParty(operatorIds);
    const sd = startingDeck(0, party); // 시작 덱을 선택한 파티의 기본 카드(기본공격+방어)로 재구성
    // 테스트 훅: URL에 ?relics=all 이면 전 유물 시드(유물 동작 확인용)
    const testRelics = typeof window !== "undefined" && /[?&]relics=all/.test(window.location.search) ? RELIC_IDS : [];
    return { ...current, party, deck: sd.deck, deckSeq: sd.seq, relics: [...current.relics, ...testRelics], screen: "map", availableNodes: current.availableNodes.length > 0 ? current.availableNodes : getFactionStart(current.factionIndex) };
  }), []);
  const abandonRun = useCallback(() => setState((current) => ({ ...current, screen: "summary", result: "abandoned" })), []);

  const enterNode = useCallback((nodeId: string) => {
    setState((current) => {
      if (!current.availableNodes.includes(nodeId)) return current;
      const node = getMapNode(nodeId);
      const base = { ...current, currentNodeId: nodeId, visitedNodes: [...current.visitedNodes, nodeId], availableNodes: [] };
      // 미지(?) 해소: 입장 시 전투(55%)/이벤트(25%)/보물(20%) 중 결정.
      let type = node.type;
      if (type === "unknown") {
        const roll = (current.visitedNodes.length * 17 + nodeId.length * 7 + current.battlesWon * 3) % 100;
        type = roll < 55 ? "battle" : roll < 80 ? "event" : "treasure";
      }
      if (type === "event") {
        // 희귀 이벤트(복제 등): 낮은 확률 + 복제 후보가 있을 때만. 아니면 현재 세력 + 중립 풀에서 선택.
        const canDup = current.deck.some((d) => !d.copyLocked && d.src !== "basic" && d.kind !== "attack");
        const rareRoll = (current.visitedNodes.length * 31 + current.battlesWon * 7 + 5) % 100;
        const rareEvent = events.find((e) => e.rare && canDup);
        const pool = events.filter((e) => !e.rare && (e.faction == null || e.faction === current.factionIndex));
        const list = pool.length > 0 ? pool : events.filter((e) => !e.rare);
        const event = rareEvent && rareRoll < 12 ? rareEvent : list[current.visitedNodes.length % list.length];
        return { ...base, screen: "event", eventId: event.id };
      }
      if (type === "shop") {
        const seed = current.visitedNodes.length + current.battlesWon + 5;
        // 정비소: 상점 구매 + 1회 무료 휴식/강화(repairUsed 리셋)
        return { ...base, screen: "shop", repairUsed: false, pendingGearSlugs: chooseGearRewards(current.battlesWon + 1, 4, node.rewardTier ?? "mid"), shopRelics: pickRelics(current.relics, 2, seed), shopPotions: pickPotions(2, seed) };
      }
      if (type === "treasure") {
        // 보물: 무전투 보상 — 장비 + 크레딧 + 낮은 확률 유물.
        const seed = current.visitedNodes.length + current.battlesWon + 9;
        const wantRelic = (current.visitedNodes.length + nodeId.length) % 3 === 0;
        const grantedRelic = wantRelic ? pickRelics(current.relics, 1, seed)[0] : undefined;
        return { ...base, screen: "reward", credits: current.credits + 50, relics: grantedRelic ? [...current.relics, grantedRelic] : current.relics, pendingRelic: grantedRelic, pendingGearSlugs: chooseGearRewards(current.battlesWon + 1, 3, node.rewardTier ?? "mid"), pendingCardOffers: [] };
      }
      if (type === "camp") return { ...base, screen: "camp" };
      const fx = getRelicEffects(current.relics);
      const battleStartRaw = applyBattleStartSetEffects(current.party, current.sp, current.maxSp);
      const battleParty = battleStartRaw.party.map((m) => (m.hp > 0 ? { ...m, transformed: false, transformTurns: 0, ironOath: 0, shield: m.shield + (fx.startShield > 0 ? fx.startShield : 0) } : m)); // 변신·철의 서약은 전투마다 초기화
      const startEnemies = getEnemies(node.enemyIds ?? []).map((enemy, i) => {
        const every = enemyActionEvery(enemy);
        // 초기 게이지를 적마다 살짝 어긋나게(동시 행동 방지). 첫 행동까지 최소 1장.
        const e: BattleEnemy = { ...enemy, hp: enemy.maxHp, statuses: [], actionGauge: Math.min(i, every - 1) - fx.enemyStartDelay, actionEvery: every, stagger: 0, physBreakStacks: 0 };
        return { ...e, telegraph: makeIntent(e, 1) };
      });
      const deck = buildDeck(battleParty, current.deck, { battle: true });
      const maxEnergy = ENERGY_PER_TURN + fx.maxEnergyBonus;
      const handSize = HAND_SIZE + fx.handBonus;
      const drawn = drawHand(shuffle(deck, startEnemies.length * 7 + current.battlesWon + 3), [], [], handSize, 11);
      const relicBits = [fx.startShield > 0 ? `보호막 +${fx.startShield}` : "", fx.startEnergy > 0 ? `에너지 +${fx.startEnergy}` : "", fx.startMultiHit > 0 ? `연타 ${fx.startMultiHit}` : "", fx.enemyStartDelay > 0 ? `적 지연 ${fx.enemyStartDelay}` : ""].filter(Boolean);
      const relicLog = relicBits.length ? [`유물 발동 — ${relicBits.join(" · ")}`] : [];
      return { ...base, party: battleParty, sp: battleStartRaw.sp, screen: "battle", battle: { enemies: startEnemies, hand: drawn.hand, drawPile: drawn.drawPile, discardPile: [], energy: maxEnergy + fx.startEnergy + battleStartRaw.startEnergy, maxEnergy, multiHit: fx.startMultiHit > 0 ? fx.startMultiHit : undefined, turn: 1, log: [...relicLog, `${node.title}에서 적과 조우했습니다.`] } };
    });
  }, []);

  const playCard = useCallback((uid: string, targetEnemyId?: string) => {
    setState((current) => playCardOnState(current, uid, targetEnemyId));
  }, []);

  const useUltimate = useCallback((operatorId: string, targetEnemyId?: string) => {
    setState((current) => useUltimateOnState(current, operatorId, targetEnemyId));
  }, []);

  const endTurn = useCallback(() => {
    setState((current) => endTurnOnState(current));
  }, []);

  // 보상 장비 장착: 화면을 떠나지 않는다(카드 보상·유물도 같은 화면에서 받고 '맵으로'로 나간다).
  const equipRewardGear = useCallback((gearSlug: string, operatorId: string) => {
    setState((current) => {
      const gear = getGameGear(gearSlug);
      const target = current.party.find((member) => member.id === operatorId);
      const slot = target ? getGearSlot(gear) : undefined;
      const replacedGear = target && slot ? target.gear[slot] : undefined;
      const sellCredits = replacedGear ? getGearSellValue(replacedGear) : 0;
      return { ...current, party: current.party.map((member) => member.id === operatorId ? equipGearToMember(member, gear) : member), collectedGears: [...current.collectedGears.filter((item) => item.slug !== replacedGear?.slug), gear], credits: current.credits + sellCredits, pendingGearSlugs: [] };
    });
  }, []);

  // 전투 보상 전술 카드 획득(덱에 영구 추가).
  // 카드 습득: 보상으로 제시된 토큰을 덱에 영구 추가(새 uid 발급).
  const takeCardOffer = useCallback((token: string) => {
    setState((current) => {
      if (current.screen !== "reward" || !current.pendingCardOffers.includes(token)) return current;
      return { ...current, deck: [...current.deck, deckCardFromToken(token, `c${current.deckSeq}`)], deckSeq: current.deckSeq + 1, pendingCardOffers: [] };
    });
  }, []);

  const skipCardOffer = useCallback(() => {
    setState((current) => (current.screen === "reward" ? { ...current, pendingCardOffers: [] } : current));
  }, []);


  // 상점 구매: 크레딧을 차감하고 장착(기존 장비는 판매 환급). 화면을 떠나지 않아 여러 번 구매 가능.
  const buyGear = useCallback((gearSlug: string, operatorId: string) => {
    setState((current) => {
      if (current.screen !== "shop") return current;
      const gear = getGameGear(gearSlug);
      const price = getGearBuyValue(gear);
      if (current.credits < price || !current.pendingGearSlugs.includes(gearSlug)) return current;
      const target = current.party.find((member) => member.id === operatorId);
      const slot = target ? getGearSlot(gear) : undefined;
      const replacedGear = target && slot ? target.gear[slot] : undefined;
      const sellCredits = replacedGear ? getGearSellValue(replacedGear) : 0;
      return {
        ...current,
        party: current.party.map((member) => (member.id === operatorId ? equipGearToMember(member, gear) : member)),
        collectedGears: [...current.collectedGears.filter((item) => item.slug !== replacedGear?.slug), gear],
        credits: current.credits - price + sellCredits,
        pendingGearSlugs: current.pendingGearSlugs.filter((slug) => slug !== gearSlug),
      };
    });
  }, []);


  // 정비소 1회 무료 휴식(회복) — 휴식/강화 중 하나만 가능
  const repairRest = useCallback(() => {
    setState((current) => {
      if (current.screen !== "shop" || current.repairUsed) return current;
      return { ...current, party: healParty(current.party, 28), repairUsed: true };
    });
  }, []);
  // 정비소 1회 무료 강화(카드 정예화) — 휴식/강화 중 하나만 가능
  const repairUpgrade = useCallback((uid: string) => {
    setState((current) => {
      if (current.screen !== "shop" || current.repairUsed) return current;
      const entry = current.deck.find((d) => d.uid === uid);
      const lv = entry?.eliteLevel ?? 0;
      if (!entry || entry.copyLocked || lv >= MAX_ELITE) return current; // 복제본은 강화 불가
      const next = (lv + 1) as 1 | 2;
      return { ...current, deck: current.deck.map((d) => (d.uid === uid ? { ...d, eliteLevel: next } : d)), repairUsed: true };
    });
  }, []);

  // 상점 카드 삭제: 크레딧을 내고 덱에서 카드 1장을 영구 제외. 삭제할수록 비용이 비싸진다.
  const removeCard = useCallback((uid: string) => {
    setState((current) => {
      if (current.screen !== "shop" || current.deck.length <= MIN_DECK_SIZE) return current;
      if (!current.deck.some((d) => d.uid === uid)) return current;
      const cost = cardRemovalCost(current.cardsRemoved);
      if (current.credits < cost) return current;
      return { ...current, credits: current.credits - cost, deck: current.deck.filter((d) => d.uid !== uid), cardsRemoved: current.cardsRemoved + 1 };
    });
  }, []);

  // 상점 유물 구매(상점에 머무름).
  const buyRelic = useCallback((relicId: string) => {
    setState((current) => {
      if (current.screen !== "shop" || !current.shopRelics.includes(relicId) || current.relics.includes(relicId)) return current;
      const relic = getRelic(relicId);
      if (!relic || current.credits < relic.price) return current;
      return { ...current, credits: current.credits - relic.price, relics: [...current.relics, relicId], shopRelics: current.shopRelics.filter((id) => id !== relicId) };
    });
  }, []);

  // 상점 포션 구매(슬롯 여유 시).
  const buyPotion = useCallback((potionId: string) => {
    setState((current) => {
      if (current.screen !== "shop" || !current.shopPotions.includes(potionId) || current.potions.length >= MAX_POTIONS) return current;
      const potion = getPotion(potionId);
      if (!potion || current.credits < potion.price) return current;
      const idx = current.shopPotions.indexOf(potionId);
      return { ...current, credits: current.credits - potion.price, potions: [...current.potions, potionId], shopPotions: current.shopPotions.filter((_, i) => i !== idx) };
    });
  }, []);

  // 전투 중 소비 아이템 사용(1회성). 실제 인게임 효과를 게임 스케일로 적용.
  const usePotion = useCallback((potionId: string) => {
    setState((current) => {
      if (current.screen !== "battle" || !current.battle) return current;
      const idx = current.potions.indexOf(potionId);
      const potion = getPotion(potionId);
      if (idx < 0 || !potion) return current;
      const potions = current.potions.filter((_, i) => i !== idx);
      const battle = current.battle;
      const fx = potion.effect;
      const log = (msg: string) => [`소비: ${potion.name} — ${msg}`, ...battle.log].slice(0, 8);

      if (fx.kind === "heal") {
        const party = current.party.map((m) => (m.hp > 0 ? { ...m, hp: Math.min(m.maxHp, m.hp + fx.amount + Math.ceil(m.maxHp * (fx.pct ?? 0))) } : m));
        return { ...current, potions, party, battle: { ...battle, log: log(`파티 회복`) } };
      }
      if (fx.kind === "regen") {
        return { ...current, potions, battle: { ...battle, partyRegen: { amount: fx.amount, turns: fx.turns }, log: log(`지속 회복 ${fx.turns}턴`) } };
      }
      if (fx.kind === "revive") {
        const downed = current.party.find((m) => m.hp <= 0);
        if (!downed) return current; // 부활 대상 없음 → 사용 취소
        const party = current.party.map((m) => (m.id === downed.id ? { ...m, hp: Math.max(1, Math.ceil(m.maxHp * fx.pct)), shield: 0 } : m));
        return { ...current, potions, party, battle: { ...battle, log: log(`${downed.name} 부활`) } };
      }
      if (fx.kind === "dmg-buff") {
        return { ...current, potions, battle: { ...battle, dmgBuffPct: (battle.dmgBuffPct ?? 0) + fx.pct, log: log(`카드 피해 +${Math.round(fx.pct * 100)}%`) } };
      }
      if (fx.kind === "crit-buff") {
        return { ...current, potions, battle: { ...battle, critBuff: (battle.critBuff ?? 0) + fx.crit, dmgBuffPct: (battle.dmgBuffPct ?? 0) + fx.dmg, log: log(`치명 +${Math.round(fx.crit * 100)}% · 피해 +${Math.round(fx.dmg * 100)}%`) } };
      }
      if (fx.kind === "max-energy") {
        return { ...current, potions, battle: { ...battle, maxEnergy: battle.maxEnergy + fx.amount, energy: battle.energy + fx.amount, log: log(`최대 에너지 +${fx.amount}`) } };
      }
      // strike(광역 피해)
      let totalDamage = 0;
      let brokeAny = false;
      const enemies = battle.enemies.map((enemy) => {
        if (enemy.hp <= 0) return enemy;
        const dmg = Math.ceil(fx.amount * defenseFactor(enemy.defense) * (enemy.statuses.includes("defense-break") ? IMBALANCE_DAMAGE_TAKEN : 1));
        totalDamage += dmg;
        const hp = Math.max(0, enemy.hp - dmg);
        const alreadyBroken = enemy.statuses.includes("defense-break");
        const stagger = alreadyBroken ? enemy.stagger : Math.min(enemy.staggerHp, enemy.stagger + TACTICAL_STAGGER);
        let statuses = enemy.statuses;
        let breakTurns = enemy.breakTurns;
        if (!alreadyBroken && enemy.staggerHp > 0 && stagger >= enemy.staggerHp && hp > 0) { statuses = addStatus(statuses, "defense-break"); breakTurns = BREAK_TURNS; brokeAny = true; }
        return { ...enemy, hp, statuses, stagger, breakTurns };
      });
      const after = reviveEnemies(enemies).enemies;
      const nextBattle: BattleState = { ...battle, enemies: after, log: [`소비: ${potion.name} — 모든 적 ${totalDamage} 피해${brokeAny ? " · 불균형!" : ""}`, ...battle.log].slice(0, 8) };
      if (after.every((e) => e.hp <= 0)) return finishBattle({ ...current, potions }, nextBattle);
      return { ...current, potions, battle: nextBattle };
    });
  }, []);

  // 캠프 카드 정예화. 이미 2차/복제본이면 불가.
  const upgradeCard = useCallback((uid: string) => {
    setState((current) => {
      if (current.screen !== "camp") return current;
      const entry = current.deck.find((d) => d.uid === uid);
      const lv = entry?.eliteLevel ?? 0;
      if (!entry || entry.copyLocked || lv >= MAX_ELITE) return current; // 복제본·2차는 불가
      const next = (lv + 1) as 1 | 2;
      return { ...current, deck: current.deck.map((d) => (d.uid === uid ? { ...d, eliteLevel: next } : d)), screen: "map", availableNodes: getMapNode(current.currentNodeId ?? "").next };
    });
  }, []);

  // 정예 보상 정예화: 보유 토큰(pendingPromotes)만큼 카드 정예화. 다 쓰면 복제 단계 또는 맵으로.
  const promoteCard = useCallback((uid: string) => {
    setState((current) => {
      if (current.screen !== "promote") return current;
      const entry = current.deck.find((d) => d.uid === uid);
      const lv = entry?.eliteLevel ?? 0;
      if (!entry || entry.copyLocked || lv >= MAX_ELITE) return current; // 복제본은 강화 불가
      const next = (lv + 1) as 1 | 2;
      const left = (current.pendingPromotes ?? 1) - 1;
      const deck = current.deck.map((d) => (d.uid === uid ? { ...d, eliteLevel: next } : d));
      if (left > 0) return { ...current, deck, pendingPromotes: left };
      const toDup = (current.pendingDuplicate?.length ?? 0) > 0;
      return { ...current, deck, pendingPromotes: 0, screen: toDup ? "duplicate" : "map", availableNodes: current.currentNodeId ? getMapNode(current.currentNodeId).next : getFactionStart(current.factionIndex) };
    });
  }, []);
  const skipPromote = useCallback(() => {
    setState((current) => { const toDup = (current.pendingDuplicate?.length ?? 0) > 0; return { ...current, pendingPromotes: 0, screen: toDup ? "duplicate" : "map", availableNodes: current.currentNodeId ? getMapNode(current.currentNodeId).next : getFactionStart(current.factionIndex) }; });
  }, []);

  // 필드보스(정예) 복제: 후보 3장 중 1장 복제. 복제본은 그 시점 상태로 고정 + 정예화 영구 불가.
  const duplicateCard = useCallback((uid: string) => {
    setState((current) => {
      if (current.screen !== "duplicate" || !current.pendingDuplicate?.includes(uid)) return current;
      const orig = current.deck.find((d) => d.uid === uid);
      if (!orig) return current;
      const copy = { ...orig, uid: `c${current.deckSeq}`, copyLocked: true };
      return { ...current, deck: [...current.deck, copy], deckSeq: current.deckSeq + 1, pendingDuplicate: undefined, screen: "map", availableNodes: current.currentNodeId ? getMapNode(current.currentNodeId).next : getFactionStart(current.factionIndex) };
    });
  }, []);
  const skipDuplicate = useCallback(() => {
    setState((current) => ({ ...current, pendingDuplicate: undefined, screen: "map", availableNodes: current.currentNodeId ? getMapNode(current.currentNodeId).next : getFactionStart(current.factionIndex) }));
  }, []);

  const skipReward = useCallback(() => {
    setState((current) => ({ ...current, pendingGearSlugs: [], pendingCardOffers: [], pendingRelic: undefined, shopRelics: [], shopPotions: [], screen: (current.pendingPromotes ?? 0) > 0 ? "promote" : (current.pendingDuplicate?.length ?? 0) > 0 ? "duplicate" : "map", availableNodes: current.currentNodeId ? getMapNode(current.currentNodeId).next : getFactionStart(current.factionIndex), battle: undefined, eventId: undefined, sp: current.maxSp }));
  }, []);

  const resolveEvent = useCallback((choiceId: string) => {
    setState((current) => {
      const event = events.find((item) => item.id === current.eventId);
      const choice: GameEventChoice | undefined = event?.choices.find((item) => item.id === choiceId);
      if (!choice) return current;
      const seed = current.visitedNodes.length + current.battlesWon + 7;
      let next = current;
      if (choice.hpCost) next = { ...next, party: damageParty(next.party, choice.hpCost) };
      if (choice.heal) next = { ...next, party: healParty(next.party, choice.heal) };
      if (choice.credits) next = { ...next, credits: next.credits + choice.credits };
      if (choice.relicReward) { const r = pickRelics(next.relics, 1, seed)[0]; if (r) next = { ...next, relics: [...next.relics, r] }; }
      if (choice.potionReward && next.potions.length < MAX_POTIONS) next = { ...next, potions: [...next.potions, pickPotions(1, seed)[0]] };
      if (choice.promote) next = { ...next, pendingPromotes: (next.pendingPromotes ?? 0) + choice.promote };
      const nextNodes = getMapNode(current.currentNodeId ?? "").next;
      if (choice.duplicate) {
        // 복제 이벤트: 습득 카드(기본 제외) 중 랜덤 3장을 복제 후보로 → 복제 화면.
        const dupPool = next.deck.filter((d) => !d.copyLocked && d.src !== "basic" && d.kind !== "attack").map((d) => d.uid);
        if (dupPool.length > 0) return { ...next, eventId: undefined, pendingDuplicate: shuffle(dupPool, seed * 11 + 1).slice(0, 3), screen: "duplicate", availableNodes: nextNodes };
      }
      if (choice.gearSlug || choice.gearReward) return { ...next, eventId: undefined, pendingGearSlugs: choice.gearSlug ? [choice.gearSlug] : chooseGearRewards(current.battlesWon + 1, 3, getMapNode(current.currentNodeId ?? "").rewardTier ?? "early"), screen: "reward" };
      if (choice.promote) return { ...next, eventId: undefined, screen: "promote", availableNodes: nextNodes }; // 정예화 화면으로 직행
      return { ...next, screen: "map", eventId: undefined, availableNodes: nextNodes };
    });
  }, []);

  const rest = useCallback((mode: "heal" | "train") => {
    setState((current) => ({ ...current, party: mode === "heal" ? healParty(current.party, 28) : current.party.map((member) => ({ ...member, attack: member.attack + 2, battleSkillPower: member.battleSkillPower + 2, linkSkillPower: member.linkSkillPower + 2, ultimatePower: member.ultimatePower + 2 })), screen: "map", availableNodes: getMapNode(current.currentNodeId ?? "").next }));
  }, []);

  const continueToMap = useCallback(() => {
    setState((current) => ({ ...current, screen: "map", availableNodes: current.currentNodeId ? getMapNode(current.currentNodeId).next : getFactionStart(current.factionIndex) }));
  }, []);

  return { ...state, startRun, confirmDeployment, abandonRun, enterNode, playCard, useUltimate, endTurn, equipRewardGear, takeCardOffer, skipCardOffer, usePotion, buyGear, removeCard, buyRelic, buyPotion, upgradeCard, promoteCard, skipPromote, duplicateCard, skipDuplicate, repairRest, repairUpgrade, saveDeck, openChallenge, startChallenge, exitChallenge, skipReward, resolveEvent, rest, continueToMap };
}
