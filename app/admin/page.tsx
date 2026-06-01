import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#050505] p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-black text-[#ffdc70]">
          관리자 패널
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/users"
            className="rounded-2xl border border-yellow-500/20 bg-black/30 p-6"
          >
            <h2 className="text-xl font-black">유저 관리</h2>
          </Link>

          <Link
            href="/admin/settings"
            className="rounded-2xl border border-yellow-500/20 bg-black/30 p-6"
          >
            <h2 className="text-xl font-black">세팅 관리</h2>
          </Link>
        </div>
      </div>
    </main>
  );
}
