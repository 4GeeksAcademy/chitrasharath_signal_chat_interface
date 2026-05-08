interface MessageComposerProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const MessageComposer = ({
  value,
  isLoading,
  onChange,
  onSubmit,
}: MessageComposerProps) => {
  return (
    <form
      className="mt-4 flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write your message..."
        rows={3}
        className="font-body w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="font-body rounded-xl bg-[var(--text-primary)] px-4 py-2 text-sm text-[var(--surface)] transition enabled:hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "groqing..." : "Send message"}
      </button>
    </form>
  );
};
