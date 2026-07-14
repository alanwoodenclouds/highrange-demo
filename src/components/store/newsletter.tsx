"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/shared/page-transition";
import { BrandLogo } from "@/components/shared/brand-logo";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      toast.success("Welcome to Highrange!", {
        description: "You'll receive exclusive deals and new arrivals.",
      });
    }, 800);
  };

  return (
    <FadeIn>
      <section className="relative overflow-hidden rounded-[1.75rem] brand-panel p-8 sm:p-12 lg:p-16 ring-1 ring-white/10">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-6">
            <BrandLogo variant="mark" size="lg" href={undefined} />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
            Deals before they sell out
          </h2>
          <p className="text-zinc-400 mb-8 text-sm sm:text-base leading-relaxed">
            Flash sales, new launches, and member offers — delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/95 border-0 h-12 rounded-full text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-12 px-8 rounded-full shrink-0 bg-primary hover:bg-primary/90"
            >
              {loading ? "Joining…" : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-zinc-500 mt-5">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </FadeIn>
  );
}
