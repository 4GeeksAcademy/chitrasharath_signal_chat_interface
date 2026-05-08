import { NextResponse } from "next/server";

const DEFAULT_MODEL = "llama-3.1-8b-instant";

type GroqUsage = {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
};

type GroqMetadata = {
  completion_time?: number;
  total_time?: number;
};

type GroqResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  model?: string;
  usage?: GroqUsage;
  metadata?: GroqMetadata;
  error?: { message?: string };
};

const getLatestUserContent = (body: unknown): string | null => {
  if (!body || typeof body !== "object") return null;

  const payload = body as { message?: unknown; messages?: unknown };
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  if (!Array.isArray(payload.messages)) return null;

  const latestUserMessage = [...payload.messages]
    .reverse()
    .find(
      (message): message is { role?: unknown; content?: unknown } =>
        !!message && typeof message === "object" && "role" in message,
    );

  if (!latestUserMessage || latestUserMessage.role !== "user") return null;
  if (typeof latestUserMessage.content !== "string") return null;

  const content = latestUserMessage.content.trim();
  return content ? content : null;
};

export const POST = async (request: Request) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "The chat service key is missing on the server." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as unknown;
    const latestQuestion = getLatestUserContent(body);
    if (!latestQuestion) {
      return NextResponse.json(
        { error: "Please send one user question at a time." },
        { status: 400 },
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Groq-Beta": "inference-metrics",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? DEFAULT_MODEL,
        messages: [{ role: "user", content: latestQuestion }],
      }),
    });

    if (!response.ok) {
      const groqError = ((await response.json().catch(() => null)) as GroqResponse | null)?.error
        ?.message;

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: "The chat service key is invalid. Please check GROQ_API_KEY." },
          { status: 500 },
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Too many requests right now. Please wait and try again." },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          error:
            groqError && response.status === 400
              ? "The selected model request is invalid. Please check GROQ_MODEL and try again."
              : "The model could not answer right now. Please try again.",
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as GroqResponse;
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "No answer was returned. Please try again." },
        { status: 502 },
      );
    }

    const usage = data.usage ?? {};
    const metadata = data.metadata ?? {};
    const completionTimeSeconds = Number(metadata.completion_time ?? 0);
    const responseTimeMs = Number(metadata.total_time ?? 0) * 1000;
    const completionTokens = Number(usage.completion_tokens ?? 0);
    const tokensPerSecond =
      completionTimeSeconds > 0 ? completionTokens / completionTimeSeconds : 0;

    return NextResponse.json({
      assistantMessage: {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        createdAt: new Date().toISOString(),
      },
      latestMetrics: {
        model: data.model ?? process.env.GROQ_MODEL ?? DEFAULT_MODEL,
        responseTimeMs,
        completionTimeSeconds,
        tokensPerSecond,
        promptTokens: Number(usage.prompt_tokens ?? 0),
        completionTokens,
        totalTokens: Number(usage.total_tokens ?? 0),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while contacting the model." },
      { status: 500 },
    );
  }
};
