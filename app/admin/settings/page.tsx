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

export default async function AdminSettingsPage() {
  const session = await auth();

  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    redirect("/");
  }

  const settings = await prisma.userOperatorSetting.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
    take: 200,
  });

  return (
    <main className="min-h-screen bg-[#050505] p-6 text-white">
      <h1 className="mb-6 text-3xl font-black text-[#ffdc70]">세팅 관리</h1>

      <div className="space-y-3">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="rounded-xl border border-zinc-800 bg-black/30 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-bold text-white">{setting.title}</div>

                <div className="mt-1 text-sm text-zinc-400">
                  작성자 : {setting.user.nickname ?? setting.nickname ?? "알 수 없음"}
                </div>

                <div className="mt-1 text-sm text-zinc-400">
                  조회수 {setting.viewCount} · 추천수 {setting.likeCount}
                </div>

                <div className="mt-1 text-xs text-zinc-500">
                  생성일 : {setting.createdAt.toLocaleDateString("ko-KR")}
                </div>
              </div>

              <form action={deleteSetting}>
                <input type="hidden" name="id" value={setting.id} />

                <button
                  type="submit"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 hover:bg-red-500/20"
                >
                  세팅 삭제
                </button>
              </form>
            </div>
          </div>
        ))}

        {settings.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-6 text-center text-sm text-zinc-400">
            등록된 세팅이 없습니다.
          </div>
        ) : null}
      </div>
    </main>
  );
}
