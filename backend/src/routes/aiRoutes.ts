import { Router } from "express";
import { aiMatch } from "../controllers/aiController.js";

const router = Router();

router.post("/match", aiMatch);

export default router;
