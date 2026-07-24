"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ChallengeCopy } from "@/config/challenge";
import { trackInitiateCheckout } from "@/lib/meta";

type LeadFormProps = { copy: ChallengeCopy };
type FormStatus = "idle" | "loading" | "success" | "error";
type CountryOption = { country: string; dialCode: string };

const FIXED_PRICE_AMOUNT = "$27";
const FIXED_PRICE_VALUE = 27;

const COUNTRY_OPTIONS: CountryOption[] = `Afganistán|+93
Albania|+355
Alemania|+49
Andorra|+376
Antigua y Barbuda|+1-268
Arabia Saudí|+966
Argentina|+54
Armenia|+374
Aruba|+297
Australia|+61
Austria|+43
Azerbaiyán|+994
Bahamas|+1-242
Bangladesh|+880
Barbados|+1-246
Baréin|+973
Bélgica|+32
Belice|+501
Bermudas|+1-441
Bielorrusia|+375
Bolivia|+591
Bonaire|+599
Bosnia y Herzegovina|+387
Brasil|+55
Brunéi|+673
Bulgaria|+359
Bután|+975
Camboya|+855
Canadá|+1
Catar|+974
Chile|+56
China|+86
Chipre|+357
Ciudad del Vaticano|+39
Colombia|+57
Corea del Norte|+850
Corea del Sur|+82
Costa Rica|+506
Croacia|+385
Cuba|+53
Curazao|+599
Dinamarca|+45
Dominica|+1-767
Ecuador|+593
El Salvador|+503
Emiratos Árabes Unidos|+971
Eslovaquia|+421
Eslovenia|+386
España|+34
Estados Unidos|+1
Estonia|+372
Fiji|+679
Filipinas|+63
Finlandia|+358
Francia|+33
Georgia|+995
Gibraltar|+350
Granada|+1-473
Grecia|+30
Groenlandia|+299
Guadalupe|+590
Guam|+1-671
Guatemala|+502
Guayana Francesa|+594
Guyana|+592
Haití|+509
Honduras|+504
Hong Kong|+852
Hungría|+36
India|+91
Indonesia|+62
Irak|+964
Irán|+98
Irlanda|+353
Isla Norfolk|+672
Islandia|+354
Islas Caimán|+1-345
Islas Cook|+682
Islas Feroe|+298
Islas Malvinas|+500
Islas Marianas del Norte|+1-670
Islas Marshall|+692
Islas Salomón|+677
Islas Turcas y Caicos|+1-649
Islas Vírgenes Británicas|+1-284
Islas Vírgenes de EE. UU.|+1-340
Israel|+972
Italia|+39
Jamaica|+1-876
Japón|+81
Jordania|+962
Kazajistán|+7
Kirguistán|+996
Kiribati|+686
Kosovo|+383
Kuwait|+965
Laos|+856
Letonia|+371
Líbano|+961
Liechtenstein|+423
Lituania|+370
Luxemburgo|+352
Macao|+853
Macedonia del Norte|+389
Malasia|+60
Maldivas|+960
Malta|+356
Martinica|+596
México|+52
Micronesia|+691
Moldavia|+373
Mónaco|+377
Mongolia|+976
Montenegro|+382
Montserrat|+1-664
Myanmar|+95
Nauru|+674
Nepal|+977
Nicaragua|+505
Niue|+683
Noruega|+47
Nueva Caledonia|+687
Nueva Zelanda|+64
Omán|+968
Otro|+
Países Bajos|+31
Pakistán|+92
Palaos|+680
Palestina|+970
Panamá|+507
Papúa Nueva Guinea|+675
Paraguay|+595
Perú|+51
Polinesia Francesa|+689
Polonia|+48
Portugal|+351
Puerto Rico|+1-787
Reino Unido|+44
República Checa|+420
República Dominicana|+1-809
Rumanía|+40
Rusia|+7
Samoa|+685
Samoa Americana|+1-684
San Bartolomé|+590
San Cristóbal y Nieves|+1-869
San Marino|+378
San Martín|+590
San Pedro y Miquelón|+508
San Vicente y las Granadinas|+1-784
Santa Lucía|+1-758
Serbia|+381
Singapur|+65
Sint Maarten|+1-721
Siria|+963
Sri Lanka|+94
Suecia|+46
Suiza|+41
Surinam|+597
Tailandia|+66
Taiwán|+886
Tayikistán|+992
Timor Oriental|+670
Tokelau|+690
Tonga|+676
Trinidad y Tobago|+1-868
Turkmenistán|+993
Turquía|+90
Tuvalu|+688
Ucrania|+380
Uruguay|+598
Uzbekistán|+998
Vanuatu|+678
Venezuela|+58
Vietnam|+84
Wallis y Futuna|+681
Yemen|+967`
  .split("\n")
  .map((line) => {
    const [country, dialCode] = line.split("|");
    return { country, dialCode };
  });

