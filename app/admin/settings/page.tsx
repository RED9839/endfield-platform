import Link from "next/link";
import { revalidatePath } from "next/cache";
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

async function deleteSetting(formData: FormData) {
  "use server";

  const session = await auth();

  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    redirect("/");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await prisma.userOperatorSetting.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    author?: string;
  }>;
}) {
  const session = await auth();

  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    redirect("/");
  }

  const params = (await searchParams) ?? {};

  const q = String(params.q ?? "").trim();
  const author = String(params.author ?? "").trim();

  const settings = await prisma.userOperatorSetting.findMany({
    where: {
      AND: [
        q
          ? {
              title: {
                contains: q,
                mode: "insensitive",
              },
            }
          : {},
        author
          ? {
              OR: [
                {
                  nickname: {
                    contains: author,
                    mode: "insensitive",
                  },
                },
                {
                  user: {
                    nickname: {
                      contains: author,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      // 템플릿에서 user.nickname 만 사용 → 전체 user 행 과조회 방지.
      user: {
        select: {
          nickname: true,
        },
      },
    },
    take: 200,
  });

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg p-4 text-ef-ink sm:p-6">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto mb-3 flex max-w-6xl items-center gap-2">
        <span className="h-3 w-3" style={{ background: PRIMARY }} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">
          Admin · Settings
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted/60">
          // 세팅 관리
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1" style={{ background: PRIMARY }} />
            <h1 className="text-3xl font-black tracking-tight text-white">
              세팅 관리
            </h1>
          </div>

          <Link
            href="/admin"
            className="border border-ef-line bg-ef-card px-3 py-2 text-sm font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT_SM}
          >
            관리자 홈
          </Link>
        </div>

        <form
          method="GET"
          className="mb-6 grid gap-3 border border-ef-line bg-ef-card2 p-4 md:grid-cols-3"
          style={CUT}
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="세팅 제목 검색"
            className="border border-ef-line bg-ef-card px-3 py-2 text-sm text-ef-accent outline-none transition placeholder:text-ef-muted/70 focus:border-ef-accent/50"
            style={CUT_SM}
          />

          <input
            name="author"
            defaultValue={author}
            placeholder="작성자 검색"
            className="border border-ef-line bg-ef-card px-3 py-2 text-sm text-ef-accent outline-none transition placeholder:text-ef-muted/70 focus:border-ef-accent/50"
            style={CUT_SM}
          />

          <button
            type="submit"
            className="px-3 py-2 text-sm font-black text-black transition hover:brightness-110"
            style={{ ...CUT_SM, background: ACCENT }}
          >
            검색
          </button>
        </form>

        <div className="space-y-3">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="border border-ef-line bg-ef-card2 p-4"
              style={CUT}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-black text-white">
                    {setting.title}
                  </div>

                  <div className="mt-1 text-sm text-ef-muted">
                    작성자 :{" "}
                    {setting.user?.nickname ??
                      setting.nickname ??
                      "알 수 없음"}
                  </div>

                  <div className="mt-1 text-sm text-ef-muted">
                    조회수{" "}
                    <span className="font-mono tabular-nums" style={{ color: ACCENT }}>
                      {setting.viewCount}
                    </span>{" "}
                    · 추천수{" "}
                    <span className="font-mono tabular-nums" style={{ color: ACCENT }}>
                      {setting.likeCount}
                    </span>
                  </div>

                  <div className="mt-1 break-all font-mono text-xs text-ef-muted/70">
                    ID : {setting.id}
                  </div>

                  <div className="mt-1 font-mono text-xs text-ef-muted/70">
                    생성일 :{" "}
                    {setting.createdAt.toLocaleDateString("ko-KR")}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/settings/${setting.id}`}
                    target="_blank"
                    className="border border-ef-line bg-ef-card px-3 py-2 text-xs font-black text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
                    style={CUT_SM}
                  >
                    상세 보기
                  </Link>

                  <form action={deleteSetting}>
                    <input
                      type="hidden"
                      name="id"
                      value={setting.id}
                    />

                    <button
                      type="submit"
                      formAction={deleteSetting}
                      className="border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500/20"
                      style={CUT_SM}
                    >
                      세팅 삭제
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}

          {settings.length === 0 ? (
            <div
              className="border border-ef-line bg-ef-card2 p-6 text-center text-sm text-ef-muted"
              style={CUT}
            >
              검색 결과가 없습니다.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
