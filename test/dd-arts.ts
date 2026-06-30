// 아츠 시스템 검증 — 부착/폭발/이상(연소·감전·동결·쇄빙·부식)을 시나리오로 확인.
import { DDState, DDUnit, DDSkill, act, applyAttach, usable, canAct as canActImport, setTimer as setTimerImport, BASIC } from "../app/game/dd/combat";
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

console.log("\n══ 아델리아: 부식 셋업→소모 물리/아츠 취약 + 돌리 그림자 회복(서포터) ══");
{
  const ard = makeAlly("ardelia", 1); ard.hp = 2689;
  const ally = makeAlly("camu", 2); ally.hp = 1000; // 부상 아군(회복 대상)
  ard.ultCharge = ard.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 999 });
  const s: DDState = { units: [ard, ally, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.ardelia.find((k) => k.id === "ard-b")!;
  const link = SKILLS.ardelia.find((k) => k.id === "ard-l")!;
  console.log(`  연계 사용가능(방불·부착 없는 적): ${usable(s, ard, link)} (기대 true)`);
  const h0 = ally.hp; act(s, ard, battle); // 부식 전 배틀: 취약 X + 친구의 그림자 회복 135
  console.log(`  질주(부식 전): 물리취약 ${enemy.vuln.physical ?? 0}(기대 0) · 카뮤 회복 ${h0}→${ally.hp}(+135 친구의 그림자)`);
  act(s, ard, link); // 화산 분화: 강제 부식
  console.log(`  화산 분화: 적 부식상태 ${enemy.statuses.includes("corrosion")}(기대 true) · 전취약 ${enemy.vuln.all ?? 0}`);
  act(s, ard, battle); // 부식 소모 → 물리/아츠 취약 12%
  console.log(`  질주(부식 소모): 물리취약 ${enemy.vuln.physical ?? 0} · 아츠취약 ${enemy.vuln.arts ?? 0} (기대 0.12) · 부식상태 ${enemy.statuses.includes("corrosion")}(기대 false 소모)`);
}

console.log("\n══ 자이히: 치유/오버힐 아츠 증폭 + 냉기/자연 증폭궁 + 냉기 부착 연계(서포터) ══");
{
  const xai = makeAlly("xaihi", 2);
  const main = makeAlly("estella", 1); main.hp = 1500; // 부상 메인(치유 대상)
  xai.ultCharge = xai.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 999 });
  const s: DDState = { units: [main, xai, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.xaihi.find((k) => k.id === "xai-b")!;
  const link = SKILLS.xaihi.find((k) => k.id === "xai-l")!;
  const ult = SKILLS.xaihi.find((k) => k.id === "xai-u")!;
  console.log(`  연계 사용가능(디도스 전): ${usable(s, xai, link)} (기대 false)`);
  const h0 = main.hp; act(s, xai, battle); // 디도스: 부상 메인 치유(144+60×0.34=164)
  console.log(`  디도스(부상 메인): 에스텔라 회복 ${h0}→${main.hp}(+164 기대) · 디도스활성 ${(xai.timers.didos || 0) > 0}`);
  console.log(`  연계 사용가능(디도스 후): ${usable(s, xai, link)} (기대 true)`);
  act(s, xai, link); // 스트레스 테스트: 냉기 부착 + 가동 프로세스
  console.log(`  스트레스 테스트: 적 냉기부착 ${enemy.arts.cryo} · 냉기취약 ${enemy.vuln.cryo ?? 0} (기대 0.10 가동 프로세스)`);
  main.hp = main.maxHp; act(s, xai, battle); // 오버힐 → 메인 아츠 증폭
  console.log(`  디도스(만피 메인): 에스텔라 아츠증폭 ${main.amp.arts ?? 0} (기대 0.09 오버힐)`);
  act(s, xai, ult); // 스택 오버플로: 팀 냉기/자연 증폭
  console.log(`  스택 오버플로: 에스텔라 냉기증폭 ${(main.amp.cryo ?? 0).toFixed(2)} · 자연증폭 ${(main.amp.nature ?? 0).toFixed(2)} (기대 0.29 = 0.11+장비등급)`);
}

console.log("\n══ 안탈: 전기/열기 취약(장지속) + 증폭궁 + 증폭 팀원 회복(서포터) ══");
{
  const ant = makeAlly("antal", 1);
  const dealer = makeAlly("arclight", 2); dealer.hp = 1000; // 전기 딜러(증폭 받고 딜→회복)
  ant.ultCharge = ant.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 999 });
  const s: DDState = { units: [ant, dealer, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.antal.find((k) => k.id === "ant-b")!;
  const link = SKILLS.antal.find((k) => k.id === "ant-l")!;
  const ult = SKILLS.antal.find((k) => k.id === "ant-u")!;
  act(s, ant, battle); // 지정 연구 대상: 전기/열기 취약
  console.log(`  지정 연구 대상: 전기취약 ${enemy.vuln.electric ?? 0} · 열기취약 ${enemy.vuln.heat ?? 0} (기대 0.05) · 지속 ${enemy.timers["vuln:electric"]}턴(60초)`);
  console.log(`  연계 사용가능(부착 전): ${usable(s, ant, link)} (기대 false)`);
  applyAttach(enemy, "electric", ant, s.log); // 전기 부착
  console.log(`  연계 사용가능(부착 후): ${usable(s, ant, link)} (기대 true)`);
  act(s, ant, ult); // 오버클럭 타임: 팀 전기/열기 증폭
  console.log(`  오버클럭 타임: 아크라이트 전기증폭 ${dealer.amp.electric ?? 0} · 열기증폭 ${dealer.amp.heat ?? 0} (기대 0.08)`);
  const h0 = dealer.hp; act(s, dealer, atk("전기 딜", "electric", undefined)); // 증폭 상태 딜러 스킬 → 즉흥적 천재성 회복
  console.log(`  즉흥적인 천재성: 아크라이트(증폭) 딜 → 회복 ${h0}→${dealer.hp}(+162 기대 = 108+60×0.9)`);
}

console.log("\n══ 질베르타: 최고 아츠 취약궁(방불 비례) + 강제 띄우기 연계 + 궁충 재능(서포터 1황) ══");
{
  const gil = makeAlly("gilberta", 1);
  const guard = makeAlly("mifu", 2); // 가드(전달자의 노래 궁충 대상)
  gil.ultCharge = gil.ultCost;
  const e1 = unit({ id: "e1", name: "적A", side: "enemy", pos: 1, maxHp: 1e7, hp: 1e7, staggerMax: 999 });
  const e2 = unit({ id: "e2", name: "적B", side: "enemy", pos: 2, maxHp: 1e7, hp: 1e7, staggerMax: 999 });
  const s: DDState = { units: [gil, guard, e1, e2], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.gilberta.find((k) => k.id === "gil-b")!;
  const link = SKILLS.gilberta.find((k) => k.id === "gil-l")!;
  const ult = SKILLS.gilberta.find((k) => k.id === "gil-u")!;
  console.log(`  연계 사용가능(아츠 이상 전): ${usable(s, gil, link)} (기대 false)`);
  guard.hp = 1000; const uc0 = guard.ultCharge;
  act(s, gil, battle); // 중력 모드: 몹몰이 자연 부착 + 전달자의 노래 궁충(미브 ×1.07) + 뒤늦은 편지(2명 명중)
  console.log(`  중력 모드: 적A 자연부착 ${e1.arts.nature} · 미브 궁충 ${uc0}→${guard.ultCharge.toFixed(1)} (전달자의 노래 ×1.07) · 미브 회복 1000→${guard.hp}(뒤늦은 편지)`);
  applyAttach(e1, "electric", gil, s.log); applyAttach(e1, "heat", gil, s.log); // 전기→열기 = 연소(아츠 이상)
  console.log(`  연계 사용가능(연소 후): ${usable(s, gil, link)} (기대 true)`);
  e1.physBreak = 2; act(s, gil, ult); // 중력장: 방불 2 → 아츠 취약 0.18+2×0.0175=0.215
  console.log(`  중력장: 적A 아츠취약 ${(e1.vuln.arts ?? 0).toFixed(3)} (기대 0.215 = 0.18+방불2×0.0175) · 감속 ${e1.speedMod} · 자연부착 ${e1.arts.nature}`);
}

console.log("\n══ 펠리카: 전기 부착 + 강제 감전 연계(아츠 취약) + 깡딜 궁 + 불균형 추가딜(첫 캐스터) ══");
{
  const prl = makeAlly("perlica", 1); prl.critRate = 0; // 깡딜 측정용
  prl.ultCharge = prl.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 1e9, defense: 0 });
  const s: DDState = { units: [prl, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.perlica.find((k) => k.id === "prl-b")!;
  const link = SKILLS.perlica.find((k) => k.id === "prl-l")!;
  const ult = SKILLS.perlica.find((k) => k.id === "prl-u")!;
  act(s, prl, battle); // 뇌격: 전기 부착
  console.log(`  뇌격: 적 전기부착 ${enemy.arts.electric} (기대 1)`);
  act(s, prl, link); // 연쇄 섬광: 강제 감전 + 아츠 취약
  console.log(`  연쇄 섬광: 적 감전 ${enemy.statuses.includes("shock")} · 아츠취약 ${enemy.vuln.arts ?? 0} (기대 0.12 강제 감전)`);
  const hp1 = enemy.hp; act(s, prl, ult); // 궁: 깡딜 445%(불균형 X)
  const dmgNormal = hp1 - enemy.hp;
  enemy.hp = 1e7; enemy.staggered = true; prl.ultCharge = prl.ultCost; const hp2 = enemy.hp; act(s, prl, ult); // 불균형 적: ×1.3(전역) ×1.3(오블리터레이션)
  const dmgStagger = hp2 - enemy.hp;
  console.log(`  깡딜 궁: 일반 ${dmgNormal} · 불균형 ${dmgStagger} (배율 ${(dmgStagger / dmgNormal).toFixed(2)} 기대 1.69 = 1.3×1.3 오블리터레이션)`);
}

console.log("\n══ 울프가드: 연소/감전 소모 추가타 + 강제 연소 궁 + 불타는 송곳니(캐스터) ══");
{
  const wlf = makeAlly("wulfgard", 1);
  wlf.ultCharge = wlf.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 1e9 });
  const s: DDState = { units: [wlf, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.wulfgard.find((k) => k.id === "wlf-b")!;
  const link = SKILLS.wulfgard.find((k) => k.id === "wlf-l")!;
  const ult = SKILLS.wulfgard.find((k) => k.id === "wlf-u")!;
  act(s, wlf, battle); // 탄흔의 열기: 연소/감전 없음 → 열기 부착
  console.log(`  탄흔(부착): 적 열기부착 ${enemy.arts.heat} (기대 1) · 연계가능 ${usable(s, wlf, link)} (기대 true 부착)`);
  enemy.arts.heat = 0; applyAttach(enemy, "electric", wlf, s.log); applyAttach(enemy, "heat", wlf, s.log); // 전기→열기 = 연소(아츠 이상)
  console.log(`  연소 상태: combustion ${enemy.statuses.includes("combustion")} · DoT ${enemy.dot} (기대 연소)`);
  const g0 = s.skillGauge; act(s, wlf, battle); // 탄흔의 열기: 연소 소모 → 대량 추가타 + 게이지(절제의 원칙)
  console.log(`  탄흔(연소 소모): combustion ${enemy.statuses.includes("combustion")}(기대 false 소모) · 게이지 순변동 ${(s.skillGauge - g0).toFixed(0)}(기대 -90 = -100배틀+10절제)`);
  act(s, wlf, ult); // 늑대의 분노: 강제 연소 + 불타는 송곳니
  console.log(`  늑대의 분노: 적 강제연소 ${enemy.statuses.includes("combustion")} · 울프가드 불타는 송곳니(열기증폭) ${(wlf.amp.heat ?? 0)} (기대 0.30)`);
}

console.log("\n══ 플루라이트: 자연 부착+감속 + 무료 다중 아츠 부착 연계/궁(마지막 캐스터) ══");
{
  const flr = makeAlly("fluorite", 1);
  flr.ultCharge = flr.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 1e9, speed: 50 });
  const s: DDState = { units: [flr, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.fluorite.find((k) => k.id === "flr-b")!;
  const link = SKILLS.fluorite.find((k) => k.id === "flr-l")!;
  console.log(`  연계 사용가능(2부착 전): ${usable(s, flr, link)} (기대 false)`);
  act(s, flr, battle); // 서프라이즈?: 자연 부착 + 감속
  console.log(`  서프라이즈?: 적 자연부착 ${enemy.arts.nature} · 감속 speedMod ${enemy.speedMod} (기대 -30)`);
  enemy.arts.nature = 0; applyAttach(enemy, "cryo", flr, s.log); applyAttach(enemy, "cryo", flr, s.log); // 냉기 2부착(외부 냉기 딜러 가정)
  console.log(`  냉기 2부착 후 연계가능: ${usable(s, flr, link)} (기대 true) · 냉기 ${enemy.arts.cryo}`);
  const c0 = enemy.arts.cryo; act(s, flr, link); // 특별 보너스: 무료 냉기 1스택 추가
  console.log(`  특별 보너스: 냉기부착 ${c0}→${enemy.arts.cryo} (기대 +1 무료 부착 지원)`);
}

console.log("\n══ 탕탕: 즉발 냉기 부착 + 용오름(아츠 취약) + 와류 + 시간정지 궁(냉기 캐스터) ══");
{
  const tt = makeAlly("tangtang", 1);
  const ally = makeAlly("estella", 2);
  tt.ultCharge = tt.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e7, hp: 1e7, staggerMax: 1e9, speed: 50 }); // 불균형 안 차게(시간정지 격리)
  const s: DDState = { units: [tt, ally, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.tangtang.find((k) => k.id === "tt-b")!;
  const link = SKILLS.tangtang.find((k) => k.id === "tt-l")!;
  const ult = SKILLS.tangtang.find((k) => k.id === "tt-u")!;
  console.log(`  연계 사용가능(냉기 부착 전): ${usable(s, tt, link)} (기대 false)`);
  act(s, tt, battle); // 우당탕탕: 즉발 냉기 부착 + 용오름 1개(와류 0 → 아츠취약 X)
  console.log(`  우당탕탕(와류0): 냉기부착 ${enemy.arts.cryo} · 아츠취약 ${enemy.vuln.arts ?? 0}(기대 0, 용오름 1개) · 지속냉기 ${enemy.dot > 0}`);
  console.log(`  연계 사용가능(냉기 부착 후): ${usable(s, tt, link)} (기대 true)`);
  const spd0 = ally.speedMod; act(s, tt, link); // 야 강물: 와류 1 생성 + 의기투합
  console.log(`  야 강물!: 와류 ${tt.procCount}(기대 1) · 에스텔라 가속 ${spd0}→${ally.speedMod} · 적 감속 ${enemy.speedMod}`);
  act(s, tt, link); s.skillGauge = 9999; // 와류 2개 누적(쿨 무시 위해 직접 호출)
  const g0 = s.skillGauge; act(s, tt, battle); // 와류 2 소모 → 용오름 3개 → 아츠취약 8% + 게이지 40
  console.log(`  우당탕탕(와류2): 용오름 3개 → 아츠취약 ${enemy.vuln.arts ?? 0}(기대 0.08) · 게이지 +${(s.skillGauge - g0).toFixed(0)}(기대 40-100배틀=-60)`);
  act(s, tt, ult); // 대당가: 시간 정지(불균형 아님 — stun 타이머로 다음 1턴 행동 불가)
  console.log(`  대당가(궁): 적 시간정지 stun ${(enemy.timers.stun || 0) > 0}(기대 true) · 행동가능 ${canActImport(enemy)}(기대 false) · 불균형 ${enemy.staggered}(기대 false — 받는피해 보너스 없음) · 지속냉기 ${enemy.dot > 0}`);
}

console.log("\n══ 라스트 라이트: 냉기 부착 소모 단일 누킹 + 저체온증/저온 취성 + 자기 충전 궁(첫 스트라이커) ══");
{
  const lr = makeAlly("lastrite", 1); lr.critRate = 0;
  const dps = makeAlly("chenqianyu", 2); // 다른 아군(궁충 락 확인용)
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e8, hp: 1e8, staggerMax: 1e9, defense: 0 });
  const s: DDState = { units: [lr, dps, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.lastrite.find((k) => k.id === "lr-b")!;
  const link = SKILLS.lastrite.find((k) => k.id === "lr-l")!;
  const ult = SKILLS.lastrite.find((k) => k.id === "lr-u")!;
  // 궁충 락: 다른 아군(진천우) 배틀 → 라라 궁 충전 안 됨
  const uc0 = lr.ultCharge; act(s, dps, { id: "x", name: "진천우배틀", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1, element: "physical" });
  console.log(`  궁충 락: 타 아군 배틀 후 라라 궁 ${uc0}→${lr.ultCharge} (기대 0 — 자기 충전만)`);
  act(s, lr, battle); // 세쉬카의 비전: 냉기 부착 + 자기 궁충(+16+6.5)
  console.log(`  세쉬카의 비전: 적 냉기부착 ${enemy.arts.cryo} · 라라 궁 ${lr.ultCharge.toFixed(1)} (기대 ~22.5 자기 충전)`);
  console.log(`  연계 사용가능(냉기 1스택): ${usable(s, lr, link)} (기대 false, 3스택 필요)`);
  enemy.arts.cryo = 4; setTimerImport(enemy, "arts:cryo", 4); // 파트너가 냉기 4스택까지 보조
  console.log(`  연계 사용가능(냉기 4스택): ${usable(s, lr, link)} (기대 true)`);
  act(s, lr, link); // 겨울 포식자: 냉기 4스택 소모 → 누킹 + 냉기 취약 16% + 강제 정지
  console.log(`  겨울 포식자: 냉기 ${enemy.arts.cryo}(기대 0 소모) · 냉기취약 ${enemy.vuln.cryo ?? 0}(기대 0.16=4×4%) · 강제정지 ${(enemy.timers.stun || 0) > 0} · 라라 궁 ${lr.ultCharge.toFixed(0)}`);
  // 저온 취성: 궁이 냉기 취약을 1.5배로 간주 → 0.16 → 0.24 적용
  lr.ultCharge = lr.ultCost; enemy.hp = 1e8; const hpB = enemy.hp; act(s, lr, ult);
  const dmgUlt = hpB - enemy.hp;
  console.log(`  마지막 인사(궁): 피해 ${dmgUlt} (저온 취성 — 냉기취약 0.16을 ×1.5=0.24로 간주)`);
}

console.log("\n══ 아비웨나: 썬더랜스 설치(연계/궁) → 회수 중복 폭딜(배틀) + 부착 미소모(스트라이커) ══");
{
  const avy = makeAlly("avywenna", 1); avy.critRate = 0; avy.ultCharge = avy.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e8, hp: 1e8, staggerMax: 1e9, defense: 0 });
  const s: DDState = { units: [avy, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.avywenna.find((k) => k.id === "avy-b")!;
  const link = SKILLS.avywenna.find((k) => k.id === "avy-l")!;
  const ult = SKILLS.avywenna.find((k) => k.id === "avy-u")!;
  console.log(`  연계 사용가능(전기 부착 전): ${usable(s, avy, link)} (기대 false)`);
  applyAttach(enemy, "electric", avy, s.log); // 전기 부착(펠리카 등 가정)
  console.log(`  연계 사용가능(전기 부착 후): ${usable(s, avy, link)} (기대 true)`);
  const e0 = enemy.arts.electric; act(s, avy, link); act(s, avy, link); // 연계 2회 → 일반 투창 6개. 부착 미소모 확인
  console.log(`  번개 타격 ×2: 일반 투창 ${avy.procCount}(기대 6) · 전기 부착 ${e0}→${enemy.arts.electric}(미소모 유지) · 궁충 누적`);
  act(s, avy, ult); // 궁: 강력 투창 1개 + 전기 취약
  console.log(`  결전의 떨림(궁): 강력 투창 ${avy.gaugeRecovered}(기대 1) · 전기취약 ${enemy.vuln.electric ?? 0}(기대 0.10 완곡한 수단)`);
  const hpB = enemy.hp; act(s, avy, battle); // 가로채기: 6일반+1강력 회수 → 본체 67% + 6×75% + 1×192% = 709% + 전기 부착
  const dmg = hpB - enemy.hp;
  console.log(`  가로채기(회수): 투창 회수 → 피해 ${dmg} · 회수 후 보유 일반 ${avy.procCount}/강력 ${avy.gaugeRecovered}(기대 0/0) · 전기부착 ${enemy.arts.electric}(강력 투창 재부착)`);
}

console.log("\n══ 판: 방불 4스택 강타 단발 누커 + 띄우기/넘어뜨리기 빌더 + 전분 풀기(스트라이커) ══");
{
  const pan = makeAlly("dapan", 1); pan.critRate = 0; pan.ultCharge = pan.ultCost;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e8, hp: 1e8, staggerMax: 1e9, defense: 0 });
  const s: DDState = { units: [pan, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.dapan.find((k) => k.id === "dp-b")!;
  const link = SKILLS.dapan.find((k) => k.id === "dp-l")!;
  const ult = SKILLS.dapan.find((k) => k.id === "dp-u")!;
  console.log(`  연계 사용가능(방불 0): ${usable(s, pan, link)} (기대 false, 4스택 필요)`);
  act(s, pan, ult); // 궁: 강제 띄우기+넘어뜨리기 → 방불 2스택
  console.log(`  채 썰어 웍에(궁): 적 방불 ${enemy.physBreak} (기대 2 = 띄우기+넘어뜨리기)`);
  enemy.physBreak = 4; setTimerImport(enemy, "physBreak", 4); // 팀이 방불 4스택까지 적립 가정
  console.log(`  연계 사용가능(방불 4): ${usable(s, pan, link)} (기대 true)`);
  const hpB = enemy.hp; act(s, pan, link); // 조미료 뿌리기: 4스택 강타(×1.1) + 전분 풀기
  console.log(`  조미료 뿌리기: 방불 ${enemy.physBreak}(기대 0 소모) · 판 물리증폭 ${(pan.amp.physical ?? 0).toFixed(2)}(기대 0.24=4스택 전분 풀기) · 피해 ${hpB - enemy.hp}`);
}

console.log("\n══ 레바테인: 열기 부착 흡수→녹아내린 불꽃 4스택→강화 폭발+궁100 + 부활의 불씨(스트라이커) ══");
{
  const lae = makeAlly("laevatain", 1); lae.critRate = 0;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e8, hp: 1e8, staggerMax: 1e9, defense: 0 });
  const s: DDState = { units: [lae, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.laevatain.find((k) => k.id === "lae-b")!;
  const link = SKILLS.laevatain.find((k) => k.id === "lae-l")!;
  const ult = SKILLS.laevatain.find((k) => k.id === "lae-u")!;
  // ① 일반공격으로 흡수
  enemy.arts.heat = 2; setTimerImport(enemy, "arts:heat", 4); // 파트너가 열기 2부착
  act(s, lae, BASIC); // 일반공격(강일)으로 열기 2 흡수 → 녹아내린 불꽃 2
  console.log(`  ① 일반공격 흡수: 녹아내린 불꽃 ${lae.procCount}(기대 2, 열기 2 흡수) · 적 열기부착 ${enemy.arts.heat}(기대 0)`);
  // ② 배틀로 추가 흡수 → 4스택 강화
  enemy.arts.heat = 1; setTimerImport(enemy, "arts:heat", 4);
  const uc0 = lae.ultCharge; act(s, lae, battle); // 흡수1 + 배틀 명중1 = +2 → 4스택 강화 폭발 + 궁 +100
  console.log(`  ② 배틀 흡수→강화: 녹아내린 불꽃 ${lae.procCount}(기대 0 소모) · 강제 연소 ${enemy.statuses.includes("combustion")} · 궁 ${uc0.toFixed(0)}→${lae.ultCharge.toFixed(0)}(기대 +100강화+6.5)`);
  console.log(`  연계 사용가능(연소 적): ${usable(s, lae, link)} (기대 true, 강제 연소)`);
  // ③ 연계로 흡수/빌드 (열기 없으면 명중 +1)
  const p0 = lae.procCount; act(s, lae, link); // 열화: 흡수 + 연계 명중 1
  console.log(`  ③ 연계 흡수/빌드: 녹아내린 불꽃 ${p0}→${lae.procCount}(기대 +1 연계 명중) · 궁 ${lae.ultCharge.toFixed(0)}`);
  // ④ 황혼 변신: 평타 ×3 + 광역화, 배틀 궁중 강화
  lae.amp = {}; for (const k of Object.keys(lae.timers)) delete lae.timers[k]; lae.procCount = 0; // 버프 초기화
  const e2 = unit({ id: "e2", name: "적B", side: "enemy", pos: 2, maxHp: 1e8, hp: 1e8, staggerMax: 1e9, defense: 0 }); s.units.push(e2);
  const hbN = enemy.hp; act(s, lae, BASIC); const dN = hbN - enemy.hp; // 변신 전 평타(단일)
  console.log(`  ④ 변신 전 평타: 적A -${dN} · 적B 무피해 ${e2.hp === 1e8}(단일)`);
  lae.ultCharge = lae.ultCost; act(s, lae, ult); // 황혼 변신
  console.log(`     황혼 변신: twilight ${(lae.timers.twilight || 0)}턴(기대 3)`);
  const hA = enemy.hp, hB = e2.hp; act(s, lae, BASIC); const dA = hA - enemy.hp, dB = hB - e2.hp; // 변신 중 강화 평타(광역)
  console.log(`     강화 평타: 적A -${dA}(변신 전 ${dN} 대비 ×${(dA / dN).toFixed(1)}) · 적B -${dB}(광역화! 기대 >0)`);
  // 부활의 불씨: HP 40% 이하 피격 → 90% 비호 + 회복
  lae.hp = Math.round(lae.maxHp * 0.35);
  act(s, enemy, atk("적 강타", "physical", undefined)); // 적이 레바테인 공격
  console.log(`  부활의 불씨(HP 35%): 비호 ${lae.protection}(기대 0.9) · embersCd ${(lae.timers.embersCd || 0) > 0}`);
}

console.log("\n══ 이본: 냉기/자연 소모 강제 동결 + 빙점(동결 치피) + 치명타 변신 말뚝딜 궁(스트라이커) ══");
{
  const yv = makeAlly("yvonne", 1); yv.critRate = 0.05;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e8, hp: 1e8, staggerMax: 1e9, defense: 0 });
  const s: DDState = { units: [yv, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.yvonne.find((k) => k.id === "yv-b")!;
  const link = SKILLS.yvonne.find((k) => k.id === "yv-l")!;
  const ult = SKILLS.yvonne.find((k) => k.id === "yv-u")!;
  enemy.arts.cryo = 2; setTimerImport(enemy, "arts:cryo", 4); enemy.arts.nature = 1; setTimerImport(enemy, "arts:nature", 4); // 파트너 냉기2+자연1 부착
  const uc0 = yv.ultCharge; act(s, yv, battle); // 얼음 폭탄: 냉기2+자연1=3스택 소모 → 강제 동결 + 궁 +100
  console.log(`  얼음 폭탄: 적 동결 ${enemy.frozen}(기대 3) · 냉기/자연 부착 ${enemy.arts.cryo}/${enemy.arts.nature}(기대 0/0 소모) · 궁 ${uc0}→${yv.ultCharge}(기대 +100=10+30×3)`);
  console.log(`  연계 사용가능(동결 적): ${usable(s, yv, link)} (기대 true)`);
  act(s, yv, link); // 꽁꽁이: 광역 냉기 + 자폭 강제 동결 + 궁 +10
  console.log(`  꽁꽁이(연계): 적 동결 ${enemy.frozen}(자폭 유지) · 궁 ${yv.ultCharge}`);
  // 빙점+변신: 동결 적 궁 → 치명타 대폭 증가 + 동결 소모 추가타
  yv.ultCharge = yv.ultCost; const hb = enemy.hp; act(s, yv, ult);
  console.log(`  아이스 슈터(궁, 동결 적): 동결 ${enemy.frozen}(기대 0 소모) · 피해 ${hb - enemy.hp} (변신 치확+30/치피+60 + 빙점 동결 치피+40 + 동결 소모 267%)`);
}

console.log("\n══ 장방이: 청뢰검(감전 소모→검 생성, 최대9) + 변신 궁(천리의 경지) 지속딜(스트라이커) ══");
{
  const zfy = makeAlly("zhuangfangyi", 1); zfy.critRate = 0;
  const enemy = unit({ id: "e", name: "적", side: "enemy", maxHp: 1e8, hp: 1e8, staggerMax: 1e9, defense: 0 });
  const s: DDState = { units: [zfy, enemy], round: 1, log: [], skillGauge: 9999, maxGauge: 99999 };
  const battle = SKILLS.zhuangfangyi.find((k) => k.id === "zfy-b")!;
  const link = SKILLS.zhuangfangyi.find((k) => k.id === "zfy-l")!;
  const ult = SKILLS.zhuangfangyi.find((k) => k.id === "zfy-u")!;
  enemy.arts.electric = 2; setTimerImport(enemy, "arts:electric", 4); // 펠리카가 전기 2부착 가정
  console.log(`  연계 사용가능(전기 부착 적): ${usable(s, zfy, link)} (기대 true)`);
  const uc0 = zfy.ultCharge; act(s, zfy, link); // 변화의 숨결: 전기 2소모 → 강제 감전 + 궁충
  console.log(`  변화의 숨결: 적 감전 ${enemy.statuses.includes("shock")} · 전기부착 ${enemy.arts.electric}(소모) · 궁 ${uc0}→${zfy.ultCharge}(기대 +40 = 연계 10 + 소모 30)`);
  act(s, zfy, battle); // 뇌정의 부름: 감전 소모 → 청뢰검 +2
  console.log(`  뇌정의 부름①: 청뢰검 ${zfy.procCount}/9(기대 2, 감전 소모) · 감전 ${enemy.statuses.includes("shock")}(기대 false 소모)`);
  act(s, zfy, battle); // 감전 없음 + 청뢰검<3 → +1
  console.log(`  뇌정의 부름②(감전X): 청뢰검 ${zfy.procCount}/9(기대 3)`);
  const e2 = unit({ id: "e2", name: "적B", side: "enemy", pos: 2, maxHp: 1e8, hp: 1e8, staggerMax: 1e9, defense: 0 }); s.units.push(e2);
  zfy.ultCharge = zfy.ultCost; act(s, zfy, ult); // 심판의 폭풍: 변신 + 첫 배틀 3검 보장
  console.log(`  심판의 폭풍(궁): heavenly ${(zfy.timers.heavenly || 0)}턴(기대 4) · 청뢰검 ${zfy.procCount}(기대 ≥3)`);
  const hA = enemy.hp, hB = e2.hp; act(s, zfy, battle); // 변신 중 배틀: 광역 + 강화 뇌격
  console.log(`  변신 중 뇌정의 부름: 청뢰검 ${zfy.procCount}/9 · 적A -${hA - enemy.hp} · 적B -${hB - e2.hp}(광역화! 기대 >0)`);
  const bA = enemy.hp, bB = e2.hp; act(s, zfy, BASIC); // 변신 중 평타: 광역
  console.log(`  변신 중 평타: 적A -${bA - enemy.hp} · 적B -${bB - e2.hp}(광역화! 기대 >0)`);
}
