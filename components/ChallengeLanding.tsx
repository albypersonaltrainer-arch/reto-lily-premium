"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChallengeCopy } from "@/config/challenge";
import { Countdown } from "@/components/Countdown";
import { LeadForm } from "@/components/LeadForm";
import { VideoGate } from "@/components/VideoGate";

type TestimonialMediaKind = "none" | "image" | "video" | "audio";

type TestimonialWithMedia = {
  name: string;
  text: string;
  type: string;
  mediaKind?: TestimonialMediaKind;
  mediaUrl?: string;
};

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

const BRAND_LOGO_SRC = "/stamp_negro.png";
const SINGLE_PRICE = "$27";

const SPANISH_FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Cuánto tiempo tendré acceso?",
    answer: (
      <p>
        Tendrás acceso durante 1 año, tanto al contenido actual como a todas las
        actualizaciones que se incorporen durante ese periodo.
      </p>
    ),
  },
  {
    question: "¿Cuánto tiempo necesito cada día?",
    answer: (
      <p>
        El recorrido está diseñado para que puedas completarlo dedicando
        aproximadamente 30 minutos al día.
      </p>
    ),
  },
  {
    question: "¿Es para mí si ya he leído muchos libros o hecho otros cursos?",
    answer: (
      <div className="space-y-3">
        <p>Sí.</p>
        <p>De hecho, probablemente sea para ti.</p>
        <p>
          Código Origen no busca darte más información, sino ayudarte a comprender
          por qué, a pesar de todo lo que ya sabes y de todo lo que has trabajado en
          ti, sigues obteniendo los mismos resultados.
        </p>
      </div>
    ),
  },
  {
    question: "¿Cómo accedo al contenido?",
    answer: (
      <div className="space-y-3">
        <p>
          En cuanto completes tu compra, recibirás un correo electrónico con las
          instrucciones de acceso.
        </p>
        <p>
          Solo tendrás que solicitar tu acceso y, una vez aprobado, recibirás la
          confirmación para comenzar el recorrido.
        </p>
      </div>
    ),
  },
  {
    question: "¿Y si no tengo tiempo?",
    answer: (
      <div className="space-y-3">
        <p>
          Aunque está diseñado para completarse en 3 días, podrás avanzar
          completamente a tu ritmo.
        </p>
        <p>
          Si decides realizar el recorrido durante esos tres días, recibirás un bonus
          exclusivo como reconocimiento por completar el proceso dentro del tiempo
          propuesto.
        </p>
      </div>
    ),
  },
  {
    question: "¿Qué ocurre cuando termino los tres días?",
    answer: (
      <div className="space-y-3">
        <p>
          Si al terminar sientes que quieres seguir profundizando y llevar este
          trabajo a tu siguiente nivel, recibirás un correo con un enlace para
          reservar una sesión grupal online gratuita de 30 minutos.
        </p>
        <p>
          En ella podrás resolver tus dudas, compartir lo que has descubierto durante
          el recorrido y conocer cuál es el siguiente paso si decides seguir
          avanzando.
        </p>
        <p className="font-semibold text-[#30271f]">
          Las sesiones se realizan todos los jueves a las 17:30 h (hora de Madrid).
        </p>
      </div>
    ),
  },
  {
    question: "¿Me vas a vender algo?",
    answer: (
      <div className="space-y-3">
        <p>
          Al terminar te mostraré cuál es el siguiente paso, por si decides seguir
          profundizando.
        </p>
        <p>
          Mi trabajo no es convencerte de que continúes. Es darte la claridad
          suficiente para que seas tú quien decida si este camino tiene sentido para
          ti.
        </p>
      </div>
    ),
  },
];

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-8 w-8"
      fill="currentColor"
    >
      <path d="M16.02 3.2C8.96 3.2 3.22 8.86 3.22 15.81c0 2.23.6 4.4 1.74 6.31L3.1 28.8l6.93-1.8a12.97 12.97 0 0 0 5.99 1.5c7.06 0 12.8-5.65 12.8-12.6S23.08 3.2 16.02 3.2Zm0 23.15c-1.9 0-3.76-.5-5.39-1.45l-.39-.23-4.12 1.07 1.1-3.9-.26-.4a10.31 10.31 0 0 1-1.6-5.53c0-5.77 4.78-10.46 10.66-10.46 5.87 0 10.65 4.69 10.65 10.46 0 5.76-4.78 10.44-10.65 10.44Zm5.84-7.82c-.32-.16-1.89-.92-2.18-1.02-.3-.1-.51-.16-.72.16-.21.31-.82 1.02-1.01 1.23-.18.2-.37.23-.69.08-.32-.16-1.34-.49-2.56-1.55-.95-.83-1.59-1.85-1.78-2.16-.18-.32-.02-.49.14-.64.14-.14.32-.36.48-.54.16-.18.21-.31.32-.52.1-.2.05-.39-.03-.54-.08-.16-.72-1.7-.99-2.33-.26-.62-.52-.53-.72-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59s1.13 3.01 1.29 3.22c.16.2 2.23 3.35 5.4 4.7.75.32 1.34.51 1.8.65.76.24 1.44.21 1.98.13.6-.09 1.89-.76 2.16-1.49.27-.73.27-1.35.19-1.49-.08-.13-.29-.21-.61-.36Z" />
    </svg>
  );
}

