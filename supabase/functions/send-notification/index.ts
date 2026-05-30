import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

const MAX_TEXT = 500;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Require a valid JWT.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !userData?.user) {
      return json({ error: "Unauthorized" }, 401);
    }
    const callerId = userData.user.id;

    // 2. Validate input.
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return json({ error: "Invalid request body" }, 400);
    }
    const { user_id, text, business_card_id, notify_admins } = body as {
      user_id?: unknown;
      text?: unknown;
      business_card_id?: unknown;
      notify_admins?: unknown;
    };

    if (typeof user_id !== "string" || !UUID_RE.test(user_id)) {
      return json({ error: "Invalid user_id" }, 400);
    }
    if (typeof text !== "string" || text.trim().length === 0 || text.length > MAX_TEXT) {
      return json({ error: `text must be 1-${MAX_TEXT} chars` }, 400);
    }
    if (business_card_id !== undefined && business_card_id !== null) {
      if (typeof business_card_id !== "string" || !UUID_RE.test(business_card_id)) {
        return json({ error: "Invalid business_card_id" }, 400);
      }
    }
    const wantNotifyAdmins = notify_admins === true;

    // 3. Authorization: caller may only target themselves unless they are admin.
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    let callerIsAdmin = false;
    {
      const { data: roleRow } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", callerId)
        .eq("role", "admin")
        .maybeSingle();
      callerIsAdmin = !!roleRow;
    }

    if (user_id !== callerId && !callerIsAdmin) {
      return json({ error: "Forbidden" }, 403);
    }
    // Only admins may broadcast to other admins.
    const broadcastAdmins = wantNotifyAdmins && callerIsAdmin;

    // 4. Insert notification for the target user.
    const { error: insertError } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id,
        text,
        business_card_id: (business_card_id as string | undefined) || null,
      });

    if (insertError) {
      console.error("Failed to insert notification:", insertError.message);
      throw insertError;
    }

    await sendPush(user_id, text);

    if (broadcastAdmins) {
      const { data: adminRoles } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (adminRoles && adminRoles.length > 0) {
        const adminNotifications = adminRoles
          .filter((r) => r.user_id !== user_id)
          .map((r) => ({
            user_id: r.user_id,
            text,
            business_card_id: (business_card_id as string | undefined) || null,
          }));

        if (adminNotifications.length > 0) {
          await supabaseAdmin.from("notifications").insert(adminNotifications);
          for (const n of adminNotifications) {
            await sendPush(n.user_id, text);
          }
        }
      }
    }

    return json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("send-notification error:", msg);
    return json({ error: "Internal error" }, 500);
  }
});

async function sendPush(userId: string, text: string) {
  const appId = Deno.env.get("ONESIGNAL_APP_ID");
  const apiKey = Deno.env.get("ONESIGNAL_REST_API_KEY");

  if (!appId || !apiKey) {
    console.log("OneSignal not configured, skipping push");
    return;
  }

  try {
    const res = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: appId,
        include_external_user_ids: [userId],
        contents: { en: text },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("OneSignal push failed:", body);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("OneSignal push error:", msg);
  }
}
