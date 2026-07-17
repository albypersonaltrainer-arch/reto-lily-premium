"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

type GoogleAnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialPageViewSkipped = useRef(false);
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!measurementId || typeof window === "undefined") {
      return;
    }

    const queryString = searchParams?.toString();
    const currentUrl = `${pathname}${queryString ? `?${queryString}` : ""}`;

    if (!initialPageViewSkipped.current) {
      initialPageViewSkipped.current = true;
      lastTrackedUrl.current = currentUrl;
      return;
    }

    if (lastTrackedUrl.current === currentUrl) {
      return;
    }

    lastTrackedUrl.current = currentUrl;

    const analyticsWindow = window as GoogleAnalyticsWindow;

    analyticsWindow.gtag?.("config", measurementId, {
      page_path: currentUrl,
    });
  }, [measurementId, pathname, searchParams]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />

      <Script
        id="google-analytics-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  );
}
