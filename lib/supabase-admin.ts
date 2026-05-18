let adminClient: unknown | null = null;

function readEnv(name: string) {
  const value = process.env[name];
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : null;
}

export async function getSupabaseAdmin() {
  if (adminClient) {
    return adminClient as import("@supabase/supabase-js").SupabaseClient;
  }

  const supabaseUrl = readEnv("SUPABASE_URL") ?? readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  const missingVars = [
    !supabaseUrl ? "SUPABASE_URL(or NEXT_PUBLIC_SUPABASE_URL)" : null,
    !serviceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY" : null,
  ].filter(Boolean);

  if (missingVars.length > 0) {
    throw new Error(`Supabase admin env 누락: ${missingVars.join(", ")}`);
  }

  const { createClient } = await import("@supabase/supabase-js");

  adminClient = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient as import("@supabase/supabase-js").SupabaseClient;
}
