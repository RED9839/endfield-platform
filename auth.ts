import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

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
        token.nickname = typeof user.nickname === "string" ? user.nickname : null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.nickname =
          typeof token.nickname === "string" ? token.nickname : null;
      }

      return session;
    },

    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;

      if (!session?.user) {
        return true;
      }

      const hasNickname = Boolean(session.user.nickname?.trim());

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
