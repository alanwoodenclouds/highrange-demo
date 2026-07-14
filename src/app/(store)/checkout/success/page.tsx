"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PageTransition, FadeIn } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderData {
  orderNumber: string;
  total: number;
  items: number;
  paymentMethod: string;
  address: { name: string; city: string; pincode: string };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("highrange-last-order");
    if (stored) {
      try {
        setOrderData(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const orderNumber = orderParam || orderData?.orderNumber || generateFallbackOrder();

  return (
    <PageTransition className="pb-16">
      <div className="mx-auto max-w-lg px-4 py-12 sm:py-20">
        <FadeIn>
          <div className="text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground mt-2">
              Thank you for shopping with Highrange Home Appliances
            </p>
          </div>

          <Card className="mt-8">
            <CardContent className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-border">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-display text-xl font-bold text-primary mt-1">{orderNumber}</p>
              </div>

              {orderData && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-medium">{formatCurrency(orderData.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{orderData.items}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium uppercase">{orderData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery to</span>
                    <span className="font-medium text-right">
                      {orderData.address.name}<br />
                      <span className="text-muted-foreground font-normal">
                        {orderData.address.city}, {orderData.address.pincode}
                      </span>
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-sm">
                <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Estimated delivery: 3–5 business days</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    You&apos;ll receive SMS updates on your registered mobile number
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button asChild className="flex-1 gap-2 rounded-xl">
              <Link href="/account?tab=orders">
                Track Order <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 gap-2 rounded-xl">
              <Link href="/">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}

function generateFallbackOrder() {
  return `HR${new Date().getFullYear()}${Math.floor(Math.random() * 900000 + 100000)}`;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
