"use client";

import { useState } from "react";
import type { ChallengeCopy } from "@/config/challenge";

type LeadFormProps = {
  copy: ChallengeCopy;
};

export function LeadForm({ copy }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      locale: copy.locale,
      challengeSlug: copy.slug,
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      city: String(formData.get("city") || ""),
      country: String(formData.get("country") || ""),
      donationAmount: String(formData.get("donationAmount") || ""),
      paymentMethod: String(formData.get("paymentMethod") || ""),
      privacyAccepted: formData.get("privacyAccepted") === "on"
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage(copy.form.successText);
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage(copy.form.errorText);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel pattern-card grid gap-7 rounded-xl p-8 md:p-10">
      <div>
        <h3 className="font-serif text-3xl text-linen">{copy.form.title}</h3>
        <p className="mt-3 text-muted">{copy.form.text}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <input className="input-line" name="fullName" placeholder={copy.form.fullName} required />
        <input className="input-line" name="email" type="email" placeholder={copy.form.email} required />
        <input className="input-line" name="phone" placeholder={copy.form.phone} required />
        <input className="input-line" name="city" placeholder={copy.form.city} />
        <input className="input-line" name="country" placeholder={copy.form.country} />
        <select className="input-line" name="donationAmount" defaultValue="7€" required>
          {copy.donation.options.map((option) => (
            <option key={option.amount} value={option.amount} className="bg-charcoal text-linen">
              {option.amount} · {option.label}
            </option>
          ))}
        </select>
      </div>

      <select className="input-line" name="paymentMethod" defaultValue="stripe" required>
        <option value="stripe" className="bg-charcoal text-linen">Stripe</option>
        <option value="sumup" className="bg-charcoal text-linen">SumUp</option>
      </select>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input name="privacyAccepted" type="checkbox" required className="mt-1 accent-[#f2ca50]" />
        <span>{copy.form.privacy}</span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-glow rounded bg-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "..." : copy.form.submit}
      </button>

      {message && (
        <div className={`rounded-lg border px-5 py-4 text-sm ${status === "success" ? "border-champagne/30 text-champagne" : "border-red-300/30 text-red-200"}`}>
          <strong>{status === "success" ? copy.form.successTitle : "Error"}</strong>
          <p className="mt-1 text-muted">{message}</p>
        </div>
      )}
    </form>
  );
}
