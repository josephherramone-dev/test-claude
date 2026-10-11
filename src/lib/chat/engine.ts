import { getRoutes, routeSlug } from "@/lib/content";
import { normalizeText } from "@/lib/utils";
import { fallbackAnswer, knowledgeBase } from "./knowledge";
import type { ChatLink, ChatReply } from "./types";

/**
 * Deterministic FAQ assistant. Scores each knowledge entry by the keywords
 * found in the visitor's message; below the threshold it hands over to the
 * customer service instead of guessing.
 */
const MIN_SCORE = 1;

function scoreEntry(message: string, words: Set<string>, keywords: string[]): number {
  let score = 0;
  for (const raw of keywords) {
    const keyword = normalizeText(raw);
    if (!keyword) continue;
    if (keyword.includes(" ")) {
      if (message.includes(keyword)) score += keyword.split(" ").length >= 4 ? 3 : 2;
    } else if (words.has(keyword) || (keyword.length >= 6 && message.includes(keyword))) {
      score += 1;
    }
  }
  return score;
}

/** Links to published route pages whose cities are mentioned in the message. */
function routeLinks(message: string): ChatLink[] {
  return getRoutes()
    .filter((route) => {
      const origin = normalizeText(route.origin.name);
      const destination = normalizeText(route.destination.name);
      return message.includes(origin) || message.includes(destination);
    })
    .slice(0, 3)
    .map((route) => ({
      label: `${route.origin.name} → ${route.destination.name}`,
      href: `/trajets/${routeSlug(route)}`,
    }));
}

export function answerLocally(input: string): ChatReply {
  const message = normalizeText(input);
  const words = new Set(message.split(" "));

  let best: { score: number; entry: (typeof knowledgeBase)[number] } | null = null;
  for (const entry of knowledgeBase) {
    const score = scoreEntry(message, words, entry.keywords);
    if (score >= MIN_SCORE && (!best || score > best.score)) best = { score, entry };
  }

  const matchedRoutes = routeLinks(message);

  if (!best) {
    if (matchedRoutes.length) {
      return {
        text: "Voici les trajets correspondant à votre recherche. Les horaires confirmés figurent sur chaque fiche ; les disponibilités se vérifient au moment de réserver.",
        links: [...matchedRoutes, { label: "Réserver un billet", href: "/reservation" }],
        source: "faq",
      };
    }
    return { text: fallbackAnswer.answer, links: fallbackAnswer.links, source: "fallback" };
  }

  const links = [...matchedRoutes, ...best.entry.links];
  const unique = [...new Map(links.map((l) => [l.href, l])).values()].slice(0, 4);
  return { text: best.entry.answer, links: unique, source: "faq" };
}
