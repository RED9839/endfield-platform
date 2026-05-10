import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nickname?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    nickname?: string | null;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    nickname?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    nickname?: string | null;
  }
}

export {};