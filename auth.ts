import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

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
        token.id = user.id ?? token.sub ?? token.id;
        token.nickname = typeof user.nickname === "string" ? user.nickname : null;
        token.email = user.email ?? token.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : typeof token.sub === "string" ? token.sub : "";
        session.user.nickname =
          typeof token.nickname === "string" ? token.nickname : null;
        session.user.email = typeof token.email === "string" ? token.email : session.user.email;
      }

      return session;
    },

    async authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;

      if (!session?.user) {
        return true;
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: session.user.id },
            ...(session.user.email ? [{ email: session.user.email }] : []),
          ],
        },
        select: { nickname: true },
      });

      const hasNickname = Boolean(user?.nickname?.trim());

      if (!hasNickname && pathname !== "/setup-profile") {
        return Response.redirect(new URL("/setup-profile", request.nextUrl));
      }

      if (hasNickname && pathname === "/setup-profile") {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      return true;
    },
  },
});
