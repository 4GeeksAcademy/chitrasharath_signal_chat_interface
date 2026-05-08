import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <li className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
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
