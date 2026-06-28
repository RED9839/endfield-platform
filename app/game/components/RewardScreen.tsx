import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Coins, FlaskConical, Gem, HeartPulse, PackageOpen, Search, Sparkles, Trash2 } from "lucide-react";

import { buildDeck, cardRarity, cardRemovalCost, MIN_DECK_SIZE, previewCardFromToken } from "../data/cards";
import type { CardRarity } from "../data/cards";
import { getRelic } from "../data/relics";
import { getPotion } from "../data/potions";
import {
  getGameGear,
  getGearBuyValue,
  getGearPrimaryStatLine,
  getGearSellValue,
  getGameSetEffectDescription,
} from "../data/game-gears";
import type { DeckCard, Element, PartyMember, RunGear, SkillKind } from "../types/game";

const ELEMENT_COLOR: Record<Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const KIND_LABEL: Record<SkillKind, string> = { attack: "기본", "battle-skill": "배틀", "link-skill": "연계", ultimate: "궁극" };
const RARITY_TONE: Record<CardRarity, { label: string; color: string }> = {
  normal: { label: "NORMAL", color: "#9ca3af" },
  rare: { label: "RARE", color: "#4fa3ff" },
  epic: { label: "EPIC", color: "#c084fc" },
};

// ===== 카탈로그(장비/오퍼레이터/무기)와 통일한 Endfield SF 디자인 토큰 =====
const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

function categoryLabel(category: string) {
  if (category === "armor") return "방어구";
  if (category === "gloves") return "장갑";
  return "부품";
}

function effectLine(gear: RunGear) {
  const setEffect = getGameSetEffectDescription(gear.setName);
  if (setEffect !== "세트 효과 없음") return setEffect.replace("2세트:", "2세트 효과 ·");
  return `기본 옵션 · ${gear.attributeLabel}`;
}

// 품질(레어도) 색 — 장비 카탈로그와 동일 팔레트. 게임플레이 의미 색이므로 보존한다.
function rarityTone(quality: number) {
  if (quality >= 5) {
    return {
      label: "LEGEND",
      color: "#f0c94a",
      plate: "bg-[linear-gradient(135deg,#5e3a1e_0%,#b57a2e_48%,#f2c66b_100%)]",
    };
  }
  if (quality === 4) {
    return {
      label: "EPIC",
      color: "#9a63ff",
      plate: "bg-[linear-gradient(135deg,#342451_0%,#6847a8_52%,#b894ff_100%)]",
    };
  }
  if (quality === 3) {
    return {
      label: "RARE",
      color: "#4fa3ff",
      plate: "bg-[linear-gradient(135deg,#1e4053_0%,#2d7fa0_52%,#8be4ff_100%)]",
    };
  }
  if (quality === 2) {
    return {
      label: "UNCOMMON",
      color: "#84cc16",
      plate: "bg-[linear-gradient(135deg,#244435_0%,#3a7f5a_52%,#8de0ad_100%)]",
    };
  }
  return {
    label: "COMMON",
    color: "#9ca3af",
    plate: "bg-[linear-gradient(135deg,#34363a_0%,#5f6268_52%,#a7abb3_100%)]",
  };
}

