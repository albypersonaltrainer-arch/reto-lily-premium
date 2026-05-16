import { Resend } from "resend";
import type { Locale } from "@/config/challenge";

const PRIVATE_ACCESS_URL =
  "https://espaciolilycamarena.app.clientclub.net/communities/groups/el-código-de-la-abundancia/home?invite=6a02fa1866a3b5058f8db84f";

const SAFE_EMAIL = "hello@lilycamarena.com";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  return new Resend(apiKey);
}

function getEmailFrom() {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error("Missing EMAIL_FROM environment variable");
  }

  return from;
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
                      EL CÓDIGO DE LA ABUNDANCIA
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
                    Has recibido este email porque tu pago se ha procesado correctamente.
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
  locale
}: {
  email: string;
  fullName: string;
  locale: Locale;
  amount?: string;
  currency?: string;
}) {
  const resend = getResend();
  const from = getEmailFrom();

  const subject =
    locale === "es"
      ? "Último paso para acceder"
      : "Final step to access";

  const preview =
    locale === "es"
      ? "Tu pago se ha procesado correctamente. Completa el último paso para acceder al espacio privado."
      : "Your payment has been processed successfully. Complete the final step to access the private space.";

  const safeEmailHtml = `
    <a href="mailto:${SAFE_EMAIL}" style="color:#ffffff !important; font-weight:800; text-decoration:none !important;">
      <span style="color:#ffffff !important; font-weight:800; text-decoration:none !important;">${SAFE_EMAIL}</span>
    </a>
  `;

  const content =
    locale === "es"
      ? `
        <p style="margin:0; font-size:18px; line-height:1.75; color:#eee6d8;">
          Hola ✨
        </p>

        <p style="margin:24px 0 0; font-size:17px; line-height:1.75; color:#eee6d8;">
          Tu pago se ha procesado correctamente.
        </p>

        <p style="margin:22px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Ahora solo queda completar el <strong style="color:#f4d77b;">ÚLTIMO PASO</strong> para acceder al espacio privado:
        </p>

        <div style="margin:28px 0; padding:24px; border:1px solid rgba(215,184,93,0.28); background:rgba(215,184,93,0.07); border-radius:18px;">
          <p style="margin:0; font-size:16px; line-height:1.7; color:#f4d77b; font-weight:800;">
            ✨ ACCESO AL ESPACIO PRIVADO:
          </p>

          <div style="margin-top:18px;">
            <a href="${PRIVATE_ACCESS_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:15px 22px; border-radius:999px; background:#f4d77b; color:#2f250d; font-size:14px; line-height:1; font-weight:800; text-decoration:none;">
              Entrar al espacio privado
            </a>
          </div>
        </div>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#f4d77b; font-weight:800;">
          1. REGÍSTRATE
        </p>

        <p style="margin:8px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Cuando entres, regístrate utilizando tu nombre y tu email.
        </p>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#f4d77b; font-weight:800;">
          2. ESPERA LA APROBACIÓN
        </p>

        <p style="margin:8px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Después del registro, tu acceso quedará pendiente de aprobación manual.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Las solicitudes se revisan en horario de España.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Si realizas el registro después de las 22:00 h (España), la aprobación podrá realizarse al día siguiente.
        </p>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#f4d77b; font-weight:800;">
          3. MUY IMPORTANTE
        </p>

        <p style="margin:8px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Agrega este correo a tu lista de correos seguros para recibir correctamente todas las comunicaciones:
        </p>

        <p style="margin:14px 0 0; font-size:17px; line-height:1.75; color:#ffffff !important; font-weight:800;">
          ${safeEmailHtml}
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Y recuerda revisar también tu carpeta de spam o promociones.
        </p>

        <p style="margin:32px 0 0; font-size:16px; line-height:1.75; color:#eee6d8;">
          Gracias por formar parte de esta transformación 🤍
        </p>

        <p style="margin:24px 0 0; font-size:16px; line-height:1.75; color:#eee6d8;">
          Nos vemos dentro,
        </p>

        <p style="margin:4px 0 0; font-size:17px; line-height:1.75; color:#f4d77b; font-weight:800;">
          Lily Camarena
        </p>
      `
      : `
        <p style="margin:0; font-size:18px; line-height:1.75; color:#eee6d8;">
          Hello ✨
        </p>

        <p style="margin:24px 0 0; font-size:17px; line-height:1.75; color:#eee6d8;">
          Your payment has been processed successfully.
        </p>

        <p style="margin:22px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          There is only one <strong style="color:#f4d77b;">FINAL STEP</strong> left to access the private space:
        </p>

        <div style="margin:28px 0; padding:24px; border:1px solid rgba(215,184,93,0.28); background:rgba(215,184,93,0.07); border-radius:18px;">
          <p style="margin:0; font-size:16px; line-height:1.7; color:#f4d77b; font-weight:800;">
            ✨ PRIVATE SPACE ACCESS:
          </p>

          <div style="margin-top:18px;">
            <a href="${PRIVATE_ACCESS_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:15px 22px; border-radius:999px; background:#f4d77b; color:#2f250d; font-size:14px; line-height:1; font-weight:800; text-decoration:none;">
              Enter the private space
            </a>
          </div>
        </div>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#f4d77b; font-weight:800;">
          1. REGISTER
        </p>

        <p style="margin:8px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Register using your name and email.
        </p>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#f4d77b; font-weight:800;">
          2. WAIT FOR APPROVAL
        </p>

        <p style="margin:8px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          After registering, your access will remain pending manual approval.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Requests are reviewed during Spanish working hours.
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          If you register after 10:00 PM in Spain, approval may be completed the following day.
        </p>

        <p style="margin:26px 0 0; font-size:16px; line-height:1.75; color:#f4d77b; font-weight:800;">
          3. VERY IMPORTANT
        </p>

        <p style="margin:8px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Add this email to your safe sender list to receive all communications correctly:
        </p>

        <p style="margin:14px 0 0; font-size:17px; line-height:1.75; color:#ffffff !important; font-weight:800;">
          ${safeEmailHtml}
        </p>

        <p style="margin:14px 0 0; font-size:16px; line-height:1.75; color:#d8cfbf;">
          Please also check your spam or promotions folder.
        </p>

        <p style="margin:32px 0 0; font-size:16px; line-height:1.75; color:#eee6d8;">
          Thank you for being part of this transformation 🤍
        </p>

        <p style="margin:24px 0 0; font-size:16px; line-height:1.75; color:#eee6d8;">
          See you inside,
        </p>

        <p style="margin:4px 0 0; font-size:17px; line-height:1.75; color:#f4d77b; font-weight:800;">
          Lily Camarena
        </p>
      `;

  const result = await resend.emails.send({
    from,
    to: email,
    subject,
    html: getEmailShell({
      title: subject,
      preview,
      content
    })
  });

  if (result.error) {
    console.error("Resend paid access email failed:", result.error);
    throw new Error(result.error.message || "Resend email failed");
  }

  console.log("Resend paid access email accepted:", {
    email,
    messageId: result.data?.id
  });

  return result;
}
