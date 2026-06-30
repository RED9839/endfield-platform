// ===== 다키스트 던전류 전투 엔진 (엔드필드 리뉴얼) =====
// 카드/드로우 없음. 속도 기반 턴 순서 + 고정 스킬킷 + 포지션(전열/후열) + 스킬 사용 요구사항(usage gate).
// 명일방주: 엔드필드 전투 시스템 wiki 정합. 액션 레이어만 DD류, 메커니즘은 원작.

export type DDStatus = "stun" | "combustion" | "corrosion" | "crystal" | "armor-break";
export type Element = "heat" | "electric" | "cryo" | "nature"; // 열기·전기·냉기·자연
export type DDClass = "guard" | "caster" | "striker" | "vanguard" | "defender" | "supporter"; // 직군 6종
export const ELEMENTS: Element[] = ["heat", "electric", "cryo", "nature"];
const EL_NAME: Record<Element, string> = { heat: "열기", electric: "전기", cryo: "냉기", nature: "자연" };

export type DDUnit = {
  id: string;
  name: string;
  side: "ally" | "enemy";
  cls?: DDClass; // 직군
  pos: number; // 1=전열 … 4=후열
  hp: number;
  maxHp: number;
  speed: number; // 턴 순서(민첩)
  attack: number;
  defense: number; // 방어력 → 받는 모든 피해 ×(100/(def+100)). 기본 0(장비로 증가)
  resist: { physical: number; arts: number }; // 물리/아츠 저항(0~1, 1=100%감소). 민첩→물리·지능→아츠
  // 물리 이상
  physBreak: number; // 방어 불능 스택(표식) 0~4. 자체 효과 없음 — 강타/갑옷파괴로 소모, 띄우기/넘어뜨리기 효과 발동
  // 불균형치(stagger): 가득 차면 불균형 상태 → 행동 불가 + 받는 피해 +30% + 처형 가능
  stagger: number;
  staggerMax: number; // 0이면 불균형 없음(아군 등)
  staggered: boolean;
  staggerTimer: number; // 불균형 지속 라운드
  statuses: DDStatus[];
  dot: number; // 매 라운드 시작 지속 피해(연소 등)
  multiHit: number; // 연타 스택: 다음 배틀/궁극 피해 강화(강타엔 미적용)
  ultCharge: number; // 궁극 게이지
  ultCost: number;
  atkBuff: number; // 공격력 증가(관리자 본질 붕괴 등) 0.30=+30%
  critRate: number; // 치명타 확률(기본 0.05). 기댓값 ×(1+치확×치피)로 적용
  critDmg: number; // 치명타 피해(기본 0.50)
  // 아츠 이상
  arts: Record<Element, number>; // 속성별 부착 스택 0~4(따로 계산)
  frozen: number; // 동결 잔여 스택(쇄빙 대기) 0=미동결
  // 버프/디버프 (위계: all ⊃ physical|arts ⊃ 속성)
  amp: Partial<Record<DmgKey, number>>; // 증폭(입히는 피해↑), 중첩 가능(합연산)
  vuln: Partial<Record<DmgKey, number>>; // 취약(받는 피해↑), 중첩 가능(합연산) — 부식=vuln.all
  weakenMul: number; // 허약(공격력↓, 곱연산). 1=영향없음
  protection: number; // 비호(받는 피해↓), 중첩 불가(최고값). 0.3=-30%
  shield: number; // 보호막(보호): 피해 흡수
  speedMod: number; // 가속(+)/감속(-): 턴 순서 보정
  timers: Record<string, number>; // 효과키 → 잔여 턴(1턴=5초). 라운드 시작 감쇠, 재적용 시 리셋
  linkCd: number; // 연계 스킬 쿨타임(잔여 턴)
  rampAtk?: number; // 진천우 칼날 베기: 스킬 명중마다 공격력 누적(스택당 값, 최대 5스택)
  stance: number; // 미브 청파 삼형 스탠스(0=단운 / 1=추형 / 2=개천)
};

