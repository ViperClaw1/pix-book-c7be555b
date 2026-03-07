import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { user_id, text, business_card_id, notify_admins } = await req.json();

    if (!user_id || !text) {
      return new Response(JSON.stringify({ error: "user_id and text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert notification for the user
    const { error: insertError } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id,
        text,
        business_card_id: business_card_id || null,
      });

    if (insertError) {
      console.error("Failed to insert notification:", insertError.message);
      throw insertError;
    }

    // Send push notification via OneSignal
    await sendPush(user_id, text);

    // If notify_admins, also create notifications for all admin users
    if (notify_admins) {
      const { data: adminRoles } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (adminRoles && adminRoles.length > 0) {
        const adminNotifications = adminRoles
          .filter((r) => r.user_id !== user_id) // don't double-notify if user is admin
          .map((r) => ({
            user_id: r.user_id,
            text,
            business_card_id: business_card_id || null,
          }));

        if (adminNotifications.length > 0) {
          await supabaseAdmin.from("notifications").insert(adminNotifications);
          // Push to each admin
          for (const n of adminNotifications) {
            await sendPush(n.user_id, text);
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-notification error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
    console.error("OneSignal push error:", err.message);
  }
}
