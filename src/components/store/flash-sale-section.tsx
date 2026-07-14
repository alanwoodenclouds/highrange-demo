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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-primary to-slate-900 p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-10" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-brand/20 border border-accent-brand/30 px-3 py-1 text-accent-brand text-sm font-medium mb-3">
              <Zap className="h-4 w-4" />
              Flash Sale
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Today&apos;s Lightning Deals
            </h2>
            <p className="text-white/70 mt-1 text-sm sm:text-base">
              Limited stock · Extra savings on select appliances
            </p>
          </div>
          <CountdownTimer targetDate={endDate} />
        </div>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="relative mt-6 text-center">
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/products?filter=flash">View All Flash Deals</Link>
          </Button>
        </div>
      </section>
    </FadeIn>
  );
}
