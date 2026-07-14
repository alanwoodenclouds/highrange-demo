"use client";

import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/shared/page-transition";

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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-[#e31e24] to-black p-8 sm:p-12 lg:p-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-brand/20 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-primary-foreground/90 mb-4">
            <Sparkles className="h-4 w-4" />
            Join 25,000+ subscribers
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3">
            Get exclusive deals in your inbox
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-sm sm:text-base">
            Be the first to know about flash sales, new launches, and member-only offers across Idukki.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-white border-0 h-12"
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={loading}
              className="h-12 px-8 rounded-lg shrink-0"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-primary-foreground/60 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </FadeIn>
  );
}
