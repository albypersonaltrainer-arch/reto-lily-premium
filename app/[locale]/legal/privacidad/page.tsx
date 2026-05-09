import Link from "next/link";
import { challengeByLocale, type Locale } from "@/config/challenge";

type PrivacyPageProps = {
  params: {
    locale: string;
  };
};

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const locale: Locale = params.locale === "en" ? "en" : "es";
  const copy = challengeByLocale[locale];

  const backLabel = locale === "es" ? "Volver" : "Back";

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
            Reto de 3 días · El Código de la Abundancia
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight text-linen md:text-7xl">
            Política de privacidad
          </h1>

          <div className="mt-10 space-y-9 text-left text-muted">
            <section>
              <h2 className="font-serif text-2xl text-champagne">
                1. Responsable del tratamiento
              </h2>
              <p className="mt-4 leading-8">
                Los datos personales facilitados a través de esta página serán
                tratados por Lily Camarena, responsable del reto “El Código de la
                Abundancia”.
              </p>
              <p className="mt-3 leading-8">
                Para cualquier consulta relacionada con el tratamiento de tus
                datos, puedes contactar a través del canal oficial de WhatsApp
                indicado en esta página.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                2. Datos que podemos recoger
              </h2>
              <p className="mt-4 leading-8">
                A través del formulario de inscripción podemos recoger los
                siguientes datos: nombre completo, correo electrónico, teléfono,
                país, ciudad, aportación seleccionada, aceptación de términos y
                datos técnicos necesarios para gestionar el acceso al reto.
              </p>
              <p className="mt-3 leading-8">
                Los pagos se procesan mediante plataformas externas de pago. Esta
                página no almacena los datos completos de tu tarjeta bancaria.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                3. Finalidad del tratamiento
              </h2>
              <p className="mt-4 leading-8">
                Utilizamos tus datos para gestionar tu inscripción, confirmar tu
                aportación, enviarte el acceso al reto, comunicarte información
                relacionada con el contenido y prestarte soporte si lo necesitas.
              </p>
              <p className="mt-3 leading-8">
                También podemos utilizar tus datos para enviarte comunicaciones
                relacionadas con programas, servicios o contenidos vinculados a
                Lily Camarena, siempre dentro del contexto de la comunidad y los
                servicios ofrecidos.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                4. Base legal
              </h2>
              <p className="mt-4 leading-8">
                El tratamiento de tus datos se basa en tu solicitud de acceso al
                reto, la aceptación de los términos y condiciones, la gestión de
                la relación entre las partes y, cuando corresponda, el
                cumplimiento de obligaciones legales aplicables.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                5. Conservación de los datos
              </h2>
              <p className="mt-4 leading-8">
                Conservaremos tus datos durante el tiempo necesario para gestionar
                tu participación en el reto, atender comunicaciones, cumplir
                obligaciones legales y mantener un registro razonable de la
                relación establecida.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                6. Comunicación a terceros
              </h2>
              <p className="mt-4 leading-8">
                No venderemos tus datos personales a terceros.
              </p>
              <p className="mt-3 leading-8">
                Podremos compartir datos estrictamente necesarios con proveedores
                técnicos que permiten el funcionamiento de la página, el envío de
                emails, la gestión de pagos, el alojamiento web y la prestación
                del servicio.
              </p>
              <p className="mt-3 leading-8">
                También podrán comunicarse datos cuando exista obligación legal o
                requerimiento de autoridad competente.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                7. Proveedores externos
              </h2>
              <p className="mt-4 leading-8">
                Para prestar el servicio pueden intervenir proveedores externos
                como plataformas de pago, servicios de email, alojamiento web,
                base de datos y herramientas técnicas necesarias para la
                operación del reto.
              </p>
              <p className="mt-3 leading-8">
                Cada proveedor tratará los datos conforme a sus propias políticas
                y a las obligaciones aplicables.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                8. Derechos del usuario
              </h2>
              <p className="mt-4 leading-8">
                Puedes solicitar el acceso, rectificación, eliminación,
                limitación u oposición al tratamiento de tus datos personales,
                así como solicitar dejar de recibir comunicaciones.
              </p>
              <p className="mt-3 leading-8">
                Para ejercer tus derechos, contacta a través del canal oficial de
                WhatsApp indicado en esta página.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                9. Seguridad
              </h2>
              <p className="mt-4 leading-8">
                Aplicamos medidas razonables para proteger la información
                facilitada por los usuarios. No obstante, ningún sistema digital
                puede garantizar una seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                10. Cambios en esta política
              </h2>
              <p className="mt-4 leading-8">
                Lily Camarena podrá modificar esta política de privacidad para
                adaptarla a cambios legales, técnicos o de funcionamiento. La
                versión vigente será la publicada en esta página.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-champagne">
                11. Contacto
              </h2>
              <p className="mt-4 leading-8">
                Para cualquier consulta sobre privacidad o tratamiento de datos,
                puedes escribirnos por WhatsApp.
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
