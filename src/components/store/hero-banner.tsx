"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { PromoBanner } from "@/types";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SafeImage } from "@/components/shared/safe-image";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  banners: PromoBanner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + banners.length) % banners.length);
    },
    [banners.length]
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, scale: 1.04, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, scale: 0.98, x: dir > 0 ? -40 : 40 }),
  };

  const banner = banners[current];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Full-bleed plane — brand + one story */}
      <div className="relative min-h-[72vh] sm:min-h-[78vh] lg:min-h-[82vh] max-h-[860px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={banner.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={banner.image}
              alt=""
              fill
              priority={current === 0}
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
            {/* Clean scrim — no muddy red wash over photography */}
            <div className="absolute inset-0 hero-scrim" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

            <div className="absolute inset-0 flex flex-col justify-end sm:justify-center pb-16 sm:pb-0">
              <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.45 }}
                  className="mb-6 sm:mb-8"
                >
                  <BrandLogo variant="full" size="lg" href="/" className="shadow-2xl shadow-black/40" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/70 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-3"
                >
                  {banner.cta === "Shop Now" ? "Seasonal offer" : "Highrange exclusive"}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="font-display text-[2.35rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight max-w-xl"
                >
                  {banner.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 }}
                  className="text-white/80 text-base sm:text-lg mt-4 max-w-md leading-relaxed"
                >
                  {banner.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44 }}
                  className="mt-8 flex flex-wrap items-center gap-3"
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2"
                  >
                    <Link href={banner.href}>
                      {banner.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full h-12 px-6 border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
                  >
                    <Link href="/products">Browse all</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 hidden sm:flex"
          onClick={prev}
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 hidden sm:flex"
          onClick={next}
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === current ? "w-9 bg-primary" : "w-2 bg-white/40 hover:bg-white/70"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
