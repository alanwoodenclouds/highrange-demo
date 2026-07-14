import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  /** full = wordmark lockup · mark = circular emblem */
  variant?: "mark" | "full";
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
};

const FULL = "/logo-full.png";
const MARK = "/logo-mark.png";

const FULL_SIZE = {
  sm: "h-11 w-[9.5rem]",
  md: "h-[3.25rem] w-[11.5rem]",
  lg: "h-16 w-[14.5rem]",
} as const;

const MARK_SIZE = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
} as const;

export function BrandLogo({
  href = "/",
  variant = "full",
  className,
  priority = false,
  size = "md",
}: BrandLogoProps) {
  const content =
    variant === "mark" ? (
      <span className={cn("relative inline-flex shrink-0 overflow-hidden", MARK_SIZE[size])}>
        <Image
          src={MARK}
          alt="Highrange"
          fill
          priority={priority}
          className="object-contain"
          sizes="56px"
        />
      </span>
    ) : (
      <span className={cn("relative inline-flex shrink-0 overflow-hidden", FULL_SIZE[size])}>
        <Image
          src={FULL}
          alt="Highrange — Appliances | Digital | Hypermart"
          fill
          priority={priority}
          className="object-contain"
          sizes="240px"
        />
      </span>
    );

  if (!href) {
    return <div className={cn("inline-flex items-center", className)}>{content}</div>;
  }

  return (
    <Link
      href={href}
      aria-label="Highrange Home"
      className={cn(
        "inline-flex items-center transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg",
        className
      )}
    >
      {content}
    </Link>
  );
}
