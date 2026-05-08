interface ChatPanelProps {
  children: React.ReactNode;
}

export const ChatPanel = ({ children }: ChatPanelProps) => {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5">
      {children}
    </section>
  );
};
