import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const localeSchema = z.enum(["es", "en"]);

const priceSchema = z.object({
  amount: z
    .string()
    .min(1, "El importe es obligatorio.")
    .max(12, "El importe es demasiado largo."),
  label: z
    .string()
    .min(2, "La etiqueta es obligatoria.")
    .max(80, "La etiqueta es demasiado larga.")
});

const testimonialMediaKindSchema = z.enum(["none", "image", "video", "audio"]);

const testimonialSchema = z.object({
  name: z.string().min(1).max(120),
  text: z.string().min(1).max(900),
  type: z.string().min(1).max(80),
  mediaKind: testimonialMediaKindSchema.default("none"),
  mediaUrl: z.string().max(700).optional().default("")
});

const settingsSchema = z.object({
  heroTitle: z.string().min(3).max(180),
  heroSubtitle: z.string().min(3).max(180),
  heroIntro: z.string().max(240).optional().default(""),
  videoUrl: z.string().max(500).optional().default(""),
  videoHelper: z.string().min(3).max(260),
  coachText: z.string().min(10).max(900),
  learnItems: z.array(z.string().min(5).max(320)).min(1).max(6),
  testimonialsText: z.string().min(5).max(700),
  testimonials: z.array(testimonialSchema).min(0).max(6).optional().default([]),
  prices: z.array(priceSchema).min(3).max(3),
  whatsappUrl: z.string().min(8).max(180),
  whatsappText: z.string().min(3).max(260),
  showTestimonials: z.boolean()
});

const postSchema = z.object({
  secret: z.string().optional(),
  locale: localeSchema,
  content: settingsSchema
});

function getExpectedSecret() {
  const secret = process.env.LILY_ADMIN_SECRET;
  if (!secret) throw new Error("Missing LILY_ADMIN_SECRET environment variable");
  return secret;
}

function getRequestSecret(request: Request, bodySecret?: string | null) {
  const url = new URL(request.url);
  return (
    bodySecret ||
    request.headers.get("x-lily-admin-secret") ||
    url.searchParams.get("secret") ||
    ""
  );
}

function isAuthorized(request: Request, bodySecret?: string | null) {
  return getRequestSecret(request, bodySecret) === getExpectedSecret();
}

function normalizeAmountToNumber(amount: string) {
  const normalized = amount
    .replace("€", "")
    .replace("$", "")
    .replace("USD", "")
    .replace("usd", "")
    .replace("@", "")
    .replace("＠", "")
    .replace("⭐", "")
    .trim();

  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

function validatePrices(prices: Array<{ amount: string; label: string }>) {
  if (prices.length !== 3) {
    throw new Error("Debe haber exactamente 3 precios.");
  }

  const seenAmounts = new Set<string>();

  for (const price of prices) {
    const numericAmount = normalizeAmountToNumber(price.amount);

    if (!numericAmount || numericAmount < 1 || numericAmount > 999) {
      throw new Error("Los precios deben ser números válidos entre 1 y 999.");
    }

    const normalizedKey = String(numericAmount);

    if (seenAmounts.has(normalizedKey)) {
      throw new Error("No puede haber precios duplicados.");
    }

    seenAmounts.add(normalizedKey);
  }
}

function validateWhatsappUrl(url: string) {
  const trimmedUrl = url.trim();

  if (
    !trimmedUrl.startsWith("https://wa.me/") &&
    !trimmedUrl.startsWith("https://api.whatsapp.com/")
  ) {
    throw new Error(
      "El enlace de WhatsApp debe empezar por https://wa.me/ o https://api.whatsapp.com/"
    );
  }
}

function validateSafeUrl(url: string, fieldName: string) {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return;

  if (
    !trimmedUrl.startsWith("https://") &&
    !trimmedUrl.startsWith("http://") &&
    !trimmedUrl.startsWith("/")
  ) {
    throw new Error(`${fieldName} debe ser una URL válida.`);
  }
}

function cleanTestimonials(testimonials: z.infer<typeof testimonialSchema>[]) {
  return testimonials
    .map((testimonial) => {
      const mediaUrl = testimonial.mediaUrl?.trim() || "";
      const mediaKind = mediaUrl ? testimonial.mediaKind : "none";

      validateSafeUrl(mediaUrl, "La URL del archivo del testimonio");

      return {
        name: testimonial.name.trim(),
        text: testimonial.text.trim(),
        type: testimonial.type.trim(),
        mediaKind,
        mediaUrl
      };
    })
    .filter((testimonial) => {
      return (
        testimonial.name.length > 0 ||
        testimonial.text.length > 0 ||
        testimonial.mediaUrl.length > 0
      );
    })
    .slice(0, 6);
}

function cleanContent(content: z.infer<typeof settingsSchema>) {
  const cleaned = {
    heroTitle: content.heroTitle.trim(),
    heroSubtitle: content.heroSubtitle.trim(),
    heroIntro: content.heroIntro?.trim() || "",
    videoUrl: content.videoUrl?.trim() || "",
    videoHelper: content.videoHelper.trim(),
    coachText: content.coachText.trim(),
    learnItems: content.learnItems.map((item) => item.trim()).filter(Boolean),
    testimonialsText: content.testimonialsText.trim(),
    testimonials: cleanTestimonials(content.testimonials || []),
    prices: content.prices.slice(0, 3).map((price) => ({
      amount: price.amount.trim(),
      label: price.label.trim()
    })),
    whatsappUrl: content.whatsappUrl.trim(),
    whatsappText: content.whatsappText.trim(),
    showTestimonials: content.showTestimonials
  };

  validateSafeUrl(cleaned.videoUrl, "La URL del vídeo");
  validatePrices(cleaned.prices);
  validateWhatsappUrl(cleaned.whatsappUrl);

  return cleaned;
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
    }

    const url = new URL(request.url);
    const localeResult = localeSchema.safeParse(url.searchParams.get("locale") || "es");

    if (!localeResult.success) {
      return NextResponse.json({ ok: false, error: "Locale no válido." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("reto_lily_settings")
      .select("locale, content_json, is_active, updated_at")
      .eq("locale", localeResult.data)
      .single();

    if (error || !data) {
      console.error("Admin settings GET error:", error);
      return NextResponse.json(
        { ok: false, error: "No se pudo cargar la configuración." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      locale: data.locale,
      content: data.content_json,
      isActive: data.is_active,
      updatedAt: data.updated_at
    });
  } catch (error) {
    console.error("Admin settings GET request error:", error);

    return NextResponse.json(
      { ok: false, error: "Error interno cargando la configuración." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsedBody = postSchema.parse(rawBody);

    if (!isAuthorized(request, parsedBody.secret || null)) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
    }

    const cleanedContent = cleanContent(parsedBody.content);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("reto_lily_settings")
      .upsert(
        {
          locale: parsedBody.locale,
          content_json: cleanedContent,
          is_active: true,
          updated_at: new Date().toISOString()
        },
        { onConflict: "locale" }
      )
      .select("locale, content_json, is_active, updated_at")
      .single();

    if (error || !data) {
      console.error("Admin settings POST error:", error);

      return NextResponse.json(
        { ok: false, error: "No se pudo guardar la configuración." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Configuración guardada correctamente.",
      locale: data.locale,
      content: data.content_json,
      isActive: data.is_active,
      updatedAt: data.updated_at
    });
  } catch (error) {
    console.error("Admin settings POST request error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Datos no válidos.", details: error.flatten() },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { ok: false, error: "Error interno guardando la configuración." },
      { status: 500 }
    );
  }
}
