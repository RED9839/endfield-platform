// DD 전투 시뮬 헬퍼 — AI(아군 자동/적) + 인카운터 + 전투 생성. UI와 테스트가 공유(부작용 없음).
import { BASIC, DDState, DDUnit, DDSkill, Element, applyAttach, applyDamage, healUnit, living, mitigate, usable, pickTargets, vulnFor } from "./combat";
import { SKILLS, makeAlly, makeEnemy, ENEMY_DEFS, enemyDefFor, frontlineOrder } from "./roster";
import { applyGear, GEAR_SLOTS, type Loadout, type GearSlot } from "./gear";
import type { OpProgress } from "./progress";
import { rewardItemPool } from "./items";

const EL_TAG: Record<Element, string> = { heat: "열기 ", electric: "전기 ", cryo: "냉기 ", nature: "자연 " };

// 아군 AI: 사용 가능 스킬 중 점수 최대. usage gate가 셋업→페이오프를 자동 정렬.
export function allyChoose(s: DDState, self: DDUnit): DDSkill | null {
  const skills = [...(SKILLS[self.id] ?? []), BASIC];
  const opts = skills.filter((sk) => usable(s, self, sk));
  if (!opts.length) return null;
  const score = (sk: DDSkill) => {
    const t = pickTargets(s, self, sk)[0];
    if (sk.kind === "attack") {
      let v = 1;
      if (t && t.staggered) v += 12; // 처형
      if (s.skillGauge < 100) v += 3; // 게이지 회복
      return v;
    }
    let v = sk.power;
    if (sk.selfUlt) v += 10;
    // 빌더 배틀(레바테인 녹아내린 불꽃·장방이 청뢰검): power 필드가 엔진훅 실가치(스택+자가충전)를 과소표현 → usable이면 깡평타보다 우선. 게이지 소진 시 usable 게이트가 평타로 자동 전환하므로 국소적.
    if (sk.id === "lae-b" || sk.id === "zfy-b") v += 6;
    const stacks = t ? t.physBreak : 0;
    if (sk.kind === "link") v += 2;
    if (sk.crystal && t && !t.statuses?.includes("crystal") && stacks >= 2) v += 6;
    if (sk.anomaly === "launch" || sk.anomaly === "knockdown") { if (stacks < 4) v += 2.5; }
    if (sk.anomaly === "crush" || sk.anomaly === "armor-break") {
      if (stacks >= 3 || (t && t.hp < self.attack * 5)) v += 9;
      else if (stacks >= 1) v += stacks - 2.5;
      else v -= 3;
      if (t && t.statuses?.includes("crystal")) v += 4;
    }
    if (sk.target === "all" || sk.target === "row") v += living(s, "enemy").length > 1 ? 1.5 : 0;
    return v;
  };
  return opts.reduce((a, b) => (score(b) > score(a) ? b : a), opts[0]);
}

