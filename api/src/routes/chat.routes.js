import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import { validate } from "../middleware/validate.js";
import { chatMessageSchema } from "../lib/validators.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.post("/", validate(chatMessageSchema), asyncHandler(chatController.chat));

export default router;
