// Dedicated Supabase client for the Pixap web app.
// Points at the external Pixap Supabase project (NOT Lovable Cloud).
//
// The URL + anon key are intentionally hardcoded here because:
//   - The anon/publishable key is safe to ship in client code.
//   - The repo's VITE_SUPABASE_* env vars are auto-managed by Lovable Cloud
//     and must keep pointing at the Lovable Cloud project.
//
// If you need to override these locally, set
// VITE_PIXAP_SUPABASE_URL / VITE_PIXAP_SUPABASE_ANON_KEY in your env.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PIXAP_SUPABASE_URL =
  (import.meta.env.VITE_PIXAP_SUPABASE_URL as string | undefined) ??
  "https://ylcyktbppowabnxuwdrr.supabase.co";

const PIXAP_SUPABASE_ANON_KEY =
  (import.meta.env.VITE_PIXAP_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsY3lrdGJwcG93YWJueHV3ZHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzIxNzIsImV4cCI6MjA4NzI0ODE3Mn0.Z2WGyDibhUwPW_eWFKtAGLDZFrMBq0o4CBOP6q_UFqY";

// Untyped client — the generated `Database` types in src/integrations/supabase
// describe the Lovable Cloud schema, not this external project. Queries stay
// runtime-validated; add a project-specific types file later if desired.
export const supabase: SupabaseClient = createClient(
  PIXAP_SUPABASE_URL,
  PIXAP_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "pixap-web-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

// Backwards-compatible re-export. The Database type is intentionally `any`-ish
// here to avoid coupling pixap-web to the Lovable Cloud schema.
export type Database = unknown;
