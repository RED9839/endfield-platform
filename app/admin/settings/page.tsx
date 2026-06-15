import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    <main className="min-h-screen bg-[#050505] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-[#ffdc70]">
            세팅 관리
          </h1>

          <Link
            href="/admin"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-bold hover:border-zinc-500"
          >
            관리자 홈
          </Link>
        </div>

        <form
          method="GET"
          className="mb-6 grid gap-3 rounded-2xl border border-zinc-800 bg-black/30 p-4 md:grid-cols-3"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="세팅 제목 검색"
            className="rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm outline-none focus:border-yellow-500"
          />

          <input
            name="author"
            defaultValue={author}
            placeholder="작성자 검색"
            className="rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm outline-none focus:border-yellow-500"
          />

          <button
            type="submit"
            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-black text-black hover:bg-yellow-400"
          >
            검색
          </button>
        </form>

        <div className="space-y-3">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="rounded-xl border border-zinc-800 bg-black/30 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white">
                    {setting.title}
                  </div>

                  <div className="mt-1 text-sm text-zinc-400">
                    작성자 :{" "}
                    {setting.user?.nickname ??
                      setting.nickname ??
                      "알 수 없음"}
                  </div>

                  <div className="mt-1 text-sm text-zinc-400">
                    조회수 {setting.viewCount} · 추천수 {setting.likeCount}
                  </div>

                  <div className="mt-1 break-all text-xs text-zinc-500">
                    ID : {setting.id}
                  </div>

                  <div className="mt-1 text-xs text-zinc-500">
                    생성일 :{" "}
                    {setting.createdAt.toLocaleDateString("ko-KR")}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/settings/${setting.id}`}
                    target="_blank"
                    className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-black text-sky-300 hover:bg-sky-500/20"
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
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 hover:bg-red-500/20"
                    >
                      세팅 삭제
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}

          {settings.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-black/30 p-6 text-center text-sm text-zinc-400">
              검색 결과가 없습니다.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
