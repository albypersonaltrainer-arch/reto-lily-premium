import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { ChallengeLanding } from "@/components/ChallengeLanding";
import { getChallenge, type Locale } from "@/config/challenge";
import { getEditableChallengeCopy } from "@/lib/challengeSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export function generateStaticParams() {
  return [
    { locale: "es", slug: "codigo-origen" },
    { locale: "en", slug: "the-challenge" }
  ];
}

type ChallengePageProps = {
  params: {
    locale: string;
    slug: string;
  };
};

export function generateMetadata({ params }: ChallengePageProps): Metadata {
  const isEnglish = params.locale === "en";
  const title = isEnglish
    ? "The Challenge: discover why you repeat the same results"
    : "Código Origen: descubre por qué repites los mismos resultados";
  const description = isEnglish
    ? "A guided 3-day experience to understand why you keep getting similar results and begin creating from a different place."
    : "Reto premium de 3 días para detectar el patrón que bloquea tu relación con el dinero.";
  const canonicalPath = isEnglish ? "/en/the-challenge" : "/es/codigo-origen";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: isEnglish ? "en_US" : "es_ES",
      url: canonicalPath,
      siteName: "Lily Camarena",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  noStore();

  const locale: Locale = params.locale === "en" ? "en" : "es";
  const baseChallenge = getChallenge(params.locale, params.slug);

  if (!baseChallenge) {
    notFound();
  }

  const challenge = await getEditableChallengeCopy(locale);

  return <ChallengeLanding copy={challenge} />;
}
