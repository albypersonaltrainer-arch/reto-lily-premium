export type AnalyticsParameters = Record<
  string,
  string | number | boolean | null | undefined
>;

type BrowserAnalyticsWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

function cleanParameters(parameters: AnalyticsParameters = {}) {
  return Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined)
  );
}

function getAnalyticsWindow() {
  if (typeof window === "undefined") {
    return null;
  }

  return window as BrowserAnalyticsWindow;
}

export function trackMetaStandardEvent(
  eventName: string,
  parameters: AnalyticsParameters = {}
) {
  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow?.fbq) {
    return;
  }

  analyticsWindow.fbq("track", eventName, cleanParameters(parameters));
}

export function trackMetaCustomEvent(
  eventName: string,
  parameters: AnalyticsParameters = {}
) {
  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow?.fbq) {
    return;
  }

  analyticsWindow.fbq("trackCustom", eventName, cleanParameters(parameters));
}

export function trackGoogleAnalyticsEvent(
  eventName: string,
  parameters: AnalyticsParameters = {}
) {
  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow) {
    return;
  }

  const cleanedParameters = cleanParameters(parameters);

  if (analyticsWindow.gtag) {
    analyticsWindow.gtag("event", eventName, cleanedParameters);
    return;
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(["event", eventName, cleanedParameters]);
}

export function trackUnifiedCustomEvent(
  eventName: string,
  parameters: AnalyticsParameters = {}
) {
  trackMetaCustomEvent(eventName, parameters);
  trackGoogleAnalyticsEvent(eventName, parameters);
}
