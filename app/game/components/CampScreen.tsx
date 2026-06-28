import { useState } from "react";
import { ArrowLeft, Flame, HeartPulse, Sparkles } from "lucide-react";

import { buildDeck } from "../data/cards";
import type { DeckCard, Element, PartyMember, SkillKind } from "../types/game";

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
const ELEMENT_COLOR: Record<Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const KIND_LABEL: Record<SkillKind, string> = { attack: "기본", "battle-skill": "배틀", "link-skill": "연계", ultimate: "궁극" };

export default function CampScreen({
  onRest,
  party = [],
  deck = [],
  onUpgrade,
  mode = "camp",
  promotesLeft = 0,
  onSkip,
}: {
  onRest: (mode: "heal" | "train") => void;
  party?: PartyMember[];
  deck?: DeckCard[];
  onUpgrade?: (uid: string) => void;
  mode?: "camp" | "promote";
  promotesLeft?: number;
  onSkip?: () => void;
}) {
  const [picking, setPicking] = useState(false);
  const promoting = mode === "promote";

  if ((picking || promoting) && onUpgrade) {
    const cards = buildDeck(party, deck);
    return (
      <section className="mx-auto flex min-h-[620px] w-full max-w-4xl flex-col justify-center px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => (promoting ? onSkip?.() : setPicking(false))} className="flex h-9 w-9 items-center justify-center border border-ef-line bg-ef-card text-ef-muted transition hover:text-ef-accent-soft" style={CUT_SM} aria-label={promoting ? "건너뛰기" : "뒤로"}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">{promoting ? "Elite Reward // 정예 보상" : "Forge // 카드 정예화"}</p>
            <h1 className="text-2xl font-black text-white">정예화할 카드 선택 {promoting ? <span className="text-sm font-bold" style={{ color: ACCENT }}>· 남은 {promotesLeft}회</span> : <span className="text-sm font-bold text-ef-muted">· 오퍼 컨셉 강화 (강타·빌더·아츠·치명…)</span>}</h1>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => {
            const col = ELEMENT_COLOR[card.element];
            const lv = card.eliteLevel ?? 0;
            const locked = Boolean(card.copyLocked);
            const maxed = lv >= 2 || locked;
            const eliteTag = locked ? "복제 🔒" : lv >= 2 ? "정예 II" : lv === 1 ? "정예 I" : null;
            return (
              <button
                key={card.uid}
                type="button"
                disabled={maxed}
                onClick={() => onUpgrade(card.uid)}
                title={locked ? "복제본 — 정예화 불가" : maxed ? "최대 정예화" : `정예화 ${lv}차 → ${lv + 1}차`}
                className="flex flex-col border bg-ef-card2 p-3 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ ...CUT_SM, borderColor: maxed ? `${ACCENT}aa` : `${col}66` }}
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-6 w-6 items-center justify-center border font-mono text-xs font-black text-black" style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}>{card.cost}</span>
                  {eliteTag ? <span className="border px-1 py-px font-mono text-[8px] font-black uppercase" style={{ ...CUT_SM, color: ACCENT, borderColor: `${ACCENT}88` }}>{eliteTag}</span> : <span className="font-mono text-[8px] uppercase" style={{ color: col }}>{KIND_LABEL[card.kind]}</span>}
                </span>
                <span className="mt-2 truncate text-sm font-black text-white">{card.name}</span>
                <span className="truncate font-mono text-[9px] text-ef-muted">{card.operatorName}</span>
                <span className="mt-1 font-mono text-[10px] font-bold" style={{ color: ACCENT }}>{maxed ? "최대 정예화 (II)" : `→ 정예화 ${lv + 1}차`}</span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-4xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="text-center">
        <Flame className="mx-auto h-11 w-11" style={{ color: PRIMARY }} />
        <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-ef-muted">
          MOBILE CAMP
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">짧은 정비</h1>
        <p className="mt-2 text-sm text-ef-muted">출발하기 전 한 가지 행동을 선택하세요.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onRest("heal")}
          className="border border-ef-line bg-ef-card2 p-7 text-left transition hover:border-emerald-300/60"
          style={CUT}
        >
          <HeartPulse className="h-8 w-8 text-emerald-300" />
          <h2 className="mt-5 text-2xl font-black text-white">휴식</h2>
          <p className="mt-2 text-sm leading-6 text-ef-muted">
            모든 오퍼레이터의 체력을 <span className="font-mono font-bold text-emerald-300 tabular-nums">28</span> 회복합니다.
          </p>
        </button>
        <button
          type="button"
          disabled={!onUpgrade}
          onClick={() => setPicking(true)}
          className="border border-ef-line bg-ef-card2 p-7 text-left transition hover:border-ef-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
          style={CUT}
        >
          <Sparkles className="h-8 w-8" style={{ color: ACCENT }} />
          <h2 className="mt-5 text-2xl font-black text-white">정예화</h2>
          <p className="mt-2 text-sm leading-6 text-ef-muted">
            카드 한 장을 <span className="font-mono font-bold text-ef-accent tabular-nums">정예화</span>해 위력(<span className="tabular-nums">+30%/+60%</span>)과 불균형치를 영구 강화합니다. (1차→2차)
          </p>
        </button>
      </div>
    </section>
  );
}
