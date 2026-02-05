import type { Database } from "@/lib/supabase/database.types";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  return createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey!);
}
