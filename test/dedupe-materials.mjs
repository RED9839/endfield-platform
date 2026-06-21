// public/materials 중 public/items와 바이트 동일한 중복 이미지를 삭제하고,
// 해당 파일을 가리키는 정적 참조(/materials/X.webp → /items/X.webp)를 수정한다.
// 내용이 다른 동명 파일과 materials 전용 파일은 보존한다.
// 실행: node test/dedupe-materials.mjs
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const matDir = join(root, "public/materials");
const itmDir = join(root, "public/items");

// 1) 바이트 동일한 동명 파일 집합 산출
const matFiles = readdirSync(matDir).filter((f) => f.endsWith(".webp"));
const identical = new Set();
let differ = 0;
for (const f of matFiles) {
  const itm = join(itmDir, f);
  if (!existsSync(itm)) continue; // materials 전용
  const a = readFileSync(join(matDir, f));
  const b = readFileSync(itm);
  if (a.equals(b)) identical.add(f);
  else differ += 1;
}
console.log(`중복(동일) ${identical.size} · 동명이지만 상이 ${differ} · materials 전용 ${matFiles.length - identical.size - differ}`);

// 2) 참조 파일 수집(git 추적 소스 한정)
const grepOut = execSync(`git -C "${root}" grep -lI "/materials/" -- "*.ts" "*.tsx"`, { encoding: "utf8" }).trim();
const refFiles = grepOut ? grepOut.split("\n") : [];

// 3) 식별된 중복 이름만 /items/ 로 치환
let editedFiles = 0;
let replacements = 0;
for (const rel of refFiles) {
  const abs = join(root, rel);
  const before = readFileSync(abs, "utf8");
  const after = before.replace(/\/materials\/([^"'`]+?\.webp)/g, (m, name) => {
    if (identical.has(name)) { replacements += 1; return `/items/${name}`; }
    return m;
  });
  if (after !== before) { writeFileSync(abs, after); editedFiles += 1; }
}
console.log(`경로 수정: ${replacements}건 · 파일 ${editedFiles}개`);

// 4) 중복 파일 삭제
let deleted = 0;
for (const f of identical) { rmSync(join(matDir, f)); deleted += 1; }
console.log(`삭제: ${deleted}개 · 남은 materials: ${readdirSync(matDir).filter((f) => f.endsWith(".webp")).length}개`);
