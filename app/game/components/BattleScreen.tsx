"use client";

import Image from "next/image";
import { useState } from "react";
import { Battery, Crosshair, FlaskConical, Flame, Gem, HeartPulse, Layers, Shield, SkipForward, Swords, Trash2, TrendingUp, Zap } from "lucide-react";

import { getRelic } from "../data/relics";
import { getPotion, potionNeedsTarget } from "../data/potions";
import { getEnemyWeakness } from "../data/enemy-traits";

const ELEMENT_NAME: Record<Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
import type { BattleEnemy, BattleState, Card, Element, EnemyMechanic, PartyMember, SkillKind } from "../types/game";

// 유물/포션 아이콘 키 → lucide 컴포넌트
const ICON_MAP: Record<string, typeof Zap> = { battery: Battery, zap: Zap, crosshair: Crosshair, "trending-up": TrendingUp, shield: Shield, layers: Layers, "heart-pulse": HeartPulse, flame: Flame };

const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };

// 원소색(게임플레이 의미색 보존)
const elementColor: Record<Element, string> = {
  physical: "#d4d4d8",
  heat: "#fb923c",
  electric: "#a78bfa",
  cryo: "#67e8f9",
  nature: "#86efac",
};
const kindLabel: Record<SkillKind, string> = { attack: "기본", "battle-skill": "배틀", "link-skill": "연계", ultimate: "궁극" };

function statusLabel(status: string) {
  if (status === "combustion") return "연소";
  if (status === "shock") return "감전";
  if (status === "freeze") return "동결";
  if (status === "corrosion") return "부식";
  if (status === "defense-break") return "불균형";
  if (status === "armor-break") return "관통";
  return status;
}

// 적 상시 특성(전투에서 의미 있는 것만 노출). 색: 방어형=청록 / 위협형=적 / 보조형=주황.
const TRAIT_INFO: Partial<Record<EnemyMechanic, { label: string; tone: "def" | "threat" | "support" }>> = {
  armored: { label: "장갑", tone: "def" },
  shield: { label: "방패", tone: "def" },
  "boss-shield": { label: "결계", tone: "def" },
  evasive: { label: "회피", tone: "def" },
  reflect: { label: "반사", tone: "threat" },
  revive: { label: "부활", tone: "threat" },
  enrage: { label: "격노", tone: "threat" },
  charge: { label: "차지", tone: "threat" },
  "self-destruct": { label: "자폭", tone: "threat" },
  ranged: { label: "원거리", tone: "threat" },
  poison: { label: "독성", tone: "threat" },
  healer: { label: "치유", tone: "support" },
  summoner: { label: "지원", tone: "support" },
};
const TRAIT_TONE: Record<"def" | "threat" | "support", string> = { def: "#67e8f9", threat: "#fca5a5", support: "#fbbf24" };
const TRAIT_ORDER = Object.keys(TRAIT_INFO) as EnemyMechanic[];

