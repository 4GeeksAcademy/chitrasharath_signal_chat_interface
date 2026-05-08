interface StatusBannerProps {
  isLoading: boolean;
  errorMessage: string | null;
}

export const StatusBanner = ({ isLoading, errorMessage }: StatusBannerProps) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent),white_90%)] px-4 py-2 font-mono text-sm text-[var(--accent)]">
        groqing...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-[var(--error)] bg-[color-mix(in_oklab,var(--error),white_90%)] px-4 py-2 font-body text-sm text-[var(--error)]">
        {errorMessage}
      </div>
    );
  }

  return null;
};
