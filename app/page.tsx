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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const stickyStackRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const { activeModel, inputValue, setInputValue, state, submitMessage, resetSession } =
    useChatSession();

  const handleTextareaInteract = () => {
    setIsMobileSidebarOpen(false);
    chatInputRef.current?.focus();
  };

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

  useEffect(() => {
    const closeMobileDrawerOnDesktop = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", closeMobileDrawerOnDesktop);
    return () => window.removeEventListener("resize", closeMobileDrawerOnDesktop);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      chatInputRef.current?.focus();
    }, 180);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-5 md:gap-5 md:px-6">
      <div
        ref={stickyStackRef}
        className={`sticky top-0 z-30 space-y-4 bg-[var(--background)] py-2 transition-shadow duration-200 md:space-y-5 ${
          isStickyElevated ? "shadow-[0_10px_24px_rgba(20,33,61,0.12)]" : ""
        }`}
      >
        <button
          type="button"
          aria-label="Open sidebar"
          aria-expanded={isMobileSidebarOpen}
          aria-controls="mobile-sidebar-drawer"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="ml-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] md:hidden"
        >
          ☰ Menu
        </button>
        <HeaderBar modelName={activeModel} onReset={resetSession} />
        <div className="hidden md:block">
          <KpiSection
            cumulativeTokens={state.usageTotals.totalTokens.toString()}
            accumulatedCost={`$${state.usageTotals.accumulatedCostUsd.toFixed(4)}`}
            averageResponseMs={`${state.performance.averageResponseTimeMs.toFixed(0)} ms`}
            averageTps={state.performance.averageTokensPerSecond.toFixed(2)}
          />
        </div>
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
            textareaRef={chatInputRef}
            onTextareaInteract={handleTextareaInteract}
          />
        </ChatPanel>

        <div
          className={`fixed inset-0 z-40 bg-black/35 transition-opacity md:hidden ${
            isMobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />

        <aside
          id="mobile-sidebar-drawer"
          className={`fixed inset-y-0 right-0 z-50 w-[min(88vw,22rem)] overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_16px_40px_rgba(20,33,61,0.2)] transition-transform md:hidden ${
            isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base text-[var(--text-primary)]">Sidebar</h2>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="rounded-lg border border-[var(--border)] px-2 py-1 font-body text-xs text-[var(--text-primary)]"
            >
              Close
            </button>
          </div>
          <div className="space-y-4">
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <h3 className="font-heading text-sm text-[var(--text-primary)]">Session KPIs</h3>
              <div className="mt-3">
                <KpiSection
                  cumulativeTokens={state.usageTotals.totalTokens.toString()}
                  accumulatedCost={`$${state.usageTotals.accumulatedCostUsd.toFixed(4)}`}
                  averageResponseMs={`${state.performance.averageResponseTimeMs.toFixed(0)} ms`}
                  averageTps={state.performance.averageTokensPerSecond.toFixed(2)}
                />
              </div>
            </section>
            <MetricsPanel latestMetrics={state.latestMetrics} />
            <TokenUsagePanel usageTotals={state.usageTotals} performance={state.performance} />
          </div>
        </aside>

        <aside
          style={{ top: `${asideStickyTop}px` }}
          className="hidden space-y-4 md:sticky md:block md:self-start"
        >
          <MetricsPanel latestMetrics={state.latestMetrics} />
          <TokenUsagePanel usageTotals={state.usageTotals} performance={state.performance} />
        </aside>
      </main>
      <FooterBar />
    </div>
  );
};

export default Home;
