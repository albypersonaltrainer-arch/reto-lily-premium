"use client";

import { useEffect, useRef } from "react";
import { trackMetaEvent } from "@/lib/meta";

type MetaPurchaseTrackerProps = {
  sessionId?: string;
};

type StripeSessionVerificationResponse = {
  ok: boolean;
  sessionId?: string;
  value?: number;
  currency?: string;
  error?: string;
};

export default function MetaPurchaseTracker({
  sessionId,
}: MetaPurchaseTrackerProps) {
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!sessionId || hasStarted.current) {
      return;
    }

    const verifiedSessionId = sessionId;

    hasStarted.current = true;

    const storageKey = `meta_purchase_tracked_${verifiedSessionId}`;

    if (typeof window !== "undefined") {
      const alreadyTracked = window.sessionStorage.getItem(storageKey);

      if (alreadyTracked === "true") {
        return;
      }
    }

    async function verifyAndTrackPurchase() {
      try {
        const response = await fetch(
          `/api/stripe/checkout-session?session_id=${encodeURIComponent(
            verifiedSessionId
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result =
          (await response.json().catch(() => null)) as StripeSessionVerificationResponse | null;

        if (!response.ok || result?.ok !== true) {
          console.warn("Meta Purchase not tracked:", result?.error);
          return;
        }

        const value =
          typeof result.value === "number" && Number.isFinite(result.value)
            ? result.value
            : 7;

        const currency = result.currency || "USD";

        trackMetaEvent("Purchase", {
          value,
          currency,
          content_name: "Reto Lily 3 días",
          content_type: "product",
        });

        window.sessionStorage.setItem(storageKey, "true");
      } catch (error) {
        console.error("Meta Purchase tracking error:", error);
      }
    }

    verifyAndTrackPurchase();
  }, [sessionId]);

  return null;
}
