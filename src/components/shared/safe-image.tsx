"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#f5f5f5"/>
      <rect x="200" y="260" width="400" height="280" rx="24" fill="#e5e5e5"/>
      <circle cx="400" cy="360" r="48" fill="#e31e24"/>
      <text x="400" y="520" text-anchor="middle" fill="#737373" font-family="Arial,sans-serif" font-size="28">Highrange</text>
    </svg>`
  );

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
};

export function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = !src || failed ? FALLBACK : src;

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      className={cn(className)}
      unoptimized={resolved.startsWith("data:") || props.unoptimized}
      onError={() => setFailed(true)}
    />
  );
}
