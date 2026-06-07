import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    <main className="min-h-screen overflow-x-clip bg-[#030405] px-3 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] text-white sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] text-red-300/70">
              ADMIN · USERS
            </p>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              유저 관리
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              전체 {users.length.toLocaleString()}명의 회원을 확인합니다.
            </p>
          </div>
          <Link
            href="/admin"
            className="flex min-h-11 shrink-0 items-center rounded-xl border border-white/10 bg-black px-4 text-xs font-black text-zinc-300 hover:border-red-400/30 hover:text-white"
          >
            관리자 홈
          </Link>
        </header>

        <section className="mt-5 overflow-hidden rounded-[22px] border border-white/10 bg-[#09090b]">
          <div className="hidden grid-cols-[1.1fr_1.5fr_0.6fr_0.6fr_0.8fr] gap-4 border-b border-white/10 bg-black/30 px-5 py-3 text-[10px] font-black tracking-[0.14em] text-zinc-600 md:grid">
            <span>사용자</span>
            <span>이메일</span>
            <span>권한</span>
            <span>세팅</span>
            <span>가입일</span>
          </div>

          <div className="divide-y divide-white/[0.07]">
            {users.map((user) => (
              <article
                key={user.id}
                className="grid gap-3 px-4 py-4 transition hover:bg-white/[0.02] md:grid-cols-[1.1fr_1.5fr_0.6fr_0.6fr_0.8fr] md:items-center md:gap-4 md:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">
                    {user.nickname ?? user.name ?? "닉네임 미설정"}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-zinc-600 md:hidden">
                    {user.email ?? "이메일 없음"}
                  </p>
                </div>
                <p className="hidden truncate text-xs text-zinc-400 md:block">
                  {user.email ?? "-"}
                </p>
                <div>
                  <span
                    className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-black ${
                      user.role === "ADMIN"
                        ? "bg-red-500/10 text-red-300"
                        : "bg-white/5 text-zinc-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <p className="text-xs font-bold text-zinc-400">
                  <span className="text-zinc-600 md:hidden">작성 세팅 </span>
                  {user._count.operatorSettings.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500">
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
