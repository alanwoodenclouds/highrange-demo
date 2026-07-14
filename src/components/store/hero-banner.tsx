"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PromoBanner } from "@/types";
import { Button } from "@/components/ui/button";
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
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const banner = banners[current];

  return (
    <section className="relative w-full overflow-hidden rounded-2xl mx-auto max-w-7xl">
      <div className="relative aspect-[21/9] min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={banner.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority={current === 0}
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
            <div className={cn("absolute inset-0 bg-gradient-to-r", banner.gradient)} />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-sm sm:text-base font-medium tracking-wide uppercase mb-2"
              >
                Highrange Exclusive
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight"
              >
                {banner.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-base sm:text-lg mt-3 max-w-lg"
              >
                {banner.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <Button asChild size="lg" variant="accent" className="rounded-full px-8 shadow-xl">
                  <Link href={banner.href}>{banner.cta}</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg opacity-80 hover:opacity-100 hidden sm:flex"
          onClick={prev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg opacity-80 hover:opacity-100 hidden sm:flex"
          onClick={next}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
