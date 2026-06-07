import { spawnSync } from "node:child_process";

const hasDatabaseUrl = Boolean(process.env.SUPABASE_DATABASE_URL);
const hasDirectUrl = Boolean(process.env.SUPABASE_DIRECT_URL);
const isVercel = Boolean(process.env.VERCEL);

if (!hasDatabaseUrl || !hasDirectUrl) {
  if (isVercel) {
    const missing = [
      !hasDatabaseUrl && "SUPABASE_DATABASE_URL",
      !hasDirectUrl && "SUPABASE_DIRECT_URL",
    ].filter(Boolean);

    throw new Error(
      `Cannot deploy Prisma migrations. Missing environment variables: ${missing.join(", ")}`,
    );
  }

  console.log("Skipping Prisma migrations because database URLs are not configured.");
  process.exit(0);
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(
  npmCommand,
  ["exec", "--", "prisma", "migrate", "deploy"],
  {
    env: process.env,
    stdio: "inherit",
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
