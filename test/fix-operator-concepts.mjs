// 와파린 위키 검색 기반 컨셉 확정: 속성 오류 3건 + 메커닉/physBreak 정합.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/operators.ts");
let src = readFileSync(file, "utf8");

function setField(id, field, value) {
  const re = new RegExp(`(id: "${id}",[\\s\\S]*?${field}: )"[^"]+"`);
  if (re.test(src)) src = src.replace(re, `$1"${value}"`);
  else console.log("MISS", id, field);
}

// 1) 속성 오류 교정(실제 와파린 기준)
setField("avywenna", "element", "electric"); // 자연 → 전기
setField("dapan", "element", "physical");    // 열기 → 물리
setField("yvonne", "element", "cryo");       // 물리 → 냉기

// 2) 아비웬나(전기 스트라이커) → 광역 연계 메커닉
setField("avywenna", "skillMechanic", "electric-attachment");

// 3) 다판: physBreak 없음 → 컨슈머 추가(실제 재능 '전분 풀기'=방어불능/취약 소모). critDamage 뒤에 삽입.
{
  const re = /(id: "dapan",[\s\S]*?critDamage: [\d.]+,)/;
  if (re.test(src) && !/(id: "dapan",[\s\S]*?physBreak)/.test(src.match(re)[1])) {
    src = src.replace(re, `$1\n    physBreak: "consume",`);
  } else console.log("dapan physBreak insert skipped");
}

// 4) 이본: 이제 냉기 → 물리용 physBreak 'build'는 무효 → 제거
src = src.replace(/(id: "yvonne",[\s\S]*?)\n    physBreak: "build",/, "$1");

writeFileSync(file, src);
console.log("operator 컨셉 확정 완료");