export type DmgKey = "all" | "physical" | Element | "arts"; // 피해 위계 키

export type TargetMode = "single-front" | "single-lowhp" | "row" | "all" | "self";

export type DDSkill = {
  id: string;
  name: string;
  kind: "attack" | "battle" | "link" | "ult"; // 일반공격·배틀·연계·궁극
  fromPos: number[]; // 사용 가능 위치(전열/후열 제약)
  target: TargetMode;
  targetRanks?: number[]; // 명중 가능한 적 랭크(생략 시 전체)
  power: number; // 공격력 배율(스킬 발동 피해)
  element?: "physical" | Element; // 피해 속성(생략 시 물리)
  staggerVal?: number; // 불균형치(생략 시 배틀/연계 10, 궁 25)
  attach?: Element; // 아츠 부착(→ 폭발/이상 트리거)
  anomaly?: "launch" | "knockdown" | "crush" | "armor-break"; // 물리 이상
  selfPhysBonus?: number; // 띄우기/넘어뜨리기마다 추가 물리(공격력×배수) — 여풍 복마
  requires?: (target: DDUnit | undefined, self: DDUnit, state: DDState) => boolean; // 사용 요구(usage gate)
  requiresText?: string;
  cooldown?: number; // 연계 쿨타임(턴, 생략 시 기본 3)
  gaugeCost?: number; // 스킬 게이지 소모(생략 시 100). 미브 추형/개천=50
  gaugeRefund?: number; // 게이지 반환(미브 단운=50)
  requiresStance?: number; // 미브 스탠스 요구(추형≥1, 개천≥2)
  setStanceTo?: number; // 사용 후 스탠스 설정
  stanceFromCrush?: boolean; // 강타로 방불 3+ 소모 시 스탠스 2(미브 추형)
  vsWeak?: number; // 물리취약/불균형 적 추가 피해(미브 냉정 등)
  crystal?: boolean; // 오리지늄 결정 부착(관리자 봉인 시퀀스)
  apply?: (target: DDUnit, self: DDUnit) => void; // 추가 효과(취약·연타 등)
  selfUlt?: boolean; // 궁극(게이지 소모)
  note?: string;
};

const MAX_BREAK = 4;
const has = (u: DDUnit, s: DDStatus) => u.statuses.includes(s);
const add = (u: DDUnit, s: DDStatus) => { if (!has(u, s)) u.statuses.push(s); };
const rm = (u: DDUnit, s: DDStatus) => { u.statuses = u.statuses.filter((x) => x !== s); };

// 유효 공격력 배율: 공격력 증가(atkBuff) × 허약(weakenMul). 모든 피해 산출에 공통.
const eb = (u: DDUnit) => (1 + (u.atkBuff || 0)) * (u.weakenMul ?? 1);
const skElem = (skill: DDSkill): "physical" | Element => (skill.element && skill.element !== "physical" ? skill.element : "physical");

// 증폭/취약 위계 합산: all + (physical | arts) + 속성. 상위 효과가 하위 포함.
function tierSum(map: Partial<Record<DmgKey, number>> | undefined, elem: "physical" | Element): number {
  if (!map) return 0;
  let x = map.all || 0;
  if (elem === "physical") x += map.physical || 0;
  else x += (map.arts || 0) + (map[elem] || 0);
  return x;
}
export const ampFor = (u: DDUnit, elem: "physical" | Element) => tierSum(u.amp, elem);
export const vulnFor = (u: DDUnit, elem: "physical" | Element) => tierSum(u.vuln, elem);

