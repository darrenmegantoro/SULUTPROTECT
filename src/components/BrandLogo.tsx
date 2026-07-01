"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_ASSETS } from "@/data/siteAssets";

type BrandLogoProps = {
  size?: number;
  className?: string;
};

export default function BrandLogo({ size = 40, className }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-navyCore text-white",
          className
        )}
        style={{ width: size, height: size }}
      >
        <ShieldCheck
          className="h-5 w-5"
          style={{ width: size * 0.5, height: size * 0.5 }}
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <Image
      src={SITE_ASSETS.logo}
      alt="Logo SULUT PROTECT"
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-contain", className)}
      onError={() => setFailed(true)}
      priority
    />
  );
}
