"use client";

import { useState } from "react";
import type { ChallengeCopy } from "@/config/challenge";

type LeadFormProps = {
  copy: ChallengeCopy;
};

type FormStatus = "idle" | "loading" | "success" | "error";

type CountryOption = {
  country: string;
  dialCode: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { country: "España", dialCode: "+34" },
  { country: "Estados Unidos", dialCode: "+1" },
  { country: "Canadá", dialCode: "+1" },
  { country: "México", dialCode: "+52" },
  { country: "Colombia", dialCode: "+57" },
  { country: "Argentina", dialCode: "+54" },
  { country: "Chile", dialCode: "+56" },
  { country: "Perú", dialCode: "+51" },
  { country: "Ecuador", dialCode: "+593" },
  { country: "Venezuela", dialCode: "+58" },
  { country: "Uruguay", dialCode: "+598" },
  { country: "Paraguay", dialCode: "+595" },
  { country: "Bolivia", dialCode: "+591" },
  { country: "Costa Rica", dialCode: "+506" },
  { country: "Panamá", dialCode: "+507" },
  { country: "República Dominicana", dialCode: "+1" },
  { country: "Puerto Rico", dialCode: "+1" },
  { country: "Reino Unido", dialCode: "+44" },
  { country: "Portugal", dialCode: "+351" },
  { country: "Francia", dialCode: "+33" },
  { country: "Italia", dialCode: "+39" },
  { country: "Alemania", dialCode: "+49" },
  { country: "Otro", dialCode: "+" }
];

export function LeadForm({ copy }: LeadFormProps) {
  const firstDonationOption = copy.donation.options[0]?.amount || "7€";

  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(firstDonationOption);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0].country);
  const [selectedDialCode, setSelectedDialCode] = useState(COUNTRY_OPTIONS[0].dialCode);

  function handleCountryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const country = event.target.value;
    const option = COUNTRY_OPTIONS.find((item) => item.country === country);

    setSelectedCountry(country);

    if (option) {
      setSelectedDialCode(option.dialCode);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setStatus("loading");
    setMessage("");

    const formData = new FormData(form);

    const phoneNumber = String(formData.get("phone") || "").trim();
    const cleanDialCode = selectedDialCode.trim();
    const fullPhone = `${cleanDialCode} ${phoneNumber}`.trim();

    const payload = {
      locale: copy.locale,
      challengeSlug: copy.slug,
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: fullPhone,
      city: String(formData.get("city") || "").trim(),
      country: selectedCountry,
      donationAmount: selectedAmount,
      paymentMethod: "sumup",
      privacyAccepted: formData.get("privacyAccepted") === "on"
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.error || "Request failed");
      }

      setStatus("success");
      setMessage(copy.form.successText);
      form.reset();
      setSelectedAmount(firstDonationOption);
      setSelectedCountry(COUNTRY_OPTIONS[0].country);
      setSelectedDialCode(COUNTRY_OPTIONS[0].dialCode);
    } catch (error) {
      console.error("Lead form error:", error);
      setStatus("error");
      setMessage(copy.form.errorText);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel pattern-card rounded-[2rem] border-champagne/35 p-6 shadow-glow md:p-10"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-champagne">
          Acceso privado
        </p>

        <h3 className="mt-5 font-serif text-4xl leading-tight text-linen md:text-6xl">
          {copy.form.title}
        </h3>

        <p className="mt-5 text-lg leading-8 text-muted">
          {copy.form.text}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-5">
        <input
          className="input-line text-base"
          name="fullName"
          placeholder={copy.form.fullName}
          required
          minLength={2}
          autoComplete="name"
        />

        <input
          className="input-line text-base"
          name="email"
          type="email"
          placeholder={copy.form.email}
          required
          autoComplete="email"
        />

        <div className="grid gap-5 md:grid-cols-[0.82fr_1.18fr]">
          <select
            className="input-line text-base"
            name="country"
            value={selectedCountry}
            onChange={handleCountryChange}
            required
            autoComplete="country-name"
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option
                key={option.country}
                value={option.country}
                className="bg-charcoal text-linen"
              >
                {option.country}
              </option>
            ))}
          </select>

          <input
            className="input-line text-base"
            name="city"
            placeholder={copy.form.city}
            autoComplete="address-level2"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-[0.38fr_1.62fr]">
          <select
            className="input-line text-base"
            name="dialCode"
            value={selectedDialCode}
            onChange={(event) => setSelectedDialCode(event.target.value)}
            required
            autoComplete="tel-country-code"
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option
                key={`${option.country}-${option.dialCode}`}
                value={option.dialCode}
                className="bg-charcoal text-linen"
              >
                {option.dialCode} · {option.country}
              </option>
            ))}
          </select>

          <input
            className="input-line text-base"
            name="phone"
            placeholder={copy.form.phone}
            required
            minLength={5}
            autoComplete="tel-national"
            inputMode="tel"
          />
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-2xl">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.28em] text-champagne">
          {copy.form.amount}
        </p>

        <div className="grid gap-3 sm:grid-cols-4">
          {copy.donation.options.map((option, index) => {
            const isSelected = selectedAmount === option.amount;

            return (
              <label
                key={option.amount}
                className={`cursor-pointer rounded-2xl border p-4 text-center transition duration-300 ${
                  isSelected
                    ? "border-champagne bg-champagne/18 shadow-glow"
                    : "border-champagne/20 bg-black/20 hover:border-champagne/60 hover:bg-champagne/10"
                }`}
              >
                <input
                  type="radio"
                  name="donationAmount"
                  value={option.amount}
                  defaultChecked={index === 0}
                  onChange={() => setSelectedAmount(option.amount)}
                  className="sr-only"
                />

                <span
                  className={`block font-serif text-3xl transition ${
                    isSelected ? "text-champagne" : "text-linen"
                  }`}
                >
                  {option.amount}
                </span>

                <span
                  className={`mt-2 block text-[10px] font-bold uppercase tracking-[0.16em] transition ${
                    isSelected ? "text-linen" : "text-muted"
                  }`}
                >
                  {option.label}
                </span>

                {isSelected ? (
                  <span className="mt-3 block text-[10px] font-black uppercase tracking-[0.18em] text-champagne">
                    Seleccionado
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-muted">
          <input
            name="privacyAccepted"
            type="checkbox"
            required
            className="mt-1 accent-[#f2ca50]"
          />
          <span>{copy.form.privacy}</span>
        </label>
      </div>

      <div className="mx-auto mt-8 max-w-2xl text-center">
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-glow w-full rounded bg-gold px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[360px]"
        >
          {status === "loading" ? "Enviando..." : copy.form.submit}
        </button>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted">
          Después de confirmar tus datos recibirás el acceso para completar tu aportación.
        </p>
      </div>

      {message && (
        <div
          className={`mx-auto mt-8 max-w-2xl rounded-2xl border px-6 py-5 text-center text-sm ${
            status === "success"
              ? "border-champagne/30 bg-champagne/5 text-champagne"
              : "border-red-300/30 bg-red-500/5 text-red-200"
          }`}
        >
          <strong>{status === "success" ? copy.form.successTitle : "Error"}</strong>
          <p className="mt-2 text-muted">{message}</p>
        </div>
      )}
    </form>
  );
}
