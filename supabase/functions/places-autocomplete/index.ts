import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Require authentication to prevent quota abuse on the server-side Google API key.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );
  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
  if (!GOOGLE_MAPS_API_KEY) {
    return json({ error: "Google Maps API key not configured" }, 500);
  }

  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  if (!query || query.trim().length < 2) {
    return json({ predictions: [] });
  }
  if (query.length > 200 || /<script|javascript:|on\w+=/i.test(query)) {
    return json({ error: "Invalid query parameter" }, 400);
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;

  const res = await fetch(apiUrl);
  const data = await res.json();

  const predictions = (data.predictions ?? []).map(
    (p: { description: string; place_id: string }) => ({
      description: p.description,
      place_id: p.place_id,
    })
  );

  return json({ predictions });
});
