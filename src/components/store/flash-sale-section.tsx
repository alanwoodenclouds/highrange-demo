"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import type { Product } from "@/types";
import { CountdownTimer } from "@/components/store/countdown-timer";
import { ProductCard } from "@/components/store/product-card";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";

interface FlashSaleSectionProps {
  products: Product[];
}

function getFlashSaleEnd(): Date {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}

export function FlashSaleSection({ products }: FlashSaleSectionProps) {
  const endDate = getFlashSaleEnd();

  return (
    <FadeIn>
      <section className="relative overflow-hidden rounded-[1.75rem] brand-panel p-6 sm:p-8 lg:p-10 ring-1 ring-white/10">
        {/* Thin red accent edge */}
        <div className="absolute left-0 top-8 bottom-8 w-1 rounded-full bg-gradient-to-b from-primary via-primary/80 to-transparent" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 pl-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 border border-primary/25 px-3 py-1 text-primary text-xs font-semibold tracking-wide uppercase mb-3">
              <Zap className="h-3.5 w-3.5" />
              Flash sale · Ends tonight
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Lightning deals
            </h2>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base max-w-md">
              Limited stock on select appliances — same-day delivery across Idukki.
            </p>
          </div>
          <CountdownTimer targetDate={endDate} />
        </div>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 5).map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="relative mt-8 text-center">
          <Button
            asChild
            className="rounded-full bg-white text-zinc-950 hover:bg-zinc-100 h-11 px-8 font-semibold"
          >
            <Link href="/products?filter=flash">View all flash deals</Link>
          </Button>
        </div>
      </section>
    </FadeIn>
  );
}
