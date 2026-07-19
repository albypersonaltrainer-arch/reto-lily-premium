"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type MouseEvent,
} from "react";
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
  nextStepUrl: string;
};

export default function CodigoCeroLanding({
  mediaType,
  mediaSrc,
  mediaPoster,
  mediaTitle,
  completionThreshold,
  nextStepUrl,
}: CodigoCeroLandingProps) {
  const viewContentTrackedRef = useRef(false);

  const isVideo = mediaType === "video";
  const contentNoun = isVideo ? "vídeo" : "audio";

  const completionInstruction = isVideo
    ? "Míralo de principio a fin."
    : "Escúchalo de principio a fin.";

  const reflectionIntroduction = isVideo
    ? "No lo veas como un vídeo más."
    : "No lo escuches como un audio más.";

  const reflectionInstruction = isVideo
    ? "Míralo preguntándote constantemente:"
    : "Escúchalo preguntándote constantemente:";

  const transitionText = isVideo
    ? "Si este vídeo resonó contigo, el siguiente paso ya está preparado para ti."
    : "Si este audio resonó contigo, el siguiente paso ya está preparado para ti.";

  useEffect(() => {
    if (viewContentTrackedRef.current) {
      return;
    }

    viewContentTrackedRef.current = true;

    const parameters = {
      content_name: mediaTitle,
      content_category: "Código Cero",
      content_type: mediaType,
      page_path: "/codigo-cero",
    };

    trackMetaStandardEvent("ViewContent", parameters);
    trackGoogleAnalyticsEvent("view_content", parameters);
  }, [mediaTitle, mediaType]);

  function handleNextStepClick(
    event: MouseEvent<HTMLAnchorElement>
  ) {
    event.preventDefault();

    if (!nextStepUrl) {
      return;
    }

    const parameters = {
      media_type: mediaType,
      media_title: mediaTitle,
      button_text: "SIGUIENTE PASO",
      destination_url: nextStepUrl,
      page_path: "/codigo-cero",
    };

    trackUnifiedCustomEvent(
      "codigo_cero_siguiente_paso_click",
      parameters
    );

    trackUnifiedCustomEvent(
      "codigo_cero_completed",
      parameters
    );

    window.setTimeout(() => {
      window.location.assign(nextStepUrl);
    }, 180);
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

          <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-[#17130f] sm:text-6xl md:text-7xl">
            Código Cero
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-xl font-semibold leading-8 text-[#493d32] sm:text-2xl">
            El primer paso para entender por qué sigues creando los mismos resultados.
          </p>

          <div className="mx-auto mt-6 max-w-2xl space-y-4 text-[1.0625rem] leading-8 text-[#67594c] sm:text-xl">
            <p>
              Antes de hablar de manifestación, abundancia o dinero, necesitas
              entender una cosa:
            </p>

            <p className="font-semibold text-[#30271f]">
              ¿Por qué sigues creando los mismos resultados, aunque estés haciendo
              todo lo posible por cambiarlos?
            </p>

            <div className="space-y-2">
              <p>No puedes cambiar una realidad que todavía no comprendes.</p>
              <p>
                Este {contentNoun} es el primer paso.
              </p>
            </div>
          </div>

          <div className="mx-auto my-12 w-full max-w-3xl sm:my-14">
            <TrackedMediaPlayer
              mediaType={mediaType}
              src={mediaSrc}
              poster={mediaPoster}
              title={mediaTitle}
              completionThreshold={completionThreshold}
            />
          </div>

          <div className="mx-auto max-w-2xl">
            <p className="font-serif text-2xl text-[#201a15] sm:text-3xl">
              {completionInstruction}
            </p>

            <div className="mt-5 space-y-3 text-[1.0625rem] leading-7 text-[#67594c] sm:text-lg">
              <p>{reflectionIntroduction}</p>
              <p>{reflectionInstruction}</p>
              <p className="font-semibold italic text-[#30271f]">
                “¿En qué áreas de mi vida sigo haciendo exactamente esto?”
              </p>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-base font-semibold leading-7 text-[#493d32] sm:text-lg">
            {transitionText}
          </p>

          <a
            href={nextStepUrl || "#"}
            onClick={handleNextStepClick}
            aria-disabled={!nextStepUrl}
            className={`mx-auto mt-6 inline-flex min-h-14 w-full max-w-md items-center justify-center rounded-full px-7 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_rgba(23,19,15,0.22)] transition duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b68a55]/35 ${
              nextStepUrl
                ? "bg-[#17130f] hover:-translate-y-0.5 hover:bg-[#2b241d]"
                : "cursor-not-allowed bg-[#17130f]/60"
            }`}
          >
            Siguiente paso
          </a>
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
