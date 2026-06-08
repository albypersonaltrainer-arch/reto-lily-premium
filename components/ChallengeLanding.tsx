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

const BRAND_LOGO_SRC = "/stamp_negro.png";
const SINGLE_PRICE = "$27";

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

export function ChallengeLanding({ copy }: { copy: ChallengeCopy }) {
  const [unlocked, setUnlocked] = useState(false);

  const privacyHref = `/${copy.locale}/legal/privacidad`;
  const termsHref = `/${copy.locale}/legal/terminos`;
  const landingHref = `/${copy.locale}/${copy.slug}`;
  const testimonials = copy.testimonials.items as TestimonialWithMedia[];

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
            Acceder al reto
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(201,168,106,0.35),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(0,0,0,0.10),transparent_26%)]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <SectionLabel>Reto online de 3 días</SectionLabel>

              <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#111111] md:text-7xl">
                No estás creando desde donde crees que estás creando.
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#3e342a] md:text-2xl">
                Si hacer más fuera la solución, ya habrías cambiado.
              </p>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5b5046]">
                El Código de la Abundancia es una experiencia de observación y toma de conciencia
                para descubrir por qué sigues obteniendo resultados parecidos, aunque lleves tiempo
                intentando cambiar.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <CtaButton href="#solicita-acceso">Entrar por {SINGLE_PRICE}</CtaButton>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6c5d4c]">
                  100% online · acceso inmediato · acceso durante 1 año
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
                  No es manifestación tradicional
                </p>
                <p className="mt-4 text-lg leading-8 text-[#3e342a]">
                  No va de visualizar mejor, repetir afirmaciones o aprender otra técnica. Va de
                  observar desde dónde estás interpretando, decidiendo y creando tu realidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-14 text-white md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <SectionLabel>La pregunta central</SectionLabel>
            </div>
            <div className="md:col-span-2">
              <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
                ¿Por qué sigo obteniendo los mismos resultados aunque llevo tiempo intentando cambiar?
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
              <SectionLabel>Acceso desbloqueado</SectionLabel>
            ) : (
              <SectionLabel>Después del vídeo</SectionLabel>
            )}

            <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">
              Esto no va de conseguir otra técnica. Va de ver lo que todavía no estabas viendo.
            </h2>

            <p className="mt-6 text-xl leading-9 text-[#4e4237]">
              Puedes seguir acumulando información, o puedes empezar a mirar el lugar real desde
              el que estás creando tus resultados.
            </p>

            <div className="mt-8">
              <CtaButton href="#solicita-acceso">Solicitar acceso</CtaButton>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-[#111111] p-8 text-white md:p-10">
              <SectionLabel>El problema real</SectionLabel>
              <h2 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
                No te falta más información.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/75">
                Muchas personas ya han leído, aprendido, probado y trabajado en sí mismas. Pero
                siguen cayendo en patrones parecidos porque no están viendo desde qué filtro están
                operando.
              </p>
            </div>

            <div className="space-y-5">
              {[
                "Sabes mucho sobre abundancia, pero sigues repitiendo escenarios.",
                "Quieres más oportunidades, pero algo en ti interpreta la realidad desde el mismo lugar.",
                "Intentas cambiar fuera, pero el observador interno sigue siendo el mismo.",
              ].map((item) => (
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
            <SectionLabel>Antes de empezar</SectionLabel>

            <div className="mt-6 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">
                  El problema no siempre es lo que pasa. A veces es desde dónde lo estás mirando.
                </h2>
              </div>

              <div className="space-y-5 text-lg leading-8 text-[#3e342a]">
                <p>
                  La mayoría cree que su problema es que todavía no ha conseguido lo que quiere:
                  más dinero, más oportunidades, más libertad o más resultados.
                </p>

                <p>
                  Pero dos personas pueden vivir una situación parecida y crear experiencias
                  completamente distintas.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Una ve problemas.",
                    "La otra ve oportunidades.",
                    "Una ve límites.",
                    "La otra ve posibilidades.",
                    "Una se contrae.",
                    "La otra actúa.",
                  ].map((item) => (
                    <div key={item} className="rounded-xl border border-black/10 bg-[#fffaf2]/75 p-4">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] bg-[#111111] p-8 text-white md:p-12">
              <p className="font-serif text-3xl leading-tight tracking-[-0.03em] md:text-5xl">
                Mientras el observador siga siendo el mismo, la realidad podrá cambiar de forma,
                pero tenderá a parecerse una y otra vez a la anterior.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionLabel>Qué vivirás en el reto</SectionLabel>

            <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
              Tres días para mirar tu realidad desde otro lugar.
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
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
              ].map((item) => (
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
              <SectionLabel>Lo que no es</SectionLabel>
              <div className="mt-6 space-y-3 text-lg leading-8 text-white/75">
                <p>No es un curso de manifestación.</p>
                <p>No es un entrenamiento financiero.</p>
                <p>No es una colección de técnicas.</p>
                <p>No es una solución mágica.</p>
              </div>
            </div>

            <div>
              <SectionLabel>Lo que sí es</SectionLabel>
              <div className="mt-6 space-y-3 text-lg leading-8 text-white/75">
                <p>Una experiencia de observación.</p>
                <p>Una toma de conciencia profunda.</p>
                <p>Una puerta de entrada hacia una forma distinta de crear.</p>
                <p>Un reto para ver lo que hasta ahora no estabas viendo.</p>
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
                Si hacer más fuera la solución, ya habrías cambiado.
              </h2>

              <p className="mt-6 text-xl leading-9 text-[#3e342a]">
                Soy esa coach que te ayuda a romper los patrones que siguen frenando tu siguiente
                nivel, para que puedas crear la abundancia, el éxito y los resultados que sabes que
                estás destinad@ a tener.
              </p>
            </div>
          </div>
        </section>

        {testimonials.length > 0 ? (
          <section className="bg-[#eadcc7] px-6 py-14 md:py-20">
            <div className="mx-auto max-w-7xl">
              <SectionLabel>Casos de éxito</SectionLabel>

              <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">
                Personas que ya empezaron a mirar su realidad desde otro lugar.
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
              <SectionLabel>Acceso al reto</SectionLabel>

              <h2 className="mt-5 font-serif text-5xl leading-tight tracking-[-0.05em] text-[#111111] md:text-7xl">
                {SINGLE_PRICE}
              </h2>

              <p className="mt-5 max-w-xl text-xl leading-9 text-[#3e342a]">
                Acceso completo al reto online de 3 días para empezar a ver por qué sigues
                obteniendo ciertos resultados y desde dónde los estás creando.
              </p>

              <div className="mt-8">
                <CtaButton href="#solicita-acceso">Acceder ahora</CtaButton>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-8 shadow-[0_24px_70px_rgba(35,24,14,0.10)]">
              <div className="space-y-4 text-lg leading-8 text-[#3e342a]">
                <p>✔ Acceso online al reto completo de 3 días</p>
                <p>✔ Acceso inmediato tras la inscripción</p>
                <p>✔ Acceso disponible durante 1 año</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-14 text-white md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionLabel>Tiempo limitado</SectionLabel>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
                Este acceso no estará abierto siempre.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/70">
                Puedes seguir dándole vueltas, o puedes empezar ahora a mirar lo que todavía no
                estabas viendo.
              </p>
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
