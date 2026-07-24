"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Tent, Hammer, ShoppingCart } from "lucide-react";

import { OPERATORS } from "./dd/roster";
import { ITEMS, RESOURCE_ICON, itemImage } from "./dd/items";
import { marketGood } from "./dd/craft";
import { skillLabel } from "./dd/progress";
import { encounterForNode, useDDRun, REST_HEAL, REST_SALVAGE, type RunNode } from "./dd/run";
import BattleView from "./dd/ui/BattleView";
import RosterSelect from "./dd/ui/RosterSelect";
import RunMap from "./dd/ui/RunMap";
import RunHud from "./dd/ui/RunHud";
import CraftPanel from "./dd/ui/CraftPanel";
import StatusPanel from "./dd/ui/StatusPanel";
import type { Element } from "./dd/combat";

const PRIMARY = "#ff9a2f";
const BUY_SKIP_KEY = "dd-buy-confirm-off"; // 「다시 묻지 않기」 저장 키
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };

export default function GamePage() {
  const run = useDDRun();
  // 상점 아이템 아이콘: 재료면 자원 아이콘, 소비템이면 아이템 이미지
  const giveIcon = (give: { parts?: number; permits?: number; chips?: number } | { itemId: string }): string => {
    if ("itemId" in give) return itemImage(give.itemId);
    if (give.chips) return RESOURCE_ICON.chips;
    if (give.permits) return RESOURCE_ICON.permits;
    return RESOURCE_ICON.parts;
  };
  const [showStatus, setShowStatus] = useState(false); // 부대 현황(읽기 전용) 오버레이
  const [showMap, setShowMap] = useState(false); // 교전 중 지도 보기(읽기 전용)
  const [sellQty, setSellQty] = useState<Record<string, number>>({ parts: 1, permits: 1, chips: 1 }); // 재료 되팔기 수량 입력
  const [copied, setCopied] = useState(false); // 원정 기록 JSON 복사 피드백
  // 상점은 클릭 한 번에 결제된다 — 오구매 방지용 확인. "다시 묻지 않기"는 브라우저에 저장해 다음 원정에도 유지.
  const [buyAsk, setBuyAsk] = useState<{ label: string; price: number; icon: string; run: () => void } | null>(null);
  const [buySkip, setBuySkip] = useState(false); // 이번 세션에 적용 중인 값(초기값은 localStorage)
  const [buyDontAsk, setBuyDontAsk] = useState(false); // 모달 안 체크박스
  useEffect(() => { try { setBuySkip(localStorage.getItem(BUY_SKIP_KEY) === "1"); } catch { /* 저장소 차단 */ } }, []);
  const askBuy = (label: string, price: number, icon: string, fn: () => void) => { if (buySkip) { fn(); return; } setBuyDontAsk(false); setBuyAsk({ label, price, icon, run: fn }); };
  const confirmBuy = () => {
    if (!buyAsk) return;
    if (buyDontAsk) { setBuySkip(true); try { localStorage.setItem(BUY_SKIP_KEY, "1"); } catch { /* 저장소 차단 */ } }
    buyAsk.run(); setBuyAsk(null);
  };
  // 제작·마스터리는 야영지에서만. 맵에선 노드 진입만 — 진입 전 제작 안내 모달은 무의미해 제거했다.
  const handleEnter = (n: RunNode) => run.enterNode(n);

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
        <div className="flex min-h-[calc(100vh-64px)] flex-col pb-8">
          <div className="mx-auto w-full max-w-[1500px] px-4 pt-4 sm:px-7"><RunHud faction={run.faction} depth={run.depthReached} maxDepth={run.maxDepth} floor={run.floor} totalFloors={run.totalFloors} floorName={run.floorName} craft={run.craft} hasCraftable={run.hasCraftable} /></div>
          <div className="mx-auto mt-2 w-full max-w-[1500px] px-4 sm:px-7">
            <button type="button" onClick={() => setShowStatus(true)} className="hud-btn dd-cut flex items-center gap-1.5 px-3 py-1.5 font-mono text-[13px] font-bold uppercase tracking-wider text-ef-muted hover:text-white">📋 부대 현황 — 장비·마스터리 확인</button>
          </div>
          {/* 남는 세로 공간 중앙에 맵 배치 — 하단 절반이 비던 문제 */}
          <div className="flex flex-1 flex-col justify-center"><RunMap nodes={run.nodes} frontier={run.frontier} cleared={run.cleared} party={run.party} items={run.items} faction={run.faction} floor={run.floor} totalFloors={run.totalFloors} onEnter={handleEnter} /></div>
        </div>
      )}

      {run.phase === "craft" && <CraftPanel craft={run.craft} party={run.party} onCraft={run.craftPiece} onForge={run.forgePiece} onSwap={run.swapGear} onForgeSkill={run.forgeSkill} onClose={run.closeCraft} initialTab={run.craftTab} />}

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
          onShowMap={() => setShowMap(true)}
        />
      )}

      {/* 교전 승리 전리품 — 각 전투 후 획득 표시 → 계속 시 다음 구역 */}
      {run.phase === "spoils" && run.lastLoot && (() => {
        const L = run.lastLoot;
        const item = L.item ? ITEMS[L.item] : null;
        const B = run.lastBattle;
        // 오퍼별 딜 분배(내림차순) — 엔드필드식 전투 리포트
        const dmg = B?.dmgByOp ? Object.entries(B.dmgByOp).map(([opid, d]) => { const op = OPERATORS.find((o) => o.id === opid); return { id: opid, name: op?.name ?? opid, el: (op?.element ?? "physical") as keyof typeof elementColor, d }; }).sort((a, b) => b.d - a.d) : [];
        const dmgMax = Math.max(1, ...dmg.map((x) => x.d));
        return (
          <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-10 sm:px-7">
            <div className="relative w-full max-w-[640px]">
              {/* 코너 브래킷 — 엔드필드 시그니처 */}
              {[["-left-1.5 -top-1.5", "border-l-2 border-t-2"], ["-right-1.5 -top-1.5", "border-r-2 border-t-2"], ["-bottom-1.5 -left-1.5", "border-b-2 border-l-2"], ["-bottom-1.5 -right-1.5", "border-b-2 border-r-2"]].map(([pos, bd]) => (
                <span key={pos} className={`pointer-events-none absolute z-10 h-5 w-5 ${pos} ${bd}`} style={{ borderColor: "#f5c542" }} />
              ))}
            <div className="hud-panel dd-cut p-7 text-center" style={{ borderColor: "#ff9a2f44", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 50px -20px rgba(255,154,47,0.5)" }}>
              <div className="mb-1 flex items-center justify-between font-mono text-[12px] font-bold uppercase tracking-[0.24em] text-ef-muted">
                <span>◆ {run.floorName} · 구역 {run.depthReached + 1}</span>
                <span className="text-ef-accent/70">{L.kind === "elite" ? "ELITE DOWN" : "COMBAT CLEAR"}</span>
              </div>
              <div className="mb-1 text-3xl font-bold" style={{ fontFamily: "var(--dd-display)", letterSpacing: "0.14em", color: "#ffbe6b", textShadow: "0 0 20px rgba(255,190,107,0.4)" }}>{L.kind === "elite" ? "정예 격파" : "교전 승리"}</div>
              {/* 해저드 스트라이프 구분선 */}
              <div className="mx-auto mb-5 h-1 w-40 opacity-70" style={{ background: "repeating-linear-gradient(-45deg, #f5c542 0 6px, transparent 6px 12px)" }} />
              {/* 전투 리포트 — 라운드·처치·오퍼별 딜 분배 */}
              {B && (
                <div className="mb-5 border border-ef-line/50 bg-black/30 px-4 py-3 text-left" style={CUT_SM}>
                  <div className="mb-2 flex items-center gap-3 font-mono text-[12px] uppercase tracking-wider text-ef-muted">
                    <span className="font-bold text-ef-accent/80">전투 리포트</span>
                    <span>라운드 <b className="text-ef-ink">{B.rounds}</b></span>
                    <span>처치 <b className="text-ef-ink">{B.enemies.length}</b></span>
                    <span className="ml-auto">총 피해 <b className="text-ef-ink">{B.dmgDealt.toLocaleString()}</b></span>
                  </div>
                  {dmg.map((x, i) => (
                    <div key={x.id} className="mt-1 flex items-center gap-2">
                      <span className="w-24 shrink-0 truncate text-right font-mono text-[12px] font-bold text-white/90">{i === 0 && <span className="mr-0.5" style={{ color: "#f5c542" }} title="이번 전투 최고 딜">◆</span>}{x.name}</span>
                      <div className="relative h-2.5 flex-1 overflow-hidden bg-black/50">
                        <div className="h-full" style={{ width: `${Math.max(2, (x.d / dmgMax) * 100)}%`, background: `linear-gradient(90deg, ${elementColor[x.el]}99, ${elementColor[x.el]})` }} />
                      </div>
                      <span className="w-16 shrink-0 text-right font-mono text-[12px] font-bold tabular-nums" style={{ color: elementColor[x.el] }}>{x.d.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {([[RESOURCE_ICON.credits, "크레딧", `+${L.credits}`], ...(L.parts > 0 ? [[RESOURCE_ICON.parts, "부품", `+${L.parts}`]] as [string, string, string][] : []), ...(L.chips > 0 ? [[RESOURCE_ICON.chips, "프로토콜 프리즘 세트", `+${L.chips}`]] as [string, string, string][] : []), ...(item ? [[itemImage(item.id), item.name, "×1"]] as [string, string, string][] : [])] as [string, string, string][]).map(([ic, lb, v]) => (
                  <div key={lb} className="min-w-[112px] border border-ef-line/50 bg-[#120c07] px-3 py-2.5" style={CUT_SM}>
                    {ic.startsWith("/") ? <img src={ic} alt="" className="mx-auto h-7 w-7 object-contain" /> : <div className="text-xl leading-none">{ic}</div>}
                    <div className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ef-muted">{lb}</div>
                    <div className="font-mono text-[16px] font-bold text-ef-ink">{v}</div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={run.continueSpoils} className="dd-cut px-6 py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition hover:brightness-110" style={{ background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a", boxShadow: "0 0 22px -4px rgba(255,154,47,0.6)" }}>계속 →</button>
            </div>
            </div>
          </div>
        );
      })()}

      {run.phase === "rest" && (
        <div className="mx-auto max-w-[1240px] px-4 py-7 sm:px-7">
          <div className="hud-panel dd-cut p-6 sm:p-7">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <Tent className="h-8 w-8 text-ef-accent" style={{ filter: "drop-shadow(0 0 6px rgba(255,154,47,0.5))" }} />
              <h2 className="font-mono text-3xl font-black uppercase tracking-[0.1em] text-white">야영지</h2>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-lg font-bold" style={{ color: "#f5c542" }}>
                <img src={RESOURCE_ICON.credits} alt="" className="h-6 w-6 object-contain" />{run.craft.credits}<span className="text-[13px] text-ef-muted">크레딧</span>
              </span>
            </div>
            <p className="mb-5 text-[15px] text-ef-muted">부대가 잠시 정비합니다. 정비를 마치면 각 생존 대원이 최대 HP의 <b className="text-green-300">{Math.round(REST_HEAL * 100)}%</b>를 회복하고, 잔해에서 <b style={{ color: "#f5c542" }}>크레딧 +{REST_SALVAGE.credits}</b>를 회수합니다.</p>

            <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
              {/* ── 좌: 물자관리 단말기 — 상시/시세/매입을 각각 독립 구획으로 분리 ── */}
              <div className="dd-cut border p-4" style={{ borderColor: "rgba(245,197,66,0.45)" }}>
                <div className="mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" style={{ color: "#f5c542" }} />
                  <span className="font-mono text-base font-bold" style={{ color: "#f5c542" }}>물자관리 단말기</span>
                  <span className="rounded-sm border border-ef-line/50 px-1.5 py-px font-mono text-[11px] uppercase tracking-wider text-ef-muted">물자 재분배</span>
                </div>

                {/* 상시 물자 — 가격 고정. 회색 계열로 "변하지 않음"을 색으로 못박는다. */}
                <section className="dd-cut mb-3 border-l-[3px] bg-white/[0.02] p-3" style={{ borderColor: "rgba(207,207,212,0.55)" }}>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[15px] font-bold text-white">📦 상시 물자</span>
                    <span className="rounded-sm px-1.5 py-px font-mono text-[11px] font-bold" style={{ color: "#cfcfd4", background: "rgba(207,207,212,0.14)" }}>가격 고정</span>
                    <span className="font-mono text-[12px] text-ef-muted">언제 들러도 같은 값 — 급하지 않으면 나중에 사도 됩니다</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {run.shop.map((s) => { const ok = run.craft.credits >= s.price;
                      return (
                        <button key={s.key} type="button" disabled={!ok} onClick={() => askBuy(s.label, s.price, giveIcon(s.give), () => run.buyShop(s))} title={s.desc}
                          className="dd-cut flex items-center gap-2 border px-3 py-2 text-left transition enabled:hover:border-ef-accent disabled:opacity-40"
                          style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                          <img src={giveIcon(s.give)} alt="" className="h-6 w-6 shrink-0 object-contain" />
                          <span className="min-w-0 flex-1 truncate font-mono text-[14px] text-white">{s.label}</span>
                          <span className="shrink-0 font-mono text-[14px] font-bold" style={{ color: ok ? "#f5c542" : "#ff6b5a" }}>{s.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 시세 물자 — 방문마다 변동. 호박색 + 등락 배지로 상시와 확실히 갈라놓는다. */}
                {run.market.length > 0 && (
                  <section className="dd-cut mb-3 border-l-[3px] bg-amber-400/[0.04] p-3" style={{ borderColor: "rgba(245,197,66,0.75)" }}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[15px] font-bold" style={{ color: "#f5c542" }}>📈 시세 물자</span>
                      <span className="rounded-sm px-1.5 py-px font-mono text-[11px] font-bold" style={{ color: "#f5c542", background: "rgba(245,197,66,0.16)" }}>방문마다 변동</span>
                      <span className="font-mono text-[12px] text-ef-muted"><b className="text-[#7ee081]">▼저렴</b>일 때 사두는 게 이득</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {run.market.map((o) => { const g = marketGood(o.key); if (!g) return null; const ok = run.craft.credits >= o.price;
                        const tone = o.trend === "low" ? "#7ee081" : o.trend === "high" ? "#ff8a6b" : "#cfcfd4";
                        const badge = o.trend === "low" ? "▼저렴" : o.trend === "high" ? "▲비쌈" : "평시세";
                        return (
                          <button key={o.key} type="button" disabled={!ok} onClick={() => askBuy(g.label, o.price, giveIcon(g.give), () => run.buyMarket(o.key))} title={g.desc}
                            className="dd-cut flex items-center gap-2 border px-3 py-2 text-left transition enabled:hover:border-ef-accent disabled:opacity-40"
                            style={{ borderColor: o.trend === "low" ? "rgba(126,224,129,0.5)" : "rgba(255,255,255,0.12)" }}>
                            <img src={giveIcon(g.give)} alt="" className="h-6 w-6 shrink-0 object-contain" />
                            <span className="min-w-0 flex-1 truncate font-mono text-[14px] text-white">{g.label}</span>
                            <span className="shrink-0 rounded-sm px-1.5 py-px font-mono text-[11px] font-bold" style={{ color: tone, background: tone + "1f" }}>{badge}</span>
                            <span className="shrink-0 font-mono text-[14px] font-bold" style={{ color: ok ? "#f5c542" : "#ff6b5a" }}>{o.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 매입(되팔기) — 사는 곳과 파는 곳을 색으로 갈라 놓치지 않게 한다. */}
                <section className="dd-cut border-l-[3px] bg-cyan-400/[0.05] p-3" style={{ borderColor: "rgba(103,232,249,0.7)" }}>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[15px] font-bold" style={{ color: "#67e8f9" }}>🪙 매입 — 되팔기</span>
                    <span className="rounded-sm px-1.5 py-px font-mono text-[11px] font-bold" style={{ color: "#67e8f9", background: "rgba(103,232,249,0.14)" }}>구매가 30%</span>
                    <span className="font-mono text-[12px] text-ef-muted">안 쓰는 재료·아이템을 크레딧으로 — 개수를 정해 파세요</span>
                  </div>
                  <div className="mb-2 flex flex-col gap-1.5">
                    {([["parts","부품",run.craft.mats.parts],["permits","관리권",run.craft.mats.permits],["chips","프로토콜 프리즘 세트",run.craft.mats.chips ?? 0]] as const).map(([mat,label,have]) => {
                      const qty = Math.max(1, Math.min(have, sellQty[mat] ?? 1)); // 보유량 초과 방지
                      const setQ = (v: number) => setSellQty((s) => ({ ...s, [mat]: Math.max(1, Math.min(have || 1, v || 1)) }));
                      return (
                      <div key={mat} className="flex items-center gap-1.5 font-mono text-[13px]">
                        <img src={RESOURCE_ICON[mat]} alt="" className="h-5 w-5 shrink-0 object-contain" />
                        <span className="w-32 shrink-0 truncate" style={{ color: "#cfcfd4" }}>{label}</span>
                        <span className="w-16 shrink-0 text-ef-muted">보유 {have}</span>
                        {/* 개수 입력 + 스테퍼 */}
                        <button type="button" disabled={have < 1 || qty <= 1} onClick={() => setQ(qty - 1)} className="dd-cut border px-2 py-0.5 leading-none transition enabled:hover:border-ef-accent disabled:opacity-30" style={{ borderColor: "rgba(255,255,255,0.12)", color: "#cfcfd4" }}>−</button>
                        <input type="number" min={1} max={have || 1} value={have < 1 ? 0 : qty} disabled={have < 1}
                          onChange={(e) => setQ(parseInt(e.target.value, 10))}
                          className="w-14 shrink-0 border bg-black/40 px-1 py-0.5 text-center tabular-nums text-white outline-none focus:border-ef-accent disabled:opacity-35"
                          style={{ borderColor: "rgba(255,255,255,0.14)" }} />
                        <button type="button" disabled={have < 1 || qty >= have} onClick={() => setQ(qty + 1)} className="dd-cut border px-2 py-0.5 leading-none transition enabled:hover:border-ef-accent disabled:opacity-30" style={{ borderColor: "rgba(255,255,255,0.12)", color: "#cfcfd4" }}>+</button>
                        <button type="button" disabled={have < 1} onClick={() => setQ(have)} className="shrink-0 font-mono text-[12px] text-ef-muted underline decoration-dotted underline-offset-2 transition enabled:hover:text-ef-accent disabled:opacity-30" title="보유량 전부">전체</button>
                        <button type="button" disabled={have < 1} onClick={() => { run.sellMat(mat, qty); setSellQty((s) => ({ ...s, [mat]: 1 })); }}
                          className="dd-cut ml-auto border px-3 py-1 font-bold transition enabled:hover:brightness-110 disabled:opacity-30"
                          style={{ borderColor: "rgba(103,232,249,0.55)", background: "rgba(103,232,249,0.12)", color: "#bdf3fb" }} title={`${qty}개 팔기 — ${run.sellUnit(mat) * qty}크레딧`}>판매<span className="ml-1.5" style={{ color: "#f5c542" }}>+{run.sellUnit(mat) * qty}</span></button>
                      </div>
                    ); })}
                  </div>
                  {Object.entries(run.items).some(([, n]) => (n as number) > 0) && (
                    <div className="flex flex-wrap items-center gap-1.5 border-t border-cyan-300/15 pt-2">
                      <span className="font-mono text-[13px] text-ef-muted">아이템:</span>
                      {Object.entries(run.items).filter(([, n]) => (n as number) > 0).map(([id, n]) => { const def = ITEMS[id]; if (!def) return null;
                        return (
                          <button key={id} type="button" onClick={() => run.sellItem(id)} title={`${def.desc} — ${run.itemSellValue(def.rarity)}크레딧`}
                            className="dd-cut flex items-center gap-1 border px-2 py-1 font-mono text-[13px] transition hover:brightness-110"
                            style={{ borderColor: "rgba(103,232,249,0.45)", background: "rgba(103,232,249,0.08)", color: "#cfe9ee" }}>
                            <img src={itemImage(id)} alt="" className="h-4 w-4 object-contain" />{def.name}<span className="text-ef-muted">×{n as number}</span><span style={{ color: "#f5c542" }}>+{run.itemSellValue(def.rarity)}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              {/* ── 우: 보유 물자 + 부대 정비 + 공업소 ── */}
              <div className="flex flex-col gap-4">
                {/* 뭘 살지 정하려면 지금 뭘 갖고 있는지가 보여야 한다 — 크레딧만으론 부족했다 */}
                <div className="dd-cut border p-4" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
                  <div className="mb-3 font-mono text-[15px] font-bold text-ef-muted">◆ 보유 물자</div>
                  <div className="grid grid-cols-2 gap-2">
                    {([["credits","크레딧",run.craft.credits],["parts","부품",run.craft.mats.parts],["permits","관리권",run.craft.mats.permits],["chips","프로토콜 프리즘 세트",run.craft.mats.chips ?? 0]] as const).map(([k,label,n]) => (
                      <div key={k} className="dd-cut flex items-center gap-2 border border-ef-line/40 bg-black/30 px-2.5 py-2">
                        <img src={RESOURCE_ICON[k]} alt="" className="h-6 w-6 shrink-0 object-contain" />
                        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-ef-muted">{label}</span>
                        <span className="shrink-0 font-mono text-[15px] font-bold tabular-nums" style={{ color: k === "credits" ? "#f5c542" : "#e8e8ea" }}>{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dd-cut border p-4" style={{ borderColor: "rgba(134,239,172,0.35)" }}>
                  <div className="mb-3 font-mono text-[15px] font-bold text-green-300">✚ 정비 후 부대 상태</div>
                  <div className="space-y-2.5">
                    {run.party.map((m) => {
                      const op = OPERATORS.find((o) => o.id === m.id);
                      const healed = m.hp > 0 ? Math.min(m.maxHp, Math.round(m.hp + m.maxHp * REST_HEAL)) : 0;
                      return (
                        <div key={m.id} className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: elementColor[op?.element ?? "physical"], boxShadow: `0 0 6px ${elementColor[op?.element ?? "physical"]}` }} />
                          <span className="w-24 truncate font-mono text-[13px] font-bold text-white">{op?.name ?? m.id}</span>
                          <div className="relative h-3 flex-1 overflow-hidden rounded-[2px] bg-black/75" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 3px rgba(0,0,0,0.9)" }}>
                            <div className="h-full rounded-[2px]" style={{ width: `${(healed / m.maxHp) * 100}%`, background: "rgba(134,239,172,0.22)" }}>
                              <div className="relative h-full rounded-[2px]" style={{ width: `${(m.hp / Math.max(1, healed)) * 100}%`, background: "#86efac", boxShadow: "0 0 7px #86efac77" }}>
                                <span className="pointer-events-none absolute inset-x-0 top-0 h-[45%]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent)" }} />
                              </div>
                            </div>
                          </div>
                          <span className="w-24 shrink-0 text-right font-mono text-[14px] text-ef-muted">{Math.max(0, m.hp)} → <b className="text-green-300">{healed}</b></span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* 정비 전에 공업소에 들러 장비를 만들 수 있다 — 예전엔 맵으로 나가야 했다 */}
                <button type="button" onClick={() => run.openCraftFromRest()} className="dd-cut flex w-full items-center justify-center gap-2 border py-3 font-mono text-[15px] font-bold uppercase tracking-wider transition hover:border-ef-accent hover:text-ef-accent" style={{ borderColor: run.hasCraftable ? "rgba(255,154,47,0.55)" : "rgba(255,255,255,0.14)", color: run.hasCraftable ? "#ffc478" : "#9a9aa2" }}>
                  <Hammer className="h-5 w-5" /> 공업소 들르기{run.hasCraftable && <span className="ml-1 rounded-full bg-ef-accent/20 px-2 py-0.5 text-[12px] text-ef-accent">제작 가능</span>}
                </button>
                <button type="button" onClick={run.rest} className="dd-cut mt-auto w-full py-3.5 font-mono text-[15px] font-black uppercase tracking-[0.12em] transition hover:brightness-110" style={{ background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a", boxShadow: "0 0 22px -4px rgba(255,154,47,0.6)" }}>정비하고 진행 →</button>
              </div>
            </div>
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
              const enhanced = run.party.filter((m) => Object.values(m.progress?.skillRanks ?? {}).some((r) => (r as number) > 0));
              const opName = (opid: string) => OPERATORS.find((o) => o.id === opid)?.name ?? opid;
              const lootItems = Object.entries(L.items).filter(([, n]) => n > 0);
              return (
                <div className="dd-cut mx-auto mb-6 max-w-[440px] border border-ef-accent/25 bg-black/40 p-4 text-left">
                  <div className="mb-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.24em] text-ef-accent/70">◆ 전리품</div>
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {([["⚔", "처치", L.kills], [RESOURCE_ICON.parts, "부품", `+${L.parts}`], [RESOURCE_ICON.permits, "관리권", `+${L.permits}`]] as [string, string, string | number][]).map(([ic, lb, v]) => (
                      <div key={lb} className="border border-ef-line/50 bg-[#120c07] px-2 py-2 text-center">
                        {ic.startsWith("/") ? <img src={ic} alt="" className="mx-auto h-6 w-6 object-contain" /> : <div className="text-lg leading-none">{ic}</div>}
                        <div className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ef-muted">{lb}</div>
                        <div className="font-mono text-[17px] font-bold text-ef-ink">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 font-mono text-[14px]">
                    {crafted > 0 && <div className="text-ef-muted">🛠 제작 장비 <b className="text-ef-ink">{crafted}</b>개</div>}
                    {enhanced.length > 0 && <div className="text-ef-muted">⬆ 스킬 강화 <span className="text-ef-accent-soft">{enhanced.map((m) => `${opName(m.id)} ${skillLabel(Math.max(...Object.values(m.progress!.skillRanks)))}`).join(" · ")}</span></div>}
                    {lootItems.length > 0 && <div className="text-ef-muted">🎁 획득 아이템 <span className="text-ef-ink">{lootItems.map(([itid, n]) => `${ITEMS[itid]?.name ?? itid}×${n}`).join(" · ")}</span></div>}
                  </div>
                </div>
              );
            })()}
            {/* 원정 기록 — 자동 저장(localStorage + 서버 JSONL). 학습·밸런스 분석용, JSON 복사 가능 */}
            {run.lastRecord && (() => {
              const r = run.lastRecord;
              return (
                <div className="dd-cut mx-auto mb-6 max-w-[440px] border border-ef-line/40 bg-black/30 p-3 text-left font-mono text-[13px]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold uppercase tracking-[0.2em] text-ef-muted">◆ 원정 기록</span>
                    <button type="button" onClick={() => { try { navigator.clipboard?.writeText(JSON.stringify(r, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard 불가 */ } }} className="hud-btn dd-cut px-2 py-0.5 text-[12px] text-ef-muted hover:text-white">{copied ? "복사됨 ✓" : "JSON 복사"}</button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-ef-muted">
                    <span>도달 층 <b className="text-ef-ink">{r.floorReached}/{r.totalFloors}</b></span>
                    <span>소요 <b className="text-ef-ink">{Math.floor(r.durationSec / 60)}분 {r.durationSec % 60}초</b></span>
                    <span>전투 <b className="text-ef-ink">{r.totals.battles}</b>회 · {r.totals.rounds}R</span>
                    <span>가한 피해 <b className="text-ef-ink">{r.totals.dmgDealt.toLocaleString()}</b></span>
                  </div>
                  <div className="mt-1.5 text-[12px] text-ef-line">기록 자동 저장됨 — 파티 빌드·전투별 라운드·피해·잔여 HP까지 담겨 학습/분석에 씁니다.</div>
                </div>
              );
            })()}
            <button type="button" onClick={run.restart} className="dd-cut px-6 py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition hover:brightness-110" style={{ background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a", boxShadow: "0 0 22px -4px rgba(255,154,47,0.6)" }}>새 원정 →</button>
          </div>
        </div>
      )}

      {/* 맵에서만 — 페이즈가 바뀌어도 오버레이가 남아 전투·공업소를 덮지 않게 한정 */}
      {showStatus && run.phase === "map" && <StatusPanel party={run.party} craft={run.craft} onClose={() => setShowStatus(false)} />}

      {/* 교전 중 지도 — 읽기 전용. 남은 구역을 보고 소비템·게이지를 어디에 쓸지 계획한다.
          position/zIndex는 인라인으로 준다: globals.css의 `.dd-realm > *`가 position:relative를 강제해
          main 직계 자식의 fixed가 죽고 오버레이가 문서 하단으로 밀린다(StatusPanel과 같은 처리). */}
      {showMap && run.phase === "battle" && (
        <div className="overflow-y-auto backdrop-blur-sm" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)" }} onClick={() => setShowMap(false)}>
          <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-7" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-[13px] font-bold uppercase tracking-[0.3em] text-ef-accent/70">{run.floorName} · {run.floor + 1}/{run.totalFloors}층</span>
              <button type="button" onClick={() => setShowMap(false)} className="hud-btn dd-cut ml-auto px-4 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider text-ef-muted hover:text-white">✕ 교전으로 돌아가기</button>
            </div>
            <RunMap nodes={run.nodes} frontier={run.frontier} cleared={run.cleared} party={run.party} items={run.items} faction={run.faction} floor={run.floor} totalFloors={run.totalFloors} onEnter={() => {}} readOnly currentId={run.activeNode?.id} />
          </div>
        </div>
      )}

      {/* 구매 확인 — 상점은 클릭 한 번에 결제된다. 「다시 묻지 않기」를 켜면 이후 안 뜬다. */}
      {buyAsk && (
        <div className="flex items-center justify-center px-4 backdrop-blur-sm" style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,0,0,0.8)" }} onClick={() => setBuyAsk(null)}>
          <div className="hud-panel dd-cut w-full max-w-[420px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 font-mono text-lg font-bold text-white">구매하시겠습니까?</div>
            <div className="dd-cut mb-4 flex items-center gap-3 border p-3" style={{ borderColor: "rgba(245,197,66,0.4)" }}>
              <img src={buyAsk.icon} alt="" className="h-9 w-9 shrink-0 object-contain" />
              <span className="min-w-0 flex-1 truncate font-mono text-[15px] text-white">{buyAsk.label}</span>
              <span className="flex shrink-0 items-center gap-1 font-mono text-[15px] font-bold" style={{ color: "#f5c542" }}><img src={RESOURCE_ICON.credits} alt="" className="h-4 w-4 object-contain" />{buyAsk.price}</span>
            </div>
            <p className="mb-4 font-mono text-[13px] text-ef-muted">결제 후 크레딧 <b style={{ color: "#f5c542" }}>{Math.max(0, run.craft.credits - buyAsk.price)}</b> 남음</p>
            <label className="mb-4 flex cursor-pointer items-center gap-2 font-mono text-[13px] text-ef-muted">
              <input type="checkbox" checked={buyDontAsk} onChange={(e) => setBuyDontAsk(e.target.checked)} className="h-4 w-4 accent-[#ff9a2f]" />
              다시 묻지 않기 <span className="text-ef-muted/60">— 이후 클릭 한 번에 바로 구매</span>
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setBuyAsk(null)} className="hud-btn dd-cut flex-1 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-ef-muted hover:text-white">취소</button>
              <button type="button" onClick={confirmBuy} className="dd-cut flex-1 py-2.5 font-mono text-sm font-black uppercase tracking-[0.12em] transition hover:brightness-110" style={{ background: `linear-gradient(180deg,#ffb257,${PRIMARY})`, color: "#0a0a0a" }}>구매</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

