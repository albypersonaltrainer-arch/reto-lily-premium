import Link from "next/link";
import { challengeByLocale, type Locale } from "@/config/challenge";

type LegalTermsPageProps = {
  params: {
    locale: string;
  };
};

export default function LegalTermsPage({ params }: LegalTermsPageProps) {
  const locale: Locale = params.locale === "en" ? "en" : "es";
  const copy = challengeByLocale[locale];

  const backLabel = locale === "es" ? "Volver" : "Back";
  const title =
    locale === "es" ? "Términos y condiciones" : "Terms and conditions";
  const subtitle =
    locale === "es"
      ? "Reto de 3 días · El Código de la Abundancia"
      : "3-day challenge · The Abundance Code";

  return (
    <main className="invisible-pattern-shell min-h-screen px-6 py-24">
      <div className="luxury-noise" />

      <section className="relative z-10 mx-auto max-w-4xl">
        <Link
          href={`/${locale}/${copy.slug}`}
          className="inline-flex rounded border border-champagne/40 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-champagne transition hover:bg-champagne hover:text-[#2f250d]"
        >
          {backLabel}
        </Link>

        <div className="glass-panel pattern-card mt-10 rounded-[2rem] border-champagne/35 p-7 shadow-glow md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-champagne">
            {subtitle}
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight text-linen md:text-7xl">
            {title}
          </h1>

          <div className="mt-10 space-y-9 text-left text-muted">
            <section>
              <h2 className="font-serif text-2xl text-champagne">
                1. Información general
              </h2>
              <p className="mt-4 leading-8">
                Este sitio web y el contenido relacionado con el reto “El
                Código de la Abundancia” son propiedad de Lily Camarena.
              </p>
              <p className="mt-3 leading-8">
                Al acceder a esta página y participar en el reto, aceptas los
                presentes términos y condiciones.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                2. Objetivo del reto
              </h2>
              <p className="mt-4 leading-8">
                El reto “El Código de la Abundancia” tiene fines educativos, de
                desarrollo personal y expansión de conciencia.
              </p>
              <p className="mt-3 leading-8">
                El contenido compartido durante el reto no sustituye
                asesoramiento financiero, médico, psicológico, psiquiátrico o
                legal profesional.
              </p>
              <p className="mt-3 leading-8">
                La información compartida tiene carácter formativo y
                experiencial. Este reto no sustituye terapia psicológica,
                tratamiento médico ni acompañamiento clínico profesional.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                3. Acceso y participación
              </h2>
              <p className="mt-4 leading-8">
                Una vez realizada la aportación correspondiente y confirmada la
                inscripción, el usuario recibirá acceso al reto mediante el canal
                indicado por la organización.
              </p>
              <p className="mt-3 leading-8">
                El acceso es personal e intransferible.
              </p>
              <p className="mt-3 leading-8">
                Queda prohibido compartir, distribuir, grabar, reproducir,
                revender o utilizar comercialmente cualquier contenido del reto
                sin autorización expresa y por escrito.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                4. Aportaciones y pagos
              </h2>
              <p className="mt-4 leading-8">
                Las cantidades aportadas para acceder al reto son voluntarias y
                representan el nivel de compromiso elegido por cada participante.
              </p>
              <p className="mt-3 leading-8">
                Todas las aportaciones se procesan de forma segura mediante
                plataformas externas de pago.
              </p>
              <p className="mt-3 leading-8">
                Debido a la naturaleza digital e inmediata del acceso al
                contenido, no se realizan devoluciones una vez confirmado el
                acceso al reto.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                5. Propiedad intelectual
              </h2>
              <p className="mt-4 leading-8">
                Todo el contenido incluido en este reto, incluyendo textos,
                vídeos, audios, ejercicios, nombre del programa, identidad
                visual y materiales relacionados, pertenece a Lily Camarena.
              </p>
              <p className="mt-3 leading-8">
                Queda prohibida su copia, distribución o utilización comercial
                sin autorización previa y por escrito.
              </p>
              <p className="mt-3 leading-8">
                Queda prohibido utilizar el contenido del reto para entrenar
                herramientas de inteligencia artificial, reutilizarlo
                comercialmente o revenderlo parcial o totalmente.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                6. Responsabilidad del usuario
              </h2>
              <p className="mt-4 leading-8">
                El participante entiende y acepta que sus resultados, avances y
                aplicación del contenido dependen exclusivamente de su implicación
                personal.
              </p>
              <p className="mt-3 leading-8">
                Lily Camarena no garantiza resultados económicos específicos,
                ingresos determinados, manifestaciones concretas ni cambios
                inmediatos en la situación personal, financiera o profesional del
                participante.
              </p>
              <p className="mt-3 leading-8">
                El contenido compartido no constituye una promesa ni garantía de
                resultados financieros, económicos o personales específicos. Cada
                persona es responsable de sus propias decisiones, acciones y
                resultados.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                7. Limitación de responsabilidad
              </h2>
              <p className="mt-4 leading-8">
                Lily Camarena no será responsable por decisiones personales,
                financieras, emocionales o profesionales tomadas por el usuario a
                raíz del contenido del reto.
              </p>
              <p className="mt-3 leading-8">
                La participación en este reto es voluntaria y cada participante
                asume la responsabilidad total de su proceso personal.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                8. Testimonios y experiencias
              </h2>
              <p className="mt-4 leading-8">
                Los testimonios compartidos reflejan experiencias personales e
                individuales de distintos participantes.
              </p>
              <p className="mt-3 leading-8">
                Los resultados pueden variar en cada persona y no constituyen
                garantía de resultados futuros.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                9. Privacidad
              </h2>
              <p className="mt-4 leading-8">
                La información proporcionada por los usuarios será tratada de
                forma confidencial y utilizada únicamente para fines relacionados
                con el acceso al reto, comunicaciones y servicios vinculados a la
                comunidad.
              </p>
              <p className="mt-3 leading-8">
                No se compartirán datos personales con terceros salvo obligación
                legal o necesidad técnica para la prestación del servicio.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                10. Comunicaciones
              </h2>
              <p className="mt-4 leading-8">
                Al registrarte en el reto, aceptas recibir comunicaciones
                relacionadas con el acceso, contenido, seguimiento e información
                vinculada a los programas y servicios de Lily Camarena.
              </p>
              <p className="mt-3 leading-8">
                El usuario podrá solicitar dejar de recibir dichas comunicaciones
                en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                11. Mayoría de edad
              </h2>
              <p className="mt-4 leading-8">
                La participación en este reto está dirigida exclusivamente a
                personas mayores de 18 años.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                12. Derecho de admisión
              </h2>
              <p className="mt-4 leading-8">
                La organización se reserva el derecho de cancelar o limitar el
                acceso a cualquier participante que incurra en faltas de respeto,
                comportamiento inapropiado o uso indebido del contenido y la
                comunidad.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                13. Modificaciones
              </h2>
              <p className="mt-4 leading-8">
                La organización se reserva el derecho de modificar los presentes
                términos y condiciones en cualquier momento para adaptarlos a
                cambios legales, técnicos o de funcionamiento.
              </p>
              <p className="mt-3 leading-8">
                La organización se reserva el derecho de modificar fechas, formato
                o contenidos del reto cuando sea necesario.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                14. Contacto
              </h2>
              <p className="mt-4 leading-8">
                Para cualquier duda o consulta relacionada con el reto, puedes
                contactar a través del canal oficial de WhatsApp indicado en esta
                página.
              </p>
              <a
                href={copy.whatsapp.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded border border-[#25D366]/70 px-6 py-4 text-xs font-bold uppercase tracking-[0.22em] text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
              >
                Hablar por WhatsApp
              </a>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
