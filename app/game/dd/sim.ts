// DD 전투 시뮬 헬퍼 — AI(아군 자동/적) + 인카운터 + 전투 생성. UI와 테스트가 공유(부작용 없음).
import { BASIC, DDState, DDUnit, DDSkill, Element, ELEMENTS, applyAttach, applyEnemyArts, applyDamage, healUnit, living, mitigate, usable, pickTargets, vulnFor, onAllyHit, EXECUTE_MULT, GAUGE_COST, setLinkChain, bumpVuln, setTimer, arcaneForm, setPhaseHook, runPhases } from "./combat";
import { SKILLS, makeAlly, makeEnemy, ENEMY_DEFS, enemyDefFor, enemyArchetype } from "./roster";
import { applyGear, GEAR_SLOTS, LOADOUT_SLOTS, type Loadout, type GearSlot, type LoadoutSlot } from "./gear";
import { applyWeapon } from "./weapons";
import type { OpProgress } from "./progress";
import { rewardItemPool } from "./items";
import { aggroWeight } from "./aggro";


const EL_TAG: Record<Element, string> = { heat: "열기 ", electric: "전기 ", cryo: "냉기 ", nature: "자연 " };

// 연계/궁 연쇄 provider 등록 — combat.ts가 roster(SKILLS)를 직접 import하면 순환이라 주입 방식.
// 원작은 연계도 궁도 "메인 행동에 반응해 즉시 끼어드는" 즉발이다(레바테인 궁 → 울프가드 연계 → 울프가드 궁).
// 우리는 ATB 속도순 독립 턴이라 셋업이 느리면 페이오프가 창을 못 받아먹음 → 셋업 직후 턴을 앞당겨 쓰게 한다.
// allyChoose를 그대로 재사용 → 보스 전 궁 보류·셋업 가치·상태 인지 등 기존 판단이 전부 유지된다.
// 끼어든 오퍼는 atb -= 100(자기 턴 소진)이라 총 행동 수는 불변.
setLinkChain((s, _self) => {
  // 조건(requires)·쿨(linkCd)이 충족된 연계를 **직접 탐색**한다(allyChoose 점수에 밀리지 않게).
  // self 포함 — 자기 셋업으로 자기 연계가 열리는 경우(장방이 등)도 잡고, 연계→연계 체인이 확실히 이어진다.
  // 쿨(linkCd)에 더해 **직전 연계를 쓴 본인은 제외**한다 — 쿨 1턴짜리는 자기 연계로
  // 자기 조건을 재생성해 연쇄를 독점할 수 있다(아크라이트). 다른 오퍼가 조건을 다시
  // 세워주면(감전 재부착 → 소모) 같은 연쇄 안에서도 재발동한다.
  // 조건이 동시에 열리면 **편성 왼쪽(pos 낮은 쪽)부터** 발동한다 — 원작 규칙.
  // 예전엔 계수(power)가 큰 연계를 먼저 골랐다. 그러면 플레이어가 순서를 정해도
  // 누가 이어받을지 예측할 수 없고, 편성 순서가 아무 의미를 갖지 못한다.
  for (const a of [...living(s, "ally")].sort((x, y) => x.pos - y.pos)) {
    if (s.chainLinker === a.id) continue; // 직전 연계 발동자 본인 — 자기 연계로 자기 연계를 열 수 없다
    const link = (SKILLS[a.id] ?? []).find((o) => o.kind === "link" && usable(s, a, o));
    if (link) return { unit: a, skill: link };
  }
  return null;
});

