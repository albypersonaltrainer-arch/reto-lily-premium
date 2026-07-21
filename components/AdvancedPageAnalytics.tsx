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

    function getPageParameters() {
      return {
        page_path: pathname,
        page_title: document.title,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
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
      trackGoogleAnalyticsEvent("page_exit_summary", {
        ...getPageParameters(),
        active_seconds: activeSecondsRef.current,
        maximum_scroll_percentage: maximumScrollRef.current,
        sections_viewed: trackedSectionsRef.current.size,
        transport_type: "beacon",
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointerdown", handleFirstInteraction, {
      passive: true,
    });
    window.addEventListener("keydown", handleFirstInteraction);
    window.addEventListener("pagehide", sendExitSummary);

    handleScroll();

    return () => {
      window.clearInterval(activeTimer);
      sectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("pagehide", sendExitSummary);
    };
  }, [hasConsent, pathname]);

  return null;
}
