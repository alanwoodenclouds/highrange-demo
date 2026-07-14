"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Heart, User, Menu, X, MapPin,
  ChevronDown, LayoutDashboard, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useCartStore, useWishlistStore } from "@/stores";
import { CATEGORIES_WITH_COUNTS } from "@/data";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?filter=deals", label: "Deals" },
  { href: "/products?filter=new", label: "New Arrivals" },
  { href: "/compare", label: "Compare" },
  { href: "/account", label: "My Account" },
];

export function StoreHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  useEffect(() => setMounted(true), []);

  const cartBadge = mounted ? itemCount : 0;
  const wishBadge = mounted ? wishlistCount : 0;

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Utility strip — black, not loud full-width red */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] tracking-wide">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-primary" />
              <span className="text-zinc-200">1800-HIGHRANGE</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-zinc-400">
              <MapPin className="h-3 w-3" /> 6 stores across Idukki
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-3 w-3" /> Staff
            </Link>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <span className="text-zinc-400">
              Free delivery over <span className="text-white font-medium">₹10,000</span>
            </span>
          </div>
        </div>
      </div>

      <div className="glass">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[4.25rem] items-center gap-3 sm:gap-5">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>

            <BrandLogo variant="full" size="md" priority className="hidden sm:inline-flex" />
            <BrandLogo variant="mark" size="md" priority className="sm:hidden" />

            <div className="relative hidden lg:block">
              <Button
                variant="outline"
                className="gap-1.5 h-10 rounded-full border-border/80 bg-background/60 px-4"
                onClick={() => setCatOpen(!catOpen)}
              >
                Categories
                <ChevronDown className={cn("h-4 w-4 opacity-60 transition-transform", catOpen && "rotate-180")} />
              </Button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-80 rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 p-2 z-50"
                  >
                    <div className="grid grid-cols-1 max-h-[70vh] overflow-y-auto">
                      {CATEGORIES_WITH_COUNTS.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={() => setCatOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-xs tabular-nums text-muted-foreground">{cat.productCount}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form action="/products" className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  name="q"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search TVs, ACs, mobiles, appliances…"
                  className="h-11 pl-10 rounded-full bg-muted/70 border-transparent focus-visible:border-primary/30 focus-visible:bg-background focus-visible:ring-primary/20"
                />
              </div>
            </form>

            <div className="flex items-center gap-0.5 ml-auto">
              <ThemeToggle />
              <Link href="/account?tab=wishlist">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                  <Heart className="h-[1.15rem] w-[1.15rem]" />
                  {wishBadge > 0 && (
                    <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center">
                      {wishBadge}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                  <ShoppingCart className="h-[1.15rem] w-[1.15rem]" />
                  {cartBadge > 0 && (
                    <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center">
                      {cartBadge}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <User className="h-[1.15rem] w-[1.15rem]" />
                </Button>
              </Link>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 pb-2.5 -mt-0.5">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-[13px] font-medium px-3 py-1.5 rounded-full transition-colors",
                    active
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-b border-border bg-card overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <form action="/products">
                <Input name="q" placeholder="Search products…" className="rounded-full bg-muted/60" />
              </form>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm font-medium border-b border-border/50 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-2">
                  CATEGORIES
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {CATEGORIES_WITH_COUNTS.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
