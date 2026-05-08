"use client";

import { useEffect, useRef, useState } from "react";

import { ChatPanel } from "@/components/ChatPanel";
import { FooterBar } from "@/components/FooterBar";
import { HeaderBar } from "@/components/HeaderBar";
import { KpiSection } from "@/components/KpiSection";
import { MessageComposer } from "@/components/MessageComposer";
import { MessageList } from "@/components/MessageList";
import { MetricsPanel } from "@/components/MetricsPanel";
import { StatusBanner } from "@/components/StatusBanner";
import { TokenUsagePanel } from "@/components/TokenUsagePanel";
import { useChatSession } from "@/hooks/useChatSession";

const Home = () => {
  const [isStickyElevated, setIsStickyElevated] = useState(false);
  const [asideStickyTop, setAsideStickyTop] = useState(0);
  const stickyStackRef = useRef<HTMLDivElement>(null);
  const { activeModel, inputValue, setInputValue, state, submitMessage, resetSession } =
    useChatSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsStickyElevated(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateAsideTop = () => {
      const stickyHeight = stickyStackRef.current?.getBoundingClientRect().height ?? 0;
      setAsideStickyTop(Math.round(stickyHeight + 20));
    };

    updateAsideTop();
    const observer = new ResizeObserver(updateAsideTop);
    if (stickyStackRef.current) {
      observer.observe(stickyStackRef.current);
    }

    window.addEventListener("resize", updateAsideTop);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateAsideTop);
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-5 md:gap-5 md:px-6">
      <div
        ref={stickyStackRef}
        className={`sticky top-0 z-30 space-y-4 bg-[var(--background)] py-2 transition-shadow duration-200 md:space-y-5 ${
          isStickyElevated ? "shadow-[0_10px_24px_rgba(20,33,61,0.12)]" : ""
        }`}
      >
        <HeaderBar modelName={activeModel} onReset={resetSession} />
        <KpiSection
          cumulativeTokens={state.usageTotals.totalTokens.toString()}
          accumulatedCost={`$${state.usageTotals.accumulatedCostUsd.toFixed(4)}`}
          averageResponseMs={`${state.performance.averageResponseTimeMs.toFixed(0)} ms`}
          averageTps={state.performance.averageTokensPerSecond.toFixed(2)}
        />
      </div>
      <main className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr] md:gap-5">
        <ChatPanel>
          <MessageList messages={state.messages} />
          <StatusBanner isLoading={state.isLoading} errorMessage={state.errorMessage} />
          <MessageComposer
            value={inputValue}
            isLoading={state.isLoading}
            onChange={setInputValue}
            onSubmit={submitMessage}
          />
        </ChatPanel>
        <aside style={{ top: `${asideStickyTop}px` }} className="space-y-4 md:sticky md:self-start">
          <MetricsPanel latestMetrics={state.latestMetrics} />
          <TokenUsagePanel usageTotals={state.usageTotals} performance={state.performance} />
        </aside>
      </main>
      <FooterBar />
    </div>
  );
};

export default Home;
