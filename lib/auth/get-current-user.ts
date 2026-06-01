import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
  nickname: string | null;
  role: string | null;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await auth();

  if (!session?.user?.id) return null;

  const sessionEmail = session.user.email?.trim().toLowerCase();

  return prisma.user.findFirst({
    where: {
      OR: [
        { id: session.user.id },
        ...(sessionEmail
          ? [
              {
                email: {
                  equals: sessionEmail,
                  mode: "insensitive" as const,
                },
              },
            ]
          : []),
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      nickname: true,
      role: true,
    },
  });
}
