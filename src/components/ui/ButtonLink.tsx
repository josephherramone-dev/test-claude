"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { cn, isExternalHref } from "@/lib/utils";
import { t } from "@/i18n";

type Variant = "primary" | "light" | "outline-light" | "outline-dark" | "dark" | "ghost-light" | "ghost-dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-carla-600 text-white hover:bg-carla-700 shadow-[0_10px_30px_-12px_rgb(196_47_108/0.7)] hover:shadow-[0_14px_36px_-12px_rgb(196_47_108/0.85)]",
  light: "bg-white text-ink-900 hover:bg-paper",
  dark: "bg-ink-900 text-white hover:bg-ink-700",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white/10",
  "outline-dark": "border border-ink-900/20 text-ink-900 hover:border-ink-900 hover:bg-ink-900/5 on-light",
  "ghost-light": "text-white/85 hover:text-white",
  "ghost-dark": "text-ink-900 hover:text-carla-700 on-light",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  /** Analytics event fired on click (no personal data). */
  event?: AnalyticsEvent;
  eventProps?: Record<string, string>;
  ariaLabel?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  event,
  eventProps,
  ariaLabel,
}: ButtonLinkProps) {
  const external = isExternalHref(href);
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide whitespace-nowrap",
    "transition-all duration-300 ease-[var(--ease-cinematic)] active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className,
  );
  const onClick = () => {
    if (event) track(event, eventProps);
    if (external && href.includes("markoub.ma")) track("markoub_outbound_click", eventProps);
  };
  const content = (
    <>
      {children}
      {icon ??
        (external ? (
          <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        ) : null)}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick} aria-label={ariaLabel}>
        {content}
        <span className="sr-only"> {t.common.newTab}</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
