"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  GitCompareArrows,
  Truck,
  Shield,
  RotateCcw,
  Check,
  MapPin,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductReview } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { ProductCard } from "@/components/store/product-card";
import { PageTransition, FadeIn } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore, useWishlistStore, useCompareStore } from "@/stores";

interface ProductDetailProps {
  product: Product;
  reviews: ProductReview[];
  relatedProducts: Product[];
  boughtTogether: Product[];
}

export function ProductDetail({
  product,
  reviews,
  relatedProducts,
  boughtTogether,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<{ date: string; available: boolean } | null>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle: toggleWish, has: hasWish } = useWishlistStore();
  const { toggle: toggleCompare, has: hasCompare } = useCompareStore();

  const wished = hasWish(product.id);
  const compared = hasCompare(product.id);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = reviews.length ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    setCheckingPincode(true);
    setTimeout(() => {
      setCheckingPincode(false);
      const available = !["000000", "111111"].includes(pincode);
      const days = available ? 3 + (parseInt(pincode.slice(-1)) % 4) : 0;
      const date = new Date();
      date.setDate(date.getDate() + days);
      setDeliveryInfo({
        available,
        date: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      });
    }, 600);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success("Added to cart", { description: `${quantity} × ${product.name}` });
  };

  const emiOptions = [
    { months: 3, rate: 0 },
    { months: 6, rate: 0 },
    { months: 12, rate: 0 },
    { months: 18, rate: 8 },
    { months: 24, rate: 10 },
  ].map((opt) => ({
    ...opt,
    emi: Math.round((product.price * (1 + opt.rate / 100)) / opt.months),
  }));

  return (
    <PageTransition className="pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <FadeIn>
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group cursor-zoom-in">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-125 origin-center"
                  sizes="(max-width:1024px) 100vw, 50vw"
                  unoptimized
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-accent-brand border-0 text-white text-sm">
                    -{product.discount}% OFF
                  </Badge>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImage === i ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" unoptimized />
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Info */}
          <FadeIn delay={0.1}>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand}</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount.toLocaleString("en-IN")} reviews)
                  </span>
                </div>
                <Badge variant="success">In Stock ({product.stock})</Badge>
                <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-bold">{formatCurrency(product.price)}</span>
                  {product.mrp > product.price && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatCurrency(product.mrp)}
                      </span>
                      <Badge variant="secondary">Save {formatCurrency(product.mrp - product.price)}</Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-primary mt-2 font-medium">
                  EMI from {formatCurrency(product.emiFrom)}/month · No cost EMI available
                </p>
              </div>

              <p className="text-muted-foreground mt-4 leading-relaxed">{product.shortDescription}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => {
                    toggleWish(product.id);
                    toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
                  }}
                >
                  <Heart className={cn("h-5 w-5", wished && "fill-red-500 text-red-500")} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => {
                    toggleCompare(product.id);
                    toast.success(compared ? "Removed from compare" : "Added to compare");
                  }}
                >
                  <GitCompareArrows className={cn("h-5 w-5", compared && "text-primary")} />
                </Button>
              </div>

              {/* Pincode */}
              <div className="mt-6 p-4 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Check delivery availability</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                  />
                  <Button variant="outline" onClick={checkPincode} disabled={checkingPincode}>
                    {checkingPincode ? "Checking..." : "Check"}
                  </Button>
                </div>
                {deliveryInfo && (
                  <p className={cn("text-sm mt-2", deliveryInfo.available ? "text-emerald-600" : "text-destructive")}>
                    {deliveryInfo.available
                      ? `✓ Delivery by ${deliveryInfo.date} · Free installation available`
                      : "✗ Delivery not available to this pincode"}
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Truck, label: "Free Delivery", sub: "Orders above ₹10,000" },
                  { icon: Shield, label: product.warranty, sub: "Manufacturer warranty" },
                  { icon: RotateCcw, label: "7-Day Returns", sub: "Easy exchange policy" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="text-center p-3 rounded-lg bg-muted/30">
                    <Icon className="h-5 w-5 mx-auto text-primary mb-1" />
                    <p className="text-xs font-medium">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Tabs */}
        <FadeIn delay={0.2}>
          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="emi">EMI Options</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <p className="text-muted-foreground leading-relaxed max-w-3xl">{product.description}</p>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between py-3 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
                {product.energyRating && (
                  <div className="flex justify-between py-3 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">Energy Rating</span>
                    <span className="font-medium">{product.energyRating}</span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <ul className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="emi" className="mt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
                {emiOptions.map((opt) => (
                  <Card key={opt.months} className={opt.rate === 0 ? "ring-2 ring-primary/20" : ""}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-display font-bold text-lg">{formatCurrency(opt.emi)}/mo</p>
                          <p className="text-sm text-muted-foreground">{opt.months} months</p>
                        </div>
                        {opt.rate === 0 && (
                          <Badge variant="success" className="text-[10px]">No Cost EMI</Badge>
                        )}
                      </div>
                      {opt.rate > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">{opt.rate}% p.a. interest</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="text-center p-6 rounded-xl bg-muted/30">
                    <p className="font-display text-5xl font-bold">{product.rating}</p>
                    <div className="flex justify-center gap-0.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {product.reviewCount.toLocaleString("en-IN")} ratings
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {ratingBreakdown.map(({ star, pct }) => (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-3">{star}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{Math.round(pct)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  {reviews.slice(0, 8).map((review) => (
                    <div key={review.id} className="p-4 rounded-xl border border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.userName}</span>
                          {review.verified && (
                            <Badge variant="success" className="text-[10px]">Verified</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="font-medium text-sm mt-2">{review.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.date).toLocaleDateString("en-IN")} · {review.helpful} found helpful
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>

        {/* Frequently bought together */}
        {boughtTogether.length > 0 && (
          <FadeIn delay={0.3}>
            <section className="mt-16">
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">Frequently Bought Together</h2>
              <div className="flex flex-wrap items-center gap-4">
                {[product, ...boughtTogether.slice(0, 2)].map((p, i, arr) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <div className="w-32 sm:w-40">
                      <ProductCard product={p} />
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-2xl text-muted-foreground font-light hidden sm:block">+</span>
                    )}
                  </div>
                ))}
                <Button
                  className="ml-auto gap-2"
                  onClick={() => {
                    [product, ...boughtTogether.slice(0, 2)].forEach((p) => addItem(p));
                    toast.success("Bundle added to cart");
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add all to cart
                </Button>
              </div>
            </section>
          </FadeIn>
        )}

        {/* Related */}
        {relatedProducts.length > 0 && (
          <FadeIn delay={0.4}>
            <section className="mt-16">
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </div>
    </PageTransition>
  );
}
