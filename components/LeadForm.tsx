"use client";

import { useState } from "react";
import type { ChallengeCopy } from "@/config/challenge";

type LeadFormProps = {
  copy: ChallengeCopy;
};

type FormStatus = "idle" | "loading" | "success" | "error";

export function LeadForm({ copy }: LeadFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setStatus("loading");
    setMessage("");

    const formData = new FormData(form);

    const payload = {
      locale: copy.locale,
      challengeSlug: copy.slug,
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      country: String(formData.get("country") || "").trim(),
      donationAmount: String(formData.get("donationAmount") || "7€").trim(),
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

        <input
          className="input-line text-base"
          name="phone"
          placeholder={copy.form.phone}
          required
          minLength={5}
          autoComplete="tel"
        />

        <input
          className="input-line text-base"
          name="city"
          placeholder={copy.form.city}
          autoComplete="address-level2"
        />

        <input
          className="input-line text-base"
          name="country"
          placeholder={copy.form.country}
          autoComplete="country-name"
        />
      </div>

      <div className="mx-auto mt-9 max-w-2xl">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.28em] text-champagne">
          {copy.form.amount}
        </p>

        <div className="grid gap-3 sm:grid-cols-4">
          {copy.donation.options.map((option, index) => (
            <label
              key={option.amount}
              className="cursor-pointer rounded-2xl border border-champagne/20 bg-black/20 p-4 text-center transition hover:border-champagne/60 hover:bg-champagne/10"
            >
              <input
                type="radio"
                name="donationAmount"
                value={option.amount}
                defaultChecked={index === 0}
                className="sr-only peer"
              />

              <span className="block font-serif text-3xl text-linen peer-checked:text-champagne">
                {option.amount}
              </span>

              <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-muted peer-checked:text-linen">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-muted">
          <input name="privacyAccepted" type="checkbox" required className="mt-1 accent-[#f2ca50]" />
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
