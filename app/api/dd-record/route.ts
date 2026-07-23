// 닼던류 원정 기록 저장/조회 — 학습·밸런스 분석용.
// 실서버: Prisma(DDRunRecord 테이블). 로그인 시 유저 연결, 익명 플레이도 허용(userId null).
// 로컬 등 DB 불가 시: test/dd-runs.jsonl 파일로 폴백(게임 진행엔 무영향).
// 부하 방어: POST 크기 제한(300KB)·결과값 검증·최근 1,000건 초과분 자동 정리 / GET 기본 요약(전체 JSON은 ?full=1, 최대 20건).
import { promises as fs } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "test", "dd-runs.jsonl");
const MAX_BODY = 300_000; // 원정 1판 실측 50~100KB — 그 이상은 비정상 페이로드
const KEEP = 1000; // DB 보관 상한(초과분은 오래된 것부터 정리)
type Row = { id: string; createdAt: Date; data: unknown };
const db = () => (prisma as unknown as { dDRunRecord: {
  create: (a: unknown) => Promise<unknown>;
  findMany: (a: unknown) => Promise<Row[]>;
  count: () => Promise<number>;
  deleteMany: (a: unknown) => Promise<unknown>;
} }).dDRunRecord;

export async function POST(req: Request) {
  let raw: string;
  try { raw = await req.text(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (raw.length > MAX_BODY) return Response.json({ ok: false, error: "too large" }, { status: 413 });
  let rec: Record<string, unknown>;
  try { rec = JSON.parse(raw); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (!rec || typeof rec !== "object") return Response.json({ ok: false }, { status: 400 });
  if (rec.result !== "victory" && rec.result !== "defeat") return Response.json({ ok: false }, { status: 400 });
  let userId: string | null = null;
  try { const s = await auth(); userId = ((s?.user as { id?: string } | undefined)?.id) ?? null; } catch { /* 비로그인 허용 */ }
  const t = (rec.totals as { battles?: number; rounds?: number; dmgDealt?: number }) ?? {};
  try {
    await db().create({ data: {
      userId, result: String(rec.result), floorReached: Number(rec.floorReached ?? 0), totalFloors: Number(rec.totalFloors ?? 0),
      durationSec: Number(rec.durationSec ?? 0), battles: t.battles ?? 0, rounds: t.rounds ?? 0, dmgDealt: t.dmgDealt ?? 0, data: rec,
    } });
    // 보관 상한 초과분 정리 — 원정 종료마다 1회라 부담 없음. 실패해도 저장은 성공으로.
    try {
      const n = await db().count();
      if (n > KEEP) {
        const over = await db().findMany({ orderBy: { createdAt: "desc" }, skip: KEEP, select: { id: true } });
        if (over.length) await db().deleteMany({ where: { id: { in: over.map((r) => r.id) } } });
      }
    } catch { /* 정리 실패 무시 */ }
    return Response.json({ ok: true, store: "db" });
  } catch {
    try { await fs.mkdir(path.dirname(FILE), { recursive: true }); await fs.appendFile(FILE, JSON.stringify(rec) + "\n", "utf8"); return Response.json({ ok: true, store: "file" }); }
    catch { return Response.json({ ok: false }, { status: 200 }); } // 저장 실패해도 게임엔 무영향
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const full = url.searchParams.get("full") === "1";
  const take = Math.min(Math.max(1, Number(url.searchParams.get("take")) || (full ? 20 : 50)), full ? 20 : 100);
  try {
    if (full) {
      // 전체 JSON(사이클 포함) — 무거우니 최대 20건
      const runs = await db().findMany({ orderBy: { createdAt: "desc" }, take });
      return Response.json({ ok: true, count: runs.length, source: "db", runs: runs.map((r) => r.data) });
    }
    // 기본: 요약(인덱스·숫자 컬럼만) — actions 등 무거운 JSON 제외
    const runs = await db().findMany({ orderBy: { createdAt: "desc" }, take,
      select: { id: true, result: true, floorReached: true, totalFloors: true, durationSec: true, battles: true, rounds: true, dmgDealt: true, createdAt: true, userId: true } });
    return Response.json({ ok: true, count: runs.length, source: "db", summary: true, runs });
  } catch {
    try { const txt = await fs.readFile(FILE, "utf8"); const runs = txt.trim().split("\n").filter(Boolean).slice(-take).map((l) => JSON.parse(l)); return Response.json({ ok: true, count: runs.length, source: "file", runs }); }
    catch { return Response.json({ ok: true, count: 0, runs: [] }); }
  }
}
