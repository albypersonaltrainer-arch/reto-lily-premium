import { Resend } from "resend";
import type { Locale } from "@/config/challenge";

const WHATSAPP_URL = "https://wa.me/34686638097";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getEmailShell({
  title,
  preview,
  content
}: {
  title: string;
  preview: string;
  content: string;
}) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
      </head>
      <body style="margin:0; padding:0; background:#15120d; font-family:Arial, Helvetica, sans-serif; color:#eee6d8;">
        <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
          ${preview}
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#15120d; padding:32px 14px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px; border-collapse:collapse;">
                <tr>
                  <td style="padding:22px 0 18px; text-align:center;">
                    <div style="font-size:20px; line-height:1.15; letter-spacing:0.24em; text-transform:uppercase; color:#f4d77b; font-weight:700;">
                      RETO DE 3 DÍAS
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="background:linear-gradient(145deg, #221c14 0%, #17130e 100%); border:1px solid rgba(215,184,93,0.28); border-radius:24px; padding:38px 28px; box-shadow:0 24px 80px rgba(0,0,0,0.38);">
                    ${content}
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 12px 0; text-align:center; color:#8f8575; font-size:12px; line-height:1.6;">
                    Has recibido este email porque completaste tu aportación al reto de Lily.<br />
                    Si tienes cualquier duda, responde a este email o contacta por WhatsApp.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendPaidAccessEmail({
  email,
  fullName,
  locale,
  amount,
  currency
}: {
  email: string;
  fullName: string;
  locale: Locale;
  amount?: string;
  currency?: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const from = process.env.EMAIL_FROM || "Reto Lily <noreply@example.com>";
  const safeName = escapeHtml(fullName);
  const safeAmount = amount ? escapeHtml(amount) : "";
  const safeCurrency = currency ? escapeHtml(currency.toUpperCase()) : "USD";

  const subject =
    locale === "es"
      ? "Tu acceso al reto está confirmado"
      : "Your challenge access is confirmed";

  const preview =
    locale === "es"
      ? "Tu acceso al reto de 3 días ya está confirmado."
      : "Your access to the 3-day challenge is now confirmed.";

  const content =
    locale === "es"
      ? `
        <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:36px; line-height:1.12; color:#f4d77b; font-weight:400;">
          Tu acceso está confirmado
        </h1>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#eee6d8;">
          Hola ${safeName},
        </p>

        <p style="margin:16px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Hemos recibido correctamente tu aportación${safeAmount ? ` de ${safeAmount} ${safeCurrency}` : ""}.
        </p>

        <p style="margin:18px 0 0; font-size:17px; line-height:1.75; color:#eee6d8;">
          Tu acceso al reto de 3 días ya está confirmado.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          A partir de aquí, lo importante no es hacer más desde la presión.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Es empezar a ver qué patrón sigue sosteniendo el mismo resultado.
        </p>

        <div style="margin:30px 0; padding:22px; border:1px solid rgba(215,184,93,0.24); background:rgba(215,184,93,0.06); border-radius:18px;">
          <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:24px; line-height:1.28; color:#f4d77b;">
            Próximo paso
          </p>

          <p style="margin:12px 0 0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            En los próximos minutos recibirás el acceso y las instrucciones para empezar el reto.
          </p>

          <p style="margin:12px 0 0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            Importante: revisa bien tu bandeja de entrada para no perderte el acceso.
          </p>
        </div>

        <div style="margin:0 0 30px; padding:22px; border:1px solid rgba(37,211,102,0.28); background:rgba(37,211,102,0.07); border-radius:18px;">
          <p style="margin:0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            Si tienes dudas antes de empezar, puedes escribirnos directamente por WhatsApp.
          </p>

          <div style="margin-top:18px;">
            <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:14px 20px; border-radius:999px; background:#25D366; color:#07130b; font-size:14px; line-height:1; font-weight:700; text-decoration:none;">
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <div style="margin:32px 0 0; padding:20px; border-left:2px solid rgba(215,184,93,0.55); background:rgba(255,255,255,0.035); border-radius:14px;">
          <p style="margin:0; font-size:15px; line-height:1.7; color:#eee6d8;">
            Si has llegado hasta aquí, no es casualidad. Ahora empieza la parte importante: mirar distinto para empezar a generar distinto.
          </p>
        </div>
      `
      : `
        <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:36px; line-height:1.12; color:#f4d77b; font-weight:400;">
          Your access is confirmed
        </h1>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#eee6d8;">
          Hi ${safeName},
        </p>

        <p style="margin:16px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          We have successfully received your contribution${safeAmount ? ` of ${safeAmount} ${safeCurrency}` : ""}.
        </p>

        <p style="margin:18px 0 0; font-size:17px; line-height:1.75; color:#eee6d8;">
          Your access to the 3-day challenge is now confirmed.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          From here, the important part is not doing more from pressure.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          It is starting to see which pattern keeps sustaining the same result.
        </p>

        <div style="margin:30px 0; padding:22px; border:1px solid rgba(215,184,93,0.24); background:rgba(215,184,93,0.06); border-radius:18px;">
          <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:24px; line-height:1.28; color:#f4d77b;">
            Next step
          </p>

          <p style="margin:12px 0 0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            In the next few minutes, you will receive the access and instructions to start the challenge.
          </p>

          <p style="margin:12px 0 0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            Important: please check your inbox carefully so you do not miss the access.
          </p>
        </div>

        <div style="margin:0 0 30px; padding:22px; border:1px solid rgba(37,211,102,0.28); background:rgba(37,211,102,0.07); border-radius:18px;">
          <p style="margin:0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            If you have questions before starting, you can write to us directly on WhatsApp.
          </p>

          <div style="margin-top:18px;">
            <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:14px 20px; border-radius:999px; background:#25D366; color:#07130b; font-size:14px; line-height:1; font-weight:700; text-decoration:none;">
              Write on WhatsApp
            </a>
          </div>
        </div>

        <div style="margin:32px 0 0; padding:20px; border-left:2px solid rgba(215,184,93,0.55); background:rgba(255,255,255,0.035); border-radius:14px;">
          <p style="margin:0; font-size:15px; line-height:1.7; color:#eee6d8;">
            If you made it this far, it is not random. Now the important part begins: seeing differently so you can start creating differently.
          </p>
        </div>
      `;

  await resend.emails.send({
    from,
    to: email,
    subject,
    html: getEmailShell({
      title: subject,
      preview,
      content
    })
  });
}
