import Link from "next/link";
import { ArrowLeft, MonitorSmartphone } from "lucide-react";
import { PhoneMockup } from "@/components/mobile/phone-mockup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Preview",
  description: "Interactive mobile mockup of the Highrange storefront experience.",
};

export default function MobilePreviewPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(226,35,26,0.18),transparent)] pointer-events-none" />

      <header className="relative z-10 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <MonitorSmartphone className="h-4 w-4 text-primary" />
            Mobile preview
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex text-sm text-primary hover:text-primary/80"
          >
            Full site →
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Interactive demo
            </span>
            <h1 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Highrange on mobile
            </h1>
            <p className="mt-4 max-w-lg text-zinc-400 text-base leading-relaxed mx-auto lg:mx-0">
              Explore how the storefront feels on a phone — browse categories, view product details,
              manage your cart, and switch between iPhone and Android frames.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-zinc-500 text-left max-w-md mx-auto lg:mx-0">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Bottom navigation: Home, Shop, Cart, Account
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Tap any product to open detail view with add-to-cart
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Real product data, brand styling, and smooth transitions
              </li>
            </ul>
          </div>

          <PhoneMockup />
        </div>
      </main>
    </div>
  );
}
