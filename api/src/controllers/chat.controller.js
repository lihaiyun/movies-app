import { and, desc, ilike, or } from "drizzle-orm";
import { db } from "../db/client.js";
import { movies } from "../db/schema.js";
import { AppError } from "../lib/errors.js";
import { groqChatCompletion } from "../lib/groq.js";

const MAX_TOOL_ROUNDS = 4;

const SYSTEM_PROMPT = `You are the movie assistant for "Movies App", a movie catalogue website.
Help users find movies, compare them, and get recommendations using ONLY the "search_movies" tool -
never invent movies, genres, or release dates that the tool did not return.
Call search_movies whenever a question is about what's in the catalogue (titles, genres, release dates, recommendations).
If the tool returns no results, say so plainly instead of guessing.
Keep answers short, friendly, and focused on the catalogue.`;

const SEARCH_MOVIES_TOOL = {
  type: "function",
  function: {
    name: "search_movies",
    description: "Search the movie catalogue by keyword and/or genre.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Keyword to search for in the movie title or description",
        },
        genre: {
          type: "string",
          description: "Filter results to a specific genre",
        },
        limit: {
          type: "number",
          description: "Maximum number of movies to return (default 5, max 10)",
        },
      },
    },
  },
};

async function searchMovies({ query, genre, limit } = {}) {
  const max = Math.min(Math.max(Number(limit) || 5, 1), 10);
  const conditions = [];

  if (query) {
    conditions.push(or(ilike(movies.title, `%${query}%`), ilike(movies.description, `%${query}%`)));
  }

  if (genre) {
    conditions.push(ilike(movies.genre, `%${genre}%`));
  }

  const results = await db
    .select({
      id: movies.id,
      title: movies.title,
      genre: movies.genre,
      description: movies.description,
      releaseDate: movies.releaseDate,
    })
    .from(movies)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(movies.releaseDate))
    .limit(max);

  return results;
}

async function runTool(toolCall) {
  if (toolCall.function.name !== "search_movies") {
    return { error: `Unknown tool: ${toolCall.function.name}` };
  }

  let args = {};
  try {
    args = JSON.parse(toolCall.function.arguments || "{}");
  } catch {
    // fall back to no filters if the model sent malformed JSON
  }

  return searchMovies(args);
}

export async function chat(req, res) {
  const { message, history = [] } = req.body;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(({ role, content }) => ({ role, content })),
    { role: "user", content: message },
  ];

  let reply;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const completion = await groqChatCompletion({ messages, tools: [SEARCH_MOVIES_TOOL] });
    const choice = completion.choices?.[0]?.message;

    if (!choice) {
      throw new AppError(502, "AI assistant did not return a response");
    }

    if (choice.tool_calls?.length) {
      messages.push(choice);

      for (const toolCall of choice.tool_calls) {
        const result = await runTool(toolCall);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      continue;
    }

    reply = choice.content;
    break;
  }

  if (!reply) {
    throw new AppError(502, "AI assistant did not return a response");
  }

  res.json({ reply });
}
