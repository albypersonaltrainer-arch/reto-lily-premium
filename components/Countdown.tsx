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

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(deadline)
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [deadline]);

  return (
    <div className="rounded-[2rem] border border-[#b78a3d]/25 bg-[#fffaf1]/90 p-8 text-center shadow-[0_28px_90px_rgba(82,55,24,0.16)] backdrop-blur md:p-12">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8a6428]">
        Cuenta atrás
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#b78a3d]/30 bg-white/70 p-6 shadow-[0_18px_50px_rgba(82,55,24,0.12)]">
          <div className="font-serif text-6xl leading-none text-[#2d2118] md:text-7xl">
            {twoDigits(timeLeft.minutes)}
          </div>
          <div className="mt-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#7a5a2a]">
            Minutos
          </div>
        </div>

        <div className="rounded-2xl border border-[#b78a3d]/30 bg-white/70 p-6 shadow-[0_18px_50px_rgba(82,55,24,0.12)]">
          <div className="font-serif text-6xl leading-none text-[#2d2118] md:text-7xl">
            {twoDigits(timeLeft.seconds)}
          </div>
          <div className="mt-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#7a5a2a]">
            Segundos
          </div>
        </div>
      </div>

      <p className="mx-auto mt-7 max-w-md rounded-2xl border border-[#b78a3d]/25 bg-[#f3e5cf] px-5 py-4 text-base font-semibold leading-7 text-[#4a3524] shadow-[0_14px_40px_rgba(82,55,24,0.10)]">
        Este acceso está disponible por tiempo limitado.
      </p>
    </div>
  );
}
