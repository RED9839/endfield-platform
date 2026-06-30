// 아츠 시스템 검증 — 부착/폭발/이상(연소·감전·동결·쇄빙·부식)을 시나리오로 확인.
import { DDState, DDUnit, DDSkill, act, applyAttach, usable } from "../app/game/dd/combat";
import { SKILLS, makeAlly } from "../app/game/dd/roster";

function unit(over: Partial<DDUnit>): DDUnit {
  return {
    id: "x", name: "x", side: "ally", pos: 1, hp: 100000, maxHp: 100000, speed: 50, attack: 100,
    physBreak: 0, stagger: 0, staggerMax: 0, staggered: false, staggerTimer: 0,
    statuses: [], dot: 0, multiHit: 0, ultCharge: 0, ultCost: 999, atkBuff: 0,
    arts: { heat: 0, electric: 0, cryo: 0, nature: 0 }, frozen: 0,
    amp: {}, vuln: {}, weakenMul: 1, protection: 0, shield: 0, speedMod: 0, timers: {}, linkCd: 0, defense: 0, resist: { physical: 0, arts: 0 }, critRate: 0.05, critDmg: 0.5, stance: 0, ironOath: 0, gaugeRecovered: 0, gearGrade: 60, procCount: 0, ...over,
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

console.log("\n══ 포그: 갑옷 파괴 게이지 수급 + 보름달 게이트 ══");
{
  const pg = makeAlly("pogranichnik", 1);
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e6, hp: 1e6 });
  const s: DDState = { units: [pg, enemy], round: 1, log: [], skillGauge: 200, maxGauge: 300 };
  const battle = SKILLS.pogranichnik.find((k) => k.id === "pg-b")!;
  const link = SKILLS.pogranichnik.find((k) => k.id === "pg-l")!;
  console.log(`  연계 사용가능(갑옷파괴 전): ${usable(s, pg, link)} (기대 false)`);
  enemy.physBreak = 3; const before = s.skillGauge;
  act(s, pg, battle); // 배틀 -100, 갑옷파괴 3스택 소모 → +20
  console.log(`  전선분쇄(방불3): 게이지 ${before}→${s.skillGauge} (기대 ${before - 100 + 20}) · armor-break ${enemy.statuses.includes("armor-break")}`);
  console.log(`  연계 사용가능(갑옷파괴 후): ${usable(s, pg, link)} (기대 true)`);
}

