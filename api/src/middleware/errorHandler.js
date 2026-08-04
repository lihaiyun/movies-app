import { AppError } from "../lib/errors.js";

export function notFoundHandler(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  // Postgres unique violation (e.g. duplicate email)
  if (err.code === "23505") {
    return res.status(409).json({ error: "Resource already exists" });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
