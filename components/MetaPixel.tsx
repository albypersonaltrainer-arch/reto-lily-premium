"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  readStoredAnalyticsConsent,
  type AnalyticsConsentValue,
} from "@/components/AnalyticsConsent";
import { flushPendingMetaEvents } from "@/lib/analytics";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

type MetaPixelProps = {
  pixelId?: string;
};

export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState(false);
  const initialPageViewSkipped = useRef(false);
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    setHasConsent(readStoredAnalyticsConsent() === "granted");

    function handleConsent(event: Event) {
      const consentEvent = event as CustomEvent<AnalyticsConsentValue>;
      setHasConsent(consentEvent.detail === "granted");
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
    };
  }, []);

  useEffect(() => {
    if (!pixelId || !hasConsent || typeof window === "undefined" || !window.fbq) {
      return;
    }

    flushPendingMetaEvents();

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
    window.fbq("track", "PageView");
  }, [hasConsent, pixelId, pathname, searchParams]);

  if (!pixelId || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        onLoad={flushPendingMetaEvents}
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
