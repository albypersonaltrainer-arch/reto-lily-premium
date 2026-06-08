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

const SINGLE_PRICE = "$27";
const BRAND_LOGO_SRC = "/stamp_negro.png";

const ACCESS_BENEFITS = [
  "Acceso online al reto completo de 3 días",
  "Acceso inmediato tras la inscripción",
  "Acceso disponible durante 1 año",
];

const DAY_PLAN = [
  {
    day: "Día 1",
    title: "El problema no es tu realidad, es el observador",
    text: "Descubres por qué puedes estar creando la misma realidad aunque creas que estás intentando cambiarla.",
  },
  {
    day: "Día 2",
    title: "Tu mente no está viendo la realidad, está viendo lo que espera encontrar",
    text: "Identificas filtros, conclusiones e interpretaciones que condicionan tus decisiones y tus resultados.",
  },
  {
    day: "Día 3",
    title: "No necesitas esforzarte más, necesitas elegir desde otro lugar",
    text: "Empiezas a relacionarte con tu realidad desde una nueva comprensión: más consciente, más clara y menos automática.",
  },
];

const NOT_THIS = [
  "No es un curso de manifestación tradicional.",
  "No es una colección de técnicas mágicas.",
  "No es un entrenamiento financiero.",
  "No es otra lista de afirmaciones para repetir.",
];

const YES_THIS = [
  "Una experiencia de observación y toma de conciencia.",
  "Un reto para ver desde dónde estás creando realmente.",
  "Una puerta de entrada para dejar de repetir resultados parecidos.",
  "Un primer paso hacia una forma más consciente de elegir.",
];

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-9 w-9"
      fill="currentColor"
    >
      <path d="M16.02 3.2C8.96 3.2 3.22 8.86 3.22 15.81c0 2.23.6 4.4 1.74 6.31L3.1 28.8l6.93-1.8a12.97 12.97 0 0 0 5.99 1.5c7.06 0 12.8-5.65 12.8-12.6S23.08 3.2 16.02 3.2Zm0 23.15c-1.9 0-3.76-.5-5.39-1.45l-.39-.23-4.12 1.07 1.1-3.9-.26-.4a10.31 10.31 0 0 1-1.6-5.53c0-5.77 4.78-10.46 10.66-10.46 5.87 0 10.65 4.69 10.65 10.46 0 5.76-4.78 10.44-10.65 10.44Zm5.84-7.82c-.32-.16-1.89-.92-2.18-1.02-.3-.1-.51-.16-.72.16-.21.31-.82 1.02-1.01 1.23-.18.2-.37.23-.69.08-.32-.16-1.34-.49-2.56-1.55-.95-.83-1.59-1.85-1.78-2.16-.18-.32-.02-.49.14-.64.14-.14.32-.36.48-.54.16-.18.21-.31.32-.52.1-.2.05-.39-.03-.54-.08-.16-.72-1.7-.99-2.33-.26-.62-.52-.53-.72-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59s1.13 3.01 1.29 3.22c.16.2 2.23 3.35 5.4 4.7.75.32 1.34.51 1.8.65.76.24 1.44.21 1.98.13.6-.09 1.89-.76 2.16-1.49.27-.73.27-1.35.19-1.49-.08-.13-.29-.21-.61-.36Z" />
    </svg>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b78a3d]">
      {children}
    </p>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-[#c69a4a] px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#18130e] shadow-[0_18px_55px_rgba(198,154,74,0.35)] transition hover:-translate-y-0.5 hover:bg-[#e2bd6d] md:px-10 md:py-5"
    >
      {children}
    </a>
  );
}