// 효과 타이머 세팅(재적용 시 리셋). 라운드 시작 시 감쇠 → 0이면 expire.
export const setTimer = (u: DDUnit, key: string, turns: number) => { u.timers[key] = turns; };
export function bumpVuln(u: DDUnit, key: DmgKey, val: number, turns = DUR_VULN) {
  u.vuln[key] = Math.max(u.vuln[key] || 0, val);
  setTimer(u, "vuln:" + key, turns);
}
// 일반 버프 적용(증폭·허약·비호·보호막·속도). 서포터/디펜더가 사용.
export function applyBuff(u: DDUnit, kind: "amp" | "weaken" | "protection" | "shield" | "speedMod", a: number, b?: number, turns = DUR_BUFF) {
  if (kind === "amp") { const k = (b as unknown as DmgKey) ?? "all"; u.amp[k] = (u.amp[k] || 0) + a; setTimer(u, "amp:" + k, turns); }
  else if (kind === "weaken") { u.weakenMul *= 1 - a; setTimer(u, "weaken", turns); } // 곱연산
  else if (kind === "protection") { u.protection = Math.max(u.protection, a); setTimer(u, "protection", turns); }
  else if (kind === "shield") { u.shield += a; setTimer(u, "shield", turns); }
  else if (kind === "speedMod") { u.speedMod += a; setTimer(u, "speedMod", turns); }
}
function expire(u: DDUnit, key: string): void {
  if (key === "physBreak") u.physBreak = 0;
  else if (key === "atkBuff") u.atkBuff = 0;
  else if (key === "critRate") u.critRate = BASE_CRIT_RATE;
  else if (key === "critDmg") u.critDmg = BASE_CRIT_DMG;
  else if (key === "stance") u.stance = 0;
  else if (key === "dot") u.dot = 0;
  else if (key === "frozen") { u.frozen = 0; rm(u, "stun"); }
  else if (key === "weaken") u.weakenMul = 1;
  else if (key === "protection") u.protection = 0;
  else if (key === "shield") u.shield = 0;
  else if (key === "speedMod") u.speedMod = 0;
  else if (key.startsWith("arts:")) u.arts[key.slice(5) as Element] = 0;
  else if (key.startsWith("vuln:")) delete u.vuln[key.slice(5) as DmgKey];
  else if (key.startsWith("amp:")) delete u.amp[key.slice(4) as DmgKey];
}

// 방어 경감: 방어력(%감소) × 물리/아츠 저항. 받는 측 스탯 적용.
export function mitigate(u: DDUnit, dmg: number, elem: "physical" | Element): number {
  let d = dmg * (100 / (u.defense + 100)); // 방어력: 140 → 58.3% 감소
  d *= 1 - (elem === "physical" ? u.resist.physical : u.resist.arts); // 물리/아츠 저항(1=1%↓)
  return d;
}

// 피해 적용: 보호막(보호) 우선 흡수 → 체력. 실제 체력 피해 반환.
export function applyDamage(u: DDUnit, dmg: number): number {
  let d = Math.max(0, Math.round(dmg));
  if (u.shield > 0) { const ab = Math.min(u.shield, d); u.shield -= ab; d -= ab; }
  u.hp = Math.max(0, u.hp - d);
  return d;
}

// 정화: 해로운 효과 제거(아군 디버프 해제). 결정/방불 등 표식도 함께 정리.
export function cleanse(u: DDUnit): void {
  u.vuln = {}; u.weakenMul = 1; u.dot = 0; u.frozen = 0; u.physBreak = 0;
  u.statuses = u.statuses.filter((s) => s === "crystal");
  u.arts = { heat: 0, electric: 0, cryo: 0, nature: 0 };
  for (const k of Object.keys(u.timers)) // 디버프 타이머만 제거(버프는 유지)
    if (k.startsWith("vuln:") || k.startsWith("arts:") || ["weaken", "dot", "frozen", "physBreak"].includes(k)) delete u.timers[k];
}

