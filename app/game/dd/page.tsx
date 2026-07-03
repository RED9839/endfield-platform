"use client";

import Link from "next/link";
import { ChevronLeft, Tent } from "lucide-react";

import { OPERATORS } from "./roster";
import { encounterForNode, useDDRun, REST_HEAL } from "./run";
import BattleView from "./ui/BattleView";
import RosterSelect from "./ui/RosterSelect";
import RunMap from "./ui/RunMap";
import RunHud from "./ui/RunHud";
import CraftPanel from "./ui/CraftPanel";
import type { Element } from "./combat";

const PRIMARY = "#c9822c";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };

export default function DDRunPage() {
  const run = useDDRun();

  return (
    <main className="dd-realm min-h-screen bg-ef-bg text-ef-ink">
      <header className="sticky top-0 z-40 border-b border-ef-line bg-ef-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center gap-3 px-4 py-2 sm:px-7">
          <Link href="/game" className="flex h-10 w-10 shrink-0 items-center justify-center border border-ef-line bg-ef-card text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT_SM} aria-label="게임으로"><ChevronLeft className="h-5 w-5" /></Link>
          <span className="h-3 w-3 shrink-0" style={{ background: PRIMARY }} />
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Darkest Protocol</p>
            <p className="truncate font-mono text-sm font-black uppercase tracking-[0.2em] text-white">DD 던전 원정</p>
          </div>
          <div className="ml-auto" />
          {run.phase !== "select" && (
            <button type="button" onClick={run.restart} className="border border-ef-line bg-ef-card px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ef-muted transition hover:border-red-400/40 hover:text-red-300" style={CUT_SM}>원정 포기</button>
          )}
        </div>
      </header>

      {run.phase === "select" && <RosterSelect onStart={run.startRun} />}

      {run.phase === "map" && (
        <>
          <div className="mx-auto max-w-[1500px] px-4 pt-4 sm:px-7"><RunHud faction={run.faction} depth={run.depthReached} maxDepth={run.maxDepth} craft={run.craft} onCraft={run.openCraft} canCraft /></div>
          <RunMap nodes={run.nodes} frontier={run.frontier} cleared={run.cleared} party={run.party} items={run.items} onEnter={run.enterNode} />
        </>
      )}

      {run.phase === "craft" && <CraftPanel craft={run.craft} party={run.party} onCraft={run.craftPiece} onForge={run.forgePiece} onClose={run.closeCraft} />}

      {run.phase === "battle" && run.activeNode && (
        <BattleView
          key={run.activeNode.id}
          party={run.party}
          encounterKey={encounterForNode(run.activeNode.kind)}
          nodeKind={run.activeNode.kind}
          faction={run.faction}
          depth={run.activeNode.depth}
          maxDepth={run.maxDepth}
          owned={run.craft.owned}
          items={run.items}
          onUseItem={run.useItem}
          onEnd={run.finishBattle}
        />
      )}

      {run.phase === "rest" && (
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-7">
          <div className="dd-frame p-6" style={CUT_SM}>
            <div className="mb-3 flex items-center gap-2"><Tent className="h-6 w-6 text-ef-accent" /><h2 className="text-2xl">야영지</h2></div>
            <p className="mb-5 text-sm text-ef-muted">부대가 잠시 정비합니다. 각 생존 대원이 최대 HP의 <b className="text-ef-ink">{Math.round(REST_HEAL * 100)}%</b>를 회복합니다.</p>
            <div className="mb-5 space-y-2">
              {run.party.map((m) => {
                const op = OPERATORS.find((o) => o.id === m.id);
                const healed = m.hp > 0 ? Math.min(m.maxHp, Math.round(m.hp + m.maxHp * REST_HEAL)) : 0;
                return (
                  <div key={m.id} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0" style={{ background: elementColor[op?.element ?? "physical"] }} />
                    <span className="w-24 truncate font-mono text-xs font-bold text-white">{op?.name ?? m.id}</span>
                    <div className="h-2.5 flex-1 overflow-hidden border border-ef-line bg-black/60">
                      <div className="h-full bg-ef-line/40" style={{ width: `${(healed / m.maxHp) * 100}%` }}>
                        <div className="h-full" style={{ width: `${(m.hp / Math.max(1, healed)) * 100}%`, background: "#86efac" }} />
                      </div>
                    </div>
                    <span className="w-24 text-right font-mono text-[10px] text-ef-muted">{Math.max(0, m.hp)} → <b className="text-green-300">{healed}</b></span>
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={run.rest} className="dd-torch w-full border border-ef-line py-2.5 font-mono text-sm font-bold uppercase tracking-wider transition hover:border-ef-accent/50" style={{ ...CUT_SM, background: PRIMARY, color: "#0a0a0a" }}>정비하고 진행 →</button>
          </div>
        </div>
      )}

      {(run.phase === "victory" || run.phase === "defeat") && (
        <div className="mx-auto max-w-[720px] px-4 py-16 text-center sm:px-7">
          <div className="dd-frame p-10" style={{ ...CUT_SM, borderColor: run.phase === "victory" ? "#cf9f3e66" : "#b3312a66" }}>
            <div className="mb-2 text-4xl" style={{ fontFamily: "var(--dd-display)", letterSpacing: "0.18em", color: run.phase === "victory" ? "#e8c56a" : "#c23b32", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{run.phase === "victory" ? "원정 성공" : "원정 실패"}</div>
            <p className="mb-6 text-base italic text-ef-muted">{run.phase === "victory" ? "던전 심층의 공포를 몰아냈다. 부대가 어둠을 뚫고 귀환한다." : "부대가 던전의 어둠 속으로 사라졌다."}</p>
            <button type="button" onClick={run.restart} className="dd-torch border border-ef-line px-6 py-2.5 font-mono text-sm font-bold uppercase tracking-wider transition hover:border-ef-accent/50" style={{ ...CUT_SM, background: PRIMARY, color: "#0a0a0a" }}>새 원정 →</button>
          </div>
        </div>
      )}
    </main>
  );
}
