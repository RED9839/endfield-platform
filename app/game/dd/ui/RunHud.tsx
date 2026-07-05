"use client";

import { Hammer, Package, KeyRound } from "lucide-react";

import type { CraftState } from "../craft";

const CUT = { clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" };

// 세력 리전 색/설명
const FACTION_META: Record<string, { tone: string; region: string; icon: string }> = {
  "야외 생물": { tone: "#86efac", region: "탈로스 II 야생", icon: "🐾" },
  "아겔로스": { tone: "#c4b5fd", region: "4번 협곡", icon: "🗿" },
  "수화자": { tone: "#67e8f9", region: "무릉", icon: "💧" },
  "랜드브레이커": { tone: "#fb923c", region: "본 크러셔 캠프", icon: "🔥" },
  "청파채": { tone: "#fbbf24", region: "창적 거점", icon: "⚔️" },
};

export default function RunHud({ faction, depth, maxDepth, craft, onCraft, canCraft }: { faction: string; depth: number; maxDepth: number; craft: CraftState; onCraft?: () => void; canCraft?: boolean }) {
  const fm = FACTION_META[faction] ?? { tone: "#a1a1aa", region: faction, icon: "◆" };
  const owned = Object.keys(craft.owned).length;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* 세력 리전 */}
      <div className="flex items-center gap-2 border border-ef-line bg-ef-card px-3 py-1.5" style={{ ...CUT, borderColor: fm.tone + "55" }}>
        <span className="text-base leading-none">{fm.icon}</span>
        <span className="flex flex-col leading-tight">
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-ef-muted">리전</span>
          <span className="font-mono text-sm font-bold" style={{ color: fm.tone }}>{faction} <span className="text-[12px] font-normal text-ef-muted">· {fm.region}</span></span>
        </span>
      </div>
      {/* 심층 진행도 */}
      <div className="flex items-center gap-1.5 border border-ef-line bg-ef-card px-3 py-1.5" style={CUT}>
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-ef-muted">심층</span>
        <div className="flex gap-0.5">{Array.from({ length: maxDepth + 1 }, (_, i) => <span key={i} className="h-2 w-2" style={{ background: i <= depth ? fm.tone : "#2a2a2a", clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }} />)}</div>
      </div>
      {/* 재료 */}
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 border border-ef-line bg-ef-card px-2.5 py-1.5" style={CUT} title="장비 부품 — 제작·단조 재료">
          <Package className="h-3.5 w-3.5 text-ef-accent-soft" /><span className="font-mono text-sm font-bold text-white">{craft.mats.parts}</span><span className="font-mono text-[12px] text-ef-muted">부품</span>
        </div>
        <div className="flex items-center gap-1.5 border border-ef-line bg-ef-card px-2.5 py-1.5" style={CUT} title="관리권 — 제작·단조 재료">
          <KeyRound className="h-3.5 w-3.5 text-yellow-300" /><span className="font-mono text-sm font-bold text-white">{craft.mats.permits}</span><span className="font-mono text-[12px] text-ef-muted">관리권</span>
        </div>
        {onCraft && (
          <button type="button" onClick={onCraft} disabled={!canCraft} className="flex items-center gap-1.5 border border-ef-accent/50 px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-wider text-ef-accent transition enabled:hover:bg-ef-accent/10 disabled:opacity-40" style={CUT}>
            <Hammer className="h-4 w-4" />제작 {owned > 0 && <span className="text-[12px] text-ef-muted">·{owned}</span>}
          </button>
        )}
      </div>
    </div>
  );
}