function Bar({ value, max, color, height = "h-2" }: { value: number; max: number; color: string; height?: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className={`${height} w-full overflow-hidden border border-ef-line bg-black/60`}>
      <div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function EnemyCard({ enemy, selected, onSelect }: { enemy: BattleEnemy; selected: boolean; onSelect: () => void }) {
  const dead = enemy.hp <= 0;
  const broken = enemy.statuses.includes("defense-break");
  const tg = enemy.telegraph;
  const until = Math.max(0, enemy.actionEvery - enemy.actionGauge); // 행동까지 사용해야 할 카드 수
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={dead}
      className={`group relative w-[180px] shrink-0 border bg-ef-card2 p-3 text-left transition ${dead ? "opacity-25 grayscale" : selected ? "-translate-y-1" : "hover:-translate-y-0.5"}`}
      style={{ ...CUT_SM, borderColor: selected && !dead ? ACCENT : "#202020" }}
    >
      {selected && !dead && (
        <span className="absolute -top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wide text-black" style={{ ...CUT_SM, background: ACCENT }}>
          <Crosshair className="h-3 w-3" /> TARGET
        </span>
      )}
      {/* 카드 템포 카운트다운: 이 적이 행동하기까지 사용해야 할 카드 수 */}
      {!dead && (
        <span
          className="absolute left-2 top-2 z-10 flex items-center gap-1 border bg-black/80 px-1.5 py-0.5 font-mono text-[9px] font-black tabular-nums"
          style={{ ...CUT_SM, borderColor: until <= 1 ? "#f8717188" : "#3a4250", color: until <= 1 ? "#fca5a5" : "#cbd5e1" }}
          title="이 적이 행동하기까지 사용해야 하는 카드 수"
        >
          <Layers className="h-3 w-3" /> {until <= 0 ? "행동!" : `${until}장 후`}
        </span>
      )}
      {/* 텔레그래프(다음 행동 예고) */}
      {!dead && tg && (
        <span
          className="absolute right-2 top-2 z-10 flex items-center gap-1 border bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-black tabular-nums"
          style={{ ...CUT_SM, borderColor: tg.kind === "stunned" ? "#fb923c" : "#f87171", color: tg.kind === "stunned" ? "#fb923c" : "#fca5a5" }}
          title="다음 적 행동"
        >
          {tg.kind === "stunned" ? <Zap className="h-3 w-3" /> : <Swords className="h-3 w-3" />} {tg.label}
        </span>
      )}
      <div className="relative mx-auto h-24 w-24">
        {enemy.image ? <Image src={enemy.image} alt={enemy.name} fill sizes="96px" className="object-contain" /> : <Shield className="mx-auto mt-6 h-12 w-12 text-red-200/30" />}
      </div>
      <p className="mt-1 truncate text-sm font-black text-white">{enemy.name}</p>
      {!dead && (() => {
        const weak = getEnemyWeakness(enemy.faction);
        return weak ? (
          <p className="mt-0.5 font-mono text-[9px] font-bold" style={{ color: elementColor[weak] }}>
            약점 · {ELEMENT_NAME[weak]}
          </p>
        ) : null;
      })()}
      {!dead && (() => {
        const traits = TRAIT_ORDER.filter((m) => enemy.mechanics.includes(m)).slice(0, 4);
        return traits.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1">
            {traits.map((m) => {
              const info = TRAIT_INFO[m]!;
              return (
                <span key={m} className="border px-1 py-px font-mono text-[8px] font-black uppercase tracking-wide" style={{ ...CUT_SM, borderColor: `${TRAIT_TONE[info.tone]}55`, color: TRAIT_TONE[info.tone], background: `${TRAIT_TONE[info.tone]}12` }}>{info.label}</span>
              );
            })}
          </div>
        ) : null;
      })()}
      <div className="mt-1 flex items-center justify-between font-mono text-[10px] font-bold tabular-nums text-ef-muted">
        <span>HP</span><span>{enemy.hp}/{enemy.maxHp}</span>
      </div>
      <Bar value={enemy.hp} max={enemy.maxHp} color="#f43f5e" />
      {enemy.staggerHp > 0 && (
        <div className="mt-1.5">
          <div className="mb-0.5 flex items-center justify-between font-mono text-[8px] font-bold uppercase tracking-wide">
            <span className={broken ? "text-orange-300" : "text-ef-muted"}>{broken ? "● BREAK" : "STAGGER"}</span>
            <span className="tabular-nums text-ef-muted">{Math.round(enemy.stagger)}/{enemy.staggerHp}</span>
          </div>
          <Bar value={enemy.stagger} max={enemy.staggerHp} color={broken ? "#ff5d5d" : "#ff9a2f"} height="h-1.5" />
        </div>
      )}
      {enemy.physBreakStacks > 0 && (
        <div className="mt-1 flex items-center gap-1">
          <span className="font-mono text-[8px] font-bold uppercase text-sky-300/80">취약</span>
          <span className="flex gap-0.5">{Array.from({ length: 4 }, (_, k) => <span key={k} className="text-[9px] leading-none" style={{ color: k < enemy.physBreakStacks ? "#7dd3fc" : "#33415580" }}>◆</span>)}</span>
        </div>
      )}
      {enemy.statuses.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {enemy.statuses.map((s) => (
            <span key={s} className="border border-ef-line bg-black/40 px-1.5 py-0.5 text-[8px] font-black text-ef-accent-soft" style={CUT_SM}>{statusLabel(s)}</span>
          ))}
        </div>
      )}
    </button>
  );
}

