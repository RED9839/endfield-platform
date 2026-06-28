import { Copy, Lock } from "lucide-react";

import { buildDeck } from "../data/cards";
import type { DeckCard, Element, PartyMember, SkillKind } from "../types/game";

const ACCENT = "#ffd24a";
const CUT = { clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" };
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const ELEMENT_COLOR: Record<Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const KIND_LABEL: Record<SkillKind, string> = { attack: "기본", "battle-skill": "배틀", "link-skill": "연계", ultimate: "궁극" };

export default function DuplicateScreen({
  party = [],
  deck = [],
  candidates = [],
  onDuplicate,
  onSkip,
}: {
  party?: PartyMember[];
  deck?: DeckCard[];
  candidates?: string[];
  onDuplicate: (uid: string) => void;
  onSkip: () => void;
}) {
  const cards = buildDeck(party, deck).filter((c) => candidates.includes(c.uid));
  return (
    <section className="mx-auto flex min-h-[620px] w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="text-center">
        <Copy className="mx-auto h-10 w-10" style={{ color: ACCENT }} />
        <p className="mt-3 font-mono text-[12px] font-bold uppercase tracking-[0.32em] text-ef-muted">Field Boss // 복제 보상</p>
        <h1 className="mt-2 text-2xl font-black text-white">복제할 카드 선택 <span className="text-sm font-bold text-ef-muted">· 3장 중 1장</span></h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ef-muted"><Lock className="h-3.5 w-3.5" /> 복제본은 현재 상태로 고정되며 정예화할 수 없습니다.</p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((card) => {
          const col = ELEMENT_COLOR[card.element];
          const lv = card.eliteLevel ?? 0;
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => onDuplicate(card.uid)}
              className="flex flex-col border bg-ef-card2 p-4 text-left transition hover:-translate-y-1"
              style={{ ...CUT, borderColor: `${col}66` }}
            >
              <span className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center border font-mono text-sm font-black text-black" style={{ ...CUT_SM, background: ACCENT, borderColor: ACCENT }}>{card.cost}</span>
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase" style={{ color: col }}>
                  {lv >= 2 ? "정예 II" : lv === 1 ? "정예 I" : KIND_LABEL[card.kind]}
                </span>
              </span>
              <span className="mt-2 truncate text-base font-black text-white">{card.name}</span>
              <span className="truncate font-mono text-[11px] text-ef-muted">{card.operatorName}</span>
              <span className="mt-2 line-clamp-2 font-mono text-[12px] font-bold leading-tight" style={{ color: card.effect ? "#7fd4a3" : ACCENT }}>{card.effectLine}</span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={onSkip} className="mx-auto mt-6 border border-ef-line bg-ef-card px-5 py-2.5 font-mono text-[13px] font-bold text-ef-muted transition hover:text-ef-accent-soft" style={CUT_SM}>
        복제하지 않기
      </button>
    </section>
  );
}
