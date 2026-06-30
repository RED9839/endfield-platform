// 버프/디버프 레이어 검증 — 증폭·취약 위계·보호막·허약·비호·정화·가속/감속.
import { DDState, DDUnit, DDSkill, act, cleanse, turnOrder } from "../app/game/dd/combat";

function unit(over: Partial<DDUnit>): DDUnit {
  return {
    id: "x", name: "x", side: "ally", pos: 1, hp: 1e7, maxHp: 1e7, speed: 50, attack: 100,
    physBreak: 0, stagger: 0, staggerMax: 0, staggered: false, staggerTimer: 0,
    statuses: [], dot: 0, multiHit: 0, ultCharge: 0, ultCost: 999, atkBuff: 0,
    arts: { heat: 0, electric: 0, cryo: 0, nature: 0 }, frozen: 0,
    amp: {}, vuln: {}, weakenMul: 1, protection: 0, shield: 0, speedMod: 0, timers: {}, linkCd: 0, defense: 0, resist: { physical: 0, arts: 0 }, critRate: 0.05, critDmg: 0.5, stance: 0, ironOath: 0, gaugeRecovered: 0, gearGrade: 60, procCount: 0, ...over,
  };
}
const SK = (element: DDSkill["element"] = "physical"): DDSkill =>
  ({ id: "probe", name: "probe", kind: "battle", fromPos: [1, 2, 3, 4], target: "single-front", power: 1.0, element });

// 1회 타격 피해 측정(공격력 100, 배율 1.0 → 기본 100)
function hit(attackerOver: Partial<DDUnit>, enemyOver: Partial<DDUnit>, skill = SK()): number {
  const a = unit({ id: "a", critRate: 0, ...attackerOver }); // 치명 격리(버프 수학만 측정)
  const e = unit({ id: "e", side: "enemy", ...enemyOver });
  const s: DDState = { units: [a, e], round: 1, log: [], skillGauge: 9999, maxGauge: 9999 };
  const before = e.hp;
  act(s, a, skill);
  return before - e.hp;
}
let pass = 0, fail = 0;
function check(name: string, got: number, want: number) {
  const ok = Math.abs(got - want) < 0.5;
  console.log(`  ${ok ? "✅" : "❌"} ${name}: ${got} (기대 ${want})`);
  ok ? pass++ : fail++;
}

console.log("── 기준 ──");
check("순수 타격", hit({}, {}), 100);

console.log("── 증폭(입히는 피해↑, 시전자) ──");
check("물리 증폭 +30%", hit({ amp: { physical: 0.3 } }, {}), 130);
check("전체 증폭 +20% (열기타에도)", hit({ amp: { all: 0.2 } }, {}, SK("heat")), 120);
check("물리 증폭은 열기타에 미적용", hit({ amp: { physical: 0.5 } }, {}, SK("heat")), 100);

console.log("── 취약 위계(받는 피해↑, 대상) ──");
check("물리 취약 +20%", hit({}, { vuln: { physical: 0.2 } }), 120);
check("전취약(all) → 열기타 +20%", hit({}, { vuln: { all: 0.2 } }, SK("heat")), 120);
check("아츠취약 → 열기타 +15%", hit({}, { vuln: { arts: 0.15 } }, SK("heat")), 115);
check("열기취약만 → 물리타 미적용", hit({}, { vuln: { heat: 0.5 } }), 100);
check("위계 합산(all+arts+heat)", hit({}, { vuln: { all: 0.1, arts: 0.1, heat: 0.1 } }, SK("heat")), 130);

console.log("── 허약/비호 ──");
check("허약(공격력 -30%)", hit({ weakenMul: 0.7 }, {}), 70);
check("비호(받는 피해 -40%)", hit({}, { protection: 0.4 }), 60);
check("허약×비호 동시", hit({ weakenMul: 0.5 }, { protection: 0.5 }), 25);

console.log("── 방어력/저항(받는 피해 감소) ──");
check("방어력 140 → 58.3% 감소", hit({}, { defense: 140 }), 41.67);
check("물리 저항 0.2 → 20% 감소", hit({}, { resist: { physical: 0.2, arts: 0 } }), 80);
check("아츠 저항은 물리타에 미적용", hit({}, { resist: { physical: 0, arts: 0.5 } }), 100);
check("방어력+물리취약 동시(×1.2 ×100/240)", hit({}, { defense: 140, vuln: { physical: 0.2 } }), 50);

console.log("── 치명타(기댓값 ×(1+치확×치피)) ──");
check("치확 20% · 치피 100% → +20%", hit({ critRate: 0.2, critDmg: 1.0 }, {}), 120);
check("기본 5% · 50% → +2.5%", hit({ critRate: 0.05, critDmg: 0.5 }, {}), 102); // 102.5 float→102
check("로시 연계 버프(30%·100%) → +30%", hit({ critRate: 0.3, critDmg: 1.0 }, {}), 130);

console.log("── 보호막(보호) ──");
{
  const e = unit({ id: "e", side: "enemy", hp: 1000, maxHp: 1000, shield: 250 });
  const a = unit({ id: "a", critRate: 0 }); // 치명 격리
  act({ units: [a, e], round: 1, log: [], skillGauge: 9999, maxGauge: 9999 }, a, SK()); // 100 피해 → 보호막 흡수
  check("보호막 흡수(체력 무손실)", 1000 - e.hp, 0);
  check("보호막 잔량", e.shield, 150);
}

console.log("── 정화 ──");
{
  const u = unit({ vuln: { physical: 0.3, arts: 0.2 }, dot: 50, frozen: 2, weakenMul: 0.6, statuses: ["armor-break", "stun"] });
  cleanse(u);
  const cleared = (u.vuln.physical ?? 0) === 0 && u.dot === 0 && u.frozen === 0 && u.weakenMul === 1 && u.statuses.length === 0;
  console.log(`  ${cleared ? "✅" : "❌"} 정화: 취약/DoT/동결/허약/디버프 전부 해제`);
  cleared ? pass++ : fail++;
}

console.log("── 가속/감속(턴 순서) ──");
{
  const slow = unit({ id: "slow", speed: 80, speedMod: -40 }); // 80→40
  const fast = unit({ id: "fast", speed: 50, speedMod: 20 }); // 50→70
  const order = turnOrder({ units: [slow, fast], round: 1, log: [], skillGauge: 9999, maxGauge: 9999 }).map((u) => u.id);
  const ok = order[0] === "fast";
  console.log(`  ${ok ? "✅" : "❌"} 감속 적용 후 순서: ${order.join(" → ")} (fast 선행 기대)`);
  ok ? pass++ : fail++;
}

console.log(`\n=== ${pass}/${pass + fail} 통과 ===`);
