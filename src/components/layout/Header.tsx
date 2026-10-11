"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X, Ticket } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { mainNav } from "@/config/navigation";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close the mobile menu after navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Lock scroll, trap focus and handle Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,height] duration-500",
        scrolled || open
          ? "border-b border-white/10 bg-ink-950/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-gradient-to-b from-ink-950/70 to-transparent",
      )}
    >
      <div className={cn("container-page flex items-center justify-between gap-6 transition-[height] duration-500", scrolled ? "h-16" : "h-20")}>
        <Link href="/" className="relative z-10 shrink-0 text-[0.95rem]">
          <Wordmark />
          <span className="sr-only"> — Accueil</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.9rem] tracking-wide transition-colors",
                      active ? "text-white" : "text-white/70 hover:text-white",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-carla-400 transition-transform duration-500",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/reservation"
            size="sm"
            event="booking_cta_click"
            eventProps={{ location: "header" }}
            className="hidden sm:inline-flex"
            icon={<Ticket aria-hidden className="size-4" />}
          >
            {t.cta.book}
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.common.menu}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-ink-950 xl:hidden"
          >
            <nav aria-label="Navigation mobile" className="container-page flex min-h-full flex-col py-8">
              <ul className="flex flex-col">
                {mainNav.map((item, index) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <m.li
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="border-b border-white/10"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between py-4 font-[family-name:var(--font-display)] text-2xl font-light",
                          active ? "text-carla-300" : "text-white",
                        )}
                      >
                        {item.label}
                        <span aria-hidden className="text-xs tracking-[0.3em] text-ink-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </m.li>
                  );
                })}
              </ul>
              <div className="mt-auto pt-10">
                <ButtonLink
                  href="/reservation"
                  size="lg"
                  className="w-full"
                  event="booking_cta_click"
                  eventProps={{ location: "mobile_menu" }}
                  icon={<Ticket aria-hidden className="size-5" />}
                >
                  {t.cta.book}
                </ButtonLink>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