function PartyCard({ member }: { member: PartyMember }) {
  const dead = member.hp <= 0;
  return (
    <div className={`w-[150px] shrink-0 border border-ef-line bg-ef-card p-2.5 ${dead ? "opacity-30 grayscale" : ""}`} style={CUT_SM}>
      <div className="flex items-center gap-2">
        <span className="relative h-10 w-10 shrink-0 overflow-hidden border border-ef-line bg-black" style={{ ...CUT_SM, borderColor: `${elementColor[member.element]}66` }}>
          {member.image ? <Image src={member.image} alt={member.name} fill sizes="40px" className="object-cover object-top" /> : null}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-white">{member.name}</p>
          <p className="font-mono text-[9px] uppercase tracking-wide" style={{ color: elementColor[member.element] }}>{member.className}</p>
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] font-bold tabular-nums text-ef-muted">
        <span>HP</span><span>{member.hp}/{member.maxHp}{member.shield > 0 ? ` (+${member.shield})` : ""}</span>
      </div>
      <Bar value={member.hp} max={member.maxHp} color="#34d399" />
      {member.shield > 0 && (
        <div className="mt-1 flex items-center gap-1 font-mono text-[9px] font-bold text-cyan-300"><Shield className="h-3 w-3" /> 보호막 {member.shield}</div>
      )}
    </div>
  );
}

