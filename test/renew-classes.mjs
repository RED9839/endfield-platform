// 와파린 위키 실제 직군으로 className 교정 + 직군 컨셉대로 passiveMechanic 재매칭.
// 직군 컨셉(게임8/아이시베인스):
//  가드=불균형/취약 유발(vs-broken) · 디펜더=보호막(guardian-shield) · 캐스터=아츠 부착/반응(vs-status)
//  스트라이커=조건부 폭발(blade-stacks) · 서포터=버프/회복(support-heal) · 뱅가드=에너지 회복(energy-surge)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/operators.ts");
let src = readFileSync(file, "utf8");

const CLASS_PASSIVE = { "가드": "vs-broken", "디펜더": "guardian-shield", "캐스터": "vs-status", "스트라이커": "blade-stacks", "서포터": "support-heal", "뱅가드": "energy-surge" };

// id → 실제 직군 (와파린 검증). endministrator는 결정 특화로 crystal-burst 예외.
const OPS = {
  endministrator: { cls: "가드", passive: "crystal-burst" },
  perlica: { cls: "캐스터" }, chenqianyu: { cls: "가드" }, ardelia: { cls: "서포터" },
  ember: { cls: "디펜더" }, wulfgar: { cls: "디펜더" }, xaihi: { cls: "서포터" },
  snowshine: { cls: "디펜더" }, avywenna: { cls: "스트라이커" }, arclight: { cls: "뱅가드" },
  dapan: { cls: "스트라이커" }, yvonne: { cls: "캐스터" }, rossi: { cls: "가드" },
  tangtang: { cls: "캐스터" }, lifeng: { cls: "가드" }, gilberta: { cls: "서포터" },
  pogranichnik: { cls: "뱅가드" }, laevatain: { cls: "스트라이커" }, lastrite: { cls: "스트라이커" },
  wulfgard: { cls: "캐스터" }, alesh: { cls: "뱅가드" }, estella: { cls: "가드" },
  catcher: { cls: "디펜더" }, antal: { cls: "서포터" }, fluorite: { cls: "캐스터" },
  akekuri: { cls: "뱅가드" }, zhuangfangyi: { cls: "스트라이커" }, mifu: { cls: "가드" },
};

let cFix = 0, pFix = 0;
for (const [id, o] of Object.entries(OPS)) {
  const passive = o.passive ?? CLASS_PASSIVE[o.cls];
  const reC = new RegExp(`(id: "${id}",[\\s\\S]*?className: )"[^"]+"`);
  const reP = new RegExp(`(id: "${id}",[\\s\\S]*?passiveMechanic: )"[^"]+"`);
  if (reC.test(src)) { const before = src; src = src.replace(reC, `$1"${o.cls}"`); if (src !== before) cFix += 1; } else console.log("MISS class", id);
  if (reP.test(src)) { src = src.replace(reP, `$1"${passive}"`); pFix += 1; } else console.log("MISS passive", id);
}
writeFileSync(file, src);
console.log(`className 갱신 ${cFix} · passiveMechanic 갱신 ${pFix}/${Object.keys(OPS).length}`);
