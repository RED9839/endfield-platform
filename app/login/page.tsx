import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { GoogleSignInButton } from "@/app/components/auth/AuthButtons";
import { prisma } from "@/lib/prisma";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { nickname: true },
    });

    if (!user?.nickname) {
      redirect("/setup-profile");
    }

    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-20 text-white">
      <section className="mx-auto max-w-md rounded-3xl border border-yellow-500/15 bg-[#0a0d12] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300/80">
          Endfield Platform
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
