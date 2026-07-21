export type AnalyticsParameters = Record<
  string,
  string | number | boolean | null | undefined
>;

type PendingMetaEvent = {
  method: "track" | "trackCustom";
  eventName: string;
  parameters: AnalyticsParameters;
};

type BrowserAnalyticsWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  __pendingMetaEvents?: PendingMetaEvent[];
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

function queueMetaEvent(event: PendingMetaEvent) {
  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow) {
    return;
  }

  analyticsWindow.__pendingMetaEvents =
    analyticsWindow.__pendingMetaEvents || [];
  analyticsWindow.__pendingMetaEvents.push(event);
}

export function flushPendingMetaEvents() {
  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow?.fbq || !analyticsWindow.__pendingMetaEvents?.length) {
    return;
  }

  for (const event of analyticsWindow.__pendingMetaEvents) {
    analyticsWindow.fbq(
      event.method,
      event.eventName,
      cleanParameters(event.parameters)
    );
  }

  analyticsWindow.__pendingMetaEvents = [];
}

export function trackMetaStandardEvent(
  eventName: string,
  parameters: AnalyticsParameters = {}
) {
  const analyticsWindow = getAnalyticsWindow();
  const cleanedParameters = cleanParameters(parameters);

  if (!analyticsWindow?.fbq) {
    queueMetaEvent({
      method: "track",
      eventName,
      parameters: cleanedParameters,
    });
    return;
  }

  analyticsWindow.fbq("track", eventName, cleanedParameters);
}

export function trackMetaCustomEvent(
  eventName: string,
  parameters: AnalyticsParameters = {}
) {
  const analyticsWindow = getAnalyticsWindow();
  const cleanedParameters = cleanParameters(parameters);

  if (!analyticsWindow?.fbq) {
    queueMetaEvent({
      method: "trackCustom",
      eventName,
      parameters: cleanedParameters,
    });
    return;
  }

  analyticsWindow.fbq("trackCustom", eventName, cleanedParameters);
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
