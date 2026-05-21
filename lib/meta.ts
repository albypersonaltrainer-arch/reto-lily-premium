declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MetaEventPayload = Record<string, string | number | boolean | null>;

export function trackMetaEvent(
  eventName: string,
  payload?: MetaEventPayload
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.fbq !== "function") {
    return;
  }

  if (payload) {
    window.fbq("track", eventName, payload);
    return;
  }

  window.fbq("track", eventName);
}

export function trackInitiateCheckout(params?: {
  value?: number;
  currency?: string;
  contentName?: string;
}): void {
  trackMetaEvent("InitiateCheckout", {
    value: params?.value ?? 7,
    currency: params?.currency ?? "USD",
    content_name: params?.contentName ?? "Reto Lily 3 días",
    content_type: "product",
  });
}
