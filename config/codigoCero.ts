export type CodigoCeroMediaType = "audio" | "video";

export type CodigoCeroMediaConfig = {
  type: CodigoCeroMediaType;
  src: string;
  poster?: string;
  title: string;
  completionThreshold: number;
  nextStepUrl: string;
};

const DEFAULT_CODIGO_CERO_VIDEO_URL =
  "https://fqjtmpsdrocejlgiogss.supabase.co/storage/v1/object/public/codigo-cero-media/codigo-cero-final-web-6f8a2d.mp4";

function resolveMediaType(value?: string): CodigoCeroMediaType {
  return value === "audio" ? "audio" : "video";
}

const configuredMediaSrc =
  process.env.NEXT_PUBLIC_CODIGO_CERO_MEDIA_SRC?.trim() || "";

const mediaType = configuredMediaSrc
  ? resolveMediaType(process.env.NEXT_PUBLIC_CODIGO_CERO_MEDIA_TYPE)
  : "video";

const mediaPoster =
  process.env.NEXT_PUBLIC_CODIGO_CERO_MEDIA_POSTER?.trim() || undefined;

export const codigoCeroMedia: CodigoCeroMediaConfig = {
  type: mediaType,
  src: configuredMediaSrc || DEFAULT_CODIGO_CERO_VIDEO_URL,
  poster: mediaType === "video" ? mediaPoster : undefined,
  title: "Código Cero",
  completionThreshold: 0.9,
  nextStepUrl:
    process.env.NEXT_PUBLIC_CODIGO_CERO_NEXT_STEP_URL?.trim() || "",
};
