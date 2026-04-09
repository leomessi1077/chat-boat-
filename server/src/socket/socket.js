import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { Message } from "../models/Message.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { generateStreamingResponse, generateTitle } from "../services/ai.service.js";

export const initSocket = (io) => {
  // Authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.name} (${socket.id})`);

    // Join user to their personal room
    socket.join(socket.user._id.toString());

    // Send message event
    socket.on("sendMessage", async ({ conversationId, content }) => {
      try {
        if (!content || !content.trim()) return;

        let conversation;

        // Create or find conversation
        if (!conversationId) {
          conversation = await Conversation.create({
            userId: socket.user._id,
            title: "New Chat",
          });

          // Emit new conversation to client
          socket.emit("conversationCreated", conversation);
          conversationId = conversation._id;
        } else {
          conversation = await Conversation.findOne({
            _id: conversationId,
            userId: socket.user._id,
          });
          if (!conversation) {
            return socket.emit("error", { message: "Conversation not found" });
          }
        }

        // Save user message
        const userMessage = await Message.create({
          conversationId,
          role: "user",
          content: content.trim(),
        });

        socket.emit("messageCreated", userMessage);

        // Get conversation history for context
        const allMessages = await Message.find({ conversationId })
          .sort({ createdAt: 1 })
          .limit(50);

        const historyForAI = allMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Signal streaming start
        const assistantMessageId = `temp-${Date.now()}`;
        socket.emit("streamStart", { messageId: assistantMessageId });

        let fullResponse = "";

        // Stream AI response
        await generateStreamingResponse(
          historyForAI,
          (token) => {
            socket.emit("streamToken", { token, messageId: assistantMessageId });
          },
          async (completeResponse) => {
            fullResponse = completeResponse;

            // Save assistant message
            const assistantMessage = await Message.create({
              conversationId,
              role: "assistant",
              content: completeResponse,
            });

            // Update conversation metadata
            const isFirstMessage = allMessages.length <= 1;
            let title = conversation.title;

            if (isFirstMessage || title === "New Chat") {
              title = await generateTitle(content);
            }

            await Conversation.findByIdAndUpdate(conversationId, {
              title,
              lastMessage: completeResponse.slice(0, 100),
              messageCount: allMessages.length + 2,
              updatedAt: new Date(),
            });

            socket.emit("streamEnd", {
              message: assistantMessage,
              conversationId,
              title,
            });
          },
          (error) => {
            socket.emit("streamError", { error });
          }
        );
      } catch (error) {
        console.error("Socket error:", error);
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.user?.name}`);
    });
  });
};
