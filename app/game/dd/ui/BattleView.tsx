"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { act, canAct, isOver, startRound, perTurn, nextActor, turnOrder, usable, linkCondMet, BASIC, GAUGE_TURN_REGEN, findLinkChain, type DDClass, type DDSkill, type DDState, type DDUnit, type Element, CHAIN_MAX, GAUGE_COST } from "../combat";
import { OPERATORS, SKILLS, OP_BASIC, OP_BASIC_ATK, skillExtraHit, enemyDefFor, avatarUrl, fullUrl, bustUrl, OP_BUST_POS, skillIcon, enemyImage, enemyArchetype, STACK_CARRY } from "../roster";
import { realAtk } from "../progress";
import { aggroShares } from "../aggro";
import { ENCOUNTERS, allyChoose, createBattle, enemyAct, freeUlts, regionEncounter } from "../sim";
import { activeSets, setEffectText, loadoutPieces } from "../gear";
import { weaponOf, weaponEffectText, weaponImage, weaponSeriesName, weaponSeriesDesc, WEAPON_KO, WEAPON_ICON } from "../weapons";
import { artsAttachmentIconPaths, artsReactionIconPaths, physicalCombatIconPaths, combatEffectIconPaths, statCombatIconPaths } from "@/data/combat-icon-paths";

// 상태효과 아이콘(데이터 실측): 이상(연소/감전/부식)·물리이상은 combat-icon-paths 에셋 연결
const STATUS_ICON: Record<string, string> = {
  combustion: artsReactionIconPaths.burning,
  shock: artsReactionIconPaths.electrified,
  corrosion: artsReactionIconPaths.corroded,
  "armor-break": physicalCombatIconPaths.armorBreak,
  crystal: physicalCombatIconPaths.solidification,      // 오리지늄 결정
  stun: physicalCombatIconPaths.encasement,             // 기절(행동 불가/봉인)
  wing: "/icons/status/wing.webp",                       // 핏빛 날개 — 카뮤 「죄를 쫓는 자」 전용 상태 아이콘(핑크 날개 엠블럼, 배경 투명)
};
import { OP_TALENTS } from "../operator-talents";
import { DMG_SHORT as DMG_KO, SKILL_KIND_LABEL as kindLabel } from "../labels";
import { ITEMS, useItem as applyItem, canUseItem, autoItemPick, itemColor, itemImage } from "../items";
import type { BattleResult, BattleStats, NodeKind, PartyMember } from "../run";

const PRIMARY = "#ff9a2f";
const CUT_SM = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" };
const elementColor: Record<"physical" | Element, string> = { physical: "#d4d4d8", heat: "#fb923c", electric: "#FBCB38", cryo: "#67e8f9", nature: "#86efac" };
const elementName: Record<"physical" | Element, string> = { physical: "물리", heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };
const classLabel: Record<DDClass, string> = { guard: "가드", caster: "캐스터", striker: "스트라이커", vanguard: "뱅가드", defender: "디펜더", supporter: "서포터" };
const kindTone: Record<DDSkill["kind"], string> = { attack: "#a1a1aa", battle: "#ff9a2f", link: "#67e8f9", ult: "#facc15" };
const targetLabel: Record<DDSkill["target"], string> = { "single-front": "단일", "single-lowhp": "단일", row: "범위", all: "전체", self: "자신" };
// 레바테인 「황혼」 변신 중: 강화되는 스킬(일반 공격·배틀)은 이름 앞에 "황혼 : "를 붙여
// 궁(황혼)이 켜져 있음을 알린다. 원래 이름은 그대로 두고 접두만 추가한다.
const TWILIGHT_PREFIX_IDS = new Set(["basic", "lae-b"]);
const skillLabel = (u: DDUnit | null, sk: DDSkill): string =>
  u?.id === "laevatain" && (u.timers?.twilight ?? 0) > 0 && TWILIGHT_PREFIX_IDS.has(sk.id) ? `황혼 : ${sk.name}` : sk.name;
// 스킬 사용 불가 사유(usable()과 동일 순서). null=사용 가능.
function skillReason(s: DDState, u: DDUnit, sk: DDSkill): string | null {
  if (usable(s, u, sk)) return null;
  if (sk.selfUlt && u.ultCharge < u.ultCost) return "궁 게이지 부족";
  if (sk.kind === "battle" && s.skillGauge < (sk.gaugeCost ?? 100)) return "스킬 게이지 부족";
  if (sk.kind === "link" && u.linkCd > 0) return `쿨타임 ${Math.ceil(u.linkCd)}턴`;
  // 조건은 서 있는데 장전이 안 됐다 = 이미 그 조건으로 한 번 썼다. 다시 걸어야 열린다.
  if (sk.kind === "link" && !u.linkArmed && linkCondMet(s, u, sk)) return "트리거 대기";
  if (sk.requiresStance != null && u.stance < sk.requiresStance) return "자세 전환 필요";
  return sk.requiresText ?? "조건 미충족";
}
// 뉴비용: 스킬 잠금 사유를 쉬운 말로 부연(툴팁)
const REASON_HELP: Record<string, string> = {
  // 원작 확인: 일반 공격 표에 궁극기 에너지 항목이 없다(스킬 게이지만 회복).
  // 궁은 배틀·연계로만 찬다 — "공격하면 충전"이라고 안내하면 평타만 눌러도 찰 거라 오해한다.
  "궁 게이지 부족": "궁극기 에너지는 배틀 스킬(팀 전원 충전)과 연계 스킬로만 찹니다. 일반 공격은 팀 게이지만 회복하고 궁은 오르지 않습니다.",
  "스킬 게이지 부족": "파티가 함께 쓰는 공유 게이지가 모자랍니다. 매 라운드 자동 회복되니 다음 턴을 노립니다.",
  "자세 전환 필요": "먼저 자세(스탠스)를 전환해야 쓸 수 있습니다.",
  "조건 미충족": "발동 조건이 아직 열리지 않았습니다. 적을 불균형 상태로 만들거나 아츠 이상을 걸면 열립니다.",
  "트리거 대기": "연계는 조건이 **새로 걸리는 순간**에만 열립니다. 이미 그 조건으로 한 번 발동했으므로, 부착·이상을 다시 걸거나 조건이 풀렸다 다시 성립해야 합니다.",
};
const reasonHelp = (reason: string | null): string => (reason ? REASON_HELP[reason] ?? (reason.startsWith("쿨타임") ? "연계 스킬을 다시 쓰려면 재사용 대기(쿨타임)가 끝나야 합니다." : `발동 조건: ${reason}`) : "");
// 배틀 스킬 강조 — '게이지가 찼다'가 아니라 '조건부 효과가 지금 터진다'일 때만 발광.
// 반환: 발동 사유 라벨(있으면 발광), null이면 평범(발광 안 함).
function battlePayoff(s: DDState, u: DDUnit, sk: DDSkill): string | null {
  const foes = s.units.filter((e) => e.side === "enemy" && e.hp > 0);
  if (!foes.length) return null;
  const any = (p: (e: DDUnit) => boolean) => foes.some(p);
  // 부착/이상 소모 페이오프
  if ((sk.forceFreeze || sk.cryoNuke) && any((e) => e.arts.cryo > 0)) return "❄ 냉기 소모";
  if (sk.iceBomb && any((e) => e.arts.cryo > 0 || e.arts.nature > 0)) return "❄ 부착 폭발";
  if (sk.forceShock && any((e) => e.arts.electric > 0)) return "⚡ 전기 소모";
  if (sk.shockBonus && any((e) => e.statuses.includes("shock" as never))) return "⚡ 감전 추격";
  if (sk.burnShockConsume && any((e) => e.statuses.includes("combustion" as never) || e.statuses.includes("shock" as never))) return "🔥 이상 소모";
  if (sk.lanceRecover && any((e) => (e.lanceN || 0) + (e.lanceBig || 0) > 0)) return "🗲 창 회수";
  // 취약/불균형/방불 페이오프
  if (sk.vsWeak && any((e) => e.staggered || (e.vuln.physical || 0) > 0)) return "◆ 약점 가격";
  if (sk.stanceFromCrush && any((e) => (e.physBreak ?? 0) >= 3)) return "◆ 자세 전환";
  // 오퍼 고유 조건부(선언 필드 없이 apply/커스텀 로직으로 처리되는 페이오프 — warfarin 대조)
  if (u.id === "rossi" && any((e) => (e.physBreak ?? 0) >= 1)) return "◆ 진주 추격";        // 방불 적 → 늑대 진주 열기 추격
  if (u.id === "pogranichnik" && any((e) => (e.physBreak ?? 0) > 0)) return "◆ 방어 불능 소모";  // 갑옷 파괴로 방불 소모 → 게이지 회복
  if (u.id === "ardelia" && any((e) => e.statuses.includes("corrosion" as never))) return "◆ 부식 소모"; // 부식 소모 → 물리/아츠 취약
  if (u.id === "zhuangfangyi" && any((e) => e.statuses.includes("shock" as never))) return "⚡ 감전 소모"; // 감전 소모 → 피해 배율↑ + 청뢰검
  // 라에바테인 녹아내린 불꽃 4스택 → 강화 배틀
  if (u.id === "laevatain" && (u.procCount ?? 0) >= 4) return "🔥 강화 폭발";
  return null;
}
const statusLabel: Record<string, string> = { stun: "기절", combustion: "연소", corrosion: "부식", crystal: "결정", "armor-break": "갑옷파괴", shock: "감전", wing: "날개" };
const nodeTitle: Record<NodeKind, string> = { battle: "교전", elite: "정예 교전", boss: "보스 교전", rest: "야영" };
const behaviorLabel: Record<string, string> = { melee: "근접 돌격", snipe: "원거리 저격", heavy: "중장 강타", aoe: "광역 자폭", heal: "치유 지원", buff: "강화 지원" };
const targetDesc: Record<string, string> = { any: "무지향 — 아무나 문다", wounded: "부상자 저격 — 체력% 낮은 대상 마무리", threat: "고위협 직격 — 공격력 높은 딜러 조준" };
// 적 행동 유형별 위협 설명 + 처치 우선도(높을수록 먼저 제거) — 적 상세 패턴 보강용
const behaviorDesc: Record<string, string> = {
  melee: "빠르게 접근해 직접 타격하는 근접형.",
  snipe: "후방에서 부상자를 노리는 고화력·저체력 저격형.",
  heavy: "느리지만 단단하고 강력한 중장형(HP·불균형 높음).",
  aoe: "자폭형 광역 피해 — 방치하면 파티 전체를 타격.",
  heal: "아군을 회복시키는 지원형 — 방치 시 전투 장기화.",
  buff: "아군을 강화하는 지원형 — 방치 시 적 화력 상승.",
};
const behaviorPriority: Record<string, number> = { heal: 3, buff: 3, snipe: 2, aoe: 2, heavy: 1, melee: 1 };
const behaviorIcon: Record<string, string> = { melee: "⚔", snipe: "🎯", heavy: "🛡", aoe: "💥", heal: "✚", buff: "▲" };
// 오퍼 고유 스택 게이지 정보(상세 상단 강조용) — 값·최대·이름·아이콘
const OP_STACK_INFO: Record<string, { get: (u: DDUnit) => number; max: number; name: string; icon: string; tone: string; fmt?: (v: number) => string; desc: string }> = {
  laevatain: { get: (u) => u.procCount ?? 0, max: 4, name: "녹아내린 불꽃", icon: "🔥", tone: "#fb923c", desc: "열기 흡수로 축적 · 4스택 배틀 → 강화 폭발" },
  zhuangfangyi: { get: (u) => u.procCount ?? 0, max: 9, name: "청뢰검", icon: "⚡", tone: "#FBCB38", desc: "감전 소모로 생성 · 뇌격 딜·궁충이 검 수에 비례" },
  yvonne: { get: (u) => u.iceStack ?? 0, max: 10, name: "아이스 슈터", icon: "❄", tone: "#67e8f9", desc: "변신 강화 평타마다 치명 확률 +3%(최대 10)" },
  mifu: { get: (u) => u.stance ?? 0, max: 2, name: "청파 삼형 자세", icon: "🌀", tone: "#a3e635", fmt: (v) => STANCE_KO[v] ?? String(v), desc: "단운 → 추형 → 개천 (스킬로 전환)" },
};
const tierLabel: Record<string, string> = { normal: "일반", common: "일반", enhanced: "강화", advanced: "정예", elite: "정예", boss: "보스" };
const pieceDmgText = (d?: { kind: string; base: number }) => { if (!d) return ""; const pct = d.kind === "hpPct" || d.base < 1; return `${DMG_KO[d.kind] ?? d.kind} +${pct ? Math.round(d.base * 100) + "%" : Math.round(d.base)}`; };

// 유닛 아츠 속성색(플로팅 데미지·이펙트용)
function unitElement(u: DDUnit): "physical" | Element {
  if (u.side === "ally") return OPERATORS.find((o) => o.id === u.id)?.element ?? "physical";
  return enemyDefFor(u.id)?.element ?? "physical";
}
// 로그 마지막 액션에서 스킬명 추출("이름[pos] → 스킬명")
function castFromLog(line?: string): string | null {
  if (!line) return null;
  const i = line.indexOf("→");
  return i >= 0 ? line.slice(i + 1).trim() : null;
}

type Floater = { id: string; amt: number; crit: boolean; tone: string; step?: string; key?: number; born?: number;
  // 두 종류를 쓴다.
  //  · 단타 숫자(kind "hit")  : 한 대마다 하나씩. 좌우로 흩어져 튀어오르고 곧 사라진다.
  //  · 합계 숫자(kind "total"): 대상당 하나. 연쇄가 이어지는 동안 제자리에서 커지며 사라지지 않는다.
  kind?: "hit" | "total"; hits?: number; hold?: boolean };

const FLOAT_MS = 1500;  // 단타 숫자 수명(.dd-hitnum 애니메이션 길이와 맞춘다)
const TOTAL_OUT_MS = 1100; // 합계가 놓여난 뒤 떠오르며 사라지는 시간(.dd-total-out)

// 엔진 로그에서 다단히트 "단 구성"을 뽑는다. combat.ts가 찍는 형식:
//     "    1단 -467" / "    막타 -2,074" → "    ═ 3단 합계 -2,766" → "  적이름 -2766 (HP a/b)"
// 대상은 이름으로 찾지 않는다 — 같은 이름의 적이 둘 이상일 수 있어(록하울러 ×2) 엉뚱한 유닛에 숫자가 뜬다.
// 광역이어도 단 구성(비율)은 모든 대상이 같으므로, 첫 묶음의 라벨·비율만 쓰고 실제 수치는
// 각 대상의 HP 감소분을 그 비율로 쪼개 만든다.
function parseHitPattern(lines: string[]): { label: string; w: number }[] | null {
  const buf: { label: string; w: number }[] = [];
  for (const l of lines) {
    const st = l.match(/^\s{4}(\d+단|막타)\s+-([\d,]+)$/);
    if (st) { buf.push({ label: st[1], w: Number(st[2].replace(/,/g, "")) }); continue; }
    if (buf.length > 1) return buf; // 합계 줄을 만나면 첫 묶음 확정
    buf.length = 0;
  }
  return buf.length > 1 ? buf : null;
}
type Fx = { tick: number; activeId: string | null; actingSide: "ally" | "enemy" | null; floaters: Floater[]; cast: { id: string; text: string } | null };
const NO_FX: Fx = { tick: 0, activeId: null, actingSide: null, floaters: [], cast: null };

