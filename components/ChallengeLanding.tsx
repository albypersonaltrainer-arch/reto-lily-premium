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
      <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-champagne/30 bg-champagne/10 text-xs uppercase tracking-[0.18em] text-champagne">
        {item.type}
      </div>
    );
  }

  if (mediaKind === "image") {
    return (
      <div className="mb-7 overflow-hidden rounded-[1.25rem] border border-champagne/20 bg-black/25 p-3">
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
      <div className="mb-7 overflow-hidden rounded-[1.25rem] border border-champagne/20 bg-black/35">
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
      <div className="mb-7 rounded-[1.25rem] border border-champagne/20 bg-champagne/5 p-5">
        <div className="mb-4 inline-flex rounded-full border border-champagne/30 bg-champagne/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-champagne">
          Audio
        </div>
        <audio
          src={mediaUrl}
          controls
          preload="metadata"
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-champagne/30 bg-champagne/10 text-xs uppercase tracking-[0.18em] text-champagne">
      {item.type}
    </div>
  );
}

export function ChallengeLanding({ copy }: { copy: ChallengeCopy }) {
  const [unlocked, setUnlocked] = useState(false);

  const accessUnlockedLabel =
    copy.locale === "es" ? "Acceso desbloqueado" : "Access unlocked";

  const postVideoLabel =
    copy.locale === "es" ? "Mensaje post-vídeo" : "Post-video message";

  const chooseContributionLabel =
    copy.locale === "es" ? "Elegir aportación" : "Choose contribution";

  const accessInfoLabel =
    copy.locale === "es"
      ? "100% online · acceso inmediato y de por vida"
      : "100% online · instant lifetime access";

  const privacyHref = `/${copy.locale}/legal/privacidad`;
  const termsHref = `/${copy.locale}/legal/terminos`;
  const landingHref = `/${copy.locale}/${copy.slug}`;

  const testimonials = copy.testimonials.items as TestimonialWithMedia[];

  return (
    <div className="invisible-pattern-shell">
      <div className="luxury-noise" />

      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-surface/55 backdrop-blur-2xl">
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
            className="btn-glow rounded bg-gold px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#3c2f00] transition hover:bg-champagne"
          >
            {copy.navCta}
          </a>
        </div>
      </header>

      <main>
        <section className="radial-pool flex min-h-screen items-center justify-center px-6 pb-20 pt-36 text-center md:pb-24">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="mx-auto flex justify-center">
              <Image
                src={copy.brandLogo}
                alt={copy.brand}
                width={260}
                height={260}
                className="h-40 w-40 object-contain opacity-95 md:h-56 md:w-56"
                priority
              />
            </div>

            {copy.hero.eyebrow ? (
              <p className="text-base font-black uppercase tracking-[0.38em] text-champagne md:text-xl">
                {copy.hero.eyebrow}
              </p>
            ) : null}

            <h1 className="font-serif text-5xl leading-[1.04] tracking-[-0.04em] text-linen md:text-7xl">
              {copy.hero.title}
            </h1>

            <h2 className="text-glow mx-auto max-w-3xl font-serif text-3xl leading-tight text-champagne md:text-5xl">
              {copy.hero.subtitle}
            </h2>

            {copy.hero.intro ? (
              <p className="mx-auto max-w-2xl text-lg font-light leading-8 text-muted md:text-xl">
                {copy.hero.intro}
              </p>
            ) : null}

            <div className="mx-auto inline-flex items-center justify-center rounded-full border border-champagne/35 bg-champagne/10 px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-champagne shadow-soft md:text-xs">
              {accessInfoLabel}
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 py-20 md:py-28">
          <div className="mx-auto flex max-w-content flex-col items-center text-center">
            <VideoGate
              url={copy.video.url}
              placeholderText={copy.video.placeholderText}
              lockedText={copy.video.locked}
              unlockLabel={copy.video.unlockLabel}
              unlockAfterSeconds={copy.video.unlockAfterSeconds}
              onUnlocked={() => setUnlocked(true)}
            />

            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
              {copy.video.helper}
            </p>
          </div>
        </section>

        <section className="radial-pool px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div
              className={`rounded-[2rem] border p-8 transition duration-700 md:p-14 ${
                unlocked
                  ? "translate-y-0 border-champagne/55 bg-gradient-to-br from-champagne/18 via-white/[0.07] to-champagne/8 opacity-100 shadow-glow"
                  : "translate-y-3 border-champagne/35 bg-gradient-to-br from-champagne/12 via-white/[0.05] to-black/10 opacity-95 shadow-soft"
              }`}
            >
              <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-champagne">
                {unlocked ? accessUnlockedLabel : postVideoLabel}
              </p>

              <h3 className="text-glow font-serif text-4xl leading-tight text-champagne md:text-5xl">
                {copy.unlock.title}
              </h3>

              <div className="mt-8 space-y-4 text-xl leading-9 text-linen">
                {copy.unlock.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <a
                href="#solicita-acceso"
                className="btn-glow mt-10 inline-flex rounded bg-gold px-10 py-5 text-xs font-black uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne"
              >
                {copy.unlock.cta}
              </a>

              <p className="mt-6 text-sm italic text-linen/80">
                {copy.unlock.note}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-content">
            <div className="glass-panel pattern-card grid gap-10 rounded-xl p-8 md:grid-cols-[0.75fr_1.25fr] md:p-12">
              <div className="flex items-center justify-center">
                <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-champagne/25 bg-champagne/5 p-8 shadow-soft md:h-72 md:w-72">
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
                <h2 className="font-serif text-5xl leading-tight text-linen md:text-6xl">
                  {copy.coach.name}
                </h2>

                <p className="mt-4 font-serif text-2xl leading-tight text-champagne">
                  {copy.coach.subtitle}
                </p>

                <p className="mt-6 text-lg leading-8 text-muted">
                  {copy.coach.text}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-content">
            <h2 className="text-center font-serif text-4xl text-linen md:text-6xl">
              {copy.learn.title}
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {copy.learn.items.map((item, index) => (
                <div
                  key={item}
                  className="glass-panel pattern-card rounded-xl p-8 md:p-10"
                >
                  <div className="mb-7 font-serif text-5xl text-champagne/80">
                    0{index + 1}
                  </div>
                  <p className="text-xl leading-9 text-linen">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {testimonials.length > 0 ? (
          <section className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-content text-center">
              <h2 className="font-serif text-4xl text-linen md:text-6xl">
                {copy.testimonials.title}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
                {copy.testimonials.text}
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {testimonials.map((item, index) => (
                  <article
                    key={`${item.name}-${index}`}
                    className="glass-panel rounded-xl p-8 text-left"
                  >
                    <TestimonialMedia item={item} />

                    <p className="text-lg leading-8 text-linen/90">
                      “{item.text}”
                    </p>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-muted">
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
            <h2 className="font-serif text-5xl leading-tight text-linen md:text-7xl">
              {copy.donation.title}
            </h2>

            <p className="text-glow mt-5 font-serif text-3xl text-champagne">
              {copy.donation.subtitle}
            </p>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
              {copy.donation.minimum}
            </p>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {copy.donation.options.map((option, index) => (
                <a
                  key={`${option.amount}-${index}`}
                  href="#solicita-acceso"
                  className={`glass-panel pattern-card group rounded-xl p-8 transition duration-500 hover:-translate-y-1 hover:border-champagne/50 hover:shadow-glow ${
                    index === 1 ? "border-champagne/45 shadow-glow" : ""
                  }`}
                >
                  <div className="font-serif text-5xl text-linen transition group-hover:text-champagne">
                    {option.amount}
                  </div>
                  <div className="mt-4 text-xs uppercase tracking-[0.24em] text-muted/80">
                    {option.label}
                  </div>
                  <div className="mt-7 text-[11px] font-bold uppercase tracking-[0.22em] text-champagne/80">
                    {chooseContributionLabel}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="radial-pool px-6 py-24 text-center md:py-32">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-5xl leading-tight text-linen md:text-7xl">
              {copy.final.title}
            </h2>

            <p className="mt-6 text-xl leading-9 text-muted">
              {copy.final.text}
            </p>

            <a
              href="#solicita-acceso"
              className="btn-glow mt-12 inline-flex rounded bg-gold px-14 py-7 text-base font-black uppercase tracking-[0.28em] text-[#3c2f00] transition hover:bg-champagne md:px-20 md:py-8 md:text-lg"
            >
              {copy.final.cta}
            </a>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-champagne">
                {copy.countdown.label}
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-linen md:text-6xl">
                {copy.countdown.title}
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted">
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
            <div className="glass-panel pattern-card rounded-xl p-8 text-center md:p-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_40px_rgba(37,211,102,0.35)]">
                <WhatsAppIcon />
              </div>

              <h2 className="font-serif text-4xl text-linen md:text-5xl">
                {copy.whatsapp.title}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
                {copy.whatsapp.text}
              </p>

              <a
                href={copy.whatsapp.url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded border border-[#25D366]/70 px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
              >
                {copy.whatsapp.cta}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-obsidian px-6 py-12">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 text-center md:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src={copy.brandLogo}
              alt={copy.brand}
              width={54}
              height={54}
              className="h-12 w-12 object-contain"
            />
            <div className="font-serif text-2xl text-champagne">
              {copy.brand}
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.22em] text-rose/70">
            {copy.footer.legal}
          </p>

          <nav className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.22em] text-muted/80">
            <a href={privacyHref} className="transition hover:text-champagne">
              {copy.footer.privacy}
            </a>
            <a href={termsHref} className="transition hover:text-champagne">
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
