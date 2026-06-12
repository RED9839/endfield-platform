"use client";

import { useCallback, useState } from "react";

import { getEnemies } from "../data/enemies";
import { events } from "../data/events";
import { getMapNode, startingNodeIds } from "../data/maps";
import { startingParty } from "../data/operators";
import { getRelic, relics } from "../data/relics";
import type {
  GameEventChoice,
  PartyMember,
  RunActions,
  RunState,
  SkillKind,
} from "../types/game";

function freshParty(): PartyMember[] {
  return startingParty.map((operator) => ({
    ...operator,
    hp: operator.maxHp,
    shield: 0,
  }));
}

function initialState(): RunState {
  return {
    screen: "map",
    party: freshParty(),
    relics: [],
    visitedNodes: [],
    availableNodes: startingNodeIds,
    pendingRelicIds: [],
    credits: 0,
    sp: 3,
    maxSp: 3,
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

function applyRelic(state: RunState, relicId: string): RunState {
  const relic = getRelic(relicId);
  if (state.relics.some((item) => item.id === relicId)) return state;

  let party = state.party;
  let maxSp = state.maxSp;
  let sp = state.sp;

  if (relic.effect === "heal") party = healParty(party, relic.value);
  if (relic.effect === "attack") {
    party = party.map((member) => ({
      ...member,
      attack: member.attack + relic.value,
      skillPower: member.skillPower + relic.value,
    }));
  }
  if (relic.effect === "max-hp") {
    party = party.map((member) => ({
      ...member,
      maxHp: member.maxHp + relic.value,
      hp: member.hp + relic.value,
    }));
  }
  if (relic.effect === "sp") {
    maxSp += relic.value;
    sp = maxSp;
  }

  return { ...state, party, maxSp, sp, relics: [...state.relics, relic] };
}

function chooseRewards(state: RunState) {
  const owned = new Set(state.relics.map((item) => item.id));
  const pool = relics.filter((item) => !owned.has(item.id));
  if (pool.length <= 2) return pool.map((item) => item.id);

  const start = state.battlesWon % pool.length;
  return [pool[start], pool[(start + 1) % pool.length]].map((item) => item.id);
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
      if (node.type === "camp") return { ...base, screen: "camp" };

      return {
        ...base,
        screen: "battle",
        battle: {
          enemies: getEnemies(node.enemyIds ?? []).map((enemy) => ({
            ...enemy,
            hp: enemy.maxHp,
          })),
          turn: 1,
          log: [`${node.title}에서 적과 조우했습니다.`],
        },
      };
    });
  }, []);

  const performAction = useCallback((operatorId: string, kind: SkillKind) => {
    setState((current) => {
      if (!current.battle || current.screen !== "battle") return current;
      const actor = current.party.find((member) => member.id === operatorId);
      const target = current.battle.enemies.find((enemy) => enemy.hp > 0);
      if (!actor || !target || actor.hp <= 0) return current;
      if (kind === "skill" && current.sp < actor.skillCost) return current;

      const damage =
        kind === "attack"
          ? actor.attack
          : kind === "skill"
            ? actor.skillPower
            : Math.ceil(actor.attack * 0.45);
      const enemiesAfterAction = current.battle.enemies.map((enemy) =>
        enemy.id === target.id ? { ...enemy, hp: Math.max(0, enemy.hp - damage) } : enemy,
      );
      const actionLabel =
        kind === "skill" ? actor.skillName : kind === "guard" ? "방어 태세" : "기본 공격";
      const actionLog = `${actor.name}: ${actionLabel}으로 ${target.name}에게 ${damage} 피해.`;
      const allDefeated = enemiesAfterAction.every((enemy) => enemy.hp <= 0);

      if (allDefeated) {
        const node = getMapNode(current.currentNodeId ?? "");
        const won = current.battlesWon + 1;
        if (node.type === "boss") {
          return {
            ...current,
            battle: { ...current.battle, enemies: enemiesAfterAction, log: [actionLog, ...current.battle.log] },
            battlesWon: won,
            screen: "summary",
            result: "victory",
          };
        }
        const withWin = { ...current, battlesWon: won };
        return {
          ...withWin,
          battle: { ...current.battle, enemies: enemiesAfterAction, log: [actionLog, ...current.battle.log] },
          screen: "reward",
          credits: current.credits + (node.type === "elite" ? 100 : 55),
          pendingRelicIds: chooseRewards(withWin),
        };
      }

      const guardActor = kind === "guard" ? actor.id : undefined;
      const livingParty = current.party.filter((member) => member.hp > 0);
      let party = current.party;
      const enemyLogs: string[] = [];

      for (const enemy of enemiesAfterAction.filter((item) => item.hp > 0)) {
        const victim =
          livingParty.reduce((lowest, member) => (member.hp < lowest.hp ? member : lowest), livingParty[0]) ??
          actor;
        const guarded = victim.id === guardActor;
        const hit = Math.max(1, enemy.attack - (guarded ? 7 : 0));
        party = party.map((member) =>
          member.id === victim.id ? { ...member, hp: Math.max(0, member.hp - hit) } : member,
        );
        enemyLogs.push(`${enemy.name}: ${victim.name}에게 ${hit} 피해.`);
      }

      const defeated = party.every((member) => member.hp <= 0);
      return {
        ...current,
        party,
        sp:
          kind === "skill"
            ? current.sp - actor.skillCost
            : Math.min(current.maxSp, current.sp + 1),
        screen: defeated ? "summary" : "battle",
        result: defeated ? "defeat" : current.result,
        battle: {
          enemies: enemiesAfterAction,
          turn: current.battle.turn + 1,
          log: [...enemyLogs, actionLog, ...current.battle.log].slice(0, 8),
        },
      };
    });
  }, []);

  const claimRelic = useCallback((relicId: string) => {
    setState((current) => {
      const next = applyRelic(current, relicId);
      return {
        ...next,
        pendingRelicIds: [],
        screen: "map",
        availableNodes: getMapNode(current.currentNodeId ?? "").next,
        battle: undefined,
        sp: next.maxSp,
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
      if (choice.relicId) next = applyRelic(next, choice.relicId);
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
              skillPower: member.skillPower + 2,
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
    performAction,
    claimRelic,
    resolveEvent,
    rest,
    continueToMap,
  };
}