console.log("\n══ 포그: 철의 서약 5스택(본인 버프) + 추가타 체인 ══");
{
  const pg = makeAlly("pogranichnik", 1); pg.ultCharge = pg.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7 });
  const s: DDState = { units: [pg, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const ult = SKILLS.pogranichnik.find((k) => k.id === "pg-u")!;
  act(s, pg, ult);
  console.log(`  궁 후 포그 철의 서약: ${pg.ironOath} (기대 5)`);
  const LAUNCH2 = atk("띄우기", "physical", undefined, "launch");
  for (let i = 0; i < 5; i++) act(s, pg, LAUNCH2); // 물리이상 5회 → 철의 서약 5 소모
  const cnt = s.log.filter((l) => l.includes("철의 서약 교란") || l.includes("최후의 승부")).length;
  console.log(`  물리이상 5회 → 소모 ${cnt}회(교란4+최후1) · 잔여 ${pg.ironOath}`);
  console.log("  " + s.log.filter((l) => l.includes("최후의 승부") || l.includes("교란")).slice(-2).join("\n  "));
}

console.log("\n══ 포그: 생존의 깃발(게이지 80 누적 → 사기 격양) ══");
{
  const pg = makeAlly("pogranichnik", 1);
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7 });
  const s: DDState = { units: [pg, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.pogranichnik.find((k) => k.id === "pg-b")!;
  for (let i = 0; i < 3; i++) { enemy.physBreak = 4; act(s, pg, battle); } // 각 방불4 소모 → +30, 누적 90
  console.log(`  전선분쇄 ×3(방불4 소모, +30씩=90): atkBuff ${pg.atkBuff} (기대 0.08=사기 격양 1스택) · 누적잔여 ${pg.gaugeRecovered}`);
}

console.log("\n══ 아크라이트: 강제 감전 + 초단쿨 연계 게이지 수급 ══");
{
  const arc = makeAlly("arclight", 1); arc.ultCharge = arc.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7 });
  const s: DDState = { units: [arc, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.arclight.find((k) => k.id === "arc-b")!;
  const link = SKILLS.arclight.find((k) => k.id === "arc-l")!;
  const ult = SKILLS.arclight.find((k) => k.id === "arc-u")!;
  console.log(`  감전 전 천둥 사용가능: ${usable(s, arc, link)} (기대 false)`);
  applyAttach(enemy, "electric", arc, s.log); // 외부 전기 부착
  act(s, arc, ult); // 전기 부착 + 강제 감전
  console.log(`  궁 후 감전(shock): ${enemy.statuses.includes("shock")} (기대 true) · 천둥 사용가능: ${usable(s, arc, link)} (기대 true)`);
  const g1 = s.skillGauge; act(s, arc, battle); // 질풍: 감전 소모 추가타 + 게이지 30
  console.log(`  질풍(감전 적): 게이지 ${g1}→${s.skillGauge} (배틀 -100 + 감전소모 +30 = ${g1 - 70})`);
  // 만물의 지혜: 적이 아크라이트에게 아츠 부착 시 50% 확률 면역(방어형). ※ DD 적은 아츠 부착 미모델 → 휴면, 메커니즘만 검증
  let immune = 0;
  for (let i = 0; i < 200; i++) { const a2 = makeAlly("arclight", 1); applyAttach(a2, "heat", enemy, []); if (a2.arts.heat === 0) immune++; }
  console.log(`  만물의 지혜(적→아크 아츠 부착 50% 면역, 휴면): 200회 중 면역 ${immune}회 (≈100=50%)`);
  // 황무지의 방랑자: 질풍 감전 소모 3회마다 팀 전기 증폭(장비 등급 60 비례)
  act(s, arc, battle); act(s, arc, battle); // 누적 3회
  const ally2 = makeAlly("estella", 2); s.units.push(ally2); // 팀원
  arc.procCount = 2; act(s, arc, battle); // 3회 도달
  console.log(`  황무지의 방랑자(질풍 3회): 본인 전기증폭 ${(arc.amp.electric ?? 0) * 100}% (기대 ${60 * 0.0008 * 100}%=장비등급60×0.08%)`);
}

console.log("\n══ 알레쉬: 강제 동결 + 아츠소모 연계 (에스텔라 쇄빙 파티 인에이블) ══");
{
  const ale = makeAlly("alesh", 1);
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7 });
  const s: DDState = { units: [ale, enemy], round: 1, log: [], skillGauge: 200, maxGauge: 9999 };
  const battle = SKILLS.alesh.find((k) => k.id === "ale-b")!;
  const link = SKILLS.alesh.find((k) => k.id === "ale-l")!;
  console.log(`  연계 사용가능(소모 전): ${usable(s, ale, link)} (기대 false)`);
  applyAttach(enemy, "cryo", ale, s.log); applyAttach(enemy, "cryo", ale, s.log); // 냉기 2부착
  const g0 = s.skillGauge; act(s, ale, battle); // 강제 동결(냉기2 소모 → 동결2 + 게이지 20)
  console.log(`  비정규 루어: frozen ${enemy.frozen} (기대 2) · 게이지 ${g0}→${s.skillGauge} (-100 +20)`);
  const LAUNCH3 = atk("띄우기", "physical", undefined, "launch");
  act(s, ale, LAUNCH3); // 동결 적 띄우기 → 쇄빙(동결 소모)
  console.log(`  쇄빙(동결 소모) 후 연계 사용가능: ${usable(s, ale, link)} (기대 true)`);
}

