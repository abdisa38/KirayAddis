import { Router } from "express";
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  requestViewing,
  getViewings,
  updateViewingStatus,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/conversations", protect, getConversations);
router.post("/conversations", protect, startConversation);
router.get("/conversations/:id/messages", protect, getMessages);
router.post("/conversations/:id/messages", protect, sendMessage);
router.get("/viewings", protect, getViewings);
router.post("/viewings", protect, requestViewing);
router.patch("/viewings/:id/status", protect, updateViewingStatus);

export default router;

