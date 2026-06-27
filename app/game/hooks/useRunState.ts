"use client";

import { useCallback, useState } from "react";

import { buildDeck, cardRemovalCost, cardRewardPool, deckCardFromToken, MAX_ELITE, MIN_DECK_SIZE, startingDeck } from "../data/cards";
import { getEnemies, getEnemy } from "../data/enemies";
import { loadBestScores, loadDeckSnapshot, recordScore, saveDeckSnapshot } from "../lib/challenge";
import { computeBattleDrop, getEnemyWeakness, WEAKNESS_AMP } from "../data/enemy-traits";
import { events } from "../data/events";
import { getRelic, getRelicEffects, pickRelics } from "../data/relics";
import { getPotion, MAX_POTIONS, pickPotions, potionNeedsTarget } from "../data/potions";
import {
  chooseGearRewards,
  getActiveSets,
  getEquippedGears,
  getGameGear,
  getGearBuyValue,
  getGearSellValue,
  getGearStatDeltas,
  getGearSlot,
  getSetEffects,
} from "../data/game-gears";
import { factions, getFactionStart, getMapNode } from "../data/maps";
import { allOperators, startingParty } from "../data/operators";
import type {
  BattleEnemy,
  BattleState,
  Card,
  Element,
  Enemy,
  EnemyStatus,
  GameEventChoice,
  Operator,
  OperatorClass,
  PartyMember,
  PassiveMechanic,
  RunActions,
  RunGear,
  RunState,
  SkillKind,
} from "../types/game";

// 카드 전투 자원
const ENERGY_PER_TURN = 3;
const HAND_SIZE = 5;
const EVASION_CAP = 25;
// 아츠 부착 4종(원소 이상). 같은 원소 재부착=버스트, 다른 원소=반응.
const ARTS_INFLICTIONS: EnemyStatus[] = ["combustion", "shock", "freeze", "corrosion"];
// 원소 → 아츠 부착(물리는 취약 스택으로 별도 처리)
const ELEMENT_INFLICTION: Partial<Record<Element, EnemyStatus>> = {
  heat: "combustion",
  electric: "shock",
  cryo: "freeze",
  nature: "corrosion",
};
const INFLICTION_LABEL: Record<string, string> = { combustion: "연소", shock: "감전", freeze: "동결", corrosion: "부식" };
const ARTS_ATTACHMENT_STATUSES = ARTS_INFLICTIONS;

function getBaseOperator(operatorId: string): Operator {
  const operator = allOperators.find((item) => item.id === operatorId);
  if (!operator) throw new Error(`Unknown operator: ${operatorId}`);
  return operator;
}

