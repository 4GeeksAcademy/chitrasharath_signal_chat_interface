export const FooterBar = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto px-1 py-2 text-center">
      <p className="font-body text-xs text-[var(--muted)]">Copyright {year} Signal Foundry.</p>
    </footer>
  );
};
