import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const BUCKET_NAME = "reto-lily-videos";

const MAX_VIDEO_SIZE_BYTES = 524288000; // 500 MB

const allowedVideoTypes: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-m4v": "m4v"
};

const uploadRequestSchema = z.object({
  secret: z.string().min(1),
  fileName: z.string().min(1).max(220),
  fileType: z.string().min(1).max(120),
  fileSize: z.number().int().positive()
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
  const allowedExtension = allowedVideoTypes[fileType];

  if (!allowedExtension) {
    return null;
  }

  const safeName = sanitizeFileName(fileName);
  const extensionFromName = safeName.includes(".")
    ? safeName.split(".").pop()
    : "";

  if (
    extensionFromName &&
    ["mp4", "webm", "mov", "m4v"].includes(extensionFromName)
  ) {
    return extensionFromName;
  }

  return allowedExtension;
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

    if (!allowedVideoTypes[body.fileType]) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Formato de vídeo no permitido. Usa MP4, WEBM, MOV o M4V."
        },
        { status: 400 }
      );
    }

    if (body.fileSize > MAX_VIDEO_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "El vídeo supera el límite máximo de 500 MB."
        },
        { status: 400 }
      );
    }

    const extension = getSafeExtension(body.fileName, body.fileType);

    if (!extension) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo validar la extensión del vídeo."
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const today = new Date().toISOString().slice(0, 10);
    const safeFileName = sanitizeFileName(body.fileName);
    const uniqueFileName = `${Date.now()}-${randomUUID()}-${safeFileName || `video.${extension}`}`;

    const path = `uploads/${today}/${uniqueFileName.endsWith(`.${extension}`) ? uniqueFileName : `${uniqueFileName}.${extension}`}`;

    const { data: signedUploadData, error: signedUploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(path);

    if (signedUploadError || !signedUploadData) {
      console.error("Video signed upload URL error:", signedUploadError);

      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo preparar la subida del vídeo."
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
      publicUrl: publicUrlData.publicUrl
    });
  } catch (error) {
    console.error("Video upload URL request error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Datos de vídeo no válidos.",
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
        error: "Error interno preparando la subida del vídeo."
      },
      { status: 500 }
    );
  }
}
