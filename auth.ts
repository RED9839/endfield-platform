import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

type SessionUserWithDbState = {
  id?: string;
  nickname?: string | null;
  hasDbUser?: boolean;
  role?: string;
};

const DB_USER_SYNC_INTERVAL_MS = 5 * 60 * 1000;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      const now = Date.now();
      const lastDbUserSyncAt =
        typeof token.dbUserSyncAt === "number" ? token.dbUserSyncAt : 0;

      if (
        token.hasDbUser === true &&
        typeof token.id === "string" &&
        now - lastDbUserSyncAt < DB_USER_SYNC_INTERVAL_MS
      ) {
        return token;
      }

      const tokenId = typeof token.id === "string" ? token.id : "";
      const tokenEmail =
        typeof token.email === "string" ? token.email.trim().toLowerCase() : "";

      if (tokenId || tokenEmail) {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              ...(tokenId ? [{ id: tokenId }] : []),
              ...(tokenEmail
                ? [{ email: { equals: tokenEmail, mode: "insensitive" as const } }]
                : []),
            ],
          },
          select: {
            id: true,
            nickname: true,
            role: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.nickname = dbUser.nickname;
          token.role = dbUser.role;
          token.hasDbUser = true;
        } else {
          token.hasDbUser = false;
        }

        token.dbUserSyncAt = now;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser =
          session.user as typeof session.user & SessionUserWithDbState;

        sessionUser.id =
          typeof token.id === "string" ? token.id : "";

        sessionUser.nickname =
          typeof token.nickname === "string"
            ? token.nickname
            : null;

        sessionUser.role =
          typeof token.role === "string"
            ? token.role
            : "USER";

        sessionUser.hasDbUser = Boolean(token.hasDbUser);
      }

      return session;
    },
  },
});
