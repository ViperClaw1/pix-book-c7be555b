// Re-export the project's single Supabase client to avoid multiple GoTrue
// instances. Auth already persists in localStorage as required by the spec.
export { supabase } from "@/integrations/supabase/client";
export type { Database } from "@/integrations/supabase/types";
