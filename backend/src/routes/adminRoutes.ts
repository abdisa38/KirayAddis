import { Router } from "express";
import {
  getAdminKPIs,
  getReviewQueue,
  moderateProperty,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Protect all admin routes
router.use(protect, authorize("admin"));

router.get("/kpis", getAdminKPIs);
router.get("/queue", getReviewQueue);
router.patch("/properties/:id/moderate", moderateProperty);
router.get("/users", getAllUsers);

export default router;
