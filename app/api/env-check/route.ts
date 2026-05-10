export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const keys = Object.keys(process.env).filter(
    (key) =>
      key.includes("DATABASE") ||
      key.includes("DIRECT") ||
      key.includes("SUPABASE") ||
      key.includes("AUTH")
  );

  return Response.json({
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    DIRECT_URL: Boolean(process.env.DIRECT_URL),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    AUTH_URL: Boolean(process.env.AUTH_URL),
    matchedKeys: keys,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  });
}