import { notFound } from "next/navigation";
import { ChallengeLanding } from "@/components/ChallengeLanding";
import { getChallenge, type Locale } from "@/config/challenge";
import { getEditableChallengeCopy } from "@/lib/challengeSettings";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [
    { locale: "es", slug: "reto-dinero" },
    { locale: "en", slug: "money-challenge" }
  ];
}

type ChallengePageProps = {
  params: {
    locale: string;
    slug: string;
  };
};

export default async function ChallengePage({ params }: ChallengePageProps) {
  const locale: Locale = params.locale === "en" ? "en" : "es";

  const baseChallenge = getChallenge(params.locale, params.slug);

  if (!baseChallenge) {
    notFound();
  }

  const challenge = await getEditableChallengeCopy(locale);

  return <ChallengeLanding copy={challenge} />;
}
