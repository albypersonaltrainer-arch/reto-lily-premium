"use client";

import { useEffect, useRef, useState } from "react";
import { trackUnifiedCustomEvent } from "@/lib/analytics";

type YouTubePlayerState = -1 | 0 | 1 | 2 | 3 | 5;

type YouTubePlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};

type YouTubePlayerEvent = {
  data: YouTubePlayerState;
  target: YouTubePlayer;
};

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host?: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
        onError: (event: { data: number; target: YouTubePlayer }) => void;
      };
    }
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type TrackedYouTubePlayerProps = {
  videoId: string;
  title: string;
  completionThreshold?: number;
};

const MILESTONES = [25, 50, 75, 90] as const;
const API_SCRIPT_ID = "youtube-iframe-api";

function loadYouTubeApi(): Promise<YouTubeNamespace> {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  return new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (window.YT) {
        resolve(window.YT);
      }
    };

    if (!document.getElementById(API_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = API_SCRIPT_ID;
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

export function TrackedYouTubePlayer({
  videoId,
  title,
  completionThreshold = 0.9,
}: TrackedYouTubePlayerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const trackedMilestonesRef = useRef<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function stopTimer() {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    function buildParameters(player: YouTubePlayer, percentage: number) {
      const duration = Math.max(0, player.getDuration() || 0);
      const currentTime = Math.max(0, player.getCurrentTime() || 0);

      return {
        media_type: "youtube",
        media_title: title,
        youtube_video_id: videoId,
        media_duration_seconds: Math.round(duration),
        media_current_time_seconds: Math.round(currentTime),
        completion_percentage: Math.round(percentage),
      };
    }

    function updateProgress(player: YouTubePlayer) {
      const duration = player.getDuration();
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      const percentage = Math.min(
        100,
        Math.max(0, (player.getCurrentTime() / duration) * 100)
      );
      const rounded = Math.round(percentage);
      setProgress(rounded);

      for (const milestone of MILESTONES) {
        if (
          rounded >= milestone &&
          !trackedMilestonesRef.current.has(milestone)
        ) {
          trackedMilestonesRef.current.add(milestone);
          trackUnifiedCustomEvent(
            `codigo_cero_media_${milestone}`,
            buildParameters(player, milestone)
          );
        }
      }

      if (
        rounded >= Math.round(completionThreshold * 100) &&
        !completedRef.current
      ) {
        completedRef.current = true;
        const parameters = buildParameters(player, rounded);
        trackUnifiedCustomEvent("codigo_cero_media_consumida", parameters);
        trackUnifiedCustomEvent("codigo_cero_visto", parameters);
        trackUnifiedCustomEvent("codigo_cero_media_completed", parameters);
      }
    }

    loadYouTubeApi().then((YT) => {
      if (cancelled || !hostRef.current) {
        return;
      }

      playerRef.current = new YT.Player(hostRef.current, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 0,
          controls: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: ({ target }) => {
            setHasError(false);
            trackUnifiedCustomEvent(
              "codigo_cero_youtube_ready",
              buildParameters(target, 0)
            );
          },
          onStateChange: ({ data, target }) => {
            if (data === 1) {
              if (!startedRef.current) {
                startedRef.current = true;
                trackUnifiedCustomEvent(
                  "codigo_cero_media_start",
                  buildParameters(target, progress)
                );
              } else {
                trackUnifiedCustomEvent(
                  "codigo_cero_youtube_resume",
                  buildParameters(target, progress)
                );
              }

              stopTimer();
              timerRef.current = window.setInterval(
                () => updateProgress(target),
                1000
              );
              return;
            }

            if (data === 2) {
              updateProgress(target);
              stopTimer();
              trackUnifiedCustomEvent(
                "codigo_cero_youtube_pause",
                buildParameters(target, progress)
              );
              return;
            }

            if (data === 0) {
              updateProgress(target);
              stopTimer();

              if (!completedRef.current) {
                completedRef.current = true;
                const parameters = buildParameters(target, 100);
                trackUnifiedCustomEvent("codigo_cero_media_consumida", parameters);
                trackUnifiedCustomEvent("codigo_cero_visto", parameters);
                trackUnifiedCustomEvent(
                  "codigo_cero_media_completed",
                  parameters
                );
              }
            }
          },
          onError: ({ data, target }) => {
            setHasError(true);
            stopTimer();
            trackUnifiedCustomEvent("codigo_cero_media_error", {
              ...buildParameters(target, progress),
              youtube_error_code: data,
            });
          },
        },
      });
    });

    return () => {
      cancelled = true;
      stopTimer();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [completionThreshold, progress, title, videoId]);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white p-3 shadow-[0_28px_80px_rgba(39,31,23,0.15)] sm:p-4">
        <div
          className="aspect-video overflow-hidden rounded-2xl bg-black"
          data-analytics-section="codigo_cero_youtube_player"
        >
          <div ref={hostRef} className="h-full w-full" aria-label={title} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-1 text-xs font-bold uppercase tracking-[0.16em] text-[#756759]">
        <span>Progreso reproducido</span>
        <span>{progress}%</span>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-[#a4793d] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {hasError ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-700">
          No se ha podido cargar el vídeo de YouTube.
        </p>
      ) : null}
    </div>
  );
}
