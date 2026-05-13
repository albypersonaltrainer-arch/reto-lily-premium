"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type VideoGateProps = {
  url: string;
  placeholderText: string;
  lockedText: string;
  unlockLabel: string;
  unlockAfterSeconds: number;
  onUnlocked: () => void;
};

type VideoSource = {
  kind: "empty" | "embed" | "direct";
  url: string;
};

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isDirectVideoUrl(url: string) {
  const cleanUrl = url.split("?")[0].toLowerCase();

  return (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".mov") ||
    cleanUrl.endsWith(".m4v")
  );
}

function getVideoSource(url: string): VideoSource {
  const cleanInput = url.trim();

  if (!cleanInput) {
    return {
      kind: "empty",
      url: ""
    };
  }

  try {
    const parsedUrl = new URL(cleanInput);

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return {
          kind: "embed",
          url: `https://www.youtube.com/embed/${videoId}`
        };
      }
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");

      if (videoId) {
        return {
          kind: "embed",
          url: `https://www.youtube.com/embed/${videoId}`
        };
      }
    }

    if (parsedUrl.hostname.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean).pop();

      if (videoId) {
        return {
          kind: "embed",
          url: `https://player.vimeo.com/video/${videoId}`
        };
      }
    }

    if (isDirectVideoUrl(cleanInput)) {
      return {
        kind: "direct",
        url: cleanInput
      };
    }

    return {
      kind: "direct",
      url: cleanInput
    };
  } catch {
    if (isDirectVideoUrl(cleanInput)) {
      return {
        kind: "direct",
        url: cleanInput
      };
    }

    return {
      kind: "empty",
      url: ""
    };
  }
}

export function VideoGate({
  url,
  placeholderText,
  lockedText,
  unlockLabel,
  unlockAfterSeconds,
  onUnlocked
}: VideoGateProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(unlockAfterSeconds);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const hasUnlockedRef = useRef(false);

  const videoSource = useMemo(() => getVideoSource(url), [url]);

  useEffect(() => {
    if (hasUnlockedRef.current) return;

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);

          if (!hasUnlockedRef.current) {
            hasUnlockedRef.current = true;
            setIsUnlocked(true);
            onUnlocked();
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onUnlocked]);

  return (
    <div className="w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-[2rem] border border-champagne/30 bg-black/45 p-3 shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,215,123,0.18),transparent_44%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />

        <div className="relative aspect-video overflow-hidden rounded-[1.45rem] border border-white/10 bg-obsidian">
          {videoSource.kind === "embed" ? (
            <iframe
              src={videoSource.url}
              title={placeholderText}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : videoSource.kind === "direct" ? (
            <video
              src={videoSource.url}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full bg-black object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-champagne/35 bg-champagne/10 text-4xl text-champagne shadow-glow">
                ▶
              </div>

              <p className="font-serif text-3xl text-linen md:text-5xl">
                {placeholderText}
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-muted">
                Aquí irá el vídeo real de Lily antes del lanzamiento.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-[1.5rem] border border-champagne/35 bg-gradient-to-br from-champagne/12 via-white/[0.04] to-black/20 px-6 py-7 text-center shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-champagne">
          {isUnlocked ? "Acceso desbloqueado" : unlockLabel}
        </p>

        <div className="mt-4 font-serif text-6xl leading-none text-linen md:text-7xl">
          {formatTime(remainingSeconds)}
        </div>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-linen/80">
          {isUnlocked
            ? "Ya puedes avanzar y solicitar tu acceso al reto."
            : lockedText}
        </p>
      </div>
    </div>
  );
}
