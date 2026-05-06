"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmPage({ params }: { params: { locale: "es" | "en" } }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not confirm");
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const isEs = params.locale !== "en";

  return (
    <main className="invisible-pattern-shell flex min-h-screen items-center justify-center px-6 text-center">
      <div className="luxury-noise" />
      <div className="glass-panel max-w-2xl rounded-xl p-10 md:p-14">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-rose/80">{isEs ? "Confirmación" : "Confirmation"}</p>
        <h1 className="mt-5 font-serif text-4xl text-linen md:text-6xl">
          {status === "loading" && (isEs ? "Confirmando tu acceso…" : "Confirming your access…")}
          {status === "success" && (isEs ? "Acceso confirmado" : "Access confirmed")}
          {status === "error" && (isEs ? "No se pudo confirmar" : "Could not confirm")}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          {status === "loading" && (isEs ? "Estamos validando tu solicitud." : "We are validating your request.")}
          {status === "success" && (isEs ? "Te hemos enviado el email definitivo con las instrucciones y enlaces de pago." : "We have sent the final email with instructions and payment links.")}
          {status === "error" && (isEs ? "El enlace no es válido o ya fue utilizado. Escríbenos por WhatsApp si necesitas ayuda." : "The link is invalid or has already been used. Message us on WhatsApp if you need help.")}
        </p>
        <a href={isEs ? "/es/reto-dinero" : "/en/money-challenge"} className="btn-glow mt-10 inline-flex rounded bg-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne">
          {isEs ? "Volver al reto" : "Back to challenge"}
        </a>
      </div>
    </main>
  );
}
