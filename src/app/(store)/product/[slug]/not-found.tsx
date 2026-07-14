import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold">Product not found</h1>
      <p className="text-muted-foreground mt-2 mb-8">
        The product you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild className="gap-2">
        <Link href="/products">
          <ArrowLeft className="h-4 w-4" /> Browse Products
        </Link>
      </Button>
    </div>
  );
}
