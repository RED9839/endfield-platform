// materials → items 완전 통합 마무리.
// 1) items/에 없는 materials 파일만 items/로 복사(전용 재료 아이콘 보존)
// 2) 모든 /materials/ 참조를 /items/ 로 치환(tests/ 픽스처 제외)
// 3) public/materials 폴더 삭제
// 실행: node test/finalize-materials.mjs
import { readdirSync, readFileSync, writeFileSync, copyFileSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const matDir = join(root, "public/materials");
const itmDir = join(root, "public/items");

// 1) items/에 없는 파일 복사
let copied = 0;
for (const f of readdirSync(matDir).filter((f) => f.endsWith(".webp"))) {
  if (!existsSync(join(itmDir, f))) { copyFileSync(join(matDir, f), join(itmDir, f)); copied += 1; console.log("copy →", f); }
}
console.log(`복사: ${copied}개 (items 전용 보존)`);

// 2) 참조 치환(tests/ 제외)
const grepOut = execSync(`git -C "${root}" grep -lI "/materials/" -- "*.ts" "*.tsx"`, { encoding: "utf8" }).trim();
const refFiles = (grepOut ? grepOut.split("\n") : []).filter((p) => !p.startsWith("tests/"));
let edited = 0, hits = 0;
for (const rel of refFiles) {
  const abs = join(root, rel);
  const before = readFileSync(abs, "utf8");
  const after = before.replace(/\/materials\//g, () => { hits += 1; return "/items/"; });
  if (after !== before) { writeFileSync(abs, after); edited += 1; }
}
console.log(`경로 치환: ${hits}건 · 파일 ${edited}개 (tests/ 제외)`);

// 3) materials 폴더 삭제
rmSync(matDir, { recursive: true, force: true });
console.log("public/materials 삭제 완료");
