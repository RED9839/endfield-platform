import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ===== Endfield SF 디자인 토큰 =====
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

export default async function SetupProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; value?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user?.id) {
    return (
      <main className="relative min-h-screen overflow-x-clip bg-ef-bg px-3 py-8 text-ef-ink sm:px-4 sm:py-20">
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
        <section
          className="relative z-10 mx-auto max-w-md border border-ef-line bg-ef-card2 p-5 text-center sm:p-8"
          style={CUT}
        >
          <p className="text-sm text-ef-muted">로그인이 필요합니다.</p>
        </section>
      </main>
    );
  }

  const sessionEmail = session.user.email?.trim().toLowerCase();

  const currentUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: session.user.id },
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: {
      nickname: true,
    },
  });

  if (currentUser?.nickname) {
    redirect("/");
  }

  async function saveNickname(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session?.user?.id) {
      return;
    }

    const sessionEmail = session.user.email?.trim().toLowerCase();

    const nickname = String(formData.get("nickname") ?? "").trim();
    const encodedValue = encodeURIComponent(nickname);

    if (nickname.length < 2 || nickname.length > 16) {
      redirect(`/setup-profile?error=length&value=${encodedValue}`);
    }

    if (!/^[가-힣a-zA-Z0-9_]+$/.test(nickname)) {
      redirect(`/setup-profile?error=format&value=${encodedValue}`);
    }

    const ownerWhere = {
      OR: [
        { id: session.user.id },
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    };

    // 닉네임 중복 체크와 본인 행 조회를 한 번에(순차 라운드트립 제거).
    const [exists, existingUser] = await Promise.all([
      prisma.user.findFirst({
        where: { nickname, NOT: ownerWhere },
        select: { id: true },
      }),
      prisma.user.findFirst({
        where: ownerWhere,
        select: { id: true },
      }),
    ]);

    if (exists) {
      redirect(`/setup-profile?error=duplicate&value=${encodedValue}`);
    }

    if (existingUser) {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          nickname,
          email: sessionEmail ?? null,
          name: session.user.name ?? null,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name ?? null,
          email: sessionEmail ?? null,
          nickname,
        },
      });
    }

    redirect("/");
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg px-3 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-ef-ink sm:px-4 sm:py-20">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto mb-6 flex max-w-md items-center gap-2">
        <span className="h-3 w-3" style={{ background: PRIMARY }} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">Setup</span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted/60">// 프로필 설정</span>
      </div>

      <section
        className="relative z-10 mx-auto max-w-md overflow-hidden border border-ef-line bg-ef-card2 p-5 sm:p-8"
        style={CUT}
      >
        <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
        <div className="flex items-center gap-2">
          <span className="h-4 w-1" style={{ background: PRIMARY }} />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ef-muted">
            프로필 설정
          </p>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
          닉네임 설정
        </h1>
        <p className="mt-3 text-sm leading-6 text-ef-muted">
          다른 유저에게 표시될 닉네임입니다. 닉네임은 중복 사용할 수 없습니다.
        </p>

        {params?.error === "duplicate" ? (
          <ErrorMessage>이미 사용 중인 닉네임입니다.</ErrorMessage>
        ) : null}

        {params?.error === "length" ? (
          <ErrorMessage>닉네임은 2~16자로 입력해주세요.</ErrorMessage>
        ) : null}

        {params?.error === "format" ? (
          <ErrorMessage>한글, 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.</ErrorMessage>
        ) : null}

        <form action={saveNickname} className="mt-8 space-y-4">
          <input
            name="nickname"
            required
            minLength={2}
            maxLength={16}
            defaultValue={params?.value ?? ""}
            placeholder="닉네임 입력"
            className="h-12 w-full border border-ef-line bg-ef-card px-4 text-sm font-bold text-white outline-none transition placeholder:text-ef-muted/70 focus:border-ef-accent/50"
            style={CUT_SM}
          />

          <p className="font-mono text-xs leading-5 text-ef-muted">
            2~16자, 한글/영문/숫자/밑줄(_) 사용 가능
          </p>

          <button
            type="submit"
            className="h-12 w-full text-sm font-black text-black transition hover:brightness-110"
            style={{ ...CUT_SM, background: ACCENT }}
          >
            시작하기
          </button>
        </form>
      </section>
    </main>
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300" style={CUT_SM}>
      {children}
    </p>
  );
}
