import { NextResponse } from "next/server";
import Stripe from "stripe";
import { type Locale } from "@/config/challenge";
import { sendPaidAccessEmail } from "@/lib/email";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function formatStripeAmount(amountTotal: number | null, currency: string | null) {
  if (!amountTotal) return undefined;

  const amount = amountTotal / 100;
  const safeCurrency = currency?.toUpperCase() || "USD";

  return `${amount.toFixed(2)} ${safeCurrency}`;
}

function getSessionEmail(session: Stripe.Checkout.Session) {
  return (
    session.customer_details?.email ||
    session.customer_email ||
    null
  );
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("Stripe checkout completed received:", {
    sessionId: session.id,
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
    currency: session.currency,
    customerEmail: getSessionEmail(session),
    metadata: session.metadata
  });

  const leadId = session.metadata?.lead_id;

  if (!leadId) {
    console.error("Stripe webhook missing lead_id metadata", {
      sessionId: session.id,
      metadata: session.metadata
    });

    throw new Error("Missing lead_id metadata in Stripe session");
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  const supabase = getSupabaseAdmin();

  const { data: leadBeforeUpdate, error: leadLookupError } = await supabase
    .from("reto_lily_leads")
    .select("id, full_name, email, locale, payment_status")
    .eq("id", leadId)
    .single();

  if (leadLookupError || !leadBeforeUpdate) {
    console.error("Supabase lead lookup before paid update error:", {
      leadId,
      error: leadLookupError
    });

    throw leadLookupError || new Error("Lead not found before paid update");
  }

  const stripeCustomerEmail = getSessionEmail(session);
  const finalEmail = leadBeforeUpdate.email || stripeCustomerEmail;

  if (!finalEmail) {
    console.error("No valid email available for paid access email:", {
      leadId,
      sessionId: session.id,
      leadEmail: leadBeforeUpdate.email,
      stripeCustomerEmail
    });

    throw new Error("No valid email available for paid access email");
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable");
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  const { error: updateError } = await supabase
    .from("reto_lily_leads")
    .update({
      status: "paid",
      payment_status: "paid",
      payment_provider: "stripe",
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      stripe_customer_email: stripeCustomerEmail,
      stripe_amount_total: session.amount_total || null,
      stripe_currency: session.currency || null,
      paid_at: new Date().toISOString()
    })
    .eq("id", leadId);

  if (updateError) {
    console.error("Supabase paid update error:", {
      leadId,
      sessionId: session.id,
      error: updateError
    });

    throw updateError;
  }

  console.log("Sending paid access email:", {
    leadId,
    sessionId: session.id,
    email: finalEmail
  });

  await sendPaidAccessEmail({
    email: finalEmail,
    fullName: leadBeforeUpdate.full_name || "Hola",
    locale: (leadBeforeUpdate.locale === "en" ? "en" : "es") as Locale,
    amount: formatStripeAmount(session.amount_total, session.currency),
    currency: session.currency || "usd"
  });

  console.log("Paid access email sent successfully:", {
    leadId,
    sessionId: session.id,
    email: finalEmail
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret();

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("Missing Stripe signature");

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
    console.log("Stripe webhook event received:", {
      eventId: event.id,
      eventType: event.type
    });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid") {
        await handleCheckoutSessionCompleted(session);
      } else {
        console.log("Checkout session completed but payment is not paid:", {
          sessionId: session.id,
          paymentStatus: session.payment_status
        });
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
