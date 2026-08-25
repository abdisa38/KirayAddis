import { Router } from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  confirmAvailability,
  getNeighborhoods,
  getMyProperties,
  togglePropertyStatus,
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/neighborhoods", getNeighborhoods);
router.get("/mine", protect, authorize("landlord", "admin"), getMyProperties);

router.route("/").get(getProperties).post(protect, authorize("landlord", "admin"), createProperty);

router
  .route("/:id")
  .get(getPropertyById)
  .put(protect, authorize("landlord", "admin"), updateProperty)
  .delete(protect, authorize("landlord", "admin"), deleteProperty);

router.patch("/:id/confirm-availability", protect, confirmAvailability);
router.patch("/:id/toggle-status", protect, authorize("landlord", "admin"), togglePropertyStatus);

export default router;
