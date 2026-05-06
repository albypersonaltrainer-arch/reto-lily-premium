"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChallengeCopy } from "@/config/challenge";
import { Countdown } from "@/components/Countdown";
import { LeadForm } from "@/components/LeadForm";
import { VideoGate } from "@/components/VideoGate";

export function ChallengeLanding({ copy }: { copy: ChallengeCopy }) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="invisible-pattern-shell">
      <div className="luxury-noise" />

      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-surface/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3 md:px-6 md:py-4">
          <a href={`/${copy.locale}/${copy.slug}`} className="flex items-center gap-3">
            <Image
              src={copy.brandLogo}
              alt={copy.brand}
              width={64}
              height={64}
              className="h-12 w-12 rounded-full object-contain md:h-14 md:w-14"
              priority
            />
            <span className="hidden font-serif text-2xl tracking-tight text-champagne sm:block">
              {copy.brand}
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href={copy.oppositeLocalePath}
              className="text-xs font-bold uppercase tracking-[0.28em] text-champagne transition hover:text-linen"
            >
              ES / EN
            </a>
          </nav>

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
                width={180}
                height={180}
                className="h-28 w-28 object-contain opacity-95 md:h-36 md:w-36"
                priority
              />
            </div>

            <p className="text-base font-black uppercase tracking-[0.38em] text-champagne md:text-xl">
              {copy.hero.eyebrow}
            </p>

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
              className={`glass-panel pattern-card rounded-xl border-champagne/30 p-8 transition duration-700 md:p-14 ${
                unlocked
                  ? "translate-y-0 opacity-100 shadow-glow"
                  : "translate-y-3 opacity-55"
              }`}
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-champagne">
                {unlocked ? "Acceso desbloqueado" : "Mensaje post-vídeo"}
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

              <p className="mt-6 text-sm italic text-linen/75">
                {copy.unlock.note}
              </p>
            </div>
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
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-champagne">
                  {copy.coach.title}
                </p>

                <h2 className="mt-5 font-serif text-5xl leading-tight text-linen md:text-6xl">
                  {copy.coach.name}
                </h2>

                <p className="mt-4 font-serif text-2xl text-champagne">
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

            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {copy.donation.options.map((option) => (
                <a
                  key={option.amount}
                  href={copy.donation.paymentMethods.sumup}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-panel pattern-card group rounded-xl p-8 transition duration-500 hover:-translate-y-1 hover:border-champagne/50 hover:shadow-glow"
                >
                  <div className="font-serif text-5xl text-linen transition group-hover:text-champagne">
                    {option.amount}
                  </div>
                  <div className="mt-4 text-xs uppercase tracking-[0.24em] text-muted/80">
                    {option.label}
                  </div>
                  <div className="mt-7 text-[11px] font-bold uppercase tracking-[0.22em] text-champagne/80">
                    Elegir aportación
                  </div>
                </a>
              ))}
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
                  <p className="text-xl leading-9 text-linen">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="solicita-acceso" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-champagne">
                Acceso al reto
              </p>
              <h2 className="mt-5 font-serif text-5xl leading-tight text-linen md:text-7xl">
                {copy.form.title}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
                {copy.form.text}
              </p>
            </div>

            <LeadForm copy={copy} />
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-content text-center">
            <h2 className="font-serif text-4xl text-linen md:text-6xl">
              {copy.testimonials.title}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              {copy.testimonials.text}
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {copy.testimonials.items.map((item) => (
                <article
                  key={item.name}
                  className="glass-panel rounded-xl p-8 text-left"
                >
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-champagne/30 bg-champagne/10 text-xs uppercase tracking-[0.18em] text-champagne">
                    {item.type}
                  </div>
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

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="glass-panel pattern-card rounded-xl p-8 text-center md:p-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-champagne/30 bg-champagne/10 text-3xl">
                ☎
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
                className="mt-8 inline-flex rounded border border-champagne/60 px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-champagne transition hover:bg-champagne hover:text-[#2f250d]"
              >
                {copy.whatsapp.cta}
              </a>
            </div>
          </div>
        </section>

        <section className="radial-pool px-6 py-28 text-center md:py-40">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-5xl leading-tight text-linen md:text-7xl">
              {copy.final.title}
            </h2>

            <p className="mt-6 text-xl leading-9 text-muted">
              {copy.final.text}
            </p>

            <a
              href="#solicita-acceso"
              className="btn-glow mt-10 inline-flex rounded bg-gold px-10 py-5 text-xs font-bold uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne"
            >
              {copy.final.cta}
            </a>
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

          <nav className="flex gap-6 text-xs uppercase tracking-[0.22em] text-muted/80">
            <a href="#">{copy.footer.privacy}</a>
            <a href="#">{copy.footer.terms}</a>
            <a href="#">{copy.footer.contact}</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
