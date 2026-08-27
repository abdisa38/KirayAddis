import { Router } from "express";
import { aiMatch, generateDescription } from "../controllers/aiController.js";

const router = Router();

router.post("/match", aiMatch);
router.post("/generate-description", generateDescription);

export default router;
