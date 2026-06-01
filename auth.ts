import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

type SessionUserWithDbState = {
  id?: string;
  nickname?: string | null;
  hasDbUser?: boolean;
  role?: string;
};

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
      if (user) {
        token.id = user.id;
      }

      if (token.email) {
        const dbUser = await prisma.user.findFirst({
          where: {
            email: {
              equals: token.email,
              mode: "insensitive",
            },
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
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & SessionUserWithDbState;

        sessionUser.id = typeof token.id === "string" ? token.id : "";
        sessionUser.nickname = typeof token.nickname === "string" ? token.nickname : null;
        sessionUser.role = typeof token.role === "string" ? token.role : "USER";
        sessionUser.hasDbUser = Boolean(token.hasDbUser);
      }

      return session;
    },
  },
});