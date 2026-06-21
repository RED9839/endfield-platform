// 오퍼레이터 기초 스탯을 클래스 컨셉에 맞게 재조정(id별 경계로 안전 적용, 멱등).
// HP/방어/회피/치명 = 클래스 정체성(통일), 공격/스킬위력 = 오퍼별 결정적 변주.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/operators.ts");
let src = readFileSync(file, "utf8");

const T = {
  "디펜더":     { maxHp: 100, attack: 8,  defense: 12, evasion: 4, battle: 18, link: 16, ult: 32, cr: 0.05, cd: 0.50 },
  "가드":       { maxHp: 80,  attack: 14, defense: 4,  evasion: 5, battle: 26, link: 22, ult: 44, cr: 0.13, cd: 0.60 },
  "캐스터":     { maxHp: 56,  attack: 9,  defense: 0,  evasion: 5, battle: 32, link: 28, ult: 50, cr: 0.10, cd: 0.55 },
  "스트라이커": { maxHp: 64,  attack: 13, defense: 1,  evasion: 7, battle: 24, link: 22, ult: 56, cr: 0.18, cd: 0.75 },
  "서포터":     { maxHp: 68,  attack: 9,  defense: 5,  evasion: 5, battle: 20, link: 18, ult: 34, cr: 0.06, cd: 0.50 },
  "뱅가드":     { maxHp: 72,  attack: 11, defense: 3,  evasion: 6, battle: 22, link: 26, ult: 40, cr: 0.11, cd: 0.55 },
};

const CLASS = {
  endministrator: "가드", perlica: "캐스터", chenqianyu: "가드", ardelia: "서포터", ember: "디펜더",
  wulfgar: "디펜더", xaihi: "서포터", snowshine: "디펜더", avywenna: "스트라이커", arclight: "뱅가드",
  dapan: "스트라이커", yvonne: "캐스터", rossi: "가드", tangtang: "캐스터", lifeng: "가드",
  gilberta: "서포터", pogranichnik: "뱅가드", laevatain: "스트라이커", lastrite: "스트라이커", wulfgard: "캐스터",
  alesh: "뱅가드", estella: "가드", catcher: "디펜더", antal: "서포터", fluorite: "캐스터",
  akekuri: "뱅가드", zhuangfangyi: "스트라이커", mifu: "가드",
};

const hash = (s) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

let count = 0;
for (const [id, cls] of Object.entries(CLASS)) {
  const t = T[cls];
  const h = hash(id);
  const atk = t.attack + ((h % 3) - 1);
  const battle = t.battle + ((Math.floor(h / 3) % 5) - 2);
  const link = t.link + ((Math.floor(h / 7) % 5) - 2);
  const ult = t.ult + ((Math.floor(h / 11) % 7) - 3);
  // id로 블록 시작을 잡고, 그 블록 내부의 각 스탯 필드만 교체(다음 블록 침범 방지).
  const blockRe = new RegExp(`(id: "${id}",[\\s\\S]*?\\n  \\})`);
  const m = src.match(blockRe);
  if (!m) { console.log("MISS", id); continue; }
  let blk = m[1];
  blk = blk.replace(/(\n    maxHp: )\d+/, `$1${t.maxHp}`);
  blk = blk.replace(/(\n    attack: )\d+/, `$1${atk}`);
  blk = blk.replace(/(\n    defense: )[A-Za-z0-9_]+/, `$1${t.defense}`);
  blk = blk.replace(/(\n    evasion: )[A-Za-z0-9_]+/, `$1${t.evasion}`);
  blk = blk.replace(/(\n    battleSkillPower: )\d+/, `$1${battle}`);
  blk = blk.replace(/(\n    linkSkillPower: )\d+/, `$1${link}`);
  blk = blk.replace(/(\n    ultimatePower: )\d+/, `$1${ult}`);
  blk = blk.replace(/(\n    critRate: )[\d.]+/, `$1${t.cr}`);
  blk = blk.replace(/(\n    critDamage: )[\d.]+/, `$1${t.cd}`);
  src = src.replace(m[1], blk);
  count += 1;
}
writeFileSync(file, src);
console.log(`스탯 재조정 ${count}/${Object.keys(CLASS).length}`);
