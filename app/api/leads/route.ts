import { NextResponse } from "next/server";
import { z } from "zod";
import { challengeByLocale, type Locale } from "@/config/challenge";
import { sendLeadConfirmationEmail } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { createConfirmationToken } from "@/lib/tokens";

const leadSchema = z.object({
  locale: z.enum(["es", "en"]),
  challengeSlug: z.string().min(1),
  fullName: z.string().min(2).max(140),
  email: z.string().email().max(180),
  phone: z.string().min(5).max(60),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  donationAmount: z.string().min(1).max(30),
  paymentMethod: z.enum(["stripe", "sumup"]),
  privacyAccepted: z.literal(true)
});

export async function POST(request: Request) {
  try {
    const body = leadSchema.parse(await request.json());
    const challenge = challengeByLocale[body.locale as Locale];

    if (!challenge || challenge.slug !== body.challengeSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid challenge"
        },
        { status: 400 }
      );
    }

    const token = createConfirmationToken();
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("reto_lily_leads").insert({
      locale: body.locale,
      challenge_slug: body.challengeSlug,
      full_name: body.fullName,
      email: body.email.toLowerCase(),
      phone: body.phone,
      city: body.city || null,
      country: body.country || null,
      donation_amount: body.donationAmount,
      payment_method: body.paymentMethod,
      privacy_accepted: body.privacyAccepted,
      status: "pending_confirmation",
      payment_status: "pending",
      confirmation_token: token,
      video_completed: true,
      source: "landing"
    });

    if (error) {
      console.error("Supabase lead insert error:", error);

      return NextResponse.json(
        {
          ok: false,
          error: "Could not save lead"
        },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const confirmationUrl = `${siteUrl}/${body.locale}/confirmar?token=${token}`;

    try {
      await sendLeadConfirmationEmail({
        email: body.email,
        fullName: body.fullName,
        locale: body.locale,
        confirmationUrl
      });
    } catch (emailError) {
      console.error("Confirmation email error:", emailError);
    }

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    console.error("Lead request error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Invalid request"
      },
      { status: 400 }
    );
  }
}
