import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { movies, ratings, users } from "../db/schema.js";
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

  res.json({ value: rating?.value ?? null, review: rating?.review ?? "" });
}

export async function upsert(req, res) {
  const movieId = Number(req.params.id);
  const userId = req.user.id;
  const { value } = req.body;
  const review = req.body.review ? req.body.review : null;

  const [movie] = await db.select({ id: movies.id }).from(movies).where(eq(movies.id, movieId));
  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  const [rating] = await db
    .insert(ratings)
    .values({ movieId, userId, value, review })
    .onConflictDoUpdate({
      target: [ratings.userId, ratings.movieId],
      set: { value, review, updatedAt: localNow() },
    })
    .returning();

  const summary = await getSummary(movieId);
  res.json({ value: rating.value, review: rating.review ?? "", ...summary });
}

export async function remove(req, res) {
  const movieId = Number(req.params.id);
  const userId = req.user.id;

  const [deleted] = await db
    .delete(ratings)
    .where(and(eq(ratings.movieId, movieId), eq(ratings.userId, userId)))
    .returning();

  if (!deleted) {
    throw new AppError(404, "Rating not found");
  }

  const summary = await getSummary(movieId);
  res.json({ ...summary });
}

export async function listForMovie(req, res) {
  const movieId = Number(req.params.id);

  const reviews = await db
    .select({
      id: ratings.id,
      value: ratings.value,
      review: ratings.review,
      updatedAt: ratings.updatedAt,
      userId: ratings.userId,
      userName: users.name,
    })
    .from(ratings)
    .innerJoin(users, eq(users.id, ratings.userId))
    .where(and(eq(ratings.movieId, movieId), isNotNull(ratings.review)))
    .orderBy(desc(ratings.updatedAt));

  res.json({ reviews });
}
