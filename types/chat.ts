export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface LatestResponseMetrics {
  model: string;
  responseTimeMs: number;
  completionTimeSeconds: number;
  tokensPerSecond: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface UsageTotals {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  accumulatedCostUsd: number;
}

export interface PerformanceStats {
  averageResponseTimeMs: number;
  averageTokensPerSecond: number;
  successfulResponses: number;
  failedResponses: number;
}

export interface ChatSessionState {
  messages: ChatMessage[];
  latestMetrics: LatestResponseMetrics | null;
  usageTotals: UsageTotals;
  performance: PerformanceStats;
  isLoading: boolean;
  errorMessage: string | null;
}

export interface ChatApiResponse {
  assistantMessage: ChatMessage;
  latestMetrics: LatestResponseMetrics;
}
