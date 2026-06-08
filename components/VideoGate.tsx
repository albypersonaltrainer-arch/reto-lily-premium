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
      <div className="relative overflow-hidden rounded-[2rem] border border-[#b78a3d]/25 bg-[#fffaf1]/90 p-3 shadow-[0_28px_90px_rgba(82,55,24,0.16)] backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(216,182,106,0.22),transparent_48%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#b78a3d]/55 to-transparent" />

        <div className="relative aspect-video overflow-hidden rounded-[1.45rem] border border-[#6f3d2e]/15 bg-[#2d2118] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
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
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#d8b66a]/45 bg-[#d8b66a]/15 text-4xl text-[#ead7ae] shadow-[0_0_50px_rgba(216,182,106,0.25)]">
                ▶
              </div>

              <p className="font-serif text-3xl text-[#fffaf1] md:text-5xl">
                {placeholderText}
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#ead7ae]/80">
                Aquí irá el vídeo real de Lily antes del lanzamiento.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-[1.7rem] border border-[#b78a3d]/30 bg-[#fffaf1]/92 px-6 py-7 text-center shadow-[0_24px_75px_rgba(82,55,24,0.15)] backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8a6428]">
          {isUnlocked ? "Acceso desbloqueado" : unlockLabel}
        </p>

        <div className="mt-4 font-serif text-6xl leading-none text-[#2d2118] md:text-7xl">
          {formatTime(remainingSeconds)}
        </div>

        <p className="mx-auto mt-5 max-w-xl text-base font-semibold leading-7 text-[#4a3524]">
          {isUnlocked
            ? "Ya puedes avanzar y solicitar tu acceso al reto."
            : "Antes de continuar, mira este breve vídeo donde te explico cómo funciona el reto."}
        </p>
      </div>
    </div>
  );
}
