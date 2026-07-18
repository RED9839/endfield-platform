// DD 전투 시뮬 헬퍼 — AI(아군 자동/적) + 인카운터 + 전투 생성. UI와 테스트가 공유(부작용 없음).
import { BASIC, DDState, DDUnit, DDSkill, Element, ELEMENTS, applyAttach, applyDamage, healUnit, living, mitigate, usable, pickTargets, vulnFor, onAllyHit, EXECUTE_MULT, GAUGE_COST, setLinkChain } from "./combat";
import { SKILLS, makeAlly, makeEnemy, ENEMY_DEFS, enemyDefFor, frontlineOrder, enemyArchetype } from "./roster";
import { applyGear, GEAR_SLOTS, type Loadout, type GearSlot } from "./gear";
import { applyWeapon } from "./weapons";
import type { OpProgress } from "./progress";
import { rewardItemPool } from "./items";

const EL_TAG: Record<Element, string> = { heat: "열기 ", electric: "전기 ", cryo: "냉기 ", nature: "자연 " };

// 연계/궁 연쇄 provider 등록 — combat.ts가 roster(SKILLS)를 직접 import하면 순환이라 주입 방식.
// 원작은 연계도 궁도 "메인 행동에 반응해 즉시 끼어드는" 즉발이다(레바테인 궁 → 울프가드 연계 → 울프가드 궁).
// 우리는 ATB 속도순 독립 턴이라 셋업이 느리면 페이오프가 창을 못 받아먹음 → 셋업 직후 턴을 앞당겨 쓰게 한다.
// allyChoose를 그대로 재사용 → 보스 전 궁 보류·셋업 가치·상태 인지 등 기존 판단이 전부 유지된다.
// 끼어든 오퍼는 atb -= 100(자기 턴 소진)이라 총 행동 수는 불변.
setLinkChain((s, self) => {
  let best: { unit: DDUnit; skill: DDSkill } | null = null;
  for (const a of living(s, "ally")) {
    // 장방이 「변화의 숨결」은 원작이 "**자신이** 감전 적 강평 → 자기 연계 턴 끌어당김"인 self-chain이다.
    // allyChoose는 배틀(zfy-b +6)에 밀려 연계를 안 골라(창 열려도 0회) 여기서 직접 발동한다.
    const selfChain = a === self && a.id === "zhuangfangyi";
    if (a === self && !selfChain) continue;
    const pick = selfChain
      ? (SKILLS[a.id] ?? []).find((o) => o.kind === "link" && usable(s, a, o))
      : allyChoose(s, a);
    // 연계만 끼어든다. 궁도 원작은 즉발이지만, 연쇄 대상에 넣어도 궁 비중이 3%에서 안 움직였다
    // — 병목이 "턴을 못 잡아서"가 아니라 "충전을 못 해서"라 기회를 줘도 쓸 게 없음. 부작용(순서 흔들림)만 남아 제외.
    if (!pick || pick.kind !== "link") continue;
    if (!best || pick.power > best.skill.power) best = { unit: a, skill: pick };
  }
  return best;
});

