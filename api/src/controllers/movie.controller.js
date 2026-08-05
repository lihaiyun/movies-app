import { desc, eq, ilike } from "drizzle-orm";
import { db } from "../db/client.js";
import { movies } from "../db/schema.js";
import { AppError } from "../lib/errors.js";
import { localNow } from "../lib/date.js";

export async function list(req, res) {
  const { search } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const offset = (page - 1) * limit;

  const where = search ? ilike(movies.title, `%${search}%`) : undefined;

  const results = await db
    .select()
    .from(movies)
    .where(where)
    .orderBy(desc(movies.createdAt))
    .limit(limit)
    .offset(offset);

  res.json({ movies: results, page, limit });
}

export async function getById(req, res) {
  const id = Number(req.params.id);
  const [movie] = await db.select().from(movies).where(eq(movies.id, id));

  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  res.json(movie);
}

export async function create(req, res) {
  const [movie] = await db.insert(movies).values(req.body).returning();
  res.status(201).json(movie);
}

export async function update(req, res) {
  const id = Number(req.params.id);

  const [movie] = await db
    .update(movies)
    .set({ ...req.body, updatedAt: localNow() })
    .where(eq(movies.id, id))
    .returning();

  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  res.json(movie);
}

export async function remove(req, res) {
  const id = Number(req.params.id);

  const [movie] = await db.delete(movies).where(eq(movies.id, id)).returning();

  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  res.status(204).send();
}
