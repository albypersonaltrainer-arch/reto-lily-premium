"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ChallengeCopy } from "@/config/challenge";
import { trackInitiateCheckout } from "@/lib/meta";

type LeadFormProps = {
  copy: ChallengeCopy;
};

type FormStatus = "idle" | "loading" | "success" | "error";

type CountryOption = {
  country: string;
  dialCode: string;
};

const FIXED_PRICE_AMOUNT = "$27";
const FIXED_PRICE_VALUE = 27;

const COUNTRY_OPTIONS: CountryOption[] = [
  { country: "Afganistán", dialCode: "+93" },
  { country: "Albania", dialCode: "+355" },
  { country: "Alemania", dialCode: "+49" },
  { country: "Andorra", dialCode: "+376" },
  { country: "Antigua y Barbuda", dialCode: "+1-268" },
  { country: "Arabia Saudí", dialCode: "+966" },
  { country: "Argentina", dialCode: "+54" },
  { country: "Armenia", dialCode: "+374" },
  { country: "Aruba", dialCode: "+297" },
  { country: "Australia", dialCode: "+61" },
  { country: "Austria", dialCode: "+43" },
  { country: "Azerbaiyán", dialCode: "+994" },
  { country: "Bahamas", dialCode: "+1-242" },
  { country: "Bangladesh", dialCode: "+880" },
  { country: "Barbados", dialCode: "+1-246" },
  { country: "Baréin", dialCode: "+973" },
  { country: "Bélgica", dialCode: "+32" },
  { country: "Belice", dialCode: "+501" },
  { country: "Bermudas", dialCode: "+1-441" },
  { country: "Bielorrusia", dialCode: "+375" },
  { country: "Bolivia", dialCode: "+591" },
  { country: "Bonaire", dialCode: "+599" },
  { country: "Bosnia y Herzegovina", dialCode: "+387" },
  { country: "Brasil", dialCode: "+55" },
  { country: "Brunéi", dialCode: "+673" },
  { country: "Bulgaria", dialCode: "+359" },
  { country: "Bután", dialCode: "+975" },
  { country: "Camboya", dialCode: "+855" },
  { country: "Canadá", dialCode: "+1" },
  { country: "Catar", dialCode: "+974" },
  { country: "Chile", dialCode: "+56" },
  { country: "China", dialCode: "+86" },
  { country: "Chipre", dialCode: "+357" },
  { country: "Ciudad del Vaticano", dialCode: "+39" },
  { country: "Colombia", dialCode: "+57" },
  { country: "Corea del Norte", dialCode: "+850" },
  { country: "Corea del Sur", dialCode: "+82" },
  { country: "Costa Rica", dialCode: "+506" },
  { country: "Croacia", dialCode: "+385" },
  { country: "Cuba", dialCode: "+53" },
  { country: "Curazao", dialCode: "+599" },
  { country: "Dinamarca", dialCode: "+45" },
  { country: "Dominica", dialCode: "+1-767" },
  { country: "Ecuador", dialCode: "+593" },
  { country: "El Salvador", dialCode: "+503" },
  { country: "Emiratos Árabes Unidos", dialCode: "+971" },
  { country: "Eslovaquia", dialCode: "+421" },
  { country: "Eslovenia", dialCode: "+386" },
  { country: "España", dialCode: "+34" },
  { country: "Estados Unidos", dialCode: "+1" },
  { country: "Estonia", dialCode: "+372" },
  { country: "Fiji", dialCode: "+679" },
  { country: "Filipinas", dialCode: "+63" },
  { country: "Finlandia", dialCode: "+358" },
  { country: "Francia", dialCode: "+33" },
  { country: "Georgia", dialCode: "+995" },
  { country: "Gibraltar", dialCode: "+350" },
  { country: "Granada", dialCode: "+1-473" },
  { country: "Grecia", dialCode: "+30" },
  { country: "Groenlandia", dialCode: "+299" },
  { country: "Guadalupe", dialCode: "+590" },
  { country: "Guam", dialCode: "+1-671" },
  { country: "Guatemala", dialCode: "+502" },
  { country: "Guayana Francesa", dialCode: "+594" },
  { country: "Guyana", dialCode: "+592" },
  { country: "Haití", dialCode: "+509" },
  { country: "Honduras", dialCode: "+504" },
  { country: "Hong Kong", dialCode: "+852" },
  { country: "Hungría", dialCode: "+36" },
  { country: "India", dialCode: "+91" },
  { country: "Indonesia", dialCode: "+62" },
  { country: "Irak", dialCode: "+964" },
  { country: "Irán", dialCode: "+98" },
  { country: "Irlanda", dialCode: "+353" },
  { country: "Isla Norfolk", dialCode: "+672" },
  { country: "Islandia", dialCode: "+354" },
  { country: "Islas Caimán", dialCode: "+1-345" },
  { country: "Islas Cook", dialCode: "+682" },
  { country: "Islas Feroe", dialCode: "+298" },
  { country: "Islas Malvinas", dialCode: "+500" },
  { country: "Islas Marianas del Norte", dialCode: "+1-670" },
  { country: "Islas Marshall", dialCode: "+692" },
  { country: "Islas Salomón", dialCode: "+677" },
  { country: "Islas Turcas y Caicos", dialCode: "+1-649" },
  { country: "Islas Vírgenes Británicas", dialCode: "+1-284" },
  { country: "Islas Vírgenes de EE. UU.", dialCode: "+1-340" },
  { country: "Israel", dialCode: "+972" },
  { country: "Italia", dialCode: "+39" },
  { country: "Jamaica", dialCode: "+1-876" },
  { country: "Japón", dialCode: "+81" },
  { country: "Jordania", dialCode: "+962" },
  { country: "Kazajistán", dialCode: "+7" },
  { country: "Kirguistán", dialCode: "+996" },
  { country: "Kiribati", dialCode: "+686" },
  { country: "Kosovo", dialCode: "+383" },
  { country: "Kuwait", dialCode: "+965" },
  { country: "Laos", dialCode: "+856" },
  { country: "Letonia", dialCode: "+371" },
  { country: "Líbano", dialCode: "+961" },
  { country: "Liechtenstein", dialCode: "+423" },
  { country: "Lituania", dialCode: "+370" },
  { country: "Luxemburgo", dialCode: "+352" },
  { country: "Macao", dialCode: "+853" },
  { country: "Macedonia del Norte", dialCode: "+389" },
  { country: "Malasia", dialCode: "+60" },
  { country: "Maldivas", dialCode: "+960" },
  { country: "Malta", dialCode: "+356" },
  { country: "Martinica", dialCode: "+596" },
  { country: "México", dialCode: "+52" },
  { country: "Micronesia", dialCode: "+691" },
  { country: "Moldavia", dialCode: "+373" },
  { country: "Mónaco", dialCode: "+377" },
  { country: "Mongolia", dialCode: "+976" },
  { country: "Montenegro", dialCode: "+382" },
  { country: "Montserrat", dialCode: "+1-664" },
  { country: "Myanmar", dialCode: "+95" },
  { country: "Nauru", dialCode: "+674" },
  { country: "Nepal", dialCode: "+977" },
  { country: "Nicaragua", dialCode: "+505" },
  { country: "Niue", dialCode: "+683" },
  { country: "Noruega", dialCode: "+47" },
  { country: "Nueva Caledonia", dialCode: "+687" },
  { country: "Nueva Zelanda", dialCode: "+64" },
  { country: "Omán", dialCode: "+968" },
  { country: "Otro", dialCode: "+" },
  { country: "Países Bajos", dialCode: "+31" },
  { country: "Pakistán", dialCode: "+92" },
  { country: "Palaos", dialCode: "+680" },
  { country: "Palestina", dialCode: "+970" },
  { country: "Panamá", dialCode: "+507" },
  { country: "Papúa Nueva Guinea", dialCode: "+675" },
  { country: "Paraguay", dialCode: "+595" },
  { country: "Perú", dialCode: "+51" },
  { country: "Polinesia Francesa", dialCode: "+689" },
  { country: "Polonia", dialCode: "+48" },
  { country: "Portugal", dialCode: "+351" },
  { country: "Puerto Rico", dialCode: "+1-787" },
  { country: "Reino Unido", dialCode: "+44" },
  { country: "República Checa", dialCode: "+420" },
  { country: "República Dominicana", dialCode: "+1-809" },
  { country: "Rumanía", dialCode: "+40" },
  { country: "Rusia", dialCode: "+7" },
  { country: "Samoa", dialCode: "+685" },
  { country: "Samoa Americana", dialCode: "+1-684" },
  { country: "San Bartolomé", dialCode: "+590" },
  { country: "San Cristóbal y Nieves", dialCode: "+1-869" },
  { country: "San Marino", dialCode: "+378" },
  { country: "San Martín", dialCode: "+590" },
  { country: "San Pedro y Miquelón", dialCode: "+508" },
  { country: "San Vicente y las Granadinas", dialCode: "+1-784" },
  { country: "Santa Lucía", dialCode: "+1-758" },
  { country: "Serbia", dialCode: "+381" },
  { country: "Singapur", dialCode: "+65" },
  { country: "Sint Maarten", dialCode: "+1-721" },
  { country: "Siria", dialCode: "+963" },
  { country: "Sri Lanka", dialCode: "+94" },
  { country: "Suecia", dialCode: "+46" },
  { country: "Suiza", dialCode: "+41" },
  { country: "Surinam", dialCode: "+597" },
  { country: "Tailandia", dialCode: "+66" },
  { country: "Taiwán", dialCode: "+886" },
  { country: "Tayikistán", dialCode: "+992" },
  { country: "Timor Oriental", dialCode: "+670" },
  { country: "Tokelau", dialCode: "+690" },
  { country: "Tonga", dialCode: "+676" },
  { country: "Trinidad y Tobago", dialCode: "+1-868" },
  { country: "Turkmenistán", dialCode: "+993" },
  { country: "Turquía", dialCode: "+90" },
  { country: "Tuvalu", dialCode: "+688" },
  { country: "Ucrania", dialCode: "+380" },
  { country: "Uruguay", dialCode: "+598" },
  { country: "Uzbekistán", dialCode: "+998" },
  { country: "Vanuatu", dialCode: "+678" },
  { country: "Venezuela", dialCode: "+58" },
  { country: "Vietnam", dialCode: "+84" },
  { country: "Wallis y Futuna", dialCode: "+681" },
  { country: "Yemen", dialCode: "+967" },
];


