import { KpiCard } from "@/components/KpiCard";

interface KpiSectionProps {
  cumulativeTokens: string;
  accumulatedCost: string;
  averageResponseMs: string;
  averageTps: string;
}

export const KpiSection = ({
  cumulativeTokens,
  accumulatedCost,
  averageResponseMs,
  averageTps,
}: KpiSectionProps) => {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Cumulative Tokens" value={cumulativeTokens} />
      <KpiCard label="Accumulated Cost" value={accumulatedCost} />
      <KpiCard label="Avg Response Time" value={averageResponseMs} />
      <KpiCard label="Avg Tokens / Sec" value={averageTps} />
    </section>
  );
};
