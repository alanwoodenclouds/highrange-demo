"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, GitCompareArrows } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useWishlistStore, useCompareStore } from "@/stores";

interface QuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickView({ product, open, onOpenChange }: QuickViewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle: toggleWish, has: hasWish } = useWishlistStore();
  const { toggle: toggleCompare, has: hasCompare } = useCompareStore();

  if (!product) return null;

  const wished = hasWish(product.id);
  const compared = hasCompare(product.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid sm:grid-cols-2 gap-0">
          <div className="relative aspect-square bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="400px"
              unoptimized
            />
            {product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-accent-brand border-0 text-white">
                -{product.discount}%
              </Badge>
            )}
          </div>
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
              <DialogTitle className="font-display text-xl leading-snug mt-1">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-1 mt-3">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString("en-IN")} reviews)</span>
            </div>

            <div className="mt-4">
              <span className="font-display text-2xl font-bold">{formatCurrency(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  {formatCurrency(product.mrp)}
                </span>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                EMI from {formatCurrency(product.emiFrom)}/mo · {product.warranty} warranty
              </p>
            </div>

            <p className="text-sm text-muted-foreground mt-4 line-clamp-3 flex-1">
              {product.shortDescription}
            </p>

            <ul className="mt-3 space-y-1">
              {product.features.slice(0, 3).map((f) => (
                <li key={f} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex gap-2 mt-6">
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  addItem(product);
                  toast.success("Added to cart");
                  onOpenChange(false);
                }}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  toggleWish(product.id);
                  toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
                }}
              >
                <Heart className={cn("h-4 w-4", wished && "fill-red-500 text-red-500")} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  toggleCompare(product.id);
                  toast.success(compared ? "Removed from compare" : "Added to compare");
                }}
              >
                <GitCompareArrows className={cn("h-4 w-4", compared && "text-primary")} />
              </Button>
            </div>

            <Button variant="link" asChild className="mt-2 p-0 h-auto">
              <Link href={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                View full details →
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
