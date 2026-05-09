import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const BUCKET_NAME = "reto-lily-testimonials";

const MAX_FILE_SIZE_BYTES = 209715200; // 200 MB

const allowedMimeTypes: Record<string, { extension: string; kind: "image" | "video" | "audio" }> = {
  "image/jpeg": { extension: "jpg", kind: "image" },
  "image/png": { extension: "png", kind: "image" },
  "image/webp": { extension: "webp", kind: "image" },

  "video/mp4": { extension: "mp4", kind: "video" },
  "video/webm": { extension: "webm", kind: "video" },
  "video/quicktime": { extension: "mov", kind: "video" },
  "video/x-m4v": { extension: "m4v", kind: "video" },

  "audio/mpeg": { extension: "mp3", kind: "audio" },
  "audio/mp4": { extension: "m4a", kind: "audio" },
  "audio/wav": { extension: "wav", kind: "audio" },
  "audio/webm": { extension: "webm", kind: "audio" },
  "audio/x-wav": { extension: "wav", kind: "audio" }
};

const uploadRequestSchema = z.object({
  secret: z.string().min(1),
  fileName: z.string().min(1).max(220),
  fileType: z.string().min(1).max(120),
  fileSize: z.number().int().positive(),
  testimonialIndex: z.number().int().min(0).max(9)
});

function getExpectedSecret() {
  const secret = process.env.LILY_ADMIN_SECRET;

  if (!secret) {
    throw new Error("Missing LILY_ADMIN_SECRET environment variable");
  }

  return secret;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .slice(0, 120);
}

function getSafeExtension(fileName: string, fileType: string) {
  const allowed = allowedMimeTypes[fileType];

  if (!allowed) {
    return null;
  }

  const safeName = sanitizeFileName(fileName);
  const extensionFromName = safeName.includes(".")
    ? safeName.split(".").pop()
    : "";

  const validExtensions = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "mp4",
    "webm",
    "mov",
    "m4v",
    "mp3",
    "m4a",
    "wav"
  ];

  if (extensionFromName && validExtensions.includes(extensionFromName)) {
    return extensionFromName === "jpeg" ? "jpg" : extensionFromName;
  }

  return allowed.extension;
}

export async function POST(request: Request) {
  try {
    const body = uploadRequestSchema.parse(await request.json());

    const expectedSecret = getExpectedSecret();

    if (body.secret !== expectedSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: "No autorizado."
        },
        { status: 401 }
      );
    }

    const allowed = allowedMimeTypes[body.fileType];

    if (!allowed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Formato no permitido. Puedes subir imagen JPG/PNG/WEBP, vídeo MP4/WEBM/MOV/M4V o audio MP3/M4A/WAV/WEBM."
        },
        { status: 400 }
      );
    }

    if (body.fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "El archivo supera el límite máximo de 200 MB."
        },
        { status: 400 }
      );
    }

    const extension = getSafeExtension(body.fileName, body.fileType);

    if (!extension) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo validar la extensión del archivo."
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const today = new Date().toISOString().slice(0, 10);
    const safeFileName = sanitizeFileName(body.fileName);
    const baseFileName = safeFileName || `testimonio-${body.testimonialIndex + 1}.${extension}`;

    const uniqueFileName = `${Date.now()}-${randomUUID()}-${baseFileName}`;
    const finalFileName = uniqueFileName.endsWith(`.${extension}`)
      ? uniqueFileName
      : `${uniqueFileName}.${extension}`;

    const path = `uploads/${today}/testimonio-${body.testimonialIndex + 1}/${finalFileName}`;

    const { data: signedUploadData, error: signedUploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(path);

    if (signedUploadError || !signedUploadData) {
      console.error("Testimonial signed upload URL error:", signedUploadError);

      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo preparar la subida del archivo."
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      bucket: BUCKET_NAME,
      path,
      token: signedUploadData.token,
      signedUrl: signedUploadData.signedUrl,
      publicUrl: publicUrlData.publicUrl,
      mediaKind: allowed.kind,
      mimeType: body.fileType
    });
  } catch (error) {
    console.error("Testimonial upload URL request error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Datos de archivo no válidos.",
          details: error.flatten()
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Error interno preparando la subida del archivo."
      },
      { status: 500 }
    );
  }
}
