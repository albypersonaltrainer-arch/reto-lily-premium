"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChallengeCopy } from "@/config/challenge";
import { Countdown } from "@/components/Countdown";
import { LeadForm } from "@/components/LeadForm";
import { VideoGate } from "@/components/VideoGate";

type Testimonial = {
  name: string;
  text: string;
  type: string;
  mediaKind?: "none" | "image" | "video" | "audio";
  mediaUrl?: string;
};

const LOGO_SRC = "/lily-camarena-logo.svg";
const PRICE = "$27";

const FAQ = [
  [
    "¿Cuánto tiempo tendré acceso?",
    "Tendrás acceso durante 1 año, tanto al contenido actual como a todas las actualizaciones que se incorporen durante ese periodo.",
  ],
  [
    "¿Cuánto tiempo necesito cada día?",
    "El recorrido está diseñado para que puedas completarlo dedicando aproximadamente 30 minutos al día.",
  ],
  [
    "¿Es para mí si ya he leído muchos libros o hecho otros cursos?",
    "Sí. De hecho, probablemente sea para ti. Código Origen no busca darte más información, sino ayudarte a comprender por qué, a pesar de todo lo que ya sabes y de todo lo que has trabajado en ti, sigues obteniendo los mismos resultados.",
  ],
  [
    "¿Cómo accedo al contenido?",
    "En cuanto completes tu compra, recibirás un correo electrónico con las instrucciones de acceso. Solo tendrás que solicitar tu acceso y, una vez aprobado, recibirás la confirmación para comenzar el recorrido.",
  ],
  [
    "¿Y si no tengo tiempo?",
    "Aunque está diseñado para completarse en 3 días, podrás avanzar completamente a tu ritmo. Si decides realizar el recorrido durante esos tres días, recibirás un bonus exclusivo como reconocimiento por completar el proceso dentro del tiempo propuesto.",
  ],
  [
    "¿Qué ocurre cuando termino los tres días?",
    "Si al terminar sientes que quieres seguir profundizando y llevar este trabajo a tu siguiente nivel, recibirás un correo con un enlace para reservar una sesión grupal online gratuita de 30 minutos. En ella podrás resolver tus dudas, compartir lo que has descubierto durante el recorrido y conocer cuál es el siguiente paso si decides seguir avanzando. Las sesiones se realizan todos los jueves a las 17:30 h (hora de Madrid).",
  ],
  [
    "¿Me vas a vender algo?",
    "Al terminar te mostraré cuál es el siguiente paso, por si decides seguir profundizando. Mi trabajo no es convencerte de que continúes. Es darte la claridad suficiente para que seas tú quien decida si este camino tiene sentido para ti.",
  ],
] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.32em] text-[#b89452]">
      {children}
    </p>
  );
}

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#solicita-acceso"
      className="inline-flex items-center justify-center rounded bg-[#111111] px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#2a2118]"
    >
      {children}
    </a>
  );
}

function TestimonialMedia({ item }: { item: Testimonial }) {
  if (!item.mediaUrl || !item.mediaKind || item.mediaKind === "none") return null;
  if (item.mediaKind === "image") {
    return (
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#c9a86a]/20 bg-white p-2">
        <img src={item.mediaUrl} alt={item.name} className="mx-auto max-h-[420px] w-full rounded-xl object-contain" loading="lazy" />
      </div>
    );
  }
  if (item.mediaKind === "video") {
    return <video src={item.mediaUrl} controls preload="metadata" playsInline className="mb-5 w-full rounded-2xl bg-black" />;
  }
  if (item.mediaKind === "audio") {
    return <audio src={item.mediaUrl} controls preload="metadata" className="mb-5 w-full" />;
  }
  return null;
}

