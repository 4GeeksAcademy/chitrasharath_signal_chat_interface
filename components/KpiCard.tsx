interface KpiCardProps {
  label: string;
  value: string;
}

export const KpiCard = ({ label, value }: KpiCardProps) => {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="font-body text-xs uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-mono text-2xl text-[var(--text-primary)]">{value}</p>
    </article>
  );
};
