import { notFound } from "next/navigation";
import { PRODUCTS, REVIEWS } from "@/data";
import { ProductDetail } from "@/components/store/product-detail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  const boughtTogether = PRODUCTS.filter(
    (p) => p.id !== product.id && p.categorySlug !== product.categorySlug
  ).slice(0, 2);

  return (
    <ProductDetail
      product={product}
      reviews={REVIEWS}
      relatedProducts={relatedProducts}
      boughtTogether={boughtTogether}
    />
  );
}
