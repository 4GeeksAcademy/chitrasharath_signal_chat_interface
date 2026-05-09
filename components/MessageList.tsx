import type { RefObject } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  latestAssistantResponseRef?: RefObject<HTMLElement | null>;
}

export const MessageList = ({ messages, latestAssistantResponseRef }: MessageListProps) => {
  const latestAssistantIndex = [...messages].reverse().findIndex((message) => message.role === "assistant");
  const resolvedLatestAssistantIndex =
    latestAssistantIndex === -1 ? -1 : messages.length - 1 - latestAssistantIndex;

  if (!messages.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center font-body text-sm text-[var(--muted)]">
        Ask Signal Foundry a question to begin the conversation.
      </p>
    );
  }

  return (
    <ul className="space-y-3" aria-live="polite">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLatestAssistantResponse={index === resolvedLatestAssistantIndex}
          bubbleRef={index === resolvedLatestAssistantIndex ? latestAssistantResponseRef : undefined}
        />
      ))}
    </ul>
  );
};
