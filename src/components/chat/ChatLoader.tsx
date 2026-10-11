"use client";

import dynamic from "next/dynamic";

/** Loads the chat widget after hydration so it never blocks first paint. */
const ChatWidget = dynamic(() => import("./ChatWidget").then((m) => m.ChatWidget), { ssr: false });

export function ChatLoader() {
  return <ChatWidget />;
}