// 강타/갑옷파괴/연타 계수(스택 1~4) — 전투 시스템 wiki 정합
const CRUSH = [3.0, 4.5, 6.0, 7.5];         // 강타: 방불 전부 소모
const ARMOR = [1.0, 1.5, 2.0, 2.5];         // 갑옷 파괴
const ARMOR_VULN = [0.12, 0.16, 0.2, 0.24]; // 갑옷 파괴 물리취약
const MH_BATTLE = [0.3, 0.45, 0.6, 0.75];   // 연타: 배틀 스킬 강화
const MH_ULT = [0.2, 0.3, 0.4, 0.5];        // 연타: 궁극기 강화
const ANOM = [1.6, 2.4, 3.2, 4.0];          // 아츠 이상(연소/감전/부식) 계수
const BURN_DOT = [0.24, 0.36, 0.48, 0.6];   // 연소 지속피해/초
const SHATTER = [2.4, 3.6, 4.8, 6.0];       // 쇄빙(동결 스택 비례, 물리)
const ELEC_VULN = [0.12, 0.16, 0.2, 0.24];  // 감전 아츠취약
const CORR_SHRED = [0.12, 0.16, 0.2, 0.24]; // 부식 저항 감소

// 자원 경제(전투 시스템 wiki): 스킬 게이지(파티 공유) + 궁극기 에너지(개인)
const GAUGE_COST = 100;     // 배틀 스킬 1칸 소모
const GAUGE_REGEN = 45;     // 라운드당 자연 회복(≈12.5초/칸)
const BASIC_RECOVER = 18;   // 일반 공격 강력한 일격 → 게이지 회복
const EXEC_RECOVER = 30;    // 처형(불균형 적) → 게이지 추가 회복
const EXECUTE_MULT = 6;     // 처형 피해 배율(불균형 적 일반 공격)
const ULT_BATTLE = 6.5;     // 배틀 사용 시 아군 전체 궁 충전
const ULT_LINK = 10;        // 연계 사용 시 시전자 궁 충전
export const BASE_CRIT_RATE = 0.05; // 인게임 기본 치명타 확률
export const BASE_CRIT_DMG = 0.5;   // 인게임 기본 치명타 피해

// 지속시간(턴, 1턴≈5초) — 재적용 시 리셋(갱신형). 위키 초 ÷ 5 환산.
const DUR_BREAK = 4;   // 방어 불능 20초
const DUR_ATTACH = 4;  // 아츠 부착 20초
const DUR_ATKBUFF = 3; // 본질 붕괴 15초
const DUR_VULN = 3;    // 취약/부식 12~24·15초
const DUR_DOT = 2;     // 연소 10초
const DUR_FROZEN = 2;  // 동결 6~9초
const DUR_BUFF = 3;    // 증폭/허약/비호/보호막/속도 일반 버프
const LINK_CD = 3;     // 연계 기본 쿨타임 15~16초
// 일반 공격(모든 오퍼 공통): 게이지 무소모, 강력한 일격으로 게이지 회복, 불균형 적엔 처형.
export const BASIC: DDSkill = { id: "basic", name: "일반 공격", kind: "attack", fromPos: [1, 2, 3, 4], target: "single-front", power: 0.5, element: "physical", staggerVal: 6 };

// 동결 적에게 방불/물리 이상 발동 시 쇄빙(동결 소모 → 대량 물리). 공격자 측 추가 피해 반환.
function tryShatter(target: DDUnit, self: DDUnit, log: string[]): number {
  if (target.frozen <= 0) return 0;
  const n = Math.min(4, target.frozen);
  target.frozen = 0; rm(target, "stun");
  log.push(`  → 쇄빙! 동결 ${n}스택 소모 → ${SHATTER[n - 1] * 100}% 물리`);
  return self.attack * eb(self) * SHATTER[n - 1];
}

