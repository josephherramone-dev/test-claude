"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, m } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUpRight, Bot, MessageCircle, RotateCcw, SendHorizontal, Sparkles, X } from "lucide-react";
import { t } from "@/i18n";
import { track } from "@/lib/analytics";
import { quickActions, welcomeMessage } from "@/lib/chat/knowledge";
import { getChatService } from "@/lib/chat/service";
import type { ChatMessage } from "@/lib/chat/types";
import { cn, isExternalHref } from "@/lib/utils";

const STORAGE_KEY = "carla-chat-session";
const MAX_INPUT = 500;

const initialMessages = (): ChatMessage[] => [{ id: "welcome", role: "assistant", text: welcomeMessage, links: [], source: "faq" }];

function loadSession(): ChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : null;
    return Array.isArray(parsed) && parsed.length ? parsed.slice(-30) : initialMessages();
  } catch {
    return initialMessages();
  }
}

export function ChatWidget() {
  const reduce = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  useEffect(() => {
    if (open && !restored.current) {
      restored.current = true;
      setMessages(loadSession());
    }
  }, [open]);

  useEffect(() => {
    if (!restored.current) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* storage unavailable */
    }
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, pending, reduce]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string, origin: "typed" | "quick_action") => {
      const content = text.trim().slice(0, MAX_INPUT);
      if (!content || pending) return;
      const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text: content };
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.text }));
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setPending(true);
      track(origin === "quick_action" ? "chatbot_quick_action" : "chatbot_message", {});
      try {
        const reply = await getChatService().send(content, history);
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", ...reply }]);
      } finally {
        setPending(false);
      }
    },
    [messages, pending],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input, "typed");
  };

  const reset = () => {
    setMessages(initialMessages());
    inputRef.current?.focus();
  };

  const toggle = () => {
    setOpen((value) => {
      if (!value) track("chatbot_open", {});
      return !value;
    });
  };

  const showQuickActions = messages.length <= 1;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="carla-chat"
        aria-label={open ? t.chat.close : t.chat.open}
        className={cn(
          "fixed end-5 bottom-5 z-[60] flex size-15 items-center justify-center rounded-full text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] transition-all duration-300 hover:scale-105 sm:end-7 sm:bottom-7",
          open ? "bg-ink-800 ring-1 ring-white/20" : "bg-ink-950 ring-1 ring-white/15",
        )}
      >
        {open ? <X aria-hidden className="size-6" /> : <MessageCircle aria-hidden className="size-6" />}
        {!open && <span aria-hidden className="absolute top-3.5 end-3.5 size-2.5 rounded-full bg-carla-500 ring-2 ring-ink-950" />}
      </button>

      <AnimatePresence>
        {open && (
          <m.section
            id="carla-chat"
            role="dialog"
            aria-modal="false"
            aria-labelledby="carla-chat-title"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-24 z-[60] flex max-h-[min(40rem,calc(100svh-8rem))] origin-bottom-right flex-col overflow-hidden rounded-[1.75rem] bg-ink-950 text-white shadow-[0_40px_100px_-30px_rgb(0_0_0/0.8)] ring-1 ring-white/10 sm:inset-x-auto sm:end-7 sm:bottom-28 sm:w-[24rem]"
          >
            <header className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-br from-ink-800 to-ink-950 px-5 py-4">
              <span className="relative flex size-10 items-center justify-center rounded-full bg-carla-600">
                <Bot aria-hidden className="size-5" />
                <span aria-hidden className="absolute -end-0.5 -bottom-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-ink-900" />
              </span>
              <div className="flex-1">
                <h2 id="carla-chat-title" className="font-[family-name:var(--font-display)] text-lg leading-tight">
                  {t.chat.title}
                </h2>
                <p className="text-xs text-ink-300">{t.chat.subtitle} · Carla Tamassint Transport</p>
              </div>
              <button type="button" onClick={reset} className="rounded-full p-2 text-ink-300 hover:bg-white/10 hover:text-white" aria-label={t.chat.reset}>
                <RotateCcw aria-hidden className="size-4" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite" aria-relevant="additions" aria-busy={pending}>
              {messages.map((message) => (
                <div key={message.id} className={cn("flex flex-col", message.role === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[88%] rounded-2xl px-4 py-3 text-[0.92rem] leading-relaxed",
                      message.role === "user" ? "rounded-ee-md bg-carla-600 text-white" : "rounded-es-md bg-white/[0.07] text-ink-200",
                    )}
                  >
                    <span className="sr-only">{message.role === "user" ? "Vous : " : "Assistant Carla : "}</span>
                    {message.text}
                  </div>
                  {message.role === "assistant" && message.source === "ai" && (
                    <p className="mt-1.5 flex items-center gap-1 text-[0.7rem] text-ink-400">
                      <Sparkles aria-hidden className="size-3" /> {t.chat.aiLabel}
                    </p>
                  )}
                  {message.links && message.links.length > 0 && (
                    <ul className="mt-2 flex max-w-[88%] flex-wrap gap-2">
                      {message.links.map((link) => (
                        <li key={link.href}>
                          {isExternalHref(link.href) || link.href.startsWith("tel:") ? (
                            <a
                              href={link.href}
                              target={link.href.startsWith("tel:") ? undefined : "_blank"}
                              rel="noopener noreferrer"
                              onClick={() => link.href.includes("markoub.ma") && track("markoub_outbound_click", { location: "chatbot" })}
                              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-carla-300 ring-1 ring-carla-300/40 hover:bg-carla-300/10"
                            >
                              {link.label} <ArrowUpRight aria-hidden className="size-3" />
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-carla-300 ring-1 ring-carla-300/40 hover:bg-carla-300/10"
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {showQuickActions && (
                <div>
                  <p className="mb-2 text-xs text-ink-400">Suggestions :</p>
                  <ul className="flex flex-wrap gap-2">
                    {quickActions.map((action) => (
                      <li key={action.label}>
                        <button
                          type="button"
                          onClick={() => void send(action.message, "quick_action")}
                          className="rounded-full bg-white/[0.06] px-3.5 py-2 text-xs text-white ring-1 ring-white/10 transition-colors hover:bg-white/[0.12]"
                        >
                          {action.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pending && (
                <div role="status" className="flex items-center gap-2 text-xs text-ink-400">
                  <span className="flex gap-1" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-1.5 animate-bounce rounded-full bg-carla-300" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </span>
                  {t.chat.typing}
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-full bg-white/[0.06] p-1.5 ring-1 ring-white/10 focus-within:ring-carla-300">
                <label htmlFor="carla-chat-input" className="sr-only">
                  Votre question
                </label>
                <input
                  ref={inputRef}
                  id="carla-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_INPUT}
                  autoComplete="off"
                  placeholder={t.chat.placeholder}
                  className="h-10 flex-1 bg-transparent ps-3 text-sm text-white outline-none placeholder:text-ink-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  aria-label={t.chat.send}
                  className="flex size-10 items-center justify-center rounded-full bg-carla-600 transition-colors hover:bg-carla-700 disabled:opacity-40"
                >
                  <SendHorizontal aria-hidden className="flip-rtl size-4.5" />
                </button>
              </div>
              <p className="mt-2 px-2 text-[0.68rem] leading-snug text-ink-400">{t.chat.disclaimer}</p>
            </form>
          </m.section>
        )}
      </AnimatePresence>
    </>
  );
}
