"use client";

import Link from "next/link";
import { ChevronLeft, Tent } from "lucide-react";

import { OPERATORS } from "./dd/roster";
import { ITEMS } from "./dd/items";
import { skillLabel } from "./dd/progress";
import { encounterForNode, useDDRun, REST_HEAL } from "./dd/run";
import BattleView from "./dd/ui/BattleView";
import RosterSelect from "./dd/ui/RosterSelect";
import RunMap from "./dd/ui/RunMap";
import RunHud from "./dd/ui/RunHud";
import CraftPanel from "./dd/ui/CraftPanel";
import type { Element } from "./dd/combat";

const PRIMARY = "#ff9a2f";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };

export default function GamePage() {
  const run = useDDRun();

  return (
    <main className="dd-realm min-h-screen bg-ef-bg text-ef-ink">
      <header className="sticky top-0 z-40 border-b border-ef-line bg-ef-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center gap-3 px-4 py-2 sm:px-7">
          <Link href="/" className="hud-btn flex h-10 w-10 shrink-0 items-center justify-center text-ef-muted" style={CUT_SM} aria-label="홈으로"><ChevronLeft className="h-5 w-5" /></Link>
          <span className="h-3 w-3 shrink-0" style={{ background: PRIMARY, boxShadow: `0 0 8px ${PRIMARY}` }} />
          <div className="min-w-0">
            <p className="font-mono text-[14px] font-bold uppercase tracking-[0.3em] text-ef-muted">Darkest Protocol</p>
            <p className="truncate font-mono text-sm font-black uppercase tracking-[0.2em] text-white">던전 원정</p>
          </div>
          <div className="ml-auto" />
          {run.phase !== "select" && (
            <button type="button" onClick={run.restart} className="hud-btn px-3 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider text-ef-muted transition hover:!border-red-400/50 hover:text-red-300" style={CUT_SM}>원정 포기</button>
          )}
        </div>
      </header>

      {run.phase === "select" && <RosterSelect onStart={run.startRun} />}

      {run.phase === "map" && (
        <>
          <div className="mx-auto max-w-[1500px] px-4 pt-4 sm:px-7"><RunHud faction={run.faction} depth={run.depthReached} maxDepth={run.maxDepth} floor={run.floor} totalFloors={run.totalFloors} floorName={run.floorName} craft={run.craft} onCraft={run.openCraft} canCraft /></div>
          <RunMap nodes={run.nodes} frontier={run.frontier} cleared={run.cleared} party={run.party} items={run.items} faction={run.faction} floor={run.floor} onEnter={run.enterNode} />
        </>
      )}

      {run.phase === "craft" && <CraftPanel craft={run.craft} party={run.party} onCraft={run.craftPiece} onForge={run.forgePiece} onSwap={run.swapGear} onForgeSkill={run.forgeSkill} onClose={run.closeCraft} />}

      {run.phase === "battle" && run.activeNode && (
        <BattleView
          key={run.activeNode.id}
          party={run.party}
          encounterKey={encounterForNode(run.activeNode.kind)}
          nodeKind={run.activeNode.kind}
          faction={run.faction}
          bossId={run.floorBoss}
          floor={run.floor}
          depth={run.activeNode.depth}
          maxDepth={run.maxDepth}
          owned={run.craft.owned}
          items={run.items}
          onUseItem={run.useItem}
          onEnd={run.finishBattle}
        />
      )}

      {/* 교전 승리 전리품 — 각 전투 후 획득 표시 → 계속 시 다음 구역 */}
      {run.phase === "spoils" && run.lastLoot && (() => {
        const L = run.lastLoot;
        const item = ITEMS[L.item];
        return (
          <div className="mx-auto max-w-[520px] px-4 py-14 text-center sm:px-7">
            <div className="hud-panel dd-cut p-8" style={{ borderColor: "#ff9a2f44", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 50px -20px rgba(255,154,47,0.5)" }}>
              <div className="mb-1 font-mono text-[13px] font-bold uppercase tracking-[0.28em] text-ef-accent/70">{L.kind === "elite" ? "정예 격파" : "교전 승리"}</div>
              <div className="mb-6 text-2xl font-bold" style={{ fontFamily: "var(--dd-display)", letterSpacing: "0.1em", color: "#ffbe6b", textShadow: "0 0 20px rgba(255,190,107,0.4)" }}>전리품 획득</div>
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {([["💎", "부품", `+${L.parts}`], ["🔑", "관리권", `+${L.permits}`], ["🎁", item?.name ?? "아이템", "×1"]] as [string, string, string][]).map(([ic, lb, v]) => (
                  <div key={lb} className="min-w-[112px] border border-ef-line/50 bg-[#120c07] px-3 py-2.5">
                    <div className="text-xl leading-none">{ic}</div>
                    <div className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ef-muted">{lb}</div>
                    <div className="font-mono text-[16px] font-bold text-ef-ink">{v}</div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={run.continueSpoils} className="dd-cut px-6 py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition hover:brightness-110" style={{ background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a", boxShadow: "0 0 22px -4px rgba(255,154,47,0.6)" }}>계속 →</button>
            </div>
          </div>
        );
      })()}

      {run.phase === "rest" && (
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-7">
          <div className="hud-panel dd-cut p-6">
            <div className="mb-3 flex items-center gap-2"><Tent className="h-6 w-6 text-ef-accent" style={{ filter: "drop-shadow(0 0 6px rgba(255,154,47,0.5))" }} /><h2 className="text-2xl">야영지</h2></div>
            <p className="mb-5 text-sm text-ef-muted">부대가 잠시 정비합니다. 각 생존 대원이 최대 HP의 <b className="text-ef-ink">{Math.round(REST_HEAL * 100)}%</b>를 회복합니다.</p>
            <div className="mb-5 space-y-2">
              {run.party.map((m) => {
                const op = OPERATORS.find((o) => o.id === m.id);
                const healed = m.hp > 0 ? Math.min(m.maxHp, Math.round(m.hp + m.maxHp * REST_HEAL)) : 0;
                return (
                  <div key={m.id} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: elementColor[op?.element ?? "physical"], boxShadow: `0 0 6px ${elementColor[op?.element ?? "physical"]}` }} />
                    <span className="w-24 truncate font-mono text-xs font-bold text-white">{op?.name ?? m.id}</span>
                    <div className="relative h-2.5 flex-1 overflow-hidden rounded-[2px] bg-black/75" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 3px rgba(0,0,0,0.9)" }}>
                      <div className="h-full rounded-[2px]" style={{ width: `${(healed / m.maxHp) * 100}%`, background: "rgba(134,239,172,0.22)" }}>
                        <div className="relative h-full rounded-[2px]" style={{ width: `${(m.hp / Math.max(1, healed)) * 100}%`, background: "#86efac", boxShadow: "0 0 7px #86efac77" }}>
                          <span className="pointer-events-none absolute inset-x-0 top-0 h-[45%]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent)" }} />
                        </div>
                      </div>
                    </div>
                    <span className="w-24 text-right font-mono text-[14px] text-ef-muted">{Math.max(0, m.hp)} → <b className="text-green-300">{healed}</b></span>
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={run.rest} className="dd-cut w-full py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition hover:brightness-110" style={{ background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a", boxShadow: "0 0 22px -4px rgba(255,154,47,0.6)" }}>정비하고 진행 →</button>
          </div>
        </div>
      )}

      {(run.phase === "victory" || run.phase === "defeat") && (
        <div className="mx-auto max-w-[720px] px-4 py-16 text-center sm:px-7">
          <div className="hud-panel dd-cut p-10" style={{ borderColor: run.phase === "victory" ? "#ff9a2f66" : "#b3312a66", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 60px -20px ${run.phase === "victory" ? "rgba(255,154,47,0.6)" : "rgba(179,49,42,0.6)"}` }}>
            <div className="mb-2 text-4xl font-bold" style={{ fontFamily: "var(--dd-display)", letterSpacing: "0.14em", color: run.phase === "victory" ? "#ffbe6b" : "#e5484d", textShadow: `0 0 24px ${run.phase === "victory" ? "rgba(255,190,107,0.5)" : "rgba(229,72,77,0.5)"}` }}>{run.phase === "victory" ? "원정 성공" : "원정 실패"}</div>
            <p className="mb-6 text-base text-ef-muted">{run.phase === "victory" ? "던전 심층의 공포를 몰아냈다. 부대가 어둠을 뚫고 귀환한다." : "부대가 던전의 어둠 속으로 사라졌다."}</p>
            {/* 전리품 — 이번 원정 누적 획득(승리 시) */}
            {run.phase === "victory" && (() => {
              const L = run.loot;
              const crafted = Object.keys(run.craft.owned).length;
              const enhanced = run.party.filter((m) => (m.progress?.skillRank ?? 0) > 0);
              const opName = (opid: string) => OPERATORS.find((o) => o.id === opid)?.name ?? opid;
              const lootItems = Object.entries(L.items).filter(([, n]) => n > 0);
              return (
                <div className="dd-cut mx-auto mb-6 max-w-[440px] border border-ef-accent/25 bg-black/40 p-4 text-left">
                  <div className="mb-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.24em] text-ef-accent/70">◆ 전리품</div>
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {([["⚔", "처치", L.kills], ["💎", "부품", `+${L.parts}`], ["🔑", "관리권", `+${L.permits}`]] as [string, string, string | number][]).map(([ic, lb, v]) => (
                      <div key={lb} className="border border-ef-line/50 bg-[#120c07] px-2 py-2 text-center">
                        <div className="text-lg leading-none">{ic}</div>
                        <div className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ef-muted">{lb}</div>
                        <div className="font-mono text-[17px] font-bold text-ef-ink">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 font-mono text-[14px]">
                    {crafted > 0 && <div className="text-ef-muted">🛠 제작 장비 <b className="text-ef-ink">{crafted}</b>개</div>}
                    {enhanced.length > 0 && <div className="text-ef-muted">⬆ 스킬 강화 <span className="text-ef-accent-soft">{enhanced.map((m) => `${opName(m.id)} ${skillLabel(m.progress!.skillRank)}`).join(" · ")}</span></div>}
                    {lootItems.length > 0 && <div className="text-ef-muted">🎁 획득 아이템 <span className="text-ef-ink">{lootItems.map(([itid, n]) => `${ITEMS[itid]?.name ?? itid}×${n}`).join(" · ")}</span></div>}
                  </div>
                </div>
              );
            })()}
            <button type="button" onClick={run.restart} className="dd-cut px-6 py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition hover:brightness-110" style={{ background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a", boxShadow: "0 0 22px -4px rgba(255,154,47,0.6)" }}>새 원정 →</button>
          </div>
        </div>
      )}
    </main>
  );
}
