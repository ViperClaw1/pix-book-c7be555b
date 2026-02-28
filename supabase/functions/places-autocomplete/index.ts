import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
  if (!GOOGLE_MAPS_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Google Maps API key not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  if (!query || query.trim().length < 2) {
    return new Response(JSON.stringify({ predictions: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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

  return new Response(JSON.stringify({ predictions }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
