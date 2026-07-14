"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Hours", value: pad(timeLeft.hours) },
    { label: "Mins", value: pad(timeLeft.minutes) },
    { label: "Secs", value: pad(timeLeft.seconds) },
  ];

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)} suppressHydrationWarning>
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <div className="countdown-pulse min-w-[52px] sm:min-w-[64px] rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 sm:px-4 sm:py-3">
              <span className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums" suppressHydrationWarning>
                {mounted ? unit.value : "00"}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-white/70 mt-1 uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-display text-2xl font-bold text-white/50 -mt-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
