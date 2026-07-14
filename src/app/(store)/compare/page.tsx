"use client";

import { useMemo } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { GitCompareArrows, ShoppingCart, X, Star } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS } from "@/data";
import { useCompareStore, useCartStore } from "@/stores";
import { formatCurrency } from "@/lib/utils";
import { PageTransition } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ComparePage() {
  const { ids, toggle, clear } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);

  const products = useMemo(
    () => ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean),
    [ids]
  );

  const allSpecLabels = useMemo(() => {
    const labels = new Set<string>();
    products.forEach((p) => p?.specs.forEach((s) => labels.add(s.label)));
    return Array.from(labels);
  }, [products]);

  if (products.length === 0) {
    return (
      <PageTransition className="mx-auto max-w-7xl px-4 py-16 text-center">
        <GitCompareArrows className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Compare Products</h1>
        <p className="text-muted-foreground mb-6">Add up to 4 products to compare side by side.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-8 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Compare Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} of 4 selected</p>
        </div>
        <Button variant="outline" onClick={clear}>
          Clear all
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="p-4 text-left font-medium text-muted-foreground w-40 sticky left-0 bg-muted/40">Feature</th>
              {products.map((p) => (
                <th key={p!.id} className="p-4 text-center align-top min-w-[200px]">
                  <div className="relative">
                    <button
                      onClick={() => toggle(p!.id)}
                      className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-muted hover:bg-destructive hover:text-white flex items-center justify-center"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="relative aspect-square w-28 mx-auto rounded-xl overflow-hidden bg-muted mb-3">
                      <SafeImage src={p!.images[0]} alt={p!.name} fill className="object-cover" unoptimized />
                    </div>
                    <Link href={`/product/${p!.slug}`} className="font-medium hover:text-primary line-clamp-2">
                      {p!.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{p!.brand}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-4 font-medium sticky left-0 bg-card">Price</td>
              {products.map((p) => (
                <td key={p!.id} className="p-4 text-center">
                  <span className="font-display font-bold text-lg">{formatCurrency(p!.price)}</span>
                  {p!.discount > 0 && (
                    <Badge className="ml-2 bg-accent-brand border-0 text-white text-[10px]">-{p!.discount}%</Badge>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-muted/20">
              <td className="p-4 font-medium sticky left-0 bg-muted/20">Rating</td>
              {products.map((p) => (
                <td key={p!.id} className="p-4 text-center">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {p!.rating} ({p!.reviewCount})
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border">
              <td className="p-4 font-medium sticky left-0 bg-card">EMI from</td>
              {products.map((p) => (
                <td key={p!.id} className="p-4 text-center">{formatCurrency(p!.emiFrom)}/mo</td>
              ))}
            </tr>
            <tr className="border-b border-border bg-muted/20">
              <td className="p-4 font-medium sticky left-0 bg-muted/20">Warranty</td>
              {products.map((p) => (
                <td key={p!.id} className="p-4 text-center">{p!.warranty}</td>
              ))}
            </tr>
            <tr className="border-b border-border">
              <td className="p-4 font-medium sticky left-0 bg-card">Stock</td>
              {products.map((p) => (
                <td key={p!.id} className="p-4 text-center">
                  {p!.stock > 10 ? (
                    <span className="text-emerald-600">In Stock</span>
                  ) : p!.stock > 0 ? (
                    <span className="text-amber-600">Low Stock</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>
            {allSpecLabels.map((label, i) => (
              <tr key={label} className={`border-b border-border ${i % 2 ? "bg-muted/20" : ""}`}>
                <td className={`p-4 font-medium sticky left-0 ${i % 2 ? "bg-muted/20" : "bg-card"}`}>{label}</td>
                {products.map((p) => (
                  <td key={p!.id} className="p-4 text-center">
                    {p!.specs.find((s) => s.label === label)?.value ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4 sticky left-0 bg-card" />
              {products.map((p) => (
                <td key={p!.id} className="p-4 text-center">
                  <Button
                    className="gap-1"
                    onClick={() => {
                      addItem(p!);
                      toast.success("Added to cart");
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </PageTransition>
  );
}
