// 닼던류 원정 기록 저장/조회 — 학습·밸런스 분석용. POST로 한 줄씩 test/dd-runs.jsonl에 append.
// (프로덕션 read-only 파일시스템에선 조용히 실패 — 게임 진행엔 영향 없음)
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "test", "dd-runs.jsonl");

export async function POST(req: Request) {
  try {
    const rec = await req.json();
    if (!rec || typeof rec !== "object") return Response.json({ ok: false }, { status: 400 });
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.appendFile(FILE, JSON.stringify(rec) + "\n", "utf8");
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 200 }); // 저장 실패해도 게임엔 무영향
  }
}

export async function GET() {
  // 최근 기록 조회(분석용) — 마지막 100줄
  try {
    const txt = await fs.readFile(FILE, "utf8");
    const runs = txt.trim().split("\n").filter(Boolean).slice(-100).map((l) => JSON.parse(l));
    return Response.json({ ok: true, count: runs.length, runs });
  } catch {
    return Response.json({ ok: true, count: 0, runs: [] });
  }
}