function Bar({ value, max, color, h = "h-2", ghost = false }: { value: number; max: number; color: string; h?: string; ghost?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className={`${h} relative w-full overflow-hidden rounded-[2px] bg-black/75`} style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 3px rgba(0,0,0,0.9)" }}>
      {/* 피해 잔상 — 실제 바는 즉시 줄고 잔상은 늦게 따라와서, 이번에 깎인 폭이 눈에 보인다.
          숫자만 뜨고 사라지면 얼마나 들어갔는지 감이 안 오는데 이게 그 간극을 메운다. */}
      {ghost && <div className="absolute inset-y-0 left-0 rounded-[2px]" style={{ width: `${pct}%`, background: "rgba(255,120,90,0.55)", transition: "width 1.1s ease-out 0.28s" }} />}
      <div className="relative h-full rounded-[2px] transition-all duration-300 ease-out" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 7px ${color}77` }}>
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[45%] rounded-t-[2px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.42), transparent)" }} />
      </div>
    </div>
  );
}
function Chip({ children, tone = "#a1a1aa", title, icon, onPick, compact }: { children: React.ReactNode; tone?: string; title?: string; icon?: string; onPick?: (r: DOMRect) => void; compact?: boolean }) {
  // compact: 전투 카드용 — 아이콘 + 수치만. 카드 폭이 좁아 이름까지 넣으면 2~3개만 보이고 나머지가 잘린다.
  // 전체 이름은 툴팁/클릭 팝오버·오퍼 상세에서 확인.
  const cls = compact
    ? "inline-flex items-center gap-0.5 border px-1 py-0.5 font-mono text-[13px] font-bold leading-none"
    : "inline-flex items-center gap-0.5 border px-1.5 py-0.5 font-mono text-[14px] font-bold leading-none tracking-wide";
  const img = icon && <img src={icon} alt="" className={`${compact ? "" : "-ml-0.5"} h-4 w-4 shrink-0 object-contain`} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />;
  if (onPick) return <button type="button" onClick={(e) => onPick(e.currentTarget.getBoundingClientRect())} title={title}
    className={`${cls} transition-[filter] hover:brightness-125`}
    style={{ borderColor: `${tone}99`, color: tone, background: `${tone}22` }}>{img}{children}</button>;
  return <span title={title} className={`${cls} ${title ? "cursor-help" : ""}`} style={{ borderColor: `${tone}99`, color: tone, background: `${tone}22` }}>{img}{children}</span>;
}
// 칩 압축 표기: 라벨 끝의 수치만 남긴다(방어 불능 2 → 2, 허약 25% → 25%).
// 수치가 없으면 아이콘만, 아이콘도 없으면 이름 앞 2글자.
const chipShort = (c: StatusChip): string => {
  // 스택형(녹아내린 불꽃 3/4 · 청뢰검 5/9 · 아이스 슈터 7/10)은 현재/최대를 그대로 — 끝 숫자만
  // 뽑으면 최대치만 남아 "4"처럼 보인다.
  const ratio = c.label.match(/(\d+)\s*\/\s*(\d+)/);
  if (ratio) return `${ratio[1]}/${ratio[2]}`;
  if (c.k === "mifu") return c.label.replace(/^자세\s*/, "");   // 미브 자세는 이름 자체가 값(단운·추형·개천)
  const m = c.label.match(/([+\-]?\d+%?)(?:\/턴)?\s*$/); // 「재생 N/턴」의 /턴 접미사까지 흡수해 숫자를 뽑는다
  const val = m ? m[1] : "";
  if (c.icon) return val;                       // 아이콘이 뜻을 전달 → 수치만
  // 아이콘 없는 칩은 숫자만 두면 뜻을 알 수 없다 → 이름 2글자 + 수치
  const name = c.label.replace(/[+\-]?\d+(%|\/턴)?\s*$/, "").replace(/^[^\p{L}]+/u, "").trim().slice(0, 2);
  return name + val;
};
// 상태효과 설명 — 신규 플레이어가 칩을 봤을 때 무슨 효과인지 알 수 있게(툴팁)
const CHIP_DESC: Record<string, string> = {
  pb: "방어 불능 — 그 자체로는 효과 없는 표식(최대 4). 띄우기·넘어뜨리기로 쌓고 강타·갑옷 파괴로 소모합니다",
  fz: "동결 — 행동 불가(냉기 아츠 이상). 이 상태에 방어 불능·물리 이상을 넣으면 쇄빙(대량 물리)",
  heat: "열기 부착 — 다른 속성 부착과 겹치면 아츠 이상 반응(스택 소모)",
  electric: "전기 부착 — 다른 속성 부착과 겹치면 아츠 이상 반응(스택 소모)",
  cryo: "냉기 부착 — 다른 속성 부착과 겹치면 아츠 이상 반응(스택 소모)",
  nature: "자연 부착 — 다른 속성 부착과 겹치면 아츠 이상 반응(스택 소모)",
  shock: "감전 — 받는 아츠 피해 12~24% 증가(전기 아츠 이상). 취약과는 별개 항목이라 서로 곱해집니다",
  combustion: "연소 — 매 턴 지속 피해(열기 아츠 이상)",
  corrosion: "부식 — 전 속성 저항을 포인트 단위로 깎습니다(최대 24, 자연 아츠 이상). 취약이 아니라 저항 계산에 들어갑니다",
  crystal: "결정 — 파괴 시 추가타",
  "armor-break": "갑옷 파괴 — 방어 불능을 전부 소모해 물리 피해 + 받는 물리 피해 12~24% 증가",
  stun: "기절 — 행동 불가",
  wing: "핏빛 날개 — 연계 대상 표식",
  dot: "지속 피해 — 매 턴 HP 감소",
  atk: "공격력 증가 버프",
  wk: "허약 — 주는 피해 감소. 중첩 시 곱연산이라 0이 되지 않습니다",
  amp: "증폭 — 주는 특정 속성 피해 증가(팀 버프). 취약·받는 피해 증가와는 별개 항목",
  vuln: "취약 — 특정 속성으로 받는 피해 증가. 텍스트에 취약이라 적힌 효과만 해당됩니다",
  prot: "비호 — 받는 피해 감소. 여러 개가 겹치면 가장 강한 것 하나만 적용됩니다",
  mh: "연타 — 다음 배틀/궁 피해 증가(배틀 30/45/60/75%, 궁 20/30/40/50%). 발동 후 소모",
  lae: "녹아내린 불꽃 — 열기 흡수 스택(최대 4). 4스택 배틀 → 강화 폭발. ⤴ 전투가 끝나도 유지되어 다음 교전으로 넘어갑니다",
  zfy: "청뢰검 — 감전 소모 시 이상 레벨+1자루 생성(최대 9). 검 수만큼 뇌격이 나가고 마지막 뇌격만 6배. 전투가 끝나면 사라집니다",
  yv: "아이스 슈터 — 변신 강화 평타 치명 확률 누적(최대 10). 변신이 끝나면 사라집니다",
  mifu: "청파 삼형 자세 — 단운→추형→개천(스킬로 전환). 전투마다 처음부터",
  recv: "받는 피해 증가 — 감전·갑옷 파괴 등이 거는 효과. 취약과 별개로 곱해집니다",
  res: "저항 감소 — 부식이 속성 저항 포인트를 깎습니다(최대 24). 저항 높은 적일수록 효과가 큽니다",
  spd: "속도 변화 — 행동 순서(ATB)가 빨라지거나 느려집니다",
  regen: "재생 — 자기 턴마다 체력 회복",
};
// 오퍼 고유 스택형 버프(재능·변신 카운터) — 표시 안 되던 procCount/iceStack/stance 등을 칩으로
const STANCE_KO = ["단운", "추형", "개천"];
// 스택 칩. 전투가 끝나도 남는 스택(STACK_CARRY)에는 ⤴를 붙여 구분한다 —
// 궁 게이지와 레바테인 녹아내린 불꽃만 넘어가고, 청뢰검·아이스 슈터·삼형 자세는 전투 내 자원이다.
const carryMark = (id: string) => (STACK_CARRY.has(id) ? " ⤴" : "");
const OP_STACK: Record<string, (u: DDUnit) => StatusChip | null> = {
  laevatain: (u) => u.procCount > 0 ? { k: "lae", icon: talentIcon("laevatain"), label: `녹아내린 불꽃 ${u.procCount}/4${carryMark("laevatain")}`, tone: "#fb923c", dir: 1 } : null,
  zhuangfangyi: (u) => u.procCount > 0 ? { k: "zfy", icon: talentIcon("zhuangfangyi"), label: `청뢰검 ${u.procCount}/9`, tone: "#FBCB38", dir: 1 } : null,
  yvonne: (u) => (u.iceStack ?? 0) > 0 ? { k: "yv", icon: talentIcon("yvonne"), label: `아이스 슈터 ${u.iceStack}/10`, tone: "#67e8f9", dir: 1 } : null,
  mifu: (u) => (u.stance ?? 0) > 0 ? { k: "mifu", icon: talentIcon("mifu"), label: `자세 ${STANCE_KO[u.stance] ?? u.stance}`, tone: "#a3e635", dir: 1 } : null,
};
const chipTitle = (c: StatusChip): string => [
  CHIP_DESC[c.k],
  c.src && `${SRC_KIND_KO[c.src.kind] ?? ""} ${c.src.by}「${c.src.via}」`,
  c.turns ? `${c.turns}턴 남음` : null,
].filter(Boolean).join("  ·  ");
// 상태 칩. dir: +1=버프(▲), -1=디버프(▼), 0=중립(부착 등). turns=잔여 지속 턴. src=출처(누가·무엇으로).
type EffSrc = { by: string; via: string; kind: "skill" | "weapon" | "gear" | "item" };
type StatusChip = { k: string; label: string; tone: string; dir: number; turns?: number; src?: EffSrc; icon?: string };
const talentIcon = (id: string) => OP_TALENTS[id]?.[0]?.icon; // 오퍼 스택 재능 아이콘(첫 재능)
function unitChips(u: DDUnit): StatusChip[] {
  const T = u.timers || {};
  const S = (u.effectSrc || {}) as Record<string, EffSrc>;
  const maxKey = (pre: string) => { let m = 0, mk = ""; for (const k in T) if (k.startsWith(pre) && T[k] > m) { m = T[k]; mk = k; } return mk; };
  const c: StatusChip[] = [];
  if (u.physBreak > 0) c.push({ k: "pb", label: `방어 불능 ${u.physBreak}`, tone: "#fca5a5", dir: -1, turns: T.physBreak, src: S.physBreak, icon: physicalCombatIconPaths.defenseBreak });
  if (u.frozen > 0) c.push({ k: "fz", label: `동결 ${u.frozen}`, tone: "#67e8f9", dir: -1, turns: T.frozen, src: S.frozen, icon: artsReactionIconPaths.frozen });
  for (const st of u.statuses) c.push({ k: st, label: `${statusLabel[st] ?? st}`, tone: "#fbbf24", dir: -1, turns: T[st], src: S[st], icon: STATUS_ICON[st] });
  (["heat", "electric", "cryo", "nature"] as Element[]).forEach((e) => { if (u.arts[e] > 0) c.push({ k: e, label: `${elementName[e]}부착 ${u.arts[e]}`, tone: elementColor[e], dir: 0, turns: T["arts:" + e], src: S["arts:" + e], icon: artsAttachmentIconPaths[e] }); });
  if (u.dot > 0) c.push({ k: "dot", label: `지속 ${u.dot}`, tone: "#fb923c", dir: -1, turns: T.dot, src: S.dot, icon: artsReactionIconPaths.burning });
  if ((u.atkBuff ?? 0) > 0) c.push({ k: "atk", label: `공격 +${Math.round(u.atkBuff * 100)}%`, tone: "#ffd24a", dir: 1, turns: T.atkBuff, src: S.atkBuff, icon: statCombatIconPaths.attack });
  if (u.weakenMul < 1) c.push({ k: "wk", label: `허약 ${Math.round((1 - u.weakenMul) * 100)}%`, tone: "#c084fc", dir: -1, turns: T.weaken, src: S.weaken, icon: combatEffectIconPaths.weaken });
  const amp = (Object.values(u.amp) as number[]).reduce((a, b) => a + b, 0);
  if (amp > 0) { const mk = maxKey("amp:"); c.push({ k: "amp", label: `증폭 ${Math.round(amp * 100)}%`, tone: "#86efac", dir: 1, turns: T[mk] || undefined, src: S[mk], icon: combatEffectIconPaths.amplify }); }
  const vuln = (Object.values(u.vuln) as number[]).reduce((a, b) => a + b, 0);
  if (vuln > 0) { const mk = maxKey("vuln:"); c.push({ k: "vuln", label: `취약 ${Math.round(vuln * 100)}%`, tone: "#f87171", dir: -1, turns: T[mk] || undefined, src: S[mk], icon: combatEffectIconPaths.vulnerable }); }
  // 받는 피해 증가(감전·갑옷 파괴 등)는 취약과 별개 곱연산 인자 — 칸도 따로 띄운다.
  const recv = (Object.values(u.recv) as number[]).reduce((a, b) => a + b, 0);
  if (recv > 0) { const mk = maxKey("recv:"); c.push({ k: "recv", label: `받는 피해 +${Math.round(recv * 100)}%`, tone: "#fb7185", dir: -1, turns: T[mk] || undefined, src: S[mk], icon: combatEffectIconPaths.vulnerable }); }
  // 부식 저항 감소는 취약/받는피해증가와 또 다른 인자(저항 버킷) — 포인트 단위로 표기한다.
  if ((u.resShred || 0) > 0) { c.push({ k: "res", label: `저항 -${Math.round(u.resShred * 100)}`, tone: "#a3e635", dir: -1, turns: T.resShred, src: S.resShred, icon: artsReactionIconPaths.corroded }); }
  if (u.protection > 0) c.push({ k: "prot", label: `비호 ${Math.round(u.protection * 100)}%`, tone: "#38bdf8", dir: 1, turns: T.protection, src: S.protection, icon: combatEffectIconPaths.guard });
  if (u.multiHit > 0) c.push({ k: "mh", label: `연타 ${u.multiHit}`, tone: "#fb923c", dir: 1, icon: combatEffectIconPaths.combo });
  if ((u.speedMod ?? 0) !== 0) c.push({ k: "spd", label: `${u.speedMod > 0 ? "가속" : "감속"} ${Math.abs(u.speedMod)}`, tone: u.speedMod > 0 ? "#86efac" : "#c084fc", dir: u.speedMod > 0 ? 1 : -1, turns: T.speedMod, src: S.speedMod, icon: u.speedMod > 0 ? combatEffectIconPaths.haste : combatEffectIconPaths.slow });
  if ((u.regen ?? 0) > 0) c.push({ k: "regen", label: `재생 ${u.regen}/턴`, tone: "#58d3a0", dir: 1, turns: T.regen, icon: statCombatIconPaths.heal });
  const opc = OP_STACK[u.id]?.(u); if (opc) c.push(opc); // 오퍼 고유 스택(녹아내린 불꽃·청뢰검·아이스 슈터·자세)
  return c;
}
const SRC_KIND_KO: Record<string, string> = { skill: "스킬", weapon: "무기", gear: "장비", item: "아이템" };

// 유닛 위 플로팅 이펙트(데미지/힐/피격/캐스트) 레이어
// 단타 숫자는 겹치지 않게 좌우로 흩뿌린다 — key에서 결정적으로 뽑아 리렌더마다 안 흔들린다.
const scatter = (k: number) => ((k * 37) % 100) / 100;
function FxLayer({ id, fx }: { id: string; fx: Fx }) {
  const mine = fx.floaters.filter((f) => f.id === id);
  const hit = mine.some((f) => f.amt < 0);
  const hits = mine.filter((f) => f.kind !== "total");
  const total = mine.find((f) => f.kind === "total");
  return (
    <>
      {hit && <span key={`fl-${fx.tick}`} className="dd-flash" />}
      {/* ── 단타 숫자 ── 한 대마다 하나. 흩어져 튀고 1.4초에 사라진다 */}
      {hits.map((f, i) => {
        const k = f.key ?? i;
        return (
          <span key={f.key ?? `fn-${fx.tick}-${i}`} className="dd-hitnum font-mono font-black"
            style={{ left: `${26 + scatter(k) * 48}%`, top: `${52 + ((k * 53) % 5) * 11}px`, // 합계(상단) 아래로 흩뿌린다
                     color: f.amt > 0 ? "#8fd36a" : f.crit ? "#ffd24a" : "#ff8f7a", fontSize: f.crit ? "1.5rem" : "1.15rem" }}>
            {f.amt > 0 ? `+${f.amt.toLocaleString()}` : f.amt.toLocaleString()}{f.crit ? "!" : ""}
          </span>
        );
      })}
      {/* ── 합계 ── 대상당 하나. 연쇄가 끝날 때까지 남아 값만 커진다(연계 피해가 들어와도 안 사라진다) */}
      {total && (
        <span key={total.key} className={`${total.hold ? "dd-total" : "dd-total dd-total-out"} font-mono font-black`}
              style={{ color: total.crit ? "#ffdf7a" : "#ff8a76" }}>
          <span key={total.amt} className="dd-total-bump inline-block">{Math.abs(total.amt).toLocaleString()}</span>
          {total.hits != null && total.hits > 1 && <em className="ml-1 align-super text-[12px] font-black not-italic text-white/75">{total.hits}타</em>}
          {total.step && <em className="ml-1 align-super text-[12px] font-black not-italic text-ef-accent">{total.step}</em>}
        </span>
      )}
      {fx.cast && fx.cast.id === id && <span key={`ct-${fx.tick}`} className="dd-cast border border-ef-accent/50 bg-black/85 px-2 py-0.5 font-mono text-[14px] font-bold text-ef-accent-soft" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>{fx.cast.text}</span>}
    </>
  );
}
const shakeCls = (hit: boolean, tick: number) => (hit ? (tick % 2 ? "dd-shake-a" : "dd-shake-b") : "");
const actCls = (active: boolean, tick: number) => (active ? (tick % 2 ? "dd-act-a" : "dd-act-b") : "");

export default function BattleView({ party, encounterKey, nodeKind, faction, bossId, floor = 0, depth = 0, maxDepth = 6, owned, items, onUseItem, onEnd, onShowMap }: { party: PartyMember[]; encounterKey: string; nodeKind: NodeKind; faction?: string; bossId?: string; floor?: number; depth?: number; maxDepth?: number; owned?: Record<string, number>; items: Record<string, number>; onUseItem: (id: string) => void; onEnd: (result: "ally" | "enemy", survivors: BattleResult[], stats?: BattleStats) => void; onShowMap?: () => void }) {
  const stateRef = useRef<DDState | null>(null);
  if (!stateRef.current) {
    const base = ENCOUNTERS.find((e) => e.key === encounterKey) ?? ENCOUNTERS[0];
    const enc = faction ? { ...base, make: () => regionEncounter(faction, nodeKind, depth, maxDepth, bossId, floor) } : base; // 세력 리전 편성(깊이별 티어 + 층 보스 고정 + 층 스탯 배율)
    stateRef.current = createBattle(party, enc, owned, nodeKind === "boss"); // 지속 HP + 장비 세트 효과 + 제작 단조 반영
    stateRef.current.manualLink = true; // 기본 수동 — 연계는 플레이어가 콤보 아이콘으로 발동(자동 모드 시 false)
  }
  const cycleActsRef = useRef(0); // ATB: 사이클(모두 1회) 내 행동 수
  // 전술 아이템은 자유 행동(턴 미소모)이되 **한 턴 1개**만 — 무제한이면 한 턴에 몰아써서
  // 보스의 한 방 설계를 무력화한다(실측: 완주율은 1개/턴이나 무제한이나 100%로 동일).
  const itemTurnRef = useRef<string | null>(null); // 이번 턴에 아이템을 쓴 오퍼 id
  const cycleSizeRef = useRef(1); // 사이클 크기(생존 유닛 수)
  const dmgRef = useRef<Record<string, number>>({}); // 아군별 누적 가한 피해(데미지 기록)
  // 행동 타임라인(사이클 기록) — r=라운드, u=오퍼, k=종류(attack/battle/link/ult/item), s=스킬·아이템 id, a=자동/예약 발동
  const actionsRef = useRef<{ r: number; u: string; k: string; s: string; a?: 1 }[]>([]);
  const takenRef = useRef<Record<string, number>>({}); // 적별 누적으로 받은 피해 — 숫자가 얼마나 쌓였는지 카드에서 바로 보이게
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRef = useRef(false); // 기본 수동(전투 스킬 직접 선택). 자동은 토글.
  const speedRef = useRef(1);
  const fxTick = useRef(0);
  const hitTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]); // 다단히트 순차 연출 타이머
  const flSeq = useRef(0); // 데미지 숫자 고유키 — 행동이 바뀌어도 살아있는 숫자는 유지된다
  // 콤보 누적: 대상별로 숫자 하나만 띄우고 값을 키운다. 다단히트의 각 단은 물론,
  // 연쇄(연계)로 이어지는 다음 행동의 피해도 같은 숫자에 계속 더해진다.
  const comboRef = useRef<{ gen: number; tot: Record<string, number>; hits: Record<string, number>; key: Record<string, number> }>({ gen: 0, tot: {}, hits: {}, key: {} });
  const comboRelRef = useRef<ReturnType<typeof setTimeout> | null>(null); // 연쇄 종료 → 누적 숫자 놓아주기(떠오르며 사라짐)
  // 연쇄 종료: 합계의 hold를 푼다.
  const releaseCombo = () => {
    // 연계 콤보 아이콘이 떠 있으면 연쇄가 아직 안 끝났다 — 플레이어가 누르길 기다린다.
    if (linkComboRef.current) { comboRelRef.current = setTimeout(releaseCombo, 1200); return; }
    comboRef.current = { gen: comboRef.current.gen + 1, tot: {}, hits: {}, key: {} };
    // hold를 풀면 .dd-total-out으로 넘어가 떠오르며 사라진다. 그 뒤엔 born 수명으로 정리된다.
    setFx((prev) => (prev.floaters.some((f) => f.hold) ? { ...prev, floaters: prev.floaters.map((f) => (f.hold ? { ...f, hold: false, born: Date.now() } : f)) } : prev));
  };
  const stampFloaters = (fs: Floater[]): Floater[] => fs.map((f) => (f.key != null ? f : { ...f, key: ++flSeq.current, born: Date.now() }));
  // 새 숫자를 기존 숫자 위에 얹는다(교체 X). 수명이 지난 것만 걷어낸다 → 다음 행동이 와도 읽을 시간이 남는다.
  const mergeFx = (next: Omit<Fx, "floaters"> & { floaters: Floater[] }, keepOld = true) =>
    setFx((prev) => { const now = Date.now();
      // hold(콤보 누적 중)는 수명 무시 — 연쇄가 끝날 때 release가 풀어 준다.
      // hold(연쇄 진행 중인 합계)는 수명 무시 — releaseCombo가 놓아줄 때까지 남는다.
      const life = (f: Floater) => (f.kind === "total" ? TOTAL_OUT_MS : FLOAT_MS);
      const alive = keepOld ? prev.floaters.filter((f) => (f.hold || (f.born != null && now - f.born < life(f))) && !next.floaters.some((n) => n.key === f.key)) : [];
      return { ...next, floaters: [...alive, ...stampFloaters(next.floaters)] }; });
  const [auto, setAuto] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [current, setCurrent] = useState<DDUnit | null>(null);
  const [winner, setWinner] = useState<"ally" | "enemy" | null>(null);
  const [fx, setFx] = useState<Fx>(NO_FX);
  const [roundBanner, setRoundBanner] = useState<{ n: number; tick: number } | null>(null);
  // 스킬 연계 체인 연출: 몇 연쇄째인지 + 누가 이어받았는지. 피해와 무관한 표시 전용.
  const [chain, setChain] = useState<{ n: number; names: string[]; tick: number } | null>(null);
  // 상태 칩 클릭 → 무슨 효과인지 설명 팝오버(호버 title은 터치·짧은 노출로 놓치기 쉽다)
  const [chipInfo, setChipInfo] = useState<{ c: StatusChip; x: number; y: number } | null>(null);
  const [aiming, setAiming] = useState<DDSkill | null>(null); // 대상 선택 중인 단일 스킬
  const [mounted, setMounted] = useState(false); // 포털(모바일 조준 바)용 — 클라이언트 마운트 후에만 body 포털
  useEffect(() => setMounted(true), []);
  const [viewId, setViewId] = useState<string | null>(null); // 대기 아군 스킬 미리보기(잠금 패널) — 연계 쿨타임 확인용
  const linkComboRef = useRef<unknown>(null); // 콤보 프롬프트 대기 중 — 누적 해제를 미룬다
  const [linkCombo, setLinkCombo] = useState<{ unitId: string; skill: DDSkill } | null>(null); // 연계 콤보 프롬프트(스킬 발동 → 조건 열린 연계 아이콘)
  linkComboRef.current = linkCombo; // 렌더마다 동기화 — releaseCombo가 최신 상태를 본다
  const [inspectId, setInspectId] = useState<string | null>(null); // 스탯 조회 유닛
  const [inspectTab, setInspectTab] = useState<"skill" | "gear" | "talent">("skill"); // 오퍼 상세 하단 탭
  const [detailId, setDetailId] = useState<string | null>(null); // 스킬 상세 펼침
  // 스킬 패널이 화면 최하단이라 ⓘ 상세가 펼쳐지면 뷰포트 밖으로 잘린다 → 열릴 때 보이도록 스크롤.
  const detailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { if (detailId) detailRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [detailId]);
  const [showLog, setShowLog] = useState(false);
  const [showHelp, setShowHelp] = useState(false); // 용어 안내 — 팀 게이지/궁/불균형/부착을 설명 없이 던지고 있었다
  // 첫 전투 1회 온보딩 — 신규 플레이어는 '용어' 버튼을 눌러야 하는 줄 모른다. 처음 한 번만 자동으로 펼친다.
  useEffect(() => { try { if (localStorage.getItem("dd-battle-intro") !== "1") { setShowHelp(true); localStorage.setItem("dd-battle-intro", "1"); } } catch { /* 저장소 차단 */ } }, []);
  const [tab, setTab] = useState<"dmg" | "log">("dmg"); // 하단 패널: 데미지 기록 / 전투 기록
  const [, bump] = useReducer((x) => x + 1, 0);

  const delay = () => 780 / speedRef.current;

  // 한 액션 수행 → HP 변화로 플로팅 데미지/피격 이펙트 산출
  function doAction(actor: DDUnit, run: () => void, cast: string | null) {
    const s = stateRef.current!;
    const before = new Map(s.units.map((u) => [u.id, u.hp]));
    const logStart = s.log.length;
    run();
    const newLines = s.log.slice(logStart);
    // 체인은 아군 연쇄일 때만 — 적 행동은 연쇄를 끊는다.
    const chainN = actor.side === "ally" ? s.chain ?? 1 : 1;
    setChain((c) => (chainN > 1 ? { n: chainN, names: [...(c && chainN > c.n ? c.names : []), actor.name].slice(-5), tick: fxTick.current + 1 } : null));
    const crit = newLines.some((l) => /폭발|치명/.test(l));
    const floaters: Floater[] = [];
    for (const u of s.units) { const d = u.hp - (before.get(u.id) ?? u.hp); if (d !== 0) floaters.push({ id: u.id, amt: d, crit: crit && d < 0, tone: elementColor[unitElement(actor)] }); }
    // 데미지 기록: 아군 행동이 적에게 준 총 피해를 액터에 누적
    for (const u of s.units) if (u.side === "enemy") { const d = (before.get(u.id) ?? u.hp) - u.hp; if (d > 0) takenRef.current[u.id] = (takenRef.current[u.id] ?? 0) + d; }
    if (actor.side === "ally") { let dealt = 0; for (const u of s.units) if (u.side === "enemy") { const d = (before.get(u.id) ?? u.hp) - u.hp; if (d > 0) dealt += d; } if (dealt > 0) dmgRef.current[actor.id] = (dmgRef.current[actor.id] ?? 0) + dealt; }
    fxTick.current += 1;
    setRoundBanner(null);
    // ── 피해 숫자 ── 단타는 하나씩 흩뿌리고, 합계는 대상당 하나로 남겨 계속 키운다.
    // 연쇄(연계)로 다음 오퍼가 이어붙어도 합계는 사라지지 않고 그 피해까지 더한다.
    const pat = parseHitPattern(newLines);
    const damaged = floaters.filter((f) => f.amt < 0); // 피해만 합계에 넣는다(회복은 단타 표시로 끝)
    const others = floaters.filter((f) => f.amt >= 0).map((f) => ({ ...f, kind: "hit" as const }));
    if (comboRelRef.current) { clearTimeout(comboRelRef.current); comboRelRef.current = null; }
    if (chainN <= 1) releaseCombo(); // 새 연쇄 시작 → 이전 합계는 떠오르며 사라진다
    const combo = comboRef.current;
    const base: Record<string, number> = { ...combo.tot };
    const baseHits: Record<string, number> = { ...combo.hits };
    for (const f of damaged) {
      combo.tot[f.id] = (base[f.id] ?? 0) + -f.amt;
      combo.hits[f.id] = (baseHits[f.id] ?? 0) + (pat ? pat.length : 1);
      combo.key[f.id] ??= ++flSeq.current; // 대상별 고정 키 → 합계는 같은 DOM이 값만 바꾼다(리마운트 X)
    }
    const steps = pat ?? [{ label: "", w: 1 }];
    const wSum = steps.reduce((a, b) => a + b.w, 0);
    const chainTag = chainN > 1 ? `⛓${chainN}` : "";
    hitTimersRef.current.forEach(clearTimeout); hitTimersRef.current = [];
    const baseTick = fxTick.current;
    // 타수가 많아도 다 읽히게 최소 110ms는 벌린다.
    const gap = Math.min(190, Math.max(110, delay() / (steps.length + 1)));
    const shots: Floater[] = []; // 이번 행동에서 띄운 단타들(뒤 단이 와도 앞 단은 남는다)
    for (let i = 0; i < steps.length; i++) {
      const shot = () => {
        const acc: Floater[] = [...others, ...shots];
        for (const f of damaged) {
          const tot = -f.amt;
          const upto = i === steps.length - 1 ? tot : Math.round((tot * steps.slice(0, i + 1).reduce((a, b) => a + b.w, 0)) / wSum);
          const prev = i === 0 ? 0 : Math.round((tot * steps.slice(0, i).reduce((a, b) => a + b.w, 0)) / wSum);
          const one: Floater = { id: f.id, amt: -(upto - prev), crit: crit || steps[i].label === "막타", tone: f.tone, kind: "hit" };
          acc.push(one); shots.push(one);
          // 합계 — 이번 단까지 누적. 연쇄 이전 누적(base)을 그대로 이어받는다.
          acc.push({ id: f.id, amt: -((base[f.id] ?? 0) + upto), crit, tone: f.tone, kind: "total", hold: true,
            hits: (baseHits[f.id] ?? 0) + i + 1, step: chainTag || undefined, key: combo.key[f.id] });
        }
        mergeFx({ tick: baseTick, activeId: actor.id, actingSide: actor.side, floaters: acc, cast: i === 0 && cast ? { id: actor.id, text: cast } : null });
        bump();
      };
      if (i === 0) shot(); else hitTimersRef.current.push(setTimeout(shot, gap * i));
    }
    fxTick.current = baseTick + 1;
    // 연쇄가 더 안 이어지면 합계를 놓아준다(다음 행동이 오면 위에서 타이머가 취소된다).
    comboRelRef.current = setTimeout(releaseCombo, gap * steps.length + delay() * 2.2);
    bump();
  }

  function finish(w: "ally" | "enemy") { setWinner(w); setCurrent(null); setFx((f) => ({ ...f, activeId: null })); bump(); }

  // 스텝 진행: 죽은 유닛은 즉시 건너뛰고, 실제 행동/라운드 전환은 딜레이를 두고 연출
  // 한 행동 후 사이클 관리: 모두 1회 행동(사이클)마다 공유 라운드 효과 + 라운드 배너.
  function afterAction() {
    const s = stateRef.current!;
    if (++cycleActsRef.current >= cycleSizeRef.current) {
      cycleActsRef.current = 0;
      cycleSizeRef.current = Math.max(1, s.units.filter((u) => u.hp > 0).length);
      startRound(s); // 스킬 게이지 회복·라운드++
      fxTick.current += 1; setRoundBanner({ n: s.round, tick: fxTick.current });
    }
  }

  // ATB 스텝: 게이지 채워 다음 행동자 결정 → 자기 턴 효과 → 행동(적 자동/아군 자동·수동)
  function step() {
    const s = stateRef.current!;
    const over = isOver(s); if (over) { finish(over); return; }
    if (s.round >= 40) { finish("enemy"); return; }
    const u = nextActor(s);
    if (!u) { finish(isOver(s) ?? "enemy"); return; }
    perTurn(s, u); // 지속피해·재생·불균형회복·타이머 감쇠
    if (u.hp <= 0) { afterAction(); timerRef.current = setTimeout(step, 120); return; } // 지속피해로 사망
    if (!canAct(u)) {
      if (u.staggered) s.log.push(`${u.name} 불균형 — 행동 불가`);
      else if (u.frozen > 0) s.log.push(`${u.name} 동결 — 행동 불가`);
      else if ((u.timers.stun || 0) > 0) s.log.push(`${u.name} 시간 정지 — 행동 불가`);
      fxTick.current += 1; mergeFx({ tick: fxTick.current, activeId: u.id, actingSide: u.side, floaters: [], cast: { id: u.id, text: u.staggered ? "불균형!" : u.frozen > 0 ? "동결!" : "행동 불가" } }); bump();
      afterAction();
      timerRef.current = setTimeout(step, 480 / speedRef.current); return;
    }
    // 예약된 연계(ATB 우선으로 끼어든 오퍼) — 자기 차례에 자동 발동(수동/자동 무관). ATB 복원으로 정규 턴 유지(원래 턴 + 연계 턴)
    if (u.side === "ally" && u.pendingLink) {
      const sk = u.pendingLink; u.pendingLink = undefined;
      if (u.pendingLinkAtb != null) { u.atb = u.pendingLinkAtb; u.pendingLinkAtb = undefined; }
      actionsRef.current.push({ r: s.round, u: u.id, k: sk.kind, s: sk.id, a: 1 });
      doAction(u, () => { if (usable(s, u, sk)) act(s, u, sk); else s.log.push(`${u.name} 연계 조건 해제`); }, sk.name);
      afterAction();
      timerRef.current = setTimeout(step, delay()); return;
    }
    if (u.side === "enemy") {
      doAction(u, () => enemyAct(s, u), null);
      const line = stateRef.current!.log.slice(-6).reverse().find((l) => l.startsWith(`${u.name}`) && l.includes("→"));
      if (line) setFx((f) => ({ ...f, cast: { id: u.id, text: castFromLog(line) ?? "공격" } }));
      afterAction();
      timerRef.current = setTimeout(step, delay()); return;
    }
    if (autoRef.current) {
      // 자유 행동 궁(원작: 궁은 언제든 즉발) — 다른 아군의 준비된 궁을 이 턴에 먼저 터뜨린다.
      for (const { unit, skill } of freeUlts(s, u)) {
        if (!usable(s, unit, skill)) continue;
        actionsRef.current.push({ r: s.round, u: unit.id, k: "ult", s: skill.id, a: 1 });
        act(s, unit, skill);
      }
      // 자동도 위급하면 소비 아이템을 쓴다 — 안 쓰면 수동보다 일방적으로 불리하다.
      const pick = autoItemPick(s, items);
      // 아이템은 자유 행동 — 턴을 소모하지 않고 같은 턴에 스킬까지(한 턴 1개, 수동과 동일 규칙)
      if (pick) actionsRef.current.push({ r: s.round, u: u.id, k: "item", s: pick.id, a: 1 });
      const sk = allyChoose(s, u);
      if (sk) actionsRef.current.push({ r: s.round, u: u.id, k: sk.kind, s: sk.id, a: 1 });
      doAction(u, () => {
        if (pick) applyItem(s, pick.id, pick.target);
        if (sk) act(s, u, sk); else if (!pick) s.log.push(`${u.name} 행동 불가(스킬 없음)`);
      }, sk ? sk.name : (pick ? ITEMS[pick.id]?.name ?? "아이템" : null));
      if (pick) onUseItem(pick.id);
      afterAction();
      timerRef.current = setTimeout(step, delay()); return;
    }
    // 수동: 플레이어 입력 대기(행동은 playerAct에서)
    itemTurnRef.current = null; // 새 턴 → 아이템 다시 사용 가능
    setCurrent(u); setViewId(null); fxTick.current += 1; mergeFx({ tick: fxTick.current, activeId: u.id, actingSide: "ally", floaters: [], cast: null }); bump();
  }

  useEffect(() => { const s = stateRef.current!; cycleSizeRef.current = Math.max(1, s.units.filter((u) => u.hp > 0).length); timerRef.current = setTimeout(step, 420); return () => { if (timerRef.current) clearTimeout(timerRef.current); hitTimersRef.current.forEach(clearTimeout); }; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  // 승리/패배 확정 → 배너 연출 후 자동 종료(교전 승리는 전리품 화면으로, 보스/패배는 결과 화면으로)
  useEffect(() => {
    if (!winner) return;
    const t = setTimeout(() => {
      const s = stateRef.current;
      const su = (s?.units ?? []).filter((u) => u.side === "ally").map((a) => ({ id: a.id, hp: a.hp, ult: a.ultCharge, stacks: a.procCount }));
      const foes = (s?.units ?? []).filter((u) => u.side === "enemy");
      const stats = { rounds: s?.round ?? 0, enemies: foes.map((e) => e.name), dmgDealt: foes.reduce((n, e) => n + Math.max(0, e.maxHp - e.hp), 0), dmgByOp: Object.fromEntries(Object.entries(dmgRef.current).map(([k, v]) => [k, Math.round(v)])), actions: [...actionsRef.current] }; // 학습용 전투 기록(오퍼별 딜 분배 + 행동 사이클 포함)
      onEnd(winner, su, stats);
    }, 1500);
    return () => clearTimeout(t);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [winner]);

  // 단일 대상 스킬? (자기/전체/열 대상 제외)
  // 조준이 필요한 스킬 — 자신/전체를 뺀 전부. 범위(row)도 **조준한 적이 범위 중심**이 되므로 조준시킨다.
  const isSingleTarget = (sk: DDSkill) => sk.target !== "self" && sk.target !== "all";
  // 대상 지정 시 조건 재검사 — usable()은 pickTargets[0](기본 대상)로만 판정하므로,
  // 플레이어가 다른 적을 찍으면 조건이 안 맞는 적에게도 발동해 버린다(연계 게이트 무력화).
  function usableOn(sk: DDSkill, u: DDUnit, targetId: string): boolean {
    const s = stateRef.current!;
    const prev = s.forcedTargetId;
    s.forcedTargetId = targetId;
    const ok = usable(s, u, sk);
    s.forcedTargetId = prev;
    return ok;
  }
  function chooseSkill(sk: DDSkill) {
    const foes = stateRef.current!.units.filter((u) => u.side === "enemy" && u.hp > 0);
    if (isSingleTarget(sk) && foes.length > 1) setAiming(sk); // 대상 여러 → 선택 모드
    else playerAct(sk); // 자동 대상(단일 적/광역/자기)
  }
  function playerAct(sk: DDSkill, targetId?: string) {
    const s = stateRef.current!; if (!current) return;
    const actor = current;
    if (targetId && !usableOn(sk, actor, targetId)) return; // 그 적에겐 조건 미충족 — 발동하지 않는다
    s.forcedTargetId = targetId; // 플레이어 지정 대상(단일 스킬)
    actionsRef.current.push({ r: s.round, u: actor.id, k: sk.kind, s: sk.id });
    doAction(actor, () => act(s, actor, sk), sk.name);
    s.forcedTargetId = undefined;
    setCurrent(null); setAiming(null);
    // 연계 콤보 — 이 행동으로 조건이 열린 아군 연계가 있으면 아이콘을 띄우고 플레이어 발동 대기(step 보류)
    const nx = findLinkChain(s, actor);
    if (nx) { setLinkCombo({ unitId: nx.unit.id, skill: nx.skill }); setViewId(null); bump(); return; }
    afterAction();
    timerRef.current = setTimeout(step, delay());
  }
  // 연계 콤보 발동 — 아이콘 클릭 시. 발동 후 또 조건이 열리면 체인으로 다음 콤보 아이콘.
  function fireLink() {
    const s = stateRef.current!; const lc = linkCombo; if (!lc) return;
    setLinkCombo(null);
    const u = s.units.find((x) => x.id === lc.unitId);
    // 자동 모드에선 act()가 예약하며 chainStep을 달아 주지만, 수동은 플레이어가 직접 쏘므로
    // 여기서 달아야 한다. 없으면 s.chain이 1로 남아 "새 연쇄"로 취급돼 누적 피해가 초기화된다.
    if (u) u.chainStep = Math.min(CHAIN_MAX, (s.chain ?? 1) + 1);
    if (u && u.hp > 0 && usable(s, u, lc.skill)) { actionsRef.current.push({ r: s.round, u: u.id, k: "link", s: lc.skill.id }); doAction(u, () => act(s, u, lc.skill), lc.skill.name); }
    const nx = u ? findLinkChain(s, u) : null;
    if (nx) { setLinkCombo({ unitId: nx.unit.id, skill: nx.skill }); setViewId(null); bump(); return; }
    afterAction();
    timerRef.current = setTimeout(step, delay());
  }
  function skipLink() { setLinkCombo(null); afterAction(); timerRef.current = setTimeout(step, delay()); }
  const itemUsedThisTurn = !!current && itemTurnRef.current === current.id; // 이번 턴 아이템 사용 여부
  // 자유 행동 궁 — 원작처럼 다른 오퍼 턴에도 발동한다(턴 미소모).
  function playerFireUlt(unitId: string) {
    const s = stateRef.current!; if (!current) return;
    const u = s.units.find((x) => x.id === unitId); if (!u || u.hp <= 0) return;
    const sk = (SKILLS[u.id] ?? []).find((k) => k.kind === "ult"); if (!sk || !usable(s, u, sk)) return;
    actionsRef.current.push({ r: s.round, u: u.id, k: "ult", s: sk.id, a: 1 });
    const before = new Map(s.units.map((x) => [x.id, x.hp]));
    act(s, u, sk);
    const floaters: Floater[] = [];
    for (const x of s.units) { const d = x.hp - (before.get(x.id) ?? x.hp); if (d !== 0) floaters.push({ id: x.id, amt: d, crit: false, tone: d > 0 ? "#8fd36a" : "#ffb257" }); }
    fxTick.current += 1; mergeFx({ tick: fxTick.current, activeId: u.id, actingSide: "ally", floaters, cast: { id: u.id, text: skillLabel(u, sk) } }); bump();
  }
  function playerUseItem(id: string) {
    const s = stateRef.current!; if (!current || !items[id] || !canUseItem(s, id)) return;
    if (itemTurnRef.current === current.id) return; // 한 턴 1개
    itemTurnRef.current = current.id;
    actionsRef.current.push({ r: s.round, u: current.id, k: "item", s: id });
    const before = new Map(s.units.map((u) => [u.id, u.hp]));
    applyItem(s, id, current); onUseItem(id);
    const floaters: Floater[] = [];
    for (const u of s.units) { const d = u.hp - (before.get(u.id) ?? u.hp); if (d !== 0) floaters.push({ id: u.id, amt: d, crit: false, tone: "#8fd36a" }); }
    fxTick.current += 1; mergeFx({ tick: fxTick.current, activeId: current.id, actingSide: "ally", floaters, cast: { id: current.id, text: ITEMS[id]?.name ?? "아이템" } }); bump();
  }
  function toggleAuto() { const n = !autoRef.current; autoRef.current = n; if (stateRef.current) stateRef.current.manualLink = !n; setAuto(n); if (n && linkCombo) { setLinkCombo(null); afterAction(); } if (n && (current || linkCombo)) { setCurrent(null); timerRef.current = setTimeout(step, 200); } } // 자동 시 연계도 자동 발동(manualLink=false)
  function cycleSpeed() { const n = speedRef.current >= 3 ? 1 : speedRef.current + 1; speedRef.current = n; setSpeed(n); }
  function setSpeedTo(n: number) { speedRef.current = n; setSpeed(n); }

  const s = stateRef.current!;
  const allies = s.units.filter((u) => u.side === "ally");
  // 피격 확률(무지향 적 기준) — 생존 아군의 직군 어그로 가중. 아군이 쓰러지면 남은 인원으로 재분배된다.
  const aggroShare = (() => { const liv = allies.filter((x) => x.hp > 0); const shr = aggroShares(liv.map((y) => y.cls)); return new Map(liv.map((x, i) => [x.id, shr[i]])); })();
  const enemies = s.units.filter((u) => u.side === "enemy");
  const KIND_ORDER: Record<DDSkill["kind"], number> = { attack: 0, battle: 1, link: 2, ult: 3 };
  // 스킬 패널 대상 — 대기 아군 미리보기(viewId)가 있으면 그쪽, 없으면 수동 조작 중인 현재 오퍼.
  // 자기 턴이 아닌 오퍼는 잠금(locked) — 스킬·연계 쿨타임은 보이되 사용은 불가.
  const viewUnit = viewId ? allies.find((x) => x.id === viewId && x.hp > 0) ?? null : null;
  const liveOn = !winner && !!current && !auto;
  const pu = viewUnit ?? (liveOn ? current : null);
  const locked = !!pu && !(liveOn && pu.id === current!.id);
  // 카뮤 「추적」은 궁 후 배틀 슬롯을 교체(원작) — 추적 상태면 사르는 불꽃 대신 추적만 노출(배틀 1칸 유지)
  const camuChasing = pu?.id === "camu" && (pu.timers?.chase ?? 0) > 0;
  const skills = pu ? [...(SKILLS[pu.id] ?? []), BASIC]
    .filter((sk) => pu.id !== "camu" || (sk.id === "camu-b" ? !camuChasing : sk.id === "camu-chase" ? camuChasing : true))
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]) : []; // 4종(불가 포함), 카뮤 배틀은 상태별 1칸 교체
  const upcoming = winner ? [] : turnOrder(s, 6); // ATB 예측 순서(비파괴)

  return (
    <div className="dd-battle relative mx-auto max-w-[1640px] px-3 py-4 sm:px-5">
      {/* 모바일 조준 바 — 스킬 선택 후 적(상단)까지 스크롤하지 않고 하단에서 바로 타겟. 데스크톱은 적 아트 클릭이라 불필요(lg:hidden) */}
      {mounted && aiming && current && createPortal(
        <div className="fixed inset-x-0 bottom-0 z-[90] border-t-2 border-ef-accent/60 bg-black/95 px-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
          <div className="mb-2 flex items-center gap-2">
            <span className="min-w-0 truncate font-mono text-[13px] font-bold text-ef-accent-soft">🎯 {aiming.name} — 공격할 적 선택</span>
            <button type="button" onClick={() => setAiming(null)} className="ml-auto shrink-0 border border-ef-line px-2.5 py-1 font-mono text-[13px] font-bold text-ef-muted active:scale-95">취소</button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {enemies.filter((e) => e.hp > 0).map((e) => {
              const ok = usableOn(aiming, current, e.id);
              return (
                <button key={e.id} type="button" disabled={!ok} onClick={() => { if (ok) playerAct(aiming, e.id); }}
                  className={`dd-cut flex w-[130px] shrink-0 flex-col gap-1 border px-2 py-1.5 text-left transition ${ok ? "border-ef-accent/70 bg-ef-accent/10 active:scale-95" : "cursor-not-allowed border-ef-line/40 opacity-45"}`}>
                  <span className="flex items-center gap-1">
                    <span className="min-w-0 truncate font-mono text-[12px] font-bold text-white">{e.name}</span>
                    <span className="ml-auto shrink-0 text-[13px]">{ok ? "🎯" : "🚫"}</span>
                  </span>
                  <Bar value={e.hp} max={e.maxHp} color="#e0655c" h="h-1" />
                  <span className="font-mono text-[10px] tabular-nums text-ef-muted"><span className="font-bold text-white/90">{Math.max(0, e.hp)}</span>/{e.maxHp}</span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
      {/* 행동 순서 — 속도 기반 턴 오더(이름·연결선·아군/적 색·현재 강조) */}
      {!winner && upcoming.length > 0 && (
        <div className="absolute left-1.5 top-[118px] z-30 sm:left-2">
          <div className="mb-1.5 flex items-center gap-1 font-mono text-[14px] font-bold uppercase tracking-[0.22em] text-ef-accent/80">⏱ 속도 순서</div>
          <div className="relative flex flex-col gap-1 rounded bg-black/35 p-1 backdrop-blur-[1px] sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            {/* 흐름 연결선 */}
            <span className="pointer-events-none absolute bottom-4 left-[17px] top-4 w-0.5 bg-gradient-to-b from-ef-accent/60 via-ef-line to-transparent" />
            {(current && upcoming[0] !== current ? [current, ...upcoming] : upcoming).slice(0, 6).map((u, i) => {
              const ally = u.side === "ally";
              const nm = ally ? OPERATORS.find((o) => o.id === u.id)?.name ?? u.id : u.name;
              const el = ally ? (OPERATORS.find((o) => o.id === u.id)?.element ?? "physical") : (enemyDefFor(u.id)?.element ?? "physical");
              const tone = ally ? elementColor[el] : "#e0655c";
              const now = i === 0;
              const r = Math.max(0, Math.min(1, u.hp / u.maxHp));
              return (
                <div key={`${u.id}-${i}`} className="relative flex items-center gap-2" style={{ opacity: now ? 1 : Math.max(0.5, 1 - i * 0.11) }}>
                  <span className={`relative z-10 shrink-0 overflow-hidden border-2 transition-all ${now ? "h-12 w-12" : "h-10 w-10"}`} style={{ borderColor: now ? "#ffbe6b" : tone, background: ally ? `center/cover url(${avatarUrl(u.id)})` : `50% 20%/cover no-repeat url(${enemyImage(u.id)}), radial-gradient(circle at 50% 35%, ${tone}66, #2a1210 75%)`, boxShadow: now ? `0 0 12px ${tone}, 0 0 0 2px #ffbe6b` : `0 0 0 1px ${tone}55` }}>
                    {!ally && <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(20,10,8,0.55))" }} />}
                    <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: `linear-gradient(90deg, ${r < 0.35 ? "#e0655c" : ally ? "#8fb84a" : "#e0655c"} ${r * 100}%, rgba(0,0,0,0.85) ${r * 100}%)` }} />
                  </span>
                  <span className={`dd-cut hidden items-center gap-1 border px-2 py-1 font-mono leading-none sm:flex ${now ? "text-[16px] font-black" : "text-sm font-bold"}`} style={{ borderColor: now ? "#ffbe6b99" : `${tone}44`, background: now ? "linear-gradient(90deg, rgba(255,190,107,0.2), rgba(13,9,6,0.6))" : "rgba(13,9,6,0.8)", color: now ? "#ffdf9e" : ally ? "#e6e6e8" : "#f0a8a0" }}>
                    {now ? <span className="text-ef-accent">▶ 지금</span> : nm}
                    {!now && <span className="text-[12px] text-ef-muted">{ally ? "" : "·적"}</span>}
                  </span>
                  {now && <span className="hidden font-mono text-sm font-bold text-white/90 sm:inline">{nm}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* 상단 헤더 — 밖(메뉴) 화면과 통일: Darkest Protocol · 부제 / 큰 제목 + 라운드, 그 아래 게이지, 우측 컨트롤 */}
      <div className="hud-panel dd-cut mb-3 px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
          <div className="min-w-0">
            <p className="font-mono text-[13px] font-bold uppercase tracking-[0.32em] text-ef-accent/70">Darkest Protocol · 던전 교전</p>
            <h2 className="font-mono text-xl font-black uppercase leading-tight tracking-[0.1em]" style={{ color: nodeKind === "boss" ? "#f0776e" : "#f4e9d2" }}>{nodeTitle[nodeKind]}<span className="ml-2 text-ef-accent">R{s.round}</span></h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* 교전 중 지도 — 남은 구역을 보고 소비템·게이지를 아낄지 정한다(진입은 불가) */}
            {onShowMap && <button type="button" onClick={onShowMap} className="hud-btn dd-cut px-3 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider text-ef-muted" title="이번 층 지도 — 남은 구역 확인(경로 변경 불가)">🗺 지도</button>}
            <button type="button" onClick={() => setShowHelp((v) => !v)} className={`hud-btn dd-cut px-3 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider ${showHelp ? "text-ef-accent" : "text-ef-muted"}`} title="전투 용어 설명">❔ 용어</button>
            <button type="button" onClick={() => setShowLog((v) => !v)} className={`hud-btn dd-cut px-3 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider ${showLog ? "hud-btn-on" : "text-ef-muted"}`} title="데미지·전투 기록">기록 {showLog ? "▴" : "▾"}</button>
            {!winner && <button type="button" onClick={cycleSpeed} className="hud-btn dd-cut px-3 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider text-ef-muted" title="재생 속도">{speed}배속</button>}
            {!winner && <button type="button" onClick={toggleAuto} className={`hud-btn dd-cut px-3.5 py-1.5 font-mono text-[15px] font-bold uppercase tracking-wider ${auto ? "hud-btn-on" : "text-ef-muted"}`}>{auto ? "자동 ON" : "수동"}</button>}
          </div>
        </div>

      </div>

      {/* 데미지·전투 기록 — 상단 드롭다운(기본 접힘) */}
      {showHelp && (
        <div className="flex items-start justify-center p-4 sm:p-8" style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} onClick={() => setShowHelp(false)}>
        <div onClick={(e) => e.stopPropagation()} className="hud-panel dd-cut mt-14 grid w-full max-w-[820px] gap-x-6 gap-y-1.5 p-4 font-mono text-[13px] leading-snug sm:grid-cols-2" style={{ borderColor: "rgba(103,232,249,0.55)", boxShadow: "0 0 50px -12px rgba(103,232,249,0.4)" }}>
          <div className="sm:col-span-2 mb-1 flex items-center justify-between"><span className="font-mono text-[15px] font-bold uppercase tracking-wider text-ef-accent-soft">❔ 전투 용어</span><button type="button" onClick={() => setShowHelp(false)} className="hud-btn dd-cut px-2 py-0.5 font-mono text-[13px] text-ef-muted hover:text-white">닫기</button></div>
          <div className="sm:col-span-2 mb-1 border-l-2 border-ef-accent/60 bg-ef-accent/[0.06] px-3 py-2">
            <div className="mb-1 font-mono text-[13px] font-bold text-ef-accent-soft">🎮 전투 흐름 — 처음이라면 여기부터</div>
            <div className="text-ef-muted"><b className="text-white/85">① 속도 순서</b>대로 행동한다(좌측 순서표). <b className="text-white/85">② 내 턴</b>에 스킬을 고른다 — <span className="text-[#a1a1aa]">일반</span>·<span className="text-ef-accent-soft">배틀</span>·<span className="text-[#67e8f9]">연계</span>·<span className="text-[#facc15]">궁</span>. <b className="text-white/85">③ 단일 스킬</b>은 이어서 <b className="text-white/85">공격할 적</b>을 고른다. <b className="text-white/85">④ 불균형</b>을 채우면 적이 무력화되고 받는 피해가 커진다.</div>
          </div>
          <div><b className="text-[#f5c542]">팀 게이지</b> <span className="text-ef-muted">— 파티 4명이 함께 쓰는 자원. 배틀 스킬 1회에 100 소모. 일반 공격으로 조금씩 회복하고 아군 오퍼 턴마다 +12.</span></div>
          <div><b className="text-[#f5c542]">궁 에너지</b> <span className="text-ef-muted">— 오퍼별 개인 자원. <b className="text-white/80">배틀·연계로만</b> 찬다. 일반 공격으로는 안 오른다.</span></div>
          <div><b className="text-[#a16207]">불균형</b> <span className="text-ef-muted">— 적 HP 아래 노란 바. 가득 차면 적이 행동 불가가 되고 받는 피해가 30% 오른다. 스킬마다 붙은 「불균형 +N」으로 쌓는다.</span></div>
          <div><b className="text-[#67e8f9]">부착</b> <span className="text-ef-muted">— 적에게 묻은 속성(열기·전기·냉기·자연). 연계 스킬 상당수가 이걸 조건으로 삼고, 소모하면 큰 효과가 터진다.</span></div>
          <div><b className="text-[#67e8f9]">연계</b> <span className="text-ef-muted">— 조건이 열리면 아이콘이 뜨고, 누르면 그 오퍼가 <b className="text-white/80">추가 턴</b>으로 끼어든다. 조건이 겹치면 편성 왼쪽부터.</span></div>
          <div><b className="text-[#a3e635]">이월 ⤴</b> <span className="text-ef-muted">— 궁 에너지와 레바테인 「녹아내린 불꽃」은 다음 교전으로 넘어간다. 청뢰검·아이스 슈터·삼형 자세는 전투가 끝나면 사라진다.</span></div>
          <div><b className="text-[#ff8a76]">피격 확률</b> <span className="text-ef-muted">— 적은 위치가 아니라 직군을 보고 문다. 디펜더·뱅가드가 더 자주 맞는다.</span></div>
        </div>
        </div>
      )}
      {showLog && (() => {
        const dmgList = allies.map((a) => ({ id: a.id, name: OPERATORS.find((o) => o.id === a.id)?.name ?? a.id, dmg: Math.round(dmgRef.current[a.id] ?? 0), el: unitElement(a) })).sort((x, y) => y.dmg - x.dmg);
        const dmgMax = Math.max(1, ...dmgList.map((d) => d.dmg));
        const dmgTotal = Math.max(1, dmgList.reduce((sum, d) => sum + d.dmg, 0));
        return (
          <div className="absolute right-3 top-[62px] z-40 w-[440px] max-w-[calc(100%-1.5rem)] sm:right-5">
            <div className="hud-panel dd-cut shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-ef-line px-2.5 py-1.5">
                {(["dmg", "log"] as const).map((k) => <button key={k} type="button" onClick={() => setTab(k)} className={`dd-cut px-2.5 py-1 font-mono text-[14px] font-bold uppercase tracking-wider transition ${tab === k ? "border border-ef-accent/70 bg-ef-accent/15 text-ef-accent" : "border border-ef-line text-ef-muted hover:text-ef-ink"}`}>{k === "dmg" ? "데미지 기록" : "전투 기록"}</button>)}
                <button type="button" onClick={() => setShowLog(false)} className="ml-auto border border-ef-line px-2 py-1 font-mono text-[14px] font-bold text-ef-muted transition hover:border-ef-accent/60 hover:text-white">✕ 닫기</button>
              </div>
              {tab === "dmg" && (
                <div className="flex flex-col gap-2 px-3 py-3">
                  {dmgList.map((d, i) => (
                    <div key={d.id} className="flex items-center gap-2.5">
                      <span className="w-5 shrink-0 text-right font-mono text-sm font-black" style={{ color: i === 0 ? "#ffbe6b" : "#85858e" }}>{i + 1}</span>
                      <img src={avatarUrl(d.id)} alt="" loading="lazy" className="h-8 w-8 shrink-0 border object-cover" style={{ background: "#000", borderColor: i === 0 ? "#ffbe6b88" : "#262629" }} />
                      <span className="w-24 shrink-0 truncate font-mono text-sm font-bold" style={{ color: i === 0 ? "#fff" : "#e8e8ea" }}>{d.name}</span>
                      <div className="relative h-6 flex-1 overflow-hidden border border-ef-line bg-black/50">
                        <div className="h-full transition-all duration-300" style={{ width: `${(d.dmg / dmgMax) * 100}%`, background: `linear-gradient(90deg, ${elementColor[d.el]}cc, ${elementColor[d.el]})` }} />
                        <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[14px] font-bold tabular-nums text-white" style={{ textShadow: "0 1px 3px #000" }}>{Math.round((d.dmg / dmgTotal) * 100)}%</span>
                      </div>
                      <span className="w-24 shrink-0 text-right font-mono text-[17px] font-bold tabular-nums text-ef-ink">{d.dmg.toLocaleString()}</span>
                    </div>
                  ))}
                  {dmgTotal <= 1 && <div className="py-3 text-center font-mono text-[15px] text-ef-muted">아직 가한 피해 없음</div>}
                </div>
              )}
              {tab === "log" && (
                <div className="flex max-h-[42vh] flex-col-reverse gap-0.5 overflow-y-auto px-3 py-2 font-mono text-[15px] leading-relaxed">
                  {[...s.log].slice(-160).reverse().map((line, i) => (
                    <div key={s.log.length - i} className={line.startsWith("──") ? "mt-1 font-bold text-ef-accent" : line.includes("불균형 상태") || line.includes("승리") ? "text-yellow-300" : line.includes("→") && !line.startsWith("  ") ? "text-white" : line.includes("✗") ? "text-red-300" : "text-ef-muted"}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 라운드 배너 */}
      {chipInfo && (
        <>
          {/* 바깥 클릭으로 닫기 */}
          <div className="fixed inset-0 z-[60]" onClick={() => setChipInfo(null)} />
          <div className="fixed z-[61] w-[300px] border border-ef-accent/70 bg-black/95 p-3"
               style={{ left: Math.min(Math.max(12, chipInfo.x - 150), (typeof window !== "undefined" ? window.innerWidth : 1600) - 312), top: chipInfo.y + 8, boxShadow: "0 8px 28px rgba(0,0,0,0.85)", ...CUT_SM }}>
            <div className="mb-1.5 flex items-center gap-1.5">
              {chipInfo.c.icon && <img src={chipInfo.c.icon} alt="" className="h-5 w-5 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
              <span className="font-mono text-[15px] font-black" style={{ color: chipInfo.c.tone }}>{chipInfo.c.label}</span>
              <span className="ml-auto font-mono text-[11px] text-ef-muted">{chipInfo.c.dir > 0 ? "▲ 이로운 효과" : chipInfo.c.dir < 0 ? "▼ 해로운 효과" : "· 중립"}</span>
            </div>
            <p className="font-mono text-[13px] leading-relaxed text-white/85">{CHIP_DESC[chipInfo.c.k] ?? "설명이 등록되지 않은 효과입니다."}</p>
            {(chipInfo.c.src || chipInfo.c.turns) && (
              <div className="mt-2 border-t border-white/10 pt-1.5 font-mono text-[12px] text-ef-muted">
                {chipInfo.c.src && <div>출처 · {SRC_KIND_KO[chipInfo.c.src.kind] ?? ""} {chipInfo.c.src.by}「{chipInfo.c.src.via}」</div>}
                {chipInfo.c.turns ? <div>남은 지속 · {chipInfo.c.turns}턴</div> : null}
              </div>
            )}
            <button type="button" onClick={() => setChipInfo(null)} className="mt-2 w-full border border-white/20 py-1 font-mono text-[12px] text-white/70 hover:bg-white/10">닫기</button>
          </div>
        </>
      )}
      {chain && !winner && (
        <div key={`ch-${chain.tick}`} className="dd-chain pointer-events-none absolute right-6 top-[188px] z-40 flex justify-end">
          <div className="flex items-center gap-2.5 border border-ef-accent bg-black/95 px-3.5 py-1.5" style={{ boxShadow: "0 0 24px rgba(255,154,47,0.55), inset 0 0 0 1px rgba(255,214,140,0.35)" }}>
            <span className="font-mono text-[17px] font-black text-ef-accent" style={{ textShadow: "0 0 10px rgba(255,154,47,0.9)" }}>⛓ {chain.n}연쇄</span>
            <span className="font-mono text-[12px] font-bold text-white/85">{chain.names.join(" → ")}</span>
          </div>
        </div>
      )}
      {roundBanner && !winner && (
        <div key={roundBanner.tick} className="dd-round pointer-events-none absolute inset-x-0 top-24 z-40 text-center" style={{ fontFamily: "var(--dd-display)", fontSize: "2.4rem", fontWeight: 800, letterSpacing: "0.28em", color: "#e8c56a", textShadow: "0 3px 16px rgba(0,0,0,0.9)" }}>라운드 {roundBanner.n}</div>
      )}

      {winner && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 dd-frame px-4 py-3" style={{ ...CUT_SM, borderColor: winner === "ally" ? "#ff9a2f66" : "#b3312a66" }}>
          <span className="text-2xl" style={{ fontFamily: "var(--dd-display)", letterSpacing: "0.16em", color: winner === "ally" ? "#e8c56a" : "#c23b32", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{winner === "ally" ? (nodeKind === "boss" ? "던전 클리어" : "교전 승리") : "부대 전멸"}</span>
          <span className="font-mono text-[14px] text-ef-muted">{winner === "ally" ? "전리품 정산 중…" : "잠시 후…"}</span>
          {/* 승리 시 무엇이 다음 교전으로 넘어가는지 — 궁을 못 쓰고 끝나면 준비 구간이 낭비처럼 느껴진다 */}
          {winner === "ally" && (() => {
            const al = (stateRef.current?.units ?? []).filter((u) => u.side === "ally" && u.hp > 0);
            const ult = al.filter((u) => u.ultCharge > 0);
            const stk = al.filter((u) => STACK_CARRY.has(u.id) && (u.procCount ?? 0) > 0);
            if (!ult.length && !stk.length) return null;
            return (
              <span className="mt-1 font-mono text-[13px]" style={{ color: "#a3e635" }}>
                ⤴ 다음 교전으로 이월 —{" "}
                {ult.map((u) => `${u.name} 궁 ${Math.round(u.ultCharge)}/${u.ultCost}`).join(" · ")}
                {ult.length > 0 && stk.length > 0 ? " · " : ""}
                {stk.map((u) => `${u.name} 스택 ${u.procCount}`).join(" · ")}
              </span>
            );
          })()}
        </div>
      )}

      {/* ===== 전장 ===== */}
      <div className="hud-stage relative flex min-h-[56vh] flex-col justify-center gap-2 overflow-hidden border border-ef-line px-3 py-6 sm:px-6" style={{ ...CUT_SM, boxShadow: "inset 0 0 80px -20px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
        {/* ===== 적진 (스테이지 상단, 서 있는 피규어) ===== */}
        <div className="mb-1 mt-7 flex items-center gap-2 pl-14 font-mono text-[14px] font-bold uppercase tracking-[0.2em] text-red-300/70 sm:mt-0 sm:pl-0"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/25" />적 {enemies.filter((e) => e.hp > 0).length}/{enemies.length}<span className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/25" /></div>
        <div className="flex flex-wrap items-end justify-center gap-x-1.5 gap-y-2 pl-12 sm:gap-x-4 sm:pl-0">
          {enemies.map((e) => {
            const ed = enemyDefFor(e.id);
            const el = ed?.element ?? "physical";
            const dead = e.hp <= 0;
            const hit = fx.floaters.some((f) => f.id === e.id && f.amt < 0);
            const isAct = fx.activeId === e.id;
            return (
              <div key={e.id} className={`group relative flex w-[110px] flex-col items-center sm:w-[190px] ${shakeCls(hit, fx.tick)} ${actCls(isAct, fx.tick)}`}>
                <FxLayer id={e.id} fx={fx} />
                {/* hover 팝오버 — 뉴비가 클릭 없이 적의 저항·특징 파악(마우스 오버) */}
                {!dead && (ed?.traits?.length || (ed?.resist && Object.values(ed.resist).some((v) => v !== 0))) && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1 w-60 -translate-x-1/2 border border-ef-line bg-black/95 p-2.5 text-left opacity-0 shadow-[0_6px_20px_rgba(0,0,0,0.8)] transition-opacity duration-150 group-hover:opacity-100" style={CUT_SM}>
                    <div className="mb-1.5 font-mono text-[14px] font-bold text-white">{e.name}</div>
                    {ed?.resist && Object.values(ed.resist).some((v) => v !== 0) && (
                      <div className="mb-1.5 flex flex-wrap gap-1">
                        {(Object.entries(ed.resist) as [Element | "physical", number][]).filter(([, v]) => v !== 0).sort((a, b) => a[1] - b[1]).map(([eln, v]) => (
                          <span key={eln} className="border px-1 py-px font-mono text-[11px]" style={{ color: v < 0 ? "#8fd36a" : "#e0655c", borderColor: (v < 0 ? "#8fd36a" : "#e0655c") + "55" }}>{elementName[eln]} {v < 0 ? "약점" : "저항"} {Math.round(Math.abs(v) * 100)}%</span>
                        ))}
                      </div>
                    )}
                    {ed?.traits?.map((t, i) => <div key={i} className="font-mono text-[12px] leading-snug text-ef-muted">◆ {t}</div>)}
                  </div>
                )}
                {aiming && !dead && (usableOn(aiming, current!, e.id)
                  ? <span className="absolute -top-1 z-20 font-mono text-[13px] font-bold text-ef-accent" style={{ textShadow: "0 0 6px #000" }}>🎯 대상</span>
                  : <span className="absolute -top-1 z-20 font-mono text-[13px] font-bold text-red-400/90" style={{ textShadow: "0 0 6px #000" }}>🚫 조건 미충족</span>)}
                {/* 아트(접지 그림자·선택 링) */}
                <div onClick={aiming && !dead ? () => { if (usableOn(aiming, current!, e.id)) playerAct(aiming, e.id); } : () => setInspectId(e.id)} className={`relative flex w-full cursor-pointer items-end justify-center ${enemies.length <= 2 ? "h-28 sm:h-48" : enemies.length === 3 ? "h-24 sm:h-40" : "h-20 sm:h-32"}`}>
                  <span className="pointer-events-none absolute bottom-1 h-2.5 w-24 rounded-[50%]" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.6), transparent)" }} />
                  {isAct && !dead && <span className="pointer-events-none absolute bottom-0 h-6 w-28 rounded-[50%]" style={{ background: `radial-gradient(50% 50% at 50% 50%, ${elementColor[el]}66, transparent 70%)` }} />}
                  <img src={enemyImage(e.id)} alt="" loading="lazy" className={`relative max-h-full w-auto object-contain transition group-hover:scale-[1.03] ${dead ? "opacity-30 grayscale" : ""}`} style={{ filter: dead ? undefined : aiming ? "drop-shadow(0 3px 10px rgba(255,154,47,0.7))" : e.staggered ? "drop-shadow(0 3px 10px rgba(250,204,21,0.6))" : "drop-shadow(0 6px 12px rgba(0,0,0,0.6))" }} onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
                  {dead && <span className="absolute text-4xl">💀</span>}
                </div>
                {/* 정보 */}
                <div className="w-full">
                  <div className="flex min-h-[2.1em] min-w-0 items-start gap-1"><span className="mt-[5px] h-1.5 w-1.5 shrink-0" style={{ background: elementColor[el] }} /><span className="line-clamp-2 font-mono text-[13px] font-bold leading-tight tracking-tight text-white sm:text-[14px]" style={{ textShadow: "0 1px 3px #000" }} title={e.name}>{e.name}</span></div>
                  <div className="flex items-center gap-1"><span className="text-[9px] leading-none text-[#e0655c]/70" title={`누적 피해 ${(takenRef.current[e.id] ?? 0).toLocaleString()}`}>HP</span><div className="flex-1"><Bar value={e.hp} max={e.maxHp} color="#e0655c" ghost /></div>{(takenRef.current[e.id] ?? 0) > 0 && !dead && <span className="ml-1 shrink-0 font-mono text-[10px] font-bold tabular-nums text-[#ff8a6a]/85" title="이 적에게 누적으로 넣은 피해">▼{(takenRef.current[e.id] ?? 0).toLocaleString()}</span>}<span className="shrink-0 font-mono text-[11px] tabular-nums text-ef-muted"><span className="font-bold text-white/90">{Math.max(0, e.hp)}</span>/{e.maxHp}</span></div>
                  {e.staggerMax > 0 && !dead && <div className="mt-0.5 flex items-center gap-1"><span className="text-[9px] leading-none text-[#a16207]/80" title="불균형: 가득 차면 행동 불가 + 받는 피해 증가">불균형</span><div className="relative flex-1"><Bar value={e.staggered ? e.staggerMax : e.stagger} max={e.staggerMax} color={e.staggered ? "#facc15" : "#a16207"} h="h-1" />{e.poiseKnot && !e.poiseBroken && <span className="pointer-events-none absolute top-[-1px] h-[calc(100%+2px)] w-px bg-white/70" style={{ left: "50%" }} title="불균형 지점 — 넘으면 잠시 중단" />}</div></div>}
                  {!dead && <div className="mt-0.5"><Bar value={e.atb} max={100} color="#67e8f9" h="h-1" /></div>}
                  {!dead && <div className="flex flex-wrap content-start gap-1 overflow-hidden min-h-[22px] max-h-[46px] mt-1">
                    {/* 약점 칩은 뺐다 — 전투 내내 안 변하는 정적 정보라 호버 팝오버에 이미 있고, 동적 버프/디버프 자리를 잡아먹었다 */}
                    {e.staggered && <Chip compact tone="#facc15" title="불균형 — 행동 불가 + 받는 피해 +30%">⚡불균형</Chip>}
                    {(e.charging ?? 0) > 0 && <Chip compact tone="#f0776e" title="차징! 다음 턴 강력 공격 — 불균형시키면 차단">⚡차징</Chip>}
                    {unitChips(e).map((c) => <Chip key={c.k} compact tone={c.tone} title={chipTitle(c)} icon={c.icon} onPick={(r) => setChipInfo({ c, x: r.left + r.width / 2, y: r.bottom })}>{chipShort(c)}</Chip>)}
                  </div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 교전선 */}
        <div className="my-3 flex items-center justify-center gap-3"><span className="hud-horizon w-1/3" /><span className="font-mono text-[13px] uppercase tracking-[0.45em] text-ef-accent/70">교전</span><span className="hud-horizon w-1/3" /></div>

        {/* ===== 아군진 (스테이지 하단, 전신 피규어) ===== */}
        <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-3 sm:gap-x-4">
          {allies.map((a) => {
            const op = OPERATORS.find((o) => o.id === a.id);
            const el = op?.element ?? "physical";
            const dead = a.hp <= 0;
            const chips = unitChips(a); // 유닛당 1회만 — 조건·map 두 번 호출하던 것 통합(배틀 루프 매 틱 리렌더)
            const lowHp = a.hp / a.maxHp < 0.35;
            const hit = fx.floaters.some((f) => f.id === a.id && f.amt < 0);
            const isAct = fx.activeId === a.id;
            const isCur = current?.id === a.id;
            const sets = activeSets(party.find((p) => p.id === a.id)?.loadout ?? {});
            const ready = a.ultCharge >= a.ultCost;
            return (
              <div key={a.id} className={`group relative flex w-[calc(50%-0.5rem)] max-w-[208px] flex-col items-center sm:w-[208px] ${shakeCls(hit, fx.tick)} ${actCls(isAct, fx.tick)}`}>
                <FxLayer id={a.id} fx={fx} />
                {/* 상반신 아트 — 전신은 208px 폭에서 너무 작아 보인다: cover+top 크롭으로 얼굴·상체를 크게 */}
                <div onClick={() => { if (dead) { setInspectId(a.id); setInspectTab("skill"); } else { setAiming(null); setViewId(viewId === a.id ? null : a.id); } }} className="relative h-36 w-full cursor-pointer overflow-hidden border transition" style={{ ...CUT_SM, borderColor: isCur && !dead ? `${elementColor[el]}cc` : "rgba(255,255,255,0.09)", boxShadow: isCur && !dead ? `0 0 20px -5px ${elementColor[el]}aa` : undefined, background: `radial-gradient(90% 55% at 50% 0%, ${elementColor[el]}1e, transparent 70%), #0b0a08` }}>
                  <img src={bustUrl(a.id)} alt="" loading="lazy" className={`h-full w-full object-cover transition group-hover:brightness-110 ${dead ? "opacity-35 grayscale" : ""}`} style={{ objectPosition: OP_BUST_POS[a.id] ?? "50% 50%" }} onError={(ev) => { (ev.currentTarget as HTMLImageElement).src = fullUrl(a.id); }} />
                  {/* 하단 그라데이션 — 크롭 절단면을 정보 타일로 자연스럽게 연결 */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/70 to-transparent" />
                  {dead && <span className="absolute inset-0 flex items-center justify-center text-5xl">💀</span>}
                  {isCur && !dead && <span className="absolute -top-1 z-10 font-mono text-[14px] font-black uppercase tracking-wider text-ef-accent" style={{ textShadow: "0 0 8px #000, 0 0 4px #000" }}>▶ 행동</span>}
                  {/* 피격 확률 — 편성 화면과 같은 지표를 전투 중에도. 생존 인원 기준 실시간 재분배 */}
                  {!dead && <span title="피격 확률 — 무지향 적이 이 오퍼를 노릴 확률(직군 어그로 가중). 아군이 쓰러지면 남은 인원에게 재분배됩니다. 저체력 우선·최고 위협 우선 적은 예외." className="absolute right-0.5 top-0.5 z-10 cursor-help border border-red-300/35 bg-black/75 px-1 py-px font-mono text-[11px] font-bold text-red-300/90">피격 {Math.round((aggroShare.get(a.id) ?? 0) * 100)}%</span>}
                </div>
                {/* 정보 패널 — 라벨 정렬·값 오버레이로 깔끔하게 */}
                <div className="hud-tile dd-cut w-full px-2.5 py-2" style={isCur ? { borderColor: `${PRIMARY}aa`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 -5px 16px -9px ${PRIMARY}` } : undefined}>
                  {/* 헤더 — 이름만. 수치는 아래 두 바(HP·궁)에 라벨과 함께 */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 shrink-0" style={{ background: elementColor[el], boxShadow: `0 0 5px ${elementColor[el]}`, clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }} />
                    <span className="truncate font-mono text-[14px] font-bold tracking-tight text-white" title={a.name}>{a.name}</span>
                  </div>
                  {/* HP 바 — 궁 바와 같은 형태로 두되 라벨·색(녹/적)으로 구분. 숫자만 있던 시절 궁 바를 체력으로 오독했다 */}
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span title="체력" className="w-5 shrink-0 cursor-help text-right font-mono text-[11px] font-bold uppercase text-ef-muted">HP</span>
                    <div className="relative flex-1">
                      <Bar value={Math.max(0, a.hp)} max={a.maxHp} color={lowHp ? "#e5484d" : "#6fbf4f"} h="h-2.5" />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold leading-none tabular-nums" style={{ color: lowHp ? "#ffd9d6" : "#eaf5df", textShadow: "0 1px 2px #000" }}>{Math.max(0, a.hp)}/{a.maxHp}</span>
                    </div>
                  </div>
                  {/* 궁 바(유지) */}
                  <div className="mt-1 flex items-center gap-1.5">
                    {/* 궁 라벨에 충전 방법을 붙인다 — 평타만 눌러서는 영원히 안 차는데 화면에 단서가 없었다 */}
                    <span title="궁극기 에너지 — 배틀 스킬(쓰면 팀 전원 충전)과 연계 스킬로만 찹니다. 일반 공격은 팀 게이지만 회복합니다. 전투가 끝나도 유지되어 다음 교전으로 넘어갑니다(⤴)." className={`w-5 shrink-0 cursor-help text-right font-mono text-[11px] font-bold uppercase ${ready ? "text-amber-300" : "text-ef-muted"}`}>궁</span>
                    <div className="relative flex-1" style={ready ? { filter: "drop-shadow(0 0 4px #f5c54299)" } : undefined}>
                      <Bar value={a.ultCharge} max={a.ultCost} color={ready ? "#f5c542" : "#7a611c"} h="h-2.5" />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold leading-none" style={{ color: ready ? "#1a1206" : "#e5c98a", textShadow: ready ? "none" : "0 1px 2px #000" }}>{ready ? "⚡ READY" : `${Math.round(a.ultCharge)}/${a.ultCost}`}</span>
                    </div>
                  </div>
                  {/* 보호막 · 상태(세트 제외) — 고정 높이 단일 행(칩 쌓여도 카드 안 늘어남) */}
                  {(a.shield > 0 || chips.length > 0) && <div className="flex flex-wrap content-start gap-1 overflow-hidden min-h-[22px] max-h-[46px] mt-1.5">
                    {a.shield > 0 && <Chip compact tone="#38bdf8" title={`보호막 ${a.shield}`}>🛡{a.shield}</Chip>}
                    {chips.map((c) => <Chip key={c.k} compact tone={c.tone} title={chipTitle(c)} icon={c.icon} onPick={(r) => setChipInfo({ c, x: r.left + r.width / 2, y: r.bottom })}>{chipShort(c)}</Chip>)}
                  </div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 연계 콤보 — 스킬 발동으로 조건이 열린 연계를 아이콘으로 띄우고 플레이어가 발동/패스 */}
      {!winner && linkCombo && (() => {
        const op = OPERATORS.find((o) => o.id === linkCombo.unitId);
        return (
          <div className="hud-panel dd-cut mt-3 flex items-center gap-3 p-3" style={{ borderColor: "rgba(103,232,249,0.55)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 30px -8px rgba(103,232,249,0.5)" }}>
            <img src={skillIcon(linkCombo.unitId, "link")} alt="" className="dd-skill-ready h-14 w-14 shrink-0 border border-[#67e8f9]/60 bg-black/40 object-contain p-1" onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[13px] font-bold uppercase tracking-wider text-[#67e8f9]">⚡ 연계 발동 가능</div>
              <div className="truncate font-mono text-lg font-bold text-white">{op?.name ?? linkCombo.unitId} 「{linkCombo.skill.name}」</div>
            </div>
            <button type="button" onClick={fireLink} className="dd-cut shrink-0 px-5 py-2.5 font-mono text-sm font-black uppercase tracking-wider transition hover:brightness-110" style={{ background: "linear-gradient(180deg,#7de3f0,#3bb8d0)", color: "#04121a", boxShadow: "0 0 20px -4px rgba(103,232,249,0.6)" }}>연계 발동 →</button>
            <button type="button" onClick={skipLink} className="shrink-0 border border-ef-line px-3 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-ef-muted transition hover:border-ef-accent/50 hover:text-white">패스</button>
          </div>
        );
      })()}
      {/* 적/아군 자동 행동 중 — 수동인데 스킬 패널이 사라지면 멈춘 줄 안다. 누가 움직이는 중인지 알린다. */}
      {!winner && !current && !auto && !linkCombo && (
        <div className="hud-panel dd-cut mt-3 flex items-center gap-2.5 px-4 py-3" style={{ borderColor: "rgba(224,101,92,0.35)" }}>
          <span className="dd-turn-dot h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: fx.actingSide === "ally" ? "#f5c542" : "#e0655c" }} />
          <span className="font-mono text-[15px] font-bold" style={{ color: fx.actingSide === "ally" ? "#f5c542" : "#e0655c" }}>
            {fx.actingSide === "ally" ? "아군 행동 중" : "적 행동 중"}
          </span>
          <span className="font-mono text-[13px] text-ef-muted">— 잠시 기다리면 다음 차례가 옵니다. 속도를 올리려면 우측 상단 「1배속」을 누르세요.</span>
        </div>
      )}
      {/* 팀 게이지 — 스킬 선택 바로 위에 둬서 "지금 배틀 몇 번 쓸 수 있나"가 손에 잡히게 */}
      {!winner && (
        <div className="hud-panel dd-cut mt-3 px-3 py-2">
          <div className="flex items-center gap-2.5">
          <span className="shrink-0 font-mono text-[13px] uppercase tracking-wider text-ef-muted">게이지<span className="hidden sm:inline"> · <span className="cursor-help underline decoration-dotted underline-offset-2" title="파티 4명이 함께 쓰는 하나의 게이지입니다. 누가 배틀 스킬을 써도 여기서 100이 빠지므로, 한 명이 연달아 쓰면 나머지가 못 씁니다. 아군 오퍼 턴마다 조금씩 자동 회복되고 일반 공격으로도 찹니다. 궁극기 에너지와는 별개입니다.">4인 공용</span> <span className="text-ef-accent-soft" title="아군 오퍼 턴마다 자동 회복">+{GAUGE_TURN_REGEN}/턴</span></span></span>
          <div className="min-w-[120px] flex-1"><Bar value={s.skillGauge} max={s.maxGauge} color={PRIMARY} h="h-2.5" /></div>
          <span className="shrink-0 font-mono text-[13px] font-bold text-ef-ink">{Math.round(s.skillGauge)}/{s.maxGauge}</span>
          {/* 남은 배틀 횟수 — 숫자만으론 "지금 배틀을 몇 번 쓸 수 있나"가 안 읽힌다 */}
          <span className="shrink-0 font-mono text-[12px] font-bold" title="배틀 스킬 1회에 100 소모 — 지금 게이지로 쓸 수 있는 횟수"
                style={{ color: s.skillGauge >= GAUGE_COST ? "#f5c542" : "#7a7a82" }}>배틀 {Math.floor(s.skillGauge / GAUGE_COST)}회분</span>
          </div>
        </div>
      )}
      {/* 수동 조작 — 스킬 선택 */}
      {!winner && pu && (
        <div className="hud-panel dd-cut mt-3 p-3" style={{ borderColor: "rgba(255,154,47,0.4)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 -8px 30px -20px rgba(255,154,47,0.4)" }}>
          <div className="flex gap-3">
          {/* 행동 오퍼레이터 아트(에픽세븐식) */}
          {/* 스킬 상세(ⓘ)가 열려 패널이 커져도 초상화는 고정 높이(self-start) — 같이 늘어나지 않게 */}
          <div onClick={() => { setInspectId(pu.id); setInspectTab("skill"); }} title="클릭 — 상세 스테이터스" className="relative hidden w-24 shrink-0 cursor-pointer self-start overflow-hidden border transition hover:brightness-125 sm:block" style={{ ...CUT_SM, height: 156, borderColor: `${elementColor[unitElement(pu)]}99`, background: `radial-gradient(80% 55% at 50% 12%, ${elementColor[unitElement(pu)]}33, transparent 65%), #0d0906` }}>
            <img src={fullUrl(pu.id)} alt="" className="absolute inset-0 h-full w-full object-cover object-top" onError={(ev) => { (ev.currentTarget as HTMLImageElement).src = avatarUrl(pu.id); }} />
            <div className={`absolute inset-x-0 top-0 bg-gradient-to-b from-black/85 to-transparent px-1 py-1 text-center font-mono text-[12px] font-black uppercase tracking-wider ${locked ? "text-ef-muted" : "text-ef-accent"}`} style={{ textShadow: "0 0 6px #000" }}>{locked ? "🔒 대기" : "▶ 행동"}</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-1 pb-2 pt-3 text-center font-mono text-[14px] font-bold text-white" style={{ textShadow: "0 1px 3px #000" }}>{pu.name}</div>
            <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: elementColor[unitElement(pu)] }} />
          </div>
          {/* 스킬 영역 */}
          <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 font-mono text-[15px] font-bold uppercase tracking-wider text-ef-accent">
            {locked ? <><span className="text-ef-muted">🔒 {pu.name} — 스킬 확인 <span className="font-normal normal-case">(대기 중 · 자기 턴에 사용 가능)</span></span>{current && !auto
                ? <button type="button" onClick={() => setViewId(null)} className="ml-auto animate-pulse border border-ef-accent bg-ef-accent/15 px-3 py-0.5 text-[14px] font-bold text-ef-accent shadow-[0_0_14px_rgba(255,154,47,0.45)] hover:brightness-125">▶ {current.name} 턴으로 돌아가기</button>
                : <button type="button" onClick={() => setViewId(null)} className="ml-auto border border-ef-line px-2 py-0.5 text-[14px] text-ef-muted hover:text-white">✕ 닫기</button>}</> : aiming ? <><span className="text-ef-accent-soft">🎯 {aiming.name} — 공격할 적을 선택</span><button type="button" onClick={() => setAiming(null)} className="ml-auto border border-ef-line px-2 py-0.5 text-[14px] text-ef-muted hover:text-white">취소</button></> : <span>{pu.name} — 스킬 선택</span>}
          </div>
          {/* 조준 중에도 카드는 살아있다 — ⓘ 상세 보기 가능, 다른 스킬 클릭 시 조준 전환, 같은 스킬 재클릭 시 취소 */}
          <div className="flex flex-wrap gap-2">
            {skills.map((sk) => {
              const dmg = sk.power > 0 && pu ? Math.round(realAtk(pu.attack) * (1 + (pu.atkBuff || 0)) * (pu.weakenMul ?? 1) * sk.power) : 0;
              const el = sk.element ?? "physical";
              const open = detailId === sk.id;
              const reason = pu ? skillReason(s, pu, sk) : null;
              const off = !!reason;
              // 발광: 연계는 조건 게이트가 열리면(=usable) 그 자체가 조건 충족. 배틀은 게이지가 아니라 조건부 효과가 지금 터질 때만.
              const payoff = !off && pu && sk.kind === "battle" ? battlePayoff(s, pu, sk) : null;
              const ready = !off && (sk.kind === "link" || !!payoff); // 연계 조건 열림 · 배틀 조건부 효과 충족 → 발광
              return (
              <button key={sk.id} type="button" onClick={() => { if (locked || off) return; if (aiming?.id === sk.id) setAiming(null); else chooseSkill(sk); }} className={`hud-tile dd-cut group relative flex h-[72px] w-[300px] shrink-0 items-start gap-2 overflow-hidden px-2.5 py-2 pr-8 text-left ${locked ? "cursor-default" : off ? "cursor-not-allowed opacity-55 hover:!border-ef-line/40" : aiming?.id === sk.id ? "!border-ef-accent !bg-ef-accent/10 shadow-[0_0_18px_rgba(255,154,47,0.55)]" : aiming ? "opacity-40 hover:opacity-80" : open ? "!border-ef-accent" : ready ? "dd-skill-ready" : ""}`}>
                {aiming?.id === sk.id && <span className="absolute bottom-1 right-1 z-10 animate-pulse border border-ef-accent/80 bg-black/80 px-1 py-px font-mono text-[11px] font-bold text-ef-accent">🎯 조준 중</span>}
                <img src={skillIcon(pu.id, sk.kind)} alt="" loading="lazy" className={`mt-0.5 h-9 w-9 shrink-0 border border-ef-line/60 bg-black/40 object-contain p-0.5 ${off ? "opacity-40 grayscale" : ""}`} onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-center gap-1.5"><span className="shrink-0 whitespace-nowrap border px-1 py-px font-mono text-[13px] font-bold uppercase" style={{ borderColor: off ? "#7a6a4a66" : `${kindTone[sk.kind]}66`, color: off ? "#7a6a4a" : kindTone[sk.kind] }}>{kindLabel[sk.kind]}</span><span title={skillLabel(pu, sk)} className={`min-w-0 flex-1 truncate whitespace-nowrap font-mono text-sm font-bold ${off ? "text-ef-muted" : "text-white"}`}>{skillLabel(pu, sk)}</span>{payoff && <span className="shrink-0 animate-pulse whitespace-nowrap border border-ef-accent/70 bg-ef-accent/15 px-1 py-px font-mono text-[12px] font-bold leading-none text-ef-accent" title="조건부 효과 발동 조건 충족 — 지금 쓰면 추가 효과">{payoff}</span>}</span>
                  <span className="mt-1 flex min-w-0 items-center gap-2 overflow-hidden">
                    {off ? <span className="min-w-0 cursor-help truncate font-mono text-[14px] font-bold text-red-400/90" title={reasonHelp(reason)}>🔒 {reason}</span>
                      : dmg > 0 ? <span className="shrink-0 whitespace-nowrap font-mono text-[17px] font-bold tabular-nums" style={{ color: elementColor[el] }}>{dmg.toLocaleString()}<span className="ml-0.5 text-[13px] font-normal text-ef-muted">피해</span></span>
                      : <span className="shrink-0 whitespace-nowrap font-mono text-[14px] text-ef-muted">{sk.target === "self" ? "버프/유틸" : "유틸"}</span>}
                    {!off && (sk.kind === "battle"
                      ? <span className="shrink-0 whitespace-nowrap font-mono text-[13px] font-bold text-orange-300/80" title="팀 공용 스킬 게이지를 소모합니다. 궁극기 에너지와는 별개입니다.">−{sk.gaugeCost ?? 100}<span className="ml-0.5 text-[11px] font-normal text-ef-muted">팀게이지</span></span>
                      : sk.gaugeGain ? <span className="shrink-0 whitespace-nowrap font-mono text-[13px] font-bold text-green-300/80" title="팀 공용 스킬 게이지를 회복합니다. 궁극기 에너지는 오르지 않습니다.">＋{sk.gaugeGain}<span className="ml-0.5 text-[11px] font-normal text-ef-muted">팀게이지</span></span> : null)}
                    <span className="ml-auto shrink-0 whitespace-nowrap font-mono text-[13px] text-ef-muted">{targetLabel[sk.target]}</span>
                  </span>
                </span>
                <span onClick={(ev) => { ev.stopPropagation(); setDetailId(open ? null : sk.id); }} className={`absolute right-1 top-1 flex h-5 w-5 items-center justify-center border font-mono text-[14px] font-bold transition ${open ? "border-ef-accent bg-ef-accent/20 text-ef-accent" : "border-ef-line text-ef-muted hover:border-ef-accent/60 hover:text-ef-accent"}`} title="상세">{open ? "×" : "ⓘ"}</span>
              </button>
            ); })}
            {!skills.length && <span className="font-mono text-xs text-ef-muted">사용 가능한 스킬 없음</span>}
          </div>
          {/* 스킬 상세 */}
          {(() => {
            const sk = skills.find((x) => x.id === detailId);
            if (!sk || !pu) return null;
            const el = sk.element ?? "physical";
            const dmg = sk.power > 0 ? Math.round(realAtk(pu.attack) * (1 + (pu.atkBuff || 0)) * (pu.weakenMul ?? 1) * sk.power) : 0;
            const Row = ({ k, v, tone }: { k: string; v: string; tone?: string }) => <div className="flex items-baseline gap-1.5"><span className="w-14 shrink-0 font-mono text-[13px] uppercase tracking-wider text-ef-muted">{k}</span><span className="font-mono text-[15px] font-bold" style={{ color: tone ?? "#e6e1d6" }}>{v}</span></div>;
            return (
              <div ref={detailRef} className="mt-2 border border-ef-accent/40 bg-black/40 p-3" style={CUT_SM}>
                <div className="mb-2 flex items-center gap-2"><span className="border px-1 py-px font-mono text-[13px] font-bold uppercase" style={{ borderColor: `${PRIMARY}66`, color: PRIMARY }}>{kindLabel[sk.kind]}</span><span className="font-mono text-sm font-bold text-white">{sk.name}</span><button type="button" onClick={() => setDetailId(null)} className="ml-auto border border-ef-line px-1.5 py-0.5 font-mono text-[14px] text-ef-muted hover:border-ef-accent/60 hover:text-white">✕</button></div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
                  {dmg > 0 ? <Row k="예상 피해" v={`${dmg.toLocaleString()} (배율 ${Math.round(sk.power * 100)}%)`} tone={elementColor[el]} /> : <Row k="유형" v="버프 / 유틸" />}
                  <Row k="대상" v={sk.target === "row" ? "범위 — 조준한 적 + 좌우 인접" : sk.target === "all" ? "전체 — 적 전원" : targetLabel[sk.target]} />
                  <Row k="속성" v={elementName[el]} tone={elementColor[el]} />
                  {(sk.staggerVal ?? 0) > 0 && <Row k="불균형" v={`+${sk.staggerVal}`} tone="#facc15" />}
                  {sk.kind === "link" && <Row k="쿨타임" v={`${sk.cooldown ?? 3}턴`} />}
                  {sk.requiresText && <Row k="발동 조건" v={sk.requiresText} tone="#fca5a5" />}
                </div>
                {sk.note && <div className="mt-2 border-t border-ef-line/50 pt-2 font-mono text-[15px] leading-relaxed text-ef-muted">{sk.note}</div>}
              </div>
            );
          })()}
          </div>{/* /스킬 영역 */}
          </div>{/* /flex 행 */}
          {/* 자유 행동 궁 — 지금 턴이 아닌 오퍼도 궁이 찼으면 여기서 쏜다(원작: 궁은 즉발) */}
          {!locked && current && (() => {
            const ready = freeUlts(stateRef.current!, current);
            if (!ready.length) return null;
            return (
              <div className="mt-2 border-t border-ef-line/50 pt-2">
                <div className="mb-1.5 font-mono text-[14px] font-bold uppercase tracking-wider text-ef-muted">궁극기 <span className="text-ef-muted">· 자유 행동(턴 미소모) · 다른 오퍼도 지금 발동 가능</span></div>
                <div className="flex flex-wrap gap-2">
                  {ready.map(({ unit, skill }) => (
                    <button key={unit.id} type="button" onClick={() => playerFireUlt(unit.id)} title={skill.note ?? skill.name}
                      className="dd-skill-ready group flex items-center gap-2 border border-[#facc15]/60 bg-black/40 px-2.5 py-1.5 text-left transition hover:border-[#facc15]" style={CUT_SM}>
                      <img src={avatarUrl(unit.id)} alt="" loading="lazy" className="h-7 w-7 shrink-0 border border-ef-line object-cover" style={{ background: "#000" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-xs font-bold text-white">{unit.name} <span className="text-[#facc15]">「{skill.name}」</span></span>
                        <span className="block font-mono text-[13px] text-ef-muted">궁 {Math.round(unit.ultCharge)}/{unit.ultCost} · 지금 발동</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
          {!locked && Object.keys(items).length > 0 && (
            <div className="mt-2 border-t border-ef-line/50 pt-2">
              <div className="mb-1.5 font-mono text-[14px] font-bold uppercase tracking-wider text-ef-muted">전술 아이템 <span className="text-ef-muted">· 자유 행동(턴 미소모) · 한 턴 1개</span>{itemUsedThisTurn && <span className="ml-1.5 font-normal normal-case text-amber-300/80">— 이번 턴 사용함</span>}</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(items).map(([id, n]) => {
                  const it = ITEMS[id]; if (!it) return null;
                  const usable = canUseItem(s, id) && !itemUsedThisTurn; // 한 턴 1개
                  return (
                    <button key={id} type="button" disabled={!usable} title={itemUsedThisTurn ? "이번 턴에는 이미 아이템을 썼습니다 — 다음 턴에 사용 가능" : it.desc} onClick={() => playerUseItem(id)} className={`group border bg-black/40 px-2.5 py-1.5 text-left transition ${usable ? "border-ef-line hover:border-ef-accent/60" : "border-ef-line/40 opacity-45"}`} style={CUT_SM}>
                      <div className="flex items-center gap-1.5"><img src={itemImage(id)} alt="" loading="lazy" className="h-6 w-6 shrink-0 rounded-sm object-contain" style={{ background: `${itemColor(it.kind)}18` }} /><span className="font-mono text-xs font-bold text-white">{it.name}</span><span className="font-mono text-[14px] text-ef-accent">×{n}</span></div>
                      <div className="mt-0.5 max-w-[220px] truncate text-[14px] text-ef-muted group-hover:text-ef-ink">{it.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}


      {/* 유닛 조회 패널 */}
      {inspectId && (() => {
        const u = s.units.find((x) => x.id === inspectId);
        if (!u) return null;
        const ally = u.side === "ally";
        const op = ally ? OPERATORS.find((o) => o.id === u.id) : null;
        const ed = ally ? null : enemyDefFor(u.id);
        const el = unitElement(u);
        const talents = ally ? OP_TALENTS[u.id] ?? [] : [];
        const uskills = ally ? [
          ...(OP_BASIC[u.id] ? [{ id: `${u.id}-basic`, name: OP_BASIC[u.id].name, kind: "attack" as const, note: OP_BASIC[u.id].note, power: OP_BASIC_ATK[u.id] ?? 0.9, target: "single-front", element: unitElement(u), extra: null as string | null }] : []),
          ...(SKILLS[u.id] ?? []).map((s) => ({ id: s.id, name: s.name, kind: s.kind, note: s.note, power: s.power, target: s.target, element: s.element ?? "physical", extra: skillExtraHit(s) })),
        ] : [];
        const loadout = ally ? party.find((p) => p.id === u.id)?.loadout ?? {} : {};
        const ownedMap = owned ?? {};
        const craftedSlot = (slot: string) => { const ref = (loadout as Record<string, string>)[slot]; return !!(ref && ownedMap[ref] != null); }; // 공업소에서 제작(장착)된 슬롯만
        const equipped = Object.fromEntries(Object.entries(loadout).filter(([slot]) => craftedSlot(slot)));
        const sets = ally ? activeSets(equipped as never) : []; // 실제 장착(제작)된 피스로만 세트 발동
        const pieces = ally ? loadoutPieces(loadout) : [];
        const wId = ally ? weaponOf(u.id) : null;
        const RES_ELEMS: (Element | "physical")[] = ["physical", "heat", "electric", "cryo", "nature"];
        const hpR = u.maxHp > 0 ? u.hp / u.maxHp : 0;
        const hpTone = hpR > 0.5 ? "#7cc04a" : hpR > 0.25 ? "#f0b429" : "#e5484d";
        const close = () => setInspectId(null);
        const hide = (ev: React.SyntheticEvent<HTMLImageElement>) => { (ev.currentTarget as HTMLImageElement).style.visibility = "hidden"; };
        const St = ({ label, value }: { label: string; value: string | number }) => (
          <div className="bg-[#120c07] px-2 py-1.5 text-center"><div className="font-mono text-[12px] uppercase tracking-wider text-ef-muted">{label}</div><div className="mt-0.5 font-mono text-[16px] font-bold text-ef-ink">{value}</div></div>
        );
        const Sec = ({ title, children }: { title: string; children: React.ReactNode }) => (
          <div className="border-t border-ef-line p-3"><div className="mb-2 font-mono text-[14px] font-bold uppercase tracking-wider text-ef-accent/70">{title}</div>{children}</div>
        );
        return (
          <div onClick={close} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div onClick={(e) => e.stopPropagation()} className="max-h-[86vh] w-full max-w-[540px] overflow-y-auto bg-[#0d0906]" style={{ ...CUT_SM, border: `1px solid ${elementColor[el]}77` }}>
              {/* 상단 속성색 액센트 바 */}
              <div className="h-1 w-full" style={{ background: elementColor[el], boxShadow: `0 0 12px ${elementColor[el]}` }} />
              {/* 헤더 — 속성색 그라디언트 배경 */}
              <div className="flex items-center gap-3 border-b border-ef-line p-3.5" style={{ background: `linear-gradient(100deg, ${elementColor[el]}1f, transparent 60%)` }}>
                <div className="h-14 w-14 shrink-0 border-2" style={{ borderColor: `${elementColor[el]}88`, background: ally ? `center top/cover url(${avatarUrl(u.id)}), #0d0906` : `center/contain no-repeat url(${enemyImage(u.id)}), radial-gradient(circle at 50% 35%, ${el === "physical" ? "#5a2a22" : elementColor[el] + "40"}, #140a08 70%)` }} />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-lg font-bold text-white">{u.name}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 font-mono text-[15px] text-ef-muted">
                    <span className="inline-block h-2 w-2" style={{ background: elementColor[el] }} /><span>{elementName[el]}</span>
                    {op && <span>· {classLabel[op.cls]}</span>}
                    {ed && <span>· {tierLabel[ed.tier] ?? ed.tier} · {ed.faction} · {ed.role}</span>}
                  </div>
                </div>
                <button type="button" onClick={close} className="shrink-0 border border-ef-line px-2 py-1 font-mono text-sm text-ef-muted transition hover:border-ef-accent/60 hover:text-white">✕</button>
              </div>
              {/* 체력 바 + 핵심 스탯 */}
              <div className="border-b border-ef-line px-3 py-2.5">
                <div className="mb-1 flex items-baseline justify-between font-mono">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-ef-muted">체력</span>
                  <span className="text-[15px] font-bold text-ef-ink">{Math.max(0, u.hp).toLocaleString()} <span className="text-[13px] font-normal text-ef-muted">/ {u.maxHp.toLocaleString()}</span>{u.shield > 0 && <span className="ml-1.5 text-[14px] text-sky-300">🛡 {u.shield}</span>}</span>
                </div>
                <div className="relative mb-2.5 h-2.5 overflow-hidden rounded-[2px] bg-black/70" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-[2px] transition-all" style={{ width: `${Math.max(0, Math.min(100, hpR * 100))}%`, background: hpTone, boxShadow: `0 0 8px ${hpTone}99` }} />
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <St label="공격" value={Math.round(realAtk(u.attack))} />
                  <St label="방어" value={u.defense} />
                  <St label="속도" value={Math.max(1, u.speed + (u.speedMod || 0))} />
                  {ally ? <St label="치명" value={`${Math.round(u.critRate * 100)}%`} /> : <St label="불균형" value={`${Math.round(u.stagger)}/${u.staggerMax}`} />}
                </div>
                {ally && u.attrs && (
                  <div className="mt-1.5 flex flex-wrap justify-between gap-x-2 gap-y-0.5 font-mono text-[13px]">
                    {([["힘", u.attrs.str, "체력 · 일반 공격 피해"], ["민첩", u.attrs.agi, "속도"], ["지능", u.attrs.int, "스킬 피해"], ["의지", u.attrs.wil, "유틸 · 궁극기 게이지"]] as [string, number, string][]).map(([k, v, t]) => <span key={k} className="text-ef-muted" title={`${k} → ${t}`}>{k} <b className="text-ef-ink">{v}</b></span>)}
                  </div>
                )}
              </div>
              {/* 속성별 받는 피해 배율(warfarin식) — 100%=정상, <100%=저항(붉게), >100%=약점(초록) */}
              <div className="border-b border-ef-line px-3 py-2.5">
                <div className="mb-1.5 flex flex-wrap items-center gap-x-1.5 font-mono text-[14px] font-bold uppercase tracking-wider text-ef-accent/70">받는 피해<span className="font-normal normal-case tracking-normal text-ef-muted">· 100%=정상 · 낮을수록 저항 · 높을수록 약점</span></div>
                <div className="grid grid-cols-5 gap-1">
                  {RES_ELEMS.map((e) => { const r = u.resist[e] ?? 0; const mul = Math.round((1 - r) * 100); const weak = mul > 100; const resist = mul < 100; return (
                    <div key={e} className="flex flex-col items-center gap-0.5 border py-1" style={{ borderColor: weak ? "#7cc04a66" : resist ? "#f8717155" : "#ffffff12", background: weak ? "#7cc04a15" : "transparent" }}>
                      <span className="h-2 w-2" style={{ background: elementColor[e], boxShadow: `0 0 5px ${elementColor[e]}` }} />
                      <span className="font-mono text-[12px] text-ef-muted">{elementName[e]}</span>
                      <span className="font-mono text-[13px] font-bold" style={{ color: weak ? "#8fd36a" : resist ? "#f87171" : "#c8c8cc" }}>{mul}%{weak ? " ▲" : ""}</span>
                    </div>
                  ); })}
                </div>
              </div>
              {/* 오퍼 고유 스택 — 상단 강조(게이지/도트). 정체성이라 0이어도 항상 표시 */}
              {ally && OP_STACK_INFO[u.id] && (() => {
                const si = OP_STACK_INFO[u.id]; const v = si.get(u);
                return (
                  <Sec title="고유 스택">
                    <div className="flex items-start gap-2.5">
                      {talentIcon(u.id)
                        ? <img src={talentIcon(u.id)} alt="" className="h-9 w-9 shrink-0 rounded border border-ef-line/50 object-contain" style={{ filter: `drop-shadow(0 0 6px ${si.tone}88)` }} onError={hide} />
                        : <span className="text-2xl leading-none" style={{ filter: `drop-shadow(0 0 6px ${si.tone}88)` }}>{si.icon}</span>}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-mono text-[16px] font-bold" style={{ color: si.tone }}>{si.name}</span>
                          <span className="font-mono text-[16px] font-black text-ef-ink">{si.fmt ? si.fmt(v) : <>{v}<span className="text-[13px] font-normal text-ef-muted"> / {si.max}</span></>}</span>
                        </div>
                        {si.fmt
                          ? <div className="mt-1.5 flex gap-1">{STANCE_KO.map((s, k) => <span key={k} className="flex-1 rounded-sm border py-0.5 text-center font-mono text-[13px] font-bold" style={{ borderColor: k === v ? `${si.tone}99` : "#2a2a2a", background: k === v ? `${si.tone}22` : "transparent", color: k <= v ? si.tone : "#5a5a5a" }}>{s}</span>)}</div>
                          : <div className="mt-1.5 flex gap-0.5">{Array.from({ length: si.max }, (_, k) => <span key={k} className="h-2 flex-1 rounded-full transition-all" style={{ background: k < v ? si.tone : "#26262a", boxShadow: k < v ? `0 0 6px ${si.tone}88` : "none" }} />)}</div>}
                        <div className="mt-1.5 font-mono text-[13px] leading-relaxed text-ef-muted">{si.desc}</div>
                      </div>
                    </div>
                  </Sec>
                );
              })()}
              {/* 상태 효과(버프/디버프) — 방향 분류 + 잔여 턴 + 출처(누가·무엇으로). 고유 스택은 위에서 강조하므로 제외 */}
              {(() => {
                const STACK_KS = ["lae", "zfy", "yv", "mifu"];
                const all = [...(u.shield > 0 ? [{ k: "shield", label: `🛡 보호막 ${u.shield}`, tone: "#38bdf8", dir: 1, turns: u.timers?.shield, src: (u.effectSrc as Record<string, EffSrc>)?.shield } as StatusChip] : []), ...unitChips(u).filter((c) => !STACK_KS.includes(c.k))];
                const chipRow = (c: StatusChip) => (
                  <div key={c.k} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <Chip tone={c.tone} icon={c.icon}>{c.label}{c.turns ? <span className="ml-1 opacity-75">· {c.turns}턴</span> : null}</Chip>
                    {c.src && <span className="font-mono text-[13px] text-ef-muted">← {c.src.by} · <span className="text-ef-ink/70">{c.src.via}</span> <span className="opacity-60">({SRC_KIND_KO[c.src.kind] ?? c.src.kind})</span></span>}
                  </div>
                );
                const group = (label: string, tone: string, dir: (n: number) => boolean) => {
                  const list = all.filter((c) => dir(c.dir));
                  if (!list.length) return null;
                  return <div><div className="mb-1 font-mono text-[13px] font-bold uppercase tracking-wider" style={{ color: tone }}>{label}</div><div className="space-y-1">{list.map(chipRow)}</div></div>;
                };
                return (
                  <Sec title="상태 효과">
                    {all.length ? (
                      <div className="space-y-2.5">
                        {group("버프", "#86efac", (n) => n > 0)}
                        {group("디버프", "#f87171", (n) => n < 0)}
                        {group("상태", "#a1a1aa", (n) => n === 0)}
                      </div>
                    ) : <span className="font-mono text-[15px] text-ef-muted">활성 효과 없음</span>}
                  </Sec>
                );
              })()}
              {ally && <>
                {/* 하단 탭 — 스킬 / 장비·무기 / 재능(스크롤 감소) */}
                <div className="flex gap-1 border-t border-ef-line px-3 pt-3">
                  {(([["skill", "스킬"], ["gear", "장비·무기"], ...(talents.length ? [["talent", "재능"]] : [])]) as [typeof inspectTab, string][]).map(([k, label]) => (
                    <button key={k} type="button" onClick={() => setInspectTab(k)} className={`dd-cut px-3 py-1 font-mono text-[14px] font-bold uppercase tracking-wider transition ${inspectTab === k ? "border border-ef-accent/50 bg-ef-accent/15 text-ef-accent" : "border border-ef-line/50 text-ef-muted hover:text-white"}`}>{label}</button>
                  ))}
                </div>
                {inspectTab === "gear" && <>
                {wId && <Sec title="무기">
                  <div className="flex items-start gap-2.5">
                    {weaponImage(u.id) && <img src={weaponImage(u.id)} alt="" className="h-9 w-9 shrink-0 object-contain" onError={hide} />}
                    <div className="min-w-0">
                      <div className="font-mono text-[16px] font-bold text-white">{WEAPON_KO[wId]}{weaponSeriesName(u.id) && <span className="text-ef-muted"> · {weaponSeriesName(u.id)}</span>}</div>
                      <div className="mt-0.5 font-mono text-[15px] text-ef-accent-soft">{weaponEffectText(u.id)}</div>
                      {weaponSeriesDesc(u.id) && <div className="mt-0.5 font-mono text-[14px] leading-relaxed text-ef-muted">{weaponSeriesDesc(u.id)}</div>}
                    </div>
                  </div>
                </Sec>}
                <Sec title="장비">
                  {/* 슬롯별 목표 피스 — 공업소 제작(장착)된 것만 활성, 미제작은 목표(회색) 표시 */}
                  <div className="mb-2 space-y-1.5">
                    {pieces.map((p) => { const named = p.set && p.set !== "?"; const empty = p.name === "없음"; const crafted = craftedSlot(p.slot); const on = crafted && named && sets.includes(p.set); return (
                      <div key={p.slot} className={`flex items-center gap-2 ${!crafted && !empty ? "opacity-45" : ""}`}>
                        <span className="w-9 shrink-0 font-mono text-[12px] font-bold uppercase tracking-wider text-ef-muted">{p.slotName}</span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-ef-line/60 bg-black/40" style={{ boxShadow: on ? "inset 0 0 0 1px #e8c56a55" : undefined }}>
                          {p.image ? <img src={p.image} alt="" loading="lazy" className={`h-full w-full object-contain ${!crafted && !empty ? "grayscale" : ""}`} onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} /> : <span className="font-mono text-[12px] text-ef-muted">—</span>}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-mono text-[15px] font-bold text-ef-ink" title={p.name}>{p.name}</div>
                          {empty ? <div className="font-mono text-[12px] text-ef-muted">미장착</div>
                            : crafted ? <div className="font-mono text-[12px] text-ef-muted">능력치 <b className="text-ef-ink/80">+{p.grade}</b> · 방어 <b className="text-ef-ink/80">+{p.def}</b>{p.dmg ? <> · <span className="text-ef-accent-soft">{pieceDmgText(p.dmg)}</span></> : null}{p.slots > 1 ? <span className="text-ef-muted/70" title="원작은 부품 2슬롯 — 2슬롯 몫으로 2배 적용"> (2슬롯)</span> : null}</div>
                            : <div className="font-mono text-[12px] text-amber-500/80">미제작 — 공업소에서 제작 필요 (능력치 미적용)</div>}
                        </div>
                        <span className="shrink-0 font-mono text-[12px]" style={{ color: empty ? "#8a8a92" : !crafted ? "#d99a3a" : on ? "#e8c56a" : named ? "#8a8a92" : "#67e8f9aa" }}>{empty ? "" : !crafted ? "미제작" : named ? `${on ? "◆" : "◇"} ${p.set}` : "자유"}</span>
                      </div>
                    ); })}
                  </div>
                  {/* 활성 세트 효과 — 제작된 피스 기준 */}
                  <div className="border-t border-ef-line/40 pt-2">
                    {sets.length ? sets.map((n) => <div key={n} className="mb-1.5 last:mb-0"><span className="font-mono text-[16px] font-bold text-[#e8c56a]">◆ {n} <span className="text-[14px] font-normal text-ef-muted">2부위</span></span><div className="mt-0.5 font-mono text-[15px] leading-relaxed text-ef-muted">{setEffectText(n)}</div></div>) : <div className="font-mono text-[15px] text-ef-muted">활성 세트 없음 — 공업소에서 같은 세트 2부위 제작 필요</div>}
                  </div>
                </Sec>
                </>}
                {inspectTab === "skill" && <Sec title="스킬">
                  {[...uskills].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]).map((sk) => <div key={sk.id} className="mb-2.5 flex items-start gap-2.5 last:mb-0">
                    <img src={skillIcon(u.id, sk.kind)} alt="" className="h-9 w-9 shrink-0 border border-ef-line object-cover" onError={hide} />
                    <div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-1.5"><span className="font-mono text-[16px] font-bold text-white">{sk.name}</span><span className="font-mono text-[13px] uppercase text-ef-accent/70">{kindLabel[sk.kind]}</span>{sk.power > 0 && <span className="font-mono text-[13px]" style={{ color: elementColor[sk.element as Element | "physical"] ?? "#e8c56a" }}>배율 {Math.round(sk.power * 100)}%{sk.extra ? <span className="text-orange-300/90"> · {sk.extra}</span> : null} · {targetLabel[sk.target as DDSkill["target"]]} · ~{Math.round(realAtk(u.attack) * (1 + (u.atkBuff || 0)) * (u.weakenMul ?? 1) * sk.power).toLocaleString()}</span>}</div>{sk.note && <div className="mt-0.5 font-mono text-[15px] leading-relaxed text-ef-muted">{sk.note}</div>}</div>
                  </div>)}
                </Sec>}
                {inspectTab === "talent" && talents.length > 0 && <Sec title="재능">
                  {talents.map((t, i) => <div key={i} className="mb-2.5 flex items-start gap-2.5 last:mb-0">
                    {t.icon && <img src={t.icon} alt="" className="h-9 w-9 shrink-0 border border-ef-line object-cover" onError={hide} />}
                    <div className="min-w-0"><div className="font-mono text-[16px] font-bold text-white">{t.name}</div><div className="mt-0.5 font-mono text-[15px] leading-relaxed text-ef-muted">{t.desc}</div></div>
                  </div>)}
                </Sec>}
              </>}
              {ed?.traits && ed.traits.length > 0 && <Sec title="특징">
                <div className="space-y-1.5">
                  {ed.traits.map((t, i) => <div key={i} className="flex gap-1.5 font-mono text-[14px] leading-relaxed text-ef-muted"><span className="shrink-0 text-ef-accent-soft">◆</span><span>{t}</span></div>)}
                </div>
              </Sec>}
              {ed && (() => {
                const pr = behaviorPriority[ed.behavior] ?? 1;
                const weakEls = RES_ELEMS.filter((e) => (u.resist[e] ?? 0) < 0); // 진짜 약점(받는 피해 >100%)
                const resistEls = RES_ELEMS.filter((e) => (u.resist[e] ?? 0) > 0); // 저항(받는 피해 <100%)
                return (
                  <Sec title="행동 · 위협">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-xl leading-none">{behaviorIcon[ed.behavior] ?? "⚔"}</span>
                      <span className="text-[16px] font-bold text-white">{behaviorLabel[ed.behavior] ?? ed.behavior}</span>
                      {pr >= 3 ? <span className="ml-auto border border-red-500/60 bg-red-500/15 px-1.5 py-0.5 font-mono text-[12px] font-bold text-red-300">⚠ 우선 처치</span>
                        : pr === 2 ? <span className="ml-auto border border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[12px] font-bold text-amber-300">주의</span> : null}
                    </div>
                    <div className="mt-1.5 font-mono text-[14px] leading-relaxed text-ef-muted">{behaviorDesc[ed.behavior] ?? ""}</div>
                    <div className="mt-1.5 font-mono text-[14px] text-ef-accent-soft">🎯 {targetDesc[enemyArchetype(ed.role, ed.behavior).tgt]}</div>
                    {weakEls.length > 0
                      ? <div className="mt-1.5 font-mono text-[14px]"><span className="text-ef-muted">공략: </span><span className="font-bold text-green-300">{weakEls.map((e) => elementName[e]).join("·")} 약점</span><span className="text-ef-muted"> — 해당 속성으로 큰 피해</span></div>
                      : resistEls.length > 0
                        ? <div className="mt-1.5 font-mono text-[14px]"><span className="text-ef-muted">공략: </span><span className="font-bold text-red-300/90">{resistEls.map((e) => elementName[e]).join("·")} 저항</span><span className="text-ef-muted"> — 다른 속성으로 공격</span></div>
                        : <div className="mt-1.5 font-mono text-[14px] text-ef-muted">속성 저항 없음 — 모든 속성 정상 피해</div>}
                  </Sec>
                );
              })()}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
