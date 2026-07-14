"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  RotateCcw,
  HeadphonesIcon,
  Star,
  Crown,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { CUSTOMERS, ORDERS, PRODUCTS, SERVICE_REQUESTS } from "@/data";
import { useWishlistStore, useCartStore } from "@/stores";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { PageTransition, FadeIn } from "@/components/shared/page-transition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/store/product-card";

const MOCK_CUSTOMER = CUSTOMERS[0];

const STATUS_COLORS: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  pending: "warning",
  confirmed: "default",
  processing: "default",
  shipped: "secondary",
  out_for_delivery: "secondary",
  delivered: "success",
  cancelled: "destructive",
  returned: "destructive",
  open: "warning",
  assigned: "default",
  in_progress: "default",
  awaiting_parts: "warning",
  completed: "success",
};

function AccountContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const wishlistIds = useWishlistStore((s) => s.ids);
  const { toggle: toggleWish, clear: clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  const customerOrders = ORDERS.filter((o) => o.customerId === MOCK_CUSTOMER.id).slice(0, 10);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const supportTickets = SERVICE_REQUESTS.filter((s) => s.customerId === MOCK_CUSTOMER.id).slice(0, 5);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  return (
    <PageTransition className="pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <FadeIn>
          <div className="flex items-center gap-4 mb-8">
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-primary/10 ring-2 ring-primary/20">
              {MOCK_CUSTOMER.avatar ? (
                <Image
                  src={MOCK_CUSTOMER.avatar}
                  alt={MOCK_CUSTOMER.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-display font-bold text-primary text-xl">
                  {getInitials(MOCK_CUSTOMER.name)}
                </div>
              )}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{MOCK_CUSTOMER.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
                  <Crown className="h-3 w-3" /> {MOCK_CUSTOMER.tier}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {MOCK_CUSTOMER.loyaltyPoints.toLocaleString("en-IN")} loyalty points
                </span>
              </div>
            </div>
          </div>
        </FadeIn>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 mb-6">
            <TabsTrigger value="profile" className="gap-1.5">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5">
              <Package className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-1.5">
              <Heart className="h-4 w-4" /> Wishlist
              {wishlistIds.length > 0 && (
                <Badge className="h-5 min-w-5 p-0 text-[10px]">{wishlistIds.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-1.5">
              <MapPin className="h-4 w-4" /> Addresses
            </TabsTrigger>
            <TabsTrigger value="returns" className="gap-1.5">
              <RotateCcw className="h-4 w-4" /> Returns
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-1.5">
              <HeadphonesIcon className="h-4 w-4" /> Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Email</span>
                    <span>{MOCK_CUSTOMER.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{MOCK_CUSTOMER.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Member since</span>
                    <span>{formatDate(MOCK_CUSTOMER.joinedAt)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Preferred store</span>
                    <span>{MOCK_CUSTOMER.preferredBranch}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Segment</span>
                    <span>{MOCK_CUSTOMER.segment}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Shopping Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Total Orders", value: MOCK_CUSTOMER.orderCount },
                      { label: "Total Spent", value: formatCurrency(MOCK_CUSTOMER.totalSpent) },
                      { label: "Loyalty Points", value: MOCK_CUSTOMER.loyaltyPoints.toLocaleString("en-IN") },
                      { label: "Wishlist Items", value: wishlistIds.length },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-xl bg-muted/50 text-center">
                        <p className="font-display text-xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {customerOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">No orders yet</p>
                  <Button asChild className="mt-4"><Link href="/products">Start Shopping</Link></Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="font-display font-semibold">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={STATUS_COLORS[order.status] || "default"}>
                            {order.status.replace(/_/g, " ")}
                          </Badge>
                          <span className="font-display font-bold">{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex items-center gap-2 shrink-0">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                              <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="48px" unoptimized />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs line-clamp-1 max-w-[120px]">{item.productName}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlistProducts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">Your wishlist is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Save items you love for later</p>
                  <Button asChild className="mt-4"><Link href="/products">Browse Products</Link></Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearWishlist();
                      toast.success("Wishlist cleared");
                    }}
                  >
                    Clear all
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="relative group">
                      <ProductCard product={product} />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full shadow"
                          onClick={() => {
                            addItem(product);
                            toast.success("Added to cart");
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full shadow"
                          onClick={() => {
                            toggleWish(product.id);
                            toast.success("Removed from wishlist");
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="addresses">
            <div className="grid sm:grid-cols-2 gap-4">
              {MOCK_CUSTOMER.addresses.map((addr) => (
                <Card key={addr.id} className={addr.isDefault ? "ring-2 ring-primary/20" : ""}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{addr.label}</Badge>
                      {addr.isDefault && <Badge variant="success">Default</Badge>}
                    </div>
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {addr.line1}
                      {addr.line2 && `, ${addr.line2}`}
                      <br />
                      {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{addr.phone}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-dashed flex items-center justify-center min-h-[180px]">
                <CardContent className="text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <Button variant="outline" onClick={() => toast.info("Address form would open here")}>
                    Add New Address
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="returns">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">Return Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {customerOrders.filter((o) => o.status === "returned").length === 0 ? (
                  <div className="text-center py-8">
                    <RotateCcw className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No active return requests</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      7-day easy returns on most products
                    </p>
                  </div>
                ) : (
                  customerOrders
                    .filter((o) => o.status === "returned")
                    .map((order) => (
                      <div key={order.id} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <div>
                          <p className="font-medium text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                        <Badge variant="destructive">Returned</Badge>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-semibold">Support Tickets</h2>
              <Button size="sm" onClick={() => toast.success("Support ticket created", { description: "We'll respond within 24 hours" })}>
                New Ticket
              </Button>
            </div>
            {supportTickets.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <HeadphonesIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">No support tickets</p>
                  <p className="text-sm text-muted-foreground mt-1">Need help? Create a ticket anytime</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {supportTickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{ticket.ticketNumber}</p>
                          <Badge variant={STATUS_COLORS[ticket.status] || "default"} className="text-[10px]">
                            {ticket.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{ticket.productName} – {ticket.type}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ticket.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="outline" className="text-[10px] capitalize">{ticket.priority}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(ticket.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Card className="mt-6">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Need immediate help?</p>
                  <p className="text-sm text-muted-foreground">Call us at 1800-HIGHRANGE · Mon–Sat 9:30 AM – 8 PM</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
