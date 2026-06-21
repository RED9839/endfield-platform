// 오퍼레이터 passiveMechanic을 실제 재능 기반 새 아키타입으로 재배정.
// passiveName(고유) → 새 mechanic 매핑 후, 그 뒤 첫 passiveMechanic 값을 치환.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/operators.ts");
let src = readFileSync(file, "utf8");

const MAP = {
  "본질 붕괴": "crystal-burst",
  "오블리터레이션 프로토콜": "vs-broken",
  "칼날 베기": "blade-stacks",
  "친구의 그림자": "support-heal",
  "전진의 결의": "guardian-shield",
  "수호 태세": "guardian-shield",
  "가동 프로세스": "vs-status",
  "극지 생존": "support-heal",
  "고효율 배송": "energy-surge",
  "황무지의 여행자": "vs-status",
  "전분 풀기": "blade-stacks",
  "하이테크 버스트": "blade-stacks",
  "절흔": "vs-status",
  "의기투합": "vs-status",
  "돈오": "flat-power",
  "전달자의 노래": "energy-surge",
  "생존의 깃발": "blade-stacks",
  "불꽃의 심장": "vs-status",
  "저체온증": "vs-status",
  "불타는 송곳니": "vs-status",
  "급속 냉동 보존 기술": "energy-surge",
  "공감": "guardian-shield",
  "강인한 방어선": "flat-power",
  "즉흥적인 천재성": "support-heal",
  "몰락의 조력자": "vs-status",
  "승리의 함성": "energy-surge",
  "천지의 조화": "vs-status",
  "냉정": "vs-broken",
};

let count = 0;
for (const [name, mech] of Object.entries(MAP)) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(passiveName: "${esc}",[\\s\\S]*?passiveMechanic: )"[^"]+"`);
  if (re.test(src)) {
    src = src.replace(re, `$1"${mech}"`);
    count += 1;
  } else {
    console.log("MISS:", name);
  }
}
writeFileSync(file, src);
console.log(`재배정 ${count}/${Object.keys(MAP).length}`);
