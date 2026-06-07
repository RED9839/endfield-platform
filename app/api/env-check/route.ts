export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    AUTH_URL: Boolean(process.env.AUTH_URL),
    GOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    SUPABASE_DATABASE_URL: Boolean(process.env.SUPABASE_DATABASE_URL),
    SUPABASE_DIRECT_URL: Boolean(process.env.SUPABASE_DIRECT_URL),
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  });
}
