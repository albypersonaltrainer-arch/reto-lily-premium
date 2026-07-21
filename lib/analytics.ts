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
