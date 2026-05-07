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

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getEmbedUrl(url: string) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsedUrl.hostname.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean).pop();
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  } catch {
    return url;
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

  const embedUrl = useMemo(() => getEmbedUrl(url), [url]);

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
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={placeholderText}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
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
