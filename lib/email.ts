import { Resend } from "resend";
import type { Locale } from "@/config/challenge";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendLeadConfirmationEmail({
  email,
  fullName,
  locale,
  confirmationUrl
}: {
  email: string;
  fullName: string;
  locale: Locale;
  confirmationUrl: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const from = process.env.EMAIL_FROM || "Reto Lily <noreply@example.com>";
  const subject = locale === "es" ? "Confirma tu acceso al reto" : "Confirm your challenge access";
  const greeting = locale === "es" ? `Hola ${fullName},` : `Hi ${fullName},`;
  const body =
    locale === "es"
      ? "Has solicitado acceder al reto de 3 días. Confirma tu email para recibir las instrucciones definitivas."
      : "You requested access to the 3-day challenge. Confirm your email to receive the final instructions.";
  const cta = locale === "es" ? "Confirmar acceso" : "Confirm access";

  await resend.emails.send({
    from,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; background:#16130b; color:#eae1d4; padding:32px;">
        <div style="max-width:620px; margin:0 auto; background:#231f17; border:1px solid #4d4635; padding:32px;">
          <h1 style="font-family: Georgia, serif; color:#f2ca50;">${subject}</h1>
          <p>${greeting}</p>
          <p>${body}</p>
          <p style="margin:32px 0;"><a href="${confirmationUrl}" style="background:#d4af37; color:#3c2f00; padding:14px 22px; text-decoration:none; font-weight:bold;">${cta}</a></p>
          <p style="color:#d0c5af; font-size:13px;">${confirmationUrl}</p>
        </div>
      </div>
    `
  });
}

export async function sendFinalAccessEmail({
  email,
  fullName,
  locale,
  stripeUrl,
  sumupUrl
}: {
  email: string;
  fullName: string;
  locale: Locale;
  stripeUrl: string;
  sumupUrl: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const from = process.env.EMAIL_FROM || "Reto Lily <noreply@example.com>";
  const subject = locale === "es" ? "Tu acceso al reto está confirmado" : "Your challenge access is confirmed";
  const greeting = locale === "es" ? `Hola ${fullName},` : `Hi ${fullName},`;
  const body =
    locale === "es"
      ? "Tu email ha sido confirmado. Puedes completar tu aportación desde uno de estos enlaces."
      : "Your email has been confirmed. You can complete your contribution using one of these links.";

  await resend.emails.send({
    from,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; background:#16130b; color:#eae1d4; padding:32px;">
        <div style="max-width:620px; margin:0 auto; background:#231f17; border:1px solid #4d4635; padding:32px;">
          <h1 style="font-family: Georgia, serif; color:#f2ca50;">${subject}</h1>
          <p>${greeting}</p>
          <p>${body}</p>
          <p style="margin:28px 0;"><a href="${stripeUrl}" style="background:#d4af37; color:#3c2f00; padding:14px 22px; text-decoration:none; font-weight:bold;">Stripe</a></p>
          <p style="margin:28px 0;"><a href="${sumupUrl}" style="border:1px solid #e4bfaf; color:#e4bfaf; padding:14px 22px; text-decoration:none; font-weight:bold;">SumUp</a></p>
        </div>
      </div>
    `
  });
}