// ── 보스 페이즈 ──
// 원작 보스는 호위 잡몹이 아니라 페이즈로 구성된다(아카라이브 패턴 정리).
//  · 로댄 HP 70% → 2페 / 마블 25% → 3페 발악  : at 임계
//  · 트리아겔로스 : 페이즈마다 체력바가 새로 참(refill) + 2페 소환체 생존 중 본체 무적
//  · 네파리스     : 본 크러셔 → 정복자로 개체 교체(becomes)
//  · 마블 1페     : 촉수 4개를 전부 처치해야 코어(본체)가 피격 대상이 된다(guardedBy)
setPhaseHook((s, b, log) => {
  const base = b.id.split("#")[0];
  const def = ENEMY_DEFS[base] as any;
  // 호위 부위가 살아있으면 본체는 무적(마블 촉수)
  if (b.guardIds?.length) {
    const alive = b.guardIds.some((gid) => s.units.some((u) => u.id === gid && u.hp > 0));
    if (!alive) { b.guardIds = []; b.invuln = false; log.push(`  ◈ ${b.name} 부위를 전부 파괴! 코어 노출 — 이제 본체를 공격할 수 있다`); }
    else b.invuln = true;
  }
  // 소환체 생존 중 무적(트리아겔로스 2페)
  if (b.timers.guardSummon) {
    const alive = s.units.some((u) => u.side === "enemy" && u.hp > 0 && u.summonedBy === b.id);
    if (!alive) { delete b.timers.guardSummon; b.invuln = false; log.push(`  ◈ ${b.name} 소환체 전멸! 무적 해제`); }
    else b.invuln = true;
  }
  const phases: any[] = def?.phases ?? [];
  const idx = b.phaseIdx ?? 0;
  const nx = phases[idx];
  if (!nx) return;
  const ratio = b.hp / b.maxHp;
  const trigger = nx.at != null ? ratio <= nx.at : b.hp <= 0;
  if (!trigger) return;
  b.phaseIdx = idx + 1;
  if (nx.becomes && ENEMY_DEFS[nx.becomes]) { // 개체 교체 — 스탯을 새 개체로 갈아끼운다
    const n = makeEnemy(ENEMY_DEFS[nx.becomes], b.pos);
    b.name = nx.name ?? n.name; b.maxHp = n.maxHp; b.hp = n.maxHp; b.attack = n.attack;
    b.speed = n.speed; b.staggerMax = n.staggerMax; b.resist = n.resist; b.defense = n.defense;
  } else {
    if (nx.name) b.name = nx.name;
    if (nx.refill) b.hp = b.maxHp;
    if (nx.atkMul) b.attack = Math.round(b.attack * nx.atkMul);
    if (nx.spdMul) b.speed = Math.round(b.speed * nx.spdMul);
  }
  b.staggered = false; b.stagger = 0; // 페이즈 전환은 경직을 끊는다
  if (nx.summon) { // 잡몹 소환(+무적)
    for (let i = 0; i < nx.summon.n && living(s, "enemy").length < 6; i++) {
      const m = makeEnemy(D[nx.summon.id], living(s, "enemy").length + 1);
      m.summonedBy = b.id; s.units.push(m);
    }
    if (nx.summon.guarded) { b.timers.guardSummon = 999; b.invuln = true; }
  }
  log.push(`  ★ 페이즈 전환! ${b.name}${nx.note ? ` — ${nx.note}` : ""}`);
});

