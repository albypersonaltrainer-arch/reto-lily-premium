"use client";

import { useEffect, useMemo, useState } from "react";

function getRemaining(deadlineIso: string) {
  const total = Math.max(0, new Date(deadlineIso).getTime() - Date.now());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown({ deadlineIso }: { deadlineIso: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(deadlineIso));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(deadlineIso)), 1000);
    return () => window.clearInterval(timer);
  }, [deadlineIso]);

  const parts = useMemo(
    () => [
      { label: "Días", value: remaining.days },
      { label: "Horas", value: remaining.hours },
      { label: "Min", value: remaining.minutes },
      { label: "Seg", value: remaining.seconds }
    ],
    [remaining]
  );

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-5">
      {parts.map((part) => (
        <div key={part.label} className="glass-panel rounded-xl px-4 py-5 text-center">
          <div className="font-serif text-3xl md:text-4xl text-champagne text-glow">
            {String(part.value).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-muted/75">{part.label}</div>
        </div>
      ))}
    </div>
  );
}
