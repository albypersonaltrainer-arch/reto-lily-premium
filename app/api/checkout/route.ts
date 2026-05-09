import { NextResponse } from "next/server";
import { z } from "zod";
import { getChallenge, type Locale } from "@/config/challenge";
import { getEditableChallengeCopy } from "@/lib/challengeSettings";
import {
  getStripe,
  getDonationLabel,
  normalizeDonationAmountToCents
} from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const checkoutSchema = z.object({
  leadId: z.string().min(1),
  locale: z.enum(["es", "en"]),
  challengeSlug: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const body = checkoutSchema.parse(await request.json());
    const locale = body.locale as Locale;

    const baseChallenge = getChallenge(body.locale, body.challengeSlug);

    if (!baseChallenge) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid challenge"
        },
        { status: 400 }
      );
    }

    const challenge = await getEditableChallengeCopy(locale);
    const allowedDonationOptions = challenge.donation.options;

    const supabase = getSupabaseAdmin();

    const { data: lead, error: leadError } = await supabase
      .from("reto_lily_leads")
      .select("id, full_name, email, donation_amount, status, payment_status")
      .eq("id", body.leadId)
      .single();

    if (leadError || !lead) {
      console.error("Checkout lead lookup error:", leadError);

      return NextResponse.json(
        {
          ok: false,
          error: "Lead not found"
        },
        { status: 404 }
      );
    }

    if (lead.payment_status === "paid") {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead already paid"
        },
        { status: 409 }
      );
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const amountInCents = normalizeDonationAmountToCents(
      lead.donation_amount,
      allowedDonationOptions
    );

    const donationLabel = getDonationLabel(
      lead.donation_amount,
      allowedDonationOptions
    );

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: lead.email,
      client_reference_id: lead.id,
      success_url: `${siteUrl}/${body.locale}/pago-confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${body.locale}/${body.challengeSlug}?pago=cancelado`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountInCents,
            product_data: {
              name: "Reto de 3 días · El Código de la Abundancia",
              description: donationLabel
            }
          }
        }
      ],
      metadata: {
        lead_id: lead.id,
        locale: body.locale,
        challenge_slug: body.challengeSlug,
        donation_amount: lead.donation_amount,
        donation_label: donationLabel,
        full_name: lead.full_name,
        email: lead.email
      }
    });

    const { error: updateError } = await supabase
      .from("reto_lily_leads")
      .update({
        status: "pending_confirmation",
        payment_status: "pending",
        payment_provider: "stripe",
        stripe_checkout_session_id: checkoutSession.id
      })
      .eq("id", lead.id);

    if (updateError) {
      console.error("Checkout session update error:", updateError);
    }

    return NextResponse.json({
      ok: true,
      url: checkoutSession.url
    });
  } catch (error) {
    console.error("Checkout request error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Could not create checkout session"
      },
      { status: 500 }
    );
  }
}
