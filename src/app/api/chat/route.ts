import { NextResponse } from "next/server";
import { answerWithAi, isAiConfigured } from "@/lib/chat/ai";
import { answerLocally } from "@/lib/chat/engine";
import type { ChatReply } from "@/lib/chat/types";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { chatRequestSchema } from "@/lib/chat/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(`chat:${clientKey(request)}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de messages. Merci de patienter quelques instants." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Message invalide." }, { status: 400 });
  }

  const { message, history } = parsed.data;
  const local = answerLocally(message);

  if (isAiConfigured()) {
    try {
      const text = await answerWithAi(message, history);
      if (text) {
        const reply: ChatReply = { text, links: local.links, source: "ai" };
        return NextResponse.json(reply);
      }
    } catch (error) {
      console.error("[chat] AI provider error", error instanceof Error ? error.name : "unknown");
    }
  }

  return NextResponse.json(local);
}
