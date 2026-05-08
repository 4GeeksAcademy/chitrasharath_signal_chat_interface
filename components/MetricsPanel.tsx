import type { LatestResponseMetrics } from "@/types/chat";

interface MetricsPanelProps {
  latestMetrics: LatestResponseMetrics | null;
}

export const MetricsPanel = ({ latestMetrics }: MetricsPanelProps) => {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h2 className="font-heading text-lg text-[var(--text-primary)]">Latest Response</h2>
      <dl className="mt-3 space-y-3">
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-[var(--muted)]">Model</dt>
          <dd className="font-mono text-sm text-[var(--text-primary)]">{latestMetrics?.model ?? "-"}</dd>
        </div>
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-[var(--muted)]">Response Time</dt>
          <dd className="font-mono text-sm text-[var(--text-primary)]">{latestMetrics ? `${latestMetrics.responseTimeMs.toFixed(0)} ms` : "-"}</dd>
        </div>
        <div>
          <dt className="font-body text-xs uppercase tracking-wide text-[var(--muted)]">Tokens / Sec</dt>
          <dd className="font-mono text-sm text-[var(--text-primary)]">{latestMetrics ? latestMetrics.tokensPerSecond.toFixed(2) : "-"}</dd>
        </div>
      </dl>
    </section>
  );
};
