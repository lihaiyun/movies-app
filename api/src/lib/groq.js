import { AppError } from "./errors.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3-32b";

export async function groqChatCompletion({ messages, tools }) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new AppError(500, "GROQ_API_KEY is not configured");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.3,
      ...(tools ? { tools, tool_choice: "auto" } : {}),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => undefined);

    if (response.status === 429) {
      throw new AppError(429, "The AI assistant is busy right now - please try again in a few seconds", details);
    }

    throw new AppError(502, "AI assistant request failed", details);
  }

  return response.json();
}