export default function RewardScreen({
  gearSlugs,
  party,
  credits,
  onEquip,
  onSkip,
  mode = "reward",
  deck = [],
  cardsRemoved = 0,
  onRemoveCard,
  cardOffers = [],
  onTakeCard,
  onSkipCard,
  factionName,
  pendingRelic,
  shopRelics = [],
  shopPotions = [],
  ownedRelics = [],
  potionCount = 0,
  onBuyRelic,
  onBuyPotion,
  repairUsed = false,
  onRepairRest,
  onRepairUpgrade,
}: {
  gearSlugs: string[];
  party: PartyMember[];
  credits: number;
  onEquip: (gearSlug: string, operatorId: string) => void;
  onSkip: () => void;
  mode?: "reward" | "shop";
  deck?: DeckCard[];
  cardsRemoved?: number;
  onRemoveCard?: (uid: string) => void;
  cardOffers?: string[];
  onTakeCard?: (token: string) => void;
  onSkipCard?: () => void;
  factionName?: string;
  pendingRelic?: string;
  shopRelics?: string[];
  shopPotions?: string[];
  ownedRelics?: string[];
  potionCount?: number;
  onBuyRelic?: (relicId: string) => void;
  onBuyPotion?: (potionId: string) => void;
  repairUsed?: boolean;
  onRepairRest?: () => void;
  onRepairUpgrade?: (uid: string) => void;
}) {
  const [repairPicking, setRepairPicking] = useState(false);
  const [selectedGearSlug, setSelectedGearSlug] = useState<string | null>(null);
  const selectedGear = selectedGearSlug ? getGameGear(selectedGearSlug) : null;
  const isShop = mode === "shop";
  // 선명한 기억(정예 보상): 파티 스킬 전체를 확정 선택(랜덤·리롤 없음). 일반은 흐릿한 기억(랜덤 3장).
  const vivid = cardOffers.length > 4;

  function equipGear(gear: RunGear, member: PartyMember, currentGear?: RunGear) {
    if (isShop) {
      const price = getGearBuyValue(gear);
      if (credits < price) return;
      const refund = currentGear ? `\n기존 ${currentGear.name}은(는) ${getGearSellValue(currentGear)} 크레딧에 자동 판매됩니다.` : "";
      const confirmed = window.confirm(`${gear.name}을(를) ${price} 크레딧에 구매해 ${member.name}에게 장착할까요?${refund}`);
      if (!confirmed) return;
      onEquip(gear.slug, member.id);
      setSelectedGearSlug(null);
      return;
    }
    if (currentGear) {
      const confirmed = window.confirm(
        `${member.name}의 ${currentGear.name}을(를) 교체할까요?\n기존 장비는 ${getGearSellValue(currentGear)} 크레딧에 자동 판매됩니다.`,
      );
      if (!confirmed) return;
    }

    onEquip(gear.slug, member.id);
  }

  return (
    <section className="relative mx-auto flex min-h-[620px] w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative z-10 overflow-hidden border border-ef-line bg-ef-card2 p-5 sm:p-7" style={CUT}>
        <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
        <div className="flex flex-col gap-4 border-b border-ef-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center border border-ef-line bg-ef-card" style={{ ...CUT_SM, color: ACCENT }}>
                <PackageOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ef-muted">
                  {isShop ? "Supply Depot" : "Operation Complete"} <span className="text-ef-muted/60">// {isShop ? "델랑 보급소" : "작전 완료"}</span>
                </p>
                <h1 className="mt-1 text-3xl font-black text-white">{isShop ? "전술 보급" : "전술 장비 회수"}</h1>
              </div>
            </div>
            <p className="mt-4 text-sm text-ef-muted">
              {isShop ? (
                <>보유 <span className="font-mono font-black tabular-nums text-ef-accent">{credits}</span> 크레딧. 장비를 구매하거나 정비로 파티를 회복하세요.</>
              ) : (
                <><span className="font-mono font-black tabular-nums text-ef-accent">{credits}</span> 크레딧 확보. 회수한 장비 하나를 선택해 오퍼레이터에게 장착하세요.</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* 정비소 1회 무료: 휴식 or 강화 */}
            {isShop && (onRepairRest || onRepairUpgrade) && (
              repairUsed ? (
                <span className="flex items-center gap-2 border px-4 py-3 text-sm font-bold" style={{ ...CUT_SM, borderColor: `${ACCENT}55`, color: ACCENT, background: `${ACCENT}0d` }} title="이번 정비소에서 정비 완료">
                  <Sparkles className="h-4 w-4" /> 정비 완료
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-ef-muted">정비 1회</span>
                  <button type="button" onClick={onRepairRest} className="flex items-center gap-1.5 border px-3 py-3 text-sm font-bold transition hover:brightness-110" style={{ ...CUT_SM, borderColor: "#34d39955", color: "#7fd4a3", background: "#34d3990d" }} title="파티 전원 +28 회복">
                    <HeartPulse className="h-4 w-4" /> 휴식
                  </button>
                  <button type="button" onClick={() => setRepairPicking((v) => !v)} className="flex items-center gap-1.5 border px-3 py-3 text-sm font-bold transition hover:brightness-110" style={{ ...CUT_SM, borderColor: `${ACCENT}55`, color: ACCENT, background: `${ACCENT}0d`, ...(repairPicking ? { background: `${ACCENT}22` } : {}) }} title="카드 1장 정예화">
                    <Sparkles className="h-4 w-4" /> 강화
                  </button>
                </span>
              )
            )}
            <button type="button" onClick={onSkip} className="flex items-center gap-2 border border-ef-line bg-ef-card px-4 py-3 text-sm font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT_SM}>
              {isShop ? "상점 나가기" : "맵으로 이동"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="border border-ef-line bg-ef-card px-4 py-3 text-right" style={CUT_SM}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ef-muted">{isShop ? "CREDITS" : "RECOVERED"}</p>
              <p className="mt-1 font-mono text-2xl font-black tabular-nums" style={{ color: ACCENT }}>{isShop ? credits : gearSlugs.length}</p>
            </div>
          </div>
        </div>

        {/* 정비소 강화: 정예화할 카드 선택(1회) */}
        {isShop && repairPicking && !repairUsed && onRepairUpgrade && (
          <div className="mt-5 border bg-ef-card2 p-4" style={{ ...CUT, borderColor: `${ACCENT}55` }}>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
              <Sparkles className="h-3.5 w-3.5" /> 정예화할 카드 선택 · 1회 (오퍼 컨셉 강화)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {buildDeck(party, deck).map((card) => {
                const col = ELEMENT_COLOR[card.element];
                const lv = card.eliteLevel ?? 0;
                const locked = Boolean(card.copyLocked);
                const maxed = lv >= 2 || locked;
                const tag = locked ? "복제 🔒" : lv >= 2 ? "정예 II" : lv === 1 ? "정예 I" : null;
                return (
                  <button
                    key={card.uid}
                    type="button"
                    disabled={maxed}
                    onClick={() => onRepairUpgrade(card.uid)}
                    title={locked ? "복제본 — 정예화 불가" : maxed ? "최대 정예화" : `정예화 ${lv}차 → ${lv + 1}차`}
                    className="flex flex-col border bg-ef-card p-2.5 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ ...CUT_SM, borderColor: maxed ? `${ACCENT}aa` : `${col}66` }}
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex h-5 w-5 items-center justify-center border font-mono text-[10px] font-black text-black" style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}>{card.cost}</span>
                      {tag ? <span className="font-mono text-[8px] font-black uppercase" style={{ color: ACCENT }}>{tag}</span> : <span className="font-mono text-[8px] uppercase" style={{ color: col }}>{KIND_LABEL[card.kind]}</span>}
                    </span>
                    <span className="mt-1.5 truncate text-xs font-black text-white">{card.name}</span>
                    <span className="truncate font-mono text-[8px] text-ef-muted">{card.operatorName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 유물 드랍 배너(엘리트) */}
        {!isShop && pendingRelic && getRelic(pendingRelic) && (
          <div className="mt-5 flex items-center gap-3 border bg-ef-card p-4" style={{ ...CUT, borderColor: `${ACCENT}55` }}>
            {getRelic(pendingRelic)!.image
              ? <span className="relative h-10 w-10 shrink-0 overflow-hidden border" style={{ ...CUT_SM, borderColor: `${ACCENT}55` }}><Image src={getRelic(pendingRelic)!.image!} alt="" fill sizes="40px" className="object-cover" /></span>
              : <Gem className="h-6 w-6 shrink-0" style={{ color: ACCENT }} />}
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ef-muted">유물 획득</p>
              <p className="text-base font-black" style={{ color: ACCENT }}>{getRelic(pendingRelic)!.name}</p>
              <p className="text-xs text-ef-muted">{getRelic(pendingRelic)!.description}</p>
            </div>
          </div>
        )}

        {/* 전술 카드 보상(슬더스식 카드 픽) */}
        {!isShop && onTakeCard && cardOffers.length > 0 && (
          <div className="mt-5 border border-ef-line bg-ef-card p-5" style={CUT}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ef-line pb-3">
              <div className="flex items-center gap-2">
                <span className="h-4 w-1" style={{ background: PRIMARY }} />
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: vivid ? ACCENT : undefined }}>{vivid ? `선명한 기억 // 스킬 확정 선택${factionName ? ` · ${factionName}` : ""}` : `흐릿한 기억 // 카드 습득${factionName ? ` · ${factionName}` : ""}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={onSkipCard} className="border border-ef-line bg-ef-card2 px-3 py-1.5 font-mono text-[11px] font-bold text-ef-muted transition hover:text-ef-accent-soft" style={CUT_SM}>
                  받지 않기
                </button>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-ef-muted">세력 풀에서 한 장을 골라 덱에 영구 추가합니다. 등급이 높을수록 강력하고 드뭅니다.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {cardOffers.map((token) => {
                const card = previewCardFromToken(token, party);
                if (!card) return null;
                const col = ELEMENT_COLOR[card.element];
                const rarity = RARITY_TONE[cardRarity(token)];
                return (
                  <button
                    key={token}
                    type="button"
                    onClick={() => onTakeCard(token)}
                    className="relative flex flex-col border bg-ef-card2 p-3 pt-5 text-left transition hover:-translate-y-0.5"
                    style={{ ...CUT_SM, borderColor: `${rarity.color}88` }}
                  >
                    <span className="absolute left-0 top-0 px-1.5 py-0.5 font-mono text-[8px] font-black uppercase tracking-wide text-black" style={{ background: rarity.color }}>{rarity.label}</span>
                    <span className="flex items-center justify-between">
                      <span className="flex h-6 w-6 items-center justify-center border font-mono text-xs font-black text-black" style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}>{card.cost}</span>
                      <span className="font-mono text-[8px] uppercase" style={{ color: col }}>{card.target === "all-enemies" ? "전체" : card.target === "party" ? "파티" : "단일"}</span>
                    </span>
                    <span className="mt-2 truncate text-sm font-black text-white">{card.name}</span>
                    <span className="truncate font-mono text-[9px] text-ef-muted">{card.operatorName}</span>
                    <span className="mt-0.5 font-mono text-[10px] font-bold" style={{ color: ACCENT }}>{card.effectLine}</span>
                    <span className="mt-1 font-mono text-[9px] font-black tabular-nums" style={{ color: PRIMARY }}>{card.stagger > 0 ? `◇${card.stagger}` : ""}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 상점: 유물 / 포션 매물 */}
        {isShop && (onBuyRelic || onBuyPotion) && (shopRelics.length > 0 || shopPotions.length > 0) && (
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {onBuyRelic && (
              <div className="border border-ef-line bg-ef-card p-4" style={CUT}>
                <div className="mb-2 flex items-center gap-2"><Gem className="h-4 w-4" style={{ color: ACCENT }} /><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">유물</p></div>
                <div className="space-y-2">
                  {shopRelics.length === 0 && <p className="text-[11px] text-ef-muted">매진</p>}
                  {shopRelics.map((id) => {
                    const relic = getRelic(id);
                    if (!relic) return null;
                    const owned = ownedRelics.includes(id);
                    const afford = credits >= relic.price && !owned;
                    return (
                      <button key={id} type="button" disabled={!afford} onClick={() => onBuyRelic(id)} className="flex w-full items-center gap-3 border border-ef-line bg-ef-card2 p-3 text-left transition hover:border-ef-accent/40 disabled:cursor-not-allowed disabled:opacity-40" style={CUT_SM}>
                        {relic.image
                          ? <span className="relative h-8 w-8 shrink-0 overflow-hidden border" style={{ ...CUT_SM, borderColor: `${ACCENT}55` }}><Image src={relic.image} alt="" fill sizes="32px" className="object-cover" /></span>
                          : <Gem className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />}
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-black text-white">{relic.name}</span>
                          <span className="block text-[10px] leading-4 text-ef-muted">{relic.description}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-black tabular-nums" style={{ color: afford ? ACCENT : "#fca5a5" }}><Coins className="h-3 w-3" />{owned ? "보유" : relic.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {onBuyPotion && (
              <div className="border border-ef-line bg-ef-card p-4" style={CUT}>
                <div className="mb-2 flex items-center gap-2"><FlaskConical className="h-4 w-4" style={{ color: ACCENT }} /><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">포션 ({potionCount}/3)</p></div>
                <div className="space-y-2">
                  {shopPotions.length === 0 && <p className="text-[11px] text-ef-muted">매진</p>}
                  {shopPotions.map((id, i) => {
                    const potion = getPotion(id);
                    if (!potion) return null;
                    const afford = credits >= potion.price && potionCount < 3;
                    return (
                      <button key={`${id}-${i}`} type="button" disabled={!afford} onClick={() => onBuyPotion(id)} className="flex w-full items-center gap-3 border border-ef-line bg-ef-card2 p-3 text-left transition hover:border-ef-accent/40 disabled:cursor-not-allowed disabled:opacity-40" style={CUT_SM}>
                        <span className="relative h-9 w-9 shrink-0 overflow-hidden border" style={{ ...CUT_SM, borderColor: `${potion.color}55` }}>
                          {potion.image ? <Image src={potion.image} alt="" fill sizes="36px" className="object-contain p-0.5" /> : <FlaskConical className="m-auto h-4 w-4" style={{ color: potion.color }} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-black text-white">{potion.name}</span>
                          <span className="block text-[10px] leading-4 text-ef-muted">{potion.description}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-black tabular-nums" style={{ color: afford ? ACCENT : "#fca5a5" }}><Coins className="h-3 w-3" />{potionCount >= 3 ? "가득" : potion.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {isShop && gearSlugs.length === 0 && (
          <div className="mt-6 border border-ef-line bg-ef-card p-6 text-center text-sm text-ef-muted" style={CUT}>
            재고 소진 — 상점을 나가 다음 지점으로 이동하세요.
          </div>
        )}
        <div className="mt-5 space-y-3">
          {gearSlugs.map((slug) => {
            const gear = getGameGear(slug);
            const selected = selectedGearSlug === gear.slug;
            const rarity = rarityTone(gear.quality);
            const price = getGearBuyValue(gear);
            const affordable = credits >= price;
            return (
              <button
                key={gear.slug}
                type="button"
                onClick={() => setSelectedGearSlug(gear.slug)}
                className="group relative flex w-full overflow-hidden border text-left transition hover:-translate-y-0.5"
                style={{
                  ...CUT,
                  borderColor: selected ? ACCENT : "#202020",
                  background: selected ? `${ACCENT}14` : "#0b0b0b",
                }}
              >
                <span
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ background: selected ? ACCENT : rarity.color }}
                />
                <span className={`relative h-32 w-32 shrink-0 overflow-hidden ${rarity.plate} sm:h-36 sm:w-36`}>
                  <span className="absolute inset-5 rotate-45 border border-white/20" />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.24),transparent_34%),linear-gradient(135deg,transparent_52%,rgba(0,0,0,0.24)_53%)]" />
                  <Image
                    src={gear.image}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-contain p-5 drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
                  />
                  {/* 품질 코너 브래킷(레어도 색) */}
                  <span className="pointer-events-none absolute left-1.5 top-1.5 h-5 w-5 border-l-2 border-t-2" style={{ borderColor: rarity.color }} />
                  <span className="pointer-events-none absolute right-1.5 top-1.5 h-5 w-5 border-r-2 border-t-2" style={{ borderColor: rarity.color }} />
                  <span className="absolute bottom-0 left-0 right-0 h-7 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-black" style={{ background: `${rarity.color}d9` }}>
                    {rarity.label}
                  </span>
                </span>

                <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 sm:px-6">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wide" style={{ ...CUT_SM, borderColor: `${rarity.color}66`, background: `${rarity.color}1a`, color: rarity.color }}>
                      레어도 {gear.quality}
                    </span>
                    <span className="inline-flex border border-ef-line bg-ef-card px-2 py-1 font-mono text-[10px] font-black text-ef-muted" style={CUT_SM}>
                      {categoryLabel(gear.category)}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ef-muted">
                      LV.{gear.level}
                    </span>
                    {isShop && (
                      <span className="ml-auto inline-flex items-center gap-1 border px-2 py-1 font-mono text-[11px] font-black tabular-nums" style={{ ...CUT_SM, borderColor: affordable ? `${ACCENT}66` : "#f8717166", background: affordable ? `${ACCENT}14` : "#f871711a", color: affordable ? ACCENT : "#fca5a5" }}>
                        <Coins className="h-3 w-3" />{price}
                      </span>
                    )}
                  </span>
                  <span className="mt-2 line-clamp-1 text-xl font-black" style={{ color: rarity.color }}>
                    {gear.name}
                  </span>
                  <span className="mt-1 font-mono text-xs font-bold uppercase tracking-wide" style={{ color: `${PRIMARY}cc` }}>{gear.setName} 세트</span>
                  <span className="mt-4 grid gap-2 text-sm sm:grid-cols-[160px_1fr]">
                    <span className="font-black text-white">{getGearPrimaryStatLine(gear)}</span>
                    <span className="leading-6 text-ef-muted">{effectLine(gear)}</span>
                  </span>
                </span>

                <span className="hidden w-14 shrink-0 place-items-start justify-center border-l border-ef-line bg-black/20 pt-4 sm:grid">
                  <span className="grid h-9 w-9 place-items-center border border-ef-line bg-ef-card text-ef-muted transition group-hover:border-ef-accent/50 group-hover:text-ef-accent-soft" style={CUT_SM}>
                    <Search className="h-4 w-4" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {isShop && onRemoveCard && (() => {
          const cards = buildDeck(party, deck);
          const removeCost = cardRemovalCost(cardsRemoved);
          const deckAtMin = cards.length <= MIN_DECK_SIZE;
          const canAfford = credits >= removeCost;
          return (
            <div className="mt-6 border border-ef-line bg-ef-card p-5" style={CUT}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ef-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-1" style={{ background: PRIMARY }} />
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">Deck Refit // 카드 정리</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-ef-muted">덱 {cards.length}장</span>
                  <span className="inline-flex items-center gap-1 border px-2.5 py-1 font-mono font-black tabular-nums" style={{ ...CUT_SM, borderColor: canAfford && !deckAtMin ? `${ACCENT}66` : "#f8717166", background: canAfford && !deckAtMin ? `${ACCENT}14` : "#f871711a", color: canAfford && !deckAtMin ? ACCENT : "#fca5a5" }}>
                    <Trash2 className="h-3 w-3" />다음 삭제 {removeCost}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-ef-muted">
                {deckAtMin ? "최소 덱 크기에 도달해 더 삭제할 수 없습니다." : "카드를 골라 영구 삭제하면 덱이 얇아져 핵심 카드를 더 자주 뽑습니다. 삭제할수록 비용이 비싸집니다."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {cards.map((card) => {
                  const col = ELEMENT_COLOR[card.element];
                  const disabled = deckAtMin || !canAfford;
                  return (
                    <button
                      key={card.uid}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (window.confirm(`'${card.name}' 카드를 ${removeCost} 크레딧에 영구 삭제할까요?`)) onRemoveCard(card.uid);
                      }}
                      className="group relative flex items-center gap-2 border bg-ef-card2 p-2 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                      style={{ ...CUT_SM, borderColor: `${col}55` }}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-xs font-black text-black" style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}>{card.cost}</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1">
                          <span className="truncate text-xs font-black text-white">{card.name}</span>
                          <span className="ml-auto font-mono text-[8px] uppercase" style={{ color: col }}>{KIND_LABEL[card.kind]}</span>
                        </span>
                        <span className="truncate font-mono text-[9px] text-ef-muted">{card.operatorName}</span>
                      </span>
                      <Trash2 className="h-3.5 w-3.5 shrink-0 text-ef-muted transition group-hover:text-red-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {selectedGear && (
          <div className="mt-6 border border-ef-line bg-ef-card p-5" style={CUT}>
            <div className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
                Equip Target
              </p>
            </div>
            <h2 className="mt-2 text-xl font-black text-white">
              {selectedGear.name} {isShop ? `구매 · ${getGearBuyValue(selectedGear)} 크레딧` : "장착 대상 선택"}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {party.map((member) => {
                const currentGear =
                  selectedGear.category === "armor"
                    ? member.gear.armor
                    : selectedGear.category === "gloves"
                      ? member.gear.gloves
                      : member.gear.kit1;
                const unaffordable = isShop && credits < getGearBuyValue(selectedGear);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => equipGear(selectedGear, member, currentGear)}
                    disabled={unaffordable}
                    className="border border-ef-line bg-ef-card2 p-4 text-left transition hover:border-ef-accent/40 hover:bg-ef-accent/[0.06] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ef-line"
                    style={CUT_SM}
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-12 overflow-hidden border border-ef-line bg-black" style={CUT_SM}>
                        <Image src={member.image} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-white">{member.name}</p>
                        <p className="text-[10px] font-bold text-ef-muted">{member.className} · {member.role}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[10px] leading-4 text-ef-muted">
                      {unaffordable
                        ? "크레딧 부족"
                        : currentGear
                          ? `${currentGear.name} 교체 · 판매 +${getGearSellValue(currentGear)}`
                          : "빈 슬롯에 장착"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
