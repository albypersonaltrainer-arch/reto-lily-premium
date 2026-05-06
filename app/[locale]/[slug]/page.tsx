import { notFound } from "next/navigation";
import { ChallengeLanding } from "@/components/ChallengeLanding";
import { getChallenge } from "@/config/challenge";

export function generateStaticParams() {
  return [
    { locale: "es", slug: "reto-dinero" },
    { locale: "en", slug: "money-challenge" }
  ];
}

export default function ChallengePage({ params }: { params: { locale: string; slug: string } }) {
  const challenge = getChallenge(params.locale, params.slug);
  if (!challenge) notFound();
  return <ChallengeLanding copy={challenge} />;
}
