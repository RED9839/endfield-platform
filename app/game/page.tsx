"use client";

import Link from "next/link";
import { ChevronLeft, Flag } from "lucide-react";

import BattleScreen from "./components/BattleScreen";
import CampScreen from "./components/CampScreen";
import DeploymentScreen from "./components/DeploymentScreen";
import EventScreen from "./components/EventScreen";
import MapScreen from "./components/MapScreen";
import RewardScreen from "./components/RewardScreen";
import RunSummaryScreen from "./components/RunSummaryScreen";
import { events } from "./data/events";
import { factions } from "./data/maps";
import { useRunState } from "./hooks/useRunState";

const PRIMARY = "#ff9a2f";
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function GamePage() {
  const run = useRunState();
  const activeEvent = events.find((event) => event.id === run.eventId);

  return (
    <main className="min-h-screen bg-ef-bg text-ef-ink">
      <header className="sticky top-0 z-40 border-b border-ef-line bg-ef-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center gap-3 px-4 py-2 sm:px-7">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-ef-line bg-ef-card text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT_SM}
            aria-label="홈으로"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <span className="h-3 w-3 shrink-0" style={{ background: PRIMARY }} />
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">
              Frontier Protocol
            </p>
            <p className="truncate font-mono text-sm font-black uppercase tracking-[0.2em] text-white">
              탐사 프로토타입
            </p>
          </div>

          <div className="ml-auto" />

          {run.screen !== "summary" && run.screen !== "deployment" && (
            <button
              type="button"
              onClick={run.abandonRun}
              className="flex h-10 w-10 items-center justify-center border border-ef-line bg-ef-card text-ef-muted transition hover:border-red-400/40 hover:text-red-300"
              style={CUT_SM}
              aria-label="탐사 중단"
            >
              <Flag className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {run.screen === "deployment" && (
        <DeploymentScreen
          onConfirm={run.confirmDeployment}
          initialSelected={run.party.map((member) => member.id)}
        />
      )}
      {run.screen === "map" && (
        <MapScreen
          availableNodes={run.availableNodes}
          visitedNodes={run.visitedNodes}
          onEnter={run.enterNode}
        />
      )}
      {run.screen === "battle" && run.battle && (
        <BattleScreen
          party={run.party}
          battle={run.battle}
          relics={run.relics}
          potions={run.potions}
          onPlayCard={run.playCard}
          onEndTurn={run.endTurn}
          onUsePotion={run.usePotion}
        />
      )}
      {run.screen === "reward" && (
        <RewardScreen
          gearSlugs={run.pendingGearSlugs}
          party={run.party}
          credits={run.credits}
          onEquip={run.equipRewardGear}
          onSkip={run.skipReward}
          cardOffers={run.pendingCardOffers}
          onTakeCard={run.takeCardOffer}
          onSkipCard={run.skipCardOffer}
          onRerollCard={run.rerollCardOffers}
          cardRerolls={run.cardRerolls}
          factionName={factions[run.factionIndex]?.name}
          pendingRelic={run.pendingRelic}
        />
      )}
      {run.screen === "shop" && (
        <RewardScreen
          mode="shop"
          gearSlugs={run.pendingGearSlugs}
          party={run.party}
          credits={run.credits}
          onEquip={run.buyGear}
          onSkip={run.skipReward}
          onBuyHeal={run.buyHeal}
          deck={run.deck}
          cardsRemoved={run.cardsRemoved}
          onRemoveCard={run.removeCard}
          shopRelics={run.shopRelics}
          shopPotions={run.shopPotions}
          ownedRelics={run.relics}
          potionCount={run.potions.length}
          onBuyRelic={run.buyRelic}
          onBuyPotion={run.buyPotion}
        />
      )}
      {run.screen === "event" && activeEvent && (
        <EventScreen event={activeEvent} onChoose={run.resolveEvent} />
      )}
      {run.screen === "camp" && (
        <CampScreen
          onRest={run.rest}
          party={run.party}
          deck={run.deck}
          onUpgrade={run.upgradeCard}
        />
      )}
      {run.screen === "summary" && (
        <RunSummaryScreen state={run} onRestart={run.startRun} />
      )}
    </main>
  );
}
