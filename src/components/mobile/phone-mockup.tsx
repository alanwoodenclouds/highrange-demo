"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, TabletSmartphone } from "lucide-react";
import { MobileAppDemo } from "@/components/mobile/mobile-app-demo";
import { cn } from "@/lib/utils";

type DeviceFrame = "iphone" | "android";

const FRAME = {
  iphone: {
    label: "iPhone 15",
    width: 320,
    height: 660,
    radius: "3rem",
    notch: true,
    bezel: "bg-zinc-900 ring-[3px] ring-zinc-700 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_25px_80px_-12px_rgba(0,0,0,0.65)]",
  },
  android: {
    label: "Pixel 8",
    width: 320,
    height: 660,
    radius: "2.25rem",
    notch: false,
    bezel: "bg-zinc-800 ring-[3px] ring-zinc-600 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_80px_-12px_rgba(0,0,0,0.65)]",
  },
} as const;

export function PhoneMockup() {
  const [device, setDevice] = useState<DeviceFrame>("iphone");
  const frame = FRAME[device];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-2 rounded-full bg-zinc-900/80 border border-white/10 p-1">
        {(Object.keys(FRAME) as DeviceFrame[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setDevice(key)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
              device === key
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-zinc-400 hover:text-white"
            )}
          >
            {key === "iphone" ? (
              <Smartphone className="h-4 w-4" />
            ) : (
              <TabletSmartphone className="h-4 w-4" />
            )}
            {FRAME[key].label}
          </button>
        ))}
      </div>

      <motion.div
        key={device}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative"
        style={{ width: frame.width + 24, height: frame.height + 24 }}
      >
        {/* Side buttons (iPhone) */}
        {device === "iphone" && (
          <>
            <div className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-zinc-600" />
            <div className="absolute -left-[3px] top-40 h-12 w-[3px] rounded-l bg-zinc-600" />
            <div className="absolute -left-[3px] top-56 h-12 w-[3px] rounded-l bg-zinc-600" />
            <div className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-zinc-600" />
          </>
        )}

        <div
          className={cn("absolute inset-0 p-3 rounded-[3.25rem]", frame.bezel)}
          style={{ borderRadius: frame.radius === "3rem" ? "3.25rem" : "2.5rem" }}
        >
          <div
            className="relative h-full w-full overflow-hidden bg-black"
            style={{ borderRadius: frame.radius }}
          >
            {frame.notch && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-[120px] h-[28px] bg-black rounded-b-2xl flex items-end justify-center pb-1">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
              </div>
            )}

            {!frame.notch && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 h-1.5 w-1.5 rounded-full bg-zinc-600" />
            )}

            <MobileAppDemo />
          </div>
        </div>

        {/* Reflection highlight */}
        <div
          className="pointer-events-none absolute inset-3 rounded-[2.5rem] bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
          style={{ borderRadius: frame.radius }}
        />
      </motion.div>

      <p className="text-sm text-zinc-500 text-center max-w-xs">
        Tap tabs, open products, and add items to cart — all inside the live mobile preview.
      </p>
    </div>
  );
}
