import { createClient } from "@supabase/supabase-js";

let adminClient: ReturnType<typeof createClient> | null = null;

function readEnv(name: string) {
  const value = process.env[name];
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : null;
}

export function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const supabaseUrl = readEnv("SUPABASE_URL") ?? readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  const missingVars = [
    !supabaseUrl ? "SUPABASE_URL(or NEXT_PUBLIC_SUPABASE_URL)" : null,
    !serviceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY" : null,
  ].filter(Boolean);

  if (missingVars.length > 0) {
    throw new Error(`Supabase admin env 누락: ${missingVars.join(", ")}`);
  }

  adminClient = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
