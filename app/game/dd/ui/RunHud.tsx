"use client";

import { Hammer, Sparkles } from "lucide-react";

import type { CraftState } from "../craft";
import { RESOURCE_ICON } from "../items";

const CUT = { clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" };

// 세력 리전 색/설명
const FACTION_META: Record<string, { tone: string; region: string; icon: string }> = {
  "야외 생물": { tone: "#86efac", region: "탈로스 II 야생", icon: "🐾" },
  "아겔로스": { tone: "#c4b5fd", region: "4번 협곡", icon: "🗿" },
  "수화자": { tone: "#67e8f9", region: "무릉", icon: "💧" },
  "랜드브레이커": { tone: "#fb923c", region: "본 크러셔 캠프", icon: "🔥" },
  "청파채": { tone: "#fbbf24", region: "창적 거점", icon: "⚔️" },
  "그림자에 물든": { tone: "#a78bfa", region: "초자연의 균열", icon: "🌀" },
};

export default function RunHud({ faction, depth, maxDepth, floor, totalFloors, floorName, craft, onCraft, canCraft, hasCraftable }: { faction: string; depth: number; maxDepth: number; floor?: number; totalFloors?: number; floorName?: string; craft: CraftState; onCraft?: (tab?: "party" | "mastery") => void; canCraft?: boolean; hasCraftable?: boolean }) {
  const fm = FACTION_META[faction] ?? { tone: "#a1a1aa", region: faction, icon: "◆" };
  const owned = Object.keys(craft.owned).length;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* 층(타워 진행) */}
      {floor != null && totalFloors != null && (
        <div className="hud-tile flex items-center gap-2 px-3 py-1.5" style={{ ...CUT, borderColor: fm.tone + "88", boxShadow: `0 0 16px -5px ${fm.tone}` }}>
          <span className="font-mono text-lg font-black leading-none" style={{ color: fm.tone }}>{floor + 1}<span className="text-[13px] font-normal text-ef-muted">/{totalFloors}층</span></span>
          {floorName && <span className="font-mono text-sm font-bold text-white">{floorName}</span>}
        </div>
      )}
      {/* 세력 리전 */}
      <div className="hud-tile flex items-center gap-2 px-3 py-1.5" style={{ ...CUT, borderColor: fm.tone + "66", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 14px -6px ${fm.tone}` }}>
        <span className="text-base leading-none">{fm.icon}</span>
        <span className="flex flex-col leading-tight">
          <span className="font-mono text-[13px] uppercase tracking-[0.24em] text-ef-muted">리전</span>
          <span className="font-mono text-sm font-bold" style={{ color: fm.tone }}>{faction} <span className="text-[14px] font-normal text-ef-muted">· {fm.region}</span></span>
        </span>
      </div>
      {/* 이 층의 구역 진행도 */}
      <div className="hud-tile flex items-center gap-1.5 px-3 py-1.5" style={CUT} title="이 층의 구역 진행 — 마지막은 층 보스">
        <span className="font-mono text-[13px] uppercase tracking-[0.24em] text-ef-muted">구역 <b className="text-ef-ink">{Math.min(depth + 1, maxDepth + 1)}</b>/{maxDepth + 1}</span>
        <div className="flex gap-0.5">{Array.from({ length: maxDepth + 1 }, (_, i) => <span key={i} className="h-2.5 w-2.5" style={{ background: i <= depth ? fm.tone : "#26262a", clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)", boxShadow: i <= depth ? `0 0 6px ${fm.tone}88` : "none" }} />)}</div>
      </div>
      {/* 재료 */}
      <div className="ml-auto flex items-center gap-2">
        <div className="hud-tile flex items-center gap-1.5 px-2.5 py-1.5" style={CUT} title="크레딧 — 몹 처치 보상. 야영지 상점에서 재료·소비템으로 교환합니다.">
          <img src={RESOURCE_ICON.credits} alt="" className="h-4 w-4 shrink-0 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /><span className="font-mono text-sm font-bold" style={{ color: "#f5c542" }}>{craft.credits}</span><span className="font-mono text-[14px] text-ef-muted">크레딧</span>
        </div>
        <div className="hud-tile flex items-center gap-1.5 px-2.5 py-1.5" style={CUT} title="프로토콜 프리즘 세트 — 마스터리 전용 재료">
          <img src={RESOURCE_ICON.chips} alt="" className="h-4 w-4 shrink-0 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /><span className="font-mono text-sm font-bold text-white">{craft.mats.chips ?? 0}</span><span className="font-mono text-[14px] text-ef-muted">프로토콜 프리즘 세트</span>
        </div>
        <div className="hud-tile flex items-center gap-1.5 px-2.5 py-1.5" style={CUT} title="장비 부품 — 제작·단조 재료">
          <img src={RESOURCE_ICON.parts} alt="" className="h-4 w-4 shrink-0 object-contain" /><span className="font-mono text-sm font-bold text-white">{craft.mats.parts}</span><span className="font-mono text-[14px] text-ef-muted">부품</span>
        </div>
        <div className="hud-tile flex items-center gap-1.5 px-2.5 py-1.5" style={CUT} title="관리권 — 제작·단조 재료">
          <img src={RESOURCE_ICON.permits} alt="" className="h-4 w-4 shrink-0 object-contain" /><span className="font-mono text-sm font-bold text-white">{craft.mats.permits}</span><span className="font-mono text-[14px] text-ef-muted">관리권</span>
        </div>
        {onCraft && (
          <button type="button" onClick={() => onCraft("party")} disabled={!canCraft} title={hasCraftable ? "제작 가능한 장비가 있습니다 — 공업소에서 강해질 수 있습니다" : "장비 확인·제작·단조"} className="hud-btn relative flex items-center gap-1.5 px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-wider">
            {hasCraftable && <span className="absolute -right-1 -top-1 flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ef-accent opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-ef-accent" /></span>}
            <Hammer className="h-4 w-4" />장비 {hasCraftable ? <span className="text-[13px]">가능!</span> : owned > 0 && <span className="text-[14px] opacity-70">·{owned}</span>}
          </button>
        )}
        {onCraft && (
          <button type="button" onClick={() => onCraft("mastery")} disabled={!canCraft} title="스킬 마스터리 — 오퍼 스킬을 프로토콜 프리즘 세트으로 강화" className="hud-btn relative flex items-center gap-1.5 px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />스킬 마스터리
          </button>
        )}
      </div>
    </div>
  );
}
