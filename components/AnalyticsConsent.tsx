"use client";

import { useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "lily_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "lily-analytics-consent";

export type AnalyticsConsentValue = "granted" | "denied";

function updateGoogleConsent(value: AnalyticsConsentValue) {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as Window & {
    gtag?: (...args: unknown[]) => void;
  };

  analyticsWindow.gtag?.("consent", "update", {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

function broadcastConsent(value: AnalyticsConsentValue) {
  window.dispatchEvent(
    new CustomEvent<AnalyticsConsentValue>(ANALYTICS_CONSENT_EVENT, {
      detail: value,
    })
  );
}

export function readStoredAnalyticsConsent(): AnalyticsConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export default function AnalyticsConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedConsent = readStoredAnalyticsConsent();

    if (storedConsent) {
      updateGoogleConsent(storedConsent);
      broadcastConsent(storedConsent);
      return;
    }

    setIsVisible(true);
  }, []);

  function saveConsent(value: AnalyticsConsentValue) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    updateGoogleConsent(value);
    broadcastConsent(value);
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      role="dialog"
      aria-label="Preferencias de privacidad"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-5 shadow-2xl sm:flex sm:items-center sm:gap-5"
    >
      <div className="flex-1">
        <p className="font-semibold text-[#17130f]">Privacidad y medición</p>
        <p className="mt-1 text-sm leading-6 text-[#67594c]">
          Usamos medición para entender qué contenido funciona y mejorar la experiencia. Puedes aceptar o rechazar las cookies analíticas.
        </p>
      </div>

      <div className="mt-4 flex gap-3 sm:mt-0 sm:shrink-0">
        <button
          type="button"
          onClick={() => saveConsent("denied")}
          className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-[#30271f]"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => saveConsent("granted")}
          className="rounded-full bg-[#17130f] px-4 py-2 text-sm font-semibold text-white"
        >
          Aceptar
        </button>
      </div>
    </aside>
  );
}