// 아츠 부착 → 폭발(같은 속성 2+) / 이상(다른 속성 → 전부 소모). 공격자 측 추가 피해 반환.
export function applyAttach(target: DDUnit, el: Element, self: DDUnit, log: string[]): number {
  const buff = eb(self);
  const others = ELEMENTS.filter((e) => e !== el && target.arts[e] > 0);
  if (others.length > 0) {
    // 아츠 이상: 모든 부착 소모, 나중 부착(el) 종류로 결정. 이상 레벨 = 소모 스택 수.
    const level = Math.min(4, ELEMENTS.reduce((n, e) => n + target.arts[e], 0) + 1);
    ELEMENTS.forEach((e) => (target.arts[e] = 0));
    if (el === "heat") { // 연소
      target.dot = Math.round(self.attack * buff * BURN_DOT[level - 1]);
      setTimer(target, "dot", DUR_DOT);
      log.push(`  → 연소! ${ANOM[level - 1] * 100}% 열기 + 지속피해 ${target.dot}/라운드`);
      return self.attack * buff * ANOM[level - 1];
    }
    if (el === "electric") { // 감전
      bumpVuln(target, "arts", ELEC_VULN[level - 1]);
      log.push(`  → 감전! ${ANOM[level - 1] * 100}% 전기 + 아츠취약 ${ELEC_VULN[level - 1] * 100}%`);
      return self.attack * buff * ANOM[level - 1];
    }
    if (el === "cryo") { // 동결(쇄빙 대기)
      target.frozen = level; add(target, "stun"); setTimer(target, "frozen", DUR_FROZEN);
      log.push(`  → 동결! 130% 냉기 + 빙결(쇄빙 대기, ${level}스택)`);
      return self.attack * buff * 1.3;
    }
    // nature: 부식 — 모든 속성 저항 감소(물리 포함) = vuln.all 누적(상한 0.24)
    target.vuln.all = Math.min(0.24, (target.vuln.all || 0) + CORR_SHRED[level - 1]);
    setTimer(target, "vuln:all", DUR_VULN);
    log.push(`  → 부식! ${ANOM[level - 1] * 100}% 자연 + 전 속성 저항 감소`);
    return self.attack * buff * ANOM[level - 1];
  }
  // 같은 속성 or 없음 → 부착. 같은 속성 2+ 중첩 시 폭발(미소모).
  target.arts[el] = Math.min(4, target.arts[el] + 1);
  setTimer(target, "arts:" + el, DUR_ATTACH);
  if (target.arts[el] >= 2) {
    log.push(`  → ${EL_NAME[el]} 폭발! 160% ${EL_NAME[el]}`);
    return self.attack * buff * 1.6;
  }
  log.push(`  → ${EL_NAME[el]} 부착 (${target.arts[el]})`);
  return 0;
}

