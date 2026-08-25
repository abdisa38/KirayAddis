import { Router } from "express";
import {
  getAdminKPIs,
  getReviewQueue,
  moderateProperty,
  getAllUsers,
  createReport,
  getReports,
  toggleUserStatus,
  updateReportStatus,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Allow report submission
router.post("/reports", createReport);

// Protect all other admin routes
router.use(protect, authorize("admin"));

router.get("/kpis", getAdminKPIs);
router.get("/queue", getReviewQueue);
router.patch("/properties/:id/moderate", moderateProperty);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", toggleUserStatus);
router.get("/reports", getReports);
router.patch("/reports/:id/status", updateReportStatus);

export default router;


