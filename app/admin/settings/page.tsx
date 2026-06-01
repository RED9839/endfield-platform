import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    <main className="p-6 text-white">
      <h1 className="mb-6 text-3xl font-black">세팅 관리</h1>

      <div className="space-y-3">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="rounded-xl border border-zinc-800 p-4"
          >
            <div className="font-bold">{setting.title}</div>

            <div className="text-sm text-zinc-400">
              작성자 : {setting.user.nickname}
            </div>

            <div className="text-sm text-zinc-400">
              조회수 {setting.viewCount} · 추천수 {setting.likeCount}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
