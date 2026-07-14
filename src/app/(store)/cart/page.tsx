"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { COUPONS } from "@/data/constants";
import { useCartStore } from "@/stores";
import { formatCurrency, cn } from "@/lib/utils";
import { PageTransition, FadeIn } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function CartPage() {
  const {
    items,
    coupon,
    couponDiscount,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    getSubtotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);

  const subtotal = getSubtotal();
  const deliveryCharge = subtotal > 10000 || coupon === "FREEDEL" ? 0 : subtotal > 0 ? 199 : 0;
  const tax = Math.round((subtotal - couponDiscount) * 0.18);
  const total = Math.max(0, subtotal - couponDiscount + deliveryCharge + tax);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }

    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      const found = COUPONS.find((c) => c.code === code);

      if (!found) {
        toast.error("Invalid coupon code");
        return;
      }

      if (subtotal < found.minOrder) {
        toast.error(`Minimum order ${formatCurrency(found.minOrder)} required`);
        return;
      }

      let discount = 0;
      if (found.type === "percent") {
        discount = Math.min(Math.round(subtotal * (found.discount / 100)), found.maxDiscount);
      } else if (found.type === "flat") {
        discount = found.discount;
      } else if (found.type === "shipping") {
        discount = 0;
      }

      applyCoupon(code, discount);
      toast.success(`Coupon "${code}" applied!`, {
        description: found.type === "shipping" ? "Free delivery unlocked" : `You saved ${formatCurrency(discount)}`,
      });
      setCouponInput("");
    }, 400);
  };

  if (items.length === 0) {
    return (
      <PageTransition className="pb-16">
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2 mb-8">
            Discover premium appliances for your home
          </p>
          <Button asChild size="lg" className="rounded-full gap-2">
            <Link href="/products">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <FadeIn>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6">
            Shopping Cart
            <span className="text-muted-foreground font-normal text-lg ml-2">
              ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </h1>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <FadeIn key={product.id}>
                <div className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-medium text-sm sm:text-base hover:text-primary line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-display font-bold">{formatCurrency(product.price)}</span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(product.mrp)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive gap-1"
                        onClick={() => {
                          removeItem(product.id);
                          toast.success("Item removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="font-display font-bold">{formatCurrency(product.price * quantity)}</p>
                  </div>
                </div>
              </FadeIn>
            ))}

            {/* Coupon suggestions */}
            <div className="flex flex-wrap gap-2 pt-2">
              {COUPONS.slice(0, 3).map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCouponInput(c.code);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          <div>
            <FadeIn delay={0.1}>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="pl-9"
                        disabled={!!coupon}
                      />
                    </div>
                    {coupon ? (
                      <Button variant="outline" onClick={removeCoupon}>
                        Remove
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={handleApplyCoupon} disabled={applying}>
                        Apply
                      </Button>
                    )}
                  </div>

                  {coupon && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <Badge variant="success">{coupon}</Badge>
                      {couponDiscount > 0 && <span>Saved {formatCurrency(couponDiscount)}</span>}
                      {coupon === "FREEDEL" && <span>Free delivery applied</span>}
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Coupon discount</span>
                        <span>-{formatCurrency(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className={cn(deliveryCharge === 0 && "text-emerald-600")}>
                        {deliveryCharge === 0 ? "FREE" : formatCurrency(deliveryCharge)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {subtotal < 10000 && deliveryCharge > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatCurrency(10000 - subtotal)} more for free delivery
                    </p>
                  )}

                  <Button asChild size="lg" className="w-full gap-2 rounded-xl">
                    <Link href="/checkout">
                      Proceed to Checkout <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
