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

/**
 * Color anterior guardado por seguridad para poder volver atrás rápido.
 * Si quieres recuperar el fondo oscuro anterior, este era el sistema visual base:
 * invisible-pattern-shell + luxury-noise + radial-pool + bg-surface/obsidian.
 *
 * Nuevo fondo premium claro:
 * - cálido
 * - beige
 * - no blanco puro
 * - más luminoso para mejorar lectura y sensación de claridad
 */
const LEGACY_VISUAL_SYSTEM =
  "invisible-pattern-shell / luxury-noise / radial-pool / bg-surface / bg-obsidian";
const NEW_PAGE_BACKGROUND = "#F4ECDF";

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

function TestimonialMedia({ item }: { item: TestimonialWithMedia }) {
  const mediaKind = item.mediaKind || "none";
  const mediaUrl = item.mediaUrl || "";

  if (!mediaUrl || mediaKind === "none") {
    return (
      <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#b78a3d]/35 bg-[#b78a3d]/10 text-xs uppercase tracking-[0.18em] text-[#8a6428]">
        {item.type}
      </div>
    );
  }

  if (mediaKind === "image") {
    return (
      <div className="mb-7 overflow-hidden rounded-[1.25rem] border border-[#b78a3d]/20 bg-white/55 p-3 shadow-[0_18px_50px_rgba(82,55,24,0.10)]">
        <img
          src={mediaUrl}
          alt={item.name}
          className="mx-auto max-h-[460px] w-full rounded-[1rem] object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  if (mediaKind === "video") {
    return (
      <div className="mb-7 overflow-hidden rounded-[1.25rem] border border-[#b78a3d]/20 bg-[#1d160f] shadow-[0_18px_50px_rgba(82,55,24,0.12)]">
        <video
          src={mediaUrl}
          controls
          preload="metadata"
          playsInline
          className="w-full bg-black"
        />
      </div>
    );
  }

  if (mediaKind === "audio") {
    return (
      <div className="mb-7 rounded-[1.25rem] border border-[#b78a3d]/20 bg-white/55 p-5 shadow-[0_18px_50px_rgba(82,55,24,0.10)]">
        <div className="mb-4 inline-flex rounded-full border border-[#b78a3d]/35 bg-[#b78a3d]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6428]">
          Audio
        </div>
        <audio src={mediaUrl} controls preload="metadata" className="w-full" />
      </div>
    );
  }

  return (
    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#b78a3d]/35 bg-[#b78a3d]/10 text-xs uppercase tracking-[0.18em] text-[#8a6428]">
      {item.type}
    </div>
  );
}

function ObserverSection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-[#b78a3d]/25 bg-[#fffaf1]/80 p-8 shadow-[0_28px_90px_rgba(82,55,24,0.14)] backdrop-blur md:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d8b66a]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#6f3d2e]/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#9a6f2d]">
              Antes de empezar
            </p>

            <div className="mt-8 space-y-6 text-xl leading-9 text-[#34251a] md:text-2xl md:leading-10">
              <p>
                La mayoría de las personas cree que su problema es que todavía
                no ha conseguido lo que quiere.
              </p>

              <div className="mx-auto grid max-w-2xl gap-3 py-2 text-lg font-semibold text-[#6f4b23] md:grid-cols-2 md:text-xl">
                <p>Más dinero.</p>
                <p>Más oportunidades.</p>
                <p>Más libertad.</p>
                <p>Más resultados.</p>
              </div>

              <p>
                Pero muy pocas se hacen una pregunta mucho más incómoda:
              </p>
            </div>

            <div className="my-10 space-y-5 rounded-[1.6rem] border border-[#b78a3d]/25 bg-white/55 p-7 shadow-[0_18px_60px_rgba(82,55,24,0.10)] md:p-10">
              <p className="font-serif text-3xl leading-tight text-[#6f3d2e] md:text-5xl">
                ¿Y si el problema no fuera lo que está pasando en tu vida?
              </p>
              <p className="font-serif text-3xl leading-tight text-[#6f3d2e] md:text-5xl">
                ¿Y si el problema fuera la persona que está observando lo que
                pasa?
              </p>
            </div>

            <div className="space-y-7 text-xl leading-9 text-[#34251a] md:text-2xl md:leading-10">
              <p>
                Porque dos personas pueden vivir exactamente la misma situación
                y crear experiencias completamente distintas.
              </p>

              <div className="mx-auto grid max-w-3xl gap-4 text-lg font-semibold text-[#5b3a24] md:grid-cols-2 md:text-xl">
                <div className="rounded-2xl border border-[#b78a3d]/20 bg-white/45 p-5">
                  Una ve problemas.
                </div>
                <div className="rounded-2xl border border-[#b78a3d]/20 bg-white/45 p-5">
                  La otra ve oportunidades.
                </div>
                <div className="rounded-2xl border border-[#b78a3d]/20 bg-white/45 p-5">
                  Una ve límites.
                </div>
                <div className="rounded-2xl border border-[#b78a3d]/20 bg-white/45 p-5">
                  La otra ve posibilidades.
                </div>
                <div className="rounded-2xl border border-[#b78a3d]/20 bg-white/45 p-5">
                  Una se contrae.
                </div>
                <div className="rounded-2xl border border-[#b78a3d]/20 bg-white/45 p-5">
                  La otra actúa.
                </div>
              </div>

              <p>Y desde ahí crean resultados diferentes.</p>

              <p>
                Por eso este reto no trata de cambiar tu realidad.
              </p>

              <p className="font-serif text-3xl leading-tight text-[#8a6428] md:text-5xl">
                Trata de ayudarte a ver quién está creando esa realidad.
              </p>

              <p>Porque mientras el observador siga siendo el mismo...</p>

              <p className="mx-auto max-w-3xl rounded-[1.6rem] border border-[#6f3d2e]/20 bg-[#6f3d2e]/10 p-7 font-serif text-3xl leading-tight text-[#5a2d22] md:p-9 md:text-5xl">
                la realidad podrá cambiar de forma, pero tenderá a parecerse una
                y otra vez a la anterior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChallengeLanding({ copy }: { copy: ChallengeCopy }) {
  const [unlocked, setUnlocked] = useState(false);

  const accessUnlockedLabel =
    copy.locale === "es" ? "Acceso desbloqueado" : "Access unlocked";

  const postVideoLabel =
    copy.locale === "es" ? "Mensaje post-vídeo" : "Post-video message";

  const accessInfoLabel =
    copy.locale === "es"
      ? "100% online · acceso inmediato y de por vida"
      : "100% online · instant lifetime access";

  const fixedPriceLabel =
    copy.locale === "es" ? "Precio único" : "Single price";

  const fixedPriceText =
    copy.locale === "es"
      ? "Acceso completo al reto de 3 días. Sin niveles, sin aportaciones variables y sin confusión."
      : "Full access to the 3-day challenge. No tiers, no variable contributions and no confusion.";

  const privacyHref = `/${copy.locale}/legal/privacidad`;
  const termsHref = `/${copy.locale}/legal/terminos`;
  const landingHref = `/${copy.locale}/${copy.slug}`;

  const testimonials = copy.testimonials.items as TestimonialWithMedia[];

  return (
    <div
      data-legacy-visual-system={LEGACY_VISUAL_SYSTEM}
      className="min-h-screen overflow-hidden text-[#34251a]"
      style={{ backgroundColor: NEW_PAGE_BACKGROUND }}
    >
      <div className="pointer-events-none fixed inset-0 z-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,182,106,0.30),transparent_34%),radial-gradient(circle_at_80%_15%,rgba(111,61,46,0.12),transparent_30%),linear-gradient(180deg,#F8F1E6_0%,#F4ECDF_44%,#EFE0CB_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(92,62,31,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(92,62,31,0.035)_1px,transparent_1px)] bg-[size:54px_54px]" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-[#6f3d2e]/10 bg-[#fffaf1]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3 md:px-6 md:py-4">
          <a
            href={landingHref}
            aria-label={copy.brand}
            className="flex items-center gap-3"
          >
            <Image
              src={copy.brandLogo}
              alt={copy.brand}
              width={64}
              height={64}
              className="h-12 w-12 rounded-full object-contain md:h-14 md:w-14"
              priority
            />
          </a>

          <a
            href="#solicita-acceso"
            className="rounded bg-[#b78a3d] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_35px_rgba(183,138,61,0.28)] transition hover:bg-[#9a6f2d]"
          >
            {copy.navCta}
          </a>
        </div>
      </header>

      <main className="relative z-10">
        <section className="flex min-h-screen items-center justify-center px-6 pb-20 pt-36 text-center md:pb-24">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="mx-auto flex justify-center">
              <Image
                src={copy.brandLogo}
                alt={copy.brand}
                width={260}
                height={260}
                className="h-40 w-40 object-contain opacity-95 drop-shadow-[0_24px_50px_rgba(82,55,24,0.22)] md:h-56 md:w-56"
                priority
              />
            </div>

            {copy.hero.eyebrow ? (
              <p className="text-base font-black uppercase tracking-[0.38em] text-[#9a6f2d] md:text-xl">
                {copy.hero.eyebrow}
              </p>
            ) : null}

            <h1 className="font-serif text-5xl leading-[1.04] tracking-[-0.04em] text-[#2d2118] md:text-7xl">
              {copy.hero.title}
            </h1>

            <h2 className="mx-auto max-w-3xl font-serif text-3xl leading-tight text-[#8a6428] md:text-5xl">
              {copy.hero.subtitle}
            </h2>

            {copy.hero.intro ? (
              <p className="mx-auto max-w-2xl text-lg font-light leading-8 text-[#6c5a49] md:text-xl">
                {copy.hero.intro}
              </p>
            ) : null}

            <div className="mx-auto inline-flex items-center justify-center rounded-full border border-[#b78a3d]/35 bg-white/50 px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#8a6428] shadow-[0_14px_40px_rgba(82,55,24,0.10)] md:text-xs">
              {accessInfoLabel}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto flex max-w-content flex-col items-center text-center">
            <VideoGate
              url={copy.video.url}
              placeholderText={copy.video.placeholderText}
              lockedText={copy.video.locked}
              unlockLabel={copy.video.unlockLabel}
              unlockAfterSeconds={copy.video.unlockAfterSeconds}
              onUnlocked={() => setUnlocked(true)}
            />

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#6c5a49]">
              {copy.video.helper}
            </p>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div
              className={`rounded-[2rem] border p-8 transition duration-700 md:p-14 ${
                unlocked
                  ? "translate-y-0 border-[#b78a3d]/55 bg-[#fffaf1]/85 opacity-100 shadow-[0_28px_90px_rgba(82,55,24,0.18)]"
                  : "translate-y-3 border-[#b78a3d]/30 bg-[#fffaf1]/65 opacity-95 shadow-[0_22px_70px_rgba(82,55,24,0.12)]"
              }`}
            >
              <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-[#9a6f2d]">
                {unlocked ? accessUnlockedLabel : postVideoLabel}
              </p>

              <h3 className="font-serif text-4xl leading-tight text-[#8a6428] md:text-5xl">
                {copy.unlock.title}
              </h3>

              <div className="mt-8 space-y-4 text-xl leading-9 text-[#34251a]">
                {copy.unlock.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <a
                href="#solicita-acceso"
                className="mt-10 inline-flex rounded bg-[#b78a3d] px-10 py-5 text-xs font-black uppercase tracking-[0.24em] text-white shadow-[0_16px_45px_rgba(183,138,61,0.28)] transition hover:bg-[#9a6f2d]"
              >
                {copy.unlock.cta}
              </a>

              <p className="mt-6 text-sm italic text-[#6c5a49]">
                {copy.unlock.note}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-content">
            <div className="grid gap-10 rounded-[2rem] border border-[#b78a3d]/20 bg-[#fffaf1]/75 p-8 shadow-[0_28px_90px_rgba(82,55,24,0.13)] backdrop-blur md:grid-cols-[0.75fr_1.25fr] md:p-12">
              <div className="flex items-center justify-center">
                <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[#b78a3d]/25 bg-white/45 p-8 shadow-[0_18px_60px_rgba(82,55,24,0.12)] md:h-72 md:w-72">
                  <Image
                    src={copy.coach.image}
                    alt={copy.coach.name}
                    width={260}
                    height={260}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center text-center md:text-left">
                <h2 className="font-serif text-5xl leading-tight text-[#2d2118] md:text-6xl">
                  {copy.coach.name}
                </h2>

                <p className="mt-4 font-serif text-2xl leading-tight text-[#8a6428]">
                  {copy.coach.subtitle}
                </p>

                <p className="mt-6 text-lg leading-8 text-[#6c5a49]">
                  {copy.coach.text}
                </p>
              </div>
            </div>
          </div>
        </section>

        <ObserverSection />

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-content">
            <h2 className="text-center font-serif text-4xl text-[#2d2118] md:text-6xl">
              {copy.learn.title}
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {copy.learn.items.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.6rem] border border-[#b78a3d]/20 bg-[#fffaf1]/75 p-8 shadow-[0_22px_70px_rgba(82,55,24,0.12)] backdrop-blur md:p-10"
                >
                  <div className="mb-7 font-serif text-5xl text-[#b78a3d]">
                    0{index + 1}
                  </div>
                  <p className="text-xl leading-9 text-[#34251a]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {testimonials.length > 0 ? (
          <section className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-content text-center">
              <h2 className="font-serif text-4xl text-[#2d2118] md:text-6xl">
                {copy.testimonials.title}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg text-[#6c5a49]">
                {copy.testimonials.text}
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {testimonials.map((item, index) => (
                  <article
                    key={`${item.name}-${index}`}
                    className="rounded-[1.6rem] border border-[#b78a3d]/20 bg-[#fffaf1]/75 p-8 text-left shadow-[0_22px_70px_rgba(82,55,24,0.12)] backdrop-blur"
                  >
                    <TestimonialMedia item={item} />

                    <p className="text-lg leading-8 text-[#34251a]">
                      “{item.text}”
                    </p>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-[#8a7a68]">
                      {item.name}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-content text-center">
            <h2 className="font-serif text-5xl leading-tight text-[#2d2118] md:text-7xl">
              {copy.donation.title}
            </h2>

            <p className="mt-5 font-serif text-3xl text-[#8a6428]">
              {copy.donation.subtitle}
            </p>

            <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-[#b78a3d]/25 bg-[#fffaf1]/85 p-8 shadow-[0_28px_90px_rgba(82,55,24,0.14)] backdrop-blur md:p-12">
              <div className="text-xs font-black uppercase tracking-[0.3em] text-[#9a6f2d]">
                {fixedPriceLabel}
              </div>

              <div className="mt-5 font-serif text-7xl leading-none text-[#2d2118] md:text-8xl">
                {SINGLE_PRICE}
              </div>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#6c5a49]">
                {fixedPriceText}
              </p>

              <a
                href="#solicita-acceso"
                className="mt-9 inline-flex rounded bg-[#b78a3d] px-10 py-5 text-xs font-black uppercase tracking-[0.24em] text-white shadow-[0_16px_45px_rgba(183,138,61,0.28)] transition hover:bg-[#9a6f2d]"
              >
                {copy.final.cta}
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 text-center md:py-32">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-5xl leading-tight text-[#2d2118] md:text-7xl">
              {copy.final.title}
            </h2>

            <p className="mt-6 text-xl leading-9 text-[#6c5a49]">
              {copy.final.text}
            </p>

            <a
              href="#solicita-acceso"
              className="mt-12 inline-flex rounded bg-[#b78a3d] px-14 py-7 text-base font-black uppercase tracking-[0.28em] text-white shadow-[0_18px_55px_rgba(183,138,61,0.30)] transition hover:bg-[#9a6f2d] md:px-20 md:py-8 md:text-lg"
            >
              {copy.final.cta}
            </a>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#9a6f2d]">
                {copy.countdown.label}
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-[#2d2118] md:text-6xl">
                {copy.countdown.title}
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#6c5a49]">
                {copy.countdown.text}
              </p>
            </div>

            <Countdown
              deadlineIso={copy.countdown.deadlineIso}
              urgencyMinutes={copy.countdown.urgencyMinutes}
            />
          </div>
        </section>

        <section
          id="solicita-acceso"
          className="scroll-mt-28 px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <LeadForm copy={copy} />
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[2rem] border border-[#b78a3d]/20 bg-[#fffaf1]/80 p-8 text-center shadow-[0_28px_90px_rgba(82,55,24,0.14)] backdrop-blur md:p-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_40px_rgba(37,211,102,0.35)]">
                <WhatsAppIcon />
              </div>

              <h2 className="font-serif text-4xl text-[#2d2118] md:text-5xl">
                {copy.whatsapp.title}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6c5a49]">
                {copy.whatsapp.text}
              </p>

              <a
                href={copy.whatsapp.url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded border border-[#25D366]/70 px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-[#178f45] transition hover:bg-[#25D366] hover:text-white"
              >
                {copy.whatsapp.cta}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#6f3d2e]/10 bg-[#2d2118] px-6 py-12">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 text-center md:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src={copy.brandLogo}
              alt={copy.brand}
              width={54}
              height={54}
              className="h-12 w-12 object-contain"
            />
            <div className="font-serif text-2xl text-[#ead7ae]">
              {copy.brand}
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.22em] text-[#ead7ae]/70">
            {copy.footer.legal}
          </p>

          <nav className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.22em] text-[#ead7ae]/80">
            <a href={privacyHref} className="transition hover:text-white">
              {copy.footer.privacy}
            </a>
            <a href={termsHref} className="transition hover:text-white">
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
