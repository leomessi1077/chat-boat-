import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";

// Get all conversations for current user
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// Create new conversation
export const createConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      userId: req.user._id,
      title: title || "New Chat",
    });
    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

// Get messages for a conversation
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// Delete conversation
export const deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    await Message.deleteMany({ conversationId });
    res.json({ message: "Conversation deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// Rename conversation
export const renameConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, userId: req.user._id },
      { title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};