function TestimonialMedia({ item }: { item: TestimonialWithMedia }) {
  const mediaKind = item.mediaKind || "none";
  const mediaUrl = item.mediaUrl || "";

  if (!mediaUrl || mediaKind === "none") {
    return (
      <div className="mb-5 inline-flex rounded-full border border-[#c9a86a]/35 bg-[#c9a86a]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#b89452]">
        {item.type}
      </div>
    );
  }

  if (mediaKind === "image") {
    return (
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#c9a86a]/20 bg-white p-2">
        <img
          src={mediaUrl}
          alt={item.name}
          className="mx-auto max-h-[420px] w-full rounded-xl object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  if (mediaKind === "video") {
    return (
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#c9a86a]/20 bg-black">
        <video src={mediaUrl} controls preload="metadata" playsInline className="w-full" />
      </div>
    );
  }

  if (mediaKind === "audio") {
    return (
      <div className="mb-5 rounded-2xl border border-[#c9a86a]/20 bg-white p-4">
        <audio src={mediaUrl} controls preload="metadata" className="w-full" />
      </div>
    );
  }

  return null;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.32em] text-[#b89452]">
      {children}
    </p>
  );
}

function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded bg-[#111111] px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#2a2118]"
    >
      {children}
    </a>
  );
}

function SpanishFaqSection() {
  return (
    <section className="px-6 pb-20 pt-6 md:pb-28">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-black/10 bg-[#fffaf2] shadow-[0_24px_70px_rgba(35,24,14,0.10)]">
          {SPANISH_FAQ_ITEMS.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-black/10 last:border-b-0"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-6 text-left font-serif text-2xl leading-tight text-[#111111] marker:hidden md:px-8">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="text-3xl font-light text-[#b89452] transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-7 text-base leading-8 text-[#5b5046] md:px-8 md:text-lg">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ChallengeLanding({ copy }: { copy: ChallengeCopy }) {
  const [unlocked, setUnlocked] = useState(false);

  const privacyHref = `/${copy.locale}/legal/privacidad`;
  const termsHref = `/${copy.locale}/legal/terminos`;
  const landingHref = `/${copy.locale}/${copy.slug}`;
  const testimonials = copy.testimonials.items as TestimonialWithMedia[];
  const isSpanish = copy.locale === "es";

  return (
    <div className="min-h-screen bg-[#f3eadc] text-[#17130f]">
      <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#f7efe3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          <a href={landingHref} aria-label={copy.brand} className="flex items-center gap-3">
            <Image
              src={BRAND_LOGO_SRC}
              alt={copy.brand}
              width={70}
              height={70}
              className="h-12 w-12 object-contain"
              priority
            />
          </a>

          <a
            href="#solicita-acceso"
            className="rounded bg-[#111111] px-5 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#2b2119]"
          >
            {isSpanish ? "Acceder al reto" : "Access now"}
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(201,168,106,0.35),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(0,0,0,0.10),transparent_26%)]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <SectionLabel>
                {isSpanish ? "Un recorrido guiado de 3 días" : "3-day online challenge"}
              </SectionLabel>

              <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#111111] md:text-7xl">
                {isSpanish
                  ? "No estás creando desde donde crees que estás creando."
                  : "You are not creating from where you think you are creating."}
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#3e342a] md:text-2xl">
                {isSpanish
                  ? "Si hacer más fuera la solución, ya habrías cambiado."
                  : "If doing more were the solution, you would have changed already."}
              </p>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5b5046]">
                {isSpanish
                  ? "El Código de la Abundancia es una experiencia de observación y toma de conciencia para descubrir por qué sigues obteniendo resultados parecidos, aunque lleves tiempo intentando cambiar."
                  : copy.hero.intro}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <CtaButton href="#solicita-acceso">
                  {isSpanish ? `Entrar por ${SINGLE_PRICE}` : `Enter for ${SINGLE_PRICE}`}
                </CtaButton>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6c5d4c]">
                  {isSpanish
                    ? "100% online · acceso inmediato · acceso durante 1 año"
                    : "100% online · immediate access · 1 year access"}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#fffaf2]/80 p-8 shadow-[0_30px_90px_rgba(35,24,14,0.16)]">
              <Image
                src={BRAND_LOGO_SRC}
                alt={copy.brand}
                width={360}
                height={360}
                className="mx-auto h-52 w-52 object-contain md:h-72 md:w-72"
                priority
              />

              <div className="mt-8 border-t border-black/10 pt-6">
                <p className="text-sm font-black uppercase tracking-[0.26em] text-[#b89452]">
                  {isSpanish ? "No es manifestación tradicional" : "Not traditional manifestation"}
                </p>
                <p className="mt-4 text-lg leading-8 text-[#3e342a]">
                  {isSpanish
                    ? "No va de visualizar mejor, repetir afirmaciones o aprender otra técnica. Va de observar desde dónde estás interpretando, decidiendo y creando tu realidad."
                    : "It is not about visualizing better, repeating affirmations or learning another technique. It is about observing where you are interpreting, deciding and creating your reality from."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-14 text-white md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <SectionLabel>{isSpanish ? "La pregunta central" : "The central question"}</SectionLabel>
            </div>
            <div className="md:col-span-2">
              <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
                {isSpanish
                  ? "¿Por qué sigo obteniendo los mismos resultados aunque llevo tiempo intentando cambiar?"
                  : "Why do I keep getting the same results even though I have been trying to change?"}
              </h2>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <VideoGate
              url={copy.video.url}
              placeholderText={copy.video.placeholderText}
              lockedText={copy.video.locked}
              unlockLabel={copy.video.unlockLabel}
              unlockAfterSeconds={copy.video.unlockAfterSeconds}
              onUnlocked={() => setUnlocked(true)}
            />
          </div>
        </section>

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-black/10 bg-[#fffaf2] p-8 shadow-[0_24px_70px_rgba(35,24,14,0.10)] md:p-12">
            {unlocked ? (
              <SectionLabel>{isSpanish ? "Acceso desbloqueado" : "Access unlocked"}</SectionLabel>
            ) : (
              <SectionLabel>{isSpanish ? "Después del vídeo" : "After the video"}</SectionLabel>
            )}

            <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">
              {copy.unlock.title}
            </h2>

            <p className="mt-6 text-xl leading-9 text-[#4e4237]">
              {copy.unlock.lines.slice(0, 2).join(" ")}
            </p>

            <div className="mt-8">
              <CtaButton href="#solicita-acceso">{copy.unlock.cta}</CtaButton>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-[#111111] p-8 text-white md:p-10">
              <SectionLabel>{isSpanish ? "El problema real" : "The real problem"}</SectionLabel>
              <h2 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
                {isSpanish ? "No te falta más información." : "You do not need more information."}
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/75">
                {isSpanish
                  ? "Muchas personas ya han leído, aprendido, probado y trabajado en sí mismas. Pero siguen cayendo en patrones parecidos porque no están viendo desde qué filtro están operando."
                  : "Many people have already read, learned, tried and worked on themselves. But they keep falling into similar patterns because they are not seeing the filter they are operating from."}
              </p>
            </div>

            <div className="space-y-5">
              {(isSpanish
                ? [
                    "Sabes mucho sobre abundancia, pero sigues repitiendo escenarios.",
                    "Quieres más oportunidades, pero algo en ti interpreta la realidad desde el mismo lugar.",
                    "Intentas cambiar fuera, pero el observador interno sigue siendo el mismo.",
                  ]
                : [
                    "You know a lot about abundance, but you keep repeating scenarios.",
                    "You want more opportunities, but something in you interprets reality from the same place.",
                    "You try to change the outside, but the inner observer remains the same.",
                  ]
              ).map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-black/10 bg-[#fffaf2] p-6 text-xl leading-8 shadow-[0_18px_50px_rgba(35,24,14,0.08)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eadcc7] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>{isSpanish ? "Antes de empezar" : "Before starting"}</SectionLabel>

            <div className="mt-6 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">
                  {isSpanish
                    ? "El problema no siempre es lo que pasa. A veces es desde dónde lo estás mirando."
                    : "The problem is not always what happens. Sometimes it is where you are looking from."}
                </h2>
              </div>

              <div className="space-y-5 text-lg leading-8 text-[#3e342a]">
                <p>
                  {isSpanish
                    ? "La mayoría cree que su problema es que todavía no ha conseguido lo que quiere: más dinero, más oportunidades, más libertad o más resultados."
                    : "Most people believe their problem is that they have not yet achieved what they want: more money, more opportunities, more freedom or more results."}
                </p>

                <p>
                  {isSpanish
                    ? "Pero dos personas pueden vivir una situación parecida y crear experiencias completamente distintas."
                    : "But two people can live through a similar situation and create completely different experiences."}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(isSpanish
                    ? [
                        "Una ve problemas.",
                        "La otra ve oportunidades.",
                        "Una ve límites.",
                        "La otra ve posibilidades.",
                        "Una se contrae.",
                        "La otra actúa.",
                      ]
                    : [
                        "One sees problems.",
                        "The other sees opportunities.",
                        "One sees limits.",
                        "The other sees possibilities.",
                        "One contracts.",
                        "The other acts.",
                      ]
                  ).map((item) => (
                    <div key={item} className="rounded-xl border border-black/10 bg-[#fffaf2]/75 p-4">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] bg-[#111111] p-8 text-white md:p-12">
              <p className="font-serif text-3xl leading-tight tracking-[-0.03em] md:text-5xl">
                {isSpanish
                  ? "Mientras el observador siga siendo el mismo, la realidad podrá cambiar de forma, pero tenderá a parecerse una y otra vez a la anterior."
                  : "As long as the observer remains the same, reality may change form, but it will tend to resemble the previous one again and again."}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionLabel>
              {isSpanish ? "Qué vivirás estos 3 días." : "What you will experience in these 3 days"}
            </SectionLabel>

            <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
              {isSpanish
                ? "Tres días para mirar tu realidad desde otro lugar."
                : "Three days to look at your reality from another place."}
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {(isSpanish
                ? [
                    {
                      day: "Día 1",
                      title: "El problema no es tu realidad, es el observador",
                      text: "Descubrirás que no estás creando desde donde crees que estás creando.",
                    },
                    {
                      day: "Día 2",
                      title: "Tu mente ve lo que espera encontrar",
                      text: "Identificarás filtros, conclusiones e interpretaciones que condicionan tu experiencia.",
                    },
                    {
                      day: "Día 3",
                      title: "No necesitas esforzarte más",
                      text: "Empezarás a comprender cómo elegir desde otro lugar y abrir nuevas posibilidades.",
                    },
                  ]
                : [
                    {
                      day: "Day 1",
                      title: "The problem is not your reality, it is the observer",
                      text: "You will discover that you are not creating from where you think you are creating.",
                    },
                    {
                      day: "Day 2",
                      title: "Your mind sees what it expects to find",
                      text: "You will identify filters, conclusions and interpretations that condition your experience.",
                    },
                    {
                      day: "Day 3",
                      title: "You do not need to try harder",
                      text: "You will begin to understand how to choose from another place and open new possibilities.",
                    },
                  ]
              ).map((item) => (
                <article
                  key={item.day}
                  className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-7 shadow-[0_20px_60px_rgba(35,24,14,0.09)]"
                >
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b89452]">
                    {item.day}
                  </p>
                  <h3 className="mt-5 font-serif text-3xl leading-tight text-[#111111]">
                    {item.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-[#5b5046]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-14 text-white md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
            <div>
              <SectionLabel>{isSpanish ? "Lo que no es" : "What it is not"}</SectionLabel>
              <div className="mt-6 space-y-3 text-lg leading-8 text-white/75">
                {(isSpanish
                  ? [
                      "No es un curso de manifestación.",
                      "No es un entrenamiento financiero.",
                      "No es una colección de técnicas.",
                      "No es una solución mágica.",
                    ]
                  : [
                      "It is not a manifestation course.",
                      "It is not financial training.",
                      "It is not a collection of techniques.",
                      "It is not a magic solution.",
                    ]
                ).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>{isSpanish ? "Lo que sí es" : "What it is"}</SectionLabel>
              <div className="mt-6 space-y-3 text-lg leading-8 text-white/75">
                {(isSpanish
                  ? [
                      "Una experiencia de observación.",
                      "Una toma de conciencia profunda.",
                      "Una puerta de entrada hacia una forma distinta de crear.",
                      "Un reto para ver lo que hasta ahora no estabas viendo.",
                    ]
                  : [
                      "An observation experience.",
                      "A deep awareness process.",
                      "A gateway to a different way of creating.",
                      "A challenge to see what you had not been seeing until now.",
                    ]
                ).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-8 shadow-[0_24px_70px_rgba(35,24,14,0.10)]">
              <Image
                src={BRAND_LOGO_SRC}
                alt={copy.brand}
                width={300}
                height={300}
                className="mx-auto h-56 w-56 object-contain"
              />
            </div>

            <div>
              <SectionLabel>{copy.coach.name}</SectionLabel>

              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">
                {copy.coach.subtitle}
              </h2>

              <p className="mt-6 text-xl leading-9 text-[#3e342a]">{copy.coach.text}</p>
            </div>
          </div>
        </section>

        {testimonials.length > 0 ? (
          <section className="bg-[#eadcc7] px-6 py-14 md:py-20">
            <div className="mx-auto max-w-7xl">
              <SectionLabel>{isSpanish ? "Casos de éxito" : "Success stories"}</SectionLabel>

              <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">
                {isSpanish
                  ? "Personas que ya empezaron a mirar su realidad desde otro lugar."
                  : "People who have already started looking at their reality from another place."}
              </h2>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {testimonials.map((item, index) => (
                  <article
                    key={`${item.name}-${index}`}
                    className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-6 shadow-[0_20px_60px_rgba(35,24,14,0.09)]"
                  >
                    <TestimonialMedia item={item} />
                    <p className="text-lg leading-8 text-[#3e342a]">“{item.text}”</p>
                    <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#857464]">
                      {item.name}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionLabel>{isSpanish ? "Acceso al reto" : "Challenge access"}</SectionLabel>

              <h2 className="mt-5 font-serif text-5xl leading-tight tracking-[-0.05em] text-[#111111] md:text-7xl">
                {SINGLE_PRICE}
              </h2>

              <p className="mt-5 max-w-xl text-xl leading-9 text-[#3e342a]">
                {isSpanish
                  ? "Acceso completo al reto online de 3 días para empezar a ver por qué sigues obteniendo ciertos resultados y desde dónde los estás creando."
                  : "Full access to the 3-day online challenge to begin seeing why you keep getting certain results and where you are creating them from."}
              </p>

              <div className="mt-8">
                <CtaButton href="#solicita-acceso">{isSpanish ? "Acceder ahora" : "Access now"}</CtaButton>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-8 shadow-[0_24px_70px_rgba(35,24,14,0.10)]">
              <div className="space-y-4 text-lg leading-8 text-[#3e342a]">
                <p>{isSpanish ? "✔ Acceso online al reto completo de 3 días" : "✔ Online access to the complete 3-day challenge"}</p>
                <p>{isSpanish ? "✔ Acceso inmediato tras la inscripción" : "✔ Immediate access after registration"}</p>
                <p>{isSpanish ? "✔ Acceso disponible durante 1 año" : "✔ Access available for 1 year"}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-14 text-white md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionLabel>{copy.countdown.label}</SectionLabel>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
                {copy.countdown.title}
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/70">{copy.countdown.text}</p>
            </div>

            <Countdown
              deadlineIso={copy.countdown.deadlineIso}
              urgencyMinutes={copy.countdown.urgencyMinutes}
            />
          </div>
        </section>

        <section id="solicita-acceso" className="scroll-mt-28 px-6 py-14 md:py-20">
          <div className="mx-auto max-w-4xl">
            <LeadForm copy={copy} />
          </div>
        </section>

        {isSpanish ? (
          <SpanishFaqSection />
        ) : (
          <section className="px-6 pb-20 pt-6 md:pb-28">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-black/10 bg-[#fffaf2] p-8 text-center shadow-[0_24px_70px_rgba(35,24,14,0.10)] md:p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsAppIcon />
              </div>

              <h2 className="font-serif text-4xl leading-tight text-[#111111] md:text-5xl">
                {copy.whatsapp.title}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5b5046]">
                {copy.whatsapp.text}
              </p>

              <a
                href={copy.whatsapp.url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded border border-[#25D366]/70 px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#178f45] transition hover:bg-[#25D366] hover:text-white"
              >
                {copy.whatsapp.cta}
              </a>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 bg-[#111111] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src={BRAND_LOGO_SRC}
              alt={copy.brand}
              width={54}
              height={54}
              className="h-10 w-10 object-contain invert"
            />
            <div className="font-serif text-xl">{copy.brand}</div>
          </div>

          <p className="text-xs uppercase tracking-[0.22em] text-white/55">{copy.footer.legal}</p>

          <nav className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.22em] text-white/65">
            <a href={privacyHref} className="transition hover:text-white">
              {copy.footer.privacy}
            </a>
            <a href={termsHref} className="transition hover:text-white">
              {copy.footer.terms}
            </a>
            <a href={copy.whatsapp.url} target="_blank" rel="noreferrer" className="transition hover:text-[#25D366]">
              {copy.footer.contact}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
