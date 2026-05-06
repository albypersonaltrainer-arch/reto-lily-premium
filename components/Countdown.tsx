"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  deadlineIso: string;
  urgencyMinutes?: number;
};

type TimeLeft = {
  minutes: number;
  seconds: number;
};

function getInitialDeadline(deadlineIso: string, urgencyMinutes?: number) {
  if (urgencyMinutes && urgencyMinutes > 0) {
    return Date.now() + urgencyMinutes * 60 * 1000;
  }

  const parsedDeadline = new Date(deadlineIso).getTime();

  if (Number.isNaN(parsedDeadline)) {
    return Date.now() + 30 * 60 * 1000;
  }

  return parsedDeadline;
}

function calculateTimeLeft(deadline: number): TimeLeft {
  const difference = Math.max(0, deadline - Date.now());
  const totalSeconds = Math.floor(difference / 1000);

  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60
  };
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export function Countdown({ deadlineIso, urgencyMinutes }: CountdownProps) {
  const deadline = useMemo(
    () => getInitialDeadline(deadlineIso, urgencyMinutes),
    [deadlineIso, urgencyMinutes]
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(deadline));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [deadline]);

  return (
    <div className="glass-panel pattern-card rounded-xl p-8 text-center md:p-12">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-champagne">
        Cuenta atrás
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-champagne/20 bg-black/25 p-6">
          <div className="font-serif text-6xl text-linen md:text-7xl">
            {twoDigits(timeLeft.minutes)}
          </div>
          <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
            Minutos
          </div>
        </div>

        <div className="rounded-2xl border border-champagne/20 bg-black/25 p-6">
          <div className="font-serif text-6xl text-linen md:text-7xl">
            {twoDigits(timeLeft.seconds)}
          </div>
          <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
            Segundos
          </div>
        </div>
      </div>

      <p className="mt-7 text-sm leading-7 text-muted">
        Este acceso está disponible por tiempo limitado.
      </p>
    </div>
  );
}
