import { LogoMark } from "@/components/LogoMark";

interface HeaderBarProps {
  modelName: string;
  onReset: () => void;
}

export const HeaderBar = ({ modelName, onReset }: HeaderBarProps) => {
  return (
    <header className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="font-heading text-lg leading-none text-[var(--text-primary)]">Signal Foundry</p>
            <p className="font-body text-sm text-[var(--muted)]">Consultancy Chat Interface</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="font-body rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Reset
        </button>
      </div>
      <p className="mt-3 font-mono text-xs text-[var(--accent)]">Active model: {modelName}</p>
    </header>
  );
};
