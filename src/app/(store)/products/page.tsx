"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  Star,
} from "lucide-react";
import { PRODUCTS, CATEGORIES_WITH_COUNTS } from "@/data";
import { BRANDS } from "@/data/constants";
import type { Product } from "@/types";
import { ProductCard } from "@/components/store/product-card";
import { QuickView } from "@/components/store/quick-view";
import { PageTransition, FadeIn } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
const MAX_PRICE = 250000;

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating" | "newest" | "emi";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const filter = searchParams.get("filter") || "";
  const sort = (searchParams.get("sort") as SortOption) || "relevance";

  const [searchInput, setSearchInput] = useState(q);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [selectedBrands, setSelectedBrands] = useState<string[]>(brand ? [brand] : []);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      router.push(`/products?${params.toString()}`, { scroll: false });
      setVisibleCount(PAGE_SIZE);
    },
    [router, searchParams]
  );

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (category) {
      result = result.filter((p) => p.categorySlug === category);
    }

    if (filter === "featured") result = result.filter((p) => p.isFeatured);
    if (filter === "trending") result = result.filter((p) => p.isTrending);
    if (filter === "bestseller") result = result.filter((p) => p.isBestSeller);
    if (filter === "flash") result = result.filter((p) => p.isFlashSale);
    if (filter === "deals") result = result.filter((p) => p.discount >= 20);
    if (filter === "new") {
      result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      result = result.slice(0, 100);
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "emi":
        result.sort((a, b) => a.emiFrom - b.emiFrom);
        break;
      default:
        break;
    }

    return result;
  }, [q, category, filter, sort, selectedBrands, minRating, priceRange]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const toggleBrand = (name: string) => {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setMinRating(0);
    setPriceRange([0, MAX_PRICE]);
    router.push("/products");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput || null });
  };

  const activeFilterCount =
    (category ? 1 : 0) +
    (filter ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < MAX_PRICE ? 1 : 0);

  const availableBrands = useMemo(() => {
    const brandSet = new Set(PRODUCTS.map((p) => p.brand));
    return BRANDS.filter((b) => brandSet.has(b.name));
  }, []);

  return (
    <PageTransition className="pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <FadeIn>
          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              {category
                ? CATEGORIES_WITH_COUNTS.find((c) => c.slug === category)?.name || "Products"
                : filter === "flash"
                  ? "Flash Sale"
                  : filter === "deals"
                    ? "Hot Deals"
                    : q
                      ? `Results for "${q}"`
                      : "All Products"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {filteredProducts.length.toLocaleString("en-IN")} products found
            </p>
          </div>
        </FadeIn>

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border p-6 overflow-y-auto transition-transform lg:static lg:w-64 lg:shrink-0 lg:border-0 lg:p-0 lg:bg-transparent lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="font-display font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Categories</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => updateParams({ category: null })}
                    className={cn(
                      "w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-muted transition-colors",
                      !category && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    All Categories
                  </button>
                  {CATEGORIES_WITH_COUNTS.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParams({ category: cat.slug })}
                      className={cn(
                        "w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-muted transition-colors flex justify-between",
                        category === cat.slug && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-xs text-muted-foreground">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Brand</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableBrands.map((b) => (
                    <label key={b.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => toggleBrand(b.name)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      {b.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3.5, 3].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => {
                          setMinRating(rating);
                          setVisibleCount(PAGE_SIZE);
                        }}
                        className="text-primary focus:ring-primary"
                      />
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {rating}+ & above
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === 0}
                      onChange={() => {
                        setMinRating(0);
                        setVisibleCount(PAGE_SIZE);
                      }}
                      className="text-primary focus:ring-primary"
                    />
                    All ratings
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    step={1000}
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], Number(e.target.value)]);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                    <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                  Clear all filters
                </Button>
              )}
            </div>
          </aside>

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9"
                />
              </form>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="lg:hidden gap-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                <Select value={sort} onValueChange={(v) => updateParams({ sort: v })}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="emi">Lowest EMI</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={view === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setView("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setView("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {visibleProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or search</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    view === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6"
                      : "flex flex-col gap-4"
                  )}
                >
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      view={view}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="rounded-full px-8"
                    >
                      Load more ({filteredProducts.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <QuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </PageTransition>
  );
}

function ProductsFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="skeleton h-8 w-48 mb-2" />
      <div className="skeleton h-4 w-32 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
