import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await auth();

  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <main className="p-6 text-white">
      <h1 className="mb-6 text-3xl font-black">유저 관리</h1>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>닉네임</th>
              <th>이메일</th>
              <th>권한</th>
              <th>가입일</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nickname ?? "-"}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
