export const LogoMark = () => {
  return (
    <div className="flex h-10 w-10 items-end gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
      <div className="h-3 w-1.5 rounded-sm bg-[var(--accent)]" />
      <div className="h-5 w-1.5 rounded-sm bg-[var(--text-primary)]" />
      <div className="h-7 w-1.5 rounded-sm bg-[var(--accent)]" />
      <div className="relative ml-1 h-4 w-4 rounded-full border border-[var(--text-primary)] bg-transparent">
        <span className="absolute -bottom-1 left-1 h-2 w-2 rotate-45 border-b border-r border-[var(--text-primary)] bg-[var(--surface)]" />
      </div>
    </div>
  );
};
