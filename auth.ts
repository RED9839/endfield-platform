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

    async authorized() {
      return true;
    },
  },
});
