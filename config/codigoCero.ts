export type CodigoCeroMediaType = "audio" | "video";

export type CodigoCeroMediaConfig = {
  type: CodigoCeroMediaType;
  src: string;
  poster?: string;
  title: string;
  completionThreshold: number;
};

function resolveMediaType(value?: string): CodigoCeroMediaType {
  return value === "video" ? "video" : "audio";
}

const mediaType = resolveMediaType(
  process.env.NEXT_PUBLIC_CODIGO_CERO_MEDIA_TYPE
);

const mediaPoster =
  process.env.NEXT_PUBLIC_CODIGO_CERO_MEDIA_POSTER?.trim() || undefined;

export const codigoCeroMedia: CodigoCeroMediaConfig = {
  type: mediaType,
  src: process.env.NEXT_PUBLIC_CODIGO_CERO_MEDIA_SRC?.trim() || "",
  poster: mediaType === "video" ? mediaPoster : undefined,
  title: "Código Cero",
  completionThreshold: 0.9,
};
