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
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> 1800-HIGHRANGE
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="h-3 w-3" /> 6 Stores across Idukki
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100">
              <LayoutDashboard className="h-3 w-3" /> Store Admin
            </Link>
            <span className="opacity-50">|</span>
            <span>Free delivery over ₹10,000</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="glass border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>

            <div className="shrink-0">
              <BrandLogo variant="full" size="md" priority className="hidden sm:block" />
              <BrandLogo variant="mark" size="sm" priority className="sm:hidden" />
            </div>

            {/* Categories */}
            <div className="relative hidden lg:block">
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => setCatOpen(!catOpen)}
              >
                Categories <ChevronDown className={cn("h-4 w-4 transition-transform", catOpen && "rotate-180")} />
              </Button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-xl p-2 z-50"
                  >
                    {CATEGORIES_WITH_COUNTS.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-muted-foreground">{cat.productCount}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <form
              action="/products"
              className="flex-1 max-w-xl hidden md:flex"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search TVs, ACs, mobiles, appliances..."
                  className="pl-9 bg-muted/50 border-transparent focus:border-primary focus:bg-background"
                />
              </div>
            </form>

            <div className="flex items-center gap-1 ml-auto">
              <ThemeToggle />
              <Link href="/account?tab=wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishBadge > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-accent-brand border-0">
                      {wishBadge}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartBadge > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-accent-brand border-0">
                      {cartBadge}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-6 h-10 -mt-1 pb-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative py-1",
                  pathname === link.href && "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
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
                <Input name="q" placeholder="Search products..." className="bg-muted/50" />
              </form>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">CATEGORIES</p>
                {CATEGORIES_WITH_COUNTS.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-1.5 text-sm"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
