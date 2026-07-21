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
  onProgress?: (percentage: number) => void;
  onCompleted?: () => void;
};

const MAX_NATURAL_TIME_JUMP_SECONDS = 3;
const MEDIA_MILESTONES = [25, 50, 75, 90] as const;

export function TrackedMediaPlayer({
  mediaType,
  src,
  poster,
  title,
  completionThreshold = 0.9,
  onProgress,
  onCompleted,
}: TrackedMediaPlayerProps) {
  const consumedSecondsRef = useRef<Set<number>>(new Set());
  const trackedMilestonesRef = useRef<Set<number>>(new Set());
  const lastPlaybackTimeRef = useRef<number | null>(null);
  const isSeekingRef = useRef(false);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const hasTrackedErrorRef = useRef(false);

  const [consumedPercentage, setConsumedPercentage] = useState(0);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  useEffect(() => {
    consumedSecondsRef.current = new Set();
    trackedMilestonesRef.current = new Set();
    lastPlaybackTimeRef.current = null;
    isSeekingRef.current = false;
    hasStartedRef.current = false;
    hasCompletedRef.current = false;
    hasTrackedErrorRef.current = false;

    setConsumedPercentage(0);
    setHasPlaybackError(false);
  }, [mediaType, src]);

  const buildAnalyticsParameters = useCallback(
    (
      media: HTMLMediaElement,
      percentage: number
    ): AnalyticsParameters => ({
      media_type: mediaType,
      media_title: title,
      completion_percentage: percentage,
      media_duration_seconds: Number.isFinite(media.duration)
        ? Math.round(media.duration)
        : 0,
      media_consumed_seconds: consumedSecondsRef.current.size,
      media_current_time_seconds: Math.round(media.currentTime),
    }),
    [mediaType, title]
  );

  const registerCompletion = useCallback(
    (media: HTMLMediaElement, percentage: number) => {
      if (hasCompletedRef.current) {
        return;
      }

      hasCompletedRef.current = true;

      const parameters = buildAnalyticsParameters(media, percentage);

      trackUnifiedCustomEvent(
        "codigo_cero_media_consumida",
        parameters
      );

      trackUnifiedCustomEvent(
        mediaType === "video"
          ? "codigo_cero_visto"
          : "codigo_cero_escuchado",
        parameters
      );

      trackUnifiedCustomEvent(
        "codigo_cero_media_completed",
        parameters
      );

      onCompleted?.();
    },
    [buildAnalyticsParameters, mediaType, onCompleted]
  );

  function registerMilestones(
    media: HTMLMediaElement,
    percentage: number
  ) {
    for (const milestone of MEDIA_MILESTONES) {
      if (
        percentage < milestone ||
        trackedMilestonesRef.current.has(milestone)
      ) {
        continue;
      }

      trackedMilestonesRef.current.add(milestone);

      trackUnifiedCustomEvent(
        `codigo_cero_media_${milestone}`,
        buildAnalyticsParameters(media, milestone)
      );
    }
  }

  function updateProgress(
    media: HTMLMediaElement,
    percentage: number
  ) {
    const boundedPercentage = Math.min(
      100,
      Math.max(0, Math.round(percentage))
    );

    setConsumedPercentage(boundedPercentage);
    onProgress?.(boundedPercentage);

    registerMilestones(media, boundedPercentage);

    if (
      boundedPercentage >=
      Math.round(completionThreshold * 100)
    ) {
      registerCompletion(media, boundedPercentage);
    }
  }

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
    const media = event.currentTarget;

    lastPlaybackTimeRef.current = media.currentTime;

    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    trackUnifiedCustomEvent(
      "codigo_cero_media_start",
      buildAnalyticsParameters(media, 0)
    );
  }

  function handlePause(event: SyntheticEvent<HTMLMediaElement>) {
    lastPlaybackTimeRef.current =
      event.currentTarget.currentTime;
  }

  function handleSeeking() {
    isSeekingRef.current = true;
  }

  function handleSeeked(event: SyntheticEvent<HTMLMediaElement>) {
    isSeekingRef.current = false;
    lastPlaybackTimeRef.current =
      event.currentTarget.currentTime;
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
      (consumedSecondsRef.current.size / totalSeconds) * 100;

    updateProgress(media, percentage);
  }

  function handleEnded(
    event: SyntheticEvent<HTMLMediaElement>
  ) {
    const media = event.currentTarget;
    const totalSeconds = Math.max(1, Math.ceil(media.duration));
    const percentage =
      (consumedSecondsRef.current.size / totalSeconds) * 100;

    updateProgress(media, percentage);
  }

  function handleError(
    event: SyntheticEvent<HTMLMediaElement>
  ) {
    setHasPlaybackError(true);

    if (hasTrackedErrorRef.current) {
      return;
    }

    hasTrackedErrorRef.current = true;

    trackUnifiedCustomEvent(
      "codigo_cero_media_error",
      buildAnalyticsParameters(event.currentTarget, consumedPercentage)
    );
  }

  if (!src) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white px-6 py-14 text-center shadow-[0_28px_80px_rgba(39,31,23,0.14)]">
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
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white p-3 shadow-[0_28px_80px_rgba(39,31,23,0.15)] sm:p-4">
        {mediaType === "video" ? (
          <div className="aspect-video overflow-hidden rounded-2xl bg-black">
            <video
              src={src}
              poster={poster}
              controls
              controlsList="nodownload"
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeeking={handleSeeking}
              onSeeked={handleSeeked}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onError={handleError}
            >
              Tu navegador no puede reproducir este vídeo.
            </video>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#f4ede4] px-5 py-8 md:px-8 md:py-10">
            <p className="mb-6 text-center font-serif text-2xl text-[#17130f]">
              {title}
            </p>

            <audio
              src={src}
              controls
              controlsList="nodownload"
              preload="metadata"
              className="w-full"
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeeking={handleSeeking}
              onSeeked={handleSeeked}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onError={handleError}
            >
              Tu navegador no puede reproducir este audio.
            </audio>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-1 text-xs font-bold uppercase tracking-[0.16em] text-[#756759]">
        <span>
          {mediaType === "video"
            ? "Progreso reproducido"
            : "Progreso escuchado"}
        </span>
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
