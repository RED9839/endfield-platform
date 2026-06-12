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
    gear: {},
  }));
}

function initialState(): RunState {
  return {
    screen: "map",
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
      damage += Math.ceil(actor.attack * 1.4);
      notes.push("오리지늄 결정 소모");
    } else if (kind === "battle-skill") {
      statuses = addStatus(statuses, "originium-crystal");
      notes.push("오리지늄 결정 부착");
    }
  }

  if (actor.skillMechanic === "electric-attachment") {
    if (kind === "link-skill" && statuses.includes("electric-attachment")) {
      statuses = addStatus(withoutStatus(statuses, "electric-attachment"), "shock");
      damage += Math.ceil(actor.attack * 0.8);
      notes.push("감전 전환");
    } else if (kind === "battle-skill") {
      statuses = addStatus(statuses, "electric-attachment");
      notes.push("전기 부착");
    }
  }

  if (
    actor.skillMechanic === "combo-strike" &&
    kind === "link-skill" &&
    target.statuses.includes("defense-break")
  ) {
    damage += Math.ceil(actor.attack * 0.75);
    notes.push("방어 불능 연격");
  }

  if (actor.skillMechanic === "corrosion-support") {
    if (kind === "battle-skill" && statuses.includes("corrosion")) {
      statuses = withoutStatus(statuses, "corrosion");
      damage += Math.ceil(actor.attack * 1.1);
      notes.push("부식 소모");
    } else if (kind === "link-skill") {
      statuses = addStatus(statuses, "corrosion");
      notes.push("부식 부여");
    }
  }

  if (kind === "ultimate") {
    notes.push(actor.ultimateName);
  }

  return { damage, statuses, notes };
}

function collectReadyUnits(party: PartyMember[], enemies: BattleEnemy[]) {
  return [
    ...party
      .filter((member) => member.hp > 0 && member.actionGauge >= READY_GAUGE)
      .map((member) => ({
        id: member.id,
        name: member.name,
        side: "party" as const,
        speed: member.speed,
        gauge: member.actionGauge,
      })),
    ...enemies
      .filter((enemy) => enemy.hp > 0 && enemy.actionGauge >= READY_GAUGE)
      .map((enemy) => ({
        id: enemy.id,
        name: enemy.name,
        side: "enemy" as const,
        speed: enemy.speed,
        gauge: enemy.actionGauge,
      })),
  ].sort((a, b) => {
    if (b.gauge !== a.gauge) return b.gauge - a.gauge;
    if (a.side !== b.side) return a.side === "party" ? -1 : 1;
    if (b.speed !== a.speed) return b.speed - a.speed;
    return a.id.localeCompare(b.id);
  });
}

function advanceGaugeClock(party: PartyMember[], enemies: BattleEnemy[]) {
  if (collectReadyUnits(party, enemies).length > 0) return { party, enemies };

  const livingUnits = [
    ...party.filter((member) => member.hp > 0),
    ...enemies.filter((enemy) => enemy.hp > 0),
  ];
  if (livingUnits.length === 0) return { party, enemies };

  const timeToReady = Math.min(
    ...livingUnits.map((unit) =>
      Math.max(1, Math.ceil((READY_GAUGE - unit.actionGauge) / unit.speed)),
    ),
  );

  return {
    party: party.map((member) =>
      member.hp > 0
        ? { ...member, actionGauge: member.actionGauge + member.speed * timeToReady }
        : member,
    ),
    enemies: enemies.map((enemy) =>
      enemy.hp > 0
        ? { ...enemy, actionGauge: enemy.actionGauge + enemy.speed * timeToReady }
        : enemy,
    ),
  };
}

function spendGauge<T extends PartyMember | BattleEnemy>(unit: T, cost: number): T {
  return { ...unit, actionGauge: unit.actionGauge - cost };
}

function buildTimeline(party: PartyMember[], enemies: BattleEnemy[], count = 6): TimelineEntry[] {
  let previewParty = party.map((member) => ({ ...member }));
  let previewEnemies = enemies.map((enemy) => ({ ...enemy }));
  const timeline: TimelineEntry[] = [];

  for (let index = 0; index < count; index += 1) {
    const advanced = advanceGaugeClock(previewParty, previewEnemies);
    previewParty = advanced.party;
    previewEnemies = advanced.enemies;

    const next = collectReadyUnits(previewParty, previewEnemies)[0];
    if (!next) break;
    timeline.push({
      id: next.id,
      name: next.name,
      side: next.side,
      gauge: next.gauge,
    });

    if (next.side === "party") {
      previewParty = previewParty.map((member) =>
        member.id === next.id ? spendGauge(member, ACTION_COST.attack) : member,
      );
    } else {
      previewEnemies = previewEnemies.map((enemy) =>
        enemy.id === next.id ? spendGauge(enemy, ENEMY_ACTION_COST) : enemy,
      );
    }
  }

  return timeline;
}

function activateNextUnit(party: PartyMember[], enemies: BattleEnemy[]) {
  const advanced = advanceGaugeClock(party, enemies);
  const next = collectReadyUnits(advanced.party, advanced.enemies)[0];

  return {
    party: advanced.party,
    enemies: advanced.enemies,
    activeUnitId: next?.id,
    activeSide: next?.side as UnitSide | undefined,
    timeline: buildTimeline(advanced.party, advanced.enemies),
  };
}

