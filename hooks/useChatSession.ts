"use client";

import { useEffect, useState } from "react";
import type {
  ChatApiResponse,
  ChatMessage,
  ChatSessionState,
  LatestResponseMetrics,
  PerformanceStats,
  UsageTotals,
} from "@/types/chat";

const STORAGE_KEY = "signal-foundry-session-v1";
const ACTIVE_MODEL = process.env.NEXT_PUBLIC_GROQ_MODEL ?? "llama-3.1-8b-instant";

const initialUsageTotals: UsageTotals = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
  accumulatedCostUsd: 0,
};

const initialPerformance: PerformanceStats = {
  averageResponseTimeMs: 0,
  averageTokensPerSecond: 0,
  successfulResponses: 0,
  failedResponses: 0,
};

const initialState: ChatSessionState = {
  messages: [],
  latestMetrics: null,
  usageTotals: initialUsageTotals,
  performance: initialPerformance,
  isLoading: false,
  errorMessage: null,
};

const toUserMessage = (content: string): ChatMessage => ({
  id: crypto.randomUUID(),
  role: "user",
  content,
  createdAt: new Date().toISOString(),
});

const getUpdatedPerformance = (
  performance: PerformanceStats,
  latestMetrics: LatestResponseMetrics,
): PerformanceStats => {
  const nextSuccessCount = performance.successfulResponses + 1;
  const totalResponseMs =
    performance.averageResponseTimeMs * performance.successfulResponses +
    latestMetrics.responseTimeMs;
  const totalTps =
    performance.averageTokensPerSecond * performance.successfulResponses +
    latestMetrics.tokensPerSecond;

  return {
    ...performance,
    successfulResponses: nextSuccessCount,
    averageResponseTimeMs: totalResponseMs / nextSuccessCount,
    averageTokensPerSecond: totalTps / nextSuccessCount,
  };
};

export const useChatSession = () => {
  const [inputValue, setInputValue] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [state, setState] = useState<ChatSessionState>(initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ChatSessionState>;
        setState((prev) => ({
          ...prev,
          messages: parsed.messages ?? [],
          latestMetrics: parsed.latestMetrics ?? null,
          usageTotals: parsed.usageTotals ?? initialUsageTotals,
          performance: parsed.performance ?? initialPerformance,
        }));
      }
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        messages: state.messages,
        latestMetrics: state.latestMetrics,
        usageTotals: state.usageTotals,
        performance: state.performance,
      }),
    );
  }, [hasHydrated, state.messages, state.latestMetrics, state.usageTotals, state.performance]);

  const resetSession = () => {
    setState(initialState);
    setInputValue("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const submitMessage = async () => {
    const content = inputValue.trim();
    if (!content || state.isLoading) return;

    const userMessage = toUserMessage(content);
    const nextMessages = [...state.messages, userMessage];
    setInputValue("");
    setState((prev) => ({ ...prev, messages: nextMessages, isLoading: true, errorMessage: null }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [userMessage] }),
      });

      const data = (await response.json()) as ChatApiResponse & { error?: string };
      if (!response.ok || !data.assistantMessage || !data.latestMetrics) {
        throw new Error(data.error ?? "The request did not complete.");
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: null,
        messages: [...prev.messages, data.assistantMessage],
        latestMetrics: data.latestMetrics,
        usageTotals: {
          promptTokens: prev.usageTotals.promptTokens + data.latestMetrics.promptTokens,
          completionTokens:
            prev.usageTotals.completionTokens + data.latestMetrics.completionTokens,
          totalTokens: prev.usageTotals.totalTokens + data.latestMetrics.totalTokens,
          accumulatedCostUsd: prev.usageTotals.accumulatedCostUsd,
        },
        performance: getUpdatedPerformance(prev.performance, data.latestMetrics),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: message,
        performance: {
          ...prev.performance,
          failedResponses: prev.performance.failedResponses + 1,
        },
      }));
    }
  };

  return {
    activeModel: state.latestMetrics?.model ?? ACTIVE_MODEL,
    inputValue,
    setInputValue,
    state,
    submitMessage,
    resetSession,
  };
};
