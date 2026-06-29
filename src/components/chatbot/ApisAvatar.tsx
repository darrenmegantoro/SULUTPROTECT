import Image from "next/image";
import { useState } from "react";
import { APIS_AVATAR_PATH, APIS_SHORT } from "@/data/apis";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { px: 28, className: "h-7 w-7" },
  md: { px: 32, className: "h-8 w-8" },
  lg: { px: 40, className: "h-10 w-10" },
  xl: { px: 96, className: "h-24 w-24" },
} as const;

type ApisAvatarProps = {
  size?: keyof typeof SIZES;
  className?: string;
};

export default function ApisAvatar({ size = "md", className }: ApisAvatarProps) {
  const { px, className: sizeClass } = SIZES[size];
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-navyCore text-[10px] font-bold text-white ring-2 ring-white/25",
          sizeClass,
          className
        )}
        aria-hidden="true"
      >
        {APIS_SHORT}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-black ring-2 ring-white/25",
        sizeClass,
        className
      )}
    >
      <Image
        src={APIS_AVATAR_PATH}
        alt=""
        width={px}
        height={px}
        className="h-full w-full object-cover object-[center_18%]"
        onError={() => setFailed(true)}
        aria-hidden="true"
      />
    </span>
  );
}