function getOptionId(option: CountryOption) {
  return `${option.country}__${option.dialCode}`;
}

function getOptionById(optionId: string) {
  return (
    COUNTRY_OPTIONS.find((option) => getOptionId(option) === optionId) ||
    COUNTRY_OPTIONS[0]
  );
}

export function LeadForm({ copy }: LeadFormProps) {
  const defaultCountryOption =
    COUNTRY_OPTIONS.find((option) => option.country === "España") ||
    COUNTRY_OPTIONS[0];

  const privacyHref = `/${copy.locale}/legal/privacidad`;
  const termsHref = `/${copy.locale}/legal/terminos`;

  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    defaultCountryOption.country
  );
  const [selectedDialOptionId, setSelectedDialOptionId] = useState(
    getOptionId(defaultCountryOption)
  );

  function handleCountryChange(event: ChangeEvent<HTMLSelectElement>) {
    const country = event.target.value;
    const option =
      COUNTRY_OPTIONS.find((item) => item.country === country) ||
      defaultCountryOption;

    setSelectedCountry(option.country);
    setSelectedDialOptionId(getOptionId(option));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setStatus("loading");
    setMessage("");

    const formData = new FormData(form);

    const selectedDialOption = getOptionById(selectedDialOptionId);
    const phoneNumber = String(formData.get("phone") || "").trim();
    const fullPhone = `${selectedDialOption.dialCode} ${phoneNumber}`.trim();

    const payload = {
      locale: copy.locale,
      challengeSlug: copy.slug,
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: fullPhone,
      city: String(formData.get("city") || "").trim(),
      country: selectedCountry,
      donationAmount: FIXED_PRICE_AMOUNT,
      paymentMethod: "stripe",
      privacyAccepted: formData.get("privacyAccepted") === "on",
    };

    try {
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const leadResult = await leadResponse.json().catch(() => null);

      if (!leadResponse.ok || leadResult?.ok !== true || !leadResult?.leadId) {
        throw new Error(leadResult?.error || "Could not register lead");
      }

      setStatus("success");
      setMessage(
        copy.locale === "es"
          ? "Solicitud recibida. Te estamos llevando a la página segura de pago."
          : "Request received. We are taking you to the secure payment page."
      );

      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: leadResult.leadId,
          locale: copy.locale,
          challengeSlug: copy.slug,
        }),
      });

      const checkoutResult = await checkoutResponse.json().catch(() => null);

      if (
        !checkoutResponse.ok ||
        checkoutResult?.ok !== true ||
        !checkoutResult?.url
      ) {
        throw new Error(
          checkoutResult?.error || "Could not create checkout session"
        );
      }

      trackInitiateCheckout({
        value: FIXED_PRICE_VALUE,
        currency: "USD",
        contentName: "Reto Lily 3 días",
      });

      window.location.href = checkoutResult.url;
    } catch (error) {
      console.error("Lead form checkout error:", error);
      setStatus("error");
      setMessage(
        copy.locale === "es"
          ? "No hemos podido abrir la página de pago. Revisa los datos e inténtalo de nuevo."
          : "We could not open the payment page. Please review your details and try again."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-[#b78a3d]/25 bg-[#fffaf1]/92 p-6 shadow-[0_28px_90px_rgba(82,55,24,0.16)] backdrop-blur md:p-10"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#8a6428]">
          Acceso privado
        </p>

        <h3 className="mt-5 font-serif text-4xl leading-tight text-[#2d2118] md:text-6xl">
          {copy.form.title}
        </h3>

        <p className="mt-5 text-lg leading-8 text-[#6c5a49]">{copy.form.text}</p>
      </div>

      <div className="mx-auto mt-9 max-w-2xl rounded-[1.6rem] border border-[#b78a3d]/25 bg-[#f3e5cf]/80 p-6 text-center shadow-[0_18px_55px_rgba(82,55,24,0.10)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8a6428]">
          Acceso al reto
        </p>
        <div className="mt-3 font-serif text-6xl leading-none text-[#2d2118] md:text-7xl">
          {FIXED_PRICE_AMOUNT}
        </div>
        <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left text-base font-semibold leading-7 text-[#4a3524]">
          <p className="rounded-2xl border border-[#b78a3d]/20 bg-white/55 px-5 py-4">
            ✔ Acceso online al reto completo de 3 días
          </p>
          <p className="rounded-2xl border border-[#b78a3d]/20 bg-white/55 px-5 py-4">
            ✔ Acceso inmediato tras la inscripción
          </p>
          <p className="rounded-2xl border border-[#b78a3d]/20 bg-white/55 px-5 py-4">
            ✔ Acceso disponible durante 1 año
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-5">
        <input
          className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] placeholder:text-[#8a7a68] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15"
          name="fullName"
          placeholder={copy.form.fullName}
          required
          minLength={2}
          autoComplete="name"
        />

        <input
          className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] placeholder:text-[#8a7a68] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15"
          name="email"
          type="email"
          placeholder={copy.form.email}
          required
          autoComplete="email"
        />

        <div className="grid gap-5 md:grid-cols-[0.82fr_1.18fr]">
          <select
            className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15"
            name="country"
            value={selectedCountry}
            onChange={handleCountryChange}
            required
            autoComplete="country-name"
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option
                key={getOptionId(option)}
                value={option.country}
                className="bg-[#fffaf1] text-[#2d2118]"
              >
                {option.country}
              </option>
            ))}
          </select>

          <input
            className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] placeholder:text-[#8a7a68] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15"
            name="city"
            placeholder={copy.form.city}
            autoComplete="address-level2"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-[0.48fr_1.52fr]">
          <select
            className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15"
            name="dialCode"
            value={selectedDialOptionId}
            onChange={(event) => setSelectedDialOptionId(event.target.value)}
            required
            autoComplete="tel-country-code"
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option
                key={getOptionId(option)}
                value={getOptionId(option)}
                className="bg-[#fffaf1] text-[#2d2118]"
              >
                {option.dialCode} · {option.country}
              </option>
            ))}
          </select>

          <input
            className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] placeholder:text-[#8a7a68] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15"
            name="phone"
            placeholder={copy.form.phone}
            required
            minLength={5}
            autoComplete="tel-national"
            inputMode="tel"
          />
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <label className="flex items-start gap-3 rounded-2xl border border-[#b78a3d]/20 bg-white/55 p-5 text-sm leading-6 text-[#5f4b3a] shadow-[0_12px_35px_rgba(82,55,24,0.08)]">
          <input
            name="privacyAccepted"
            type="checkbox"
            required
            className="mt-1 accent-[#b78a3d]"
          />
          <span>
            {copy.locale === "es" ? (
              <>
                Acepto la{" "}
                <a
                  href={privacyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#8a6428] underline decoration-[#b78a3d]/40 underline-offset-4 transition hover:text-[#5a2d22]"
                >
                  Política de privacidad
                </a>{" "}
                y los{" "}
                <a
                  href={termsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#8a6428] underline decoration-[#b78a3d]/40 underline-offset-4 transition hover:text-[#5a2d22]"
                >
                  Términos y condiciones
                </a>
                .
              </>
            ) : (
              <>
                I accept the{" "}
                <a
                  href={privacyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#8a6428] underline decoration-[#b78a3d]/40 underline-offset-4 transition hover:text-[#5a2d22]"
                >
                  Privacy Policy
                </a>{" "}
                and the{" "}
                <a
                  href={termsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#8a6428] underline decoration-[#b78a3d]/40 underline-offset-4 transition hover:text-[#5a2d22]"
                >
                  Terms and Conditions
                </a>
                .
              </>
            )}
          </span>
        </label>
      </div>

      <div className="mx-auto mt-8 max-w-2xl text-center">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded bg-[#b78a3d] px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-white shadow-[0_16px_45px_rgba(183,138,61,0.28)] transition hover:bg-[#9a6f2d] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[360px]"
        >
          {status === "loading" ? "Preparando pago..." : copy.form.submit}
        </button>

        <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-6 text-[#6c5a49]">
          Después de enviar tus datos, te llevaremos a la página segura de Stripe
          para completar tu acceso.
        </p>
      </div>

      {message && (
        <div
          className={`mx-auto mt-8 max-w-2xl rounded-2xl border px-6 py-5 text-center text-sm shadow-[0_12px_35px_rgba(82,55,24,0.08)] ${
            status === "success"
              ? "border-[#b78a3d]/30 bg-[#f3e5cf] text-[#4a3524]"
              : "border-red-300/60 bg-red-50 text-red-800"
          }`}
        >
          <strong>
            {status === "success" ? copy.form.successTitle : "Error"}
          </strong>
          <p className="mt-2 text-[#5f4b3a]">{message}</p>
        </div>
      )}
    </form>
  );
}