// 물리 이상 처리. 공격자 측 추가 피해(payoff) 반환 + 스택/취약/불균형 부수효과.
// 핵심 규칙: 방불 0인 적엔 이상 효과 미발동 → 방불 1스택만 부여. 방불 있으면 효과 발동.
export function applyAnomaly(skill: DDSkill, target: DDUnit, self: DDUnit, log: string[]): number {
  const a = skill.anomaly;
  if (!a) return 0;
  const buff = eb(self);
  const shatter = tryShatter(target, self, log); // 방불/물리 이상이 동결 적 → 쇄빙
  if (a === "launch" || a === "knockdown") {
    const bok = skill.selfPhysBonus ? self.attack * buff * skill.selfPhysBonus : 0; // 여풍 복마: 넘어뜨리기마다 +공격력×배수
    const wasBreak = target.physBreak > 0;
    target.physBreak = Math.min(MAX_BREAK, target.physBreak + 1);
    setTimer(target, "physBreak", DUR_BREAK);
    const label = a === "launch" ? "띄우기" : "넘어뜨리기";
    if (wasBreak) { // 방불 상태 → 120% 물리 + 불균형 10
      target.stagger += 10;
      log.push(`  → ${label} 발동: +120% 물리 · 불균형 +10 (방불 ${target.physBreak})${bok ? " · 복마" : ""}`);
      return shatter + bok + self.attack * buff * 1.2;
    }
    log.push(`  → ${label}: 방어 불능 부여 (방불 ${target.physBreak})${bok ? " · 복마(+물리)" : ""}`);
    return shatter + bok;
  }
  if (a === "crush") {
    if (target.physBreak > 0) {
      const n = Math.min(4, target.physBreak);
      target.physBreak = 0;
      log.push(`  → 강타! 방어 불능 ${n}스택 소모 → ${CRUSH[n - 1] * 100}% 물리`);
      return shatter + self.attack * buff * CRUSH[n - 1];
    }
    target.physBreak = 1; // 방불 없음 → 1스택 부여(자가 빌드는 가능하나 비효율 = 관리자 단점)
    setTimer(target, "physBreak", DUR_BREAK);
    log.push(`  → 강타: 방어 불능 없음 → 1스택 부여`);
    return shatter;
  }
  if (a === "armor-break") {
    if (target.physBreak > 0) {
      const n = Math.min(4, target.physBreak);
      target.physBreak = 0;
      bumpVuln(target, "physical", ARMOR_VULN[n - 1]);
      add(target, "armor-break");
      log.push(`  → 갑옷 파괴! ${n}스택 소모 → ${ARMOR[n - 1] * 100}% 물리 + 물리취약 ${ARMOR_VULN[n - 1] * 100}%`);
      return shatter + self.attack * buff * ARMOR[n - 1];
    }
    target.physBreak = 1;
    setTimer(target, "physBreak", DUR_BREAK);
    log.push(`  → 갑옷 파괴: 방어 불능 없음 → 1스택 부여`);
    return shatter;
  }
  return shatter;
}

// 스킬 발동 피해(공격자 측). 연타는 배틀/궁 base에만 적용(강타 payoff는 제외).
export function baseDamage(skill: DDSkill, self: DDUnit): number {
  let dmg = self.attack * eb(self) * skill.power;
  if (self.multiHit > 0) {
    const n = Math.min(4, self.multiHit);
    if (skill.kind === "battle") dmg *= 1 + MH_BATTLE[n - 1];
    else if (skill.kind === "ult") dmg *= 1 + MH_ULT[n - 1];
  }
  return dmg;
}

export type DDState = { units: DDUnit[]; round: number; log: string[]; lastLinkAlly?: string; skillGauge: number; maxGauge: number };

export const living = (s: DDState, side?: "ally" | "enemy") =>
  s.units.filter((u) => u.hp > 0 && (!side || u.side === side));

export function pickTargets(s: DDState, self: DDUnit, skill: DDSkill): DDUnit[] {
  const foes = living(s, self.side === "ally" ? "enemy" : "ally");
  if (skill.target === "self") return [self];
  if (skill.target === "all") return foes;
  if (skill.target === "row") return [...foes].sort((a, b) => a.pos - b.pos).slice(0, 2);
  if (skill.target === "single-lowhp") return foes.length ? [foes.reduce((lo, e) => (e.hp < lo.hp ? e : lo), foes[0])] : [];
  return foes.length ? [[...foes].sort((a, b) => a.pos - b.pos)[0]] : []; // single-front
}

// 스킬이 지금 사용 가능한가(위치 + 게이지 + 요구사항)
export function usable(s: DDState, self: DDUnit, skill: DDSkill): boolean {
  if (!skill.fromPos.includes(self.pos)) return false;
  if (skill.selfUlt && self.ultCharge < self.ultCost) return false;
  if (skill.kind === "battle" && self.side === "ally" && s.skillGauge < (skill.gaugeCost ?? GAUGE_COST)) return false; // 스킬 게이지 부족
  if (skill.kind === "link" && self.linkCd > 0) return false; // 연계 쿨타임
  if (skill.requiresStance != null && self.stance < skill.requiresStance) return false; // 미브 스탠스 요구
  const tg = pickTargets(s, self, skill)[0];
  if (skill.requires && !skill.requires(tg, self, s)) return false;
  return true;
}

