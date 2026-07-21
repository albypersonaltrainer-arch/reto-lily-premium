"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  readStoredAnalyticsConsent,
  type AnalyticsConsentValue,
} from "@/components/AnalyticsConsent";
import { trackGoogleAnalyticsEvent } from "@/lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 90, 100] as const;
const ACTIVE_TIME_MILESTONES = [15, 30, 60, 120, 180] as const;

type MediaAnalyticsState = {
  started: boolean;
  completed: boolean;
  playCount: number;
  pauseCount: number;
  seekCount: number;
  seekStartedAt: number | null;
  bufferingStartedAt: number | null;
  totalBufferMilliseconds: number;
  lastMuted: boolean;
  lastVolumeBucket: number;
};

function resolveSectionName(element: HTMLElement) {
  if (element.dataset.analyticsSection) {
    return element.dataset.analyticsSection;
  }

  if (element instanceof HTMLVideoElement) {
    return "codigo_cero_video_player";
  }

  if (element instanceof HTMLAudioElement) {
    return "codigo_cero_audio_player";
  }

  if (
    element instanceof HTMLAnchorElement &&
    element.textContent?.trim().toLowerCase() === "siguiente paso"
  ) {
    return "codigo_cero_next_step_cta";
  }

  return element.id || "unknown";
}

function getMediaType(media: HTMLMediaElement) {
  return media instanceof HTMLVideoElement ? "video" : "audio";
}

function getVolumeBucket(media: HTMLMediaElement) {
  if (media.muted || media.volume === 0) {
    return 0;
  }

  if (media.volume <= 0.25) {
    return 25;
  }

  if (media.volume <= 0.5) {
    return 50;
  }

  if (media.volume <= 0.75) {
    return 75;
  }

  return 100;
}

