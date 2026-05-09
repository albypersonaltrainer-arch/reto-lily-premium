import { NextResponse } from "next/server";
import { sendPaidAccessEmail } from "@/lib/email";
import type { Locale } from "@/config/challenge";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const secret = url.searchParams.get("secret") || "";
    const email = url.searchParams.get("email") || "";
    const name = url.searchParams.get("name") || "Prueba Lily";
    const localeParam = url.searchParams.get("locale") || "es";
    const amount = url.searchParams.get("amount") || "7";
    const currency = url.searchParams.get("currency") || "USD";

    const expectedSecret = process.env.EMAIL_PREVIEW_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: "EMAIL_PREVIEW_SECRET no está configurado en Vercel."
        },
        { status: 500 }
      );
    }

    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: "No autorizado."
        },
        { status: 401 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email no válido. Añade ?email=correo@dominio.com"
        },
        { status: 400 }
      );
    }

    const locale: Locale = localeParam === "en" ? "en" : "es";

    await sendPaidAccessEmail({
      email,
      fullName: name,
      locale,
      amount,
      currency
    });

    return NextResponse.json({
      ok: true,
      message: "Email de prueba enviado correctamente.",
      sentTo: email,
      locale,
      amount,
      currency
    });
  } catch (error) {
    console.error("EMAIL_PREVIEW_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo enviar el email de prueba."
      },
      { status: 500 }
    );
  }
}