// 적 AI: 세력별 역할(behavior)에 따라 근접/저격/광역/중장/치유/강화 행동. 속성·부착·잡기 반영.
export function enemyAct(s: DDState, self: DDUnit): void {
  const def = enemyDefFor(self.id);
  const behavior = def?.behavior ?? "melee";
  const elem: "physical" | Element = def?.element ?? "physical";
  const foes = living(s, "ally");
  if (!foes.length) return;
  const mates = living(s, "enemy").filter((m) => m !== self);

  // 치유병(겁운객 연막 등): 가장 다친 아군(적) 회복 후 종료. 대상 없으면 공격으로 전환.
  if (behavior === "heal") {
    const hurt = mates.filter((m) => m.hp < m.maxHp).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (hurt) { healUnit(hurt, hurt.maxHp * 0.18, s, s.log); s.log.push(`${self.name}[적] → ${hurt.name} 치유`); return; }
  }
  // 증폭체(굴절아겔로스): 미강화 아군(적) 공격력 강화 후 종료. 대상 없으면 공격으로 전환.
  if (behavior === "buff") {
    const tgt = mates.find((m) => (m.atkBuff || 0) <= 0);
    if (tgt) { tgt.atkBuff = 0.4; tgt.timers.atkBuff = 3; s.log.push(`${self.name}[적] → ${tgt.name} 강화(공격력 +40%)`); return; }
  }

  // 타겟팅: 광역=전체 나눔공격(격턴)/평시 단일 / 저격=최저 체력(후열 저격) / 그 외=전열
  const byFront = [...foes].sort((a, b) => a.pos - b.pos);
  let targets: DDUnit[];
  if (behavior === "aoe") { const wide = (self.procCount = (self.procCount || 0) + 1) % 2 === 1; targets = wide ? foes : [byFront[0]]; }
  else if (behavior === "snipe") targets = [[...foes].sort((a, b) => a.hp - b.hp)[0]];
  else targets = [byFront[0]];
  const powerMul = behavior === "heavy" ? 1.55 : 1; // aoe는 makeEnemy에서 공격력 이미 하향
  const atkMul = 1 + (self.atkBuff || 0);

  for (const t of targets) {
    if (t.hp <= 0) continue;
    // 장방이 「하늘의 가호」: 9% + 청뢰검당 1% 확률 피해 면역(램프될수록 단단) + 첫 발동 시 최대 HP 18% 회복
    if (t.id === "zhuangfangyi" && Math.random() < 0.09 + 0.01 * (t.procCount || 0)) {
      if (!(t.timers.tiangu > 0)) { healUnit(t, Math.round(t.maxHp * 0.18), s, s.log); t.timers.tiangu = 999; }
      s.log.push(`${self.name}[적] → ${t.name} 하늘의 가호! 피해 면역 (청뢰검 ${t.procCount || 0})`);
      continue;
    }
    // 안탈 「무의식」: 30% 확률 물리 면역 + 자기 회복
    if (t.id === "antal" && elem === "physical" && Math.random() < 0.30) {
      healUnit(t, Math.round(t.maxHp * 0.04), s, s.log);
      s.log.push(`${self.name}[적] → ${t.name} 무의식! 물리 면역 + 회복`);
      continue;
    }
    const raw = self.attack * atkMul * powerMul * (1 + vulnFor(t, elem)) * (1 - (t.protection || 0));
    const dmg = applyDamage(t, mitigate(t, raw, elem));
    s.log.push(`${self.name}[적] → ${t.name} ${elem !== "physical" ? EL_TAG[elem] : ""}공격 -${dmg} (HP ${t.hp}/${t.maxHp})`);
    if (t.hp <= 0) { s.log.push(`  ✗ ${t.name} 전투불능!`); continue; }
    // 아츠 부착(침식체 냉기·염술사 열기): 아군에 부착 → 연소/동결 등 이상 유발
    if (def?.attach) { const ex = applyAttach(t, def.attach, self, s.log); if (ex > 0) applyDamage(t, mitigate(t, ex, def.attach)); }
    // 잡기/속박: 확률로 시간 정지 1턴(다음 라운드 시작 시 해제). 슈퍼아머(카치르·스노우샤인 디펜더)는 저항.
    if (def?.bind && Math.random() < 0.5) {
      if (t.id === "catcher" || t.id === "snowshine") s.log.push(`  → ${t.name} 슈퍼아머! 잡기 저항`);
      else { t.timers.stun = 1; if (!t.statuses.includes("stun")) t.statuses.push("stun"); s.log.push(`  → ${t.name} 잡기! 시간 정지(1턴)`); }
    }
  }
}

// 현재 유닛이 지금 쓸 수 있는 스킬(일반 공격 포함)
export function usableSkills(s: DDState, u: DDUnit): DDSkill[] {
  return [...(SKILLS[u.id] ?? []), BASIC].filter((sk) => usable(s, u, sk));
}

export type Encounter = { key: string; name: string; desc: string; make: () => DDUnit[] };

const D = ENEMY_DEFS;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const comp = (...ids: (keyof typeof ENEMY_DEFS)[]) => (): DDUnit[] => ids.map((id, i) => makeEnemy(D[id], i + 1));

