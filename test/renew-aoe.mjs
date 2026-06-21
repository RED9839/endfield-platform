// 실제 스킬 설명에서 배틀/연계 스킬의 광역 여부를 추출해 battleAoe/linkAoe 플래그 부여(CRLF, 멱등).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/operators.ts");
let src = readFileSync(file, "utf8");

const AOE = /범위|주변|전체|광역|부채꼴|일대|모든 적|다수|전방|폭발|흩|쏟아|연쇄|확산/;
const ids = [...src.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);

let count = 0;
for (const id of ids) {
  const re = new RegExp(`(id: "${id}",[\\s\\S]*?)(\\r?\\n  \\})`);
  const m = src.match(re);
  if (!m) continue;
  let body = m[1];
  if (/battleAoe|linkAoe/.test(body)) continue; // 이미 적용
  const bd = body.match(/battleSkillDescription: "([^"]*)"/)?.[1] ?? "";
  const ld = body.match(/linkSkillDescription: "([^"]*)"/)?.[1] ?? "";
  const flags = [];
  if (AOE.test(bd)) flags.push("battleAoe: true");
  if (AOE.test(ld)) flags.push("linkAoe: true");
  if (!flags.length) continue;
  // critDamage 라인 뒤에 삽입(CRLF 유지)
  body = body.replace(/(critDamage: [\d.]+,)/, (mm) => `${mm}\r\n    ${flags.join(",\r\n    ")},`);
  src = src.replace(m[1], body);
  count += 1;
}
writeFileSync(file, src);
console.log(`AOE 플래그 적용 ${count}명`);
