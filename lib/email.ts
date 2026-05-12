import { Resend } from "resend";
import type { Locale } from "@/config/challenge";

const WHATSAPP_URL = "https://wa.me/34686638097";
const PRIVATE_ACCESS_URL =
  "https://espaciolilycamarena.app.clientclub.net/communities/groups/el-código-de-la-abundancia/home?invite=6a02fa1866a3b5058f8db84f";
const SAFE_EMAIL = "hello@lilycamarena.com";

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
                    Has recibido este email porque tu pago del reto de Lily se ha procesado correctamente.<br />
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
      ? "Último paso para acceder al reto"
      : "Final step to access the challenge";

  const preview =
    locale === "es"
      ? "Tu pago se ha procesado correctamente. Completa ahora el último paso para acceder al espacio privado."
      : "Your payment has been processed successfully. Complete the final step to access the private space.";

  const content =
    locale === "es"
      ? `
        <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:36px; line-height:1.12; color:#f4d77b; font-weight:400;">
          Último paso para acceder al reto
        </h1>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#eee6d8;">
          Hola ${safeName},
        </p>

        <p style="margin:16px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Tu pago se ha procesado correctamente${safeAmount ? ` por importe de ${safeAmount} ${safeCurrency}` : ""}.
        </p>

        <div style="margin:30px 0; padding:24px; border:1px solid rgba(215,184,93,0.26); background:rgba(215,184,93,0.07); border-radius:18px;">
          <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:25px; line-height:1.28; color:#f4d77b;">
            Completa tu acceso al espacio privado
          </p>

          <p style="margin:14px 0 0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            Ahora solo queda completar el último paso para acceder al espacio privado del reto.
          </p>

          <div style="margin-top:20px;">
            <a href="${PRIVATE_ACCESS_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:15px 22px; border-radius:999px; background:#f4d77b; color:#2f250d; font-size:14px; line-height:1; font-weight:800; text-decoration:none;">
              Entrar al espacio privado
            </a>
          </div>

          <p style="margin:18px 0 0; font-size:13px; line-height:1.7; color:#a99f8d; word-break:break-word;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
            ${PRIVATE_ACCESS_URL}
          </p>
        </div>

        <p style="margin:18px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Cuando entres, regístrate con tu nombre y tu email.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Después del registro, tu acceso quedará pendiente de aprobación manual. Las solicitudes se revisan en horario de España.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Si realizas el registro después de las 22:00 h (España), la aprobación podrá realizarse al día siguiente.
        </p>

        <div style="margin:30px 0; padding:22px; border:1px solid rgba(215,184,93,0.22); background:rgba(255,255,255,0.035); border-radius:18px;">
          <p style="margin:0; font-size:15px; line-height:1.7; color:#eee6d8;">
            <strong style="color:#f4d77b;">Importante:</strong> agrega este correo a tu lista de correos seguros para recibir correctamente todas las comunicaciones del reto:
          </p>

          <p style="margin:14px 0 0; font-size:16px; line-height:1.7; color:#f4d77b; font-weight:700;">
            ${SAFE_EMAIL}
          </p>

          <p style="margin:14px 0 0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            Y recuerda revisar también tu carpeta de spam o promociones.
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
            Gracias por formar parte de este proceso. Nos vemos dentro.
          </p>
        </div>
      `
      : `
        <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:36px; line-height:1.12; color:#f4d77b; font-weight:400;">
          Final step to access the challenge
        </h1>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#eee6d8;">
          Hi ${safeName},
        </p>

        <p style="margin:16px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Your payment has been processed successfully${safeAmount ? ` for ${safeAmount} ${safeCurrency}` : ""}.
        </p>

        <div style="margin:30px 0; padding:24px; border:1px solid rgba(215,184,93,0.26); background:rgba(215,184,93,0.07); border-radius:18px;">
          <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:25px; line-height:1.28; color:#f4d77b;">
            Complete your access to the private space
          </p>

          <p style="margin:14px 0 0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            There is only one final step left to access the private challenge space.
          </p>

          <div style="margin-top:20px;">
            <a href="${PRIVATE_ACCESS_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:15px 22px; border-radius:999px; background:#f4d77b; color:#2f250d; font-size:14px; line-height:1; font-weight:800; text-decoration:none;">
              Enter the private space
            </a>
          </div>

          <p style="margin:18px 0 0; font-size:13px; line-height:1.7; color:#a99f8d; word-break:break-word;">
            If the button does not work, copy and paste this link into your browser:<br />
            ${PRIVATE_ACCESS_URL}
          </p>
        </div>

        <p style="margin:18px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          When you enter, register with your name and email.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          After registering, your access will remain pending manual approval. Requests are reviewed during Spanish working hours.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          If you register after 10:00 PM in Spain, your approval may be completed the following day.
        </p>

        <div style="margin:30px 0; padding:22px; border:1px solid rgba(215,184,93,0.22); background:rgba(255,255,255,0.035); border-radius:18px;">
          <p style="margin:0; font-size:15px; line-height:1.7; color:#eee6d8;">
            <strong style="color:#f4d77b;">Important:</strong> add this email to your safe sender list so you receive all challenge communications correctly:
          </p>

          <p style="margin:14px 0 0; font-size:16px; line-height:1.7; color:#f4d77b; font-weight:700;">
            ${SAFE_EMAIL}
          </p>

          <p style="margin:14px 0 0; font-size:15px; line-height:1.7; color:#d8cfbf;">
            Please also check your spam or promotions folder.
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
            Thank you for being part of this process. See you inside.
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
