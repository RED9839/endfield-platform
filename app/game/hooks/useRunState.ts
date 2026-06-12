"use client";

import { useCallback, useState } from "react";

import { getEnemies } from "../data/enemies";
import { events } from "../data/events";
import {
  chooseGearRewards,
  getActiveThreePieceSets,
  getEquippedGears,
  getGameGear,
  getGearSellValue,
  getGearStatDeltas,
  getGearSlot,
} from "../data/game-gears";
import { getMapNode, startingNodeIds } from "../data/maps";
import { startingParty } from "../data/operators";
import type {
  BattleEnemy,
  BattleState,
  EnemyStatus,
  GameEventChoice,
  GearLoadout,
  Operator,
  PartyMember,
  RunActions,
  RunGear,
  RunState,
  SkillKind,
  TimelineEntry,
  UnitSide,
} from "../types/game";

const ACTION_COST: Record<SkillKind, number> = {
  attack: 100,
  "battle-skill": 115,
  "link-skill": 90,
  ultimate: 140,
};
const ENEMY_ACTION_COST = 100;
const READY_GAUGE = 100;
const REAL_TIME_TICK = 0.025;
const EVASION_CAP = 25;
const ARTS_ATTACHMENT_STATUSES: EnemyStatus[] = [
  "originium-crystal",
  "electric-attachment",
  "corrosion",
];

function getBaseOperator(operatorId: string): Operator {
  const operator = startingParty.find((item) => item.id === operatorId);
  if (!operator) throw new Error(`Unknown starting operator: ${operatorId}`);
  return operator;
}

