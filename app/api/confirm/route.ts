import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const TOKEN_MIN_LENGTH = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body?.token || "").trim();

    if (!token || token.length < TOKEN_MIN_LENGTH) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid token"
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: lead, error: lookupError } = await supabase
      .from("reto_lily_leads")
      .select("id, status, payment_status, confirmed_at")
      .eq("confirmation_token", token)
      .single();

    if (lookupError || !lead) {
      console.error("Confirm lookup error:", lookupError);

      return NextResponse.json(
        {
          ok: false,
          error: "Confirmation token not found"
        },
        { status: 404 }
      );
    }

    if (lead.confirmed_at) {
      return NextResponse.json({
        ok: true,
        status: lead.status,
        paymentStatus: lead.payment_status,
        alreadyConfirmed: true
      });
    }

    const { error: updateError } = await supabase
      .from("reto_lily_leads")
      .update({
        confirmed_at: new Date().toISOString(),
        status: lead.payment_status === "paid" ? "paid" : "pending_payment"
      })
      .eq("id", lead.id);

    if (updateError) {
      console.error("Confirm update error:", updateError);

      return NextResponse.json(
        {
          ok: false,
          error: "Could not confirm access"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      status: lead.payment_status === "paid" ? "paid" : "pending_payment",
      paymentStatus: lead.payment_status,
      alreadyConfirmed: false
    });
  } catch (error) {
    console.error("Confirm request error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Invalid confirmation request"
      },
      { status: 400 }
    );
  }
}
