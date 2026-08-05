import { Router } from "express";
import * as movieController from "../controllers/movie.controller.js";
import * as ratingController from "../controllers/rating.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { movieSchema, ratingSchema } from "../lib/validators.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(movieController.list));
router.get("/:id", asyncHandler(movieController.getById));
router.get("/:id/rating", requireAuth, asyncHandler(ratingController.getMine));
router.put(
  "/:id/rating",
  requireAuth,
  validate(ratingSchema),
  asyncHandler(ratingController.upsert)
);
router.delete("/:id/rating", requireAuth, asyncHandler(ratingController.remove));
router.get("/:id/reviews", asyncHandler(ratingController.listForMovie));
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validate(movieSchema),
  asyncHandler(movieController.create)
);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validate(movieSchema),
  asyncHandler(movieController.update)
);
router.delete("/:id", requireAuth, requireAdmin, asyncHandler(movieController.remove));

export default router;
