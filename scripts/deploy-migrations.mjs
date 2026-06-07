import { spawnSync } from "node:child_process";

const migrationUrl =
  process.env.SUPABASE_MIGRATION_URL ??
  process.env.SUPABASE_DATABASE_URL;
const isVercel = Boolean(process.env.VERCEL);

if (!migrationUrl) {
  if (isVercel) {
    throw new Error(
      "Cannot deploy Prisma migrations. Configure SUPABASE_MIGRATION_URL or SUPABASE_DATABASE_URL.",
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
    env: {
      ...process.env,
      SUPABASE_DATABASE_URL: migrationUrl,
      SUPABASE_DIRECT_URL: migrationUrl,
    },
    stdio: "inherit",
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
