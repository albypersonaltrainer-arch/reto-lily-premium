import type { Metadata } from "next";
import CodigoCeroLanding from "@/components/codigo-cero/CodigoCeroLanding";
import { codigoCeroMedia } from "@/config/codigoCero";

const pageTitle = "Código Cero | Lily Camarena";
const pageDescription =
  "Descubre el primer paso para entender por qué sigues repitiendo los mismos resultados y qué está frenando tu siguiente nivel.";
const canonicalUrl = "https://www.lilycamarena.com/codigo-cero";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    siteName: "Lily Camarena",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CodigoCeroPage() {
  return (
    <CodigoCeroLanding
      mediaType={codigoCeroMedia.type}
      mediaSrc={codigoCeroMedia.src}
      mediaPoster={codigoCeroMedia.poster}
      mediaTitle={codigoCeroMedia.title}
      completionThreshold={codigoCeroMedia.completionThreshold}
    />
  );
}
