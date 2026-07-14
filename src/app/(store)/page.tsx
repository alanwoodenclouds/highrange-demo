import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import {
  PRODUCTS,
  CATEGORIES_WITH_COUNTS,
  TESTIMONIALS,
  PROMO_BANNERS,
} from "@/data";
import { BRANDS } from "@/data/constants";
import { HeroBanner } from "@/components/store/hero-banner";
import { FlashSaleSection } from "@/components/store/flash-sale-section";
import { Newsletter } from "@/components/store/newsletter";
import { ProductCard } from "@/components/store/product-card";
import { PageTransition, FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
const trending = PRODUCTS.filter((p) => p.isTrending).slice(0, 8);
const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
const flashSale = PRODUCTS.filter((p) => p.isFlashSale);

const brandsWithCounts = BRANDS.map((b) => ({
  ...b,
  productCount: PRODUCTS.filter((p) => p.brand === b.name).length,
})).filter((b) => b.productCount > 0);

const seasonalBanners = [
  {
    title: "Monsoon Ready",
    subtitle: "Dehumidifiers & water purifiers from ₹999",
    href: "/products?category=small-appliances",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop",
    accent: "from-neutral-900/80",
  },
  {
    title: "Kitchen Upgrade",
    subtitle: "Premium mixer grinders & microwaves",
    href: "/products?category=kitchen-appliances",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=400&fit=crop",
    accent: "from-[#e31e24]/85",
  },
];

function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1 text-sm sm:text-base">{subtitle}</p>}
      </div>
      {href && (
        <Button variant="ghost" asChild className="hidden sm:flex gap-1 text-primary shrink-0">
          <Link href={href}>
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <PageTransition className="pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:pt-6 space-y-12 sm:space-y-16 lg:space-y-20">
        <HeroBanner banners={PROMO_BANNERS} />

        {/* Categories */}
        <FadeIn>
          <section>
            <SectionHeader title="Shop by Category" subtitle="Premium appliances for every room" href="/products" />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES_WITH_COUNTS.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex-shrink-0 w-36 sm:w-44"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3 ring-1 ring-border/50 group-hover:ring-primary/50 transition-all group-hover:shadow-lg">
                    <SafeImage
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="176px"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-medium text-sm leading-tight">{cat.name}</p>
                      <p className="text-white/70 text-xs">{cat.productCount} products</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Featured */}
        <FadeIn>
          <section>
            <SectionHeader title="Featured Products" subtitle="Handpicked premium selections" href="/products?filter=featured" />
            <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featured.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        </FadeIn>

        {/* Flash Sale */}
        {flashSale.length > 0 && <FlashSaleSection products={flashSale} />}

        {/* Trending */}
        <FadeIn>
          <section>
            <SectionHeader title="Trending Now" subtitle="What Kerala is buying this week" href="/products?filter=trending" />
            <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {trending.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        </FadeIn>

        {/* Best Sellers */}
        <FadeIn>
          <section>
            <SectionHeader title="Best Sellers" subtitle="Trusted by thousands of families" href="/products?filter=bestseller" />
            <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        </FadeIn>

        {/* Brands */}
        <FadeIn>
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <SectionHeader title="Top Brands" subtitle="Authorized dealer for leading global brands" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 sm:gap-4">
              {brandsWithCounts.slice(0, 9).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/products?brand=${encodeURIComponent(brand.name)}`}
                  className="group flex flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/30 p-4 hover:border-primary/40 hover:bg-muted/60 hover:shadow-md transition-all"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-black flex items-center justify-center font-display font-bold text-primary text-sm group-hover:scale-110 transition-transform ring-1 ring-black/10">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium mt-2 text-center line-clamp-1">{brand.name}</span>
                  <span className="text-[10px] text-muted-foreground">{brand.productCount}</span>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Testimonials */}
        <FadeIn>
          <section>
            <SectionHeader title="What Our Customers Say" subtitle="Real stories from Idukki families" />
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {TESTIMONIALS.map((t) => (
                <StaggerItem key={t.id}>
                  <div className="glass-card rounded-2xl p-5 h-full flex flex-col">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.comment}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                      <SafeImage
                        src={t.avatar}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="rounded-full bg-muted"
                        unoptimized
                      />
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role} · {t.location}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        </FadeIn>

        {/* Seasonal Banners */}
        <FadeIn>
          <section>
            <SectionHeader title="Seasonal Offers" subtitle="Curated collections for every season" />
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {seasonalBanners.map((banner) => (
                <Link
                  key={banner.title}
                  href={banner.href}
                  className="group relative overflow-hidden rounded-2xl aspect-[2/1] min-h-[180px]"
                >
                  <SafeImage
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width:768px) 100vw, 50vw"
                    unoptimized
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.accent} to-transparent`} />
                  <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                    <Badge className="w-fit mb-2 bg-white/20 border-0 text-white backdrop-blur-sm">Limited Time</Badge>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{banner.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{banner.subtitle}</p>
                    <span className="inline-flex items-center gap-1 text-white text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                      Shop now <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Newsletter */}
        <Newsletter />
      </div>
    </PageTransition>
  );
}
