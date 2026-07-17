"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import {
  trackUnifiedCustomEvent,
  type AnalyticsParameters,
} from "@/lib/analytics";

export type TrackedMediaType = "audio" | "video";

type TrackedMediaPlayerProps = {
  mediaType: TrackedMediaType;
  src: string;
  poster?: string;
  title: string;
  completionThreshold?: number;
  onCompleted?: () => void;
};

const MAX_NATURAL_TIME_JUMP_SECONDS = 3;

export function TrackedMediaPlayer({
  mediaType,
  src,
  poster,
  title,
  completionThreshold = 0.9,
  onCompleted,
}: TrackedMediaPlayerProps) {
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const consumedSecondsRef = useRef<Set<number>>(new Set());
  const lastPlaybackTimeRef = useRef<number | null>(null);
  const isSeekingRef = useRef(false);
  const hasCompletedRef = useRef(false);

  const [consumedPercentage, setConsumedPercentage] = useState(0);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  const assignMediaRef = useCallback(
    (node: HTMLAudioElement | HTMLVideoElement | null) => {
      mediaRef.current = node;
    },
    []
  );

  useEffect(() => {
    consumedSecondsRef.current = new Set();
    lastPlaybackTimeRef.current = null;
    isSeekingRef.current = false;
    hasCompletedRef.current = false;

    setConsumedPercentage(0);
    setHasPlaybackError(false);
  }, [mediaType, src]);

  const registerCompletion = useCallback(() => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;

    const parameters: AnalyticsParameters = {
      media_type: mediaType,
      media_title: title,
      completion_percentage: Math.round(completionThreshold * 100),
    };

    trackUnifiedCustomEvent(
      "codigo_cero_media_consumida",
      parameters
    );

    if (mediaType === "audio") {
      trackUnifiedCustomEvent(
        "codigo_cero_escuchado",
        parameters
      );
    }

    onCompleted?.();
  }, [completionThreshold, mediaType, onCompleted, title]);

  function handleLoadedMetadata(
    event: SyntheticEvent<HTMLMediaElement>
  ) {
    const media = event.currentTarget;

    if (!Number.isFinite(media.duration) || media.duration <= 0) {
      return;
    }

    setHasPlaybackError(false);
  }

  function handlePlay(event: SyntheticEvent<HTMLMediaElement>) {
    lastPlaybackTimeRef.current = event.currentTarget.currentTime;
  }

  function handlePause(event: SyntheticEvent<HTMLMediaElement>) {
    lastPlaybackTimeRef.current = event.currentTarget.currentTime;
  }

  function handleSeeking() {
    isSeekingRef.current = true;
  }

  function handleSeeked(event: SyntheticEvent<HTMLMediaElement>) {
    isSeekingRef.current = false;
    lastPlaybackTimeRef.current = event.currentTarget.currentTime;
  }

  function handleTimeUpdate(
    event: SyntheticEvent<HTMLMediaElement>
  ) {
    const media = event.currentTarget;
    const duration = media.duration;
    const currentTime = media.currentTime;
    const previousTime = lastPlaybackTimeRef.current;

    lastPlaybackTimeRef.current = currentTime;

    if (
      media.paused ||
      isSeekingRef.current ||
      previousTime === null ||
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      return;
    }

    const elapsedTime = currentTime - previousTime;
    const maximumAcceptedJump =
      MAX_NATURAL_TIME_JUMP_SECONDS *
      Math.max(1, media.playbackRate);

    if (
      elapsedTime <= 0 ||
      elapsedTime > maximumAcceptedJump
    ) {
      return;
    }

    const totalSeconds = Math.max(1, Math.ceil(duration));
    const firstSecond = Math.max(0, Math.floor(previousTime));
    const lastSecond = Math.min(
      totalSeconds - 1,
      Math.floor(currentTime)
    );

    for (
      let second = firstSecond;
      second <= lastSecond;
      second += 1
    ) {
      consumedSecondsRef.current.add(second);
    }

    const percentage =
      consumedSecondsRef.current.size / totalSeconds;

    setConsumedPercentage(
      Math.min(100, Math.round(percentage * 100))
    );

    if (percentage >= completionThreshold) {
      registerCompletion();
    }
  }

  if (!src) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white px-6 py-12 text-center shadow-[0_24px_70px_rgba(39,31,23,0.10)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a4793d]">
          Código Cero
        </p>

        <p className="mt-5 font-serif text-3xl text-[#17130f]">
          Contenido multimedia pendiente
        </p>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#66594c]">
          El reproductor está preparado para audio o vídeo. Solo falta
          incorporar el archivo definitivo.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white p-3 shadow-[0_24px_70px_rgba(39,31,23,0.12)]">
        {mediaType === "video" ? (
          <div className="aspect-video overflow-hidden rounded-2xl bg-black">
            <video
              ref={assignMediaRef}
              src={src}
              poster={poster}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeeking={handleSeeking}
              onSeeked={handleSeeked}
              onTimeUpdate={handleTimeUpdate}
              onError={() => setHasPlaybackError(true)}
            >
              Tu navegador no puede reproducir este vídeo.
            </video>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#f4ede4] px-5 py-7 md:px-8">
            <p className="mb-5 text-center font-serif text-2xl text-[#17130f]">
              {title}
            </p>

            <audio
              ref={assignMediaRef}
              src={src}
              controls
              preload="metadata"
              className="w-full"
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeeking={handleSeeking}
              onSeeked={handleSeeked}
              onTimeUpdate={handleTimeUpdate}
              onError={() => setHasPlaybackError(true)}
            >
              Tu navegador no puede reproducir este audio.
            </audio>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-1 text-xs font-bold uppercase tracking-[0.16em] text-[#756759]">
        <span>Progreso escuchado</span>
        <span>{consumedPercentage}%</span>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-[#a4793d] transition-[width] duration-300"
          style={{ width: `${consumedPercentage}%` }}
        />
      </div>

      {hasPlaybackError ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-700">
          No se ha podido cargar el contenido multimedia.
        </p>
      ) : null}
    </div>
  );
}
