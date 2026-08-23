import { Router } from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  confirmAvailability,
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.route("/").get(getProperties).post(protect, authorize("landlord", "admin"), createProperty);

router
  .route("/:id")
  .get(getPropertyById)
  .put(protect, authorize("landlord", "admin"), updateProperty)
  .delete(protect, authorize("landlord", "admin"), deleteProperty);

router.patch("/:id/confirm-availability", protect, confirmAvailability);

export default router;