// 아군 AI: 사용 가능 스킬 중 점수 최대. usage gate가 셋업→페이오프를 자동 정렬.
export function allyChoose(s: DDState, self: DDUnit): DDSkill | null {
  // 예약된 연계(ATB 우선으로 끼어든 오퍼) — 자기 차례에 그 연계를 발동. ATB는 원래대로 복원해 정규 턴을 뺏지 않는다(원래 턴 + 연계 턴).
  if (self.pendingLink) { const sk = self.pendingLink; self.pendingLink = undefined; if (self.pendingLinkAtb != null) { self.atb = self.pendingLinkAtb; self.pendingLinkAtb = undefined; } return usable(s, self, sk) ? sk : null; }
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
    // 스탠스 페이오프: 스탠스는 2턴이면 풀린다. 열려 있을 때 안 쓰면 사슬이 통째로 끊긴다.
    // (실측: 미브가 추형 사용 가능인데도 단운·평타를 골라 강타 0회 → 개천(배율 4.0)까지 영영 도달 못 함)
    if (sk.requiresStance != null && (self.stance ?? 0) >= sk.requiresStance) v += 6;
    // 방어 불능 소모기(강타·갑옷 파괴)는 스택 수에 따라 배율이 급증한다 —
    // 강타 300/450/600/750%, 갑옷파괴 100/150/200/250%. 1~2스택에서 지르면 셋업이 통째로 낭비된다.
    // 소모기끼리 스택을 서로 뺏는 문제도 여기서 정리된다(미브 추형 vs 포그 갑옷파괴).
    if (sk.anomaly === "crush" || sk.anomaly === "armor-break") {
      const pb = t?.physBreak ?? 0;
      v += pb >= 4 ? 7 : pb === 3 ? 4 : pb === 2 ? -2 : -6;
      // 스탠스 승급이 걸린 강타(미브 추형)는 3+ 소모가 곧 주력기 해금이라 더 강하게 민다.
      if (sk.stanceFromCrush) v += pb >= 3 ? 5 : -5;
      // 소모기가 둘 이상이면 서로 스택을 뺏는다. 게이지와 같은 원칙 — 메인딜러에게 양보한다.
      // (미브 조합: 포그 갑옷파괴가 방불 3에서 먼저 털어가 미브 추형이 영영 스탠스를 못 올렸다)
      if (!self.isMain) {
        const main = living(s, "ally").find((a) => a.isMain && a !== self);
        const mainWants = !!main && (SKILLS[main.id] ?? []).some((o) =>
          (o.anomaly === "crush" || o.anomaly === "armor-break") && usable(s, main, o));
        if (mainWants) v -= 8;
      }
    }
    // 이미 그 스탠스인데 또 진입하는 셋업은 창만 갉아먹는다.
    if (sk.setStanceTo != null && sk.setStanceTo <= (self.stance ?? 0)) v -= 3;
    if (sk.selfUlt) {
      v += 10;
      // 보스 전엔 궁을 아낀다 — 게이지가 런 내내 이월되므로 보스 진입 만충이 목표.
      // 단, 아군이 위기이거나 이 궁으로 확실히 처치되면 지금 쓴다(아껴서 지면 의미 없음).
      // 유틸형 궁(변신·팀버프)은 아껴봐야 의미가 없다 — 값어치가 직접 피해가 아니라 지속 효과라서
      // power만 보면 항상 배틀/평타에 밀려 영영 안 나간다(장방이 심판의 폭풍 2.0이 30R 내내 0회였다).
      // 판정: 자기 배틀/연계보다 배율이 낮으면 딜링 궁이 아니다 → 보류 대상에서 제외하고 열리는 대로 쓴다.
      const bestNonUlt = Math.max(0, ...(SKILLS[self.id] ?? []).filter((o) => o.kind === "battle" || o.kind === "link").map((o) => o.power));
      const utilityUlt = sk.power <= bestNonUlt;
      if (utilityUlt) v += 8; // 변신 유지율이 곧 딜 — 쿨마다 돌린다
      // 게이지가 이미 만충이면 아낄 이유가 없다 — 이 시점부턴 충전분이 전부 버려진다.
      // (이 조건이 없어 29명 중 19명이 만충인 채 30R 내내 궁을 한 번도 안 쐈다)
      else if (!s.boss && self.ultCharge < self.ultCost) {
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
  s.chain = 1; // 적이 끼어들면 스킬 연계 체인은 끊긴다(enemyAct는 act()를 거치지 않는다)
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

  // 차징(프릭·레이커비스트 등): 예고 턴이면 강공, 아니면 확률로 '다음 턴 강공'을 예고하고 이번 턴은 넘긴다.
  // 예고 중 불균형시키면 combat에서 캔슬(강공 무산 + 추가 불균형) — 원작의 "차지 끊기".
  let chargeAttack = false;
  if (self.charge) {
    if ((self.charging ?? 0) > 0) { self.charging = 0; chargeAttack = true; s.log.push(`${self.name}[적] 차징 공격! 강력한 일격`); }
    else if (!self.staggered && Math.random() < 0.45) { self.charging = 1; s.log.push(`${self.name}[적] ⚡ 차징 시작! 다음 턴 강력 공격 — 불균형시키면 차단`); return; }
  }
  // 타겟팅: 컨셉(역할) 아키타입별 우선 대상 — 대형의 다른 부위를 위협해 배치·보호 전략 유도
  //  any=무지향(무작위) / wounded=저체력%(부상 딜러 마무리) / threat=최고위협(강화된 딜러 직격)
  const tgt = enemyArchetype(def?.role ?? "", behavior).tgt;
  const byWounded = [...foes].sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp || a.pos - b.pos);
  const byThreat = [...foes].sort((a, b) => b.attack * (1 + (b.atkBuff || 0)) - a.attack * (1 + (a.atkBuff || 0)) || a.pos - b.pos);
  // "any"는 특정 지향이 없는 적 — 직군 어그로 가중으로 대상을 뽑는다.
  // 전열/후열을 없앤 뒤 균등 무작위로 뒀더니 탱이 몸으로 막는다는 감각이 사라졌다.
  // 어그로를 끄는 건 위치도 무기 사거리도 아니라 역할이다. 사거리로 가르면 오히려
  // 근거리 메인딜러(미브·엠버·라스트·레바테인·로시)가 집중포화를 맞아 반대로 간다
  //   — 실측 타워 완주 균등 84% / 직군 87% / 사거리 79%.
  const pickAggro = () => {
    const w = foes.map((f) => aggroWeight(f.cls)); // 직군 미상(적 부위 등)은 1
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < foes.length; i++) { r -= w[i]; if (r <= 0) return foes[i]; }
    return foes[foes.length - 1];
  };
  const pick = () => (tgt === "wounded" ? byWounded[0] : tgt === "threat" ? byThreat[0] : pickAggro());
  // 소환(삼미아겔로스 돌기둥 등): 같은 세력 약한 적을 전장에 추가(최대 5마리, 확률)
  if (self.summon && living(s, "enemy").length < 5 && Math.random() < 0.35) {
    const bt = FACTION_POOL[def?.faction ?? ""]?.byTier;
    const ids = bt?.common ?? bt?.normal ?? [];
    if (ids.length) { const mid = ids[Math.floor(Math.random() * ids.length)]; const m = makeEnemy(D[mid], living(s, "enemy").length + 1); s.units.push(m); s.log.push(`${self.name}[적] 소환! ${m.name} 등장`); return; }
  }
  let targets: DDUnit[];
  // 광역: 격턴으로 전체 "나눔"공격, 평시엔 단일.
  // 나눔이 이름뿐이고 전원에게 풀 데미지가 들어가고 있었다 — 광역 보스가 단일 보스의 몇 배를 넣던 원인.
  if (behavior === "aoe") {
    const wide = (self.procCount = (self.procCount || 0) + 1) % 2 === 1;
    targets = wide ? foes : [pick()];
  } else targets = [pick()];
  // 끌어당김(결정아겔로스): 고위협 딜러를 강제로 끌어내 직격 + 물리 취약(노출)
  if (self.pull) { const back = byThreat[0]; targets = [back]; bumpVuln(back, "physical", 0.2); setTimer(back, "vuln:physical", 1); s.log.push(`${self.name}[적] 끌어당김! ${back.name} 강제 노출(취약)`); }
  const rageOn = !!def?.rage && self.hp / self.maxHp < 0.5 && !self.staggered; // 분노: HP 50%↓, 불균형이면 해제
  const powerMul = (behavior === "heavy" ? 1.55 : 1) * (rageOn ? 1.4 : 1) * (chargeAttack ? 1.8 : 1); // 차징 강공 ×1.8. aoe는 makeEnemy에서 공격력 이미 하향
  const atkMul = 1 + (self.atkBuff || 0);
  if (rageOn && !self.timers.raged) { self.timers.raged = 999; s.log.push(`${self.name}[적] 분노 상태! 공격력 상승 (HP 50%↓)`); }

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
    // 원문 2.6: 적이 거는 아츠 이상은 플레이어 규칙(폭발·대량 피해)이 아니라 전용 효과다.
    if (def?.attach) applyEnemyArts(t, def.attach, s.log);
    // 잡기/속박(bind·단운수 갈고리·형상아겔로스): 확률로 시간 정지 1턴(다음 라운드 시작 시 해제). 슈퍼아머(카치르·스노우샤인 디펜더)는 저항.
    if ((def?.bind || def?.stun) && Math.random() < 0.5) {
      if (t.id === "catcher" || t.id === "snowshine") s.log.push(`  → ${t.name} 슈퍼아머! 잡기 저항`);
      else { t.timers.stun = 1; if (!t.statuses.includes("stun")) t.statuses.push("stun"); s.log.push(`  → ${t.name} 속박! 시간 정지(1턴)`); }
    }
    // 감속(모방아겔로스 회오리·겁운객 연막): 명중 시 ATB 속도 저하(2턴)
    if (def?.slow && t.hp > 0 && (t.speedMod || 0) > -8) {
      t.speedMod = (t.speedMod || 0) - 8; setTimer(t, "speedMod", 2); s.log.push(`  → ${t.name} 감속! (행동 속도 저하)`);
    }
    // 냉기 능력(조류아겔로스): 명중 시 동결(2턴 행동 불가) — 원작 "명중 시 오퍼레이터를 동결"
    if (def?.freeze && t.hp > 0 && Math.random() < 0.5) {
      t.frozen = Math.max(t.frozen || 0, 2); t.timers.frozen = 2; if (!t.statuses.includes("stun")) t.statuses.push("stun");
      s.log.push(`  → ${t.name} 동결! (냉기 능력)`);
    }
    // 지속+폭발(본 크러셔 사수): 명중 시 화살비 지속 피해 부여(몇 초 뒤 폭발 → 지속 피해로 근사)
    if (self.dotBurst && t.hp > 0) { t.dot = Math.max(t.dot || 0, Math.round(self.attack * 0.35)); setTimer(t, "dot", 2); s.log.push(`  → ${t.name} 화살비 — 지속 피해`); }
  }
}