function freshParty(operatorIds?: string[]): PartyMember[] {
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
  const blocked = Math.min(member.shield, amount);
  return { ...member, shield: member.shield - blocked, hp: Math.max(0, member.hp - (amount - blocked)) };
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
function enemyActionEvery(e: Enemy): number {
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
function getStatusBonus(actor: PartyMember, target: BattleEnemy) {
  let bonus = 1;
  const arts = actor.element !== "physical";
  if (target.statuses.includes("shock") && arts) bonus += 0.2; // 감전: 아츠 피해 증폭
  if (target.statuses.includes("corrosion")) bonus += 0.15; // 부식: 저항 감소
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

// ===== 2층 패시브 =====
// 모든 오퍼는 직군 패시브(공통 베이스라인) + 오퍼 패시브(개별 재능)를 둘 다 받는다.
const ARTS_STATUSES: EnemyStatus[] = ["combustion", "shock", "freeze", "corrosion", "armor-break"];
// 직군 패시브: 직군 컨셉을 약한 베이스라인으로(오퍼 패시브 대비 60%).
const CLASS_PASSIVE: Record<OperatorClass, PassiveMechanic> = {
  "가드": "vs-broken",
  "디펜더": "guardian-shield",
  "캐스터": "vs-status",
  "스트라이커": "crit-surge",
  "서포터": "support-heal",
  "뱅가드": "energy-surge",
};
const CLASS_SCALE = 0.6;
// 오퍼가 받는 패시브 목록: [직군(60%), 개별(100%)]
function passiveList(m: PartyMember): { mech: PassiveMechanic; scale: number }[] {
  return [
    { mech: CLASS_PASSIVE[m.className], scale: CLASS_SCALE },
    { mech: m.passiveMechanic, scale: 1 },
  ];
}
function hasPassive(m: PartyMember, mech: PassiveMechanic): boolean {
  return CLASS_PASSIVE[m.className] === mech || m.passiveMechanic === mech;
}

function getPassiveDamageBonus(actor: PartyMember, target: BattleEnemy, kind: SkillKind, elite = 0) {
  let bonus = 1;
  const e = 1 + 0.3 * elite; // 정예화: 오퍼 핵심 재능(패시브) 효과를 단계마다 +30% 강화
  const broken = target.statuses.includes("defense-break");
  const afflicted = broken || target.statuses.some((s) => ARTS_STATUSES.includes(s));
  const vulnerable = target.physBreakStacks > 0; // 취약(Vulnerable) 스택
  const stacks = Math.min(5, actor.passiveStacks);
  for (const { mech, scale } of passiveList(actor)) {
    if (mech === "vs-broken" && broken) bonus += 0.2 * scale * e; // 불균형 적 특화
    if (mech === "vs-status" && afflicted) bonus += 0.15 * scale * e; // 아츠/이상 적 특화
    if (mech === "crystal-burst" && vulnerable) bonus += 0.22 * scale * e; // 취약 적 특화
    if (mech === "blade-stacks" && kind !== "attack") bonus += stacks * 0.06 * scale * e; // 누적 강타
    if (mech === "essence-collapse") bonus += stacks * 0.06 * scale * e; // 본질 붕괴
    if (mech === "flat-power") bonus += 0.08 * scale * e; // 상시 화력
    if (mech === "team-amp") bonus += 0.05 * scale * elite; // 디버퍼/버퍼: 정예화 시 증폭 카드 강화
  }
  return bonus;
}

// 비피해 시전 효과(비기본 스킬): 직군+오퍼 패시브 합산 회복/보호막.
function passivePlayEffect(actor: PartyMember, kind: SkillKind): { heal: number; shield: number } {
  if (kind === "attack") return { heal: 0, shield: 0 };
  let heal = 0;
  let shield = 0;
  for (const { mech, scale } of passiveList(actor)) {
    if (mech === "support-heal") heal += Math.ceil(6 * scale);
    if (mech === "guardian-shield") shield += Math.ceil(8 * scale);
  }
  return { heal, shield };
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

  // ===== 엔드필드 아츠 부착 / 반응 (배틀·연계·궁극 스킬) =====
  // 아츠 오퍼: 자기 원소 부착. 정예화 컨셉 = 아츠 반응/버스트 피해 강화.
  const infl = ELEMENT_INFLICTION[actor.element];
  if (infl && kind !== "attack") {
    const other = statuses.find((s) => ARTS_INFLICTIONS.includes(s) && s !== infl);
    if (other) {
      // 아츠 반응: 두 부착을 소모하고 반응 피해 + 새 원소(반응 효과) 적용. 정예화 +10%/단계.
      statuses = addStatus(withoutStatus(statuses, other), infl);
      damage += Math.ceil(baseDamage * (0.4 + 0.1 * elite));
      notes.push(`아츠 반응 ${INFLICTION_LABEL[other]}→${INFLICTION_LABEL[infl]}${elite ? "↑" : ""}`);
    } else if (statuses.includes(infl)) {
      // 같은 원소 재부착 → 아츠 버스트. 정예화 +8%/단계.
      damage += Math.ceil(baseDamage * (0.25 + 0.08 * elite));
      notes.push(`${INFLICTION_LABEL[infl]} 버스트${elite ? "↑" : ""}`);
    } else {
      statuses = addStatus(statuses, infl);
      notes.push(`${INFLICTION_LABEL[infl]} 부착`);
    }
  }
  return { damage, statuses, notes };
}

function applyGearStats(member: PartyMember): PartyMember {
  const stats = getEquippedGears(member.gear).reduce(
    (total, gear) => {
      const delta = getGearStatDeltas(gear, member.element);
      return {
        attack: total.attack + (delta.attack ?? 0),
        hp: total.hp + (delta.maxHp ?? 0),
        defense: total.defense + (delta.defense ?? 0),
        evasion: total.evasion + (delta.evasion ?? 0),
        battleSkillPower: total.battleSkillPower + (delta.battleSkillPower ?? 0),
        linkSkillPower: total.linkSkillPower + (delta.linkSkillPower ?? 0),
        ultimatePower: total.ultimatePower + (delta.ultimatePower ?? 0),
        critRate: total.critRate + (delta.critRate ?? 0),
        critDamage: total.critDamage + (delta.critDamage ?? 0),
      };
    },
    { attack: 0, hp: 0, defense: 0, evasion: 0, battleSkillPower: 0, linkSkillPower: 0, ultimatePower: 0, critRate: 0, critDamage: 0 },
  );
  const base = getBaseOperator(member.id);
  return {
    ...member,
    maxHp: base.maxHp + stats.hp,
    attack: base.attack + stats.attack,
    defense: base.defense + stats.defense,
    evasion: base.evasion + stats.evasion,
    battleSkillPower: base.battleSkillPower + stats.battleSkillPower,
    linkSkillPower: base.linkSkillPower + stats.linkSkillPower,
    ultimatePower: base.ultimatePower + stats.ultimatePower,
    critRate: Math.min(1, base.critRate + stats.critRate),
    critDamage: base.critDamage + stats.critDamage,
  };
}

function equipGearToMember(member: PartyMember, gear: RunGear): PartyMember {
  const slot = getGearSlot(gear);
  const equipped = applyGearStats({ ...member, gear: { ...member.gear, [slot]: gear } });
  return { ...equipped, hp: Math.min(equipped.maxHp, member.hp + Math.max(0, equipped.maxHp - member.maxHp)) };
}

// ===== 카드 덱빌더 (makeCard/buildDeck/CARD_COST는 data/cards.ts로 분리) =====
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = (seed || 1) & 0x7fffffff;
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
function drawHand(drawPile: Card[], discardPile: Card[], hand: Card[], n: number, seed: number) {
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
function makeIntent(enemy: BattleEnemy, turn: number): BattleEnemy["telegraph"] {
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

function playCardOnState(current: RunState, uid: string, targetEnemyId?: string): RunState {
  const battle = current.battle;
  if (!battle || current.screen !== "battle") return current;
  const card = battle.hand.find((c) => c.uid === uid);
  if (!card || battle.energy < card.cost) return current;
  if (card.tactical) return playTacticalCard(current, card, targetEnemyId);
  const fx = getRelicEffects(current.relics);
  const actor = current.party.find((m) => m.id === card.operatorId && m.hp > 0);
  if (!actor) return current;
  const baseBattle: BattleState = { ...battle, hand: battle.hand.filter((c) => c.uid !== uid), discardPile: [...battle.discardPile, card], energy: battle.energy - card.cost };

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
  // 정예화 단계(0/1/2): 단순 딜이 아니라 오퍼 컨셉 강화에 쓰인다(강타·빌더·갑옷파괴·치명·아츠).
  const elite = card.eliteLevel ?? 0;
  // 재능 crit-surge(자신 치명 +12%) · team-amp(파티 오라, 생존 보유자당 +6% 카드 피해) — 2층 패시브 합산
  const critSurge = passiveList(actor).reduce((s, p) => s + (p.mech === "crit-surge" ? 0.12 * p.scale : 0), 0);
  // 정예화 컨셉: 치명형(crit-surge) 카드는 정예화마다 치명 확률 +6%
  const eliteCrit = hasPassive(actor, "crit-surge") ? elite * 0.06 : 0;
  const teamAmp = current.party.filter((m) => m.hp > 0 && hasPassive(m, "team-amp")).length * 0.06;
  // 유물 효과 + 소비 아이템 전투 버프 + 재능 + 장비 세트 합산
  const setCrit = getSetCrit(actor);
  const setStagger = getSetStagger(actor);
  const isCrit = rollCrit(actor, `${battle.turn}:${card.uid}`, fx.critBonus + (battle.critBuff ?? 0) + critSurge + eliteCrit + setCrit.rate);
  const dmgMult = 1 + fx.damageMult + (battle.dmgBuffPct ?? 0) + teamAmp;
  // 연타(連打): 보유 스택만큼 배틀 스킬 +30~75% / 궁극 +20~50% (소모형)
  const multiHitStacks = Math.min(4, battle.multiHit ?? 0);
  const multiHitBonus = multiHitStacks > 0
    ? (kind === "battle-skill" ? 0.15 * multiHitStacks + 0.15 : kind === "ultimate" ? 0.1 * multiHitStacks + 0.1 : 0)
    : 0;
  const noteSet = new Set<string>();
  if (multiHitBonus > 0) noteSet.add(`연타 +${Math.round(multiHitBonus * 100)}%`);
  let totalDamage = 0;
  let reflectDmg = 0;
  let brokeAny = false;
  let crushedAny = false;
  const damaged = battle.enemies.map((enemy) => {
    if (!targetIds.has(enemy.id) || enemy.hp <= 0) return enemy;
    const mech = kind === "attack"
      ? { damage: card.power, statuses: enemy.statuses, notes: [] as string[] }
      : applySkillMechanic(actor, enemy, card.power, kind, elite);
    // 상태이상 받피증 + 장비 세트 보정(모든 카드) → 재능 보정
    mech.damage = Math.ceil(mech.damage * getStatusBonus(actor, enemy));
    mech.damage = Math.ceil(mech.damage * getSetDamageBonus(actor, enemy, kind));
    mech.damage = Math.ceil(mech.damage * getPassiveDamageBonus(actor, enemy, kind, elite));
    const armorBroken = enemy.statuses.includes("armor-break") && actor.element === "physical"; // 관통(Breach) 받피증
    const linkCombo = kind === "link-skill" && enemy.statuses.includes("defense-break");
    const shatter = actor.element === "physical" && enemy.statuses.includes("freeze"); // 쇄빙(Shatter)
    const weak = getEnemyWeakness(enemy.faction) === actor.element; // 세력 원소 약점
    mech.damage = Math.ceil(mech.damage * dmgMult * (1 + multiHitBonus) * defenseFactor(enemy.defense) * (enemy.statuses.includes("defense-break") ? IMBALANCE_DAMAGE_TAKEN : 1) * (linkCombo ? LINK_COMBO_AMP : 1) * (armorBroken ? ARMOR_BREAK_AMP : 1) * (shatter ? SHATTER_AMP : 1) * (weak ? WEAKNESS_AMP : 1) * (isCrit ? 1 + actor.critDamage + setCrit.dmg : 1));
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
    const staggerAdd = alreadyBroken ? 0 : Math.round(card.stagger * setStagger) + (shouldInterruptEnemy(enemy, kind) ? STAGGER_INTERRUPT_BONUS : 0);
    const nextStagger = Math.min(enemy.staggerHp, enemy.stagger + staggerAdd);
    let statuses = mech.statuses;
    if (shatter) statuses = withoutStatus(statuses, "freeze"); // 쇄빙: 동결 해제
    let breakTurns = enemy.breakTurns;
    let staggerFinal = nextStagger;
    const forcedBreak = statuses.includes("defense-break") && !alreadyBroken;
    const gaugeBreak = !alreadyBroken && enemy.staggerHp > 0 && nextStagger >= enemy.staggerHp;
    if ((gaugeBreak || forcedBreak) && hp > 0) { statuses = addStatus(statuses, "defense-break"); breakTurns = BREAK_TURNS; staggerFinal = enemy.staggerHp; brokeAny = true; noteSet.add("불균형!"); }
    // 물리 이상 세분화(엔드필드): 띄우기/넘어뜨리기=스택 적립(+방불 적에 120%·CC), 강타=전소모 대량딜, 갑옷파괴=전소모+관통.
    let physBreakStacks = enemy.physBreakStacks;
    let armorBreakTurns = enemy.armorBreakTurns;
    let ccDelay = false;
    if (hp > 0 && actor.element === "physical" && kind !== "attack") {
      const anomaly = actor.physAnomaly ?? (actor.physBreak === "consume" ? "crush" : actor.physBreak === "build" ? "launch" : undefined);
      if (anomaly === "launch" || anomaly === "knockdown") {
        // 정예화 컨셉(빌더): 2차 시 방어 불능 +1 추가 적립
        const add = PHYS_BREAK_BUILD[kind] + (elite >= 2 ? 1 : 0);
        if (add > 0) {
          const wasVuln = physBreakStacks > 0;
          physBreakStacks = Math.min(MAX_PHYS_BREAK_STACKS, physBreakStacks + add);
          noteSet.add(`취약 ${physBreakStacks}${elite >= 2 ? "↑" : ""}`);
          if (wasVuln) { // 방어 불능 적에게 띄우기/넘어뜨리기 발동 → 추가 물리 + 불균형 10 + 행동 지연
            const bonus = Math.ceil(card.power * 0.2);
            hp = Math.max(0, hp - bonus);
            totalDamage += bonus;
            staggerFinal = Math.min(enemy.staggerHp, staggerFinal + 10);
            ccDelay = true;
            noteSet.add(`${anomaly === "launch" ? "띄우기" : "넘어뜨리기"} ${bonus}`);
          }
        }
      } else if (anomaly === "crush" && physBreakStacks > 0) {
        // 정예화 컨셉(강타): 스택당 계수 0.5 → 0.6 → 0.7
        const crush = Math.ceil(card.power * (0.5 + 0.1 * elite) * physBreakStacks);
        hp = Math.max(0, hp - crush);
        totalDamage += crush;
        physBreakStacks = 0;
        crushedAny = true; // 본질 붕괴 트리거
        noteSet.add(`강타 ${crush}${elite ? "↑" : ""}`);
      } else if (anomaly === "armor-break" && physBreakStacks > 0) {
        // 정예화 컨셉(갑옷 파괴): 계수·관통 지속 강화
        const ab = Math.ceil(card.power * (0.25 + 0.05 * elite) * physBreakStacks);
        hp = Math.max(0, hp - ab);
        totalDamage += ab;
        armorBreakTurns = 2 + physBreakStacks + elite; // 정예화: 관통 지속 +1턴/단계
        statuses = addStatus(statuses, "armor-break");
        physBreakStacks = 0;
        crushedAny = true;
        noteSet.add(`갑옷 파괴 ${ab} · 관통`);
      }
    }
    return { ...enemy, hp, statuses, stagger: staggerFinal, breakTurns, physBreakStacks, armorBreakTurns, actionGauge: ccDelay ? Math.max(0, enemy.actionGauge - 2) : enemy.actionGauge };
  });
  const revival = reviveEnemies(damaged);
  revival.notes.forEach((n) => noteSet.add(n));
  const after = revival.enemies;
  // 처형: 불균형 돌파 시 에너지 회복. energy-surge 재능 +1(정예화 2차 시 +2), breakEnergy 세트 +1.
  const surge = hasPassive(actor, "energy-surge");
  const gearSurge = hasBreakEnergySet(actor);
  const breakEnergy = brokeAny ? 1 + (surge ? 1 + (elite >= 2 ? 1 : 0) : 0) + (gearSurge ? 1 : 0) : 0;
  const energyBonus = breakEnergy;
  if (reflectDmg > 0) noteSet.add(`반사 -${reflectDmg}`);
  if (brokeAny) noteSet.add(`처형 — 에너지 +${breakEnergy}`);
  const peRaw = passivePlayEffect(actor, kind); // 재능: support-heal / guardian-shield
  // 정예화 컨셉(서포터): 재능 회복·보호막 +20%/단계
  const pe = { heal: Math.round(peRaw.heal * (1 + 0.2 * elite)), shield: Math.round(peRaw.shield * (1 + 0.2 * elite)) };
  if (pe.heal > 0) noteSet.add(`재능 회복 +${pe.heal}`);
  if (pe.shield > 0) noteSet.add(`재능 보호막 +${pe.shield}`);
  // 연타: 소모 시 0, 부여 오퍼(아케쿠리 등)가 스킬 사용 시 +1 (다음 배틀/궁극에 적용)
  const grantMultiHit = actor.grantsMultiHit && kind !== "attack" ? 1 : 0;
  const nextMultiHit = Math.min(4, (multiHitBonus > 0 ? 0 : multiHitStacks) + grantMultiHit);
  if (grantMultiHit > 0) noteSet.add(`연타 부여 → ${nextMultiHit}`);
  const note = noteSet.size ? ` (${[...noteSet].join(", ")})` : "";
  const logLine = `${actor.name}: ${card.name} → ${aoe ? "모든 적" : target.name} ${totalDamage} 피해${note}`;
  const nextBattle: BattleState = { ...baseBattle, enemies: after, energy: baseBattle.energy + energyBonus, multiHit: nextMultiHit, log: [logLine, ...battle.log].slice(0, 8) };
  // 시전 오퍼: 반사 피해 + blade-stacks 적립 / 재능 회복·보호막은 파티 전체에 적용.
  const party = current.party.map((m) => {
    if (m.hp <= 0) return m;
    let next = m;
    if (m.id === actor.id) {
      if (reflectDmg > 0) next = absorbHit(next, reflectDmg);
      if (hasPassive(actor, "blade-stacks") && kind !== "attack") next = { ...next, passiveStacks: Math.min(5, next.passiveStacks + 1) };
      if (actor.passiveMechanic === "essence-collapse" && crushedAny) next = { ...next, passiveStacks: Math.min(5, next.passiveStacks + 1) }; // 본질 붕괴: 분쇄 시 공격력 누적
    }
    if (pe.heal > 0) next = { ...next, hp: Math.min(next.maxHp, next.hp + pe.heal) };
    if (pe.shield > 0) next = { ...next, shield: next.shield + pe.shield };
    return next;
  });
  if (party.every((m) => m.hp <= 0)) return { ...current, party, battle: { ...nextBattle, log: ["전멸 — 반사 피해", ...nextBattle.log].slice(0, 8) }, screen: "summary", result: "defeat" };
  if (after.every((e) => e.hp <= 0)) return finishBattle({ ...current, party }, nextBattle);
  return advanceTempo({ ...current, party, battle: nextBattle }, 1);
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
function endTurnOnState(current: RunState): RunState {
  const battle = current.battle;
  if (!battle || current.screen !== "battle") return current;
  const afterEnemies = advanceTempo(current, 1);
  if (afterEnemies.screen !== "battle" || !afterEnemies.battle) return afterEnemies;
  const b = afterEnemies.battle;
  let party = afterEnemies.party;
  const turn = b.turn + 1;
  const relicFx = getRelicEffects(afterEnemies.relics);
  const handSize = Math.max(2, HAND_SIZE + relicFx.handBonus);
  const drawn = drawHand(b.drawPile, [...b.discardPile, ...b.hand], [], handSize, turn * 31 + b.enemies.length);
  const regen = b.partyRegen;
  const regenActive = regen && regen.turns > 0;
  if (regenActive) party = healParty(party, regen.amount);
  const nextRegen = regenActive ? (regen.turns - 1 > 0 ? { amount: regen.amount, turns: regen.turns - 1 } : undefined) : regen;
  const regenLog = regenActive ? [`지속 회복 +${regen!.amount}`] : [];
  // 아츠 DoT: 연소·부식 적은 매 턴 시작 시 지속 피해(부식은 강함).
  let dotTotal = 0;
  const enemies = b.enemies.map((e) => {
    if (e.hp <= 0) return { ...e, telegraph: makeIntent(e, turn) };
    let dot = 0;
    if (e.statuses.includes("combustion")) dot += DOT_DAMAGE;
    if (e.statuses.includes("corrosion")) dot += DOT_DAMAGE + 2;
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
      const e: BattleEnemy = { ...boss, hp: boss.maxHp, statuses: [], actionGauge: 0, actionEvery: every, stagger: 0, physBreakStacks: 0 };
      const enemy = { ...e, telegraph: makeIntent(e, 1) };
      const party = fx.startShield > 0 ? bs.party.map((m) => ({ ...m, shield: m.shield + fx.startShield })) : bs.party;
      const deck = buildDeck(party, snap.deck, { battle: true });
      const maxEnergy = ENERGY_PER_TURN + fx.maxEnergyBonus;
      const handSize = HAND_SIZE + fx.handBonus;
      const drawn = drawHand(shuffle(deck, 17), [], [], handSize, 11);
      return { ...current, party, relics: snap.relics, sp: bs.sp, maxSp: snap.maxSp, challengeBossId: bossId, challengeTurns: undefined, screen: "battle", battle: { enemies: [enemy], hand: drawn.hand, drawPile: drawn.drawPile, discardPile: [], energy: maxEnergy + fx.startEnergy + bs.startEnergy, maxEnergy, turn: 1, log: [`보스 도전 — ${boss.name}`] } };
    });
  }, []);
  const confirmDeployment = useCallback((operatorIds: string[]) => setState((current) => {
    const party = freshParty(operatorIds);
    const sd = startingDeck(0, party); // 시작 덱을 선택한 파티의 기본 카드(기본공격+방어)로 재구성
    return { ...current, party, deck: sd.deck, deckSeq: sd.seq, screen: "map", availableNodes: current.availableNodes.length > 0 ? current.availableNodes : getFactionStart(current.factionIndex) };
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
      const battleParty = fx.startShield > 0 ? battleStartRaw.party.map((m) => (m.hp > 0 ? { ...m, shield: m.shield + fx.startShield } : m)) : battleStartRaw.party;
      const startEnemies = getEnemies(node.enemyIds ?? []).map((enemy, i) => {
        const every = enemyActionEvery(enemy);
        // 초기 게이지를 적마다 살짝 어긋나게(동시 행동 방지). 첫 행동까지 최소 1장.
        const e: BattleEnemy = { ...enemy, hp: enemy.maxHp, statuses: [], actionGauge: Math.min(i, every - 1), actionEvery: every, stagger: 0, physBreakStacks: 0 };
        return { ...e, telegraph: makeIntent(e, 1) };
      });
      const deck = buildDeck(battleParty, current.deck, { battle: true });
      const maxEnergy = ENERGY_PER_TURN + fx.maxEnergyBonus;
      const handSize = HAND_SIZE + fx.handBonus;
      const drawn = drawHand(shuffle(deck, startEnemies.length * 7 + current.battlesWon + 3), [], [], handSize, 11);
      const relicLog = fx.startShield > 0 || fx.startEnergy > 0 ? [`유물 발동 — ${[fx.startShield > 0 ? `보호막 +${fx.startShield}` : "", fx.startEnergy > 0 ? `에너지 +${fx.startEnergy}` : ""].filter(Boolean).join(" · ")}`] : [];
      return { ...base, party: battleParty, sp: battleStartRaw.sp, screen: "battle", battle: { enemies: startEnemies, hand: drawn.hand, drawPile: drawn.drawPile, discardPile: [], energy: maxEnergy + fx.startEnergy + battleStartRaw.startEnergy, maxEnergy, turn: 1, log: [...relicLog, `${node.title}에서 적과 조우했습니다.`] } };
    });
  }, []);

  const playCard = useCallback((uid: string, targetEnemyId?: string) => {
    setState((current) => playCardOnState(current, uid, targetEnemyId));
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

  return { ...state, startRun, confirmDeployment, abandonRun, enterNode, playCard, endTurn, equipRewardGear, takeCardOffer, skipCardOffer, usePotion, buyGear, removeCard, buyRelic, buyPotion, upgradeCard, promoteCard, skipPromote, duplicateCard, skipDuplicate, repairRest, repairUpgrade, saveDeck, openChallenge, startChallenge, exitChallenge, skipReward, resolveEvent, rest, continueToMap };
}
