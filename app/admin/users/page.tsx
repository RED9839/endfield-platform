import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ===== 카탈로그 상세와 통일한 Endfield SF 디자인 토큰 =====
const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default async function AdminUsersPage() {
  const session = await auth();

  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      nickname: true,
      role: true,
      createdAt: true,
      _count: {
        select: { operatorSettings: true },
      },
    },
  });

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg px-3 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] text-ef-ink sm:px-5 sm:py-8">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto mb-3 flex max-w-[1180px] items-center gap-2">
        <span className="h-3 w-3" style={{ background: PRIMARY }} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">
          Admin · Users
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted/60">
          // 유저 관리
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ef-muted">
              ADMIN · USERS
            </p>
            <h1 className="mt-1 break-keep text-2xl font-black tracking-tight text-white sm:text-3xl">
              유저 관리
            </h1>
            <p className="mt-2 text-sm text-ef-muted">
              전체 {users.length.toLocaleString()}명의 회원을 확인합니다.
            </p>
          </div>
          <Link
            href="/admin"
            className="flex min-h-11 shrink-0 items-center border border-ef-line bg-ef-card px-4 text-xs font-black text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT_SM}
          >
            관리자 홈
          </Link>
        </header>

        <section
          className="mt-5 overflow-hidden border border-ef-line bg-ef-card2"
          style={CUT}
        >
          <div className="hidden grid-cols-[1.1fr_1.5fr_0.6fr_0.6fr_0.8fr] gap-4 border-b border-ef-line bg-ef-card px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted md:grid">
            <span>사용자</span>
            <span>이메일</span>
            <span>권한</span>
            <span>세팅</span>
            <span>가입일</span>
          </div>

          <div className="divide-y divide-ef-line">
            {users.map((user) => (
              <article
                key={user.id}
                className="grid gap-3 px-4 py-4 transition hover:bg-ef-card md:grid-cols-[1.1fr_1.5fr_0.6fr_0.6fr_0.8fr] md:items-center md:gap-4 md:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">
                    {user.nickname ?? user.name ?? "닉네임 미설정"}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-ef-muted md:hidden">
                    {user.email ?? "이메일 없음"}
                  </p>
                </div>
                <p className="hidden truncate text-xs text-ef-muted md:block">
                  {user.email ?? "-"}
                </p>
                <div>
                  <span
                    className={`inline-flex px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wide ${
                      user.role === "ADMIN"
                        ? "border border-red-500/40 bg-red-500/10 text-red-300"
                        : "border border-ef-line bg-ef-card text-ef-muted"
                    }`}
                    style={CUT_SM}
                  >
                    {user.role}
                  </span>
                </div>
                <p className="text-xs font-bold text-ef-muted">
                  <span className="text-ef-muted/70 md:hidden">작성 세팅 </span>
                  <span className="font-mono tabular-nums" style={{ color: ACCENT }}>
                    {user._count.operatorSettings.toLocaleString()}
                  </span>
                </p>
                <p className="font-mono text-xs tabular-nums text-ef-muted">
                  {user.createdAt.toLocaleDateString("ko-KR")}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