// 현재 유닛이 지금 쓸 수 있는 스킬(일반 공격 포함)
export function usableSkills(s: DDState, u: DDUnit): DDSkill[] {
  return [...(SKILLS[u.id] ?? []), BASIC].filter((sk) => usable(s, u, sk));
}

export type Encounter = { key: string; name: string; desc: string; make: () => DDUnit[] };

const D = ENEMY_DEFS;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const bossComp = (ids: string[]): DDUnit[] => buildUnits(ids);
// 편성 ids → 유닛. 보스의 호위 부위(guardedBy)를 함께 만들어 본체 무적을 풀 수 있게 한다.
export function buildUnits(ids: string[]): DDUnit[] {
  const out: DDUnit[] = [];
  for (const id of ids as (keyof typeof ENEMY_DEFS)[]) {
    const u = makeEnemy(D[id], out.length + 1);
    out.push(u);
    // 호위 부위(마블 촉수 4개): 전부 처치해야 본체(코어)가 피격 대상이 된다.
    const g = (D[id] as any).guardedBy;
    if (g) {
      u.invuln = true; u.guardIds = [];
      for (let i = 0; i < g.n; i++) {
        const part = makeEnemy(D[g.id as keyof typeof ENEMY_DEFS], out.length + 1);
        part.summonedBy = u.id; out.push(part); u.guardIds.push(part.id);
      }
    }
  }
  return out;
}
const comp = (...ids: (keyof typeof ENEMY_DEFS)[]) => (): DDUnit[] => buildUnits(ids as string[]);

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
// ── 원작 보스 등장 순서(확인: arca.live 보스 패턴 정리 · namu 「엔드필드/적」) ──
//  플레이 순서(CBT2 기준): 1 로댄 → 2 트리아겔로스 → 3 마블 아겔로미레(1장 최종보스)
//  지역 귀속:
//    4번 협곡 · 광맥 구역 = 트리아겔로스(3페이즈) → 마블 아겔로미레(4번협곡 최종보스)
//    무릉                = 파조의 상(출시 당시 최종보스 → 네임드 공개 후 "중간보스") · 로댄 · 원일
//    랜드브레이커          = 본 크러셔 네파리스 → 정복자 네파리스(2페)
//    그림자에 물든         = 알레이크레오스(최종)
//  우리 세력 구분은 이 지역 구분과 일치한다(아겔로스=4번협곡 / 수화자=무릉 / 청파채=무릉).
// 보스전은 원작대로 **호위 잡몹 없이 보스 단독**이다(원일·마블·로댄 등 확인).
// 난이도는 잡몹이 아니라 페이즈(EnemyDef.phases)와 호위 부위(guardedBy)로 만든다.
// 트리아겔로스만 2페이즈에서 소형 아겔로스를 소환한다 — 편성이 아니라 페이즈 훅이 처리한다.
const BOSS_COMPS = [
  comp("craghowler"),                    // 야외 생물
  comp("triaggelos"),                    // 아겔로스(광맥) — 3페이즈, 2페 소환
  comp("nefarith"),                      // 랜드브레이커 — 2페 정복자 네파리스
  comp("ruan-yi"),                       // 청파채(무릉)
  comp("marble-aggelo"),                 // 아겔로스(4번협곡 최종) — 촉수 4개 선행
  comp("rhodagn-the-bonekrushing-fist"), // 랜드브레이커 — HP 70%에서 2페
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
// 풀이 작은 세력을 근연 세력으로 보강(수화자=수(水)계 아겔로스 → 일반 아겔로스류 혼입)
const KIN_FACTION: Record<string, string> = { "수화자": "아겔로스" };
// 자체 보스가 없는 세력은 **같은 지역의 보스**를 쓴다. 잡몹 보강(KIN_FACTION)과는 기준이 다르다 —
// 수화자는 개체가 아겔로스 계열이라 잡몹은 아겔로스에서 빌리지만, 무릉 지역의 보스는 원일(청파채)이다.
// (파조의 상이 정예로 내려가며 수화자에 자체 보스가 없어졌다)
const REGION_BOSS_KIN: Record<string, string> = { "수화자": "청파채" }; // 수화자 = 무릉 → 무릉 보스 = 원일
export const bossPoolOf = (f: string): string[] => {
  const own = FACTION_POOL[f]?.boss ?? [];
  if (own.length) return own;
  const kin = REGION_BOSS_KIN[f];
  return kin ? FACTION_POOL[kin]?.boss ?? [] : [];
};
export const FACTIONS: FactionKey[] = Object.keys(FACTION_POOL).filter((f) => bossPoolOf(f).length); // 보스(근연 포함) 있는 세력만 리전
const TIER_RANK = ["common", "normal", "enhanced", "advanced", "alpha", "elite"];
const TIERS_NORMAL = ["common", "normal", "enhanced", "advanced"];
const TIERS_ELITE = ["advanced", "alpha", "elite"];
const tierAt = (kind: string, depth: number, maxDepth: number) => { const arr = kind === "elite" ? TIERS_ELITE : TIERS_NORMAL; const prog = maxDepth > 0 ? depth / maxDepth : 0; return arr[Math.min(arr.length - 1, Math.floor(prog * arr.length))]; };
const shuffle = <T,>(arr: T[]): T[] => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// 세력에서 목표 티어(없으면 최근접) 적 1마리 id
function enemyOfTier(faction: string, tier: string): string { return pickSquad(faction, tier, 1)[0]; }
// 목표 티어 주변에서 '서로 다른' 적 n종 편성(다양성 우선, 후보 부족분만 중복 허용)
function pickSquad(faction: string, tier: string, n: number, exclude: Set<string> = new Set(), hard: Set<string> = new Set()): string[] {
  const pool = FACTION_POOL[faction] ?? FACTION_POOL[FACTIONS[0]];
  const want = TIER_RANK.indexOf(tier);
  const byTier: Record<string, string[]> = {};
  for (const [t, ids] of Object.entries(pool.byTier)) byTier[t] = [...(ids ?? [])];
  const kin = KIN_FACTION[faction]; // 근연 세력 풀 병합(풀 부족 보강)
  if (kin && FACTION_POOL[kin]) for (const [t, ids] of Object.entries(FACTION_POOL[kin].byTier)) byTier[t] = [...(byTier[t] ?? []), ...(ids ?? [])];
  // hard=절대 제외(같은 편성에 이미 들어간 개체). exclude(최근 등장)와 달리 후보가 바닥나도 완화하지 않는다.
  const all = Object.entries(byTier).flatMap(([t, ids]) => ids.map((id) => ({ id, d: Math.abs(TIER_RANK.indexOf(t) - want) }))).filter((c) => !hard.has(c.id));
  let cands = all.filter((c) => !exclude.has(c.id));
  if (!cands.length) cands = all; // 회피(exclude)로 후보가 바닥나면 완화 — 작은 세력 풀 순환용
  if (!cands.length) return Array.from({ length: n }, () => "rockhowler");
  const near = shuffle(cands.filter((c) => c.d <= 1)).map((c) => c.id); // 목표±1 티어 셔플
  const far = cands.filter((c) => c.d > 1).sort((a, b) => a.d - b.d).map((c) => c.id); // 더 먼 티어는 근접도순
  const ranked = [...near, ...far];
  const out: string[] = []; const seen = new Set<string>();
  for (const id of ranked) { if (out.length >= n) break; if (!seen.has(id)) { out.push(id); seen.add(id); } } // 서로 다른 종 우선
  // 부족분은 회피(exclude)를 풀고 전체 풀의 '아직 안 쓴 종'으로 먼저 채운다 — 같은 적이 2~3중복 편성되는 것 방지
  if (out.length < n) for (const id of shuffle(all.map((c) => c.id))) { if (out.length >= n) break; if (!seen.has(id)) { out.push(id); seen.add(id); } }
  while (out.length < n) out.push(pick(ranked)); // 세력 풀 자체가 작을 때만 최후 수단으로 중복
  return out;
}
// 던전 내 최근 등장 적(같은 적 연속 반복 억제) — 새 원정마다 리셋
let recentEnemies: string[] = [];
export function resetEncounterHistory(): void { recentEnemies = []; }
// 리전 교전 생성: 세력 + 노드종류 + 깊이 → 편성(여러 종 혼합 + 최근 등장 회피)
// 층 스탯 배율 — 층이 오를수록 적 HP·공격력↑(타워 등반). 1층 ×1.0 → 6층 ×1.6(층당 +12%)
export const floorScale = (floor: number) => 1 + Math.max(0, floor) * 0.04;
export function regionEncounter(faction: string, kind: NodeKind, depth: number, maxDepth: number, bossId?: string, floor = 0): DDUnit[] {
  if (depth === 0) recentEnemies = []; // 원정 시작 시 히스토리 초기화(백업)
  const pool = FACTION_POOL[faction] ?? FACTION_POOL[FACTIONS[0]];
  const recent = new Set(recentEnemies);
  let ids: string[];
  if (kind === "boss") {
    // 원작 보스전은 호위 잡몹 없이 보스 단독이다. 난이도는 페이즈(EnemyDef.phases)와
    // 호위 부위(guardedBy — 마블 촉수)로 만든다. comp()가 부위를 자동으로 붙인다.
    const bp = bossPoolOf(faction);
    const bid = (bossId && D[bossId]) ? bossId : bp.length ? pick(bp) : "craghowler"; // 층 지정 보스 우선(없으면 근연 세력 보스)
    ids = [bid];
  } else if (kind === "elite") {
    // 정예 조우: 정예 개체 1마리 + 하위 등급 잡몹 다수(호위). 원작 정예 조우 구성 — 우두머리 하나에 부하가 붙는다.
    const tgt = tierAt(kind, depth, maxDepth);
    let lead = pickSquad(faction, tgt, 1, recent); // 정예 우두머리
    // 최근 등장 회피 때문에 등급이 크게 떨어지면 회피를 풀고 다시 뽑는다 — 정예 조우엔 정예가 나와야 한다.
    if (TIER_RANK.indexOf(D[lead[0]]?.tier ?? "") < TIER_RANK.indexOf(tgt) - 1) lead = pickSquad(faction, tgt, 1);
    const leadTier = D[lead[0]]?.tier ?? "advanced"; // 실제로 뽑힌 티어 기준(풀에 목표 티어가 없을 수 있음)
    const low = TIER_RANK[Math.max(0, TIER_RANK.indexOf(leadTier) - 2)]; // 우두머리보다 두 단계 아래 = 하위 등급
    const adds = pickSquad(faction, low, depth >= 4 ? 3 : 2, recent, new Set(lead)); // 하위 호위 2~3(우두머리 중복 금지)
    ids = [...lead, ...adds];
  } else {
    const tier = tierAt(kind, depth, maxDepth);
    ids = pickSquad(faction, tier, depth >= 4 ? 3 : 2, recent); // 일반: 초반 2마리 → 중반(depth 4+) 3마리
  }
  recentEnemies.push(...ids);
  recentEnemies = recentEnemies.slice(-8); // 최근 8마리를 회피 대상으로 유지
  const mul = floorScale(floor);
  // buildUnits가 guardedBy(마블 촉수)를 함께 만든다 — 이게 빠지면 본체가 무적인 채 촉수가 없어 교착된다.
  const out = buildUnits(ids);
  if (mul !== 1) for (const u of out) { u.maxHp = Math.round(u.maxHp * mul); u.hp = u.maxHp; u.attack = Math.round(u.attack * mul); }
  return out;
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
export function createBattle(party: { id: string; hp?: number; loadout?: Loadout; progress?: OpProgress; ult?: number; main?: boolean }[], enc: Encounter, owned?: Record<string, number>, boss?: boolean): DDState {
  let bonusGauge = 0;
  // 위치 = **편성 순서 그대로**. 예전엔 frontlineOrder로 탱을 pos1에, 앵커를 pos2로 자동 재배치했는데,
  // 플레이어가 편성 화면에서 1~4번을 직접 정해 놓아도 던전에 들어가면 순서가 바뀌어 버렸다.
  // 배치는 플레이어 몫이다. 전열/후열 개념이 없어 위치는 화면 배치·연출용일 뿐이다.
  const ordered = party;
  const mainId = party.find((p) => p.main)?.id ?? party[0]?.id; // 메인딜러(추천 부대는 main 지정, 없으면 1번)
  const allies = ordered.map((p, i) => {
    const u = makeAlly(p.id, i + 1, p.progress); // 정예화·스킬랭크·장비강화(gearGrade) 반영
    if (p.id === mainId) u.isMain = true;
    if (p.hp != null) u.hp = Math.max(1, Math.min(u.maxHp, p.hp)); // 지속 HP(소모전)
    if (p.ult != null) u.ultCharge = Math.max(0, Math.min(u.ultCost, p.ult)); // 궁 게이지 이월 — 전투마다 0으로 리셋되면 고비용 궁(220~240)은 영원히 못 씀
    // 맨몸 시작 — 공업소에서 제작(owned)한 피스만 장착. 미제작 슬롯은 미적용(기본 스탯).
    let equipped: Loadout | undefined; let levels: Partial<Record<LoadoutSlot, number>> | undefined;
    if (p.loadout && owned) for (const slot of LOADOUT_SLOTS) { const ref = p.loadout[slot]; if (ref && owned[ref] != null) { (equipped ??= {})[slot] = ref; (levels ??= {})[slot] = owned[ref]; } }
    bonusGauge += applyGear(u, equipped, 0, levels); // 제작된 피스만: 세트 효과 + 부위 단조 스케일
    applyWeapon(u); // 시그니처 무기: 공격력 +10% + 타입 고유효과
    return u;
  });
  const enemies = enc.make();
  return { units: [...allies, ...enemies], round: 0, log: [], skillGauge: Math.min(300, 200 + bonusGauge), maxGauge: 300, boss };
}
