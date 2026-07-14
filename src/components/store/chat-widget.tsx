"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRODUCTS } from "@/data";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /ac|air.?condition|cool/i,
    reply: "Looking for an AC? Our best sellers are Voltas and LG 1.5 Ton inverter models. Browse Air Conditioners for summer deals up to 40% off!",
  },
  {
    match: /tv|television|oled|qled/i,
    reply: "Great choice! Samsung Crystal UHD and Sony Bravia are top picks. EMI from as low as ₹1,249/month available.",
  },
  {
    match: /fridge|refrigerator|fridge/i,
    reply: "For refrigerators, 5-star inverter models from LG and Samsung are popular in Idukki. Free delivery + installation!",
  },
  {
    match: /emi|loan|installment/i,
    reply: "No-cost EMI is available on select products for 3, 6, 9, and 12 months via major cards and Bajaj Finserv.",
  },
  {
    match: /deliver|shipping|store|branch/i,
    reply: "We deliver across Idukki from our 6 stores: Kattappana, Thodupuzha, Munnar, Kumily, Adimali & Nedumkandam. Free delivery over ₹10,000.",
  },
  {
    match: /warranty|service|repair/i,
    reply: "All products include manufacturer warranty. Our service center handles installation, repairs, and AMC — raise a request from your account.",
  },
  {
    match: /hello|hi|hey|help/i,
    reply: "Hello! I'm Highrange AI Assistant. Ask me about products, EMI, delivery, or stores. How can I help?",
  },
];

type Msg = { role: "user" | "bot"; text: string; productLinks?: { name: string; slug: string; price: number }[] };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm your Highrange AI shopping assistant. Ask about TVs, ACs, EMI, or delivery." },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);

    setTimeout(() => {
      const matched = REPLIES.find((r) => r.match.test(text));
      const related = PRODUCTS.filter(
        (p) =>
          text.toLowerCase().split(" ").some((w) => w.length > 2 && (p.name.toLowerCase().includes(w) || p.category.toLowerCase().includes(w)))
      ).slice(0, 2);

      setMsgs((m) => [
        ...m,
        {
          role: "bot",
          text: matched?.reply || "I can help with product recommendations, EMI, delivery to Idukki branches, and warranty. Try asking about ACs, TVs, or refrigerators!",
          productLinks: related.map((p) => ({ name: p.name, slug: p.slug, price: p.price })),
        },
      ]);
    }, 600);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[min(100vw-2rem,380px)] h-[480px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <div>
                <p className="font-display font-semibold text-sm">Highrange AI</p>
                <p className="text-[10px] opacity-80">Shopping assistant · Demo</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.productLinks && msg.productLinks.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.productLinks.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/product/${p.slug}`}
                            className="block rounded-lg bg-background/80 px-2.5 py-1.5 text-xs hover:bg-background transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            <span className="font-medium line-clamp-1">{p.name}</span>
                            <span className="text-primary">{formatCurrency(p.price)}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about products, EMI..."
                className="h-9"
              />
              <Button size="icon" className="h-9 w-9 shrink-0" onClick={send}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
