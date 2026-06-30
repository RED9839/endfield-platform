// 지속시간(턴) · 연계 쿨타임 검증 (1턴=5초).
import { DDState, DDUnit, DDSkill, act, applyAttach, cleanse, startRound, usable } from "../app/game/dd/combat";

function unit(over: Partial<DDUnit>): DDUnit {
  return {
    id: "x", name: "x", side: "ally", pos: 1, hp: 1e7, maxHp: 1e7, speed: 50, attack: 100,
    physBreak: 0, stagger: 0, staggerMax: 999, staggered: false, staggerTimer: 0,
    statuses: [], dot: 0, multiHit: 0, ultCharge: 0, ultCost: 999, atkBuff: 0,
    arts: { heat: 0, electric: 0, cryo: 0, nature: 0 }, frozen: 0,
    amp: {}, vuln: {}, weakenMul: 1, protection: 0, shield: 0, speedMod: 0, timers: {}, linkCd: 0, defense: 0, resist: { physical: 0, arts: 0 }, critRate: 0.05, critDmg: 0.5, stance: 0, ironOath: 0, gaugeRecovered: 0, gearGrade: 60, procCount: 0, ...over,
  };
}
let pass = 0, fail = 0;
const ck = (name: string, ok: boolean) => { console.log(`  ${ok ? "✅" : "❌"} ${name}`); ok ? pass++ : fail++; };
function fresh() { const a = unit({ id: "a" }); const e = unit({ id: "e", side: "enemy" }); const s: DDState = { units: [a, e], round: 0, log: [], skillGauge: 9999, maxGauge: 9999 }; return { a, e, s }; }
const adv = (s: DDState, n: number) => { for (let i = 0; i < n; i++) startRound(s); };

const LAUNCH: DDSkill = { id: "lc", name: "띄우기", kind: "battle", fromPos: [1, 2, 3, 4], target: "single-front", power: 0.1, element: "physical", anomaly: "launch" };
const LINK: DDSkill = { id: "lk", name: "연계", kind: "link", fromPos: [1, 2, 3, 4], target: "single-front", power: 0.1, element: "physical" };

console.log("── 방어 불능 4턴 소멸(미갱신) ──");
{
  const { a, e, s } = fresh();
  act(s, a, LAUNCH); // 방불 1 + timer 4
  ck("부여 직후 방불 1", e.physBreak === 1);
  adv(s, 3); ck("3턴 후 잔존", e.physBreak === 1);
  adv(s, 1); ck("4턴 후 소멸", e.physBreak === 0);
}

console.log("── 방어 불능 갱신(재적용 리셋) ──");
{
  const { a, e, s } = fresh();
  act(s, a, LAUNCH); adv(s, 3); // 거의 만료
  act(s, a, LAUNCH); // 갱신 → 타이머 4로 리셋(스택 2)
  adv(s, 3); ck("갱신 후 3턴 잔존", e.physBreak >= 1);
}

console.log("── 연계 쿨타임 3턴 ──");
{
  const { a, e, s } = fresh();
  ck("초기 사용 가능", usable(s, a, LINK));
  act(s, a, LINK); // linkCd=3
  ck("사용 직후 쿨", !usable(s, a, LINK));
  adv(s, 2); ck("2턴 후 여전히 쿨", !usable(s, a, LINK));
  adv(s, 1); ck("3턴 후 사용 가능", usable(s, a, LINK));
}

console.log("── 본질붕괴/취약/연소 만료 ──");
{
  const { a } = fresh();
  const s: DDState = { units: [a], round: 0, log: [], skillGauge: 9999, maxGauge: 9999 };
  a.atkBuff = 0.3; a.timers["atkBuff"] = 3;
  adv(s, 3); ck("본질붕괴 3턴 만료", a.atkBuff === 0);
}
{
  const e = unit({ id: "e", side: "enemy" }); const src = unit({ id: "s2" });
  const s: DDState = { units: [src, e], round: 0, log: [], skillGauge: 9999, maxGauge: 9999 };
  applyAttach(e, "electric", src, []); applyAttach(e, "heat", src, []); // 감전(아츠취약) + 이후 연소 DoT
  applyAttach(e, "electric", src, []); applyAttach(e, "heat", src, []);
  const hadVuln = (e.vuln.arts ?? 0) > 0 || e.dot > 0;
  ck("디버프 적용됨", hadVuln);
  adv(s, 4); ck("취약/DoT 만료", (e.vuln.arts ?? 0) === 0 && e.dot === 0);
}

console.log("── 정화: 디버프 타이머 제거 ──");
{
  const u = unit({});
  u.vuln = { physical: 0.3 }; u.timers["vuln:physical"] = 3; u.atkBuff = 0.3; u.timers["atkBuff"] = 3;
  cleanse(u);
  ck("디버프 타이머 제거 + 버프 유지", !u.timers["vuln:physical"] && u.timers["atkBuff"] === 3 && u.atkBuff === 0.3);
}

console.log(`\n=== ${pass}/${pass + fail} 통과 ===`);
