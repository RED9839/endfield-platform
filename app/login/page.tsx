import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/app/components/auth/AuthButtons";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// ===== Endfield SF 디자인 토큰 =====
const PRIMARY = "#ff9a2f";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};

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
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg px-3 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-ef-ink sm:px-4 sm:py-20">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto mb-6 flex max-w-md items-center gap-2">
        <span className="h-3 w-3" style={{ background: PRIMARY }} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">Login</span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted/60">// 로그인</span>
      </div>

      <section
        className="relative z-10 mx-auto max-w-md overflow-hidden border border-ef-line bg-ef-card2 p-5 sm:p-8"
        style={CUT}
      >
        <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
        <div className="flex items-center gap-2">
          <span className="h-4 w-1" style={{ background: PRIMARY }} />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ef-muted">
            엔드필드 플랫폼
          </p>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
          로그인 / 회원가입
        </h1>
        <p className="mt-3 text-sm leading-6 text-ef-muted">
          Google 계정으로 시작하면 세팅 저장, 파티 구성, 추후 추천 기능에 사용할 수 있습니다.
        </p>

        <div className="mt-8">
          <GoogleSignInButton />
        </div>
      </section>
    </main>
  );
}
