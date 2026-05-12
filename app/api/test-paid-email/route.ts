import { NextResponse } from "next/server";
import { sendPaidAccessEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await sendPaidAccessEmail({
      email: "albypersonaltrainer@gmail.com",
      fullName: "Alby Prueba",
      locale: "es",
      amount: "7",
      currency: "USD"
    });

    return NextResponse.json({
      ok: true,
      message: "Email de prueba enviado correctamente.",
      sentTo: "albypersonaltrainer@gmail.com"
    });
  } catch (error) {
    console.error("Test paid email error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo enviar el email de prueba."
      },
      { status: 500 }
    );
  }
}
