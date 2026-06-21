import {
  Castle,
  Check,
  Flame,
  HelpCircle,
  Lock,
  Map,
  Route,
  ShieldAlert,
  ShoppingBag,
  Skull,
  Sparkles,
  Swords,
} from "lucide-react";

import { chapters, mapNodes } from "../data/maps";
import type { MapNode } from "../types/game";

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

// 노드 유형 색은 게임플레이 의미 색이므로 보존한다(샤프 보더 + 코너 브래킷으로 적용).
const nodeVisual: Record<
  MapNode["type"],
  { icon: typeof Swords; label: string; color: string }
> = {
  battle: { icon: Swords, label: "COMBAT", color: "#ffd24a" },
  elite: { icon: ShieldAlert, label: "ELITE", color: "#f87171" },
  event: { icon: HelpCircle, label: "EVENT", color: "#a78bfa" },
  shop: { icon: ShoppingBag, label: "SUPPLY", color: "#34d399" },
  camp: { icon: Flame, label: "CAMP", color: "#fb923c" },
  boss: { icon: Castle, label: "BOSS", color: "#ff5d5d" },
};

// 보상 등급 표시(경로 계획용). 전투/엘리트/보스=장비 등급, 상점=구매.
const REWARD_GRADE: Record<string, { label: string; color: string }> = {
  early: { label: "하급", color: "#9ca3af" },
  mid: { label: "중급", color: "#4fa3ff" },
  late: { label: "상급", color: "#9a63ff" },
  elite: { label: "정예", color: "#f0c94a" },
  boss: { label: "최상", color: "#ff5d5d" },
};
function rewardChip(node: MapNode) {
  if ((node.type === "battle" || node.type === "elite" || node.type === "boss") && node.rewardTier) return REWARD_GRADE[node.rewardTier];
  if (node.type === "shop") return { label: "상점", color: "#34d399" };
  if (node.type === "camp") return { label: "정비", color: "#fb923c" };
  if (node.type === "event") return { label: "조우", color: "#a78bfa" };
  return null;
}

const laneLabels = ["LOW", "LEFT", "MID", "RIGHT", "HIGH"];
const boardWidth = Math.max(...mapNodes.map((node) => node.floor)) * 176 + 260;
const boardHeight = 620;
const nodeWidth = 154;
const nodeHeight = 116;
const xGap = 176;
const yGap = 110;
const xStart = 84;
const yStart = 64;

function getPosition(node: MapNode) {
  return {
    left: xStart + (node.floor - 1) * xGap,
    top: yStart + node.column * yGap,
  };
}

function nodeTitle(node: MapNode) {
  if (node.title) return node.title;
  if (node.type === "boss") return "Final Operation";
  if (node.type === "elite") return `Elite Route ${node.floor}`;
  if (node.type === "event") return `Field Event ${node.floor}`;
  if (node.type === "shop") return `Supply Point ${node.floor}`;
  if (node.type === "camp") return `Forward Camp ${node.floor}`;
  return `Combat Zone ${node.floor}`;
}

function nodeSubtitle(node: MapNode) {
  if (node.subtitle) return node.subtitle;
  if (node.type === "boss") return "boss sector";
  if (node.type === "elite") return "high-threat encounter";
  if (node.type === "event") return "random field event";
  if (node.type === "shop") return "gear resupply";
  if (node.type === "camp") return "recover or train";
  return node.rewardTier ? `${node.rewardTier} reward` : "standard route";
}

function RouteLine({
  from,
  to,
  active,
  cleared,
}: {
  from: MapNode;
  to: MapNode;
  active: boolean;
  cleared: boolean;
}) {
  const fromPosition = getPosition(from);
  const toPosition = getPosition(to);
  const x1 = fromPosition.left + nodeWidth;
  const y1 = fromPosition.top + nodeHeight / 2;
  const x2 = toPosition.left;
  const y2 = toPosition.top + nodeHeight / 2;
  const width = Math.max(24, x2 - x1);
  const top = Math.min(y1, y2);
  const height = Math.abs(y2 - y1) || 1;
  const midX = width / 2;

  return (
    <svg
      className="pointer-events-none absolute overflow-visible"
      style={{
        left: x1,
        top,
        width,
        height: Math.max(1, height),
      }}
      aria-hidden="true"
    >
      <path
        d={`M 0 ${y1 - top} C ${midX} ${y1 - top}, ${midX} ${y2 - top}, ${width} ${y2 - top}`}
        fill="none"
        stroke={active ? "rgba(255,210,74,0.95)" : cleared ? "rgba(255,210,74,0.3)" : "rgba(255,255,255,0.07)"}
        strokeLinecap="round"
        strokeWidth={active ? 3 : 2}
      />
    </svg>
  );
}

