import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_DIRECTIONS");
  if (!GOOGLE_MAPS_API_KEY) {
    return new Response(JSON.stringify({ error: "Google Maps API key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const address = url.searchParams.get("address");
  if (!address) {
    return new Response(JSON.stringify({ error: "Missing address parameter" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_DIRECTIONS}&q=${encodeURIComponent(address)}`;

  return new Response(JSON.stringify({ embedUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
