// 덱 구조(skillMechanic) 직군 컨셉 정렬:
//  디펜더=protective-arts(실드) · 서포터=corrosion-support(회복)
//  딜러(가드/캐스터/스트라이커/뱅가드): 전기=electric-attachment(광역 연계) · 그 외=combo-strike(피해)
// (originium-crystal은 새 전투에서 죽은 메커닉 → combo-strike로 통합)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/operators.ts");
let src = readFileSync(file, "utf8");

const MECH = {
  // 디펜더 → 실드
  ember: "protective-arts", wulfgar: "protective-arts", snowshine: "protective-arts", catcher: "protective-arts",
  // 서포터 → 회복
  ardelia: "corrosion-support", gilberta: "corrosion-support", antal: "corrosion-support", xaihi: "corrosion-support",
  // 딜러(전기) → 광역 연계
  perlica: "electric-attachment", arclight: "electric-attachment", zhuangfangyi: "electric-attachment",
  // 딜러(그 외) → combo-strike
  endministrator: "combo-strike", chenqianyu: "combo-strike", avywenna: "combo-strike", dapan: "combo-strike",
  yvonne: "combo-strike", rossi: "combo-strike", tangtang: "combo-strike", lifeng: "combo-strike",
  pogranichnik: "combo-strike", laevatain: "combo-strike", lastrite: "combo-strike", wulfgard: "combo-strike",
  alesh: "combo-strike", estella: "combo-strike", fluorite: "combo-strike", akekuri: "combo-strike", mifu: "combo-strike",
};

let count = 0;
for (const [id, mech] of Object.entries(MECH)) {
  const re = new RegExp(`(id: "${id}",[\\s\\S]*?skillMechanic: )"[^"]+"`);
  if (re.test(src)) { src = src.replace(re, `$1"${mech}"`); count += 1; } else console.log("MISS", id);
}
writeFileSync(file, src);
console.log(`skillMechanic 정렬 ${count}/${Object.keys(MECH).length}`);