export const canAct = (u: DDUnit) => u.hp > 0 && !(u.side === "enemy" && u.staggered); // 불균형 적은 행동 불가

// 한 유닛의 행동 실행
export function act(s: DDState, self: DDUnit, skill: DDSkill): void {
  const log = s.log;
  log.push(`${self.name}[pos${self.pos}] → ${skill.name}`);
  // 자원: 스킬 게이지(파티 공유) 소모 + 궁극기 에너지(개인) 충전 — 위키 정합
  if (self.side === "ally") {
    if (skill.kind === "battle") {
      s.skillGauge = Math.max(0, s.skillGauge - (skill.gaugeCost ?? GAUGE_COST)); // 배틀 소모(미브 추형/개천 50)
      if (skill.gaugeRefund) s.skillGauge = Math.min(s.maxGauge, s.skillGauge + skill.gaugeRefund); // 미브 단운 50 반환
      for (const u of living(s, "ally")) u.ultCharge = Math.min(u.ultCost, u.ultCharge + ULT_BATTLE); // 배틀 → 아군 전체 +6.5
    } else if (skill.kind === "link") {
      self.ultCharge = Math.min(self.ultCost, self.ultCharge + ULT_LINK); // 연계 → 시전자 +10
      s.lastLinkAlly = self.id; // 팀 연계 윈도우(관리자 봉인 게이트)
      self.linkCd = skill.cooldown ?? LINK_CD; // 연계 쿨타임 진입
    } else if (skill.kind === "ult") {
      self.ultCharge = 0;
    }
  }
  const stg = skill.staggerVal ?? (skill.kind === "ult" ? 25 : 10);

  const elem = skElem(skill);
  const primaryPre = pickTargets(s, self, skill)[0]?.physBreak ?? 0; // 스탠스 판정용(강타 소모 전 방불)
  let executed = false; // 일반 공격 처형 여부
  for (const t of pickTargets(s, self, skill)) {
    let raw = baseDamage(skill, self); // 시전자 측 원 피해(공격력×증가×허약×배율)
    if (skill.kind === "attack" && t.staggered) { raw *= EXECUTE_MULT; executed = true; log.push(`  → 처형! 불균형 적 대량 물리`); }
    raw += applyAnomaly(skill, t, self, log); // 물리 이상 payoff(+쇄빙, 연타 미적용)
    if (skill.attach) raw += applyAttach(t, skill.attach, self, log); // 아츠 부착→폭발/이상
    if (skill.crystal && t.hp > 0) { add(t, "crystal"); log.push(`  → 오리지늄 결정 부착`); }
    if (skill.apply) skill.apply(t, self);
    const hadCrystal = has(t, "crystal"); // 현실 정지 판정(소모 전 기준)
    // 오리지늄 결정 소모: 결정 부착 적에게 물리 이상/궁극 → 결정 파괴 추가 물리 + 관리자 본질 붕괴(+30%)
    if (hadCrystal && (skill.anomaly || skill.kind === "ult")) {
      const adm = s.units.find((u) => u.id === "endministrator" && u.hp > 0);
      const src = adm ?? self;
      const coeff = skill.kind === "ult" ? 2.67 : 1.78; // 궁 추가 배율(267%) vs 연계 결정 파괴 배율(178%)
      raw += src.attack * eb(src) * coeff;
      rm(t, "crystal");
      if (adm) { adm.atkBuff = 0.3; setTimer(adm, "atkBuff", DUR_ATKBUFF); } // 본질 붕괴(15초≈3턴)
      log.push(`  → 오리지늄 결정 파괴! (${coeff * 100}%)${adm ? " · 관리자 본질 붕괴(+30%)" : ""}`);
    }
    // 글로벌 배율: 치명타 기댓값(시전자) → 증폭(시전자)+취약(대상,위계+부식) → 불균형(+30%) → 현실정지 → 비호
    let dmg = raw * (1 + self.critRate * self.critDmg); // 치명타 기댓값(RNG 대신)
    dmg *= 1 + ampFor(self, elem) + vulnFor(t, elem);
    if (t.staggered) dmg *= 1.3;
    if (hadCrystal && elem === "physical") dmg *= 1.2; // 관리자 현실 정지(물리 한정)
    if (skill.vsWeak && (vulnFor(t, "physical") > 0 || t.staggered)) dmg *= 1 + skill.vsWeak; // 미브 냉정(물취/불균형 적)
    dmg *= 1 - (t.protection || 0); // 비호
    dmg = mitigate(t, dmg, elem); // 방어력 + 물리/아츠 저항
    // 불균형치 적립 → 임계 도달 시 불균형 상태
    if (t.staggerMax > 0) {
      t.stagger += stg;
      if (!t.staggered && t.stagger >= t.staggerMax) {
        t.staggered = true; t.staggerTimer = 1; t.stagger = t.staggerMax;
        log.push(`  ⚡ ${t.name} 불균형 상태! 행동 불가 + 받는 피해 +30%`);
      }
    }
    const final = applyDamage(t, dmg); // 보호막(보호) 흡수 → 체력
    log.push(`  ${t.name} -${final} (HP ${t.hp}/${t.maxHp})`);
    if (t.hp === 0) log.push(`  ✗ ${t.name} 격파!`);
  }
  if (skill.kind === "attack" && self.side === "ally") { // 강력한 일격/처형 → 스킬 게이지 회복
    s.skillGauge = Math.min(s.maxGauge, s.skillGauge + (executed ? EXEC_RECOVER : BASIC_RECOVER));
  }
  if (self.rampAtk && self.side === "ally" && skill.kind !== "attack") { // 진천우 칼날 베기(스킬마다 공격력 누적, 최대 5스택, 10초≈2턴)
    self.atkBuff = Math.min(5 * self.rampAtk, (self.atkBuff || 0) + self.rampAtk);
    setTimer(self, "atkBuff", 2);
  }
  // 미브 청파 삼형 스탠스 전환(2턴 윈도우)
  if (skill.stanceFromCrush) { self.stance = primaryPre >= 3 ? 2 : 0; setTimer(self, "stance", 2); }
  else if (skill.setStanceTo != null) { self.stance = skill.setStanceTo; setTimer(self, "stance", 2); }
  if (self.multiHit > 0 && (skill.kind === "battle" || skill.kind === "ult")) self.multiHit = 0; // 연타 소모
}

