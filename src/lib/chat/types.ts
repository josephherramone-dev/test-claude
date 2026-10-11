export interface ChatLink {
  label: string;
  href: string;
}

export type ChatSource = "faq" | "ai" | "fallback";

export interface ChatReply {
  text: string;
  links: ChatLink[];
  source: ChatSource;
}

export interface ChatMessage extends Partial<ChatReply> {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

/** Any assistant backend (local FAQ engine, server AI…) implements this. */
export interface ChatService {
  send(message: string, history: ChatHistoryItem[]): Promise<ChatReply>;
}