function RouteNode({
  node,
  available,
  visited,
  onEnter,
}: {
  node: MapNode;
  available: boolean;
  visited: boolean;
  onEnter: (nodeId: string) => void;
}) {
  const visual = nodeVisual[node.type];
  const Icon = visual.icon;
  const position = getPosition(node);
  const locked = !available && !visited;
  const typeColor = visual.color;

  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => onEnter(node.id)}
      className={`group absolute border p-4 text-left transition duration-200 ${
        available
          ? "bg-ef-card2 text-ef-ink hover:-translate-y-1 hover:brightness-110"
          : visited
            ? "border-ef-line bg-ef-card text-ef-muted/70"
            : "border-ef-line bg-ef-card text-ef-muted/30"
      }`}
      style={{
        ...CUT_SM,
        left: position.left,
        top: position.top,
        width: nodeWidth,
        height: nodeHeight,
        ...(available
          ? { borderColor: typeColor, background: `${typeColor}1a` }
          : {}),
      }}
    >
      <span className="flex items-start justify-between gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center border border-ef-line bg-black/60"
          style={{
            ...CUT_SM,
            ...(available ? { borderColor: `${typeColor}80`, color: typeColor } : {}),
          }}
        >
          {visited ? <Check className="h-5 w-5" /> : locked ? <Lock className="h-4 w-4" /> : <Icon className="h-5 w-5" />}
        </span>
        <span className="flex flex-col items-end gap-1">
          <span
            className="border border-ef-line bg-black/40 px-2 py-1 font-mono text-[10px] font-bold tabular-nums"
            style={CUT_SM}
          >
            F{node.floor}
          </span>
          {(() => {
            const reward = rewardChip(node);
            return reward ? (
              <span
                className="border px-1.5 py-0.5 font-mono text-[9px] font-black tracking-wide"
                style={{ ...CUT_SM, borderColor: available ? `${reward.color}66` : "#202020", color: available ? reward.color : undefined, background: available ? `${reward.color}1a` : "transparent" }}
              >
                {reward.label}
              </span>
            ) : null;
          })()}
        </span>
      </span>
      <span
        className="mt-3 block font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
        style={available ? { color: typeColor } : undefined}
      >
        {visual.label}
      </span>
      <span className={`mt-1 block truncate text-base font-black ${available ? "text-white" : ""}`}>
        {nodeTitle(node)}
      </span>
      <span className="mt-1 block truncate text-[10px] font-bold opacity-60">
        {nodeSubtitle(node)}
      </span>
      {available && (
        <>
          <span
            className="absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2"
            style={{ background: typeColor, boxShadow: `0 0 16px ${typeColor}` }}
          />
          {/* 선택 가능 노드 강조 — 유형 색 코너 브래킷 */}
          <span className="pointer-events-none absolute left-1 top-1 h-3.5 w-3.5 border-l-2 border-t-2" style={{ borderColor: typeColor }} />
          <span className="pointer-events-none absolute bottom-1 right-1 h-3.5 w-3.5 border-b-2 border-r-2" style={{ borderColor: typeColor }} />
        </>
      )}
    </button>
  );
}