console.log("\n══ 아케쿠리: 불균형 조건 연계 + 무딜 궁(게이지+연타) ══");
{
  const ake = makeAlly("akekuri", 1); ake.ultCharge = ake.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 50 });
  const s: DDState = { units: [ake, enemy], round: 1, log: [], skillGauge: 100, maxGauge: 9999 };
  const link = SKILLS.akekuri.find((k) => k.id === "ake-l")!;
  const ult = SKILLS.akekuri.find((k) => k.id === "ake-u")!;
  console.log(`  연계 사용가능(불균형 전): ${usable(s, ake, link)} (기대 false)`);
  enemy.staggered = true;
  console.log(`  불균형 후 연계 사용가능: ${usable(s, ake, link)} (기대 true)`);
  const g0 = s.skillGauge; act(s, ake, link); // 게이지 15 × 승리의 함성(장비등급60 → +9%)
  console.log(`  섬광 돌진: 게이지 ${g0}→${s.skillGauge.toFixed(1)} (15×1.09≈16.4 승리의 함성)`);
  const g1 = s.skillGauge; act(s, ake, ult); // 무딜 궁: 게이지 +58 + 연타
  console.log(`  소대 집합(궁): 게이지 ${g1.toFixed(1)}→${s.skillGauge.toFixed(1)} (+58) · 연타 ${ake.multiHit} (기대 1=몰입의 시간)`);
}

console.log("\n══ 카뮤: 핏빛 날개 + 죄를 쫓는 자(회복+연타) + 혈류 소생 ══");
{
  const cam = makeAlly("camu", 1); cam.hp = 1000; // 부상 상태(maxHp 2689)
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7 });
  const s: DDState = { units: [cam, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.camu.find((k) => k.id === "camu-b")!;
  const link = SKILLS.camu.find((k) => k.id === "camu-l")!;
  act(s, cam, battle); // 열기 부착 + 허약 + 열기취약 + 날개
  console.log(`  사르는 불꽃: 열기부착 ${enemy.arts.heat} · 허약 ${enemy.weakenMul.toFixed(2)} · 열기취약 ${enemy.vuln.heat} · 날개 ${enemy.statuses.includes("wing")}`);
  console.log(`  연계 사용가능(소모 전): ${usable(s, cam, link)} (기대 false)`);
  s.anomalyConsumed = true; // 열기 부착 소모 발생(연소 등)
  const hp0 = cam.hp, mh0 = cam.multiHit;
  act(s, cam, link); // 죄를 쫓는 자: 날개 적 → 회복 + 연타 + 혈류 소생
  console.log(`  영혼의 가시(날개 적): 회복 ${hp0}→${cam.hp}(+78) · 연타 ${mh0}→${cam.multiHit} · 혈류소생 열기증폭 ${(cam.amp.heat ?? 0) * 100}%`);
}

console.log("\n══ 엠버: 피격 트리거 연계 + 치유/비호 + 팀 보호막(디펜더) ══");
{
  const emb = makeAlly("ember", 1); emb.hp = 1500; // 부상 상태(maxHp 2689)
  const ally = makeAlly("chenqianyu", 2); ally.hp = 1000; // 최저 체력% 아군(치유 대상)
  emb.ultCharge = emb.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 999, attack: 400 });
  const s: DDState = { units: [emb, ally, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.ember.find((k) => k.id === "emb-b")!;
  const link = SKILLS.ember.find((k) => k.id === "emb-l")!;
  const ult = SKILLS.ember.find((k) => k.id === "emb-u")!;
  act(s, emb, battle); // 진군: 넘어뜨리기 + 전진의 결의(비호 50%)
  console.log(`  진군: 방불 ${enemy.physBreak} · 엠버 비호 ${emb.protection} (기대 0.5 전진의 결의)`);
  console.log(`  연계 사용가능(피격 전): ${usable(s, emb, link)} (기대 false)`);
  act(s, enemy, atk("적 공격", "physical", undefined)); // 엠버 피격 → allyHit + 강철에는 강철로
  console.log(`  피격 후: allyHit ${s.allyHit} · 강철에는 강철로 공격력버프 ${emb.atkBuff} (기대 0.09)`);
  console.log(`  연계 사용가능(피격 후): ${usable(s, emb, link)} (기대 true)`);
  const a0 = ally.hp; act(s, emb, link); // 전선에서의 지원: 최저 체력% 아군 치유(300+60×0.7=342)
  console.log(`  전선에서의 지원: 진천우 회복 ${a0}→${ally.hp}(+342 기대) · 넘어뜨리기 방불 ${enemy.physBreak}`);
  act(s, emb, ult); // 다시 불타오르는 맹세: 팀 보호막(2689×0.18=484)
  console.log(`  궁 팀 보호막: 엠버 ${emb.shield} · 진천우 ${ally.shield} (기대 484 = 최대 생명력 18%)`);
}

console.log("\n══ 스노우샤인: 반격 냉기 부착 + 저체력 치유 + 궁 강제 동결(쇄빙 보조) ══");
{
  const snow = makeAlly("snowshine", 1); snow.hp = 2689;
  const ally = makeAlly("estella", 2); ally.hp = 1300; // HP 48%(치유 대상)
  snow.ultCharge = snow.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 999, attack: 300 });
  const s: DDState = { units: [snow, ally, enemy], round: 1, log: [], skillGauge: 100, maxGauge: 99999 };
  const battle = SKILLS.snowshine.find((k) => k.id === "snow-b")!;
  const link = SKILLS.snowshine.find((k) => k.id === "snow-l")!;
  const ult = SKILLS.snowshine.find((k) => k.id === "snow-u")!;
  const g0 = s.skillGauge; act(s, snow, battle); // 포화성 방어: 비호 0.9 + 게이지 반환 + 반격 태세
  console.log(`  포화성 방어: 비호 ${snow.protection} · 게이지 ${g0}→${s.skillGauge} (-100+30) · 반격태세 ${(snow.timers.guard || 0) > 0}`);
  const uc0 = snow.ultCharge = 0; act(s, enemy, atk("적 공격", "physical", undefined)); // 스노우샤인 피격 → 반격
  console.log(`  반격(피격): 적 냉기 부착 ${enemy.arts.cryo} (기대 1) · 궁 ${uc0}→${snow.ultCharge} (구조 전문가 +10)`);
  console.log(`  연계 사용가능(저체력 아군 존재): ${usable(s, snow, link)} (기대 true, 에스텔라 48%)`);
  const a0 = ally.hp; act(s, snow, link); // 극지 구조: 96+60×0.22=109, 55% 이하 ×1.25=136
  console.log(`  극지 구조: 에스텔라 회복 ${a0}→${ally.hp} (기대 +136 = 109×1.25 극지 생존)`);
  snow.ultCharge = snow.ultCost; act(s, snow, ult); // 살얼음 추위: 강제 동결(부착 무관)
  console.log(`  살얼음 추위: 적 동결 ${enemy.frozen} (기대 1, 냉기 부착 미소모) · 잔여 냉기부착 ${enemy.arts.cryo}`);
  act(s, snow, LAUNCH); // 동결 적 띄우기(물리 이상) → 쇄빙
  console.log(`  쇄빙 확인: 동결 ${enemy.frozen} (기대 0, 쇄빙 소모)`);
}

