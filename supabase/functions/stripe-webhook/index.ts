import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (userId) {
      // Use service role to bypass RLS and clear the user's cart
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const { error } = await supabaseAdmin
        .from("shopping_cart_items")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to clear cart:", error.message);
        return new Response("Failed to clear cart", { status: 500 });
      }

      console.log(`Cart cleared for user ${userId}`);

      // Get user email for admin notification
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      const amount = session.amount_total
        ? (session.amount_total / 100).toLocaleString()
        : "?";

      // Buyer notification
      await supabaseAdmin.from("notifications").insert({
        user_id: userId,
        text: `Your purchase of ${amount} ₸ was successful!`,
      });

      // Admin notifications
      const { data: adminRoles } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (adminRoles && adminRoles.length > 0) {
        const adminNotifs = adminRoles.map((r) => ({
          user_id: r.user_id,
          text: `New purchase of ${amount} ₸ by ${profile?.email || "unknown"}`,
        }));
        await supabaseAdmin.from("notifications").insert(adminNotifs);
      }

      // Send push notifications via OneSignal
      const appId = Deno.env.get("ONESIGNAL_APP_ID");
      const apiKey = Deno.env.get("ONESIGNAL_REST_API_KEY");
      if (appId && apiKey) {
        const pushTargets = [
          { id: userId, text: `Your purchase of ${amount} ₸ was successful!` },
          ...(adminRoles || []).map((r) => ({
            id: r.user_id,
            text: `New purchase of ${amount} ₸ by ${profile?.email || "unknown"}`,
          })),
        ];
        for (const t of pushTargets) {
          try {
            await fetch("https://api.onesignal.com/notifications", {
              method: "POST",
              headers: {
                Authorization: `Key ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                app_id: appId,
                include_external_user_ids: [t.id],
                contents: { en: t.text },
              }),
            });
          } catch (e) {
            console.error("OneSignal push error:", e.message);
          }
        }
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
