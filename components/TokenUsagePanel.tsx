import type { PerformanceStats, UsageTotals } from "@/types/chat";

interface TokenUsagePanelProps {
  usageTotals: UsageTotals;
  performance: PerformanceStats;
}

export const TokenUsagePanel = ({ usageTotals, performance }: TokenUsagePanelProps) => {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h2 className="font-heading text-lg text-[var(--text-primary)]">Token Usage</h2>
      <dl className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-[var(--muted)]">Prompt</dt>
          <dd className="font-mono text-base text-[var(--text-primary)]">{usageTotals.promptTokens}</dd>
        </div>
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-[var(--muted)]">Completion</dt>
          <dd className="font-mono text-base text-[var(--text-primary)]">{usageTotals.completionTokens}</dd>
        </div>
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-[var(--muted)]">Total</dt>
          <dd className="font-mono text-base text-[var(--text-primary)]">{usageTotals.totalTokens}</dd>
        </div>
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-[var(--muted)]">Failed</dt>
          <dd className="font-mono text-base text-[var(--error)]">{performance.failedResponses}</dd>
        </div>
      </dl>
    </section>
  );
};