console.log("\n══ 카치르: 반격 방어 불능 + 보호막 + 허약/넘어뜨리기 궁(디펜더) ══");
{
  const cat = makeAlly("catcher", 1); cat.hp = 1000; // HP 37%(연계 게이트)
  cat.ultCharge = cat.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 999, attack: 300 });
  const s: DDState = { units: [cat, enemy], round: 1, log: [], skillGauge: 100, maxGauge: 99999 };
  const battle = SKILLS.catcher.find((k) => k.id === "cat-b")!;
  const link = SKILLS.catcher.find((k) => k.id === "cat-l")!;
  const ult = SKILLS.catcher.find((k) => k.id === "cat-u")!;
  const g0 = s.skillGauge; act(s, cat, battle); // 강력한 저지: 비호 0.9 + 반환 + 반격 태세
  console.log(`  강력한 저지: 비호 ${cat.protection} · 게이지 ${g0}→${s.skillGauge} (-100+30) · 반격태세 ${(cat.timers.guard || 0) > 0}`);
  act(s, enemy, atk("적 공격", "physical", undefined)); // 카치르 피격 → 반격 방불
  console.log(`  반격(피격): 적 방어 불능 ${enemy.physBreak} (기대 1)`);
  console.log(`  연계 사용가능(아군 HP 40% 이하): ${usable(s, cat, link)} (기대 true, 카치르 37%)`);
  act(s, cat, link); // 실시간 억제: 보호막 360+60×2.25=495
  console.log(`  실시간 억제: 카치르 보호막 ${cat.shield} (기대 495 = 360+장비등급×2.25)`);
  act(s, cat, ult); // 교과서적인 맹공: 허약 20% + 넘어뜨리기
  console.log(`  교과서적인 맹공: 적 허약 ${enemy.weakenMul.toFixed(2)} (기대 0.80) · 방불 ${enemy.physBreak} (기대 2, 넘어뜨리기)`);
}
