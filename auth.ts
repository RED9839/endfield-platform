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
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;

        token.nickname =
          typeof profile?.name === "string"
            ? profile.name
            : typeof user.name === "string"
              ? user.name
              : null;
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
  },
});