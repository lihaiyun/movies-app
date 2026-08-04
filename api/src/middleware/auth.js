import { verifyToken } from "../lib/jwt.js";
import { AUTH_COOKIE_NAME } from "../lib/cookies.js";
import { AppError } from "../lib/errors.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired session"));
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return next(new AppError(403, "Admin access required"));
  }
  next();
}
