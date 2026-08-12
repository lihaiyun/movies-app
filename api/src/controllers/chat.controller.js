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
Keep answers short, friendly, and focused on the catalogue.
Format responses in Markdown - use bullet lists for multiple movies and bold for titles.
Each movie the tool returns includes a "url" field - always link the movie's title to that url using
a Markdown link, e.g. [Inception](/movies/12).
The catalogue only stores title, description, genre and release date - there is no field for things like
age/content rating, language, or country of origin, so the "query" filter cannot search for those directly
(it only matches literal keywords in the title/description, not concepts). For a question about such an
inferred attribute (e.g. whether a movie is suitable for kids, or whether it's a Chinese/Korean/etc. film),
call search_movies with NO query/genre filter to get the full catalogue, then judge each candidate from its
title, genre and description. Say plainly that it's your assessment rather than official data.`;

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
          description:
            "Literal keyword to match in the movie title or description. Only matches exact text - " +
            "leave this out (along with genre) to get the entire catalogue back, which is what to do " +
            "when judging an inferred attribute like language, origin, or kid-suitability that isn't " +
            "a literal keyword match.",
        },
        genre: {
          type: "string",
          description: "Filter results to a specific genre",
        },
        limit: {
          type: "number",
          description:
            "Maximum number of movies to return when query or genre is set (default 5, max 30). " +
            "Ignored when both are omitted - that always returns the full catalogue.",
        },
      },
    },
  },
};

// A browse-all call (no keyword/genre filter) is how the model inspects the whole catalogue to judge an
// inferred attribute (language, kid-suitability, etc.) - always return everything for that case instead of
// trusting the model to ask for a high enough limit itself.
const BROWSE_ALL_LIMIT = 200;

async function searchMovies({ query, genre, limit } = {}) {
  const conditions = [];

  if (query) {
    conditions.push(or(ilike(movies.title, `%${query}%`), ilike(movies.description, `%${query}%`)));
  }

  if (genre) {
    conditions.push(ilike(movies.genre, `%${genre}%`));
  }

  const max = conditions.length
    ? Math.min(Math.max(Number(limit) || 5, 1), 30)
    : BROWSE_ALL_LIMIT;

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

  return results.map((movie) => ({ ...movie, url: `/movies/${movie.id}` }));
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
      // Some models (e.g. Qwen reasoning models) attach a verbose "reasoning" field alongside the
      // actual message - drop it before feeding the message back in, or token usage balloons with
      // every extra round.
      messages.push({ role: choice.role, content: choice.content ?? null, tool_calls: choice.tool_calls });

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
