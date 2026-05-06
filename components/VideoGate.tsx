"use client";

import { useEffect, useRef, useState } from "react";

type VideoGateProps = {
  url: string;
  placeholderText: string;
  lockedText: string;
  unlockAfterSeconds: number;
  onUnlocked: () => void;
};

export function VideoGate({ url, placeholderText, lockedText, unlockAfterSeconds, onUnlocked }: VideoGateProps) {
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const unlockedRef = useRef(false);

  useEffect(() => {
    if (!isPlaying || unlockedRef.current) return;

    const timer = window.setInterval(() => {
      setSecondsWatched((current) => {
        const next = current + 1;
        if (next >= unlockAfterSeconds && !unlockedRef.current) {
          unlockedRef.current = true;
          onUnlocked();
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, onUnlocked, unlockAfterSeconds]);

  const progress = Math.min(100, Math.round((secondsWatched / unlockAfterSeconds) * 100));

  return (
    <div className="w-full max-w-4xl">
      <button
        type="button"
        onClick={() => setIsPlaying(true)}
        className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-charcoal/70 text-left shadow-soft outline-none transition duration-700 hover:border-champagne/40"
        aria-label="Reproducir vídeo"
      >
        {url ? (
          <iframe
            src={url}
            title={placeholderText}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,202,80,.18),transparent_34%),linear-gradient(135deg,rgba(228,191,175,.16),transparent_38%),#1f1b13]" />
        )}

        {!url && (
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-champagne/70 bg-surface/45 text-champagne backdrop-blur-md transition duration-500 group-hover:scale-105 group-hover:shadow-glow">
              <span className="ml-1 text-5xl">▶</span>
            </div>
            <div>
              <p className="font-serif text-2xl text-linen">{placeholderText}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.28em] text-muted/70">Click para simular reproducción</p>
            </div>
          </div>
        )}
      </button>

      <div className="mt-6 h-px w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-gradient-to-r from-rose to-champagne transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-outline/70 px-5 py-3 text-xs uppercase tracking-[0.22em] text-muted/75">
        <span>{progress >= 100 ? "Desbloqueado" : "Bloqueado"}</span>
        <span className="h-1 w-1 rounded-full bg-champagne/70" />
        <span>{lockedText}</span>
      </div>
    </div>
  );
}