function freshParty(): PartyMember[] {
  return startingParty.map((operator) => ({
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
  return {
    screen: "deployment",
    party: freshParty(),
    collectedGears: [],
    visitedNodes: [],
    availableNodes: startingNodeIds,
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

function resetPartyActionGauges(party: PartyMember[]) {
  return party.map((member) => ({
    ...member,
    actionGauge: 0,
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
  return {
    ...member,
    shield: member.shield - blocked,
    hp: Math.max(0, member.hp - (amount - blocked)),
  };
}

function activeSets(member: PartyMember) {
  return getActiveThreePieceSets(member.gear);
}

function hasSet(member: PartyMember, setName: string) {
  return activeSets(member).includes(setName);
}

function didEvade(member: PartyMember, battleTurn: number, enemyId: string) {
  const chance = Math.max(0, Math.min(EVASION_CAP, member.evasion));
  const seed = `${member.id}:${enemyId}:${battleTurn}:${member.actionGauge}`;
  const roll = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100;
  return roll < chance;
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

  return {
    damage: Math.max(1, nextDamage),
    notes,
  };
}

function shouldInterruptEnemy(enemy: BattleEnemy, kind: SkillKind) {
  if (kind === "attack") return false;
  return (
    enemyHas(enemy, "charge") ||
    enemyHas(enemy, "grab") ||
    enemyHas(enemy, "evasive") ||
    enemyHas(enemy, "shield") ||
    enemyHas(enemy, "boss-shield")
  );
}

function reviveEnemies(enemies: BattleEnemy[]) {
  const notes: string[] = [];
  const revived = enemies.map((enemy) => {
    if (enemy.hp > 0 || !enemyHas(enemy, "revive") || enemy.revived) return enemy;
    notes.push(`${enemy.name} revive`);
    return {
      ...enemy,
      hp: Math.max(1, Math.ceil(enemy.maxHp * 0.35)),
      revived: true,
      statuses: withoutStatus(enemy.statuses, "defense-break"),
    };
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

  return {
    damage,
    notes,
    targetAll:
      enemyHas(actor, "rockfall") ||
      (enemyHas(actor, "flame") && battleTurn % 4 === 0) ||
      selfDestruct,
    gaugeDelay:
      (enemyHas(actor, "grab") ? 35 : 0) +
      (enemyHas(actor, "bind") ? 30 : 0) +
      (enemyHas(actor, "cold") ? 25 : 0) +
      (enemyHas(actor, "smoke") ? 18 : 0),
    selfDestruct,
    healsAllies: enemyHas(actor, "healer") || (enemyHas(actor, "summoner") && battleTurn % 4 === 0),
  };
}

function getStatusBonus(actor: PartyMember, target: BattleEnemy) {
  let bonus = 1;
  if (actor.element === "physical" && target.statuses.includes("originium-crystal")) bonus += 0.2;
  if (actor.element === "electric" && target.statuses.includes("shock")) bonus += 0.3;
  if (actor.element === "electric" && target.statuses.includes("electric-attachment")) bonus += 0.15;
  if (hasSet(actor, "응룡 50식") && target.statuses.includes("defense-break")) bonus += 0.18;
  if (hasSet(actor, "본 크러셔") && target.statuses.includes("defense-break")) bonus += 0.2;
  if (hasSet(actor, "조류의 물결") && target.statuses.includes("shock")) bonus += 0.18;
  if (hasSet(actor, "열 작업용") && target.statuses.length > 0) bonus += 0.15;
  if (hasSet(actor, "아부레이의 메아리")) bonus += 0.08;
  return bonus;
}

function getPassiveDamageBonus(actor: PartyMember, target: BattleEnemy, kind: SkillKind) {
  let bonus = 1;
  if (actor.passiveMechanic === "essence-collapse" && target.statuses.includes("originium-crystal")) {
    bonus += 0.2;
  }
  if (actor.passiveMechanic === "obliteration-protocol" && target.statuses.includes("defense-break")) {
    bonus += 0.3;
  }
  if (actor.passiveMechanic === "blade-cut" && kind !== "attack") {
    bonus += Math.min(5, actor.passiveStacks) * 0.08;
  }
  return bonus;
}

function hasArtsAttachment(enemy: BattleEnemy) {
  return enemy.statuses.some((status) => ARTS_ATTACHMENT_STATUSES.includes(status));
}

function getLinkTarget(actor: PartyMember, battle: BattleState) {
  if (actor.linkCondition === "defense-break") {
    return battle.enemies.find((enemy) => enemy.hp > 0 && enemy.statuses.includes("defense-break"));
  }

  const windowTarget = battle.linkWindow?.targetEnemyId
    ? battle.enemies.find((enemy) => enemy.id === battle.linkWindow?.targetEnemyId && enemy.hp > 0)
    : undefined;
  return windowTarget ?? battle.enemies.find((enemy) => enemy.hp > 0);
}

function canUseLinkSkill(actor: PartyMember, battle: BattleState) {
  const target = getLinkTarget(actor, battle);
  if (!target) return false;

  if (actor.linkCondition === "ally-link-damage") {
    return (
      battle.linkWindow?.trigger === "ally-link-damage" &&
      battle.linkWindow.sourceOperatorId !== actor.id
    );
  }
  if (actor.linkCondition === "strong-hit") return battle.linkWindow?.trigger === "strong-hit";
  if (actor.linkCondition === "defense-break") return target.statuses.includes("defense-break");
  if (actor.linkCondition === "strong-hit-vs-clean") {
    return (
      battle.linkWindow?.trigger === "strong-hit" &&
      !target.statuses.includes("defense-break") &&
      !hasArtsAttachment(target)
    );
  }
  return battle.linkWindow?.trigger === "ally-hit";
}

function applySkillMechanic(actor: PartyMember, target: BattleEnemy, baseDamage: number, kind: SkillKind) {
  let damage = baseDamage;
  let statuses = target.statuses;
  const notes: string[] = [];
  const sets = activeSets(actor);

  if (sets.includes("개척") && kind === "battle-skill") {
    damage += Math.ceil(actor.attack * 0.3);
    notes.push("개척 3세트");
  }
  if (sets.includes("응룡 50식") && kind === "link-skill") {
    damage += Math.ceil(actor.attack * 0.35);
    notes.push("응룡 3세트");
  }
  if (sets.includes("청파") && kind === "ultimate") {
    damage += Math.ceil(actor.attack * 0.45);
    notes.push("청파 3세트");
  }
  if (sets.includes("검술사") && kind === "attack") {
    damage += Math.ceil(actor.attack * 0.25);
    notes.push("검술사 3세트");
  }
  if (sets.includes("아부레이의 메아리") && kind !== "attack") {
    damage += Math.ceil(actor.attack * 0.25);
    notes.push("아부레이 3세트");
  }

  if (actor.skillMechanic === "originium-crystal") {
    if (kind === "link-skill" && statuses.includes("originium-crystal")) {
      statuses = withoutStatus(statuses, "originium-crystal");
      damage += Math.ceil(baseDamage * 0.35);
      notes.push("crystal shatter");
    }
    if (kind === "battle-skill") {
      statuses = addStatus(statuses, "originium-crystal");
      notes.push("crystal attached");
    }
  }

  if (actor.skillMechanic === "electric-attachment") {
    if (kind === "battle-skill") {
      statuses = addStatus(statuses, "electric-attachment");
      notes.push("electric attached");
    }
    if (kind === "link-skill") {
      statuses = addStatus(withoutStatus(statuses, "electric-attachment"), "shock");
      damage += 4;
      notes.push("shock chain");
    }
  }

  if (actor.skillMechanic === "combo-strike") {
    damage += Math.ceil(baseDamage * 0.18);
    if (kind !== "attack") notes.push("blade stack");
  }

  if (actor.skillMechanic === "protective-arts") {
    damage += kind === "ultimate" ? 5 : 2;
    notes.push("protective arts");
  }

  if (actor.skillMechanic === "corrosion-support") {
    if (kind === "link-skill") {
      statuses = addStatus(statuses, "corrosion");
      notes.push("corrosion");
    }
    if (kind === "battle-skill" && statuses.includes("corrosion")) {
      statuses = withoutStatus(statuses, "corrosion");
      statuses = addStatus(statuses, "defense-break");
      damage += 5;
      notes.push("corrosion burst");
    }
    if (kind === "ultimate") {
      notes.push("친구의 그림자");
    }
  }

  return { damage, statuses, notes };
}

function applyGearStats(member: PartyMember): PartyMember {
  const gear = getEquippedGears(member.gear);
  const stats = getGearStatDeltas(gear);
  return {
    ...member,
    maxHp: getBaseOperator(member.id).maxHp + stats.hp,
    attack: getBaseOperator(member.id).attack + stats.attack,
    defense: getBaseOperator(member.id).defense + stats.defense,
    evasion: getBaseOperator(member.id).evasion + stats.evasion,
    speed: getBaseOperator(member.id).speed + stats.speed,
  };
}

function equipGearToMember(member: PartyMember, gear: RunGear): PartyMember {
  const slot = getGearSlot(gear, member.gear.kit1, member.gear.kit2);
  const equipped = applyGearStats({
    ...member,
    gear: {
      ...member.gear,
      [slot]: gear,
    },
  });
  return {
    ...equipped,
    hp: Math.min(equipped.maxHp, member.hp + Math.max(0, equipped.maxHp - member.maxHp)),
  };
}

function spendGauge<T extends { actionGauge: number }>(unit: T, amount: number): T {
  return {
    ...unit,
    actionGauge: Math.max(0, unit.actionGauge - amount),
  };
}

function tickCombatGauges(party: PartyMember[], enemies: BattleEnemy[], lockedPartyId?: string) {
  const livingParty = party.filter((member) => member.hp > 0);
  const livingEnemies = enemies.filter((enemy) => enemy.hp > 0);
  const nextParty = party.map((member) =>
    member.hp <= 0 || member.id === lockedPartyId
      ? member
      : { ...member, actionGauge: Math.min(READY_GAUGE, member.actionGauge + member.speed * REAL_TIME_TICK) },
  );
  const nextEnemies = enemies.map((enemy) =>
    enemy.hp <= 0 ? enemy : { ...enemy, actionGauge: Math.min(READY_GAUGE, enemy.actionGauge + enemy.speed * REAL_TIME_TICK) },
  );
  const timeline: TimelineEntry[] = [
    ...nextParty
      .filter((member) => member.hp > 0)
      .map((member) => ({ id: member.id, name: member.name, side: "party" as UnitSide, gauge: member.actionGauge })),
    ...nextEnemies
      .filter((enemy) => enemy.hp > 0)
      .map((enemy) => ({ id: enemy.id, name: enemy.name, side: "enemy" as UnitSide, gauge: enemy.actionGauge })),
  ]
    .sort((a, b) => b.gauge - a.gauge)
    .slice(0, 8);

  if (livingParty.length === 0 || livingEnemies.length === 0) {
    return { party: nextParty, enemies: nextEnemies, timeline };
  }

  const readyParty = nextParty.find((member) => member.hp > 0 && member.actionGauge >= READY_GAUGE);
  if (readyParty) {
    return {
      party: nextParty,
      enemies: nextEnemies,
      activeSide: "party" as UnitSide,
      activeUnitId: readyParty.id,
      timeline,
    };
  }

  const readyEnemy = nextEnemies.find((enemy) => enemy.hp > 0 && enemy.actionGauge >= READY_GAUGE);
  if (readyEnemy) {
    return {
      party: nextParty,
      enemies: nextEnemies,
      activeSide: "enemy" as UnitSide,
      activeUnitId: readyEnemy.id,
      timeline,
    };
  }

  return { party: nextParty, enemies: nextEnemies, timeline };
}

function resolveAutomaticBattleTurns(state: RunState) {
  let current = state;

  for (let safety = 0; safety < 6; safety += 1) {
    if (!current.battle || current.screen !== "battle") return current;
    if (current.battle.activeSide === "party" && current.battle.activeUnitId) return current;

    const ticked = tickCombatGauges(current.party, current.battle.enemies);
    const battle = current.battle;
    const activated = {
      ...ticked,
      activeSide: ticked.activeSide ?? battle.activeSide,
      activeUnitId: ticked.activeUnitId ?? battle.activeUnitId,
    };

    current = {
      ...current,
      party: activated.party,
      battle: {
        ...battle,
        enemies: activated.enemies,
        activeUnitId: activated.activeUnitId,
        activeSide: activated.activeSide,
        timeline: activated.timeline,
      },
    };

    if (activated.activeSide !== "enemy" || !activated.activeUnitId) return current;

    const activeBattle = current.battle;
    if (!activeBattle) return current;
    const actor = activeBattle.enemies.find((enemy) => enemy.id === activated.activeUnitId);
    if (!actor || actor.hp <= 0) return current;

    const livingParty = current.party.filter((member) => member.hp > 0);
    const action = buildEnemyAction(actor, activeBattle.turn);
    const targets = action.targetAll
      ? livingParty
      : [
          enemyHas(actor, "ranged") || enemyHas(actor, "sniper")
            ? livingParty.reduce((lowest, member) => (member.hp < lowest.hp ? member : lowest), livingParty[0])
            : livingParty.reduce((lowest, member) => (member.shield < lowest.shield ? member : lowest), livingParty[0]),
        ];
    if (targets.length === 0) return current;

    let totalHit = 0;
    const evadedNames: string[] = [];
    const targetIds = new Set(targets.map((target) => target.id));
    const partyAfterHit = current.party.map((member) => {
      if (!targetIds.has(member.id) || member.hp <= 0) return member;
      const evaded = didEvade(member, activeBattle.turn, actor.id);
      if (evaded) {
        evadedNames.push(member.name);
        return member;
      }
      const defenseDivider = enemyHas(actor, "acid") ? 70 : 40;
      const hit = Math.max(1, action.damage - Math.floor(member.defense / defenseDivider));
      totalHit += hit;
      const damaged = absorbHit(member, hit);
      return action.gaugeDelay > 0
        ? { ...damaged, actionGauge: damaged.actionGauge - action.gaugeDelay }
        : damaged;
    });
    const enemiesAfterAction = activeBattle.enemies.map((enemy) => {
      if (enemy.id === actor.id) {
        return {
          ...spendGauge(enemy, ENEMY_ACTION_COST),
          hp: action.selfDestruct ? 0 : enemy.hp,
        };
      }
      if (action.healsAllies && enemy.hp > 0) {
        return { ...enemy, hp: Math.min(enemy.maxHp, enemy.hp + Math.ceil(enemy.maxHp * 0.08)) };
      }
      return enemy;
    });
    const defeated = partyAfterHit.every((member) => member.hp <= 0);
    const targetLabel = action.targetAll ? "all allies" : targets[0]?.name;
    const note = action.notes.length > 0 ? ` (${action.notes.join(", ")})` : "";
    const evadeNote = evadedNames.length > 0 ? ` evade: ${evadedNames.join(", ")}.` : "";
    const enemyLog = `${actor.name}: ${targetLabel} ${totalHit} damage${note}.${evadeNote}`;

    current = {
      ...current,
      party: partyAfterHit,
      screen: defeated ? "summary" : "battle",
      result: defeated ? "defeat" : current.result,
      battle: {
        ...activeBattle,
        enemies: enemiesAfterAction,
        linkWindow: { trigger: "ally-hit" },
        turn: activeBattle.turn + 1,
        log: [enemyLog, ...activeBattle.log].slice(0, 8),
      },
    };

    if (defeated) return current;
  }

  return current;
}

export function useRunState(): RunState & RunActions {
  const [state, setState] = useState<RunState>(initialState);

  const startRun = useCallback(() => setState(initialState()), []);

  const startDeployment = useCallback(() => {
    setState((current) => ({
      ...current,
      screen: "map",
      availableNodes: current.availableNodes.length > 0 ? current.availableNodes : startingNodeIds,
    }));
  }, []);

  const abandonRun = useCallback(() => {
    setState((current) => ({
      ...current,
      screen: "summary",
      result: "abandoned",
    }));
  }, []);

  const enterNode = useCallback((nodeId: string) => {
    setState((current) => {
      if (!current.availableNodes.includes(nodeId)) return current;
      const node = getMapNode(nodeId);
      const base = {
        ...current,
        currentNodeId: nodeId,
        visitedNodes: [...current.visitedNodes, nodeId],
        availableNodes: [],
      };

      if (node.type === "event") {
        const event = events[current.visitedNodes.length % events.length];
        return { ...base, screen: "event", eventId: event.id };
      }

      if (node.type === "shop") {
        return {
          ...base,
          screen: "reward",
          pendingGearSlugs: chooseGearRewards(
            current.battlesWon + 1,
            3,
            node.rewardTier ?? "mid",
          ),
        };
      }

      if (node.type === "camp") return { ...base, screen: "camp" };

      const battleStart = applyBattleStartSetEffects(resetPartyActionGauges(current.party), current.sp, current.maxSp);

      return resolveAutomaticBattleTurns({
        ...base,
        party: battleStart.party,
        sp: battleStart.sp,
        screen: "battle",
        battle: {
          enemies: getEnemies(node.enemyIds ?? []).map((enemy) => ({
            ...enemy,
            hp: enemy.maxHp,
            statuses: [],
            actionGauge: 0,
          })),
          timeline: [],
          turn: 1,
          log: [`${node.title}에서 적과 조우했습니다.`],
        },
      });
    });
  }, []);

  const tickBattle = useCallback(() => {
    setState((current) => {
      if (!current.battle || current.screen !== "battle") return current;
      if (current.battle.activeSide === "party" && current.battle.activeUnitId) return current;

      const ticked = tickCombatGauges(
        current.party,
        current.battle.enemies,
        current.battle.activeSide === "party" ? current.battle.activeUnitId : undefined,
      );

      return resolveAutomaticBattleTurns({
        ...current,
        party: ticked.party,
        battle: {
          ...current.battle,
          enemies: ticked.enemies,
        },
      });
    });
  }, []);

  const performAction = useCallback((operatorId: string, kind: SkillKind) => {
    setState((current) => {
      if (!current.battle || current.screen !== "battle") return current;
      const actor = current.party.find((member) => member.id === operatorId);
      const target =
        actor && kind === "link-skill"
          ? getLinkTarget(actor, current.battle)
          : current.battle.enemies.find((enemy) => enemy.hp > 0);
      if (!actor || !target || actor.hp <= 0) return current;
      if (current.battle.activeSide !== "party" || current.battle.activeUnitId !== operatorId) return current;
      if (kind === "battle-skill" && current.sp < actor.battleSkillCost) return current;
      if (kind === "link-skill" && current.cp < actor.linkSkillCost) return current;
      if (kind === "link-skill" && !canUseLinkSkill(actor, current.battle)) return current;
      if (kind === "ultimate" && actor.ultimateCharge < 100) return current;
      const actionCost = ACTION_COST[kind];

      const baseDamage =
        kind === "attack"
          ? actor.attack
          : kind === "battle-skill"
            ? actor.battleSkillPower
            : kind === "link-skill"
              ? actor.linkSkillPower
              : actor.ultimatePower;
      const actionHitsAll =
        kind === "ultimate" && actor.id !== "chenqianyu" ||
        kind === "link-skill" && actor.skillMechanic === "electric-attachment";
      const targetIds = new Set(
        actionHitsAll
          ? current.battle.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => enemy.id)
          : [target.id],
      );
      let totalDamage = 0;
      const noteSet = new Set<string>();
      const damagedEnemies = current.battle.enemies.map((enemy) =>
        targetIds.has(enemy.id)
          ? (() => {
              const mechanic =
                kind === "attack"
                  ? {
                      damage: Math.ceil(baseDamage * getStatusBonus(actor, enemy)),
                      statuses: enemy.statuses,
                      notes: activeSets(actor).includes("펄스식") ? ["펄스식 3세트"] : [],
                    }
                  : applySkillMechanic(actor, enemy, baseDamage, kind);
              mechanic.damage = Math.ceil(mechanic.damage * getPassiveDamageBonus(actor, enemy, kind));
              const enemyDamage = getEnemyDamageTaken(enemy, mechanic.damage, kind);
              mechanic.notes.forEach((note) => noteSet.add(note));
              enemyDamage.notes.forEach((note) => noteSet.add(note));
              if (shouldInterruptEnemy(enemy, kind)) noteSet.add("interrupt");
              totalDamage += enemyDamage.damage;
              const hp = Math.max(0, enemy.hp - enemyDamage.damage);
              const statuses = shouldInterruptEnemy(enemy, kind)
                ? addStatus(mechanic.statuses, "defense-break")
                : kind === "attack" && hp > 0 && hp <= enemy.maxHp / 2
                  ? addStatus(mechanic.statuses, "defense-break")
                  : mechanic.statuses;
              return {
                ...enemy,
                hp,
                statuses,
              };
            })()
          : enemy,
      );
      const revival = reviveEnemies(damagedEnemies);
      revival.notes.forEach((note) => noteSet.add(note));
      const enemiesAfterAction = revival.enemies;
      const actionLabel =
        kind === "battle-skill"
          ? actor.battleSkillName
          : kind === "link-skill"
            ? actor.linkSkillName
            : kind === "ultimate"
              ? actor.ultimateName
              : "기본 공격";
      const hitLabel = actionHitsAll ? "모든 적" : target.name;
      const note = noteSet.size > 0 ? ` (${Array.from(noteSet).join(", ")})` : "";
      const actionLog = `${actor.name}: ${actionLabel}으로 ${hitLabel}에게 총 ${totalDamage} 피해${note}.`;
      const allDefeated = enemiesAfterAction.every((enemy) => enemy.hp <= 0);
      const linkWindow =
        kind === "attack"
          ? { trigger: "strong-hit" as const, sourceOperatorId: actor.id, targetEnemyId: target.id }
          : kind === "link-skill"
            ? { trigger: "ally-link-damage" as const, sourceOperatorId: actor.id, targetEnemyId: target.id }
            : undefined;
      const spAfterAction =
        kind === "attack"
          ? Math.min(current.maxSp, current.sp + 1)
          : kind === "battle-skill"
            ? current.sp - actor.battleSkillCost
            : actor.skillMechanic === "protective-arts" && kind === "link-skill"
              ? Math.min(current.maxSp, current.sp + 1)
              : current.sp;
      const cpAfterAction =
        kind === "battle-skill"
          ? Math.min(current.maxCp, current.cp + 1)
          : kind === "link-skill"
            ? current.cp - actor.linkSkillCost
            : current.cp;
      const chargeGain =
        kind === "attack"
          ? activeSets(actor).includes("펄스식") ? 20 : 14
          : kind === "battle-skill"
            ? 24
            : kind === "link-skill"
              ? 18
              : 0;
      const partyAfterCost = current.party.map((member) =>
        member.id === actor.id
          ? {
              ...spendGauge(member, actionCost),
              passiveStacks:
                member.passiveMechanic === "blade-cut" && kind !== "attack"
                  ? Math.min(5, member.passiveStacks + 1)
                  : member.passiveStacks,
              ultimateCharge:
                kind === "ultimate"
                  ? 0
                  : Math.min(100, member.ultimateCharge + chargeGain),
            }
          : member,
      );

      if (allDefeated) {
        const node = getMapNode(current.currentNodeId ?? "");
        const won = current.battlesWon + 1;
        if (node.type === "boss") {
          return {
            ...current,
            party: partyAfterCost,
            sp: spAfterAction,
            cp: cpAfterAction,
            battle: {
              ...current.battle,
              enemies: enemiesAfterAction,
              linkWindow,
              log: [actionLog, ...current.battle.log],
            },
            battlesWon: won,
            screen: "summary",
            result: "victory",
          };
        }
        return {
          ...current,
          party: partyAfterCost,
          sp: spAfterAction,
          cp: cpAfterAction,
          battle: {
            ...current.battle,
            enemies: enemiesAfterAction,
            linkWindow,
            log: [actionLog, ...current.battle.log],
          },
          battlesWon: won,
          screen: "reward",
          credits: current.credits + (node.type === "elite" ? 100 : 55),
          pendingGearSlugs: chooseGearRewards(won, 3, node.rewardTier ?? "early"),
        };
      }

      const supportHeal =
        actor.skillMechanic === "corrosion-support" && kind !== "attack"
          ? kind === "ultimate"
            ? 26
            : kind === "link-skill"
              ? 12
              : noteSet.has("친구의 그림자")
                ? 16
                : 7
          : 0;
      const setHeal = activeSets(actor).includes("생체 보조") && supportHeal > 0 ? 8 : 0;
      const partyWithSupport = supportHeal + setHeal > 0 ? healParty(partyAfterCost, supportHeal + setHeal) : partyAfterCost;
      const party =
        actor.skillMechanic === "protective-arts" && kind !== "attack"
          ? partyWithSupport.map((member) => ({
              ...member,
              shield: member.shield + (kind === "ultimate" ? 18 : member.id === actor.id ? 14 : 8),
            }))
          : partyWithSupport;

      const defeated = party.every((member) => member.hp <= 0);
      const nextState: RunState = {
        ...current,
        party,
        sp: spAfterAction,
        cp: cpAfterAction,
        screen: defeated ? "summary" : "battle",
        result: defeated ? "defeat" : current.result,
        battle: {
          ...current.battle,
          enemies: enemiesAfterAction,
          linkWindow,
          turn: current.battle.turn + 1,
          log: [actionLog, ...current.battle.log].slice(0, 8),
        },
      };
      return defeated ? nextState : resolveAutomaticBattleTurns(nextState);
    });
  }, []);

  const equipRewardGear = useCallback((gearSlug: string, operatorId: string) => {
    setState((current) => {
      const gear = getGameGear(gearSlug);
      const target = current.party.find((member) => member.id === operatorId);
      const slot = target ? getGearSlot(gear, target.gear.kit1, target.gear.kit2) : undefined;
      const replacedGear = target && slot ? target.gear[slot] : undefined;
      const sellCredits = replacedGear ? getGearSellValue(replacedGear) : 0;
      return {
        ...current,
        party: current.party.map((member) =>
          member.id === operatorId ? equipGearToMember(member, gear) : member,
        ),
        collectedGears: [
          ...current.collectedGears.filter((item) => item.slug !== replacedGear?.slug),
          gear,
        ],
        credits: current.credits + sellCredits,
        pendingGearSlugs: [],
        screen: "map",
        availableNodes: getMapNode(current.currentNodeId ?? "").next,
        battle: undefined,
        eventId: undefined,
        sp: current.maxSp,
      };
    });
  }, []);

  const skipReward = useCallback(() => {
    setState((current) => ({
      ...current,
      pendingGearSlugs: [],
      screen: "map",
      availableNodes: current.currentNodeId
        ? getMapNode(current.currentNodeId).next
        : startingNodeIds,
      battle: undefined,
      eventId: undefined,
      sp: current.maxSp,
    }));
  }, []);

  const resolveEvent = useCallback((choiceId: string) => {
    setState((current) => {
      const event = events.find((item) => item.id === current.eventId);
      const choice: GameEventChoice | undefined = event?.choices.find((item) => item.id === choiceId);
      if (!choice) return current;
      let next = current;
      if (choice.hpCost) next = { ...next, party: damageParty(next.party, choice.hpCost) };
      if (choice.heal) next = { ...next, party: healParty(next.party, choice.heal) };
      if (choice.credits) next = { ...next, credits: next.credits + choice.credits };
      if (choice.gearSlug || choice.gearReward) {
        next = {
          ...next,
          pendingGearSlugs: choice.gearSlug
            ? [choice.gearSlug]
            : chooseGearRewards(
                current.battlesWon + 1,
                3,
                getMapNode(current.currentNodeId ?? "").rewardTier ?? "early",
              ),
          screen: "reward",
        };
        return next;
      }
      return {
        ...next,
        screen: "map",
        eventId: undefined,
        availableNodes: getMapNode(current.currentNodeId ?? "").next,
      };
    });
  }, []);

  const rest = useCallback((mode: "heal" | "train") => {
    setState((current) => ({
      ...current,
      party:
        mode === "heal"
          ? healParty(current.party, 28)
          : current.party.map((member) => ({
              ...member,
              attack: member.attack + 2,
              battleSkillPower: member.battleSkillPower + 2,
              linkSkillPower: member.linkSkillPower + 2,
              ultimatePower: member.ultimatePower + 2,
            })),
      screen: "map",
      availableNodes: getMapNode(current.currentNodeId ?? "").next,
    }));
  }, []);

  const continueToMap = useCallback(() => {
    setState((current) => ({
      ...current,
      screen: "map",
      availableNodes: current.currentNodeId
        ? getMapNode(current.currentNodeId).next
        : startingNodeIds,
    }));
  }, []);

  return {
    ...state,
    startRun,
    startDeployment,
    abandonRun,
    enterNode,
    tickBattle,
    performAction,
    equipRewardGear,
    skipReward,
    resolveEvent,
    rest,
    continueToMap,
  };
}
