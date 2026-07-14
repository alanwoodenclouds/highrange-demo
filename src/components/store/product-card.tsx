"use client";

import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, GitCompareArrows, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useWishlistStore, useCompareStore } from "@/stores";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, view = "grid", onQuickView }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle: toggleWish, has: hasWish } = useWishlistStore();
  const { toggle: toggleCompare, has: hasCompare } = useCompareStore();
  const wished = hasWish(product.id);
  const compared = hasCompare(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success("Added to cart", { description: product.name });
  };

  if (view === "list") {
    return (
      <motion.div
        layout
        whileHover={{ y: -2 }}
        className="group flex gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-lg transition-shadow"
      >
        <Link href={`/product/${product.slug}`} className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-muted">
          <SafeImage src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="128px" unoptimized />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-accent-brand border-0 text-white text-[10px]">
              -{product.discount}%
            </Badge>
          )}
        </Link>
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <Link href={`/product/${product.slug}`} className="font-medium text-sm hover:text-primary line-clamp-2 mt-0.5">
            {product.name}
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <div>
              <span className="font-display font-bold text-lg">{formatCurrency(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-muted-foreground line-through ml-2">{formatCurrency(product.mrp)}</span>
              )}
            </div>
            <Button size="sm" onClick={handleAdd} className="gap-1">
              <ShoppingCart className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border/70 bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-300"
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-muted overflow-hidden">
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width:768px) 50vw, 25vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {product.discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-primary border-0 text-white text-[11px] font-semibold shadow-sm">
            -{product.discount}%
          </Badge>
        )}
        {product.isFlashSale && (
          <Badge className="absolute top-3 right-3 bg-zinc-950 border-0 text-white text-[11px]">
            Flash
          </Badge>
        )}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.id);
              toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
            }}
          >
            <Heart className={cn("h-3.5 w-3.5", wished && "fill-red-500 text-red-500")} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product.id);
              toast.success(compared ? "Removed from compare" : "Added to compare");
            }}
          >
            <GitCompareArrows className={cn("h-3.5 w-3.5", compared && "text-primary")} />
          </Button>
          {onQuickView && (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link href={`/product/${product.slug}`} className="font-medium text-sm hover:text-primary line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString("en-IN")})</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="font-display font-bold text-lg leading-none">{formatCurrency(product.price)}</div>
            {product.mrp > product.price && (
              <div className="text-xs text-muted-foreground line-through mt-0.5">{formatCurrency(product.mrp)}</div>
            )}
          </div>
          <Button size="icon" className="h-9 w-9 shrink-0 rounded-full shadow-md shadow-primary/20" onClick={handleAdd}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">EMI from {formatCurrency(product.emiFrom)}/mo</p>
      </div>
    </motion.div>
  );
}
