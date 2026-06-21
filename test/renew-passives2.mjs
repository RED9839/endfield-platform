// 오퍼레이터별 실제 재능 컨셉에 맞춘 passiveMechanic 세분화(직군 정합 + 개별 키트 반영).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/operators.ts");
let src = readFileSync(file, "utf8");

// id → 패시브(실제 재능 기반). 주석: 실제 재능
const MAP = {
  endministrator: "crystal-burst", // 본질 붕괴: 결정 소모 → 강화
  perlica: "vs-broken",            // 오블리터레이션: 불균형 적 피해+
  chenqianyu: "blade-stacks",      // 칼날 베기: 스킬 명중 누적
  ardelia: "support-heal",         // 친구의 그림자: 회복
  ember: "guardian-shield",        // 전진의 결의: 비호
  wulfgar: "guardian-shield",      // 수호 태세: 보호막
  xaihi: "team-amp",               // 가동 프로세스: 냉기 취약 → 팀 딜 상승
  snowshine: "support-heal",       // 극지 생존: 저HP 치유 강화
  avywenna: "energy-surge",        // 고효율 배송: 명중 시 궁극 에너지
  arclight: "team-amp",            // 황무지의 여행자: 팀 전기 피해 증폭
  dapan: "blade-stacks",           // 전분 풀기: 방불 소모 누적
  yvonne: "crit-surge",            // 하이테크 버스트: 동결 후 강타
  rossi: "vs-status",              // 절흔: DoT/받피증 적 처리
  tangtang: "team-amp",            // 의기투합: 가속/감속 오라
  lifeng: "flat-power",            // 돈오: 스탯형 상시 강화
  gilberta: "energy-surge",        // 전달자의 노래: 팀 궁극 충전
  pogranichnik: "energy-surge",    // 생존의 깃발: 스킬게이지 회복
  laevatain: "blade-stacks",       // 불꽃의 심장: 열기 흡수 누적
  lastrite: "vs-status",           // 저체온증: 냉기 취약 적 처리
  wulfgard: "vs-status",           // 불타는 송곳니: 연소 적 처리
  alesh: "energy-surge",           // 급속 냉동: 부착 시 궁극 에너지
  estella: "vs-broken",            // 공감(가드): 불균형 처리
  catcher: "guardian-shield",      // 강인한 방어선: 방어
  antal: "support-heal",           // 즉흥적인 천재성: 회복
  fluorite: "vs-status",           // 몰락의 조력자: 감속 적 피해+
  akekuri: "energy-surge",         // 승리의 함성: 연계 게이지 회복
  zhuangfangyi: "blade-stacks",    // 천지의 조화: 전기 증폭 누적
  mifu: "vs-broken",               // 냉정: 취약/불균형 적 피해+
};

let fix = 0;
for (const [id, mech] of Object.entries(MAP)) {
  const re = new RegExp(`(id: "${id}",[\\s\\S]*?passiveMechanic: )"[^"]+"`);
  if (re.test(src)) { src = src.replace(re, `$1"${mech}"`); fix += 1; } else console.log("MISS", id);
}
writeFileSync(file, src);
console.log(`passiveMechanic 세분화 ${fix}/${Object.keys(MAP).length}`);
