// DD류 전투 프로토타입 러너 — 헤드리스로 한 판 돌려 턴 로그 출력.
import { BASIC, DDState, DDUnit, act, applyDamage, canAct, isOver, living, mitigate, startRound, turnOrder, usable, pickTargets, vulnFor } from "../app/game/dd/combat";
import { SKILLS, alliesPhysical, makeEnemy, ENEMY_DEFS } from "../app/game/dd/roster";

type Any = any;

// 아군 AI: 사용 가능 스킬 중 점수 최대. usage gate가 조건을 자동 처리하므로 셋업→페이오프가 자연 정렬됨.
function allyChoose(s: DDState, self: DDUnit) {
  const skills = [...(SKILLS[self.id] ?? []), BASIC]; // 일반 공격은 항상 후보
  const opts = skills.filter((sk) => usable(s, self, sk));
  if (!opts.length) return null;
  const score = (sk: Any) => {
    const t = pickTargets(s, self, sk)[0];
    if (sk.kind === "attack") { // 일반 공격: 평소 낮음 / 처형·게이지 부족 시 가치↑
      let v = 1;
      if (t && t.staggered) v += 12; // 처형(불균형 적 대량딜)
      if (s.skillGauge < 100) v += 3; // 게이지 모자라면 평타로 회복
      return v;
    }
    let v = sk.power;
    if (sk.selfUlt) v += 10; // 게이지 찼으면 궁극 우선
    const stacks = t ? t.physBreak : 0;
    if (sk.kind === "link") v += 2; // 게이트 통과한 연계는 가치 높음
    if (sk.crystal && t && !t.statuses?.includes("crystal") && stacks >= 2) v += 6; // 관리자: 고스택 적에 결정 부착(다음 강타로 폭발)
    if (sk.anomaly === "launch" || sk.anomaly === "knockdown") { if (stacks < 4) v += 2.5; } // 방불 쌓기(빌더)
    if (sk.anomaly === "crush" || sk.anomaly === "armor-break") {
      // 소비기: 고스택일수록 폭발 크다 → 4스택까지 모으고 터뜨림. 막타면 즉시.
      if (stacks >= 3 || (t && t.hp < self.attack * 5)) v += 9;
      else if (stacks >= 1) v += stacks - 2.5; // 저스택이면 빌더에 양보
      else v -= 3;
      if (t && t.statuses?.includes("crystal")) v += 4; // 결정+강타 동시 폭발
    }
    if (sk.target === "all" || sk.target === "row") v += living(s, "enemy").length > 1 ? 1.5 : 0;
    return v;
  };
  return opts.reduce((a, b) => (score(b) > score(a) ? b : a), opts[0]);
}

// 적 AI: 가장 앞 아군을 단일 공격.
function enemyAct(s: DDState, self: DDUnit) {
  const allies = living(s, "ally").sort((a, b) => a.pos - b.pos);
  if (!allies.length) return;
  const t = allies[0];
  const dmg = applyDamage(t, mitigate(t, self.attack * (1 + vulnFor(t, "physical")) * (1 - (t.protection || 0)), "physical")); // 비호·방어력·저항·보호막
  s.log.push(`${self.name}[적] → ${t.name} 공격 -${dmg} (HP ${t.hp}/${t.maxHp})`);
  if (t.hp === 0) s.log.push(`  ✗ ${t.name} 전투불능!`);
}

function runBattle(allies: DDUnit[], enemies: DDUnit[], label: string): "ally" | "enemy" {
  const s: DDState = { units: [...allies, ...enemies], round: 0, log: [], skillGauge: 200, maxGauge: 300 };
  console.log(`\n══════ ${label} ══════`);
  console.log("아군: " + allies.map((a) => `${a.name}(pos${a.pos},spd${a.speed})`).join("  "));
  console.log("적: " + enemies.map((e) => `${e.name}(HP${e.maxHp})`).join("  "));
  let guard = 0;
  while (!isOver(s) && guard++ < 40) {
    startRound(s);
    s.log.push(`── 라운드 ${s.round} ──`);
    for (const u of turnOrder(s)) {
      if (u.hp <= 0) continue;
      if (isOver(s)) break;
      if (!canAct(u)) { if (u.staggered) s.log.push(`${u.name} 불균형 — 행동 불가`); continue; }
      if (u.side === "ally") {
        const sk = allyChoose(s, u);
        if (sk) act(s, u, sk); else s.log.push(`${u.name} 행동 불가(사용 가능 스킬 없음)`);
      } else enemyAct(s, u);
    }
  }
  const win = isOver(s);
  console.log(s.log.join("\n"));
  console.log(`결과: ${win === "ally" ? "🏆 승리" : "💀 패배"} (${s.round}라운드)`);
  return win ?? "enemy";
}

// 전투 1: 일반전(잡병 2 + 중장 1)
runBattle(
  alliesPhysical(),
  [makeEnemy(ENEMY_DEFS.mob, 1), makeEnemy(ENEMY_DEFS.mob, 2), makeEnemy(ENEMY_DEFS.brute, 3)],
  "전투 1 — 일반전",
);

// 전투 2: 보스전(단일 고체력 → 진천우 예풍상 + 관리자 강타 활약 기대)
runBattle(alliesPhysical(), [makeEnemy(ENEMY_DEFS.boss, 1)], "전투 2 — 보스전");
