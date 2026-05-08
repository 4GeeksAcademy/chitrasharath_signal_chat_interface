import { MessageBubble } from "@/components/MessageBubble";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  if (!messages.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center font-body text-sm text-[var(--muted)]">
        Ask Signal Foundry a question to begin the conversation.
      </p>
    );
  }

  return (
    <ul className="space-y-3" aria-live="polite">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </ul>
  );
};
