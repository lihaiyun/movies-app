import { AppError } from "../lib/errors.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(400, "Validation failed", result.error.flatten().fieldErrors)
      );
    }

    req.body = result.data;
    next();
  };
}
