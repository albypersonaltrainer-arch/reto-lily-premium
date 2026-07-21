import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import { Suspense } from "react";
import AdvancedPageAnalytics from "@/components/AdvancedPageAnalytics";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import HlsPlaybackBridge from "@/components/media/HlsPlaybackBridge";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "Elimina lo que bloquea tu dinero en 3 días",
  description:
    "Reto premium de 3 días para detectar el patrón que bloquea tu relación con el dinero.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

const consentBootstrapScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  var storedConsent = null;
  try { storedConsent = localStorage.getItem('lily_analytics_consent'); } catch (error) {}
  var consentValue = storedConsent === 'granted' ? 'granted' : 'denied';
  gtag('consent', 'default', {
    analytics_storage: consentValue,
    ad_storage: consentValue,
    ad_user_data: consentValue,
    ad_personalization: consentValue,
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleAnalyticsMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-WN2P4D10SR";

  return (
    <html lang="es" className={`${manrope.variable} ${notoSerif.variable}`}>
      <head>
        <script
          id="google-consent-default"
          dangerouslySetInnerHTML={{ __html: consentBootstrapScript }}
        />
      </head>
      <body className="font-sans antialiased">
        <HlsPlaybackBridge />

        <Suspense fallback={null}>
          <GoogleAnalytics
            measurementId={googleAnalyticsMeasurementId}
          />
          <MetaPixel pixelId={metaPixelId} />
          <AdvancedPageAnalytics />
        </Suspense>

        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
