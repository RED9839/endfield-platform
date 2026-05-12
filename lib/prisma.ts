import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function withPgBouncerParams(url?: string) {
  if (!url) return undefined;

  const hasProtocol = /^postgres(ql)?:\/\//.test(url);
  if (!hasProtocol) return url;

  const parsed = new URL(url);

  if (!parsed.searchParams.has("pgbouncer")) {
    parsed.searchParams.set("pgbouncer", "true");
  }

  return parsed.toString();
}

const datasourceUrl = withPgBouncerParams(process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
