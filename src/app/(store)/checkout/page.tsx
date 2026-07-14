"use client";

import { useState } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Landmark,
  Check,
  MapPin,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore, useCheckoutStore } from "@/stores";
import type { Address, PaymentMethod } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { PageTransition, FadeIn } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  { id: "upi", label: "UPI", description: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", description: "Pay when you receive", icon: Banknote },
  { id: "emi", label: "No Cost EMI", description: "3, 6, 12 months", icon: Landmark },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, couponDiscount, getSubtotal, clearCart } = useCartStore();
  const { address, paymentMethod, setAddress, setPaymentMethod } = useCheckoutStore();

  const [form, setForm] = useState<Address>(
    address || {
      id: "addr-checkout",
      label: "Home",
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "Kerala",
      pincode: "",
      isDefault: true,
    }
  );
  const [placing, setPlacing] = useState(false);

  const subtotal = getSubtotal();
  const deliveryCharge = subtotal > 10000 || coupon === "FREEDEL" ? 0 : 199;
  const tax = Math.round((subtotal - couponDiscount) * 0.18);
  const total = Math.max(0, subtotal - couponDiscount + deliveryCharge + tax);

  if (items.length === 0) {
    return (
      <PageTransition className="pb-16">
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Nothing to checkout</h1>
          <p className="text-muted-foreground mt-2 mb-8">Your cart is empty</p>
          <Button asChild><Link href="/products">Browse Products</Link></Button>
        </div>
      </PageTransition>
    );
  }

  const updateField = (field: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode) {
      toast.error("Please fill in all required address fields");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "").slice(-10))) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setPlacing(true);
    setAddress(form);

    setTimeout(() => {
      const orderNumber = `HR${new Date().getFullYear()}${Math.floor(Math.random() * 900000 + 100000)}`;
      sessionStorage.setItem(
        "highrange-last-order",
        JSON.stringify({
          orderNumber,
          total,
          items: items.length,
          paymentMethod,
          address: form,
        })
      );
      clearCart();
      setPlacing(false);
      router.push(`/checkout/success?order=${orderNumber}`);
    }, 1500);
  };

  return (
    <PageTransition className="pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <FadeIn>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <FadeIn>
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Pincode *</label>
                    <Input
                      value={form.pincode}
                      onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit pincode"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">Address Line 1 *</label>
                    <Input
                      value={form.line1}
                      onChange={(e) => updateField("line1", e.target.value)}
                      placeholder="House no., street, area"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">Address Line 2</label>
                    <Input
                      value={form.line2 || ""}
                      onChange={(e) => updateField("line2", e.target.value)}
                      placeholder="Landmark (optional)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">City *</label>
                    <Input
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">State</label>
                    <Input value={form.state} onChange={(e) => updateField("state", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Payment */}
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {PAYMENT_METHODS.map(({ id, label, description, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                        paymentMethod === id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        paymentMethod === id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                      {paymentMethod === id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Summary */}
          <div>
            <FadeIn delay={0.2}>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-3">
                        <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                          <SafeImage
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                            unoptimized
                          />
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                            {quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs line-clamp-2">{product.name}</p>
                          <p className="text-sm font-medium mt-0.5">
                            {formatCurrency(product.price * quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>{deliveryCharge === 0 ? "FREE" : formatCurrency(deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full rounded-xl gap-2"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                  >
                    {placing ? "Placing Order..." : `Place Order · ${formatCurrency(total)}`}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    Secure checkout · 256-bit encryption
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
