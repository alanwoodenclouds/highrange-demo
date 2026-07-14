"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Menu,
  Star,
  ChevronRight,
  Wifi,
  Signal,
  Battery,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Smartphone,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";
import {
  PRODUCTS,
  CATEGORIES_WITH_COUNTS,
  PROMO_BANNERS,
} from "@/data";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SafeImage } from "@/components/shared/safe-image";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/types";

type TabId = "home" | "shop" | "cart" | "account";
type ScreenId = TabId | "product";

interface CartLine {
  product: Product;
  qty: number;
}

const FEATURED = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
const TRENDING = PRODUCTS.filter((p) => p.isTrending).slice(0, 6);

function StatusBar() {
  const [time, setTime] = useState("12:00");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between px-5 pt-2.5 pb-1 text-[11px] font-semibold text-white select-none">
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5 opacity-90">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <Battery className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

function MobileHeader({
  title,
  showBack,
  onBack,
  cartCount,
}: {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  cartCount?: number;
}) {
  return (
    <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-md border-b border-white/5 px-3 py-2 flex items-center gap-2">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </button>
      ) : (
        <button type="button" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
          <Menu className="h-4 w-4 text-white" />
        </button>
      )}
      {title ? (
        <span className="font-display font-semibold text-white text-sm flex-1 truncate">{title}</span>
      ) : (
        <div className="flex-1 scale-[0.85] origin-left">
          <BrandLogo variant="full" size="sm" href={undefined} />
        </div>
      )}
      <button type="button" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
        <Search className="h-4 w-4 text-white" />
      </button>
      <button type="button" className="relative h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
        <ShoppingCart className="h-4 w-4 text-white" />
        {(cartCount ?? 0) > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-[9px] font-bold text-white flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}

function ProductRow({
  product,
  onTap,
  compact,
}: {
  product: Product;
  onTap: (p: Product) => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={() => onTap(product)}
      className={cn(
        "text-left rounded-2xl bg-zinc-900/80 border border-white/5 overflow-hidden active:border-primary/30 transition-colors",
        compact ? "flex gap-3 p-2" : "w-[140px] shrink-0"
      )}
    >
      <div className={cn("relative bg-zinc-800 overflow-hidden", compact ? "h-16 w-16 rounded-xl shrink-0" : "aspect-square w-full")}>
        <SafeImage src={product.images[0]} alt={product.name} fill className="object-cover" sizes="140px" unoptimized />
        {product.discount > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            -{product.discount}%
          </span>
        )}
      </div>
      <div className={cn(compact ? "flex-1 min-w-0 py-0.5" : "p-2.5")}>
        <p className="text-[10px] text-zinc-500">{product.brand}</p>
        <p className="text-[11px] font-medium text-white line-clamp-2 leading-snug mt-0.5">{product.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          <span className="text-[10px] text-zinc-400">{product.rating}</span>
        </div>
        <p className="text-xs font-bold text-white mt-1">{formatCurrency(product.price)}</p>
      </div>
    </motion.button>
  );
}

function HomeScreen({ onProductTap, onCategoryTap }: { onProductTap: (p: Product) => void; onCategoryTap: () => void }) {
  const banner = PROMO_BANNERS[0];

  return (
    <div className="space-y-4 pb-4">
      <div className="relative mx-3 mt-2 rounded-2xl overflow-hidden aspect-[16/10] ring-1 ring-white/10">
        <SafeImage src={banner.image} alt="" fill className="object-cover" sizes="320px" unoptimized />
        <div className="absolute inset-0 hero-scrim" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <span className="text-[9px] uppercase tracking-widest text-white/60 mb-1">Exclusive</span>
          <h2 className="font-display text-lg font-bold text-white leading-tight">{banner.title}</h2>
          <p className="text-[11px] text-white/75 mt-1 line-clamp-2">{banner.subtitle}</p>
          <motion.span
            whileTap={{ scale: 0.95 }}
            className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white"
          >
            Shop now <ChevronRight className="h-3 w-3" />
          </motion.span>
        </div>
      </div>

      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-white">Categories</h3>
          <button type="button" onClick={onCategoryTap} className="text-[10px] text-primary">
            See all
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {CATEGORIES_WITH_COUNTS.slice(0, 8).map((cat) => (
            <motion.button
              key={cat.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onCategoryTap}
              className="shrink-0 w-[72px] text-center"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-white/10 mb-1">
                <SafeImage src={cat.image} alt={cat.name} fill className="object-cover" sizes="72px" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <span className="text-[9px] text-zinc-400 line-clamp-2 leading-tight">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-3">
        <h3 className="text-xs font-semibold text-white mb-2">Featured</h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {FEATURED.map((p) => (
            <ProductRow key={p.id} product={p} onTap={onProductTap} />
          ))}
        </div>
      </div>

      <div className="mx-3 rounded-2xl brand-panel p-4 ring-1 ring-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Flash sale</span>
        </div>
        <p className="text-sm font-bold text-white">Ends tonight · Up to 40% off</p>
        <div className="flex gap-3 mt-3">
          {["04", "12", "38"].map((v, i) => (
            <div key={i} className="text-center">
              <div className="bg-white/10 rounded-lg px-2 py-1 text-sm font-bold text-white tabular-nums">{v}</div>
              <span className="text-[8px] text-zinc-500 uppercase">{["Hrs", "Min", "Sec"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopScreen({ onProductTap }: { onProductTap: (p: Product) => void }) {
  const [filter, setFilter] = useState("all");
  const chips = ["all", "TVs", "ACs", "Mobiles", "Deals"];

  return (
    <div className="px-3 pb-4 space-y-3">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition-colors",
              filter === c ? "bg-primary text-white" : "bg-white/10 text-zinc-400"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TRENDING.map((p) => (
          <ProductRow key={p.id} product={p} onTap={onProductTap} />
        ))}
      </div>
    </div>
  );
}

function ProductScreen({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  const [qty, setQty] = useState(1);

  return (
    <div className="pb-24">
      <div className="relative aspect-square bg-zinc-900">
        <SafeImage src={product.images[0]} alt={product.name} fill className="object-cover" sizes="360px" unoptimized />
      </div>
      <div className="px-4 pt-4 space-y-3">
        <p className="text-xs text-primary font-medium">{product.brand}</p>
        <h2 className="font-display text-base font-bold text-white leading-snug">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-zinc-400">{product.rating} · {product.reviewCount} reviews</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">{formatCurrency(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-sm text-zinc-500 line-through">{formatCurrency(product.mrp)}</span>
          )}
        </div>
        <p className="text-[11px] text-zinc-400">EMI from {formatCurrency(product.emiFrom)}/mo · No-cost EMI</p>
        <div className="rounded-xl bg-zinc-900/80 border border-white/5 p-3 space-y-2">
          {product.specs.slice(0, 4).map((s) => (
            <div key={s.label} className="flex justify-between text-[11px]">
              <span className="text-zinc-500">{s.label}</span>
              <span className="text-zinc-300">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center rounded-full bg-zinc-800 border border-white/10">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 flex items-center justify-center">
              <Minus className="h-3.5 w-3.5 text-white" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-white tabular-nums">{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} className="h-9 w-9 flex items-center justify-center">
              <Plus className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onAdd(product)}
            className="flex-1 h-10 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30"
          >
            Add to cart
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function CartScreen({
  lines,
  onUpdateQty,
  onRemove,
}: {
  lines: CartLine[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <ShoppingCart className="h-12 w-12 text-zinc-600 mb-3" />
        <p className="text-sm font-medium text-white">Your cart is empty</p>
        <p className="text-xs text-zinc-500 mt-1">Browse products and add items</p>
      </div>
    );
  }

  return (
    <div className="px-3 pb-24 space-y-3">
      {lines.map(({ product, qty }) => (
        <div key={product.id} className="flex gap-3 rounded-2xl bg-zinc-900/80 border border-white/5 p-2.5">
          <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
            <SafeImage src={product.images[0]} alt="" fill className="object-cover" sizes="64px" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-white line-clamp-2">{product.name}</p>
            <p className="text-xs font-bold text-white mt-1">{formatCurrency(product.price)}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center rounded-full bg-zinc-800 text-[10px]">
                <button type="button" onClick={() => onUpdateQty(product.id, qty - 1)} className="h-6 w-6 flex items-center justify-center">
                  <Minus className="h-3 w-3 text-white" />
                </button>
                <span className="w-5 text-center text-white tabular-nums">{qty}</span>
                <button type="button" onClick={() => onUpdateQty(product.id, qty + 1)} className="h-6 w-6 flex items-center justify-center">
                  <Plus className="h-3 w-3 text-white" />
                </button>
              </div>
              <button type="button" onClick={() => onRemove(product.id)} className="text-zinc-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="rounded-2xl bg-zinc-900 border border-white/5 p-4 space-y-2">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Subtotal</span>
          <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Delivery</span>
          <span className="text-emerald-400">{subtotal > 10000 ? "FREE" : formatCurrency(199)}</span>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          className="w-full mt-2 h-10 rounded-full bg-primary text-white text-sm font-semibold"
        >
          Checkout · {formatCurrency(subtotal + (subtotal > 10000 ? 0 : 199))}
        </motion.button>
      </div>
    </div>
  );
}

function AccountScreen() {
  return (
    <div className="px-3 pb-4 space-y-4">
      <div className="rounded-2xl brand-panel p-4 ring-1 ring-white/10 flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-primary/20 ring-2 ring-primary/40 flex items-center justify-center text-lg font-bold text-primary">
          AM
        </div>
        <div>
          <p className="font-display font-bold text-white">Ananya Menon</p>
          <p className="text-[11px] text-zinc-400">Gold member · 2,450 points</p>
        </div>
      </div>
      {[
        { label: "My orders", sub: "3 active deliveries" },
        { label: "Wishlist", sub: "12 saved items" },
        { label: "Addresses", sub: "Kattappana, Thodupuzha" },
        { label: "Support", sub: "Chat with us" },
      ].map((item) => (
        <motion.button
          key={item.label}
          type="button"
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between rounded-xl bg-zinc-900/80 border border-white/5 px-4 py-3 text-left"
        >
          <div>
            <p className="text-sm font-medium text-white">{item.label}</p>
            <p className="text-[10px] text-zinc-500">{item.sub}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
        </motion.button>
      ))}
    </div>
  );
}

function BottomNav({
  active,
  cartCount,
  onChange,
}: {
  active: TabId;
  cartCount: number;
  onChange: (tab: TabId) => void;
}) {
  const tabs: { id: TabId; icon: typeof Home; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "shop", icon: Search, label: "Shop" },
    { id: "cart", icon: ShoppingCart, label: "Cart" },
    { id: "account", icon: User, label: "Account" },
  ];

  return (
    <div className="absolute bottom-0 inset-x-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-white/5 px-2 pb-6 pt-2">
      <div className="flex justify-around">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(id)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-zinc-500")} />
              <span className={cn("text-[9px] font-medium", isActive ? "text-primary" : "text-zinc-500")}>
                {label}
              </span>
              {id === "cart" && cartCount > 0 && (
                <span className="absolute top-0 right-1 h-3.5 min-w-3.5 px-0.5 rounded-full bg-primary text-[8px] font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-white/20" />
    </div>
  );
}

export function MobileAppDemo() {
  const [tab, setTab] = useState<TabId>("home");
  const [screen, setScreen] = useState<ScreenId>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const openProduct = (p: Product) => {
    setSelectedProduct(p);
    setScreen("product");
  };

  const goBack = () => {
    setScreen(tab);
    setSelectedProduct(null);
  };

  const handleTabChange = (t: TabId) => {
    setTab(t);
    setScreen(t);
    setSelectedProduct(null);
  };

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === p.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { product: p, qty: 1 }];
    });
    showToast("Added to cart");
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((l) => l.product.id !== id));
      return;
    }
    setCart((prev) => prev.map((l) => (l.product.id === id ? { ...l, qty } : l)));
  };

  return (
    <div className="relative h-full bg-zinc-950 text-white overflow-hidden rounded-[2.5rem]">
      <StatusBar />
      <MobileHeader
        title={screen === "product" ? "Product" : undefined}
        showBack={screen === "product"}
        onBack={goBack}
        cartCount={cartCount}
      />

      <div className="h-[calc(100%-7.5rem)] overflow-y-auto overflow-x-hidden scrollbar-hide overscroll-contain">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen + (selectedProduct?.id ?? "")}
            initial={{ opacity: 0, x: screen === "product" ? 24 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            {screen === "home" && (
              <HomeScreen onProductTap={openProduct} onCategoryTap={() => handleTabChange("shop")} />
            )}
            {screen === "shop" && <ShopScreen onProductTap={openProduct} />}
            {screen === "product" && selectedProduct && (
              <ProductScreen product={selectedProduct} onAdd={addToCart} />
            )}
            {screen === "cart" && (
              <CartScreen lines={cart} onUpdateQty={updateQty} onRemove={(id) => updateQty(id, 0)} />
            )}
            {screen === "account" && <AccountScreen />}
          </motion.div>
        </AnimatePresence>
      </div>

      {screen !== "product" && (
        <BottomNav active={tab} cartCount={cartCount} onChange={handleTabChange} />
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-white text-zinc-900 text-xs font-medium px-4 py-2 rounded-full shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
