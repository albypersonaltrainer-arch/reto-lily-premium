import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const leadId = session.metadata?.lead_id;

  if (!leadId) {
    console.error("Stripe webhook missing lead_id metadata", session.id);
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("reto_lily_leads")
    .update({
      status: "paid",
      payment_status: "paid",
      payment_provider: "stripe",
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      stripe_customer_email: session.customer_details?.email || session.customer_email || null,
      stripe_amount_total: session.amount_total || null,
      stripe_currency: session.currency || null,
      paid_at: new Date().toISOString()
    })
    .eq("id", leadId);

  if (error) {
    console.error("Supabase paid update error:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret();

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Stripe signature"
      },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook signature verification failed"
      },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid") {
        await handleCheckoutSessionCompleted(session);
      }
    }

    return NextResponse.json({
      ok: true,
      received: true
    });
  } catch (error) {
    console.error("Stripe webhook handling error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook handler failed"
      },
      { status: 500 }
    );
  }
}
