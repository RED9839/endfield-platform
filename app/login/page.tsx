import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/app/components/auth/AuthButtons";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    const sessionEmail = session.user.email?.trim().toLowerCase();

    let existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: session.user.id },
          ...(sessionEmail
            ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
            : []),
        ],
      },
      select: {
        id: true,
        nickname: true,
      },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name ?? null,
          email: sessionEmail ?? null,
          nickname: null,
        },
        select: {
          id: true,
          nickname: true,
        },
      });
    }

    if (!existingUser.nickname?.trim()) {
      redirect("/setup-profile");
    }

    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#050505] px-3 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-white sm:px-4 sm:py-20">
      <section className="mx-auto max-w-md rounded-2xl border border-yellow-500/15 bg-[#0a0d12] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:rounded-3xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300/80">
          엔드필드 플랫폼
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#ffdc70]">
          로그인 / 회원가입
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Google 계정으로 시작하면 세팅 저장, 파티 구성, 추후 추천 기능에 사용할 수 있습니다.
        </p>

        <div className="mt-8">
          <GoogleSignInButton />
        </div>
      </section>
    </main>
  );
}