export function CodigoOrigenLanding({ copy }: { copy: ChallengeCopy }) {
  const [unlocked, setUnlocked] = useState(false);
  const testimonials = copy.testimonials.items as Testimonial[];

  return (
    <div className="min-h-screen bg-[#f3eadc] text-[#17130f]">
      <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#f7efe3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          <a href="/es/codigo-origen" aria-label="Lily Camarena" className="flex items-center">
            <Image src={LOGO_SRC} alt="Lily Camarena" width={180} height={180} className="h-14 w-14 object-contain md:h-16 md:w-16" priority />
          </a>
          <a href="#solicita-acceso" className="rounded bg-[#111111] px-5 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#2b2119]">
            Acceder al reto
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(201,168,106,0.35),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(0,0,0,0.10),transparent_26%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <SectionLabel>Un recorrido guiado de 3 días</SectionLabel>
              <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#111111] md:text-7xl">
                No estás creando desde donde crees que estás creando.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#3e342a] md:text-2xl">Si hacer más fuera la solución, ya habrías cambiado.</p>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5b5046]">
                Código Origen es una experiencia de observación y toma de conciencia para descubrir por qué sigues obteniendo resultados parecidos aunque ya estés intentando cambiar.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <CtaButton>Entrar por {PRICE}</CtaButton>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6c5d4c]">100% online · acceso inmediato · acceso durante 1 año</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#fffaf2]/80 p-8 shadow-[0_30px_90px_rgba(35,24,14,0.16)] md:p-10">
              <Image src={LOGO_SRC} alt="Lily Camarena" width={620} height={620} className="mx-auto h-72 w-full object-contain sm:h-80 md:h-[24rem]" priority />
              <div className="mt-8 border-t border-black/10 pt-6">
                <p className="text-sm font-black uppercase tracking-[0.26em] text-[#b89452]">No es manifestación tradicional</p>
                <p className="mt-4 text-lg leading-8 text-[#3e342a]">No va de visualizar mejor, repetir afirmaciones o aprender otra técnica. Va de observar desde dónde estás interpretando, decidiendo y creando tu realidad.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-14 text-white md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            <SectionLabel>La pregunta central</SectionLabel>
            <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] md:col-span-2 md:text-6xl">¿Por qué sigo obteniendo los mismos resultados aunque llevo tiempo intentando cambiar?</h2>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <VideoGate url={copy.video.url} placeholderText={copy.video.placeholderText} lockedText={copy.video.locked} unlockLabel={copy.video.unlockLabel} unlockAfterSeconds={copy.video.unlockAfterSeconds} onUnlocked={() => setUnlocked(true)} />
          </div>
        </section>

        <section className="px-6 py-10 md:py-16">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-black/10 bg-[#fffaf2] p-8 shadow-[0_24px_70px_rgba(35,24,14,0.10)] md:p-12">
            <SectionLabel>{unlocked ? "Acceso desbloqueado" : "Después del vídeo"}</SectionLabel>
            <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">{copy.unlock.title}</h2>
            <p className="mt-6 text-xl leading-9 text-[#4e4237]">{copy.unlock.lines.slice(0, 2).join(" ")}</p>
            <div className="mt-8"><CtaButton>{copy.unlock.cta}</CtaButton></div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-[#111111] p-8 text-white md:p-10">
              <SectionLabel>El problema real</SectionLabel>
              <h2 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">No te falta más información.</h2>
              <div className="mt-6 space-y-4 text-lg leading-8 text-white/75">
                <p>Muchas personas ya han leído libros, hecho cursos, probado métodos y trabajado en sí mismas.</p>
                <p>Sin embargo, siguen repitiendo ciertos patrones porque, sin darse cuenta, siguen interpretando su realidad de la misma manera.</p>
              </div>
            </div>
            <div className="space-y-5">
              {[
                "Sabes que algo ha cambiado en ti… pero tu vida todavía no refleja ese cambio.",
                "Cambias tus acciones una y otra vez, pero los resultados terminan pareciéndose demasiado a los de siempre.",
                "Hay días en los que te sientes imparable… y otros en los que vuelves a dudar de todo.",
                "Te prometes que esta vez será diferente… y, sin darte cuenta, acabas reaccionando igual.",
              ].map((item) => <div key={item} className="rounded-2xl border border-black/10 bg-[#fffaf2] p-6 text-xl leading-8 shadow-[0_18px_50px_rgba(35,24,14,0.08)]">{item}</div>)}
            </div>
          </div>
        </section>

        <section className="bg-[#eadcc7] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>Antes de empezar</SectionLabel>
            <div className="mt-6 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">El problema no es lo que pasa, es desde dónde lo estás mirando.</h2>
              <div className="space-y-5 text-lg leading-8 text-[#3e342a]">
                <p>La mayoría cree que su problema es que todavía no ha conseguido lo que quiere: más dinero, más oportunidades, más libertad o más resultados.</p>
                <p>Pero dos personas pueden vivir una situación parecida y crear experiencias completamente distintas.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Una ve problemas.", "La otra ve oportunidades.", "Una ve límites.", "La otra ve posibilidades.", "Una se contrae.", "La otra actúa."].map((item) => <div key={item} className="rounded-xl border border-black/10 bg-[#fffaf2]/75 p-4">{item}</div>)}
                </div>
              </div>
            </div>
            <div className="mt-10 rounded-[2rem] bg-[#111111] p-8 text-white md:p-12"><p className="font-serif text-3xl leading-tight tracking-[-0.03em] md:text-5xl">Mientras el observador siga siendo el mismo, la realidad podrá cambiar de forma, pero tenderá a parecerse una y otra vez a la anterior.</p></div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionLabel>Qué vivirás estos 3 días.</SectionLabel>
            <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">Tres días para mirar tu realidad desde otro lugar.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ["Día 1", "El origen de tus resultados no está donde crees", "Descubrirás que no estás creando desde donde crees que estás creando."],
                ["Día 2", "Tu mente ve lo que espera encontrar", "Identificarás filtros, conclusiones e interpretaciones que condicionan tu experiencia."],
                ["Día 3", "No necesitas esforzarte más", "Empezarás a comprender cómo elegir desde otro lugar y abrir nuevas posibilidades."],
              ].map(([day, title, text]) => <article key={day} className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-7 shadow-[0_20px_60px_rgba(35,24,14,0.09)]"><p className="text-xs font-black uppercase tracking-[0.28em] text-[#b89452]">{day}</p><h3 className="mt-5 font-serif text-3xl leading-tight text-[#111111]">{title}</h3><p className="mt-5 text-base leading-7 text-[#5b5046]">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-14 text-white md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
            <div><SectionLabel>Lo que no es</SectionLabel><div className="mt-6 space-y-3 text-lg leading-8 text-white/75">{["No es un curso de manifestación.", "No es un curso para pensar en positivo.", "No es una colección de técnicas.", "No es una solución mágica."].map((item) => <p key={item}>{item}</p>)}</div></div>
            <div><SectionLabel>Lo que sí es</SectionLabel><div className="mt-6 space-y-3 text-lg leading-8 text-white/75">{["Una experiencia de observación.", "Una toma de conciencia profunda.", "Una puerta de entrada hacia una forma distinta de crear.", "Un reto para ver lo que hasta ahora no estabas viendo."].map((item) => <p key={item}>{item}</p>)}</div></div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-8 shadow-[0_24px_70px_rgba(35,24,14,0.10)]"><Image src={LOGO_SRC} alt="Lily Camarena" width={500} height={500} className="mx-auto h-64 w-full object-contain md:h-72" /></div>
            <div><SectionLabel>{copy.coach.name}</SectionLabel><h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">{copy.coach.subtitle}</h2><p className="mt-6 text-xl leading-9 text-[#3e342a]">{copy.coach.text}</p></div>
          </div>
        </section>

        {testimonials.length > 0 ? <section className="bg-[#eadcc7] px-6 py-14 md:py-20"><div className="mx-auto max-w-7xl"><SectionLabel>Casos de éxito</SectionLabel><h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">Personas que ya empezaron a mirar su realidad desde otro lugar.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{testimonials.map((item, index) => <article key={`${item.name}-${index}`} className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-6 shadow-[0_20px_60px_rgba(35,24,14,0.09)]"><TestimonialMedia item={item} /><p className="text-lg leading-8 text-[#3e342a]">“{item.text}”</p><p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#857464]">{item.name}</p></article>)}</div></div></section> : null}

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div><SectionLabel>Acceso al reto</SectionLabel><h2 className="mt-5 font-serif text-5xl leading-tight tracking-[-0.05em] text-[#111111] md:text-7xl">{PRICE}</h2><p className="mt-5 max-w-xl text-xl leading-9 text-[#3e342a]">Acceso completo al recorrido guiado de 3 días para descubrir por qué, aunque haces todo lo posible por cambiar, sigues repitiendo los mismos resultados… y cuál es el primer paso para empezar a cambiarlos.</p><div className="mt-8"><CtaButton>Acceder ahora</CtaButton></div></div>
            <div className="rounded-[2rem] border border-black/10 bg-[#fffaf2] p-8 shadow-[0_24px_70px_rgba(35,24,14,0.10)]"><div className="space-y-4 text-lg leading-8 text-[#3e342a]"><p>✔ Acceso online al reto completo de 3 días</p><p>✔ Acceso inmediato tras la inscripción</p><p>✔ Tendrás acceso a los 3 días del recorrido durante 1 año.</p></div></div>
          </div>
        </section>

        <section className="bg-[#111111] px-6 py-14 text-white md:py-20"><div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]"><div><SectionLabel>{copy.countdown.label}</SectionLabel><h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] md:text-6xl">{copy.countdown.title}</h2><p className="mt-5 text-lg leading-8 text-white/70">{copy.countdown.text}</p></div><Countdown deadlineIso={copy.countdown.deadlineIso} urgencyMinutes={copy.countdown.urgencyMinutes} /></div></section>

        <section id="solicita-acceso" className="scroll-mt-28 px-6 py-14 md:py-20"><div className="mx-auto max-w-4xl"><LeadForm copy={copy} /></div></section>

        <section className="px-6 pb-20 pt-6 md:pb-28"><div className="mx-auto max-w-4xl"><div className="text-center"><SectionLabel>FAQ</SectionLabel><h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#111111] md:text-6xl">Preguntas frecuentes</h2></div><div className="mt-10 overflow-hidden rounded-[2rem] border border-black/10 bg-[#fffaf2] shadow-[0_24px_70px_rgba(35,24,14,0.10)]">{FAQ.map(([question, answer], index) => <details key={question} className="group border-b border-black/10 last:border-b-0" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-6 text-left font-serif text-2xl leading-tight text-[#111111] marker:hidden md:px-8"><span>{question}</span><span aria-hidden="true" className="text-3xl font-light text-[#b89452] transition-transform duration-200 group-open:rotate-45">+</span></summary><div className="px-6 pb-7 text-base leading-8 text-[#5b5046] md:px-8 md:text-lg"><p>{answer}</p></div></details>)}</div></div></section>
      </main>

      <footer className="border-t border-white/10 bg-[#111111] px-6 py-10 text-white"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row"><div className="flex items-center gap-3"><Image src={LOGO_SRC} alt="Lily Camarena" width={160} height={160} className="h-14 w-14 object-contain brightness-0 invert" /></div><p className="text-xs uppercase tracking-[0.22em] text-white/55">{copy.footer.legal}</p><nav className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.22em] text-white/65"><a href="/es/legal/privacidad" className="transition hover:text-white">Privacidad</a><a href="/es/legal/terminos" className="transition hover:text-white">Términos</a><a href={copy.whatsapp.url} target="_blank" rel="noreferrer" className="transition hover:text-white">Contacto</a></nav></div></footer>
    </div>
  );
}
