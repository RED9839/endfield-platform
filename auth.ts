import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

type SessionUserWithDbState = {
  id?: string;
  nickname?: string | null;
  hasDbUser?: boolean;
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

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & SessionUserWithDbState;

        sessionUser.id = typeof token.id === "string" ? token.id : "";
        sessionUser.nickname = null;
        sessionUser.hasDbUser = false;
      }

      return session;
    },
  },
});
