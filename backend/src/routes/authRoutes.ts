import { Router } from "express";
import {
  register,
  login,
  getMe,
  verifyEmail,
  googleAuth,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.post("/verify-email", protect, verifyEmail);

export default router;

