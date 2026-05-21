import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stripe is not configured.",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId || !sessionId.startsWith("cs_")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid Stripe session_id.",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "line_items"],
    });

    const isPaid =
      session.payment_status === "paid" && session.status === "complete";

    if (!isPaid) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stripe session is not paid.",
          paymentStatus: session.payment_status,
          status: session.status,
        },
        { status: 402 }
      );
    }

    const amountTotal = session.amount_total ?? 0;
    const currency = (session.currency || "usd").toUpperCase();

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      paymentStatus: session.payment_status,
      status: session.status,
      amountTotal,
      value: amountTotal / 100,
      currency,
      customerEmail: session.customer_details?.email || null,
    });
  } catch (error) {
    console.error("Stripe checkout session verification error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Could not verify Stripe checkout session.",
      },
      { status: 500 }
    );
  }
}