// 아군 AI: 사용 가능 스킬 중 점수 최대. usage gate가 셋업→페이오프를 자동 정렬.
export function allyChoose(s: DDState, self: DDUnit): DDSkill | null {
  // 예약된 연계(ATB 우선으로 끼어든 오퍼) — 자기 차례에 그 연계를 발동
  if (self.pendingLink) { const sk = self.pendingLink; self.pendingLink = undefined; return usable(s, self, sk) ? sk : null; }
  const skills = [...(SKILLS[self.id] ?? []), BASIC];
  const opts = skills.filter((sk) => usable(s, self, sk));
  if (!opts.length) return null;
  // 이본 「아이스 슈터」 변신 중엔 강화 평타 말뚝딜 — 원작이 "메인 전환 후 7초간 강화 일반공격"인 스킬.
  // 점수로 두면 배틀(얼음 폭탄 = 111% + 스택당 89%)이 강화 평타(≈133%)를 이겨서 치확 스택이 안 쌓임.
  if (self.id === "yvonne" && (self.timers.iceshot || 0) > 0) {
    const basic = opts.find((o) => o.kind === "attack");
    if (basic) return basic;
  }
  const score = (sk: DDSkill) => {
    const t = pickTargets(s, self, sk)[0];
    // 점수 단위 = 배율(power). 평타도 실제 배율(0.5)로 재서 스킬과 같은 저울에 올린다.
    // (기존엔 평타 base 1 + 처형 +12라 처형이 모든 스킬을 압살 → 아케쿠리 연계 0회 등)
    if (sk.kind === "attack") {
      let v = sk.power * (t?.staggered ? EXECUTE_MULT : 1);      // 처형 = 0.5×6 = 3.0
      if (self.id === "ember") v *= t?.staggered ? 14 : 8.6;      // 엠버 강화 평타(combat.ts 훅 실값)
      // 변신 중 강화 평타 — 변신기의 핵심 딜 수단인데 AI가 몰라 배틀/연계를 치고 있었음(combat.ts 훅 실값과 동기)
      if (self.id === "laevatain" && (self.timers.twilight || 0) > 0) v *= 3;    // 황혼: 범위 강화 평타(부착→흡수 사이클)
      // 평타에 게이지 가산점을 주면 안 된다 — 배틀 점수가 power뿐(카뮤 0.89)이라 평타(0.5+가산)에 지고
      // 부착 셋업이 굶는다. 게이지 부족은 usable()이 이미 배틀을 막으므로 평타는 자동으로 선택된다.
      return v;
    }
    let v = sk.power;
    // 게이지 수급 가치: 파티 공유 게이지가 마를수록 수급 스킬이 귀하다. 배틀 1회 = 100.
    // 소모는 여기서 감점하지 않는다 — usable()이 이미 게이지 부족을 게이팅하므로 이중 페널티가 된다.
    if (sk.gaugeGain) v += (sk.gaugeGain / 100) * 4 * (s.skillGauge < GAUGE_COST * 1.5 ? 2 : 1);
    // 딜 사이클: 게이지는 파티 공유 자원이다. 원작은 메인 컨트롤 오퍼가 배틀을 굴리고 나머지는
    // 연계(무소모)로 붙는데, 우리는 4명이 각자 질러 정작 메인딜러가 굶는다(레바테인 배틀 9회 / 울프가드 141회).
    // → 메인이 아닌 오퍼는 게이지가 빠듯하면 배틀을 양보. 여유가 있으면(2회분 이상) 평소대로 쓴다.
    // 단, **메인의 스킬 조건을 열어주는 셋업은 양보하지 않는다** — 원작 사이클이
    // 「펠리카 배틀(전기 부착) → 장방이 강평 → 장방이 연계」처럼 부착원이 먼저이기 때문.
    // (양보 규칙만 넣었더니 펠리카 배틀 23회로 굶어 장방이 연계가 0회가 됐다)
    if (sk.kind === "battle" && !self.isMain && s.skillGauge < GAUGE_COST * 2) {
      const main = living(s, "ally").find((a) => a.isMain);
      // 메인이 이 부착을 먹고 사는가 — 연계 조건(부착/이상/연소·감전·동결·부식)이거나 흡수형 재능(레바테인).
      // 조건 문구가 "연소/부식 적"처럼 부착이라 안 적혀도 부착이 연료다. 좁게 잡았더니 카뮤가 141회 양보해
      // 레바테인 연료가 끊겼다(평타 0.50 vs 배틀 0.89+2.5-4 = -0.61).
      // 단, 메인이 **이미 셋업이 찼으면** 연료가 더 필요 없다 → 이때는 양보해서 페이오프를 터뜨리게 한다.
      // (레바테인은 4스택 40턴 중 19턴만 배틀 가능 — 카뮤 81·울프 72가 예외로 게이지를 다 먹어서였다)
      const mainReady = !!main && ((main.id === "laevatain" && (main.procCount ?? 0) >= 4) ||
        (SKILLS[main.id] ?? []).some((o) => o.kind !== "attack" && o.kind !== "ult" && usable(s, main, o)));
      const feedsMain = !!main && !!sk.attach && !mainReady && (main.id === "laevatain" ||
        (SKILLS[main.id] ?? []).some((o) => o.kind !== "attack" && !usable(s, main, o) &&
          /부착|이상|연소|감전|동결|부식/.test(o.requiresText ?? "")));
      if (main && !feedsMain) v -= 4;
    }
    // 셋업 가치: 내가 만드는 상태를 요구하는 스킬이 지금 잠겨 있으면 우선(딜 0이라 점수 0인 셋업 구제).
    if (sk.grants) {
      const mine = SKILLS[self.id] ?? [];
      if (mine.some((o) => o.requiresText?.includes(sk.grants!) && !usable(s, self, o))) v += 5;
    }
    // 스탠스 셋업(미브 단운→추형→개천): 더 높은 스탠스를 요구하는 스킬이 있으면 올린다.
    if (sk.setStanceTo != null && sk.setStanceTo > (self.stance ?? 0)) {
      const mine = SKILLS[self.id] ?? [];
      if (mine.some((o) => (o.requiresStance ?? 0) > (self.stance ?? 0) && (o.requiresStance ?? 0) <= sk.setStanceTo!)) v += 4;
    }
    if (sk.selfUlt) {
      v += 10;
      // 보스 전엔 궁을 아낀다 — 게이지가 런 내내 이월되므로 보스 진입 만충이 목표.
      // 단, 아군이 위기이거나 이 궁으로 확실히 처치되면 지금 쓴다(아껴서 지면 의미 없음).
      if (!s.boss) {
        const danger = living(s, "ally").some((a) => a.hp / a.maxHp < 0.35);
        const lethal = !!t && t.hp < self.attack * sk.power * 1.2;
        if (!danger && !lethal) v -= 18; // 보류 → 배틀/연계/평타에 밀림
      }
    }
    // ── 버프/디버프 상태 인지 ──
    // 이 스킬이 이미 걸어둔 효과가 아직 살아있으면 재적용은 낭비(effectSrc.via = 건 스킬 이름).
    const dup = (u: DDUnit | undefined) => !!u && Object.entries(u.effectSrc ?? {}).some(([k, src]) => src?.via === sk.name && (u.timers?.[k] ?? 0) > 0);
    if (dup(t) || dup(self)) v -= 3;
    // 아츠 부착: 부착은 딜이 아니라 **사이클 연료**다(레바테인 흡수·아군 연계 조건·아츠 이상·세트 발동).
    // power만 보면 카뮤 배틀(0.89)이 처형 평타(0.5×6=3.0)에 져서 부착 셋업이 통째로 굶었다.
    if (sk.attach && t) {
      const cur = t.arts[sk.attach] ?? 0;
      if (ELEMENTS.some((e) => e !== sk.attach && (t.arts[e] ?? 0) > 0)) v += 8; // 아츠 이상 성립 → 최우선
      else if (cur >= 4) v -= 3;      // 만스택 → 더 붙여도 낭비
      else {
        v += 2.5;                     // 기본 셋업 가치
        // 이 부착이 아군 연계 조건을 열어주면(연쇄) 추가 가치 — 셋업→페이오프 짝 맞추기
        if (living(s, "ally").some((a) => a !== self && (a.linkCd ?? 0) <= 0 &&
            (SKILLS[a.id] ?? []).some((o) => o.kind === "link" && /아츠 ?부착|열기 ?부착/.test(o.requiresText ?? "")))) v += 3;
      }
    }
    // 상태 소모형 페이오프: 조건이 실제로 서 있을 때만 값이 있다.
    // 단, 그 상태를 "요구"하는 다른 스킬이 지금 사용 가능하면 소모를 미룬다 — 셋업을 페이오프가 까먹는 것 방지.
    // (아크라이트: 배틀 「질풍 섬광」이 감전을 소모하면 연계 「천둥의 울림」이 잠김 → 실제 운용도 연계+궁 위주)
    const needs = (state: string) => opts.some((o) => o !== sk && o.kind !== "attack" && o.requiresText?.includes(state));
    if (sk.shockBonus && t?.statuses?.includes("shock") && !needs("감전")) v += 5;
    // 울프가드 「탄흔의 열기」: 연소/감전 상태면 "열기 부착 대신" 그 상태를 소모하고 추가타.
    // 실제 운용은 울프가드 딜이 미미해 부착용으로만 쓰고, 부착/연소된 적에겐 쓰지 않아 레바테인이 열기를 흡수하게 둔다.
    // → 소모 분기(부착 생략)는 회피한다. 부착이 팀 사이클(레바테인 녹아내린 불꽃)의 연료.
    if (sk.burnShockConsume && (t?.statuses?.includes("combustion") || t?.statuses?.includes("shock"))) v -= 5;
    if (sk.forceShock && (t?.arts.electric ?? 0) > 0) v += 5;
    if ((sk.forceFreeze || sk.iceBomb) && t && (t.arts.cryo ?? 0) + (sk.iceBomb ? t.arts.nature ?? 0 : 0) > 0) v += 4;
    if (sk.cryoNuke && t) v += (t.arts.cryo ?? 0) >= 2 ? 6 : -2; // 냉기 스택 없이 쓰면 헛방
    // 레바테인 「불타오르는 화염」: 4스택에서 터뜨려야 광역 폭발 + 강제 연소 + 궁 +100(비용 300 → 3회면 만충).
    // 원문상 스택은 "강력한 일격/처형 명중 후 주변 열기 부착 흡수"로 쌓이므로, 4스택 전엔 배틀을 아끼고 평타로 흡수한다.
    if (sk.id === "lae-b") v += (self.procCount ?? 0) >= 4 ? 8 : -4;
    // 장방이 「뇌정의 부름」: 감전을 소모하면 청뢰검 +2, 없으면 3자루까지만 +1 — **3자루 이상 & 감전 없으면 생성 0**.
    // 그런데 무조건 +6이라 아무것도 안 만드는 배틀을 난사하며 게이지를 태우고, 정작 부착원(펠리카 배틀 19회)을 굶겼다.
    // 원작 사이클도 「펠리카 배틀(전기 부착) → 장방이 강평 → 장방이 연계」로 부착이 먼저다.
    if (sk.id === "zfy-b") v += (t?.statuses?.includes("shock") || (self.procCount ?? 0) < 3) ? 6 : -4;
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

  // 타겟팅: 컨셉(역할) 아키타입별 우선 대상 — 대형의 다른 부위를 위협해 배치·보호 전략 유도
  //  front=전열(탱커 벽) / wounded=저체력%(부상 딜러 마무리) / threat=최고위협(강화된 딜러 직격)
  const tgt = enemyArchetype(def?.role ?? "", behavior).tgt;
  const byFront = [...foes].sort((a, b) => a.pos - b.pos);
  const byWounded = [...foes].sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp || a.pos - b.pos);
  const byThreat = [...foes].sort((a, b) => b.attack * (1 + (b.atkBuff || 0)) - a.attack * (1 + (a.atkBuff || 0)) || a.pos - b.pos);
  const pick = () => (tgt === "wounded" ? byWounded[0] : tgt === "threat" ? byThreat[0] : byFront[0]);
  let targets: DDUnit[];
  if (behavior === "aoe") { const wide = (self.procCount = (self.procCount || 0) + 1) % 2 === 1; targets = wide ? foes : [pick()]; } // 광역: 전체 나눔공격(격턴)/평시 단일
  else targets = [pick()];
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
    onAllyHit(s, self, t, dmg, s.log); // 아군 피격 트리거(엠버 강철·레바테인 불씨·디펜더 패링)
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
  const base = k === "boss" ? { parts: 60, permits: 10 } : k === "elite" ? { parts: 38, permits: 6 } : { parts: 24, permits: 4 };
  const depthBonus = Math.floor(depth * (k === "boss" ? 3 : 1.5)); // 깊을수록 재료↑
  const factionBonus = FACTION_POOL[faction]?.boss.length ? 0 : 0; // (세력별 특화 여지)
  return { parts: base.parts + depthBonus + factionBonus, permits: base.permits + (k === "boss" ? Math.floor(depth / 2) : 0), items: rewardItemPool(faction, k, depth) };
}

