import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type AccountPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "required") return "닉네임을 입력해주세요.";
  if (error === "length") return "닉네임은 2~16자로 입력해주세요.";
  if (error === "duplicate") return "이미 사용 중인 닉네임입니다.";
  if (error === "delete-confirm") return "회원탈퇴 확인 문구가 일치하지 않습니다.";
  return "";
}

function getSuccessMessage(success?: string) {
  if (success === "profile") return "프로필 정보가 저장되었습니다.";
  return "";
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const sessionEmail = session.user.email?.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: session.user.id },
        ...(sessionEmail ? [{ email: sessionEmail }] : []),
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      nickname: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  async function updateProfile(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session?.user?.id) {
      redirect("/login");
    }

    const nickname = String(formData.get("nickname") ?? "").trim();
    const sessionEmail = session.user.email?.trim().toLowerCase();

    if (!nickname) {
      redirect("/account?error=required");
    }

    if (nickname.length < 2 || nickname.length > 16) {
      redirect("/account?error=length");
    }

    const nicknameOwner = await prisma.user.findFirst({
      where: {
        nickname,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (nicknameOwner) {
      const ownerEmail = nicknameOwner.email?.trim().toLowerCase() ?? null;

      if (nicknameOwner.id !== session.user.id) {
        if (!sessionEmail || !ownerEmail || ownerEmail !== sessionEmail) {
          redirect("/account?error=duplicate");
        }
      }
    }

    await prisma.user.createMany({
      data: [
        {
          id: session.user.id,
          name: session.user.name ?? null,
          email: sessionEmail ?? null,
          nickname,
        },
      ],
      skipDuplicates: true,
    });

    await prisma.user.updateMany({
      where: {
        OR: [
          { id: session.user.id },
          ...(sessionEmail ? [{ email: sessionEmail }] : []),
        ],
      },
      data: {
        id: session.user.id,
        nickname,
      },
    });

    redirect("/account?success=profile");
  }

  async function deleteAccount(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session?.user?.id) {
      redirect("/login");
    }

    const confirmText = String(formData.get("confirmText") ?? "").trim();

    if (confirmText !== "탈퇴합니다") {
      redirect("/account?error=delete-confirm");
    }

    await prisma.user.deleteMany({
      where: {
        OR: [
          { id: session.user.id },
          ...(sessionEmail ? [{ email: sessionEmail }] : []),
        ],
      },
    });

    redirect("/");
  }

  const errorMessage = getErrorMessage(params?.error);
  const successMessage = getSuccessMessage(params?.success);
  const displayName = user.nickname ?? user.name ?? "USER";
  const profileInitial = displayName.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white">
      <div className="mx-auto max-w-[960px]">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300/70">
              Profile
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#ffdc70]">
              프로필 수정
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              이 사이트에서 사용할 닉네임과 회원 정보를 관리합니다.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-white/10 bg-black px-5 py-2 text-sm font-bold text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300"
          >
            홈으로
          </Link>
        </header>

        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-300">
            {successMessage}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#070a0f]">
          <div className="border-b border-white/10 bg-black/30 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-yellow-500/20 bg-[#11151c] text-2xl font-black text-[#ffdc70] shadow-[0_0_30px_rgba(255,210,74,0.08)]">
                {profileInitial}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-black text-white">
                  {user.nickname ?? "닉네임 미설정"}
                </h2>
                <p className="mt-1 truncate text-sm text-zinc-400">
                  {user.email ?? "이메일 정보 없음"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-2xl border border-white/10 bg-black/35 p-5">
              <h3 className="text-base font-black text-[#ffdc70]">
                회원 정보
              </h3>

              <div className="mt-5 grid gap-3">
                <InfoRow label="사이트 닉네임" value={user.nickname ?? "미설정"} />
                <InfoRow label="연동 이메일" value={user.email ?? "-"} />
                <InfoRow label="구글 이름" value={user.name ?? "-"} />
                <InfoRow
                  label="가입일"
                  value={user.createdAt.toLocaleDateString("ko-KR")}
                />
              </div>

              <p className="mt-5 rounded-xl border border-yellow-500/10 bg-yellow-400/5 p-3 text-xs leading-5 text-zinc-400">
                프로필 이미지는 Google 프로필을 사용하지 않고, 사이트 닉네임의 첫 글자로 표시합니다.
                닉네임은 세팅 공유, 파티 비교, 유저 추천 기능에서 표시 이름으로 사용할 수 있습니다.
              </p>
            </aside>

            <div className="grid gap-6">
              <section className="rounded-2xl border border-white/10 bg-black/35 p-5">
                <h3 className="text-base font-black text-[#ffdc70]">
                  닉네임 설정
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  닉네임은 2~16자까지 입력할 수 있으며, 다른 유저와 중복될 수 없습니다.
                </p>

                <form action={updateProfile} className="mt-5 grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-xs font-bold text-zinc-500">
                      닉네임
                    </span>
                    <input
                      name="nickname"
                      required
                      minLength={2}
                      maxLength={16}
                      defaultValue={user.nickname ?? ""}
                      placeholder="닉네임 입력"
                      className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400/50"
                    />
                  </label>

                  <button
                    type="submit"
                    className="h-12 rounded-xl bg-[#ffd24a] text-sm font-black text-black transition hover:brightness-110"
                  >
                    닉네임 저장
                  </button>
                </form>
              </section>

              <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
                <h3 className="text-base font-black text-red-300">
                  회원탈퇴
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  회원탈퇴를 하면 이 계정의 로그인 정보가 삭제됩니다.
                </p>

                <form action={deleteAccount} className="mt-5 grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-xs font-bold text-zinc-500">
                      확인 문구
                    </span>
                    <input
                      name="confirmText"
                      placeholder="탈퇴합니다"
                      className="h-12 rounded-xl border border-red-500/20 bg-black px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-700 focus:border-red-400/50"
                    />
                  </label>

                  <button
                    type="submit"
                    className="h-12 rounded-xl border border-red-400/40 bg-red-500/15 text-sm font-black text-red-200 transition hover:bg-red-500/25"
                  >
                    회원탈퇴
                  </button>
                </form>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-sm font-black text-white">{value}</p>
    </div>
  );
}
