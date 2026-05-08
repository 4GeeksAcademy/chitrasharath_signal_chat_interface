export const FooterBar = () => {
  return (
    <footer className="rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface),white_40%)] px-4 py-3 text-center">
      <p className="font-body text-xs text-[var(--muted)]">
        Signal Foundry proof-of-concept chat interface powered by Groq + Meta Llama 3.
      </p>
    </footer>
  );
};
