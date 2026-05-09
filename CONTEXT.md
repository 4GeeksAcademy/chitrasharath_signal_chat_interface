# Project Overview

This project is a proof-of-concept chat interface for a small digital consultancy company. The application will be built with Next.js and will communicate with a real language model through the Groq API using a free Meta Llama 3 model. The interface must make conversation data visible and measurable in the UI, including token usage, response metrics, and accumulated cost. The project does not use a database.

# Branding

- Proposed company name: `Signal Foundry`
- Proposed logo: a simple mark that combines a chat bubble with three vertical metric bars to represent conversation, analytics, and fast model feedback

# Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- App Router

# Project Setup

- Create the project with `npx create-next-app@latest <project-name> --ts --tailwind --app --use-npm`
- Keep the project at the root level so `/app`, `/components`, and `/types` live directly in the project

# Groq API Usage

- Save the API key in `.env` as `GROQ_API_KEY=your_key_here`
- Keep the API key on the server side and call Groq from a Next.js route handler such as `/app/api/chat/route.ts`
- Use `fetch` to send a `POST` request to `https://api.groq.com/openai/v1/chat/completions`
- Send the headers `Authorization: Bearer ${process.env.GROQ_API_KEY}` and `Content-Type: application/json`
- Include the header `Groq-Beta: inference-metrics` so the response includes timing metadata for UI metrics
- Send a JSON body with the selected Meta Llama model and the conversation `messages` array
- Read the assistant reply from `choices[0].message.content`
- Read token usage from the `usage` object, including prompt, completion, and total tokens
- Read timing data from the `metadata` object, including completion time and total time
- Calculate tokens per second from `usage.completion_tokens / metadata.completion_time`
- Return simplified error messages to the UI when the Groq request fails

# UI Description

The UI is a proof-of-concept chat experience that combines a standard messaging interface with visible model telemetry. At the top, the interface includes a branded header with a logo, company name, and a chat reset action. Below the header, the layout should surface KPI cards that make usage and performance easy to scan at a glance.

The main area centers on the chat conversation, where users can type messages and receive model responses. The interface should clearly show the active model, response time, tokens per second, prompt tokens, completion tokens, cumulative token totals, and accumulated cost. While a request is in progress, the UI should display a loading state using the text `groqing...`.

The UI should also handle failure states in simplified English so non-technical users can understand when a request did not complete. Conversation history and stats should persist across refreshes by loading them from local storage with `useEffect`.

# Responsive Design

- Design mobile-first for a `375px` viewport
- Add desktop adjustments starting at `768px`
- On mobile, use a stacked single-column flow: header, KPI section, chat area, metrics area, and footer
- On desktop, keep the chat area as the primary column and place supporting metrics in a secondary side panel
- Preserve the same component order and information hierarchy across breakpoints
- Keep the message composer easy to reach on mobile and clearly anchored to the chat area

# Visual Design Direction

The interface should feel editorial, measured, and consultancy-grade rather than like a generic AI demo. It should balance warmth and clarity while keeping conversation telemetry visible at all times.

Color system:

- `background`: `#F4F1EA`
- `surface`: `#FFFDF8`
- `textPrimary`: `#14213D`
- `accent`: `#0F8B8D`
- `border`: `#D8D1C5`
- `error`: `#C75146`
- `success`: `#3A7D44`

Typography:

- Heading font: `Space Grotesk`
- Body font: `Source Sans 3`
- Metrics and numeric telemetry font: `IBM Plex Mono`

Usage rules:

- Avoid a generic purple AI aesthetic
- Keep KPI numbers visually distinct from message text
- Use the accent color for active, important, or live telemetry moments rather than for large fills
- Keep the footer and secondary metrics quieter than the main chat interface

# Page Composition

1. `HeaderBar`
2. `KpiSection`
3. `ChatPanel`
4. `MessageList`
5. `MessageComposer`
6. `MetricsPanel`
7. `TokenUsagePanel`
8. `StatusBanner`
9. `FooterBar`

# Layout Relationships

- The header establishes brand identity and session controls
- The KPI section should remain near the top so usage and performance are visible without scrolling deep into the conversation
- The chat area is the primary experience and should occupy the largest amount of visual space
- The latest-response metrics and cumulative token tracking should be visually connected to the active chat session
- The loading and error banner should appear close to the composer or conversation area so users understand the current request state
- The footer should terminate the page without competing with the main interaction flow

# Data Requirements

- There is no database and no backend persistence layer beyond the Groq request
- Conversation messages must be stored in typed client state and persisted to local storage
- Token usage must be tracked per response and cumulatively across the session
- The UI must track prompt tokens, completion tokens, total tokens, response time, tokens per second, and model name
- The UI must include an accumulated cost field even when the selected Groq model is free
- If the selected model is free, accumulated cost should remain `0` while still being displayed in the KPI area

# Data Usage Rules

- The `messages` array should drive both the rendered conversation and the payload sent to the Groq API
- Each successful assistant response should append a new message and update `latestMetrics`, `usageTotals`, and `performance`
- Each failed request should preserve the existing conversation history and set a simplified-English error message for the UI
- `useEffect` should hydrate the session from local storage on first load
- Session updates should be persisted back to local storage after message or metrics changes
- The reset action should clear messages, metrics, and local storage together so the UI returns to a true empty session

