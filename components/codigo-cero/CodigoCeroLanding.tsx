"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { TrackedMediaPlayer } from "@/components/media/TrackedMediaPlayer";
import type { CodigoCeroMediaType } from "@/config/codigoCero";
import {
  trackGoogleAnalyticsEvent,
  trackMetaStandardEvent,
  trackUnifiedCustomEvent,
} from "@/lib/analytics";

type CodigoCeroLandingProps = {
  mediaType: CodigoCeroMediaType;
  mediaSrc: string;
  mediaPoster?: string;
  mediaTitle: string;
  completionThreshold: number;
};

export default function CodigoCeroLanding({
  mediaType,
  mediaSrc,
  mediaPoster,
  mediaTitle,
  completionThreshold,
}: CodigoCeroLandingProps) {
  const viewContentTrackedRef = useRef(false);

  const isVideo = mediaType === "video";
  const mediaNoun = isVideo ? "vídeo" : "audio";
  const consumptionInstruction = isVideo
    ? "Míralo sin interrupciones."
    : "Escúchalo sin interrupciones.";
  const contentIntroduction = isVideo
    ? "En este vídeo descubrirás el primer paso."
    : "En este audio descubrirás el primer paso.";

  useEffect(() => {
    if (viewContentTrackedRef.current) {
      return;
    }

    viewContentTrackedRef.current = true;

    const parameters = {
      content_name: mediaTitle,
      content_category: "Código Cero",
      content_type: mediaType,
    };

    trackMetaStandardEvent("ViewContent", parameters);
    trackGoogleAnalyticsEvent("view_content", parameters);
  }, [mediaTitle, mediaType]);

  function handleCompletedClick() {
    trackUnifiedCustomEvent("codigo_cero_completed", {
      media_type: mediaType,
      media_title: mediaTitle,
      button_text: "He escuchado Código Cero",
    });
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#f8f4ee] text-[#17130f]"
      style={{ colorScheme: "light" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#d9c2a3]/25 blur-3xl" />
        <div className="absolute -right-36 top-1/3 h-96 w-96 rounded-full bg-[#b68a55]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-white/80 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-7 sm:px-8 md:py-10">
        <header className="flex justify-center pt-1">
          <div className="relative h-20 w-64 overflow-visible sm:h-24 sm:w-72">
            <Image
              src="/lily-camarena-logo.png"
              alt="Lily Camarena"
              fill
              priority
              sizes="(max-width: 640px) 256px, 288px"
              className="origin-center scale-[1.45] object-contain sm:scale-[1.6]"
            />
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-8 text-center md:py-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#966d3c]">
            Una experiencia de Lily Camarena
          </p>

          <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-[#17130f] sm:text-6xl md:text-7xl">
            Código Cero
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-xl font-semibold leading-8 text-[#493d32] sm:text-2xl">
            El primer paso para descubrir qué está frenando tu siguiente nivel.
          </p>

          <div className="mx-auto mt-6 max-w-2xl space-y-4 text-[1.0625rem] leading-8 text-[#67594c] sm:text-xl">
            <p>
              Antes de hablar de manifestación, abundancia o dinero, necesitas
              entender una cosa:
            </p>

            <p className="font-semibold text-[#30271f]">
              Por qué sigues creando los mismos resultados aunque estés haciendo
              todo lo posible por cambiarlos.
            </p>

            <p>{contentIntroduction}</p>
          </div>

          <div className="mx-auto mt-8 w-full max-w-2xl">
            <TrackedMediaPlayer
              mediaType={mediaType}
              src={mediaSrc}
              poster={mediaPoster}
              title={mediaTitle}
              completionThreshold={completionThreshold}
            />
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <p className="font-serif text-2xl text-[#201a15] sm:text-3xl">
              {consumptionInstruction}
            </p>

            <p className="mt-4 text-[1.0625rem] leading-7 text-[#67594c] sm:text-lg">
              Hay una idea dentro de este {mediaNoun} que puede cambiar por
              completo la forma en la que entiendes tus resultados.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompletedClick}
            className="mx-auto mt-8 inline-flex min-h-14 w-full max-w-md items-center justify-center rounded-full bg-[#17130f] px-7 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_rgba(23,19,15,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#2b241d] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b68a55]/35"
          >
            He escuchado Código Cero
          </button>
        </section>

        <footer className="flex justify-center pb-1">
          <div className="relative h-11 w-11 opacity-70">
            <Image
              src="/stamp_negro.png"
              alt=""
              fill
              sizes="44px"
              className="object-contain"
            />
          </div>
        </footer>
      </div>
    </main>
  );
}
