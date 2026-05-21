import Link from "next/link";
import { challengeByLocale, type Locale } from "@/config/challenge";
import MetaPurchaseTracker from "@/components/MetaPurchaseTracker";

type PaymentConfirmedPageProps = {
  params: {
    locale: string;
  };
  searchParams: {
    session_id?: string;
  };
};

export default function PaymentConfirmedPage({
  params,
  searchParams,
}: PaymentConfirmedPageProps) {
  const locale = params.locale === "en" ? "en" : "es";
  const copy = challengeByLocale[locale as Locale];
  const stripeSessionId = searchParams.session_id;

  const title = locale === "es" ? "Pago recibido" : "Payment received";

  const subtitle =
    locale === "es"
      ? "Tu aportación se ha completado correctamente."
      : "Your contribution has been completed successfully.";

  const text =
    locale === "es"
      ? "Tu pago se ha completado en Stripe. En unos instantes recibirás el email definitivo con el acceso y las instrucciones para empezar el reto."
      : "Your payment has been completed in Stripe. In a few moments you will receive the final email with the access and instructions to start the challenge.";

  const note =
    locale === "es"
      ? "Si no recibes el mail en unos minutos en tu bandeja de entrada, revisa la carpeta de spam. Si sigue sin aparecer, escríbenos por WhatsApp."
      : "If you do not receive the email in your inbox within a few minutes, please check your spam folder. If it still does not appear, contact us on WhatsApp.";

  const button = locale === "es" ? "Volver" : "Back";

  const whatsapp = locale === "es" ? "Hablar por WhatsApp" : "Talk on WhatsApp";

  return (
    <main className="invisible-pattern-shell flex min-h-screen items-center justify-center px-6 py-24 text-center">
      <MetaPurchaseTracker sessionId={stripeSessionId} />

      <div className="luxury-noise" />

      <section className="relative z-10 mx-auto max-w-3xl">
        <div className="glass-panel pattern-card rounded-[2rem] border-champagne/35 p-8 shadow-glow md:p-14">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-champagne/40 bg-champagne/10 text-4xl text-champagne shadow-glow">
            ✓
          </div>

          <p className="text-xs font-black uppercase tracking-[0.32em] text-champagne">
            {copy.footer.legal.replace("© 2026 Lily Camarena · ", "")}
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight text-linen md:text-7xl">
            {title}
          </h1>

          <p className="mt-6 font-serif text-2xl leading-tight text-champagne md:text-3xl">
            {subtitle}
          </p>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted">
            {text}
          </p>

          {stripeSessionId ? (
            <p className="mx-auto mt-6 max-w-2xl break-all rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-xs leading-6 text-muted">
              Referencia Stripe: {stripeSessionId}
            </p>
          ) : null}

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-linen/75">
            {note}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/${copy.slug}`}
              className="btn-glow rounded bg-gold px-8 py-4 text-xs font-black uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne"
            >
              {button}
            </Link>

            <a
              href={copy.whatsapp.url}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-[#25D366]/70 px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
            >
              {whatsapp}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