function getOptionId(option: CountryOption) {
  return `${option.country}__${option.dialCode}`;
}

function getOptionById(optionId: string) {
  return COUNTRY_OPTIONS.find((option) => getOptionId(option) === optionId) || COUNTRY_OPTIONS[0];
}

export function LeadForm({ copy }: LeadFormProps) {
  const defaultCountryOption = COUNTRY_OPTIONS.find((option) => option.country === "España") || COUNTRY_OPTIONS[0];
  const privacyHref = `/${copy.locale}/legal/privacidad`;
  const termsHref = `/${copy.locale}/legal/terminos`;
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(defaultCountryOption.country);
  const [selectedDialOptionId, setSelectedDialOptionId] = useState(getOptionId(defaultCountryOption));

  function handleCountryChange(event: ChangeEvent<HTMLSelectElement>) {
    const option = COUNTRY_OPTIONS.find((item) => item.country === event.target.value) || defaultCountryOption;
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
    const payload = {
      locale: copy.locale,
      challengeSlug: copy.slug,
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: `${selectedDialOption.dialCode} ${phoneNumber}`.trim(),
      city: String(formData.get("city") || "").trim(),
      country: selectedCountry,
      donationAmount: FIXED_PRICE_AMOUNT,
      paymentMethod: "stripe",
      privacyAccepted: formData.get("privacyAccepted") === "on",
    };

    try {
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const leadResult = await leadResponse.json().catch(() => null);
      if (!leadResponse.ok || leadResult?.ok !== true || !leadResult?.leadId) {
        throw new Error(leadResult?.error || "Could not register lead");
      }

      setStatus("success");
      setMessage(copy.locale === "es" ? "Solicitud recibida. Te estamos llevando a la página segura de pago." : "Request received. We are taking you to the secure payment page.");

      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: leadResult.leadId, locale: copy.locale, challengeSlug: copy.slug }),
      });
      const checkoutResult = await checkoutResponse.json().catch(() => null);
      if (!checkoutResponse.ok || checkoutResult?.ok !== true || !checkoutResult?.url) {
        throw new Error(checkoutResult?.error || "Could not create checkout session");
      }

      trackInitiateCheckout({ value: FIXED_PRICE_VALUE, currency: "USD", contentName: "Reto Lily 3 días" });
      window.location.href = checkoutResult.url;
    } catch (error) {
      console.error("Lead form checkout error:", error);
      setStatus("error");
      setMessage(copy.locale === "es" ? "No hemos podido abrir la página de pago. Revisa los datos e inténtalo de nuevo." : "We could not open the payment page. Please review your details and try again.");
    }
  }

  const annualAccessText = copy.locale === "es"
    ? "✔ Tendrás acceso a los 3 días del recorrido durante 1 año."
    : "✔ Access available for 1 year";

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#b78a3d]/25 bg-[#fffaf1]/92 p-6 shadow-[0_28px_90px_rgba(82,55,24,0.16)] backdrop-blur md:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#8a6428]">Acceso privado</p>
        <h3 className="mt-5 font-serif text-4xl leading-tight text-[#2d2118] md:text-6xl">{copy.form.title}</h3>
        <p className="mt-5 text-lg leading-8 text-[#6c5a49]">{copy.form.text}</p>
      </div>

      <div className="mx-auto mt-9 max-w-2xl rounded-[1.6rem] border border-[#b78a3d]/25 bg-[#f3e5cf]/80 p-6 text-center shadow-[0_18px_55px_rgba(82,55,24,0.10)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8a6428]">Acceso al reto</p>
        <div className="mt-3 font-serif text-6xl leading-none text-[#2d2118] md:text-7xl">{FIXED_PRICE_AMOUNT}</div>
        <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left text-base font-semibold leading-7 text-[#4a3524]">
          <p className="rounded-2xl border border-[#b78a3d]/20 bg-white/55 px-5 py-4">✔ Acceso online al reto completo de 3 días</p>
          <p className="rounded-2xl border border-[#b78a3d]/20 bg-white/55 px-5 py-4">✔ Acceso inmediato tras la inscripción</p>
          <p className="rounded-2xl border border-[#b78a3d]/20 bg-white/55 px-5 py-4">{annualAccessText}</p>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-5">
        <input className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] placeholder:text-[#8a7a68] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15" name="fullName" placeholder={copy.form.fullName} required minLength={2} autoComplete="name" />
        <input className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] placeholder:text-[#8a7a68] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15" name="email" type="email" placeholder={copy.form.email} required autoComplete="email" />
        <div className="grid gap-5 md:grid-cols-[0.82fr_1.18fr]">
          <select className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15" name="country" value={selectedCountry} onChange={handleCountryChange} required autoComplete="country-name">
            {COUNTRY_OPTIONS.map((option) => <option key={getOptionId(option)} value={option.country} className="bg-[#fffaf1] text-[#2d2118]">{option.country}</option>)}
          </select>
          <input className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] placeholder:text-[#8a7a68] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15" name="city" placeholder={copy.form.city} autoComplete="address-level2" />
        </div>
        <div className="grid gap-5 md:grid-cols-[0.48fr_1.52fr]">
          <select className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15" name="dialCode" value={selectedDialOptionId} onChange={(event) => setSelectedDialOptionId(event.target.value)} required autoComplete="tel-country-code">
            {COUNTRY_OPTIONS.map((option) => <option key={getOptionId(option)} value={getOptionId(option)} className="bg-[#fffaf1] text-[#2d2118]">{option.dialCode} · {option.country}</option>)}
          </select>
          <input className="rounded-2xl border border-[#b78a3d]/25 bg-white/70 px-5 py-4 text-base text-[#2d2118] placeholder:text-[#8a7a68] outline-none transition focus:border-[#b78a3d] focus:bg-white focus:ring-4 focus:ring-[#b78a3d]/15" name="phone" placeholder={copy.form.phone} required minLength={5} autoComplete="tel-national" inputMode="tel" />
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <label className="flex items-start gap-3 rounded-2xl border border-[#b78a3d]/20 bg-white/55 p-5 text-sm leading-6 text-[#5f4b3a] shadow-[0_12px_35px_rgba(82,55,24,0.08)]">
          <input name="privacyAccepted" type="checkbox" required className="mt-1 accent-[#b78a3d]" />
          <span>{copy.locale === "es" ? <>Acepto la <a href={privacyHref} target="_blank" rel="noreferrer" className="font-semibold text-[#8a6428] underline decoration-[#b78a3d]/40 underline-offset-4 transition hover:text-[#5a2d22]">Política de privacidad</a> y los <a href={termsHref} target="_blank" rel="noreferrer" className="font-semibold text-[#8a6428] underline decoration-[#b78a3d]/40 underline-offset-4 transition hover:text-[#5a2d22]">Términos y condiciones</a>.</> : <>I accept the <a href={privacyHref} target="_blank" rel="noreferrer" className="font-semibold text-[#8a6428] underline">Privacy Policy</a> and the <a href={termsHref} target="_blank" rel="noreferrer" className="font-semibold text-[#8a6428] underline">Terms and Conditions</a>.</>}</span>
        </label>
      </div>

      <div className="mx-auto mt-8 max-w-2xl text-center">
        <button type="submit" disabled={status === "loading"} className="w-full rounded bg-[#b78a3d] px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-white shadow-[0_16px_45px_rgba(183,138,61,0.28)] transition hover:bg-[#9a6f2d] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[360px]">{status === "loading" ? "Preparando pago..." : copy.form.submit}</button>
        <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-6 text-[#6c5a49]">Después de enviar tus datos, te llevaremos a la página segura de Stripe para completar tu acceso.</p>
      </div>

      {message ? <div className={`mx-auto mt-8 max-w-2xl rounded-2xl border px-6 py-5 text-center text-sm shadow-[0_12px_35px_rgba(82,55,24,0.08)] ${status === "success" ? "border-[#b78a3d]/30 bg-[#f3e5cf] text-[#4a3524]" : "border-red-300/60 bg-red-50 text-red-800"}`}><strong>{status === "success" ? copy.form.successTitle : "Error"}</strong><p className="mt-2 text-[#5f4b3a]">{message}</p></div> : null}
    </form>
  );
}