function tickCombatGauges(party: PartyMember[], enemies: BattleEnemy[], activeUnitId?: string) {
  return {
    party: party.map((member) =>
      member.hp > 0 && member.id !== activeUnitId
        ? { ...member, actionGauge: member.actionGauge + member.speed * REAL_TIME_TICK }
        : member,
    ),
    enemies: enemies.map((enemy) =>
      enemy.hp > 0 && enemy.id !== activeUnitId
        ? { ...enemy, actionGauge: enemy.actionGauge + enemy.speed * REAL_TIME_TICK }
        : enemy,
    ),
  };
}

function applyGearStats(member: PartyMember, gear: RunGear): PartyMember {
  const deltas = getGearStatDeltas(gear, member.element);
  const next = { ...member };

  next.attack += deltas.attack ?? 0;
  next.maxHp += deltas.maxHp ?? 0;
  next.defense += deltas.defense ?? 0;
  next.evasion += deltas.evasion ?? 0;
  next.speed += deltas.speed ?? 0;
  next.battleSkillPower += deltas.battleSkillPower ?? 0;
  next.linkSkillPower += deltas.linkSkillPower ?? 0;
  next.ultimatePower += deltas.ultimatePower ?? 0;
  next.ultimateCharge = Math.min(100, next.ultimateCharge + (deltas.ultimateCharge ?? 0));

  return next;
}

function recalculateMemberFromGear(member: PartyMember, gear: GearLoadout): PartyMember {
  const base = getBaseOperator(member.id);
  const hpRatio = member.maxHp > 0 ? member.hp / member.maxHp : 1;
  const recalculated = getEquippedGears(gear).reduce<PartyMember>(
    (next, item) => applyGearStats(next, item),
    {
      ...base,
      hp: base.maxHp,
      shield: member.shield,
      ultimateCharge: member.ultimateCharge,
      actionGauge: member.actionGauge,
      gear,
    },
  );

  return {
    ...recalculated,
    evasion: Math.min(EVASION_CAP, recalculated.evasion),
    hp: Math.max(1, Math.min(recalculated.maxHp, Math.round(recalculated.maxHp * hpRatio))),
  };
}

function equipGearToMember(member: PartyMember, gear: RunGear): PartyMember {
  const slot = getGearSlot(gear, member.gear.kit1, member.gear.kit2);
  return recalculateMemberFromGear(member, {
    ...member.gear,
    [slot]: gear,
  });
}

function applyBattleStartSetEffects(party: PartyMember[], sp: number, maxSp: number) {
  const hasPioneer = party.some((member) => hasSet(member, "개척"));
  const boostedParty = party.map((member) => {
    const sets = activeSets(member);
    let next = member;
    if (sets.includes("생체 보조")) {
      next = { ...next, maxHp: next.maxHp + 10, hp: Math.min(next.maxHp + 10, next.hp + 10) };
    }
    if (sets.includes("아부레이의 메아리")) {
      next = { ...next, ultimateCharge: Math.min(100, next.ultimateCharge + 8) };
    }
    return next;
  });

  return {
    party: boostedParty,
    sp: hasPioneer ? Math.min(maxSp, sp + 1) : sp,
  };
}

function resolveAutomaticBattleTurns(state: RunState): RunState {
  let current: RunState = state;

  for (let safety = 0; safety < 20; safety += 1) {
    if (!current.battle || current.screen !== "battle") return current;

    const battle = current.battle;
    const activated = activateNextUnit(current.party, battle.enemies);
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
    const victim =
      livingParty.reduce((lowest, member) => (member.hp < lowest.hp ? member : lowest), livingParty[0]) ??
      current.party[0];
    if (!victim) return current;

    const evaded = didEvade(victim, activeBattle.turn, actor.id);
    const rawHit = Math.max(1, actor.attack);
    const hit = evaded ? 0 : Math.max(1, rawHit - Math.floor(victim.defense / 40));
    const partyAfterHit = current.party.map((member) =>
      member.id === victim.id ? (evaded ? member : absorbHit(member, hit)) : member,
    );
    const enemiesAfterAction = activeBattle.enemies.map((enemy) =>
      enemy.id === actor.id ? spendGauge(enemy, ENEMY_ACTION_COST) : enemy,
    );
    const defeated = partyAfterHit.every((member) => member.hp <= 0);
    const enemyLog = evaded
      ? `${actor.name}: ${victim.name} 공격, 회피!`
      : `${actor.name}: ${victim.name}에게 ${hit} 피해.`;

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
      const enemiesAfterAction = current.battle.enemies.map((enemy) =>
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
              mechanic.notes.forEach((note) => noteSet.add(note));
              totalDamage += mechanic.damage;
              const hp = Math.max(0, enemy.hp - mechanic.damage);
              const statuses =
                kind === "attack" && hp > 0 && hp <= enemy.maxHp / 2
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
            ? 22
            : kind === "link-skill"
              ? 12
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
    abandonRun,
    enterNode,
    tickBattle,
    performAction,
    equipRewardGear,
    resolveEvent,
    rest,
    continueToMap,
  };
}
