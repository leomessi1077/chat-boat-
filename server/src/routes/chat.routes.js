import express from "express";
import {
  getConversations,
  createConversation,
  getMessages,
  deleteConversation,
  renameConversation,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:conversationId/messages", getMessages);
router.delete("/conversations/:conversationId", deleteConversation);
router.patch("/conversations/:conversationId", renameConversation);

export default router;
