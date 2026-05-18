import { createClient } from "@supabase/supabase-js";

let browserClient: ReturnType<typeof createClient> | null = null;

function readPublicEnv(name: string) {
  const value = process.env[name];
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : null;
}

export function getSupabaseClient() {
  if (browserClient) return browserClient;

  const supabaseUrl = readPublicEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase public env 누락: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  browserClient = createClient(supabaseUrl, anonKey);
  return browserClient;
}
