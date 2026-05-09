import type { RefObject } from "react";
import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isLatestAssistantResponse?: boolean;
  bubbleRef?: RefObject<HTMLElement | null>;
}

export const MessageBubble = ({
  message,
  isLatestAssistantResponse = false,
  bubbleRef,
}: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <li className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        ref={bubbleRef}
        tabIndex={isLatestAssistantResponse ? -1 : undefined}
          className={`max-w-[85%] rounded-2xl border px-4 py-3 ${
          isUser
            ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent),white_88%)]"
            : "border-[var(--border)] bg-white"
        }`}
      >
        <p className="font-body whitespace-pre-wrap text-sm text-[var(--text-primary)]">{message.content}</p>
        <p className="mt-2 font-mono text-[11px] text-[var(--muted)]">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </article>
    </li>
  );
};