// 세력별 교전 편성(랜덤 배치). 정예·보스는 티어 상향.
const NORMAL_COMPS = [
  comp("rockhowler", "acid-slug", "firemist-slug"),      // 야외 생물
  comp("ram", "sting", "sting"),                          // 아겔로스(4번협곡)
  comp("mudflow", "hedron", "prism"),                     // 수화자(무릉)
  comp("bk-raider", "bk-raider", "bk-pyromancer"),        // 랜드브레이커
  comp("highway-reaver", "cloud-stalker", "highway-reaver"), // 청파채
];
const ELITE_COMPS = [
  comp("manglerbeast", "rakerbeast", "quillbeast"),       // 야외 생물
  comp("sentinel", "effigy", "heavy-sting"),              // 아겔로스(4번협곡)
  comp("tidewalker", "hedron", "prism"),                  // 수화자(무릉)
  comp("bk-siege", "bk-ballista", "bk-pyromancer"),       // 랜드브레이커
  comp("hill-smasher", "cloud-obliterator", "cloud-stalker"), // 청파채
];
const BOSS_COMPS = [
  comp("craghowler", "rockhowler"),                       // 야외 생물
  comp("triaggelos", "sting", "sting"),                   // 아겔로스(광맥 구역 보스)
  comp("nefarith", "bk-raider"),                          // 랜드브레이커
  comp("ruan-yi", "highway-reaver"),                      // 청파채(무릉 보스)
  comp("tidalklast", "mudflow", "mudflow"),               // 수화자(중간보스)
  comp("marble-aggelo"),                                  // 아겔로스(4번협곡 최종)
];

export const ENCOUNTERS: Encounter[] = [
  { key: "normal", name: "교전", desc: "야생·무장 세력 소대", make: () => pick(NORMAL_COMPS)() },
  { key: "elite", name: "정예 교전", desc: "정예 부대·중장 개체", make: () => pick(ELITE_COMPS)() },
  { key: "boss", name: "보스 교전", desc: "던전 심층의 우두머리", make: () => pick(BOSS_COMPS)() },
];

// ===== 세력 리전 시스템 — 런마다 한 세력, 깊이별 티어 스케일 (분포도 리뉴얼) =====
// ENEMY_DEFS를 세력·티어로 자동 그룹. 각 세력이 얕은 깊이=잡몹 → 깊은 깊이=정예 → 보스.
export type FactionKey = string;
export const FACTION_POOL: Record<string, { byTier: Partial<Record<string, string[]>>; boss: string[]; name: string }> = {};
for (const [id, d] of Object.entries(ENEMY_DEFS)) {
  const f = (FACTION_POOL[d.faction] ??= { byTier: {}, boss: [], name: d.faction });
  if (d.tier === "boss") f.boss.push(id);
  else (f.byTier[d.tier] ??= []).push(id);
}
export const FACTIONS: FactionKey[] = Object.keys(FACTION_POOL).filter((f) => FACTION_POOL[f].boss.length); // 보스 있는 세력만 리전
const TIER_RANK = ["common", "normal", "enhanced", "advanced", "alpha", "elite"];
const TIERS_NORMAL = ["common", "normal", "enhanced", "advanced"];
const TIERS_ELITE = ["advanced", "alpha", "elite"];
const tierAt = (kind: string, depth: number, maxDepth: number) => { const arr = kind === "elite" ? TIERS_ELITE : TIERS_NORMAL; const prog = maxDepth > 0 ? depth / maxDepth : 0; return arr[Math.min(arr.length - 1, Math.floor(prog * arr.length))]; };
// 세력에서 목표 티어(없으면 최근접) 적 1마리 id
function enemyOfTier(faction: string, tier: string): string {
  const pool = FACTION_POOL[faction];
  const exact = pool.byTier[tier];
  if (exact && exact.length) return pick(exact);
  const want = TIER_RANK.indexOf(tier);
  const avail = Object.keys(pool.byTier).sort((a, b) => Math.abs(TIER_RANK.indexOf(a) - want) - Math.abs(TIER_RANK.indexOf(b) - want));
  const ids: string[] = pool.byTier[avail[0]] ?? Object.values(pool.byTier).flatMap((x) => x ?? []);
  return ids.length ? pick(ids) : "rockhowler";
}
// 리전 교전 생성: 세력 + 노드종류 + 깊이 → 편성
export function regionEncounter(faction: string, kind: NodeKind, depth: number, maxDepth: number): DDUnit[] {
  const pool = FACTION_POOL[faction] ?? FACTION_POOL[FACTIONS[0]];
  if (kind === "boss") { const bid = pool.boss.length ? pick(pool.boss) : "craghowler"; return [makeEnemy(D[bid], 1), makeEnemy(D[enemyOfTier(faction, "enhanced")], 2)]; }
  const tier = tierAt(kind, depth, maxDepth); const n = kind === "elite" ? 3 : 2 + (self => self)(depth % 2); // 정예 3 / 일반 2~3
  return Array.from({ length: Math.min(3, n) }, (_, i) => makeEnemy(D[enemyOfTier(faction, tier)], i + 1));
}
type NodeKind = "battle" | "elite" | "boss" | "rest";
const NODE_TO_KIND: Record<NodeKind, "normal" | "elite" | "boss"> = { battle: "normal", elite: "elite", boss: "boss", rest: "normal" };

