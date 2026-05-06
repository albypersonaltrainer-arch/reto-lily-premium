"use client";

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

      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-surface/45 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
          <a href={`/${copy.locale}/${copy.slug}`} className="font-serif text-3xl tracking-tight text-champagne">
            {copy.brand}
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href={copy.oppositeLocalePath} className="text-xs font-bold uppercase tracking-[0.28em] text-champagne transition hover:text-linen">
              ES / EN
            </a>
          </nav>
          <a href="#acceso" className="btn-glow rounded bg-gold px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#3c2f00] transition hover:bg-champagne">
            {copy.navCta}
          </a>
        </div>
      </header>

      <main>
        <section className="radial-pool flex min-h-screen items-center justify-center px-6 pb-24 pt-36 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-rose/80">{copy.hero.eyebrow}</p>
            <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.04em] text-linen md:text-7xl">
              {copy.hero.title}
            </h1>
            <h2 className="text-glow mx-auto max-w-3xl font-serif text-3xl leading-tight text-champagne md:text-5xl">
              {copy.hero.subtitle}
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light leading-8 text-muted md:text-xl">
              {copy.hero.intro}
            </p>
          </div>
        </section>

        <section className="relative z-10 px-6 py-24 md:py-32">
          <div className="mx-auto flex max-w-content flex-col items-center text-center">
            <VideoGate
              url={copy.video.url}
              placeholderText={copy.video.placeholderText}
              lockedText={copy.video.locked}
              unlockAfterSeconds={copy.video.unlockAfterSeconds}
              onUnlocked={() => setUnlocked(true)}
            />
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{copy.video.helper}</p>
            <button
              type="button"
              onClick={() => setUnlocked(true)}
              className="mt-5 text-xs uppercase tracking-[0.24em] text-champagne/70 underline decoration-champagne/30 underline-offset-8 transition hover:text-champagne"
            >
              Desbloquear demo
            </button>
          </div>
        </section>

        <section className="radial-pool px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className={`glass-panel pattern-card rounded-xl p-8 transition duration-700 md:p-14 ${unlocked ? "opacity-100 translate-y-0" : "opacity-45 translate-y-3"}`}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-rose/80">
                {unlocked ? "Acceso desbloqueado" : "Mensaje post-vídeo"}
              </p>
              <h3 className="font-serif text-4xl leading-tight text-champagne text-glow">{copy.unlock.title}</h3>
              <div className="mt-8 space-y-4 text-lg leading-8 text-linen/90">
                {copy.unlock.lines.map((line) => <p key={line}>{line}</p>)}
              </div>
              <a href="#acceso" className="btn-glow mt-10 inline-flex rounded bg-gold px-10 py-5 text-xs font-bold uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne">
                {copy.unlock.cta}
              </a>
              <p className="mt-6 text-sm italic text-muted">{copy.unlock.note}</p>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-rose/80">{copy.countdown.label}</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-linen md:text-6xl">{copy.countdown.title}</h2>
              <p className="mt-5 text-lg leading-8 text-muted">{copy.countdown.text}</p>
            </div>
            <Countdown deadlineIso={copy.countdown.deadlineIso} />
          </div>
        </section>

        <section id="acceso" className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-content text-center">
            <h2 className="font-serif text-5xl leading-tight text-linen md:text-7xl">{copy.donation.title}</h2>
            <p className="text-glow mt-5 font-serif text-3xl text-champagne">{copy.donation.subtitle}</p>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">{copy.donation.minimum}</p>
            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {copy.donation.options.map((option) => (
                <div key={option.amount} className="glass-panel pattern-card rounded-xl p-8 transition duration-500 hover:border-champagne/40">
                  <div className="font-serif text-4xl text-linen">{option.amount}</div>
                  <div className="mt-4 text-xs uppercase tracking-[0.24em] text-muted/80">{option.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={copy.donation.paymentMethods.stripe} className="btn-glow rounded bg-gold px-10 py-5 text-xs font-bold uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne">Stripe</a>
              <a href={copy.donation.paymentMethods.sumup} className="rounded border border-rose/50 px-10 py-5 text-xs font-bold uppercase tracking-[0.24em] text-rose transition hover:border-champagne hover:text-champagne">SumUp</a>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-content">
            <h2 className="text-center font-serif text-4xl text-linen md:text-6xl">{copy.learn.title}</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {copy.learn.items.map((item, index) => (
                <div key={item} className="glass-panel rounded-xl p-7">
                  <div className="mb-8 font-serif text-4xl text-champagne/70">0{index + 1}</div>
                  <p className="text-lg leading-8 text-linen">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-content text-center">
            <h2 className="font-serif text-4xl text-linen md:text-6xl">{copy.testimonials.title}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">{copy.testimonials.text}</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {copy.testimonials.items.map((item) => (
                <article key={item.name} className="glass-panel rounded-xl p-8 text-left">
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-champagne/30 bg-champagne/10 text-xs uppercase tracking-[0.18em] text-champagne">{item.type}</div>
                  <p className="text-lg leading-8 text-linen/90">“{item.text}”</p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-muted">{item.name}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-xl p-8 md:p-10">
              <h2 className="font-serif text-4xl text-linen">{copy.whatsapp.title}</h2>
              <p className="mt-5 text-lg leading-8 text-muted">{copy.whatsapp.text}</p>
              <a href={copy.whatsapp.url} className="mt-8 inline-flex rounded border border-rose/50 px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-rose transition hover:border-champagne hover:text-champagne">
                {copy.whatsapp.cta}
              </a>
            </div>
            <LeadForm copy={copy} />
          </div>
        </section>

        <section className="radial-pool px-6 py-28 text-center md:py-40">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-5xl leading-tight text-linen md:text-7xl">{copy.final.title}</h2>
            <p className="mt-6 text-xl leading-9 text-muted">{copy.final.text}</p>
            <a href="#acceso" className="btn-glow mt-10 inline-flex rounded bg-gold px-10 py-5 text-xs font-bold uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne">
              {copy.final.cta}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-obsidian px-6 py-12">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 text-center md:flex-row">
          <div className="font-serif text-3xl text-champagne">{copy.brand}</div>
          <p className="text-xs uppercase tracking-[0.22em] text-rose/70">{copy.footer.legal}</p>
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