export default function AdvancedPageAnalytics() {
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);
  const trackedScrollRef = useRef<Set<number>>(new Set());
  const trackedTimeRef = useRef<Set<number>>(new Set());
  const trackedSectionsRef = useRef<Set<string>>(new Set());
  const activeSecondsRef = useRef(0);
  const maximumScrollRef = useRef(0);
  const firstInteractionTrackedRef = useRef(false);

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
    trackedScrollRef.current = new Set();
    trackedTimeRef.current = new Set();
    trackedSectionsRef.current = new Set();
    activeSecondsRef.current = 0;
    maximumScrollRef.current = 0;
    firstInteractionTrackedRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    const mediaStates = new WeakMap<HTMLMediaElement, MediaAnalyticsState>();
    const observedMedia = new Set<HTMLMediaElement>();

    function getPageParameters() {
      return {
        page_path: pathname,
        page_title: document.title,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      };
    }

    function getMediaState(media: HTMLMediaElement) {
      const existingState = mediaStates.get(media);

      if (existingState) {
        return existingState;
      }

      const state: MediaAnalyticsState = {
        started: false,
        completed: false,
        playCount: 0,
        pauseCount: 0,
        seekCount: 0,
        seekStartedAt: null,
        bufferingStartedAt: null,
        totalBufferMilliseconds: 0,
        lastMuted: media.muted,
        lastVolumeBucket: getVolumeBucket(media),
      };

      mediaStates.set(media, state);
      observedMedia.add(media);
      return state;
    }

    function getMediaParameters(media: HTMLMediaElement) {
      const state = getMediaState(media);
      const duration = Number.isFinite(media.duration)
        ? Math.round(media.duration)
        : 0;
      const currentTime = Math.round(media.currentTime);

      return {
        ...getPageParameters(),
        media_type: getMediaType(media),
        media_title: media.getAttribute("aria-label") || "Código Cero",
        media_duration_seconds: duration,
        media_current_time_seconds: currentTime,
        media_position_percentage:
          duration > 0 ? Math.round((currentTime / duration) * 100) : 0,
        playback_rate: media.playbackRate,
        play_count: state.playCount,
        pause_count: state.pauseCount,
        seek_count: state.seekCount,
        total_buffer_milliseconds: state.totalBufferMilliseconds,
      };
    }

    function handleFirstInteraction(event: Event) {
      if (firstInteractionTrackedRef.current) {
        return;
      }

      firstInteractionTrackedRef.current = true;
      trackGoogleAnalyticsEvent("first_interaction", {
        ...getPageParameters(),
        interaction_type: event.type,
        active_seconds: activeSecondsRef.current,
      });
    }

    function handleScroll() {
      const documentHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const percentage = Math.min(
        100,
        Math.round((window.scrollY / documentHeight) * 100)
      );

      maximumScrollRef.current = Math.max(
        maximumScrollRef.current,
        percentage
      );

      for (const milestone of SCROLL_MILESTONES) {
        if (
          percentage < milestone ||
          trackedScrollRef.current.has(milestone)
        ) {
          continue;
        }

        trackedScrollRef.current.add(milestone);
        trackGoogleAnalyticsEvent("scroll_depth", {
          ...getPageParameters(),
          scroll_percentage: milestone,
          active_seconds: activeSecondsRef.current,
        });
      }
    }

    function handleMediaEvent(event: Event) {
      if (!(event.target instanceof HTMLMediaElement)) {
        return;
      }

      const media = event.target;
      const state = getMediaState(media);
      const mediaType = getMediaType(media);

      switch (event.type) {
        case "loadedmetadata":
          trackGoogleAnalyticsEvent(`${mediaType}_loaded`,
            getMediaParameters(media)
          );
          break;
        case "play":
          state.playCount += 1;
          if (!state.started) {
            state.started = true;
            trackGoogleAnalyticsEvent(`${mediaType}_start`,
              getMediaParameters(media)
            );
          } else {
            trackGoogleAnalyticsEvent(`${mediaType}_resume`,
              getMediaParameters(media)
            );
          }
          break;
        case "pause":
          if (!media.ended && state.started) {
            state.pauseCount += 1;
            trackGoogleAnalyticsEvent(`${mediaType}_pause`,
              getMediaParameters(media)
            );
          }
          break;
        case "seeking":
          state.seekStartedAt = media.currentTime;
          break;
        case "seeked": {
          const fromSecond = state.seekStartedAt;
          state.seekStartedAt = null;
          state.seekCount += 1;
          trackGoogleAnalyticsEvent(`${mediaType}_seek`, {
            ...getMediaParameters(media),
            seek_from_seconds:
              fromSecond === null ? null : Math.round(fromSecond),
            seek_to_seconds: Math.round(media.currentTime),
            seek_delta_seconds:
              fromSecond === null
                ? null
                : Math.round(media.currentTime - fromSecond),
          });
          break;
        }
        case "waiting":
          if (state.bufferingStartedAt === null) {
            state.bufferingStartedAt = performance.now();
            trackGoogleAnalyticsEvent(`${mediaType}_buffer_start`,
              getMediaParameters(media)
            );
          }
          break;
        case "playing":
          if (state.bufferingStartedAt !== null) {
            const bufferMilliseconds = Math.round(
              performance.now() - state.bufferingStartedAt
            );
            state.totalBufferMilliseconds += bufferMilliseconds;
            state.bufferingStartedAt = null;
            trackGoogleAnalyticsEvent(`${mediaType}_buffer_end`, {
              ...getMediaParameters(media),
              buffer_milliseconds: bufferMilliseconds,
            });
          }
          break;
        case "ratechange":
          trackGoogleAnalyticsEvent(`${mediaType}_rate_change`,
            getMediaParameters(media)
          );
          break;
        case "volumechange": {
          const currentBucket = getVolumeBucket(media);
          if (
            state.lastMuted !== media.muted ||
            state.lastVolumeBucket !== currentBucket
          ) {
            state.lastMuted = media.muted;
            state.lastVolumeBucket = currentBucket;
            trackGoogleAnalyticsEvent(`${mediaType}_volume_change`, {
              ...getMediaParameters(media),
              is_muted: media.muted,
              volume_bucket: currentBucket,
            });
          }
          break;
        }
        case "ended":
          state.completed = true;
          trackGoogleAnalyticsEvent(`${mediaType}_complete`,
            getMediaParameters(media)
          );
          break;
        case "error":
          trackGoogleAnalyticsEvent(`${mediaType}_playback_error`, {
            ...getMediaParameters(media),
            media_error_code: media.error?.code || 0,
          });
          break;
      }
    }

    const activeTimer = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      activeSecondsRef.current += 1;

      for (const milestone of ACTIVE_TIME_MILESTONES) {
        if (
          activeSecondsRef.current < milestone ||
          trackedTimeRef.current.has(milestone)
        ) {
          continue;
        }

        trackedTimeRef.current.add(milestone);
        trackGoogleAnalyticsEvent("active_time", {
          ...getPageParameters(),
          active_seconds: milestone,
          maximum_scroll_percentage: maximumScrollRef.current,
        });
      }
    }, 1000);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
            continue;
          }

          const element = entry.target as HTMLElement;
          const sectionName = resolveSectionName(element);

          if (trackedSectionsRef.current.has(sectionName)) {
            continue;
          }

          trackedSectionsRef.current.add(sectionName);
          trackGoogleAnalyticsEvent("section_view", {
            ...getPageParameters(),
            section_name: sectionName,
            active_seconds: activeSecondsRef.current,
            maximum_scroll_percentage: maximumScrollRef.current,
          });
        }
      },
      { threshold: [0.5] }
    );

    document
      .querySelectorAll<HTMLElement>(
        "[data-analytics-section], video, audio, a[aria-disabled]"
      )
      .forEach((element) => sectionObserver.observe(element));

    function sendExitSummary() {
      for (const media of observedMedia) {
        const state = getMediaState(media);

        if (state.started && !state.completed) {
          trackGoogleAnalyticsEvent(`${getMediaType(media)}_abandon`, {
            ...getMediaParameters(media),
            transport_type: "beacon",
          });
        }
      }

      trackGoogleAnalyticsEvent("page_exit_summary", {
        ...getPageParameters(),
        active_seconds: activeSecondsRef.current,
        maximum_scroll_percentage: maximumScrollRef.current,
        sections_viewed: trackedSectionsRef.current.size,
        transport_type: "beacon",
      });
    }

    const mediaEventNames = [
      "loadedmetadata",
      "play",
      "pause",
      "seeking",
      "seeked",
      "waiting",
      "playing",
      "ratechange",
      "volumechange",
      "ended",
      "error",
    ] as const;

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointerdown", handleFirstInteraction, {
      passive: true,
    });
    window.addEventListener("keydown", handleFirstInteraction);
    window.addEventListener("pagehide", sendExitSummary);

    for (const eventName of mediaEventNames) {
      document.addEventListener(eventName, handleMediaEvent, true);
    }

    handleScroll();

    return () => {
      window.clearInterval(activeTimer);
      sectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("pagehide", sendExitSummary);

      for (const eventName of mediaEventNames) {
        document.removeEventListener(eventName, handleMediaEvent, true);
      }
    };
  }, [hasConsent, pathname]);

  return null;
}