export default function MapScreen({
  availableNodes,
  visitedNodes,
  onEnter,
}: {
  availableNodes: string[];
  visitedNodes: string[];
  onEnter: (nodeId: string) => void;
}) {
  const availableSet = new Set(availableNodes);
  const visitedSet = new Set(visitedNodes);
  // 현재 챕터 = 활성/방문 노드가 속한 챕터(기본 0)
  const anchorId = availableNodes[0] ?? visitedNodes[visitedNodes.length - 1];
  const currentChapter = anchorId ? (mapNodes.find((n) => n.id === anchorId)?.chapter ?? 0) : 0;
  const chapterNodes = mapNodes.filter((node) => node.chapter === currentChapter);
  const chapterMeta = chapters[currentChapter];
  const currentNodes = chapterNodes.filter((node) => availableSet.has(node.id));
  const currentLabel = currentNodes.length > 0 ? currentNodes.map(nodeTitle).join(" / ") : "No active route";
  const clearedCount = visitedNodes.length;
  // 현재 계층(외곽 F1-7 / 중심부 F8-14 / 심층부 F15-20)
  const curFloor = currentNodes.length > 0 ? Math.min(...currentNodes.map((n) => n.floor)) : 1;
  const zone = curFloor <= 7 ? "외곽" : curFloor <= 14 ? "중심부" : "심층부";

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-ef-bg px-4 py-7 text-ef-ink sm:px-7">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative z-10 mx-auto max-w-[1800px]">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3" style={{ background: PRIMARY }} />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">Route Map</span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted/60">// 카오스 출격 · {zone}</span>
            </div>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
              {chapterMeta?.name ?? "작전 경로 선택"} <span className="text-ef-accent">· {zone}</span>
            </h1>
            <p className="mt-3 text-sm font-bold text-ef-muted">
              왼쪽에서 오른쪽으로 진행하며, 밝게 표시된 다음 작전 노드를 선택합니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-ef-line bg-ef-card px-5 py-3 font-mono text-xs font-bold uppercase tracking-wide tabular-nums text-ef-accent-soft" style={CUT_SM}>
              CLEARED <span className="text-ef-accent">{clearedCount}</span> / ROUTE {chapterNodes.length}
            </span>
            <span className="border border-ef-line bg-ef-card px-5 py-3 font-mono text-xs font-bold uppercase tracking-wide tabular-nums text-ef-muted" style={CUT_SM}>
              ACTIVE <span className="text-ef-ink">{currentNodes.length}</span>
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden border border-ef-line bg-ef-card2 p-5" style={CUT}>
          <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_390px]">
            <div className="border border-ef-line bg-ef-card px-4 py-3" style={CUT_SM}>
              <div className="flex items-center gap-3">
                <Route className="h-5 w-5" style={{ color: ACCENT }} />
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ef-muted">CURRENT CHOICE</p>
                  <p className="text-sm font-black text-ef-ink">{currentLabel}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border border-ef-line bg-ef-card p-2" style={CUT_SM}>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-2 text-xs font-bold text-ef-muted" style={CUT_SM}>
                <Swords className="h-4 w-4" style={{ color: nodeVisual.battle.color }} /> Battle
              </div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-2 text-xs font-bold text-ef-muted" style={CUT_SM}>
                <ShieldAlert className="h-4 w-4" style={{ color: nodeVisual.elite.color }} /> Elite
              </div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-2 text-xs font-bold text-ef-muted" style={CUT_SM}>
                <Sparkles className="h-4 w-4" style={{ color: nodeVisual.event.color }} /> Utility
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto border border-ef-line bg-ef-bg bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px,64px_64px] p-4" style={CUT}>
            <div className="sticky left-0 top-0 z-20 mb-3 flex w-fit items-center gap-2 border border-ef-line bg-black/70 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ef-accent-soft backdrop-blur" style={CUT_SM}>
              <Map className="h-4 w-4" /> ROUTE BOARD
            </div>
            <div className="relative" style={{ width: boardWidth, height: boardHeight }}>
              <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black/45 to-transparent" />
              {laneLabels.map((label, index) => (
                <div
                  key={label}
                  className="absolute left-2 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/20"
                  style={{ top: yStart + index * yGap + 43 }}
                >
                  <span className="h-px w-8 bg-white/10" />
                  {label}
                </div>
              ))}

              {chapterNodes.flatMap((node) =>
                node.next.map((nextId) => {
                  const next = chapterNodes.find((item) => item.id === nextId);
                  if (!next) return null;
                  const active = visitedSet.has(node.id) && availableSet.has(next.id);
                  const cleared = visitedSet.has(node.id) && visitedSet.has(next.id);
                  return (
                    <RouteLine
                      key={`${node.id}-${next.id}`}
                      from={node}
                      to={next}
                      active={active}
                      cleared={cleared}
                    />
                  );
                }),
              )}

              {chapterNodes.map((node) => (
                <RouteNode
                  key={node.id}
                  node={node}
                  available={availableSet.has(node.id)}
                  visited={visitedSet.has(node.id)}
                  onEnter={onEnter}
                />
              ))}

              <div className="absolute bottom-0 left-0 right-0 h-4 border border-ef-line bg-black/60" style={CUT_SM}>
                <div
                  className="h-full"
                  style={{
                    width: `${Math.max(4, (clearedCount / Math.max(1, chapterNodes.length)) * 100)}%`,
                    background: `linear-gradient(90deg, ${ACCENT}, ${PRIMARY})`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 border border-ef-line bg-ef-card px-4 py-3 text-xs font-bold text-ef-muted" style={CUT_SM}>
            <Skull className="h-4 w-4" style={{ color: ACCENT }} />
            선택 가능한 노드만 밝게 표시됩니다. 전투 완료 후 이 경로 선택 화면으로 복귀합니다.
          </div>
        </div>
      </div>
    </section>
  );
}
