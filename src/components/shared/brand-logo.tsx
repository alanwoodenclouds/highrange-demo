import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  variant?: "mark" | "full";
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
};

/** Uses Logo PNG.png (full brand: cart + HIGHRANGE on black) */
const LOGO_SRC = "/logo-full.png";

export function BrandLogo({
  href = "/",
  variant = "full",
  className,
  priority = false,
  size = "md",
}: BrandLogoProps) {
  const mark = (
    <span
      className={cn(
        "relative block overflow-hidden rounded-full bg-black ring-1 ring-black/10 shadow-sm",
        size === "sm" && "h-9 w-9",
        size === "md" && "h-11 w-11",
        size === "lg" && "h-14 w-14"
      )}
    >
      <Image
        src={LOGO_SRC}
        alt="Highrange"
        fill
        priority={priority}
        className="object-cover object-top scale-150"
        sizes="56px"
      />
    </span>
  );

  const full = (
    <span
      className={cn(
        "relative block overflow-hidden rounded-xl bg-black shadow-sm ring-1 ring-black/10",
        size === "sm" && "h-10 w-[7.75rem]",
        size === "md" && "h-12 w-[10rem]",
        size === "lg" && "h-16 w-[13.5rem]"
      )}
    >
      <Image
        src={LOGO_SRC}
        alt="Highrange Appliances | Digital | Hypermart"
        fill
        priority={priority}
        className="object-contain p-1"
        sizes="220px"
      />
    </span>
  );

  const content = variant === "mark" ? mark : full;

  if (!href) {
    return <div className={cn("inline-flex items-center", className)}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center group hover:opacity-95 transition-opacity", className)}
    >
      {content}
    </Link>
  );
}