function HandCard({ card, playable, downed = false, onPlay }: { card: Card; playable: boolean; downed?: boolean; onPlay: () => void }) {
  const col = elementColor[card.element];
  return (
    <button
      type="button"
      onClick={onPlay}
      disabled={!playable}
      className={`relative flex h-[180px] w-[132px] shrink-0 flex-col border bg-gradient-to-b from-ef-card2 to-ef-bg p-2.5 text-left transition ${playable ? "hover:-translate-y-3" : "cursor-not-allowed opacity-40"}`}
      style={{ ...CUT_SM, borderColor: playable ? `${col}99` : "#202020" }}
    >
      {downed && (
        <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/70 font-mono text-[10px] font-black uppercase tracking-wider text-red-400" style={CUT_SM}>전투 불능</span>
      )}
      <div className="flex items-start justify-between">
        <span className="flex h-7 w-7 items-center justify-center border font-mono text-sm font-black tabular-nums text-black" style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}>{card.cost}</span>
        <span className="border border-ef-line bg-black/50 px-1.5 py-0.5 font-mono text-[8px] font-black uppercase" style={{ ...CUT_SM, color: col }}>{kindLabel[card.kind]}</span>
      </div>
      <div className="relative mx-auto mt-1 h-12 w-12">
        {card.icon ? <Image src={card.icon} alt="" fill sizes="48px" className="object-contain" /> : null}
      </div>
      <p className="mt-1 line-clamp-2 text-[11px] font-black leading-tight text-white">{card.name}</p>
      <p className="font-mono text-[8px] uppercase tracking-wide text-ef-muted">{card.operatorName}</p>
      <div className="mt-auto border-t border-ef-line pt-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase text-ef-muted">{card.target === "all-enemies" ? "전체" : card.target === "party" ? "파티" : "단일"}</span>
          {card.stagger > 0 && (
            <span className="font-mono text-[8px] font-black tabular-nums" style={{ color: PRIMARY }} title="불균형치">◇{card.stagger}</span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 font-mono text-[9px] font-bold leading-tight" style={{ color: card.effect ? "#7fd4a3" : ACCENT }}>{card.effectLine}</p>
      </div>
    </button>
  );
}

export default function BattleScreen({
  party,
  battle,
  relics = [],
  potions = [],
  onPlayCard,
  onEndTurn,
  onUsePotion,
}: {
  party: PartyMember[];
  battle: BattleState;
  relics?: string[];
  potions?: string[];
  onPlayCard: (uid: string, targetEnemyId?: string) => void;
  onEndTurn: () => void;
  onUsePotion?: (potionId: string, targetEnemyId?: string) => void;
}) {
  const living = battle.enemies.filter((e) => e.hp > 0);
  const [selRaw, setSel] = useState<string | undefined>(living[0]?.id);
  const selectedId = living.some((e) => e.id === selRaw) ? selRaw : living[0]?.id;

  // 시전 오퍼가 전투 불능이면 그 오퍼의 카드는 낼 수 없다(전술 카드는 오퍼 무관).
  const downedOps = new Set(party.filter((m) => m.hp <= 0).map((m) => m.id));
  const casterAlive = (card: Card) => card.tactical || !card.operatorId || !downedOps.has(card.operatorId);

  const play = (card: Card) => {
    if (battle.energy < card.cost || !casterAlive(card)) return;
    onPlayCard(card.uid, selectedId);
  };

  return (
    <section className="relative flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-ef-bg text-ef-ink">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
      {/* 상단 HUD 바: 턴 · 유물 · 버프 */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-ef-line bg-black/40 px-5 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-4 w-1" style={{ background: PRIMARY }} />
          <span className="font-mono text-sm font-black uppercase tracking-[0.2em] text-white">교전</span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted">// {battle.turn}턴</span>
          {relics.length > 0 && (
            <span className="ml-2 flex items-center gap-1">
              {relics.map((id) => {
                const relic = getRelic(id);
                if (!relic) return null;
                const Icon = ICON_MAP[relic.icon] ?? Gem;
                return (
                  <span key={id} className="flex h-7 w-7 items-center justify-center border bg-ef-card" style={{ ...CUT_SM, borderColor: `${ACCENT}55`, color: ACCENT }} title={`${relic.name} — ${relic.description}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                );
              })}
            </span>
          )}
          {(battle.dmgBuffPct || battle.critBuff || battle.partyRegen) && (
            <span className="ml-1 flex items-center gap-1">
              {battle.dmgBuffPct ? <span className="border px-1.5 py-0.5 font-mono text-[9px] font-black" style={{ ...CUT_SM, borderColor: "#fb923c66", color: "#fb923c" }}>피해 +{Math.round(battle.dmgBuffPct * 100)}%</span> : null}
              {battle.critBuff ? <span className="border px-1.5 py-0.5 font-mono text-[9px] font-black" style={{ ...CUT_SM, borderColor: "#f8717166", color: "#fca5a5" }}>치명 +{Math.round(battle.critBuff * 100)}%</span> : null}
              {battle.partyRegen ? <span className="border px-1.5 py-0.5 font-mono text-[9px] font-black" style={{ ...CUT_SM, borderColor: "#67e8f966", color: "#67e8f9" }}>재생 {battle.partyRegen.turns}T</span> : null}
            </span>
          )}
        </div>
        {/* 전투 로그 한 줄 */}
        <p className="min-w-0 max-w-[46%] flex-1 truncate text-right font-mono text-[11px] text-ef-muted">{battle.log[0] ?? "전투 시작."}</p>
      </div>

      {/* 전장: 적(상단) ↔ 파티(하단) 대치 */}
      <div className="relative z-10 flex flex-1 flex-col justify-between gap-4 overflow-y-auto px-6 py-5">
        <div className="flex flex-wrap items-start justify-center gap-3">
          {battle.enemies.map((enemy) => (
            <EnemyCard key={enemy.id} enemy={enemy} selected={enemy.id === selectedId} onSelect={() => setSel(enemy.id)} />
          ))}
        </div>
        <div className="flex flex-wrap items-stretch justify-center gap-2">
          {party.map((member) => <PartyCard key={member.id} member={member} />)}
          {onUsePotion && potions.length > 0 && (
            <div className="flex items-center gap-2 border border-ef-line bg-ef-card px-3" style={CUT_SM}>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-ef-muted">포션</span>
              {potions.map((id, i) => {
                const potion = getPotion(id);
                if (!potion) return null;
                return (
                  <button
                    key={`${id}-${i}`}
                    type="button"
                    onClick={() => onUsePotion(id, potionNeedsTarget(id) ? selectedId : undefined)}
                    className="relative h-10 w-10 overflow-hidden border bg-black/40 transition hover:-translate-y-0.5"
                    style={{ ...CUT_SM, borderColor: `${potion.color}66` }}
                    title={`${potion.name} — ${potion.description}${potionNeedsTarget(id) ? " (선택 적 대상)" : ""}`}
                  >
                    {potion.image ? (
                      <Image src={potion.image} alt={potion.name} fill sizes="40px" className="object-contain p-0.5" />
                    ) : (
                      <FlaskConical className="m-auto h-4 w-4" style={{ color: potion.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 하단 액션 바: 에너지 오브 · 부채꼴 손패 · 덱/버린덱 · 턴 종료 (CZN식) */}
      <div className="relative z-20 flex items-end justify-between gap-3 border-t border-ef-line bg-black/55 px-5 pb-3 pt-4 backdrop-blur-sm">
        {/* 에너지 오브 */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2" style={{ borderColor: ACCENT, background: `${ACCENT}1a` }} title="에너지(행동 포인트)">
            <Zap className="h-3.5 w-3.5" style={{ color: ACCENT }} />
            <span className="font-mono text-sm font-black leading-none tabular-nums" style={{ color: ACCENT }}>{battle.energy}<span className="text-[10px] text-ef-muted">/{battle.maxEnergy}</span></span>
          </span>
        </div>

        {/* 부채꼴 손패 */}
        <div className="flex min-w-0 flex-1 flex-col items-center">
          <span className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ef-muted">손패 · 카드 사용 시 적이 빨리 행동 (◇=불균형치)</span>
          {battle.hand.length === 0 ? (
            <p className="py-5 text-center text-sm text-ef-muted">손패가 없습니다. 턴을 종료하세요.</p>
          ) : (
            <div className="flex items-end justify-center">
              {battle.hand.map((card, i) => (
                <div key={card.uid} className="transition-transform hover:z-30" style={{ marginLeft: i === 0 ? 0 : -28, zIndex: i }}>
                  <HandCard card={card} playable={battle.energy >= card.cost && casterAlive(card)} downed={!casterAlive(card)} onPlay={() => play(card)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 덱/버린덱 + 턴 종료 */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="flex items-center gap-1 border border-ef-line bg-ef-card px-2.5 py-1 font-mono text-[11px] font-bold tabular-nums text-ef-muted" style={CUT_SM} title="덱 / 버린 더미">
            <Layers className="h-3.5 w-3.5" /> {battle.drawPile.length}
            <Trash2 className="ml-1.5 h-3.5 w-3.5" /> {battle.discardPile.length}
          </span>
          <button
            type="button"
            onClick={onEndTurn}
            className="flex items-center gap-2 border px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wide text-black transition hover:brightness-110"
            style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}
          >
            <SkipForward className="h-4 w-4" /> 턴 종료
          </button>
        </div>
      </div>
    </section>
  );
}
