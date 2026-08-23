import { Router } from "express";
import {
  getSavedProperties,
  toggleSavedProperty,
  updatePreferences,
  getRecommendations,
} from "../controllers/tenantController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/saved", protect, getSavedProperties);
router.post("/saved/:propertyId", protect, toggleSavedProperty);
router.put("/preferences", protect, updatePreferences);
router.get("/recommendations", protect, getRecommendations);

export default router;
