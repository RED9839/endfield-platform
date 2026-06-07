import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ProfilePageProps = {
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

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) return null;

  const sessionUserId = session.user?.id ? String(session.user.id).trim() : "";
  const sessionEmail = session.user?.email?.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(sessionUserId ? [{ id: sessionUserId }] : []),
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      nickname: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  async function updateProfile(formData: FormData) {
    "use server";

    const user = await getCurrentUser();

    if (!user) {
      redirect("/login");
    }

    const nickname = String(formData.get("nickname") ?? "").trim();

    if (!nickname) {
      redirect("/profile?error=required");
    }

    if (nickname.length < 2 || nickname.length > 16) {
      redirect("/profile?error=length");
    }

    const duplicated = await prisma.user.findFirst({
      where: {
        nickname,
        NOT: {
          id: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicated) {
      redirect("/profile?error=duplicate");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        nickname,
      },
    });

    redirect("/profile?success=profile");
  }

  async function deleteAccount(formData: FormData) {
    "use server";

    const user = await getCurrentUser();

    if (!user) {
      redirect("/login");
    }

    const confirmText = String(formData.get("confirmText") ?? "").trim();

    if (confirmText !== "탈퇴합니다") {
      redirect("/profile?error=delete-confirm");
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    redirect("/");
  }

  const settingsCount = await prisma.userOperatorSetting.count({
    where: {
      OR: [
        {
          userId: user.id,
        },
        ...(user.nickname
          ? [
              {
                nickname: user.nickname,
              },
            ]
          : []),
      ],
    },
  });

  const errorMessage = getErrorMessage(params?.error);
  const successMessage = getSuccessMessage(params?.success);
  const isAdmin = user.role === "ADMIN";
  const displayName = user.nickname ?? user.name ?? "사용자";
  const profileInitial = displayName.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#050505] px-3 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-white sm:px-4 sm:py-8">
      <div className="mx-auto max-w-[1080px]">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300/70">
              MY PAGE
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#ffdc70] sm:text-4xl">
              마이페이지
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              프로필 정보, 닉네임, 작성한 세팅, 계정 설정을 한곳에서 관리합니다.
            </p>
          </div>

          <Link
            href="/"
            className="flex min-h-11 items-center rounded-lg border border-white/10 bg-black px-5 py-2 text-sm font-bold text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300"
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
          <div className="border-b border-white/10 bg-black/30 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
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

              <div className="w-full rounded-2xl border border-yellow-500/15 bg-yellow-400/5 px-5 py-3 text-left min-[420px]:w-auto min-[420px]:text-right">
                <p className="text-xs font-bold text-zinc-500">
                  작성한 세팅
                </p>

                <p className="mt-1 text-2xl font-black text-[#ffdc70]">
                  {settingsCount}개
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
              <h3 className="text-base font-black text-[#ffdc70]">
                회원 정보
              </h3>

              <div className="mt-5 grid gap-3">
                <InfoRow label="사이트 닉네임" value={user.nickname ?? "미설정"} />
                <InfoRow label="연동 이메일" value={user.email ?? "-"} />
                <InfoRow label="구글 이름" value={user.name ?? "-"} />
                <InfoRow label="권한" value={user.role ?? "USER"} />
                <InfoRow
                  label="가입일"
                  value={user.createdAt.toLocaleDateString("ko-KR")}
                />
                <InfoRow label="작성한 세팅" value={`${settingsCount}개`} />
              </div>

              <p className="mt-5 rounded-xl border border-yellow-500/10 bg-yellow-400/5 p-3 text-xs leading-5 text-zinc-400">
                닉네임은 세팅 공유, 파티 비교, 유저 추천 기능에서 표시 이름으로 사용됩니다.
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

              <section className="rounded-2xl border border-yellow-500/15 bg-black/35 p-5">
                <h3 className="text-base font-black text-[#ffdc70]">
                  빠른 이동
                </h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <ActionCard
                    href="/settings"
                    title="세팅 목록"
                    description="등록된 세팅 확인"
                  />

                  <ActionCard
                    href="/simulator"
                    title="성장 시뮬레이터"
                    description="목표 재화 계산"
                  />

                  <ActionCard
                    href="/farming"
                    title="파밍 계산기"
                    description="파밍 계획 계산"
                  />

                  {isAdmin ? (
                    <ActionCard
                      href="/admin"
                      title="관리자 페이지"
                      description="관리자 전용"
                      danger
                    />
                  ) : null}
                </div>
              </section>

              <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
                <h3 className="text-base font-black text-red-300">
                  회원탈퇴
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  회원탈퇴를 하면 이 계정의 로그인 정보와 연결된 사용자 데이터가 삭제됩니다.
                  계속하려면 확인 문구를 정확히 입력해주세요.
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

function ActionCard({
  href,
  title,
  description,
  danger,
}: {
  href: string;
  title: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-2xl border bg-black/30 p-5 transition",
        danger
          ? "border-red-500/30 hover:border-red-500/60"
          : "border-yellow-500/20 hover:border-yellow-500/50",
      ].join(" ")}
    >
      <div className={danger ? "text-lg font-black text-red-300" : "text-lg font-black text-[#ffdc70]"}>
        {title}
      </div>

      <div className="mt-2 text-sm text-zinc-400">
        {description}
      </div>
    </Link>
  );
}
