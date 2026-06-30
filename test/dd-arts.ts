// 아츠 시스템 검증 — 부착/폭발/이상(연소·감전·동결·쇄빙·부식)을 시나리오로 확인.
import { DDState, DDUnit, DDSkill, act, applyAttach, usable } from "../app/game/dd/combat";
import { SKILLS, makeAlly } from "../app/game/dd/roster";

function unit(over: Partial<DDUnit>): DDUnit {
  return {
    id: "x", name: "x", side: "ally", pos: 1, hp: 100000, maxHp: 100000, speed: 50, attack: 100,
    physBreak: 0, stagger: 0, staggerMax: 0, staggered: false, staggerTimer: 0,
    statuses: [], dot: 0, multiHit: 0, ultCharge: 0, ultCost: 999, atkBuff: 0,
    arts: { heat: 0, electric: 0, cryo: 0, nature: 0 }, frozen: 0,
    amp: {}, vuln: {}, weakenMul: 1, protection: 0, shield: 0, speedMod: 0, timers: {}, linkCd: 0, defense: 0, resist: { physical: 0, arts: 0 }, critRate: 0.05, critDmg: 0.5, stance: 0, ...over,
  };
}
const atk = (id: string, el: DDSkill["element"], attach: DDSkill["attach"], anomaly?: DDSkill["anomaly"]): DDSkill =>
  ({ id, name: id, kind: "battle", fromPos: [1, 2, 3, 4], target: "single-front", power: 1.0, element: el, attach, anomaly });

const HEAT = atk("열기타", "heat", "heat");
const ELEC = atk("전기타", "electric", "electric");
const CRYO = atk("냉기타", "cryo", "cryo");
const NAT = atk("자연타", "nature", "nature");
const LAUNCH = atk("띄우기", "physical", undefined, "launch");

function scenario(name: string, seq: DDSkill[], enemyOver: Partial<DDUnit> = {}) {
  const attacker = unit({ id: "src", name: "딜러", attack: 100 });
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 100000, hp: 100000, ...enemyOver });
  const s: DDState = { units: [attacker, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 9999 };
  console.log(`\n══ ${name} ══`);
  for (const sk of seq) act(s, attacker, sk);
  console.log(s.log.filter((l) => !l.includes("HP ") || l.includes("✗")).join("\n"));
  console.log(`  [상태] 부착 H${enemy.arts.heat}E${enemy.arts.electric}C${enemy.arts.cryo}N${enemy.arts.nature} · 동결 ${enemy.frozen} · 아츠취약 ${enemy.vuln.arts ?? 0} · 부식(전취약) ${enemy.vuln.all ?? 0} · DoT ${enemy.dot}`);
}

scenario("열기 폭발 (같은 속성 2스택)", [HEAT, HEAT]);
scenario("연소 (전기 부착 → 열기)", [ELEC, HEAT]);
scenario("감전 (열기 부착 → 전기)", [HEAT, ELEC]);
scenario("동결 (열기 부착 → 냉기)", [HEAT, CRYO]);
scenario("쇄빙 (동결 후 띄우기=물리 이상)", [HEAT, CRYO, LAUNCH]);
scenario("부식 (전기 부착 → 자연)", [ELEC, NAT]);
scenario("이상 레벨 ↑ (3스택 쌓고 이상)", [ELEC, ELEC, ELEC, HEAT]);

// 에스텔라 실전 검증: 디스토션(연계)은 동결 적일 때만 + 강제 띄우기 → 쇄빙 + 물리취약
console.log("\n══ 에스텔라 디스토션 = 쇄빙 트리거 ══");
{
  const est = makeAlly("estella", 1);
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 100000, hp: 100000 });
  const s: DDState = { units: [est, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 9999 };
  const disto = SKILLS.estella.find((sk) => sk.id === "est-l")!;
  console.log(`  동결 전 사용 가능: ${usable(s, est, disto)} (기대 false)`);
  applyAttach(enemy, "nature", est, s.log); applyAttach(enemy, "cryo", est, s.log); // 외부 동결(자연→냉기)
  console.log(`  동결 후 사용 가능: ${usable(s, est, disto)} · frozen ${enemy.frozen} (기대 true)`);
  act(s, est, disto);
  console.log("  " + s.log.filter((l) => l.includes("쇄빙") || l.includes("물리취약") || l.includes("방어 불능")).join("\n  "));
}

console.log("\n══ 로시: 절흔(늑대의 발톱) + 연계 이중 조건 ══");
{
  const ros = makeAlly("rossi", 1);
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 100000, hp: 100000 });
  const s: DDState = { units: [ros, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 9999 };
  const battle = SKILLS.rossi.find((sk) => sk.id === "ros-b")!;
  const link = SKILLS.rossi.find((sk) => sk.id === "ros-l")!;
  act(s, ros, battle); // 방불 0 → 띄우기만(진주/절흔 X)
  console.log(`  1타(방불0): DoT ${enemy.dot} 물취 ${enemy.vuln.physical ?? 0} (절흔 미발동 기대)`);
  act(s, ros, battle); // 이제 방불 1 → 진주 + 절흔
  console.log(`  2타(방불 적): DoT ${enemy.dot} 물취 ${(enemy.vuln.physical ?? 0).toFixed(2)} 열취 ${(enemy.vuln.heat ?? 0).toFixed(2)} (늑대의 발톱 발동 기대)`);
  console.log(`  연계 사용가능(아츠 부착 없음): ${usable(s, ros, link)} (기대 false)`);
  applyAttach(enemy, "heat", ros, s.log); // 아츠 부착
  console.log(`  연계 사용가능(방불+열기부착): ${usable(s, ros, link)} (기대 true)`);
}

console.log("\n══ 미브: 청파 삼형 스탠스(단운→추형→개천) ══");
{
  const mf = makeAlly("mifu", 1);
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e6, hp: 1e6, staggerMax: 9999 });
  const s: DDState = { units: [mf, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 9999 };
  const [danun, chu, gae] = ["mf-b1", "mf-b2", "mf-b3"].map((id) => SKILLS.mifu.find((k) => k.id === id)!);
  console.log(`  초기 추형/개천 사용가능: ${usable(s, mf, chu)}/${usable(s, mf, gae)} (기대 false/false)`);
  act(s, mf, danun);
  console.log(`  단운 후 stance ${mf.stance} · 추형 사용가능 ${usable(s, mf, chu)} (기대 1/true)`);
  enemy.physBreak = 3; // 외부 방불 3
  act(s, mf, chu); // 강타로 3스택 소모
  console.log(`  추형(방불3 소모) 후 stance ${mf.stance} · 개천 사용가능 ${usable(s, mf, gae)} (기대 2/true)`);
}
