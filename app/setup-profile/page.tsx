import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function SetupProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; value?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-[#050505] px-3 py-8 text-white sm:px-4 sm:py-20">
        <section className="mx-auto max-w-md rounded-2xl border border-yellow-500/15 bg-[#0a0d12] p-5 text-center sm:rounded-3xl sm:p-8">
          <p className="text-sm text-zinc-300">로그인이 필요합니다.</p>
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
    <main className="min-h-screen bg-[#050505] px-3 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-white sm:px-4 sm:py-20">
      <section className="mx-auto max-w-md rounded-2xl border border-yellow-500/15 bg-[#0a0d12] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:rounded-3xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300/80">
          프로필 설정
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#ffdc70]">
          닉네임 설정
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
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
            className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400/40"
          />

          <p className="text-xs leading-5 text-zinc-500">
            2~16자, 한글/영문/숫자/밑줄(_) 사용 가능
          </p>

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#ffd24a] text-sm font-black text-black transition hover:brightness-110"
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
    <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
      {children}
    </p>
  );
}
