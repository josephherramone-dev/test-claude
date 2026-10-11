import { siteConfig } from "@/config/site";
import { answerLocally } from "./engine";
import type { ChatHistoryItem, ChatReply, ChatService } from "./types";

/** Runs entirely in the browser — no network, no data leaves the page. */
export const localChatService: ChatService = {
  async send(message) {
    // Small delay so the typing indicator feels natural.
    await new Promise((resolve) => setTimeout(resolve, 350));
    return answerLocally(message);
  },
};

/** Calls /api/chat (optional server-side AI). Falls back to the local engine. */
export const remoteChatService: ChatService = {
  async send(message: string, history: ChatHistoryItem[]): Promise<ChatReply> {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) throw new Error(String(res.status));
      return (await res.json()) as ChatReply;
    } catch {
      return answerLocally(message);
    }
  },
};

export function getChatService(): ChatService {
  return siteConfig.chatMode === "remote" ? remoteChatService : localChatService;
}
