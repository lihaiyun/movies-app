import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { movies, ratings } from "../db/schema.js";
import { AppError } from "../lib/errors.js";
import { localNow } from "../lib/date.js";

async function getSummary(movieId) {
  const [summary] = await db
    .select({
      average: sql`avg(${ratings.value})`,
      count: sql`count(*)`,
    })
    .from(ratings)
    .where(eq(ratings.movieId, movieId));

  return {
    averageRating: summary?.average != null ? Number(summary.average) : null,
    ratingCount: Number(summary?.count ?? 0),
  };
}

export async function getMine(req, res) {
  const movieId = Number(req.params.id);

  const [rating] = await db
    .select()
    .from(ratings)
    .where(and(eq(ratings.movieId, movieId), eq(ratings.userId, req.user.id)));

  res.json({ value: rating?.value ?? null });
}

export async function upsert(req, res) {
  const movieId = Number(req.params.id);
  const userId = req.user.id;
  const { value } = req.body;

  const [movie] = await db.select({ id: movies.id }).from(movies).where(eq(movies.id, movieId));
  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  const [rating] = await db
    .insert(ratings)
    .values({ movieId, userId, value })
    .onConflictDoUpdate({
      target: [ratings.userId, ratings.movieId],
      set: { value, updatedAt: localNow() },
    })
    .returning();

  const summary = await getSummary(movieId);
  res.json({ value: rating.value, ...summary });
}
