"use client";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@nexfield/ui";
interface NexfieldLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  href?: string;
  badgeMode?: "dark" | "authentic" | "ghost";
  subtitle?: string;
}
export function NexfieldLogo({
  className,
  size = "md",
  showWordmark = true,
  href,
  subtitle,
}: NexfieldLogoProps) {
  const dimension = { sm: 30, md: 36, lg: 42, xl: 58 }[size];
  const content = (
    <>
      <Image
        src="/branding/nexfield-logo-transparent.png"
        alt=""
        width={dimension}
        height={dimension}
        className="object-contain shrink-0"
      />
      <span>
        {showWordmark && <span className="brand-word">nexfield</span>}
        {subtitle && showWordmark && (
          <span className="brand-sub">{subtitle}</span>
        )}
      </span>
    </>
  );
  return href ? (
    <Link
      href={href}
      className={cn("brand-lockup", className)}
      aria-label="NEXFIELD home"
    >
      {content}
    </Link>
  ) : (
    <span className={cn("brand-lockup", className)} aria-label="NEXFIELD">
      {content}
    </span>
  );
}