// 아군(선택 순서=포지션, 지속 HP·장비 로드아웃) + 인카운터로 전투 상태 생성. 게이지 200/300(+장비 시작 게이지).
export function createBattle(party: { id: string; hp?: number; loadout?: Loadout; progress?: OpProgress; ult?: number }[], enc: Encounter, owned?: Record<string, number>, boss?: boolean): DDState {
  let bonusGauge = 0;
  // 전열 배치 규칙 적용: 물몸 딜러 앵커 보호(pos2), 탱/뱅가드 전열(pos1). 선택 순서(로드아웃 유지)는 id로 재매핑.
  const order = frontlineOrder(party.map((p) => p.id));
  const ordered = order.map((id) => party.find((p) => p.id === id)!).filter(Boolean) as typeof party;
  const mainId = party[0]?.id; // 편성 첫 오퍼 = 메인딜러(공략 시트 채용파티는 주인이 첫 번째)
  const allies = ordered.map((p, i) => {
    const u = makeAlly(p.id, i + 1, p.progress); // 정예화·스킬랭크·장비강화(gearGrade) 반영
    if (p.id === mainId) u.isMain = true;
    if (p.hp != null) u.hp = Math.max(1, Math.min(u.maxHp, p.hp)); // 지속 HP(소모전)
    if (p.ult != null) u.ultCharge = Math.max(0, Math.min(u.ultCost, p.ult)); // 궁 게이지 이월 — 전투마다 0으로 리셋되면 고비용 궁(220~240)은 영원히 못 씀
    // 맨몸 시작 — 공업소에서 제작(owned)한 피스만 장착. 미제작 슬롯은 미적용(기본 스탯).
    let equipped: Loadout | undefined; let levels: Partial<Record<GearSlot, number>> | undefined;
    if (p.loadout && owned) for (const slot of GEAR_SLOTS) { const ref = p.loadout[slot]; if (ref && owned[ref] != null) { (equipped ??= {})[slot] = ref; (levels ??= {})[slot] = owned[ref]; } }
    bonusGauge += applyGear(u, equipped, 0, levels); // 제작된 피스만: 세트 효과 + 부위 단조 스케일
    applyWeapon(u); // 시그니처 무기: 공격력 +10% + 타입 고유효과
    return u;
  });
  const enemies = enc.make();
  return { units: [...allies, ...enemies], round: 0, log: [], skillGauge: Math.min(300, 200 + bonusGauge), maxGauge: 300, boss };
}
