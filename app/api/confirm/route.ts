import { NextResponse } from "next/server";
import { challengeByLocale, type Locale } from "@/config/challenge";
import { sendFinalAccessEmail } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: lead, error: readError } = await supabase
      .from("reto_lily_leads")
      .select("*")
      .eq("confirmation_token", token)
      .single();

    if (readError || !lead) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("reto_lily_leads")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", lead.id);

    if (updateError) {
      return NextResponse.json({ error: "Could not confirm" }, { status: 500 });
    }

    const locale = lead.locale as Locale;
    const challenge = challengeByLocale[locale] || challengeByLocale.es;

    await sendFinalAccessEmail({
      email: lead.email,
      fullName: lead.full_name,
      locale,
      stripeUrl: challenge.donation.paymentMethods.stripe,
      sumupUrl: challenge.donation.paymentMethods.sumup
    });

    return NextResponse.json({ ok: true, locale });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