# Interaction Requirements

- Submitting a message should trigger a `fetch` request through the app's server-side route handler to Groq
- While a request is in progress, the UI should display `groqing...` and prevent duplicate submits
- The reset button should clear the conversation, KPI values, and persisted local storage session data
- On refresh, the interface should restore the previous conversation and stats automatically
- Error states should be written in simple English for non-technical users
- The active model name should remain visible in the interface during the session

# Component Implementation Requirements

- Use `useState` for local interactive state such as the composer input, loading state, error state, and session metrics
- Use `useEffect` to restore and persist conversation history and telemetry in local storage
- Use explicit `fetch` calls for the Groq request flow
- Keep request logic in the Next.js route handler and keep UI components focused on presentation and local interaction
- Keep page-level orchestration in `/app/page.tsx` and move reusable display logic into `/components`
- Respect the `80`-line component limit by splitting larger UI blocks into smaller components

# Footer

The UI should include a simple footer at the bottom of the page. The footer should display the company name, reinforce the proof-of-concept identity of the app, and lightly reference the model stack in a compact way such as Groq and Meta Llama. It should remain visually minimal, secondary to the chat interface, and should not introduce extra navigation or unrelated links.

# Component Schema

- `/app/page.tsx` assembles the full chat interface and owns the main session state
- `HeaderBar` displays the logo, company name, active model label, and reset button
- `KpiSection` displays high-level KPI cards for cumulative tokens, accumulated cost, average response time, and average tokens per second
- `KpiCard` renders a single KPI value and label
- `ChatPanel` wraps the main conversation area
- `MessageList` renders the full chat history
- `MessageBubble` renders a single user or assistant message
- `MessageComposer` handles user input, submit actions, and disabled loading state
- `MetricsPanel` displays the latest model name, response time, and tokens per second
- `TokenUsagePanel` displays prompt tokens, completion tokens, and cumulative totals
- `StatusBanner` displays the `groqing...` loading state and simplified-English error messages
- `FooterBar` displays the company name and compact technology attribution in the page footer

Component relationships:

- `page.tsx` passes state and callbacks down to the presentational components
- `MessageComposer` sends the conversation payload to `/app/api/chat/route.ts`
- The route response updates `MessageList`, `KpiSection`, `MetricsPanel`, and `TokenUsagePanel`
- `useEffect` restores messages and stats from local storage on load and persists them after updates
- The reset action clears both in-memory state and local storage state

# Data Schema

```ts
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
```

# Folder Structure

- `/app` contains routes
- `/components` contains reusable UI pieces
- `/types` contains TypeScript interfaces and shared types

# Constraints

- Use only Tailwind CSS for styling
- All components must be custom
- All components must be implemented as `const` functional components
- Do not use class components
- No component should exceed `80` lines of combined JSX and logic
- If a component exceeds `80` lines, split it into smaller components
- There is no database
- Do not use any pre-built UI component library, including shadcn, MUI, or Ant Design

# Implementation Addendum (Current Codebase)

The following notes reflect behavior implemented in the current app and should be treated as additive context to the sections above.

## Conversation Focus and Scroll Behavior

- After a new assistant response is appended, the UI programmatically moves focus to the latest assistant message bubble.
- The page then performs a smooth scroll to align the top of that latest response just below the sticky top stack (menu + header + KPI area).
- Initial hydration does not trigger this auto-scroll behavior; it only triggers when assistant response count increases.
- The latest assistant message is identified in `MessageList` and receives a forwarded ref used by page-level orchestration.

## Composer Dock and Message Area Spacing

- The message area bottom spacing is dynamic rather than fixed.
- A `ResizeObserver` tracks the rendered height of the sticky composer dock.
- Message-list bottom padding is computed from composer height plus a small buffer so the last messages are not hidden under the sticky composer.

## Mobile Sidebar Behavior

- On mobile (`< md`), KPI and telemetry panels are available in a right-side drawer opened via a hamburger/menu button.
- The drawer uses safe-area-aware padding:
  - top: `calc(env(safe-area-inset-top) + 1rem)`
  - bottom: `calc(env(safe-area-inset-bottom) + 1rem)`
- This ensures the drawer header row and `Close` button remain visible and not clipped on devices with notches/browser chrome.
- The drawer closes when:
  - the backdrop is clicked,
  - the `Close` button is clicked,
  - the user interacts with the composer textarea,
  - the viewport resizes to desktop width.

## Sticky Layout Details

- The top brand/KPI stack remains sticky and gains elevation shadow once page scroll exceeds a small threshold.
- Desktop keeps telemetry in a sticky right column offset below the sticky top stack.
- Mobile keeps telemetry in the drawer, while chat stays primary in the main flow.

## Accessibility and Interaction Notes

- The message list uses `aria-live="polite"` so new messages are announced without aggressively interrupting assistive tech.
- The latest assistant bubble is temporarily focusable (`tabIndex={-1}`) to support programmatic focus after response arrival.
