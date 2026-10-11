"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { cn, isExternalHref } from "@/lib/utils";
import type { FaqEntry } from "@/types/content";

/**
 * Accessible accordion (WAI-ARIA pattern): buttons with aria-expanded /
 * aria-controls, regions labelled by their header, and ↑ ↓ Home End keys to
 * move between questions.
 */
export function FaqAccordion({ entries, tone = "light", defaultOpen }: { entries: FaqEntry[]; tone?: "light" | "dark"; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const baseId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const dark = tone === "dark";

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = entries.length - 1;
    const target =
      event.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    buttons.current[target]?.focus();
  };

  return (
    <div className={cn("divide-y border-y", dark ? "divide-white/10 border-white/10" : "divide-line border-line")}>
      {entries.map((entry, index) => {
        const isOpen = open === entry.id;
        const buttonId = `${baseId}-q-${entry.id}`;
        const panelId = `${baseId}-a-${entry.id}`;
        return (
          <div key={entry.id}>
            <h3>
              <button
                ref={(el) => {
                  buttons.current[index] = el;
                }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : entry.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={cn(
                  "group flex w-full items-center justify-between gap-6 py-6 text-start font-[family-name:var(--font-display)] text-lg sm:text-xl",
                  dark ? "text-white" : "text-ink-900 on-light",
                )}
              >
                {entry.question}
                <span
                  aria-hidden
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-500",
                    isOpen ? "rotate-45 bg-carla-600 text-white" : dark ? "ring-1 ring-white/20" : "ring-1 ring-line group-hover:ring-ink-900",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={cn("pb-7 pe-14", dark ? "text-ink-300" : "text-muted")}
            >
              <div className="space-y-3 leading-relaxed">
                {entry.answer.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {entry.links?.length ? (
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {entry.links.map((link) => (
                    <li key={link.href}>
                      {isExternalHref(link.href) ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn("font-medium underline underline-offset-4", dark ? "text-carla-300" : "text-carla-700")}
                        >
                          {link.label}
                          <span className="sr-only"> (nouvel onglet)</span>
                        </a>
                      ) : (
                        <Link href={link.href} className={cn("font-medium underline underline-offset-4", dark ? "text-carla-300" : "text-carla-700")}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