function TestimonialMedia({ item }: { item: TestimonialWithMedia }) {
  const mediaKind = item.mediaKind || "none";
  const mediaUrl = item.mediaUrl || "";

  if (!mediaUrl || mediaKind === "none") {
    return (
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#c69a4a]/35 bg-[#c69a4a]/10 text-[10px] font-black uppercase tracking-[0.18em] text-[#e8c985]">
        {item.type}
      </div>
    );
  }

  if (mediaKind === "image") {
    return (
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#c69a4a]/20 bg-black/35 p-3">
        <img
          src={mediaUrl}
          alt={item.name}
          className="mx-auto max-h-[440px] w-full rounded-xl object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  if (mediaKind === "video") {
    return (
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#c69a4a]/20 bg-black/60">
        <video src={mediaUrl} controls preload="metadata" playsInline className="w-full bg-black" />
      </div>
    );
  }

  if (mediaKind === "audio") {
    return (
      <div className="mb-6 rounded-2xl border border-[#c69a4a]/20 bg-[#c69a4a]/10 p-5">
        <div className="mb-4 inline-flex rounded-full border border-[#c69a4a]/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#e8c985]">
          Audio
        </div>
        <audio src={mediaUrl} controls preload="metadata" className="w-full" />
      </div>
    );
  }

  return null;
}

export function ChallengeLanding({ copy }: { copy: ChallengeCopy }) {
  const [unlocked, setUnlocked] = useState(false);

  const privacyHref = `/${copy.locale}/legal/privacidad`;
  const termsHref = `/${copy.locale}/legal/terminos`;
  const landingHref = `/${copy.locale}/${copy.slug}`;
  const testimonials = copy.testimonials.items as TestimonialWithMedia[];

  return (
    <div className="min-h-screen overflow-hidden bg-[#14110d] text-[#f8efe0]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(198,154,74,0.22),transparent_34%),radial-gradient(circle_at_84%_12%,rgba(116,61,43,0.22),transparent_32%),linear-gradient(180deg,#19140f_0%,#14110d_38%,#efe3d0_38%,#f4eadc_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#14110d]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3 md:px-6 md:py-4">
          <a href={landingHref} aria-label={copy.brand} className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7eddf] p-1.5 md:h-14 md:w-14">
              <Image
                src={BRAND_LOGO_SRC}
                alt={copy.brand}
                width={64}
                height={64}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <span className="hidden font-serif text-xl text-[#f8efe0] sm:block">
              Lily Camarena
            </span>
          </a>

          <a
            href="#solicita-acceso"
            className="rounded-full bg-[#c69a4a] px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#18130e] transition hover:bg-[#e2bd6d]"
          >
            Entrar por {SINGLE_PRICE}
          </a>
        </div>
      </header>

      <main className="relative z-10">
        <section className="px-6 pb-14 pt-32 md:pb-20 md:pt-40">
          <div className="mx-auto grid max-w-content items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-7 inline-flex rounded-full border border-[#c69a4a]/35 bg-[#c69a4a]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#e8c985]">
                Reto online de 3 días · Acceso durante 1 año
              </div>

              <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.045em] text-[#fff8ec] md:text-7xl lg:text-8xl">
                No estás creando desde donde crees que estás creando.
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#dccbb2] md:text-2xl md:leading-10">
                Si hacer más fuera la solución, ya habrías cambiado. Este reto te ayuda a ver el filtro desde el que sigues repitiendo resultados parecidos en dinero, oportunidades y abundancia.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <PrimaryButton href="#solicita-acceso">Acceder al reto</PrimaryButton>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm leading-6 text-[#dccbb2]">
                  Precio único <span className="font-serif text-2xl text-[#e8c985]">{SINGLE_PRICE}</span> · 100% online · acceso inmediato
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-[#c69a4a]/16 blur-3xl" />
              <div className="relative rounded-[2.2rem] border border-[#c69a4a]/22 bg-[#f7eddf] p-8 text-center text-[#1f1710] shadow-[0_32px_120px_rgba(0,0,0,0.42)] md:p-10">
                <Image
                  src={BRAND_LOGO_SRC}
                  alt={copy.brand}
                  width={260}
                  height={260}
                  className="mx-auto h-44 w-44 object-contain md:h-56 md:w-56"
                  priority
                />
                <p className="mt-6 font-serif text-3xl leading-tight md:text-4xl">
                  El Código de la Abundancia
                </p>
                <p className="mt-4 text-base leading-7 text-[#5f4c38]">
                  Una experiencia para descubrir por qué sigues obteniendo los mismos resultados aunque lleves tiempo intentando cambiar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#c69a4a]/22 bg-[#211910]/85 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] md:p-8">
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
          <div className="mx-auto grid max-w-content gap-6 md:grid-cols-[0.88fr_1.12fr]">
            <div className="rounded-[2rem] border border-[#c69a4a]/18 bg-[#f8efe0] p-8 text-[#1f1710] shadow-[0_24px_90px_rgba(0,0,0,0.12)] md:p-10">
              <SectionEyebrow>El problema real</SectionEyebrow>
              <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
                No necesitas otra técnica. Necesitas ver desde dónde estás mirando.
              </h2>
            </div>

            <div className="rounded-[2rem] border border-[#c69a4a]/18 bg-[#fff8ec] p-8 text-lg leading-8 text-[#3b2c1f] shadow-[0_24px_90px_rgba(0,0,0,0.10)] md:p-10 md:text-xl md:leading-9">
              <p>
                Muchas personas llevan años aprendiendo sobre manifestación, mentalidad, abundancia, energía y desarrollo personal. Y aun así, cuando miran sus resultados, sienten que algo se repite.
              </p>
              <p className="mt-6 font-serif text-3xl leading-tight text-[#7a4a2e] md:text-4xl">
                La pregunta no es “¿qué más tengo que hacer?”. La pregunta es: “¿desde dónde estoy creando esto?”.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto max-w-content rounded-[2.2rem] border border-[#c69a4a]/20 bg-[#18130e] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.34)] md:p-12">
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <SectionEyebrow>El observador</SectionEyebrow>
                <h2 className="mt-5 font-serif text-4xl leading-tight text-[#fff8ec] md:text-6xl">
                  Dos personas pueden vivir lo mismo y crear realidades completamente distintas.
                </h2>
              </div>
              <div className="space-y-5 text-lg leading-8 text-[#dccbb2] md:text-xl md:leading-9">
                <p>Una ve problemas. La otra ve oportunidades.</p>
                <p>Una ve límites. La otra ve posibilidades.</p>
                <p>Una se contrae. La otra actúa.</p>
                <p className="rounded-2xl border border-[#c69a4a]/25 bg-[#c69a4a]/10 p-6 font-serif text-3xl leading-tight text-[#e8c985] md:text-4xl">
                  Por eso este reto no trata de cambiar tu realidad. Trata de ayudarte a ver quién está creando esa realidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto max-w-content">
            <div className="mb-10 max-w-3xl">
              <SectionEyebrow>Qué pasa dentro</SectionEyebrow>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-[#1f1710] md:text-6xl">
                Tres días para dejar de mirar tu realidad en automático.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {DAY_PLAN.map((item) => (
                <article
                  key={item.day}
                  className="rounded-[1.8rem] border border-[#c69a4a]/22 bg-[#fff8ec] p-7 text-[#1f1710] shadow-[0_22px_80px_rgba(0,0,0,0.10)]"
                >
                  <div className="mb-6 inline-flex rounded-full bg-[#18130e] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#e8c985]">
                    {item.day}
                  </div>
                  <h3 className="font-serif text-3xl leading-tight text-[#1f1710]">
                    {item.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-[#5f4c38]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto grid max-w-content gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] border border-[#7a4a2e]/18 bg-[#f8efe0] p-8 text-[#1f1710] shadow-[0_22px_80px_rgba(0,0,0,0.10)] md:p-10">
              <h2 className="font-serif text-4xl">Lo que no es</h2>
              <div className="mt-7 space-y-4">
                {NOT_THIS.map((item) => (
                  <p key={item} className="rounded-2xl border border-[#7a4a2e]/15 bg-white/60 p-4 text-base leading-7 text-[#5a3b2b]">
                    ✕ {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-[#c69a4a]/22 bg-[#18130e] p-8 text-[#fff8ec] shadow-[0_28px_100px_rgba(0,0,0,0.28)] md:p-10">
              <h2 className="font-serif text-4xl">Lo que sí es</h2>
              <div className="mt-7 space-y-4">
                {YES_THIS.map((item) => (
                  <p key={item} className="rounded-2xl border border-[#c69a4a]/22 bg-[#c69a4a]/10 p-4 text-base leading-7 text-[#dccbb2]">
                    ✓ {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto grid max-w-content gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
            <div className="rounded-[2rem] border border-[#c69a4a]/22 bg-[#fff8ec] p-8 text-[#1f1710] shadow-[0_24px_90px_rgba(0,0,0,0.11)] md:p-10">
              <SectionEyebrow>Con Lily Camarena</SectionEyebrow>
              <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
                Profundidad sin espiritualidad vacía. Claridad sin promesas exageradas.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#5f4c38]">
                {copy.coach.text || "Lily acompaña procesos de transformación desde una mirada directa, profunda y práctica: ayudarte a ver el patrón que está operando debajo de tus decisiones."}
              </p>
            </div>
            <div className="flex items-center justify-center rounded-[2rem] border border-[#c69a4a]/22 bg-[#f8efe0] p-10 shadow-[0_24px_90px_rgba(0,0,0,0.11)]">
              <Image
                src={BRAND_LOGO_SRC}
                alt={copy.brand}
                width={260}
                height={260}
                className="h-56 w-56 object-contain md:h-72 md:w-72"
              />
            </div>
          </div>
        </section>

        {testimonials.length > 0 ? (
          <section className="px-6 py-10 md:py-16">
            <div className="mx-auto max-w-content">
              <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <SectionEyebrow>Casos de éxito</SectionEyebrow>
                  <h2 className="mt-5 font-serif text-4xl leading-tight text-[#1f1710] md:text-6xl">
                    Personas que ya empezaron a verlo diferente.
                  </h2>
                </div>
                <p className="max-w-xl text-lg leading-8 text-[#5f4c38]">
                  {copy.testimonials.text}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {testimonials.map((item, index) => (
                  <article
                    key={`${item.name}-${index}`}
                    className="rounded-[1.8rem] border border-[#c69a4a]/22 bg-[#18130e] p-7 text-left shadow-[0_24px_90px_rgba(0,0,0,0.22)]"
                  >
                    <TestimonialMedia item={item} />
                    <p className="text-lg leading-8 text-[#f8efe0]">“{item.text}”</p>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#e8c985]">
                      {item.name}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto grid max-w-content gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="rounded-[2rem] border border-[#c69a4a]/22 bg-[#18130e] p-8 text-[#fff8ec] shadow-[0_28px_100px_rgba(0,0,0,0.28)] md:p-10">
              <SectionEyebrow>Acceso al reto</SectionEyebrow>
              <div className="mt-6 font-serif text-7xl leading-none text-[#e8c985] md:text-8xl">
                {SINGLE_PRICE}
              </div>
              <p className="mt-5 text-lg leading-8 text-[#dccbb2]">
                Precio único para entrar al reto online de 3 días y empezar a entender por qué sigues obteniendo resultados parecidos.
              </p>
              <div className="mt-7 space-y-3">
                {ACCESS_BENEFITS.map((item) => (
                  <p key={item} className="rounded-2xl border border-[#c69a4a]/22 bg-[#c69a4a]/10 p-4 text-sm font-semibold leading-6 text-[#f8efe0]">
                    ✓ {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#c69a4a]/22 bg-[#fff8ec] p-8 text-[#1f1710] shadow-[0_24px_90px_rgba(0,0,0,0.11)] md:p-10">
              <h2 className="font-serif text-4xl leading-tight md:text-6xl">
                No tienes que resolver toda tu vida hoy. Solo necesitas ver lo que todavía no estás viendo.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#5f4c38]">
                El reto no intenta darte más información. Busca darte una comprensión diferente para que puedas observar tus decisiones, tus filtros y tu forma de crear resultados.
              </p>
              <div className="mt-8">
                <PrimaryButton href="#solicita-acceso">Solicitar acceso</PrimaryButton>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto grid max-w-content items-center gap-8 rounded-[2rem] border border-[#c69a4a]/22 bg-[#18130e] p-8 shadow-[0_28px_100px_rgba(0,0,0,0.25)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div>
              <SectionEyebrow>{copy.countdown.label}</SectionEyebrow>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-[#fff8ec] md:text-6xl">
                {copy.countdown.title}
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#dccbb2]">
                {copy.countdown.text}
              </p>
            </div>
            <Countdown
              deadlineIso={copy.countdown.deadlineIso}
              urgencyMinutes={copy.countdown.urgencyMinutes}
            />
          </div>
        </section>

        <section id="solicita-acceso" className="scroll-mt-28 px-6 py-10 md:py-16">
          <div className="mx-auto max-w-4xl">
            <LeadForm copy={copy} />
          </div>
        </section>

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#c69a4a]/22 bg-[#fff8ec] p-8 text-center text-[#1f1710] shadow-[0_24px_90px_rgba(0,0,0,0.11)] md:p-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_40px_rgba(37,211,102,0.35)]">
              <WhatsAppIcon />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl">{copy.whatsapp.title}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5f4c38]">
              {copy.whatsapp.text}
            </p>
            <a
              href={copy.whatsapp.url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full border border-[#25D366]/70 px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#178f45] transition hover:bg-[#25D366] hover:text-white"
            >
              {copy.whatsapp.cta}
            </a>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[#14110d] px-6 py-10">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 text-center md:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7eddf] p-1.5">
              <Image
                src={BRAND_LOGO_SRC}
                alt={copy.brand}
                width={54}
                height={54}
                className="h-full w-full object-contain"
              />
            </span>
            <div className="font-serif text-2xl text-[#f8efe0]">{copy.brand}</div>
          </div>

          <p className="text-xs uppercase tracking-[0.22em] text-[#dccbb2]/70">
            {copy.footer.legal}
          </p>

          <nav className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.22em] text-[#dccbb2]/80">
            <a href={privacyHref} className="transition hover:text-[#e8c985]">
              {copy.footer.privacy}
            </a>
            <a href={termsHref} className="transition hover:text-[#e8c985]">
              {copy.footer.terms}
            </a>
            <a
              href={copy.whatsapp.url}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#25D366]"
            >
              {copy.footer.contact}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