// ===== 드랍테이블 리뉴얼 — 세력·티어·깊이별 재료(장비 부품·관리권) + 아이템 =====
export function enemyDrop(kind: NodeKind, depth: number, faction: string): { parts: number; permits: number; items: string[] } {
  const k = NODE_TO_KIND[kind];
  const base = k === "boss" ? { parts: 32, permits: 5 } : k === "elite" ? { parts: 16, permits: 2 } : { parts: 8, permits: 1 };
  const depthBonus = Math.floor(depth * (k === "boss" ? 3 : 1.5)); // 깊을수록 재료↑
  const factionBonus = FACTION_POOL[faction]?.boss.length ? 0 : 0; // (세력별 특화 여지)
  return { parts: base.parts + depthBonus + factionBonus, permits: base.permits + (k === "boss" ? Math.floor(depth / 2) : 0), items: rewardItemPool(k) };
}

// 아군(선택 순서=포지션, 지속 HP·장비 로드아웃) + 인카운터로 전투 상태 생성. 게이지 200/300(+장비 시작 게이지).
export function createBattle(party: { id: string; hp?: number; loadout?: Loadout; progress?: OpProgress }[], enc: Encounter, owned?: Record<string, number>): DDState {
  let bonusGauge = 0;
  // 전열 배치 규칙 적용: 물몸 딜러 앵커 보호(pos2), 탱/뱅가드 전열(pos1). 선택 순서(로드아웃 유지)는 id로 재매핑.
  const order = frontlineOrder(party.map((p) => p.id));
  const ordered = order.map((id) => party.find((p) => p.id === id)!).filter(Boolean) as typeof party;
  const allies = ordered.map((p, i) => {
    const u = makeAlly(p.id, i + 1, p.progress); // 정예화·스킬랭크·장비강화(gearGrade) 반영
    if (p.hp != null) u.hp = Math.max(1, Math.min(u.maxHp, p.hp)); // 지속 HP(소모전)
    // 부위별 단조: 제작(owned) 보유 피스는 그 단조 레벨, 미보유는 정예화 gearLevel 폴백
    let levels: Partial<Record<GearSlot, number>> | undefined;
    if (p.loadout && owned) for (const slot of GEAR_SLOTS) { const ref = p.loadout[slot]; if (ref && owned[ref] != null) (levels ??= {})[slot] = owned[ref]; }
    bonusGauge += applyGear(u, p.loadout, p.progress?.gearLevel ?? 0, levels); // 세트 효과 + 부위 개별 메인 옵션(제작 단조 스케일)
    return u;
  });
  const enemies = enc.make();
  return { units: [...allies, ...enemies], round: 0, log: [], skillGauge: Math.min(300, 200 + bonusGauge), maxGauge: 300 };
}
