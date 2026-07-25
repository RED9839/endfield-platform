"use client";

import { useState } from "react";
import { ChevronLeft, Hammer, Check, Lock } from "lucide-react";

import { GEAR_PIECES_BY_SET_SLOT, GEAR_PIECE_BY_ID, GEAR_SLOTS, LOADOUT_SLOTS, gearSlotName, pieceImage, pieceSlotOf, slotOptions, SET_NAMES, SINGLE_SETS, type GearPiece, type GearSlot, type LoadoutSlot  , attrsText, ATTR_KO } from "../gear";
import { craftCost, forgeCost, skillForgeCost, canAfford, pieceLevel, isOwned, type CraftState } from "../craft";
import { SKILL_MAX, SKILL_KINDS, skillLabel, skillRankDmg, skillUtilMult, type SkillKind } from "../progress";
import { OPERATORS, avatarUrl, SKILLS, skillIcon, OP_BASIC_ATK, OP_MAINSUB } from "../roster";
import { BASIC } from "../combat";
import type { PartyMember } from "../run";
import { RESOURCE_ICON } from "../items";
import { DMG_LABEL, SKILL_KIND_SHORT } from "../labels";

const CUT = { clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" };
const dmgText = (p: GearPiece) => { if (!p.dmg) return ""; const pct = ["hpPct"].includes(p.dmg.kind) || p.dmg.base < 1; return `${DMG_LABEL[p.dmg.kind] ?? p.dmg.kind} +${pct ? Math.round(p.dmg.base * 100) + "%" : Math.round(p.dmg.base)}`; };
// 카탈로그 분류: 고급 세트 장비(세트효과 Lv70) + 고급 단일 장비(세트효과 없는 Lv70, ?·절망 통합)
const SINGLE_TAB = "__single__";
const SETS = SET_NAMES;

// 마스터리 강화 전/후 비교 — 「무엇이 몇 % 오르는지」를 숫자로 보여준다.
// 딜: mst 있는 스킬은 실측 배율(mst[r-1]/power), 없으면 공통 곡선(skillRankDmg).
//     일반 공격은 오퍼별 실측 풀콤보(OP_BASIC_ATK)가 기준 배율이라 그걸 곱한다.
// 유틸(취약·회복·게이지 등)은 같은 곡선(skillUtilMult)을 탄다 — combat.ts의 utilMult.
function masteryPreview(opId: string, k: SkillKind, rank: number) {
  const sk = k === "attack" ? BASIC : (SKILLS[opId] ?? []).find((s) => s.kind === k);
  const next = Math.min(SKILL_MAX, rank + 1);
  const base = k === "attack" ? (OP_BASIC_ATK[opId] ?? BASIC.power ?? 0.9) : (sk?.power ?? 0);
  const mulOf = (r: number) => (sk?.mst && r > 0 ? sk.mst[r - 1] / (sk.power || 1) : skillRankDmg(r));
  const cur = base * mulOf(rank), nxt = base * mulOf(next);
  return {
    hasDmg: base > 0,
    curPct: cur * 100, nextPct: nxt * 100,
    dmgGain: cur > 0 ? (nxt / cur - 1) * 100 : 0,
    utilGain: (skillUtilMult(next) / skillUtilMult(rank) - 1) * 100,
  };
}

// 단조 레벨(0~3) 핍
function ForgePips({ lv }: { lv: number }) {
  return <span className="inline-flex items-center gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i < lv ? "#ff9a2f" : "#3a3a40", boxShadow: i < lv ? "0 0 4px #ff9a2f" : undefined }} />)}</span>;
}
// 재료 비용(감당 가능 여부 색상)
function Cost({ parts, permits, chips, ok }: { parts?: number; permits?: number; chips?: number; ok: boolean }) {
  return <span className={`font-mono text-[12px] tabular-nums ${ok ? "text-ef-muted" : "text-red-400/90"}`} title="비용">
    {chips ? <>{chips}<span className="opacity-55">프로토콜 프리즘 세트</span></> : <>{parts}<span className="opacity-55">부품</span> {permits}<span className="opacity-55">관리권</span></>}
  </span>;
}

export default function CraftPanel({ craft, party = [], onCraft, onForge, onSwap, onForgeSkill, onClose, initialTab }: { craft: CraftState; party?: PartyMember[]; onCraft: (id: string) => boolean; onForge: (id: string) => boolean; onSwap?: (opId: string, slot: LoadoutSlot, pieceId: string) => void; onForgeSkill?: (opId: string, kind: SkillKind) => boolean; onClose: () => void; initialTab?: "party" | "catalog" | "mastery" }) {
  const [set, setSet] = useState<string>(SETS[0]);
  const [tab, setTab] = useState<"party" | "catalog" | "mastery">(initialTab ?? (party.length > 0 ? "party" : "catalog"));
  const [swap, setSwap] = useState<{ opId: string; slot: LoadoutSlot } | null>(null); // 교체 피커 열림 슬롯
  const affordCraft = (p: GearPiece) => { const c = craftCost(p); return craft.mats.parts >= c.parts && craft.mats.permits >= c.permits; };
  const affordForge = (lv: number) => { const c = forgeCost(lv); return craft.mats.parts >= c.parts && craft.mats.permits >= c.permits; };
  const opName = (id: string) => OPERATORS.find((o) => o.id === id)?.name ?? id;

  // 피스 타일(부대·카탈로그 공용). onSwapClick 주면 "변경" 버튼 표시(부대 장비 슬롯 교체).
  const PieceTile = ({ p, slotLabel, onSwapClick, swapOpen }: { p: GearPiece; slotLabel?: boolean; onSwapClick?: () => void; swapOpen?: boolean }) => {
    const owned = isOwned(craft, p.id); const lv = pieceLevel(craft, p.id); const cc = craftCost(p); const fc = forgeCost(lv);
    const img = pieceImage(p.name); const canC = affordCraft(p); const canF = affordForge(lv);
    return (
      <div className={`hud-tile dd-cut flex items-center gap-2.5 p-2 ${owned ? "!border-ef-accent/45" : ""}`}>
        {onSwapClick && <button type="button" onClick={onSwapClick} title="장착한 장비를 다른 피스로 교체" className={`dd-cut flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-[15px] font-bold transition ${swapOpen ? "border-ef-accent bg-ef-accent/15 text-ef-accent" : "border-ef-line text-ef-muted hover:border-ef-accent/60 hover:text-ef-accent"}`}>⇄</button>}
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center border border-ef-line/60 bg-black/50" style={owned ? { boxShadow: "inset 0 0 0 1px #ff9a2f44" } : undefined}>
          {img ? <img src={img} alt="" loading="lazy" className="h-full w-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} /> : <span className="font-mono text-[12px] text-ef-muted">—</span>}
          {owned && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-sm bg-black/90 px-1 py-px"><ForgePips lv={lv} /></span>}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate font-mono text-[14px] font-bold text-white" title={p.name}>{slotLabel && <span className="shrink-0 border border-ef-line/60 px-1 py-px text-[11px] font-normal uppercase tracking-wide text-ef-muted">{gearSlotName(p.slot)}</span>}<span className="truncate">{p.name}</span></div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[13px] text-ef-muted">
            <span>방어 <b className="text-ef-ink/80">{p.def}</b></span>
            <span className="text-ef-ink/80">{attrsText(p.attrs) || `능력치 +${p.grade.base}`}</span>
            {p.dmg && <span className="text-emerald-300/75">{dmgText(p)}</span>}
          </div>
        </div>
        {!owned ? (
          <button type="button" disabled={!canC} onClick={() => onCraft(p.id)} className={`dd-cut flex shrink-0 flex-col items-center gap-0.5 border px-3 py-1.5 transition disabled:opacity-45 ${canC ? "border-ef-accent bg-ef-accent/15 text-ef-accent shadow-[0_0_10px_rgba(255,154,47,0.18)] hover:bg-ef-accent/28" : "border-ef-line text-ef-muted"}`}>
            <span className="flex items-center gap-1 font-mono text-[14px] font-bold uppercase">{canC ? <Hammer className="h-3 w-3" /> : <Lock className="h-3 w-3" />}제작</span>
            <Cost parts={cc.parts} permits={cc.permits} ok={canC} />
          </button>
        ) : lv < 3 ? (
          <button type="button" disabled={!canF} onClick={() => onForge(p.id)} className={`dd-cut flex shrink-0 flex-col items-center gap-0.5 border px-2.5 py-1.5 transition disabled:opacity-45 ${canF ? "border-ef-accent/60 text-ef-accent-soft hover:bg-ef-accent/10" : "border-ef-line text-ef-muted"}`}>
            <span className="font-mono text-[14px] font-bold uppercase">단조 {lv}→{lv + 1}</span>
            <Cost parts={fc.parts} permits={fc.permits} ok={canF} />
          </button>
        ) : (
          <span className="flex shrink-0 flex-col items-center gap-0.5 border border-green-400/30 px-2.5 py-1.5 font-mono text-[14px] font-bold uppercase text-green-300" style={CUT}><Check className="h-3.5 w-3.5" />최대</span>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6">
      {/* 헤더 */}
      <div className="hud-panel dd-cut mb-3 flex items-center gap-3 px-3 py-2.5">
        {/* 뉴비가 '원정 포기'밖에 못 찾던 문제 — 나가는 길에 라벨을 붙인다 */}
        <button type="button" onClick={onClose} className="hud-btn flex h-9 shrink-0 items-center gap-1 whitespace-nowrap px-2.5 font-mono text-[13px] font-bold text-ef-muted hover:text-white" style={CUT} aria-label="던전으로 돌아가기"><ChevronLeft className="h-5 w-5" />던전으로</button>
        <Hammer className="h-6 w-6 text-ef-accent" style={{ filter: "drop-shadow(0 0 6px rgba(255,154,47,0.5))" }} />
        <div>
          <p className="font-mono text-[13px] font-bold uppercase tracking-[0.32em] text-ef-accent/70">Industry · 장비 제조</p>
          <h2 className="font-mono text-xl font-black uppercase tracking-[0.12em] text-white">공업소</h2>
          <p className="mt-0.5 font-mono text-[13px] text-ef-muted">장비 제작·단조는 <b className="text-ef-ink/70">부품·관리권</b>, 오퍼 <b className="text-ef-ink/70">마스터리</b>는 <b style={{color:"#67e8f9"}}>프로토콜 프리즘 세트</b>으로. 재료는 야영지 물자관리 단말기에서 삽니다.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hud-tile flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 font-mono text-sm" style={CUT} title="장비 부품 — 제작·단조 재료"><img src={RESOURCE_ICON.parts} alt="" className="h-4.5 w-4.5 shrink-0 object-contain" /><b className="text-white">{craft.mats.parts}</b><span className="whitespace-nowrap text-[13px] text-ef-muted">부품</span></span>
          <span className="hud-tile flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 font-mono text-sm" style={CUT} title="관리권 — 제작·단조 재료"><img src={RESOURCE_ICON.permits} alt="" className="h-4.5 w-4.5 shrink-0 object-contain" /><b className="text-white">{craft.mats.permits}</b><span className="whitespace-nowrap text-[13px] text-ef-muted">관리권</span></span>
          <span className="hud-tile flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 font-mono text-sm" style={CUT} title="프로토콜 프리즘 세트 — 스킬 마스터리 강화 재료"><img src={RESOURCE_ICON.chips} alt="" className="h-4.5 w-4.5 shrink-0 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /><b className="text-white">{craft.mats.chips ?? 0}</b><span className="whitespace-nowrap text-[13px] text-ef-muted">프리즘 세트</span></span>
          {/* 제작을 마치고 돌아가는 주 동선 — 강조해서 '원정 포기'와 헷갈리지 않게 */}
          <button type="button" onClick={onClose} className="dd-cut flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap border border-ef-accent/70 bg-ef-accent/15 px-3 font-mono text-sm font-bold text-ef-accent hover:bg-ef-accent/25">제작 완료 · 던전으로 ▶</button>
        </div>
      </div>

      {/* 탭: 부대 장비 / 스킬 마스터리 / 전체 카탈로그 */}
      <div className="mb-3 flex items-center gap-2">
        {party.length > 0 && <button type="button" onClick={() => setTab("party")} className={`hud-btn dd-cut px-3.5 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider ${tab === "party" ? "hud-btn-on" : "text-ef-muted"}`}>부대 장비</button>}
        {party.length > 0 && onForgeSkill && <button type="button" onClick={() => setTab("mastery")} className={`hud-btn dd-cut px-3.5 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider ${tab === "mastery" ? "hud-btn-on" : "text-ef-muted"}`}>스킬 마스터리</button>}
        <button type="button" onClick={() => setTab("catalog")} className={`hud-btn dd-cut px-3.5 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider ${tab === "catalog" ? "hud-btn-on" : "text-ef-muted"}`}>전체 카탈로그</button>
        <span className="ml-1 font-mono text-[13px] text-ef-muted">{tab === "party" ? "부대가 실제 착용한 피스 — 제작·단조 우선" : tab === "mastery" ? "오퍼 스킬 랭크 강화 — 프로토콜 프리즘 세트 소모" : "세트별 대체 피스 제작"}</span>
      </div>

      {/* 스킬 마스터리 — 오퍼별로 기본/배틀/연계/궁 각각 강화(원작대로 트랙 분리) */}
      {tab === "mastery" && onForgeSkill && (() => {
        const KIND_TONE: Record<string, string> = { attack: "#9a9aa2", battle: "#ff9a2f", link: "#67e8f9", ult: "#f5c542" };
        return (
        <div className="grid gap-2.5 lg:grid-cols-2">
          {party.map((m) => {
            const op = OPERATORS.find((o) => o.id === m.id);
            const ranks = m.progress?.skillRanks ?? { attack: 0, battle: 0, link: 0, ult: 0 };
            const byKind = (k: SkillKind) => (SKILLS[m.id] ?? []).find((s) => s.kind === k);
            return (
              <div key={m.id} className="hud-panel dd-cut p-3">
                <div className="mb-2 flex items-center gap-2">
                  <img src={avatarUrl(m.id)} alt="" loading="lazy" className="h-10 w-10 shrink-0 border border-ef-line object-cover" style={{ background: "#000" }} />
                  <span className="font-mono text-[17px] font-bold text-white">{opName(m.id)}</span>
                  {op && <span className="font-mono text-[12px] uppercase text-ef-muted">{op.element}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {SKILL_KINDS.map((k) => {
                    const sk = k === "attack" ? { name: "일반 공격" } : byKind(k);
                    if (!sk) return null;
                    const rank = ranks[k] ?? 0; const maxed = rank >= SKILL_MAX; const cost = skillForgeCost(rank); const ok = canAfford(craft.mats, cost);
                    const pv = masteryPreview(m.id, k, rank);
                    return (
                      <div key={k} className="border border-ef-line/40 px-2 py-1.5">
                        <div className="flex items-center gap-2">
                          {k !== "attack" && <img src={skillIcon(m.id, k)} alt="" className="h-4 w-4 shrink-0 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
                          <span className="w-11 shrink-0 font-mono text-[11px] font-bold uppercase" style={{ color: KIND_TONE[k] }}>{SKILL_KIND_SHORT[k]}</span>
                          <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-white" title={sk.name}>{sk.name}</span>
                          <span className="shrink-0 font-mono text-[13px] font-bold" style={{ color: rank > 0 ? "#67e8f9" : "#c9c9cf" }}>{skillLabel(rank)}</span>
                          {maxed
                            ? <span className="shrink-0 font-mono text-[12px] text-ef-accent-soft">최대</span>
                            : <button type="button" disabled={!ok} onClick={() => onForgeSkill(m.id, k)} title="이 스킬을 강화(프로토콜 프리즘 세트 소모, 다음 전투부터)" className={`dd-cut flex shrink-0 items-center gap-1 px-2 py-0.5 font-mono text-[12px] font-bold ${ok ? "border border-ef-accent/60 text-ef-accent hover:bg-ef-accent/10" : "border border-ef-line/40 text-ef-muted opacity-50 cursor-not-allowed"}`}>
                                <Hammer className="h-3 w-3" />강화 <Cost chips={cost.chips} ok={ok} /></button>}
                        </div>
                        {/* 강화 전 → 후 비교. 「몇 %가 뭐가 오르는지」가 안 보여 강화 판단이 불가능했다. */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-1 font-mono text-[11px] tabular-nums">
                          {pv.hasDmg && (
                            maxed
                              ? <span className="text-ef-muted">피해 <b className="text-ef-accent-soft">{pv.curPct.toFixed(0)}%</b> <span className="text-ef-muted/70">(최대)</span></span>
                              : <span className="text-ef-muted">피해 <b className="text-white/85">{pv.curPct.toFixed(0)}%</b> <span className="text-ef-muted/60">→</span> <b className="text-emerald-300">{pv.nextPct.toFixed(0)}%</b> <span className="text-emerald-300/80">+{pv.dmgGain.toFixed(1)}%</span></span>
                          )}
                          {!maxed && (
                            <span className="text-ef-muted" title="취약·회복·게이지·버프 지속 등 스킬의 수치 효과">
                              {pv.hasDmg ? "· " : ""}효과 <b className="text-cyan-300">+{pv.utilGain.toFixed(1)}%</b>
                              {!pv.hasDmg && <span className="text-ef-muted/70"> (취약·회복·게이지 등)</span>}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        );
      })()}

      {/* 부대 장비 */}
      {tab === "party" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {party.map((m) => {
            const op = OPERATORS.find((o) => o.id === m.id);
            return (
              <div key={m.id} className="hud-panel dd-cut p-3">
                <div className="mb-2 flex items-center gap-2">
                  <img src={avatarUrl(m.id)} alt="" loading="lazy" className="h-9 w-9 shrink-0 border border-ef-line object-cover" style={{ background: "#000" }} />
                  <span className="font-mono text-[17px] font-bold text-white">{opName(m.id)}</span>
                  {op && <span className="font-mono text-[13px] uppercase text-ef-muted">{op.element}</span>}
                  {OP_MAINSUB[m.id] && <span className="ml-auto font-mono text-[12px] text-ef-muted" title="장비 제작 시 이 능력치를 올리면 공격력이 오릅니다 (주요×0.5% + 보조×0.2%)">제작 우선 <b className="text-ef-accent-soft">★{ATTR_KO[OP_MAINSUB[m.id][0]]}</b> · ☆{ATTR_KO[OP_MAINSUB[m.id][1]]}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {LOADOUT_SLOTS.map((slot) => {
                    const ref = m.loadout?.[slot]; const p = ref ? GEAR_PIECE_BY_ID[ref] : undefined;
                    const open = swap?.opId === m.id && swap.slot === slot;
                    return (
                      <div key={slot}>
                        {p ? <PieceTile p={p} slotLabel onSwapClick={onSwap ? () => setSwap({ opId: m.id, slot }) : undefined} swapOpen={open} /> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 전체 카탈로그 */}
      {tab === "catalog" && (
        <>
          <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider text-ef-accent/70">고급 세트 장비 <span className="font-normal text-ef-muted">· 3부위 세트 효과</span></div>
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {SETS.map((s) => <button key={s} type="button" onClick={() => setSet(s)} className={`hud-btn dd-cut px-2.5 py-1 font-mono text-[15px] font-bold ${set === s ? "hud-btn-on" : "text-ef-muted"}`}>{s}</button>)}
          </div>
          <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider text-ef-accent/70">고급 단일 장비 <span className="font-normal text-ef-muted">· 세트 효과 없는 자유 슬롯 피스</span></div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setSet(SINGLE_TAB)} className={`hud-btn dd-cut px-2.5 py-1 font-mono text-[15px] font-bold ${set === SINGLE_TAB ? "hud-btn-on" : "text-ef-muted"}`}>고급 단일</button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {GEAR_SLOTS.map((slot: GearSlot) => {
              const pieces = set === SINGLE_TAB ? SINGLE_SETS.flatMap((ss) => GEAR_PIECES_BY_SET_SLOT[ss]?.[slot] ?? []) : (GEAR_PIECES_BY_SET_SLOT[set]?.[slot] ?? []);
              return (
                <div key={slot} className="hud-panel dd-cut p-2.5">
                  <div className="mb-2 font-mono text-[15px] font-bold uppercase tracking-[0.2em] text-ef-accent/80">{gearSlotName(slot)} <span className="font-normal text-ef-muted">· {pieces.length}</span></div>
                  <div className="flex flex-col gap-1.5">
                    {pieces.map((p) => <PieceTile key={p.id} p={p} />)}
                    {!pieces.length && <div className="py-4 text-center font-mono text-[14px] text-ef-muted">피스 없음</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 장비 교체 모달 — 편성 화면(RosterSelect)의 '장비 변경'과 동일한 선택 방식으로 통일.
          인라인 피커는 좁은 슬롯 안에서 2열로 눌려 후보를 알아보기 어려웠다. */}
      {swap && onSwap && (() => {
        const m = party.find((x) => x.id === swap.opId);
        const op = m ? OPERATORS.find((o) => o.id === m.id) : undefined;
        const ref = m?.loadout?.[swap.slot];
        const close = () => setSwap(null);
        return (
          <div onClick={close} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div onClick={(e) => e.stopPropagation()} className="flex max-h-[88vh] w-full max-w-[640px] flex-col border border-ef-accent/50 bg-[#0d0906]" style={CUT}>
              <div className="flex items-center gap-2 border-b border-ef-line p-3.5">
                <span className="font-mono text-lg font-bold text-white">장비 교체 <span className="text-sm text-ef-muted">— {opName(swap.opId)} · {gearSlotName(swap.slot)}</span></span>
                <button type="button" onClick={close} className="ml-auto shrink-0 border border-ef-line px-2 py-1 font-mono text-sm text-ef-muted transition hover:border-ef-accent/60 hover:text-white">✕</button>
              </div>
              <div className="overflow-y-auto p-3">
                {/* 후보는 **제작한 장비만**. 미제작까지 늘어놓으면 지금 낄 수 있는 게 뭔지 보이지 않는다.
                    n을 넉넉히 줘서 상위 16개 밖으로 밀려난 보유 피스가 잘리지 않게 한다. */}
                {(() => {
                // 현재 착용 중인 피스는 아직 미제작이어도 남긴다 — 목록에서 사라지면 뭘 끼고 있는지 알 수 없다.
                const owned = slotOptions(pieceSlotOf(swap.slot), op?.element, 999).filter((p) => isOwned(craft, p.id) || ref === p.id);
                const made = owned.filter((p) => isOwned(craft, p.id)).length;
                if (!owned.length) return <div className="px-1 py-6 text-center font-mono text-[13px] text-ef-muted">제작한 {gearSlotName(swap.slot)}이(가) 없습니다.<br /><span className="text-ef-muted/70">「전체 카탈로그」에서 먼저 제작하세요.</span></div>;
                return (<>
                <div className="mb-2 font-mono text-[13px] text-ef-muted">{gearSlotName(swap.slot)} 후보 · <span className={made ? "text-emerald-300/80" : "text-amber-300/70"}>제작한 장비 {made}개</span>{made < owned.length && <span className="text-ef-muted/70"> (+ 착용 중 {owned.length - made})</span>} · <span>{op?.element} 효율순</span></div>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {owned.map((opt) => { const sel = ref === opt.id; return (
                    <button key={opt.id} type="button" onClick={() => { onSwap(swap.opId, swap.slot, opt.id); close(); }} className={`dd-cut flex items-center gap-2 border p-2 text-left transition ${sel ? "border-ef-accent bg-ef-accent/10" : "border-ef-line hover:border-ef-accent/50"}`}>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-ef-line/50 bg-black/40">{pieceImage(opt.name) ? <img src={pieceImage(opt.name)} alt="" loading="lazy" className="h-full w-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} /> : null}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-mono text-[15px] font-bold text-white" title={opt.name}>{opt.name}{sel && <span className="ml-1 text-[11px] text-ef-accent">● 착용</span>}</span>
                        <span className="font-mono text-[13px] text-ef-ink/70">{attrsText(opt.attrs) || `능력치 +${opt.grade.base}`} · 방어 +{opt.def}{opt.dmg ? ` · ${dmgText(opt)}` : ""}</span>
                        <span className="block font-mono text-[12px] text-ef-muted">{opt.set !== "?" ? opt.set + " 세트" : "자유 슬롯"} · {isOwned(craft, opt.id) ? <span className="text-emerald-300/80">제작됨</span> : <span className="text-amber-300/70">미제작(장착 중)</span>}</span>
                      </span>
                    </button>
                  ); })}
                </div>
                </>);
                })()}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
