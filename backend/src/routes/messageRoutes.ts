import { Router } from "express";
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  requestViewing,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/conversations", protect, getConversations);
router.post("/conversations", protect, startConversation);
router.get("/conversations/:id/messages", protect, getMessages);
router.post("/conversations/:id/messages", protect, sendMessage);
router.post("/viewings", protect, requestViewing);

export default router;
