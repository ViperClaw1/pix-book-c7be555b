import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isValidParam = (v: string, max: number) =>
  v.length >= 1 && v.length <= max && !/<script|javascript:|on\w+=/i.test(v);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Require authentication
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
  const address = url.searchParams.get("address");
  if (!address || !isValidParam(address, 200)) {
    return json({ error: "Invalid address parameter" }, 400);
  }

  const origin = url.searchParams.get("origin");
  const mode = url.searchParams.get("mode");

  let embedUrl: string;

  if (origin && mode) {
    if (!isValidParam(origin, 200) || !/^(driving|walking|bicycling|transit)$/.test(mode)) {
      return json({ error: "Invalid origin or mode parameter" }, 400);
    }
    embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(address)}&mode=${encodeURIComponent(mode)}`;
  } else {
    embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`;
  }

  return json({ embedUrl });
});