// 라운드 시작: DoT + 불균형 회복
export function startRound(s: DDState): void {
  s.round++;
  s.skillGauge = Math.min(s.maxGauge, s.skillGauge + GAUGE_REGEN); // 스킬 게이지 자연 회복(파티 공유)
  for (const u of living(s)) {
    if (u.dot > 0) { u.hp = Math.max(0, u.hp - u.dot); s.log.push(`${u.name} 지속 피해 -${u.dot}`); }
    if (u.staggered) {
      u.staggerTimer -= 1;
      if (u.staggerTimer <= 0) { u.staggered = false; u.stagger = 0; s.log.push(`${u.name} 불균형 회복`); }
    }
    for (const key of Object.keys(u.timers)) { if (--u.timers[key] <= 0) { delete u.timers[key]; expire(u, key); } } // 효과 지속시간 감쇠
    if (u.linkCd > 0) u.linkCd -= 1; // 연계 쿨타임 감소
  }
}

export function isOver(s: DDState): "ally" | "enemy" | null {
  if (!living(s, "ally").length) return "enemy";
  if (!living(s, "enemy").length) return "ally";
  return null;
}

export function turnOrder(s: DDState): DDUnit[] {
  const spd = (u: DDUnit) => u.speed + (u.speedMod || 0); // 가속/감속 반영
  return living(s).sort((a, b) => spd(b) - spd(a) || a.id.localeCompare(b.id));
}
