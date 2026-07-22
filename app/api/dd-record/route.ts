// 닼던류 원정 기록 저장/조회 — 학습·밸런스 분석용.
// 실서버: Prisma(DDRunRecord 테이블). 로그인 시 유저 연결, 익명 플레이도 허용(userId null).
// 로컬 등 DB 불가 시: test/dd-runs.jsonl 파일로 폴백(게임 진행엔 무영향).
// ※ 적용 전 필수: (DB 닿는 환경에서) `npx prisma migrate deploy` + `npx prisma generate`.
//    prisma 클라이언트 재생성 전이라 모델 접근은 캐스트로 우회 — 생성 후엔 정상 타입.
import { promises as fs } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "test", "dd-runs.jsonl");
const db = () => (prisma as unknown as { dDRunRecord: { create: (a: unknown) => Promise<unknown>; findMany: (a: unknown) => Promise<{ data: unknown }[]> } }).dDRunRecord;

export async function POST(req: Request) {
  let rec: Record<string, unknown>;
  try { rec = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (!rec || typeof rec !== "object") return Response.json({ ok: false }, { status: 400 });
  let userId: string | null = null;
  try { const s = await auth(); userId = ((s?.user as { id?: string } | undefined)?.id) ?? null; } catch { /* 비로그인 허용 */ }
  const t = (rec.totals as { battles?: number; rounds?: number; dmgDealt?: number }) ?? {};
  try {
    await db().create({ data: {
      userId, result: String(rec.result ?? "unknown"), floorReached: Number(rec.floorReached ?? 0), totalFloors: Number(rec.totalFloors ?? 0),
      durationSec: Number(rec.durationSec ?? 0), battles: t.battles ?? 0, rounds: t.rounds ?? 0, dmgDealt: t.dmgDealt ?? 0, data: rec,
    } });
    return Response.json({ ok: true, store: "db" });
  } catch {
    try { await fs.mkdir(path.dirname(FILE), { recursive: true }); await fs.appendFile(FILE, JSON.stringify(rec) + "\n", "utf8"); return Response.json({ ok: true, store: "file" }); }
    catch { return Response.json({ ok: false }, { status: 200 }); } // 저장 실패해도 게임엔 무영향
  }
}

export async function GET() {
  try {
    const runs = await db().findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return Response.json({ ok: true, count: runs.length, source: "db", runs: runs.map((r) => r.data) });
  } catch {
    try { const txt = await fs.readFile(FILE, "utf8"); const runs = txt.trim().split("\n").filter(Boolean).slice(-100).map((l) => JSON.parse(l)); return Response.json({ ok: true, count: runs.length, source: "file", runs }); }
    catch { return Response.json({ ok: true, count: 0, runs: [] }); }
  }
}
