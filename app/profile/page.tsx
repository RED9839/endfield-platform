import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/");
  }

  const settingsCount = await prisma.userOperatorSetting.count({
    where: {
      OR: [
        {
          userId: user.id,
        },
        {
          nickname: user.nickname,
        },
      ],
    },
  });

  const isAdmin = user.role === "ADMIN";

  return (
    <main className="min-h-screen bg-[#050505] p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-black text-[#ffdc70']">
          마이페이지
        </h1>

        <div className="rounded-2xl border border-yellow-500/20 bg-black/30 p-6">
          <div className="text-sm text-zinc-400">
            닉네임
          </div>

          <div className="mt-1 text-xl font-black">
            {user.nickname}
          </div>

          <div className="mt-6 text-sm text-zinc-400">
            이메일
          </div>

          <div className="mt-1 break-all text-base">
            {user.email}
          </div>

          <div className="mt-6 text-sm text-zinc-400">
            작성한 세팅
          </div>

          <div className="mt-1 text-base font-bold">
            {settingsCount}개
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            href="/settings"
            className="rounded-2xl border border-yellow-500/20 bg-black/30 p-5 transition hover:border-yellow-500/50"
          >
            <div className="text-lg font-black text-[#ffdc70]">
              세팅 목록
            </div>

            <div className="mt-2 text-sm text-zinc-400">
              등록된 세팅 확인
            </div>
          </Link>

          <Link
            href="/simulator"
            className="rounded-2xl border border-yellow-500/20 bg-black/30 p-5 transition hover:border-yellow-500/50"
          >
            <div className="text-lg font-black text-[#ffdc70]">
              성장 시뮬레이터
            </div>

            <div className="mt-2 text-sm text-zinc-400">
              목표 재화 계산
            </div>
          </Link>

          <Link
            href="/farming"
            className="rounded-2xl border border-yellow-500/20 bg-black/30 p-5 transition hover:border-yellow-500/50"
          >
            <div className="text-lg font-black text-[#ffdc70]">
              파밍 계산기
            </div>

            <div className="mt-2 text-sm text-zinc-400">
              파밍 계획 계산
            </div>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 transition hover:border-red-500/60"
            >
              <div className="text-lg font-black text-red-300">
                관리자 페이지
              </div>

              <div className="mt-2 text-sm text-zinc-400">
                관리자 전용
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
